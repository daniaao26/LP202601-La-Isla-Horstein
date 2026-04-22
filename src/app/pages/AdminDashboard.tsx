import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProductManagement } from '../components/ProductManagement';
import { OrderDetailModal } from '../components/OrderDetailModal';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface SavedOrder {
  id: number;
  userId: string;
  date: string;
  items: OrderItem[];
  total: number;
  deliveryMethod: 'delivery' | 'pickup';
  paymentMethod: 'cash' | 'card';
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    commune?: string;
    reference?: string;
    comments?: string;
  };
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid?: boolean;
}

interface Order {
  id: number;
  date: string;
  customerName: string;
  items: Array<{ name: string; quantity: number }>;
  total: number;
  status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid?: boolean;
  fullData: SavedOrder;
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<SavedOrder | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Cargar órdenes desde localStorage
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = JSON.parse(localStorage.getItem('sushi-orders') || '[]');
    return savedOrders.map((order: SavedOrder) => ({
      id: order.id,
      date: new Date(order.date).toLocaleString('es-CL'),
      customerName: order.customerInfo.name,
      items: order.items.map((item: OrderItem) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      total: order.total,
      status: order.status || 'pending',
      isPaid: order.isPaid || false,
      fullData: order,
    }));
  });

  // Recargar órdenes cuando se actualice alguna
  const handleRefreshOrders = () => {
    const savedOrders = JSON.parse(localStorage.getItem('sushi-orders') || '[]');
    const updatedOrders = savedOrders.map((order: SavedOrder) => ({
      id: order.id,
      date: new Date(order.date).toLocaleString('es-CL'),
      customerName: order.customerInfo.name,
      items: order.items.map((item: OrderItem) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      total: order.total,
      status: order.status || 'pending',
      isPaid: order.isPaid || false,
      fullData: order,
    }));
    setOrders(updatedOrders);
    setRefreshKey(prev => prev + 1);

    // Si hay un pedido seleccionado, actualizarlo también
    if (selectedOrder) {
      const updatedSelectedOrder = savedOrders.find((o: SavedOrder) => o.id === selectedOrder.id);
      if (updatedSelectedOrder) {
        setSelectedOrder(updatedSelectedOrder);
      }
    }
  };

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    completedOrders: orders.filter(o => o.status === 'delivered').length,
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'Pendiente',
      preparing: 'Preparando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status];
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'preparing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'preparing':
        return <Package size={16} />;
      case 'shipped':
        return <ShoppingBag size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-neutral-600">
            Bienvenido, {user?.name}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="text-blue-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-neutral-600 text-sm mb-1">Total Pedidos</h3>
            <p className="text-3xl font-bold text-neutral-900">{stats.totalOrders}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <h3 className="text-neutral-600 text-sm mb-1">Ingresos Totales</h3>
            <p className="text-3xl font-bold text-neutral-900">
              ${stats.totalRevenue.toLocaleString('es-CL')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
            <h3 className="text-neutral-600 text-sm mb-1">Pedidos Pendientes</h3>
            <p className="text-3xl font-bold text-neutral-900">{stats.pendingOrders}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
            </div>
            <h3 className="text-neutral-600 text-sm mb-1">Pedidos Completados</h3>
            <p className="text-3xl font-bold text-neutral-900">{stats.completedOrders}</p>
          </div>
        </div>

        {/* Product Management */}
        <div className="mb-8">
          <ProductManagement />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900">Pedidos Recientes</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="mx-auto text-neutral-300 mb-4" size={64} />
              <p className="text-xl text-neutral-500 mb-2">No hay pedidos aún</p>
              <p className="text-neutral-400">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                      Productos
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                      Pago
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-neutral-900 font-medium">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-900">
                        {order.customerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-neutral-900">
                        ${order.total.toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          order.isPaid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {order.isPaid ? '✓ Pagado' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order.fullData)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                        >
                          <Eye size={16} />
                          Ver Detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Detalle de Pedido */}
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdate={handleRefreshOrders}
          />
        )}
      </div>
    </div>
  );
}
