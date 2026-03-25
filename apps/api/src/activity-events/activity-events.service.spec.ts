import { Test, TestingModule } from '@nestjs/testing';
import { ActivityEventsService } from './activity-events.service';

describe('ActivityEventsService', () => {
  let service: ActivityEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ActivityEventsService],
    }).compile();

    service = module.get<ActivityEventsService>(ActivityEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
