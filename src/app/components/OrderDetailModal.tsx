import { useState, useEffect } from 'react';
import {
  X,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  Clock,
  CreditCard,
  Edit2,
  Save,
  Trash2,
  Ban,
  CheckCircle,
  DollarSign,
} from 'lucide-react';
import { toast } from 'sonner';

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

interface OrderDetailModalProps {
  order: SavedOrder;
  onClose: () => void;
  onUpdate: () => void;
}

export function OrderDetailModal({ order: initialOrder, onClose, onUpdate }: OrderDetailModalProps) {
  const [order, setOrder] = useState<SavedOrder>(initialOrder);
  const [isEditingItems, setIsEditingItems] = useState(false);
  const [editedItems, setEditedItems] = useState<OrderItem[]>(initialOrder.items);

  useEffect(() => {
    setOrder(initialOrder);
    setEditedItems(initialOrder.items);
  }, [initialOrder]);

  const updateOrderInStorage = (updatedOrder: SavedOrder) => {
    const orders = JSON.parse(localStorage.getItem('sushi-orders') || '[]');
    const updatedOrders = orders.map((o: SavedOrder) =>
      o.id === updatedOrder.id ? updatedOrder : o
    );
    localStorage.setItem('sushi-orders', JSON.stringify(updatedOrders));
    setOrder(updatedOrder);
    onUpdate();
  };

  const handleStatusChange = (newStatus: SavedOrder['status']) => {
    const updatedOrder = { ...order, status: newStatus };
    updateOrderInStorage(updatedOrder);
    toast.success(`Pedido marcado como ${getStatusLabel(newStatus)}`);
  };

  const handleTogglePaid = () => {
    const updatedOrder = { ...order, isPaid: !order.isPaid };
    updateOrderInStorage(updatedOrder);
    toast.success(updatedOrder.isPaid ? 'Pedido marcado como pagado' : 'Pago marcado como pendiente');
  };

  const handleCancelOrder = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
      handleStatusChange('cancelled');
    }
  };

  const handleSaveItems = () => {
    const filteredItems = editedItems.filter(item => item.quantity > 0);
    if (filteredItems.length === 0) {
      toast.error('El pedido debe tener al menos un producto');
      return;
    }

    const newTotal = filteredItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = order.deliveryMethod === 'delivery' ? 2990 : 0;
    const finalTotal = newTotal + deliveryFee;

    const updatedOrder = {
      ...order,
      items: filteredItems,
      total: finalTotal,
    };
    updateOrderInStorage(updatedOrder);
    setIsEditingItems(false);
    toast.success('Pedido actualizado exitosamente');
  };

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    setEditedItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      )
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setEditedItems(items => items.filter(item => item.id !== itemId));
  };

  const getStatusLabel = (status: SavedOrder['status']) => {
    const labels = {
      pending: 'Pendiente',
      preparing: 'Preparando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
    };
    return labels[status];
  };

  const getStatusColor = (status: SavedOrder['status']) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      preparing: 'bg-blue-100 text-blue-700 border-blue-300',
      shipped: 'bg-purple-100 text-purple-700 border-purple-300',
      delivered: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status];
  };

  const subtotal = isEditingItems
    ? editedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = order.deliveryMethod === 'delivery' ? 2990 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900">Pedido #{order.id}</h2>
            <p className="text-neutral-600 mt-1">
              {new Date(order.date).toLocaleString('es-CL')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 hover:bg-neutral-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Estado y Pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-50 rounded-2xl p-6">
              <h3 className="font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                <Package size={20} />
                Estado del Pedido
              </h3>
              <div className="space-y-2">
                {(['pending', 'preparing', 'shipped', 'delivered'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={order.status === 'cancelled'}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left font-semibold ${
                      order.status === status
                        ? getStatusColor(status)
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {getStatusLabel(status)}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6">
              <h3 className="font-semibold text-neutral-700 mb-4 flex items-center gap-2">
                <DollarSign size={20} />
                Estado de Pago
              </h3>
              <button
                onClick={handleTogglePaid}
                disabled={order.status === 'cancelled'}
                className={`w-full px-6 py-4 rounded-xl border-2 transition-all font-semibold ${
                  order.isPaid
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-orange-100 text-orange-700 border-orange-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {order.isPaid ? '✓ Pagado' : '⏳ Pago Pendiente'}
              </button>

              {order.status !== 'cancelled' && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full mt-4 px-6 py-4 rounded-xl border-2 border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  <Ban size={20} />
                  Cancelar Pedido
                </button>
              )}
            </div>
          </div>

          {/* Información del Cliente */}
          <div className="bg-neutral-50 rounded-2xl p-6">
            <h3 className="font-semibold text-neutral-700 mb-4 flex items-center gap-2">
              <User size={20} />
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="text-neutral-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-neutral-500">Nombre</p>
                  <p className="font-semibold">{order.customerInfo.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="text-neutral-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-neutral-500">Teléfono</p>
                  <p className="font-semibold">{order.customerInfo.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="text-neutral-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="font-semibold">{order.customerInfo.email}</p>
                </div>
              </div>
              {order.deliveryMethod === 'delivery' && order.customerInfo.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-neutral-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-neutral-500">Dirección</p>
                    <p className="font-semibold">
                      {order.customerInfo.address}, {order.customerInfo.commune}
                    </p>
                    {order.customerInfo.reference && (
                      <p className="text-sm text-neutral-600 mt-1">
                        Ref: {order.customerInfo.reference}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {order.customerInfo.comments && (
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <p className="text-sm text-neutral-500 mb-1">Comentarios</p>
                <p className="text-neutral-700">{order.customerInfo.comments}</p>
              </div>
            )}
          </div>

          {/* Detalles de Entrega y Pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neutral-50 rounded-2xl p-6">
              <h3 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                {order.deliveryMethod === 'delivery' ? <Home size={20} /> : <Clock size={20} />}
                Método de Entrega
              </h3>
              <p className="text-lg font-semibold">
                {order.deliveryMethod === 'delivery' ? 'Delivery a Domicilio' : 'Retiro en Tienda'}
              </p>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-6">
              <h3 className="font-semibold text-neutral-700 mb-3 flex items-center gap-2">
                <CreditCard size={20} />
                Método de Pago
              </h3>
              <p className="text-lg font-semibold">
                {order.paymentMethod === 'card' ? 'Tarjeta (Débito/Crédito)' : 'Efectivo'}
              </p>
            </div>
          </div>

          {/* Productos del Pedido */}
          <div className="bg-neutral-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-neutral-700 flex items-center gap-2">
                <Package size={20} />
                Productos del Pedido
              </h3>
              {!isEditingItems && order.status !== 'cancelled' && (
                <button
                  onClick={() => setIsEditingItems(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
              )}
              {isEditingItems && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditingItems(false);
                      setEditedItems(order.items);
                    }}
                    className="px-4 py-2 bg-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveItems}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} />
                    Guardar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {(isEditingItems ? editedItems : order.items).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 bg-white rounded-xl p-4 border border-neutral-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-neutral-900">{item.name}</h4>
                    <p className="text-neutral-600">
                      ${item.price.toLocaleString('es-CL')} c/u
                    </p>
                  </div>

                  {isEditingItems ? (
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 rounded-lg transition-colors"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-neutral-200 hover:bg-neutral-300 rounded-lg transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-right">
                      <p className="text-neutral-600">Cantidad: {item.quantity}</p>
                      <p className="font-semibold text-lg">
                        ${(item.price * item.quantity).toLocaleString('es-CL')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de Totales */}
          <div className="bg-neutral-50 rounded-2xl p-6">
            <h3 className="font-semibold text-neutral-700 mb-4">Resumen</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toLocaleString('es-CL')}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between text-neutral-600">
                  <span>Costo de envío</span>
                  <span className="font-semibold">${deliveryFee.toLocaleString('es-CL')}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold text-neutral-900 pt-3 border-t-2 border-neutral-200">
                <span>Total</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
