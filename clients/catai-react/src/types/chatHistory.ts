// Chat History Types
export type ChatHistoryItem = ChatSystemMessage | ChatUserMessage | ChatModelResponse;

export type ChatSystemMessage = {
  type: "system";
  text: string;
};

export type ChatUserMessage = {
  type: "user";
  text: string;
};

export type ChatModelResponse = {
  type: "model";
  response: Array<string | ChatModelFunctionCall | ChatModelSegment>;
};

export type ChatModelFunctionCall = {
  type: "functionCall";
  name: string;
  description?: string;
  params: any;
  result: any;
  rawCall?: string;
  startsNewChunk?: boolean;
};

export type ChatModelSegmentType = "thought" | "comment";

export type ChatModelSegment = {
  type: "segment";
  segmentType: ChatModelSegmentType;
  text: string;
  ended: boolean;
  raw?: string;
  startTime?: string;
  endTime?: string;
};

// Stored Chat Session
export interface StoredChatSession {
  id: string;
  title: string;
  history: ChatHistoryItem[];
  createdAt: number;
  updatedAt: number;
  systemPrompt?: string;
}

// Chat Search Result
export interface ChatSearchResult {
  sessionId: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  preview: string;
}
