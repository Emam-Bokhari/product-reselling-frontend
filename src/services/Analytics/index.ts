"use server"
import { cookies } from "next/headers";

const getAuthToken = async () => {
    try {
        const cookieStore = await cookies();
        return cookieStore.get("accessToken")?.value || null;
    } catch {
        return null;
    }
};

export const getTotalProductsAdded = async () => {
    try {
        const token = await getAuthToken();
        if (!token) return { data: 0 };
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/analytics/total-products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        if (!res.ok) return { data: 0 };
        const data = await res.json();
        return data;
    } catch {
        return { data: 0 };
    }
}

export const getTotalPurchases = async () => {
    try {
        const token = await getAuthToken();
        if (!token) return { data: 0 };
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/analytics/total-purchases`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        if (!res.ok) return { data: 0 };
        const data = await res.json();
        return data;
    } catch {
        return { data: 0 };
    }
}

export const getTotalSales = async () => {
    try {
        const token = await getAuthToken();
        if (!token) return { data: 0 };
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/analytics/total-sales`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        if (!res.ok) return { data: 0 };
        const data = await res.json();
        return data;
    } catch {
        return { data: 0 };
    }
}

export const getMonthlySales = async () => {
    try {
        const token = await getAuthToken();
        if (!token) return { data: [] };
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/analytics/monthly-sales`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });
        if (!res.ok) return { data: [] };
        const data = await res.json();
        return data;
    } catch {
        return { data: [] };
    }
}