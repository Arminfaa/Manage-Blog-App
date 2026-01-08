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
      <div className="flex items-center justify-between py-5 px-4 lg:px-8">
        <ButtonIcon
          className="block lg:hidden border-none"
          variant="outline"
          onClick={() => setIsOpenDrawer(!isOpenDrawer)}
        >
          {isOpenDrawer ? <XMarkIcon /> : <Bars3Icon />}
        </ButtonIcon>

        <span className="text-sm lg:text-lg font-bold text-secondary-700">
          سلام؛ {user?.name}
        </span>

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
