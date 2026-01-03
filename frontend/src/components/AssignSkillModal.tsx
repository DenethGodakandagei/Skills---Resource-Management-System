import Modal from "./Modal";

interface Skill {
  id: number;
  name: string;
}

interface AssignSkillModalProps {
  assignOpen: boolean;
  setAssignOpen: (value: boolean) => void;
  skills: Skill[];
  assignForm: {
    skill_id: string;
    proficiency_level: number;
  };
  setAssignForm: React.Dispatch<
    React.SetStateAction<{
      skill_id: string;
      proficiency_level: number;
    }>
  >;
  assignSkill: () => void;
}

export default function AssignSkillModal({
  assignOpen,
  setAssignOpen,
  skills,
  assignForm,
  setAssignForm,
  assignSkill,
}: AssignSkillModalProps) {
  return (
    <Modal
      isOpen={assignOpen}
      onClose={() => setAssignOpen(false)}
      title="Assign Skill"
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
  );
}
