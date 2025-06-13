import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbconnect';
import { MessageModel } from '@/model/User';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const messages = await MessageModel.find({
    user: session.user._id,
  }).sort({ createdAt: -1 });

  return NextResponse.json({ messages });
}
