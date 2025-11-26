
import React, { useState, useEffect } from 'react';
import { Ad, Category, CreateAdFormState, NewsItem, User, CatalogCategory, Review, Movie, Shop, Product, CartItem, Story, Notification, ChatSession } from './types';
import { AdCard } from './components/AdCard';
import { CreateAdModal } from './components/CreateAdModal';
import { AdPage } from './components/AdPage'; 
import { ChatPage } from './components/ChatPage';
import { NewsPage } from './components/NewsPage';
import { LoginModal } from './components/LoginModal';
import { ServiceCatalogModal } from './components/ServiceCatalogModal';
import { MovieBookingModal } from './components/MovieBookingModal';
import { PartnerModal } from './components/PartnerModal';
import { ShopCard } from './components/ShopCard';
import { ShopPage } from './components/ShopPage';
import { MerchantDashboard } from './components/MerchantDashboard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartDrawer } from './components/CartDrawer';
import { StoriesBar } from './components/StoriesBar';
import { UserProfileModal } from './components/UserProfileModal';
import { ToastNotification } from './components/ToastNotification';
import { AdminPanel } from './components/AdminPanel';
import { supabase } from './services/supabaseClient';
import { formatPhoneNumber } from './utils';

// ... (KEEP INITIAL DATA AS IS - Assumed to be in context) ...
const INITIAL_ADS: Ad[] = [
  {
    id: '1',
    title: 'Русская баня на дровах',
    description: 'Отличная парная, березовые веники, комната отдыха с камином. Находимся в черте города, удобный подъезд. Есть мангальная зона. Работаем круглосуточно.',
    price: 1200,
    category: 'rent',
    subCategory: 'Дома, дачи',
    contact: '+7 (900) 123 45 67',
    location: 'Сады "40-е"',
    image: 'https://images.unsplash.com/photo-1543489822-c49534f3271f?auto=format&fit=crop&w=800&q=80',
    isPremium: true,
    bookingAvailable: true,
    bookingWidget: { type: 'litepms', id: 9177, wid: 1127 },
    date: 'Сегодня',
    reviews: [
      { id: 'r1', author: 'Александр', rating: 5, text: 'Отличная баня, очень чисто и уютно! Рекомендую.', date: '10 окт' },
      { id: 'r2', author: 'Елена', rating: 4, text: 'Все понравилось, но немного прохладно в предбаннике.', date: '05 окт' }
    ],
    status: 'approved'
  },
  {
    id: '9',
    title: 'Домики',
    description: 'Уютный дом на берегу озера. 12 спальных мест, большая гостиная, караоке, сауна внутри дома. Идеально для дня рождения или корпоратива. Залог 5000р.',
    price: 15000,
    category: 'rent',
    subCategory: 'Дома, дачи',
    contact: '+7 (912) 000 99 88',
    location: 'оз. Синара',
    image: 'https://i.postimg.cc/9Mr2X49R/photo-output-1-6-jpg.webp',
    isPremium: true,
    bookingAvailable: true,
    bookingWidget: { type: 'litepms', id: 9177, wid: 1126 },
    date: 'Сегодня',
    reviews: [],
    specs: { rooms: 4, area: 120 },
    status: 'approved'
  },
  {
    id: '2',
    title: 'Продам ВАЗ 2114',
    description: '2011 год. Состояние хорошее, есть рыжики на арках. Двигатель работает ровно. Зимняя резина на штампах в комплекте.',
    price: 185000,
    category: 'sale',
    subCategory: 'Автомобили',
    contact: '+7 (912) 345 67 89',
    location: 'ГСК-1 (у ГАИ)',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    isPremium: false,
    date: 'Вчера',
    reviews: [],
    specs: { year: 2011, mileage: 155000 },
    status: 'approved'
  },
  {
    id: '3',
    title: 'Сдается 2-к квартира',
    description: 'Район "Новый город". Рядом школа 135 и ФОК. Мебель, техника. Только на длительный срок. Без животных.',
    price: 25000,
    category: 'rent',
    subCategory: 'Квартиры',
    contact: '+7 (900) 555 44 33',
    location: 'ул. Забабахина 54',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    isPremium: true,
    date: 'Вчера',
    reviews: [
      { id: 'r3', author: 'Мария', rating: 5, text: 'Снимали квартиру год, хозяева адекватные.', date: '20 сен' }
    ],
    specs: { rooms: 2, floor: 5, area: 54 },
    status: 'approved'
  },
  {
    id: '4',
    title: 'Услуги сантехника',
    description: 'Любые виды сантехнических работ. Замена труб, установка смесителей, унитазов. Быстро, качественно.',
    price: 0,
    category: 'services',
    subCategory: 'Сантехника',
    contact: '+7 (922) 111 22 33',
    location: 'Весь Снежинск',
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80',
    isPremium: false,
    date: '13 окт',
    reviews: [
       { id: 'r4', author: 'Виктор', rating: 5, text: 'Мастер своего дела. Приехал быстро, сделал все качественно.', date: '12 окт' },
       { id: 'r5', author: 'Ольга', rating: 5, text: 'Спасибо за починку крана!', date: '01 окт' },
       { id: 'r6', author: 'Сергей', rating: 4, text: 'Сделал хорошо, но опоздал на 15 минут.', date: '25 сен' }
    ],
    status: 'approved'
  },
  {
    id: '5',
    title: 'Детская коляска 3в1',
    description: 'Коляска в отличном состоянии, после одного ребенка. Полный комплект.',
    price: 15000,
    category: 'sale',
    subCategory: 'Детская одежда', 
    contact: '+7 (999) 888 77 66',
    location: 'ул. Щелкина 9',
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
    isPremium: false,
    date: '09 окт',
    reviews: [],
    specs: { condition: 'used', brand: 'Tutis' },
    status: 'approved'
  },
  {
    id: '6',
    title: 'Электрик. Монтаж проводки',
    description: 'Электромонтажные работы под ключ. Замена проводки, установка розеток, люстр, счетчиков. Допуск.',
    price: 0,
    category: 'services',
    subCategory: 'Электрика',
    contact: '+7 (955) 444 33 22',
    location: 'Снежинск',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    isPremium: false,
    date: 'Сегодня',
    reviews: [],
    status: 'approved'
  },
  {
    id: '7',
    title: 'Ремонт квартир под ключ',
    description: 'Бригада мастеров выполнит качественный ремонт. Штукатурка, обои, ламинат, плитка. Смета бесплатно.',
    price: 0,
    category: 'services',
    subCategory: 'Ремонт квартир',
    contact: '+7 (900) 333 22 11',
    location: 'Снежинск и область',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    isPremium: true,
    date: 'Сегодня',
    reviews: [
        { id: 'r7', author: 'Дмитрий', rating: 5, text: 'Рекомендую! Сделали ремонт в ванной за неделю.', date: '15 авг' }
    ],
    status: 'approved'
  },
  {
    id: '8',
    title: 'iPhone 13 128GB',
    description: 'В идеальном состоянии, полный комплект, чек, гарантия. Использовался в чехле и с защитным стеклом.',
    price: 55000,
    category: 'sale',
    subCategory: 'Электроника',
    contact: '+7 (900) 111 00 00',
    location: 'ТЦ Универмаг',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=800&q=80',
    isPremium: false,
    date: 'Вчера',
    reviews: [],
    specs: { condition: 'used', brand: 'Apple' },
    status: 'approved'
  },
  {
    id: '100',
    title: 'Гараж в кооперативе №7',
    description: 'Продам гараж, яма сухая, крыша перекрыта в прошлом году.',
    price: 80000,
    category: 'sale',
    subCategory: 'Гаражи',
    contact: '+7 (999) 123 44 55',
    location: 'Кооператив 7',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    isPremium: false,
    date: 'Только что',
    status: 'pending'
  }
];

