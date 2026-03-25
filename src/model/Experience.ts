import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { User } from './User';

@Entity('tbl_experience')
export class Experience extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'company_name' })
    public companyName: string;

    @Column({ name: 'role' })
    public role: string;

    @Column({ name: 'start_date' })
    public startDate: Date;

    @Column({ name: 'end_date' })
    public endDate: Date;

    @Column({ name: 'created_by' })
    public createdBy: number;

    @Column({ name: 'modified_by' })
    public modifiedBy: number;

    @ManyToOne(type => User, user => user.experience)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    public user: User;

    @BeforeInsert()
    public async createdDetails() {
        this.createdDate = new Date();
    }

    @BeforeUpdate()
    public async updatedDetails() {
        this.modifiedDate = new Date();
    }
}