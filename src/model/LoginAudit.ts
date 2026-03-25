import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('tbl_login_audit_log')
export class LoginAudit {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'login_time' })
    public loginTime: Date;

    @Column({ name: 'logout_time' })
    public logoutTime: Date;

    @ManyToOne(type => User, user => user.audit)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id'})
    public users: User[];
}