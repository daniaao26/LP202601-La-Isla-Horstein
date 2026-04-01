import { RouterProvider } from 'react-router';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <div className="size-full">
            <RouterProvider router={router} />
            <Toaster position="top-right" />
          </div>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}