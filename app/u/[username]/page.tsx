import dbConnect from '@/lib/dbconnect';
import UserModel from '@/model/User';
import { notFound } from 'next/navigation';
import PublicFeedbackForm from './feedbackform';

export const dynamic = 'force-dynamic';

export default async function PublicFeedbackPage({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username); // 🛡️ Ensure encoded usernames work
  await dbConnect();

  const user = await UserModel.findOne({ username }).lean(); // 🧠 Use .lean() for better perf if no Mongoose methods are needed
  if (!user || !user.isVerified) notFound();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {user.isAcceptingMessages ? (
          <PublicFeedbackForm username={username} />
        ) : (
          <p className="text-center text-red-600">This user is not accepting messages.</p>
        )}
      </div>
    </main>
  );
}
