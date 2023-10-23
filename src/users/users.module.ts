import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Import the User entity for TypeORM
  // controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export the UsersService to be used in other modules
})
export class UsersModule {}
