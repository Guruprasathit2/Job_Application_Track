import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Job } from './Job';

@Entity('tbl_job_applied')
export class JobApplied extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'job_id' })
    public jobId: string;

    @Column({ name: 'status' })
    public status: string;

    @Column({ name: 'reason' })
    public reason: string;

    @Column({ name: 'created_by' })
    public createdBy: number;

    @Column({ name: 'modified_by' })
    public modifiedBy: number;

    @ManyToOne(type => Job, job => job.jobApplications)
    @JoinColumn({ name: 'job_id' })
    public job: Job;

    @BeforeInsert()
    public async createdDetails() {
        this.createdDate = new Date();
    }

    @BeforeUpdate()
    public async updatedDetails() {
        this.modifiedDate = new Date();
    }
}