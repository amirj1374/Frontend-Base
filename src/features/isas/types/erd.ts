/* eslint-disable no-unused-vars -- callback parameter names are part of the public feature contract */
import type { CSSProperties } from 'vue';

export interface CatalogColumn {
  name: string;
  type: string;
  label?: string;
  usage?: string;
  description?: string;
  source?: string;
  isPrimary?: boolean;
  isForeign?: boolean;
}

export interface ErdTableData extends Record<string, unknown> {
  label: string;
  tableName?: string;
  catalogLabel?: string;
  schemaLabel?: string;
  description?: string;
  columns: CatalogColumn[];
}

export interface ErdNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: ErdTableData;
  width?: number;
  height?: number;
}

export interface ErdEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  markerEnd?: string;
  style?: CSSProperties;
  data?: Record<string, unknown>;
}

export interface ErdQuery {
  entityName: string;
  table: string;
  depth: number;
}

export interface ErdStreamCallbacks {
  onNode(node: ErdNode): void;
  onEdge(edge: ErdEdge): void;
  onStatus(message: string): void;
}

export interface ErdRelationChange {
  operation: 'added' | 'modified' | 'removed';
  source: string;
  target: string;
  sourceColumn?: string;
  targetColumn?: string;
  edgeType?: string;
}
