import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { UserModel } from "./user.model";
import { AuthModel } from "../auth/auth.model";
import { TokenModel } from "../token/token.model";
import { UserRole, UserStatus } from "./interfaces";

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(UserModel)
    private userModel: typeof UserModel,
    @InjectModel(AuthModel)
    private authModel: typeof AuthModel,
    @InjectModel(TokenModel)
    private tokenModel: typeof TokenModel,
  ) {}

  public async setup(): Promise<UserModel> {
    let userModel = await this.userModel.findOne({ where: { email: "trejgun@gmail.com" } });

    if (!userModel) {
      userModel = this.userModel.build({
        firstName: "Trej",
        lastName: "Gun",
        email: "trejgun@gmail.com",
        password: "92f357f4a898825de204b25fffec4a0a1ca486ad1e25643502e33b5ebeefc3ff", // My5up3r5tr0ngP@55w0rd
      });
      userModel.roles = [UserRole.ADMIN];
      userModel.status = UserStatus.ACTIVE;
      await userModel.save();
    }

    return userModel;
  }

  public async teardown(): Promise<void> {
    await this.tokenModel.destroy({ where: {} });
    await this.authModel.destroy({ where: {} });
    await this.userModel.destroy({ where: {} });
  }
}
