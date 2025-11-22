export interface InstructorLoginRequest {
  email: string;
  password: string;
}

export interface Instructor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  avatar_url: string;
  phone: string;
  address: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface InstructorLoginResponse {
  message: string;
  data: {
    access_token: string;
    token_type: string;
    user: Instructor;
  };
}

export interface GetInstructorResponse {
  message: string;
  data: Instructor;
}

export interface BaseResponse<T> {
  message: string;
  data: T;
}

// --- TYPES ---

export interface InstructorResponse {
  message: string;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    bio: string;
    avatar_url: string;
    phone: string;
    address: string;
    status: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}
export interface ResetPasswordRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

export interface BaseResponse<T = null> {
  message: string;
  data: T;
}

// update password:
export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

// the category:
export interface Category {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  message: string;
  data: Category[];
}

export interface CategoryResponse {
  message: string;
  data: Category;
}

export interface CreateCategoryPayload {
  title: string;
  description: string;
  thumbnail_url: File; // form-data
}

export interface UpdateCategoryPayload {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: File; // optional for update
}

// the course types:

export interface Course {
  id: number;
  instructor_id: number;
  category_id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  language: string;
  level: string;
  price: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  instructor?: Instructor;
  category?: Category;
}

// API response wrapper
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// the courese modules types:

export interface CourseModule {
  id: number;
  course_id: number | string;
  title: string;
  description: string;
  order_index: number | string;
  created_at: string;
  updated_at: string;
}

export interface CourseModuleListResponse {
  message: string;
  data: CourseModule[];
}

export interface CourseModuleSingleResponse {
  message: string;
  data: CourseModule;
}

// the Lessons types:
export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string;
  duration_minutes: number;
  order_index: number;
  video_url: string;
  is_preview: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonListResponse {
  message: string;
  data: Lesson[];
}

export interface LessonSingleResponse {
  message: string;
  data: Lesson;
}

export interface QuestionSingleResponse {
  message: string;
  data: Question;
}

export interface QuestionCreatePayload {
  quiz_id: number;
  question: string;
  score: number;
  options: {
    option: string;
    is_correct: boolean;
  }[];
}

export interface QuestionUpdatePayload {
  quiz_id: number;
  question: string;
  score: number;
  options: {
    id?: number;
    question_id?: number;
    option: string;
    is_correct: boolean;
  }[];
}

// the answer:

export type AnswerOption = {
  id: number;
  question_id: number;
  option: string;
  is_correct: number; // 0 or 1
  created_at: string;
  updated_at: string;
};

export type AnswerQuestion = {
  id: number;
  quiz_id: number;
  question: string;
  score: number;
  created_at: string;
  updated_at: string;
  options: AnswerOption[];
};

export type AnswerListResponse = {
  message: string;
  data: AnswerQuestion[];
};

export type AnswerSingleResponse = {
  message: string;
  data: AnswerQuestion;
};

export type AnswerMutationResponse = {
  message: string;
  data: AnswerQuestion;
};

export type EditableOption = {
  id?: number;
  answer_id?: number;
  option: string;
  is_correct: boolean; // boolean for UI
};

export type UpdateAnswerPayload = {
  quiz_id: number;
  question: string;
  score: number;
  options: {
    id?: number;
    question_id: number;
    option: string;
    is_correct: number;
  }[];
};

export type CreateAnswerPayload = {
  quiz_id: number;
  question: string;
  score: number;
  options: {
    option: string;
    is_correct: number; // 0 or 1
  }[];
};

// the new quiz type:

export type EntityType = "course" | "module" | "lesson";

export interface Quiz {
  id: number;
  title: string;
  instructions: string;
  created_at: string;
  updated_at: string;
  entity_type: EntityType;
  entity_id: number;
}

export interface QuizListResponse {
  message: string;
  data: Quiz[];
}

export interface QuizDeleteResponse {
  message: string;
  data: Quiz;
}

export type QuizPayload = {
  title: string;
  instructions: string;
  entity_type: string;
  entity_id: string;
};

export type QuizResponse = {
  message: string;
  data: Quiz;
};

export interface SelectedOption {
  id: number;
  question_id: number;
  option: string;
  is_correct: number;
  created_at: string;
  updated_at: string;
}

export interface QuizAnswer {
  id: number;
  question_id: number;
  student_id: number;
  selected_option_id: number;
  is_correct: number;
  created_at: string;
  updated_at: string;
  question: Question;
  selected_option: SelectedOption;
}

export interface QuizAnswerResponse {
  message: string;
  data: QuizAnswer[];
}

export interface SingleQuizAnswerResponse {
  message: string;
  data: QuizAnswer;
}

