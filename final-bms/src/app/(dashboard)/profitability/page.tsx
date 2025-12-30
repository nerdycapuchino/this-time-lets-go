import { createClient } from "@/lib/supabase/server";
import ProfitabilityDashboard from "@/components/profitability/ProfitabilityDashboard";

export default async function ProfitabilityPage() {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('get_profitability_data');

  if (error || !data) {
    return <p className="p-4 text-red-500">Error fetching profitability data: {error?.message}</p>;
  }

  const { projects, monthly, exchange_rates } = data;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Profitability Dashboard</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Real-time margin analysis and multi-currency revenue tracking</p>
        </div>
      </div>
      
      <div className="bg-white/5 rounded-3xl p-2 border border-white/5">
        <ProfitabilityDashboard
          projectsData={projects || []}
          monthlyData={monthly || []}
          exchangeRates={exchange_rates || []}
        />
      </div>
    </div>
  );
}
