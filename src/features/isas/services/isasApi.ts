import axiosInstance from '@/services/axiosInstance';
import runtimeConfig from '@/config/runtime';
import { getAuthenticationService } from '@/auth/service';
import { decodeJwt } from '@/utils/jwt';
import type { ChatMessage, ChatSession, EntityOption, MentionCategory, SendChatRequest, StreamCallbacks } from '../types/chat';
import { createStreamEventParser, type ParsedStreamEvent } from './sseParser';
import type { ErdQuery, ErdRelationChange, ErdStreamCallbacks } from '../types/erd';

const buildApiUrl = (path: string): URL => {
  const configuredBase = runtimeConfig.apiBaseUrl.startsWith('/')
    ? new URL(runtimeConfig.apiBaseUrl, window.location.origin).toString()
    : runtimeConfig.apiBaseUrl;
  const base = configuredBase.endsWith('/')
    ? configuredBase
    : `${configuredBase}/`;
  return new URL(path.replace(/^\//, ''), base);
};

const currentUserId = (): string => {
  const auth = getAuthenticationService(runtimeConfig.authMode);
  const token = auth.getAccessToken();
  const claims = token ? decodeJwt<{ sub?: string; userId?: string }>(token) : null;
  const user = auth.getCurrentUser() as { id?: string; userId?: string; sub?: string } | null;
  const userId = claims?.userId || claims?.sub || user?.userId || user?.id || user?.sub;
  if (!userId) throw new Error('شناسه کاربر برای دریافت گفتگوها در دسترس نیست');
  return userId;
};

const sessionsEndpoint = (sessionId?: string) => {
  const base = `api/v1/users/${encodeURIComponent(currentUserId())}/sessions`;
  return sessionId ? `${base}/${encodeURIComponent(sessionId)}` : base;
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
    const response = await axiosInstance.get<EntityOption[]>('api/v1/erd/entities', {
      params: { filter: '' }
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  parseSelectedEntity,

  async searchErdEntities(filter = '', signal?: AbortSignal): Promise<EntityOption[]> {
    const response = await axiosInstance.get<EntityOption[]>('api/v1/erd/entities', {
      params: { filter },
      signal
    });
    return Array.isArray(response.data) ? response.data : [];
  },

  async searchMentions(category: MentionCategory, filter: string): Promise<EntityOption[]> {
    const endpoint = category === 'tables'
      ? 'api/v1/erd/tables'
      : category === 'entities'
        ? 'api/v1/erd/entities'
        : 'api/v1/erd/source';
    const response = await axiosInstance.get<EntityOption[]>(endpoint, { params: { filter } });
    return Array.isArray(response.data) ? response.data : [];
  },

  async getSessions(): Promise<ChatSession[]> {
    const response = await axiosInstance.get<ChatSession[]>(sessionsEndpoint());
    return Array.isArray(response.data) ? response.data : [];
  },

  async getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
    const response = await axiosInstance.get<ChatMessage[]>(sessionsEndpoint(sessionId));
    return Array.isArray(response.data)
      ? response.data.map((message) => ({
          ...message,
          id: message.id || crypto.randomUUID(),
          status: message.status || 'completed',
          createdAt: message.createdAt || new Date().toISOString()
        }))
      : [];
  },

  async deleteSession(sessionId: string): Promise<void> {
    await axiosInstance.delete(sessionsEndpoint(sessionId));
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
        // The current backend returns an SSE body but negotiates requests as JSON.
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });
    if (!response.ok) throw new Error(`ERD request failed with status ${response.status}`);
    if (!response.body) throw new Error('ERD streaming response is not available');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const parser = createStreamEventParser();

    const handle = (event: ParsedStreamEvent): boolean => {
      if (event.data === '[DONE]' || event.event === 'done') return true;
      const payload = JSON.parse(event.data) as { message?: string; node?: string | object; edge?: string | object };
      if (payload.message) callbacks.onStatus(payload.message);
      if (payload.node) callbacks.onNode(typeof payload.node === 'string' ? JSON.parse(payload.node) : payload.node);
      if (payload.edge) callbacks.onEdge(typeof payload.edge === 'string' ? JSON.parse(payload.edge) : payload.edge);
      return false;
    };

    let streamDone = false;
    while (!streamDone) {
      const { done, value } = await reader.read();
      const decoded = done
        ? decoder.decode()
        : decoder.decode(value, { stream: true });
      const events = parser.push(decoded);
      if (done) events.push(...parser.flush());

      for (const event of events) {
        if (handle(event)) {
          streamDone = true;
          break;
        }
      }
      if (done) streamDone = true;
    }

    // Some SSE servers emit [DONE] but keep the HTTP connection alive.
    await reader.cancel().catch(() => undefined);
  },

  async saveErdChanges(changes: ErdRelationChange[]): Promise<void> {
    await axiosInstance.post('api/v1/erd/entities', {
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
    url.searchParams.set('sid', request.sessionId);
    // The React server proxy used the same fallback when no forwarded client IP existed.
    url.searchParams.set('ip', 'unknown');
    if (request.model) url.searchParams.set('model', request.model);
    if (request.entity) {
      url.searchParams.set('qType', request.mode);
      url.searchParams.set('e', request.entity.entity);
    }
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
      const decoded = done
        ? decoder.decode()
        : decoder.decode(value, { stream: true });
      const events = parser.push(decoded);
      if (done) events.push(...parser.flush());

      for (const event of events) {
        if (dispatchEvent(event, callbacks)) {
          finished = true;
          break;
        }
      }
      if (done) break;
    }

    await reader.cancel().catch(() => undefined);
  }
};
