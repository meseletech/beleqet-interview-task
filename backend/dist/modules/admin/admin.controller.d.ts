import { PrismaService } from '../../prisma/prisma.service';
declare class ResolveDisputeDto {
    resolution: string;
}
export declare class AdminController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getUsers(): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        isActive: boolean;
    }[]>;
    suspendUser(id: string): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        role: import(".prisma/client").$Enums.UserRole;
        id: string;
        telegramId: string | null;
        passwordHash: string;
        avatarUrl: string | null;
        phone: string | null;
        isActive: boolean;
        emailVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
        bio: string | null;
        defaultResumeUrl: string | null;
        githubUrl: string | null;
        headline: string | null;
        linkedinUrl: string | null;
        location: string | null;
        portfolioUrl: string | null;
        skills: string[];
    }>;
    getDisputes(): Promise<({
        contract: {
            freelanceJob: {
                description: string;
                title: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                skills: string[];
                categoryId: string;
                featured: boolean;
                experienceLevel: string | null;
                status: import(".prisma/client").$Enums.FreelanceJobStatus;
                currency: string;
                attachments: string[];
                budgetMin: number;
                budgetMax: number;
                pricingType: string;
                deadlineDays: number;
                locationPreference: string | null;
                clientId: string;
            };
            client: {
                email: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                id: string;
                telegramId: string | null;
                passwordHash: string;
                avatarUrl: string | null;
                phone: string | null;
                isActive: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                bio: string | null;
                defaultResumeUrl: string | null;
                githubUrl: string | null;
                headline: string | null;
                linkedinUrl: string | null;
                location: string | null;
                portfolioUrl: string | null;
                skills: string[];
            };
            freelancer: {
                email: string;
                firstName: string;
                lastName: string;
                role: import(".prisma/client").$Enums.UserRole;
                id: string;
                telegramId: string | null;
                passwordHash: string;
                avatarUrl: string | null;
                phone: string | null;
                isActive: boolean;
                emailVerified: boolean;
                createdAt: Date;
                updatedAt: Date;
                bio: string | null;
                defaultResumeUrl: string | null;
                githubUrl: string | null;
                headline: string | null;
                linkedinUrl: string | null;
                location: string | null;
                portfolioUrl: string | null;
                skills: string[];
            };
        } & {
            id: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ContractStatus;
            currency: string;
            clientId: string;
            freelanceJobId: string;
            freelancerId: string;
            agreedAmount: number;
            startedAt: Date;
            completedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contractId: string;
        resolution: string | null;
        raisedById: string;
        reason: string;
        evidenceUrls: string[];
        resolvedAt: Date | null;
    })[]>;
    resolveDispute(id: string, dto: ResolveDisputeDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contractId: string;
        resolution: string | null;
        raisedById: string;
        reason: string;
        evidenceUrls: string[];
        resolvedAt: Date | null;
    }>;
}
export {};
