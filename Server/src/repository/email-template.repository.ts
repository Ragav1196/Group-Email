import { EmailTemplate } from 'src/entities/email-template.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(EmailTemplate)
export class EmailTemplateRepository extends Repository<EmailTemplate> {}
