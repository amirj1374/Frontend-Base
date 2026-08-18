import { createI18n } from 'vue-i18n';

export const messages = {
  fa: {
    common: { loading: 'لطفا منتظر بمانید', retry: 'تلاش مجدد', no: 'خیر', yes: 'بله', search: 'جستجو', select: 'انتخاب', clear: 'پاک کردن', unknown: 'نامشخص', saveSuccess: 'تنظیمات با موفقیت ذخیره شد', saveError: 'خطا در ذخیره تنظیمات', sentPayload: 'رشتهٔ ارسال‌شده: {payload}' },
    customizer: {
      switchLanguage: 'تغییر زبان برنامه',
      switchToEnglish: 'چیدمان چپ‌به‌راست فعال شد. زبان برنامه به انگلیسی تغییر کند؟',
      switchToPersian: 'چیدمان راست‌به‌چپ فعال شد. زبان برنامه به فارسی تغییر کند؟',
      confirmEnglish: 'بله، انگلیسی', confirmPersian: 'بله، فارسی'
    },
    profile: { search: 'جستجو', notifications: 'فعال‌سازی اعلان‌ها', settings: 'تنظیمات کاربری', account: 'پروفایل', logout: 'خروج', switchLanguage: 'English' },
    navigation: { dashboard: 'داشبورد', isas: 'سامانه ISAS', isasChat: 'دستیار هوشمند', isasCatalog: 'دانشنامه داده', isasOrganization: 'مدل سازمانی' },
    isas: {
      title: 'دستیار هوشمند ISAS',
      subtitle: 'تحلیل مدل داده، اثر تغییرات لوتوس و تولید کد',
      greeting: 'امروز چطور می‌توانم در تحلیل سامانه لوتوس به شما کمک کنم؟',
      greetingSub: 'سؤال خود را درباره سامانه لوتوس مطرح کنید.',
      newConversation: 'گفتگوی جدید',
      references: 'منابع فعال',
      mode: 'نوع تحلیل',
      model: 'مدل هوش مصنوعی',
      entity: 'موجودیت مدل داده',
      noEntities: 'موجودیتی یافت نشد',
      placeholder: 'سؤال خود را بنویسید…',
      send: 'ارسال',
      stop: 'توقف پاسخ',
      cancelEdit: 'لغو ویرایش',
      saveEdit: 'ذخیره و ارسال مجدد',
      jumpToBottom: 'رفتن به آخرین پیام',
      copyCode: 'کپی کد',
      codeCopied: 'کپی شد',
      changePattern: 'تغییر طرح پس‌زمینه چت',
      choosePattern: 'انتخاب طرح پس‌زمینه چت',
      patterns: { circuit: 'مدار داده', nodes: 'شبکه نقطه‌ای', waves: 'موج‌های نرم', mesh: 'شبکه هندسی' },
      enterHint: 'Enter برای ارسال، Shift + Enter برای خط جدید',
      disclaimer: 'خروجی هوش مصنوعی را پیش از استفاده بررسی کنید.',
      modes: { data: 'مدل داده', impact: 'تأثیر تغییرات لوتوس', code: 'تولید کد' },
      mentions: { tables: 'جداول', entities: 'موجودیت‌ها', files: 'فایل‌های سورس', search: 'جستجو', noResult: 'نتیجه‌ای یافت نشد؛ عبارت را بعد از @ بنویسید.' }
    },
    notifications: { all: 'همه اعلان‌ها', new: 'جدید', unread: 'خوانده نشده', other: 'دیگر', markAllRead: 'علامت‌گذاری همه به‌عنوان خوانده‌شده', system: 'اطلاعیه سیستم', minutesAgo: '{count} دقیقه قبل', description: 'زیرساخت پروژهٔ فرانت؛ اعلان‌ها در این بخش نمایش داده می‌شوند.', viewAll: 'نمایش همه' },
    login: { username: 'نام کاربری', password: 'رمز عبور', remember: 'ذخیره رمز عبور', forgot: 'فراموشی رمز عبور', submit: 'وارد شوید', usernameRequired: 'نام کاربری را وارد نمایید', usernameInvalid: 'نام کاربری صحیح نیست', passwordRequired: 'رمز عبور وارد نشده است', passwordLength: 'رمز عبور باید کمتر از ۱۰ کاراکتر باشد' },
    register: { title: 'ایجاد حساب', subtitle: 'برای ادامه اطلاعات خود را وارد کنید', google: 'ثبت‌نام با گوگل', or: 'یا', emailSignup: 'ثبت‌نام با ایمیل', firstName: 'نام', lastName: 'نام خانوادگی', email: 'ایمیل / نام کاربری', agree: 'موافقم با', terms: 'قوانین و شرایط', submit: 'ثبت‌نام', existing: 'حساب کاربری دارید؟', emailRequired: 'ایمیل الزامی است', emailInvalid: 'ایمیل معتبر نیست', passwordRequired: 'رمز عبور الزامی است', passwordLength: 'رمز عبور باید کمتر از ۱۰ کاراکتر باشد' },
    settings: { title: 'مدیریت سیستم', general: 'تنظیمات عمومی پروژه', name: 'نام', description: 'توضیحات', value: 'مقدار' },
    dashboard: { loadingUser: 'در حال بارگذاری اطلاعات کاربر…', loadError: 'خطا در بارگذاری اطلاعات', role: 'نقش / سمت', fullName: 'نام و نام خانوادگی', branch: 'شعبه', totalBalance: 'رسوب کل', chart: 'نمونه چارت', chartSample: 'نمونه', period: 'بازه زمانی', daily: 'روزانه', previousMonth: 'ماه گذشته', previousTwoMonths: 'دو ماه گذشته', previousThreeMonths: 'سه ماه گذشته', noData: 'داده‌ای موجود نیست', dataLoadIssue: 'دریافت اطلاعات با مشکل مواجه شد.', dataLoadError: 'خطا در دریافت اطلاعات.', callRecords: 'کل سوابق مکاتبات پرونده', requestReceived: 'دریافت درخواست', postalAssigned: 'تخصیص شناسه پستی', successfulVisit: 'مراجعه موفق', unsuccessfulVisit: 'مراجعه ناموفق', registered: 'ثبت شده', invalidSerial: 'سریال نامعتبر', duplicateSerial: 'سریال تکراری', invalidDestination: 'مقصد نامعتبر', invalidRecipientAddress: 'آدرس گیرنده نامعتبر', duplicateTracking: 'کد رهگیری تکراری', invalidRecipient: 'گیرنده نامعتبر', unknownCommitment: 'متعهد نامشخص', unknownError: 'خطای نامشخص', readyToSend: 'آماده ارسال', invalidUserCode: 'کد کاربری نامعتبر', invalidData: 'دیتای نامعتبر' },
    errors: { notFound: 'صفحه مورد نظر یافت نشد', backHome: 'بازگشت به صفحه اصلی', home: 'صفحه اصلی', forbidden: '403 - دسترسی غیرمجاز', forbiddenDescription: 'شما مجوز دسترسی به این صفحه را ندارید', forbiddenHelp: 'لطفاً با مدیر سیستم تماس بگیرید یا به صفحهٔ اصلی برگردید', auth: '401 - خطا در احراز هویت', authUnavailable: 'سرویس احراز هویت در دسترس نیست', authHelp: 'لطفاً صفحه را مجدداً بارگذاری کنید یا با مدیر سیستم تماس بگیرید', details: 'جزئیات خطا:', unknownAuth: 'خطای نامشخص در احراز هویت', retry: 'تلاش مجدد' },
    showcase: { title: 'نمونهٔ کامپوننت‌های UI Kit', subtitle: 'همهٔ اجزا با رنگ، فونت، radius و حالت روشن/تاریک فعلی هماهنگ هستند.', action: 'عملیات نمونه', filters: 'فیلتر و جستجو', search: 'عبارت جستجو', status: 'وضعیت', date: 'تاریخ ثبت', all: 'همه', active: 'فعال', inactive: 'غیرفعال', sampleInfo: 'اطلاعات نمونه', formDescription: 'چینش فرم به‌صورت واکنش‌گرا از دو ستون به یک ستون تبدیل می‌شود.', fullName: 'نام و نام خانوادگی', phone: 'شماره تماس', email: 'پست الکترونیک', category: 'دسته‌بندی', optionOne: 'گزینهٔ اول', optionTwo: 'گزینهٔ دوم', states: 'وضعیت‌ها', reviewing: 'در حال بررسی', approved: 'تأیید شده', needsAction: 'نیازمند اقدام', draft: 'پیش‌نویس', files: 'فایل‌های انتخاب‌شده', emptyTitle: 'داده‌ای برای نمایش وجود ندارد', emptyDescription: 'برای شروع، یک مورد جدید ایجاد کنید.', create: 'ایجاد مورد', confirmTitle: 'انجام عملیات نمونه؟', confirmDescription: 'این دیالوگ تنها رفتار و ظاهر تأیید عملیات را نمایش می‌دهد.', confirm: 'تأیید', guide: 'راهنمای استفاده.pdf', sampleImage: 'تصویر نمونه.png', saved: 'تغییرات ذخیره شد', savedDescription: 'تنظیمات نمایشی با موفقیت ثبت شد.', now: 'اکنون', ready: 'نمونهٔ آماده', readyDescription: 'کامپوننت‌های عمومی برای بررسی آماده‌اند.', minutesAgo: '۵ دقیقه قبل' }
  },
  en: {
    common: { loading: 'Please wait', retry: 'Retry', no: 'No', yes: 'Yes', search: 'Search', select: 'Select', clear: 'Clear', unknown: 'Unknown', saveSuccess: 'Settings saved successfully', saveError: 'Unable to save settings', sentPayload: 'Sent payload: {payload}' },
    customizer: {
      switchLanguage: 'Switch application language',
      switchToEnglish: 'Left-to-right layout is active. Would you like to switch the application language to English?',
      switchToPersian: 'Right-to-left layout is active. Would you like to switch the application language to Persian?',
      confirmEnglish: 'Yes, switch to English', confirmPersian: 'Yes, switch to Persian'
    },
    profile: { search: 'Search', notifications: 'Enable notifications', settings: 'User settings', account: 'Profile', logout: 'Sign out', switchLanguage: 'فارسی' },
    navigation: { dashboard: 'Dashboard', isas: 'ISAS', isasChat: 'AI Assistant', isasCatalog: 'Data Catalog', isasOrganization: 'Organization Model' },
    isas: {
      title: 'ISAS Assistant',
      subtitle: 'Data model, Lotus change-impact analysis, and code generation',
      greeting: 'How can I help you analyze the Lotus system today?',
      greetingSub: 'Ask a question about the Lotus system.',
      newConversation: 'New conversation',
      references: 'Active references',
      mode: 'Analysis mode',
      model: 'AI model',
      entity: 'Data-model entity',
      noEntities: 'No entities found',
      placeholder: 'Ask your question…',
      send: 'Send',
      stop: 'Stop response',
      cancelEdit: 'Cancel editing',
      saveEdit: 'Save and resend',
      jumpToBottom: 'Jump to latest message',
      copyCode: 'Copy code',
      codeCopied: 'Copied',
      changePattern: 'Change chat background pattern',
      choosePattern: 'Choose chat background pattern',
      patterns: { circuit: 'Data circuit', nodes: 'Node network', waves: 'Soft waves', mesh: 'Geometric mesh' },
      enterHint: 'Enter to send, Shift + Enter for a new line',
      disclaimer: 'Review AI-generated output before using it.',
      modes: { data: 'Data model', impact: 'Lotus change impact', code: 'Code generation' },
      mentions: { tables: 'Tables', entities: 'Entities', files: 'Source files', search: 'Search', noResult: 'No results; type a query after @.' }
    },
    notifications: { all: 'All notifications', new: 'New', unread: 'Unread', other: 'Other', markAllRead: 'Mark all as read', system: 'System notification', minutesAgo: '{count} minutes ago', description: 'Frontend infrastructure notification. Notifications are shown in this area.', viewAll: 'View all' },
    login: { username: 'Username', password: 'Password', remember: 'Remember password', forgot: 'Forgot password?', submit: 'Sign in', usernameRequired: 'Enter your username', usernameInvalid: 'Enter a valid username', passwordRequired: 'Enter your password', passwordLength: 'Password must be less than 10 characters' },
    register: { title: 'Sign up', subtitle: 'Enter your details to continue', google: 'Sign up with Google', or: 'OR', emailSignup: 'Sign up with email', firstName: 'First name', lastName: 'Last name', email: 'Email / username', agree: 'I agree to the', terms: 'Terms and conditions', submit: 'Sign up', existing: 'Already have an account?', emailRequired: 'Email is required', emailInvalid: 'Enter a valid email address', passwordRequired: 'Password is required', passwordLength: 'Password must be less than 10 characters' },
    settings: { title: 'System management', general: 'General project settings', name: 'Name', description: 'Description', value: 'Value' },
    dashboard: { loadingUser: 'Loading user information…', loadError: 'Unable to load information', role: 'Role / position', fullName: 'Full name', branch: 'Branch', totalBalance: 'Total balance', chart: 'Chart sample', chartSample: 'Sample', period: 'Period', daily: 'Daily', previousMonth: 'Previous month', previousTwoMonths: 'Previous two months', previousThreeMonths: 'Previous three months', noData: 'No data available', dataLoadIssue: 'Unable to retrieve information.', dataLoadError: 'Error retrieving information.', callRecords: 'Total case correspondence records', requestReceived: 'Request received', postalAssigned: 'Postal identifier assigned', successfulVisit: 'Successful visit', unsuccessfulVisit: 'Unsuccessful visit', registered: 'Registered', invalidSerial: 'Invalid serial', duplicateSerial: 'Duplicate serial', invalidDestination: 'Invalid destination', invalidRecipientAddress: 'Invalid recipient address', duplicateTracking: 'Duplicate tracking code', invalidRecipient: 'Invalid recipient', unknownCommitment: 'Unknown commitment', unknownError: 'Unknown error', readyToSend: 'Ready to send', invalidUserCode: 'Invalid user code', invalidData: 'Invalid data' },
    errors: { notFound: 'Page not found', backHome: 'Back to home', home: 'Home', forbidden: '403 - Access denied', forbiddenDescription: 'You do not have permission to access this page', forbiddenHelp: 'Contact your system administrator or return to the home page.', auth: '401 - Authentication error', authUnavailable: 'The authentication service is unavailable', authHelp: 'Reload the page or contact your system administrator.', details: 'Error details:', unknownAuth: 'Unknown authentication error', retry: 'Try again' },
    showcase: { title: 'UI Kit Component Showcase', subtitle: 'Every component follows the current color, font, radius, and light/dark settings.', action: 'Sample action', filters: 'Filter and search', search: 'Search term', status: 'Status', date: 'Registration date', all: 'All', active: 'Active', inactive: 'Inactive', sampleInfo: 'Sample information', formDescription: 'The responsive form changes from two columns to one.', fullName: 'Full name', phone: 'Phone number', email: 'Email address', category: 'Category', optionOne: 'First option', optionTwo: 'Second option', states: 'Statuses', reviewing: 'Under review', approved: 'Approved', needsAction: 'Action required', draft: 'Draft', files: 'Selected files', emptyTitle: 'No data to display', emptyDescription: 'Create a new item to get started.', create: 'Create item', confirmTitle: 'Perform sample action?', confirmDescription: 'This dialog demonstrates the confirmation appearance and behavior only.', confirm: 'Confirm', guide: 'User guide.pdf', sampleImage: 'Sample image.png', saved: 'Changes saved', savedDescription: 'Display settings were saved successfully.', now: 'Now', ready: 'Sample ready', readyDescription: 'Shared components are ready for review.', minutesAgo: '5 minutes ago' }
  }
} as const;

export const i18n = createI18n({
  legacy: false,
  locale: 'fa',
  fallbackLocale: 'fa',
  messages
});
