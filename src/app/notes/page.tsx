import { Metadata } from "next";
import { auth } from "@clerk/nextjs";
import { getAllNotes } from "@/server/services/NoteService";
import NoteCard from "@/components/notes/NoteCard";

export const metadata: Metadata = {
  title: "Notik - Notes",
};

const NotesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    throw Error("No user found");
  }

  const notes = await getAllNotes(userId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Notes</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => {
          return (
            <NoteCard
              key={note._id.toString()}
              note={{ ...note, _id: note._id.toString() }}
            />
          );
        })}
      </div>
      {!notes.length && (
        <p>{"You don't have any notes yet. Why don't you create one?"}</p>
      )}
    </div>
  );
};

export default NotesPage;
