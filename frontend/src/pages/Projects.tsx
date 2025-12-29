import { useEffect, useState } from "react";
import api from "../api/api";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
  });

  const [requirement, setRequirement] = useState({
    skill_id: "",
    min_proficiency_level: 1,
  });

  /* LOAD DATA */
  const load = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  const loadSkills = async () => {
    const res = await api.get("/skills");
    setSkills(res.data);
  };

  useEffect(() => {
    load();
    loadSkills();
  }, []);

  /* CREATE PROJECT */
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

  /* ADD REQUIREMENT */
  const addRequirement = async () => {
    if (!requirement.skill_id) return alert("Select a skill");

    await api.post(
      `/projects/${selectedProject.id}/requirements`,
      requirement
    );

    alert("Requirement added");
    setRequirement({ skill_id: "", min_proficiency_level: 1 });
    setSelectedProject(null);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Projects</h1>
      <p className="text-sm text-gray-500 mb-6">
        Create projects and define required skills
      </p>

      {/* CREATE PROJECT */}
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
          className="bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create
        </button>
      </div>

      {/* PROJECTS TABLE */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Description</th>
              <th className="px-4 py-2 border-b">Start</th>
              <th className="px-4 py-2 border-b">End</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b font-medium">{p.name}</td>
                <td className="px-4 py-2 border-b text-gray-600">{p.description}</td>
                <td className="px-4 py-2 border-b">{p.start_date?.slice(0, 10)}</td>
                <td className="px-4 py-2 border-b">{p.end_date?.slice(0, 10)}</td>
                <td className="px-4 py-2 border-b">{p.status}</td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => setSelectedProject(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Add Requirements
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* REQUIREMENT MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded p-6">
            <h2 className="text-lg font-semibold mb-4">
              Add Requirement – {selectedProject.name}
            </h2>

            <select
              className="border w-full px-3 py-2 rounded mb-3"
              value={requirement.skill_id}
              onChange={e =>
                setRequirement({ ...requirement, skill_id: e.target.value })
              }
            >
              <option value="">Select Skill</option>
              {skills.map((s: any) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            <select
              className="border w-full px-3 py-2 rounded mb-4"
              value={requirement.min_proficiency_level}
              onChange={e =>
                setRequirement({
                  ...requirement,
                  min_proficiency_level: Number(e.target.value),
                })
              }
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>
                  Min Proficiency {n}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={addRequirement}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
