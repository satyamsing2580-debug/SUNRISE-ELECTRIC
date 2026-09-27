export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory?: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  image: string;
  gallery?: string[];
  description: string;
  features: string[];
  specs: {
    voltage?: string;
    wattage?: string;
    warranty?: string;
    material?: string;
    color?: string;
    certification?: string;
    origin?: string;
    dimensions?: string;
    [key: string]: string | undefined;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  image: string;
  badge?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSpec?: string;
}

export type OrderStatus = 'placed' | 'confirmed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface TrackingUpdate {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  alternatePhone?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: 'home' | 'work' | 'other';
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: {
    productId: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    image: string;
    selectedColor?: string;
  }[];
  subtotal: number;
  taxGst: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: 'upi' | 'card' | 'cod' | 'netbanking';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentDetails?: {
    transactionId?: string;
    paidAt?: string;
  };
  orderStatus: OrderStatus;
  trackingUpdates: TrackingUpdate[];
  groupId?: string;
  adminId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  role: 'customer' | 'admin';
  savedAddresses?: ShippingAddress[];
  createdAt?: string;
}

export interface FilterState {
  category: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  minRating: number;
  searchQuery: string;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  isActive: boolean;
  description?: string;
  expiryDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppSettings {
  storeName: string;
  ownerName: string;
  storeAddress: string;
  contactPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  freeDeliveryThreshold: number;
  deliveryFee: number;
  gstRate: number;
  announcementText?: string;
  isStoreOpen: boolean;
}
