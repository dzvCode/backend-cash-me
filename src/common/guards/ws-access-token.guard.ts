import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class WsAccessTokenGuard extends AuthGuard('jwt') {

    getRequest(context: ExecutionContext) {        
        const ctx = context.switchToWs();
        return ctx.getClient().handshake;
    }
}