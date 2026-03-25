import { Test, TestingModule } from '@nestjs/testing';
import { ActivityEventsController } from './activity-events.controller';
import { ActivityEventsService } from './activity-events.service';

describe('ActivityEventsController', () => {
  let controller: ActivityEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityEventsController],
      providers: [ActivityEventsService],
    }).compile();

    controller = module.get<ActivityEventsController>(ActivityEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
