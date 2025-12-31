import { getInventory } from '@/app/actions/inventory';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const canSeeInventory = profile?.role === 'admin' || profile?.role === 'factory_mgr';
  if (!canSeeInventory) redirect('/dashboard');

  const inventory = await getInventory();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Inventory Hub</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Real-time stock tracking and supply chain management</p>
        </div>
      </div>

      <div className="glass-surface rounded-3xl overflow-hidden">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-white/5">
            <tr>
              <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Item Name</th>
              <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
              <th scope="col" className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock Level</th>
              <th scope="col" className="px-8 py-5 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit</th>
              <th scope="col" className="px-8 py-5 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Min Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {inventory.map((item) => {
              const isLowStock = item.stock_level < item.min_stock_level;
              return (
                <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    {isLowStock ? (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Low Stock</span>
                      </div>
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-green-500 inline-block"></span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-gray-900 dark:text-white">{item.item_name}</td>
                  <td className="px-8 py-6 text-sm text-gray-500 font-medium">{item.category}</td>
                  <td className={`px-8 py-6 text-right text-sm font-black ${isLowStock ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>{item.stock_level}</td>
                  <td className="px-8 py-6 text-sm text-gray-400 uppercase font-bold">{item.unit}</td>
                  <td className="px-8 py-6 text-right text-sm text-gray-500 font-medium">{item.min_stock_level}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
