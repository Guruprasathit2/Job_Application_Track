import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity('tbl_user_token')
export class Token {

    @PrimaryGeneratedColumn({ name: 'id' })
    public id: number;

    @Column({ name: 'token' })
    public token: string;

    @Column({ name: 'user_id' })
    public userId: number;

    @Column({ name: 'created_date' })
    public createdDate: Date;

    @ManyToOne(type => User, user => user.token)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id'})
    public users: User[];

    @BeforeInsert()
    public async createdDetails() {
        this.createdDate = new Date();
    }
}