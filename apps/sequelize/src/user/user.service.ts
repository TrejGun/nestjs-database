import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConfigService } from "@nestjs/config";
import { WhereOptions } from "sequelize";
import { createHash } from "crypto";

import { UserModel } from "./user.model";
import { IUser, IUserCreateDto, UserStatus } from "./interfaces";
import { IPasswordDto } from "../auth/interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    private readonly configService: ConfigService,
  ) {}

  public findAll(where: Partial<IUser>): Promise<Array<UserModel>> {
    return this.userModel.findAll({
      where,
    });
  }

  public findOne(where: WhereOptions<UserModel>): Promise<UserModel | null> {
    return this.userModel.findOne({ where });
  }

  public async create(dto: IUserCreateDto): Promise<UserModel> {
    let userModel = await this.findOne({ email: dto.email });

    if (userModel) {
      throw new ConflictException("duplicateEmail");
    }

    userModel = await this.userModel.build(dto).save();

    return userModel;
  }

  public async getByCredentials(email: string, password: string): Promise<UserModel | null> {
    return this.userModel.findOne({
      where: {
        email,
        password: this.createPasswordHash(password),
      },
    });
  }

  public createPasswordHash(password: string): string {
    const passwordSecret = this.configService.get<string>("PASSWORD_SECRET", "keyboard_cat");
    return createHash("sha256").update(password).update(passwordSecret).digest("hex");
  }

  public updatePassword(userEntity: UserModel, dto: IPasswordDto): Promise<UserModel> {
    userEntity.password = this.createPasswordHash(dto.password);
    return userEntity.save();
  }

  public activate(userEntity: UserModel): Promise<UserModel> {
    userEntity.status = UserStatus.ACTIVE;
    return userEntity.save();
  }
}
