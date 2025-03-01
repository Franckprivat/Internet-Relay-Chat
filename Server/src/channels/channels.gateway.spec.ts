import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsService } from './channels.service';

describe('ChannelsService', () => { // ✅ Correction du nom ici
  let service: ChannelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsService],
    }).compile();

    service = module.get<ChannelsService>(ChannelsService); // ✅ Utilisation cohérente
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
