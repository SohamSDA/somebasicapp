import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import UserModel from '@/model/User';
import { MessageModel } from '@/model/User';

export async function POST(req: Request, context: Promise<{ params: { username: string } }>) {
  const { params } = await context; // ✅ Await the context
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

  user.message.push(message._id as any);
  await user.save();

  return NextResponse.json({ success: true });
}
