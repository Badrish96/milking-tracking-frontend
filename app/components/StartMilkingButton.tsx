'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlassWater } from '@fortawesome/free-solid-svg-icons';

export default function StartMilkingButton() {
  const router = useRouter();

  const handleStartMilking = () => {
    router.push('/milking');
  };

  return (
    <button
      onClick={handleStartMilking}
      className="w-full px-8 py-6 text-xl font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 active:scale-95 transition-all duration-200 flex items-center justify-center"
    >
      <FontAwesomeIcon icon={faGlassWater} className="mr-2 w-5 h-5" /> Start Milking
    </button>
  );
}