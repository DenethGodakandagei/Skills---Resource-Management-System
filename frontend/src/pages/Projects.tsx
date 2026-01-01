import { useEffect, useState } from "react";
import api from "../api/api";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [requirements, setRequirements] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [editProject, setEditProject] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "Planning",
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

  const loadRequirements = async (id: number) => {
    const res = await api.get(`/projects/${id}/requirements`);
    setRequirements(res.data);
  };

  useEffect(() => {
    load();
    loadSkills();
  }, []);

  /* VALIDATION */
  const isDateInvalid =
    !!(form.start_date &&
    form.end_date &&
    form.start_date > form.end_date);

  /* CREATE / UPDATE */
  const submit = async () => {
    if (!form.name.trim()) {
      return alert("Project name is required");
    }

    if (isDateInvalid) {
      return alert("End date cannot be before start date");
    }

    try {
      if (editProject) {
        await api.put(`/projects/${editProject.id}`, form);
        setEditProject(null);
      } else {
        await api.post("/projects", form);
      }

      setForm({
        name: "",
        description: "",
        start_date: "",
        end_date: "",
        status: "Planning",
      });

      load();
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }
  };

  /* DELETE */
  const del = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  /* ADD REQUIREMENT */
  const addRequirement = async () => {
    if (!requirement.skill_id) {
      return alert("Please select a skill");
    }

    await api.post(
      `/projects/${selectedProject.id}/requirements`,
      requirement
    );

    setRequirement({ skill_id: "", min_proficiency_level: 1 });
    loadRequirements(selectedProject.id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-1">Projects</h1>
      <p className="text-sm text-gray-500 mb-6">
        Create projects and define required skills
      </p>

      {/* CREATE / EDIT */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Project name *"
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
          className={`border px-3 py-2 rounded ${
            isDateInvalid ? "border-red-500" : ""
          }`}
          value={form.start_date}
          onChange={e => setForm({ ...form, start_date: e.target.value })}
        />

        <input
          type="date"
          className={`border px-3 py-2 rounded ${
            isDateInvalid ? "border-red-500" : ""
          }`}
          value={form.end_date}
          onChange={e => setForm({ ...form, end_date: e.target.value })}
        />

        <select
          className="border px-3 py-2 rounded"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option>Planning</option>
          <option>Active</option>
          <option>Completed</option>
        </select>

        <button
          onClick={submit}
          disabled={isDateInvalid}
          className={`rounded text-white ${
            isDateInvalid
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600"
          }`}
        >
          {editProject ? "Update" : "Create"}
        </button>
      </div>

      {isDateInvalid && (
        <p className="text-sm text-red-500 mb-4">
          End date cannot be earlier than start date
        </p>
      )}

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Project</th>
              <th className="p-3 text-left">Duration</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-xs">
                  {p.start_date?.slice(0, 10)} → {p.end_date?.slice(0, 10)}
                </td>
                <td className="p-3">{p.status}</td>
                <td className="p-3 text-right space-x-3">
                  <button
                    onClick={() => {
                      setEditProject(p);
                      setForm({
                        name: p.name,
                        description: p.description || "",
                        start_date: p.start_date
                          ? p.start_date.slice(0, 10)
                          : "",
                        end_date: p.end_date
                          ? p.end_date.slice(0, 10)
                          : "",
                        status: p.status,
                      });
                    }}
                    className="text-green-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProject(p);
                      loadRequirements(p.id);
                    }}
                    className="text-blue-600"
                  >
                    Requirements
                  </button>

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

      {/* REQUIREMENTS MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl shadow">
            <div className="p-4 border-b">
              <h2 className="font-semibold">
                Requirements – {selectedProject.name}
              </h2>
            </div>

            <div className="p-4 space-y-3">
              {requirements.map(r => (
                <div key={r.id} className="text-sm">
                  {r.skill} – Min {r.min_proficiency_level}
                </div>
              ))}

              <select
                className="border w-full px-3 py-2 rounded"
                value={requirement.skill_id}
                onChange={e =>
                  setRequirement({ ...requirement, skill_id: e.target.value })
                }
              >
                <option value="">Select Skill</option>
                {skills.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <select
                className="border w-full px-3 py-2 rounded"
                value={requirement.min_proficiency_level}
                onChange={e =>
                  setRequirement({
                    ...requirement,
                    min_proficiency_level: Number(e.target.value),
                  })
                }
              >
                {[1, 2, 3, 4, 5].map(n => (
                  <option key={n}>Level {n}</option>
                ))}
              </select>
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setSelectedProject(null)}
                className="border px-4 py-2 rounded"
              >
                Close
              </button>
              <button
                onClick={addRequirement}
                className="bg-blue-600 text-white px-4 py-2 rounded"
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
