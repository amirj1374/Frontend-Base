import { describe, expect, it } from 'vitest';
import { createStreamEventParser } from './sseParser';

describe('createStreamEventParser', () => {
  it('preserves an event split across network chunks', () => {
    const parser = createStreamEventParser();

    expect(parser.push('event: delta\ndata: hel')).toEqual([]);
    expect(parser.push('lo\n\n')).toEqual([{ event: 'delta', data: 'hello' }]);
  });

  it('parses multiline data and ignores comments', () => {
    const parser = createStreamEventParser();

    expect(parser.push(': keep-alive\nevent: status\ndata: line one\ndata: line two\n\n')).toEqual([
      { event: 'status', data: 'line one\nline two' }
    ]);
  });

  it('flushes a final event without a trailing separator', () => {
    const parser = createStreamEventParser();

    parser.push('data: final');
    expect(parser.flush()).toEqual([{ event: 'message', data: 'final' }]);
  });

  it('parses the nested JSON format returned by the ERD stream', () => {
    const parser = createStreamEventParser();
    const raw = [
      'data:{"message":"خواندن اطلاعات جداول"}',
      '',
      'data:{"node":"{\\"id\\":\\"entities/grouptransfer\\",\\"type\\":\\"tableNode\\",\\"data\\":{\\"label\\":\\"GroupTransfer\\",\\"columns\\":[{\\"name\\":\\"ACCOUNT_ID\\"}]}}"}',
      '',
      'data:[DONE]',
      ''
    ].join('\n');

    const events = [...parser.push(raw), ...parser.flush()];

    expect(JSON.parse(events[0].data)).toEqual({ message: 'خواندن اطلاعات جداول' });
    const payload = JSON.parse(events[1].data) as { node: string };
    expect(JSON.parse(payload.node)).toMatchObject({
      id: 'entities/grouptransfer',
      data: { label: 'GroupTransfer' }
    });
    expect(events[2]).toEqual({ event: 'message', data: '[DONE]' });
  });
});
