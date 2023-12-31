import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth() // Indicate that this endpoint requires a Bearer token in the Swagger documentation
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): Promise<User> {
    // return the authenticated user
    return req.user;
  }
}
