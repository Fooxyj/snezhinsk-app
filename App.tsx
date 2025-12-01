
import React, { useState, useEffect, useMemo } from 'react';
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
import { PublicProfileModal } from './components/PublicProfileModal';
import { ToastNotification } from './components/ToastNotification';
import { AdminPanel } from './components/AdminPanel';
import { ChatList } from './components/ChatList';
import { MobileMenu } from './components/MobileMenu';
import { MobileSearchModal } from './components/MobileSearchModal';
import { SplashScreen } from './components/SplashScreen';
import { supabase } from './services/supabaseClient';
import { api } from './services/api';
import { formatPhoneNumber } from './utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useUnreadMessages } from './useUnreadMessages';

// Mock data removed - all data now loaded from Supabase

const CATALOG: CatalogCategory[] = [
    {
        id: 'sale',
        label: 'Купить',
        groups: [
            { name: 'Транспорт', items: ['Автомобили', 'Мотоциклы', 'Запчасти', 'Гаражи'] },
            { name: 'Недвижимость', items: ['Квартиры', 'Дома, дачи', 'Комнаты', 'Земельные участки'] },
            { name: 'Личные вещи', items: ['Одежда, обувь', 'Детская одежда', 'Часы и украшения'] },
            { name: 'Электроника', items: ['Телефоны', 'Ноутбуки', 'Бытовая техника', 'Фототехника'] },
            { name: 'Для дома и дачи', items: ['Ремонт и стройка', 'Мебель', 'Растения', 'Инструменты'] },
        ]
    },
    {
        id: 'rent',
        label: 'Снять',
        groups: [
            { name: 'Недвижимость', items: ['Квартиры', 'Дома, дачи', 'Комнаты', 'Помещения'] },
            { name: 'Транспорт', items: ['Автомобили', 'Спецтехника'] },
        ]
    },
    {
        id: 'services',
        label: 'Услуги',
        groups: [
            { name: 'Красота и уход', items: ['Маникюр', 'Педикюр', 'Парикмахер', 'Массаж', 'Брови и ресницы', 'Косметолог', 'Эпиляция', 'Тату'] },
            { name: 'Ремонт', items: ['Ремонт квартир', 'Сантехника', 'Электрика', 'Сборка мебели'] },
            { name: 'Обучение', items: ['Репетиторы', 'Курсы', 'Тренеры'] },
            { name: 'Транспорт', items: ['Грузоперевозки', 'Такси', 'Аренда авто'] },
        ]
    },
    {
        id: 'jobs',
        label: 'Работа',
        groups: [
            { name: 'Вакансии', items: ['Полный день', 'Подработка', 'Удаленная работа'] },
            { name: 'Резюме', items: ['Ищу работу'] },
        ]
    }
];

