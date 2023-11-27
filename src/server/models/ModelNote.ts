import { model, models, Schema } from "mongoose";
import { Note } from "@/interfaces/Note";

const noteSchema = new Schema<Note>(
  {
    title: {
      type: String,
      required: true,
    },
    content: String,
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default models.Note || model<Note>("Note", noteSchema);
