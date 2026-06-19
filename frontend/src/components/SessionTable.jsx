import { Link } from "react-router-dom";

function SessionTable({ sessions }) {
  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-5xl mb-3">📭</p>
        <p className="text-lg">No Sessions Found</p>
      </div>
    );
  }

  return (
    <table className="w-full bg-white rounded-lg overflow-hidden border border-gray-200 border-collapse">
      <thead>
        <tr>
          <th className="px-4 py-3 text-left bg-gray-100 font-semibold border-b border-gray-200">
            Session ID
          </th>
          <th className="px-4 py-3 text-left bg-gray-100 font-semibold border-b border-gray-200">
            Event Count
          </th>
          <th className="px-4 py-3 text-left bg-gray-100 font-semibold border-b border-gray-200">
            Last Activity
          </th>
          <th className="px-4 py-3 text-left bg-gray-100 font-semibold border-b border-gray-200">
            View Journey
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {sessions.map((session) => (
          <tr key={session.session_id} className="hover:bg-gray-50">
            <td className="px-4 py-3">{session.session_id}</td>
            <td className="px-4 py-3">{session.eventCount}</td>
            <td className="px-4 py-3">
              {new Date(session.lastActivity).toLocaleString()}
            </td>
            <td className="px-4 py-3">
              <Link
                to={`/sessions/${session.session_id}`}
                className="text-blue-600 hover:underline"
              >
                View Journey
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SessionTable;
