"use server";

import { getSessionToken } from "@/lib/server-utils";
import { ApiUrl } from "@/lib/utils";
import { Contact } from "@/types/interface";
import axios from "axios";

// Get all contacts
export const getContacts = async () => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.get(`${ApiUrl}/api/contact`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch contacts",
      };
    }
    return { error: "Failed to fetch contacts" };
  }
};

// Get contact by ID
export const getContactById = async (id: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.get(`${ApiUrl}/api/contact?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch contact",
      };
    }
    return { error: "Failed to fetch contact" };
  }
};

// Submit a new contact form (doesn't require authentication)
export const submitContactForm = async (contactData: Contact) => {
  try {
    const res = await axios.post(`${ApiUrl}/api/contact`, contactData);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to submit contact form",
      };
    }
    return { error: "Failed to submit contact form" };
  }
};

// Mark contacts as read or unread
export const updateContactsReadStatus = async (
  ids: string[],
  isRead: boolean
) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.patch(
      `${ApiUrl}/api/contact`,
      { ids, isRead },
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update contact status",
      };
    }
    return { error: "Failed to update contact status" };
  }
};

// Mark all contacts as read or unread
export const updateAllContactsReadStatus = async (isRead: boolean) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.patch(
      `${ApiUrl}/api/contact`,
      { updateAll: true, isRead },
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update all contacts",
      };
    }
    return { error: "Failed to update all contacts" };
  }
};

// Delete a contact
export const deleteContact = async (id: string) => {
  const sessionToken = await getSessionToken();

  if (!sessionToken) {
    return { error: "Unauthorized" };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/contact?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete contact",
      };
    }
    return { error: "Failed to delete contact" };
  }
};
