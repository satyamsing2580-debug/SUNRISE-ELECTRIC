import { 
  db, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from '../firebase';
import { Order, OrderStatus } from '../types';

/**
 * 1. Creating/Placing an Order:
 * Writes new order data directly to the Firestore 'orders' collection.
 */
export async function createOrderInFirestore(
  orderData: Omit<Order, 'id'>
): Promise<{ id: string; orderNumber: string }> {
  try {
    const ordersCol = collection(db, 'orders');
    const docRef = await addDoc(ordersCol, {
      ...orderData,
      createdAt: orderData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return { id: docRef.id, orderNumber: orderData.orderNumber };
  } catch (error: any) {
    console.error('Failed to create order in Firestore:', error);
    throw error;
  }
}

export interface OrderQueryFilters {
  groupId?: string;
  adminId?: string;
  userId?: string;
  orderStatus?: OrderStatus | 'all';
}

/**
 * 2. Real-time Listener (onSnapshot) with User/Group Filtering:
 * Subscribes to real-time order updates based on groupId, adminId, or userId.
 * Updates UI immediately across all connected admin/client devices.
 */
export function subscribeToOrders(
  filters: OrderQueryFilters,
  onOrdersUpdate: (orders: Order[]) => void,
  onError?: (err: Error) => void
): () => void {
  try {
    const ordersCol = collection(db, 'orders');
    const constraints: any[] = [];

    // Filter by specific group (e.g., 'gopalganj-store' or contractor division)
    if (filters.groupId && filters.groupId !== 'all') {
      constraints.push(where('groupId', '==', filters.groupId));
    }

    // Filter by specific assigned admin
    if (filters.adminId && filters.adminId !== 'all') {
      constraints.push(where('adminId', '==', filters.adminId));
    }

    // Filter by customer user ID
    if (filters.userId && filters.userId !== 'all') {
      constraints.push(where('userId', '==', filters.userId));
    }

    // Filter by order status
    if (filters.orderStatus && filters.orderStatus !== 'all') {
      constraints.push(where('orderStatus', '==', filters.orderStatus));
    }

    const q = constraints.length > 0 ? query(ordersCol, ...constraints) : query(ordersCol);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersList: Order[] = [];
        snapshot.forEach((docSnap) => {
          ordersList.push({ ...docSnap.data(), id: docSnap.id } as Order);
        });

        // Sort descending by creation date
        ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onOrdersUpdate(ordersList);
      },
      (err) => {
        console.error('Firestore onSnapshot listener error:', err);
        if (onError) onError(err);
      }
    );

    return unsubscribe;
  } catch (err: any) {
    console.error('Error establishing onSnapshot listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * 3. Update Order Status in Firestore:
 * Pushes status update to Firestore with tracking timeline.
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: OrderStatus,
  note?: string
): Promise<void> {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    orderStatus: newStatus,
    updatedAt: new Date().toISOString()
  });
}
