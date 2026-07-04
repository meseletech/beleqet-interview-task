"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreelanceService = exports.CreateBidDto = exports.CreateFreelanceJobDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
class CreateFreelanceJobDto {
}
exports.CreateFreelanceJobDto = CreateFreelanceJobDto;
class CreateBidDto {
}
exports.CreateBidDto = CreateBidDto;
let FreelanceService = class FreelanceService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createJob(clientId, dto) {
        return this.prisma.freelanceJob.create({
            data: { ...dto, clientId, status: 'OPEN' },
            include: { category: true, client: { select: { id: true, firstName: true, lastName: true } } },
        });
    }
    async findJobs(query) {
        const pageNum = Number(query.page) || 1;
        const limitNum = Number(query.limit) || 20;
        const { q, category } = query;
        const where = { status: { in: ['OPEN', 'FUNDED'] } };
        if (category)
            where['category'] = { slug: category };
        if (q)
            where['OR'] = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        const [items, total] = await Promise.all([
            this.prisma.freelanceJob.findMany({
                where: where,
                include: { category: true, _count: { select: { bids: true } } },
                orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
            }),
            this.prisma.freelanceJob.count({ where: where }),
        ]);
        return { items, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) };
    }
    async findJobById(id) {
        const job = await this.prisma.freelanceJob.findUnique({
            where: { id },
            include: {
                category: true,
                client: { select: { id: true, firstName: true, lastName: true } },
                bids: {
                    include: { freelancer: { select: { id: true, firstName: true, lastName: true } } },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!job)
            throw new common_1.NotFoundException('Gig not found');
        return job;
    }
    async submitBid(freelancerId, gigId, dto) {
        const gig = await this.prisma.freelanceJob.findFirst({
            where: { id: gigId, status: { in: ['OPEN', 'FUNDED'] } },
        });
        if (!gig)
            throw new common_1.NotFoundException('Gig not found or no longer accepting bids');
        const existing = await this.prisma.bid.findUnique({
            where: { freelanceJobId_freelancerId: { freelanceJobId: gigId, freelancerId } },
        });
        if (existing)
            throw new common_1.ConflictException('You have already submitted a bid');
        return this.prisma.bid.create({ data: { ...dto, freelanceJobId: gigId, freelancerId } });
    }
    async acceptBid(bidId, clientId) {
        const bid = await this.prisma.bid.findFirst({
            where: { id: bidId, freelanceJob: { clientId } },
        });
        if (!bid)
            throw new common_1.NotFoundException('Bid not found');
        const contract = await this.prisma.$transaction(async (tx) => {
            await tx.bid.update({ where: { id: bidId }, data: { status: 'ACCEPTED' } });
            await tx.bid.updateMany({
                where: { freelanceJobId: bid.freelanceJobId, id: { not: bidId } },
                data: { status: 'REJECTED' },
            });
            const c = await tx.contract.create({
                data: { freelanceJobId: bid.freelanceJobId, clientId, freelancerId: bid.freelancerId, agreedAmount: bid.amount },
            });
            await tx.freelanceJob.update({
                where: { id: bid.freelanceJobId },
                data: { status: 'IN_PROGRESS' },
            });
            await tx.chatRoom.create({
                data: {
                    contractId: c.id,
                    participants: { create: [{ userId: clientId }, { userId: bid.freelancerId }] },
                },
            });
            return c;
        });
        return contract;
    }
    async getMyBids(freelancerId) {
        return this.prisma.bid.findMany({
            where: { freelancerId },
            include: { freelanceJob: { include: { category: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getContract(id) {
        const c = await this.prisma.contract.findUnique({
            where: { id },
            include: {
                milestones: { include: { deliverables: true } },
                freelanceJob: true,
                client: { select: { id: true, firstName: true, lastName: true } },
                freelancer: { select: { id: true, firstName: true, lastName: true } },
            },
        });
        if (!c)
            throw new common_1.NotFoundException('Contract not found');
        return c;
    }
    async approveMilestone(milestoneId, clientId) {
        const m = await this.prisma.milestone.findFirst({
            where: { id: milestoneId, contract: { clientId } },
        });
        if (!m)
            throw new common_1.ForbiddenException('Not authorized or milestone not found');
        return this.prisma.milestone.update({
            where: { id: milestoneId },
            data: { status: 'APPROVED', approvedAt: new Date() },
        });
    }
};
exports.FreelanceService = FreelanceService;
exports.FreelanceService = FreelanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FreelanceService);
//# sourceMappingURL=freelance.service.js.map