import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, normalizeRole } from '@/lib/auth';

export async function GET(request: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { TaskID, CommentText } = body;

        if (!TaskID || !CommentText) {
            return NextResponse.json(
                { error: 'TaskID and CommentText are required' },
                { status: 400 }
            );
        }

        const task = await prisma.tasks.findUnique({
            where: { TaskID: parseInt(TaskID) },
            include: {
                tasklists: {
                    include: { projects: true }
                }
            }
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
        const isAdmin = normalizedRole === 'Admin';
        const isPM = normalizedRole === 'Project Manager';
        const isTM = normalizedRole === 'Team Member';

        // Check if user has access to this project/task to comment
        if (isPM && task.tasklists.projects.CreatedBy !== user.UserID) {
            return NextResponse.json({ error: 'Forbidden: This task is not in your project' }, { status: 403 });
        }

        if (isTM) {
            // TM can comment if they are part of the project (have any task in it)
            const hasAccess = await prisma.tasks.findFirst({
                where: {
                    AssignedTo: user.UserID,
                    tasklists: { ProjectID: task.tasklists.ProjectID }
                }
            });
            if (!hasAccess) {
                return NextResponse.json({ error: 'Forbidden: You are not assigned to this project' }, { status: 403 });
            }
        }

        const newComment = await prisma.taskcomments.create({
            data: {
                TaskID: parseInt(TaskID),
                UserID: user.UserID,
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
