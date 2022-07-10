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

    return await this._emailTemplateRepository.save(emailDetails);
  }

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async sendEmail() {
    try {
      const selectedMailTemplate = await this._emailTemplateRepository.find({
        where: { isSent: 'N' },
      });

      async function getUserEmailId(groupName) {
        const entityManager = getManager();
        return await entityManager.query(
          `select email  from "tblGroups" tg  inner join "tblUsers" tu on tu."groupId" = tg.id where "groupName" = '${groupName}'`,
        );
      }

      async function getUserEmailIdList() {
        let completeMailTemplateDetails: any[] = [];
        await Promise.all(
          selectedMailTemplate.map(async (mailTemplate) => {
            let currentGrpEmailIdArray = [];
            let currentGrpEmailIdObject = {};
            if (
              new Date(mailTemplate['ScheduleDate']).getDate() ===
              new Date().getDate()
            ) {
              mailTemplate['attachment'] = JSON.parse(
                mailTemplate['attachment'],
              );
              mailTemplate['groupName'] = JSON.parse(mailTemplate['groupName']);

              let currentGrpUserEmailId = [];
              for (let i = 0; i < mailTemplate.groupName.length; i++) {
                const emailIdList = await getUserEmailId(
                  mailTemplate.groupName[i],
                );
                emailIdList.map((emailId) =>
                  currentGrpUserEmailId.push(emailId),
                );
              }
              currentGrpUserEmailId.map((emailId) => {
                currentGrpEmailIdArray.push(emailId.email);
                currentGrpEmailIdObject['email'] = currentGrpEmailIdArray;
              });
              completeMailTemplateDetails.push(currentGrpEmailIdObject);
            }
          }),
        );
        return completeMailTemplateDetails;
      }
      const completeMailTemplateDetails = await getUserEmailIdList();

      selectedMailTemplate.map((mailTemplate, index) => {
        let attachmentArray = [];
        for (let i = 0; i < mailTemplate['attachment'].length; i++) {
          attachmentArray.push({
            filename: `attachment-${i + 1}.${
              mailTemplate['attachment'][i]['type'].split('/')[1]
            }`,
            type: mailTemplate['attachment'][i]['type'],
            content: mailTemplate['attachment'][i]['base64File'].split(',')[1],
            disposition: 'inline',
            content_id: `image-${i + 1}`,
          });
        }

        completeMailTemplateDetails[index]['attachment'] = attachmentArray;
        completeMailTemplateDetails[index]['content'] = mailTemplate['content'];
        completeMailTemplateDetails[index]['id'] = mailTemplate['id'];
      });

      async function sendEmail(sendGridClient, emailTemplateRepository) {
        const mailAttachment = [];
        const id: number[] = [];
        let error: boolean = false;
        completeMailTemplateDetails.map((details) => {
          id.push(details.id);
          for (let i = 0; i < details.email.length; i++) {
            mailAttachment.push({
              to: details.email[i],
              subject: 'Hello',
              from: process.env.FromMail,
              text: details.content,
              attachments: details.attachment,
            });
          }
        });

        await Promise.all(
          mailAttachment.map(async (details, index) => {
            return await sendGridClient
              .send(details)
              .then(async (response) => {
                if (response[0].statusCode === 202) {
                  await emailTemplateRepository.update(
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

      const response = await sendEmail(
        this.client,
        this._emailTemplateRepository,
      );
      return response;
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
    }
  }
}
