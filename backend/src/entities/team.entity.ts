import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Game } from './game.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  game: string;

  @Column({ type: 'int', nullable: true })
  gameId: number | null;

  @ManyToOne(() => Game, (g) => g.teams, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'gameId' })
  gameEntity: Game | null;

  @Column()
  logo: string;

  @Column({ default: 0 })
  players: number;

  @Column()
  captain: string;

  @Column({ type: 'text', array: true, default: '{}' })
  achievements: string[];

  @Column({ name: 'achievements_en', type: 'text', array: true, default: '{}' })
  achievementsEn: string[];

  @Column({ type: 'text', array: true, default: '{}' })
  tournaments: string[];
}
