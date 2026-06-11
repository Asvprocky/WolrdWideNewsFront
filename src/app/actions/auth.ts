"use server";

import { cookies } from "next/headers";

const BACKEND_URL = "http://localhost:8080";

// 1. 백엔드 JwtResponseDTO 규격과 매칭되는 타입 정의
export interface JwtResponseDTO {
  accessToken: string;
  refreshToken: string | null; // 백엔드가 null로 줄 수도 있으므로 처리
}

/**
 * 1. [일반 로그인 요청]
 * 사용자가 아이디/비번을 입력했을 때 호출
 */
export async function requestLogin(email: string, password: string): Promise<string | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return null;
    }

    const data: JwtResponseDTO = await response.json();

    // 백엔드가 준 accessToken은 자바스크립트 메모리(리턴값)로 프론트엔드에 전달하고,
    // 만약 로그인 시점에도 리프레시 토큰이 같이 넘어왔다면 Next.js 서버 쿠키에 따로 구워줌.
    if (data.refreshToken) {
      const cookieStore = await cookies();
      cookieStore.set("refreshToken", data.refreshToken, {
        // 백엔드와 이름 통일!
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7일 유지
        path: "/",
      });
    }

    // 핵심: 자바스크립트가 만질 수 있도록 accessToken을 문자열로 밖으로 던져줍니다.
    return data.accessToken;
  } catch (error) {
    console.error("Login Error:", error);
    return null;
  }
}

/**
 * 2. [통합 재발급 & 소셜 로그인 교환 요청]
 * 일반 로그인 유저의 토큰 만료 시점 OR 소셜 로그인 성공 직후 첫 진입 시점에 호출
 */
export async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const response = await fetch(`${BACKEND_URL}/jwt/refresh`, {
    method: "POST",
    headers: { Cookie: cookieStore.toString() },
  });

  if (!response.ok) return null;

  // 1. 서버가 준 새 리프레시 토큰(Set-Cookie 헤더) 추출
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    // "refreshToken=eyJ...; Path=/; ..." 형태에서 토큰 값만 파싱
    const match = setCookie.match(/refreshToken=([^;]+)/);
    if (match) {
      const newRefreshToken = match[1];
      // 2. Next.js 쿠키 저장소에 새 토큰을 즉시 저장!
      cookieStore.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
      });
    }
  }

  const data: JwtResponseDTO = await response.json();
  return data.accessToken;
}

/**
 * [로그인 상태 확인 및 사용자 정보 조회]
 * 프론트엔드 Navbar에서 로그인 여부와 닉네임을 표시하기 위해 호출
 */
export async function getAuthStatus() {
  const cookieStore = await cookies();

  // 1. 메모리에 저장된 액세스 토큰이 없으므로, 재발급을 시도합니다.
  const newAccessToken = await refreshAccessToken();

  console.log("재발급된 토큰 확인:", newAccessToken); // 로그 추가!

  // 2. 재발급 실패 시 (리프레시 토큰 만료 등) -> 로그아웃 처리
  if (!newAccessToken) {
    console.log("토큰 재발급 실패");
    return { isLoggedIn: false, nickname: null };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/user/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${newAccessToken}`, // 갱신된 토큰 사용
        "Content-Type": "application/json", //
        Cookie: cookieStore.toString(),
      },
    });

    if (!response.ok) {
      console.log("응답 상태:", response.status); // 400대 에러인지 확인
      return { isLoggedIn: false, nickname: null };
    }

    const userData = await response.json();
    return { isLoggedIn: true, nickname: userData.nickname };
  } catch (error) {
    return { isLoggedIn: false, nickname: null };
  }
}
