import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupRepository } from '../../repository/group.repository';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupRepository)
    private readonly _groupsRepository: Repository<GroupRepository>,
  ) {}

  async createGroup(groupDetails) {
    return await this._groupsRepository.save(groupDetails);
  }

  async findGroupByName(name) {
    return await this._groupsRepository.findOne({
      where: { groupName: name },
    });
  }

  async getAllGroup() {
    const groups = await this._groupsRepository.find();
    const groupNames = groups.map((g) => g['groupName']);
    return groupNames;
  }
}
