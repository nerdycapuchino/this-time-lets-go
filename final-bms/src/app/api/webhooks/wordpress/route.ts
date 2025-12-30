import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const data = await req.json()

  // Extracting data from common WordPress form structures
  const { name, email, phone, message } = data

  const { error } = await supabase
    .from('leads')
    .insert([{ 
        full_name: name, 
        email, 
        phone, 
        notes: message,
        service_requested: 'WordPress Launchpad' 
    }])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true }, { status: 200 })
}
