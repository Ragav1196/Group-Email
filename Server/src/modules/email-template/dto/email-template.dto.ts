import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  // @IsString()
  attachment: string[];

  @IsNotEmpty()
  groupName: string[];

  @IsNotEmpty()
  ScheduleDate: string;
}
