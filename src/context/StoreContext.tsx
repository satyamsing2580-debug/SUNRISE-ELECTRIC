import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import { 
  db, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch 
} from '../firebase';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  OrderStatus, 
  FilterState, 
  ShippingAddress,
  Coupon,
  AppSettings
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialProducts';
import { useAuth } from './AuthContext';
import { startContinuousOrderAlarm, stopContinuousOrderAlarm, isAlarmActive, playOrderNotificationSound } from '../utils/audio';

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coupon-sunrise10',
    code: 'SUNRISE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 1000,
    isActive: true,
    description: '10% OFF on modular switches, lighting & wires above ₹999'
  },
  {
    id: 'coupon-gopalganj15',
    code: 'GOPALGANJ15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 1999,
    maxDiscount: 2500,
    isActive: true,
    description: '15% Regional Contractor Discount for Gopalganj, Bihar projects'
  },
  {
    id: 'coupon-first500',
    code: 'FIRST500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 2499,
    isActive: true,
    description: 'Flat ₹500 Instant Discount on orders over ₹2,499'
  }
];

export const DEFAULT_APP_SETTINGS: AppSettings = {
  storeName: 'Sunrise Electricals',
  ownerName: 'Ashish Singh',
  storeAddress: 'LAKHAPATIYA MORE, GOPALGANJ',
  contactPhone: '+91 7488623614',
  whatsappNumber: '917488623614',
  supportEmail: 'sales@sunriseelectricals.com',
  freeDeliveryThreshold: 1999,
  deliveryFee: 99,
  gstRate: 0.18,
  announcementText: 'Authorized Electrical Showroom • LAKHAPATIYA MORE, GOPALGANJ • Owner: Ashish Singh • Call/WhatsApp: +91 7488623614',
  isStoreOpen: true
};

interface StoreContextType {
  products: Product[];
  loadingProducts: boolean;
  categories: Category[];
  loadingCategories: boolean;
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  taxGst: number;
  shippingFee: number;
  discountAmount: number;
  couponCode: string;
  appliedCoupon: string | null;
  total: number;
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Filters & Search
  filters: FilterState;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Orders & Realtime Tracking & Sound Notification
  orders: Order[];
  loadingOrders: boolean;
  orderGroupFilter: string;
  setOrderGroupFilter: (group: string) => void;
  orderAdminFilter: string;
  setOrderAdminFilter: (admin: string) => void;
  placeOrder: (shippingAddress: ShippingAddress, paymentMethod: 'upi' | 'card' | 'cod', customGroupId?: string) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  
  // Sound Alerts & Continuous High-Volume Alarm
  soundAlertEnabled: boolean;
  setSoundAlertEnabled: (enabled: boolean) => void;
  testSoundAlert: () => void;
  newOrderAlert: Order | null;
  clearNewOrderAlert: () => void;
  isOrderAlarmActive: boolean;
  acknowledgeOrderAlarm: () => void;
  triggerTestAlarm: () => void;

  // Product Full CRUD
  addProduct: (product: Omit<Product, 'id'>) => Promise<string>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetToInitialCatalog: () => Promise<void>;

