import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core"
import options from './mikro-orm.config';
import { User } from "../entities/UserEntity";

export const DI = {} as {
    orm: MikroORM,
    em: EntityManager,
    userRepository: EntityRepository<User>
};

export async function connect() {

    options.clientUrl = process.env.DEMO_DATABASE

    DI.orm = await MikroORM.init(options);

    DI.em = DI.orm.em;
}