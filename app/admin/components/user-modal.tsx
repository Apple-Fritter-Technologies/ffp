"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";
import { User } from "@/types/interface";

interface UserModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userData: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ open, setOpen, userData }) => {
  // Only show user data for existing users
  if (!userData) {
    return null;
  }

  const handleClose = () => {
    setOpen(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === "admin" ? "destructive" : "secondary";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
        setOpen(isOpen);
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View user information and account details.
          </DialogDescription>
        </DialogHeader>

        {/* User Info Display */}
        <div className="space-y-6">
          {/* User Header */}
          <div className="bg-muted p-6 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center">
                <UserIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">
                  {userData.name || "No name"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  ID: {userData.id}
                </p>
                <Badge
                  variant={getRoleBadgeVariant(userData.role)}
                  className="mt-2"
                >
                  {userData.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Contact Information</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {userData.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Account Statistics</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Orders</p>
                  <p className="text-sm text-muted-foreground">
                    {userData.orders?.length || 0}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Messages</p>
                  <p className="text-sm text-muted-foreground">
                    {userData.contact?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Account Details</h4>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Member Since</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(userData.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4">
          <Button onClick={() => setOpen(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
