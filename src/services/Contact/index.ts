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

export const getAllContacts = async () => {
    try {
        const token = await getAuthToken();
        if (!token) return { data: [] };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/contacts`, {
            next: {
                tags: ["CONTACT"],
            },
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        if (!res.ok) return { data: [] };
        const data = await res.json();
        return data;
    } catch {
        return { data: [] };
    }
};

export const getContactById = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) return { data: null };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/contacts/${id}`,
            {
                next: {
                    tags: ["CONTACT"],
                },
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            }
        );
        if (!res.ok) return { data: null };
        const data = await res.json();
        return data;
    } catch {
        return { data: null };
    }
};

export const addContact = async (contactData: any) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/contacts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(contactData),
        });

        revalidateTag("CONTACT");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to submit contact" };
    }
};

export const deleteContactById = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/contacts/${id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            }
        );
        revalidateTag("CONTACT");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to delete contact" };
    }
};