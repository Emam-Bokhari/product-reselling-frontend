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

export const addOrder = async (orderData: any) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/transactions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(orderData),
        });

        revalidateTag("ORDER");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to create order" };
    }
}

export const getPurchaseHistory = async () => {
    try {
        const token = await getAuthToken();
        if (!token) return { data: { result: [] } };

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/transactions/purchases-history`,
            {
                next: {
                    tags: ["ORDER"]
                },
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            }
        );

        if (!response.ok) return { data: { result: [] } };
        const data = await response.json();
        return data;
    } catch {
        return { data: { result: [] } };
    }
};

export const getSalesHistory = async () => {
    try {
        const token = await getAuthToken();
        if (!token) return { data: { result: [] } };

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/transactions/sales-history`,
            {
                next: {
                    tags: ["ORDER"]
                },
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
            }
        );

        if (!response.ok) return { data: { result: [] } };
        const data = await response.json();
        return data;
    } catch {
        return { data: { result: [] } };
    }
};

export const updateOrderStatusById = async (id: string, status: any) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/transactions/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(status)
        });
        revalidateTag("ORDER");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update order status" };
    }
}