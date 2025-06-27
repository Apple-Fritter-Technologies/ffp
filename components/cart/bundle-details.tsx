import React, { useState } from "react";
import { ChevronDown, ChevronUp, Package, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/types/interface";

interface BundleDetailsProps {
  bundleItems?: Book[];
  bundleItemsCount: number;
  bundleType: string;
  isCompact?: boolean;
}

export function BundleDetails({
  bundleItems,
  bundleItemsCount,
  bundleType,
  isCompact = false,
}: BundleDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!bundleItems || bundleItems.length === 0) {
    return (
      <Badge
        variant="default"
        className="text-xs bg-purple-100 text-purple-800 border-purple-200"
      >
        <Package className="w-3 h-3 mr-1" />
        {bundleType} ({bundleItemsCount} items)
      </Badge>
    );
  }

  if (isCompact) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-auto p-1 text-xs text-purple-700 hover:text-purple-900"
        >
          <Package className="w-3 h-3 mr-1" />
          {bundleType} ({bundleItemsCount} items)
          {isOpen ? (
            <ChevronUp className="w-3 h-3 ml-1" />
          ) : (
            <ChevronDown className="w-3 h-3 ml-1" />
          )}
        </Button>
        {isOpen && (
          <div className="mt-1 bg-purple-50 rounded-md p-2 space-y-1">
            <p className="text-xs font-medium text-purple-800 mb-1">
              Bundle includes:
            </p>
            {bundleItems.map((item, index) => (
              <div
                key={item.id || index}
                className="flex items-center space-x-2 text-xs text-purple-700"
              >
                <BookOpen className="w-3 h-3" />
                <span className="truncate">{item.title}</span>
                {item.author && (
                  <span className="text-purple-600">by {item.author}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-purple-50 rounded-md p-3 border border-purple-200">
      <div className="flex items-center space-x-2 mb-2">
        <Package className="w-4 h-4 text-purple-600" />
        <h4 className="font-medium text-sm text-purple-800">{bundleType}</h4>
        <Badge variant="outline" className="text-xs">
          {bundleItemsCount} items
        </Badge>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-purple-700 font-medium">Bundle includes:</p>
        <div className="grid gap-1">
          {bundleItems.map((item, index) => (
            <div
              key={item.id || index}
              className="flex items-start space-x-2 text-xs"
            >
              <BookOpen className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-purple-800 truncate">
                  {item.title}
                </p>
                {item.author && (
                  <p className="text-purple-600">by {item.author}</p>
                )}
                {item.genre?.name && (
                  <Badge
                    variant="outline"
                    className="text-xs mt-1 bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {item.genre.name}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
