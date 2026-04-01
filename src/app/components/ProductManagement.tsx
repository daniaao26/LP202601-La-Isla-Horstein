import { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { Product } from '../context/CartContext';
import { categories } from '../data/products';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon } from 'lucide-react';

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: 'rolls',
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        category: product.category,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'rolls',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      category: 'rolls',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseInt(formData.price);
    if (isNaN(price) || price <= 0) {
      alert('El precio debe ser un número válido mayor a 0');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        description: formData.description,
        price,
        image: formData.image,
        category: formData.category,
      });
    } else {
      addProduct({
        name: formData.name,
        description: formData.description,
        price,
        image: formData.image,
        category: formData.category,
      });
    }

    handleCloseModal();
  };

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${name}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-900">Gestión de Productos</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
        >
          <Plus size={20} />
          Nuevo Producto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                Imagen
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                Nombre
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                Descripción
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                Categoría
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                Precio
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs truncate">
                  {product.description}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-neutral-100 rounded-full">
                    {categories.find(c => c.id === product.category)?.icon}
                    {categories.find(c => c.id === product.category)?.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-neutral-900">
                  ${product.price.toLocaleString('es-CL')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-neutral-900">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ej: Roll Especial de Salmón"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px] resize-y"
                  placeholder="Describe el producto..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Precio (CLP)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="8990"
                    required
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    {categories
                      .filter(cat => cat.id !== 'todos')
                      .map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
                {formData.image && (
                  <div className="mt-4 border border-neutral-200 rounded-xl overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Vista previa"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f5f5f5" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
                >
                  <Save size={20} />
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
