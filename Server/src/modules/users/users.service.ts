import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupsService } from '../groups/groups.service';
import { userRepository } from '../../repository/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(userRepository)
    private readonly _userRepository: Repository<userRepository>,
    private readonly _groupService: GroupsService,
  ) {}

  async createUser(userDetails) {
    const res = await this._groupService.findGroupByName(userDetails.groupName);

    delete userDetails.groupName;
    userDetails.groupId = res['id'];

    return await this._userRepository.save(userDetails);
  }
}
