"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Select from "@/ui/Select";

const statusOptions = [
  { label: "همه", value: "all" },
  { label: "در انتظار تایید", value: "0" },
  { label: "رد شده", value: "1" },
  { label: "تایید شده", value: "2" },
];

export default function CommentStatusFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams);
      if (value === "all") params.delete(name);
      else params.set(name, value);
      params.set("page", "1");
      return params.toString();
    },
    [searchParams]
  );

  const status = searchParams.get("status") || "all";

  return (
    <Select
      value={status}
      onChange={(e) => {
        const value = e.target.value;
        router.push(`${pathname}?${createQueryString("status", value)}`, { scroll: false });
      }}
      options={statusOptions}
    />
  );
}
