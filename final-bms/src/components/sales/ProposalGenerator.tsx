'use client';

import { addProposal } from '@/app/actions/proposals';
import { useRef, useState } from 'react';

interface ProposalGeneratorProps {
  leadId: string;
  onClose: () => void;
}

export default function ProposalGenerator({ leadId, onClose }: ProposalGeneratorProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      lead_id: leadId,
      scope_of_work: formData.get('scope_of_work') as string,
      total_price: parseFloat(formData.get('total_price') as string),
    };

    const result = await addProposal(data);

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-100 p-8 rounded-lg shadow-[9px_9px_16px_#d9d9d9,-9px_-9px_16px_#ffffff] w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create Proposal</h2>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="scope_of_work" className="block text-sm font-medium text-gray-700">
              Scope of Work
            </label>
            <textarea
              name="scope_of_work"
              id="scope_of_work"
              rows={4}
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="total_price" className="block text-sm font-medium text-gray-700">
              Total Price
            </label>
            <input
              type="number"
              name="total_price"
              id="total_price"
              step="100"
              required
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md shadow-[4px_4px_8px_#d0d0d0,-4px_-4px_8px_#ffffff] hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-[4px_4px_8px_#d0d0d0,-4px_-4px_8px_#ffffff] hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Sending...' : 'Send Proposal'}
            </button>
          </div>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
