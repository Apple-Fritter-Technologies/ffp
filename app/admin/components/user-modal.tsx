"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Trash2,
  User as UserIcon,
  Mail,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { addUser, updateUser, deleteUser } from "@/hooks/actions/user-actions";
import { User } from "@/types/interface";

interface UserModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  fetchUsers: () => void;
  userData: User | null;
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  setOpen,
  userData,
  fetchUsers,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    clerkId: "",
    email: "",
    name: "",
    role: "USER",
  });

  const isEdit = userData !== null;

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (open) {
      setFormData({
        clerkId: userData?.clerkId || "",
        email: userData?.email || "",
        name: userData?.name || "",
        role: userData?.role || "USER",
      });
    } else {
      // Reset form when modal closes
      setFormData({
        clerkId: "",
        email: "",
        name: "",
        role: "USER",
      });
    }
  }, [open, userData]);

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!isEdit && !formData.clerkId.trim()) {
      toast.error("Clerk ID is required for new users");
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await addUser({
        clerkId: formData.clerkId.trim(),
        email: formData.email.trim(),
        name: formData.name.trim() || undefined,
        role: formData.role as "USER" | "ADMIN",
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User created successfully");
        setOpen(false);
        fetchUsers();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!userData || !validateForm()) return;

    setIsLoading(true);
    try {
      const response = await updateUser({
        id: userData.id,
        email: formData.email.trim(),
        name: formData.name.trim() || undefined,
        role: formData.role as "USER" | "ADMIN",
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User updated successfully");
        setOpen(false);
        fetchUsers();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!userData) return;

    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteUser(userData.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("User deleted successfully");
        setOpen(false);
        fetchUsers();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEdit) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      clerkId: "",
      email: "",
      name: "",
      role: "USER",
    });
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
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
          <DialogTitle>{isEdit ? "Edit User" : "Create New User"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update user information, change role, or delete the user."
              : "Add a new user to the system."}
          </DialogDescription>
        </DialogHeader>

        {/* User Info Display for Edit Mode */}
        {isEdit && userData && (
          <div className="bg-muted p-4 rounded-lg space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-medium">{userData.name || "No name"}</h4>
                <p className="text-sm text-muted-foreground">
                  ID: {userData.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>Orders: {userData.orders?.length || 0}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Joined: {formatDate(userData.createdAt)}</span>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="clerkId">Clerk ID *</Label>
                <Input
                  id="clerkId"
                  value={formData.clerkId}
                  onChange={(e) =>
                    setFormData({ ...formData, clerkId: e.target.value })
                  }
                  placeholder="Enter Clerk ID"
                  disabled={isLoading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter email address"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter full name"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            {isEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
                className="mr-auto w-full sm:w-auto"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="sm:hidden">Delete User</span>
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Processing..."
                : isEdit
                ? "Update User"
                : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
