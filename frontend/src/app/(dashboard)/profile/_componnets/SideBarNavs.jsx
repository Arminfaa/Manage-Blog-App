"use client";

import {
  ChatBubbleBottomCenterIcon,
  DocumentTextIcon,
  RectangleGroupIcon,
  Squares2X2Icon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const sidebarNavs = [
  {
    id: 1,
    title: "داشبورد",
    icon: <RectangleGroupIcon className="w-5 h-5" />,
    href: "/profile",
    adminOnly: false,
  },
  {
    id: 2,
    title: "پست ها",
    icon: <DocumentTextIcon className="w-5 h-5" />,
    href: "/profile/posts",
    adminOnly: false,
  },
  {
    id: 3,
    title: "نظرات",
    icon: <ChatBubbleBottomCenterIcon className="w-5 h-5" />,
    href: "/profile/comments",
    adminOnly: false,
  },
  {
    id: 4,
    title: "دسته بندی ها",
    icon: <Squares2X2Icon className="w-5 h-5" />,
    href: "/profile/categories",
    adminOnly: true,
  },
  {
    id: 5,
    title: "کاربران",
    icon: <UsersIcon className="w-5 h-5" />,
    href: "/profile/users",
    adminOnly: true,
  },
];

export default function SideBarNavs({ onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdminOrSuperAdmin = user?.role === "admin" || user?.role === "super_admin";
  const visibleNavs = sidebarNavs.filter((nav) => !nav.adminOnly || isAdminOrSuperAdmin);

  return (
    <ul className="space-y-2">
      {visibleNavs.map((nav) => {
        return (
          <li key={nav.id}>
            <Link
              href={nav.href}
              className={classNames(
                "flex items-center gap-x-2 rounded-2xl font-medium hover:text-primary-900 transition-all duration-200 text-secondary-700 p-3",
                {
                  "bg-primary-100/40 !font-bold text-secondary-700 hover:text-secondary-700":
                    pathname === nav.href,
                }
              )}
              onClick={onClose}
            >
              {nav.icon}
              {nav.title}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
