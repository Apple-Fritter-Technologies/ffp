import { OrderStatus } from "@/types/interface";
import { clsx, type ClassValue } from "clsx";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle,
  Clock,
  Loader2,
  Package,
  Truck,
  XCircle,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ApiUrl = process.env.NEXT_PUBLIC_APP_URL;

// Extract YouTube video ID from URL
export const getYouTubeVideoId = (url: string) => {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

// Generate YouTube thumbnail URL
export const getYouTubeThumbnail = (videoUrl: string) => {
  const videoId = getYouTubeVideoId(videoUrl);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null;
};

export const formatTimeAgo = (dateString: Date | undefined) => {
  if (!dateString) return "Unknown"; // Handle undefined case

  const now = new Date();
  const date = new Date(dateString);
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

export const formatDate = (dateString: Date | undefined | string) => {
  if (!dateString) return "N/A";

  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateDistanceToNow = (date: Date | undefined | string) => {
  if (!date) return "Unknown";
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "shipped":
      return "outline";
    case "cancelled":
      return "destructive";
    case "pending":
    default:
      return "secondary";
  }
};

export const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return CheckCircle;
    case "processing":
      return Loader2;
    case "shipped":
      return Truck;
    case "pending":
      return Clock;
    case "cancelled":
      return XCircle;
    default:
      return Package;
  }
};
