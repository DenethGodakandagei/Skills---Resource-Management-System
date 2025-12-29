import { useState } from "react";
import api from "../api/api";

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

export default function MatchPersonnel() {
  const [projectId, setProjectId] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  const match = async () => {
    if (!projectId) return;
    setLoading(true);
    const res = await api.get(`/match/project/${projectId}`);
    setResults(res.data);
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Skill Matching – Personnel Finder
      </h2>

      {/* Input */}
      <div className="flex gap-3 mb-6">
        <input
          className="border px-4 py-2 rounded w-60"
          placeholder="Project ID"
          value={projectId}
          onChange={e => setProjectId(e.target.value)}
        />
        <button
          onClick={match}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Match
        </button>
      </div>

      {/* Results */}
      {loading && <p>Matching personnel...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">No matching personnel found</p>
      )}

      {results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Skills</th>
                <th className="p-3 text-center">Match %</th>
              </tr>
            </thead>
            <tbody>
              {results.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.role}</td>
                  <td className="p-3">
                    <ul className="space-y-1">
                      {p.skills.map((s, i) => (
                        <li key={i} className="text-sm">
                          <span className="font-semibold">{s.skill}</span>{" "}
                          — {s.proficiency}
                          <span className="text-gray-500">
                            {" "} (Required {s.required})
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
