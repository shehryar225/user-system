import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';

@Entity({name:"user"})

export class User
{
    @PrimaryGeneratedColumn()
    id:number

    @Column({type:"varchar", length:225,name:"first_name",nullable:false})
    firstName:string

    
    @Column({type:"varchar", length:225,name:"last_name",nullable:false})
    lastName:string

    @Column({type:"varchar",unique:true, length:225,name:"user_name",nullable:false})
    userName:string

    @Column({type: 'varchar', length: 255,name:"email",unique:true,nullable:false})
    email:string

    @Column({type:'varchar', length: 255,name:"password"})
    password:string

    @BeforeInsert()
    async hashPassword() {     
      this.password = await bcrypt.hash(this.password, 10);
    }
}