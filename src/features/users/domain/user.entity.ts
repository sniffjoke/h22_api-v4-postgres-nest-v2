import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommentEntity } from '../../comments/domain/comment.entity';


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

  @OneToMany(() => CommentEntity, (comment) => comment.user, { cascade: true })
  comments: Comment[];

  // @OneToOne(() => EmailConfirmationEntity, (emailConfirmation) => emailConfirmation.user, {cascade: true})
  // @JoinColumn()
  // emailConfirmation: EmailConfirmationEntity

}
