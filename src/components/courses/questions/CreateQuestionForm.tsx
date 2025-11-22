
import { FC, useState } from "react";
import { toast } from "react-toastify";
import { useCreateQuestionMutation } from "../../../app/api/instructor/instructorApi";

interface CreateQuestionFormProps {
  quizId: number;
  onSuccess: () => void;
}

const CreateQuestionForm: FC<CreateQuestionFormProps> = ({
  quizId,
  onSuccess,
}) => {
  const [question, setQuestion] = useState("");
  const [score, setScore] = useState(1);
  const [options, setOptions] = useState([
    { option: "", is_correct: false },
    { option: "", is_correct: false },
    { option: "", is_correct: false },
    { option: "", is_correct: false },
  ]);

  const [createQuestion, { isLoading }] = useCreateQuestionMutation();

  const handleOptionChange = (
    index: number,
    field: "option" | "is_correct",
    value: string | boolean
  ) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setOptions(newOptions);
  };

  // 🆕 Add option button
  const handleAddOption = () => {
    if (options.length >= 10) {
      toast.info("You can add up to 10 options.");
      return;
    }
    setOptions([...options, { option: "", is_correct: false }]);
  };

  // 🆕 Remove option button
  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      toast.info("A question must have at least 2 options.");
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question || options.some((o) => !o.option)) {
      toast.error("All fields are required");
      return;
    }

    try {
      await createQuestion({
        quiz_id: quizId,
        question,
        score,
        options,
      }).unwrap();
      toast.success("Question created successfully!");
      onSuccess();
    } catch {
      toast.error("Failed to create question");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Create Question</h2>

      {/* Question Field */}
      <div className="flex flex-col">
        <label
          htmlFor="question"
          className="mb-1 font-medium text-gray-700 dark:text-gray-200"
        >
          Question
        </label>
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
          className="border rounded p-2"
          required
        />
      </div>

      {/* Score Field */}
      <div className="flex flex-col">
        <label
          htmlFor="score"
          className="mb-1 font-medium text-gray-700 dark:text-gray-200"
        >
          Score
        </label>
        <input
          id="score"
          type="number"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          placeholder="Points for this question"
          className="border rounded p-2"
          min={1}
          required
        />
      </div>

      {/* Options */}
      <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="flex-1 flex flex-col">
              <label
                htmlFor={`option-${i}`}
                className="mb-1 font-medium text-gray-700 dark:text-gray-200"
              >
                Option {i + 1}
              </label>
              <input
                id={`option-${i}`}
                type="text"
                value={opt.option}
                onChange={(e) =>
                  handleOptionChange(i, "option", e.target.value)
                }
                placeholder={`Enter option ${i + 1}`}
                className="border rounded p-2 flex-1"
                required
              />
            </div>
            <label className="flex items-center gap-1 text-sm mt-6">
              <input
                type="checkbox"
                checked={opt.is_correct}
                onChange={(e) =>
                  handleOptionChange(i, "is_correct", e.target.checked)
                }
              />
              Correct
            </label>
            {/* 🆕 Remove button */}
            <button
              type="button"
              onClick={() => handleRemoveOption(i)}
              className="mt-6 px-2 py-1 text-xs border rounded hover:bg-gray-100"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* 🆕 Add Option Button */}
      <button
        type="button"
        onClick={handleAddOption}
        className="self-start bg-brand-950 px-3 py-1 rounded text-sm hover:bg-brand-700"
      >
        + Add Option
      </button>

      <button
        type="submit"
        className="bg-brand-950 hover:bg-brand-700 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Creating..." : "Create Question"}
      </button>
    </form>
  );
};

export default CreateQuestionForm;

