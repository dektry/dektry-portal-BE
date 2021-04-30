import { plainToClass } from 'class-transformer';
import { IsEnum, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Staging = 'Staging',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsOptional()
  @IsString()
  PORT?: number;

  @IsString({ message: 'No DB Config!' })
  DATABASE_USER: string;

  @IsString({ message: 'No DB Config!' })
  DATABASE_PASSWORD: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    skipNullProperties: true,
  });
  if (errors.length > 0) {
    throw new Error(
      errors
        .map((x, i) => `${x.property}: ${Object.values(x.constraints)}`)
        .toString(),
    );
  }
  return validatedConfig;
}

export const configuration = () => ({
  port: parseInt(process.env.PORT, 10),
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