  // Category Full CRUD
  addCategory: (category: Omit<Category, 'id'>) => Promise<string>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Coupons & App Control
  coupons: Coupon[];
  loadingCoupons: boolean;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<string>;
  updateCoupon: (id: string, updates: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  appSettings: AppSettings;
  updateAppSettings: (updates: Partial<AppSettings>) => Promise<void>;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // View state & modals
  currentView: 'home' | 'catalog' | 'orders' | 'admin' | 'wishlist' | 'checkout';
  setCurrentView: (view: 'home' | 'catalog' | 'orders' | 'admin' | 'wishlist' | 'checkout') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  isContactModalOpen: boolean;
  setIsContactModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialFilters: FilterState = {
  category: 'All',
  brands: [],
  minPrice: 0,
  maxPrice: 25000,
  inStockOnly: false,
  minRating: 0,
  searchQuery: '',
  sortBy: 'featured'
};

export const deduplicateProducts = (prods: Product[]): Product[] => {
  const seen = new Set<string>();
  const result: Product[] = [];
  for (let i = 0; i < prods.length; i++) {
    const p = prods[i];
    if (!p) continue;
    let id = p.id;
    if (!id || seen.has(id)) {
      id = `${id || 'prod'}-${i}-${Math.random().toString(36).substring(2, 7)}`;
    }
    seen.add(id);
    result.push({ ...p, id });
  }
  return result;
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, userProfile, isAdmin } = useAuth();
  
  const [products, setProducts] = useState<Product[]>(() => deduplicateProducts(INITIAL_PRODUCTS));
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  // Real-time Firestore sync for Coupons & App Settings
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [loadingCoupons, setLoadingCoupons] = useState<boolean>(true);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('sunrise_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sunrise_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'orders' | 'admin' | 'wishlist' | 'checkout'>('home');
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Orders & Sound
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(true);
  const [orderGroupFilter, setOrderGroupFilter] = useState<string>('all');
  const [orderAdminFilter, setOrderAdminFilter] = useState<string>('all');
  const [soundAlertEnabled, setSoundAlertEnabled] = useState<boolean>(true);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  const [isOrderAlarmActive, setIsOrderAlarmActive] = useState<boolean>(false);
  const initialOrdersLoadedRef = useRef(false);
  const previousOrdersCountRef = useRef(0);

  const acknowledgeOrderAlarm = () => {
    stopContinuousOrderAlarm();
    setIsOrderAlarmActive(false);
    setNewOrderAlert(null);
  };

  const triggerTestAlarm = () => {
    setIsOrderAlarmActive(true);
    startContinuousOrderAlarm();
  };

  // Save cart & wishlist
  useEffect(() => {
    try {
      localStorage.setItem('sunrise_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('LocalStorage notice:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('sunrise_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('LocalStorage notice:', e);
    }
  }, [wishlist]);

  // Real-time Firestore sync for Products
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      const prodCol = collection(db, 'products');
      unsubscribe = onSnapshot(
        prodCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const map = new Map<string, Product>();
            snapshot.forEach((d) => {
              const data = d.data();
              const prodId = d.id;
              if (!map.has(prodId)) {
                map.set(prodId, { ...data, id: prodId } as Product);
              }
            });
            setProducts(Array.from(map.values()));
          } else {
            // Auto-seed initial catalog to Firestore so all devices share global real-time catalog
            const deduplicated = deduplicateProducts(INITIAL_PRODUCTS);
            setProducts(deduplicated);
            deduplicated.forEach(async (p) => {
              try {
                await setDoc(doc(db, 'products', p.id), p);
              } catch (e) {
                console.warn('Product auto-seed notice:', e);
              }
            });
          }
          setLoadingProducts(false);
        },
        (err) => {
          console.warn('Products Firestore snapshot fallback:', err);
          setProducts(deduplicateProducts(INITIAL_PRODUCTS));
          setLoadingProducts(false);
        }
      );
    } catch (err) {
      console.warn('Products sync catch:', err);
      setProducts(deduplicateProducts(INITIAL_PRODUCTS));
      setLoadingProducts(false);
    }

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Categories
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      const catCol = collection(db, 'categories');
      unsubscribe = onSnapshot(
        catCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const map = new Map<string, Category>();
            snapshot.forEach((d) => {
              const data = d.data();
              const catId = d.id;
              if (!map.has(catId)) {
                map.set(catId, { ...data, id: catId } as Category);
              }
            });
            setCategories(Array.from(map.values()));
          } else {
            setCategories(INITIAL_CATEGORIES);
            INITIAL_CATEGORIES.forEach(async (c) => {
              try {
                await setDoc(doc(db, 'categories', c.id), c);
              } catch (e) {
                console.warn('Category auto-seed notice:', e);
              }
            });
          }
          setLoadingCategories(false);
        },
        (err) => {
          console.warn('Categories snapshot fallback:', err);
          setCategories(INITIAL_CATEGORIES);
          setLoadingCategories(false);
        }
      );
    } catch (err) {
      setCategories(INITIAL_CATEGORIES);
      setLoadingCategories(false);
    }

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Coupons
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      const couponCol = collection(db, 'coupons');
      unsubscribe = onSnapshot(
        couponCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const map = new Map<string, Coupon>();
            snapshot.forEach((d) => {
              const data = d.data();
              const cId = d.id;
              if (!map.has(cId)) {
                map.set(cId, { ...data, id: cId } as Coupon);
              }
            });
            setCoupons(Array.from(map.values()));
          } else {
            // Seed initial coupons to Firestore
            setCoupons(INITIAL_COUPONS);
            INITIAL_COUPONS.forEach(async (c) => {
              try {
                await setDoc(doc(db, 'coupons', c.id), c);
              } catch (e) {
                console.warn('Coupon seed notice:', e);
              }
            });
          }
          setLoadingCoupons(false);
        },
        (err) => {
          console.warn('Coupons snapshot fallback:', err);
          setCoupons(INITIAL_COUPONS);
          setLoadingCoupons(false);
        }
      );
    } catch (err) {
      setCoupons(INITIAL_COUPONS);
      setLoadingCoupons(false);
    }

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for App Settings
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      const settingsDocRef = doc(db, 'settings', 'general');
      unsubscribe = onSnapshot(
        settingsDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setAppSettings({
              ...DEFAULT_APP_SETTINGS,
              ...(snapshot.data() as Partial<AppSettings>)
            });
          } else {
            setAppSettings(DEFAULT_APP_SETTINGS);
            setDoc(settingsDocRef, DEFAULT_APP_SETTINGS).catch((e) =>
              console.warn('Settings init notice:', e)
            );
          }
        },
        (err) => {
          console.warn('Settings snapshot notice:', err);
          setAppSettings(DEFAULT_APP_SETTINGS);
        }
      );
    } catch (err) {
      setAppSettings(DEFAULT_APP_SETTINGS);
    }

    return () => unsubscribe();
  }, []);

  // Real-time Firestore sync for Orders + Audio Notification for incoming orders!
  useEffect(() => {
    let unsubscribe: () => void = () => {};

    try {
      const orderCol = collection(db, 'orders');
      unsubscribe = onSnapshot(
        orderCol,
        (snapshot) => {
          const map = new Map<string, Order>();
          snapshot.forEach((d) => {
            const data = d.data();
            const orderId = d.id;
            if (!map.has(orderId)) {
              map.set(orderId, { ...data, id: orderId } as Order);
            }
          });
          const loaded = Array.from(map.values());
          // Sort newest first
          loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          // Check if a new order arrived after initial load!
          if (initialOrdersLoadedRef.current) {
            if (loaded.length > previousOrdersCountRef.current) {
              const newestOrder = loaded[0];
              setNewOrderAlert(newestOrder);
              setIsOrderAlarmActive(true);
              if (soundAlertEnabled) {
                startContinuousOrderAlarm();
              }
            }
          } else {
            initialOrdersLoadedRef.current = true;
          }

          previousOrdersCountRef.current = loaded.length;
          setOrders(loaded);
          setLoadingOrders(false);
        },
        (err) => {
          console.warn('Orders sync notice:', err);
          setLoadingOrders(false);
        }
      );
    } catch (err) {
      console.warn('Orders setup error:', err);
      setLoadingOrders(false);
    }

    return () => unsubscribe();
  }, [soundAlertEnabled]);

  const testSoundAlert = () => {
    playOrderNotificationSound();
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: Math.min(product.stockCount || 99, next[existingIndex].quantity + quantity)
        };
        return next;
      }
      return [...prev, { product, quantity, selectedColor }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const taxGst = useMemo(() => {
    const rate = appSettings.gstRate || 0.18;
    return Math.round(subtotal * rate);
  }, [subtotal, appSettings.gstRate]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    const threshold = appSettings.freeDeliveryThreshold ?? 1999;
    return subtotal > threshold ? 0 : (appSettings.deliveryFee ?? 99);
  }, [subtotal, appSettings.freeDeliveryThreshold, appSettings.deliveryFee]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    const matched = coupons.find(
      (c) => c.code.toUpperCase() === appliedCoupon.toUpperCase() && c.isActive
    );
    if (!matched) return 0;
    if (subtotal < matched.minOrderValue) return 0;

    if (matched.discountType === 'percentage') {
      const calc = Math.round((subtotal * matched.discountValue) / 100);
      return matched.maxDiscount ? Math.min(matched.maxDiscount, calc) : calc;
    } else {
      return Math.min(matched.discountValue, subtotal);
    }
  }, [appliedCoupon, coupons, subtotal]);

  const total = useMemo(() => {
    return Math.max(0, subtotal + taxGst + shippingFee - discountAmount);
  }, [subtotal, taxGst, shippingFee, discountAmount]);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const matched = coupons.find(
      (c) => c.code.toUpperCase() === clean && c.isActive
    );
    if (!matched) {
      return { success: false, message: 'Invalid or inactive promo code.' };
    }
    if (subtotal < matched.minOrderValue) {
      return {
        success: false,
        message: `Coupon ${clean} requires a minimum order value of ₹${matched.minOrderValue.toLocaleString('en-IN')}`
      };
    }
    setAppliedCoupon(clean);
    return {
      success: true,
      message: `Coupon ${clean} applied! (${
        matched.discountType === 'percentage'
          ? `${matched.discountValue}% OFF`
          : `₹${matched.discountValue} OFF`
      })`
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Filters
  const setFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredProducts = useMemo(() => {
    const unique = deduplicateProducts(products);
    return unique.filter((p) => {
      if (filters.category !== 'All' && p.category !== filters.category) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (p.price < filters.minPrice || p.price > filters.maxPrice) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      if (filters.minRating > 0 && p.rating < filters.minRating) return false;
      if (filters.searchQuery.trim() !== '') {
        const query = filters.searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCategory = p.category.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCategory && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-low') return a.price - b.price;
      if (filters.sortBy === 'price-high') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, filters]);

  // Order Placement
  const placeOrder = async (
    shippingAddress: ShippingAddress, 
    paymentMethod: 'upi' | 'card' | 'cod',
    customGroupId?: string
  ): Promise<Order> => {
    if (cart.length === 0) throw new Error('Your cart is empty.');

    const orderNumber = `SUN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    // Determine group ID (branch / contractor division) and assign admin
    const defaultGroup = shippingAddress.city?.toLowerCase().includes('gopalganj')
      ? 'gopalganj-store'
      : 'bihar-contractors';

    const orderData: Order = {
      id: '',
      orderNumber,
      userId: currentUser?.uid || userProfile?.uid || 'guest-user',
      groupId: customGroupId || defaultGroup,
      adminId: 'satyamsing2580@gmail.com',
      customerName: shippingAddress.fullName,
      customerEmail: currentUser?.email || userProfile?.email || 'customer@sunriseelectricals.com',
      customerPhone: shippingAddress.phone,
      shippingAddress,
      items: cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        selectedColor: item.selectedColor
      })),
      subtotal,
      taxGst,
      shippingFee,
      discountAmount,
      couponCode: appliedCoupon || undefined,
      totalAmount: total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'completed',
      paymentDetails: {
        transactionId: paymentMethod !== 'cod' ? `TXN_${Date.now()}` : undefined,
        paidAt: paymentMethod !== 'cod' ? now : undefined
      },
      orderStatus: 'placed',
      trackingUpdates: [
        {
          status: 'placed',
          title: 'Order Placed by Customer',
          description: 'Verified customer details and registered order in Firestore database.',
          timestamp: now,
          location: 'Sunrise Electricals Central Hub'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      orderData.id = docRef.id;

      // Update product inventory in Firestore
      for (const item of cart) {
        try {
          const prodRef = doc(db, 'products', item.product.id);
          const currentProd = products.find((p) => p.id === item.product.id);
          if (currentProd) {
            const nextStock = Math.max(0, currentProd.stockCount - item.quantity);
            await updateDoc(prodRef, {
              stockCount: nextStock,
              inStock: nextStock > 0,
              updatedAt: now
            });
          }
        } catch (stockErr) {
          console.warn('Stock update notice:', stockErr);
        }
      }

      clearCart();
      return orderData;
    } catch (err: any) {
      console.warn('Firestore order write error (local fallback):', err);
      orderData.id = `local-${Date.now()}`;
      setOrders((prev) => [orderData, ...prev]);
      clearCart();
      return orderData;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    const statusLabels: Record<OrderStatus, { title: string; desc: string }> = {
      placed: { title: 'Order Placed', desc: 'Order received by the store.' },
      confirmed: { title: 'Order Confirmed', desc: 'Verified and packed at the dispatch facility.' },
      dispatched: { title: 'Dispatched via Express Courier', desc: 'Handed over to delivery logistics team.' },
      out_for_delivery: { title: 'Out For Delivery', desc: 'Delivery executive is on the way to your address.' },
      delivered: { title: 'Delivered Successfully', desc: 'Package safely delivered and signed.' },
      cancelled: { title: 'Order Cancelled', desc: note || 'Order was cancelled.' }
    };

    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const newUpdate = {
      status: newStatus,
      title: statusLabels[newStatus].title,
      description: note || statusLabels[newStatus].desc,
      timestamp: new Date().toISOString(),
      location: 'Sunrise Electricals Hub, LAKHAPATIYA MORE, GOPALGANJ'
    };

    const updatedTracking = [...(targetOrder.trackingUpdates || []), newUpdate];

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        orderStatus: newStatus,
        trackingUpdates: updatedTracking,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, orderStatus: newStatus, trackingUpdates: updatedTracking }
            : o
        )
      );
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (err) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    }
  };

  // Product Full CRUD
  const addProduct = async (productData: Omit<Product, 'id'>): Promise<string> => {
    const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'products', id), newProduct);
    } catch (err) {
      setProducts((prev) => deduplicateProducts([newProduct, ...prev]));
    }
    return id;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const prodRef = doc(db, 'products', id);
      await updateDoc(prodRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const resetToInitialCatalog = async () => {
    setLoadingProducts(true);
    try {
      const batch = writeBatch(db);
      for (const p of INITIAL_PRODUCTS) {
        batch.set(doc(db, 'products', p.id), {
          ...p,
          updatedAt: new Date().toISOString()
        });
      }
      await batch.commit();
      setProducts(INITIAL_PRODUCTS);
    } catch (err) {
      setProducts(INITIAL_PRODUCTS);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Category Full CRUD
  const addCategory = async (catData: Omit<Category, 'id'>): Promise<string> => {
    const id = `cat-${Date.now()}`;
    const newCat: Category = { ...catData, id };
    try {
      await setDoc(doc(db, 'categories', id), newCat);
    } catch (err) {
      setCategories((prev) => [...prev, newCat]);
    }
    return id;
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      await updateDoc(doc(db, 'categories', id), updates);
    } catch (err) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
      );
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (err) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Coupons CRUD
  const addCoupon = async (couponData: Omit<Coupon, 'id'>): Promise<string> => {
    const id = `coupon-${Date.now()}`;
    const newCoupon: Coupon = {
      ...couponData,
      id,
      code: couponData.code.trim().toUpperCase(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'coupons', id), newCoupon);
    } catch (err) {
      setCoupons((prev) => [newCoupon, ...prev]);
    }
    return id;
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    const payload = {
      ...updates,
      ...(updates.code ? { code: updates.code.trim().toUpperCase() } : {}),
      updatedAt: new Date().toISOString()
    };
    try {
      await updateDoc(doc(db, 'coupons', id), payload);
    } catch (err) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...payload } : c))
      );
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch (err) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // App Settings Update
  const updateAppSettings = async (updates: Partial<AppSettings>) => {
    const next = { ...appSettings, ...updates };
    setAppSettings(next);
    try {
      await setDoc(doc(db, 'settings', 'general'), next, { merge: true });
    } catch (err) {
      console.warn('Settings write notice:', err);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        loadingProducts,
        categories,
        loadingCategories,
        cart,
        cartCount,
        subtotal,
        taxGst,
        shippingFee,
        discountAmount,
        couponCode: appliedCoupon || '',
        appliedCoupon,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
        filters,
        setFilter,
        resetFilters,
        filteredProducts,
        orders,
        loadingOrders,
        orderGroupFilter,
        setOrderGroupFilter,
        orderAdminFilter,
        setOrderAdminFilter,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        soundAlertEnabled,
        setSoundAlertEnabled,
        testSoundAlert,
        newOrderAlert,
        clearNewOrderAlert: acknowledgeOrderAlarm,
        isOrderAlarmActive,
        acknowledgeOrderAlarm,
        triggerTestAlarm,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToInitialCatalog,
        addCategory,
        updateCategory,
        deleteCategory,
        coupons,
        loadingCoupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        appSettings,
        updateAppSettings,
        wishlist,
        toggleWishlist,
        isInWishlist,
        currentView,
        setCurrentView,
        selectedProduct,
        setSelectedProduct,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        isContactModalOpen,
        setIsContactModalOpen
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
