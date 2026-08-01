import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type TournamentStatus = 'active' | 'upcoming' | 'past';

@Entity('tournaments')
export class Tournament {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column({ type: 'varchar', default: 'upcoming' })
  status: TournamentStatus;

  @Column()
  image: string;

  @Column()
  game: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column()
  prize: string;

  @Column({ default: 0 })
  teams: number;
}
