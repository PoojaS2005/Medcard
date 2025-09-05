import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../api";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState(null);
  const role = localStorage.getItem("role");

  const location = useLocation();
  const patientId = new URLSearchParams(location.search).get("patient");

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("/prescriptions");
      // Filter prescriptions for this patient
      setPrescriptions(res.data.filter(p => p.patientId._id === patientId));
      // Reset form
      setDiagnosis("");
      setNotes("");
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [patientId]);

  const handleSave = async () => {
    if (!diagnosis) return alert("Diagnosis is required");

    try {
      if (editingId) {
        await api.put(`/prescriptions/${editingId}`, { diagnosis, notes });
      } else {
        await api.post("/prescriptions", { patientId, diagnosis, notes });
      }
      fetchPrescriptions(); // Reload list
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setDiagnosis(p.diagnosis);
    setNotes(p.notes || "");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this prescription?")) return;
    try {
      await api.delete(`/prescriptions/${id}`);
      fetchPrescriptions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Prescriptions</h2>

          {role === "doctor" && (
            <div className="mb-6 border-b pb-4">
              <p className="font-semibold mb-2">Patient ID: {patientId}</p>
              <input
                type="text"
                placeholder="Diagnosis"
                className="w-full p-2 border rounded mt-2"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
              />
              <textarea
                placeholder="Notes"
                className="w-full p-2 border rounded mt-2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <button
                onClick={handleSave}
                className="mt-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          )}

          <div>
            {prescriptions.length === 0 ? (
              <p className="text-gray-500">No prescriptions yet.</p>
            ) : (
              <ul className="space-y-2">
                {prescriptions.map((p) => (
                  <li
                    key={p._id}
                    className="border p-3 rounded flex justify-between items-center"
                  >
                    <div>
                      {role === "doctor" && <p className="font-semibold">Patient: {p.patientId.name}</p>}
                      {role === "patient" && <p className="font-semibold">Doctor: {p.doctorId.name}</p>}
                      <p className="text-sm">Diagnosis: {p.diagnosis}</p>
                      {p.notes && <p className="text-sm text-gray-500">Notes: {p.notes}</p>}
                    </div>
                    {role === "doctor" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
