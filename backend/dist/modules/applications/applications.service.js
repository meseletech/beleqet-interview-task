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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ApplicationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../../prisma/prisma.service");
const queues_constants_1 = require("../queues/queues.constants");
let ApplicationsService = ApplicationsService_1 = class ApplicationsService {
    constructor(prisma, eventEmitter, applicationQueue, analyticsQueue) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
        this.applicationQueue = applicationQueue;
        this.analyticsQueue = analyticsQueue;
        this.logger = new common_1.Logger(ApplicationsService_1.name);
    }
    async submit(userId, dto) {
        const job = await this.prisma.job.findFirst({
            where: { id: dto.jobId, status: 'PUBLISHED' },
            include: { company: true },
        });
        if (!job) {
            throw new common_1.NotFoundException(`Job ${dto.jobId} not found or no longer accepting applications`);
        }
        const existing = await this.prisma.application.findUnique({
            where: { jobId_userId: { jobId: dto.jobId, userId } },
        });
        if (existing) {
            throw new common_1.ConflictException('You have already applied to this job');
        }
        const application = await this.prisma.$transaction(async (tx) => {
            const app = await tx.application.create({
                data: {
                    jobId: dto.jobId,
                    userId,
                    coverLetter: dto.coverLetter,
                    resumeUrl: dto.resumeUrl,
                    status: 'SUBMITTED',
                },
                include: {
                    user: { select: { id: true, firstName: true, lastName: true, email: true } },
                    job: { select: { id: true, title: true, companyId: true } },
                },
            });
            await tx.eventLog.create({
                data: {
                    eventType: 'application.submitted',
                    entityId: app.id,
                    entityType: 'Application',
                    payload: {
                        applicationId: app.id,
                        jobId: dto.jobId,
                        userId,
                        jobTitle: job.title,
                        companyId: job.companyId,
                    },
                    processedBy: ApplicationsService_1.name,
                },
            });
            return app;
        });
        this.applicationQueue.add(queues_constants_1.APPLICATION_JOBS.SCREEN_CANDIDATE, {
            applicationId: application.id,
            userId,
            jobId: dto.jobId,
            jobTitle: job.title,
            jobDescription: job.description,
            jobRequirements: job.requirements,
            coverLetter: dto.coverLetter,
            resumeUrl: dto.resumeUrl,
            companyId: job.companyId,
        }, { priority: 1 }).catch(err => this.logger.error('Failed to enqueue SCREEN_CANDIDATE', err.message));
        this.applicationQueue.add(queues_constants_1.APPLICATION_JOBS.NOTIFY_RECRUITER, {
            applicationId: application.id,
            jobId: dto.jobId,
            jobTitle: job.title,
            companyId: job.companyId,
            applicantName: `${application.user.firstName} ${application.user.lastName}`,
        }, { priority: 2 }).catch(err => this.logger.error('Failed to enqueue NOTIFY_RECRUITER', err.message));
        this.analyticsQueue.add(queues_constants_1.ANALYTICS_JOBS.UPDATE_JOB_STATS, { jobId: dto.jobId }).catch(err => this.logger.error('Failed to enqueue UPDATE_JOB_STATS', err.message));
        this.eventEmitter.emit('application.submitted', {
            applicationId: application.id,
            jobId: dto.jobId,
            userId,
        });
        this.logger.log(`Application ${application.id} submitted — screening queued`);
        return application;
    }
    async findByUser(userId) {
        return this.prisma.application.findMany({
            where: { userId },
            include: { job: { include: { company: true } }, score: true },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByJob(jobId, employerId) {
        const job = await this.prisma.job.findFirst({
            where: { id: jobId, company: { userId: employerId } },
        });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        return this.prisma.application.findMany({
            where: { jobId },
            include: {
                user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
                score: true,
            },
            orderBy: [{ score: { overallScore: 'desc' } }, { createdAt: 'asc' }],
        });
    }
    async findOne(id) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: { user: true, job: { include: { company: true } }, score: true },
        });
        if (!application)
            throw new common_1.NotFoundException(`Application ${id} not found`);
        return application;
    }
    async updateStatus(id, status, employerId) {
        const application = await this.prisma.application.findFirst({
            where: { id, job: { company: { userId: employerId } } },
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application ${id} not found or you don't have permission to update it`);
        }
        return this.prisma.application.update({
            where: { id },
            data: { status: status },
        });
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = ApplicationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bull_1.InjectQueue)(queues_constants_1.QUEUE_NAMES.APPLICATION)),
    __param(3, (0, bull_1.InjectQueue)(queues_constants_1.QUEUE_NAMES.ANALYTICS)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2, Object, Object])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map