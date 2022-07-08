import { Body, Controller, Get, Post } from '@nestjs/common';
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
  sendEmail(/* @Body() _createEmailTemplateDto: CreateEmailTemplateDto */) {
    return this.emailTemplateService.sendEmail(/* _createEmailTemplateDto */);
  }
}
