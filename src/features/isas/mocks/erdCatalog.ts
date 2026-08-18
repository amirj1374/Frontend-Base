import type { EntityOption } from '../types/chat';
import type { ErdEdge, ErdNode } from '../types/erd';

export const mockEntityOptions: EntityOption[] = [
  { title: 'مشتری حقیقی — CUSTOMER', value: 'CUSTOMER|Customer' },
  { title: 'حساب بانکی — ACCOUNT', value: 'ACCOUNT|Account' },
  { title: 'تراکنش — TRANSACTION', value: 'TRANSACTION|Transaction' },
  { title: 'کارت بانکی — CARD', value: 'CARD|Card' },
  { title: 'شعبه — BRANCH', value: 'BRANCH|Branch' }
];

export const mockCatalogNodes: ErdNode[] = [
  {
    id: 'customer', position: { x: 0, y: 0 },
    data: {
      label: 'مشتری', tableName: 'CUSTOMER', catalogLabel: 'مشتری حقیقی', schemaLabel: 'CRM.CUSTOMER',
      description: 'اطلاعات پایه و هویتی مشتریان حقیقی بانک؛ مرجع اصلی اتصال حساب‌ها و اطلاعات تماس.',
      columns: [
        { name: 'CUSTOMER_ID', type: 'NUMBER(18)', label: 'شناسه مشتری', usage: 'کلید اصلی', description: 'شناسه یکتای مشتری در سامانه متمرکز', source: 'Core Banking', isPrimary: true },
        { name: 'NATIONAL_CODE', type: 'VARCHAR2(10)', label: 'کد ملی', usage: 'تطبیق هویت', description: 'کد ملی معتبر مشتری حقیقی', source: 'سامانه ثبت احوال' },
        { name: 'FULL_NAME', type: 'NVARCHAR2(200)', label: 'نام کامل', usage: 'نمایش', description: 'نام و نام خانوادگی مشتری', source: 'ترکیب نام و نام خانوادگی' },
        { name: 'CUSTOMER_STATUS', type: 'CHAR(1)', label: 'وضعیت مشتری', usage: 'کنترل سرویس', description: 'فعال، مسدود یا راکد', source: 'Core Banking' }
      ]
    }
  },
  {
    id: 'account', position: { x: 0, y: 0 },
    data: {
      label: 'حساب بانکی', tableName: 'ACCOUNT', catalogLabel: 'حساب مشتری', schemaLabel: 'CORE.ACCOUNT',
      description: 'اطلاعات حساب‌های ریالی و ارزی مشتریان به همراه مانده و وضعیت عملیاتی.',
      columns: [
        { name: 'ACCOUNT_ID', type: 'NUMBER(18)', label: 'شناسه حساب', usage: 'کلید اصلی', source: 'Core Banking', isPrimary: true },
        { name: 'CUSTOMER_ID', type: 'NUMBER(18)', label: 'شناسه مشتری', usage: 'مالک حساب', source: 'CRM.CUSTOMER', isForeign: true },
        { name: 'IBAN', type: 'VARCHAR2(26)', label: 'شماره شبا', usage: 'انتقال وجه', source: 'مولد شبا' },
        { name: 'BALANCE', type: 'NUMBER(20,2)', label: 'مانده حساب', usage: 'گزارش مالی', source: 'دفتر کل' }
      ]
    }
  },
  {
    id: 'transaction', position: { x: 0, y: 0 },
    data: {
      label: 'تراکنش', tableName: 'TRANSACTION', catalogLabel: 'تراکنش مالی', schemaLabel: 'DWH.FACT_TRANSACTION',
      description: 'رخدادهای مالی ثبت‌شده روی حساب‌ها با اطلاعات مبلغ، کانال و زمان انجام.',
      columns: [
        { name: 'TRANSACTION_ID', type: 'NUMBER(20)', label: 'شناسه تراکنش', usage: 'کلید اصلی', source: 'Transaction Switch', isPrimary: true },
        { name: 'ACCOUNT_ID', type: 'NUMBER(18)', label: 'شناسه حساب', usage: 'حساب مبدأ', source: 'CORE.ACCOUNT', isForeign: true },
        { name: 'AMOUNT', type: 'NUMBER(20,2)', label: 'مبلغ', usage: 'محاسبات مالی', source: 'Transaction Switch' },
        { name: 'CHANNEL_CODE', type: 'VARCHAR2(20)', label: 'کانال', usage: 'تحلیل کانال', source: 'نگاشت کد کانال' }
      ]
    }
  },
  {
    id: 'card', position: { x: 0, y: 0 },
    data: {
      label: 'کارت بانکی', tableName: 'CARD', catalogLabel: 'کارت متصل به حساب', schemaLabel: 'CARD.CARD_MASTER',
      description: 'مشخصات غیرحساس کارت‌های صادرشده و اتصال آن‌ها به حساب بانکی.',
      columns: [
        { name: 'CARD_ID', type: 'NUMBER(18)', label: 'شناسه کارت', usage: 'کلید اصلی', source: 'Card Management', isPrimary: true },
        { name: 'ACCOUNT_ID', type: 'NUMBER(18)', label: 'شناسه حساب', usage: 'حساب متصل', source: 'CORE.ACCOUNT', isForeign: true },
        { name: 'MASKED_PAN', type: 'VARCHAR2(19)', label: 'شماره کارت ماسک‌شده', usage: 'نمایش امن', source: 'ماسک PAN' },
        { name: 'EXPIRY_DATE', type: 'CHAR(4)', label: 'تاریخ انقضا', usage: 'کنترل اعتبار', source: 'Card Management' }
      ]
    }
  },
  {
    id: 'branch', position: { x: 0, y: 0 },
    data: {
      label: 'شعبه', tableName: 'BRANCH', catalogLabel: 'شعب بانک', schemaLabel: 'REF.BRANCH',
      description: 'اطلاعات مرجع شعب و واحدهای سازمانی افتتاح‌کننده حساب.',
      columns: [
        { name: 'BRANCH_CODE', type: 'VARCHAR2(8)', label: 'کد شعبه', usage: 'کلید اصلی', source: 'منبع مرجع شعب', isPrimary: true },
        { name: 'BRANCH_NAME', type: 'NVARCHAR2(150)', label: 'نام شعبه', usage: 'نمایش و گزارش', source: 'منبع مرجع شعب' },
        { name: 'CITY_CODE', type: 'VARCHAR2(5)', label: 'کد شهر', usage: 'تحلیل جغرافیایی', source: 'مرجع جغرافیا', isForeign: true }
      ]
    }
  }
];

export const mockCatalogEdges: ErdEdge[] = [
  { id: 'customer-account', source: 'customer', target: 'account', label: 'مالک حساب', data: { sourceColumn: 'CUSTOMER_ID', targetColumn: 'CUSTOMER_ID' } },
  { id: 'account-transaction', source: 'account', target: 'transaction', label: 'تراکنش‌های حساب', data: { sourceColumn: 'ACCOUNT_ID', targetColumn: 'ACCOUNT_ID' } },
  { id: 'account-card', source: 'account', target: 'card', label: 'کارت‌های حساب', data: { sourceColumn: 'ACCOUNT_ID', targetColumn: 'ACCOUNT_ID' } },
  { id: 'branch-account', source: 'branch', target: 'account', label: 'شعبه افتتاح‌کننده', data: { sourceColumn: 'BRANCH_CODE', targetColumn: 'OPEN_BRANCH_CODE' } }
];
