import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  attachment: string[];

  @IsNotEmpty()
  groupName: string[];

  @IsNotEmpty()
  ScheduleDate: string;
}
