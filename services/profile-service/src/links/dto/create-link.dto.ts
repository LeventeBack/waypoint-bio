import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, Min } from "class-validator";

export class CreateLinkDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title!: string;

  @IsUrl({ require_protocol: true })
  url!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}
