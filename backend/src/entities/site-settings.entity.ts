import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'ARC Esports' })
  brandName: string;

  @Column({ default: 'نصنع الأبطال… ونبني مستقبل صناع المحتوى.' })
  taglineAr: string;

  @Column({ default: 'We create champions… and build the future of content creators.' })
  taglineEn: string;

  @Column({ type: 'jsonb', default: {} })
  social: Record<string, string>;

  @Column({ type: 'jsonb', default: {} })
  stats: Record<string, number>;

  @Column({ type: 'varchar', nullable: true  })
  contactEmail: string | null;

  @Column({ type: 'varchar', nullable: true  })
  heroVideoUrl: string | null;
}
