import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex gap-6 px-6 py-4 bg-white border-b border-gray-200">
      <Link to="/" className="font-medium text-gray-800 hover:text-blue-600">
        Sessions
      </Link>
      <Link
        to="/heatmap"
        className="font-medium text-gray-800 hover:text-blue-600"
      >
        Heatmap
      </Link>
    </nav>
  );
}

export default Navbar;
