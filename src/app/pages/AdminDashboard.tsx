import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ProductManagement } from '../components/ProductManagement';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Order {
  id: number;
  date: string;
  customerName: string;
  items: Array<{ name: string; quantity: number }>;
  total: number;
  status: 'pendiente' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
}

export function AdminDashboard() {
  const { user } = useAuth();
  
  // Cargar órdenes desde localStorage
  const [orders] = useState<Order[]>(() => {
    const savedOrders = JSON.parse(localStorage.getItem('sushi-orders') || '[]');
    return savedOrders.map((order: any) => ({
      id: order.id,
      date: new Date(order.date).toLocaleString('es-CL'),
      customerName: order.customerInfo.name,
      items: order.items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      total: order.total,
      status: 'pendiente' as const,
    }));
  });

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pendingOrders: orders.filter(o => o.status === 'pendiente').length,
    completedOrders: orders.filter(o => o.status === 'entregado').length,
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      case 'preparando':
        return 'bg-blue-100 text-blue-700';
      case 'enviado':
        return 'bg-purple-100 text-purple-700';
      case 'entregado':
        return 'bg-green-100 text-green-700';
      case 'cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pendiente':
        return <Clock size={16} />;
      case 'preparando':
        return <Package size={16} />;
      case 'enviado':
        return <ShoppingBag size={16} />;
      case 'entregado':
        return <CheckCircle size={16} />;
      case 'cancelado':
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
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
