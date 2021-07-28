import {MikroOrmModuleOptions, MikroOrmOptionsFactory} from "@mikro-orm/nestjs";
import {Injectable} from "@nestjs/common";
import mikroormconfig from "./mikro-orm.config";

@Injectable()
export class MikroOrmConfigService implements MikroOrmOptionsFactory {
  createMikroOrmOptions(): MikroOrmModuleOptions {
    return {
      ...mikroormconfig,
      // keepConnectionAlive: process.env.NODE_ENV === "test",
    };
  }
}
