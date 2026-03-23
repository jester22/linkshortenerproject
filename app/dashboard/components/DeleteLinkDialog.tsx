"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteLinkAction } from "./actions";

interface DeleteLinkDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly link: {
    readonly id: number;
    readonly slug: string;
  };
}

/**
 * Confirmation dialog for deleting a shortened link.
 * Uses AlertDialog to require explicit user confirmation before deletion.
 *
 * @param open - Whether the dialog is open
 * @param onOpenChange - Callback when open state changes
 * @param link - The link to delete (id and slug for display)
 */
export function DeleteLinkDialog({
  open,
  onOpenChange,
  link,
}: DeleteLinkDialogProps): React.ReactNode {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete(): Promise<void> {
    setError("");
    setLoading(true);

    const result = await deleteLinkAction({ id: link.id });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Link</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">/{link.slug}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
