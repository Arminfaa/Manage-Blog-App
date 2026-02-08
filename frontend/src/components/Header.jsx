"use client";

import { useAuth } from "@/context/AuthContext";
import NavLink from "./NavLink";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  {
    id: 1,
    children: "خانه",
    path: "/",
  },
  {
    id: 2,
    children: "بلاگ ها",
    path: "/blogs",
  },
];

function Header() {
  const { user, isLoading } = useAuth();

  return (
    <header
      className={`w-full h-max z-10 mb-10 sticky top-0
         transition-all duration-200
         header-glass
         backdrop-blur-xl backdrop-saturate-150
         shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset] dark:shadow-[0_1px_0_0_rgba(0,0,0,0.2)_inset]
         ${isLoading ? "blur-sm opacity-70" : "opacity-100 blur-0"}
      `}
    >
      <nav className="container !max-w-screen-xl">
        <ul className="flex items-center text-secondary-400 justify-between py-2">
          <div className="flex items-center gap-x-10">
            {navLinks.map((navLink) => {
              return (
                <li key={navLink.id}>
                  <NavLink path={navLink.path}>{navLink.children}</NavLink>
                </li>
              );
            })}
          </div>
          <li className="flex items-center gap-x-4">
            <ThemeToggle />
            {user ? (
              <NavLink path="/profile" variant="button">پروفایل</NavLink>
            ) : (
              <NavLink path="/signin" variant="button">ورود</NavLink>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
}
export default Header;
