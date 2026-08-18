import axiosInstance from '@/services/axiosInstance';
import runtimeConfig from '@/config/runtime';
import { getAuthenticationService } from '@/auth/service';
import type { ChatMessage, ChatSession, EntityOption, MentionCategory, ModelOption, SendChatRequest, StreamCallbacks } from '../types/chat';
import { createStreamEventParser, type ParsedStreamEvent } from './sseParser';
import type { ErdQuery, ErdRelationChange, ErdStreamCallbacks } from '../types/erd';

const buildApiUrl = (path: string): URL => {
  const base = runtimeConfig.apiBaseUrl.endsWith('/')
    ? runtimeConfig.apiBaseUrl
    : `${runtimeConfig.apiBaseUrl}/`;
  return new URL(path.replace(/^\//, ''), base);
};

function parseSelectedEntity(value: string): { table: string; entity: string } {
  const [table = '', entity = ''] = value.split('|');
  return { table, entity };
}

function buildLegacyQuery(request: SendChatRequest): string {
  if (request.mode !== 'D' || !request.entity) return request.query;
  return `${request.entity.table} Table - ${request.entity.entity} entity - ${request.query}`;
}

function dispatchEvent(event: ParsedStreamEvent, callbacks: StreamCallbacks): boolean {
  if (event.data === '[DONE]' || event.event === 'done') return true;

  if (event.event === 'status' || event.data.startsWith('SYSTEM:')) {
    callbacks.onStatus?.(event.data.replace(/^SYSTEM:/, ''));
    return false;
  }

  if (event.event === 'error') throw new Error(event.data || 'Stream failed');

  try {
    const payload = JSON.parse(event.data) as { content?: string; message?: string };
    if (payload.content) callbacks.onDelta(payload.content);
    else if (payload.message) callbacks.onStatus?.(payload.message);
  } catch {
    callbacks.onDelta(event.data);
  }
  return false;
}

export const isasApi = {
  async getEntities(): Promise<EntityOption[]> {
    const response = await axiosInstance.get<EntityOption[]>('api/entities');
    return Array.isArray(response.data) ? response.data : [];
  },

  parseSelectedEntity,

  async searchErdEntities(filter = ''): Promise<EntityOption[]> {
    const response = await axiosInstance.get<EntityOption[]>('api/v1/erd/entities', {
      params: { filter }
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  async searchMentions(category: MentionCategory, filter: string): Promise<EntityOption[]> {
    const endpoint = category === 'tables'
      ? 'api/v1/erd/tables'
      : category === 'entities'
        ? 'api/v1/erd/entities'
        : 'api/v1/files/source';
    const response = await axiosInstance.get<EntityOption[]>(endpoint, { params: { filter } });
    return Array.isArray(response.data) ? response.data : [];
  },

  async getSessions(): Promise<ChatSession[]> {
    const response = await axiosInstance.get<ChatSession[]>('api/v1/users/me/sessions');
    return Array.isArray(response.data) ? response.data : [];
  },

  async getModels(): Promise<ModelOption[]> {
    const response = await axiosInstance.get<{ models?: ModelOption[] }>('api/v1/isas/models');
    return Array.isArray(response.data.models) ? response.data.models : [];
  },

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const response = await axiosInstance.get<ChatMessage[]>(`api/v1/users/me/sessions/${encodeURIComponent(sessionId)}`);
    return Array.isArray(response.data)
      ? response.data.map((message) => ({
          ...message,
          id: message.id || crypto.randomUUID(),
          status: message.status || 'completed',
          createdAt: message.createdAt || new Date().toISOString()
        }))
      : [];
  },

  async streamErd(
    query: ErdQuery,
    callbacks: ErdStreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const url = buildApiUrl('erd/stream');
    url.searchParams.set('e', query.entityName);
    url.searchParams.set('t', query.table);
    url.searchParams.set('d', String(query.depth));
    const token = getAuthenticationService(runtimeConfig.authMode).getAccessToken();
    const response = await fetch(url, {
      signal,
      headers: {
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) throw new Error(`ERD request failed with status ${response.status}`);
    if (!response.body) throw new Error('ERD streaming response is not available');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const parser = createStreamEventParser();

    const handle = (event: ParsedStreamEvent) => {
      if (event.data === '[DONE]') return;
      const payload = JSON.parse(event.data) as { message?: string; node?: string | object; edge?: string | object };
      if (payload.message) callbacks.onStatus(payload.message);
      if (payload.node) callbacks.onNode(typeof payload.node === 'string' ? JSON.parse(payload.node) : payload.node);
      if (payload.edge) callbacks.onEdge(typeof payload.edge === 'string' ? JSON.parse(payload.edge) : payload.edge);
    };

    let streamDone = false;
    while (!streamDone) {
      const { done, value } = await reader.read();
      const events = done ? parser.flush() : parser.push(decoder.decode(value, { stream: true }));
      events.forEach(handle);
      streamDone = done;
    }
  },

  async saveErdChanges(changes: ErdRelationChange[]): Promise<void> {
    await axiosInstance.post('api/v1/erd/change', {
      changes,
      timestamp: new Date().toISOString(),
      totalChanges: changes.length
    });
  },

  async streamChat(
    request: SendChatRequest,
    callbacks: StreamCallbacks,
    signal?: AbortSignal
  ): Promise<void> {
    const url = buildApiUrl('chat/stream');
    url.searchParams.set('qType', request.mode);
    url.searchParams.set('sid', request.sessionId);
    if (request.model) url.searchParams.set('model', request.model);
    url.searchParams.set('e', request.entity?.entity ?? '');
    url.searchParams.set('userQuery', buildLegacyQuery(request));

    const auth = getAuthenticationService(runtimeConfig.authMode);
    const token = auth.getAccessToken();
    const response = await fetch(url, {
      method: 'GET',
      signal,
      headers: {
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (!response.ok) throw new Error(`Chat request failed with status ${response.status}`);
    if (!response.body) throw new Error('Streaming response is not available');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const parser = createStreamEventParser();
    let finished = false;

    while (!finished) {
      const { done, value } = await reader.read();
      const events = done
        ? parser.flush()
        : parser.push(decoder.decode(value, { stream: true }));

      for (const event of events) {
        if (dispatchEvent(event, callbacks)) {
          finished = true;
          break;
        }
      }
      if (done) break;
    }
  }
};
