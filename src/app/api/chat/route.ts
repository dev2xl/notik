import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { notesIndex } from "@/lib/db/pinecone";
import { getNotesWithIds } from "@/server/services/NoteService";
import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import ChatCompletionSystemMessageParam = OpenAI.ChatCompletionSystemMessageParam;
import ChatCompletionMessage = OpenAI.ChatCompletionMessage;

export const POST = async (req: Request) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    const messagesTruncated = messages.slice(-6);

    // Create vector embedding from message history
    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n"),
    );

    // Query the vector database
    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: { userId },
    });

    // Retrieve the notes content from db based on the result of the vector
    const relevantNotes = await getNotesWithIds(
      vectorQueryResponse.matches.map((match) => match.id),
    );

    const systemMessageContent =
      "You are an intelligent note-taking app. You answer the user's question based on their existing notes." +
      "The relevant notes for this query are:\n" +
      relevantNotes
        .map((note) => `Title: ${note.title}\n\nContent:\n${note.content}`)
        .join("\n\n");

    const systemMessage: ChatCompletionSystemMessageParam = {
      role: "system",
      content: systemMessageContent,
    };

    // Query chatgpt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
    });

    // Create response stream
    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
