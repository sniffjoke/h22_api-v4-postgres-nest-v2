import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { PostEntity } from './posts.entity';

@Entity('extendedLikesInfo')
export class ExtendedLikesInfoEntity {

  @PrimaryColumn()
  postId: string


  @Column({default: 0})
  likesCount: number;

  @Column({default: 0})
  dislikesCount: number

  @OneToOne(() => PostEntity, {cascade: true})
  @JoinColumn()
  post: PostEntity;

}
