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
    <div>
      <h1 className="text-3xl font-bold mb-6">Profitability Dashboard</h1>
      <ProfitabilityDashboard
        projectsData={projects || []}
        monthlyData={monthly || []}
        exchangeRates={exchange_rates || []}
      />
    </div>
  );
}
