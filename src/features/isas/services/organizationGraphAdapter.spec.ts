import { describe, expect, it } from 'vitest';
import { organizationModel } from '../data/organizationModel';
import { organizationModelToGraph } from './organizationGraphAdapter';

describe('organizationModelToGraph', () => {
  const graph = organizationModelToGraph(organizationModel);

  it('converts the v2 contract to all expected graph layers', () => {
    expect(graph.nodes).toHaveLength(44);
    expect(graph.nodes.filter((node) => node.data!.level === 'company')).toHaveLength(0);
    expect(graph.nodes.filter((node) => node.data!.level === 'deputy')).toHaveLength(1);
    expect(graph.nodes.filter((node) => node.data!.level === 'module')).toHaveLength(36);
    expect(graph.nodes.filter((node) => node.data!.level === 'manager')).toHaveLength(7);
    expect(graph.nodes.filter((node) => node.data!.level === 'expert')).toHaveLength(0);
  });

  it('supports multiple managers for one module', () => {
    expect(graph.edges.filter((edge) => edge.source === 'com_caspian_banking_service')).toHaveLength(5);
  });

  it('computes relation-backed counts instead of trusting duplicated values', () => {
    expect(graph.nodes.find((node) => node.id === 'com_caspian_banking_service')?.data?.memberCount).toBe(5);
    expect(graph.nodes.find((node) => node.id === 'com_caspian_banking_service')?.data?.memberLabel).toBe('مدیر');
    expect(graph.nodes.find((node) => node.id === 'mehran_mahdian_mahdian_caspco_ir')?.data?.memberCount).toBe(0);
  });
});
