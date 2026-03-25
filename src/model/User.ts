import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './Role';
import { Token } from './Token';
import { LoginAudit } from './LoginAudit';
import { BaseModel } from './BaseModel';
import { Education } from './Education';
import { Experience } from './Experience';
import { StaffDetails } from './StaffDetails';

@Entity('tbl_user')
export class User extends BaseModel {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_name' })
    public userName: string;

    @Column({ name: 'email_id' })
    public emailId: string;

    @Column({ name: 'password' })
    public password: string;

    @Column({ name: 'otp', nullable: true })
    public otp: string;

    @Column({ name: 'otp_expiry', type: 'timestamp', nullable: true })
    public otpExpiry: Date;

    @Column({ name: 'phone_number' })
    public phoneNumber: string;

    @Column({ name: 'role_id' })
    public roleId: number;

    @Column({ name: 'canidate_type' })
    public type: string;

    @Column({ name: 'company_id' })
    public companyId: number;

    @Column({ name: 'address' })
    public address: string;

    @Column({ name: 'file_path' })
    public filePath: string;

    @Column({ name: 'file_name' })
    public fileName: string;

    @Column({ name: 'date_of_birth' })
    public dateOfBirth: string;

    @Column({ name: 'is_active' })
    public isActive: number;

    @Column({ name: 'created_by' })
    public createdBy: number;

    @Column({ name: 'modified_by' })
    public modifiedBy: number;

    @OneToMany(type => Education, edu => edu.user)
    public educations: Education[];

    @OneToMany(type => Experience, edu => edu.user)
    public experience: Experience[];

    @OneToMany(type => Token, token => token.users)
    public token: Token[];

    @OneToMany(type => LoginAudit, audit => audit.users)
    public audit: LoginAudit[];

    @OneToOne(() => StaffDetails, staff => staff.user)
    public staffDetails: StaffDetails;

    @ManyToOne(type => Role, role => role.users)
    @JoinColumn({ name: 'role_id' })
    public role: Role;

    @BeforeInsert()
    public async createdDetails() {
        this.createdDate = new Date();
    }

    @BeforeUpdate()
    public async updatedDetails() {
        this.modifiedDate = new Date();
    }

}