// model/User.ts

import mongoose, { Document, Schema } from "mongoose";

/* ---------- Message Schema ---------- */
export interface Message extends Document {
  content: string;
  createdAt: Date;
  user: mongoose.Types.ObjectId;
}

const MessageSchema = new Schema<Message>({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

/* ---------- User Schema ---------- */
export interface User extends Document {
  username: string;
  password: string;
  email: string;
  verifyCode: string;
  verifyCodeExpires: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  message: mongoose.Types.ObjectId[];
}

const UserSchema = new Schema<User>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please enter a valid email address"],
  },
  verifyCode: { type: String, required: true },
  verifyCodeExpires: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  message: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

// ✅ Use named exports only
export const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", MessageSchema);
