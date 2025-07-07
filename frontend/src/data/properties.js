// Sample property data for the real estate directory
export const properties = [
  {
    id: 1,
    title: "Современное офисное здание - Центр",
    type: "нежилые помещения",
    status: "for-sale",
    price: 2500000,
    area: 1200,
    location: "Деловой район",
    address: "Бизнес-авеню, 123, Центр",
    layout: "Открытая планировка с отдельными кабинетами",
    description: "Потрясающее современное офисное здание с ультрасовременными удобствами, панорамным видом на город и высококачественной отделкой. Идеально подходит для корпоративных штаб-квартир или многофункциональных офисных помещений.",
    images: [
      "/src/assets/office1.jpg",
      "/src/assets/office2.jpg",
      "/src/assets/office3.jpg"
    ],
    coordinates: [40.7589, -73.9851],
    agent: {
      name: "Сара Джонсон",
      phone: "+1 (555) 123-4567",
      email: "sarah@propertyhub.com"
    },
    isFeatured: true,
    investmentReturn: "до 25% в год"
  },
  {
    id: 2,
    title: "Премиум торговое помещение - Торговый центр",
    type: "нежилые помещения",
    status: "for-rent",
    price: 8500,
    area: 850,
    location: "Центральный торговый район",
    address: "Торговая площадь, 456, Центральный район",
    layout: "Открытое торговое помещение с витриной",
    description: "Торговое помещение с высоким трафиком в престижном торговом центре. Отличная видимость и пешеходный трафик делают его идеальным для модных, электронных или специализированных розничных предприятий.",
    images: [
      "/src/assets/retail1.webp",
      "/src/assets/retail2.jpg",
      "/src/assets/retail3.jpg"
    ],
    coordinates: [40.7505, -73.9934],
    agent: {
      name: "Майкл Чен",
      phone: "+1 (555) 234-5678",
      email: "michael@propertyhub.com"
    },
    isFeatured: false,
    investmentReturn: "до 15% в год"
  },
  {
    id: 3,
    title: "Промышленный складской комплекс",
    type: "нежилые помещения",
    status: "for-sale",
    price: 1800000,
    area: 2500,
    location: "Восточный промышленный парк",
    address: "Промышленный путь, 789, Восточный район",
    layout: "Большой открытый склад с офисным помещением",
    description: "Просторный промышленный склад, идеально подходящий для производства, дистрибуции или логистических операций. Высокие потолки, погрузочные доки и современные офисные помещения.",
    images: [
      "/src/assets/industrial1.jpeg",
      "/src/assets/industrial2.jpeg",
      "/src/assets/industrial3.jpg"
    ],
    coordinates: [40.7282, -74.0776],
    agent: {
      name: "Дэвид Родригес",
      phone: "+1 (555) 345-6789",
      email: "david@propertyhub.com"
    },
    isFeatured: true,
    investmentReturn: "до 20% в год"
  },
  {
    id: 4,
    title: "Земельный участок под коммерческую застройку",
    type: "нежилые помещения",
    status: "for-sale",
    price: 950000,
    area: 5000,
    location: "Северный коридор роста",
    address: "Бульвар Развития, 1000, Северный район",
    layout: "Свободный участок, готовый к застройке",
    description: "Первоклассный земельный участок под коммерческую застройку в быстрорастущем районе. Зонирован для смешанной застройки с отличным доступом к основным автомагистралям и общественному транспорту.",
    images: [
      "/src/assets/land1.png",
      "/src/assets/land2.jpeg"
    ],
    coordinates: [40.7831, -73.9712],
    agent: {
      name: "Лиза Томпсон",
      phone: "+1 (555) 456-7890",
      email: "lisa@propertyhub.com"
    },
    isFeatured: false,
    investmentReturn: "до 10% в год"
  },
  {
    id: 5,
    title: "Корпоративная офисная башня",
    type: "нежилые помещения",
    status: "for-rent",
    price: 12000,
    area: 1800,
    location: "Финансовый район",
    address: "Корпоративная площадь, 555, Финансовый район",
    layout: "Исполнительные офисы с конференц-залами",
    description: "Престижное офисное помещение в знаковом здании. Панорамные виды, премиальные удобства и престижный деловой адрес в самом сердце финансового района.",
    images: [
      "/src/assets/office2.jpg",
      "/src/assets/office1.jpg"
    ],
    coordinates: [40.7074, -74.0113],
    agent: {
      name: "Роберт Ким",
      phone: "+1 (555) 567-8901",
      email: "robert@propertyhub.com"
    },
    isFeatured: true,
    investmentReturn: "до 18% в год"
  },
  {
    id: 6,
    title: "Бутик розничный магазин",
    type: "нежилые помещения",
    status: "for-rent",
    price: 4200,
    area: 450,
    location: "Район искусств",
    address: "Творческая авеню, 222, Район искусств",
    layout: "Уютное торговое помещение с характером",
    description: "Очаровательное торговое помещение в модном районе искусств. Идеально подходит для бутиков, галерей или специализированных магазинов. Высокий пешеходный трафик от туристов и местных жителей.",
    images: [
      "/src/assets/retail2.jpg",
      "/src/assets/retail1.webp"
    ],
    coordinates: [40.7505, -73.9934],
    agent: {
      name: "Эмма Уилсон",
      phone: "+1 (555) 678-9012",
      email: "emma@propertyhub.com"
    },
    isFeatured: false,
    investmentReturn: "до 12% в год"
  },
  {
    id: 7,
    title: "Распределительный центр",
    type: "нежилые помещения",
    status: "for-rent",
    price: 15000,
    area: 3200,
    location: "Логистический хаб",
    address: "Распределительный проезд, 888, Логистический хаб",
    layout: "Современный распределительный центр",
    description: "Современный распределительный центр с расширенными логистическими возможностями. Идеально подходит для выполнения заказов электронной коммерции, оптовой дистрибуции или операций цепочки поставок.",
    images: [
      "/src/assets/industrial3.jpg",
      "/src/assets/industrial1.jpeg"
    ],
    coordinates: [40.6892, -74.1776],
    agent: {
      name: "Джеймс Парк",
      phone: "+1 (555) 789-0123",
      email: "james@propertyhub.com"
    },
    isFeatured: true,
    investmentReturn: "до 18% в год"
  },
  {
    id: 8,
    title: "Участок смешанной застройки",
    type: "нежилые помещения",
    status: "for-sale",
    price: 1200000,
    area: 3500,
    location: "Транзитная деревня",
    address: "Транзитный путь, 333, Транзитная деревня",
    layout: "Участок, готовый к застройке",
    description: "Исключительная возможность для смешанной застройки рядом с крупным транспортным узлом. Одобрен для жилого, розничного и офисного использования с отличной связностью.",
    images: [
      "/src/assets/land2.jpeg",
      "/src/assets/land1.png"
    ],
    coordinates: [40.7282, -74.0776],
    agent: {
      name: "Мария Гарсия",
      phone: "+1 (555) 890-1234",
      email: "maria@propertyhub.com"
    },
    isFeatured: false,
    investmentReturn: "до 10% в год"
  },
  {
    id: 9,
    title: "Просторная квартира в центре",
    type: "жилые помещения",
    status: "for-sale",
    price: 850000,
    area: 150,
    location: "Исторический центр",
    address: "Улица Пушкина, 10, кв. 5",
    layout: "3 спальни, 2 ванные комнаты, большая гостиная",
    description: "Просторная и светлая квартира в самом сердце города. Высокие потолки, современный ремонт и прекрасный вид на город. Идеально подходит для семьи или инвестиций.",
    images: [
      "/src/assets/residential1.jpg",
      "/src/assets/residential2.jpg"
    ],
    coordinates: [40.7128, -74.0060],
    agent: {
      name: "Анна Смирнова",
      phone: "+1 (555) 987-6543",
      email: "anna@propertyhub.com"
    },
    isFeatured: true,
    investmentReturn: "до 30% в год"
  },
  {
    id: 10,
    title: "Современный гараж-бокс",
    type: "гараж-боксы",
    status: "for-sale",
    price: 50000,
    area: 25,
    location: "Спальный район",
    address: "Гаражный кооператив №3, бокс 12",
    layout: "Стандартный гараж-бокс",
    description: "Сухой и чистый гараж-бокс в охраняемом кооперативе. Идеально подходит для хранения автомобиля или личных вещей.",
    images: [
      "/src/assets/garage1.jpg",
      "/src/assets/garage2.jpg"
    ],
    coordinates: [40.7128, -74.0060],
    agent: {
      name: "Иван Петров",
      phone: "+1 (555) 876-5432",
      email: "ivan@propertyhub.com"
    },
    isFeatured: false,
    investmentReturn: "до 8% в год"
  },
  {
    id: 11,
    title: "Машино-место в подземном паркинге",
    type: "машино-места",
    status: "for-rent",
    price: 500,
    area: 15,
    location: "Элитный жилой комплекс",
    address: "Улица Ленина, 20, паркинг, место 34",
    layout: "Стандартное машино-место",
    description: "Удобное машино-место в охраняемом подземном паркинге. Круглосуточная охрана и видеонаблюдение.",
    images: [
      "/src/assets/parking1.jpg",
      "/src/assets/parking2.jpg"
    ],
    coordinates: [40.7128, -74.0060],
    agent: {
      name: "Елена Козлова",
      phone: "+1 (555) 765-4321",
      email: "elena@propertyhub.com"
    },
    isFeatured: true,
    investmentReturn: "до 10% в год"
  }
];

