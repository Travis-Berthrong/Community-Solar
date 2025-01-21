import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    Id!: number;

    @Column()
    FirstName!: string;

    @Column()
    LastName!: string;

    @Column()
    Email!: string;

    @Column()
    PasswordHash!: string;

    @Column()
    Address!: string;

    @Column()
    PhoneNumber!: string;

}
    
