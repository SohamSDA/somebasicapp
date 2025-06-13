import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { AcceptingMessagesToggle } from "@/helpers/acceptingMessagesToggle";
import  CopyButton  from "@/helpers/copyButton";
import dbConnect from "@/lib/dbconnect";
import { MessageModel } from "@/model/User"; // or from '@/model/Message' if separated

async function getMessages(userId: string) {
  await dbConnect();
  return await MessageModel.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    redirect("/sign-in");
  }

  const { _id, username } = session.user;
  const messages = await getMessages(_id);
  const feedbackLink = `${process.env.NEXTAUTH_URL}/u/${username}`;

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Welcome Section */}
        <section>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {username} 🎉
          </h1>
          <p className="text-gray-600 mt-2">
            This is your dashboard. Manage your anonymous feedback below.
          </p>
          <AcceptingMessagesToggle initial={session.user.isAcceptingMessages} />
        </section>

        {/* Feedback Link */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Your Feedback Link
          </h2>
          <CopyButton text={feedbackLink} />

          <p className="text-sm text-gray-500 mt-1">
            Share this link to collect anonymous messages.
          </p>
        </section>

        {/* Messages Section */}
        <section className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Received Messages
          </h2>

          {messages.length === 0 ? (
            <p className="text-gray-500 italic">
              You haven’t received any messages yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {messages.map((msg: any, idx: number) => (
                <li
                  key={idx}
                  className="border border-gray-100 rounded-lg bg-gray-50 p-4 shadow-sm"
                >
                  <p className="text-gray-800 whitespace-pre-line">
                    {msg.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
