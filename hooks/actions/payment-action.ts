"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import axios from "axios";

export const createPaymentSession = async (orderId: any) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.post(
      `${ApiUrl}/api/payment`,
      { orderId },
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error || "Failed to create payment session",
      };
    }
    return { error: "Failed to create payment session" };
  }
};

export const getPaymentDetails = async (
  sessionId?: string,
  orderId?: string
) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const params = new URLSearchParams();
    if (sessionId) params.append("sessionId", sessionId);
    if (orderId) params.append("orderId", orderId);

    const res = await axios.get(`${ApiUrl}/api/payment?${params.toString()}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to retrieve payment",
      };
    }
    return { error: "Failed to retrieve payment" };
  }
};

export const getPaymentBySessionId = async (sessionId: string) => {
  return getPaymentDetails(sessionId);
};

export const getPaymentsByOrderId = async (orderId: string) => {
  return getPaymentDetails(undefined, orderId);
};
