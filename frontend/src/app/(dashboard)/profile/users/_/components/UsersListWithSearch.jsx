"use client";

import { useState, useMemo } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import UsersTable from "./UsersTable";
import Empty from "@/ui/Empty";

function filterUsers(users, query) {
  if (!query?.trim()) return users;
  const q = query.trim().toLowerCase();
  return users.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(q)) ||
      (user.email && user.email.toLowerCase().includes(q))
  );
}

export default function UsersListWithSearch({ users = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = useMemo(
    () => filterUsers(users, searchQuery),
    [users, searchQuery]
  );

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-secondary-700 mb-12 items-center">
        <h1 className="font-bold text-xl">لیست کاربران</h1>
        <form
          className="relative"
          onSubmit={(e) => e.preventDefault()}
          role="search"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در نام و ایمیل ..."
            autoComplete="off"
            className="textField__input py-3 text-xs bg-secondary-0 w-full pr-10"
          />
          <span className="pointer-events-none absolute left-0 top-0 ml-3 flex h-full items-center">
            <MagnifyingGlassIcon className="h-4 text-secondary-400" />
          </span>
        </form>
      </div>
      {filteredUsers.length === 0 ? (
        users.length === 0 ? (
          <Empty resourceName="کاربری" />
        ) : (
          <p className="font-bold text-secondary-700">
            نتیجه‌ای برای جستجوی شما یافت نشد.
          </p>
        )
      ) : (
        <UsersTable users={filteredUsers} />
      )}
    </div>
  );
}
