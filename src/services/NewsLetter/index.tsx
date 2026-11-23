"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

const getAuthToken = async () => {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value || null;
  } catch {
    return null;
  }
};

export const addNewsLetter = async (newsLetterData: any) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/newsLetters`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newsLetterData),
    });
    revalidateTag("NEWSLETTER");

    const data = await res.json();
    return data;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to subscribe" };
  }
};

export const getAllNewsLetters = async () => {
  try {
    const token = await getAuthToken();
    if (!token) return { data: [] };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/newsLetters`,
      {
        next: {
          tags: ["NEWSLETTER"],
        },
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    if (!response.ok) return { data: [] };
    const data = await response.json();
    return data;
  } catch {
    return { data: [] };
  }
};
