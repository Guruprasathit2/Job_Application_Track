import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity('tbl_job_skill')
export class JobSkill {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'skill' })
    public skill: string;

    @Column({ name: 'created_date', type: 'timestamp' })
    public createdDate: Date;

    @BeforeInsert()
    public setCreatedDate() {
        this.createdDate = new Date();
    }
}