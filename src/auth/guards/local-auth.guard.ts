import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    return this.validateRequest(request);
  }

  async validateRequest(request): Promise<boolean> {
    console.log('request.body', request.body);
    if (!request.body.username || !request.body.password) {
      throw new UnauthorizedException('Username and password are required.');
    }

    // Validate user credentials using AuthService
    const user = await this.authService.validateUser({
      username: request.body.username,
      password: request.body.password,
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // Attach the validated user object to the request for further use
    request.user = user;
    return true;
  }
}
