import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../config/constant";
import { CourseCountResponse, NotificationType, PopularCoursesResponse, RecentEnrollmentsResponse, RecentReviewsResponse, UpcomingAssignmentsResponse } from "./metrics.Type";



export const instructorOverviewApi = createApi({
  reducerPath: "instructorOverviewApi",
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
    "Overview",
    "Enrollments",
    "CoursesCount",
    "UpcomingAssignments",
    "Courses",
    "Notifications",
  ],
  endpoints: (builder) => ({
    // the recent course enrollemetn
    getRecentEnrollments: builder.query<RecentEnrollmentsResponse, void>({
      query: () => `/instructor/overview/recent-enrollments`,
      providesTags: ["Enrollments"],
    }),

    //   the recent review:
    getRecentReviews: builder.query<RecentReviewsResponse, void>({
      query: () => `/instructor/overview/recent-reviews`,
    }),

    // the course count:
    getCoursesCount: builder.query<CourseCountResponse, void>({
      query: () => "/instructor/overview/courses-count",
      providesTags: ["CoursesCount"],
    }),
    // upcoming assignments deadline
    getUpcomingAssignments: builder.query<UpcomingAssignmentsResponse, void>({
      query: () => ({
        url: "/instructor/overview/upcoming-assignments",
        method: "GET",
      }),
      providesTags: ["UpcomingAssignments"],
    }),

    getMostPopularCourses: builder.query<PopularCoursesResponse, void>({
      query: () => ({
        url: "/course/most-popular",
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),

    // the notifications:

    // 🔹 Get notifications
    getNotifications: builder.query<
      {
        message: string;
        data: NotificationType[];
      },
      void
    >({
      query: () => "instructor/notifications",
      providesTags: ["Notifications"],
    }),

    // 🔹 Get notification counts
    getNotificationCounts: builder.query<
      {
        message: string;
        data: { total: number; unread: number };
      },
      void
    >({
      query: () => "instructor/notifications/counts",
      providesTags: ["Notifications"],
    }),

    // 🔹 Mark notifications as read
    markNotificationsRead: builder.mutation<
      {
        message: string;
        data: boolean;
      },
      { ids: number[] }
    >({
      query: (body) => ({
        url: "instructor/notifications/mark-read",
        method: "POST",
        body,
        headers: { "Content-Type": "application/json" },
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

    
export const {
  useGetRecentEnrollmentsQuery,
  useGetRecentReviewsQuery,
  useGetCoursesCountQuery,
  useGetUpcomingAssignmentsQuery,
  useGetMostPopularCoursesQuery,

  useGetNotificationsQuery,
  useGetNotificationCountsQuery,
  useMarkNotificationsReadMutation,
} = instructorOverviewApi;
