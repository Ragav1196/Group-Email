import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  attachment: string[];

  @IsNotEmpty()
  groupName: string[];

  @IsNotEmpty()
  @IsString()
  ScheduleDate: string;
}
