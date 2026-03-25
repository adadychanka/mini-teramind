import { PartialType } from '@nestjs/swagger';
import { CreateActivityEventDto } from './create-activity-event.dto';

export class UpdateActivityEventDto extends PartialType(CreateActivityEventDto) {}
