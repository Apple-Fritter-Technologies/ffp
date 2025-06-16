"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Package,
  Download,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { toast } from "sonner";
import { StoreProduct } from "@/types/interface";
import { getProducts } from "@/hooks/actions/shop-actions";
import ShopModal from "../../components/shop-modal";

const DashboardShopPage = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortField, setSortField] = useState<"title" | "price" | "createdAt">(
    "createdAt"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<"all" | "physical" | "digital">(
    "all"
  );
  const [filterAvailability, setFilterAvailability] = useState<
    "all" | "available" | "unavailable"
  >("all");

  // Fetch products
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const response = await getProducts();
      if (response.error) {
        setError(true);
        toast.error(response.error);
      } else {
        // Transform the price from Decimal to number if needed
        const transformedProducts = response.map((product: any) => ({
          ...product,
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
        }));
        setProducts(transformedProducts);
      }
    } catch (err) {
      setError(true);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle modal operations
  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: StoreProduct) => {
    setSelectedProduct(product);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleModalSuccess = () => {
    fetchProducts();
  };

  // Sorting function
  const handleSort = (field: "title" | "price" | "createdAt") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" || product.productType === filterType;

      const matchesAvailability =
        filterAvailability === "all" ||
        (filterAvailability === "available" && product.isAvailable) ||
        (filterAvailability === "unavailable" && !product.isAvailable);

      return matchesSearch && matchesType && matchesAvailability;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get statistics
  const totalProducts = products.length;
  const availableProducts = products.filter((p) => p.isAvailable).length;
  const physicalProducts = products.filter(
    (p) => p.productType === "physical"
  ).length;
  const digitalProducts = products.filter(
    (p) => p.productType === "digital"
  ).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4 text-center">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Something went wrong</h3>
                <p className="text-muted-foreground">
                  We couldn&apos;t load the products at this time. Please try
                  again later.
                </p>
              </div>
              <Button onClick={fetchProducts} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Shop Management</h1>
          <p className="text-muted-foreground">
            Manage your store products and inventory
          </p>
        </div>
        <Button onClick={handleCreateProduct} className="w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Physical Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{physicalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Digital Products
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{digitalProducts}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Type:{" "}
                    {filterType === "all"
                      ? "All"
                      : filterType === "physical"
                      ? "Physical"
                      : "Digital"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterType("all")}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("physical")}>
                    Physical
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterType("digital")}>
                    Digital
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Status:{" "}
                    {filterAvailability === "all"
                      ? "All"
                      : filterAvailability === "available"
                      ? "Available"
                      : "Unavailable"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setFilterAvailability("all")}
                  >
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterAvailability("available")}
                  >
                    Available
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setFilterAvailability("unavailable")}
                  >
                    Unavailable
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {filteredAndSortedProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("title")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Title
                      {sortField === "title" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="w-4 h-4 ml-1" />
                        ) : (
                          <SortDesc className="w-4 h-4 ml-1" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("price")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Price
                      {sortField === "price" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="w-4 h-4 ml-1" />
                        ) : (
                          <SortDesc className="w-4 h-4 ml-1" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("createdAt")}
                      className="h-auto p-0 hover:bg-transparent"
                    >
                      Created
                      {sortField === "createdAt" &&
                        (sortDirection === "asc" ? (
                          <SortAsc className="w-4 h-4 ml-1" />
                        ) : (
                          <SortDesc className="w-4 h-4 ml-1" />
                        ))}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{product.title}</div>
                        {product.description && (
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {product.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.productType === "digital"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {product.productType === "digital" ? (
                          <Download className="w-3 h-3 mr-1" />
                        ) : (
                          <Package className="w-3 h-3 mr-1" />
                        )}
                        {product.productType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.isAvailable ? "default" : "destructive"
                        }
                      >
                        {product.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {product.productType === "digital" &&
                            product.downloadUrl && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <a
                                    href={product.downloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="cursor-pointer"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                  </a>
                                </DropdownMenuItem>
                              </>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ||
                filterType !== "all" ||
                filterAvailability !== "all"
                  ? "No products found"
                  : "No products yet"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {searchTerm ||
                filterType !== "all" ||
                filterAvailability !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first product to the store."}
              </p>
              {searchTerm ||
              filterType !== "all" ||
              filterAvailability !== "all" ? (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                    setFilterAvailability("all");
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              ) : (
                <Button onClick={handleCreateProduct} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Product
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      {products.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {filteredAndSortedProducts.length} of {products.length}{" "}
            products
          </div>
        </div>
      )}

      {/* Modal */}
      <ShopModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        product={selectedProduct}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default DashboardShopPage;
