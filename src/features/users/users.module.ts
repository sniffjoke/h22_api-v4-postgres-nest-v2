import { Module } from '@nestjs/common';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersController } from './api/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UuidModule } from 'nestjs-uuid';
import { CryptoModule } from '../../core/modules/crypto/crypto.module';
import { UsersQueryRepository } from './infrastructure/users.query-repositories';
import { UsersCommandHandlers } from './application/useCases';
import { UserEntity } from './domain/user.entity';
import { EmailConfirmationEntity } from './domain/email-confirmation.entity';
import { UsersRepositoryTO } from './infrastructure/users.repository.to';
import { UsersQueryRepositoryTO } from './infrastructure/users.query-repositories.to';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, EmailConfirmationEntity]),
    CryptoModule,
    UuidModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UsersRepositoryTO,
    UsersQueryRepositoryTO,
    ...UsersCommandHandlers,
  ],
  exports: [
    CryptoModule,
    UuidModule,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    UsersRepositoryTO,
    UsersQueryRepositoryTO,
    ...UsersCommandHandlers,
  ],
})
export class UsersModule {
}