import { Column } from 'typeorm';

export abstract class BaseModel {
    @Column({ name: 'created_date', type: 'timestamp'})
    public createdDate: Date;

    @Column({ name: 'modified_date', type: 'timestamp', nullable: true})
    public modifiedDate: Date;
}