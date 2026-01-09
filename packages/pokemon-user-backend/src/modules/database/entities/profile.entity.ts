import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PokemonEntity } from './pokemon.entity';

@Entity('profiles')
export class ProfileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => PokemonEntity, (pokemon) => pokemon.profile)
  pokemons: PokemonEntity[];
}