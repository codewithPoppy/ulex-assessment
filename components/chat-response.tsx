import React from "react";
import { Skeleton } from "./ui/skeleton";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

interface ChatResponseProps {
  chatloading: boolean;
  chatResponse: string;
}

const ChatResponse: React.FC<ChatResponseProps> = ({
  chatloading,
  chatResponse,
}) => {
  return chatloading ? (
    <div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4 !mt-2" />
      <Skeleton className="h-4 w-1/2 !mt-2" />
    </div>
  ) : (
    <Markdown className={"markdown"} rehypePlugins={[rehypeHighlight]}>
      {chatResponse}
    </Markdown>
  );
};

export default ChatResponse;
