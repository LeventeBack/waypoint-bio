import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsUrl } from "class-validator";
import { CreateLinkDto } from "./create-link.dto";

export class UpdateLinkDto extends PartialType(CreateLinkDto) {
  @IsOptional()
  @IsUrl()
  iconUrl?: string;
}
