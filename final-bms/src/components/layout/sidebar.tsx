import { createClient } from '@/lib/supabase/server';
import { Home, Folder, Users, DollarSign, ClipboardList, TrendingUp, UsersRound } from 'lucide-react';
import Link from 'next/link';

const Sidebar = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userRole = 'public';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile) {
      userRole = profile.role;
    }
  }

  const isFieldStaff = userRole === 'Field-Staff';

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
            <Link href="/dashboard/team" className="flex items-center text-gray-700 hover:text-black">
              <UsersRound className="mr-2 h-5 w-5" />
              Team Hub
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
          {!isFieldStaff && (
            <>
              <li className="mb-4">
                <Link href="/dashboard/marketing" className="flex items-center text-gray-700 hover:text-black">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Marketing ROI
                </Link>
              </li>
              <li className="mb-4">
                <Link href="/dashboard/profitability" className="flex items-center text-gray-700 hover:text-black">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Profitability
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};


export default Sidebar;
