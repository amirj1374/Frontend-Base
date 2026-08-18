import { ROUTE_NAMES, ROUTE_PATHS } from './names';

const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: { name: ROUTE_NAMES.isasChat },
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      path: '/',
      name: ROUTE_NAMES.dashboard,
      meta: { requiresAuth: true, permission: '' },
      redirect: { name: ROUTE_NAMES.isasChat }
    },
    {
      path: '/components',
      name: ROUTE_NAMES.componentShowcase,
      meta: { requiresAuth: true, permission: '' },
      component: () => import('@/views/ComponentShowcase.vue')
    },
    {
      path: ROUTE_PATHS.isasChat,
      name: ROUTE_NAMES.isasChat,
      meta: { requiresAuth: true, permission: 'isas:chat:view' },
      component: () => import('@/features/isas/views/IsasChatView.vue')
    },
    {
      path: ROUTE_PATHS.isasErd,
      name: ROUTE_NAMES.isasErd,
      meta: { requiresAuth: true, permission: 'isas:data:view' },
      component: () => import('@/features/isas/views/IsasErdView.vue')
    },
    {
      path: ROUTE_PATHS.isasOrganization,
      name: ROUTE_NAMES.isasOrganization,
      meta: { requiresAuth: true, permission: 'isas:data:view' },
      component: () => import('@/features/isas/views/IsasOrganizationView.vue')
    }
  ]
};

export default MainRoutes;
