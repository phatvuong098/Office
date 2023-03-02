import { Options } from "@mikro-orm/core"
import { User } from "../entities/UserEntity";

const options: Options = {
    type: "mongo",
    entities: [User],
    dbName: "Office"
}

export default options;