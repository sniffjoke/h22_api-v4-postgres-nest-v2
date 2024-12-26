import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from '../../blogs/domain/blogs.entity';


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
}
