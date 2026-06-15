import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ClickEventDocument = HydratedDocument<ClickEvent>;

@Schema({ collection: "click_events", versionKey: false })
export class ClickEvent {
  @Prop({ required: true, index: true })
  username!: string;

  @Prop({ index: true })
  linkId?: string;

  @Prop()
  ip?: string;

  @Prop()
  country?: string;

  @Prop({ required: true, default: () => new Date(), index: true })
  timestamp!: Date;
}

export const ClickEventSchema = SchemaFactory.createForClass(ClickEvent);
