import { useEffect, useState } from "react";
import { getSessions, getStats } from "../services/api";
import SessionTable from "../components/SessionTable";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [sessionsData, statsData] = await Promise.all([
          getSessions(),
          getStats(),
        ]);
        setSessions(sessionsData.data);
        setStats(statsData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-7">
      <h1 className="text-2xl font-bold mb-6">Sessions</h1>
      {stats && (
        <div className="flex gap-4 mb-7">
          <StatCard label="Total Sessions" value={stats.totalSessions} />
          <StatCard label="Total Events" value={stats.totalEvents} />
          <StatCard label="Total Clicks" value={stats.totalClicks} />
        </div>
      )}
      <SessionTable sessions={sessions} />
    </div>
  );
}

export default Sessions;
