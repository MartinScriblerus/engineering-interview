import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity('pokemon')
export class PokemonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  pokedexNumber: number;

  @ManyToOne(() => ProfileEntity, (profile) => profile.pokemons)
  profile: ProfileEntity;
}