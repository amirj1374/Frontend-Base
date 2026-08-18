/* eslint-disable no-unused-vars -- callback parameter names document the stream contract */
export interface ParsedStreamEvent {
  event: string;
  data: string;
}

export interface StreamEventParser {
  push(chunk: string): ParsedStreamEvent[];
  flush(): ParsedStreamEvent[];
}

function parseBlock(block: string): ParsedStreamEvent | null {
  let event = 'message';
  const data: string[] = [];

  for (const line of block.split(/\r?\n/)) {
    if (!line || line.startsWith(':')) continue;
    if (line.startsWith('event:')) event = line.slice(6).trim();
    if (line.startsWith('data:')) data.push(line.slice(5).replace(/^ /, ''));
  }

  return data.length ? { event, data: data.join('\n') } : null;
}

export function createStreamEventParser(): StreamEventParser {
  let buffer = '';

  const consume = (final: boolean): ParsedStreamEvent[] => {
    const normalized = buffer.replace(/\r\n/g, '\n');
    const blocks = normalized.split('\n\n');
    const trailingBlock = blocks.pop() ?? '';
    buffer = final ? '' : trailingBlock;
    const completeBlocks = final && trailingBlock
      ? blocks.concat(trailingBlock)
      : blocks;
    return completeBlocks
      .map(parseBlock)
      .filter((event): event is ParsedStreamEvent => event !== null);
  };

  return {
    push(chunk) {
      buffer += chunk;
      return consume(false);
    },
    flush() {
      return consume(true);
    }
  };
}
