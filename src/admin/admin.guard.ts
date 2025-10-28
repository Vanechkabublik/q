import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private configService: ConfigService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const adminKey = request.headers['admin-system-key']; // ПРОБЛЕМА ЗДЕСЬ!
        const expectedKey = this.configService.get<string>('ADMIN_SECRET_KEY');

        // console.log('Received key:', adminKey);
        // console.log('Expected key:', expectedKey);
        // console.log('Headers:', request.headers);

        if (!adminKey || adminKey !== expectedKey) {
            throw new UnauthorizedException('Admin access denied');
        }

        return true;
    }
}