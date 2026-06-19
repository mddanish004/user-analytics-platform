import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Sessions from "./pages/Sessions";
import SessionDetails from "./pages/SessionDetails";
import Heatmap from "./pages/Heatmap";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Sessions />} />

        <Route path="/sessions/:id" element={<SessionDetails />} />

        <Route path="/heatmap" element={<Heatmap />} />
      </Routes>
    </>
  );
}

export default App;
