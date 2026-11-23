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

export const addBlog = async (blogData: any) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: (await cookies()).get("accessToken")!.value,
            },
            body: JSON.stringify(blogData),
        });
        revalidateTag("BLOG");

        const data = await res.json();

        return data;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const updateBlogById = async (id: string, updatedBlogData: any) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: (await cookies()).get("accessToken")!.value,
            },
            body: JSON.stringify(updatedBlogData),
        });
        revalidateTag("BLOG");
        const data = await res.json();
        return data;
    } catch (error: any) {
        throw new Error(error);
    }
};

export const deleteBlogById = async (id: string) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/blogs/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: (await cookies()).get("accessToken")!.value,
            },
        });
        revalidateTag("BLOG");
        const data = await res.json();
        return data;
    } catch (error: any) {
        throw new Error(error);
    }
};