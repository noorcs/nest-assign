import {
  Controller,
  UseGuards,
  Post,
  Request,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Login Successful' })
  async login(@Request() req): Promise<{ access_token: string }> {
    // Passport Local strategy would have already validated the user
    // Generate a JWT token for the validated user
    const token = await this.authService.login(req.user);

    // Return the generated token to the client
    return {
      access_token: token.access_token,
    };
  }

  @Post('signup')
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async signup(@Body() createUserDto: CreateUserDto) {
    try {
      const { username, password } = createUserDto;

      // Check if the user already exists
      const existingUser = await this.usersService.findOne(username);
      if (existingUser) {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Username is already taken.',
        };
      }

      // Create a new user
      const newUser = await this.usersService.createUser(username, password);

      return {
        status: HttpStatus.CREATED,
        message: 'User created successfully.',
        data: newUser,
      };
    } catch (error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error.',
      };
    }
  }
}
