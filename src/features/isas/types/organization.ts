export type OrganizationLevel = 'company' | 'deputy' | 'module' | 'manager' | 'expert';
export type OrganizationUnitType = 'company' | 'deputy' | 'module';
export type OrganizationRole = 'company_head' | 'deputy_head' | 'module_manager' | 'expert';

export interface OrganizationNodeData extends Record<string, unknown> {
  label: string;
  subtitle: string;
  level: OrganizationLevel;
  initials?: string;
  skills?: string[];
  memberCount?: number;
  memberLabel?: string;
  layoutIndex?: number;
  email?: string;
  description?: string;
}

export interface OrganizationUnit { id: string; type: OrganizationUnitType; name: string; description: string | null; }
export interface OrganizationPerson { id: string; fullName: string; position: string; email: string | null; }
export interface OrganizationUnitRelation { id: string; parentUnitId: string; childUnitId: string; }
export interface OrganizationAssignment { id: string; personId: string; unitId: string; role: OrganizationRole; reportsToPersonId: string | null; }
export interface OrganizationSummary { companies: number; deputies: number; modules: number; managers: number; experts: number; }
export interface OrganizationModelResponse {
  data: { summary: OrganizationSummary; units: OrganizationUnit[]; people: OrganizationPerson[]; unitRelations: OrganizationUnitRelation[]; assignments: OrganizationAssignment[]; };
  meta: { generatedAt: string; version: '2.0'; };
}
