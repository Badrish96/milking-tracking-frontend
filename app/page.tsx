import Link from 'next/link';
import StartMilkingButton from './components/StartMilkingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePollVertical, faCow } from '@fortawesome/free-solid-svg-icons';
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center flex-wrap">
            <FontAwesomeIcon icon={faCow} className="mr-2 w-12 h-12" /> Milking Tracker
          </h1>
          <p className="text-gray-600">
            Track your milking sessions with ease
          </p>
        </div>

        {/* Main Action */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <StartMilkingButton />
          
          {/* History Link */}
          <div className="pt-4 border-t border-gray-200">
            <Link 
              href="/history"
              className="inline-flex items-center justify-center w-full px-8 py-6 text-base font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
            >
              <FontAwesomeIcon icon={faSquarePollVertical} className="mr-2 w-5 h-5" /> View Milking History
            </Link>
          </div>
        </div>

        {/* Info */}
        <p className="text-sm text-gray-500">
          Start a new session or review your past records
        </p>
      </div>
    </div>
  );
}