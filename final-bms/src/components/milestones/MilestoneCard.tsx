"use client";

import { useState } from "react";
import { generateInvoiceForMilestone } from "@/app/actions/invoicing";
import { updateMilestoneStatus } from "@/app/actions/milestones";
import { CheckCircle, Circle, FileText, Loader } from "lucide-react";

export default function MilestoneCard({ milestone, invoice }: { milestone: any, invoice: any }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setIsLoading(true);
    await updateMilestoneStatus(milestone.id, newStatus);
    
    if (newStatus === 'completed' && !invoice) {
        alert("Generating invoice...");
        const result = await generateInvoiceForMilestone(milestone.id);
        if(result.error) alert(`Error: ${result.error}`);
        else alert(result.success);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border flex justify-between items-center">
      <div>
        <p className="font-bold">{milestone.name}</p>
        <p className="text-sm text-gray-500">{milestone.description}</p>
        <p className="text-xs text-gray-500 mt-1">Due: {new Date(milestone.due_date).toLocaleDateString()}</p>
      </div>
      <div className="flex items-center space-x-4">
        {invoice && (
            <a href="#" className="flex items-center text-sm text-blue-600">
                <FileText className="w-4 h-4 mr-1"/>
                Invoice #{invoice.id}
            </a>
        )}
        {isLoading ? <Loader className="animate-spin" /> : (
            <select
                value={milestone.status}
                onChange={handleStatusChange}
                className="text-sm rounded-md p-2 border"
            >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
            </select>
        )}
      </div>
    </div>
  );
}
