import { X, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Product } from '../context/CartContext';
import { useState } from 'react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductDetailModal({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <div className="sticky top-0 bg-white flex justify-end p-4 border-b">
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="relative h-80 mb-6 rounded-xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-4xl font-bold text-neutral-900 mb-4">{product.name}</h2>
            
            <div className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </div>

            <p className="text-lg text-neutral-600 mb-6">{product.description}</p>

            <div className="flex items-center justify-between mb-6 p-6 bg-neutral-50 rounded-xl">
              <div>
                <p className="text-neutral-600 mb-1">Precio</p>
                <p className="text-4xl font-bold text-red-600">
                  ${product.price.toLocaleString('es-CL')}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-neutral-600">Cantidad</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-white border-2 border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-12 text-center text-2xl font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white border-2 border-neutral-300 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-red-600 text-white py-4 rounded-full hover:bg-red-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart size={24} />
              Añadir al carrito - ${(product.price * quantity).toLocaleString('es-CL')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
