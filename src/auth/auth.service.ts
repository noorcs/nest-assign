import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const { username, password } = loginDto;

    // Find the user by the provided username
    const user = await this.usersService.findOne(username);

    // If the user does not exist or the password is incorrect, throw an unauthorized exception
    if (!user || !(await user.comparePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If the user exists and the password is correct, return the user
    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    // Generate a JWT token with user payload
    const payload = { username: user.username, sub: user.id };
    console.log('payload', payload);
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
