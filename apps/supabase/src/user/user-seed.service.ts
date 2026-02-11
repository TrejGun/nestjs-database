import { Inject, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_PROVIDER } from "../database/database.provider";
import { Database, Tables } from "../database/supabase.types";
import { UserRole, UserStatus } from "./interfaces";

@Injectable()
export class UserSeedService {
  constructor(
    @Inject(SUPABASE_PROVIDER)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  public async setup(): Promise<Tables<"user">> {
    const { data: existing } = await this.supabase.from("user").select().eq("email", "trejgun@gmail.com").single();

    if (existing) {
      return existing;
    }

    const { data } = await this.supabase
      .from("user")
      .insert({
        first_name: "Trej",
        last_name: "Gun",
        email: "trejgun@gmail.com",
        password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
        roles: [UserRole.ADMIN],
        status: UserStatus.ACTIVE,
      })
      .select()
      .single()
      .throwOnError();
    return data;
  }

  public async teardown(): Promise<void> {
    await this.supabase.from("token").delete().gte("id", 0).throwOnError();
    await this.supabase.from("auth").delete().gte("id", 0).throwOnError();
    await this.supabase.from("user").delete().gte("id", 0).throwOnError();
  }
}
