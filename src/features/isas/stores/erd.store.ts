import { defineStore } from 'pinia';
import type { ErdEdge, ErdNode, ErdTableData } from '../types/erd';

export const useIsasErdStore = defineStore('isas-erd', {
  state: () => ({
    nodes: [] as ErdNode[],
    edges: [] as ErdEdge[],
    originalEdges: [] as ErdEdge[],
    selectedEntity: '',
    relationDepth: 1,
    loading: false,
    statusMessage: '',
    errorMessage: '',
    settingsOpen: false,
    catalogOpen: false,
    catalogInfo: null as ErdTableData | null,
    relationOpen: false,
    selectedEdgeId: '',
    pendingSource: '',
    pendingTarget: ''
  }),
  actions: {
    replaceGraph(nodes: ErdNode[], edges: ErdEdge[]) {
      this.nodes = nodes;
      this.edges = edges;
      this.originalEdges = structuredClone(edges);
    },
    openCatalog(data: ErdTableData) {
      this.catalogInfo = data;
      this.catalogOpen = true;
    },
    openRelation(source: string, target: string, edgeId = '') {
      this.pendingSource = source;
      this.pendingTarget = target;
      this.selectedEdgeId = edgeId;
      this.relationOpen = true;
    },
    removeSelectedEdge() {
      if (!this.selectedEdgeId) return;
      this.edges = this.edges.filter((edge) => edge.id !== this.selectedEdgeId);
      this.selectedEdgeId = '';
    },
    markSaved() {
      this.originalEdges = structuredClone(this.edges);
    }
  }
});
