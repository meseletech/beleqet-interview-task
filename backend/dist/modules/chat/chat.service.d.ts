import { PrismaService } from '../../prisma/prisma.service';
export declare class ChatService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createOrGetRoom(userId1: string, userId2: string, contractId?: string): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            roomId: string;
            senderId: string;
            content: string;
            isSystem: boolean;
        }[];
        participants: {
            id: string;
            userId: string;
            joinedAt: Date;
            lastReadAt: Date | null;
            roomId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        jobId: string | null;
        contractId: string | null;
    }>;
    saveMessage(roomId: string, senderId: string, content: string): Promise<{
        sender: {
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        roomId: string;
        senderId: string;
        content: string;
        isSystem: boolean;
    }>;
    getRoomMessages(roomId: string, userId: string, take?: number): Promise<({
        sender: {
            firstName: string;
            lastName: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        roomId: string;
        senderId: string;
        content: string;
        isSystem: boolean;
    })[]>;
}
