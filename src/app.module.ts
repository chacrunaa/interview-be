import {Module} from "@nestjs/common";
import {SequelizeModule} from "@nestjs/sequelize";
import { UsersModule } from './users/users.module';
import {ConfigModule} from "@nestjs/config";
import {User} from "./users/users.model";
import { RolesModule } from './roles/roles.module';
import {Role} from "./roles/roles.model";
import {UserRoles} from "./roles/user-roles.model";
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import {Post} from "./posts/posts.model";
import { FilesModule } from './files/files.module';
import {ServeStaticModule} from "@nestjs/serve-static";
import { InterviewsModule } from './interviews/interviews.module';
import { ErrorHandlingService } from './common/error-handling/error-handling.service';
import * as path from 'path';
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ErrorHandlingFilter } from "src/common/error-handling/error-handling.filter";
import { ResponseInterceptor } from "src/common/interseptors/response.interceptor";
import { CompaniesModule } from './companies/companies.module';

@Module({
  controllers: [],
  providers: [ErrorHandlingService,
    {
      provide: APP_FILTER,
      useClass: ErrorHandlingFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    /**
     * Для подключения статической страницы фронта
     */
    // ServeStaticModule.forRoot({
    //     rootPath: path.resolve( __dirname,'..',  'static'),
    // }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Post],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    PostsModule,
    FilesModule,
    InterviewsModule,
    CompaniesModule,
  ],
})
export class AppModule {}
