"use server"
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

export const getMe = async () => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { data: null };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/me`, {
            method: "GET",
            headers: {
                "Authorization": token
            },
        });
        if (!res.ok) {
            return { data: null };
        }
        const data = await res.json();
        return data;
    } catch {
        return { data: null };
    }
}

export const updateProfile = async (updatedData: any) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/users/update-profile`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(updatedData),
            }
        );
        const data = await response.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update profile" };
    }
}

export const getAllUsers = async () => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { data: [] };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users`, {
            next: {
                tags: ["USER"],
            },
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        if (!res.ok) {
            return { data: [] };
        }
        const data = await res.json();
        return data;
    } catch {
        return { data: [] };
    }
};

export const getUserById = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { data: null };
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/users/${id}`,
            {
                next: {
                    tags: ["USER"],
                },
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            }
        );
        if (!res.ok) {
            return { data: null };
        }
        const data = await res.json();
        return data;
    } catch {
        return { data: null };
    }
};

export const updateUserStatusById = async (id: string, status: any) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(status)
        });
        revalidateTag("USER");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update status" };
    }
}

export const updateUserRoleById = async (id: string, status: any) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/${id}/role`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(status)
        });
        revalidateTag("USER");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update role" };
    }
}

export const deleteUserById = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            return { success: false, message: "Unauthorized" };
        }
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/users/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            }
        );
        revalidateTag("USER");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to delete user" };
    }
};
