"use client";

import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeftStartOnRectangleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import SideBarNavs from "./SideBarNavs";
import ButtonIcon from "@/ui/ButtonIcon";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "@/components/ThemeToggle";

function SideBar({ onClose }) {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="h-dvh overflow-y-auto flex flex-col p-4 md:p-6 lg:!pt-8 !pt-6">
      {/* Sidebar header */}
      <div className="flex items-center justify-between w-full mb-5 pb-4 border-b  border-b-secondary-200 ">
        <Link
          href="/"
          className="flex items-center gap-x-2.5 justify-center text-secondary-700 lg:flex-1"
        >
          <HomeIcon className="w-6 h-6" />
          <span>صفحه اصلی</span>
        </Link>

        <ButtonIcon
          onClick={onClose}
          className="block lg:hidden border-none"
          variant="outline"
        >
          <XMarkIcon />
        </ButtonIcon>
      </div>

      {/* Sidebar content */}
      <div className="overflow-y-auto flex-auto">
        <SideBarNavs onClose={onClose} />
        {/* <div className="flex items-center gap-x-2 rounded-2xl font-medium transition-all duration-200 text-secondary-700 py-3 px-3 mb-2">
          <ThemeToggle />
          <span>تغییر تم</span>
        </div> */}
        <div
          onClick={handleLogout}
          className="flex items-center gap-x-2 rounded-2xl font-medium transition-all duration-200 text-secondary-700 p-3 hover:text-red-400 cursor-pointer"
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          <span>خروج</span>
        </div>
      </div>
    </div>
  );
}
export default SideBar;
