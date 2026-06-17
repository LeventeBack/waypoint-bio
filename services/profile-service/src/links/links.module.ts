import { Module } from "@nestjs/common";
import { StorageModule } from "../storage/storage.module";
import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";

@Module({
  imports: [StorageModule],
  controllers: [LinksController],
  providers: [LinksService],
})
export class LinksModule {}
