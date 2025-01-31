import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
  chatloading: boolean;
  handleSearch: (e: React.FormEvent) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  query,
  setQuery,
  loading,
  chatloading,
  handleSearch,
}) => {
  return (
    <form onSubmit={handleSearch} className="flex space-x-2">
      <Input
        type="text"
        placeholder="Enter your search query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" disabled={loading || chatloading}>
        Search
      </Button>
    </form>
  );
};

export default SearchForm;
