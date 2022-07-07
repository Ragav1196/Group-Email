import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { GroupsModule } from '../groups/groups.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userRepository } from '../../repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([userRepository]), GroupsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
