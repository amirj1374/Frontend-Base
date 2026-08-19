import { MarkerType, type Edge, type Node } from '@vue-flow/core';
import type { OrganizationLevel, OrganizationModelResponse, OrganizationNodeData } from '../types/organization';

export type OrganizationGraphNode = Node<OrganizationNodeData>;

export function organizationModelToGraph(response: OrganizationModelResponse) {
  const { units, people, unitRelations, assignments, summary } = response.data;
  const peopleById = new Map(people.map((person) => [person.id, person]));
  const unitsById = new Map(units.map((unit) => [unit.id, unit]));
  const assignmentByUnit = (unitId: string, role: string) => assignments.filter((item) => item.unitId === unitId && item.role === role);
  const reportCount = (personId: string) => new Set(assignments.filter((item) => item.reportsToPersonId === personId).map((item) => item.personId)).size;
  const nodes: OrganizationGraphNode[] = [];

  units.forEach((unit) => {
    const level = unit.type as OrganizationLevel;
    if (unit.type === 'deputy') {
      const head = peopleById.get(assignmentByUnit(unit.id, 'deputy_head')[0]?.personId);
      nodes.push({ id: unit.id, position: { x: 0, y: 0 }, data: { label: head?.fullName ?? unit.name, subtitle: unit.name, level, email: head?.email ?? undefined, memberCount: unitRelations.filter((item) => item.parentUnitId === unit.id).length, memberLabel: 'ماژول' } });
      return;
    }
    nodes.push({ id: unit.id, position: { x: 0, y: 0 }, data: { label: unit.type === 'module' ? `ماژول ${unit.name}` : unit.name, subtitle: unit.type === 'company' ? 'شرکت مادر' : `زیرمجموعه ${unitsById.get(unitRelations.find((item) => item.childUnitId === unit.id)?.parentUnitId ?? '')?.name ?? ''}`, level, description: unit.description ?? undefined, memberCount: unit.type === 'company' ? unitRelations.filter((item) => item.parentUnitId === unit.id).length : assignmentByUnit(unit.id, 'module_manager').length, memberLabel: unit.type === 'company' ? 'معاونت' : 'مدیر' } });
  });

  people.forEach((person) => {
    const personAssignments = assignments.filter((item) => item.personId === person.id);
    if (personAssignments.some((item) => item.role === 'module_manager')) nodes.push({ id: person.id, position: { x: 0, y: 0 }, data: { label: person.fullName, subtitle: person.position, level: 'manager', email: person.email ?? undefined, memberCount: reportCount(person.id), memberLabel: 'کارشناس' } });
    else if (personAssignments.some((item) => item.role === 'expert')) nodes.push({ id: person.id, position: { x: 0, y: 0 }, data: { label: person.fullName, subtitle: person.position, level: 'expert', email: person.email ?? undefined, memberCount: 0, memberLabel: 'زیرمجموعه' } });
  });

  const edge = (id: string, source: string, target: string): Edge => ({ id, source, target, markerEnd: MarkerType.ArrowClosed, style: { stroke: '#8b5cf6', strokeWidth: 1.7 } });
  const edges = [
    ...unitRelations.map((item) => edge(item.id, item.parentUnitId, item.childUnitId)),
    ...assignments.filter((item) => item.role === 'module_manager').map((item) => edge(item.id, item.unitId, item.personId)),
    ...assignments.filter((item) => item.role === 'expert' && item.reportsToPersonId).map((item) => edge(item.id, item.reportsToPersonId!, item.personId))
  ];
  const levelIndexes = new Map<OrganizationLevel, number>();
  nodes.forEach((node) => {
    const level = node.data!.level;
    const index = levelIndexes.get(level) ?? 0;
    node.data!.layoutIndex = index;
    levelIndexes.set(level, index + 1);
  });
  return { nodes, edges, summary };
}
