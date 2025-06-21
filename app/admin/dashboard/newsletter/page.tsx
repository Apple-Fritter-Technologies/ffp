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
import {
  Search,
  AlertCircle,
  Loader2,
  Mail,
  Calendar,
  Download,
  FileSpreadsheet,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { getNewsletters } from "@/hooks/actions/newsletter-actions";
import { formatDate } from "@/lib/utils";

interface Newsletter {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const DashboardNewsletterPage = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Fetch newsletters
  const fetchNewsletters = async () => {
    setIsLoading(true);
    try {
      const res = await getNewsletters();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setNewsletters(res);
      }
    } catch (err: unknown) {
      setError(true);
      toast.error("Failed to fetch newsletters");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const filteredNewsletters = newsletters?.filter((newsletter) =>
    newsletter.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export to CSV function
  const exportToCSV = () => {
    if (filteredNewsletters.length === 0) {
      toast.error("No newsletters to export");
      return;
    }

    setIsExporting(true);
    try {
      // Create CSV content
      const headers = ["Email", "Subscribed Date", "ID"];
      const csvContent = [
        headers.join(","),
        ...filteredNewsletters.map((newsletter) =>
          [
            `"${newsletter.email}"`,
            `"${formatDate(newsletter.createdAt)}"`,
          ].join(",")
        ),
      ].join("\n");

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        `Exported ${filteredNewsletters.length} newsletter subscribers to CSV`
      );
    } catch (error) {
      toast.error("Failed to export CSV");
    } finally {
      setIsExporting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading newsletters...</p>
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
                  We couldn&apos;t load the newsletter subscribers at this time.
                  Please try again later.
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
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5" />
                <span>Newsletter Subscribers</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage newsletter subscriptions and export subscriber data.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{newsletters.length} total subscribers</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Stats Card */}
          <Card className="mb-6 border-l-4 border-l-green-500 bg-green-50/50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">
                    Newsletter Analytics
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-800">Total Subscribers:</span>
                      <span className="font-medium ml-2 text-green-900">
                        {newsletters.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-green-800">
                        Subscribers This Month:
                      </span>
                      <span className="font-medium ml-2 text-green-900">
                        {
                          newsletters.filter(
                            (n) =>
                              new Date(n.createdAt).getMonth() ===
                              new Date().getMonth()
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={exportToCSV}
                  disabled={isExporting || newsletters.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isExporting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isExporting ? "Exporting..." : "Export CSV"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search subscribers by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            {searchTerm && (
              <div className="text-sm text-muted-foreground">
                Showing {filteredNewsletters.length} of {newsletters.length}{" "}
                subscribers
              </div>
            )}
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Subscription Date</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Subscriber ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNewsletters?.map((newsletter) => (
                  <TableRow key={newsletter.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium">{newsletter.email}</div>
                          <div className="text-sm text-muted-foreground">
                            Active Subscriber
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(newsletter.createdAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDate(newsletter.updatedAt)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-mono text-muted-foreground">
                        {newsletter.id.slice(0, 8)}...
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredNewsletters?.length === 0 && newsletters?.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No newsletter subscribers found matching your search.</p>
            </div>
          )}

          {newsletters?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No subscribers yet</h3>
                <p>
                  Newsletter subscribers will appear here once people start
                  subscribing through your website.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardNewsletterPage;
