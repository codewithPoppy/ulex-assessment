import { NextResponse } from "next/server";

import OpenAI from "openai";

import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export type DocType = {
  doc_name: string;
  doc_link: string;
  text_snippet: string;
};

function formatPrompt(query: string, retrievedDocs: DocType[]) {
  const context = retrievedDocs
    .map(
      (doc) =>
        `- **Document Name:** ${doc.doc_name}\n  - **Source:** ${doc.doc_link}\n  - **Extracted Text:** ${doc.text_snippet}`
    )
    .join("\n\n");

  return `You are an AI assistant that answers questions using the provided context. Always cite sources by including the document name and link where relevant.\n\n**Context:**\n${context}\n\n**User Question:** ${query}\n\n**Answer:**`;
}

export async function POST(request: Request) {
  const { query, context } = await request.json();

  if (!query || !context) {
    return NextResponse.json(
      { error: "Query and context parameters are required" },
      { status: 400 }
    );
  }

  const prompt = formatPrompt(query, context);

  try {
    // Send a request to the OpenAI ChatGPT model
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Respond in Markdown format",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
    });

    const chatResponse = response.choices[0].message?.content;

    return NextResponse.json({ response: chatResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
