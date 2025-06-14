import { Plus, Minus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types/interface";
import { useCart } from "@/store/use-cart";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="flex items-center space-x-3 p-3 border rounded-lg">
      {item.image && (
        <img
          src={item.image}
          alt={item.title}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{item.title}</h4>
        <p className="text-sm text-muted-foreground">
          {formatPrice(item.price)} each
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="font-medium text-sm w-8 text-center">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-8 w-8 p-0"
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
              onClick={() => removeItem(item.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
