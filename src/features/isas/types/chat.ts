/* eslint-disable no-unused-vars -- callback parameter names are part of the public feature contract */
export type IsasMode = 'D' | 'I' | 'G';

export type ChatRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  status: 'streaming' | 'completed' | 'failed';
  createdAt: string;
}

export interface ChatSession {
  id: string;
  sessionId?: string;
  summary: string;
  path?: string;
  updatedAt?: string;
}

export interface ModelOption {
  model: string;
  name: string;
}

export interface EntityOption {
  value: string;
  title: string;
}

export interface SelectedEntity {
  entity: string;
  table: string;
}

export interface SendChatRequest {
  sessionId: string;
  model?: string;
  mode: IsasMode;
  query: string;
  entity?: SelectedEntity;
}

export type MentionCategory = 'tables' | 'entities' | 'sourceFiles';

export interface MentionItem {
  id: string;
  label: string;
  category: MentionCategory;
}

export interface StreamCallbacks {
  onDelta(content: string): void;
  onStatus?(message: string): void;
}
