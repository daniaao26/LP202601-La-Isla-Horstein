import { RouterProvider } from 'react-router';
import { CartProvider } from './context/CartContext';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <CartProvider>
      <div className="size-full">
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </div>
    </CartProvider>
  );
}