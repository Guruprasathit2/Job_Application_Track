import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'tbl_staff_details' })
export class StaffDetails {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'staff_id' })
    public staffId: number;

    @Column({ type: 'varchar', length: 20, name: 'office_number' })
    public officeNumber: string;

    @Column({ type: 'varchar', length: 60, name: 'degination' })
    public degination: string;

    @Column({ type: 'varchar', length: 50, name: 'department' })
    public department: string;

    @Column({ type: 'varchar', length: 50, name: 'experience' })
    public experience: string;

    @OneToOne(() => User, user => user.staffDetails)
    @JoinColumn({ name: 'staff_id', referencedColumnName: 'id' })
    public user: User;
}