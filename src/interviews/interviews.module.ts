import { Module } from '@nestjs/common';
import { InterviewsController } from './interviews.controller';
import { InterviewsService } from './interviews.service';
import { Interview } from 'src/interviews/interviews.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Interview])],
  controllers: [InterviewsController],
  providers: [InterviewsService]
})
export class InterviewsModule {}
