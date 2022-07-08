import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity,
} from 'typeorm';

export enum Flags {
  N = 'N',
  Y = 'Y',
}

@Entity({ name: 'tblEmailTemplate' })
export class EmailTemplate extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column()
  attachment: string;

  @Column()
  groupName: string;

  @Column()
  ScheduleDate: string;

  @Column({ default: Flags.N })
  isSent: Flags;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
