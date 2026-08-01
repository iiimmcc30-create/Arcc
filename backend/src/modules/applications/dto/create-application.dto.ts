import { Transform } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

const emptyToUndefined = ({ value }: { value: unknown }) =>
  value === '' || value === null ? undefined : value;

export class CreateApplicationDto {
  @IsIn(['player', 'team', 'creator'])
  type: 'player' | 'team' | 'creator';

  @IsString()
  name: string;

  @IsOptional()
  @Transform(emptyToUndefined)
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  discord?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsInt()
  @Min(13)
  age?: number;

  @IsOptional()
  @IsString()
  game?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  accountId?: string;

  @IsOptional()
  @IsString()
  uid?: string;

  @IsOptional()
  @IsString()
  rank?: string;

  @IsOptional()
  @IsString()
  achievements?: string;

  @IsOptional()
  @IsString()
  profileLink?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  teamName?: string;

  @IsOptional()
  @IsString()
  captain?: string;

  @IsOptional()
  @IsInt()
  playerCount?: number;

  @IsOptional()
  @IsString()
  platform?: string;

  @IsOptional()
  @IsString()
  followers?: string;

  @IsOptional()
  @IsObject()
  platforms?: Record<string, string>;

  @IsOptional()
  @IsObject()
  social?: Record<string, string>;

  @IsOptional()
  @IsString()
  avgViews?: string;

  @IsOptional()
  @IsString()
  avgLive?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
