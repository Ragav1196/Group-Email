import { IsNotEmpty, IsString } from 'class-validator';

export class groupDto {
  @IsNotEmpty()
  @IsString()
  groupName: string;
}
