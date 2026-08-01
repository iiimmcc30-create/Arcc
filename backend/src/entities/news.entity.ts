import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'title_en' })
  titleEn: string;

  @Column({ type: 'text' })
  summary: string;

  @Column({ name: 'summary_en', type: 'text' })
  summaryEn: string;

  @Column({ type: 'date' })
  date: string;

  @Column()
  category: string;

  @Column({ name: 'category_en' })
  categoryEn: string;

  @Column()
  image: string;
}
