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

/**
 * [기사 목록 조회 서버 액션]
 * 로그인 사용자의 토큰을 포함해서 기사 목록을 가져옴.
 */

export async function getArticlesAction() {
  try {
    const cookieStore = await cookies();
    const accessToken = await refreshAccessToken();

    const headers: HeadersInit = {
      Cookie: cookieStore.toString(),
    };

    // 로그인한 경우에만 Authorization 추가
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BACKEND_URL}/articles/all`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("기사 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}
/**
 *  국가별 조회
 * @param articleId
 * @returns
 */
export async function getCountryArticlesAction(country: string) {
  try {
    const cookieStore = await cookies();
    const accessToken = await refreshAccessToken();

    const headers: HeadersInit = {
      Cookie: cookieStore.toString(),
    };

    // 로그인한 경우에만 Authorization 추가
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${BACKEND_URL}/articles/country/${encodeURIComponent(country)}`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("국가 기사 조회 실패");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * [북마크 토글 서버 액션]
 * 클라이언트 컴포넌트에서 기사 ID를 주면,
 * 서버측에서 토큰 재발급을 거쳐 백엔드에 안전하게 API를 요청함.
 */
export async function toggleBookmarkAction(
  articleId: number,
): Promise<{ success: boolean; message: string }> {
  try {
    // 1. 보안을 위해 서버 측 쿠키 저장소 로드
    const cookieStore = await cookies();

    // 2. 이미 짜여진 로직 활용: 안전하게 액세스 토큰 재발급(또는 획득)
    const accessToken = await refreshAccessToken();
    if (!accessToken) {
      return { success: false, message: "로그인이 만료되었습니다. 다시 로그인해 주세요." };
    }

    // 3. 백엔드 스프링 서버로 북마크 요청 전달
    const response = await fetch(`${BACKEND_URL}/bookmark?articleId=${articleId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(), // 쿠키 세션도 필요한 경우 함께 전달
      },
    });

    if (!response.ok) {
      return { success: false, message: "북마크 처리 중 서버 오류가 발생했습니다." };
    }

    // 백엔드가 준 성공 메시지 ("북마크 추가 완료" 등) 읽기
    const message = await response.text();
    return { success: true, message };
  } catch (error) {
    console.error("Bookmark Action Error:", error);
    return { success: false, message: "네트워크 오류가 발생했습니다." };
  }
}
