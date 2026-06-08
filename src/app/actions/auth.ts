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
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString(); // 현재 Next.js가 가진 쿠키들 꺼내기

    const response = await fetch(`${BACKEND_URL}/refresh`, {
      method: "POST",
      headers: {
        // 중요: 백엔드의 HttpServletRequest가 쿠키를 읽을 수 있도록
        // Next.js 서버가 받은 쿠키 보따리를 헤더에 통째로 찔러 넣어줌.
        Cookie: cookieHeader,
      },
      // 핵심 추가: 크로스 도메인 간 쿠키 공유를 위해 인증 정보 포함 설정
      credentials: "include",
    });

    if (!response.ok) {
      return null;
    }

    // 백엔드의 JwtResponseDTO(newAccessToken, null) 수신
    const data: JwtResponseDTO = await response.json();

    // 핵심: 백엔드가 Set-Cookie 헤더로 보낸 새 refreshToken 쿠키는
    // 브라우저가 알아서 갱신하므로, 우리는 바디로 받은 새 accessToken만 꺼내서 리턴함.
    return data.accessToken;
  } catch (error) {
    console.error("Token Refresh Error:", error);
    return null;
  }
}
