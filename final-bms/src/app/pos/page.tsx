'use client';

import { useState } from 'react';

const products = [
  { id: 1, name: 'Web Design Service', price: 2500, tax: 0.1 },
  { id: 2, name: 'Development (per hour)', price: 150, tax: 0.1 },
  { id: 3, name: 'Consulting', price: 300, tax: 0.1 },
  { id: 4, name: 'Support Package (monthly)', price: 500, tax: 0.1 },
];

export default function POSPage() {
  const [cart, setCart] = useState([
    { id: 1, product: 'Web Design Service', quantity: 1, price: 2500 },
    { id: 2, product: 'Development (per hour)', quantity: 40, price: 150 },
  ]);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.1;
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const total = subtotal + tax;

  const removeItem = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
    setCart(cart.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white">POS - Point of Sale & Billing</h1>
        <p className="text-slate-400 mt-2">Create transactions, generate invoices, and track daily sales</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Available Services</h2>
            <div className="space-y-2">
              {products.map(product => (
                <div key={product.id} className="flex justify-between items-center p-4 bg-slate-700 rounded hover:bg-slate-600 transition cursor-pointer">
                  <div>
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-slate-400 text-sm">${product.price.toLocaleString()}</p>
                  </div>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white transition">+ Add</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Invoice */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Invoice #2024-001</h2>
          
          {/* Items */}
          <div className="space-y-3 mb-6 pb-6 border-b border-slate-700">
            {cart.map(item => (
              <div key={item.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white">{item.product}</span>
                  <span className="text-slate-300">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                      className="w-12 bg-slate-700 text-white px-2 py-1 rounded"
                    />
                    <span>x {item.price}</span>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Tax (10%):</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-slate-700">
              <span>Total:</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-2">
            <button className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition">💾 Save & Print Invoice</button>
            <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded font-semibold transition">✓ Complete Transaction</button>
            <button className="w-full px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded font-semibold transition">Clear Cart</button>
          </div>
        </div>
      </div>

      {/* Daily Sales Summary */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Today's Sales</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-slate-400 text-sm">Total Transactions</p>
            <p className="text-3xl font-bold text-white">24</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Revenue</p>
            <p className="text-3xl font-bold text-white">$48,500</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Avg Transaction</p>
            <p className="text-3xl font-bold text-white">$2,020</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Total Tax Collected</p>
            <p className="text-3xl font-bold text-white">$4,850</p>
          </div>
        </div>
      </div>
    </div>
  );
}
