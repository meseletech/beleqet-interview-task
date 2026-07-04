import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class WithdrawDto {
    amount: number;
    method: 'CHAPA' | 'TELEBIRR' | 'CBE_BIRR';
    accountRef: string;
}
export declare class WalletService {
    private readonly prisma;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, config: ConfigService);
    getOrCreate(userId: string): Promise<{
        transactions: {
            type: import(".prisma/client").$Enums.WalletTransactionType;
            id: string;
            createdAt: Date;
            amount: number;
            milestoneId: string | null;
            note: string | null;
            walletId: string;
        }[];
    } & {
        id: string;
        updatedAt: Date;
        userId: string;
        currency: string;
        pendingBalance: number;
        availableBalance: number;
    }>;
    withdraw(userId: string, dto: WithdrawDto): Promise<{
        success: boolean;
        amount: number;
        method: "TELEBIRR" | "CHAPA" | "CBE_BIRR";
        note: string;
    }>;
}
