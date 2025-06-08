import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbconnect';
import UserModel from '@/model/User';

export async function POST(req: Request) {
  await dbConnect();
  const { email, verifyCode } = await req.json();

  if (!email || !verifyCode) {
    return NextResponse.json(
      { success: false, message: 'Email and code are required' },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'User is already verified' },
        { status: 400 }
      );
    }

    const isCodeValid =
      user.verifyCode === verifyCode &&
      user.verifyCodeExpires > new Date();

    if (!isCodeValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification code' },
        { status: 400 }
      );
    }

    user.isVerified = true;
    user.verifyCode = undefined;
    user.verifyCodeExpires = undefined;
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Account verified successfully',
    });
  } catch (err) {
    console.error('Verification error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
