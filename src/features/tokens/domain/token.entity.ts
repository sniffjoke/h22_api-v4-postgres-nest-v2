    import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
    import { UserEntity } from '../../users/domain/user.entity';


@Entity('tokens')
export class TokenEntity {

    @PrimaryGeneratedColumn()
    id: string

    @PrimaryColumn()
    userId: string;

    @Column()
    deviceId: string;

//TODO iat
    @Column()
    refreshToken: string;

    @Column()
    blackList: boolean;

    @ManyToOne(() => UserEntity, {onDelete: 'CASCADE'})
    @JoinColumn()
    user: UserEntity;

}
