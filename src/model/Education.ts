import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { BaseModel } from './BaseModel';

@Entity('tbl_education')
export class Education extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'college_name' })
    public collegeName: string;

    @Column({ name: 'start_date' })
    public startDate: Date;

    @Column({ name: 'end_date' })
    public endDate: Date;

    @Column({ name: 'course'})
    public course: string;

    @Column({ name: 'score' })
    public score: string;

    @Column({ name: 'created_by' })
    public createdBy: number;

    @Column({ name: 'modified_by' })
    public modifiedBy: number;

    @ManyToOne(type => User, user => user.educations)
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