import { useEffect, useState } from "react";
import api from "../api/api";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const load = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!form.name) return alert("Project name is required");

    await api.post("/projects", {
      ...form,
      status: "Planning",
    });

    setForm({
      name: "",
      description: "",
      start_date: "",
      end_date: "",
    });

    load();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Projects</h1>
      <p className="text-sm text-gray-500 mb-6">
        Create and manage consultancy projects
      </p>

      {/* Create Project Form */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Project name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="border px-3 py-2 rounded"
          placeholder="Description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={form.start_date}
          onChange={e => setForm({ ...form, start_date: e.target.value })}
        />

        <input
          type="date"
          className="border px-3 py-2 rounded"
          value={form.end_date}
          onChange={e => setForm({ ...form, end_date: e.target.value })}
        />

        <button
          onClick={submit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* Projects Table */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border-b text-left">Name</th>
              <th className="px-4 py-2 border-b text-left">Description</th>
              <th className="px-4 py-2 border-b text-left">Start</th>
              <th className="px-4 py-2 border-b text-left">End</th>
              <th className="px-4 py-2 border-b text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-400">
                  No projects found
                </td>
              </tr>
            )}

            {projects.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b font-medium">{p.name}</td>
                <td className="px-4 py-2 border-b text-gray-600">{p.description}</td>
                <td className="px-4 py-2 border-b">
                  {p.start_date?.slice(0, 10)}
                </td>
                <td className="px-4 py-2 border-b">
                  {p.end_date?.slice(0, 10)}
                </td>
                <td className="px-4 py-2 border-b">
                  <span className="px-2 py-1 text-xs rounded bg-gray-100">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
