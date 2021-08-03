import { Injectable, ConflictException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { createHash } from "crypto";

import { UserModel, UserDocument } from "./user.model";
import { IUserCreateDto, UserStatus } from "./interfaces";
import { IPasswordDto } from "../auth/interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel.name)
    private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  public findOne(where: FilterQuery<UserDocument>): Promise<UserDocument | null> {
    return this.userModel.findOne(where).exec();
  }

  public async findAndCount(where: FilterQuery<UserDocument> = {}): Promise<[Array<UserDocument>, number]> {
    const rows = await this.userModel.find(where);
    const count = await this.userModel.count(where);
    return [rows, count];
  }

  public async getByCredentials(email: string, password: string): Promise<UserDocument | null> {
    return this.userModel.findOne({
      email,
      password: this.createPasswordHash(password),
    });
  }

  public async create(data: IUserCreateDto): Promise<UserDocument> {
    const userEntity = await this.findOne({ email: data.email });

    if (userEntity) {
      throw new ConflictException();
    }

    return this.userModel.create({
      ...data,
      password: this.createPasswordHash(data.password),
    });
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(password).update(passwordSecret).digest("hex");
  }

  public async updatePassword(userEntity: UserDocument, dto: IPasswordDto): Promise<UserDocument> {
    userEntity.password = this.createPasswordHash(dto.password);
    return userEntity.save();
  }

  public async activate(userEntity: UserDocument): Promise<UserDocument> {
    userEntity.status = UserStatus.ACTIVE;
    return userEntity.save();
  }
}
