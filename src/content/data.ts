// All copy below comes from OAK-PRO-Website-Content.docx (AR + EN). Do not invent facts here.
export type L = "ar" | "en";
type Bi<T> = { ar: T; en: T };

export const highlights: Bi<{ title: string; text: string }[]> = {
  ar: [
    { title: "مقرّنا الدمام", text: "نخدم مشاريع المنطقة الشرقية ومختلف مناطق المملكة." },
    { title: "للجهات الحكومية والشركات", text: "أعمال تُنفَّذ وفق متطلبات كل جهة." },
    { title: "4 خدمات تحت مظلة واحدة", text: "تنسيق أقل، ووقت أقصر، ومسؤولية واضحة." },
    { title: "متاحون من 8 صباحاً حتى 6 مساءً", text: "رد مباشر عبر الهاتف وواتساب." },
  ],
  en: [
    { title: "Based in Dammam", text: "Serving projects across the Eastern Province and the Kingdom." },
    { title: "Government & corporate clients", text: "Work delivered to each client's requirements." },
    { title: "4 services, one partner", text: "Less coordination, faster delivery, clear accountability." },
    { title: "Open 8 AM – 6 PM", text: "Direct response by phone and WhatsApp." },
  ],
};

export const about: Bi<string[]> = {
  ar: [
    "تُعرف شجرة البلوط بجذورها العميقة وعمرها الطويل، ومنها نستلهم طريقتنا في العمل: أساسٌ متين، وتنفيذٌ دقيق، ونتائج تدوم.",
    "من مقرّنا في الدمام، تنفّذ أوك برو أعمال المقاولات للمباني والطرق والأراضي، وتتولى جمع النفايات ونقلها وإدارتها بأمان، وتقدّم خدمات التنظيف والصيانة الشاملة للمنشآت، وتوفّر العمالة الماهرة للشركات في أعمال التشغيل.",
    "نؤمن بأن الحل الأفضل هو الحل الآمن والمدروس في تكلفته، وبأن كل مشروع ننجزه خطوة نحو بيئة أنظف للمجتمعات التي نخدمها.",
  ],
  en: [
    "The oak is known for its deep roots and long life. That is how we approach every job: solid foundations, precise execution, and results that last.",
    "From our base in Dammam, Oak Pro delivers construction and contracting for buildings, roads and land; collects, transports and manages waste safely; provides full cleaning and maintenance for facilities; and supplies skilled manpower to support companies' operations.",
    "We believe the best solution is one that is safe and cost-effective, and that every project we complete is a step toward a cleaner environment for the communities we serve.",
  ],
};

