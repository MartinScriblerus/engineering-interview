import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class SomeEntity {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    someCol: string
}