import { CreateNoteInput } from "@/lib/validations/note";
import ModelNote from "@/server/models/ModelNote";
import { mongoDBConnect } from "@/lib/db/mongo";
import { Note } from "@/interfaces/Note";

/**
 * Create a note
 * @param userId
 * @param title
 * @param content
 */
export const createNote = async ({
  userId,
  title,
  content,
}: CreateNoteInput & { userId: string }): Promise<Note> => {
  // connect to db
  await mongoDBConnect();

  const newNote = new ModelNote({
    user: userId,
    title,
    content,
  });

  return newNote.save();
};

/**
 * Get all the notes for the user
 */
export const getAllNotes = async (userId: string): Promise<Note[]> => {
  // connect to db
  await mongoDBConnect();

  return ModelNote.find({ user: userId }).lean();
};

/**
 * Update note
 * @param note
 */
export const updateNote = async (
  note: Omit<Note, "updatedAt" | "createdAt">,
): Promise<Note | null> => {
  await mongoDBConnect();
  return ModelNote.findOneAndUpdate(
    { _id: note._id, user: note.user },
    {
      title: note.title,
      content: note.content,
    },
    {
      new: true,
    },
  ).lean();
};

/**
 * Delete note
 * @param noteId
 * @param userId
 */

export const deleteNote = async (noteId: string, userId: string) => {
  await mongoDBConnect();

  return ModelNote.findOneAndDelete({ _id: noteId, user: userId });
};

/**
 * Get an array of notes by their ids
 * @param ids
 */
export const getNotesWithIds = async (ids: string[]) => {
  await mongoDBConnect();

  return ModelNote.find({ _id: { $in: ids } });
};
