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
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Log New Expense</h3>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <input
            type="text"
            name="description"
            id="description"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            id="category"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option>Materials</option>
            <option>Labor</option>
            <option>Marketing</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            id="amount"
            step="0.01"
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            defaultValue={new Date().toISOString().split('T')[0]}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isSubmitting ? 'Logging...' : 'Log Expense'}
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}
      </form>
    </div>
  );
}
