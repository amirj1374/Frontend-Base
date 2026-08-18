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
});
