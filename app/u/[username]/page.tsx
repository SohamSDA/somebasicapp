import dbConnect from "@/lib/dbconnect";
import UserModel from "@/model/User";
import { notFound } from "next/navigation";
import PublicFeedbackForm from "./feedbackform";

export const dynamic = "force-dynamic";

function getUsernameFromParams(params: { username: string }): string {
  return decodeURIComponent(params.username);
}

interface PageProps {
  params: {
    username: string;
  };
}

export default async function PublicFeedbackPage({ params }: PageProps) {
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
