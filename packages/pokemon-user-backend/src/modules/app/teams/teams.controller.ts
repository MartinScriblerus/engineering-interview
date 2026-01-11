import { Controller, Get, Param, Post, Body, Patch, ParseUUIDPipe } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  @ApiOkResponse({description: 'Get all teams'})
  async getAllTeams(topN: number) {
    return this.teamsService.getAllTeams(topN);
  }

  @Get(':teamId')
  @ApiOkResponse({ description: 'Get a single team by ID' })
  async getTeam(@Param('teamId', new ParseUUIDPipe()) teamId: string) {
    return this.teamsService.getTeam(teamId);
  }

  @Post()
  @ApiOkResponse({ description: 'Create a new team' })
  async createTeam(@Body('name') name: string) {
    return this.teamsService.createTeam(name);
  }

  @Patch(':teamId')
  @ApiOkResponse({ description: 'Update an existing team' })
  async updateTeam(@Param('teamId', new ParseUUIDPipe()) teamId: string, @Body() update: any) {
    return this.teamsService.updateTeam(teamId, update);
  }
}
