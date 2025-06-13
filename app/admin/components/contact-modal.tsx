"use client";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, MailOpen, CalendarIcon, User, AtSign } from "lucide-react";
import { toast } from "sonner";
import {
  updateContactsReadStatus,
  deleteContact,
} from "@/hooks/actions/contact-actions";
import { Contact } from "@/types/interface";
import { formatDistanceToNow } from "date-fns";

interface ContactModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  contactData: Contact | null;
  fetchContacts: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({
  open,
  setOpen,
  contactData,
  fetchContacts,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  // Mark message as read when opened
  useEffect(() => {
    if (open && contactData?.id && contactData.isRead === false) {
      handleReadStatus(true);
      setIsStatusChanged(true);
    }
  }, [open, contactData?.id]);

  // Format the date
  const formatDate = (date?: Date | string) => {
    if (!date) return "Unknown date";
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return formatDistanceToNow(parsedDate, { addSuffix: true });
  };

  const handleReadStatus = async (isRead: boolean) => {
    if (!contactData?.id) return;

    setIsLoading(true);
    try {
      const response = await updateContactsReadStatus([contactData.id], isRead);

      if (response.error) {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("Failed to update message status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!contactData?.id) return;

    if (
      !confirm(
        "Are you sure you want to delete this message? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteContact(contactData.id);

      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success("Message deleted successfully");
        setOpen(false);
        fetchContacts();
      }
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    if (isStatusChanged) {
      fetchContacts();
      setIsStatusChanged(false);
    }
  };

  if (!contactData) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {contactData.subject || "Message from " + contactData.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" /> {contactData.name}
            </span>
            <span className="flex items-center gap-1">
              <AtSign className="w-3 h-3" /> {contactData.email}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />{" "}
              {formatDate(contactData.createdAt)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {contactData.subject && (
            <div className="space-y-1">
              <Label className="text-muted-foreground text-sm">Subject</Label>
              <p className="text-lg font-semibold">{contactData.subject}</p>
            </div>
          )}

          <div className="space-y-1">
            <Label className="text-muted-foreground text-sm">Message</Label>
            <div className="bg-muted/30 rounded-lg p-4 whitespace-pre-wrap">
              {contactData.message}
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between flex-row">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
            size="sm"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>

          <div className="flex items-center gap-2">
            {contactData.isRead && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleReadStatus(!contactData.isRead)}
                disabled={isLoading}
                size="sm"
              >
                <MailOpen className="w-4 h-4 mr-2" />
                Mark as unread
              </Button>
            )}
            <Button
              type="button"
              variant="default"
              onClick={handleClose}
              size="sm"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
