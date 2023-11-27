import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100),
  content: z.string().optional(),
});

export const updateNoteSchema = createNoteSchema.extend({
  _id: z.string().min(1, { message: "Note id is required" }),
});

export const deleteNoteSchema = z.object({
  _id: z.string().min(1, { message: "Note id is required" }),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type DeleteNoteInput = z.infer<typeof deleteNoteSchema>;
