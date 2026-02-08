"use client";

import { generatePagination } from "@/utils/generatePagination";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";

import Link from "next/link";

import { usePathname, useSearchParams } from "next/navigation";
import { toPersianDigits } from "@/utils/numberFormatter";

export default function Pagination({ totalPages, defaultLimit }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || defaultLimit || 6;

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    params.set("limit", itemsPerPage.toString());
    return `${pathname}?${params.toString()}`;
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <div className="flex w-full max-w-full items-center justify-center gap-1 sm:gap-0">
      {/* Mobile: first | prev | X/Y | next | last */}
      <div className="flex flex-1 min-w-0 items-center justify-center gap-1 sm:hidden">
        <PaginationArrow
          direction="right"
          href={createPageURL(1)}
          isDisabled={currentPage <= 1}
          onNavigate={scrollToTop}
          size="sm"
          variant="first"
        />
        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
          onNavigate={scrollToTop}
          size="sm"
        />
        <span className="flex-shrink-0 px-2 py-2 text-sm text-secondary-600">
          {toPersianDigits(currentPage)} از {toPersianDigits(totalPages)}
        </span>
        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
          onNavigate={scrollToTop}
          size="sm"
        />
        <PaginationArrow
          direction="left"
          href={createPageURL(totalPages)}
          isDisabled={currentPage >= totalPages}
          onNavigate={scrollToTop}
          size="sm"
          variant="last"
        />
      </div>

      {/* Desktop: full pagination */}
      <div className="hidden sm:inline-flex">
        <PaginationArrow
          direction="right"
          href={createPageURL(currentPage - 1)}
          isDisabled={currentPage <= 1}
          onNavigate={scrollToTop}
        />

        <div className="flex items-center gap-1.5">
          {allPages.map((page, index) => {
            let position;
            if (index === 0) position = "first";
            if (index === allPages.length - 1) position = "last";
            if (allPages.length === 1) position = "single";
            if (page === "...") position = "middle";

            return (
              <PaginationNumber
                key={`${page}-${index}`}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
                onNavigate={scrollToTop}
                totalPages={totalPages}
              />
            );
          })}
        </div>

        <PaginationArrow
          direction="left"
          href={createPageURL(currentPage + 1)}
          isDisabled={currentPage >= totalPages}
          onNavigate={scrollToTop}
        />
      </div>
    </div>
  );
}

// position?: "first" | "last" | "middle" | "single",

function PaginationNumber({ page, href, isActive, position, onNavigate, totalPages }) {
  const className = classNames(
    "flex h-10 w-10 items-center justify-center text-sm rounded-lg transition-all duration-200",
    "bg-secondary-0 dark:bg-secondary-0/60 shadow-sm shadow-secondary-900/5 dark:shadow-none",
    {
      "z-[9] !bg-primary-900 text-white shadow-md shadow-primary-900/25 dark:shadow-[0_2px_12px_rgba(74,109,255,0.4)]": isActive,
      "text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-200/50 dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.25)]": !isActive && position !== "middle",
      "text-secondary-400 cursor-default": position === "middle",
    }
  );

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className} onClick={onNavigate}>
      {page}
    </Link>
  );
}

function PaginationArrow({ href, direction, isDisabled, onNavigate, size, variant }) {
  const className = classNames(
    "flex items-center justify-center rounded-lg shrink-0 touch-manipulation transition-all duration-200",
    "bg-secondary-0 dark:bg-secondary-0/60 shadow-sm shadow-secondary-900/5 dark:shadow-none",
    {
      "h-9 w-9 min-w-9": size === "sm",
      "h-10 w-10": !size || size !== "sm",
      "pointer-events-none text-secondary-300 dark:text-secondary-600 opacity-70":
        isDisabled,
      "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-200/50 dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.25)] active:scale-95": !isDisabled,
      "mr-2 md:mr-4": direction === "left" && size !== "sm",
      "ml-2 md:ml-4": direction === "right" && size !== "sm",
      "mr-0.5": direction === "left" && size === "sm",
      "ml-0.5": direction === "right" && size === "sm",
    }
  );

  const icon =
    variant === "first" ? (
      <ChevronDoubleRightIcon className="w-4" aria-label="صفحه اول" />
    ) : variant === "last" ? (
      <ChevronDoubleLeftIcon className="w-4" aria-label="صفحه آخر" />
    ) : direction === "left" ? (
      <ArrowLeftIcon className="w-4" />
    ) : (
      <ArrowRightIcon className="w-4" />
    );

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href} onClick={onNavigate}>
      {icon}
    </Link>
  );
}
