import { createClient } from '@supabase/supabase-js'

// Ganti string di bawah ini dengan URL dan Key milikmu
const supabaseUrl = 'https://emxisawuflholktlfvqr.supabase.co'
const supabaseAnonKey = 'sb_publishable__SCsj7hkC5Wrga6SYO6bXw_T_Fw0eRe'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)