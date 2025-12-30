import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="px-8 py-6 flex justify-between items-center z-40">
      <div>
        <h2 className="architectural-heading">Workspace Management</h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors h-4 w-4" />
          <input
            type="text"
            placeholder="Quick search..."
            className="pl-11 pr-6 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-64 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-2xl hover:bg-white/10 transition-colors relative">
            <Bell className="text-gray-500 h-5 w-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-gray-50 dark:border-zinc-950"></span>
          </button>
          <button className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              AD
            </div>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
