export const ROUTE_NAMES = {
  dashboard: 'Dashboard',
  facilities: 'Facilities',
  login: 'Login',
  forbidden: 'Forbidden',
  notFound: 'NotFound'
} as const;

export const ROUTE_PATHS = {
  dashboard: '/',
  facilities: '/facilities',
  legacyMainFacilities: '/main/facilities',
  legacyApproval: '/approval',
  login: '/auth/login',
  forbidden: '/error/403'
} as const;
