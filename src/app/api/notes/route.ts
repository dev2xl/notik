import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validations/note";
import { auth } from "@clerk/nextjs";
import {
  createNote,
  deleteNote,
  updateNote,
} from "@/server/services/NoteService";
import { revalidatePath } from "next/cache";
import { getEmbedding } from "@/lib/openai";
import { runInMongoDBTransaction } from "@/lib/db/mongo";
import { notesIndex } from "@/lib/db/pinecone";

export const POST = async (req: Request) => {
  try {
    // Validate input
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const { title, content } = parseResult.data;

    // Check user is logged in
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate embedding for note
    const embedding = await getEmbeddingForNote(title, content);

    if (!embedding) {
      return Response.json(
        { error: "Error generating embedding" },
        { status: 500 },
      );
    }

    // Save on database with transaction
    const note = await runInMongoDBTransaction(async (session) => {
      // Create note
      const note = await createNote({ userId, title, content });

      // Save vector embeddings to pinecone
      await notesIndex.upsert([
        {
          id: note._id.toString(),
          values: embedding,
          metadata: { userId },
        },
      ]);

      return note;
    });

    revalidatePath("/notes", "page");

    return Response.json({ note }, { status: 201 });
  } catch (e) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

/**
 * Update note
 * @param req
 * @constructor
 */

export const PUT = async (req: Request) => {
  try {
    // Validate input
    const body = await req.json();
    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Check user is logged in
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content, _id } = parseResult.data;

    // Generate embedding for note
    const embedding = await getEmbeddingForNote(title, content);

    if (!embedding) {
      return Response.json(
        { error: "Error generating embedding" },
        { status: 500 },
      );
    }

    // Save on database with transaction
    const note = await runInMongoDBTransaction(async (session) => {
      // Update the note
      const note = await updateNote({ _id, title, content, user: userId });

      // Save vector embeddings to pinecone
      await notesIndex.upsert([
        {
          id: _id.toString(),
          values: embedding,
          metadata: { userId },
        },
      ]);

      return note;
    });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    revalidatePath("/notes", "page");

    return Response.json({ note }, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

/**
 * Delete note
 * @param req
 * @constructor
 */

export const DELETE = async (req: Request) => {
  try {
    // Validate input
    const body = await req.json();
    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Check user is logged in
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete from database with transaction
    const note = await runInMongoDBTransaction(async (session) => {
      // Delete the note
      const note = await deleteNote(parseResult.data._id, userId);

      // Delete vector embeddings from pinecone
      await notesIndex.deleteOne(parseResult.data._id);

      return note;
    });

    if (!note) {
      return Response.json({ error: "Note not found" }, { status: 404 });
    }

    revalidatePath("/notes", "page");

    return Response.json({ message: "Note deleted" }, { status: 200 });
  } catch (e) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};

/**
 * Get embedding for note
 * @param title
 * @param content
 */
const getEmbeddingForNote = async (title: string, content?: string) => {
  return getEmbedding(`${title}${content ? `\n\n${content}` : ""}`);
};
