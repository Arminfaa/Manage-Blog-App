"use client";
import { useDarkMode } from "@/context/DarkModeContext";
import ButtonIcon from "@/ui/ButtonIcon";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ButtonIcon
      onClick={toggleDarkMode}
      variant="outline"
      title={isDarkMode ? "تغییر به تم روشن" : "تغییر به تم تاریک"}
    >
      {isDarkMode ? (
        <SunIcon className="w-5 h-5 text-warning" />
      ) : (
        <MoonIcon className="w-5 h-5 text-secondary-700" />
      )}
    </ButtonIcon>
  );
}

export default ThemeToggle;

