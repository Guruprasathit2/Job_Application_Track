import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { User } from './User';

@Entity('tbl_role')
export class Role extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'role_name' })
    public roleName: string;

    @Column({ name: 'role_slug' })
    public roleSlug: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'created_by' })
    public createdBy: number;

    @Column({ name: 'modified_by' })
    public modifiedBy: number;

    @OneToMany(type => User, user => user.role)
    public users: User[];

    @BeforeInsert()
    public async createdDetails() {
        this.createdDate = new Date();
    }

    @BeforeUpdate()
    public async updatedDetails() {
        this.modifiedDate = new Date();
    }
}