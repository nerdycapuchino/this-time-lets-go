import Link from 'next/link'
import { Plus, Hammer, Package, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function ManufacturingPage() {
  const supabase = await createClient()

  // Fetch products and check if they have a BOM
  const { data: products, error } = await supabase
    .from('products')
    .select('*, bill_of_materials(*)')

  if (error) {
    return (
      <div className="p-6 text-red-500 bg-red-50 rounded-lg">
        <h3 className="font-bold flex items-center gap-2">
          <AlertCircle className="h-5 w-5" /> Database Error
        </h3>
        <p>Could not load products. Please check your Supabase connection.</p>
        <pre className="mt-2 text-xs text-red-800">{JSON.stringify(error, null, 2)}</pre>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">Manufacturing Hub</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">Production recipes, job cards, and strategic resource allocation</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/manufacturing/create-bom"
            className="shimmer-button flex items-center gap-3 rounded-2xl bg-blue-600 px-6 py-3 text-[10px] font-black text-white shadow-lg shadow-blue-500/20 uppercase tracking-widest"
          >
            <Plus className="h-4 w-4" />
            NEW RECIPE
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-surface rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-white/5 px-8 py-6 border-b border-white/5">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Production Recipes (BOMs)</h3>
        </div>
        
        {(!products || products.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/5">
              <Hammer className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">No Products Found</h3>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Initialize products in the Inventory module to begin recipe management.
            </p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-white/5">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-x-6 px-8 py-6 hover:bg-white/5 transition-all group">
                <div className="min-w-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center border border-blue-600/20">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">{product.name}</p>
                      <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
                        SKU: {product.sku}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   {product.bill_of_materials && product.bill_of_materials.length > 0 ? (
                      <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">
                          Recipe Active
                        </span>
                      </div>
                   ) : (
                      <Link 
                        href={`/dashboard/manufacturing/create-bom?productId=${product.id}`}
                        className="text-[10px] font-black text-blue-600 hover:text-blue-500 uppercase tracking-widest bg-blue-600/10 px-4 py-2 rounded-xl border border-blue-600/20 transition-all"
                      >
                        + Add Recipe
                      </Link>
                   )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
