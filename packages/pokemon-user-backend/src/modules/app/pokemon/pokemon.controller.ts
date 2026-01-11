import { Controller, Get } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOkResponse({ description: 'List of all Pokémon' })
  async getAllPokemon() {
    return this.pokemonService.getAllPokemon();
  }
}