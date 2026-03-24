import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCartOpen: () => void;
}

export function Header({ onCartOpen }: HeaderProps) {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🍣</span>
            </div>
            <span className="text-2xl font-bold text-neutral-900">Sushi Master</span>
          </div>
          <nav className="hidden md:flex gap-8">
            <a href="#menu" className="text-neutral-700 hover:text-red-600 transition-colors">
              Menú
            </a>
            <a href="#about" className="text-neutral-700 hover:text-red-600 transition-colors">
              Nosotros
            </a>
            <a href="#contact" className="text-neutral-700 hover:text-red-600 transition-colors">
              Contacto
            </a>
          </nav>
          <button
            onClick={onCartOpen}
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center gap-2 relative"
          >
            <ShoppingCart size={20} />
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-neutral-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
