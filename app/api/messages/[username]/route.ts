import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconnect";
import { MessageModel } from "@/model/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get messages for the logged-in user (not the username in the URL)
    const messages = await MessageModel.find({
      user: session.user._id,
    }).sort({ createdAt: -1 });

    console.log(
      `Found ${messages.length} messages for user ${session.user.username}`
    );

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
