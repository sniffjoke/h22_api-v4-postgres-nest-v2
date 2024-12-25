import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


@Entity('blogs')
export class BlogEntity {

    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    websiteUrl: string;

    @Column({default: false})
    isMembership: boolean;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: string;

}
