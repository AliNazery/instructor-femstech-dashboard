import { useState, useMemo, useCallback } from "react";
import PageMeta from "../../../components/common/PageMeta";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageLayoutSection from "../../../layout/PageLayoutSection";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import EmptyState from "../../../components/common/EmptyState";
import { useGetAnnouncementsQuery } from "../../../app/api/instructor/instructorApi";
import AnnouncementsList from "../../../components/newDesignComponents/announcement/AnnouncementsList";
import { debounce } from "lodash";
import { RootState } from "../../../app/api/store";
import { useSelector } from "react-redux";
import { PaginationControls } from "../../../components/ui/pagination/pagination";
import { TabButton } from "../../../components/ui/tab/tabButton";

export default function AnnouncementsPage() {
  // Local UI states
  const [activeTab, setActiveTab] = useState<"all" | "pinned">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { instructor } = useSelector((state: RootState) => state.instructor);
  const instructorId = instructor?.id;

  // Debounced search (prevents extra API calls)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const updateSearch = useCallback(
    debounce((val: string) => setDebouncedSearch(val), 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    updateSearch(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  // Build query params
  const filters = useMemo(() => {
    return {
      instructor_id: instructorId,
      is_pinned: activeTab === "pinned" ? true : undefined,
      search: debouncedSearch || undefined,
      page,
    };
  }, [instructorId, activeTab, debouncedSearch, page]);

  const {
    data: announcementsData,
    isLoading,
    isFetching,
    isError,
  } = useGetAnnouncementsQuery(filters);

  const announcements = announcementsData?.data ?? [];
  const pagination = announcementsData?.pagination;

  // ----- Content Handling -----
  let content;

  if (isLoading) {
    content = <LoadingSpinner text="Loading announcements..." fullScreen />;
  } else if (isError) {
    content = (
      <EmptyState
        title="Error Loading Announcements"
        description="Something went wrong while fetching announcements. Please try again."
      />
    );
  } else if (announcements.length === 0) {
    content = (
      <EmptyState
        title="No Announcements Found"
        description="There are no announcements matching your filters."
      />
    );
  } else {
    content = (
      <>
        <AnnouncementsList
          announcements={announcements}
        />
        {pagination && pagination.last_page > 1 && (
          <PaginationControls
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
            onPageChange={setPage}
            disabled={isFetching}
          />
        )}
      </>
    );
  }

  return (
    <>
      <PageMeta
        title="Announcements | LMS Dashboard"
        description="Manage and view your announcements"
      />
      <PageBreadcrumb pageTitle="Announcements" />

      <PageLayoutSection
        title="Announcements Management"
        description="View, search, and manage announcements."
      >
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
            <TabButton
              label="All"
              active={activeTab === "all"}
              onClick={() => {
                setActiveTab("all");
                setPage(1);
              }}
            />
            <TabButton
              label="Pinned Only"
              active={activeTab === "pinned"}
              onClick={() => {
                setActiveTab("pinned");
                setPage(1);
              }}
            />
          </div>

          {/* Search */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-600 focus:border-brand-600"
              />
              {isFetching && (
                <span className="absolute right-3 top-2.5 text-gray-400 text-sm">
                  Loading...
                </span>
              )}
            </div>
        </div>

        {content}
      </PageLayoutSection>
    </>
  );
}


