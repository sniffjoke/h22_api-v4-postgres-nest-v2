import { forwardRef, Module } from "@nestjs/common";
import { PostsController } from "./api/posts.controller";
import { PostsService } from "./application/posts.service";
import { PostsRepository } from "./infrastructure/posts.repository";
import { PostsQueryRepository } from "./infrastructure/posts.query-repository";
import { BlogsModule } from "../blogs/blogs.module";
import { CommentsModule } from "../comments/comments.module";
import { UsersModule } from '../users/users.module';
import { TokensService } from '../tokens/application/tokens.service';
import { LikesModule } from '../likes/likes.module';
import { PostsCommandHandlers } from './application/useCases';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtendedLikesInfoEntity } from './domain/extended-likes-info.entity';
import { PostsRepositoryTO } from './infrastructure/posts.repository.to';
import { PostEntity } from './domain/posts.entity';
import { PostsQueryRepositoryTO } from './infrastructure/posts.query-repository.to';
import { LikeEntity } from '../likes/domain/likes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, ExtendedLikesInfoEntity, LikeEntity]),
    forwardRef(() => BlogsModule),
    CommentsModule,
    UsersModule,
    LikesModule
  ],
  controllers: [PostsController],
  providers: [
    PostsRepository,
    PostsRepositoryTO,
    PostsQueryRepository,
    PostsQueryRepositoryTO,
    TokensService,
    PostsService,
    ...PostsCommandHandlers
  ],
  exports: [
    forwardRef(() => BlogsModule),
    PostsRepository,
    PostsRepositoryTO,
    PostsQueryRepository,
    PostsQueryRepositoryTO,
    PostsService,
    ...PostsCommandHandlers
  ],
})
export class PostsModule {}
