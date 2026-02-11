import { createHash } from "crypto";

import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_PROVIDER } from "../database/database.provider";
import { Database, Tables } from "../database/supabase.types";
import { IUserCreateDto, UserRole, UserStatus } from "./interfaces";
import { IPasswordDto } from "../auth/interfaces";

@Injectable()
export class UserService {
  constructor(
    @Inject(SUPABASE_PROVIDER)
    private readonly supabase: SupabaseClient<Database>,
    private readonly configService: ConfigService,
  ) {}

  public async findOne(where: { email?: string; id?: number }): Promise<Tables<"user"> | null> {
    let query = this.supabase.from("user").select();

    if (where.email) {
      query = query.eq("email", where.email);
    }
    if (where.id) {
      query = query.eq("id", where.id);
    }

    const { data } = await query.single();
    return data;
  }

  public async findAndCount(): Promise<[Array<Tables<"user">>, number]> {
    const { data = [], count } = await this.supabase.from("user").select("*", { count: "exact" }).throwOnError();
    return [data, count ?? 0];
  }

  public async getByCredentials(email: string, password: string): Promise<Tables<"user"> | null> {
    const { data } = await this.supabase
      .from("user")
      .select()
      .eq("email", email)
      .eq("password", this.createPasswordHash(password))
      .single();
    return data;
  }

  public async create(dto: IUserCreateDto): Promise<Tables<"user">> {
    const { firstName, lastName, email, password } = dto;

    const existing = await this.findOne({ email });

    if (existing) {
      throw new ConflictException();
    }

    const { data } = await this.supabase
      .from("user")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        password: this.createPasswordHash(password),
        roles: [UserRole.USER],
        status: UserStatus.PENDING,
      })
      .select()
      .single()
      .throwOnError();
    return data;
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(password).update(passwordSecret).digest("hex");
  }

  public async updatePassword(userEntity: Tables<"user">, dto: IPasswordDto): Promise<Tables<"user">> {
    const { data } = await this.supabase
      .from("user")
      .update({ password: this.createPasswordHash(dto.password) })
      .eq("id", userEntity.id)
      .select()
      .single()
      .throwOnError();
    return data;
  }

  public async activate(userEntity: Tables<"user">): Promise<Tables<"user">> {
    const { data } = await this.supabase
      .from("user")
      .update({ status: UserStatus.ACTIVE })
      .eq("id", userEntity.id)
      .select()
      .single()
      .throwOnError();
    return data;
  }
}
