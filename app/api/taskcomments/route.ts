import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');

    try {
        let whereClause: any = {};
        if (taskId) {
            whereClause.TaskID = parseInt(taskId);
        }

        const comments = await prisma.taskcomments.findMany({
            where: whereClause,
            include: {
                users: {
                    select: {
                        UserName: true,
                        UserID: true,
                        Email: true
                    }
                }
            },
            orderBy: {
                CreatedAt: 'asc',
            }
        });
        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { TaskID, UserID, CommentText } = body;

        if (!TaskID || !UserID || !CommentText) {
            return NextResponse.json(
                { error: 'TaskID, UserID, and CommentText are required' },
                { status: 400 }
            );
        }

        const newComment = await prisma.taskcomments.create({
            data: {
                TaskID: parseInt(TaskID),
                UserID: parseInt(UserID),
                CommentText,
            },
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}
