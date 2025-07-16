import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextResponse } from "next/server";
import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAI from "openai";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  GOOGLE_GENERATIVE_AI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: GOOGLE_GENERATIVE_AI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, {
  namespace: ASTRA_DB_NAMESPACE,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const model = google("gemini-2.0-flash-001");
    const latestMessage = messages[0]?.content;

    let docContext = "";

    const embedding = await openai.embeddings.create({
      model: "text-embedding-004",
      input: latestMessage,
      encoding_format: "float",
    });

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);
      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 10,
      });
      const documents = await cursor.toArray();
      const docsMap = documents?.map((doc) => doc.text);
      docContext = JSON.stringify(docsMap);
    } catch (error) {
      console.log(error.message);
      docContext = "";
    }

    const template = {
      role: "system",
      content: `
            You are an intelligent AI, and your task is to respond thoughtfully to any message.
I will provide the context with the latest information, and if the context does not have the required information, respond using your knowledge.
--------------------------------
START CONTEXT
${docContext}
END CONTEXT
--------------------------------
The latest message in the conversation is: "${latestMessage}". Your response should be accurate, context-aware, and aligned with the conversation flow.
        `,
    };

    const result = streamText({
      model: model,
      messages: [template, ...messages],
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Something went wrong", messsage: error.message },
      { status: 500 }
    );
  }
}
