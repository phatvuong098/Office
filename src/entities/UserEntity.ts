import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class User extends BaseEntity {
    @Property() username!: string;
    @Property() x: number = 0;
    @Property() y: number = 0;
    @Property() time: number = 0;
}