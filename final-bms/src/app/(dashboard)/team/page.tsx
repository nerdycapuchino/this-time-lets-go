import { getEmployees } from '@/app/actions/employees';
import { User, Mail, Briefcase } from 'lucide-react';

export default async function TeamPage() {
  const employees = await getEmployees();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Team Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 shadow-lg overflow-hidden group"
          >
            <div className="absolute top-0 right-0 h-16 w-16 bg-white/20 rounded-full -mt-8 -mr-8 transform transition-transform duration-500 group-hover:scale-[15]"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500" />
                  </div>
                  {/* Staff Pulse Indicator */}
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800 animate-pulse"></div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-white">{employee.full_name}</h3>
                  <p className="text-sm text-gray-300">{employee.role}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-gray-200">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{employee.email || 'No email'}</span>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>Hourly Rate: ₹{employee.hourly_rate?.toLocaleString('en-IN') || 'N/A'}</span>
                </div>
              </div>
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
