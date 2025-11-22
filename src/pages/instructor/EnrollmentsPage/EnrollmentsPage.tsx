import { useState, useMemo } from "react";
import EnrollmentTable from "../../../components/newDesignComponents/students/EnrollmentTable";
import {
  Student,
  Enrollment,
} from "../../../app/api/instructor/instructor.type";
import { useGetStudentsQuery } from "../../../app/api/instructor/instructorApi";
import StudentDetailsDrawer from "../../../components/newDesignComponents/studentAndEnrollment/StudentDetailsDrawer";


export default function EnrollmentsPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [globalFilter, setGlobalFilter] = useState("");
  const [perPage] = useState(10);

  const { data, isLoading } = useGetStudentsQuery({
    page: pageIndex + 1,
    per_page: perPage,
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Flatten all enrollments with student info
  const enrollments: (Enrollment & { student: Student })[] = useMemo(() => {
    if (!data) return [];
    return data.data.flatMap((student) =>
      student.enrollments.map((enrollment) => ({ ...enrollment, student }))
    );
  }, [data]);

  // Filter by student name or course title
  const filteredEnrollments = useMemo(() => {
    if (!globalFilter) return enrollments;

    return enrollments.filter((e) => {
      const studentName =
        `${e.student.first_name} ${e.student.last_name}`.toLowerCase();
      const courseTitle = e.course?.title?.toLowerCase() || "";
      const search = globalFilter.toLowerCase();
      return studentName.includes(search) || courseTitle.includes(search);
    });
  }, [enrollments, globalFilter]);

  const pageCount = data?.pagination.last_page || 1;
  const total = data?.pagination.total || 0;

  return (
    <main className="space-y-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Students & Enrollments
          </h1>
          <p className="text-sm text-gray-500">
            Manage student progress, quiz submissions, and assignments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by student or course..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm w-64 focus:ring-2 focus:ring-brand-500"
          />
          <span className="text-sm text-gray-600">{total} enrollments</span>
        </div>
      </header>

      {/* Table */}
      <EnrollmentTable
        data={filteredEnrollments}
        onViewStudentDetails={(student) => setSelectedStudent(student)}
        isLoading={isLoading}
      />

      {/* Pagination */}
      <nav className="flex justify-center gap-2 mt-6">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPageIndex(i)}
            className={`px-3 py-1 rounded-md text-sm ${
              i === pageIndex
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </nav>
      {selectedStudent && (
        <StudentDetailsDrawer
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </main>
  );
}
