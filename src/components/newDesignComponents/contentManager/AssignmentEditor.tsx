import { useState } from "react";

export default function AssignmentEditor() {
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");

  return (
    <div className="space-y-3 border p-3 rounded-md bg-neutral-100">
      <h4 className="font-semibold">Assignment</h4>
      <div>
        <label className="block text-xs font-medium">Instructions</label>
        <textarea
          className="mt-1 block w-full px-2 py-1 border rounded-md"
          rows={4}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Describe the assignment"
        />
      </div>
      <div>
        <label className="block text-xs font-medium">Due Date</label>
        <input
          type="datetime-local"
          className="mt-1 block w-full px-2 py-1 border rounded-md"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
    </div>
  );
}
