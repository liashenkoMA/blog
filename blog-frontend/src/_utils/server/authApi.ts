"use server";

import { ILoginFormData, ILoginResponse } from "@/_interfaces/interfaces";
import { cookies } from "next/headers";

const address = {
  baseUrl: process.env.API_BASE_URL,
};

export async function login(formData: ILoginFormData) {
  try {
    const res = await fetch(`${address.baseUrl}/auth/signin`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`${err.message}`);
    }

    const data: ILoginResponse = await res.json();

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    (await cookies()).set("session_blog_lm", data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return {
      message: "Добро пожаловать!",
    };
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }

    throw new Error("Network error");
  }
}
