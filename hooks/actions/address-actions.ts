"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import { AddressFormData } from "@/types/interface";
import axios from "axios";

export const getAddresses = async (userId?: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const params = userId ? `?userId=${userId}` : "";
    const res = await axios.get(`${ApiUrl}/api/address${params}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch addresses",
      };
    }
    return { error: "Failed to fetch addresses" };
  }
};

export const getAddressById = async (id: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.get(`${ApiUrl}/api/address?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch address",
      };
    }
    return { error: "Failed to fetch address" };
  }
};

export const addAddress = async (address: AddressFormData) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.post(`${ApiUrl}/api/address`, address, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to add address",
      };
    }
    return { error: "Failed to add address" };
  }
};

export const updateAddress = async (address: AddressFormData) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.put(
      `${ApiUrl}/api/address?id=${address.id}`,
      address,
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update address",
      };
    }
    return { error: "Failed to update address" };
  }
};

export const deleteAddress = async (id: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/address?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete address",
      };
    }
    return { error: "Failed to delete address" };
  }
};

export const setDefaultAddress = async (id: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.patch(
      `${ApiUrl}/api/address?id=${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to set default address",
      };
    }
    return { error: "Failed to set default address" };
  }
};
