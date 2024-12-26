import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('emailConfirmation')
export class EmailConfirmationEntity {

  @PrimaryColumn()
  userId: string


  @Column()
  isConfirm: boolean;

  @Column({nullable: true})
  confirmationCode: string

  // Foreign

  @Column({nullable: true})
  expirationDate: string

  // @OneToOne(() => UserEntity,(user) => user.emailConfirmation)
  @OneToOne(() => UserEntity, {onDelete: 'CASCADE'})
  @JoinColumn()
  user: UserEntity;

}
