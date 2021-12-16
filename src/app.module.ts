import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: 'task-management',
      autoLoadEntities: true, // Find entity files and load them
      synchronize: true, // Keep automatically the schema updated
    }),
  ],
})
export class AppModule {}
