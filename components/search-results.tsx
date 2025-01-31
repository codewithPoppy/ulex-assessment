"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { SortedResult } from "@/types";

type SearchResultsProps = {
  data: SortedResult[];
  loading: boolean;
};

const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell className="w-1/2">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </TableCell>
        <TableCell className="w-1/2">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

const ResultRow = ({ result }: { result: SortedResult }) => (
  <TableRow>
    <TableCell className="w-1/2">
      <p className="text-xs mb-2">
        {result.value?.subType + " - " + result.value?.title}
      </p>
      <p className="mb-2">
        {result.value?.description.replace(/[^\x20-\x7E]/g, "")}
      </p>
      <div className="text-xs mb-2">
        {result.value?.categories && (
          <>
            {JSON.parse(result.value.categories).map(
              (category: string, i: number) => {
                const issuerMatch = category.match(/Issuer\(s\) Name: (.+)/);
                const documentMatch = category.match(
                  /Document\(s\): \[([^\]]+)\]\(([^)]+)\)/
                );
                return (
                  <React.Fragment key={i}>
                    {issuerMatch && (
                      <div className="mb-2">
                        Issuer: <b>{issuerMatch[1]}</b>
                      </div>
                    )}
                    {documentMatch && (
                      <a
                        className="text-blue-600 underline"
                        href={documentMatch[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {"Link to Document: " + documentMatch[1]}
                      </a>
                    )}
                  </React.Fragment>
                );
              }
            )}
          </>
        )}
      </div>
    </TableCell>
    <TableCell className="line-clamp-6 text-ellipsis overflow-hidden h-[130px]">
      {result.value?.text}
    </TableCell>
  </TableRow>
);

const SearchResults: React.FC<SearchResultsProps> = ({ data, loading }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Search Results</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-80">Source</TableHead>
            <TableHead className="min-w-80">Content</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <LoadingSkeleton />
          ) : (
            data
              .slice(0, 5)
              .map((result, index) => <ResultRow key={index} result={result} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SearchResults;
