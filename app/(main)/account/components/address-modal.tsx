"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import { Address } from "@/types/interface";
import { addAddress, updateAddress } from "@/hooks/actions/address-actions";

interface AddressModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  address?: Address | null;
  onSuccess: () => void;
}

interface AddressFormData {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const AddressModal: React.FC<AddressModalProps> = ({
  open,
  setOpen,
  address,
  onSuccess,
}) => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    isDefault: false,
  });

  const isEditing = !!address;

  useEffect(() => {
    if (address) {
      setFormData({
        name: address.name,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
        phone: address.phone || "",
        isDefault: address.isDefault,
      });
    } else {
      // Pre-fill with user's name if available
      setFormData({
        name: user?.fullName || "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        phone: "",
        isDefault: false,
      });
    }
  }, [address, user, open]);

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const requiredFields = ["name", "street", "city", "state", "zipCode"];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof AddressFormData]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    // Basic ZIP/postal code validation (international format)
    // Allow alphanumeric characters, spaces, and hyphens, 3-15 characters
    const postalCodePattern = /^[A-Z0-9\s\-]{3,15}$/i;
    if (!postalCodePattern.test(formData.zipCode.trim())) {
      toast.error(
        "Please enter a valid postal/ZIP code (3-15 characters, letters, numbers, spaces, and hyphens allowed)"
      );
      return false;
    }

    // Check field lengths
    if (formData.name.length > 100) {
      toast.error("Name must be 100 characters or less");
      return false;
    }
    if (formData.street.length > 200) {
      toast.error("Street address must be 200 characters or less");
      return false;
    }
    if (formData.city.length > 100) {
      toast.error("City must be 100 characters or less");
      return false;
    }
    if (formData.state.length > 50) {
      toast.error("State must be 50 characters or less");
      return false;
    }
    if (formData.country.length > 50) {
      toast.error("Country must be 50 characters or less");
      return false;
    }
    if (formData.phone.length > 20) {
      toast.error("Phone number must be 20 characters or less");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!user?.id) {
      toast.error("User not found. Please sign in again.");
      return;
    }

    setIsLoading(true);

    try {
      const addressData = {
        ...formData,
        userId: user.id,
        phone: formData.phone || undefined, // Convert empty string to undefined
      };

      let result;
      if (isEditing && address) {
        result = await updateAddress({
          ...addressData,
          id: address.id,
        });
      } else {
        result = await addAddress(addressData);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(
          `Address ${isEditing ? "updated" : "added"} successfully`
        );
        setOpen(false);
        onSuccess();
      }
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "add"} address`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    // Reset form when closing
    if (!address) {
      setFormData({
        name: user?.fullName || "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States",
        phone: "",
        isDefault: false,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {isEditing ? "Edit Address" : "Add New Address"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your shipping address information. We ship internationally."
              : "Add a new shipping address to your account. We ship internationally."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter recipient's full name"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              type="text"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              placeholder="123 Main Street, Apt 4B"
              maxLength={200}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="New York"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State/Province *</Label>
              <Input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="NY or Ontario"
                maxLength={50}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
              <Input
                id="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={(e) =>
                  handleInputChange("zipCode", e.target.value.toUpperCase())
                }
                placeholder="10001 or K1A 0A6"
                maxLength={15}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
                placeholder="United States"
                maxLength={50}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
              maxLength={20}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                handleInputChange("isDefault", checked as boolean)
              }
            />
            <Label htmlFor="isDefault" className="text-sm">
              Set as default shipping address
            </Label>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Address" : "Add Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressModal;
