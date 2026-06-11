"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BACKEND_URL = "http://localhost:8080";

export async function requestLogout() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    // 1. 백엔드의 LogoutSuccessHandler로 리프레시 토큰 전달
    await fetch(`${BACKEND_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
  } catch (error) {
    console.error("Logout API Error:", error);
  } finally {
    // 2. 프론트엔드 쿠키 삭제
    cookieStore.delete("refreshToken");

    // 3. 로그인 페이지로 이동
    redirect("/login");
  }
}
