import { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Download,
  Package,
  BookOpen,
  Store,
} from "lucide-react";
import { useCart } from "@/store/use-cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { getCartItemDisplayInfo } from "@/lib/cart-helpers";
import { formatPrice } from "@/lib/utils";

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    hasPhysicalItems,
    hasDigitalItems,
    getPhysicalItems,
    getDigitalItems,
    getBookItems,
    getShopItems,
    hasBookItems,
    hasShopItems,
  } = useCart();

  const handleCheckout = () => {
    setIsOpen(false);
    router.push("/checkout");
  };

  const physicalItems = getPhysicalItems();
  const digitalItems = getDigitalItems();
  const bookItems = getBookItems();
  const shopItems = getShopItems();

  const renderProductTypeIcon = (
    productType: "physical" | "digital" | undefined
  ) => {
    if (productType === "digital") {
      return <Download className="h-3 w-3 text-blue-500" />;
    }
    return <Package className="h-3 w-3 text-green-500" />;
  };

  const renderItemTypeIcon = (itemType: "book" | "shop" | undefined) => {
    if (itemType === "shop") {
      return <Store className="h-3 w-3 text-purple-500" />;
    }
    return <BookOpen className="h-3 w-3 text-orange-500" />;
  };

  const handleUpdateQuantity = (
    id: string,
    quantity: number,
    itemType: "book" | "shop" | undefined
  ) => {
    updateQuantity(id, quantity, itemType);
  };

  const handleRemoveItem = (
    id: string,
    itemType: "book" | "shop" | undefined
  ) => {
    removeItem(id, itemType);
  };

  const renderItemSection = (
    items: typeof bookItems,
    title: string,
    icon: React.ReactNode,
    itemType: "book" | "shop"
  ) => {
    if (items.length === 0) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-medium text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {items.length}
          </Badge>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => {
            const displayInfo = getCartItemDisplayInfo(item);

            return (
              <div
                key={index}
                className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/30"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {renderItemTypeIcon(item.itemType)}
                      {renderProductTypeIcon(item.productType)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      variant={
                        displayInfo.badgeVariant as
                          | "default"
                          | "secondary"
                          | "destructive"
                          | "outline"
                      }
                      className="text-xs"
                    >
                      {displayInfo.badgeText}
                    </Badge>
                    {item.productType && (
                      <Badge
                        variant={
                          item.productType === "digital"
                            ? "outline"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {item.productType}
                      </Badge>
                    )}
                  </div>

                  {displayInfo.showAuthor && (
                    <p className="text-xs text-muted-foreground mb-1">
                      by {item.author}
                    </p>
                  )}

                  {item.description && (
                    <p className="text-xs text-muted-foreground mb-1 truncate">
                      {item.description}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground mb-2">
                    {formatPrice(item.price)} each
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            item.quantity - 1,
                            item.itemType
                          )
                        }
                        className="h-7 w-7 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="font-medium text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.id,
                            item.quantity + 1,
                            item.itemType
                          )
                        }
                        className="h-7 w-7 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id, item.itemType)}
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getCartSummary = () => {
    const summary = [];

    if (hasBookItems() && hasShopItems()) {
      summary.push("Mixed Cart");
    } else if (hasBookItems()) {
      summary.push("Books");
    } else if (hasShopItems()) {
      summary.push("Shop Items");
    }

    if (hasPhysicalItems() && hasDigitalItems()) {
      summary.push("Physical & Digital");
    } else if (hasPhysicalItems()) {
      summary.push("Physical Items");
    } else if (hasDigitalItems()) {
      summary.push("Digital Items");
    }

    return summary.join(" • ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="text-accent-2 hover:text-accent-1 transition-colors relative">
          <ShoppingCart className="h-6 w-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 w-4 h-4 bg-accent-1 text-foreground rounded-full text-xs flex items-center justify-center font-medium">
              {totalItems}
            </Badge>
          )}
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>Shopping Cart</span>
              {items.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {getCartSummary()}
                </Badge>
              )}
            </div>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive"
              >
                Clear Cart
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add books or shop items to get started
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Books Section */}
              {renderItemSection(
                bookItems,
                "Books",
                <BookOpen className="h-4 w-4 text-orange-500" />,
                "book"
              )}

              {/* Separator if both sections exist */}
              {bookItems.length > 0 && shopItems.length > 0 && <Separator />}

              {/* Shop Items Section */}
              {renderItemSection(
                shopItems,
                "Shop Items",
                <Store className="h-4 w-4 text-purple-500" />,
                "shop"
              )}

              {/* Alternative grouping by product type */}
              {bookItems.length === 0 && shopItems.length === 0 && (
                <>
                  {renderItemSection(
                    physicalItems,
                    "Physical Items",
                    <Package className="h-4 w-4 text-green-500" />,
                    physicalItems[0]?.itemType as "book" | "shop"
                  )}

                  {physicalItems.length > 0 && digitalItems.length > 0 && (
                    <Separator />
                  )}

                  {renderItemSection(
                    digitalItems,
                    "Digital Items",
                    <Download className="h-4 w-4 text-blue-500" />,
                    digitalItems[0]?.itemType as "book" | "shop"
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-medium">{totalItems}</span>
                </div>

                {hasBookItems() && (
                  <div className="flex justify-between">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="h-3 w-3 text-orange-500" />
                      <span>Books:</span>
                    </span>
                    <span className="font-medium">{bookItems.length}</span>
                  </div>
                )}

                {hasShopItems() && (
                  <div className="flex justify-between">
                    <span className="flex items-center space-x-1">
                      <Store className="h-3 w-3 text-purple-500" />
                      <span>Shop:</span>
                    </span>
                    <span className="font-medium">{shopItems.length}</span>
                  </div>
                )}

                {hasPhysicalItems() && (
                  <div className="flex justify-between">
                    <span className="flex items-center space-x-1">
                      <Package className="h-3 w-3 text-green-500" />
                      <span>Physical:</span>
                    </span>
                    <span className="font-medium">{physicalItems.length}</span>
                  </div>
                )}

                {hasDigitalItems() && (
                  <div className="flex justify-between">
                    <span className="flex items-center space-x-1">
                      <Download className="h-3 w-3 text-blue-500" />
                      <span>Digital:</span>
                    </span>
                    <span className="font-medium">{digitalItems.length}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t">
                <span>Total Price:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              {hasPhysicalItems() && (
                <p className="text-xs text-muted-foreground text-center">
                  * Physical items will require shipping address
                </p>
              )}

              <Button onClick={handleCheckout} className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
