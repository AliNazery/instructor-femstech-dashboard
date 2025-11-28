import { RootState } from "../../app/api/store";
import { useSelector } from "react-redux";
import avatar from "../../../public/images/user/avatar.jpg";
import { useState } from "react";

export default function UserMetaCard() {
  const { instructor } = useSelector((state: RootState) => state.instructor);
    const [showFullBio, setShowFullBio] = useState(false);

  const avatarSrc =
    instructor?.avatar_url && instructor.avatar_url.toString().trim() !== ""
      ? instructor.avatar_url
      : avatar;

       const bio = instructor?.bio || "No bio provided.";

       const isLongBio = bio.length > 120; // adjust threshold as needed
       const displayedBio =
         !showFullBio && isLongBio ? `${bio.slice(0, 120)}...` : bio;

  return (
    <div className="p-5 border border-brand-500 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 shrink-0 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <img src={avatarSrc} alt="Instructor" />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {instructor?.first_name}
            </h4>
            <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {displayedBio}
                {isLongBio && (
                  <button
                    onClick={() => setShowFullBio((prev) => !prev)}
                    className="ml-1 text-brand-500 hover:underline"
                  >
                    {showFullBio ? "Show less" : "Read more"}
                  </button>
                )}
              </p>
              <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {instructor?.address}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
