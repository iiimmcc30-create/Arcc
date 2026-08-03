import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('uploads')
export class Upload {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimeType: string;

  @Column({ type: 'int', default: 0 })
  size: number;

  /** Public URL path, e.g. /uploads/abc.jpg */
  @Column()
  url: string;

  @Column({ type: 'varchar', nullable: true })
  uploadedBy: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
