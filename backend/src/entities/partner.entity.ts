import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('partners')
export class Partner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  logo: string;

  @Column({ type: 'varchar', nullable: true  })
  url: string | null;

  @Column({ default: 0 })
  sortOrder: number;
}
