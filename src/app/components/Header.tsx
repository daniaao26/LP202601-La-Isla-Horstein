import { ShoppingCart, LogIn, LogOut, UserCircle, LayoutDashboard, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

interface HeaderProps {
  onCartOpen: () => void;
}

export function Header({ onCartOpen }: HeaderProps) {
  const { getCartCount } = useCart();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
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
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                  >
                    <LayoutDashboard size={20} />
                    <span>Admin</span>
                  </button>
                )}
                {!isAdmin && (
                  <button
                    onClick={() => navigate('/my-orders')}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Package size={20} />
                    <span>Mis Pedidos</span>
                  </button>
                )}
                <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-neutral-100 rounded-full">
                  <UserCircle size={20} className="text-neutral-600" />
                  <span className="text-sm font-semibold text-neutral-900">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-neutral-600 hover:text-red-600 transition-colors"
                >
                  <LogOut size={20} />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="hidden sm:flex items-center gap-2 px-6 py-2 bg-neutral-100 text-neutral-900 rounded-full hover:bg-neutral-200 transition-colors"
              >
                <LogIn size={20} />
                <span>Iniciar Sesión</span>
              </button>
            )}
            <button
              onClick={onCartOpen}
              className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center gap-2 relative"
            >
              <ShoppingCart size={20} />
              <span className="hidden sm:inline">Carrito</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-neutral-900 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}