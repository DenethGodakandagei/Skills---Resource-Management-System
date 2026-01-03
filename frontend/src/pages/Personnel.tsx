import { useEffect, useState } from "react";
import api from "../api/api";

import AddPersonnelModal, {
  type ExperienceLevel,
} from "../components/AddPersonnelModal";

import AssignSkillModal from "../components/AssignSkillModal";


/* ---------------- TYPES ---------------- */
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

  const [search, setSearch] = useState("");

  /* ---- MODALS ---- */
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] =
    useState<Personnel | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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
      await api.put(`/personnel/${editingId}`, form);
    } else {
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

    await api.post(`/personnel/${selectedPersonnel.id}/skills`, assignForm);

    setAssignOpen(false);
    setAssignForm({ skill_id: "", proficiency_level: 3 });
    loadPersonnelSkills(selectedPersonnel.id);
  };

  const openEditPersonnel = (p: Personnel) => {
    setForm(p);
    setEditingId(p.id);
    setEditMode(true);
    setOpen(true);
  };

  const badgeColor = (level: ExperienceLevel) =>
    level === "Senior"
      ? "bg-purple-100 text-purple-700"
      : level === "Mid-Level"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 max-w-7xl mx-auto">
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
        className="w-full md:w-1/3 mb-4 px-3 py-2 border rounded"
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
              .filter(
                (p) =>
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
                      <span className={`px-2 py-1 rounded-full text-xs ${badgeColor(
                        p.experience_level
                      )}`}>
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

      {/* MODALS */}
      <>
        <AddPersonnelModal
          open={open}
          setOpen={setOpen}
          form={form}
          setForm={setForm}
          submitPersonnel={submitPersonnel}
        />

        <AssignSkillModal
          assignOpen={assignOpen}
          setAssignOpen={setAssignOpen}
          skills={skills}
          assignForm={assignForm}
          setAssignForm={setAssignForm}
          assignSkill={assignSkill}
        />
      </>
    </div>
  );
}
