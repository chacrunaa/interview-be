import { Module } from "@nestjs/common";
import { InterviewsController } from "./interviews.controller";
import { InterviewsService } from "./interviews.service";
import { Interview } from "src/interviews/interviews.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { AuthModule } from "src/auth/auth.module";
import { ErrorHandlingService } from "src/common/error-handling/error-handling.service";

@Module({
  imports: [SequelizeModule.forFeature([Interview, ]),  AuthModule],
  controllers: [InterviewsController],
  providers: [InterviewsService, ErrorHandlingService],
})
export class InterviewsModule {}
