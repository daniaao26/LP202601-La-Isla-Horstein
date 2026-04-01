import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Package, ShoppingBag, Clock, MapPin, CreditCard, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface Order {
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
  status: 'pending' | 'confirmed' | 'delivered';
}

export function MyOrders() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Cargar pedidos del usuario actual
    const allOrders = JSON.parse(localStorage.getItem('sushi-orders') || '[]');
    const userOrders = allOrders
      .filter((order: Order) => order.userId === user?.id)
      .sort((a: Order, b: Order) => b.id - a.id); // Más recientes primero
    setOrders(userOrders);
  }, [user]);

  const handleReorder = (order: Order) => {
    // Agregar todos los items del pedido al carrito
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart(item);
      }
    });

    toast.success('¡Pedido agregado al carrito!', {
      description: `${order.items.length} productos agregados`,
      duration: 3000,
    });

    // Navegar al home para ver el carrito
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmado';
      case 'delivered':
        return 'Entregado';
      default:
        return status;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="flex-1 overflow-auto bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            <span>Volver al menú</span>
          </button>

          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              No tienes pedidos todavía
            </h2>
            <p className="text-neutral-600 mb-8">
              Realiza tu primer pedido para verlo aquí
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors"
            >
              Ver Menú
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Volver al menú</span>
        </button>

        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Mis Pedidos</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedOrder(order)}
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Package className="text-red-600" size={24} />
                      <h3 className="text-xl font-bold text-neutral-900">
                        Pedido #{order.id}
                      </h3>
                    </div>
                    <p className="text-sm text-neutral-600 flex items-center gap-2">
                      <Clock size={14} />
                      {formatDate(order.date)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                {/* Order Items Preview */}
                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-neutral-600">
                          {item.quantity} x ${item.price.toLocaleString('es-CL')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-neutral-600">
                      +{order.items.length - 3} productos más
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <span className="flex items-center gap-1">
                      {order.deliveryMethod === 'delivery' ? (
                        <>
                          <MapPin size={14} />
                          Delivery
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={14} />
                          Retiro
                        </>
                      )}
                    </span>
                    <span className="flex items-center gap-1">
                      {order.paymentMethod === 'card' ? (
                        <>
                          <CreditCard size={14} />
                          Tarjeta
                        </>
                      ) : (
                        <>💵 Efectivo</>
                      )}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-neutral-900">
                      ${order.total.toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>

                {/* Reorder Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReorder(order);
                  }}
                  className="w-full mt-4 bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Repetir Pedido
                </button>
              </div>
            ))}
          </div>

          {/* Order Detail Sidebar */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Detalle del Pedido
                </h2>

                <div className="space-y-4">
                  {/* Order Number */}
                  <div>
                    <p className="text-sm text-neutral-600">Número de Pedido</p>
                    <p className="font-bold text-lg">#{selectedOrder.id}</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm text-neutral-600">Fecha</p>
                    <p className="font-semibold">{formatDate(selectedOrder.date)}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-sm text-neutral-600">Estado</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>

                  {/* Customer Info */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-neutral-600 mb-2">Información de Contacto</p>
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold">{selectedOrder.customerInfo.name}</p>
                      <p className="text-neutral-600">{selectedOrder.customerInfo.email}</p>
                      <p className="text-neutral-600">{selectedOrder.customerInfo.phone}</p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  {selectedOrder.deliveryMethod === 'delivery' && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-neutral-600 mb-2">Dirección de Entrega</p>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold">{selectedOrder.customerInfo.address}</p>
                        <p className="text-neutral-600">{selectedOrder.customerInfo.commune}</p>
                        {selectedOrder.customerInfo.reference && (
                          <p className="text-neutral-600">
                            Ref: {selectedOrder.customerInfo.reference}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="pt-4 border-t">
                    <p className="text-sm text-neutral-600 mb-3">Productos</p>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-neutral-600">
                              {item.quantity} x ${item.price.toLocaleString('es-CL')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">Total</p>
                      <p className="text-2xl font-bold text-red-600">
                        ${selectedOrder.total.toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>

                  {/* Comments */}
                  {selectedOrder.customerInfo.comments && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-neutral-600 mb-2">Comentarios</p>
                      <p className="text-sm text-neutral-700">
                        {selectedOrder.customerInfo.comments}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
                <div className="text-center text-neutral-400 py-12">
                  <Package size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Selecciona un pedido para ver los detalles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
