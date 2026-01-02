import { useEffect, useState } from "react";
import api from "../api/api";
import AssignedPersonnel from "./AssignedPersonnel";

/* ------------ TYPES ------------ */
interface Skill {
  skill: string;
  proficiency: number;
  required: number;
}

interface Result {
  id: number;
  name: string;
  role: string;
  skills: Skill[];
  match_score: number;
}

interface Project {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

/* ------------ COMPONENT ------------ */
export default function MatchPersonnel() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState<number | "">("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState<number | null>(null);

  /* ------------ LOAD PROJECTS ------------ */
  const loadProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* ------------ MATCH ------------ */
  const match = async () => {
    if (!projectId) return;

    setLoading(true);
    const res = await api.get(`/match/project/${projectId}`);
    setResults(res.data);
    setLoading(false);
  };

  /* ------------ ASSIGN ------------ */
  const assign = async (personnelId: number) => {
    if (!projectId) return;

    try {
      setAssigning(personnelId);

      await api.post("/assignments", {
        projectId,
        personnelId
      });

      alert("Personnel assigned successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Assignment failed");
    } finally {
      setAssigning(null);
    }
  };

  /* ------------ UI ------------ */
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Skill Matching – Personnel Finder
      </h2>

      {/* Project Selector */}
      <div className="flex gap-3 mb-6">
        <select
          className="border px-4 py-2 rounded w-72"
          value={projectId}
          onChange={e => setProjectId(Number(e.target.value))}
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <button
          onClick={match}
          disabled={!projectId}
          className={`px-5 py-2 rounded text-white ${
            projectId
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Match
        </button>
      </div>

      {loading && <p className="text-gray-500">Matching personnel...</p>}

      {!loading && results.length === 0 && projectId && (
        <p className="text-gray-500">No matching personnel found</p>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Skills</th>
                <th className="p-3 text-center">Match %</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {results.map(p => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.role}</td>

                  <td className="p-3">
                    <ul className="space-y-1">
                      {p.skills.map((s, i) => (
                        <li key={i}>
                          <b>{s.skill}</b> — {s.proficiency}
                          <span className="text-gray-500">
                            {" "} (Req {s.required})
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                      {p.match_score}%
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      onClick={() => assign(p.id)}
                      disabled={assigning === p.id}
                      className="bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700 disabled:bg-gray-400"
                    >
                      {assigning === p.id ? "Assigning..." : "Assign"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {projectId && (
      <AssignedPersonnel projectId={projectId as number} />
    )}
    </div>
  );
}
