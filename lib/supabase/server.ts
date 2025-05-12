import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

export const getSupabaseServer = () => {
  // This should only be called in a Server Component or Server Action
  // Remove the environment check as it's causing issues
  // The createServerComponentClient function itself will throw an appropriate error
  // if called in the wrong environment

  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}
