import { CurrentUserPayload } from '../../common/decorators/current-user.decorator';
import { FreelanceService, CreateFreelanceJobDto, CreateBidDto } from './freelance.service';
export declare class FreelanceController {
    private readonly svc;
    constructor(svc: FreelanceService);
    findJobs(q: {
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
    findJob(id: string): Promise<{
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
    createJob(u: CurrentUserPayload, dto: CreateFreelanceJobDto): Promise<{
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
    submitBid(id: string, u: CurrentUserPayload, dto: CreateBidDto): Promise<{
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
    acceptBid(id: string, u: CurrentUserPayload): Promise<{
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
    myBids(u: CurrentUserPayload): Promise<({
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
    contract(id: string): Promise<{
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
    approveMilestone(id: string, u: CurrentUserPayload): Promise<{
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