const INITIAL_STORIES: Story[] = [
  { id: '1', shopId: 's1', shopName: 'Клондайк', avatar: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100', image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800', text: 'Скидки на краску до 30%!' },
  { id: '2', shopId: 'c1', shopName: 'Олива', avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', text: 'Новое меню бизнес-ланчей 🍕' },
  { id: '3', shopId: 's2', shopName: 'Цветы', avatar: 'https://images.unsplash.com/photo-1562521151-54b609c25841?w=100', image: 'https://images.unsplash.com/photo-1557929036-f60e326e3c1a?w=800', text: 'Свежая поставка пионов!' },
  { id: '4', shopId: 'k1', shopName: 'Кино', avatar: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=100', image: 'https://avatars.mds.yandex.net/get-kinopoisk-image/10535692/d4050d27-6f01-49b0-9f1c-755106596131/1920x', text: 'Премьера сегодня в 19:00' },
  { id: '5', shopId: 's3', shopName: 'Универмаг', avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800', text: 'Финальная распродажа лета' },
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'В Снежинске открылся новый ФОК',
    excerpt: 'Торжественное открытие физкультурно-оздоровительного комплекса состоялось вчера...',
    content: 'Вчера в нашем городе прошло торжественное открытие нового ФОКа. Комплекс оснащен современным бассейном, тренажерным залом и залом для игровых видов спорта. На церемонии присутствовали представители администрации и почетные гости города. Теперь жители района "Поселок" смогут заниматься спортом в шаговой доступности.',
    date: '15 окт',
    category: 'Спорт',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Ремонт дороги на ул. Ленина',
    excerpt: 'С 20 октября начинается капитальный ремонт дорожного покрытия на центральной улице...',
    content: 'Администрация города сообщает о начале ремонтных работ на улице Ленина. Движение будет частично ограничено. Планируется полная замена асфальтового покрытия, установка новых бордюров и обновление дорожной разметки. Работы продлятся до конца месяца. Просим водителей заранее выбирать пути объезда.',
    date: '14 окт',
    category: 'Город',
    image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Выставка художников Урала',
    excerpt: 'В городском музее открылась уникальная выставка пейзажистов...',
    content: 'Приглашаем всех ценителей искусства посетить выставку "Природа Урала". Представлены работы более 20 художников региона. Экспозиция включает в себя как классические пейзажи, так и современные абстрактные работы. Вход свободный для всех желающих.',
    date: '12 окт',
    category: 'Культура',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80'
  }
];

const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm1',
    title: 'Мастер и Маргарита',
    genre: 'Драма, фэнтези',
    rating: '7.9',
    ageLimit: '16+',
    image: 'https://avatars.mds.yandex.net/get-kinopoisk-image/10535692/37e35b71-1f7c-41c3-8884-386df27f2c41/1920x',
    description: 'Москва, 1930-е годы. Известный писатель оказывается в центре литературного скандала. Спектакль по его пьесе снимают с репертуара, коллеги демонстративно избегают встречи, в считанные дни он превращается в изгоя. Вскоре после этого он знакомится с Маргаритой, которая становится его возлюбленной и музой.',
    showtimes: ['14:00', '17:30', '21:00'],
    price: 350
  },
  {
    id: 'm2',
    title: 'Дюна: Часть вторая',
    genre: 'Фантастика, боевик',
    rating: '8.5',
    ageLimit: '12+',
    image: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4774061/a7556a34-2e9b-443b-824d-e900980f7633/1920x',
    description: 'Герцог Пол Атрейдес присоединяется к фрименам, чтобы стать Муад Дибом, одновременно пытаясь предотвратить ужасное будущее, которое он видел: священную войну, распространяющуюся по всей известной вселенной.',
    showtimes: ['12:15', '15:40', '19:00', '22:15'],
    price: 400
  },
  {
    id: 'm3',
    title: 'Кунг-фу Панда 4',
    genre: 'Мультфильм, комедия',
    rating: '7.2',
    ageLimit: '6+',
    image: 'https://avatars.mds.yandex.net/get-kinopoisk-image/10535692/d4050d27-6f01-49b0-9f1c-755106596131/1920x',
    description: 'Продолжение приключений легендарного Воина Дракона, его верных друзей и наставника. На этот раз По предстоит столкнуться с новым могущественным врагом.',
    showtimes: ['10:00', '12:00', '14:00'],
    price: 300
  }
];

