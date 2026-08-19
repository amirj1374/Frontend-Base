# مستند API مدل سازمانی

## ۱. هدف و منطق مدل

این API داده‌های لازم برای نمایش مدل سازمانی را برمی‌گرداند. برای جلوگیری از ابهام، اطلاعات در چهار بخش مستقل نگهداری می‌شوند:

1. `units`: واحدهای سازمانی مانند شرکت، معاونت و ماژول
2. `people`: اطلاعات اشخاص مانند نام، سمت و ایمیل
3. `unitRelations`: ساختار والد و فرزندی واحدهای سازمانی
4. `assignments`: انتصاب اشخاص به واحدها و ارتباط کارشناسان با مدیر مستقیم

در این مدل «معاونت» با «شخص معاون» و «ماژول» با «مدیر ماژول» یکی نیست. این جداسازی امکان تغییر افراد، انتصاب یک مدیر به چند ماژول و داشتن چند مدیر برای یک ماژول را فراهم می‌کند.

## ۲. مسیر پیشنهادی API

```http
GET /api/v1/organization-model
```

### پاسخ موفق

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

## ۳. نمونه کامل پاسخ

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
    "units": [
      {
        "id": "company-1",
        "type": "company",
        "name": "شرکت فناوری اطلاعات پارسیان",
        "description": null
      },
      {
        "id": "deputy-1",
        "type": "deputy",
        "name": "معاونت فناوری و زیرساخت",
        "description": null
      },
      {
        "id": "module-1",
        "type": "module",
        "name": "زیرساخت ابری",
        "description": "توسعه و پشتیبانی خدمات زیرساخت ابری"
      },
      {
        "id": "module-2",
        "type": "module",
        "name": "امنیت اطلاعات",
        "description": "توسعه و پشتیبانی خدمات امنیت اطلاعات"
      }
    ],
    "people": [
      {
        "id": "person-1",
        "fullName": "محمدرضا فرهمند",
        "position": "معاون فناوری و زیرساخت",
        "email": "m.farhamand@parsian-tech.ir"
      },
      {
        "id": "person-2",
        "fullName": "سارا احمدی",
        "position": "مدیر ماژول",
        "email": "s.ahmadi@parsian-tech.ir"
      },
      {
        "id": "person-3",
        "fullName": "رضا کاظمی",
        "position": "مدیر ماژول",
        "email": "r.kazemi@parsian-tech.ir"
      },
      {
        "id": "person-4",
        "fullName": "مریم رضایی",
        "position": "کارشناس زیرساخت ابری",
        "email": "m.rezaei@parsian-tech.ir"
      }
    ],
    "unitRelations": [
      {
        "id": "unit-relation-1",
        "parentUnitId": "company-1",
        "childUnitId": "deputy-1"
      },
      {
        "id": "unit-relation-2",
        "parentUnitId": "deputy-1",
        "childUnitId": "module-1"
      },
      {
        "id": "unit-relation-3",
        "parentUnitId": "deputy-1",
        "childUnitId": "module-2"
      }
    ],
    "assignments": [
      {
        "id": "assignment-1",
        "personId": "person-1",
        "unitId": "deputy-1",
        "role": "deputy_head",
        "reportsToPersonId": null
      },
      {
        "id": "assignment-2",
        "personId": "person-2",
        "unitId": "module-1",
        "role": "module_manager",
        "reportsToPersonId": "person-1"
      },
      {
        "id": "assignment-3",
        "personId": "person-3",
        "unitId": "module-1",
        "role": "module_manager",
        "reportsToPersonId": "person-1"
      },
      {
        "id": "assignment-4",
        "personId": "person-4",
        "unitId": "module-1",
        "role": "expert",
        "reportsToPersonId": "person-2"
      }
    ]
  },
  "meta": {
    "generatedAt": "2026-08-18T12:00:00Z",
    "version": "2.0"
  }
}
```

## ۴. ساختار اصلی پاسخ

| فیلد | نوع | اجباری | توضیح |
|---|---|---:|---|
| `data` | object | بله | محتوای مدل سازمانی |
| `data.summary` | object | بله | تعداد موجودیت‌های قابل نمایش |
| `data.units` | array | بله | شرکت، معاونت‌ها و ماژول‌ها |
| `data.people` | array | بله | اطلاعات اشخاص سازمان |
| `data.unitRelations` | array | بله | ساختار والد و فرزندی واحدها |
| `data.assignments` | array | بله | انتصاب اشخاص به واحدها |
| `meta.generatedAt` | ISO 8601 string | بله | زمان تولید پاسخ به‌صورت UTC |
| `meta.version` | string | بله | نسخه قرارداد؛ برای این ساختار `2.0` است |

آرایه‌های بدون داده باید به‌صورت `[]` ارسال شوند، نه `null`.

## ۵. Summary

| فیلد | مبنای محاسبه |
|---|---|
| `companies` | تعداد واحدهای دارای `type: company` |
| `deputies` | تعداد واحدهای دارای `type: deputy` |
| `modules` | تعداد واحدهای دارای `type: module` |
| `managers` | تعداد اشخاص یکتای دارای انتصاب `module_manager` |
| `experts` | تعداد اشخاص یکتای دارای انتصاب `expert` |

اعداد Summary باید توسط بک‌اند از داده واقعی محاسبه شوند و با آرایه‌ها تطابق داشته باشند.

## ۶. واحد سازمانی ـ Unit

```json
{
  "id": "module-1",
  "type": "module",
  "name": "زیرساخت ابری",
  "description": "توسعه و پشتیبانی خدمات زیرساخت ابری"
}
```

| فیلد | نوع | اجباری | توضیح |
|---|---|---:|---|
| `id` | string | بله | شناسه یکتا و پایدار واحد |
| `type` | enum | بله | نوع واحد سازمانی |
| `name` | string | بله | نام رسمی واحد |
| `description` | string/null | خیر | توضیح واحد؛ معمولاً برای ماژول استفاده می‌شود |

### انواع واحد

| مقدار | معنی |
|---|---|
| `company` | شرکت |
| `deputy` | معاونت |
| `module` | ماژول سازمانی |

نام ماژول در API بدون پیشوند اجباری «ماژول» ارسال می‌شود. فرانت‌اند در صورت نیاز این عنوان نمایشی را اضافه می‌کند.

## ۷. شخص ـ Person

```json
{
  "id": "person-2",
  "fullName": "سارا احمدی",
  "position": "مدیر ماژول",
  "email": "s.ahmadi@parsian-tech.ir"
}
```

| فیلد | نوع | اجباری | توضیح |
|---|---|---:|---|
| `id` | string | بله | شناسه یکتا و پایدار شخص؛ ترجیحاً شناسه پرسنلی غیرحساس |
| `fullName` | string | بله | نام و نام خانوادگی |
| `position` | string | بله | عنوان سمت سازمانی برای نمایش |
| `email` | string/null | خیر | ایمیل سازمانی شخص |

سمت نمایشی شخص در `position` قرار می‌گیرد، اما نقش فنی او در مدل از `assignments.role` مشخص می‌شود.

## ۸. ارتباط واحدها ـ UnitRelation

این بخش فقط ساختار سازمانی واحدها را مشخص می‌کند و نباید برای ارتباط اشخاص استفاده شود.

```json
{
  "id": "unit-relation-2",
  "parentUnitId": "deputy-1",
  "childUnitId": "module-1"
}
```

| فیلد | نوع | اجباری | توضیح |
|---|---|---:|---|
| `id` | string | بله | شناسه یکتای ارتباط |
| `parentUnitId` | string | بله | شناسه واحد والد |
| `childUnitId` | string | بله | شناسه واحد فرزند |

ارتباط‌های مجاز در نسخه فعلی:

- `company → deputy`
- `deputy → module`

## ۹. انتصاب ـ Assignment

Assignment مشخص می‌کند چه شخصی با چه نقشی در چه واحدی فعالیت دارد.

```json
{
  "id": "assignment-4",
  "personId": "person-4",
  "unitId": "module-1",
  "role": "expert",
  "reportsToPersonId": "person-2"
}
```

| فیلد | نوع | اجباری | توضیح |
|---|---|---:|---|
| `id` | string | بله | شناسه یکتای انتصاب |
| `personId` | string | بله | شناسه شخص موجود در `people` |
| `unitId` | string | بله | شناسه واحد موجود در `units` |
| `role` | enum | بله | نقش شخص در آن واحد |
| `reportsToPersonId` | string/null | بله | مدیر مستقیم شخص؛ برای بالاترین سطح می‌تواند `null` باشد |

### نقش‌های مجاز

| مقدار | واحد مقصد معمول | معنی |
|---|---|---|
| `company_head` | company | مدیر شرکت |
| `deputy_head` | deputy | مسئول یا معاون واحد معاونت |
| `module_manager` | module | مدیر ماژول |
| `expert` | module | کارشناس ماژول |

## ۱۰. ارتباط چندبه‌چند مدیر و ماژول

یک مدیر می‌تواند چند Assignment با `unitId`های متفاوت داشته باشد. همچنین چند مدیر می‌توانند برای یک `unitId` انتصاب `module_manager` داشته باشند.

### یک ماژول با دو مدیر

```json
[
  {
    "id": "assignment-10",
    "personId": "person-2",
    "unitId": "module-1",
    "role": "module_manager",
    "reportsToPersonId": "person-1"
  },
  {
    "id": "assignment-11",
    "personId": "person-3",
    "unitId": "module-1",
    "role": "module_manager",
    "reportsToPersonId": "person-1"
  }
]
```

### یک مدیر برای دو ماژول

```json
[
  {
    "id": "assignment-12",
    "personId": "person-2",
    "unitId": "module-1",
    "role": "module_manager",
    "reportsToPersonId": "person-1"
  },
  {
    "id": "assignment-13",
    "personId": "person-2",
    "unitId": "module-2",
    "role": "module_manager",
    "reportsToPersonId": "person-1"
  }
]
```

## ۱۱. نحوه محاسبه تعداد زیرمجموعه

`directReportsCount` از قرارداد حذف شده است تا عدد تکراری و ناسازگار تولید نشود.

- زیرمجموعه مستقیم شرکت: تعداد `unitRelations` متصل به شرکت
- زیرمجموعه مستقیم معاونت: تعداد ماژول‌های متصل به معاونت
- تعداد مدیران ماژول: تعداد انتصاب‌های یکتای `module_manager` برای آن ماژول
- زیرمجموعه مستقیم مدیر: تعداد Assignmentهایی که `reportsToPersonId` آن‌ها برابر شناسه مدیر است
- زیرمجموعه کارشناس: صفر

فرانت‌اند می‌تواند این اعداد را از روابط محاسبه کند. در صورت نیاز به کارایی بیشتر، بک‌اند می‌تواند فیلدهای محاسبه‌شده را در API دیگری ارائه دهد، اما منبع اصلی حقیقت همان روابط هستند.

## ۱۲. قواعد اعتبارسنجی بک‌اند

1. همه `id`ها در آرایه مربوط به خود یکتا و پایدار باشند.
2. `parentUnitId` و `childUnitId` باید به واحد موجود اشاره کنند.
3. `personId` باید در `people` وجود داشته باشد.
4. `unitId` باید در `units` وجود داشته باشد.
5. `reportsToPersonId` باید `null` یا شناسه یک شخص موجود باشد.
6. شخص نباید مدیر مستقیم خودش باشد.
7. ساختار واحدها نباید چرخه داشته باشد.
8. یک واحد نباید هم‌زمان والد خودش باشد.
9. ارتباط تکراری واحدها ارسال نشود.
10. Assignment کاملاً تکراری برای یک `personId`، `unitId` و `role` ارسال نشود.
11. نقش `deputy_head` فقط به واحد `deputy` متصل شود.
12. نقش‌های `module_manager` و `expert` فقط به واحد `module` متصل شوند.
13. ایمیل، در صورت وجود، فرمت معتبر داشته باشد.
14. همه مقادیر متنی اصلی Trim شده و خالی نباشند.
15. اعداد `summary` از داده واقعی محاسبه شوند.

## ۱۳. جستجو در فرانت‌اند

جستجو روی موارد زیر انجام می‌شود:

- `units.name`
- `units.description`
- `people.fullName`
- `people.position`
- `people.email`

در نسخه فعلی تمام داده‌ها یک‌جا دریافت و جستجو در فرانت‌اند انجام می‌شود. اگر حجم داده در آینده زیاد شد، API جداگانه زیر قابل اضافه‌شدن است:

```http
GET /api/v1/organization-model/search?q=سارا
```

## ۱۴. قرارداد TypeScript

```ts
type OrganizationUnitType = 'company' | 'deputy' | 'module';

