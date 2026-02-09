"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ButtonIcon from "@/ui/ButtonIcon";
import Avatar from "@/ui/Avatar";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Drawer from "@/ui/Drawer";
import SideBar from "./SideBar";
import ThemeToggle from "@/components/ThemeToggle";

function Header() {
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const { user, isLoading } = useAuth();

  return (
    <header
      className={`bg-secondary-0 ${isLoading ? "bg-opacity-30 blur-md" : ""}`}
    >
      <div className="flex items-center justify-between lg:py-5 py-3 px-4 lg:px-8">
        <ButtonIcon
          className="block lg:hidden border-none"
          variant="outline"
          onClick={() => setIsOpenDrawer(!isOpenDrawer)}
        >
          {isOpenDrawer ? <XMarkIcon className="!w-6 !h-6" /> : <Bars3Icon className="!w-6 !h-6" />}
        </ButtonIcon>

        <div className="flex flex-col">
          <span className="text-sm lg:text-lg font-bold text-secondary-700">
            {user?.name}
          </span>
          <span className="text-sm text-secondary-700">
            نقش: {user?.role === 'super_admin' ? 'مدیر ارشد' : user?.role === 'admin' ? 'مدیر' : 'کاربر عادی'}
          </span>
        </div>

        <div className="flex items-center gap-x-3">
          <ThemeToggle />
          <Link href="/profile/settings">
            <Avatar src={user?.avatarUrl} width={40} />
          </Link>
        </div>

        <Drawer open={isOpenDrawer} onClose={() => setIsOpenDrawer(false)}>
          <SideBar onClose={() => setIsOpenDrawer(false)} />
        </Drawer>
      </div>
    </header>
  );
}
export default Header;
