// components/SectionLoader.tsx
import { FaSpinner } from 'react-icons/fa';

export default function SectionLoader() {
  return (
    <div className="w-full h-full min-h-[60vh] flex items-center justify-center">
      <FaSpinner className="text-4xl text-blue-600 animate-spin" />
    </div>
  );
}
