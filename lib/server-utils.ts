"use server";

import { auth, verifyToken } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

interface AuthResponse {
  authorized: boolean;
  user?: any;
  error?: string;
}

export const getSessionToken = async () => {
  const { getToken } = await auth();
  const token = await getToken();
  return token || null;
};

// Verify clerk session token
export const verifySession = async (
  req: NextRequest
): Promise<AuthResponse> => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, error: "Authentication required" };
  }
  const token = authHeader.slice(7).trim();

  try {
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    return { authorized: true, user: decoded };
  } catch (error) {
    return { authorized: false, error: "Invalid or expired token" };
  }
};
