import { useEffect, useState } from "react";
import api from "../api/api";

export default function AssignedPersonnel({ projectId }: { projectId: number }) {
  const [people, setPeople] = useState<any[]>([]);

  useEffect(() => {
    if (!projectId) return;

    api.get(`/assignments/project/${projectId}`)
      .then(res => setPeople(res.data));
  }, [projectId]);

  if (people.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded shadow p-4">
      <h3 className="font-semibold mb-2">Assigned Personnel</h3>

      <ul className="space-y-1 text-sm">
        {people.map(p => (
          <li key={p.id}>
            {p.name} — <span className="text-gray-500">{p.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
