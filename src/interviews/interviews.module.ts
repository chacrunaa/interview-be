import { Module } from "@nestjs/common";
import { InterviewsController } from "./interviews.controller";
import { InterviewsService } from "./interviews.service";
import { Interview } from "src/interviews/interviews.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersController } from "src/users/users.controller";
import { UsersService } from "src/users/users.service";
import { UsersModule } from "src/users/users.module";
import { User } from "src/users/users.model";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [SequelizeModule.forFeature([Interview, ]),  AuthModule],
  controllers: [InterviewsController],
  providers: [InterviewsService],
})
export class InterviewsModule {}
