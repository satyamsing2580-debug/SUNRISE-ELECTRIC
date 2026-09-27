import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Truck, 
  Database, 
  Cloud, 
  ShieldCheck, 
  Search, 
  X,
  Upload,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Layers,
  Phone,
  Calendar,
  ExternalLink,
  ChevronDown,
  Ticket,
  Tag,
  Settings,
  Sliders,
  Check,
  ToggleLeft,
  ToggleRight,
  Percent,
  Camera,
  Image as ImageIcon,
  BellRing
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Product, Order, OrderStatus, Category, Coupon, AppSettings } from '../types';
import { storage, ref, uploadBytesResumable, getDownloadURL } from '../firebase';
import { ELECTRICAL_BRANDS } from '../data/initialProducts';

export const AdminDashboard: React.FC = () => {
  const { 
    products, 
    orders, 
    categories,
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetToInitialCatalog, 
    updateOrderStatus,
    deleteOrder,
    addCategory,
    updateCategory,
    deleteCategory,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    appSettings,
    updateAppSettings,
    soundAlertEnabled,
    setSoundAlertEnabled,
    testSoundAlert,
    newOrderAlert,
    clearNewOrderAlert,
    isOrderAlarmActive,
    acknowledgeOrderAlarm,
    triggerTestAlarm,
    orderGroupFilter,
    setOrderGroupFilter,
    orderAdminFilter,
    setOrderAdminFilter
  } = useStore();
  
  const { userProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'categories' | 'coupons' | 'system'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchTerm, setOrderSearchTerm] = useState<string>('');
  
  // Coupon Modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [cCode, setCCode] = useState('');
  const [cType, setCType] = useState<'percentage' | 'fixed'>('percentage');
  const [cValue, setCValue] = useState(10);
  const [cMinOrder, setCMinOrder] = useState(999);
  const [cMaxDiscount, setCMaxDiscount] = useState<number | undefined>(1000);
  const [cIsActive, setCIsActive] = useState(true);
  const [cDescription, setCDescription] = useState('');

  // Settings state
  const [settingsForm, setSettingsForm] = useState<AppSettings>(appSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setSettingsForm(appSettings);
  }, [appSettings]);
  
  // Product Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Preset Genuine Electrical Products Imagery for quick testing
  const PRESET_ELECTRICAL_PHOTOS = [
    { label: 'Havells Switch', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
    { label: 'Copper Wire', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80' },
    { label: 'LED Track Light', url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80' },
    { label: 'BLDC Fan', url: 'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=800&q=80' }
  ];

  // Product form fields
  const [pName, setPName] = useState('');
  const [pBrand, setPBrand] = useState('Havells');
  const [pCategory, setPCategory] = useState(categories[0]?.name || 'Modular Switches & Plates');
  const [pPrice, setPPrice] = useState(1500);
  const [pOriginalPrice, setPOriginalPrice] = useState(1800);
  const [pStock, setPStock] = useState(50);
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80');
  const [pDescription, setPDescription] = useState('');
  const [pVoltage, setPVoltage] = useState('220V - 250V AC');
  const [pWarranty, setPWarranty] = useState('5 Years Warranty');

  // Category Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catImage, setCatImage] = useState('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80');
  const [catBadge, setCatBadge] = useState('New');

  // Inline Quick Edits
  const [inlinePrice, setInlinePrice] = useState<{ [id: string]: number }>({});
  const [inlineStock, setInlineStock] = useState<{ [id: string]: number }>({});

  // Summary Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'placed' || o.orderStatus === 'confirmed').length;
  const lowStockCount = products.filter((p) => p.stockCount < 20).length;

  const handleInlineSave = async (product: Product) => {
    const newPrice = inlinePrice[product.id] !== undefined ? inlinePrice[product.id] : product.price;
    const newStock = inlineStock[product.id] !== undefined ? inlineStock[product.id] : product.stockCount;
    
    await updateProduct(product.id, {
      price: newPrice,
      stockCount: newStock,
      inStock: newStock > 0
    });
    alert(`Saved ${product.name}: ₹${newPrice} | Stock: ${newStock}`);
  };

  /**
   * Resilient, high-performance image compression using HTML5 Canvas.
   * Scales high-res camera photos (12MP-48MP) down to max 720px, fills white background,
   * and encodes to 0.80 JPEG (~30KB-45KB).
   * 100% reliable across Android, iPhone, Median/Web2App wrappers and desktop.
   */
  const processImageFile = (file: File): Promise<{ dataUrl: string; blob?: Blob; sizeKb: number }> => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;
          const maxDim = 720;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Canvas context unavailable'));
            return;
          }

          // Fill white background so transparent PNGs don't become black
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.80);
          const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

          canvas.toBlob(
            (blob) => {
              URL.revokeObjectURL(objectUrl);
              resolve({ dataUrl, blob: blob || undefined, sizeKb });
            },
            'image/jpeg',
            0.80
          );
        } catch (err) {
          URL.revokeObjectURL(objectUrl);
          reject(err);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        // Fallback to FileReader if ObjectURL failed
        const reader = new FileReader();
        reader.onload = () => {
          const raw = reader.result as string;
          resolve({ dataUrl: raw, sizeKb: Math.round((raw.length * 3) / 4 / 1024) });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      };

      img.src = objectUrl;
    });
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setUploadStatus('Compressing & optimizing photo...');

    try {
      // 1. Process and compress image for instant mobile display (< 45KB)
      const { dataUrl, blob, sizeKb } = await processImageFile(file);

      // 2. Immediately set the image so preview renders instantaneously
      setPImage(dataUrl);
      setUploadStatus(`Photo Ready & Compressed (~${sizeKb} KB)`);

      // 3. Attempt background Firebase Storage upload safely
      if (blob) {
        try {
          const storageFileName = `products/prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;
          const fileRef = ref(storage, storageFileName);
          
          // Timeout promise so slow connections don't block
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Storage timeout')), 4000)
          );
          
          const uploadPromise = (async () => {
            const uploadTask = await uploadBytesResumable(fileRef, blob, { contentType: 'image/jpeg' });
            return await getDownloadURL(uploadTask.ref);
          })();

          const downloadUrl = (await Promise.race([uploadPromise, timeoutPromise])) as string;
          if (downloadUrl) {
            setPImage(downloadUrl);
            setUploadStatus('Uploaded to Cloud Storage (Global CDN)');
          }
        } catch {
          // Gracefully keep optimized base64 for Firestore catalog
          setUploadStatus(`Saved as Mobile-Optimized Photo (~${sizeKb} KB)`);
        }
      }
    } catch (err) {
      console.warn('Image processing fallback:', err);
      setUploadStatus('Photo loaded with standard fallback');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName.trim()) {
      alert('Product name is required.');
      return;
    }

    const discountPercent = pOriginalPrice > pPrice 
      ? Math.round(((pOriginalPrice - pPrice) / pOriginalPrice) * 100) 
      : 0;

    const payload = {
      name: pName.trim(),
      brand: pBrand,
      category: pCategory,
      price: Number(pPrice),
      originalPrice: Number(pOriginalPrice),
      discountPercent,
      rating: 4.9,
      reviewCount: 1,
      inStock: Number(pStock) > 0,
      stockCount: Number(pStock),
      isFeatured: true,
      image: pImage,
      description: pDescription || 'Genuine ISI certified electrical hardware from authorized distributor.',
      features: [
        'ISI / CE certified laboratory tested',
        'Silver cadmium alloy contacts',
        'Flame retardant polymer shell'
      ],
      specs: {
        voltage: pVoltage,
        warranty: pWarranty,
        certification: 'ISI Mark / CE Approved'
      }
    };

    if (editingProductId) {
      await updateProduct(editingProductId, payload);
      alert('Product updated successfully in Firestore!');
    } else {
      await addProduct(payload);
      alert('New product saved to Firestore catalog!');
    }

    setIsProductModalOpen(false);
    setEditingProductId(null);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setPName(p.name);
    setPBrand(p.brand);
    setPCategory(p.category);
    setPPrice(p.price);
    setPOriginalPrice(p.originalPrice);
    setPStock(p.stockCount);
    setPImage(p.image);
    setPDescription(p.description);
    setPVoltage(p.specs?.voltage || '220V AC');
    setPWarranty(p.specs?.warranty || '5 Years Warranty');
    setIsProductModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const payload = {
      name: catName.trim(),
      slug: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: catDescription || 'Electrical supplies and installations.',
      iconName: 'Zap',
      image: catImage,
      badge: catBadge || undefined
    };

    if (editingCategoryId) {
      await updateCategory(editingCategoryId, payload);
      alert('Category updated in Firestore!');
    } else {
      await addCategory(payload);
      alert('New category added to Firestore!');
    }

    setIsCategoryModalOpen(false);
    setEditingCategoryId(null);
  };

  const handleOpenEditCategory = (c: Category) => {
    setEditingCategoryId(c.id);
    setCatName(c.name);
    setCatDescription(c.description);
    setCatImage(c.image);
    setCatBadge(c.badge || '');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCoupon = (c: Coupon) => {
    setEditingCouponId(c.id);
    setCCode(c.code);
    setCType(c.discountType);
    setCValue(c.discountValue);
    setCMinOrder(c.minOrderValue);
    setCMaxDiscount(c.maxDiscount);
    setCIsActive(c.isActive);
    setCDescription(c.description || '');
    setIsCouponModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode.trim()) {
      alert('Coupon code is required.');
      return;
    }

    const payload = {
      code: cCode.trim().toUpperCase(),
      discountType: cType,
      discountValue: Number(cValue),
      minOrderValue: Number(cMinOrder),
      maxDiscount: cType === 'percentage' && cMaxDiscount ? Number(cMaxDiscount) : undefined,
      isActive: cIsActive,
      description: cDescription.trim() || undefined
    };

    if (editingCouponId) {
      await updateCoupon(editingCouponId, payload);
    } else {
      await addCoupon(payload);
    }

    setIsCouponModalOpen(false);
    setEditingCouponId(null);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateAppSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const filteredInventory = products.filter((p) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term)
    );
  });

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'all' && o.orderStatus !== orderStatusFilter) return false;
    if (orderGroupFilter !== 'all' && (o.groupId || 'gopalganj-store') !== orderGroupFilter) return false;
    if (orderAdminFilter !== 'all' && (o.adminId || 'satyamsing2580@gmail.com') !== orderAdminFilter) return false;
    if (orderSearchTerm.trim() !== '') {
      const q = orderSearchTerm.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.toLowerCase().includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-800">
      
      {/* Continuous High-Volume Order Alarm Banner */}
      {(isOrderAlarmActive || newOrderAlert) && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-2xl border-2 border-red-300 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-full bg-white text-red-600 flex items-center justify-center font-bold flex-shrink-0 animate-bounce">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-sm uppercase tracking-wider flex items-center">
                <span>🚨 CONTINUOUS LOUD ALARM RINGING!</span>
                {newOrderAlert && (
                  <span className="ml-2 font-mono bg-white text-red-700 px-2 py-0.5 rounded text-xs font-black">
                    {newOrderAlert.orderNumber}
                  </span>
                )}
              </p>
              <p className="text-xs font-bold text-red-100 mt-0.5">
                {newOrderAlert 
                  ? `Customer: ${newOrderAlert.customerName} • Total: ₹${newOrderAlert.totalAmount?.toLocaleString('en-IN')} (${newOrderAlert.items?.length || 0} items)`
                  : 'New customer order registered in Firestore. Click below to acknowledge.'}
              </p>
            </div>
          </div>

          {/* Primary Action Button: "I KNOW ORDER" */}
          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setActiveTab('orders');
                acknowledgeOrderAlarm();
              }}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-100 text-red-700 rounded-xl text-sm font-black uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2 border-2 border-red-200"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>I KNOW ORDER (STOP ALARM)</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Header with Audio Alert Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-700 border border-amber-300">
              <LayoutDashboard className="w-6 h-6" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Super Admin Control Center
            </h1>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Owner: Ashish Singh • LAKHAPATIYA MORE, GOPALGANJ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Firestore sync • Continuous High-Attention Audio Alarm • Dynamic Coupons & App Configuration.
          </p>
        </div>

        {/* Audio Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Order Sound Alert Toggle */}
          <button
            onClick={() => {
              if (soundAlertEnabled && isOrderAlarmActive) {
                acknowledgeOrderAlarm();
              }
              setSoundAlertEnabled(!soundAlertEnabled);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              soundAlertEnabled 
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm' 
                : 'bg-slate-100 border-slate-300 text-slate-500'
            }`}
            title="Toggle loud audio alarm on incoming orders"
          >
            {soundAlertEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Alarm Sound: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Alarm Sound: MUTED</span>
              </>
            )}
          </button>

          {/* Test Loud Order Alarm Button */}
          <button
            onClick={triggerTestAlarm}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 active:scale-95"
            title="Test the continuous looping loud alarm"
          >
            <span>🚨 Test Loud Alarm</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset catalog to 12 curated electrical products in Firestore?')) {
                resetToInitialCatalog();
              }
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center space-x-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Store</span>
          </button>
        </div>
      </div>

      {/* CONTINUOUS LOUD ALARM ALERT BANNER (rings until "I KNOW ORDER" is clicked) */}
      {isOrderAlarmActive && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-2xl border-4 border-red-300 animate-pulse flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0 animate-bounce">
              <BellRing className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white text-red-700 px-2.5 py-0.5 rounded-full shadow-sm">
                🚨 CONTINUOUS LOUD ALARM ACTIVE
              </span>
              <h2 className="text-base sm:text-lg font-black mt-1">
                New Order Received! Siren Ringing Continuously
              </h2>
              <p className="text-xs text-red-100">
                {newOrderAlert 
                  ? `Order ${newOrderAlert.orderNumber} • ${newOrderAlert.customerName} • ₹${newOrderAlert.totalAmount?.toLocaleString('en-IN')}`
                  : 'A customer has just placed a new order in Firestore!'}
              </p>
            </div>
          </div>
          <button
            onClick={acknowledgeOrderAlarm}
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-red-50 text-red-700 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xl active:scale-95 transition-all flex items-center justify-center space-x-2 border-2 border-white cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>I KNOW ORDER (STOP ALARM)</span>
          </button>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Total Sales Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-bold">Live across {orders.length} orders</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Incoming / Pending Orders</span>
            <ShoppingBag className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600">{pendingOrders}</p>
          <p className="text-[11px] text-slate-500">Awaiting dispatch or verification</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Catalog Components</span>
            <Package className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{products.length}</p>
          <p className="text-[11px] text-slate-500">In {categories.length} store categories</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="flex justify-between items-center text-slate-500 text-xs font-bold">
            <span>Low Inventory Alert</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-black text-rose-600">{lowStockCount}</p>
          <p className="text-[11px] text-slate-500">Items with &lt; 20 units in stock</p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 text-xs font-extrabold transition-all border-b-2 ${
            activeTab === 'orders'
              ? 'border-amber-500 text-amber-700 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Customer Orders Pipeline ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 text-xs font-extrabold transition-all border-b-2 ${
            activeTab === 'inventory'
              ? 'border-amber-500 text-amber-700 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Products CRUD ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 text-xs font-extrabold transition-all border-b-2 ${
            activeTab === 'categories'
              ? 'border-amber-500 text-amber-700 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Categories CRUD ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab('coupons')}
          className={`px-4 py-2.5 text-xs font-extrabold transition-all border-b-2 flex items-center space-x-1.5 ${
            activeTab === 'coupons'
              ? 'border-amber-500 text-amber-700 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Coupons & App Control ({coupons.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2.5 text-xs font-extrabold transition-all border-b-2 ${
            activeTab === 'system'
              ? 'border-amber-500 text-amber-700 bg-amber-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Firebase Cloud Status
        </button>
      </div>

      {/* TAB 1: Orders Pipeline with Live Status Changer & Group/Admin Filtering */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Real-time Firestore Live Indicator & Stats */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-xs">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-black text-slate-800">
                Real-Time Firestore Listener Active (onSnapshot)
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full border border-amber-300">
                db: ai-studio-3c45b9c1-e831-4f97-adc5-a6d638d489cd
              </span>
            </div>
            <div className="text-xs font-bold text-amber-900">
              Total Orders: <span className="font-black">{orders.length}</span> | Filtered: <span className="font-black text-amber-700">{filteredOrders.length}</span>
            </div>
          </div>

          {/* Filtering Toolbar: Status, Group, Admin, and Search */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            {/* 1. Status Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Order Status
              </label>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="all">All Statuses ({orders.length})</option>
                <option value="placed">Placed ({orders.filter(o => o.orderStatus === 'placed').length})</option>
                <option value="confirmed">Confirmed ({orders.filter(o => o.orderStatus === 'confirmed').length})</option>
                <option value="dispatched">Dispatched ({orders.filter(o => o.orderStatus === 'dispatched').length})</option>
                <option value="out_for_delivery">Out for Delivery ({orders.filter(o => o.orderStatus === 'out_for_delivery').length})</option>
                <option value="delivered">Delivered ({orders.filter(o => o.orderStatus === 'delivered').length})</option>
                <option value="cancelled">Cancelled ({orders.filter(o => o.orderStatus === 'cancelled').length})</option>
              </select>
            </div>

            {/* 2. Group / Branch Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Store / Group (groupId)
              </label>
              <select
                value={orderGroupFilter}
                onChange={(e) => setOrderGroupFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="all">All Groups & Branches</option>
                <option value="gopalganj-store">Gopalganj Main Branch (gopalganj-store)</option>
                <option value="bihar-contractors">Bihar Regional Contractors (bihar-contractors)</option>
              </select>
            </div>

            {/* 3. Admin / Sales Rep Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Assigned Admin (adminId)
              </label>
              <select
                value={orderAdminFilter}
                onChange={(e) => setOrderAdminFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:border-amber-500 focus:bg-white"
              >
                <option value="all">All Admins</option>
                <option value="satyamsing2580@gmail.com">Owner (satyamsing2580@gmail.com)</option>
                <option value="admin-ashish">Store Manager (admin-ashish)</option>
              </select>
            </div>

            {/* 4. Search Filter */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                Search Customer / Order #
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Order #, name, or phone..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* MOBILE-FIRST VIEW: Native Card Layout on smartphones */}
          <div className="md:hidden space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                No orders match your filter criteria.
              </div>
            ) : (
              filteredOrders.map((ord, idx) => (
                <div 
                  key={`mob-ord-${ord.id || ord.orderNumber}-${idx}`}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-sm text-slate-900">
                        {ord.orderNumber}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className="font-black text-base text-slate-900">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{ord.customerName}</p>
                      <a href={`tel:${ord.customerPhone}`} className="text-amber-700 font-semibold flex items-center space-x-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{ord.customerPhone}</span>
                      </a>
                    </div>
                    <div className="text-right text-[10px] text-slate-500">
                      <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase">
                        {ord.paymentMethod}
                      </span>
                      <p className="mt-1 font-mono text-[9px] text-slate-400">
                        Group: {ord.groupId || 'gopalganj-store'}
                      </p>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="space-y-1 text-xs">
                    {ord.items.map((i, iIdx) => (
                      <div key={`mob-item-${i.productId || iIdx}-${iIdx}`} className="flex justify-between text-slate-700 text-[11px]">
                        <span className="truncate pr-2"><strong className="text-amber-600">{i.quantity}x</strong> {i.name}</span>
                        <span className="font-mono text-slate-500">₹{(i.price * i.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Status Action Controls */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className={`w-full text-xs font-black rounded-xl px-2.5 py-2 border shadow-xs focus:outline-none ${
                          ord.orderStatus === 'delivered'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                            : ord.orderStatus === 'dispatched'
                            ? 'bg-sky-50 border-sky-300 text-sky-800'
                            : ord.orderStatus === 'cancelled'
                            ? 'bg-rose-50 border-rose-300 text-rose-800'
                            : 'bg-amber-50 border-amber-300 text-amber-800'
                        }`}
                      >
                        <option value="placed">Status: Placed</option>
                        <option value="confirmed">Status: Confirmed</option>
                        <option value="dispatched">Status: Dispatched</option>
                        <option value="out_for_delivery">Status: Out For Delivery</option>
                        <option value="delivered">Status: Delivered</option>
                        <option value="cancelled">Status: Cancelled</option>
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete order ${ord.orderNumber}?`)) {
                          deleteOrder(ord.id);
                        }
                      }}
                      className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 rounded-xl"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* DESKTOP VIEW: Complete Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-extrabold">
                <tr>
                  <th className="py-3 px-4">Order Ref & Group</th>
                  <th className="py-3 px-4">Customer Contact</th>
                  <th className="py-3 px-4">Ordered Components</th>
                  <th className="py-3 px-4">Total & Payment</th>
                  <th className="py-3 px-4">Update Status (Firestore)</th>
                  <th className="py-3 px-4 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No orders currently match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord, idx) => (
                    <tr key={`admin-ord-${ord.id || ord.orderNumber}-${idx}`} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-mono font-bold text-slate-900">{ord.orderNumber}</p>
                        <p className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <span className="inline-block mt-1 font-mono text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {ord.groupId || 'gopalganj-store'}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{ord.customerName}</p>
                        <p className="text-[10px] text-amber-700 font-medium">{ord.customerPhone}</p>
                        <p className="text-[10px] text-slate-500 truncate max-w-[140px]">
                          {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                        </p>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          {ord.items.map((i, iIdx) => (
                            <p key={`ord-item-${i.productId || iIdx}-${iIdx}`} className="text-[11px] truncate max-w-[200px] text-slate-800">
                              <span className="font-bold text-amber-600">{i.quantity}x</span> {i.name}
                            </p>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-black text-slate-900">
                          ₹{ord.totalAmount.toLocaleString('en-IN')}
                        </p>
                        <span className="text-[10px] uppercase font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {ord.paymentMethod}
                        </span>
                      </td>

                      {/* Dropdown status update */}
                      <td className="py-3 px-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className={`text-xs font-bold rounded-xl px-2.5 py-1.5 border shadow-sm focus:outline-none ${
                            ord.orderStatus === 'delivered'
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                              : ord.orderStatus === 'dispatched'
                              ? 'bg-sky-50 border-sky-300 text-sky-800'
                              : ord.orderStatus === 'cancelled'
                              ? 'bg-rose-50 border-rose-300 text-rose-800'
                              : 'bg-amber-50 border-amber-300 text-amber-800'
                          }`}
                        >
                          <option value="placed">Placed</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="dispatched">Dispatched</option>
                          <option value="out_for_delivery">Out For Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete order record ${ord.orderNumber}?`)) {
                              deleteOrder(ord.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Product Inventory Full CRUD */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                placeholder="Search products in inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            <button
              onClick={() => {
                setEditingProductId(null);
                setPName('');
                setPBrand('Havells');
                setPCategory(categories[0]?.name || 'Modular Switches & Plates');
                setPPrice(1500);
                setPOriginalPrice(1800);
                setPStock(50);
                setPDescription('');
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-500/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Electrical Product</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-extrabold">
                <tr>
                  <th className="py-3 px-4">Component</th>
                  <th className="py-3 px-4">Brand & Category</th>
                  <th className="py-3 px-4">Price (₹)</th>
                  <th className="py-3 px-4">Stock Units</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInventory.map((prod, idx) => (
                  <tr key={`admin-prod-${prod.id}-${idx}`} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                        />
                        <div className="max-w-xs truncate">
                          <p className="font-bold text-slate-900 truncate">{prod.name}</p>
                          <p className="text-[10px] text-slate-400">{prod.specs?.voltage || 'Certified'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-extrabold text-amber-700">{prod.brand}</span>
                      <p className="text-[10px] text-slate-500 truncate max-w-[130px]">{prod.category}</p>
                    </td>

                    {/* Inline Price edit */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-slate-400">₹</span>
                        <input
                          type="number"
                          defaultValue={prod.price}
                          onChange={(e) =>
                            setInlinePrice((prev) => ({
                              ...prev,
                              [prod.id]: Number(e.target.value)
                            }))
                          }
                          className="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-bold"
                        />
                      </div>
                    </td>

                    {/* Inline Stock edit */}
                    <td className="py-3 px-4">
                      <input
                        type="number"
                        defaultValue={prod.stockCount}
                        onChange={(e) =>
                          setInlineStock((prev) => ({
                            ...prev,
                            [prod.id]: Number(e.target.value)
                          }))
                        }
                        className="w-16 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-900 font-bold"
                      />
                    </td>

                    <td className="py-3 px-4">
                      {prod.stockCount > 0 ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          In Stock ({prod.stockCount})
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Out of Stock
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleInlineSave(prod)}
                          title="Save Changes to Firestore"
                          className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors border border-amber-200"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          title="Full Edit"
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${prod.name} from catalog?`)) {
                              deleteProduct(prod.id);
                            }
                          }}
                          title="Delete Product"
                          className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Category Full CRUD */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Manage Store Categories</h3>
              <p className="text-xs text-slate-500">Add, rename, or re-organize electrical product departments.</p>
            </div>
            <button
              onClick={() => {
                setEditingCategoryId(null);
                setCatName('');
                setCatDescription('');
                setCatImage('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80');
                setCatBadge('Trending');
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c, idx) => {
              const count = products.filter((p) => p.category === c.name).length;
              return (
                <div key={`admin-cat-${c.id}-${idx}`} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between space-y-3">
                  <div className="flex space-x-3 items-start">
                    <img src={c.image} alt={c.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                        {c.badge && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            {c.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{c.description}</p>
                      <p className="text-[10px] text-amber-700 font-extrabold mt-1">{count} Products Assigned</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenEditCategory(c)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete category "${c.name}"?`)) {
                          deleteCategory(c.id);
                        }
                      }}
                      className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Coupons & App Control */}
      {activeTab === 'coupons' && (
        <div className="space-y-8">
          
          {/* Top Actions & Overview */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-black text-slate-900 font-display">
                  Coupons & App Control Center
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage live promo codes, minimum cart values, and store operational parameters for Gopalganj.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingCouponId(null);
                setCCode('');
                setCType('percentage');
                setCValue(10);
                setCMinOrder(999);
                setCMaxDiscount(1000);
                setCIsActive(true);
                setCDescription('');
                setIsCouponModalOpen(true);
              }}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-amber-500/20 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Promo Code</span>
            </button>
          </div>

          {/* Section 1: Promo Codes Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
                <Tag className="w-4 h-4 mr-1.5 text-amber-600" />
                <span>Live Discount Coupons & Less % ({coupons.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400">Syncs directly with Firestore `coupons`</span>
            </div>

            {/* Mobile View: Dynamic Touch Cards for Coupons */}
            <div className="md:hidden space-y-3">
              {coupons.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                  No coupons found. Tap "+ Create New Promo Code" above.
                </div>
              ) : (
                coupons.map((c, idx) => (
                  <div key={`mob-cpn-${c.id || c.code}-${idx}`} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-amber-800 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-300">
                        {c.code}
                      </span>
                      <button
                        onClick={() => updateCoupon(c.id, { isActive: !c.isActive })}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-colors ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${c.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {c.isActive ? 'Active' : 'Paused'}
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-base font-black text-slate-900">
                          {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT LESS`}
                        </span>
                        <p className="text-[10px] text-slate-400">Min Cart: ₹{c.minOrderValue.toLocaleString('en-IN')}</p>
                      </div>

                      {/* Dynamic quick percentage adjustment buttons */}
                      {c.discountType === 'percentage' && (
                        <div className="flex items-center space-x-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
                          <button
                            onClick={() => updateCoupon(c.id, { discountValue: Math.max(1, c.discountValue - 10) })}
                            className="px-1.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-[10px] font-black border border-slate-200 shadow-2xs"
                            title="Decrease discount by 10%"
                          >
                            -10%
                          </button>
                          <button
                            onClick={() => updateCoupon(c.id, { discountValue: Math.max(1, c.discountValue - 5) })}
                            className="px-1.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-[10px] font-black border border-slate-200 shadow-2xs"
                            title="Decrease discount by 5%"
                          >
                            -5%
                          </button>
                          <span className="text-xs font-black text-amber-700 font-mono px-1.5">
                            {c.discountValue}%
                          </span>
                          <button
                            onClick={() => updateCoupon(c.id, { discountValue: Math.min(95, c.discountValue + 5) })}
                            className="px-1.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-[10px] font-black border border-slate-200 shadow-2xs"
                            title="Increase discount by 5%"
                          >
                            +5%
                          </button>
                          <button
                            onClick={() => updateCoupon(c.id, { discountValue: Math.min(95, c.discountValue + 10) })}
                            className="px-1.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-[10px] font-black border border-slate-200 shadow-2xs"
                            title="Increase discount by 10%"
                          >
                            +10%
                          </button>
                        </div>
                      )}
                    </div>

                    {c.description && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">{c.description}</p>
                    )}

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditCoupon(c)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete promo code "${c.code}"?`)) {
                            deleteCoupon(c.id);
                          }
                        }}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-extrabold">
                  <tr>
                    <th className="py-3 px-4">Coupon Code</th>
                    <th className="py-3 px-4">Discount & Percentage</th>
                    <th className="py-3 px-4">Min Order Cart</th>
                    <th className="py-3 px-4">Max Cap</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {coupons.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No coupons found. Click "+ Create New Promo Code" above to add one.
                      </td>
                    </tr>
                  ) : (
                    coupons.map((c, idx) => (
                      <tr key={`cpn-${c.id || c.code}-${idx}`} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
                            {c.code}
                          </span>
                          {c.description && (
                            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] truncate">{c.description}</p>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">
                              {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                            </span>
                            {c.discountType === 'percentage' && (
                              <div className="flex items-center space-x-1 text-[10px]">
                                <button
                                  onClick={() => updateCoupon(c.id, { discountValue: Math.max(1, c.discountValue - 5) })}
                                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-bold border"
                                  title="Decrease by 5%"
                                >
                                  -5%
                                </button>
                                <button
                                  onClick={() => updateCoupon(c.id, { discountValue: Math.min(90, c.discountValue + 5) })}
                                  className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-bold border"
                                  title="Increase by 5%"
                                >
                                  +5%
                                </button>
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-medium text-slate-600">₹{c.minOrderValue.toLocaleString('en-IN')}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-slate-500">
                            {c.maxDiscount ? `₹${c.maxDiscount.toLocaleString('en-IN')}` : 'No Limit'}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => updateCoupon(c.id, { isActive: !c.isActive })}
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border transition-colors ${
                              c.isActive
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                            }`}
                            title="Click to toggle active status"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${c.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                            {c.isActive ? 'Active' : 'Paused'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => handleOpenEditCoupon(c)}
                              className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                              title="Edit Coupon"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete promo code "${c.code}"?`)) {
                                  deleteCoupon(c.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                              title="Delete Coupon"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Global App & Store Settings */}
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-amber-600" />
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                  Store Operations & Global Parameters
                </h4>
              </div>
              {settingsSaved && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300 flex items-center animate-in fade-in">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  Settings Synchronized to Firestore!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Store Name</label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Store Owner</label>
                  <input
                    type="text"
                    value={settingsForm.ownerName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Store Location / Address</label>
                  <input
                    type="text"
                    value={settingsForm.storeAddress}
                    onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Customer Care Phone</label>
                  <input
                    type="text"
                    value={settingsForm.contactPhone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">WhatsApp Ordering Number (wa.me/ID)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Free Delivery Min Cart Value (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.freeDeliveryThreshold}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Standard Delivery Fee (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.deliveryFee}
                    onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Electrical GST Tax Rate (e.g. 0.18 = 18%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={settingsForm.gstRate}
                    onChange={(e) => setSettingsForm({ ...settingsForm, gstRate: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Top Announcement Notice</label>
                <input
                  type="text"
                  value={settingsForm.announcementText || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  placeholder="e.g. Authorized Electrical Showroom in Gopalganj • Owner: Ashish Singh"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settingsForm.isStoreOpen}
                    onChange={(e) => setSettingsForm({ ...settingsForm, isStoreOpen: e.target.checked })}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Store is Open for Online & WhatsApp Orders
                  </span>
                </label>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Store Configuration</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* TAB 5: Firebase System Status */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <Database className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Firebase Firestore Real-time DB
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connected to dedicated Cloud Firestore database with real-time listeners. 
              Orders placed by customers immediately trigger the audio chime and update your inventory counts in milliseconds.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Database ID:</span>
                <span className="font-mono text-amber-700 font-bold">ai-studio-3c45b9c1-e831-4f97-adc5-a6d638d489cd</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Security Rules:</span>
                <span className="text-emerald-700 font-bold flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Deployed & Enforced
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Order Audio Alert:</span>
                <span className="text-amber-700 font-bold">Synthesizer Double-Tone Chime</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 text-amber-600">
              <Cloud className="w-5 h-5" />
              <h3 className="text-base font-extrabold text-slate-900 font-display">
                Firebase Storage & Authentication
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              High-resolution product imagery and official catalogs are stored on Google Cloud Storage with global CDN distribution.
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Storage Bucket:</span>
                <span className="font-mono text-slate-800 font-bold truncate max-w-[200px]">gen-lang-client-0148819941.firebasestorage.app</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                <span className="text-slate-500">Authentication:</span>
                <span className="font-mono text-emerald-700 font-bold">Protected Master Access</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-5 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {editingProductId ? 'Edit Electrical Component' : 'Add New Component to Store'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Havells Crabtree 16A Sapphire LED Switch"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Brand *</label>
                  <select
                    value={pBrand}
                    onChange={(e) => setPBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    {ELECTRICAL_BRANDS.filter(b => b !== 'All Brands').map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">MRP Original (₹)</label>
                  <input
                    type="number"
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              {/* Camera, Gallery Photo Upload & URL */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-extrabold text-xs flex items-center space-x-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-600" />
                    <span>Product Photo (Direct Camera & Gallery Upload)</span>
                  </label>
                  {uploadingImage ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full animate-pulse">
                      Processing Photo...
                    </span>
                  ) : uploadStatus ? (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {uploadStatus}
                    </span>
                  ) : null}
                </div>

                {/* Touch buttons for Mobile Camera & Gallery */}
                <div className="grid grid-cols-2 gap-2.5">
                  <label className="py-3 px-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white rounded-xl cursor-pointer flex items-center justify-center space-x-2 font-bold text-xs shadow-sm active:scale-95 transition-all text-center">
                    <Camera className="w-4 h-4 text-white flex-shrink-0" />
                    <span>Take Photo (Camera)</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>

                  <label className="py-3 px-3 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl cursor-pointer flex items-center justify-center space-x-2 font-bold text-xs shadow-2xs active:scale-95 transition-all text-center">
                    <ImageIcon className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <span>Choose from Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                </div>

                {/* Photo Preview if selected */}
                {pImage && (
                  <div className="flex items-center space-x-3 p-2.5 bg-white rounded-xl border border-slate-200">
                    <img 
                      src={pImage} 
                      alt="Product preview" 
                      className="w-14 h-14 object-cover rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0 text-[11px]">
                      <span className="text-emerald-700 font-bold flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Photo Ready for All Devices
                      </span>
                      <p className="text-slate-400 truncate max-w-[250px] font-mono text-[9px] mt-0.5">
                        {pImage.startsWith('data:') ? 'Compressed Fast-Load Mobile Photo' : pImage}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPImage('');
                        setUploadStatus('');
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Quick Presets for Electrical Products */}
                <div className="pt-1">
                  <span className="text-[10px] text-slate-500 font-semibold block mb-1">Quick Electrical Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_ELECTRICAL_PHOTOS.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setPImage(preset.url);
                          setUploadStatus(`Selected ${preset.label}`);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-amber-50 hover:text-amber-700 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Or Direct Image Web URL */}
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Or paste image URL:</span>
                  <input
                    type="url"
                    value={pImage}
                    onChange={(e) => {
                      setPImage(e.target.value);
                      if (e.target.value) setUploadStatus('Image URL set');
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full mt-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Operating Voltage</label>
                  <input
                    type="text"
                    value={pVoltage}
                    onChange={(e) => setPVoltage(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Warranty</label>
                  <input
                    type="text"
                    value={pWarranty}
                    onChange={(e) => setPWarranty(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  placeholder="Detailed technical specifications..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingProductId ? 'Update Product' : 'Add to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 font-display">
                {editingCategoryId ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart LED Architectural Panels"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Short description of department items"
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Cover Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Trending / New / Save 65%"
                  value={catBadge}
                  onChange={(e) => setCatBadge(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 text-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <Ticket className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {editingCouponId ? 'Edit Promo Code' : 'Create New Promo Code'}
                </h3>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUNRISE20 or GOPALGANJ10"
                  value={cCode}
                  onChange={(e) => setCCode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 uppercase font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Discount Type</label>
                  <select
                    value={cType}
                    onChange={(e) => setCType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {cType === 'percentage' ? 'Discount Percentage (%)' : 'Flat Discount (₹)'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={cValue}
                    onChange={(e) => setCValue(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={cMinOrder}
                    onChange={(e) => setCMinOrder(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                {cType === 'percentage' && (
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Max Cap (₹, Optional)</label>
                    <input
                      type="number"
                      min="0"
                      value={cMaxDiscount || ''}
                      onChange={(e) => setCMaxDiscount(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="e.g. 1000"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description / Campaign Note</label>
                <input
                  type="text"
                  placeholder="e.g. 15% OFF for regional contractors in Gopalganj"
                  value={cDescription}
                  onChange={(e) => setCDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={cIsActive}
                    onChange={(e) => setCIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Promo Code is Active Immediately
                  </span>
                </label>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl shadow-sm"
                >
                  {editingCouponId ? 'Update Promo Code' : 'Save Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