// Filter options for the property search
export const filterOptions = {
  types: [
    { value: "all", label: "Все типы" },
    { value: "жилые помещения", label: "Жилые помещения" },
    { value: "нежилые помещения", label: "Нежилые помещения" },
    { value: "машино-места", label: "Машино-места" },
    { value: "гараж-боксы", label: "Гараж-боксы" }
  ],
  status: [
    { value: "all", label: "Все" },
    { value: "for-sale", label: "Продажа" },
    { value: "for-rent", label: "Аренда" }
  ],
  priceRanges: [
    { value: "all", label: "Все цены" },
    { value: "0-500000", label: "До 500 тыс. ₽" },
    { value: "500000-1000000", label: "500 тыс. ₽ - 1 млн ₽" },
    { value: "1000000-2000000", label: "1 млн ₽ - 2 млн ₽" },
    { value: "2000000-5000000", label: "2 млн ₽ - 5 млн ₽" },
    { value: "5000000+", label: "Более 5 млн ₽" }
  ],
  areaRanges: [
    { value: "all", label: "Все площади" },
    { value: "0-500", label: "До 500 кв.м" },
    { value: "500-1000", label: "500 - 1,000 кв.м" },
    { value: "1000-2000", label: "1,000 - 2,000 кв.м" },
    { value: "2000-5000", label: "2,000 - 5,000 кв.м" },
    { value: "5000+", label: "Более 5,000 кв.м" }
  ],
  investmentReturns: [
    { value: "all", label: "Все доходности" },
    { value: "0-10", label: "До 10% в год" },
    { value: "10-20", label: "10% - 20% в год" },
    { value: "20-30", label: "20% - 30% в год" },
    { value: "30+", label: "Более 30% в год" }
  ]
};

