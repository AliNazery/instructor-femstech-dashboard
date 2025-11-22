import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "../config/constant";
import Cookies from "js-cookie";
import type {
  Announcement,
  AnnouncementListResponse,
  AnnouncementResponse,
  ApiResponse,
  Assignment,
  AssignmentAnswer,
  BaseResponse,
  CategoryListResponse,
  CategoryResponse,
  Course,
  CourseModuleListResponse,
  CourseModuleSingleResponse,
  CourseStudent,
  CreateAssignmentPayload,
  CreateQuestionPayload,
  CreateQuestionResponse,
  EntityType,
  ForgotPasswordRequest,
  GetInstructorResponse,
  Instructor,
  InstructorLoginRequest,
  InstructorLoginResponse,
  InstructorResponse,
  LessonListResponse,
  LessonSingleResponse,
  PaginatedResponse,
  Pagination,
  QuestionListResponse,
  QuestionSingleResponse,
  QuizAnswerResponse,
  QuizDeleteResponse,
  QuizListResponse,
  QuizResponse,
  ResetPasswordRequest,
  ReviewListResponse,
  ReviewResponse,
  SingleQuizAnswerResponse,
  StudentsResponse,
  TransactionResponse,
  UpdateAssignmentPayload,
  UpdatePasswordPayload,
  UpdateQuestionPayload,
  UpdateQuestionResponse,
} from "./instructor.type";

