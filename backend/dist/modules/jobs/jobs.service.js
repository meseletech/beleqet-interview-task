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
exports.JobsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let JobsService = class JobsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(employerId, dto) {
        const company = await this.prisma.company.findUnique({ where: { userId: employerId } });
        if (!company)
            throw new common_1.ForbiddenException('Create a company profile before posting jobs');
        const data = { ...dto, companyId: company.id, status: dto.status || 'PUBLISHED' };
        if (data.deadline)
            data.deadline = new Date(data.deadline);
        if (data.expiryDate)
            data.expiryDate = new Date(data.expiryDate);
        return this.prisma.job.create({
            data,
            include: { company: true, category: true },
        });
    }
    async getCategories() {
        return this.prisma.jobCategory.findMany({
            orderBy: { label: 'asc' },
        });
    }
    async findAll(query) {
        const pageNum = Number(query.page) || 1;
        const limitNum = Number(query.limit) || 20;
        const { q, category, location, type } = query;
        const where = { status: 'PUBLISHED' };
        if (type)
            where['type'] = type;
        if (category)
            where['category'] = { slug: category };
        if (location)
            where['location'] = { contains: location, mode: 'insensitive' };
        if (q)
            where['OR'] = [
                { title: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
            ];
        const [items, total] = await Promise.all([
            this.prisma.job.findMany({
                where: where,
                include: { company: true, category: true, _count: { select: { applications: true } } },
                orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
            }),
            this.prisma.job.count({ where: where }),
        ]);
        return { items, total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) };
    }
    async findOne(id) {
        const job = await this.prisma.job.findUnique({
            where: { id },
            include: { company: true, category: true, _count: { select: { applications: true } } },
        });
        if (!job)
            throw new common_1.NotFoundException(`Job ${id} not found`);
        return job;
    }
    async update(id, employerId, dto) {
        const job = await this.prisma.job.findFirst({ where: { id, company: { userId: employerId } } });
        if (!job)
            throw new common_1.NotFoundException('Job not found or access denied');
        return this.prisma.job.update({ where: { id }, data: dto });
    }
    async remove(id, employerId) {
        const job = await this.prisma.job.findFirst({ where: { id, company: { userId: employerId } } });
        if (!job)
            throw new common_1.NotFoundException('Job not found or access denied');
        return this.prisma.job.update({ where: { id }, data: { status: 'ARCHIVED' } });
    }
    async findByCompany(employerId) {
        return this.prisma.job.findMany({
            where: { company: { userId: employerId } },
            include: { category: true, _count: { select: { applications: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.JobsService = JobsService;
exports.JobsService = JobsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobsService);
//# sourceMappingURL=jobs.service.js.map