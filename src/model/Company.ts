import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { BaseModel } from './BaseModel';
import { Job } from './Job';

@Entity('tbl_company')
export class Company extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'company_name' })
    public companyName: string;

    @Column({ name: 'short_name' })
    public shortName: string;

    @Column({ name: 'company_email' })
    public email: string;

    @Column({ name: 'company_address' })
    public address: string;

    @Column({ name: 'website' })
    public website: string;

    @Column({ name: 'company_location' })
    public location: string;

    @Column({ name: 'industry_type' })
    public industryType: string;

    @Column({ name: 'linkdin_link' })
    public linkdin: string;

    @Column({ name: 'logo' })
    public logo: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'is_delete' })
    public isDelete: number;

    @Column({ name: 'created_by' })
    public createdBy: number;

    @Column({ name: 'modified_by' })
    public modifiedBy: number;

    @OneToMany(type => Job, job => job.company)
    public jobs: Job[];

    @BeforeInsert()
    public async createdDetails() {
        this.createdDate = new Date();
    }

    @BeforeUpdate()
    public async updatedDetails() {
        this.modifiedDate = new Date();
    }
}