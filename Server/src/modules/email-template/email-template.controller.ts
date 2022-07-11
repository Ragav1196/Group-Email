import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateEmailTemplateDto } from './dto/email-template.dto';
import { EmailTemplateService } from './email-template.service';
@Controller('email')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  @Post('schedule')
  scheduleEmail(@Body() _createEmailTemplateDto: CreateEmailTemplateDto) {
    return this.emailTemplateService.scheduleEmail(_createEmailTemplateDto);
  }

  @Post('send-email')
  sendEmail() {
    return this.emailTemplateService.sendEmail();
  }

  @Post('post')
  @UseInterceptors(FileInterceptor('image'))
  postFile(@UploadedFile() file) {
    console.log(file)
  }
}
