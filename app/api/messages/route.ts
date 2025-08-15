import { UserModel } from "@/model/User";
import dbConnect from "@/lib/dbconnect";
import { MessageModel } from "@/model/User";
import mongoose from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();

    console.log("Received message data:", { username, content });

    if (!username || typeof username !== "string") {
      return Response.json(
        { message: "Username is required", success: false },
        { status: 400 }
      );
    }

    if (!content || content.trim().length < 2) {
      return Response.json(
        { message: "Message too short", success: false },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      console.log("User not found:", username);
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    console.log("User found:", {
      username: user.username,
      isAcceptingMessages: user.isAcceptingMessages,
      isVerified: user.isVerified,
    });

    if (!user.isAcceptingMessages) {
      return Response.json(
        { message: "User is not accepting messages", success: false },
        { status: 403 }
      );
    }

    if (!user.isVerified) {
      return Response.json(
        { message: "User is not verified", success: false },
        { status: 403 }
      );
    }

    const message = await MessageModel.create({
      content: content.trim(),
      user: user._id,
    });

    console.log("Message created:", message);

    // Add the message ID to the user's message array
    user.message.push(message._id as mongoose.Types.ObjectId);
    await user.save();

    console.log("Message sent successfully");

    return Response.json(
      { message: "Message sent successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();

  const { username, messageId } = await request.json();

  if (!username || typeof username !== "string") {
    return Response.json(
      { message: "Username is required", success: false },
      { status: 400 }
    );
  }

  if (!messageId || typeof messageId !== "string") {
    return Response.json(
      { message: "Message ID is required", success: false },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ username }).exec();
    if (!user) {
      return Response.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    const message = await MessageModel.findById(messageId).exec();
    if (!message) {
      return Response.json(
        { message: "Message not found", success: false },
        { status: 404 }
      );
    }

    // Ensure message belongs to this user
    if (String(message.user) !== String(user._id)) {
      return Response.json(
        { message: "Message does not belong to this user", success: false },
        { status: 403 }
      );
    }

    // Delete the message from MessageModel
    await MessageModel.findByIdAndDelete(messageId);

    // Remove the message ID from user.messages array
    user.message = user.message.filter((id) => String(id) !== messageId);
    await user.save();

    return Response.json(
      { message: "Message deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
