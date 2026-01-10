import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TeamPokemonEntity } from './team-pokemon.entity';

@Entity('pokemon')
export class PokemonEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'int' })
  pokedexNumber!: number;

  @OneToMany(() => TeamPokemonEntity, (tp) => tp.pokemon)
  teamPokemons!: TeamPokemonEntity[];
}