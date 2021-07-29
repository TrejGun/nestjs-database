import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { IUser, UserModel } from "./user.model";
import { IUserCreateDto } from "./interfaces";
import { WhereOptions } from "sequelize";
import { createHash } from "crypto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
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
      throw new ConflictException("Duplicate email");
    }

    userModel = await this.userModel.build(dto).save();

    return userModel;
  }

  public async getByCredentials(email: string, password: string): Promise<UserModel | null> {
    return this.userModel.findOne({
      where: {
        email,
        password: this.createPasswordHash(password, email),
      },
    });
  }

  private createPasswordHash(password: string, salt: string): string {
    return createHash("sha256").update(password).update(salt).digest("hex");
  }
}
