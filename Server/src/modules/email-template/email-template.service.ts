import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { getManager, Repository } from 'typeorm';
import { EmailTemplateRepository } from '../../repository/email-template.repository';
import { config } from 'dotenv';
import { Flags } from 'src/entities/email-template.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
config();

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectRepository(EmailTemplateRepository)
    private readonly _emailTemplateRepository: EmailTemplateRepository,
    @InjectSendGrid() private readonly client: SendGridService,
  ) {}

  async scheduleEmail(emailDetails) {
    emailDetails.groupName = JSON.stringify(emailDetails.groupName);
    emailDetails.attachment = JSON.stringify(emailDetails.attachment);
    emailDetails.ScheduleDate = new Date(emailDetails.ScheduleDate);

    return await this._emailTemplateRepository.save(emailDetails);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendEmail() {
    try {
      const mailToSend = await this._emailTemplateRepository.find({
        where: { isSent: 'N' },
      });

      mailToSend.map(async (toSend) => {
        console.log(
          new Date(toSend['ScheduleDate']).getDate() === new Date().getDate(),
        );
        if (
          new Date(toSend['ScheduleDate']).getDate() === new Date().getDate()
        ) {
          toSend['attachment'] = JSON.parse(toSend['attachment']);
          toSend['groupName'] = JSON.parse(toSend['groupName']);

          const attachment = [];

          for (let i = 0; i < toSend['attachment'].length; i++) {
            attachment.push({
              filename: `attachment-${i + 1}.${
                toSend['attachment'][i]['type'].split('/')[1]
              }`,
              type: toSend['attachment'][i]['type'],
              content: toSend['attachment'][i]['base64File'].split(',')[1],
              disposition: 'inline',
              content_id: `image-${i + 1}`,
            });
          }

          let userEmails: string[] = [];

          for (let i = 0; i < toSend.groupName.length; i++) {
            const entityManager = getManager();
            const res = await entityManager.query(
              `select email  from "tblGroups" tg  inner join "tblUsers" tu on tu."groupId" = tg.id where "groupName" = '${toSend.groupName[i]}'`,
            );
            userEmails.push(...res);
          }

          userEmails.map(async (mails) => {
            console.log(mails['email']);
            const mail = {
              to: mails['email'],
              subject: 'Hello',
              from: process.env.FromMail,
              text: toSend['content'],
              attachments: attachment,
            };
            await this.client.send(mail);
          });

          await this._emailTemplateRepository.update(
            { id: toSend['id'] },
            { isSent: Flags.Y },
          );
          console.log('Test email sent successfully');
        }
      });
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
    }
  }
}
