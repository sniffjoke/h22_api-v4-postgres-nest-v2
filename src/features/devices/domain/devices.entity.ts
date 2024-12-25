import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/domain/user.entity';


@Entity('devices')
export class DeviceEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @PrimaryColumn()
    userId: string;

    @Column()
    deviceId: string;

    @Column()
    ip: string;

    @Column()
    title: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    lastActiveDate: string;

    @ManyToOne(() => UserEntity, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: UserEntity;

}
