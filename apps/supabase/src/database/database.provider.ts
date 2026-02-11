import { ConfigService } from "@nestjs/config";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "./supabase.types";

export const SUPABASE_PROVIDER = Symbol("SUPABASE_PROVIDER");

export const supabaseProvider = {
  provide: SUPABASE_PROVIDER,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const supabaseUrl = configService.get("SUPABASE_URL", "");
    const supabaseKey = configService.get("SUPABASE_SECRET_KEY", "");
    return createClient<Database>(supabaseUrl, supabaseKey);
  },
};
