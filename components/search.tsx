"use client";

import { useState } from "react";
import SearchForm from "@/components/search-form";
import ChatResponse from "@/components/chat-response";
import SearchResults from "@/components/search-results";
import { SortedResult, SearchResponse } from "@/types";
import DummyQueries from "./dummy-queries";
import { DocType } from "@/app/api/chat/route";

const getDocTypeFromResults = (sortedResults: SortedResult[]) => {
  return sortedResults.map((item) => {
    let doc_name = "";
    let doc_link = "";

    if (item.value?.categories) {
      JSON.parse(item.value.categories).forEach((category: string) => {
        const docMatch = category.match(
          /Document\(s\): \[([^\]]+)\]\(([^)]+)\)/
        );
        if (docMatch) {
          doc_name = docMatch[1];
          doc_link = docMatch[2];
        }
      });
    }

    return {
      doc_name: doc_name || item.value?.title || "",
      doc_link: doc_link || "",
      text_snippet: item.value?.text || "",
    };
  });
};

const fetchSearchResults = async (query: string) => {
  const response = await fetch(
    `/api/search?query=${encodeURIComponent(query)}`
  );
  const data: SearchResponse = await response.json();
  return data.sortedResults.map((item) => ({
    id: item.id,
    value:
      data.vectorResults.matches.find((match) => match.id === item.id)
        ?.metadata ??
      data.bm25Results.hits.hits.find((hit) => hit._id === item.id)?._source,
  }));
};

const fetchChatResponse = async (query: string, context: DocType[]) => {
  const response = await fetch(`/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, context }),
  });
  const data = await response.json();
  return data.response;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SortedResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatloading, setChatLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setChatResponse("");

    try {
      const sortedResults = await fetchSearchResults(query);
      setResults(sortedResults);
      setLoading(false);
      setChatLoading(true);

      const chatResponse = await fetchChatResponse(
        query,
        getDocTypeFromResults(sortedResults.slice(0, 5))
      );
      setChatResponse(chatResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      setChatLoading(false);
    }
  };

  return (
    <>
      <DummyQueries />
      <SearchForm
        query={query}
        setQuery={setQuery}
        loading={loading}
        chatloading={chatloading}
        handleSearch={handleSearch}
      />
      <ChatResponse chatloading={chatloading} chatResponse={chatResponse} />
      <SearchResults data={results} loading={loading} />
    </>
  );
}
