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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manufacturing Console</h1>
          <p className="text-slate-600">Manage BOMs, Job Cards, and Production Queues.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/manufacturing/create-bom"
            className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            New BOM Recipe
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="font-semibold text-slate-900">Product Recipes (BOMs)</h3>
        </div>
        
        {(!products || products.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-slate-50 p-4">
              <Hammer className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-slate-900">No Products Found</h3>
            <p className="mt-1 text-sm text-slate-500">
              You need products before you can create recipes.
            </p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-100">
            {products.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-x-6 px-6 py-5 hover:bg-slate-50">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold leading-6 text-slate-900">{product.name}</p>
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                      {product.sku}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   {product.bill_of_materials && product.bill_of_materials.length > 0 ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Recipe Active
                      </span>
                   ) : (
                      <Link 
                        href={`/manufacturing/create-bom?productId=${product.id}`}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
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
  )
}
