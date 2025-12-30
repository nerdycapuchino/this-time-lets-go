// src/app/actions/payroll.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function calculateMonthlyPayroll(month: number, year: number) {
  const supabase = createClient();
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0).toISOString();

  // Fetch all attendance for the month along with employee rates
  const { data: attendanceData, error } = await supabase
    .from('attendance')
    .select('employee_id, total_hours, employees(full_name, hourly_rate)')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;

  // Aggregate by employee
  const payroll = attendanceData.reduce((acc: any, curr: any) => {
    const empId = curr.employee_id;
    if (!acc[empId]) {
      acc[empId] = {
        name: curr.employees.full_name,
        hourlyRate: curr.employees.hourly_rate,
        totalHours: 0,
        totalPay: 0
      };
    }
    acc[empId].totalHours += Number(curr.total_hours);
    acc[empId].totalPay = acc[empId].totalHours * acc[empId].hourlyRate;
    return acc;
  }, {});

  return Object.values(payroll);
}
