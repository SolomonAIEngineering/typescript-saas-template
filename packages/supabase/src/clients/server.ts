import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "../types";

export const createClient = (cookieStoreParam?: ReturnType<typeof cookies>) => {
  let cookieStore: ReturnType<typeof cookies> | undefined;

  try {
    cookieStore = cookieStoreParam ?? cookies();
  } catch (error) {
    console.warn(
      "Unable to access cookies, falling back to empty cookie store",
    );
  }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll() ?? [];
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore?.set(name, value, options);
          }
        },
      },
    },
  );
};
