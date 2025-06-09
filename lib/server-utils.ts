"use server";

import { checkRole } from "@/lib/roles";

export const isAdmin = await checkRole("admin");
