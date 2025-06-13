import UserModel, { Message } from '@/model/User';
import dbConnect from '@/lib/dbconnect';
import { MessageModel } from '@/model/User';


export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  if (!username || typeof username !== 'string') {
    return Response.json({ message: 'Username is required', success: false }, { status: 400 });
  }

  if (!content || content.trim().length < 2) {
    return Response.json({ message: 'Message too short', success: false }, { status: 400 });
  }

  try {
    const user = await UserModel.findOne({ username }).exec();

    if (!user) {
      return Response.json({ message: 'User not found', success: false }, { status: 404 });
    }

    if (!user.isAcceptingMessages || !user.isVerified) {
      return Response.json({ message: 'User not accepting messages', success: false }, { status: 403 });
    }

   const message = await MessageModel.create({
    content,
    user: user._id,
  });

  (user.message as unknown as Array<typeof message._id>).push(message._id);
  await user.save();
    return Response.json({ message: 'Message sent successfully', success: true }, { status: 201 });

  } catch (error) {
    console.error('Error adding message:', error);
    return Response.json({ message: 'Internal server error', success: false }, { status: 500 });
  }
}
