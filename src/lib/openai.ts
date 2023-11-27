import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw Error("OPENAI_API_KEY is not set");
}

const openai = new OpenAI({ apiKey });

/**
 * Get vector embedding for text
 * @param text
 */
export const getEmbedding = async (text: string) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) {
    throw Error("Error generating embedding.");
  }

  return embedding;
};

export default openai;
