import { defineStore } from 'pinia';
import type { ChatMessage, ChatSession, EntityOption, IsasMode, MentionItem, ModelOption, SelectedEntity } from '../types/chat';

const newMessage = (role: ChatMessage['role'], content: string, status: ChatMessage['status']): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  content,
  status,
  createdAt: new Date().toISOString()
});

export const useIsasChatStore = defineStore('isas-chat', {
  state: () => ({
    mode: 'D' as IsasMode,
    selectedEntityValue: '',
    entities: [] as EntityOption[],
    messages: [] as ChatMessage[],
    sessions: [] as ChatSession[],
    currentSessionId: '',
    mentions: [] as MentionItem[],
    models: [] as ModelOption[],
    selectedModel: '',
    loadingEntities: false,
    streaming: false,
    statusMessage: '',
    errorMessage: ''
  }),
  getters: {
    selectedEntity(state): SelectedEntity | undefined {
      if (!state.selectedEntityValue) return undefined;
      const [table = '', entity = ''] = state.selectedEntityValue.split('|');
      return table && entity ? { table, entity } : undefined;
    },
    canSend(state): boolean {
      return !state.streaming && (state.mode !== 'D' || Boolean(state.selectedEntityValue));
    }
  },
  actions: {
    initialize() {
      if (!this.currentSessionId) this.currentSessionId = crypto.randomUUID();
    },
    reset() {
      this.currentSessionId = crypto.randomUUID();
      this.messages = [];
      this.errorMessage = '';
      this.statusMessage = '';
    },
    setMessages(messages: ChatMessage[]) {
      this.messages = messages;
    },
    appendUserMessage(content: string) {
      this.messages.push(newMessage('user', content, 'completed'));
    },
    beginAssistantMessage(): string {
      const message = newMessage('assistant', '', 'streaming');
      this.messages.push(message);
      this.streaming = true;
      this.errorMessage = '';
      return message.id;
    },
    appendDelta(messageId: string, content: string) {
      const message = this.messages.find((item) => item.id === messageId);
      if (message) message.content += content;
    },
    completeMessage(messageId: string) {
      const message = this.messages.find((item) => item.id === messageId);
      if (message) message.status = 'completed';
      this.streaming = false;
      this.statusMessage = '';
    },
    failMessage(messageId: string, message: string) {
      const target = this.messages.find((item) => item.id === messageId);
      if (target) {
        target.status = 'failed';
        if (!target.content) target.content = message;
      }
      this.streaming = false;
      this.statusMessage = '';
      this.errorMessage = message;
    }
  }
});
