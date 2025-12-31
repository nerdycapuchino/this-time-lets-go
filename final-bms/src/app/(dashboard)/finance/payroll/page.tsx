// src/app/(dashboard)/finance/payroll/page.tsx
import { calculateMonthlyPayroll } from "@/app/actions/payroll";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PayrollPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') redirect('/dashboard');

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  
  const payrollData = await calculateMonthlyPayroll(month, year);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Payroll & Attendance</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Financial disbursement and tracking for {format(now, 'MMMM yyyy')}</p>
        </div>
        <div className="bg-blue-600/10 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase border border-blue-600/20">
          Admin View
        </div>
      </div>

      <div className="glass-surface rounded-3xl overflow-hidden">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Employee</th>
              <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hourly Rate</th>
              <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hours Worked</th>
              <th className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Payout</th>
              <th className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {payrollData.length > 0 ? (
              payrollData.map((emp: any) => (
                <tr key={emp.name} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{emp.name}</td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500 font-medium">${emp.hourlyRate}/hr</td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-500 font-medium">{emp.totalHours.toFixed(2)} hrs</td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-black text-blue-600 dark:text-blue-400">${emp.totalPay.toLocaleString()}</td>
                  <td className="px-8 py-6 whitespace-nowrap text-right text-sm font-bold">
                    <button className="text-gray-400 hover:text-white transition-colors">View Details</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-sm text-gray-500 italic">
                  No attendance records found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
