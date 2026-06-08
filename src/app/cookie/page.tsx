"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SocialCookiePage() {
  const router = useRouter();

  useEffect(() => {
    const exchangeToken = async () => {
      try {
        // 중요: Next.js 서버 액션을 거치지 않고 브라우저가 직접 백엔드(:8080)로 요청을 보냅니다.
        // 이렇게 하면 브라우저 쿠키 저장소에 방금 네이버가 구워준 'refreshToken'이 100% 실려서 넘어감.
        const response = await fetch("http://localhost:8080/jwt/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // 크로스 도메인(3000 -> 8080) 간 쿠키 전송을 허용하는 핵심 옵션
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json(); // JwtResponseDTO(accessToken) 수신

          alert("소셜 로그인 최종 성공!");

          // [팁] 받아온 accessToken을 메모리나 localStorage 등에 보관합니다.
          localStorage.setItem("accessToken", data.accessToken);

          // 메인 페이지로 안전하게 이동
          router.push("/");
        } else {
          console.error("백엔드가 401 또는 403을 반환했습니다. 토큰 검증 실패.");
          alert("인증에 실패했습니다. 다시 시도해 주세요.");
          router.push("/login");
        }
      } catch (error) {
        console.error("네트워크 통신 에러:", error);
        alert("서버와 통신 중 에러가 발생했습니다.");
        router.push("/login");
      }
    };

    exchangeToken();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-gray-400">네이버 로그인 세션을 연동 중입니다...</p>
      </div>
    </div>
  );
}
