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
import { Badge } from "@/components/ui/badge";
import {
  Search,
  AlertCircle,
  Loader2,
  MailOpen,
  Mail,
  CheckCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import ContactModal from "../../components/contact-modal";
import { Contact } from "@/types/interface";
import {
  getContacts,
  updateAllContactsReadStatus,
  updateContactsReadStatus,
} from "@/hooks/actions/contact-actions";
import { formatDistanceToNow } from "date-fns";

const DashboardContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch contacts
  const fetchContacts = async () => {
    setIsLoading(true);
    setError(false);
    try {
      const res = await getContacts();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setContacts(res);
      }
    } catch (err) {
      setError(true);
      toast.error("Failed to fetch contacts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };

  const handleToggleRead = async (
    contact: Contact,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();

    setIsActionLoading(true);
    try {
      const response = await updateContactsReadStatus(
        [contact.id!],
        !contact.isRead
      );

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.message);
        fetchContacts();
      }
    } catch (error) {
      toast.error("Failed to update message status");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMarkAllRead = async (isRead: boolean) => {
    setIsActionLoading(true);
    try {
      const response = await updateAllContactsReadStatus(isRead);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.message);
        fetchContacts();
      }
    } catch (error) {
      toast.error(`Failed to mark messages as ${isRead ? "read" : "unread"}`);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filter contacts by search term
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      (contact.subject &&
        contact.subject.toLowerCase().includes(searchLower)) ||
      contact.message.toLowerCase().includes(searchLower)
    );
  });

  // Get unread count
  const unreadCount = contacts.filter((contact) => !contact.isRead).length;

  // Format date
  const formatDate = (date?: Date | string) => {
    if (!date) return "Unknown";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  // Truncate text
  const truncateText = (text: string, maxLength: number = 50) => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-muted-foreground">Loading messages...</p>
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
                  We couldn't load the contact messages at this time.
                </p>
              </div>
              <Button onClick={fetchContacts} variant="outline">
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                Contact Messages
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount} unread
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage messages from your contact form
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isActionLoading || contacts.length === 0}
                onClick={() => handleMarkAllRead(true)}
              >
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all read
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isActionLoading || contacts.length === 0}
                onClick={() => handleMarkAllRead(false)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Mark all unread
              </Button>
              <Button
                variant="outline"
                size="icon"
                disabled={isActionLoading}
                onClick={fetchContacts}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isActionLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">Status</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-10">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow
                    key={contact.id}
                    className={`cursor-pointer ${
                      !contact.isRead ? "font-medium bg-muted/20" : ""
                    }`}
                    onClick={() => handleViewContact(contact)}
                  >
                    <TableCell>
                      {contact.isRead ? (
                        <MailOpen className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Mail className="w-4 h-4 text-blue-500" />
                      )}
                    </TableCell>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.subject || "-"}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate">
                        {truncateText(contact.message)}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(contact.createdAt)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleToggleRead(contact, e)}
                        disabled={isActionLoading}
                      >
                        {contact.isRead ? (
                          <Mail className="h-4 w-4" />
                        ) : (
                          <MailOpen className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredContacts.length === 0 && contacts.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No messages found matching your search.
            </div>
          )}

          {contacts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No contact messages available.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Modal */}
      <ContactModal
        open={modalOpen}
        setOpen={setModalOpen}
        contactData={selectedContact}
        fetchContacts={fetchContacts}
      />
    </div>
  );
};

export default DashboardContactsPage;
