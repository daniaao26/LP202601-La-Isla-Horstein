import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartCount } = useCart();
  const navigate = useNavigate();
  const total = getCartTotal();
  const cartCount = getCartCount();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  // Aplicar descuento del 20% si el total es mayor a $35,000
  const discount = total > 35000 ? total * 0.2 : 0;
  const finalTotal = total - discount;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-red-600" size={24} />
              <h2 className="text-2xl font-bold text-neutral-900">
                Tu Carrito ({cartCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag size={64} className="text-neutral-300 mb-4" />
                <p className="text-xl text-neutral-500 mb-2">Tu carrito está vacío</p>
                <p className="text-neutral-400">¡Agrega algunos productos deliciosos!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 bg-neutral-50 p-4 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-1">{item.name}</h3>
                      <p className="text-red-600 font-bold mb-2">
                        ${item.price.toLocaleString('es-CL')}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center bg-white border border-neutral-300 rounded-md hover:bg-neutral-100 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('es-CL')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento (20%)</span>
                    <span>-${discount.toLocaleString('es-CL')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold text-neutral-900 pt-2 border-t">
                  <span>Total</span>
                  <span>${finalTotal.toLocaleString('es-CL')}</span>
                </div>
              </div>
              {total > 35000 && discount > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                  🎉 ¡Felicitaciones! Has obtenido un 20% de descuento
                </div>
              )}
              {total <= 35000 && total > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                  💡 Agrega ${(35001 - total).toLocaleString('es-CL')} más para obtener 20% de descuento
                </div>
              )}
              <button
                onClick={handleCheckout}
                className="w-full bg-red-600 text-white py-3 rounded-full hover:bg-red-700 transition-colors font-semibold"
              >
                Ir a Pagar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
