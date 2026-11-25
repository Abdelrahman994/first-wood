const I18N = {
  en: {
    site_name: 'First Wood',
    nav_home: 'Home', nav_products: 'Products', nav_contact: 'Contact',
    hero_title: 'Quality wood, crafted with care',
    hero_sub: 'First Wood produces wooden blades and supplies raw wood for builders, designers and businesses.',
    hero_cta: 'Request a quote', hero_cta2: 'Our products',
    about_title: 'About us',
    about_text: 'First Wood is a wood company focused on quality, fair prices and reliable delivery.',
    feat1_title: 'Quality', feat1_text: 'Carefully selected wood and precise finishing.',
    feat2_title: 'Custom sizes', feat2_text: 'Blades and panels made to your dimensions.',
    feat3_title: 'Bulk orders', feat3_text: 'Special pricing for businesses and large projects.',
    prod_title: 'Our products', prod_sub: 'Tell us what you need and we will send you a quote.',
    blades_title: 'Wooden blades', blades_text: 'Wooden slats joined together to form panels, ready for walls, ceilings, shelving and decoration.',
    raw_title: 'Raw wood', raw_text: 'Raw timber in different types and sizes for manufacturers and workshops.',
    custom_title: 'Deals and consultation', custom_text: 'Want to make a deal or discuss a project? Send us your details.',
    btn_enquire: 'Enquire now',
    contact_title: 'Contact us', contact_sub: 'Send your enquiry and we will get back to you.',
    f_name: 'Full name', f_company: 'Company (optional)', f_email: 'Email', f_phone: 'Phone',
    f_type: 'Enquiry type', f_message: 'Message', f_submit: 'Send',
    t_quote: 'Price quote', t_raw_wood: 'Buy raw wood', t_deal: 'Business deal', t_consultation: 'Consultation', t_other: 'Other',
    f_success: 'Thank you! We received your enquiry.',
    f_error: 'Something went wrong. Please try again.',
    f_need: 'Please enter an email or a phone number.',
    footer_rights: 'All rights reserved.',
    a_title: 'Enquiries', a_login: 'Admin login', a_user: 'Username', a_pass: 'Password',
    a_signin: 'Sign in', a_logout: 'Sign out', a_login_err: 'Wrong username or password.',
    a_all: 'All', a_none: 'No enquiries found.',
    s_new: 'New', s_in_progress: 'In progress', s_closed: 'Closed'
  },
  ar: {
    site_name: 'First Wood',
    nav_home: 'الرئيسية', nav_products: 'المنتجات', nav_contact: 'تواصل معنا',
    hero_title: 'خشب عالي الجودة، بصناعة متقنة',
    hero_sub: 'تنتج First Wood ألواح البليد الخشبية وتورّد الخشب الخام للمقاولين والمصممين والشركات.',
    hero_cta: 'اطلب عرض سعر', hero_cta2: 'منتجاتنا',
    about_title: 'من نحن',
    about_text: 'First Wood شركة متخصصة في الأخشاب، تركز على الجودة والأسعار العادلة والتسليم في الموعد.',
    feat1_title: 'الجودة', feat1_text: 'أخشاب مختارة بعناية وتشطيب دقيق.',
    feat2_title: 'مقاسات حسب الطلب', feat2_text: 'ألواح بمقاسات تناسب احتياجك.',
    feat3_title: 'طلبات الجملة', feat3_text: 'أسعار خاصة للشركات والمشروعات الكبيرة.',
    prod_title: 'منتجاتنا', prod_sub: 'أخبرنا بما تحتاجه وسنرسل لك عرض سعر.',
    blades_title: 'ألواح البليد الخشبية', blades_text: 'شرائح خشبية متراصة تُشكّل ألواحًا جاهزة للجدران والأسقف والأرفف والديكور.',
    raw_title: 'الخشب الخام', raw_text: 'أخشاب خام بأنواع ومقاسات مختلفة للمصانع والورش.',
    custom_title: 'الصفقات والاستشارات', custom_text: 'هل تريد عقد صفقة أو مناقشة مشروع؟ أرسل لنا تفاصيلك.',
    btn_enquire: 'استفسر الآن',
    contact_title: 'تواصل معنا', contact_sub: 'أرسل استفسارك وسنرد عليك في أقرب وقت.',
    f_name: 'الاسم بالكامل', f_company: 'الشركة (اختياري)', f_email: 'البريد الإلكتروني', f_phone: 'رقم الهاتف',
    f_type: 'نوع الاستفسار', f_message: 'الرسالة', f_submit: 'إرسال',
    t_quote: 'عرض سعر', t_raw_wood: 'شراء خشب خام', t_deal: 'صفقة تجارية', t_consultation: 'استشارة', t_other: 'أخرى',
    f_success: 'شكرًا لك! تم استلام استفسارك.',
    f_error: 'حدث خطأ. حاول مرة أخرى.',
    f_need: 'من فضلك أدخل بريدًا إلكترونيًا أو رقم هاتف.',
    footer_rights: 'جميع الحقوق محفوظة.',
    a_title: 'الاستفسارات', a_login: 'دخول المسؤول', a_user: 'اسم المستخدم', a_pass: 'كلمة المرور',
    a_signin: 'دخول', a_logout: 'خروج', a_login_err: 'اسم المستخدم أو كلمة المرور غير صحيحة.',
    a_all: 'الكل', a_none: 'لا توجد استفسارات.',
    s_new: 'جديد', s_in_progress: 'قيد المعالجة', s_closed: 'مغلق'
  }
};

function getLang() {
  try {
    const saved = localStorage.getItem('fw_lang');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch (e) { /* storage unavailable */ }
  return (navigator.language || '').startsWith('ar') ? 'ar' : 'en';
}

function t(key) {
  return (I18N[getLang()] && I18N[getLang()][key]) || I18N.en[key] || key;
}

function applyLang() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.placeholder = t(el.dataset.i18nPlaceholder); });

  document.title = t('site_name') + ' | ' + t(document.body.dataset.title || 'nav_home');
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = lang === 'ar' ? 'English' : 'العربية';
}

function setLang(lang) {
  try { localStorage.setItem('fw_lang', lang); } catch (e) { /* ignore */ }
  applyLang();
  document.dispatchEvent(new Event('langchange'));
}