import dbConnect from '@/lib/dbconnect';
import UserModel from '@/model/User';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';

export const dynamicSetting = 'force-dynamic';

// Lazy load your client component to avoid bundling issues
const PublicFeedbackForm = dynamic(() => import('./feedbackform'), { ssr: false });

export default async function PublicFeedbackPage({ params }: any) {
  const username = decodeURIComponent(params.username);

  await dbConnect();

  const user = await UserModel.findOne({ username }).lean();
  if (!user || !user.isVerified) notFound();

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        {user.isAcceptingMessages ? (
          <PublicFeedbackForm username={username} />
        ) : (
          <p className="text-center text-red-600">
            This user is not accepting messages.
          </p>
        )}
      </div>
    </main>
  );
}
