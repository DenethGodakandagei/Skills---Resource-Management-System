import { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "../components/Modal";

type ExperienceLevel = "Junior" | "Mid-Level" | "Senior";

type Personnel = {
  id: number;
  name: string;
  email: string;
  role: string;
  experience_level: ExperienceLevel;
};

export default function Personnel() {
  const [list, setList] = useState<Personnel[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<{
    name: string;
    email: string;
    role: string;
    experience_level: ExperienceLevel;
  }>({
    name: "",
    email: "",
    role: "",
    experience_level: "Junior",
  });

  const load = async () => {
    const res = await api.get("/personnel");
    setList(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Validation
  const validate = () => {
    if (!form.name || !form.email || !form.role) {
      setError("All fields are required");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(form.email)) {
      setError("Invalid email address");
      return false;
    }

    setError("");
    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    await api.post("/personnel", form);
    setForm({
      name: "",
      email: "",
      role: "",
      experience_level: "Junior",
    });
    setOpen(false);
    load();
  };

  const del = async (id: number) => {
    await api.delete(`/personnel/${id}`);
    load();
  };

  const badgeColor = (level: ExperienceLevel) => {
    if (level === "Senior") return "bg-purple-100 text-purple-700";
    if (level === "Mid-Level") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Personnel Directory</h1>
          <p className="text-gray-500 text-sm">
            Manage your team and track skills
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
        >
          + Add New Personnel
        </button>
      </div>

      {/* Search */}
      <input
        placeholder="Search by name, email, or role..."
        className="w-full md:w-1/3 px-4 py-2 border rounded-md mb-4"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Experience</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list
              .filter(p =>
                `${p.name}${p.email}${p.role}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-gray-400 text-xs">{p.email}</div>
                  </td>
                  <td className="p-3">{p.role}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${badgeColor(
                        p.experience_level
                      )}`}
                    >
                      {p.experience_level}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => del(p.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Personnel">
        <div className="space-y-3">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            className="input w-full"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="input w-full"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />

          <input
            className="input w-full"
            placeholder="Role"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          />

          <select
            className="input w-full"
            value={form.experience_level}
            onChange={e =>
              setForm({
                ...form,
                experience_level: e.target.value as ExperienceLevel,
              })
            }
          >
            <option>Junior</option>
            <option>Mid-Level</option>
            <option>Senior</option>
          </select>

          <div className="flex justify-end gap-2 pt-3">
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button
              onClick={submit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
