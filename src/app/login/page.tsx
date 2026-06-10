"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { requestLogin } from "../actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const accessToken = await requestLogin(email, password);

    if (accessToken) {
      alert("로그인 성공!");
      router.push("/");
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* 타이틀 영역 */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-light tracking-tight text-gray-900">Sign In</h1>
          <p className="text-sm text-gray-400">서비스 이용을 위해 로그인해 주세요.</p>
        </div>

        {/* 1. 일반 로그인 폼 */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-200 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition bg-transparent placeholder-gray-300"
              placeholder="이메일 주소"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-200 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition bg-transparent placeholder-gray-300"
              placeholder="비밀번호"
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition mt-2"
          >
            로그인
          </button>
        </form>

        {/* 구분선 */}
        <div className="flex items-center text-xs text-gray-300 my-1">
          <div className="grow border-t border-gray-100"></div>
          <span className="mx-3">or</span>
          <div className="grow border-t border-gray-100"></div>
        </div>

        {/* 2. 소셜 로그인 버튼 라인 */}
        <div className="flex flex-col gap-2.5">
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="w-full text-center border border-gray-200 py-3 rounded-lg text-sm font-medium bg-white text-gray-600 hover:bg-gray-50 transition block"
          >
            Google로 로그인
          </a>

          <a
            href="http://localhost:8080/oauth2/authorization/naver"
            className="w-full text-center py-3 rounded-lg text-sm font-medium bg-[#03C75A] text-white hover:bg-[#02b350] transition block"
          >
            Naver로 로그인
          </a>
        </div>
      </div>
    </div>
  );
}
