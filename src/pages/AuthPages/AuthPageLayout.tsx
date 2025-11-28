import React from "react";
import { Link } from "react-router";
import logo from "../../../public/images/logo/log.png";
import bgImage from "../../../public/images/bg-image/femstech network-dotted-sample.png";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="min-h-screen w-full overflow-y-auto bg-cover bg-center bg-no-repeat bg-fixed custom-scrollbar "
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="flex flex-col items-center w-full mx-auto mt-10 mb-48   dark:bg-gray-800/70 rounded-2xl ">

        {/* Logo */}
        <Link to="/" className="mb-8 block">
          <img
            width={180}
            src={logo}
            alt="Logo"
            className="mx-auto"
          />
        </Link>

        {/* Form content */}
        <div className="w-full">
          {children}
        </div>

      </div>
    </div>
  );
}