const INITIAL_SHOPS: Shop[] = [
    {
        id: 's1',
        name: 'Клондайк',
        description: 'Строительные материалы, инструменты, все для ремонта и сада. Широкий ассортимент качественных товаров от ведущих производителей.',
        logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&q=80',
        coverImage: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=1200&q=80',
        address: 'ул. Транспортная 15',
        phone: '+7 (35146) 3 22 11',
        workingHours: 'Пн-Вс: 09:00 - 20:00',
        rating: 4.8,
        paymentConfig: { enabled: true, type: 'online' }, 
        products: [
            { id: 'p1', title: 'Дрель ударная Makita', price: 5500, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400', description: 'Мощная дрель для профессиональных работ. В комплекте кейс и набор сверл.' },
            { id: 'p2', title: 'Краска интерьерная', price: 1200, image: 'https://images.unsplash.com/photo-1562259920-47afc305f369?w=400', description: 'Моющаяся матовая краска для стен и потолков. Объем 2.5 литра.' },
            { id: 'p3', title: 'Набор отверток', price: 800, image: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400', description: 'Набор из 8 отверток разного размера. Прорезиненные ручки.' },
            { id: 'p4', title: 'Обои виниловые', price: 1500, image: 'https://images.unsplash.com/photo-1615800098779-1be8e1ea64d4?w=400', description: 'Плотные виниловые обои с геометрическим узором. Ширина 1м.' },
             { id: 'p5', title: 'Ламинат дуб', price: 900, image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400', description: 'Ламинат 33 класса. Цвет: натуральный дуб. Цена за кв.м.' },
        ]
    },
    {
        id: 's2',
        name: 'Цветочный дворик',
        description: 'Свежие цветы, авторские букеты, доставка по городу. Оформление свадеб и торжеств.',
        logo: 'https://images.unsplash.com/photo-1562521151-54b609c25841?w=300',
        coverImage: 'https://images.unsplash.com/photo-1557929036-f60e326e3c1a?w=1200',
        address: 'пр. Мира 18',
        phone: '+7 (922) 222 33 44',
        workingHours: 'Пн-Вс: 08:00 - 21:00',
        rating: 4.9,
        paymentConfig: { enabled: false, type: 'manual', phone: '+79222223344' }, 
        products: [
            { id: 'f1', title: 'Букет из 51 розы', price: 5500, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=400', description: 'Роскошный букет из красных роз сорта Эксплорер (60см).' },
            { id: 'f2', title: 'Пионы розовые', price: 450, image: 'https://images.unsplash.com/photo-1563241527-3af16059d4c9?w=400', description: 'Свежие голландские пионы. Цена за 1 шт.' },
            { id: 'f3', title: 'Сборный букет "Нежность"', price: 2300, image: 'https://images.unsplash.com/photo-1596767746566-4c49d280d4f5?w=400', description: 'Авторский букет в пастельных тонах с эустомой и альстромерией.' },
             { id: 'f4', title: 'Корзина с цветами', price: 3500, image: 'https://images.unsplash.com/photo-1596195759367-27b40974cc9e?w=400', description: 'Плетеная корзина с сезонными цветами и зеленью.' },
        ]
    },
    {
        id: 's3',
        name: 'Универмаг',
        description: 'Одежда, обувь, товары для дома. Большой выбор и доступные цены. Центр города.',
        logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300',
        coverImage: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200',
        address: 'ул. Свердлова 1',
        phone: '+7 (35146) 2 55 55',
        workingHours: 'Пн-Вс: 10:00 - 19:00',
        rating: 4.2,
        paymentConfig: { enabled: false, type: 'manual', phone: '+73514625555' },
        products: [
            { id: 'u1', title: 'Платье летнее', price: 2500, image: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=400', description: 'Легкое платье из вискозы с цветочным принтом.' },
            { id: 'u2', title: 'Кроссовки белые', price: 3200, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400', description: 'Классические белые кроссовки. Экокожа.' },
            { id: 'u3', title: 'Сумка кожаная', price: 4500, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', description: 'Сумка-шоппер из натуральной кожи.' },
        ]
    },
    {
        id: 'cinema1',
        name: 'Кинотеатр "Космос"',
        description: 'Премьеры мирового кинематографа, комфортные залы и вкусный попкорн.',
        logo: 'https://avatars.mds.yandex.net/get-kinopoisk-image/10535692/d4050d27-6f01-49b0-9f1c-755106596131/1920x',
        coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200',
        address: 'ул. Васильева 35',
        phone: '+7 (35146) 3 00 00',
        workingHours: 'Пн-Вс: 09:00 - 00:00',
        rating: 4.7,
        paymentConfig: { enabled: true, type: 'online' },
        products: [
            { id: 'cp1', title: 'Попкорн Соленый (V)', price: 350, image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400', description: 'Большое ведро соленого попкорна.' },
            { id: 'cp2', title: 'Начос с сырным соусом', price: 280, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400', description: 'Хрустящие кукурузные чипсы.' },
            { id: 'cp3', title: 'Coca-Cola 0.5', price: 120, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400', description: 'Холодная газировка.' },
        ]
    }
];

const INITIAL_CAFES: Shop[] = [
    {
        id: 'c1',
        name: 'Олива',
        description: 'Уютный семейный ресторан с итальянской кухней. Пицца из дровяной печи, домашняя паста и изысканные десерты. Есть детская комната.',
        logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&q=80',
        coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80',
        address: 'ул. Ленина 14',
        phone: '+7 (35146) 9 20 20',
        workingHours: 'Пн-Вс: 11:00 - 23:00',
        rating: 4.9,
        paymentConfig: { enabled: true, type: 'online' },
        products: [
            { id: 'm1', title: 'Пицца Пепперони', price: 650, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', description: 'Классическая пицца с колбасками пепперони, моцареллой и томатным соусом. 30см.' },
            { id: 'm2', title: 'Паста Карбонара', price: 480, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', description: 'Спагетти с беконом, сливочным соусом и пармезаном.' },
            { id: 'm3', title: 'Салат Цезарь', price: 420, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400', description: 'С куриным филе, сухариками, перепелиными яйцами и соусом цезарь.' },
            { id: 'm4', title: 'Тирамису', price: 350, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', description: 'Традиционный итальянский десерт с маскарпоне и кофе.' },
        ]
    },
    {
        id: 'c2',
        name: 'Coffee Like',
        description: 'Кофе с собой, авторские напитки и свежая выпечка. Идеальное место для начала дня или короткой встречи.',
        logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&q=80',
        coverImage: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1200&q=80',
        address: 'пр. Мира 22 (у входа в парк)',
        phone: '+7 (900) 555 44 33',
        workingHours: 'Пн-Вс: 08:00 - 21:00',
        rating: 4.7,
        paymentConfig: { enabled: false, type: 'manual', phone: '+79005554433' },
        products: [
            { id: 'co1', title: 'Капучино Большой', price: 220, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', description: '400мл. Классический кофейный напиток на основе эспрессо с добавлением молока.' },
            { id: 'co2', title: 'Латте Соленая карамель', price: 250, image: 'https://images.unsplash.com/photo-1570968992193-6e5c922e963c?w=400', description: 'Нежный кофейный напиток с сиропом соленая карамель.' },
            { id: 'co3', title: 'Круассан с шоколадом', price: 150, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400', description: 'Свежеиспеченный круассан с шоколадной начинкой.' },
        ]
    },
    {
        id: 'c3',
        name: 'Суши Хаус',
        description: 'Доставка суши и роллов. Большие порции, свежая рыба. Wok-лапша и супы. Быстрая доставка по городу.',
        logo: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&q=80',
        coverImage: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200&q=80',
        address: 'ул. Васильева 8',
        phone: '+7 (35146) 2 22 22',
        workingHours: 'Пн-Вс: 10:00 - 22:30',
        rating: 4.5,
        paymentConfig: { enabled: false, type: 'manual', phone: '+73514622222' },
        products: [
            { id: 's1', title: 'Сет Филадельфия', price: 1200, image: 'https://images.unsplash.com/photo-1617196019294-dcce47895545?w=400', description: 'Набор из 3 видов роллов Филадельфия: с огурцом, с авокадо и лайт. 24 шт.' },
            { id: 's2', title: 'Ролл Калифорния', price: 350, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400', description: 'Снежный краб, огурец, авокадо, икра масаго.' },
            { id: 's3', title: 'Wok с курицей', price: 400, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb74b?w=400', description: 'Лапша удон с курицей, овощами и соусом терияки.' },
        ]
    }
];

const SERVICE_CATALOG: CatalogCategory[] = [
  {
    id: 'sale',
    label: 'Продажа',
    groups: [
      { name: 'Недвижимость', items: ['Квартиры', 'Комнаты', 'Дома, дачи', 'Гаражи', 'Земельные участки'] },
      { name: 'Транспорт', items: ['Автомобили', 'Мотоциклы', 'Спецтехника', 'Запчасти'] },
      { name: 'Личные вещи', items: ['Одежда, обувь', 'Детская одежда', 'Часы и украшения'] },
      { name: 'Электроника', items: ['Телефоны', 'Компьютеры', 'Бытовая техника'] },
      { name: 'Хобби и отдых', items: ['Спорт и отдых', 'Книги', 'Музыкальные инструменты'] },
    ]
  },
  {
    id: 'rent',
    label: 'Аренда',
    groups: [
      { name: 'Недвижимость', items: ['Квартиры', 'Комнаты', 'Дома, дачи', 'Гаражи', 'Коммерческая'] },
      { name: 'Транспорт', items: ['Автомобили', 'Прицепы'] },
      { name: 'Оборудование', items: ['Инструмент', 'Строительное', 'Туристическое'] },
    ]
  },
  {
    id: 'services',
    label: 'Услуги',
    groups: [
      { name: 'Ремонт и стройка', items: ['Ремонт квартир', 'Сантехника', 'Электрика', 'Сборка мебели'] },
      { name: 'Транспорт', items: ['Грузоперевозки', 'Переезды', 'Эвакуатор', 'Пассажирские перевозки'] },
      { name: 'Красота и здоровье', items: ['Парикмахерские', 'Маникюр', 'Массаж'] },
      { name: 'Компьютеры', items: ['Ремонт ПК', 'Настройка интернета'] },
      { name: 'Обучение', items: ['Репетиторы', 'Курсы', 'Спорт секции'] },
    ]
  },
  {
    id: 'jobs',
    label: 'Работа',
    groups: [
      { name: 'Вакансии', items: ['Производство', 'Торговля', 'Строительство', 'Транспорт', 'Офис', 'Без опыта'] },
    ]
  }
];

const mapAdFromDB = (item: any): Ad => ({
    id: item.id,
    userId: item.user_id, 
    title: item.title,
    description: item.description,
    price: Number(item.price), 
    category: item.category,
    subCategory: item.sub_category,
    contact: item.contact,
    location: item.location,
    image: item.image || 'https://via.placeholder.com/800x600?text=No+Image',
    images: item.images || [item.image || 'https://via.placeholder.com/800x600?text=No+Image'],
    isPremium: item.is_premium,
    bookingAvailable: false,
    date: item.created_at ? new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) : 'Недавно',
    reviews: [],
    specs: item.specs || {},
    status: item.status || 'approved'
});

const mapSupabaseUser = (sbUser: any): User => {
  const metadata = sbUser.user_metadata || {};
  let isAdmin = false;
  let managedShopId = undefined;
  
  if (sbUser.email === 'hrustalev_1974@mail.ru') isAdmin = true;
  if (sbUser.email === 'shop@snezhinsk.ru') managedShopId = 's1';
  if (sbUser.email === 'cinema@snezhinsk.ru') managedShopId = 'cinema1';

  return {
    id: sbUser.id,
    email: sbUser.email,
    phone: metadata.phone || '',
    name: metadata.full_name || 'Пользователь',
    isLoggedIn: true,
    avatar: metadata.avatar_url,
    isAdmin,
    managedShopId
  };
};

// SidebarItem Component
const SidebarItem = ({ label, icon, active, onClick }: { label: string, icon: React.ReactNode, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
      ${active 
        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
        : 'text-secondary hover:bg-gray-50 hover:text-dark'}`}
  >
    <div className={`${active ? 'text-white' : 'text-gray-400'}`}>{icon}</div>
    {label}
  </button>
);

// SnezhikLogo Component
const SnezhikLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20" className="text-blue-300" />
    <path d="M12 2v20" transform="rotate(45 12 12)" className="text-blue-300" />
    <path d="M12 2v20" transform="rotate(-45 12 12)" className="text-blue-300" />
    <path d="M12 2v4M12 22v-4M2 12h4M22 12h-4" className="text-blue-200" strokeWidth="3" />
    <circle cx="12" cy="12" r="3" className="text-white fill-blue-50" />
  </svg>
);

interface WeatherData {
  temp: number;
  condition: string;
  wind: number;
  pressure: number;
  humidity: number;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Category | 'news'>('all');
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  
  // Ads State
  const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  
  // Chat State
  const [activeChat, setActiveChat] = useState<ChatSession | null>(null);

  // Other Data
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [movies, setMovies] = useState<Movie[]>(INITIAL_MOVIES);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [shops, setShops] = useState<Shop[]>(INITIAL_SHOPS);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isMerchantDashboardOpen, setIsMerchantDashboardOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cafes, setCafes] = useState<Shop[]>(INITIAL_CAFES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState({
      minPrice: '', maxPrice: '', minYear: '', maxMileage: '', minRooms: '', floor: '', condition: '' 
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const allShops = [...shops, ...cafes];

  // --- Functions ---
  const addNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
      const newNote = { id: Date.now(), message, type };
      setNotifications(prev => [...prev, newNote]);
  };

  const removeNotification = (id: number) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fetchFavorites = async (userId: string) => {
      if (!supabase) return;
      try {
          const { data, error } = await supabase
              .from('favorites')
              .select('ad_id')
              .eq('user_id', userId);
          
          if (error) {
              console.error('Error fetching favorites:', error);
          } else {
              setFavorites(data.map((item: any) => item.ad_id));
          }
      } catch (err) {
          console.error('Failed to fetch favorites', err);
      }
  };

  // --- Effects ---
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
         const appUser = mapSupabaseUser(session.user);
         setUser(appUser);
         fetchFavorites(appUser.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const appUser = mapSupabaseUser(session.user);
        setUser(appUser);
        fetchFavorites(appUser.id);
      } else {
        setUser(null);
        setFavorites([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchAds = async () => {
      try {
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
            console.warn('Supabase fetch error:', error.message);
        } else if (data) {
            const mappedAds = data.map(mapAdFromDB);
            const initialIds = new Set(INITIAL_ADS.map(a => a.id));
            const filteredMapped = mappedAds.filter(a => !initialIds.has(a.id));
            setAds([...filteredMapped, ...INITIAL_ADS]);
        }
      } catch (err) {
          console.warn('Unexpected error fetching ads:', err);
      }
    };

    fetchAds();

    const channel = supabase
      .channel('public:ads')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ads' }, (payload) => {
         if (payload.eventType === 'INSERT') {
            const newAd = mapAdFromDB(payload.new);
            setAds((prev) => {
                if (prev.some(a => a.id === newAd.id)) return prev;
                if(newAd.status === 'approved' || user?.isAdmin) {
                    addNotification(`Новое объявление: ${newAd.title}`, 'info');
                }
                return [newAd, ...prev];
            });
         } 
         else if (payload.eventType === 'UPDATE') {
            const updatedAd = mapAdFromDB(payload.new);
            setAds((prev) => prev.map(ad => ad.id === updatedAd.id ? updatedAd : ad));
         }
         else if (payload.eventType === 'DELETE') {
             setAds((prev) => prev.filter(ad => ad.id !== payload.old.id));
         }
      })
      .subscribe((status, err) => {
          if (err) console.warn('Realtime subscription error:', err);
      });

    return () => {
        supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
      const localAvatar = localStorage.getItem('user_avatar');
      if (user && localAvatar && !user.avatar) {
          setUser({ ...user, avatar: localAvatar });
      }
  }, [user?.email]);

  // Weather Logic
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=56.08&longitude=60.73&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&wind_speed_unit=ms',
          { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        const code = data.current.weather_code;
        let condition = 'Ясно';
        
        if (code > 0 && code <= 3) { condition = 'Облачно'; }
        else if (code >= 45 && code <= 48) { condition = 'Туман'; }
        else if (code >= 51 && code <= 67) { condition = 'Дождь'; }
        else if (code >= 71 && code <= 77) { condition = 'Снег'; }
        else if (code >= 80 && code <= 82) { condition = 'Ливень'; }
        else if (code >= 85 && code <= 86) { condition = 'Снегопад'; }

        const pressureMmHg = Math.round(data.current.surface_pressure * 0.750062);

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          condition,
          wind: Math.round(data.current.wind_speed_10m),
          pressure: pressureMmHg,
          humidity: data.current.relative_humidity_2m
        });
      } catch (error) {
        console.warn("Weather fetch failed, using fallback");
        setWeather({
          temp: -12,
          condition: 'Снег',
          wind: 4,
          pressure: 745,
          humidity: 82
        });
      }
    };
    fetchWeather();
  }, []);

  // --- Handlers ---
  const handleTabChange = (tab: Category | 'news') => {
    setActiveTab(tab);
    setSubCategoryFilter('');
    setSelectedAd(null);
    setSelectedShop(null);
    setSelectedNews(null);
    setFilters({ minPrice: '', maxPrice: '', minYear: '', maxMileage: '', minRooms: '', floor: '', condition: '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity: number, shopId?: string) => {
    const effectiveShopId = shopId || selectedShop?.id;
    if (!effectiveShopId) return;

    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id && item.shopId === effectiveShopId);
      if (existingItem) {
        return prev.map(item => 
          (item.id === product.id && item.shopId === effectiveShopId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity, shopId: effectiveShopId }];
    });
    addNotification(`Товар "${product.title}" добавлен в корзину`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const toggleFavorite = async (adId: string) => {
      const isFav = favorites.includes(adId);
      setFavorites(prev => {
          if (isFav) return prev.filter(id => id !== adId);
          return [...prev, adId];
      });

      if (!user) {
          addNotification('Войдите, чтобы сохранять избранное навсегда', 'info');
          return;
      }

      if (supabase && user) {
          try {
              if (isFav) {
                  await supabase.from('favorites').delete().match({ user_id: user.id, ad_id: adId });
              } else {
                  await supabase.from('favorites').insert({ user_id: user.id, ad_id: adId });
              }
          } catch (err) {
              console.error('Error updating favorites:', err);
          }
      }
      
      if (!isFav) addNotification('Добавлено в избранное', 'success');
  };

  const handleUpdateUser = async (updatedUser: User) => {
      setUser(updatedUser);
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          data: { full_name: updatedUser.name }
        });
        if (error) {
           console.error("Failed to update user metadata", error);
           addNotification("Ошибка обновления профиля", "error");
        } else {
           addNotification('Профиль обновлен', 'success');
           if (updatedUser.avatar) localStorage.setItem('user_avatar', updatedUser.avatar);
        }
      }
  };

  const handleCreateAd = async (form: CreateAdFormState) => {
    const specs: Ad['specs'] = {};
    if (form.specs?.year) specs.year = Number(form.specs.year);
    if (form.specs?.mileage) specs.mileage = Number(form.specs.mileage);
    if (form.specs?.rooms) specs.rooms = Number(form.specs.rooms);
    if (form.specs?.area) specs.area = Number(form.specs.area);
    if (form.specs?.floor) specs.floor = Number(form.specs.floor);
    if (form.specs?.condition) specs.condition = form.specs.condition as 'new' | 'used';
    if (form.specs?.brand) specs.brand = form.specs.brand;

    const newAd: Ad = {
      id: Date.now().toString(),
      userId: user?.id,
      title: form.title,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      subCategory: form.subCategory,
      contact: form.contact,
      location: form.location,
      image: form.images[0] || 'https://via.placeholder.com/800x600?text=No+Image',
      images: form.images,
      isPremium: form.isPremium,
      date: 'Только что',
      reviews: [],
      specs: Object.keys(specs).length > 0 ? specs : undefined,
      status: 'pending'
    };

    if (supabase) {
        addNotification('Отправка...', 'info');
        try {
            const { error } = await supabase.from('ads').insert({
                user_id: user?.id,
                title: newAd.title,
                description: newAd.description,
                price: newAd.price,
                category: newAd.category,
                sub_category: newAd.subCategory,
                contact: newAd.contact,
                location: newAd.location,
                image: newAd.image,
                images: newAd.images,
                is_premium: newAd.isPremium,
                specs: newAd.specs,
                status: 'pending',
                created_at: new Date().toISOString()
            });

            if (error) {
                console.error('Error creating ad in DB:', error.message);
                addNotification('Ошибка при сохранении', 'error');
            } else {
                addNotification('Объявление отправлено на модерацию!', 'success');
            }
        } catch (err) {
            console.error('Supabase Insert Exception:', err);
            addNotification('Ошибка сети', 'error');
        }
    } else {
        setAds([newAd, ...ads]);
        addNotification('Объявление создано (оффлайн режим)', 'success');
    }
    handleTabChange('all');
  };

  const handleUpdateAdStatus = (adId: string, status: 'approved' | 'rejected') => {
      setAds(prev => {
          if (status === 'rejected') return prev.filter(ad => ad.id !== adId);
          return prev.map(ad => ad.id === adId ? { ...ad, status } : ad);
      });
      if (supabase) {
          supabase.from('ads').update({ status }).eq('id', adId).then(({ error }) => {
              if (error) addNotification('Ошибка обновления статуса', 'error');
          });
      }
  };

  const handleUpdateAdContent = (adId: string, updatedFields: Partial<Ad>) => {
      setAds(prev => prev.map(ad => ad.id === adId ? { ...ad, ...updatedFields } : ad));
      addNotification('Объявление обновлено', 'success');
       if (supabase) {
          const dbFields: any = { ...updatedFields };
          if (updatedFields.isPremium !== undefined) { dbFields.is_premium = updatedFields.isPremium; delete dbFields.isPremium; }
          if (updatedFields.subCategory !== undefined) { dbFields.sub_category = updatedFields.subCategory; delete dbFields.subCategory; }
          supabase.from('ads').update(dbFields).eq('id', adId);
       }
  };

  const handleAddNews = (newsItem: NewsItem) => setNews([newsItem, ...news]);

  const handleAddReview = (adId: string, rating: number, text: string) => {
     setAds(prevAds => prevAds.map(ad => {
         if (ad.id === adId) {
             const newReview: Review = {
                 id: Date.now().toString(),
                 author: user ? user.name || 'Пользователь' : 'Гость',
                 rating,
                 text,
                 date: 'Сегодня'
             };
             const currentReviews = ad.reviews || [];
             const updatedAd = { ...ad, reviews: [newReview, ...currentReviews] };
             if (selectedAd && selectedAd.id === adId) setSelectedAd(updatedAd);
             return updatedAd;
         }
         return ad;
     }));
     addNotification('Спасибо за ваш отзыв!', 'success');
  };

  const handleUpdateShop = (updatedShop: Shop) => setShops(prev => prev.map(s => s.id === updatedShop.id ? updatedShop : s));

  const handleOpenShopFromStory = (shopId: string) => {
    if (shopId === 'cinema1' || shopId.includes('cinema')) { handleTabChange('cinema'); return; }
    const cafe = cafes.find(c => c.id === shopId);
    if (cafe) { handleTabChange('cafes'); setSelectedShop(cafe); return; }
    const shop = shops.find(s => s.id === shopId);
    if (shop) { handleTabChange('shops'); setSelectedShop(shop); return; }
  };

  // Filters
  const filteredAds = ads.filter(ad => {
    if (ad.status !== 'approved') return false;
    const matchesCategory = activeTab === 'all' || ad.category === activeTab;
    const matchesSubCategory = !subCategoryFilter || ad.subCategory === subCategoryFilter;
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || ad.description.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesAdvanced = true;
    if (filters.minPrice && ad.price < Number(filters.minPrice)) matchesAdvanced = false;
    if (filters.maxPrice && ad.price > Number(filters.maxPrice)) matchesAdvanced = false;
    if (ad.specs) {
        if (filters.minYear && (!ad.specs.year || ad.specs.year < Number(filters.minYear))) matchesAdvanced = false;
        if (filters.maxMileage && (!ad.specs.mileage || ad.specs.mileage > Number(filters.maxMileage))) matchesAdvanced = false;
        if (filters.minRooms && (!ad.specs.rooms || ad.specs.rooms < Number(filters.minRooms))) matchesAdvanced = false;
        if (filters.floor && (!ad.specs.floor || ad.specs.floor !== Number(filters.floor))) matchesAdvanced = false;
        if (filters.condition && (!ad.specs.condition || ad.specs.condition !== filters.condition)) matchesAdvanced = false;
    }
    return matchesCategory && matchesSubCategory && matchesSearch && matchesAdvanced;
  });

  const premiumAds = filteredAds.filter(ad => ad.isPremium);
  const standardAds = filteredAds.filter(ad => !ad.isPremium);
  const showCarFilters = activeTab === 'sale' && subCategoryFilter === 'Автомобили';
  const showRealEstateFilters = (activeTab === 'sale' || activeTab === 'rent') && (subCategoryFilter === 'Квартиры' || subCategoryFilter === 'Дома, дачи');
  const activeCatalogCategory = SERVICE_CATALOG.find(c => c.id === activeTab);
  const subCategories = activeCatalogCategory ? activeCatalogCategory.groups.flatMap(g => g.items) : [];

  return (
    <div className="min-h-screen bg-background text-dark font-sans selection:bg-primary/20 pb-20 lg:pb-0">
      
      <ToastNotification notifications={notifications} onRemove={removeNotification} />

      {/* RENDER CHAT PAGE AS FULL OVERLAY IF ACTIVE */}
      {activeChat && (
          <ChatPage 
             session={activeChat} 
             onBack={() => setActiveChat(null)} 
             currentUserId={user?.id}
          />
      )}

      {/* --- DESKTOP HEADER --- */}
      <header className="hidden lg:block bg-surface border-b border-gray-200 sticky top-0 z-40">
           <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
               <div className="flex items-center gap-8">
                   <div className="flex items-center gap-2 cursor-pointer group" onClick={() => handleTabChange('all')}>
                       <SnezhikLogo className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
                       <div className="flex flex-col leading-none">
                           <h1 className="text-2xl font-extrabold text-primary tracking-tight">Твой<span className="text-dark">Снежинск</span></h1>
                           <span className="text-[10px] text-secondary tracking-widest uppercase">Городской портал</span>
                       </div>
                   </div>
                   <button onClick={() => setIsCatalogOpen(true)} className="bg-dark text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black transition-all shadow-md active:scale-95">
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                       Каталог
                   </button>
               </div>
               <div className="flex-grow max-w-xl relative">
                   <input type="text" placeholder="Поиск..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-100 border-2 border-transparent rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:border-primary focus:outline-none transition-all" />
                   <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               </div>
               <div className="flex items-center gap-6">
                   {weather && (
                       <div className="flex items-center gap-3 text-right">
                           <div className="hidden xl:block">
                               <div className="text-lg font-bold text-dark leading-none">{weather.temp > 0 ? '+' : ''}{weather.temp}°</div>
                               <div className="text-xs text-secondary">{weather.condition}</div>
                           </div>
                           <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                           </div>
                           <div className="hidden xl:block">
                                <div className="text-xs font-bold text-dark">{weather.pressure} мм</div>
                                <div className="text-xs text-secondary">{new Date().toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'})}</div>
                           </div>
                       </div>
                   )}
                   {cart.length > 0 && (
                        <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-dark hover:text-primary transition-colors">
                            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cart.length}</span>
                        </button>
                   )}
                   <div className="h-8 w-px bg-gray-200"></div>
                   <button onClick={() => setIsCreateModalOpen(true)} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                       Подать
                   </button>
                   {user ? (
                       <button onClick={() => setIsUserProfileOpen(true)} className="flex items-center gap-3 hover:bg-gray-50 px-2 py-1 rounded-xl transition-colors">
                           <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md overflow-hidden">
                               {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name?.charAt(0)}
                           </div>
                           <div className="text-left hidden xl:block">
                               <div className="text-sm font-bold text-dark">{user.name}</div>
                               <div className="text-xs text-secondary">Мой профиль</div>
                           </div>
                       </button>
                   ) : (
                       <button onClick={() => setIsLoginOpen(true)} className="text-dark font-bold hover:text-primary transition-colors text-sm">Войти</button>
                   )}
               </div>
           </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden bg-surface/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabChange('all')}>
               <SnezhikLogo className="w-8 h-8 text-primary" />
               <div className="flex flex-col leading-none">
                  <h1 className="text-xl font-extrabold text-primary tracking-tight">Твой<span className="text-dark">Снежинск</span></h1>
                  {weather && <span className="text-[10px] text-secondary font-medium mt-0.5 flex items-center gap-1">{weather.temp > 0 ? '+' : ''}{weather.temp}°, {weather.condition}</span>}
               </div>
            </div>
            {cart.length > 0 && (
                <button onClick={() => setIsCartOpen(true)} className="relative p-2 text-dark">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>
                </button>
            )}
        </div>
        {!selectedAd && !selectedShop && !selectedNews && (
            <div className="px-4 pb-3">
                <div className="relative">
                    <input type="text" placeholder="Поиск..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-gray-100 border-none rounded-xl py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/20" />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
            </div>
        )}
      </header>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-200 z-40 flex justify-between items-center px-6 py-2 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.05)]">
         <button onClick={() => handleTabChange('all')} className={`flex flex-col items-center gap-1 ${activeTab === 'all' && !selectedShop && !selectedNews ? 'text-primary' : 'text-gray-400'}`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[10px] font-medium">Главная</span>
         </button>
         <button onClick={() => setIsCatalogOpen(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="text-[10px] font-medium">Каталог</span>
         </button>
         <button onClick={() => setIsCreateModalOpen(true)} className="flex flex-col items-center justify-center -mt-6">
            <div className="w-14 h-14 rounded-full bg-dark text-white flex items-center justify-center shadow-lg shadow-dark/40 active:scale-95 transition-transform">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-[10px] font-medium text-dark mt-1">Подать</span>
         </button>
         <button onClick={() => { setIsUserProfileOpen(true); }} className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <span className="text-[10px] font-medium">Избранное</span>
         </button>
         <button onClick={() => { if(user) setIsUserProfileOpen(true); else setIsLoginOpen(true); }} className="flex flex-col items-center gap-1 text-gray-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            <span className="text-[10px] font-medium">Профиль</span>
         </button>
      </div>

      {/* Main Page Content */}
      <div className="container mx-auto px-4 py-6">
         
         {!selectedAd && !selectedShop && !selectedNews && (
             <div className="lg:hidden mb-6">
                 <StoriesBar stories={INITIAL_STORIES} onOpenShop={handleOpenShopFromStory} />
             </div>
         )}

         {!selectedAd && !selectedShop && !selectedNews && activeTab === 'all' && (
            <div className="lg:hidden grid grid-cols-4 gap-2 mb-6">
                <button onClick={() => handleTabChange('shops')} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-1.5 text-purple-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    </div>
                    <span className="text-[10px] font-bold text-dark">Магазины</span>
                </button>
                <button onClick={() => handleTabChange('cafes')} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-1.5 text-orange-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /></svg>
                    </div>
                    <span className="text-[10px] font-bold text-dark">Кафе</span>
                </button>
                <button onClick={() => handleTabChange('cinema')} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-1.5 text-red-600">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>
                    </div>
                    <span className="text-[10px] font-bold text-dark">Кино</span>
                </button>
                <button onClick={() => handleTabChange('news')} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1.5 text-blue-600">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    </div>
                    <span className="text-[10px] font-bold text-dark">Новости</span>
                </button>
            </div>
         )}

         <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6 sticky top-24 h-fit">
               <div className="bg-surface rounded-2xl shadow-sm border border-gray-100 p-2 space-y-1">
                  {SERVICE_CATALOG.map((cat) => (
                    <SidebarItem key={cat.id} label={cat.label} active={activeTab === cat.id} onClick={() => handleTabChange(cat.id)} icon={
                        cat.id === 'sale' ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> :
                        cat.id === 'rent' ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> :
                        cat.id === 'services' ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> :
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    } />
                  ))}
                  <div className="my-2 border-t border-gray-100"></div>
                  <SidebarItem label="Магазины" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>} active={activeTab === 'shops'} onClick={() => handleTabChange('shops')} />
                  <SidebarItem label="Кафе и Еда" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /></svg>} active={activeTab === 'cafes'} onClick={() => handleTabChange('cafes')} />
                  <SidebarItem label="Кинотеатр" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>} active={activeTab === 'cinema'} onClick={() => handleTabChange('cinema')} />
                  <SidebarItem label="Новости" icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>} active={activeTab === 'news'} onClick={() => handleTabChange('news')} />
               </div>
               <div onClick={() => setIsPartnerModalOpen(true)} className="bg-gradient-to-br from-dark to-black rounded-2xl p-6 text-white cursor-pointer shadow-lg transform hover:-translate-y-1 transition-all group">
                  <h3 className="font-bold text-lg mb-2">Для бизнеса</h3>
                  <p className="text-sm text-gray-300 mb-4">Подключите магазин или услуги к платформе</p>
                  <button className="bg-white text-dark text-xs font-bold px-4 py-2 rounded-lg group-hover:bg-gray-100 transition-colors">Подключить</button>
               </div>
               <div className="text-xs text-center text-gray-400">
                  &copy; 2024 Твой Снежинск<br/><a href="#" className="hover:underline">Политика конфиденциальности</a>
               </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow min-w-0">
               {/* Subcategories */}
               {!selectedAd && !selectedShop && !selectedNews && subCategories.length > 0 && (
                  <div className="hidden lg:flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar">
                     <button onClick={() => setSubCategoryFilter('')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${!subCategoryFilter ? 'bg-dark text-white border-dark' : 'bg-white text-secondary border-gray-200 hover:border-gray-300'}`}>Все</button>
                     {subCategories.map(sub => (
                        <button key={sub} onClick={() => setSubCategoryFilter(sub)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${subCategoryFilter === sub ? 'bg-dark text-white border-dark' : 'bg-white text-secondary border-gray-200 hover:border-gray-300'}`}>{sub}</button>
                     ))}
                  </div>
               )}

               {/* View Switching */}
               {selectedAd ? (
                  <AdPage 
                      ad={selectedAd} 
                      onBack={() => setSelectedAd(null)} 
                      onAddReview={handleAddReview}
                      onOpenChat={(session) => setActiveChat(session)} 
                  />
               ) : selectedNews ? (
                  <NewsPage news={selectedNews} onBack={() => setSelectedNews(null)} />
               ) : selectedShop ? (
                  <ShopPage shop={selectedShop} onBack={() => { setSelectedShop(null); handleTabChange('all'); }} variant={selectedShop.id.includes('c') ? 'cafe' : 'shop'} onProductClick={(p) => setSelectedProduct(p)} />
               ) : (
                  <div className="space-y-6 animate-fade-in-up">
                     {/* News Grid */}
                     {activeTab === 'news' ? (
                         <div className="grid grid-cols-1 gap-6">
                             {news.map(item => (
                                 <div key={item.id} onClick={() => setSelectedNews(item)} className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg transition-all flex flex-col md:flex-row group h-full md:h-56">
                                     <div className="md:w-1/3 h-48 md:h-full relative overflow-hidden">
                                         <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                         <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">{item.category}</span>
                                     </div>
                                     <div className="p-6 md:w-2/3 flex flex-col justify-between">
                                         <div>
                                             <div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><span>{item.date}</span><span>•</span><span>2 мин чтения</span></div>
                                             <h3 className="text-xl font-bold text-dark mb-2 leading-tight group-hover:text-primary transition-colors">{item.title}</h3>
                                             <p className="text-secondary text-sm line-clamp-2 md:line-clamp-3">{item.excerpt}</p>
                                         </div>
                                         <span className="text-primary font-bold text-sm mt-4 inline-block hover:underline">Читать далее →</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     ) : activeTab === 'shops' || activeTab === 'cafes' ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                             {(activeTab === 'shops' ? shops : cafes).map(shop => (
                                 <ShopCard key={shop.id} shop={shop} onClick={setSelectedShop} />
                             ))}
                         </div>
                     ) : activeTab === 'cinema' ? (
                         <div className="space-y-8">
                             <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden shadow-lg">
                                 <img src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200" className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                     <div className="text-center text-white">
                                         <h2 className="text-3xl md:text-4xl font-bold mb-2">Кинотеатр "Космос"</h2>
                                         <p className="text-lg opacity-90">Премьеры этой недели</p>
                                     </div>
                                 </div>
                             </div>
                             <h3 className="text-2xl font-bold text-dark pl-2 border-l-4 border-primary">Сегодня в прокате</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                 {movies.map(movie => (
                                     <div key={movie.id} className="bg-surface rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all">
                                         <div className="relative aspect-[2/3] overflow-hidden">
                                             <img src={movie.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                             <div className="absolute top-2 left-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm">{movie.ageLimit}</div>
                                             <div className="absolute top-2 right-2 bg-yellow-400 text-dark text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1"><span>★</span> {movie.rating}</div>
                                         </div>
                                         <div className="p-4 flex-grow flex flex-col">
                                             <h4 className="font-bold text-lg text-dark mb-1 leading-tight">{movie.title}</h4>
                                             <p className="text-xs text-secondary mb-3">{movie.genre}</p>
                                             <div className="flex flex-wrap gap-2 mt-auto mb-4">
                                                 {movie.showtimes.map(time => (
                                                     <span key={time} className="bg-gray-100 text-dark text-xs font-bold px-2 py-1 rounded border border-gray-200">{time}</span>
                                                 ))}
                                             </div>
                                             <button onClick={() => setSelectedMovie(movie)} className="w-full bg-dark text-white py-2 rounded-xl font-bold text-sm hover:bg-black transition-colors">Купить билет</button>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                     ) : (
                         <>
                             {premiumAds.length > 0 && !searchQuery && !subCategoryFilter && (
                                 <div className="mb-8">
                                     <h2 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                                         <span className="text-yellow-500">★</span> VIP объявления
                                     </h2>
                                     <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                                         {premiumAds.map(ad => (
                                             <div key={ad.id} className="h-full">
                                                 <AdCard ad={ad} onShow={setSelectedAd} variant="premium" isFavorite={favorites.includes(ad.id)} onToggleFavorite={toggleFavorite} />
                                             </div>
                                         ))}
                                     </div>
                                 </div>
                             )}
                             <div>
                                 <h2 className="text-lg font-bold text-dark mb-4">
                                     {searchQuery ? 'Результаты поиска' : 'Свежие объявления'}
                                 </h2>
                                 {standardAds.length === 0 && premiumAds.length === 0 ? (
                                     <div className="text-center py-20 text-secondary">
                                         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">😔</div>
                                         <p className="text-lg font-medium">Ничего не найдено</p>
                                         <p className="text-sm">Попробуйте изменить параметры поиска</p>
                                     </div>
                                 ) : (
                                     <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
                                         {(searchQuery || subCategoryFilter || filters.maxPrice ? filteredAds : standardAds).map(ad => (
                                             <div key={ad.id} className="h-full">
                                                 <AdCard ad={ad} onShow={setSelectedAd} isFavorite={favorites.includes(ad.id)} onToggleFavorite={toggleFavorite} />
                                             </div>
                                         ))}
                                     </div>
                                 )}
                             </div>
                         </>
                     )}
                  </div>
               )}
            </main>
         </div>
      </div>

      <CreateAdModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSubmit={handleCreateAd} catalog={SERVICE_CATALOG} />
      <PartnerModal isOpen={isPartnerModalOpen} onClose={() => setIsPartnerModalOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <ServiceCatalogModal isOpen={isCatalogOpen} onClose={() => setIsCatalogOpen(false)} catalog={SERVICE_CATALOG} onSelect={(cat, sub) => { handleTabChange(cat); setSubCategoryFilter(sub); }} initialCategory={activeTab === 'news' || activeTab === 'all' ? 'sale' : activeTab as Category} />
      {user && (
          <UserProfileModal isOpen={isUserProfileOpen} onClose={() => setIsUserProfileOpen(false)} user={user} onLogout={async () => { if(supabase) await supabase.auth.signOut(); setUser(null); }} favorites={favorites} allAds={ads} onToggleFavorite={toggleFavorite} onShowAd={setSelectedAd} onUpdateUser={handleUpdateUser} onOpenAdminPanel={() => { setIsUserProfileOpen(false); setIsAdminPanelOpen(true); }} onOpenMerchantDashboard={() => { setIsUserProfileOpen(false); setIsMerchantDashboardOpen(true); if (user.managedShopId) { const shop = allShops.find(s => s.id === user.managedShopId); if (shop) setSelectedShop(shop); } }} />
      )}
      {user && user.isAdmin && (
          <AdminPanel isOpen={isAdminPanelOpen} onClose={() => setIsAdminPanelOpen(false)} ads={ads} onUpdateAdStatus={handleUpdateAdStatus} onUpdateAdContent={handleUpdateAdContent} onAddNews={handleAddNews} />
      )}
      {user && user.managedShopId && (
          <MerchantDashboard isOpen={isMerchantDashboardOpen} onClose={() => setIsMerchantDashboardOpen(false)} shop={allShops.find(s => s.id === user.managedShopId) || shops[0]} onUpdateShop={(updated) => { if (updated.id.includes('c') && !updated.id.includes('cinema')) { } else { handleUpdateShop(updated); } }} movies={user.managedShopId.includes('cinema') ? movies : undefined} onUpdateMovies={user.managedShopId.includes('cinema') ? setMovies : undefined} />
      )}
      <MovieBookingModal isOpen={!!selectedMovie} onClose={() => setSelectedMovie(null)} movie={selectedMovie} />
      <ProductDetailsModal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} product={selectedProduct} onAddToCart={addToCart} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} shops={allShops} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} />
    </div>
  );
}
