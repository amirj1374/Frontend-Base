# مستند API مدل سازمانی

## هدف

این API اطلاعات مدل سازمانی را برای نمایش در نمودار ERD برمی‌گرداند. ساختار داده از دو بخش اصلی تشکیل شده است:

- `nodes`: موجودیت‌های سازمانی مانند شرکت، معاونت، ماژول، مدیر و کارشناس
- `relations`: ارتباط میان موجودیت‌ها

جدا بودن نودها و ارتباط‌ها باعث می‌شود یک ماژول بتواند به چند مدیر متصل باشد، بدون اینکه اطلاعات مدیر یا ماژول تکرار شود.

## API پیشنهادی

```http
GET /api/v1/organization-model
```

### پاسخ موفق

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "data": {
    "summary": {
      "companies": 1,
      "deputies": 3,
      "modules": 36,
      "managers": 10,
      "experts": 65
    },
    "nodes": [
      {
        "id": "company-1",
        "type": "company",
        "name": "شرکت فناوری اطلاعات پارسیان",
        "title": "شرکت مادر",
        "email": "info@parsian-tech.ir",
        "description": null,
        "directReportsCount": 3
      },
      {
        "id": "deputy-1",
        "type": "deputy",
        "name": "محمدرضا فرهمند",
        "title": "معاونت فناوری و زیرساخت",
        "email": "deputy1@parsian-tech.ir",
        "description": null,
        "directReportsCount": 12
      },
      {
        "id": "module-1",
        "type": "module",
        "name": "ماژول زیرساخت ابری",
        "title": "زیرمجموعه معاونت فناوری و زیرساخت",
        "email": null,
        "description": "مسئول توسعه و پشتیبانی خدمات زیرساخت ابری",
        "directReportsCount": 2
      },
      {
        "id": "manager-1",
        "type": "manager",
        "name": "سارا احمدی",
        "title": "مدیر ماژول",
        "email": "sara.ahmadi@parsian-tech.ir",
        "description": null,
        "directReportsCount": 7
      },
      {
        "id": "expert-1",
        "type": "expert",
        "name": "مریم رضایی",
        "title": "کارشناس زیرساخت ابری",
        "email": "maryam.rezaei@parsian-tech.ir",
        "description": null,
        "directReportsCount": 0
      }
    ],
    "relations": [
      {
        "id": "relation-1",
        "sourceId": "company-1",
        "targetId": "deputy-1",
        "type": "contains"
      },
      {
        "id": "relation-2",
        "sourceId": "deputy-1",
        "targetId": "module-1",
        "type": "contains"
      },
      {
        "id": "relation-3",
        "sourceId": "module-1",
        "targetId": "manager-1",
        "type": "managed_by"
      },
      {
        "id": "relation-4",
        "sourceId": "manager-1",
        "targetId": "expert-1",
        "type": "supervises"
      }
    ]
  },
  "meta": {
    "generatedAt": "2026-08-18T12:00:00Z",
    "version": "1.0"
  }
}
```

## ساختار اصلی پاسخ

| فیلد | نوع | اجباری | توضیح |
|---|---|---:|---|
| `data` | object | بله | محتوای اصلی پاسخ |
| `data.summary` | object | بله | تعداد کل موجودیت‌های هر لایه |
| `data.nodes` | array | بله | لیست تمام موجودیت‌های سازمانی |
| `data.relations` | array | بله | لیست ارتباط‌های میان نودها |
| `meta.generatedAt` | ISO 8601 string | بله | زمان تولید پاسخ به‌صورت UTC |
| `meta.version` | string | بله | نسخه قرارداد API |

## فیلدهای Summary

| فیلد | توضیح |
|---|---|
| `companies` | تعداد شرکت‌ها |
| `deputies` | تعداد معاونت‌ها |
| `modules` | تعداد ماژول‌ها |
| `managers` | تعداد مدیران ماژول |
| `experts` | تعداد کارشناسان |

همه مقادیر این بخش عدد صحیح، صفر یا بزرگ‌تر هستند و باید با تعداد واقعی نودها مطابقت داشته باشند.

## ساختار Node

| فیلد | نوع | اجباری | توضیح |
|---|---|---:|---|
| `id` | string | بله | شناسه یکتا و پایدار نود |
| `type` | enum | بله | نوع لایه سازمانی |
| `name` | string | بله | نام شرکت، ماژول یا شخص |
| `title` | string | بله | عنوان یا سمت سازمانی |
| `email` | string/null | خیر | ایمیل سازمانی؛ برای ماژول مقدار `null` است |
| `description` | string/null | خیر | توضیح کوتاه؛ بیشتر برای ماژول استفاده می‌شود |
| `directReportsCount` | integer | بله | تعداد زیرمجموعه مستقیم این نود |

### انواع Node

| مقدار | معنی | نمونه `name` | نمونه `title` |
|---|---|---|---|
| `company` | شرکت | شرکت فناوری اطلاعات پارسیان | شرکت مادر |
| `deputy` | معاونت و شخص مسئول آن | محمدرضا فرهمند | معاونت فناوری و زیرساخت |
| `module` | ماژول سازمانی | ماژول زیرساخت ابری | زیرمجموعه معاونت فناوری و زیرساخت |
| `manager` | مدیر ماژول | سارا احمدی | مدیر ماژول |
| `expert` | کارشناس | مریم رضایی | کارشناس زیرساخت ابری |

## ساختار Relation

| فیلد | نوع | اجباری | توضیح |
|---|---|---:|---|
| `id` | string | بله | شناسه یکتای ارتباط |
| `sourceId` | string | بله | شناسه نود مبدأ |
| `targetId` | string | بله | شناسه نود مقصد |
| `type` | enum | بله | نوع ارتباط |

### انواع Relation

| مقدار | مبدأ | مقصد | معنی |
|---|---|---|---|
| `contains` | شرکت | معاونت | شرکت شامل معاونت است |
| `contains` | معاونت | ماژول | معاونت شامل ماژول است |
| `managed_by` | ماژول | مدیر | ماژول توسط مدیر اداره می‌شود |
| `supervises` | مدیر | کارشناس | مدیر سرپرست کارشناس است |

## نکته مهم درباره ارتباط ماژول و مدیر

ارتباط ماژول و مدیر چندبه‌چند است:

- یک ماژول می‌تواند چند مدیر داشته باشد.
- یک مدیر می‌تواند مسئول چند ماژول باشد.

بنابراین نباید `managerId` مستقیماً داخل رکورد ماژول قرار بگیرد. هر اتصال باید یک رکورد مستقل در `relations` با نوع `managed_by` باشد.

نمونه اتصال یک ماژول به دو مدیر:

```json
[
  {
    "id": "relation-10",
    "sourceId": "module-1",
    "targetId": "manager-1",
    "type": "managed_by"
  },
  {
    "id": "relation-11",
    "sourceId": "module-1",
    "targetId": "manager-2",
    "type": "managed_by"
  }
]
```

## قواعد اعتبارسنجی بک‌اند

1. مقدار `id` در `nodes` باید یکتا و پایدار باشد.
2. مقدار `id` در `relations` باید یکتا باشد.
3. هر `sourceId` و `targetId` باید به یک نود موجود اشاره کند.
4. مقدار `type` نود فقط یکی از پنج مقدار تعریف‌شده باشد.
5. مقدار `type` ارتباط فقط یکی از سه مقدار تعریف‌شده باشد.
6. `directReportsCount` عدد صحیح و صفر یا بزرگ‌تر باشد.
7. مقدار ایمیل ماژول باید `null` باشد؛ ماژول به‌جای ایمیل `description` دارد.
8. کارشناس معمولاً `directReportsCount: 0` دارد.
9. ارتباط تکراری با `sourceId`، `targetId` و `type` یکسان ارسال نشود.
10. تعدادهای `summary` با داده واقعی `nodes` تطابق داشته باشند.

## جستجو در فرانت‌اند

فرانت‌اند جستجو را روی این فیلدها انجام می‌دهد:

- `name`
- `title`
- `email`
- `description`

بنابراین بک‌اند فقط باید تمام داده‌ها را با همین ساختار برگرداند و برای جستجوی فعلی به API جداگانه نیاز نیست.

## TypeScript Contract

```ts
type OrganizationNodeType =
  | 'company'
  | 'deputy'
  | 'module'
  | 'manager'
  | 'expert';

type OrganizationRelationType =
  | 'contains'
  | 'managed_by'
  | 'supervises';

interface OrganizationNode {
  id: string;
  type: OrganizationNodeType;
  name: string;
  title: string;
  email: string | null;
  description: string | null;
  directReportsCount: number;
}

interface OrganizationRelation {
  id: string;
  sourceId: string;
  targetId: string;
  type: OrganizationRelationType;
}
```

## پاسخ خطا پیشنهادی

```json
{
  "error": {
    "code": "ORGANIZATION_MODEL_NOT_AVAILABLE",
    "message": "اطلاعات مدل سازمانی در دسترس نیست."
  }
}
```

کدهای HTTP پیشنهادی:

- `200`: دریافت موفق
- `401`: کاربر احراز هویت نشده است
- `403`: کاربر مجوز مشاهده مدل سازمانی را ندارد
- `500`: خطای داخلی سرور
