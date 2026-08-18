import type { ChatMessage, ChatSession } from '../types/chat';

export const mockChatSessions: ChatSession[] = [
  { id: 'demo-customer-relations', sessionId: 'demo-customer-relations', summary: 'تحلیل ارتباط مشتری و حساب‌ها', updatedAt: '2026-08-18T09:20:00.000Z' },
  { id: 'demo-active-accounts', sessionId: 'demo-active-accounts', summary: 'Query حساب‌های فعال مشتری', updatedAt: '2026-08-17T14:10:00.000Z' },
  { id: 'demo-lotus-impact', sessionId: 'demo-lotus-impact', summary: 'اثر تغییر جدول تراکنش لوتوس', updatedAt: '2026-08-15T08:45:00.000Z' },
  { id: 'demo-card-model', sessionId: 'demo-card-model', summary: 'مدل داده کارت‌های بانکی', updatedAt: '2026-08-12T11:30:00.000Z' }
];

const completed = (id: string, role: ChatMessage['role'], content: string): ChatMessage => ({
  id, role, content, status: 'completed', createdAt: new Date().toISOString()
});

export const mockSessionMessages: Record<string, ChatMessage[]> = {
  'demo-customer-relations': [
    completed('history-1-user', 'user', 'ارتباط مشتری با حساب‌ها و تراکنش‌ها را توضیح بده.'),
    completed('history-1-assistant', 'assistant', 'هر **مشتری** می‌تواند چند حساب داشته باشد و هر حساب نیز شامل مجموعه‌ای از تراکنش‌ها است. اتصال مشتری به تراکنش از طریق `ACCOUNT_ID` انجام می‌شود.')
  ],
  'demo-active-accounts': [
    completed('history-2-user', 'user', 'Query حساب‌های فعال یک مشتری را بنویس.'),
    completed('history-2-assistant', 'assistant', '```sql\nSELECT * FROM ACCOUNT\nWHERE CUSTOMER_ID = :customerId\n  AND ACCOUNT_STATUS = \'ACTIVE\';\n```')
  ],
  'demo-lotus-impact': [
    completed('history-3-user', 'user', 'تغییر طول ستون CHANNEL_CODE در لوتوس چه اثری دارد؟'),
    completed('history-3-assistant', 'assistant', 'این تغییر باید در نگاشت ETL، مدل انبار داده و قرارداد سرویس‌های مصرف‌کننده بررسی شود. بیشترین ریسک مربوط به تبدیل‌های دارای طول ثابت است.')
  ],
  'demo-card-model': [
    completed('history-4-user', 'user', 'مدل داده کارت بانکی را خلاصه کن.'),
    completed('history-4-assistant', 'assistant', 'موجودیت کارت از طریق `ACCOUNT_ID` به حساب متصل است و اطلاعات غیرحساس مانند شماره ماسک‌شده، وضعیت و تاریخ انقضا را نگه می‌دارد.')
  ]
};
