import {createHash} from "crypto";
import {EntityRepository} from "@mikro-orm/postgresql";
import {Injectable, ConflictException} from "@nestjs/common";
import {InjectRepository} from "@mikro-orm/nestjs";
import {FilterQuery} from "@mikro-orm/core";

import {UserEntity} from "./user.entity";
import {IUserCreateFields} from "./interfaces";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: EntityRepository<UserEntity>,
  ) {}

  public findOne(where: FilterQuery<UserEntity>): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne(where);
  }

  public findAndCount(where: FilterQuery<UserEntity> = {}): Promise<[UserEntity[], number]> {
    return this.userEntityRepository.findAndCount(where);
  }

  public async getByCredentials(email: string, password: string): Promise<UserEntity | null> {
    return this.userEntityRepository.findOne({
      email,
      password: this.createPasswordHash(password, email),
    });
  }

  public async create(data: IUserCreateFields): Promise<UserEntity> {
    let user = await this.findOne({email: data.email});

    if (user) {
      throw new ConflictException();
    }

    user = this.userEntityRepository.create({
      ...data,
      password: this.createPasswordHash(data.password, data.email),
    });

    user.id = await this.userEntityRepository.nativeInsert(user);

    delete user.password;

    return user;
  }

  private createPasswordHash(password: string, salt: string): string {
    return createHash("sha256").update(password).update(salt).digest("hex");
  }
}
