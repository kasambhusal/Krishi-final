import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function ServerNotResponding() {
  console.log("i am in servernotresponding");
  return (
    <div className="min-h-screen bg-white flex items-center justify-center absolute">
      <div className="max-w-md w-full px-6 py-8 bg-green-50 rounded-lg shadow-lg">
        <div className="flex items-center justify-center mb-8">
          <AlertTriangle className="h-16 w-16 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-center text-green-800 mb-4">
          Server Not Responding
        </h1>
        <p className="text-green-700 text-center mb-8">
          We're experiencing some technical difficulties. Our team has been
          notified and is working on the issue.
        </p>
        <div className="flex justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
