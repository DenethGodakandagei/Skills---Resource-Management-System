import { useEffect, useState } from "react";
import api from "../api/api";

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", category: "", description: "" });

  const load = async () => {
    const res = await api.get("/skills");
    setSkills(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    await api.post("/skills", form);
    setForm({ name: "", category: "", description: "" });
    load();
  };

  const del = async (id: number) => {
    await api.delete(`/skills/${id}`);
    load();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Skill Catalog</h1>
      <p className="text-sm text-gray-500 mb-6">
        Manage skills and categories
      </p>

      {/* Add Skill */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="border px-3 py-2 rounded w-full md:w-48"
          placeholder="Skill name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border px-3 py-2 rounded w-full md:w-48"
          placeholder="Category"
          value={form.category}
          onChange={e => setForm({ ...form, category: e.target.value })}
        />

        <input
          className="border px-3 py-2 rounded flex-1"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <button
          onClick={submit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Skill
        </button>
      </div>

      {/* Skills Table */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-2 border-b">Skill Name</th>
              <th className="text-left px-4 py-2 border-b">Category</th>
              <th className="text-left px-4 py-2 border-b">Description</th>
              <th className="text-left px-4 py-2 border-b">Action</th>
            </tr>
          </thead>

          <tbody>
            {skills.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-400">
                  No skills found
                </td>
              </tr>
            )}

            {skills.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{s.name}</td>
                <td className="px-4 py-2 border-b">{s.category}</td>
                <td className="px-4 py-2 border-b text-gray-600">
                  {s.description}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => del(s.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
