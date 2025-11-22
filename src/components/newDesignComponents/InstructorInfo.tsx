import { FC } from "react";
import { Mail } from "lucide-react";
import avatarImg from "../../../public/images/user/avatar.jpg"

interface InstructorInfoProps {
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role?: string; // optional instructor role/title
}

const InstructorInfo: FC<InstructorInfoProps> = ({
  name,
  email,
  avatar,
  bio,
  role,
}) => {

  const instImg =  avatar || avatarImg;
  return (
    <section className="p-6 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 shadow-sm flex flex-col sm:flex-row gap-6 items-center transition hover:shadow-md">
      {/* Avatar */}
      <img
        src={instImg}
        alt={name}
        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
      />

      {/* Info */}
      <div className="flex-1 text-center sm:text-left space-y-1">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {name}
        </h3>

        {role && (
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {role}
          </p>
        )}

        <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center sm:justify-start gap-2 hover:text-brand-950 transition">
          <Mail size={16} className="text-gray-400" />
          <a href={`mailto:${email}`} className="underline">
            {email}
          </a>
        </p>

        {bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
            {bio}
          </p>
        )}
      </div>
    </section>
  );
};

export default InstructorInfo;
