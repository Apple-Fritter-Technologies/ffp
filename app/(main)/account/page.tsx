"use client";

import { UserProfile } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User as UserIcon,
  Mail,
  Calendar,
  ShoppingBag,
  MapPin,
  Plus,
  Edit,
  Trash2,
  Star,
  Package,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { Address, User as UserType, Order } from "@/types/interface";
import {
  getAddresses,
  deleteAddress,
  setDefaultAddress,
} from "@/hooks/actions/address-actions";
import { getOrders } from "@/hooks/actions/order-action";
import { formatDate } from "@/lib/utils";
import AddressModal from "./components/address-modal";

const AccountPage = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!isLoaded || !clerkUser) return;

    fetchUserData();
  }, [isLoaded, clerkUser]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch user info, addresses, and orders in parallel
      const [addressResult, orderResult] = await Promise.all([
        getAddresses(),
        getOrders(),
      ]);

      if (addressResult.error) {
        console.error("Failed to fetch addresses:", addressResult.error);
      } else {
        setAddresses(addressResult);
      }

      if (orderResult.error) {
        console.error("Failed to fetch orders:", orderResult.error);
      } else {
        setOrders(orderResult);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load account information");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const result = await deleteAddress(addressId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Address deleted successfully");
        fetchUserData();
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const result = await setDefaultAddress(addressId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Default address updated");
        fetchUserData();
      }
    } catch (error) {
      toast.error("Failed to update default address");
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setAddressModalOpen(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressModalOpen(true);
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!clerkUser) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground">
            You need to be signed in to view your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Quick Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleAddAddress}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => (window.location.href = "/orders")}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    View All Orders
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Account Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Account Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">
                            {clerkUser.primaryEmailAddress?.emailAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Name</p>
                          <p className="text-sm text-muted-foreground">
                            {clerkUser.fullName || "Not provided"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Total Orders</p>
                          <p className="text-sm text-muted-foreground">
                            {isLoading ? "..." : orders.length}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Member Since</p>
                          <p className="text-sm text-muted-foreground">
                            {clerkUser.createdAt
                              ? formatDate(clerkUser.createdAt)
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Addresses */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Shipping Addresses
                    </CardTitle>
                    <Button onClick={handleAddAddress} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading addresses...</div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="mb-2">No addresses saved yet</p>
                      <p className="text-sm">
                        Add your first shipping address to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`p-4 border rounded-lg ${
                            address.isDefault
                              ? "border-blue-500 bg-blue-50/50"
                              : "border-border"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{address.name}</h4>
                                {address.isDefault && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    <Star className="w-3 h-3 mr-1" />
                                    Default
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground space-y-1">
                                <p>{address.street}</p>
                                <p>
                                  {address.city}, {address.state}{" "}
                                  {address.zipCode}
                                </p>
                                <p>{address.country}</p>
                                {address.phone && <p>Phone: {address.phone}</p>}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {!address.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleSetDefaultAddress(address.id)
                                  }
                                >
                                  <Star className="w-3 h-3 mr-1" />
                                  Set Default
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditAddress(address)}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-4">Loading orders...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p className="mb-2">No orders yet</p>
                      <p className="text-sm">
                        Your order history will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map((order) => (
                        <div
                          key={order.id}
                          className="flex justify-between items-center p-3 border rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              Order #{order.id.slice(-8)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {order.createdAt
                                ? formatDate(order.createdAt)
                                : "N/A"}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "pending"
                                  ? "secondary"
                                  : order.status === "processing"
                                  ? "secondary"
                                  : order.status === "shipped"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {order.status}
                            </Badge>
                            <p className="text-sm font-medium mt-1">
                              ${order.totalPrice}
                            </p>
                          </div>
                        </div>
                      ))}
                      {orders.length > 5 && (
                        <div className="text-center pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => (window.location.href = "/orders")}
                          >
                            View All Orders
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent
          value="settings"
          className="flex flex-col justify-center items-center"
        >
          <UserProfile routing="hash" />
        </TabsContent>
      </Tabs>

      {/* Address Modal */}
      <AddressModal
        open={addressModalOpen}
        setOpen={setAddressModalOpen}
        address={editingAddress}
        onSuccess={fetchUserData}
      />
    </div>
  );
};

export default AccountPage;
