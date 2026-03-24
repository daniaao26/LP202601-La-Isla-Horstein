import { useState } from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { CartSidebar } from './CartSidebar';

export function Layout() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="size-full flex flex-col bg-neutral-50">
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <Outlet />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
