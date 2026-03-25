import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Company } from './Company';
import { JobApplied } from './JobApplied';

@Entity('tbl_job')
export class Job extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'company_id' })
    public companyId: number;

    @Column({ name: 'role_name' })
    public roleName: string;

    @Column({ name: 'description' })
    public description: string;

    @Column({ name: 'skill_id' })
    public skillId: string;

    @Column({ name: 'no_of_application' })
    public noOfApplication: number;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'is_delete' })
    public isDelete: number;

    @Column({ name: 'created_by' })
    public createdBy: number;

    @Column({ name: 'modified_by' })
    public modifiedBy: number;

    @ManyToOne(type => Company, company => company.jobs)
    @JoinColumn({ name: 'company_id' })
    public company: Company;

    @OneToMany(type => JobApplied, jobApplications => jobApplications.job)
    public jobApplications: JobApplied[];

    @BeforeInsert()
    public async createdDetails() {
        this.createdDate = new Date();
    }

    @BeforeUpdate()
    public async updatedDetails() {
        this.modifiedDate = new Date();
    }
}