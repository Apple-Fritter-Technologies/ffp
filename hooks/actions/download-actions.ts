"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import axios from "axios";

export const getDownloadLink = async (
  orderId: string,
  itemId: string,
  itemType: "book" | "shop"
) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.get(
      `${ApiUrl}/api/download?orderId=${orderId}&itemId=${itemId}&itemType=${itemType}&info=true`,
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to get download link",
      };
    }
    return { error: "Failed to get download link" };
  }
};

export const downloadItem = async (
  orderId: string,
  itemId: string,
  itemType: "book" | "shop"
) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    // This will return the direct download URL for redirection
    const downloadUrl = `${ApiUrl}/api/download?orderId=${orderId}&itemId=${itemId}&itemType=${itemType}`;

    return {
      success: true,
      downloadUrl,
      message: "Download URL generated successfully",
    };
  } catch (error: unknown) {
    return { error: "Failed to generate download URL" };
  }
};

export const getDirectDownload = async (
  orderId: string,
  itemId: string,
  itemType: "book" | "shop"
) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.get(
      `${ApiUrl}/api/download?orderId=${orderId}&itemId=${itemId}&itemType=${itemType}&direct=true`,
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
        responseType: "blob", // Important for file downloads
      }
    );

    return {
      success: true,
      data: res.data,
      headers: res.headers,
      message: "File downloaded successfully",
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to download file",
      };
    }
    return { error: "Failed to download file" };
  }
};
