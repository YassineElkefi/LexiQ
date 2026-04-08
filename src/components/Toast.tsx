'use client';

import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onDone?: () => void;
}

export function Toast({ message, duration = 1800, onDone }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDone?.(), 300);
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onDone]);

  return (
    <div
      className="toast fixed top-24 left-1/2 z-50 px-5 py-3 rounded-xl font-semibold text-sm text-white shadow-2xl"
      style={{
        transform: `translateX(-50%)`,
        background: 'rgba(30,30,30,0.95)',
        backdropFilter: 'blur(8px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      {message}
    </div>
  );
}

interface ToastManagerProps {
  toasts: { id: number; message: string }[];
  onRemove: (id: number) => void;
}

export function ToastManager({ toasts, onRemove }: ToastManagerProps) {
  return (
    <>
      {toasts.map((toast, i) => (
        <div
          key={toast.id}
          className="toast fixed left-1/2 z-50 px-5 py-3 rounded-xl font-semibold text-sm text-white shadow-2xl"
          style={{
            top: `${88 + i * 52}px`,
            transform: 'translateX(-50%)',
            background: 'rgba(20,20,20,0.96)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {toast.message}
        </div>
      ))}
    </>
  );
}