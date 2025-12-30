// src/app/actions/attendance.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logHours(employeeId: string, date: string, checkIn: string, checkOut: string) {
  const supabase = createClient();
  
  // Calculate total hours
  const start = new Date(`${date}T${checkIn}`);
  const end = new Date(`${date}T${checkOut}`);
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  const { error } = await supabase.from('attendance').insert({
    employee_id: employeeId,
    date,
    check_in: start.toISOString(),
    check_out: end.toISOString(),
    total_hours: hours.toFixed(2)
  });

  if (error) throw error;
  revalidatePath('/dashboard/finance/payroll');
}

export async function getMonthlyReport(month: number, year: number) {
  const supabase = createClient();
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0).toISOString();

  const { data, error } = await supabase
    .from('attendance')
    .select('*, employees(full_name, hourly_rate)')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;
  return data;
}
