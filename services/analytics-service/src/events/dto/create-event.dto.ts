import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsOptional()
  @IsString()
  linkId?: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
