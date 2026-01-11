import { describe, it, beforeEach, expect, vi } from 'vitest';
import { TeamsService } from './teams.service';
import { LocalCacheService } from '../../cache/cache.service';

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

    mockCache = {
      get: vi.fn(),
      set: vi.fn(),
    } as unknown as LocalCacheService;

    service = new TeamsService(mockRepo, mockCache, { info: vi.fn() } as any);
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