import { NextResponse } from "next/server";

import { Pinecone } from "@pinecone-database/pinecone";
import { Client } from "@elastic/elasticsearch";
import OpenAI from "openai";

import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const pineconeClient = new Pinecone({
  apiKey:
    "pcsk_4J8A6h_ejYDhucVsYskiMBzqtQG8cEw8N5grrSe4eTcq3WLdbniwj5BrgjGAm2qJGQfaB",
});
const elasticClient = new Client({
  node: "https://f4e65a5b128a4384919f94fe815a33f8.us-central1.gcp.cloud.es.io:443",
  auth: {
    username: "elastic",
    password: "7wlJ8i6YRomkcQSj92NEpKqn",
  },
});

async function hybridSearch(query: string) {
  // Generate query embedding
  const embeddingResponse = await openai.embeddings.create({
    input: query,
    model: "text-embedding-ada-002",
  });
  const queryEmbedding = embeddingResponse.data[0].embedding;

  console.time("Pinecone Vector Search");
  console.time("Elasticsearch BM25 Search");

  // Perform Vector Search in Pinecone and BM25 Text Search in Elasticsearch concurrently
  const [vectorResults, bm25Results] = await Promise.all([
    (async () => {
      const result = await pineconeClient.index("ulex-test").query({
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true,
      });
      console.timeEnd("Pinecone Vector Search");
      return result;
    })(),
    (async () => {
      const result = await elasticClient.search({
        index: "documents",
        body: {
          query: {
            match: { text: query },
          },
        },
      });
      console.timeEnd("Elasticsearch BM25 Search");
      return result;
    })(),
  ]);

  // Combine and rank results (50% weight to each)
  const results: { [id: string]: number } = {};
  vectorResults.matches.forEach((match) => {
    results[match.id] = (results[match.id] || 0) + 0.5 * (match.score ?? 0);
  });

  bm25Results.hits.hits.forEach((hit) => {
    if (hit._id) {
      results[hit._id] =
        (results[hit._id] || 0) + (0.5 * (hit._score ?? 0)) / 30;
    }
  });

  // Sort results by combined score
  const sortedResults = Object.entries(results)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));

  return { vectorResults, bm25Results, sortedResults };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    // Perform Pinecone vector search
    const searchRes = await hybridSearch(query);

    return NextResponse.json(searchRes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
