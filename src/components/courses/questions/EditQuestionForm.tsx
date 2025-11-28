import { FC, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Question,
  QuestionOption,
} from "../../../app/api/instructor/instructor.type";
import { useUpdateQuestionMutation } from "../../../app/api/instructor/instructorApi";

type EditQuestionFormProps = {
  question: Question;
  onSuccess: () => void;
};

type EditableOption = Partial<QuestionOption> & {
  option: string;
  is_correct: number;
};

const EditQuestionForm: FC<EditQuestionFormProps> = ({
  question,
  onSuccess,
}) => {
  const [qText, setQText] = useState<string>(question.question ?? "");
  const [score, setScore] = useState<number>(Number(question.score ?? 0));

  const [options, setOptions] = useState<EditableOption[]>(
    (question.options ?? []).map((o) => ({
      id: o.id,
      question_id: o.question_id ?? question.id,
      option: o.option ?? "",
      is_correct: o.is_correct ?? 0,
    }))
  );

  const [updateQuestion, { isLoading }] = useUpdateQuestionMutation();

  const nonEmptyOptions = useMemo(
    () => options.filter((o) => (o.option ?? "").trim().length > 0),
    [options]
  );

  const addOption = () => {
    if (options.length >= 10) {
      toast.info("You can add up to 10 options.");
      return;
    }
    setOptions((prev) => [
      ...prev,
      { option: "", is_correct: 0, question_id: question.id },
    ]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) {
      toast.info("A question must have at least 2 options.");
      return;
    }
    setOptions((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateOptionText = (idx: number, value: string) => {
    setOptions((prev) =>
      prev.map((o, i) => (i === idx ? { ...o, option: value } : o))
    );
  };

  const toggleCorrect = (idx: number) => {
    setOptions((prev) =>
      prev.map((o, i) =>
        i === idx ? { ...o, is_correct: o.is_correct === 1 ? 0 : 1 } : o
      )
    );
  };

  const validate = () => {
    if (!question.quiz_id) {
      toast.error("Quiz ID is required.");
      return false;
    }
    if (!qText.trim()) {
      toast.error("Question text is required.");
      return false;
    }
    if (Number.isNaN(score) || score < 0) {
      toast.error("Score must be a non-negative number.");
      return false;
    }
    if (nonEmptyOptions.length < 2) {
      toast.error("Provide at least 2 non-empty options.");
      return false;
    }
    if (!nonEmptyOptions.some((o) => o.is_correct === 1)) {
      toast.error("Mark at least one option as correct.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const preparedOptions = nonEmptyOptions.map((o) => ({
      ...(o.id ? { id: o.id } : {}),
      question_id: question.id,
      option: (o.option ?? "").trim(),
      is_correct: Number(o.is_correct),
    }));

    const payload = {
      quiz_id: Number(question.quiz_id),
      question: qText.trim(),
      score: Number(score),
      options: preparedOptions,
    };

    try {
      await updateQuestion({ id: question.id, body: payload }).unwrap();
      toast.success("Question updated successfully!");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update question.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 min-w-[320px]">
      <h2 className="text-lg font-semibold">Edit Question</h2>

      <div className="grid grid-cols-1  gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Score</span>
          <input
            type="number"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            placeholder="Score"
            min={0}
            className="border rounded p-2"
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Question Text</span>
        <textarea
          value={qText}
          onChange={(e) => setQText(e.target.value)}
          placeholder="Enter question text"
          className="border rounded p-2 min-h-[88px]"
          required
        />
      </label>

      <div className="rounded-xl border p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold">Options</h3>
          <button
            type="button"
            onClick={addOption}
            className="text-sm px-3 py-1 rounded bg-brand-500 text-white hover:bg-brand-700"
          >
            Add option
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {options.map((opt, idx) => (
            <div
              key={opt.id ?? idx}
              className="grid grid-cols-[1fr_auto_auto] gap-2 items-center"
            >
              <input
                value={opt.option ?? ""}
                onChange={(e) => updateOptionText(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="border rounded p-2"
                aria-label={`Option ${idx + 1}`}
              />
              <label className="flex items-center gap-2 px-2">
                <input
                  type="checkbox"
                  checked={opt.is_correct === 1}
                  onChange={() => toggleCorrect(idx)}
                />
                <span className="text-sm">Correct</span>
              </label>
              <button
                type="button"
                onClick={() => removeOption(idx)}
                className="text-sm px-3 py-1 rounded border hover:bg-gray-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-brand-500 hover:bg-brand-700  text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update"}
      </button>
    </form>
  );
};

export default EditQuestionForm;
