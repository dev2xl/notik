"use client";
import { Note } from "@/interfaces/Note";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import AddEditNoteDialog from "@/components/dialogs/AddEditNoteDialog";

export type NoteCardProps = {
  note: Note;
};
const NoteCard = ({ note }: NoteCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  //
  const wasUpdated = note.updatedAt > note.createdAt;
  //
  const createdUpdatedAtTimestamp = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setShowEditDialog(true)}
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdatedAtTimestamp}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{note.content}</p>
        </CardContent>
      </Card>
      {showEditDialog && (
        <AddEditNoteDialog
          open={showEditDialog}
          setOpen={setShowEditDialog}
          noteToEdit={note}
        />
      )}
    </>
  );
};

export default NoteCard;
