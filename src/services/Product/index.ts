"use server"
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getAllProducts = async () => {
    try {
        if (!process.env.NEXT_PUBLIC_BASE_API) {
            return { data: [] };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/listings`, {
            next: {
                tags: ["PRODUCT"],
                revalidate: 30,
            }
        });
        if (!res.ok) {
            return { data: [] };
        }
        const data = await res.json();
        return data;
    } catch {
        return { data: [] };
    }
}

export const getProductsByCategory = async (category: string) => {
    try {
        if (!process.env.NEXT_PUBLIC_BASE_API) {
            return { data: [] };
        }
        const norm = (category || "").toLowerCase().trim();
        // Canonical mapping between URL slugs and DB category records
        let targetCategory = norm;
        if (norm === "mobile") targetCategory = "mobiles";
        if (norm === "clothes" || norm === "fashion" || norm === "clothing") targetCategory = "cloths";

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/listings/category/${encodeURIComponent(targetCategory)}`, {
            cache: "no-store",
            next: {
                tags: ["PRODUCT"],
                revalidate: 30,
            }
        });
        if (!res.ok) {
            // Fallback: try raw category if canonical differed
            if (targetCategory !== norm) {
                const fallback = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/listings/category/${encodeURIComponent(norm)}`, {
                    cache: "no-store",
                });
                if (fallback.ok) {
                    return await fallback.json();
                }
            }
            return { data: [] };
        }
        const data = await res.json();
        return data;
    } catch {
        return { data: [] };
    }
}

export const getProductById = async (id: string) => {
    try {
        if (!process.env.NEXT_PUBLIC_BASE_API) {
            console.error("getProductById: NEXT_PUBLIC_BASE_API is not defined in environment variables!");
            return { data: null };
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/listings/${id}`, {
            cache: "no-store",
            next: {
                tags: ["PRODUCT"]
            }
        });
        if (!res.ok) {
            console.error(`getProductById error: HTTP ${res.status} ${res.statusText} for id ${id} from ${process.env.NEXT_PUBLIC_BASE_API}/listings/${id}`);
            return { data: null };
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`getProductById fetch exception for id ${id}:`, error);
        return { data: null };
    }
}


const getAuthToken = async () => {
    try {
        const cookieStore = await cookies();
        return cookieStore.get("accessToken")?.value || null;
    } catch {
        return null;
    }
};

export const getProductsByUser = async () => {
    try {
        const token = await getAuthToken();
        if (!token) return { data: [] };

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_API}/listings/byUser`,
            {
                next: {
                    tags: ["PRODUCT"],
                    revalidate: 30,
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

export const addProduct = async (productData: any) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/listings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify(productData),
        });
        revalidateTag("PRODUCT");

        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to add product" };
    }
}

export const updateProductById = async (id: string, updatedProductData: any) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/listings/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(updatedProductData)
        });
        revalidateTag("PRODUCT");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update product" };
    }
}

export const updateProductStatusById = async (id: string, status: any) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/listings/${id}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
            body: JSON.stringify(status)
        });
        revalidateTag("PRODUCT");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to update product status" };
    }
}

export const deleteProductById = async (id: string) => {
    try {
        const token = await getAuthToken();
        if (!token) return { success: false, message: "Unauthorized" };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/listings/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token,
            },
        });
        revalidateTag("PRODUCT");
        const data = await res.json();
        return data;
    } catch (error: any) {
        return { success: false, message: error?.message || "Failed to delete product" };
    }
}