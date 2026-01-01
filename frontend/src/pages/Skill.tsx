import { useEffect, useState } from "react";
import api from "../api/api";

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
  });

  const [editing, setEditing] = useState<any | null>(null);

  /* LOAD */
  const load = async () => {
    const res = await api.get("/skills");
    setSkills(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  /* CREATE */
  const submit = async () => {
    if (!form.name) return;
    await api.post("/skills", form);
    setForm({ name: "", category: "", description: "" });
    load();
  };

  /* UPDATE */
  const update = async () => {
    if (!editing) return;

    await api.put(`/skills/${editing.id}`, {
      name: editing.name,
      category: editing.category,
      description: editing.description,
    });

    setEditing(null);
    load();
  };

  /* DELETE */
  const del = async (id: number) => {
    if (!confirm("Delete this skill?")) return;
    await api.delete(`/skills/${id}`);
    load();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
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
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="border px-3 py-2 rounded w-full md:w-48"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />

        <input
          className="border px-3 py-2 rounded flex-1"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <button
          onClick={submit}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Skill
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Skill</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {skills.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-400"
                >
                  No skills found
                </td>
              </tr>
            )}

            {skills.map((s) => (
              <tr
                key={s.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3 font-medium">{s.name}</td>
                <td className="p-3">{s.category}</td>
                <td className="p-3 text-gray-600">
                  {s.description}
                </td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => setEditing({ ...s })}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>

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

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              Edit Skill
            </h2>

            <div className="space-y-3">
              <input
                className="border px-3 py-2 rounded w-full"
                placeholder="Skill name"
                value={editing.name}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    name: e.target.value,
                  })
                }
              />

              <input
                className="border px-3 py-2 rounded w-full"
                placeholder="Category"
                value={editing.category}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    category: e.target.value,
                  })
                }
              />

              <textarea
                className="border px-3 py-2 rounded w-full"
                placeholder="Description"
                value={editing.description}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={update}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
