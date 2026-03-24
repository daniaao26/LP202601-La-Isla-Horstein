import { useState } from 'react';
import { Phone, MapPin, Clock, Search } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useCart } from '../context/CartContext';
import { products, categories } from '../data/products';
import { Product } from '../context/CartContext';
import { toast } from 'sonner';

export function Home() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.name} añadido al carrito`, {
      duration: 2000,
    });
  };

  const handleAddToCartWithQuantity = (product: Product, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} x ${product.name} añadido al carrito`, {
      duration: 2000,
    });
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="flex-1 overflow-auto">
      {/* Hero Section */}
      <section className="relative h-[500px] bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1696449241254-11cf7f18ce32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1920"
            alt="Sushi Restaurant"
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl mb-6 text-white">
              Auténtico Sushi Japonés
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-neutral-200">
              Ingredientes frescos, sabor excepcional, preparado por maestros susheros
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="#menu"
                className="bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors text-lg"
              >
                Ver Menú
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-red-600 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <Clock size={24} />
              <div className="text-left">
                <div className="font-semibold">Horario</div>
                <div className="text-sm opacity-90">Lun-Dom: 11:00 - 23:00</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Phone size={24} />
              <div className="text-left">
                <div className="font-semibold">Teléfono</div>
                <div className="text-sm opacity-90">+56 9 8765 4321</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <MapPin size={24} />
              <div className="text-left">
                <div className="font-semibold">Ubicación</div>
                <div className="text-sm opacity-90">Av. Providencia 1234, Santiago</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl mb-4 text-neutral-900">Nuestro Menú</h2>
            <p className="text-xl text-neutral-600">Selección premium de sushi fresco</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-neutral-200 rounded-full focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  selectedCategory === category.id
                    ? 'bg-red-600 text-white shadow-lg scale-105'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border-2 border-neutral-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-2xl text-neutral-400 mb-2">No se encontraron productos</p>
              <p className="text-neutral-500">Intenta con otra búsqueda o categoría</p>
            </div>
          )}
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="bg-neutral-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-6">Oferta Especial</h2>
          <p className="text-xl mb-8 text-neutral-300">
            ¡20% de descuento en pedidos superiores a $35.000!
          </p>
          <a
            href="#menu"
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-full hover:bg-red-700 transition-colors text-lg"
          >
            Ordenar Ahora
          </a>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center mb-12 text-neutral-900">¿Por Qué Elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🐟</div>
              <h3 className="text-2xl mb-3 text-neutral-900">Pescado Fresco</h3>
              <p className="text-neutral-600">Ingredientes de la más alta calidad, entregados diariamente</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">👨‍🍳</div>
              <h3 className="text-2xl mb-3 text-neutral-900">Maestros Susheros</h3>
              <p className="text-neutral-600">Chefs con más de 15 años de experiencia en cocina japonesa</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-2xl mb-3 text-neutral-900">Entrega Rápida</h3>
              <p className="text-neutral-600">Entregamos tu pedido en menos de 30 minutos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">🍣</span>
            </div>
            <span className="text-3xl">Fukusuke Sushi-Delivery</span>
          </div>
          <p className="text-neutral-400 mb-6">
            Auténtica experiencia japonesa desde 2010
          </p>
          <div className="flex justify-center gap-8 mb-6">
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">Twitter</a>
          </div>
          <p className="text-neutral-500 text-sm">
            © 2026 Fukusuke Sushi-Delivery. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCartWithQuantity}
      />
    </div>
  );
}
