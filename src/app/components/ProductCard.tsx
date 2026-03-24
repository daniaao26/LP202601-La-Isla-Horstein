import { ShoppingCart } from 'lucide-react';
import { Product } from '../context/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group">
      <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl mb-2 text-neutral-900 cursor-pointer hover:text-red-600 transition-colors" onClick={() => onViewDetails(product)}>
          {product.name}
        </h3>
        <p className="text-neutral-600 mb-4 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-3xl text-red-600 font-bold">
            ${product.price.toLocaleString('es-CL')}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <ShoppingCart size={18} />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
