import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ProfileEntity } from './profile.entity';
import { TeamPokemonEntity } from './team-pokemon.entity';

@Entity('teams')
export class TeamEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @ManyToOne(() => ProfileEntity, (profile) => profile.createdTeams, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile!: ProfileEntity;

  @OneToMany(() => TeamPokemonEntity, (tp) => tp.team)
  teamPokemons!: TeamPokemonEntity[];
}