// import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
// import { CommentEntity } from './comment.entity';
// import { UserEntity } from '../../users/domain/user.entity';
//
// @Entity('сommentatorInfo')
// export class CommentatorInfoEntity {
//
//   @PrimaryColumn()
//   commentId: string;
//
//   @Column()
//   userId: string;
//
//   @Column()
//   userLogin: boolean;
//
//   @OneToOne(() => CommentEntity, { cascade: true })
//   @JoinColumn({name: 'commentId'})
//   comment: CommentEntity;
//
// }
