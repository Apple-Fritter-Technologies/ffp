"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  AlertCircle,
  Loader2,
  Store,
  Package,
  Download,
  ChevronDown,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { StoreProduct } from "@/types/interface";
import { getProducts } from "@/hooks/actions/shop-actions";
import ShopCard from "@/components/shop-card";

const ShopPage = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch products
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const productsRes = await getProducts();

      if (productsRes.error) {
        setError(true);
        toast.error(productsRes.error);
      } else {
        // Transform the price from Decimal to number if needed
        const transformedProducts = productsRes.map((product: any) => ({
          ...product,
          price:
            typeof product.price === "string"
              ? parseFloat(product.price)
              : product.price,
        }));
        setProducts(transformedProducts);
      }
    } catch (err: unknown) {
      setError(true);
      toast.error("Failed to fetch products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter products based on search term and selected type
  const filteredProducts = products?.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      selectedType === "all" || product.productType === selectedType;

    // Only show available products
    const isAvailable = product.isAvailable;

    return matchesSearch && matchesType && isAvailable;
  });

  // Get product count for each type (only available products)
  const getProductCount = (type: string) => {
    if (type === "all")
      return products.filter((product) => product.isAvailable).length;
    return products.filter(
      (product) => product.productType === type && product.isAvailable
    ).length;
  };

  // Navigation buttons with dynamic categories
  const navigationButtons = [
    { label: "All Products", value: "all", icon: Store },
    { label: "Physical", value: "physical", icon: Package },
    { label: "Digital", value: "digital", icon: Download },
  ];

  // Get selected type label
  const getSelectedTypeLabel = () => {
    const selected = navigationButtons.find(
      (item) => item.value === selectedType
    );
    return selected ? selected.label : "All Products";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-4">
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
              <Button onClick={fetchData} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-0">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40 shadow-lg">
              <CardContent className="p-4">
                {/* Compact Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-3 flex items-center justify-center">
                      <Store className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Categories
                    </h2>
                  </div>
                  <div className="h-px bg-gradient-to-r from-border to-transparent" />
                </div>

                {/* Compact Type Buttons */}
                <div className="space-y-1">
                  {navigationButtons.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = selectedType === item.value;
                    const productCount = getProductCount(item.value);

                    return (
                      <Button
                        key={item.value}
                        onClick={() => setSelectedType(item.value)}
                        variant="ghost"
                        size="sm"
                        className={`
                            w-full justify-between h-8 px-3 text-sm transition-all duration-200
                            ${
                              isSelected
                                ? "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-l-2 border-primary"
                                : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                            }
                          `}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent
                            className={`w-3 h-3 ${
                              isSelected
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                          <span className="font-medium truncate">
                            {item.label}
                          </span>
                        </div>

                        <Badge
                          variant="secondary"
                          className={`
                              h-5 px-1.5 text-xs font-medium ml-2
                              ${
                                isSelected
                                  ? "bg-primary/20 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground"
                              }
                            `}
                        >
                          {productCount}
                        </Badge>
                      </Button>
                    );
                  })}
                </div>

                {/* Compact Footer Stats */}
                <div className="mt-4 pt-3 border-t border-border/40">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">
                      Total Available
                    </span>
                    <Badge variant="outline" className="h-5 px-2 text-xs">
                      {products.filter((product) => product.isAvailable).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile Dropdown + Search Bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            {/* Mobile Type Dropdown - Visible only on mobile */}
            <div className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto justify-between min-w-[200px]"
                  >
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4" />
                      <span>{getSelectedTypeLabel()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {getProductCount(selectedType)}
                      </Badge>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  {navigationButtons.map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = selectedType === item.value;
                    const productCount = getProductCount(item.value);

                    return (
                      <DropdownMenuItem
                        key={item.value}
                        onClick={() => setSelectedType(item.value)}
                        className={`
                            flex items-center justify-between cursor-pointer
                            ${isSelected ? "bg-primary/10 text-primary" : ""}
                          `}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        <Badge
                          variant={isSelected ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {productCount}
                        </Badge>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Responsive Products Grid - Cards fill space on small devices */}
          {filteredProducts?.length > 0 ? (
            <div
              className="grid gap-4 sm:gap-6
                grid-cols-1 
                sm:grid-cols-2 
                md:grid-cols-2
                lg:grid-cols-2 
                xl:grid-cols-3 
                2xl:grid-cols-4"
            >
              {filteredProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ShopCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Store className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm || selectedType !== "all"
                  ? "No products found"
                  : "No products available"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {searchTerm || selectedType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Products will appear here once they are added to the store."}
              </p>
              {(searchTerm || selectedType !== "all") && (
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("all");
                  }}
                  variant="outline"
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Results Summary */}
          {products?.length > 0 && (
            <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <span>
                  Showing {filteredProducts?.length} of{" "}
                  {products.filter((product) => product.isAvailable).length}{" "}
                  available products
                </span>
                {selectedType !== "all" && (
                  <Badge variant="secondary">
                    {
                      navigationButtons.find((b) => b.value === selectedType)
                        ?.label
                    }
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
