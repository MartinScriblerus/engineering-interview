import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TeamEntity } from '../../database/entities/team.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LocalCacheService } from '../../cache/cache.service';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private readonly teamRepo: Repository<TeamEntity>,
    private readonly cache: LocalCacheService,
    private readonly logger: PinoLogger
  ) {}

  async getAllTeams(topN: number) {
    return this.teamRepo
      .createQueryBuilder('team')
      .leftJoinAndSelect('team.profile', 'profile')
      // .where('team.persistent = false OR team.persistent = true AND team.profileId IS NOT NULL')
      .orderBy('team.selectedCount', 'DESC')
      .addOrderBy('team.createdAt', 'DESC')
      .take(topN)
      .select([
        'team.id',
        'team.name',
        'team.selectedCount',
        'team.createdAt',
        // 'team.persistent',
        'profile.id',
        'profile.name',
      ])
      .getMany();
  }

  async getTeam(teamId: string): Promise<TeamEntity | null> {
    const cacheKey = `team:${teamId}`;
    const cached = this.cache.get<TeamEntity>(cacheKey);
    if (cached) return cached;

    const team = await this.teamRepo.findOne({ where: { id: teamId } });
    if (team) this.cache.set(cacheKey, team, 2 * 60 * 60 * 1000); // 2 hr TTL
    return team;
  }

  async createTeam(name: string): Promise<TeamEntity> {
    const team = this.teamRepo.create({ name });
    return this.teamRepo.save(team);
  }

  async updateTeam(teamId: string, update: Partial<TeamEntity>): Promise<TeamEntity> {
    await this.teamRepo.update(teamId, update);
    const updated = await this.getTeam(teamId); // refresh cache
    return updated!;
  }
}
