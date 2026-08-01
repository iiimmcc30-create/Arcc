import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';
import { Team } from './team.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  game: string;

  @Column({ type: 'int', nullable: true })
  gameId: number | null;

  @ManyToOne(() => Game, (g) => g.playerEntities, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'gameId' })
  gameEntity: Game | null;

  @Column({ type: 'int', nullable: true })
  teamId: number | null;

  @ManyToOne(() => Team, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'teamId' })
  team: Team | null;

  @Column()
  country: string;

  @Column({ name: 'country_en' })
  countryEn: string;

  @Column({ default: '' })
  flag: string;

  @Column()
  role: string;

  @Column()
  rank: string;

  @Column()
  image: string;

  @Column({ type: 'text', array: true, default: '{}' })
  achievements: string[];

  @Column({ name: 'achievements_en', type: 'text', array: true, default: '{}' })
  achievementsEn: string[];

  @Column({ type: 'jsonb', default: {} })
  social: Record<string, string>;
}
