export type ChatMessageRole = 'user' | 'assistant';

export interface ChatMessage {
  readonly id: string;
  readonly role: ChatMessageRole;
  readonly content: string;
  readonly timestamp: number;
}
