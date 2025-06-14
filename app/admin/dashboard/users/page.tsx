"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Search,
  AlertCircle,
  Loader2,
  User as UserIcon,
  Mail,
  Calendar,
  ShoppingBag,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import UserModal from "../../components/user-modal";
import { User } from "@/types/interface";
import { getUsers } from "@/hooks/actions/user-actions";

const DashboardUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await getUsers();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setUsers(res);
      }
    } catch (err: unknown) {
      setError(true);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const filteredUsers = users?.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === "admin" ? "destructive" : "secondary";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-muted-foreground">
                  We couldn&apos;t load the users at this time. Please try again
                  later.
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>User Management</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                View user information and account details. Users are created
                through the authentication system.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Clerk Management Info Card */}
          <Card className="mb-6 border-l-4 border-l-blue-500 bg-blue-50/50">
            <CardContent className="pt-4">
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    User Information & Authentication
                  </h3>
                  <p className="text-sm text-blue-800 mb-3">
                    This interface displays read-only user information. Users
                    are automatically created when they sign up through the
                    authentication system. For user management and advanced
                    settings, visit the Clerk dashboard.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open("https://dashboard.clerk.com/apps", "_blank")
                    }
                    className="border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Clerk Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.name || "No name"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {user.orders?.length || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {user.Contact?.length || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(user)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers?.length === 0 && users?.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your search.
            </div>
          )}

          {users?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users available yet. Users will appear here once they sign up
              through the authentication system.
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Modal */}
      <UserModal open={open} setOpen={setOpen} userData={selectedUser} />
    </div>
  );
};

export default DashboardUsersPage;
