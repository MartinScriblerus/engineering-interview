import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TeamEntity } from './team.entity';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'boolean', default: false })
  persistent: boolean;

  @OneToMany(() => TeamEntity, (team) => team.profile)
  createdTeams: TeamEntity[];
}