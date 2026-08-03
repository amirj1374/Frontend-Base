import { useAccess } from '@/composables/useAccess';
/** Reference helper for components; it preserves the active access-policy decision. */
export function useExamplePermissions() { const { can, canAny } = useAccess(); return { canView: () => can('/api/example/find'), canAct: () => canAny(['/api/example/create', '/api/example/edit']) }; }