export const instructorApi = createApi({
  reducerPath: "instructorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/v1`,
    prepareHeaders: (headers) => {
      const token = Cookies.get("instructor_token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Instructor",
    "Category",
    "Courses",
    "CourseModule",
    "Lesson",
    "Quiz",
    "Question",
    "Answer",
    "Questions",
    "Assignment",
    "AssignmentAnswer",
    "CourseStudents",
    "Announcement",
    "Reviews",
    "QuizAnswer",
    "Revenue",
    "Students",
    "Transactions",
  ],
  endpoints: (builder) => ({
    instructorLogin: builder.mutation<
      InstructorLoginResponse,
      InstructorLoginRequest
    >({
      query: ({ email, password }) => ({
        url: "/instructor/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }),
    }),
    instructorLogout: builder.mutation<BaseResponse<null>, void>({
      query: () => ({
        url: "/instructor/logout",
        method: "POST",
      }),
    }),
    getInstructorMe: builder.query<GetInstructorResponse, void>({
      query: () => ({
        url: "/instructor/me",
        method: "GET",
      }),
      providesTags: ["Instructor"],
    }),

    updateInstructor: builder.mutation<
      { message: string; data: Instructor },
      FormData
    >({
      query: (formData) => ({
        url: "/instructor/update",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Instructor"],
    }),

    // forgot passowrd
    instructorForgotPassword: builder.mutation<
      BaseResponse,
      ForgotPasswordRequest
    >({
      query: (body) => ({
        url: "/instructor/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // Reset password
    instructorResetPassword: builder.mutation<
      BaseResponse,
      ResetPasswordRequest
    >({
      query: (body) => ({
        url: "/instructor/reset-password",
        method: "POST",
        body,
      }),
    }),
    // update passowrd
    updatePassword: builder.mutation<BaseResponse<null>, UpdatePasswordPayload>(
      {
        query: (data) => ({
          url: "/instructor/update-password",
          method: "POST",
          body: data,
        }),
      }
    ),

    registerInstructor: builder.mutation<InstructorResponse, FormData>({
      query: (formData) => ({
        url: "/instructor/store",
        method: "POST",
        body: formData,
      }),
    }),
    // the course category

    // 1. Get all categories
    getCategories: builder.query<CategoryListResponse, void>({
      query: () => ({
        url: "/category/list",
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    // 2. Get single category
    getCategory: builder.query<CategoryResponse, number>({
      query: (id) => ({
        url: `/category/list/${id}`,
        method: "GET",
      }),
      providesTags: ["Category"],
    }),

    // 3. Create category
    createCategory: builder.mutation<CategoryResponse, FormData>({
      query: (formData) => ({
        url: "/category/store",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),

    // 4. Update category
    updateCategory: builder.mutation<
      CategoryResponse,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/category/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Category"],
    }),

    // 5. Delete category
    deleteCategory: builder.mutation<CategoryResponse, number>({
      query: (id) => ({
        url: `/category/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
    }),

    // the course
    // 1. Get All Courses (with filters)
    getCourses: builder.query<
      ApiResponse<Course[]>,
      Partial<{
        category_id: number;
        instructor_id: number;
        level: string;
        language: string;
        search: string;
      }>
    >({
      query: (params) => ({
        url: "/course/list",
        method: "GET",
        params,
      }),
      providesTags: ["Courses"],
    }),

    // 2. Get Single Course
    getCourse: builder.query<ApiResponse<Course>, number>({
      query: (id) => ({
        url: `/course/list/${id}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Courses", id }],
    }),

    // 3. Create Course
    createCourse: builder.mutation<ApiResponse<Course>, FormData>({
      query: (body) => ({
        url: "/course/store",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),

    // 4. Update Course
    updateCourse: builder.mutation<
      ApiResponse<Course>,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/course/update/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        "Courses",
        { type: "Courses", id },
      ],
    }),

    // 5. Publish Course
    publishCourse: builder.mutation<
      ApiResponse<Course>,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/course/publish/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        "Courses",
        { type: "Courses", id },
      ],
    }),

    // 6. Unpublish Course
    unpublishCourse: builder.mutation<
      ApiResponse<Course>,
      { id: number; body: FormData }
    >({
      query: ({ id, body }) => ({
        url: `/course/unpublish/${id}`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        "Courses",
        { type: "Courses", id },
      ],
    }),

    // 7. Delete Course
    deleteCourse: builder.mutation<ApiResponse<Course>, number>({
      query: (id) => ({
        url: `/course/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => ["Courses", { type: "Courses", id }],
    }),

    // the course Module:

    // 1. GET all modules
    getModules: builder.query<
      CourseModuleListResponse,
      { course_id?: string | number }
    >({
      query: ({ course_id }) =>
        course_id
          ? `/course-module/list?course_id=${course_id}`
          : `/course-module/list`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "CourseModule" as const,
                id,
              })),
              { type: "CourseModule", id: "LIST" },
            ]
          : [{ type: "CourseModule", id: "LIST" }],
    }),

    // 2. GET single module
    getModule: builder.query<
      CourseModuleSingleResponse,
      { id: number | string }
    >({
      query: ({ id }) => `/course-module/list/${id}`,
      providesTags: (_result, _error, { id }) => [{ type: "CourseModule", id }],
    }),

    // 3. POST create module
    createModule: builder.mutation<CourseModuleSingleResponse, FormData>({
      query: (formData) => ({
        url: "/course-module/store",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "CourseModule", id: "LIST" }],
    }),

    // 4. POST update module (using _method: PUT in FormData)
    updateModule: builder.mutation<
      CourseModuleSingleResponse,
      { id: number | string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/course-module/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "CourseModule", id },
        { type: "CourseModule", id: "LIST" },
      ],
    }),

    // 5. DELETE module
    deleteModule: builder.mutation<
      CourseModuleSingleResponse,
      { id: number | string }
    >({
      query: ({ id }) => ({
        url: `/course-module/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "CourseModule", id: "LIST" }],
    }),

    // the Lessons:
    getLessons: builder.query<
      LessonListResponse,
      { module_id?: string | number }
    >({
      query: ({ module_id } = {}) =>
        module_id ? `/lesson/list?module_id=${module_id}` : `/lesson/list`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Lesson" as const, id })),
              { type: "Lesson", id: "LIST" },
            ]
          : [{ type: "Lesson", id: "LIST" }],
    }),

    // 2. GET single lesson
    getLesson: builder.query<LessonSingleResponse, number | string>({
      query: (id) => `/lesson/list/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Lesson", id }],
    }),

    // 3. POST create lesson
    createLesson: builder.mutation<LessonSingleResponse, FormData>({
      query: (formData) => ({
        url: `/lesson/store`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "Lesson", id: "LIST" }],
    }),

    // 4. POST update lesson
    updateLesson: builder.mutation<
      LessonSingleResponse,
      { id: string | number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/lesson/update/${id}`,
        method: "POST", // Laravel uses POST + _method: PUT
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Lesson", id },
        { type: "Lesson", id: "LIST" },
      ],
    }),

    // 5. DELETE lesson
    deleteLesson: builder.mutation<LessonSingleResponse, number | string>({
      query: (id) => ({
        url: `/lesson/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Lesson", id },
        { type: "Lesson", id: "LIST" },
      ],
    }),

    //quiz:
    getQuizzes: builder.query<
      QuizListResponse,
      { entityType: EntityType; entityId: number; search?: string }
    >({
      query: ({ entityType, entityId, search }) => {
        const params = new URLSearchParams({
          entity_type: entityType,
          entity_id: String(entityId),
        });

        if (search) {
          params.append("search", search);
        }

        return `/quiz/list?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Quiz" as const, id })),
              { type: "Quiz", id: "LIST" },
            ]
          : [{ type: "Quiz", id: "LIST" }],
    }),

    createQuiz: builder.mutation<QuizResponse, FormData>({
      query: (formData) => ({
        url: "/quiz/store",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Quiz"],
    }),

    updateQuiz: builder.mutation<
      QuizResponse,
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/quiz/update/${id}`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Quiz", id: arg.id }],
    }),

    deleteQuiz: builder.mutation<QuizDeleteResponse, number>({
      query: (id) => ({
        url: `/quiz/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Quiz", id: "LIST" }],
    }),

    // the question get:
    getQuestions: builder.query<QuestionListResponse, number>({
      query: (quizId) => `/question/list?quiz_id=${quizId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((q) => ({
                type: "Questions" as const,
                id: q.id,
              })),
              { type: "Questions", id: "LIST" },
            ]
          : [{ type: "Questions", id: "LIST" }],
    }),
    // 2. Get single question
    getQuestion: builder.query<QuestionSingleResponse, number>({
      query: (id) => `/question/list/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Question", id }],
    }),

    // 5. Delete question
    deleteQuestion: builder.mutation<QuestionSingleResponse, number>({
      query: (id) => ({
        url: `/question/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Questions", id },
        { type: "Questions", id: "LIST" },
      ],
    }),

    createQuestion: builder.mutation<
      CreateQuestionResponse,
      CreateQuestionPayload
    >({
      query: (payload) => ({
        url: "/question/store",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: "Questions", id: "LIST" }],
    }),

    // the question update:
    updateQuestion: builder.mutation<
      UpdateQuestionResponse,
      { id: number; body: UpdateQuestionPayload }
    >({
      query: ({ id, body }) => ({
        url: `/question/update/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Questions", id },
        { type: "Questions", id: "LIST" },
      ],
    }),

    // the questions or quiz answer:

    getQuizAnswers: builder.query<
      QuizAnswerResponse,
      { quiz_id?: number; student_id?: number }
    >({
      query: ({ quiz_id, student_id } = {}) => {
        const params = new URLSearchParams();

        if (quiz_id) params.append("quiz_id", quiz_id.toString());
        if (student_id) params.append("student_id", student_id.toString());

        const queryString = params.toString();
        return `/quiz-answer/list${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["QuizAnswer"],
    }),

    // Get single quiz answer by ID
    getSingleQuizAnswer: builder.query<SingleQuizAnswerResponse, number>({
      query: (id) => `/quiz-answer/list/${id}`,
      providesTags: ["QuizAnswer"],
    }),

    // the assignments:
    getAssignments: builder.query<
      PaginatedResponse<Assignment>,
      { entity_type: string; entity_id: number }
    >({
      query: ({ entity_type, entity_id }) =>
        `/assignment/list?entity_type=${entity_type}&entity_id=${entity_id}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Assignment" as const,
                id,
              })),
              { type: "Assignment", id: "LIST" },
            ]
          : [{ type: "Assignment", id: "LIST" }],
    }),

    // POST /assignment/store
    createAssignment: builder.mutation<
      ApiResponse<Assignment>,
      CreateAssignmentPayload
    >({
      query: (body) => ({
        url: "/assignment/store",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Assignment", id: "LIST" }],
    }),

    // PUT /assignment/update/:id
    updateAssignment: builder.mutation<
      ApiResponse<Assignment>,
      UpdateAssignmentPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/assignment/update/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Assignment", id },
        { type: "Assignment", id: "LIST" },
      ],
    }),

    // DELETE /assignment/destroy/:id
    deleteAssignment: builder.mutation<ApiResponse<Assignment>, number>({
      query: (id) => ({
        url: `/assignment/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Assignment", id },
        { type: "Assignment", id: "LIST" },
      ],
    }),
    // the assingment answers:
    getAssignmentAnswers: builder.query<
      ApiResponse<AssignmentAnswer[]>,
      { student_id?: number; assignment_id?: number }
    >({
      query: ({ student_id, assignment_id } = {}) => {
        const params = new URLSearchParams();
        if (student_id) params.append("student_id", String(student_id));
        if (assignment_id)
          params.append("assignment_id", String(assignment_id));

        const queryString = params.toString();
        return `assignment-answer/list${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["AssignmentAnswer"],
    }),

    // the course studnet:

    getCourseStudents: builder.query<PaginatedResponse<CourseStudent>, number>({
      query: (courseId) => `/course/students/${courseId}`,
      providesTags: ["CourseStudents"],
    }),

    // the annoucenment:
    // Get all announcements (with optional filters)
    getAnnouncements: builder.query<
      AnnouncementListResponse,
      {
        course_id?: number;
        instructor_id?: number;
        search?: string;
        is_pinned?: boolean;
      }
    >({
      query: (params) => ({
        url: "announcement/list",
        method: "GET",
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Announcement" as const,
                id,
              })),
              { type: "Announcement", id: "LIST" },
            ]
          : [{ type: "Announcement", id: "LIST" }],
    }),

    // Get announcements for a specific course
    getCourseAnnouncements: builder.query<AnnouncementListResponse, number>({
      query: (courseId) => `announcement/course/${courseId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Announcement" as const,
                id,
              })),
              { type: "Announcement", id: "LIST" },
            ]
          : [{ type: "Announcement", id: "LIST" }],
    }),

    // Create
    createAnnouncement: builder.mutation<
      AnnouncementResponse,
      Partial<Announcement>
    >({
      query: (body) => ({
        url: "announcement/store",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),

    // Update
    updateAnnouncement: builder.mutation<
      AnnouncementResponse,
      { id: number; data: Partial<Announcement> }
    >({
      query: ({ id, data }) => ({
        url: `announcement/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
      ],
    }),

    // Pin
    pinAnnouncement: builder.mutation<AnnouncementResponse, number>({
      query: (id) => ({
        url: `announcement/pin/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
      ],
    }),

    // Unpin
    unpinAnnouncement: builder.mutation<AnnouncementResponse, number>({
      query: (id) => ({
        url: `announcement/unpin/${id}`,
        method: "PUT",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
      ],
    }),

    // Delete
    deleteAnnouncement: builder.mutation<AnnouncementResponse, number>({
      query: (id) => ({
        url: `announcement/destroy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Announcement", id },
        { type: "Announcement", id: "LIST" },
      ],
    }),

    // the reviews :

    getReviews: builder.query<
      ReviewListResponse,
      { courseId: number; student_id?: number; is_approved?: boolean }
    >({
      query: ({ courseId, student_id, is_approved }) => {
        const params = new URLSearchParams();

        if (student_id !== undefined)
          params.append("student_id", student_id.toString());
        if (is_approved !== undefined)
          params.append("is_approved", String(is_approved));

        const queryString = params.toString();
        const url = queryString
          ? `/reviews/${courseId}?${queryString}`
          : `/reviews/${courseId}`;

        return {
          url,
          method: "GET",
        };
      },

      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((r) => ({
                type: "Reviews" as const,
                id: r.id,
              })),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }],
    }),

    approveReview: builder.mutation<ReviewResponse, number>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Reviews", id },
        { type: "Reviews", id: "LIST" },
      ],
    }),

    unapproveReview: builder.mutation<ReviewResponse, number>({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}/unapprove`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Reviews", id },
        { type: "Reviews", id: "LIST" },
      ],
    }),

    // the my-courses:
    getMyCourses: builder.query<
      { message: string; data: Course[]; pagination?: Pagination },
      { category_id?: number; search?: string; is_published?: boolean }
    >({
      query: (params) => ({
        url: "/course/my-courses",
        method: "GET",
        params,
      }),
      providesTags: ["Courses"],
    }),

    // the earning and paymnet:
    getTotalRevenue: builder.query<
      {
        message: string;
        data: {
          total_revenue: string;
          current_month_revenue: string;
          growth_rate: number;
        };
      },
      void
    >({
      query: () => ({
        url: "/instructor/payments/total-revenue",
        method: "GET",
      }),
      providesTags: ["Revenue"],
    }),

    // the payment transactions:

    // ✅ NEW: Get transactions
    getTransactions: builder.query<
      TransactionResponse,
      { page?: number; per_page?: number }
    >({
      query: ({ page = 1, per_page = 10 } = {}) => ({
        url: `/instructor/payments/transactions?page=${page}&per_page=${per_page}`,
        method: "GET",
      }),
      providesTags: ["Transactions"],
    }),

    // get students of a teacher:
    getStudents: builder.query<
      StudentsResponse,
      { page?: number; per_page?: number }
    >({
      query: ({ page = 1, per_page = 10 }) =>
        `instructor/students?page=${page}&per_page=${per_page}`,
      providesTags: ["Students"],
    }),
  }),
});

export const {
  useInstructorLoginMutation,
  useGetInstructorMeQuery,
  useInstructorLogoutMutation,
  useUpdateInstructorMutation,
  useInstructorForgotPasswordMutation,
  useInstructorResetPasswordMutation,
  useUpdatePasswordMutation,
  useRegisterInstructorMutation,

  // the category:
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // the Course:
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  usePublishCourseMutation,
  useUnpublishCourseMutation,
  useDeleteCourseMutation,

  // the course module:
  useGetModulesQuery,
  useGetModuleQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation,

  // the lessons:

  useGetLessonsQuery,
  useGetLessonQuery,
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,

  // the questions:

  useGetQuestionQuery,
  useDeleteQuestionMutation,
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,

  // the quiz answer:
  useGetQuizAnswersQuery,
  useGetSingleQuizAnswerQuery,

  // the quiz:

  useGetQuizzesQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,

  // the assignments:
  useGetAssignmentsQuery,
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
  useDeleteAssignmentMutation,

  // the assignment asnwers:
  useGetAssignmentAnswersQuery,

  // the course student:
  useGetCourseStudentsQuery,

  // the announcement:

  useGetAnnouncementsQuery,
  useGetCourseAnnouncementsQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  usePinAnnouncementMutation,
  useUnpinAnnouncementMutation,
  useDeleteAnnouncementMutation,

  // the reviews:
  useGetReviewsQuery,
  useApproveReviewMutation,
  useUnapproveReviewMutation,

  // my-courses
  useGetMyCoursesQuery,

  // the total revenue:
  useGetTotalRevenueQuery,
  useGetTransactionsQuery,

  // get students:
  useGetStudentsQuery,
} = instructorApi;
