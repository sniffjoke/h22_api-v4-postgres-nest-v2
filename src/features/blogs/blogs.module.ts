import { Module } from "@nestjs/common";
import { BlogsController } from "./api/blogs.controller";
import { BlogsRepository } from "./infrastructure/blogs.repository";
import { BlogsQueryRepository } from "./infrastructure/blogs.query-repository";
import { PostsModule } from "../posts/posts.module";
import { BlogsCommandHandlers } from './application/useCases';
import { BlogsRepositoryTO } from './infrastructure/blogs.repository.to';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './domain/blogs.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogEntity]),
    PostsModule,
  ],
  controllers: [BlogsController],
  providers: [
    BlogsRepository,
    BlogsQueryRepository,
    BlogsRepositoryTO,
    ...BlogsCommandHandlers
  ],
  exports: [
    BlogsRepository,
    BlogsQueryRepository,
    BlogsRepositoryTO,
    ...BlogsCommandHandlers
  ]
})
export class BlogsModule {
}
