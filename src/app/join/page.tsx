"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { requestSignup } from "../actions/join";

export default function JoinPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. 프론트엔드 1차 유효성 검사 (비밀번호 일치 확인)
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 2. 서버 액션 호출을 위한 FormData 생성
    const formData = new FormData();
    formData.append("email", email);
    formData.append("nickname", nickname);
    formData.append("password", password);

    const result = await requestSignup(null, formData);

    if (result.success) {
      alert(result.message);
      router.push("/login"); // 가입 성공 시 로그인 페이지로 이동
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* 타이틀 영역 */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-light tracking-tight text-gray-900">Sign Up</h1>
          <p className="text-sm text-gray-400">새로운 계정을 생성해 주세요.</p>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
          {/* 이메일 입력 */}
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

          {/* 닉네임 입력 */}
          <div className="flex flex-col gap-1.5">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border-b border-gray-200 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition bg-transparent placeholder-gray-300"
              placeholder="닉네임"
              required
            />
          </div>

          {/* 비밀번호 입력 */}
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

          {/* 비밀번호 확인 입력 */}
          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-b border-gray-200 py-3 text-sm text-gray-900 focus:outline-none focus:border-gray-900 transition bg-transparent placeholder-gray-300"
              placeholder="비밀번호 확인"
              required
            />
          </div>

          {/* 에러 메시지 */}
          {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}

          {/* 가입하기 버튼 */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition mt-4"
          >
            가입하기
          </button>
        </form>

        {/* 구분선 및 로그인 페이지 이동 */}
        <div className="flex flex-col gap-4 items-center">
          <div className="w-full flex items-center text-xs text-gray-300 my-1">
            <div className="grow border-t border-gray-100"></div>
            <span className="mx-3">Already have an account?</span>
            <div className="grow border-t border-gray-100"></div>
          </div>

          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition underline underline-offset-4"
          >
            로그인 하러가기
          </Link>
        </div>
      </div>
    </div>
  );
}
