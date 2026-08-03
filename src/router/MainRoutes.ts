import { ROUTE_NAMES, ROUTE_PATHS } from './names';

const MainRoutes = {
  path: '/main',
  meta: {
    requiresAuth: true
  },
  redirect: { name: ROUTE_NAMES.dashboard },
  component: () => import('@/layouts/full/FullLayout.vue'),
  children: [
    {
      path: '/',
      name: ROUTE_NAMES.dashboard,
      meta: { requiresAuth: true, permission: '' },
      component: () => import('@/views/dashboards/default/Dashboard.vue')
    },
  ]
};

export default MainRoutes;
