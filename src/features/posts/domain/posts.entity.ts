import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from '../../blogs/domain/blogs.entity';
import { CommentEntity } from '../../comments/domain/comment.entity';


@Entity('posts')
export class PostEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    title: string;

    @Column()
    shortDescription: string;

    @Column()
    content: string;

    @Column()
    blogId: string;

    @Column()
    blogName: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;

    @ManyToOne(() => BlogEntity, (blog) => blog.posts, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'blogId' })
    blog: BlogEntity;

    @OneToMany(() => CommentEntity, (comment) => comment.post, {cascade: true})
    comments: CommentEntity[];
}
