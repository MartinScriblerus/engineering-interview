import { Module, Global } from '@nestjs/common';
import { LocalCacheService } from './cache.service';
import { LoggerModule } from 'nestjs-pino';

@Global()
@Module({
  imports: [LoggerModule],
  providers: [LocalCacheService],
  exports: [LocalCacheService],
})
export class CacheModule {}