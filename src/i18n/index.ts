import { createI18n } from 'vue-i18n';

export const messages = {
  fa: {
    common: { loading: 'لطفا منتظر بمانید', retry: 'تلاش مجدد', no: 'خیر', yes: 'بله' },
    customizer: {
      switchLanguage: 'تغییر زبان برنامه',
      switchToEnglish: 'چیدمان چپ‌به‌راست فعال شد. زبان برنامه به انگلیسی تغییر کند؟',
      switchToPersian: 'چیدمان راست‌به‌چپ فعال شد. زبان برنامه به فارسی تغییر کند؟',
      confirmEnglish: 'بله، انگلیسی', confirmPersian: 'بله، فارسی'
    },
    profile: { search: 'جستجو', notifications: 'فعال‌سازی اعلان‌ها', settings: 'تنظیمات کاربری', account: 'پروفایل', logout: 'خروج', switchLanguage: 'English' },
    errors: { notFound: 'صفحه مورد نظر یافت نشد', backHome: 'بازگشت به صفحه اصلی', home: 'صفحه اصلی', forbidden: '403 - دسترسی غیرمجاز', forbiddenDescription: 'شما مجوز دسترسی به این صفحه را ندارید', auth: '401 - خطا در احراز هویت', authUnavailable: 'سرویس احراز هویت در دسترس نیست', retry: 'تلاش مجدد' },
    showcase: { title: 'نمونهٔ کامپوننت‌های UI Kit', subtitle: 'همهٔ اجزا با رنگ، فونت، radius و حالت روشن/تاریک فعلی هماهنگ هستند.', action: 'عملیات نمونه', filters: 'فیلتر و جستجو', search: 'عبارت جستجو', status: 'وضعیت', date: 'تاریخ ثبت', all: 'همه', active: 'فعال', inactive: 'غیرفعال', sampleInfo: 'اطلاعات نمونه', formDescription: 'چینش فرم به‌صورت واکنش‌گرا از دو ستون به یک ستون تبدیل می‌شود.', fullName: 'نام و نام خانوادگی', phone: 'شماره تماس', email: 'پست الکترونیک', category: 'دسته‌بندی', optionOne: 'گزینهٔ اول', optionTwo: 'گزینهٔ دوم', states: 'وضعیت‌ها', reviewing: 'در حال بررسی', approved: 'تأیید شده', needsAction: 'نیازمند اقدام', draft: 'پیش‌نویس', files: 'فایل‌های انتخاب‌شده', emptyTitle: 'داده‌ای برای نمایش وجود ندارد', emptyDescription: 'برای شروع، یک مورد جدید ایجاد کنید.', create: 'ایجاد مورد', confirmTitle: 'انجام عملیات نمونه؟', confirmDescription: 'این دیالوگ تنها رفتار و ظاهر تأیید عملیات را نمایش می‌دهد.', confirm: 'تأیید' }
  },
  en: {
    common: { loading: 'Please wait', retry: 'Retry', no: 'No', yes: 'Yes' },
    customizer: {
      switchLanguage: 'Switch application language',
      switchToEnglish: 'Left-to-right layout is active. Would you like to switch the application language to English?',
      switchToPersian: 'Right-to-left layout is active. Would you like to switch the application language to Persian?',
      confirmEnglish: 'Yes, switch to English', confirmPersian: 'Yes, switch to Persian'
    },
    profile: { search: 'Search', notifications: 'Enable notifications', settings: 'User settings', account: 'Profile', logout: 'Sign out', switchLanguage: 'فارسی' },
    errors: { notFound: 'Page not found', backHome: 'Back to home', home: 'Home', forbidden: '403 - Access denied', forbiddenDescription: 'You do not have permission to access this page', auth: '401 - Authentication error', authUnavailable: 'The authentication service is unavailable', retry: 'Try again' },
    showcase: { title: 'UI Kit Component Showcase', subtitle: 'Every component follows the current color, font, radius, and light/dark settings.', action: 'Sample action', filters: 'Filter and search', search: 'Search term', status: 'Status', date: 'Registration date', all: 'All', active: 'Active', inactive: 'Inactive', sampleInfo: 'Sample information', formDescription: 'The responsive form changes from two columns to one.', fullName: 'Full name', phone: 'Phone number', email: 'Email address', category: 'Category', optionOne: 'First option', optionTwo: 'Second option', states: 'Statuses', reviewing: 'Under review', approved: 'Approved', needsAction: 'Action required', draft: 'Draft', files: 'Selected files', emptyTitle: 'No data to display', emptyDescription: 'Create a new item to get started.', create: 'Create item', confirmTitle: 'Perform sample action?', confirmDescription: 'This dialog demonstrates the confirmation appearance and behavior only.', confirm: 'Confirm' }
  }
} as const;

export const i18n = createI18n({
  legacy: false,
  locale: 'fa',
  fallbackLocale: 'fa',
  messages
});