export type Service = {
  slug: "contracting-roads" | "waste-management" | "cleaning-maintenance" | "manpower";
  title: string; lead: string; body: string; items: string[];
};
export const services: Bi<Service[]> = {
  ar: [
    { slug: "contracting-roads", title: "المقاولات العامة وصيانة الطرق", lead: "نشاطنا الرئيسي: مبانٍ وطرق وأراضٍ تُنفَّذ على أساس متين.", body: "ننفّذ أعمال المقاولات العامة وإنشاء المباني السكنية وغير السكنية، ونتولى التجديد والترميم، واستصلاح الأراضي وأعمال الردم، وصيانة الطرق لصالح الجهات الحكومية والشركات.", items: ["أعمال المقاولات العامة", "إنشاء المباني السكنية", "إنشاء المباني غير السكنية", "تجديد وترميم المباني السكنية والتجارية", "استصلاح الأراضي وأعمال الردم", "صيانة الطرق"] },
    { slug: "waste-management", title: "إدارة النفايات والخدمات البيئية", lead: "نرفع المخلفات وننقلها بأمان، لتبقى مواقعكم نظيفة وجاهزة للعمل.", body: "من إزالة أنقاض المباني المهدّمة إلى نقل مياه الصرف الصحي، نقدّم منظومة متكاملة لجمع النفايات والمواد القابلة لإعادة التدوير ونقلها، مع خدمة تأجير الحاويات للمواقع والمنشآت.", items: ["جمع النفايات البلدية ونقلها", "جمع المواد القابلة لإعادة التدوير", "نقل النفايات الصناعية غير الخطرة", "جمع زيوت الطهي المستعملة", "إزالة مياه الصرف الصحي ونقلها", "إزالة أنقاض المباني المهدّمة", "تأجير الحاويات"] },
    { slug: "cleaning-maintenance", title: "التنظيف والصيانة الشاملة للمباني", lead: "منشأة نظيفة وآمنة طوال الوقت، بمعدات حديثة ومواد صديقة للبيئة.", body: "نتولى تنظيف المباني وصيانتها من الداخل والخارج، بما في ذلك المواقف والمساحات المفتوحة، إلى جانب صيانة الأنظمة الكهربائية وشبكات المياه. نلتزم بمعايير جودة دقيقة تمنح منشأتك مظهراً احترافياً يعكس اهتمامك بالتفاصيل.", items: ["التنظيف الشامل للمباني", "تنظيف المرافق الحكومية", "تنظيف المواقف والمساحات الخارجية", "صيانة الأنظمة الكهربائية", "صيانة شبكات المياه"] },
    { slug: "manpower", title: "توريد العمالة الماهرة", lead: "كوادر ماهرة تدعم تشغيل منشأتك متى احتجت إليها.", body: "نوفّر للشركات عمالة ماهرة تساندها في أعمال التشغيل والمشاريع، بما يخفف عنها أعباء التوظيف المباشر ويحافظ على استمرارية العمل.", items: [] },
  ],
  en: [
    { slug: "contracting-roads", title: "General Contracting & Road Maintenance", lead: "Our core business: buildings, roads and land built on solid ground.", body: "We deliver general contracting and the construction of residential and non-residential buildings, along with renovation and restoration, land reclamation and backfilling, and road maintenance for government and corporate clients.", items: ["General contracting works", "Residential building construction", "Non-residential building construction", "Renovation and restoration of residential and commercial buildings", "Land reclamation and backfilling", "Road maintenance"] },
    { slug: "waste-management", title: "Waste Management & Environmental Services", lead: "We remove and transport waste safely, so your sites stay clean and ready to work.", body: "From clearing demolition rubble to transporting sewage, we offer a complete system for collecting and transporting waste and recyclable materials, along with container rental for sites and facilities.", items: ["Municipal waste collection and transport", "Recyclable materials collection", "Non-hazardous industrial waste transport", "Used cooking oil collection", "Sewage and wastewater removal", "Demolition rubble removal", "Container rental"] },
    { slug: "cleaning-maintenance", title: "Building Cleaning & Maintenance", lead: "A clean, safe facility at all times — with modern equipment and eco-friendly materials.", body: "We clean and maintain buildings inside and out, including parking areas and open spaces, as well as electrical systems and water networks. Our quality standards give your property a refined, professional look that reflects your attention to detail.", items: ["Comprehensive building cleaning", "Government facilities cleaning", "Parking and outdoor area cleaning", "Electrical systems maintenance", "Water network maintenance"] },
    { slug: "manpower", title: "Skilled Manpower Supply", lead: "Skilled teams that support your operations whenever you need them.", body: "We supply companies with skilled manpower for daily operations and projects, easing the burden of direct hiring and keeping work running without interruption.", items: [] },
  ],
};

export const why: Bi<{ title: string; text: string }[]> = {
  ar: [
    { title: "جهة واحدة لأكثر من خدمة", text: "بدلاً من التنسيق مع عدة مقاولين، تجد المقاولات والنفايات والتنظيف والعمالة لدى شريك واحد." },
    { title: "خبرة مع الجهات الحكومية والشركات", text: "ننفّذ أعمالاً لمشاريع حكومية وخاصة، ونلتزم بمتطلبات كل جهة." },
    { title: "السلامة أولاً", text: "حلول آمنة في كل مرحلة، لفريقنا ولموقعك." },
    { title: "تكلفة مدروسة", text: "الحل المناسب لميزانيتك دون التنازل عن الجودة." },
    { title: "مسؤولية بيئية", text: "مواد تنظيف صديقة للبيئة، وإدارة مسؤولة للمخلفات." },
  ],
  en: [
    { title: "One provider, several services", text: "Instead of coordinating multiple contractors, you get contracting, waste, cleaning and manpower from a single partner." },
    { title: "Experience with government and corporate clients", text: "We deliver work for public and private projects and meet each client's requirements." },
    { title: "Safety first", text: "Safe solutions at every stage, for our team and your site." },
    { title: "Considered costs", text: "The right solution for your budget, without compromising on quality." },
    { title: "Environmental responsibility", text: "Eco-friendly cleaning materials and responsible waste handling." },
  ],
};

