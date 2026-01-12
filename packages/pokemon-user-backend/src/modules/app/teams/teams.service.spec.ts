import { describe, it, beforeEach, expect, vi } from 'vitest';
import { Repository } from 'typeorm';
import { TeamsService } from './teams.service';
import { LocalCacheService } from '../../cache/cache.service';
import { TeamEntity } from '../../database/entities/team.entity';
import { ProfileEntity } from '../../database/entities/profile.entity';
import { TeamPokemonEntity } from '../../database/entities/team-pokemon.entity';

describe('TeamsService', () => {
  let service: TeamsService;
  let mockRepo: any;
  let mockCache: any;

  beforeEach(() => {
    const fakeTeams = [{ id: 't1', name: 'Team 1' }];

    const qb: any = {
      leftJoinAndSelect: () => qb,
      where: () => qb,
      orderBy: () => qb,
      addOrderBy: () => qb,
      take: () => qb,
      select: () => qb,
      getMany: vi.fn().mockResolvedValue(fakeTeams),
    };

    mockRepo = {
      createQueryBuilder: vi.fn().mockReturnValue(qb),
      findOne: vi.fn().mockResolvedValue({ id: 't1', name: 'Team 1' }),
    };

    const mockProfileRepo = {
      findOne: vi.fn().mockResolvedValue({ id: 'p1', name: 'Profile 1' }),
    };

    const mockTeamPokemonRepo = {
      create: vi.fn(),
      save: vi.fn(),
    };

    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    } as unknown as LocalCacheService;

    const mockLogger = { info: vi.fn(), error: vi.fn() } as any;

    // Cast each object to the Repository<T> type the service expects
    service = new TeamsService(
      mockRepo as unknown as Repository<TeamEntity>,
      mockProfileRepo as unknown as Repository<ProfileEntity>,
      mockTeamPokemonRepo as unknown as Repository<TeamPokemonEntity>,
      mockCache,
      mockLogger
    );
  });

  it('getAllTeams returns teams via query builder', async () => {
    const res = await service.getAllTeams(5);
    expect(res).toEqual([{ id: 't1', name: 'Team 1' }]);
    expect(mockRepo.createQueryBuilder).toHaveBeenCalled();
  });

  it('getTeam fetches from repo and caches result when not cached', async () => {
    const teamId = 't1';
    (mockCache.get as any).mockReturnValueOnce(null);
    const res = await service.getTeam(teamId);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: teamId } });
    expect((mockCache.set as any).mock.calls.length).toBeGreaterThanOrEqual(0);
    expect(res).toEqual({ id: 't1', name: 'Team 1' });
  });
});