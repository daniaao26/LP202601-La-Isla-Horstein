import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from './CartContext';
import { products as initialProducts } from '../data/products';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Omit<Product, 'id'>>) => void;
  deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    // Cargar productos desde localStorage al iniciar
    const savedProducts = localStorage.getItem('sushi-products');
    if (savedProducts) {
      try {
        return JSON.parse(savedProducts);
      } catch {
        return initialProducts;
      }
    }
    return initialProducts;
  });

  // Guardar productos en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('sushi-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts((prevProducts) => {
      const maxId = prevProducts.length > 0
        ? Math.max(...prevProducts.map(p => p.id))
        : 0;
      const newProduct: Product = {
        ...product,
        id: maxId + 1,
      };
      return [...prevProducts, newProduct];
    });
  };

  const updateProduct = (id: number, updatedFields: Partial<Omit<Product, 'id'>>) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, ...updatedFields } : product
      )
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
