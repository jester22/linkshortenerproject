"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateLinkAction } from "./actions";

interface EditLinkDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly link: {
    readonly id: number;
    readonly url: string;
    readonly slug: string;
  };
}

/**
 * Dialog component for editing an existing shortened link.
 * Pre-fills the form with current link data.
 *
 * @param open - Whether the dialog is open
 * @param onOpenChange - Callback when open state changes
 * @param link - The link data to edit
 */
export function EditLinkDialog({
  open,
  onOpenChange,
  link,
}: EditLinkDialogProps): React.ReactNode {
  const [url, setUrl] = useState(link.url);
  const [slug, setSlug] = useState(link.slug);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function resetForm(): void {
    setUrl(link.url);
    setSlug(link.slug);
    setError("");
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await updateLinkAction({ id: link.id, url, slug });

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>
            Update the destination URL or custom slug for this link.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-url">Destination URL</Label>
            <Input
              id="edit-url"
              type="url"
              placeholder="https://example.com/my-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-slug">Custom Slug</Label>
            <Input
              id="edit-slug"
              type="text"
              placeholder="my-link"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              pattern="^[a-zA-Z0-9-]+$"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Letters, numbers, and hyphens only. At least 3 characters.
            </p>
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
