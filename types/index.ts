export interface SortedResult {
  id: string;
  value?: {
    categories: string;
    description: string;
    subType: string;
    title: string;
    text: string;
  };
}

export interface VectorResult {
  id: string;
  metadata: {
    categories: string;
    description: string;
    subType: string;
    title: string;
    text: string;
  };
}

export interface BM25Result {
  _id: string;
  _source: {
    categories: string;
    description: string;
    subType: string;
    title: string;
    text: string;
  };
}

export interface SearchResponse {
  sortedResults: SortedResult[];
  vectorResults: {
    matches: VectorResult[];
  };
  bm25Results: {
    hits: {
      hits: BM25Result[];
    };
  };
}
