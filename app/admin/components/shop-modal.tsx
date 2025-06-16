"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  StoreProduct,
  StoreProductFormData,
  ProductType,
} from "@/types/interface";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/hooks/actions/shop-actions";

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  product?: StoreProduct | null;
  onSuccess: () => void; // Callback to refresh products list
}

const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  mode,
  product,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<StoreProductFormData>({
    id: product?.id || "",
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || 0,
    imageUrl: product?.imageUrl || "",
    buttonText: product?.buttonText || "Buy Now",
    isAvailable: product?.isAvailable ?? true,
    productType: (product?.productType || "physical") as ProductType,
    downloadUrl: product?.downloadUrl || "",
    fileSize: product?.fileSize || "",
    format: product?.format || "",
  });

  const isEdit = mode === "edit";

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        id: product?.id || "",
        title: product?.title || "",
        description: product?.description || "",
        price: product?.price || 0,
        imageUrl: product?.imageUrl || "",
        buttonText: product?.buttonText || "Buy Now",
        isAvailable: product?.isAvailable ?? true,
        productType: (product?.productType || "physical") as ProductType,
        downloadUrl: product?.downloadUrl || "",
        fileSize: product?.fileSize || "",
        format: product?.format || "",
      });
    }
  }, [isOpen, product]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error("Valid price is required");
      return false;
    }

    // Additional validation for digital products
    if (formData.productType === "digital") {
      if (!formData.downloadUrl?.trim()) {
        toast.error("Download URL is required for digital products");
        return false;
      }
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await addProduct({
        ...formData,
        price: formData.price,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Product created successfully");
        onClose();
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product"
      );
    }
    setIsLoading(false);
  };

  const handleUpdate = async () => {
    if (!product || !validateForm()) return;

    setIsLoading(true);
    try {
      const response = await updateProduct({
        ...formData,
        id: product.id, // Ensure we pass the existing product ID
        price: formData.price,
      });

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Product updated successfully");
        onClose();
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update product"
      );
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (!product) return;

    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteProduct(product.id!);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Product deleted successfully");
        onClose();
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    }
    setIsLoading(false);
  };

  const handleSubmit = () => {
    if (isEdit) {
      handleUpdate();
    } else {
      handleCreate();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Product" : "Create New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update product information or delete the product."
              : "Add a new product to your store."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Product title"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Product description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="productType">Product Type *</Label>
              <Select
                value={formData.productType}
                onValueChange={(value: "physical" | "digital") =>
                  setFormData({
                    ...formData,
                    productType: value as ProductType,
                  })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl || ""}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="https://..."
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={formData.buttonText || ""}
                onChange={(e) =>
                  setFormData({ ...formData, buttonText: e.target.value })
                }
                placeholder="Buy Now"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Digital Product Fields */}
          {formData.productType === "digital" && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <h3 className="text-sm font-medium">Digital Product Details</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="downloadUrl">Download URL *</Label>
                  <Input
                    id="downloadUrl"
                    value={formData.downloadUrl || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, downloadUrl: e.target.value })
                    }
                    placeholder="https://download-link.com"
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fileSize">File Size</Label>
                    <Input
                      id="fileSize"
                      value={formData.fileSize || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, fileSize: e.target.value })
                      }
                      placeholder="e.g., 25 MB"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Input
                      id="format"
                      value={formData.format || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, format: e.target.value })
                      }
                      placeholder="e.g., PDF, EPUB"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isAvailable: checked })
                }
                disabled={isLoading}
              />
              <Label htmlFor="isAvailable">Available</Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          {isEdit && (
            <Button
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
              <span className="sm:hidden">Delete Product</span>
            </Button>
          )}

          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading
              ? "Processing..."
              : isEdit
              ? "Update Product"
              : "Create Product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShopModal;