// the questio get:
export type QuestionOption = {
  id: number;
  question_id: number;
  option: string;
  is_correct: 0 | 1;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: number;
  quiz_id: number;
  question: string;
  score: number;
  created_at: string;
  updated_at: string;
  options: QuestionOption[];
};

export type QuestionListResponse = {
  message: string;
  data: Question[];
};

// the question create :
export type CreateQuestionOption = {
  option: string;
  is_correct: boolean;
};

export type CreateQuestionPayload = {
  quiz_id: number;
  question: string;
  score: number;
  options: CreateQuestionOption[];
};

export type CreateQuestionResponse = {
  message: string;
  data: Question;
};

// the question update:

export type UpdateQuestionOption = {
  id?: number; // optional for new options
  question_id: number;
  option: string;
  is_correct: number; // 0 or 1
};

// Request payload type
export type UpdateQuestionPayload = {
  quiz_id: number;
  question: string;
  score: number;
  options: UpdateQuestionOption[];
};

// Response type
export type UpdateQuestionResponse = {
  message: string;
  data: {
    id: number;
    quiz_id: number;
    question: string;
    score: number;
    created_at: string;
    updated_at: string;
    options: {
      id: number;
      question_id: number;
      option: string;
      is_correct: number;
      created_at: string;
      updated_at: string;
    }[];
  };
};

// the assignments:

export interface Assignment {
  id: number;
  title: string;
  description: string;
  expiration_date: string;
  created_at: string;
  updated_at: string;
  entity_type: "course" | "module" | "lesson";
  entity_id: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
}

// --- Payloads ---
export interface CreateAssignmentPayload {
  entity_type: "course" | "module" | "lesson";
  entity_id: number;
  title: string;
  description: string;
  expiration_date: string;
}

export interface UpdateAssignmentPayload extends CreateAssignmentPayload {
  id: number;
}

// the assingmner answers:

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  status: "active" | "inactive";
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  expiration_date: string;
  created_at: string;
  updated_at: string;
  entity_type: "course" | "module" | "lesson";
  entity_id: number;
}

export interface AssignmentAnswer {
  id: number;
  assignment_id: number;
  student_id: number;
  title: string;
  description: string;
  submitted_at: string;
  created_at: string;
  updated_at: string;
  assignment: Assignment;
  student: Student;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  message: string;
  data: T;
}

// the course studnets:

export interface Enrollment {
  id: number;
  enrolled_at: string;
  progress_percent: string;
  payment_status: "completed" | "pending";
  completed_at: string | null;
}

export interface CourseStudent {
  student: Student;
  enrollment: Enrollment;
}

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// the announcement:

// Base Course type
export interface Course {
  id: number;
  instructor_id: number;
  category_id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  language: string;
  level: string;
  price: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Announcement entity
export interface Announcement {
  id: number;
  instructor_id: number;
  course_id: number;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  instructor?: Instructor;
  course?: Course;
}

// For single announcement responses
export interface AnnouncementResponse {
  message: string;
  data: Announcement;
}

// For list responses
export interface AnnouncementListResponse {
  message: string;
  data: Announcement[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

// the reviews types:
export interface Review {
  id: number;
  student_id: number;
  course_id: number;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  student?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string | null;
  };
  course?: {
    id: number;
    title: string;
    description: string;
    thumbnail_url?: string;
  };
}

export interface ReviewListResponse {
  message: string;
  data: Review[];
}

export interface ReviewResponse {
  message: string;
  data: Review;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// payment transactions:

export interface TransactionCourse {
  id: number;
  instructor_id: number;
  category_id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  language: string;
  level: string;
  price: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  formatted_rating: string;
  payment_status: string | null;
}

export interface TransactionStudent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  avatar_url: string | null;
  phone: string;
  address: string;
  status: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionItem {
  id: number;
  payment_method_id: number | null;
  student_id: number;
  course_id: number;
  amount: string;
  currency: string;
  payment_gateway: string;
  transaction_id: string;
  status: string;
  paid_at: string;
  created_at: string;
  updated_at: string;
  course: TransactionCourse;
  student: TransactionStudent;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface TransactionResponse {
  message: string;
  data: TransactionItem[];
  pagination: Pagination;
}

// the students of a teacher:

export interface Course {
  id: number;
  instructor_id: number;
  category_id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  language: string;
  level: string;
  price: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  formatted_rating: string;
  payment_status: string | null;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrolled_at: string;
  progress_percent: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  course: Course | null;
}

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  phone: string | null;
  address: string | null;
  status: "active" | "inactive";
  user_id: number;
  created_at: string;
  updated_at: string;
  enrollments: Enrollment[];
}

export interface StudentsResponse {
  message: string;
  data: Student[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