const NAV_ITEMS = [
    { id: 'all', label: 'Главная', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: 'news', label: 'Новости', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg> },
    { id: 'shops', label: 'Магазины', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    { id: 'cafes', label: 'Кафе и рестораны', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg> },
    { id: 'cinema', label: 'Кино', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg> },
    { id: 'tourism', label: 'Туризм', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'culture', label: 'Культура', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg> },
    { id: 'beauty', label: 'Красота', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'gyms', label: 'Спортзалы', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg> },
    { id: 'medicine', label: 'Медицина', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
    { id: 'transport', label: 'Транспорт', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
    { id: 'emergency', label: 'Экстренные', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
];

const DEFAULT_USER: User = {
    id: 'guest',
    email: 'guest@snezhinsk.ru',
    isLoggedIn: false,
    favorites: [],
    orders: [],
    xp: 0
};

const getSafeErrorMessage = (error: unknown): string => {
    if (!error) return 'Неизвестная ошибка';
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;

    if (typeof error === 'object') {
        const errObj = error as any;
        if (errObj.message) return errObj.message;
        if (errObj.error_description) return errObj.error_description;
        if (errObj.details) return errObj.details;
        if (errObj.msg) return errObj.msg;
        if (errObj.code) return `Код ошибки: ${errObj.code}`;
        return 'Ошибка соединения с сервером';
    }
    return String(error);
};

const App: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<Category>('all');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isCatalogOpen, setIsCatalogOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [showSplashScreen, setShowSplashScreen] = useState(true);

    const [publicProfileUser, setPublicProfileUser] = useState<any>(null);

    const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isChatListOpen, setIsChatListOpen] = useState(false);
    const [activeChatSession, setActiveChatSession] = useState<ChatSession | null>(null);

    // Listen for global events
    useEffect(() => {
        const handleOpenChatList = () => setIsChatListOpen(true);
        window.addEventListener('open-chat-list', handleOpenChatList);
        return () => window.removeEventListener('open-chat-list', handleOpenChatList);
    }, []);
    const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

    const [ads, setAds] = useState<Ad[]>(INITIAL_ADS);

    // Fetch news from Supabase
    const { data: fetchedNews } = useQuery({
        queryKey: ['news'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching news:', error);
                return [];
            }
            return data || [];
        },
        staleTime: 1000 * 60 * 5,
    });

    const [news, setNews] = useState<NewsItem[]>([]);

    // Fetch managed businesses from Supabase
    const { data: managedBusinesses } = useQuery({
        queryKey: ['managed_businesses'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('managed_businesses')
                .select('*');

            if (error) {
                console.error('Error fetching managed businesses:', error);
                return [];
            }
            return data || [];
        },
        staleTime: 1000 * 60 * 5,
    });

    const [user, setUser] = useState<User>(DEFAULT_USER);
    const [userBusinesses, setUserBusinesses] = useState<any[]>([]);
    const [weather, setWeather] = useState<{ temp: number, condition: string, pressure: number } | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
    const [isMerchantDashboardOpen, setIsMerchantDashboardOpen] = useState(false);

    const [shops, setShops] = useState<Shop[]>([]);
    const [cafes, setCafes] = useState<Shop[]>([]);
    const [gyms, setGyms] = useState<Shop[]>([]);
    const [beautyShops, setBeautyShops] = useState<Shop[]>([]);
    const [movies, setMovies] = useState<Movie[]>([]);

    const [adToEdit, setAdToEdit] = useState<Ad | null>(null);

    const queryClient = useQueryClient();

    // Fetch movies from Supabase
    const { data: fetchedMovies } = useQuery({
        queryKey: ['movies'],
        queryFn: async () => {
            try {
                return await api.movies.list();
            } catch (error) {
                console.error('Error fetching movies:', error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
    });

    // Fetch transport services from Supabase
    const { data: fetchedTransportServices } = useQuery({
        queryKey: ['transport_services'],
        queryFn: async () => {
            try {
                return await api.transportServices.list();
            } catch (error) {
                console.error('Error fetching transport services:', error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
    });

    // Fetch emergency contacts from Supabase
    const { data: fetchedEmergencyContacts } = useQuery({
        queryKey: ['emergency_contacts'],
        queryFn: async () => {
            try {
                return await api.emergencyContacts.list();
            } catch (error) {
                console.error('Error fetching emergency contacts:', error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
    });

    // Fetch medicine services from Supabase
    const { data: fetchedMedicineServices } = useQuery({
        queryKey: ['medicine_services'],
        queryFn: async () => {
            try {
                return await api.medicineServices.list();
            } catch (error) {
                console.error('Error fetching medicine services:', error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
    });

    // Fetch culture places from Supabase
    const { data: fetchedCulturePlaces } = useQuery({
        queryKey: ['culture_places'],
        queryFn: async () => {
            try {
                return await api.culturePlaces.list();
            } catch (error) {
                console.error('Error fetching culture places:', error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
    });

    // Fetch bus schedules from Supabase
    const { data: fetchedBusSchedules } = useQuery({
        queryKey: ['bus_schedules'],
        queryFn: async () => {
            try {
                return await api.busSchedules.list();
            } catch (error) {
                console.error('Error fetching bus schedules:', error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 5,
    });

    // Подсчет непрочитанных сообщений
    const { unreadCount } = useUnreadMessages(user.id);

    const handleNavigate = (category: Category) => {
        setActiveCategory(category);
        setSelectedSubCategory(null);
        setSearchQuery('');

        setSelectedAd(null);
        setSelectedShop(null);
        setSelectedNews(null);
        setSelectedProduct(null);
        setActiveChatSession(null);
        setActiveMovie(null);

        setIsMobileMenuOpen(false);
        setIsCatalogOpen(false);
    };

    const totalCartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

    useEffect(() => {
        if (window.innerWidth >= 768) {
            setShowSplashScreen(false);
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const { data: fetchedAds } = useQuery({
        queryKey: ['ads', activeCategory, user.isAdmin],
        queryFn: async () => {
            try {
                // Fetch all ads for admin, otherwise only approved
                const status = user.isAdmin ? 'all' : 'approved';

                if (activeCategory === 'beauty') {
                    return await api.ads.getByCategory('services', 0, 50, status);
                }
                if (activeCategory === 'all' || activeCategory === 'news' || activeCategory === 'shops' || activeCategory === 'cinema' || activeCategory === 'cafes' || activeCategory === 'gyms' || activeCategory === 'emergency' || activeCategory === 'transport' || activeCategory === 'medicine' || activeCategory === 'culture' || activeCategory === 'tourism') {
                    return await api.ads.list(0, 50, status);
                } else {
                    return await api.ads.getByCategory(activeCategory, 0, 50, status);
                }
            } catch (error) {
                console.warn('Supabase fetch error (using cache/mock):', getSafeErrorMessage(error));
                return null;
            }
        },
        staleTime: 1000 * 60 * 2,
        gcTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        console.log('📊 Ads fetch result:', {
            hasFetchedAds: !!fetchedAds,
            adsLength: fetchedAds?.length,
            firstAd: fetchedAds?.[0]
        });

        if (fetchedAds && fetchedAds.length > 0) {
            const dbAds: Ad[] = fetchedAds.map((item: any) => ({
                id: item.id,
                userId: item.user_id,
                // Author Name from DB if available, otherwise 'Продавец'
                authorName: item.author_name || 'Продавец',
                authorAvatar: item.author_avatar, // Map avatar from DB
                authorLevel: item.author_level || 1,
                title: item.title,
                description: item.description,
                price: item.price,
                category: item.category,
                subCategory: item.sub_category,
                contact: item.contact,
                location: item.location,
                image: item.image,
                images: item.images, // Load multiple images
                isPremium: item.is_premium,
                bookingAvailable: false,
                date: new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
                status: item.status || 'pending',
                specs: item.specs || {}
            }));

            console.log('✅ Setting ads from DB:', dbAds.length, 'ads');
            setAds(dbAds);
        } else if (fetchedAds !== undefined && fetchedAds !== null) {
            // Database returned empty array - clear mock data
            console.log('⚠️ Database returned empty, clearing ads');
            setAds([]);
        }
    }, [fetchedAds]);

    // Sync fetched news with local state
    useEffect(() => {
        if (fetchedNews && fetchedNews.length > 0) {
            const dbNews: NewsItem[] = fetchedNews.map((item: any) => ({
                id: item.id,
                title: item.title,
                excerpt: item.excerpt,
                content: item.content,
                category: item.category,
                image: item.image,
                date: new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
            }));
            setNews(dbNews);
        }
    }, [fetchedNews]);

    // Sync fetched movies with local state
    useEffect(() => {
        if (fetchedMovies && fetchedMovies.length > 0) {
            const dbMovies: Movie[] = fetchedMovies.map((item: any) => ({
                id: item.id,
                title: item.title,
                genre: item.genre,
                rating: item.rating,
                ageLimit: item.age_limit,
                image: item.image,
                description: item.description,
                showtimes: item.showtimes || [],
                price: item.price
            }));
            setMovies(dbMovies);
        }
    }, [fetchedMovies]);

    // Fetch user's businesses when logged in
    useEffect(() => {
        const fetchUserBusinesses = async () => {
            if (user.isLoggedIn && user.id && user.id !== 'guest') {
                try {
                    const { data, error } = await supabase
                        .from('managed_businesses')
                        .select('*')
                        .eq('user_id', user.id);

                    if (!error && data) {
                        setUserBusinesses(data);
                        // Update user object with has_business flag
                        if (data.length > 0 && !user.managedShopId) {
                            setUser(prev => ({ ...prev, managedShopId: data[0].id }));
                        }
                    }
                } catch (err) {
                    console.error('Error fetching user businesses:', err);
                }
            }
        };

        fetchUserBusinesses();
    }, [user.isLoggedIn, user.id]);

    // Merge managed businesses with shop listings
    useEffect(() => {
        if (managedBusinesses && managedBusinesses.length > 0) {
            // Map managed businesses to Shop format
            const businessShops = managedBusinesses
                .filter((b: any) => b.business_type === 'shop' || b.business_type === 'service')
                .map((b: any) => ({
                    id: b.id,
                    name: b.business_name,
                    category: b.business_type === 'service' ? 'Услуги' : 'Магазины',
                    description: b.business_data?.description || 'Описание скоро появится',
                    image: b.business_data?.image || b.business_data?.avatar || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
                    logo: b.business_data?.avatar || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
                    coverImage: b.business_data?.header || b.business_data?.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
                    address: b.business_data?.address || 'г. Снежинск',
                    phone: b.business_data?.phone || '',
                    workingHours: b.business_data?.hours || 'Уточняйте по телефону',
                    rating: 4.5,
                    products: b.business_data?.products || []
                }));

            const businessCafes = managedBusinesses
                .filter((b: any) => b.business_type === 'cafe')
                .map((b: any) => ({
                    id: b.id,
                    name: b.business_name,
                    category: 'Кафе',
                    description: b.business_data?.description || 'Описание скоро появится',
                    image: b.business_data?.image || b.business_data?.avatar || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
                    logo: b.business_data?.avatar || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
                    coverImage: b.business_data?.header || b.business_data?.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
                    address: b.business_data?.address || 'г. Снежинск',
                    phone: b.business_data?.phone || '',
                    workingHours: b.business_data?.hours || 'Уточняйте по телефону',
                    rating: 4.5,
                    products: b.business_data?.products || []
                }));

            const businessRentals = managedBusinesses
                .filter((b: any) => b.business_type === 'rental')
                .map((b: any) => ({
                    id: b.id,
                    name: b.business_name,
                    category: 'Аренда',
                    description: b.business_data?.description || 'Описание скоро появится',
                    image: b.business_data?.image || b.business_data?.avatar || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400',
                    logo: b.business_data?.avatar || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=200',
                    coverImage: b.business_data?.header || b.business_data?.image || 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
                    address: b.business_data?.address || 'г. Снежинск',
                    phone: b.business_data?.phone || '',
                    workingHours: b.business_data?.hours || 'Уточняйте по телефону',
                    rating: 4.5,
                    products: b.business_data?.products || []
                }));

            // Merge with existing shops
            setShops([...INITIAL_SHOPS, ...(businessShops as Shop[])]);
            setCafes([...INITIAL_CAFES, ...(businessCafes as Shop[])]);
            setBeautyShops([...INITIAL_BEAUTY_SALONS, ...(businessRentals as Shop[])]);
        }
    }, [managedBusinesses]);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user_data');
            if (savedUser) setUser(JSON.parse(savedUser));
        } catch (e) { }

        try {
            const savedFavs = localStorage.getItem('favorites');
            if (savedFavs) {
                const favIds: string[] = JSON.parse(savedFavs);
                setUser(u => ({ ...u, favorites: favIds }));
            }
        } catch (e) { }

        // Initial Auth Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const isAdmin = session.user.email?.includes('admin') || session.user.email === 'hrustalev_1974@mail.ru';
                let managedShopId = undefined;
                if (session.user.email?.includes('cinema')) managedShopId = 'cinema1';
                if (session.user.email?.includes('shop')) managedShopId = 's1';

                setUser(prev => ({
                    ...prev,
                    id: session.user.id,
                    email: session.user.email!,
                    isLoggedIn: true,
                    isAdmin: isAdmin,
                    managedShopId: managedShopId,
                    // Use metadata from Supabase as source of truth
                    name: session.user.user_metadata?.full_name || prev.name,
                    avatar: session.user.user_metadata?.avatar_url || prev.avatar,
                    xp: prev.xp || 5
                }));
            }
        });

        // Real-time Auth Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const isAdmin = session.user.email?.includes('admin') || session.user.email === 'hrustalev_1974@mail.ru';
                let managedShopId = undefined;
                if (session.user.email?.includes('cinema')) managedShopId = 'cinema1';
                if (session.user.email?.includes('shop')) managedShopId = 's1';

                setUser(prev => ({
                    ...prev,
                    id: session.user.id,
                    email: session.user.email!,
                    isLoggedIn: true,
                    isAdmin: isAdmin,
                    managedShopId: managedShopId,
                    // Sync profile data from session metadata
                    name: session.user.user_metadata?.full_name || prev.name,
                    avatar: session.user.user_metadata?.avatar_url || prev.avatar,
                    xp: prev.xp || 50
                }));
            } else {
                setUser(DEFAULT_USER);
            }
        });

        setWeather({ temp: 12, condition: 'Облачно', pressure: 745 });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('favorites', JSON.stringify(user.favorites || []));
        } catch (e) { }
    }, [user.favorites]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
    }, [activeCategory, selectedSubCategory, selectedAd, selectedNews, selectedShop, activeChatSession]);

    // Global Chat Notifications
    useEffect(() => {
        if (!user.isLoggedIn || !user.id) return;

        const channel = supabase.channel('global_messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages' },
                async (payload) => {
                    const newMsg = payload.new;
                    // Ignore my own messages
                    if (newMsg.sender_id === user.id) return;

                    // If I'm already looking at this chat, no notification needed
                    if (activeChatSession && activeChatSession.chatId === newMsg.chat_id) {
                        return;
                    }

                    try {
                        // Fetch chat details to see if it concerns me
                        const { data: chatData } = await supabase
                            .from('chats')
                            .select('buyer_id, ad_id')
                            .eq('id', newMsg.chat_id)
                            .single();

                        if (!chatData) return;

                        let notificationMessage = '';

                        if (chatData.buyer_id === user.id) {
                            // I am the buyer, receiving a message from seller
                            const { data: ad } = await supabase.from('ads').select('title').eq('id', chatData.ad_id).single();
                            notificationMessage = `Ответ по объявлению "${ad?.title || '...'}"`;
                        } else {
                            // Check if I am the seller
                            const { data: ad } = await supabase.from('ads').select('user_id, title').eq('id', chatData.ad_id).single();
                            if (ad && ad.user_id === user.id) {
                                notificationMessage = `Вопрос по объявлению "${ad.title}"`;
                            }
                        }

                        if (notificationMessage) {
                            addNotification({
                                id: Date.now(),
                                message: notificationMessage,
                                type: 'info'
                            });
                        }
                    } catch (err) {
                        console.error('Error processing notification:', err);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user.isLoggedIn, user.id, activeChatSession]);

    const addNotification = (note: Notification) => {
        setNotifications(prev => [...prev, note]);
    };

    const handleRemoveNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const addXp = (amount: number, reason: string) => {
        setUser(prev => {
            const newXp = (prev.xp || 0) + amount;
            try {
                localStorage.setItem('user_data', JSON.stringify({ ...prev, xp: newXp }));
            } catch (e) { }
            return { ...prev, xp: newXp };
        });
        addNotification({
            id: Date.now(),
            message: `+${amount} XP: ${reason}`,
            type: 'level_up'
        });
    };

    const handleCreateAd = async (form: CreateAdFormState) => {
        if (!user.isLoggedIn || user.id === 'guest') {
            addNotification({ id: Date.now(), message: 'Войдите в аккаунт, чтобы опубликовать объявление', type: 'error' });
            setIsLoginModalOpen(true);
            return;
        }

        const specs: Ad['specs'] = {};
        if (form.specs) {
            if (form.specs.year) specs.year = Number(form.specs.year);
            if (form.specs.mileage) specs.mileage = Number(form.specs.mileage);
            if (form.specs.rooms) specs.rooms = Number(form.specs.rooms);
            if (form.specs.area) specs.area = Number(form.specs.area);
            if (form.specs.floor) specs.floor = Number(form.specs.floor);
            if (form.specs.condition) specs.condition = form.specs.condition as 'new' | 'used';
            if (form.specs.brand) specs.brand = form.specs.brand;
        }

        addNotification({ id: Date.now(), message: 'Публикация...', type: 'info' });

        try {
            const payload = {
                title: form.title,
                description: form.description,
                price: Number(form.price),
                category: form.category,
                sub_category: form.subCategory,
                contact: form.contact,
                location: form.location,
                image: form.images[0] || '',
                images: form.images, // Save all images
                is_premium: form.isPremium,
                specs: specs,
                author_name: user.name || 'Пользователь', // Save real name
                author_avatar: user.avatar || '' // Save avatar
            };

            if (adToEdit) {
                await api.ads.update(adToEdit.id, payload);
                addNotification({ id: Date.now(), message: 'Объявление обновлено!', type: 'success' });
            } else {
                await api.ads.create({
                    ...payload,
                    user_id: user.id,
                    status: 'pending',
                });

                addNotification({ id: Date.now(), message: 'Объявление отправлено на модерацию!', type: 'success' });
                addXp(20, 'Публикация объявления');
            }

            queryClient.invalidateQueries({ queryKey: ['ads'] });
            setAdToEdit(null);

        } catch (err: any) {
            console.error("Failed to save ad to DB:", err);
            addNotification({ id: Date.now(), message: 'Ошибка публикации: ' + getSafeErrorMessage(err), type: 'error' });
        }
    };

    const handleEditAd = (ad: Ad) => {
        setAdToEdit(ad);
        setIsCreateModalOpen(true);
    };

    const handleDeleteAd = async (adId: string) => {
        try {
            await api.ads.delete(adId);
            setAds(prev => prev.filter(ad => ad.id !== adId));
            queryClient.invalidateQueries({ queryKey: ['ads'] });
            addNotification({ id: Date.now(), message: 'Объявление удалено', type: 'success' });
        } catch (err: any) {
            console.error(err);
            addNotification({ id: Date.now(), message: 'Ошибка удаления', type: 'error' });
        }
    };

    const handleAddToCart = (product: Product, quantity: number) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            let shopId = 'unknown';
            const allShops = [...shops, ...cafes, ...gyms, ...beautyShops, ...TOURISM_CLUBS, ...FREIGHT_PROVIDERS];
            const ownerShop = allShops.find(s => s.products.some(p => p.id === product.id));
            if (ownerShop) shopId = ownerShop.id;

            return [...prev, { ...product, quantity, shopId }];
        });
        addNotification({ id: Date.now(), message: `Добавлено в корзину: ${product.title}`, type: 'success' });
    };

    const handleUpdateCartQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQ = item.quantity + delta;
                return newQ > 0 ? { ...item, quantity: newQ } : item;
            }
            return item;
        }));
    };

    const handleRemoveFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleShowAd = (ad: Ad) => {
        setSelectedAd(ad);
    };

    const handleToggleFavorite = (id: string) => {
        if (!user.isLoggedIn) {
            setIsLoginModalOpen(true);
            return;
        }
        const newFavs = user.favorites?.includes(id)
            ? user.favorites.filter(fid => fid !== id)
            : [...(user.favorites || []), id];

        setUser({ ...user, favorites: newFavs });
    };

    const handleOpenShop = (shopId: string) => {
        const shop = [...shops, ...cafes, ...gyms, ...beautyShops, ...TOURISM_CLUBS, ...FREIGHT_PROVIDERS].find(s => s.id === shopId);
        if (shop) setSelectedShop(shop);
    };

    const handleBackFromShop = () => {
        if (selectedShop?.id === 'cinema1') {
            setSelectedShop(null);
            setActiveCategory('cinema');
            return;
        }
        setSelectedShop(null);
    };

    const handleOpenPublicProfile = (userId: string, userName: string, userAvatar?: string) => {
        setPublicProfileUser({
            id: userId,
            name: userName,
            level: 1,
            avatar: userAvatar || '',
        });
    };

    const getShopVariant = (shop: Shop): 'cinema' | 'cafe' | 'shop' | 'tourism' => {
        if (shop.id.includes('cinema')) return 'cinema';
        if (shop.id.includes('tc')) return 'tourism';
        if (cafes.some(c => c.id === shop.id)) return 'cafe';
        return 'shop';
    };

    // --- Views ---
    const TransportView = () => {
        const [viewMode, setViewMode] = useState<'taxi' | 'bus' | 'freight'>('freight');

        const cityBuses = BUS_SCHEDULES.filter(b => b.type === 'city');
        const intercityBuses = BUS_SCHEDULES.filter(b => b.type === 'intercity');

        return (
            <div className="space-y-6 animate-fade-in-up">
                {/* Toggle Buttons */}
                <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto self-start overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setViewMode('freight')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${viewMode === 'freight' ? 'bg-white shadow-sm text-dark' : 'text-secondary hover:text-dark'}`}
                    >
                        Грузоперевозки
                    </button>
                    <button
                        onClick={() => setViewMode('taxi')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${viewMode === 'taxi' ? 'bg-white shadow-sm text-dark' : 'text-secondary hover:text-dark'}`}
                    >
                        Такси
                    </button>
                    <button
                        onClick={() => setViewMode('bus')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${viewMode === 'bus' ? 'bg-white shadow-sm text-dark' : 'text-secondary hover:text-dark'}`}
                    >
                        Автобусы
                    </button>
                </div>

                {viewMode === 'taxi' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {TAXI_SERVICES.map(taxi => (
                            <div key={taxi.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{taxi.icon}</div>
                                    <div>
                                        <h3 className="font-bold text-dark text-lg">{taxi.name}</h3>
                                        <p className="text-secondary text-xs">{taxi.description}</p>
                                    </div>
                                </div>
                                {taxi.phone ? (
                                    <a href={`tel:${taxi.phone}`} className="bg-green-500 text-white font-bold py-2 px-6 rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
                                        Вызвать
                                    </a>
                                ) : (
                                    <a href={taxi.link} target="_blank" rel="noreferrer" className="bg-yellow-400 text-dark font-bold py-2 px-6 rounded-xl hover:bg-yellow-500 transition-colors shadow-lg shadow-yellow-200">
                                        Приложение
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : viewMode === 'freight' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FREIGHT_PROVIDERS.map(shop => (
                            <ShopCard key={shop.id} shop={shop} onClick={setSelectedShop} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800 text-sm">
                            Расписание может меняться в праздничные дни.
                        </div>

                        {/* City Routes */}
                        <div>
                            <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">🏠</span>
                                Городские маршруты
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {cityBuses.map((bus, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-primary text-white font-black text-xl flex items-center justify-center rounded-lg">
                                                {bus.number}
                                            </div>
                                            <div className="font-bold text-dark leading-tight">{bus.route}</div>
                                        </div>
                                        <div className="text-sm text-secondary bg-gray-50 p-3 rounded-lg">
                                            <span className="font-semibold block mb-1 text-xs uppercase text-gray-400">Отправление:</span>
                                            {bus.times}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Intercity Routes */}
                        <div>
                            <h3 className="text-xl font-bold text-dark mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm">🛣️</span>
                                Межгород
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {intercityBuses.map((bus, idx) => (
                                    <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-indigo-500 text-white font-black text-xl flex items-center justify-center rounded-lg">
                                                {bus.number}
                                            </div>
                                            <div className="font-bold text-dark leading-tight">{bus.route}</div>
                                        </div>
                                        <div className="text-sm text-secondary bg-gray-50 p-3 rounded-lg">
                                            <span className="font-semibold block mb-1 text-xs uppercase text-gray-400">Отправление:</span>
                                            {bus.times}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const MedicineView = () => (
        <div className="space-y-4 animate-fade-in-up">
            {MEDICINE_SERVICES.map(place => (
                <div key={place.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <img src={place.image} loading="lazy" className="w-full h-full object-cover" alt={place.name} />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-dark text-lg">{place.name}</h3>
                            <p className="text-sm text-gray-500 mb-1">{place.address}</p>
                            <p className="text-xs text-secondary mb-2">{place.description}</p>
                        </div>
                        <a href={`tel:${place.phone}`} className="self-start text-white font-bold text-sm bg-primary px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            Позвонить
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );

    const EmergencyView = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in-up">
            {EMERGENCY_NUMBERS.map(num => (
                <div key={num.id} className="bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-red-900 leading-tight">{num.name}</h3>
                        <p className="text-xs text-red-700 opacity-80 mt-1">{num.desc}</p>
                    </div>
                    <a href={`tel:${num.phone}`} className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-red-500 text-red-500 bg-white hover:bg-red-500 hover:text-white transition-all shadow-sm shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </a>
                </div>
            ))}
        </div>
    );

    const TourismView = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {TOURISM_CLUBS.map(club => (
                    <div key={club.id} onClick={() => setSelectedShop(club)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col h-full cursor-pointer hover:shadow-lg transition-all">
                        <div className="h-48 overflow-hidden relative">
                            <img src={club.coverImage} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={club.name} />
                            <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                                {club.products?.slice(0, 2).map(prod => (
                                    <span key={prod.id} className="bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-dark">{prod.title}</span>
                                ))}
                            </div>
                        </div>
                        <div className="p-5 flex-grow flex flex-col">
                            <h3 className="font-bold text-dark text-lg mb-2">{club.name}</h3>
                            <p className="text-sm text-secondary leading-relaxed mb-4 flex-grow">{club.description}</p>

                            <button
                                className="w-full bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 pointer-events-none"
                            >
                                <span className="text-sm">Подробнее</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const CultureView = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CULTURE_PLACES.map(place => (
                    <div key={place.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                        <div className="h-32 overflow-hidden">
                            <img src={place.image} loading="lazy" className="w-full h-full object-cover" alt={place.name} />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-dark">{place.name}</h3>
                            <p className="text-xs text-gray-500 mb-2">{place.address}</p>
                            <p className="text-sm text-secondary mb-3">{place.description}</p>
                            {place.phone && (
                                <a href={`tel:${place.phone}`} className="text-primary text-xs font-bold border border-primary/20 px-2 py-1 rounded hover:bg-primary hover:text-white transition-colors">
                                    Позвонить
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <h3 className="text-xl font-bold text-dark mt-8 mb-4">Новости культуры</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.filter(n => n.category === 'Культура').map(item => (
                    <div key={item.id} onClick={() => setSelectedNews(item)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all group">
                        <div className="h-40 overflow-hidden relative">
                            <img src={item.image} loading="lazy" alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-dark">{item.date}</span>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-dark leading-tight mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-xs text-secondary line-clamp-2">{item.excerpt}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        if (searchQuery) {
            const q = searchQuery.toLowerCase().trim();

            const isMedicine = q.includes('больниц') || q.includes('врач') || q.includes('аптек') || q.includes('лекарств');
            const isFood = q.includes('еда') || q.includes('кафе') || q.includes('пицц') || q.includes('суши');
            const isAuto = q.includes('авто') || q.includes('машин') || q.includes('колес');

            const foundAds = ads.filter(ad =>
                (ad.title.toLowerCase().includes(q) || ad.description.toLowerCase().includes(q) || (isAuto && ad.category === 'sale' && ad.subCategory === 'Автомобили')) &&
                (ad.status === 'approved')
            );

            const allShops = [...shops, ...cafes, ...gyms, ...beautyShops, ...TOURISM_CLUBS, ...FREIGHT_PROVIDERS];
            const foundShops = allShops.filter(s =>
                s.name.toLowerCase().includes(q) ||
                s.description.toLowerCase().includes(q) ||
                (isMedicine && s.id.includes('med')) ||
                (isFood && (s.id.includes('c') || s.description.toLowerCase().includes('ресторан')))
            );

            const foundProducts: { product: Product, shop: Shop }[] = [];
            allShops.forEach(shop => {
                shop.products.forEach(p => {
                    if (p.title.toLowerCase().includes(q)) {
                        foundProducts.push({ product: p, shop });
                    }
                });
            });

            const foundNews = news.filter(n => n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q));
            const foundMovies = movies.filter(m => m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q));

            const hasResults = foundAds.length > 0 || foundShops.length > 0 || foundProducts.length > 0 || foundNews.length > 0 || foundMovies.length > 0;

            return (
                <div className="space-y-10 animate-fade-in-up pb-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-dark">Результаты поиска: "{searchQuery}"</h2>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-secondary transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {!hasResults ? (
                        <div className="text-center py-20 text-secondary bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <p className="text-lg font-medium text-dark">Ничего не найдено</p>
                            <p className="text-sm">Попробуйте изменить запрос</p>
                        </div>
                    ) : (
                        <>
                            {foundShops.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-secondary uppercase mb-4 tracking-wider text-xs">Магазины и Места</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {foundShops.map(shop => <ShopCard key={shop.id} shop={shop} onClick={setSelectedShop} />)}
                                    </div>
                                </div>
                            )}

                            {foundProducts.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-secondary uppercase mb-4 tracking-wider text-xs">Товары</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {foundProducts.map(({ product, shop }) => (
                                            <div key={product.id} onClick={() => setSelectedProduct(product)} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                                                <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-3">
                                                    <img src={product.image} className="w-full h-full object-cover" />
                                                </div>
                                                <h4 className="font-bold text-sm text-dark line-clamp-1">{product.title}</h4>
                                                <p className="text-xs text-secondary mb-2">{shop.name}</p>
                                                <span className="text-primary font-bold text-sm">{product.price} ₽</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {foundAds.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-secondary uppercase mb-4 tracking-wider text-xs">Объявления</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {foundAds.map(ad => (
                                            <AdCard
                                                key={ad.id}
                                                ad={ad}
                                                onShow={handleShowAd}
                                                isFavorite={user.favorites?.includes(ad.id)}
                                                onToggleFavorite={handleToggleFavorite}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {foundNews.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-secondary uppercase mb-4 tracking-wider text-xs">Новости</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {foundNews.map(item => (
                                            <div key={item.id} onClick={() => setSelectedNews(item)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md cursor-pointer flex gap-4">
                                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                    <img src={item.image} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-dark mb-1">{item.title}</h4>
                                                    <p className="text-xs text-secondary line-clamp-2">{item.excerpt}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {foundMovies.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-secondary uppercase mb-4 tracking-wider text-xs">Кино</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                        {foundMovies.map(movie => (
                                            <div key={movie.id} onClick={() => setActiveMovie(movie)} className="cursor-pointer group">
                                                <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 relative">
                                                    <img src={movie.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                                </div>
                                                <h4 className="font-bold text-sm text-dark line-clamp-1">{movie.title}</h4>
                                                <p className="text-xs text-secondary">{movie.genre}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
        }

        if (activeCategory === 'transport') return <TransportView />;
        if (activeCategory === 'medicine') return <MedicineView />;
        if (activeCategory === 'emergency') return <EmergencyView />;
        if (activeCategory === 'culture') return <CultureView />;
        if (activeCategory === 'tourism') return <TourismView />;

        if (activeCategory === 'beauty') {
            const beautySubcats = ['Маникюр', 'Педикюр', 'Парикмахер', 'Массаж', 'Брови и ресницы', 'Косметолог', 'Эпиляция', 'Тату'];

            let displayAds = ads.filter(ad => ad.category === 'services' && ad.subCategory && beautySubcats.includes(ad.subCategory));

            if (selectedSubCategory) {
                displayAds = displayAds.filter(ad => ad.subCategory === selectedSubCategory);
            }

            return (
                <div className="space-y-8 animate-fade-in-up">
                    {!selectedSubCategory && (
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 border border-purple-100">
                            <h3 className="text-xl font-bold text-dark mb-4 px-1 flex items-center gap-2">
                                <span className="text-2xl">✨</span> Популярные студии
                            </h3>
                            <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
                                {beautyShops.map(shop => (
                                    <div key={shop.id} className="min-w-[280px] md:min-w-[320px]">
                                        <ShopCard shop={shop} onClick={setSelectedShop} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="text-xl font-bold text-dark mb-4 px-1 flex items-center justify-between">
                            <span>Частные мастера</span>
                            <span className="text-sm font-normal text-secondary bg-gray-100 px-2 py-1 rounded-lg">{displayAds.length}</span>
                        </h3>

                        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 mb-2">
                            <button
                                onClick={() => setSelectedSubCategory(null)}
                                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shrink-0
                                ${!selectedSubCategory
                                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                                        : 'bg-white text-secondary border-gray-200 hover:border-primary hover:text-dark'}`}
                            >
                                Все
                            </button>
                            {beautySubcats.map(sub => (
                                <button
                                    key={sub}
                                    onClick={() => setSelectedSubCategory(selectedSubCategory === sub ? null : sub)}
                                    className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shrink-0
                                    ${selectedSubCategory === sub
                                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                                            : 'bg-white text-secondary border-gray-200 hover:border-primary hover:text-dark'}`}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
                            {displayAds.length > 0 ? displayAds.map((ad) => (
                                <AdCard
                                    key={ad.id}
                                    ad={ad}
                                    onShow={handleShowAd}
                                    isFavorite={user.favorites?.includes(ad.id)}
                                    onToggleFavorite={handleToggleFavorite}
                                />
                            )) : (
                                <div className="col-span-full py-12 text-center text-secondary">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </div>
                                    <p>В этой категории пока нет объявлений</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (activeCategory === 'shops') {
            const filteredShops = shops.filter(s => !s.id.includes('cinema'));
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
                    {filteredShops.map(shop => <ShopCard key={shop.id} shop={shop} onClick={setSelectedShop} />)}
                </div>
            );
        }

        if (activeCategory === 'cafes') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
                    {cafes.map(cafe => <ShopCard key={cafe.id} shop={cafe} onClick={(s) => setSelectedShop(s)} />)}
                </div>
            );
        }

        if (activeCategory === 'gyms') {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
                    {gyms.map(gym => <ShopCard key={gym.id} shop={gym} onClick={(s) => setSelectedShop(s)} />)}
                </div>
            );
        }

        if (activeCategory === 'cinema') {
            return (
                <div className="space-y-8 animate-fade-in-up">
                    <div className="bg-gradient-to-r from-violet-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Кинотеатр "Космос"</h2>
                            <p className="text-indigo-200 mb-6 max-w-lg">Смотрите новинки кино в лучшем качестве. Покупайте билеты онлайн без очередей.</p>
                            <button
                                onClick={() => handleOpenShop('cinema1')}
                                className="bg-white text-indigo-900 font-bold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
                            >
                                Бар кинотеатра
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {movies.map(movie => (
                            <div key={movie.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group flex flex-col h-full hover:shadow-xl transition-all">
                                <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
                                    <img src={movie.image} loading="lazy" alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                                    <div className="absolute top-2 left-2 bg-dark/80 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded border border-white/20">{movie.ageLimit}</div>
                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-md">{movie.rating}</div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-bold text-dark text-lg mb-1 leading-tight">{movie.title}</h3>
                                    <p className="text-xs text-secondary mb-4">{movie.genre}</p>
                                    <div className="mt-auto">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {movie.showtimes.map(time => (
                                                <button
                                                    key={time}
                                                    onClick={() => setActiveMovie(movie)}
                                                    className="bg-gray-100 hover:bg-primary hover:text-white text-dark text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                                                >
                                                    {time}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setActiveMovie(movie)}
                                            className="w-full bg-dark text-white font-bold py-3 rounded-xl hover:bg-black transition-colors"
                                        >
                                            Купить от {movie.price} ₽
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (activeCategory === 'news') {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                    {news.map(item => (
                        <div key={item.id} onClick={() => setSelectedNews(item)} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all group h-full flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img src={item.image} loading="lazy" alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                    <span className="text-xs font-bold text-white bg-white/20 backdrop-blur px-2 py-1 rounded border border-white/10">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                                    <span>{item.date}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span>3 мин</span>
                                </div>
                                <h3 className="font-bold text-dark text-lg leading-tight mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-sm text-secondary line-clamp-3 mb-4">{item.excerpt}</p>
                                <span className="mt-auto text-primary text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                    Читать далее
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        let filteredAds = ads;

        if (selectedSubCategory) {
            filteredAds = filteredAds.filter(ad => ad.subCategory === selectedSubCategory);
        }

        filteredAds = filteredAds.filter(ad => {
            if (user.isAdmin) return true; // Admins see everything
            if (ad.status === 'approved' || !ad.status) return true;
            return ad.userId === user.id || (user.id === 'guest' && ad.userId === undefined);
        });

        const premiumAds = filteredAds.filter(ad => ad.isPremium);
        const regularAds = filteredAds.filter(ad => !ad.isPremium);

        return (
            <div className="space-y-12 animate-fade-in-up">
                {filteredAds.length > 0 ? (
                    <>
                        {premiumAds.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-dark mb-4 md:mb-6 flex items-center gap-2 pl-2 md:pl-0">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-200">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    </span>
                                    VIP Объявления
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
                                    {premiumAds.map((ad) => (
                                        <AdCard
                                            key={ad.id}
                                            ad={ad}
                                            variant="premium"
                                            onShow={handleShowAd}
                                            isFavorite={user.favorites?.includes(ad.id)}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {regularAds.length > 0 && (
                            <div>
                                {premiumAds.length > 0 && <div className="h-px bg-gray-100 my-8"></div>}
                                {premiumAds.length > 0 && <h3 className="text-xl font-bold text-dark mb-6 pl-2 border-l-4 border-primary">Свежие предложения</h3>}
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
                                    {regularAds.map((ad) => (
                                        <AdCard
                                            key={ad.id}
                                            ad={ad}
                                            onShow={handleShowAd}
                                            isFavorite={user.favorites?.includes(ad.id)}
                                            onToggleFavorite={handleToggleFavorite}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="col-span-full py-20 text-center text-secondary">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <p className="text-lg font-medium text-dark">Объявлений не найдено</p>
                        <p className="text-sm">Попробуйте изменить категорию или фильтры</p>
                        {(activeCategory !== 'all') && (
                            <button onClick={() => handleNavigate('all')} className="mt-4 text-primary font-bold hover:underline">
                                Сбросить фильтры
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-[100dvh] bg-background font-sans text-dark pb-24 md:pb-0 relative">
            {showSplashScreen && <SplashScreen onFinish={() => setShowSplashScreen(false)} />}
            <ToastNotification notifications={notifications} onRemove={handleRemoveNotification} />

            <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-50 p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => handleNavigate('all')}>
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/30">
                        С
                    </div>
                    <div className="leading-none">
                        <h1 className="font-bold text-xl text-dark tracking-tight">Снежинск</h1>
                        <p className="text-[10px] text-secondary font-medium tracking-widest uppercase">Твой Город</p>
                    </div>
                </div>

                <nav className="flex flex-col gap-1">
                    {NAV_ITEMS.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => handleNavigate(cat.id as Category)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                        ${activeCategory === cat.id
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-secondary hover:bg-gray-50 hover:text-dark'}`}
                        >
                            <span className="w-6 flex justify-center">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto pt-6">
                    <button
                        onClick={() => setIsPartnerModalOpen(true)}
                        className="w-full bg-dark text-white p-4 rounded-2xl shadow-lg hover:bg-black transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-serif font-bold">B</div>
                            <div className="text-left">
                                <p className="text-xs text-gray-300 font-medium">Для бизнеса</p>
                                <p className="text-sm font-bold">Подключить</p>
                            </div>
                        </div>
                    </button>
                </div>
            </aside>

            <div className="md:ml-64 transition-all">
                <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">

                        <div className="md:hidden flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('all')}>
                            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg">С</div>
                            <span className="font-bold text-lg text-dark ml-1">Твой Снежинск</span>
                        </div>

                        <div className="hidden md:flex items-center gap-4 flex-grow max-w-2xl">
                            <button
                                onClick={() => setIsCatalogOpen(true)}
                                className="flex items-center gap-2 bg-dark text-white px-4 py-2.5 rounded-xl font-bold hover:bg-black transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                                Каталог
                            </button>
                            <div className="relative flex-grow group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm"
                                    placeholder="Поиск объявлений..."
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-dark transition-colors"
                                    >
                                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 md:gap-6">
                            <button onClick={() => setIsSearchModalOpen(true)} className="md:hidden p-2 rounded-full hover:bg-gray-100 text-dark">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>

                            {weather && (
                                <div className="flex items-center gap-2 md:gap-3 bg-white px-2 md:px-4 py-1 md:py-2 rounded-xl md:border border-gray-100 md:shadow-sm">
                                    <div className="text-right leading-tight hidden md:block">
                                        <span className="block font-bold text-dark text-lg">{currentTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span className="text-[10px] text-secondary font-medium uppercase tracking-wide">Снежинск</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <span className="text-xl md:text-2xl">☁️</span>
                                        <div className="leading-tight text-xs md:text-base">
                                            <span className="block font-bold text-dark">{weather.temp}°C</span>
                                            <span className="text-[10px] text-secondary hidden md:inline">{weather.pressure} мм</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-dark hover:text-primary transition-colors hidden md:block"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                {totalCartCount > 0 && (
                                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm">
                                        {totalCartCount}
                                    </span>
                                )}
                            </button>

                            {user.isLoggedIn && (
                                <button
                                    onClick={() => {
                                        setAdToEdit(null);
                                        setIsCreateModalOpen(true);
                                    }}
                                    className="hidden md:flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 active:scale-95"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                    <span>Разместить</span>
                                </button>
                            )}

                            {user.isLoggedIn && (
                                <div onClick={() => setIsUserProfileOpen(true)} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity relative">
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white flex items-center justify-center font-bold text-sm overflow-hidden border-2 border-white shadow-md">
                                        {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name?.charAt(0) || user.email.charAt(0)}
                                    </div>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-sm border-2 border-white">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </div>
                            )}

                            {!user.isLoggedIn && (
                                <button onClick={() => setIsLoginModalOpen(true)} className="hidden md:block text-sm font-bold text-dark hover:text-primary transition-colors bg-gray-100 px-4 py-2 rounded-lg">
                                    Войти
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="md:hidden max-w-7xl mx-auto px-4 py-4">
                    {activeCategory === 'all' && !searchQuery && <StoriesBar stories={INITIAL_STORIES} onOpenShop={handleOpenShop} />}
                </div>

                {selectedSubCategory && (
                    <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4 mb-4 flex items-center gap-2 animate-fade-in-up">
                        <span className="text-sm text-secondary">Фильтр:</span>
                        <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                            {selectedSubCategory}
                            <button onClick={() => setSelectedSubCategory(null)} className="hover:text-red-200">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                <main className="max-w-7xl mx-auto px-4 md:px-6 py-4">
                    {selectedShop ? (
                        <ShopPage
                            shop={selectedShop}
                            onBack={handleBackFromShop}
                            variant={getShopVariant(selectedShop)}
                            onProductClick={(p) => setSelectedProduct(p)}
                        />
                    ) : selectedNews ? (
                        <NewsPage news={selectedNews} onBack={() => setSelectedNews(null)} />
                    ) : selectedAd ? (
                        <AdPage
                            ad={selectedAd}
                            onBack={() => setSelectedAd(null)}
                            onAddReview={(id, r, t) => {
                                setAds(prev => prev.map(a => a.id === id ? {
                                    ...a,
                                    reviews: [...(a.reviews || []), { id: Date.now().toString(), author: user.name || 'Гость', rating: r, text: t, date: 'Сегодня' }]
                                } : a));
                                addNotification({ id: Date.now(), message: 'Отзыв добавлен!', type: 'success' });
                            }}
                            onOpenChat={(session) => setActiveChatSession(session)}
                            isLoggedIn={user.isLoggedIn}
                            onRequireLogin={() => setIsLoginModalOpen(true)}
                            onOpenProfile={handleOpenPublicProfile}
                        />
                    ) : (
                        renderContent()
                    )}
                </main>
            </div>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center z-40 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">

                <button onClick={() => handleNavigate('all')} className={`flex flex-col items-center gap-1 p-2 w-16 ${activeCategory === 'all' ? 'text-primary' : 'text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                    <span className="text-[10px] font-medium">Главная</span>
                </button>

                <button onClick={() => setIsCatalogOpen(true)} className="flex flex-col items-center gap-1 p-2 w-16 text-gray-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    <span className="text-[10px] font-medium">Каталог</span>
                </button>

                <div className="relative -top-6">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className={`w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40 active:scale-95 transition-transform border-4 border-background ${isMobileMenuOpen ? 'ring-2 ring-primary' : ''}`}
                    >
                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </button>
                </div>

                <button
                    onClick={() => {
                        if (user.isLoggedIn) {
                            setAdToEdit(null);
                            setIsCreateModalOpen(true);
                        } else {
                            setIsLoginModalOpen(true);
                        }
                    }}
                    className="flex flex-col items-center gap-1 p-2 w-16 text-gray-400"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-[10px] font-medium">Разместить</span>
                </button>

                <button onClick={() => { if (user.isLoggedIn) setIsUserProfileOpen(true); else setIsLoginModalOpen(true); }} className={`flex flex-col items-center gap-1 p-2 w-16 relative ${isUserProfileOpen ? 'text-primary' : 'text-gray-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    <span className="text-[10px] font-medium">Профиль</span>
                    {user.isLoggedIn && unreadCount > 0 && (
                        <span className="absolute top-1 right-3 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </nav>

            {totalCartCount > 0 && (
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="md:hidden fixed bottom-24 right-4 z-50 w-14 h-14 bg-white border-2 border-primary rounded-full text-primary shadow-xl flex items-center justify-center animate-bounce shadow-primary/30"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {totalCartCount}
                    </span>
                </button>
            )}

            <CreateAdModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateAd}
                catalog={CATALOG}
                initialData={adToEdit}
            />

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />

            <ServiceCatalogModal
                isOpen={isCatalogOpen}
                onClose={() => setIsCatalogOpen(false)}
                catalog={CATALOG}
                initialCategory={activeCategory === 'all' || activeCategory === 'news' ? 'sale' : activeCategory}
                onSelect={(cat, sub) => {
                    setActiveCategory(cat);
                    setSelectedSubCategory(sub);
                }}
            />

            <ChatList
                isOpen={isChatListOpen}
                onClose={() => setIsChatListOpen(false)}
                currentUserId={user.id || ''}
                onSelectChat={(session) => {
                    setActiveChatSession(session);
                    setIsChatListOpen(false);
                }}
            />

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onSelectCategory={(cat) => {
                    setActiveCategory(cat);
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                activeCategory={activeCategory}
                navItems={NAV_ITEMS}
                onOpenPartnerModal={() => setIsPartnerModalOpen(true)}
                onOpenProfile={() => setIsUserProfileOpen(true)}
                onNavigate={(target) => {
                    if (target === 'messages') {
                        setIsChatListOpen(true);
                    }
                }}
            />

            <MobileSearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                value={searchQuery}
                onChange={(val) => {
                    setSearchQuery(val);
                }}
                ads={ads}
                shops={[...shops, ...cafes, ...gyms, ...beautyShops, ...TOURISM_CLUBS, ...FREIGHT_PROVIDERS]}
                news={news}
                movies={movies}
                onSelectAd={handleShowAd}
                onSelectNews={setSelectedNews}
                onSelectShop={setSelectedShop}
                onSelectMovie={setActiveMovie}
                onSelectProduct={setSelectedProduct}
            />

            <UserProfileModal
                isOpen={isUserProfileOpen}
                onClose={() => setIsUserProfileOpen(false)}
                user={user}
                onLogout={async () => {
                    await supabase.auth.signOut();
                    setUser(DEFAULT_USER);
                }}
                favorites={user.favorites || []}
                allAds={ads}
                onToggleFavorite={handleToggleFavorite}
                onShowAd={(ad) => {
                    setSelectedAd(ad);
                }}
                onEditAd={handleEditAd}
                onDeleteAd={handleDeleteAd}
                onUpdateUser={(u) => {
                    setUser(u);
                    try {
                        localStorage.setItem('user_data', JSON.stringify(u));
                    } catch (e) {
                        console.warn("Quota exceeded saving user data", e);
                    }
                }}
                onOpenAdminPanel={() => {
                    setIsUserProfileOpen(false);
                    setIsAdminPanelOpen(true);
                }}
                onOpenMerchantDashboard={() => {
                    setIsUserProfileOpen(false);
                    setIsMerchantDashboardOpen(true);
                }}
                onOpenPartnerModal={() => {
                    setIsUserProfileOpen(false);
                    setIsPartnerModalOpen(true);
                }}
            />

            <PublicProfileModal
                isOpen={!!publicProfileUser}
                onClose={() => setPublicProfileUser(null)}
                profile={publicProfileUser}
                ads={ads.filter(a => publicProfileUser && a.userId === publicProfileUser.id)}
                onShowAd={handleShowAd}
                onToggleFavorite={handleToggleFavorite}
                favorites={user.favorites || []}
            />

            <MovieBookingModal
                isOpen={!!activeMovie}
                onClose={() => setActiveMovie(null)}
                movie={activeMovie}
            />

            {activeChatSession && (
                <ChatPage
                    session={activeChatSession}
                    onBack={() => setActiveChatSession(null)}
                    currentUserId={user.id}
                />
            )}

            {selectedProduct && (
                <ProductDetailsModal
                    product={selectedProduct}
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={handleAddToCart}
                />
            )}

            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cart}
                shops={[...shops, ...cafes, ...gyms, ...beautyShops, ...TOURISM_CLUBS, ...FREIGHT_PROVIDERS]}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemove={handleRemoveFromCart}
            />

            <PartnerModal
                isOpen={isPartnerModalOpen}
                onClose={() => setIsPartnerModalOpen(false)}
                isLoggedIn={user.isLoggedIn}
                onRequireLogin={() => {
                    setIsPartnerModalOpen(false);
                    setIsLoginModalOpen(true);
                }}
            />

            {user.isAdmin && (
                <AdminPanel
                    isOpen={isAdminPanelOpen}
                    onClose={() => setIsAdminPanelOpen(false)}
                    ads={ads}
                    onUpdateAdStatus={async (id, status) => {
                        setAds(prev => prev.map(a => a.id === id ? { ...a, status } : a));
                        await supabase.from('ads').update({ status }).eq('id', id);
                        queryClient.invalidateQueries({ queryKey: ['ads'] });
                    }}
                    onUpdateAdContent={async (id, fields) => {
                        setAds(prev => prev.map(a => a.id === id ? { ...a, ...fields } : a));
                        await supabase.from('ads').update(fields).eq('id', id);
                        queryClient.invalidateQueries({ queryKey: ['ads'] });
                    }}
                    onAddNews={(n) => setNews(prev => [n, ...prev])}
                />
            )}

            {user.managedShopId && (
                <MerchantDashboard
                    isOpen={isMerchantDashboardOpen}
                    onClose={() => setIsMerchantDashboardOpen(false)}
                    shop={[...shops, ...cafes, ...gyms, ...beautyShops].find(s => s.id === user.managedShopId) || shops[0]}
                    onUpdateShop={(updated) => {
                        setShops(prev => prev.map(s => s.id === updated.id ? updated : s));
                        setCafes(prev => prev.map(c => c.id === updated.id ? updated : c));
                        setGyms(prev => prev.map(g => g.id === updated.id ? updated : g));
                        setBeautyShops(prev => prev.map(b => b.id === updated.id ? updated : b));
                    }}
                    movies={user.managedShopId === 'cinema1' ? movies : undefined}
                    onUpdateMovies={user.managedShopId === 'cinema1' ? setMovies : undefined}
                />
            )}

        </div>
    );
};

export default App;
