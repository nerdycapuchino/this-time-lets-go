import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>
        <Bell className="text-gray-600" />
        <User className="text-gray-600" />
      </div>
    </div>
  );
};

export default Header;
