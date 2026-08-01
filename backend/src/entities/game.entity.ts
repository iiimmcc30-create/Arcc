import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Team } from './team.entity';
import { Player } from './player.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ name: 'name_ar' })
  nameAr: string;

  @Column()
  image: string;

  @Column({ default: 0 })
  players: number;

  @Column({ default: 0 })
  tournaments: number;

  @Column({ type: 'text' })
  desc: string;

  @Column({ name: 'desc_en', type: 'text' })
  descEn: string;

  @OneToMany(() => Team, (team) => team.gameEntity)
  teams: Team[];

  @OneToMany(() => Player, (player) => player.gameEntity)
  playerEntities: Player[];
}
