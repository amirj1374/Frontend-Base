export const ROUTE_NAMES = {
  dashboard: 'Dashboard',
  componentShowcase: 'ComponentShowcase',
  isasChat: 'IsasChat',
  isasErd: 'IsasErd',
  isasOrganization: 'IsasOrganization',
  facilities: 'Facilities',
  login: 'Login',
  forbidden: 'Forbidden',
  notFound: 'NotFound'
} as const;

export const ROUTE_PATHS = {
  dashboard: '/',
  componentShowcase: '/components',
  isasChat: '/isas',
  isasErd: '/isas/data-catalog',
  isasOrganization: '/isas/organization-model',
  facilities: '/facilities',
  legacyMainFacilities: '/main/facilities',
  legacyApproval: '/approval',
  login: '/auth/login',
  forbidden: '/error/403'
} as const;
