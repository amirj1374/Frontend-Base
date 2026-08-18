export type OrganizationLevel = 'company' | 'deputy' | 'module' | 'manager' | 'expert';

export interface OrganizationNodeData extends Record<string, unknown> {
  label: string;
  subtitle: string;
  level: OrganizationLevel;
  initials?: string;
  skills?: string[];
  memberCount?: number;
  email?: string;
  description?: string;
}
