import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { env, EnvironmentConfigService } from './environment-config.service';
import { Environment, validate } from './environment-config.validation';

const NODE_ENV = env<Environment>('NODE_ENV', Environment.DEVELOPMENT);

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `.env.${NODE_ENV}`,
			validate,
		}),
	],
	providers: [EnvironmentConfigService],
	exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule {}
