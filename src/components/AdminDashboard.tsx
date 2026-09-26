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
  Percent
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
    clearNewOrderAlert
  } = useStore();
  
  const { userProfile, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'categories' | 'coupons' | 'system'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  
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

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileRef = ref(storage, `products/${Date.now()}_${file.name.replace(/\s+/g, '_')}`);
      const uploadTask = await uploadBytesResumable(fileRef, file);
      const downloadUrl = await getDownloadURL(uploadTask.ref);
      setPImage(downloadUrl);
    } catch (err) {
      console.warn('Storage upload fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) setPImage(event.target.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
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
    if (orderStatusFilter === 'all') return true;
    return o.orderStatus === orderStatusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-800">
      
      {/* Real-time Order Arrival Audio Alert Banner */}
      {newOrderAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-xl border border-amber-300 flex items-center justify-between animate-bounce">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
              <Bell className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <p className="font-extrabold text-sm uppercase tracking-wider flex items-center">
                <span>🔊 DING! NEW ORDER RECEIVED</span>
                <span className="ml-2 font-mono bg-slate-950 text-amber-300 px-2 py-0.5 rounded text-xs">
                  {newOrderAlert.orderNumber}
                </span>
              </p>
              <p className="text-xs font-semibold text-slate-900">
                Customer: {newOrderAlert.customerName} • Total: ₹{newOrderAlert.totalAmount.toLocaleString('en-IN')} ({newOrderAlert.items.length} items)
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setActiveTab('orders');
                clearNewOrderAlert();
              }}
              className="px-4 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-bold"
            >
              View Order
            </button>
            <button
              onClick={clearNewOrderAlert}
              className="p-1 rounded-lg text-slate-900 hover:text-black"
            >
              <X className="w-5 h-5" />
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
              Owner: Ashish Singh • Gopalganj
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Firestore sync • Instant Order Audio Notification • Coupons & App Configuration.
          </p>
        </div>

        {/* Audio Controls & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Order Sound Alert Toggle */}
          <button
            onClick={() => setSoundAlertEnabled(!soundAlertEnabled)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              soundAlertEnabled 
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm' 
                : 'bg-slate-100 border-slate-300 text-slate-500'
            }`}
            title="Toggle audio alert chime on incoming orders"
          >
            {soundAlertEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Order Chime: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Order Chime: MUTED</span>
              </>
            )}
          </button>

          {/* Test Sound Button */}
          <button
            onClick={testSoundAlert}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-300 transition-colors flex items-center space-x-1.5"
            title="Test the Web Audio synthesizer chime"
          >
            <span>🔊 Test Chime</span>
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

      {/* TAB 1: Orders Pipeline with Live Status Changer */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-600">Filter Orders by Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:border-amber-500"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="placed">Placed ({orders.filter(o => o.orderStatus === 'placed').length})</option>
                <option value="confirmed">Confirmed</option>
                <option value="dispatched">Dispatched</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <span className="text-xs text-slate-500">
              ⚡ Changes made to order status reflect in customer's live tracking instantly!
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-extrabold">
                <tr>
                  <th className="py-3 px-4">Order Ref & Date</th>
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
                <span>Live Discount Coupons ({coupons.length})</span>
              </h4>
              <span className="text-[11px] text-slate-400">Stored in Firestore `coupons` collection</span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-extrabold">
                  <tr>
                    <th className="py-3 px-4">Coupon Code</th>
                    <th className="py-3 px-4">Discount Type & Value</th>
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
                          <span className="font-bold text-slate-900">
                            {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                          </span>
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

              {/* Image URL & Firebase Storage Upload */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-bold">Product Image URL or Upload</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={pImage}
                    onChange={(e) => setPImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-amber-500"
                  />
                  <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer flex items-center space-x-1.5 border border-slate-300">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingImage ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
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
