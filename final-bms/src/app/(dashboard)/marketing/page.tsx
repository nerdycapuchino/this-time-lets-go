import { getMarketingMetrics } from '@/app/actions/marketing';
import { IndianRupee, Target, Percent } from 'lucide-react';

export default async function MarketingPage() {
  const { totalLeads, convertedLeads, totalRevenue, error } = await getMarketingMetrics();

  const staticSpend = 2000;
  const conversionPercentage = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
  const actualCPA = convertedLeads > 0 ? staticSpend / convertedLeads : 0;

  if (error) {
    return <div className="p-4 text-red-500">Error fetching marketing data: {error.message}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Marketing ROI</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Leads Captured */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Target className="text-blue-500 h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Leads Captured</p>
              <p className="text-2xl font-bold">{totalLeads}</p>
            </div>
          </div>
        </div>

        {/* Conversion % */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Percent className="text-green-500 h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Conversion %</p>
              <p className="text-2xl font-bold">{conversionPercentage.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        {/* Actual CPA */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <IndianRupee className="text-yellow-500 h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Actual CPA</p>
              <p className="text-2xl font-bold">₹{actualCPA.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Total Revenue Generated */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <IndianRupee className="text-purple-500 h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Revenue Generated</p>
              <p className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-6 text-sm text-gray-500">
        <p>* Actual CPA is calculated based on a static ad spend of ₹2,000.</p>
      </div>
    </div>
  );
}
