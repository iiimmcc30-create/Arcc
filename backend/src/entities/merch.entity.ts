import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type MerchCategory = 'jersey' | 'hoodie' | 'cap' | 'accessory';

@Entity('merch_items')
export class MerchItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'description_ar', type: 'text' })
  descriptionAr: string;

  @Column({ type: 'varchar', default: 'jersey' })
  category: MerchCategory;

  @Column()
  price: string;

  @Column()
  image: string;

  @Column({ type: 'text', array: true, default: '{}' })
  colors: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  sizes: string[];

  @Column({ default: true })
  featured: boolean;

  @Column({ default: true })
  available: boolean;

  @Column({ default: 0 })
  sortOrder: number;
}
