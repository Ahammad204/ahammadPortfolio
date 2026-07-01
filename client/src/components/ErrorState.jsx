import { AlertCircle } from 'lucide-react';

/** @param {{ message?: string }} props */
export default function ErrorState({ message = 'Something went wrong' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
      <p className="text-lg">{message}</p>
    </div>
  );
}
