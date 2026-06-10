"use server";

const BACKEND_URL = "http://localhost:8080";

export async function requestSignup(prevState: any, formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const nickname = formData.get("nickname");

  try {
    const response = await fetch(`${BACKEND_URL}/user/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        nickname,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      message: "회원가입이 완료되었습니다.",
    };
  } catch (error) {
    console.error("signup error =", error);

    return {
      success: false,
      message: "서버와 연결할 수 없습니다.",
    };
  }
}
