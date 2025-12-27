import { useState } from "react";
import api from "../api/api";

export default function Match() {
  const [projectId, setProjectId] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const match = async () => {
    const res = await api.get(`/match/${projectId}`);
    setResults(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Match Personnel to Project</h2>

      <input
        placeholder="Project ID"
        value={projectId}
        onChange={e => setProjectId(e.target.value)}
      />
      <button onClick={match}>Match</button>

      <ul>
        {results.map(r => (
          <li key={r.id}>
            {r.name} - {r.role} | {r.skills}
          </li>
        ))}
      </ul>
    </div>
  );
}
