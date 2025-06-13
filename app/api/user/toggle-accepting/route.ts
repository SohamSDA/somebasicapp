import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbconnect';
import UserModel from '@/model/User';

export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?._id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  const user = await UserModel.findById(session.user._id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  user.isAcceptingMessages = !user.isAcceptingMessages;
  await user.save();

  return NextResponse.json({
    success: true,
    isAcceptingMessages: user.isAcceptingMessages,
  });
}
