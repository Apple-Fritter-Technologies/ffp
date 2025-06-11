"use client";

import { SignedIn, useClerk, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Package, User } from "lucide-react";

function ClerkUserButton() {
  const { user } = useClerk();
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <UserButton>
      <UserButton.MenuItems>
        {isAdmin && (
          <UserButton.Link
            label="Dashboard"
            labelIcon={<LayoutDashboard className="w-4 h-4" />}
            href="/admin/dashboard"
          />
        )}
        <UserButton.Link
          label="Account"
          labelIcon={<User className="w-4 h-4" />}
          href="/account"
        />
        <UserButton.Link
          label="Orders"
          labelIcon={<Package className="w-4 h-4" />}
          href="/orders"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}

const AppHeader = () => {
  return (
    <div className="border-b border-accent-3 bg-primary h-14 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold truncate text-white">
          Admin Dashboard
        </h1>
      </div>

      <SignedIn>
        <ClerkUserButton />
      </SignedIn>
    </div>
  );
};

export default AppHeader;
