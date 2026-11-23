"use server"
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

import { FieldValues } from "react-hook-form";


export const registerUser = async (userData: FieldValues) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });
        const result = await res.json();
        return result;
    } catch (error: any) {
        return Error(error)
    }
}

export const loginUser = async (userData: FieldValues) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userData)
        });

        const result = await res.json()

        const storeCookies = await cookies();
        if (result?.success && result?.data?.token) {
            storeCookies.set("accessToken", result.data.token, {
                path: "/",
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });
        }

        return result;

    } catch (error: any) {
        return { success: false, message: error?.message || "Login failed" };
    }
}

export const getCurrentUser = async () => {
    try {
        const accessToken = (await cookies()).get("accessToken")?.value;
        if (!accessToken) {
            return null;
        }

        const decodedData = jwtDecode(accessToken) as any;
        if (decodedData && typeof decodedData === "object" && decodedData.exp) {
            // Check if token has expired
            if (decodedData.exp * 1000 < Date.now()) {
                return null;
            }
        }
        return decodedData;
    } catch {
        return null;
    }
};

export const logoutFromCookie = async () => {
    const storeCookies = await cookies();
    storeCookies.set("accessToken", "", {
        path: "/",
        httpOnly: true,
        maxAge: 0,
    });
};

