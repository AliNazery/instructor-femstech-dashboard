export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  enrolled_at: string;
  progress_percent: string;
  payment_status: "completed"| "pending";
  completed_at: string | null;
  created_at: string;
  updated_at: string;

  // New nested data:
  course: {
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
  };
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    bio: string | null;
    avatar_url: string | null;
    phone: string | null;
    address: string | null;
    status: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface RecentEnrollmentsResponse {
  message: string;
  data: Enrollment[];
}

// the recent review:
export interface Review {
  id: number;
  student_id: number;
  course_id: number;
  rating: number;
  review_text: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  course: {
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
  };
  student: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    bio: string | null;
    avatar_url: string | null;
    phone: string | null;
    address: string | null;
    status: string;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface RecentReviewsResponse {
  message: string;
  data: Review[];
}


// the course count:
export interface CourseCountResponse {
  message: string;
  data: {
    total: number;
    published: number;
    unpublished: number;
    total_students: number;
    total_revenue: number;
  };
}


// the upcoming assingment deadline:

export interface UpcomingAssignment {
  id: number;
  title: string;
  description: string;
  expiration_date: string;
  created_at: string;
  updated_at: string;
  entity_type: string;
  entity_id: number;
  instructor_id: number;
}

export interface UpcomingAssignmentsResponse {
  message: string;
  data: UpcomingAssignment[];
}


// most popular courses:
export interface PopularCourse {
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
  total_students: number;
  total_revenue: string | null;
  formatted_rating: string;
}

export interface PopularCoursesResponse {
  message: string;
  data: PopularCourse[];
}

// notifications:
export interface NotificationType {
  id: number;
  title: string;
  description?: string;
  created_at: string;
  is_read: boolean;
}
