import type { DirectiveBinding } from 'vue';
import { useAccessStore } from '@/stores/access';

/**
 * v-can — show an element only if the user may call the given API(s).
 *
 *   <v-btn v-can="'/api/excel/all-facilities'">خروجی اکسل</v-btn>
 *   <div v-can="['/api/fbti/gt/find', '/api/fbti/lc/find']">...</div>
 *
 * A single string requires that exact API; an array passes if ANY is allowed.
 * When not allowed the element is removed from the DOM. Public APIs (undefined)
 * are always allowed (see stores/access.ts fail-open policy).
 */
function allowed(value: string | string[] | undefined): boolean {
  const access = useAccessStore();
  access.ensureLoaded();
  return Array.isArray(value) ? access.canAccessAny(value) : access.canAccessApi(value);
}

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<string | string[]>) {
    if (!allowed(binding.value)) {
      el.remove();
    }
  }
};
