import { getEmployees } from '@/app/actions/employees';
import { User, Mail, Briefcase } from 'lucide-react';

export default async function TeamPage() {
  const employees = await getEmployees();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Team Hub</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Directory and performance tracking for active personnel</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="glass-surface rounded-3xl p-6 neu-shadow group hover:border-blue-500/30 transition-all duration-500 relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-600/5 rounded-full blur-2xl group-hover:bg-blue-600/10 transition-colors"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform duration-500">
                    <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-gray-50 dark:border-zinc-950 animate-pulse"></div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{employee.full_name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mt-1">{employee.role}</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <Mail className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="truncate">{employee.email || 'No email registered'}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <Briefcase className="w-4 h-4 mr-3 text-gray-400" />
                  <span>Rate: ₹{employee.hourly_rate?.toLocaleString('en-IN') || '0'} / hr</span>
                </div>
              </div>

              <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 transition-all">
                View Work History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Add some global CSS for the glassmorphism background and pulse animation if it doesn't exist.
// You might want to put this in your globals.css
/*
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

body {
  background: #1a202c; // A dark background helps the glass effect
}
*/
