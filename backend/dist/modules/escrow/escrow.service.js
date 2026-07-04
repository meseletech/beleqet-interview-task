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
var EscrowService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscrowService = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../prisma/prisma.service");
const queues_constants_1 = require("../queues/queues.constants");
const PLATFORM_FEE_PCT = 0.10;
let EscrowService = EscrowService_1 = class EscrowService {
    constructor(prisma, config, escrowQueue) {
        this.prisma = prisma;
        this.config = config;
        this.escrowQueue = escrowQueue;
        this.logger = new common_1.Logger(EscrowService_1.name);
    }
    async initiate(clientId, freelanceJobId) {
        const job = await this.prisma.freelanceJob.findFirst({
            where: { id: freelanceJobId, clientId },
            include: { client: true, contract: true }
        });
        if (!job)
            throw new common_1.NotFoundException('Gig not found');
        const grossAmount = job.contract ? job.contract.agreedAmount : job.budgetMax;
        if (!job.contract) {
            this.logger.warn(`Escrow initiated without a contract for job ${freelanceJobId} — using budgetMax. Consider initiating escrow after bid acceptance.`);
        }
        const platformFee = Math.round(grossAmount * PLATFORM_FEE_PCT);
        const netAmount = grossAmount - platformFee;
        const escrow = await this.prisma.escrowTransaction.create({
            data: { freelanceJobId, grossAmount, platformFee, netAmount, status: 'PENDING' },
        });
        let checkoutUrl = `${this.config.get('FRONTEND_URL')}/freelance/pay?escrow=${escrow.id}`;
        const chapaSecret = this.config.get('CHAPA_SECRET_KEY');
        if (chapaSecret) {
            try {
                const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${chapaSecret}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        amount: grossAmount.toString(),
                        currency: 'ETB',
                        email: job.client.email,
                        first_name: job.client.firstName,
                        last_name: job.client.lastName,
                        tx_ref: escrow.id,
                        callback_url: this.config.get('CHAPA_CALLBACK_URL'),
                        return_url: this.config.get('CHAPA_RETURN_URL'),
                        customization: {
                            title: 'Beleqet Escrow',
                            description: `Payment for Gig: ${job.title}`,
                        }
                    }),
                });
                const data = await response.json();
                if (data.status === 'success') {
                    checkoutUrl = data.data.checkout_url;
                }
                else {
                    this.logger.warn(`Chapa initialization failed: ${data.message}`);
                }
            }
            catch (err) {
                this.logger.error(`Failed to reach Chapa: ${err.message}`);
            }
        }
        this.logger.log(`Escrow initiated: ${escrow.id} for job ${freelanceJobId} — amount: ETB ${grossAmount}`);
        return { escrowId: escrow.id, checkoutUrl, grossAmount, platformFee, netAmount };
    }
    async handleWebhook(payload) {
        await this.escrowQueue.add(queues_constants_1.ESCROW_JOBS.PROCESS_WEBHOOK, payload);
    }
    async releaseMilestone(milestoneId, clientId) {
        const milestone = await this.prisma.milestone.findFirst({
            where: { id: milestoneId, contract: { clientId } },
            include: { contract: { include: { freelanceJob: { include: { escrowTx: true } } } } },
        });
        if (!milestone)
            throw new common_1.NotFoundException('Milestone not found');
        await this.prisma.$transaction(async (tx) => {
            await tx.milestone.update({
                where: { id: milestoneId },
                data: { status: 'APPROVED', approvedAt: new Date() },
            });
            await tx.eventLog.create({
                data: {
                    eventType: 'milestone.approved',
                    entityId: milestoneId,
                    entityType: 'Milestone',
                    payload: {
                        milestoneId,
                        freelancerId: milestone.contract.freelancerId,
                        amount: milestone.amount
                    },
                    processedBy: EscrowService_1.name,
                },
            });
        });
        try {
            await this.escrowQueue.add(queues_constants_1.ESCROW_JOBS.AUTO_RELEASE, {
                milestoneId,
                freelancerId: milestone.contract.freelancerId,
                amount: milestone.amount,
                releaseAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            });
        }
        catch (err) {
            this.logger.error(`Failed to enqueue auto-release for milestone ${milestoneId}`, err instanceof Error ? err.stack : err);
        }
        this.logger.log(`Milestone ${milestoneId} approved — payout queued`);
        return { success: true };
    }
};
exports.EscrowService = EscrowService;
exports.EscrowService = EscrowService = EscrowService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, bull_1.InjectQueue)(queues_constants_1.QUEUE_NAMES.ESCROW)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService, Object])
], EscrowService);
//# sourceMappingURL=escrow.service.js.map