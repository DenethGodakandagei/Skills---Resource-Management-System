import { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "../components/Modal";

/* ---------------- TYPES ---------------- */
type ExperienceLevel = "Junior" | "Mid-Level" | "Senior";

type Personnel = {
  id: number;
  name: string;
  email: string;
  role: string;
  experience_level: ExperienceLevel;
};

type Skill = {
  id: number;
  name: string;
};

type AssignedSkill = {
  id: number;
  name: string;
  proficiency_level: number;
};

/* ---------------- COMPONENT ---------------- */
export default function Personnel() {
  const [list, setList] = useState<Personnel[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [personnelSkills, setPersonnelSkills] = useState<
    Record<number, AssignedSkill[]>
  >({});
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    experience_level: "Junior" as ExperienceLevel,
  });

  const [assignForm, setAssignForm] = useState({
    skill_id: "",
    proficiency_level: 3,
  });

  /* ---------------- LOAD DATA ---------------- */
  const loadPersonnel = async () => {
    const res = await api.get("/personnel");
    setList(res.data);
  };

  const loadSkills = async () => {
    const res = await api.get("/skills");
    setSkills(res.data);
  };

  const loadPersonnelSkills = async (id: number) => {
    const res = await api.get(`/personnel/${id}/skills`);
    setPersonnelSkills((prev) => ({ ...prev, [id]: res.data }));
  };

  useEffect(() => {
    loadPersonnel();
    loadSkills();
  }, []);

  /* ---------------- ACTIONS ---------------- */
  const submitPersonnel = async () => {
    if (editMode && editingId) {
      // UPDATE
      await api.put(`/personnel/${editingId}`, form);
    } else {
      // CREATE
      await api.post("/personnel", form);
    }

    setOpen(false);
    setEditMode(false);
    setEditingId(null);
    setForm({
      name: "",
      email: "",
      role: "",
      experience_level: "Junior",
    });

    loadPersonnel();
  };

  const deletePersonnel = async (id: number) => {
    await api.delete(`/personnel/${id}`);
    loadPersonnel();
  };

  const toggleExpand = async (id: number) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      await loadPersonnelSkills(id);
    }
  };

  const openAssignSkill = (p: Personnel) => {
    setSelectedPersonnel(p);
    setAssignOpen(true);
  };

  const assignSkill = async () => {
    if (!selectedPersonnel) return;

    await api.post(`/personnel/${selectedPersonnel.id}/skills`, {
      skill_id: assignForm.skill_id,
      proficiency_level: assignForm.proficiency_level,
    });

    setAssignOpen(false);
    setAssignForm({ skill_id: "", proficiency_level: 3 });
    loadPersonnelSkills(selectedPersonnel.id);
  };

  const badgeColor = (level: ExperienceLevel) => {
    if (level === "Senior") return "bg-purple-100 text-purple-700";
    if (level === "Mid-Level") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };
  const openEditPersonnel = (p: Personnel) => {
    setForm({
      name: p.name,
      email: p.email,
      role: p.role,
      experience_level: p.experience_level,
    });
    setEditingId(p.id);
    setEditMode(true);
    setOpen(true);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6  mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Personnel Directory</h1>
          <p className="text-sm text-gray-500">
            Manage personnel and assigned skills
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Personnel
        </button>
      </div>

      {/* Search */}
      <input
        className="w-full md:w-1/3 mb-4 px-3 py-2 border border-gray-400 rounded"
        placeholder="Search personnel..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Experience</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list
              .filter((p) =>
                `${p.name}${p.email}${p.role}`
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((p) => (
                <>
                  <tr key={p.id} className="border-t border-gray-200">
                    <td className="p-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-gray-400">{p.email}</div>
                    </td>
                    <td className="p-3">{p.role}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${badgeColor(
                          p.experience_level
                        )}`}
                      >
                        {p.experience_level}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-3">
                      <button
                        onClick={() => toggleExpand(p.id)}
                        className="text-gray-600"
                      >
                        {expanded === p.id ? "Hide Skills" : "View Skills"}
                      </button>

                      <button
                        onClick={() => openAssignSkill(p)}
                        className="text-blue-600"
                      >
                        Assign
                      </button>

                      <button
                        onClick={() => openEditPersonnel(p)}
                        className="text-green-600"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deletePersonnel(p.id)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {/* Skills Row */}
                  {expanded === p.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={4} className="p-4">
                        {personnelSkills[p.id]?.length === 0 ? (
                          <p className="text-gray-400 text-sm">
                            No skills assigned
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {personnelSkills[p.id]?.map((s) => (
                              <span
                                key={s.id}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                              >
                                {s.name} · Level {s.proficiency_level}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
          </tbody>
        </table>
      </div>

      {/* ADD PERSONNEL MODAL */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Personnel">
        <div className="space-y-3">
          <input
            className="input w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input w-full"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <select
            className="input w-full"
            value={form.experience_level}
            onChange={(e) =>
              setForm({
                ...form,
                experience_level: e.target.value as ExperienceLevel,
              })
            }
          >
            <option>Junior</option>
            <option>Mid-Level</option>
            <option>Senior</option>
          </select>

          <div className="flex justify-end gap-2">
            <button onClick={() => setOpen(false)}>Cancel</button>
            <button
              onClick={submitPersonnel}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      </Modal>

      {/* ASSIGN SKILL MODAL */}
      <Modal
        isOpen={assignOpen}
        onClose={() => setAssignOpen(false)}
        title={`Assign Skill`}
      >
        <div className="space-y-4">
          <select
            className="input w-full"
            value={assignForm.skill_id}
            onChange={(e) =>
              setAssignForm({ ...assignForm, skill_id: e.target.value })
            }
          >
            <option value="">Select Skill</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="input w-full"
            value={assignForm.proficiency_level}
            onChange={(e) =>
              setAssignForm({
                ...assignForm,
                proficiency_level: Number(e.target.value),
              })
            }
          >
            {[1, 2, 3, 4, 5].map((l) => (
              <option key={l} value={l}>
                Level {l}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2">
            <button onClick={() => setAssignOpen(false)}>Cancel</button>
            <button
              onClick={assignSkill}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Assign
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
