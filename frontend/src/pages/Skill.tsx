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
    <div className="p-6 max-w-7xl mx-auto">
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
     {/* Table */}
<div className="bg-white rounded shadow overflow-hidden">
  <table className="w-full text-sm">
    <thead className="bg-gray-100">
      <tr>
        <th className="p-3 text-left">Skill</th>
        <th className="p-3 text-left">Category</th>
        <th className="p-3 text-left">Description</th>
        <th className="p-3 text-right">Action</th>
      </tr>
    </thead>

    <tbody>
      {skills.length === 0 && (
        <tr>
          <td colSpan={4} className="p-6 text-center text-gray-400">
            No skills found
          </td>
        </tr>
      )}

      {skills.map(s => (
        <tr
          key={s.id}
          className="border-t border-gray-200 hover:bg-gray-50"
        >
          {/* Skill Name */}
          <td className="p-3 font-medium">{s.name}</td>

          {/* Category */}
          <td className="p-3 text-gray-700">{s.category}</td>

          {/* Description */}
          <td className="p-3 text-gray-600">
            {s.description}
          </td>

          {/* Actions */}
          <td className="p-3 text-right">
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
