import runtimeConfig from '@/config/runtime';
import { useAccessStore } from '@/stores/access';
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';
import { createInfrastructureGuard } from './guard';
import { ROUTE_NAMES, ROUTE_PATHS } from './names';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: ROUTE_PATHS.forbidden,
      name: ROUTE_NAMES.forbidden,
      component: () => import('@/views/pages/maintenance/error/Error403Page.vue')
    },
    {
      path: ROUTE_PATHS.legacyMainFacilities,
      redirect: { name: ROUTE_NAMES.dashboard }
    },
    {
      path: ROUTE_PATHS.legacyApproval,
      redirect: { name: ROUTE_NAMES.dashboard }
    },
    {
      path: '/:pathMatch(.*)*',
      name: ROUTE_NAMES.notFound,
      component: () => import('@/views/pages/maintenance/error/Error404Page.vue')
    },
    MainRoutes,
    AuthRoutes
  ]
});

router.beforeEach(
  createInfrastructureGuard({
    isDemo: () => runtimeConfig.authMode === 'demo',
    isAuthenticated: () => Boolean(useAuthStore().user),
    rememberReturnUrl: (url) => {
      useAuthStore().returnUrl = url;
    },
    ensureAccessLoaded: () => useAccessStore().ensureLoaded(),
    canAccessProtectedRoute: (requirement) =>
      useAccessStore().evaluate(requirement, { unresolved: 'deny', empty: 'deny' })
  })
);
