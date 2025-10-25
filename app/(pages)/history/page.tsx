import HistoryTable from '@/app/components/HistoryTable';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSquarePollVertical, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap">
          <Link
            href="/"
            className="text-gray-600 hover:text-gray-800 font-medium flex items-center"
          >
            <FontAwesomeIcon icon={faCaretLeft} className="w-5 h-5" /> Back to Home
          </Link>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center">
            <FontAwesomeIcon icon={faSquarePollVertical} className="mr-2 w-6 h-6" /> Milking History
          </h1>
          <div className="w-24"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 py-8">
        <HistoryTable />
      </div>
    </div>
  );
}