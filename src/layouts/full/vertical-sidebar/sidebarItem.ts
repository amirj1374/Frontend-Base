import {
  IconHome,
  IconShieldCheck,
  IconLoadBalancer,
  IconShieldDollar,
  IconFileCertificate,
  IconFileInvoice,
  IconArrowsRightLeft,
  IconFileAlert,
  IconSettings,
  IconMessage,
  IconMessageCode
} from '@tabler/icons-vue';
import { useAccessStore } from '@/stores/access';
import { requiredPermissionFor } from '@/config/pageAccess';

export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
  permissionKey?: string; // Add permission key for role-based access
}

const sidebarItem: menu[] = [
  {
    title: 'داشبورد',
    icon: IconHome,
    to: '/'
  },
];

// Filter menu items by API access derived from the JWT token.
// A page's required API is resolved from config/pageAccess.ts via its `to` path,
// so the sidebar and the route guard stay in sync. Items without a gated path
// (or whose API the user holds) are kept; filtering is recursive and does not
// mutate the source array.
export function getFilteredSidebarItems(): menu[] {
  const access = useAccessStore();
  access.ensureLoaded();

  // Item visible if the user has its required permission. Multi-tab pages map to an
  // array → visible if the user has ANY of them (canAny). Public items have none.
  const isAllowed = (item: menu): boolean => {
    const req = requiredPermissionFor(item.to);
    return Array.isArray(req) ? access.canAccessAny(req) : access.canAccessApi(req);
  };

  const filter = (items: menu[]): menu[] =>
    items.filter(isAllowed).map((item) => (item.children && item.children.length ? { ...item, children: filter(item.children) } : item));

  return filter(sidebarItem);
}

export default sidebarItem;
