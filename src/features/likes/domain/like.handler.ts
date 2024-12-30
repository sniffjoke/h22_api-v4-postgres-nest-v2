import { Injectable } from '@nestjs/common';
import { LikeStatus } from '../../posts/api/models/output/post.view.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LikeEntity } from './likes.entity';


@Injectable()
export class LikeHandler {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    @InjectRepository(LikeEntity) private readonly lRepository: Repository<LikeEntity>,
  ) {
  }

  async postHandler(likeStatus: LikeStatus, post: any, user: any) {
    const isLikeObjectForCurrentUserExists: any | null = await this.lRepository.findOne({
      where: { userId: user.id, postId: post.id },
    });
    if (!isLikeObjectForCurrentUserExists) {
      const newLike = await this.lRepository.insert({
        status: LikeStatus.None,
        userId: user.id,
        postId: post.id,
      });
    }
    const findedLike = await this
      .lRepository.findOne({
        where: { userId: user.id, postId: post.id },
        relations: ['post.extendedLikesInfo'],
    })
    // Пессимистическая блокировка
    if (findedLike) {
      if (findedLike.status === likeStatus) {
        const updateLikeStatus = null;
      } else {
        findedLike.status = likeStatus
        const updateLikeStatus = await this.lRepository.manager.save(findedLike)
        if (likeStatus === LikeStatus.Like) {
          if (findedLike.post.extendedLikesInfo.dislikesCount > 0 && findedLike.status === LikeStatus.Dislike) {
            findedLike.post.extendedLikesInfo.likesCount++;
            findedLike.post.extendedLikesInfo.dislikesCount--;
            const updatePostInfo = await this.lRepository.manager.save(findedLike)
          } else {
            findedLike.post.extendedLikesInfo.likesCount++;
            const updatePostInfo = await this.lRepository.manager.save(findedLike)
          }
        }
        if (likeStatus === LikeStatus.Dislike) {
          if (findedLike.post.extendedLikesInfo.likesCount > 0 && findedLike.status === LikeStatus.Like) {
            findedLike.post.extendedLikesInfo.likesCount--;
            findedLike.post.extendedLikesInfo.dislikesCount++;
            const updatePostInfo = await this.lRepository.manager.save(findedLike)
          } else {
            findedLike.post.extendedLikesInfo.dislikesCount++;
            const updatePostInfo = await this.lRepository.manager.save(findedLike)
          }
        }

        if (likeStatus === LikeStatus.None) {
          if (findedLike.status === LikeStatus.Like) {
            findedLike.post.extendedLikesInfo.likesCount--;
            const updatePostInfo = await this.lRepository.manager.save(findedLike)
          } else {
            findedLike.post.extendedLikesInfo.dislikesCount--;
            const updatePostInfo = await this.lRepository.manager.save(findedLike)
          }
        }
      }
    }
    //
  }

  async commentHandler(likeStatus: string, comment: any, user: any) {
    const isLikeObjectForCurrentUserExists: any | null = await this.dataSource.query(
      `
              SELECT * 
              FROM likes
              WHERE "userId" = $1 AND "commentId" = $2
      `,
      [
        user.id,
        comment.id,
      ],
    );
    if (!isLikeObjectForCurrentUserExists.length) {
      const newLike = await this.dataSource.query(
        `
                INSERT INTO likes ("status", "userId", "commentId") 
                VALUES ($1, $2, $3)
        `,
        [
          LikeStatus.None,
          user.id,
          comment.id,
        ],
      );
    }
    const findedLike: any | null = await this.dataSource.query(
      `
              SELECT l.*, i.* 
              FROM likes l
              INNER JOIN "likesInfo" i 
              ON l."commentId" = i."commentId"
              WHERE "userId" = $1 AND i."commentId" = $2
      `,
      [
        user.id,
        comment.id,
      ],
    );
    if (findedLike[0]?.status === likeStatus) {
      const updateLikeStatus = null;
    } else {
      const updateLikeStatus = await this.dataSource.query(
        `
                UPDATE likes 
                SET status = $1 
                WHERE "id" = $2
        `,
        [
          likeStatus,
          findedLike[0].id,
        ],
      );
      const dislikeCount = findedLike[0].dislikesCount;
      const likeCount = findedLike[0].likesCount;
      if (likeStatus === LikeStatus.Like) {
        if (dislikeCount > 0 && findedLike[0]?.status === LikeStatus.Dislike) {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "likesCount" = "likesCount" + 1, "dislikesCount" = "dislikesCount" - 1
                    WHERE "commentId" = $1
            `,
            [comment.id],
          );
        } else {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "likesCount" = "likesCount" + 1
                    WHERE "commentId" = $1
            `,
            [comment.id],
          );
        }
      }
      if (likeStatus === LikeStatus.Dislike) {
        if (likeCount > 0 && findedLike[0]?.status === LikeStatus.Like) {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "likesCount" = "likesCount" - 1, "dislikesCount" = "dislikesCount" + 1
                    WHERE "commentId" = $1
            `,
            [comment.id],
          );
        } else {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "dislikesCount" = "dislikesCount" + 1
                    WHERE "commentId" = $1
            `,
            [comment.id],
          );
        }
      }
      if (likeStatus === LikeStatus.None) {
        if (findedLike[0]?.status === LikeStatus.Like) {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "likesCount" = "likesCount" - 1
                    WHERE "commentId" = $1
            `,
            [comment.id],
          );
        } else {
          const updateCommentInfo = await this.dataSource.query(
            `
                    UPDATE "likesInfo" 
                    SET "dislikesCount" = "dislikesCount" - 1
                    WHERE "commentId" = $1
            `,
            [comment.id],
          );
        }
      }
    }
  }

}
