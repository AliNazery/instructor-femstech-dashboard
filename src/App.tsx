import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addInstructor } from "./app/features/instructorSlice";
import { useGetInstructorMeQuery } from "./app/api/instructor/instructorApi";
import Cookies from "js-cookie";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
// Auth Pages
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
// Dashboard Pages
import Home from "./pages/Dashboard/Home";
import UserProfiles from "./pages/UserProfiles";
// Fallback
import NotFound from "./pages/OtherPage/NotFound";
import ProtectedRoute from "./ProtectedRroute";

import PublishedCoursesPage from "./pages/instructor/PublishedCoursesPage/PublishedCoursesPage";
import DraftCoursesPage from "./pages/instructor/DraftCoursesPage/DraftCoursesPage";
import CourseContentPage from "./pages/instructor/CourseContentPage/CourseContentPage";
import EnrollmentsPage from "./pages/instructor/EnrollmentsPage/EnrollmentsPage";
import EarningsPage from "./pages/instructor/EarningsPage/EarningsPage";
import AnnouncementsPage from "./pages/instructor/AnnouncementsPage/AnnouncementsPage";
import QuizzesPage from "./pages/instructor/quiz-and-assingments/QuizzesPage";
import AssignmentsPage from "./pages/instructor/quiz-and-assingments/AssignmentsPage";
import CourseContentDetail from "./pages/instructor/CourseContentPage/CourseContentDetail";
import ReviewCoursesPage from "./pages/instructor/ReviewsPage/ReviewCoursesPage";
import ReviewsDetails from "./pages/instructor/ReviewsPage/ReviewDetails";
import AnnouncementsDetail from "./pages/instructor/AnnouncementsPage/AnnouncementsDetail";
import AssignmentSubmissionsPage from "./pages/instructor/quiz-and-assingments/AssignmentSubmissionsPage";
import AssignmentSubmissionDetail from "./pages/instructor/quiz-and-assingments/AssignmentSubmissionDetail";
import QuizQuestions from "./pages/instructor/quiz-and-assingments/QuizQuestionsPage";
import QuizQuestionsPage from "./pages/instructor/quiz-and-assingments/QuizQuestionsPage";
import QuizAnswersPage from "./pages/instructor/quiz-and-assingments/QuizAnswersPage";
import MyCoursesPage from "./pages/instructor/CoursesPage/MyCoursesPage";
import CourseCategories from "./pages/instructor/CourseContentPage/CourseCategories";
import StudentQuizAnswersPage from "./pages/instructor/studentQuizAnswerPage.tsx/StudentQuizAnswersPage";
import PopularCoursesPage from "./pages/Dashboard/PopularCoursesPage";
import AllEnrollmentsPage from "./pages/Dashboard/AllEnrollmentsPage";
import AllReviewsPage from "./pages/Dashboard/AllReviewsPage";
import InstructorNotificationsPage from "./pages/instructor/notifications/NotificationsPage";
import StudentAssignmentAnswerPage from "./pages/instructor/StudentAssignmentAnswer/StudentAssignmentAnswerPage";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import ResetPassword from "./pages/AuthPages/ResetPassword";

export default function App() {
  const dispatch = useDispatch();
  const token = Cookies.get("instructor_token");
  const { data, isSuccess, isLoading } = useGetInstructorMeQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess && data?.data) {
      dispatch(addInstructor(data.data));
    }
  }, [data, isSuccess, dispatch]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes */}
        <Route index element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected Dashboard Layout */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Pages */}
          <Route path="/instructor/home" element={<Home />} />
          <Route
            path="/instructor/popular-courses"
            element={<PopularCoursesPage />}
          />
          <Route
            path="/instructor/all-enrollments"
            element={<AllEnrollmentsPage />}
          />
          <Route path="/instructor/reviews" element={<AllReviewsPage />} />
          <Route
            path="/instructor/courses/my-courses"
            element={<MyCoursesPage />}
          />
          <Route
            path="/instructor/courses/published"
            element={<PublishedCoursesPage />}
          />
          <Route
            path="/instructor/courses/drafts"
            element={<DraftCoursesPage />}
          />
          {/* 2. course content detail quiz detail */}
          <Route
            path="/instructor/course/content/:courseId/quiz"
            element={<QuizzesPage />}
          />
          {/* 2. course content detail quiz questions: */}
          <Route
            path="/instructor/course/content/quizzes/:quizId/questions"
            element={<QuizQuestionsPage />}
          />
          {/* 2. course content detail quiz question answers: */}
          <Route
            path="/instructor/course/content/quizzes/:quizId/answers"
            element={<QuizAnswersPage />}
          />
          {/* 2. course content detail assignment: */}
          <Route
            path="/instructor/course/content/:courseId/assignment"
            element={<AssignmentsPage />}
          />
          {/* 2. course content detail assignment answer: */}
          <Route
            path="/instructor/course/content/assignment/:assignmentId/submissions"
            element={<AssignmentSubmissionsPage />}
          />
          {/* 2. course content detail assignment answer detail or submission */}
          <Route
            path="/instructor/course/content/assignment/assignment-submissions/:submissionId"
            element={<AssignmentSubmissionDetail />}
          />
          {/* 2. course content detail anouncement */}
          <Route
            path="/instructor/course/content/:courseId/announcements"
            element={<AnnouncementsDetail />}
          />
          {/* 3, the course content categories */}
          <Route
            path="/instructor/course/content/categories"
            element={<CourseCategories />}
          />
          {/* 3, the course content category courses: */}
          <Route
            path="/instructor/course/content/categories/:categoryId/courses"
            element={<CourseContentPage />}
          />
          {/* 4, student and enrollments */}
          <Route path="/instructor/enrollments" element={<EnrollmentsPage />} />
          <Route
            path="/instructor/reviews/courses"
            element={<ReviewCoursesPage />}
          />
          <Route
            path="/instructor/reviews/courses/:courseId"
            element={<ReviewsDetails />}
          />
          <Route
            path="/instructor/announcements"
            element={<AnnouncementsPage />}
          />
          <Route
            path="/instructor/course/content/categories/:categoryId/courses/:courseId/detail"
            element={<CourseContentDetail />}
          />
          {/* course content detail */}
          <Route
            path="/instructor/course/content/:courseId/detail"
            element={<CourseContentDetail />}
          />
          <Route
            path="/instructor/course/content/quizzes/:quizId/detail"
            element={<QuizQuestions />}
          />
          <Route
            path="/instructor/quiz-answers"
            element={<StudentQuizAnswersPage />}
          />
          <Route
            path="/instructor/assignment-answers"
            element={<StudentAssignmentAnswerPage />}
          />
          <Route path="/instructor/earnings" element={<EarningsPage />} />
          <Route path="/instructor/profile" element={<UserProfiles />} />
          <Route
            path="/instructor/notifications"
            element={<InstructorNotificationsPage />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
