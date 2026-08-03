import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('creators')
export class Creator {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column({ type: 'text' })
  bio: string;

  @Column({ name: 'bio_en', type: 'text' })
  bioEn: string;

  /** Profile / portrait photo (URL or data URL). */
  @Column({ type: 'text', default: '' })
  image: string;

  @Column({ default: false })
  verified: boolean;

  @Column({ type: 'jsonb', default: {} })
  platforms: Record<string, string>;

  @Column({ type: 'jsonb', default: {} })
  social: Record<string, string>;
}
