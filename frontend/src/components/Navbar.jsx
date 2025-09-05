import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("id");
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        Med Card
      </h1>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/appointments")}
          className="hover:underline"
        >
          Appointments
        </button>

        {role === "patient" && (
          <button
            onClick={() => navigate("/prescriptions")}
            className="hover:underline"
          >
            Prescriptions
          </button>
        )}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
