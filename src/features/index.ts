/**
 * Feature-based module exports
 * This file provides barrel exports for all features
 * 
 * Note: This is a placeholder for future feature-based organization.
 * Currently, the project uses a traditional structure which is working well.
 * 
 * Future structure could be:
 * src/features/
 *   ├── approval/
 *   │   ├── components/
 *   │   ├── composables/
 *   │   ├── services/
 *   │   └── types/
 *   ├── cartable/
 *   │   ├── components/
 *   │   ├── composables/
 *   │   ├── services/
 *   │   └── types/
 *   └── dashboard/
 *       ├── components/
 *       ├── composables/
 *       ├── services/
 *       └── types/
 */

// Re-export from current structure for compatibility
// Note: Individual component exports would need index files in each directory

// Re-export services

export * from '../types/models/person';
export * from '../types/models/userInfo';

// Re-export composables
export * from '../composables/usePermissions';
export * from '../composables/useRouteGuard';

