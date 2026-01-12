import { InjectRepository } from "@nestjs/typeorm";
import { ProfileEntity } from "../../database/entities/profile.entity";
import { Repository } from "typeorm";
import { LocalCacheService } from "../../cache";
import { PinoLogger } from "nestjs-pino";
import { Injectable, NotFoundException } from "@nestjs/common";
import { TeamEntity } from "../../database/entities/team.entity";

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepo: Repository<ProfileEntity>,
    private readonly cache: LocalCacheService,
    private readonly logger: PinoLogger
  ) {}

  async getTeams(profileId: string): Promise<TeamEntity[]> {
    const cacheKey = `profile:${profileId}:teams`;
    const TTL_2_HOURS = 2 * 60 * 60 * 1000; // 7_200_000 ms

    const cached = this.cache.get<TeamEntity[]>(cacheKey);
    if (cached) {
      this.logger.info({ profileId }, 'Cache HIT for profile teams');
      return cached;
    }

    this.logger.info({ profileId }, 'Cache MISS for profile teams');

    const profile = await this.profileRepo.findOne({
      where: { id: profileId },
      relations: ['createdTeams', 'createdTeams.teamPokemons', 'createdTeams.teamPokemons.pokemon'],
    });

    const teams = profile?.createdTeams ?? [];

    // cache ephemeral teams for 2 hours
    // Cache result with 2-hour TTL
    this.cache.set(cacheKey, teams, TTL_2_HOURS);
    this.logger.info({ profileId, ttl: TTL_2_HOURS }, 'Cached profile teams for 2 hours');


    return teams;
  }
  
  async getAllProfiles() {
    const cacheKey = 'allProfiles';
    const TTL_2_HOURS = 2 * 60 * 60 * 1000;

    const cached = this.cache.get(cacheKey);
    if (cached) {
      this.logger.info('Cache HIT for all profiles');
      return cached;
    } 

    this.logger.info('Cache MISS for all profiles');
    const profiles = await this.profileRepo.find({
      relations: ['createdTeams', 'createdTeams.teamPokemons', 'createdTeams.teamPokemons.pokemon'],
    });

    this.cache.set(cacheKey, profiles, TTL_2_HOURS);
    this.logger.info('Cached all profiles for 2 hours');

    return profiles;
  }

  async createProfile(name: string) {
    const profile = this.profileRepo.create({ name });
    const saved = await this.profileRepo.save(profile);

    // Invalidate cached profile list so subsequent GET /profiles returns fresh data
    this.cache.delete('allProfiles');
    this.logger.info({ profileId: saved.id }, 'Created profile and invalidated allProfiles cache');

    return saved;
  }

  // New: delete a profile by id (useful while testing)
  async deleteProfile(profileId: string): Promise<{ deleted: boolean; profileId: string }> {
    const profile = await this.profileRepo.findOne({ where: { id: profileId } });
    if (!profile) {
      throw new NotFoundException(`Profile ${profileId} not found`);
    }

    await this.profileRepo.remove(profile);

    // invalidate related caches
    this.cache.delete('allProfiles');
    this.cache.delete(`profile:${profileId}:teams`);

    this.logger.info({ profileId }, 'Deleted profile');
    return { deleted: true, profileId };
  }
}
