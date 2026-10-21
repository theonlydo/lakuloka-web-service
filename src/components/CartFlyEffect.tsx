'use client';

import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface FlyItem {
  id: number;
  startX: number;
  startY: number;
  dx: number;
  dy: number;
}

function FlyDot({ item, onDone }: { item: FlyItem; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 680);
    return () => clearTimeout(t);
  }, [onDone]);

  // Two-div projectile trick: outer moves X (linear), inner moves Y (ease-in gravity)
  // This creates a natural parabolic arc toward the cart FAB
  return (
    <div
      style={{
        position: 'fixed',
        left: item.startX - 10,
        top: item.startY - 10,
        pointerEvents: 'none',
        zIndex: 9999,
        // @ts-expect-error CSS custom property
        '--fly-dx': `${item.dx}px`,
        animation: 'fly-x 0.65s linear forwards',
      }}
    >
      <div
        style={{
          // @ts-expect-error CSS custom property
          '--fly-dy': `${item.dy}px`,
          animation: 'fly-y 0.65s cubic-bezier(0.42, 0, 0.9, 0.65) forwards',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#373571',
            animation: 'fly-shrink 0.65s ease-in forwards',
          }}
        />
      </div>
    </div>
  );
}

export default function CartFlyEffect() {
  const [items, setItems] = useState<FlyItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      const cartEl = document.getElementById('cart-fab');
      const endX = cartEl
        ? cartEl.getBoundingClientRect().left + cartEl.getBoundingClientRect().width / 2
        : window.innerWidth - 40;
      const endY = cartEl
        ? cartEl.getBoundingClientRect().top + cartEl.getBoundingClientRect().height / 2
        : window.innerHeight - 80;

      setItems((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), startX: x, startY: y, dx: endX - x, dy: endY - y },
      ]);
    };

    window.addEventListener('cart:fly', handler);
    return () => window.removeEventListener('cart:fly', handler);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      {items.map((item) => (
        <FlyDot key={item.id} item={item} onDone={() => removeItem(item.id)} />
      ))}
    </>,
    document.body,
  );
}
