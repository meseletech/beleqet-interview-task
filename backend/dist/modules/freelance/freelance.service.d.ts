import { PrismaService } from '../../prisma/prisma.service';
export declare class CreateFreelanceJobDto {
    title: string;
    description: string;
    categoryId: string;
    budgetMin: number;
    budgetMax: number;
    pricingType?: string;
    deadlineDays: number;
    skills: string[];
    locationPreference?: string;
    experienceLevel?: string;
    attachments?: string[];
}
export declare class CreateBidDto {
    amount: number;
    timelineDays: number;
    coverLetter: string;
}
export declare class FreelanceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createJob(clientId: string, dto: CreateFreelanceJobDto): Promise<{
        category: {
            id: string;
            slug: string;
            label: string;
            icon: string | null;
        };
        client: {
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
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
    }>;
    findJobs(query: {
        q?: string;
        category?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        items: ({
            _count: {
                bids: number;
            };
            category: {
                id: string;
                slug: string;
                label: string;
                icon: string | null;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findJobById(id: string): Promise<{
        bids: ({
            freelancer: {
                firstName: string;
                lastName: string;
                id: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.BidStatus;
            coverLetter: string;
            freelanceJobId: string;
            freelancerId: string;
            amount: number;
            timelineDays: number;
            qualityScore: number | null;
        })[];
        category: {
            id: string;
            slug: string;
            label: string;
            icon: string | null;
        };
        client: {
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
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
    }>;
    submitBid(freelancerId: string, gigId: string, dto: CreateBidDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BidStatus;
        coverLetter: string;
        freelanceJobId: string;
        freelancerId: string;
        amount: number;
        timelineDays: number;
        qualityScore: number | null;
    }>;
    acceptBid(bidId: string, clientId: string): Promise<{
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
    }>;
    getMyBids(freelancerId: string): Promise<({
        freelanceJob: {
            category: {
                id: string;
                slug: string;
                label: string;
                icon: string | null;
            };
        } & {
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
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.BidStatus;
        coverLetter: string;
        freelanceJobId: string;
        freelancerId: string;
        amount: number;
        timelineDays: number;
        qualityScore: number | null;
    })[]>;
    getContract(id: string): Promise<{
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
            firstName: string;
            lastName: string;
            id: string;
        };
        freelancer: {
            firstName: string;
            lastName: string;
            id: string;
        };
        milestones: ({
            deliverables: {
                id: string;
                notes: string | null;
                milestoneId: string;
                fileUrl: string | null;
                submittedAt: Date;
            }[];
        } & {
            description: string | null;
            title: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deadline: Date;
            status: import(".prisma/client").$Enums.MilestoneStatus;
            amount: number;
            contractId: string;
            approvedAt: Date | null;
        })[];
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
    }>;
    approveMilestone(milestoneId: string, clientId: string): Promise<{
        description: string | null;
        title: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deadline: Date;
        status: import(".prisma/client").$Enums.MilestoneStatus;
        amount: number;
        contractId: string;
        approvedAt: Date | null;
    }>;
}
