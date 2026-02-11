import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { UserModel, UserDocument } from "./user.model";
import { AuthModel, AuthDocument } from "../auth/auth.model";
import { TokenModel, TokenDocument } from "../token/token.model";
import { UserRole, UserStatus } from "./interfaces";

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(UserModel.name)
    private userModel: Model<UserDocument>,
    @InjectModel(AuthModel.name)
    private authModel: Model<AuthDocument>,
    @InjectModel(TokenModel.name)
    private tokenModel: Model<TokenDocument>,
  ) {}

  public async setup(): Promise<UserDocument> {
    let userEntity = await this.userModel.findOne({ email: "trejgun@gmail.com" });

    if (!userEntity) {
      userEntity = await this.userModel.create({
        firstName: "Trej",
        lastName: "Gun",
        email: "trejgun@gmail.com",
        password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
        roles: [UserRole.ADMIN],
        status: UserStatus.ACTIVE,
      });
    }

    return userEntity;
  }

  public async teardown(): Promise<void> {
    await this.tokenModel.deleteMany({});
    await this.authModel.deleteMany({});
    await this.userModel.deleteMany({});
  }
}
