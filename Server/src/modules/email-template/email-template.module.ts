import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { EmailTemplateController } from './email-template.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailTemplateRepository } from '../../repository/email-template.repository';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailTemplateRepository]),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (cfg: ConfigService) => ({
        apiKey: cfg.get('SEND_GRID_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailTemplateController],
  providers: [EmailTemplateService],
})
export class EmailTemplateModule {}
