import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostCreateModelWithParams } from '../../../posts/api/models/input/create-post.input.model';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { BlogsRepositoryTO } from '../../infrastructure/blogs.repository.to';

export class UpdatePostWithBlogInParamsCommand {
  constructor(
    public postId: string,
    public blogId: string,
    public dto: PostCreateModelWithParams
  ) {
  }

}

@CommandHandler(UpdatePostWithBlogInParamsCommand)
export class UpdatePostWithBlogInParamsUseCase
  implements ICommandHandler<UpdatePostWithBlogInParamsCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepositoryTO,
    private readonly postsRepository: PostsRepository
  ) {
  }

  async execute(command: UpdatePostWithBlogInParamsCommand) {
    const findedBlog = await this.blogsRepository.findBlogById(command.blogId)
    const updatePost = await this.postsRepository.updatePostFromBlogsUri(command.postId, command.blogId, command.dto)
    return updatePost
  }
}
