import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { EscrowService } from './escrow.service';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
export declare class EscrowController {
    private readonly svc;
    private readonly config;
    constructor(svc: EscrowService, config: ConfigService);
    initiate(gigId: string, u: CurrentUserPayload): Promise<{
        escrowId: string;
        checkoutUrl: string;
        grossAmount: number;
        platformFee: number;
        netAmount: number;
    }>;
    webhook(payload: Record<string, unknown>, req: Request & {
        rawBody?: Buffer;
    }, chapaSignature?: string, xChapaSignature?: string): Promise<void>;
    release(id: string, u: CurrentUserPayload): Promise<{
        success: boolean;
    }>;
}
