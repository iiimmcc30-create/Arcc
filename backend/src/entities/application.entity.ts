import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ApplicationType = 'player' | 'team' | 'creator';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  type: ApplicationType;

  @Column({ type: 'varchar', default: 'pending' })
  status: ApplicationStatus;

  @Column()
  name: string;

  @Column({ type: 'varchar', nullable: true  })
  email: string | null;

  @Column({ type: 'varchar', nullable: true  })
  discord: string | null;

  @Column({ type: 'varchar', nullable: true  })
  country: string | null;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ type: 'varchar', nullable: true  })
  game: string | null;

  @Column({ type: 'varchar', nullable: true  })
  role: string | null;

  @Column({ type: 'varchar', nullable: true  })
  accountId: string | null;

  @Column({ type: 'varchar', nullable: true  })
  uid: string | null;

  @Column({ type: 'varchar', nullable: true  })
  rank: string | null;

  @Column({ type: 'text', nullable: true })
  achievements: string | null;

  @Column({ type: 'varchar', nullable: true  })
  profileLink: string | null;

  @Column({ type: 'text', nullable: true })
  message: string | null;

  @Column({ type: 'varchar', nullable: true  })
  teamName: string | null;

  @Column({ type: 'varchar', nullable: true  })
  captain: string | null;

  @Column({ type: 'int', nullable: true })
  playerCount: number | null;

  @Column({ type: 'varchar', nullable: true  })
  platform: string | null;

  @Column({ type: 'varchar', nullable: true  })
  followers: string | null;

  @Column({ type: 'jsonb', default: {} })
  platforms: Record<string, string>;

  @Column({ type: 'jsonb', default: {} })
  social: Record<string, string>;

  @Column({ type: 'varchar', nullable: true  })
  avgViews: string | null;

  @Column({ type: 'varchar', nullable: true  })
  avgLive: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'text', nullable: true })
  adminNotes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
