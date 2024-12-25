import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query, Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogCreateModel } from './models/input/create-blog.input.model';
import { PostCreateModelWithParams } from '../../posts/api/models/input/create-post.input.model';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';
import { BasicAuthGuard } from '../../../core/guards/basic-auth.guard';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/useCases/create-blog.use-case';
import { UpdateBlogCommand } from '../application/useCases/update-blog.use-case';
import { DeleteBlogCommand } from '../application/useCases/delete-blog.use-case';
import {
  UpdatePostWithBlogInParamsCommand,
} from '../application/useCases/update-post-from-blogs-in-params.use-case';
import { DeletePostWithBlogInParamsCommand } from '../application/useCases/delete-post-from-blogs-in-params.use-case';
import { CreatePostCommand } from '../../posts/application/useCases/create-post.use-case';

@Controller()
export class BlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {
  }

// TODO: метод execute pattern (service)

  @Get('blogs')
  async getAll(@Query() query: any) {
    const blogsWithQuery = await this.blogsQueryRepository.getAllBlogsWithQuery(query);
    return blogsWithQuery;
  }

  @Get('blogs/:id')
  async getBlogById(@Param('id') id: string) {
    const blog = await this.blogsQueryRepository.blogOutput(id);
    return blog;
  }

  @Get('blogs/:id/posts')
  async getAllPostsByBlogId(@Param('id') id: string, @Query() query: any, @Req() req: Request) {
    const posts = await this.postsQueryRepository.getAllPostsWithQuery(query, id);
    const newData = await this.postsService.generatePostsWithLikesDetails(posts.items, req.headers.authorization as string);
    return {
      ...posts,
      items: newData,
    };
  }

  // --------------------- SA ------------------------ //
  @Get('sa/blogs')
  @UseGuards(BasicAuthGuard)
  async getAllBlogs(@Query() query: any) {
    const blogsWithQuery = await this.blogsQueryRepository.getAllBlogsWithQuery(query);
    return blogsWithQuery;
  }

  @Post('sa/blogs')
  @UseGuards(BasicAuthGuard)
  async createBlog(@Body() dto: BlogCreateModel) {
    const blogId = await this.commandBus.execute(new CreateBlogCommand(dto));
    const newBlog = await this.blogsQueryRepository.blogOutput(blogId);
    return newBlog;
  }

  @Put('sa/blogs/:id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updateBlogById(@Param('id') id: string, @Body() dto: BlogCreateModel) {
    const updateBlog = await this.commandBus.execute(new UpdateBlogCommand(id, dto));
    return updateBlog;
  }

  @Delete('sa/blogs/:id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deleteBlog(@Param('id') id: string) {
    const deleteBlog = await this.commandBus.execute(new DeleteBlogCommand(id));
    return deleteBlog;
  }

  // --------------------- SA/posts ------------------------ //

  @Get('sa/blogs/:id/posts')
  async getAllPostsWithBlogId(@Param('id') id: string, @Query() query: any, @Req() req: Request) {
    const posts = await this.postsQueryRepository.getAllPostsWithQuery(query, id);
    const newData = await this.postsService.generatePostsWithLikesDetails(posts.items, req.headers.authorization as string);
    return {
      ...posts,
      items: newData,
    };
  }

  @Post('sa/blogs/:id/posts')
  @UseGuards(BasicAuthGuard)
  async createPostWithParams(@Body() dto: PostCreateModelWithParams, @Param('id') blogId: string, @Req() req: Request) {
    const postId = await this.commandBus.execute(new CreatePostCommand({ ...dto, blogId }));
    const newPost = await this.postsQueryRepository.postOutput(postId);
    const postWithDetails = await this.postsService.generateOnePostWithLikesDetails(newPost, req.headers.authorization as string);
    return postWithDetails;
  }

  @Put('sa/blogs/:blogId/posts/:postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updatePost(@Body() dto: PostCreateModelWithParams, @Param() idParams: any) {
    const updatePost = await this.commandBus.execute(new UpdatePostWithBlogInParamsCommand(idParams.postId, idParams.blogId, dto));
    return updatePost;
  }

  @Delete('sa/blogs/:blogId/posts/:postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deletePost(@Param() idParams: any) {
    const deletePost = await this.commandBus.execute(new DeletePostWithBlogInParamsCommand(idParams.postId, idParams.blogId));
    return deletePost;
  }

}
