import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [prescriptionsMap, setPrescriptionsMap] = useState({});
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointments");
        setAppointments(res.data);

        // Fetch all prescriptions once to check which patients have prescriptions
        if (role === "doctor") {
          const prescRes = await api.get("/prescriptions");
          const map = {};
          prescRes.data.forEach((p) => {
            map[p.patientId._id] = true; // mark patient as having prescription
          });
          setPrescriptionsMap(map);
        }
      } catch (err) {
        console.error("Error fetching appointments:", err.response?.data || err.message);
      }
    };

    fetchAppointments();
  }, [role]);

  const handlePrescription = (patientId) => {
    navigate(`/prescriptions?patient=${patientId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Appointments</h2>

          {appointments.length === 0 ? (
            <p className="text-gray-500 text-center">No appointments yet.</p>
          ) : (
            <ul className="space-y-2">
              {appointments.map((appt) => (
                <li
                  key={appt._id}
                  className="border p-3 rounded flex justify-between items-center"
                >
                  <div>
                    {role === "patient" ? (
                      <>
                        <p className="font-semibold">Doctor: {appt.doctorId.name}</p>
                        <p className="text-sm text-gray-500">Email: {appt.doctorId.email}</p>
                        <span className="text-gray-400 text-sm">
                          Appointment Date: {new Date(appt.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">Patient: {appt.patientId.name}</p>
                        <p className="text-sm text-gray-500">Email: {appt.patientId.email}</p>
                        <span className="text-gray-400 text-sm">
                          {new Date(appt.createdAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>

                  {role === "doctor" && (
                    <button
                      onClick={() => handlePrescription(appt.patientId._id)}
                      className={`text-white px-3 py-1 rounded ${
                        prescriptionsMap[appt.patientId._id]
                          ? "bg-blue-500 hover:bg-blue-600"   // If prescription exists → blue
                          : "bg-green-500 hover:bg-green-600" // If no prescription → green
                      }`}
                    >
                      {prescriptionsMap[appt.patientId._id] ? "View" : "Add"}
                    </button>
                  )}

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
