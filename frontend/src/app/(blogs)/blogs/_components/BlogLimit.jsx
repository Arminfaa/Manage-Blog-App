"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Select from "@/ui/Select";
import { toPersianDigits } from "@/utils/numberFormatter";

const LIMIT_OPTIONS = [6, 9, 12, 24, 36];

function BlogLimit({ totalCount = 0 }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLimit = searchParams.get("limit") || "9";

  const options = [
    ...LIMIT_OPTIONS.map((n) => ({
      value: String(n),
      label: `${toPersianDigits(n)} مورد`,
    })),
    ...(totalCount > 0 && !LIMIT_OPTIONS.includes(totalCount)
      ? [{ value: String(totalCount), label: `همه (${toPersianDigits(totalCount)})` }]
      : []),
  ];

  const createQueryString = useCallback(
    (limit) => {
      const params = new URLSearchParams(searchParams);
      params.set("limit", limit);
      params.set("page", "1");
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex lg:justify-between lg:w-full items-center gap-2">
      <label htmlFor="blog-limit" className="text-sm text-secondary-600 whitespace-nowrap">
        تعداد در صفحه:
      </label>
      <Select
        id="blog-limit"
        className="textField__input py-0.5 px-1 text-md bg-secondary-0 "
        value={currentLimit}
        onChange={(e) => router.push(pathname + "?" + createQueryString(e.target.value))}
        options={options}
      />
    </div>
  );
}

export default BlogLimit;
