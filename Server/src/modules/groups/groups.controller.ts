import { Controller, Get, Post, Body } from '@nestjs/common';
import { groupDto } from './dto/create-groups.dto';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly _groupsService: GroupsService) {}

  @Post('create')
  createGroup(@Body() _groupDto: groupDto) {
    return this._groupsService.createGroup(_groupDto);
  }

  @Get('get-groups')
  getAllGroup() {
    return this._groupsService.getAllGroup();
  }
}
