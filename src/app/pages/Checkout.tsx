import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { ArrowLeft, MapPin, Phone, User, Mail, Home, Clock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    commune: '',
    reference: '',
    comments: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getCartTotal();
  const discount = subtotal > 35000 ? subtotal * 0.2 : 0;
  const deliveryFee = deliveryMethod === 'delivery' ? 2990 : 0;
  const total = subtotal - discount + deliveryFee;

  const comunas = [
    'Providencia', 'Las Condes', 'Vitacura', 'Ñuñoa', 'La Reina',
    'Santiago Centro', 'Recoleta', 'Independencia', 'Quinta Normal',
    'Estación Central', 'Maipú', 'La Florida', 'Puente Alto'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\+?56\s?9\s?\d{4}\s?\d{4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Teléfono inválido (formato: +56 9 XXXX XXXX)';
    }

    if (deliveryMethod === 'delivery') {
      if (!formData.address.trim()) {
        newErrors.address = 'La dirección es requerida';
      }
      if (!formData.commune) {
        newErrors.commune = 'La comuna es requerida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (cart.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }

    // Simular procesamiento de orden
    toast.success('¡Pedido realizado con éxito!', {
      duration: 3000,
      description: 'Te contactaremos pronto para confirmar tu pedido',
    });

    // Guardar orden en localStorage para historial (futuro)
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      total,
      deliveryMethod,
      paymentMethod,
      customerInfo: formData,
    };

    const orders = JSON.parse(localStorage.getItem('sushi-orders') || '[]');
    orders.push(order);
    localStorage.setItem('sushi-orders', JSON.stringify(orders));

    // Limpiar carrito y redirigir
    clearCart();
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="flex-1 overflow-auto bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Tu carrito está vacío</h2>
            <p className="text-neutral-600 mb-8">Agrega algunos productos antes de ir al checkout</p>
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

        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Finalizar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Método de Entrega</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryMethod === 'delivery'
                        ? 'border-red-600 bg-red-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Home className={`mx-auto mb-2 ${deliveryMethod === 'delivery' ? 'text-red-600' : 'text-neutral-400'}`} size={32} />
                    <div className="font-semibold">Delivery</div>
                    <div className="text-sm text-neutral-600">$2.990</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'border-red-600 bg-red-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <Clock className={`mx-auto mb-2 ${deliveryMethod === 'pickup' ? 'text-red-600' : 'text-neutral-400'}`} size={32} />
                    <div className="font-semibold">Retiro en Tienda</div>
                    <div className="text-sm text-neutral-600">Gratis</div>
                  </button>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Información de Contacto</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      <User size={16} className="inline mr-1" />
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-neutral-200'
                      }`}
                      placeholder="Juan Pérez"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      <Phone size={16} className="inline mr-1" />
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                        errors.phone ? 'border-red-500' : 'border-neutral-200'
                      }`}
                      placeholder="+56 9 1234 5678"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      <Mail size={16} className="inline mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                        errors.email ? 'border-red-500' : 'border-neutral-200'
                      }`}
                      placeholder="tu@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              {deliveryMethod === 'delivery' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-4">Dirección de Entrega</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        <MapPin size={16} className="inline mr-1" />
                        Dirección *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                          errors.address ? 'border-red-500' : 'border-neutral-200'
                        }`}
                        placeholder="Av. Providencia 1234, Depto 501"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Comuna *
                      </label>
                      <select
                        name="commune"
                        value={formData.commune}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-red-600 transition-colors ${
                          errors.commune ? 'border-red-500' : 'border-neutral-200'
                        }`}
                      >
                        <option value="">Selecciona una comuna</option>
                        {comunas.map((comuna) => (
                          <option key={comuna} value={comuna}>
                            {comuna}
                          </option>
                        ))}
                      </select>
                      {errors.commune && <p className="text-red-500 text-sm mt-1">{errors.commune}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-2">
                        Referencia (opcional)
                      </label>
                      <input
                        type="text"
                        name="reference"
                        value={formData.reference}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 transition-colors"
                        placeholder="Ej: Casa roja, portón negro"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Método de Pago</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-red-600 bg-red-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <CreditCard className={`mx-auto mb-2 ${paymentMethod === 'card' ? 'text-red-600' : 'text-neutral-400'}`} size={32} />
                    <div className="font-semibold">Tarjeta</div>
                    <div className="text-sm text-neutral-600">Débito/Crédito</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-red-600 bg-red-50'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <span className="text-4xl block mb-2">💵</span>
                    <div className="font-semibold">Efectivo</div>
                    <div className="text-sm text-neutral-600">Al recibir</div>
                  </button>
                </div>
              </div>

              {/* Comments */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Comentarios Adicionales</h2>
                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-red-600 transition-colors resize-none"
                  placeholder="Alguna indicación especial para tu pedido..."
                />
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Resumen del Pedido</h2>
              
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 pb-3 border-b border-neutral-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <p className="text-neutral-600 text-sm">
                        {item.quantity} x ${item.price.toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 pb-6 border-b">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString('es-CL')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento (20%)</span>
                    <span>-${discount.toLocaleString('es-CL')}</span>
                  </div>
                )}
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>Costo de envío</span>
                    <span>${deliveryFee.toLocaleString('es-CL')}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between text-2xl font-bold text-neutral-900 mb-6">
                <span>Total</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 text-white py-4 rounded-full hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                Realizar Pedido
              </button>

              <p className="text-xs text-neutral-500 text-center mt-4">
                Al realizar el pedido, aceptas nuestros términos y condiciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
