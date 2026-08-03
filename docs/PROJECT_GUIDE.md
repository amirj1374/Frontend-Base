# راهنمای پروژهٔ Vosool Frontend

## شروع سریع

```bash
nvm use
npm ci
npm run dev
```

محیط توسعه روی `http://localhost:2000` اجرا می‌شود. مقادیر محیطی public هستند؛ هرگز token، password یا client secret را در متغیرهای `VITE_*` قرار ندهید.

## فرمان‌های روزمره

| فرمان | کاربرد |
| --- | --- |
| `npm run lint:check` | lint بدون تغییر فایل |
| `npm run typecheck` | کنترل TypeScript و Vue |
| `npm test` | تست واحد |
| `npm run build` | build محیط dev |
| `npm run build:prelive` | build prelive |
| `npm run build:live` | build live |
| `git diff --check` | کنترل whitespace قبل از commit |

## معماری در یک نگاه

| لایه | محل | مسئولیت |
| --- | --- | --- |
| پیکربندی | `src/config/` | خواندن و اعتبارسنجی runtime config |
| شروع برنامه | `src/app/` و `src/main.ts` | bootstrap قطعی، pluginها و خطای اولیه |
| authentication | `src/auth/` | Keycloak/JWT و lifecycle نشست |
| مجوز | `src/access/` و `src/stores/permissions.ts` | سیاست یکپارچهٔ route، menu و action |
| Router | `src/router/` | نام مسیرها، guard و redirectهای سازگار |
| HTTP | `src/services/axiosInstance.ts` | Axios canonical، token و normalisation خطا |
| state | `src/stores/` | Pinia state عمومی برنامه |
| UI | `src/layouts/`، `src/views/` | layout و صفحه‌های کسب‌وکار |

## قواعد توسعه

1. service جدید فقط از Axios canonical استفاده می‌کند.
2. route و menu برای visibility از `useAccess`/policy مشترک استفاده می‌کنند.
3. کامپوننت عمومی را اول در UI Kit اضافه و منتشر کنید؛ سپس از package root import کنید.
4. منطق DTO، endpoint، status و permission codeهای کسب‌وکار را در کار UI/زیرساختی تغییر ندهید.
5. قبل از merge حداقل `typecheck`، `test`، `build` و `git diff --check` را اجرا کنید.

## تنظیمات توسعه و bypass مجوز

`VITE_DEV_PERMISSION_BYPASS=true` فقط در محیط non-production و صرفاً برای بررسی بصری frontend مجاز است. این گزینه login، token، درخواست API و پاسخ‌های backend 401/403 را دور نمی‌زند. برای خاموش‌کردن آن مقدار را `false` کنید یا حذفش کنید. prelive و live این flag را نادیده می‌گیرند.

## Customizer

Customizer فقط ظاهر را تغییر می‌دهد: رنگ، حالت روشن/تیره، گردی فیلد، اندازهٔ متن، variant و ارتفاع فیلد، جهت menu و فونت. تغییرات جدید ظاهر عمداً به API کاربر ارسال نمی‌شوند تا قرارداد backend تغییر نکند. دکمهٔ «اعمال و ذخیره تنظیمات» فقط payload پشتیبانی‌شدهٔ فعلی backend را ذخیره می‌کند.

## تحویل

برای انتشار و smoke check محیط به [DELIVERY.md](DELIVERY.md) مراجعه کنید. جزئیات auth، bootstrap، HTTP و permissions در `docs/architecture/` نگهداری می‌شوند.
