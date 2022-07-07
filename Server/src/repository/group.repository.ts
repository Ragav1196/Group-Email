import { Group } from 'src/entities/group.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
    
}
