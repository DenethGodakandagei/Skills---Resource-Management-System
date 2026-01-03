import Modal from "./Modal";

export type ExperienceLevel = "Junior" | "Mid-Level" | "Senior";

interface AddPersonnelModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  form: {
    name: string;
    email: string;
    role: string;
    experience_level: ExperienceLevel;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      email: string;
      role: string;
      experience_level: ExperienceLevel;
    }>
  >;
  submitPersonnel: () => void;
}

export default function AddPersonnelModal({
  open,
  setOpen,
  form,
  setForm,
  submitPersonnel,
}: AddPersonnelModalProps) {
  return (
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
          <option value="Junior">Junior</option>
          <option value="Mid-Level">Mid-Level</option>
          <option value="Senior">Senior</option>
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
  );
}
