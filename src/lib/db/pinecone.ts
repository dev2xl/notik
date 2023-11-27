import { Pinecone } from "@pinecone-database/pinecone";

const apiKey = process.env.PINECONE_API_KEY;
const index = process.env.PINECONE_INDEX;
const environment = process.env.PINECONE_ENVIRONMENT;

if (!apiKey || !index || !environment) {
  throw Error(
    "PINECONE_API_KEY or PINECONE_INDEX or PINECONE_ENVIRONMENT is not set",
  );
}

const pinecone = new Pinecone({ environment, apiKey });

export const notesIndex = pinecone.Index(index);
