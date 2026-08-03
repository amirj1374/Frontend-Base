# Cookbook مثال‌ها

این مثال‌ها کوتاه‌اند و برای copy/paste در feature جدید طراحی شده‌اند.

## 1. Permission برای route، menu و action

```ts
import { useAccess } from '@/composables/useAccess';

const { can } = useAccess();
const canCreate = computed(() => can('guarantees.create'));
```

```vue
<v-btn v-if="canCreate">ثبت درخواست</v-btn>
```

برای مجموعه permissionها از policy مشترک استفاده کنید؛ permission code جدید را فقط با قرارداد backend اضافه کنید.

## 2. route محافظت‌شده

```ts
{
  path: '/example',
  name: 'example',
  component: () => import('@/views/example/ExamplePage.vue'),
  meta: { permissions: ['example.read'] }
}
```

Router guard مجوز را ارزیابی می‌کند؛ guard موازی در صفحه نسازید.

## 3. service با transport canonical

```ts
import axiosInstance from '@/services/axiosInstance';

const response = await axiosInstance.get('/example');
```

در component مستقیماً Axios جدید نسازید. خطاهای API از normalizer برنامه عبور می‌کنند.

## 4. menu مجاز برای header و sidebar

```ts
const filteredMenu = computed(() => getFilteredSidebarItems());
```

همین `filteredMenu` را به sidebar و `AppHeader` بدهید تا هیچ حالت نمایش متفاوتی permission را دور نزند.

## 5. UI Kit Customizer

```vue
<AppCustomizerControls
  :text-field-border-radius="radius"
  :text-field-variant="variant"
  :text-field-height="height"
  :text-scale="scale"
  @update:text-field-border-radius="radius = $event"
  @update:text-field-variant="variant = $event"
  @update:text-field-height="height = $event"
  @update:text-scale="scale = $event"
  @apply="save"
/>
```

## 6. UI Kit header menu

```vue
<AppHeaderMenu display="menu" :items="filteredMenu" />
```

## 7. تست feature جدید

```bash
npm run typecheck
npm test
npm run build
git diff --check
```

نمونه‌های کد کوچک‌تر در `src/examples/` نگهداری می‌شوند؛ این فایل‌ها به runtime برنامه وارد نشده‌اند و فقط مرجع تیم هستند.
