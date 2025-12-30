'use client';

import { addExpense } from '@/app/actions/expenses';
import { useRef, useState } from 'react';

export default function ExpenseLogger({ projectId }: { projectId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      project_id: projectId,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      amount: parseFloat(formData.get('amount') as string),
      date: formData.get('date') as string,
    };

    const result = await addExpense(data);

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess('Expense added successfully!');
      formRef.current?.reset();
    }
  };

  return (
    <div className="glass-surface p-8 rounded-3xl shadow-xl">
      <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-6 uppercase">Log New Expense</h3>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="description" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            required
            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Category
            </label>
            <select
              name="category"
              id="category"
              required
              className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm appearance-none"
            >
              <option>Materials</option>
              <option>Labor</option>
              <option>Marketing</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="amount" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              id="amount"
              step="0.01"
              required
              className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm font-bold"
            />
          </div>
        </div>
        <div>
          <label htmlFor="date" className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="shimmer-button w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 disabled:bg-gray-400 transition-all"
          >
            {isSubmitting ? 'Processing...' : 'Log Expense'}
          </button>
        </div>
        {error && <p className="text-xs font-bold text-red-500 text-center uppercase tracking-widest bg-red-500/10 py-3 rounded-xl">{error}</p>}
        {success && <p className="text-xs font-bold text-green-500 text-center uppercase tracking-widest bg-green-500/10 py-3 rounded-xl">{success}</p>}
      </form>
    </div>
  );
}
