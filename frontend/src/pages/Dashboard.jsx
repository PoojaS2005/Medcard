import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Navbar from "../components/Navbar";
import SelectDropdown from "../components/SelectDropdown";

export default function Dashboard() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState("");
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("id");  // ✅ fix
  const navigate = useNavigate();

const handleConfirm = async () => {
  if (!selected) {
    alert("Please select someone first");
    return;
  }

  try {
    await api.post("/appointments", {
      doctorId: role === "patient" ? selected : id,
      patientId: role === "doctor" ? selected : id,
    });
    alert("Appointment created!");
  } catch (err) {
    console.error("Error creating appointment:", err.response?.data || err.message);
  }
};




useEffect(() => {
  console.log("role:", role, "id:", id, "token:", localStorage.getItem("token"));

  if (!role) {
    console.warn("No role, redirecting...");
    navigate("/");
    return;
  }

  const fetchList = async () => {
    try {
      const res = await api.get(role === "patient" ? "/doctors" : "/patients");
      console.log("Fetched list:", res.data);
      setList(res.data);
    } catch (err) {
      console.error("Error fetching data:", err.response?.data || err.message);
    }
  };

  fetchList();
}, [role]);



  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {role === "doctor" ? "Doctor Dashboard" : "Patient Dashboard"}
          </h2>

          <SelectDropdown
            label={role === "patient" ? "Doctor" : "Patient"}
            options={list}
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          />

          <button
            onClick={handleConfirm}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
