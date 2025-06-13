import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import UserModel from '@/model/User';
import { MessageModel } from '@/model/User';

export async function POST(
  req: Request,
  context: { params: Record<string, string> }
) {
  const { params } = context;
  const username = decodeURIComponent(params.username);

  const body = await req.json();
  const content = body.content?.toString().trim();

  if (!content || content.length < 2) {
    return NextResponse.json({ error: 'Message too short' }, { status: 400 });
  }

  await dbConnect();

  const user = await UserModel.findOne({ username });
  if (!user || !user.isVerified || !user.isAcceptingMessages) {
    return NextResponse.json({ error: 'User not accepting messages' }, { status: 403 });
  }

  const message = await MessageModel.create({
    content,
    user: user._id,
  });

  (user.message as unknown as Array<typeof message._id>).push(message._id);
  await user.save();

  return NextResponse.json({ success: true });
}
