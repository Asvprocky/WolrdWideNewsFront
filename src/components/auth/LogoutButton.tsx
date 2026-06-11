"use client";

import { useTransition } from "react";
import { requestLogout } from "@/app/actions/logout";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    if (confirm("정말 로그아웃하시겠습니까?")) {
      startTransition(async () => {
        await requestLogout();
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition underline underline-offset-4 disabled:opacity-50"
    >
      {isPending ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
