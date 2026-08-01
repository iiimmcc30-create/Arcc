import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type MediaCategory = 'latest' | 'highlights' | 'creators' | 'tournaments';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'title_ar' })
  titleAr: string;

  @Column()
  thumbnail: string;

  @Column({ type: 'varchar', nullable: true  })
  videoUrl: string | null;

  @Column({ type: 'varchar', default: 'latest' })
  category: MediaCategory;

  @Column({ type: 'varchar', nullable: true  })
  creator: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
