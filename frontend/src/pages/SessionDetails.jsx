import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSessionById } from "../services/api";
import Timeline from "../components/Timeline";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function SessionDetails() {
  const { id } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getSessionById(id);
        setEvents(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-6xl mx-auto px-6 py-7">
      <h1 className="text-2xl font-bold mb-2">Session Journey</h1>
      <p className="text-sm text-gray-500 mb-5 break-all">Session: {id}</p>
      <Timeline events={events} />
    </div>
  );
}

export default SessionDetails;