type OrganizationRole =
  | 'company_head'
  | 'deputy_head'
  | 'module_manager'
  | 'expert';

interface OrganizationUnit {
  id: string;
  type: OrganizationUnitType;
  name: string;
  description: string | null;
}

interface OrganizationPerson {
  id: string;
  fullName: string;
  position: string;
  email: string | null;
}

interface OrganizationUnitRelation {
  id: string;
  parentUnitId: string;
  childUnitId: string;
}

interface OrganizationAssignment {
  id: string;
  personId: string;
  unitId: string;
  role: OrganizationRole;
  reportsToPersonId: string | null;
}

interface OrganizationModelResponse {
  data: {
    summary: {
      companies: number;
      deputies: number;
      modules: number;
      managers: number;
      experts: number;
    };
    units: OrganizationUnit[];
    people: OrganizationPerson[];
    unitRelations: OrganizationUnitRelation[];
    assignments: OrganizationAssignment[];
  };
  meta: {
    generatedAt: string;
    version: '2.0';
  };
}
```

## ۱۵. پاسخ خطا

```json
{
  "error": {
    "code": "ORGANIZATION_MODEL_NOT_AVAILABLE",
    "message": "اطلاعات مدل سازمانی در دسترس نیست."
  }
}
```

کدهای HTTP پیشنهادی:

| کد | معنی |
|---:|---|
| `200` | دریافت موفق |
| `401` | کاربر احراز هویت نشده است |
| `403` | کاربر مجوز مشاهده مدل سازمانی را ندارد |
| `500` | خطای داخلی سرور |

## ۱۶. نکات نهایی برای بک‌اند

- ترتیب آرایه‌ها نباید مبنای تشخیص ارتباط باشد؛ تمام اتصال‌ها با شناسه انجام می‌شوند.
- موقعیت گراف، رنگ، اندازه و چیدمان شعاعی مسئولیت فرانت‌اند است و نباید از بک‌اند ارسال شود.
- شناسه‌ها پس از تغییر نام شخص یا واحد نباید عوض شوند.
- اطلاعات سازمانی و اطلاعات اشخاص نباید در یک رکورد ادغام شوند.
- منبع اصلی تعداد زیرمجموعه‌ها روابط و انتصاب‌ها هستند، نه یک عدد دستی.
