import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateEmailTemplateDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  // @IsArray()
  attachment: string[];

  // @IsNotEmpty()
  // @IsArray()
  groupName: string[];

  @IsNotEmpty()
  @IsString()
  ScheduleDate: string;
}
