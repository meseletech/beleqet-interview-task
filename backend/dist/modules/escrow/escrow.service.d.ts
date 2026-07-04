import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
export declare class EscrowService {
    private readonly prisma;
    private readonly config;
    private readonly escrowQueue;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService, escrowQueue: Queue);
    initiate(clientId: string, freelanceJobId: string): Promise<{
        escrowId: string;
        checkoutUrl: string;
        grossAmount: number;
        platformFee: number;
        netAmount: number;
    }>;
    handleWebhook(payload: {
        reference: string;
        status: string;
        [k: string]: unknown;
    }): Promise<void>;
    releaseMilestone(milestoneId: string, clientId: string): Promise<{
        success: boolean;
    }>;
}
