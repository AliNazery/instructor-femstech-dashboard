import { FC, useState, Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useCreateCourseMutation } from "../../app/api/instructor/instructorApi";
import {
  isFetchBaseQueryError,
  languages,
  levels,
  publishOptions,
} from "../../Util/Validation/utility";
import { toast } from "react-toastify";

interface CreateCourseFormProps {
  onSuccess: () => void;
  instructorId: number;
  categoryId: number;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CreateCourseForm: FC<CreateCourseFormProps> = ({
  onSuccess,
  instructorId,
  categoryId,
}) => {

  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState<string>("");
  const [level, setLevel] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [isPublished, setIsPublished] = useState<string>("0");
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [createCourse, { isLoading, isError, error }] =
    useCreateCourseMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("instructor_id", instructorId.toString());
    formData.append("category_id", String(categoryId));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("language", language);
    formData.append("level", level);
    formData.append("price", price);
    formData.append("is_published", isPublished);
    if (thumbnail) {
      formData.append("thumbnail_url", thumbnail);
    }

    try {
    
       await createCourse(formData).unwrap();
      toast.success("Course created successfully!");
      onSuccess();

      // reset
      setTitle("");
      setDescription("");
      setLanguage("");
      setLevel("");
      setPrice("");
      setIsPublished("0");
      setThumbnail(null);
    } catch (err) {
      console.error("Failed to create course:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Create New Course</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Course Title"
        className="border rounded p-2"
        required
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Course Description"
        className="border rounded p-2"
        rows={3}
        required
      />

      {/* Language Dropdown */}
      <Dropdown
        label="Language"
        value={language}
        onChange={(v) => setLanguage(v ?? "")}
        options={languages}
      />

      {/* Level Dropdown */}
      <Dropdown
        label="Level"
        value={level}
        onChange={(v) => setLevel(v ?? "")}
        options={levels}
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Course Price"
        className="border rounded p-2"
        required
      />

      <Dropdown
        label="Publish Status"
        value={isPublished}
        onChange={(v) => setIsPublished(v ?? "0")}
        options={publishOptions}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
        className="border rounded p-2"
        required
      />

      {isError && (
        <p className="text-red-500 text-sm">
          {isFetchBaseQueryError(error)
            ? error.data?.message || "Something went wrong"
            : "Something went wrong"}
        </p>
      )}

      <button
        type="submit"
        className="bg-brand-950 hover:bg-brand-700 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
};

// Shared Dropdown (using HeadlessUI Listbox, same as CourseFilters)
interface Option<T> {
  value: T;
  label: string;
}

interface DropdownProps<T> {
  label: string;
  value: T | null;
  onChange: (v: T | null) => void;
  options: Option<T>[];
}

function Dropdown<T>({
  label,
  value,
  onChange,
  options,
}: Readonly<DropdownProps<T>>) {
  return (
    <div className="flex items-center gap-2 w-full">
      <label className="text-gray-600 font-medium whitespace-nowrap w-28">
        {label}:
      </label>
      <Listbox value={value} onChange={onChange}>
        {() => (
          <div className="relative flex-1">
            <ListboxButton className="relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
              <span className="block truncate">
                {options.find((o) => o.value === value)?.label || "Select..."}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
              </span>
            </ListboxButton>

            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white shadow-lg border">
                {options.map((opt) => (
                  <ListboxOption
                    key={String(opt.value)}
                    value={opt.value}
                    className={({ active }) =>
                      classNames(
                        active ? "bg-brand-950 text-white" : "text-gray-900",
                        "relative cursor-pointer select-none py-2 pl-3 pr-9"
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {opt.label}
                        </span>
                        {selected && (
                          <span className="absolute top-1/2 right-3 -translate-y-1/2 text-brand-950">
                            <CheckIcon className="h-5 w-5" />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
}

export default CreateCourseForm;
