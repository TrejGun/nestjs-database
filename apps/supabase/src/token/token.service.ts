import { randomBytes } from "crypto";

import { Inject, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_PROVIDER } from "../database/database.provider";
import { Database, Tables } from "../database/supabase.types";

type TokenTypeEnum = Database["public"]["Enums"]["token_type_enum"];
type TokenWithUser = Tables<"token"> & { user: Tables<"user"> };

@Injectable()
export class TokenService {
  constructor(
    @Inject(SUPABASE_PROVIDER)
    private readonly supabase: SupabaseClient<Database>,
  ) {}

  public async findOne(where: { code?: string; type?: string }): Promise<TokenWithUser | null> {
    let query = this.supabase.from("token").select("*, user:user_id(*)");

    if (where.code) {
      query = query.eq("code", where.code);
    }
    if (where.type) {
      query = query.eq("type", where.type as TokenTypeEnum);
    }

    const { data } = await query.single().throwOnError();
    return data as unknown as TokenWithUser | null;
  }

  public async getToken(type: string, userEntity: Tables<"user">): Promise<TokenWithUser> {
    const { data: existing } = await this.supabase
      .from("token")
      .select("*, user:user_id(*)")
      .eq("type", type as TokenTypeEnum)
      .eq("user_id", userEntity.id)
      .single();

    if (existing) {
      const { data } = await this.supabase
        .from("token")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select("*, user:user_id(*)")
        .single()
        .throwOnError();
      return data as unknown as TokenWithUser;
    } else {
      const { data } = await this.supabase
        .from("token")
        .insert({
          code: randomBytes(3).toString("hex").toUpperCase(),
          type: type as Database["public"]["Enums"]["token_type_enum"],
          user_id: userEntity.id,
        })
        .select("*, user:user_id(*)")
        .single()
        .throwOnError();
      return data as unknown as TokenWithUser;
    }
  }

  public async remove(tokenEntity: Tables<"token">): Promise<void> {
    await this.supabase.from("token").delete().eq("id", tokenEntity.id).throwOnError();
  }
}
