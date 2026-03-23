"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditLinkDialog } from "./EditLinkDialog";
import { DeleteLinkDialog } from "./DeleteLinkDialog";

interface LinkCardProps {
  readonly link: {
    readonly id: number;
    readonly url: string;
    readonly slug: string;
    readonly createdAt: string;
  };
}

/**
 * Displays a shortened link card with edit and delete actions.
 *
 * @param link - The link data to display (serialized from server)
 */
export function LinkCard({ link }: LinkCardProps): React.ReactNode {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <CardTitle className="text-white">{link.slug}</CardTitle>
              <CardDescription className="truncate">
                {link.url}
              </CardDescription>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditOpen(true)}
                aria-label={`Edit link ${link.slug}`}
              >
                <Pencil className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteOpen(true)}
                aria-label={`Delete link ${link.slug}`}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-slate-500">
            Created {new Date(link.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <EditLinkDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        link={link}
      />

      <DeleteLinkDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        link={link}
      />
    </>
  );
}
