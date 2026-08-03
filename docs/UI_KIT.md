# استفاده از UI Kit

پکیج استاندارد پروژه:

```bash
npm install @amirjalili1374/ui-kit@1.10.0 --save-exact
```

همیشه از package root import کنید:

```ts
import { AppCustomizerControls, AppCustomizerSubmit, AppHeader, AppHeaderMenu } from '@amirjalili1374/ui-kit';
```

import از مسیرهای داخلی package یا از sibling repository پشتیبانی نمی‌شود.

## Header و navigation

`AppHeader` برای حالت desktop و mobile header menu را مدیریت می‌کند. application فقط itemهای از قبل permission-filtered را به آن می‌دهد.

```vue
<AppHeader
  menu-orientation="horizontal"
  :header-menu="filteredMenu"
  :user-info-loaded="true"
  :on-toggle-customizer="toggleCustomizer"
/>
```

برای استفادهٔ مستقل از منوی header:

```vue
<AppHeaderMenu display="menu" :items="filteredMenu" />
```

`AppHeaderMenu` permission را خودش محاسبه نمی‌کند؛ این تصمیم مربوط به application access policy است.

## کنترل‌های ظاهری Customizer

`AppCustomizerControls` چهار state کنترل‌شده دارد و با `apply-preview` می‌تواند CSS variableهای عمومی را فوراً روی document root اعمال کند.

```vue
<AppCustomizerControls
  :text-field-border-radius="customizer.textFieldBorderRadius"
  :text-field-variant="customizer.textFieldVariant"
  :text-field-height="customizer.uiDensity"
  :text-scale="customizer.textScale"
  :apply-preview="false"
  :show-actions="false"
  @update:text-field-border-radius="customizer.SET_TEXT_FIELD_BORDER_RADIUS"
  @update:text-field-variant="customizer.SET_TEXT_FIELD_VARIANT"
  @update:text-field-height="customizer.SET_UI_DENSITY"
  @update:text-scale="customizer.SET_TEXT_SCALE"
/>
```

| Prop | مقدارها |
| --- | --- |
| `textFieldVariant` | `outlined`، `filled`، `solo`، `plain`، `underlined` |
| `textFieldHeight` | `compact`، `default`، `comfortable` |
| `textFieldBorderRadius` | عدد 0 تا 24 |
| `textScale` | عدد 85 تا 115 |

برای CTA ثابت پایین drawer از `AppCustomizerSubmit` استفاده کنید:

```vue
<AppCustomizerSubmit @apply="saveSupportedCustomizerSettings" />
```

## DataTable و componentهای پایه

`CustomDataTableV2` / `CustomDataTable`، `ConfirmDialog`، `CustomAutocomplete`، `MoneyInput`، `ShamsiDatePicker` و cardهای پایه از index package export شده‌اند. نمونه‌های کنترل مجوز، route و service در [EXAMPLES.md](EXAMPLES.md) قرار دارند.

## CSS

Kit style را فقط یک‌بار در application import کنید:

```ts
import '@amirjalili1374/ui-kit/dist/style.css';
```

اگر application خودش preview را کنترل می‌کند، `apply-preview="false"` بگذارید تا watcherهای application تنها منبع تغییر document root باشند.
