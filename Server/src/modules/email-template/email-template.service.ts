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

      async function getUserName(groupName) {
        const entityManager = getManager();
        return await entityManager.query(
          `select email  from "tblGroups" tg  inner join "tblUsers" tu on tu."groupId" = tg.id where "groupName" = '${groupName}'`,
        );
      }

      async function getUserEmailList() {
        let userEmails: any[] = [];
        await Promise.all(
          mailToSend.map(async (toSend, index) => {
            let arr = [];
            let obj = {};
            if (
              new Date(toSend['ScheduleDate']).getDate() ===
              new Date().getDate()
            ) {
              toSend['attachment'] = JSON.parse(toSend['attachment']);
              toSend['groupName'] = JSON.parse(toSend['groupName']);

              let userEmail = [];
              for (let i = 0; i < toSend.groupName.length; i++) {
                const result = await getUserName(toSend.groupName[i]);
                result.map((r) => userEmail.push(r));
              }
              userEmail.map((u) => {
                arr.push(u.email);
                obj['email'] = arr;
              });
              userEmails.push(obj);
            }
          }),
        );
        return userEmails;
      }
      const res = await getUserEmailList();

      mailToSend.map((toSend, index) => {
        let arr = [];
        for (let i = 0; i < toSend['attachment'].length; i++) {
          arr.push({
            filename: `attachment-${i + 1}.${
              toSend['attachment'][i]['type'].split('/')[1]
            }`,
            type: toSend['attachment'][i]['type'],
            content: toSend['attachment'][i]['base64File'].split(',')[1],
            disposition: 'inline',
            content_id: `image-${i + 1}`,
          });
        }

        res[index]['attachment'] = arr;
        res[index]['content'] = toSend['content'];
        res[index]['id'] = toSend['id'];
      });

      async function final(client, _emailTemplateRepository) {
        const mail = [];
        let id = [];
        res.map((mails) => {
          id.push(mails.id);
          for (let i = 0; i < mails.email.length; i++) {
            mail.push({
              to: mails.email[i],
              subject: 'Hello',
              from: process.env.FromMail,
              text: mails.content,
              attachments: mails.attachment,
            });
          }
        });

        let error = false;

        await Promise.all(
          mail.map(async (c, index) => {
            return await client
              .send(c)
              .then(async (response) => {
                if (response[0].statusCode === 202) {
                  await _emailTemplateRepository.update(
                    { id: id[index] },
                    { isSent: Flags.Y },
                  );
                }
              })
              .catch((err) => {
                console.log(err);
                error = true;
              });
          }),
        );

        if (error) {
          return { Message: 'Mail Dispatch Unsuccessful' };
        } else {
          return { Message: 'Mail Dispatch Successful' };
        }
      }

      const resss = await final(this.client, this._emailTemplateRepository);
      return resss;
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
    }
  }
}
