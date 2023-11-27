import { Types } from "mongoose";

export interface Note {
  _id: Types.ObjectId | string;
  title: string;
  content?: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}
