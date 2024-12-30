import { Injectable, NotFoundException } from '@nestjs/common';
import {CommentViewModel} from "../api/models/output/comment.view.model";
import { PaginationBaseModel } from '../../../core/base/pagination.base.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CommentEntity } from '../domain/comment.entity';
import { PostEntity } from '../../posts/domain/posts.entity';
import { TokensService } from '../../tokens/application/tokens.service';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { UsersRepositoryTO } from '../../users/infrastructure/users.repository.to';


@Injectable()
export class CommentsQueryRepositoryTO {
    constructor(
      @InjectDataSource() private readonly dataSource: DataSource,
      @InjectRepository(CommentEntity) private readonly cRepository: Repository<CommentEntity>,
      @InjectRepository(PostEntity) private readonly pRepository: Repository<PostEntity>,
      private readonly tokensService: TokensService,
      private readonly usersRepository: UsersRepositoryTO,
    ) {
    }

    async getAllCommentByPostIdWithQuery(query: any, postId: string, bearerHeader: any) {
        const generateQuery = await this.generateQuery(query, postId)
        const token = this.tokensService.getToken(bearerHeader);
        const decodedToken = this.tokensService.decodeToken(token);
        const user = await this.usersRepository.findUserById(decodedToken._id);
        const findedPost = await this.pRepository
          .createQueryBuilder('p')
          .where('p.id = :id', { id: postId })
          .getOne()
        if (!findedPost) {
            throw new NotFoundException(`Post with id ${postId} not found`);
        }
        const comments = await this.cRepository
          .createQueryBuilder('c')
          .innerJoinAndSelect('c.likesInfo', 'l')
          // .where('c.postId = :id', { id: postId })
          .getMany()
          // .dataSource.query(
          // `
          //       SELECT c.*, i.*, l.*
          //       FROM comments c
          //       INNER JOIN "commentatorInfo" i ON c."id" = i."commentId"
          //       INNER JOIN "likesInfo" l ON c."id" = l."commentId"
          //       WHERE "postId"=$1
          //       ORDER BY "${generateQuery.sortBy}" ${generateQuery.sortDirection}
          //       OFFSET $2
          //       LIMIT $3
          // `,
          // [
          //     postId,
          //     (generateQuery.page - 1) * generateQuery.pageSize,
          //     generateQuery.pageSize,
          // ],
        // )
        console.log('comments: ', comments);
        const commentsOutput = comments.map(item => this.commentOutputMap(item, user))
        console.log('commentsOutput: ', commentsOutput);
        const resultComments = new PaginationBaseModel<CommentViewModel>(generateQuery, commentsOutput)
        return resultComments
    }

    private async generateQuery(query: any, postId: string) {
        const totalCount = await this.dataSource.query(
          `
                SELECT COUNT(*) 
                FROM comments 
                WHERE "postId"=$1
            `,
          [
            postId
          ],
        )

        const pageSize = query.pageSize ? +query.pageSize : 10;
        const pagesCount = Math.ceil(Number(totalCount[0].count) / pageSize);
        return {
            totalCount: Number(totalCount[0].count),
            pageSize,
            pagesCount,
            page: query.pageNumber ? Number(query.pageNumber) : 1,
            sortBy: query.sortBy ? query.sortBy : 'createdAt',
            sortDirection: query.sortDirection ? query.sortDirection : 'desc'
        }
    }



    async commentOutput(id: string, user: any) {
        const findedComment = await this.cRepository
          .createQueryBuilder('c')
          .innerJoinAndSelect('c.likesInfo', 'l')
          .where('c.id = :id', { id: id })
          .getOne()
          // .dataSource.query(
          // `
          //           SELECT c.*, i.*, l.*
          //           FROM comments c
          //           INNER JOIN "commentatorInfo" i ON c."id" = i."commentId"
          //           INNER JOIN "likesInfo" l ON c."id" = l."commentId"
          //           WHERE "id" = $1
          // `,
          // [id]
        // )
        if (!findedComment) {
            throw new NotFoundException("Comment not found")
        }
        return this.commentOutputMap(findedComment, user)
    }

    commentOutputMap(comment: any, user: any) {
        console.log('comment: ', comment);
        const {id, content, likesInfo, createdAt} = comment
        return {
            id,
            content,
            commentatorInfo: {
                userId: user.id.toString(),
                userLogin: user.login
            },
            likesInfo: {
                likesCount: likesInfo.likesCount,
                dislikesCount: likesInfo.dislikesCount,
            },
            createdAt
        }
    }

}
