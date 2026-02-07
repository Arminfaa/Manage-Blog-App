"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const clearSearch = () => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.delete("search");
    newParams.set("page", "1");
    router.push(pathname + "?" + newParams.toString(), { scroll: false });
  };

  const formSubmit = (e) => {
    e.preventDefault();
    const search = e.target.search;
    const searchValue = search.value;  
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", "1");
    if (searchValue) {
      newParams.set("search", searchValue);
    } else {
      newParams.delete("search");
    }

    router.push(pathname + "?" + newParams.toString(), { scroll: false });
    // router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const searchValue = searchParams.get("search") ?? "";

  return (
    <form className="relative" onSubmit={formSubmit}>
      <input
        key={searchValue}
        type="text"
        name="search"
        placeholder="جستجو ..."
        autoComplete="off"
        defaultValue={searchValue}
        className={`textField__input py-3 text-xs bg-secondary-0 pl-9 ${searchValue ? "pr-12 md:pr-9" : ""}`}
      />
      <button
        type="submit"
        className="absolute left-0 top-0 ml-3 flex h-full items-center"
      >
        <MagnifyingGlassIcon className="h-4 text-secondary-400" />
      </button>
      {searchValue ? (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-0 top-0 flex h-full items-center justify-center min-w-11 min-h-11 md:min-w-0 md:min-h-0 p-3 md:p-0 md:mr-3 mr-1 text-secondary-400 hover:text-secondary-600 active:bg-secondary-100 rounded-lg transition-colors touch-manipulation"
          aria-label="پاک کردن جستجو"
        >
          <XMarkIcon className="h-5 md:h-4" />
        </button>
      ) : null}
    </form>
  );
}