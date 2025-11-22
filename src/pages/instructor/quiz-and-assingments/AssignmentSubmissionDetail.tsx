import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useGetAssignmentAnswersQuery } from "../../../app/api/instructor/instructorApi";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import { ArrowLeft } from "lucide-react";

export default function AssignmentSubmissionDetail() {
  const navigate = useNavigate();
  const { submissionId } = useParams<{ submissionId: string }>();
  const location = useLocation();
  const submissionFromState = location.state?.submission;

  const { data: response, isLoading } = useGetAssignmentAnswersQuery(
    submissionFromState
      ? { assignment_id: submissionFromState.assignment_id }
      : { assignment_id: Number(submissionId) }
  );

  const submission =
    submissionFromState ??
    response?.data?.find((d) => d.id === Number(submissionId));

  // Handle loading & error states more gracefully
  if (isLoading)
    return (
      <main className="p-10 flex justify-center">
        <div className="animate-pulse text-gray-500">Loading submission...</div>
      </main>
    );

  if (!submission)
    return (
      <main className="p-10 text-center text-gray-500">
        Submission not found.
      </main>
    );

  const { assignment, student, title, description, submitted_at } = submission;

  return (
    <main className=" space-y-6">
      <PageLayoutSection
        title="Submission Details"
        description="Review the student's submission and assignment information."
        action={
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 justify-center bg-brand-950 px-4 py-2 text-white rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        }
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column: Assignment & Student Info */}
          <div className="space-y-6">
            <InfoCard
              title="Assignment Information"
              items={[
                { label: "Title", value: assignment.title },
                { label: "Description", value: assignment.description },
                {
                  label: "Due Date",
                  value: new Date(
                    assignment.expiration_date
                  ).toLocaleDateString(),
                },
              ]}
            />
            <InfoCard
              title="Student Information"
              items={[
                {
                  label: "Name",
                  value: `${student.first_name} ${student.last_name}`,
                },
                { label: "Email", value: student.email },
              ]}
            />
          </div>

          {/* Right Column: Submission Content */}
          <div className="space-y-6">
            <InfoCard
              title="Submission Content"
              items={[
                { label: "Title", value: title },
                { label: "Description", value: description },
                {
                  label: "Submitted At",
                  value: new Date(submitted_at).toLocaleString(),
                },
              ]}
              highlight
            />
          </div>
        </div>
      </PageLayoutSection>
    </main>
  );
}

function InfoCard({
  title,
  items,
  highlight = false,
}: Readonly<{
  title: string;
  items: { label: string; value: string }[];
  highlight?: boolean;
}>) {
  return (
    <div
      className={`p-5 rounded-2xl border dark:border-neutral-700 shadow-sm transition
      ${
        highlight
          ? "bg-brand-50 dark:bg-brand-950/30"
          : "bg-gray-50 dark:bg-neutral-800/40"
      }`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {item.label}:
            </span>{" "}
            <span className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
