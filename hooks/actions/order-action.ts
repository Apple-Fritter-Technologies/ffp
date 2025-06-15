"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import { CreateOrderData, OrderStatus } from "@/types/interface";

import axios from "axios";

interface UpdateOrderParams {
  id: string;
  status: OrderStatus;
  shippingAddressId?: string;
}

export const getOrders = async () => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "Unauthorized" };
    }

    const res = await axios.get(`${ApiUrl}/api/orders`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch orders",
      };
    }
    return { error: "Failed to fetch orders" };
  }
};

export const getOrderById = async (id: string) => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "Unauthorized" };
    }

    const res = await axios.get(`${ApiUrl}/api/orders?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch order",
      };
    }
    return { error: "Failed to fetch order" };
  }
};

// Add this new action for updating order status from client
export const updateOrderStatusAction = async (params: UpdateOrderParams) => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "Unauthorized" };
    }

    const updateData = {
      status: params.status,
      shippingAddressId: params.shippingAddressId,
    };

    const res = await axios.put(
      `${ApiUrl}/api/orders?id=${params.id}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update order status",
      };
    }
    return { error: "Failed to update order status" };
  }
};

export const updateOrderStatus = async (params: UpdateOrderParams) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const updateData: UpdateOrderParams = {
      id: params.id,
      status: params.status,
      shippingAddressId: params.shippingAddressId,
    };

    const res = await axios.put(
      `${ApiUrl}/api/orders?id=${params.id}`,
      updateData,
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update order status",
      };
    }
    return { error: "Failed to update order status" };
  }
};

export const createOrder = async (orderData: CreateOrderData) => {
  try {
    const sessionToken = await getSessionToken();

    if (!sessionToken) {
      return { error: "Unauthorized" };
    }

    const res = await axios.post(`${ApiUrl}/api/orders`, orderData, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to create order",
      };
    }
    return { error: "Failed to create order" };
  }
};

export const updateAdminOrderStatus = async (
  id: string,
  status: OrderStatus,
  shippingAddressId?: string
) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const updateData: any = { status };
    if (shippingAddressId) {
      updateData.shippingAddressId = shippingAddressId;
    }

    const res = await axios.put(`${ApiUrl}/api/orders?id=${id}`, updateData, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update order",
      };
    }
    return { error: "Failed to update order" };
  }
};

export const getOrdersByStatus = async (status: OrderStatus) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.get(`${ApiUrl}/api/orders?status=${status}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch orders",
      };
    }
    return { error: "Failed to fetch orders" };
  }
};
