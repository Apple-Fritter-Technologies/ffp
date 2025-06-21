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
    // First get the download info to get the actual download URL
    const res = await axios.get(
      `${ApiUrl}/api/download?orderId=${orderId}&itemId=${itemId}&itemType=${itemType}&info=true`,
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      }
    );

    if (res.data.success && res.data.downloadUrl) {
      return {
        success: true,
        downloadUrl: res.data.downloadUrl, // This is the actual file URL
        itemTitle: res.data.itemTitle,
        fileFormat: res.data.fileFormat,
        fileSize: res.data.fileSize,
        message: "Download URL retrieved successfully",
      };
    } else {
      return { error: "Download URL not available" };
    }
  } catch (error: unknown) {
    console.error("Download action error:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to get download URL";
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      return { error: errorMessage };
    }
    return { error: "Failed to get download URL" };
  }
};
