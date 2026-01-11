import { vi } from "vitest";
import { ProfilesService } from "../app/profiles/profiles.service";
import { LocalCacheService } from "./cache.service";

describe('ProfilesService caching', () => {
  let service: ProfilesService;
  let cache: LocalCacheService;
  let mockRepo: any;

  beforeEach(() => {
    cache = new LocalCacheService({ info: vi.fn(), debug: vi.fn() } as any);
    mockRepo = { findOne: vi.fn() };
    mockRepo = {
      findOne: vi.fn(),
    };
    service = new ProfilesService(mockRepo, cache, { info: vi.fn(), debug: vi.fn() } as any);
  });

  afterEach(() => {
    // ensure any timers/handles used by the cache are cleared between tests
    cache.reset();
  });

  it('should cache teams for profile', async () => {
    const profileId = 'abc';
    mockRepo.findOne.mockResolvedValueOnce({
      id: profileId,
      createdTeams: [{ name: 'Team A', teamPokemons: [] }],
    });

    // First call → MISS
    const first = await service.getTeams(profileId);
    expect(first.length).toBe(1);
    expect(cache.has(`profile:${profileId}:teams`)).toBe(true);

    // Second call → HIT
    const second = await service.getTeams(profileId);
    expect(second.length).toBe(1);
    expect(mockRepo.findOne).toHaveBeenCalledTimes(1); // DB not called again
  });
});