export const steps: Bi<{ title: string; text: string }[]> = {
  ar: [
    { title: "تواصل معنا", text: "اتصل بنا أو راسلنا عبر واتساب أو نموذج الطلب، واشرح احتياجك." },
    { title: "معاينة وتحديد النطاق", text: "نزور الموقع عند الحاجة ونحدد نطاق العمل بدقة." },
    { title: "عرض سعر واضح", text: "عرض مفصّل يوضح البنود والمدة والتكلفة." },
    { title: "تنفيذ وتسليم", text: "ينفّذ فريقنا العمل وفق المتفق عليه، ونبقى على تواصل بعد التسليم." },
  ],
  en: [
    { title: "Get in touch", text: "Call us, message us on WhatsApp, or send a request through the form." },
    { title: "Site visit & scope", text: "We visit the site when needed and define the scope precisely." },
    { title: "Clear quotation", text: "A detailed quote covering items, timeline and cost." },
    { title: "Delivery & handover", text: "Our team delivers as agreed, and we stay in touch after handover." },
  ],
};

export const formServices: Bi<string[]> = {
  ar: ["المقاولات العامة وصيانة الطرق", "إدارة النفايات والخدمات البيئية", "التنظيف والصيانة", "توريد العمالة"],
  en: ["General Contracting & Road Maintenance", "Waste Management & Environmental Services", "Cleaning & Maintenance", "Manpower Supply"],
};

export const seo: Bi<{ homeTitle: string; homeDesc: string; blogTitle: string; blogDesc: string }> = {
  ar: { homeTitle: "أوك برو | مقاولات وإدارة نفايات وصيانة مباني في الدمام", homeDesc: "أوك برو في الدمام: مقاولات عامة وصيانة طرق، وإدارة نفايات وتأجير حاويات، وتنظيف وصيانة مبانٍ، وتوريد عمالة ماهرة للجهات الحكومية والشركات.", blogTitle: "المدونة | أوك برو", blogDesc: "إرشادات عملية في المقاولات وإدارة النفايات وصيانة المنشآت من فريق أوك برو في الدمام." },
  en: { homeTitle: "Oak Pro | Contracting, Waste Management & Facility Services in Dammam", homeDesc: "Oak Pro, Dammam: general contracting and road maintenance, waste management and container rental, building cleaning and maintenance, and skilled manpower for government and corporate projects.", blogTitle: "Blog | Oak Pro", blogDesc: "Practical guidance on contracting, waste management and facility maintenance from the Oak Pro team in Dammam." },
};

export const blogPosts: Bi<{ slug: string; title: string; excerpt: string; date: string; minutes: number }[]> = {
  ar: [
    { slug: "choosing-container-rental-dammam", title: "كيف تختار شركة تأجير حاويات مناسبة لموقعك في الدمام؟", excerpt: "أهم ما يجب مراجعته قبل التعاقد على تأجير حاوية لموقع البناء أو المنشأة، من الحجم المناسب إلى مواعيد الرفع والتبديل.", date: "2026-10-01", minutes: 5 },
    { slug: "periodic-maintenance-commercial-buildings", title: "الصيانة الدورية للمباني التجارية: ما الذي يجب فحصه باستمرار؟", excerpt: "قائمة عملية بأهم عناصر المبنى التي تحتاج إلى متابعة منتظمة، وكيف تقلل الصيانة الوقائية من الأعطال المفاجئة وتكاليفها.", date: "2026-10-01", minutes: 5 },
    { slug: "construction-demolition-waste-management", title: "إدارة مخلفات الهدم والبناء: خطوات تحافظ على موقعك نظيفاً وآمناً", excerpt: "كيف تنظّم جمع مخلفات الموقع ونقلها خلال مراحل المشروع، بما يحافظ على سلامة العمل وسير التنفيذ.", date: "2026-10-01", minutes: 5 },
  ],
  en: [
    { slug: "choosing-container-rental-dammam", title: "How to choose the right container rental company for your site in Dammam", excerpt: "What to review before renting a container for a construction site or facility, from the right size to pickup and swap schedules.", date: "2026-10-01", minutes: 5 },
    { slug: "periodic-maintenance-commercial-buildings", title: "Routine maintenance for commercial buildings: what to check regularly", excerpt: "A practical list of the building elements that need regular attention, and how preventive maintenance reduces sudden breakdowns and their costs.", date: "2026-10-01", minutes: 5 },
    { slug: "construction-demolition-waste-management", title: "Managing construction and demolition waste: steps to keep your site clean and safe", excerpt: "How to organize the collection and transport of site waste throughout a project, keeping work safe and on schedule.", date: "2026-10-01", minutes: 5 },
  ],
};
