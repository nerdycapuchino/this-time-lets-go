import { Home, Folder, Users, DollarSign, ClipboardList } from 'lucide-react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md h-full p-4 flex flex-col">
      <div className="mb-10">
        <Link href="/dashboard" className="text-2xl font-bold">
          StudioBMS
        </Link>
      </div>
      <nav>
        <ul>
          <li className="mb-4">
            <Link href="/dashboard" className="flex items-center text-gray-700 hover:text-black">
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/projects" className="flex items-center text-gray-700 hover:text-black">
              <Folder className="mr-2 h-5 w-5" />
              Projects
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/site-logs" className="flex items-center text-gray-700 hover:text-black">
              <ClipboardList className="mr-2 h-5 w-5" />
              Site Logs
            </Link>
          </li>
          <li className="mb-4">
            <Link href="/dashboard/profitability" className="flex items-center text-gray-700 hover:text-black">
              <DollarSign className="mr-2 h-5 w-5" />
              Profitability
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};


export default Sidebar;
