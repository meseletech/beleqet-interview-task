import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { WalletService, WithdrawDto } from './wallet.service';
export declare class WalletController {
    private readonly svc;
    constructor(svc: WalletService);
    getWallet(u: CurrentUserPayload): Promise<{
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
    withdraw(u: CurrentUserPayload, dto: WithdrawDto): Promise<{
        success: boolean;
        amount: number;
        method: "TELEBIRR" | "CHAPA" | "CBE_BIRR";
        note: string;
    }>;
}
