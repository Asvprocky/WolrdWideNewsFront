"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import { getAuthStatus } from "@/app/actions/auth";
import { ReactNode } from "react"; // 1. ReactNode 타입 임포트

interface NavbarProps {
  children?: ReactNode; // 2. children을 옵셔널로 추가
}

export default function Navbar({ children }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

  // Navbar.tsx 내 useEffect 부분
  useEffect(() => {
    console.log("Navbar useEffect 실행됨");
    const checkAuth = async () => {
      console.log("getAuthStatus 호출 직전");
      try {
        const status = await getAuthStatus(); // 인자 없이 호출 (서버가 알아서 재발급)
        console.log("결과:", status);
        setIsLoggedIn(status.isLoggedIn);
        setNickname(status.nickname || "");
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);
  return (
    <nav className="absolute top-0 left-0 w-full z-1001 px-6 py-6 flex justify-between items-center bg-linear-to-b from-[#090d16] to-transparent">
      {/* 로고 영역 */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#111827]/80 backdrop-blur-md border border-slate-800/60 shadow-lg">
        <span className="animate-ping h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
        <h1 className="text-[11px] font-bold tracking-wider text-slate-200 font-mono">WWN</h1>
      </div>

      {/* 중앙 영역 (카테고리 필터 자리) */}
      <div className="flex-grow flex justify-end mr-75">
        {children} {/* 여기에 CategoryFilter를 주입 */}
      </div>

      {/* 우측 메뉴 영역 */}
      <div className="flex gap-4 items-center px-4 py-2 rounded-full bg-[#111827]/80 backdrop-blur-md border border-slate-800/60 shadow-lg min-h-9">
        {isLoading ? (
          // 로딩 중일 때는 아무것도 보여주지 않거나 스켈레톤 UI를 보여줌
          <div className="w-16 h-3 animate-pulse bg-slate-800 rounded"></div>
        ) : isLoggedIn ? (
          <>
            <span className="text-[11px] text-slate-300 font-medium">{nickname}님</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="text-[11px] text-slate-400 hover:text-white transition">
              LOGIN
            </Link>
            <Link href="/join" className="text-[11px] text-slate-400 hover:text-white transition">
              SIGNUP
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
