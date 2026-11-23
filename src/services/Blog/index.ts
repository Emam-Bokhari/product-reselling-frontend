"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllBlogs = async () => {
    try {
        if (!process.env.NEXT_PUBLIC_BASE_API) {
            return { data: [] };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs`, {
            next: {
                tags: ["BLOG"],
            },
        });
        if (!res.ok) {
            return { data: [] };
        }
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { data: [], error: error?.message || error };
    }
};

export const getBlogById = async (id: string) => {
    try {
        if (!process.env.NEXT_PUBLIC_BASE_API) {
            return { data: null };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs/${id}`, {
            next: {
                tags: ["BLOG"],
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
};

const getAuthToken = async () => {
    try {
        const cookieStore = await cookies();
        return cookieStore.get("accessToken")?.value || null;
    } catch {
        return null;
    }
};

export const addBlog = async (blogData: any) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(blogData),
        });
        revalidateTag("BLOG");

        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to add blog" };
    }
};

export const updateBlogById = async (id: string, updatedBlogData: any) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(updatedBlogData),
        });
        revalidateTag("BLOG");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update blog" };
    }
};

export const deleteBlogById = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
        });
        revalidateTag("BLOG");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to delete blog" };
    }
};