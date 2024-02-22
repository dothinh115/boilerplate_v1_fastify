import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import DefaultRoute from 'src/utils/mongoose/model/route.model';

export type RouteDocument = HydratedDocument<Route>;

@Schema()
export class Route extends DefaultRoute {}

export const RouteSchema = SchemaFactory.createForClass(Route);
