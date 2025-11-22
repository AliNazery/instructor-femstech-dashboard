import { FC } from "react";
import { X } from "lucide-react";
import { Student } from "../../../app/api/instructor/instructor.type";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  student: Student;
  onClose: () => void;
}

const StudentDetailsDrawer: FC<Props> = ({ student, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/40 flex justify-end z-[9999]">
        <motion.div
          initial={{ x: "100%" }} // start fully right (off-screen)
          animate={{ x: 0 }} // slide in to visible
          exit={{ x: "100%" }} // slide out to right when closed
          transition={{ duration: 0.35, ease: "easeInOut" }} // smooth timing
          className="w-full sm:w-[700px] bg-white shadow-2xl h-full overflow-y-auto rounded-l-2xl"
        >
          <div className="w-full sm:w-[700px] bg-white shadow-2xl h-full overflow-y-auto rounded-l-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Student Details
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-8 text-sm text-gray-700">
              {/* Student Info */}
              <section>
                <div className="flex gap-4 items-center mb-4">
                  <img
                    src={student.avatar_url || "/default-avatar.png"}
                    alt={student.first_name}
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                    <p
                      className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        student.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {student.status}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <Info label="Phone" value={student.phone ?? 0} />
                  <Info label="Address" value={student.address ?? ""} />
                  <Info
                    label="Joined"
                    value={new Date(student.created_at).toLocaleDateString()}
                  />
                  <Info
                    label="Updated"
                    value={new Date(student.updated_at).toLocaleDateString()}
                  />
                </div>

                {student.bio && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Bio</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {student.bio}
                    </p>
                  </div>
                )}
              </section>

              {/* Enrollments */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-3 border-b pb-1">
                  Enrollments ({student.enrollments.length})
                </h3>
                <div className="space-y-4">
                  {student.enrollments.map((enroll) => (
                    <div
                      key={enroll.id}
                      className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                    >
                      {enroll.course ? (
                        <div className="flex gap-4">
                          <img
                            src={enroll.course.thumbnail_url}
                            alt={enroll.course.title}
                            className="w-24 h-16 rounded-lg object-cover border"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {enroll.course.title}
                            </p>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {enroll.course.description}
                            </p>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                              <Info
                                label="Language"
                                value={enroll.course.language}
                              />
                              <Info label="Level" value={enroll.course.level} />
                              <Info
                                label="Price"
                                value={`$${enroll.course.price}`}
                              />
                              <Info
                                label="Progress"
                                value={`${enroll.progress_percent}%`}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">
                          Course data unavailable.
                        </p>
                      )}

                      <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs text-gray-600 gap-2 sm:gap-0">
                        {/* Enrolled date */}
                        <span className="block">
                          Enrolled:{" "}
                          {new Date(enroll.enrolled_at).toLocaleDateString()}
                        </span>

                        {/* Right side: payment + links */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1">
                            <span>Payment:</span>
                            <span
                              className={`font-semibold ${
                                enroll.payment_status === "completed"
                                  ? "text-green-600"
                                  : enroll.payment_status === "pending"
                                  ? "text-yellow-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {enroll.payment_status || "N/A"}
                            </span>
                          </span>

                          {/* Buttons stack nicely on mobile */}
                          <Link
                            to={`/instructor/assignment-answers?studentId=${student.id}`}
                            className="px-2 py-1 border rounded text-blue-600 hover:bg-blue-50 text-center w-full sm:w-auto"
                          >
                            Assignment Answers
                          </Link>

                          <Link
                            to={`/instructor/quiz-answers?studentId=${student.id}`}
                            className="px-2 py-1 border rounded text-purple-600 hover:bg-purple-50 text-center w-full sm:w-auto"
                          >
                            Quiz Answers
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Reusable info display
const Info = ({ label, value }: { label: string; value?: string | number }) => (
  <div>
    <p className="text-[13px] text-gray-500">{label}</p>
    <p className="font-medium text-gray-800 break-words">{value || "-"}</p>
  </div>
);

export default StudentDetailsDrawer;
