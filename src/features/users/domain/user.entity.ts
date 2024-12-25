import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  login: string

  @Column()
  email: string

  @Column()
  password: string

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: string

  // @OneToOne(() => EmailConfirmationEntity, (emailConfirmation) => emailConfirmation.user, {cascade: true})
  // @JoinColumn()
  // emailConfirmation: EmailConfirmationEntity

}
