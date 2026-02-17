import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAdmin() {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('adminId');
    return !!adminId;
}

export async function GET() {
    if (!await checkAdmin()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [usersCount, projectsCount, taskListsCount, tasksCount, rolesCount, tasksByStatus, tasksByPriority] = await prisma.$transaction([
            prisma.users.count(),
            prisma.projects.count(),
            prisma.tasklists.count(),
            prisma.tasks.count(),
            prisma.roles.count(),
            prisma.tasks.groupBy({
                by: ['Status'],
                _count: {
                    Status: true
                },
                orderBy: {
                    _count: {
                        Status: 'desc'
                    }
                }
            }),
            prisma.tasks.groupBy({
                by: ['Priority'],
                _count: {
                    Priority: true
                },
                orderBy: {
                    _count: {
                        Priority: 'desc'
                    }
                }
            })
        ]);

        return NextResponse.json({
            users: usersCount,
            projects: projectsCount,
            taskLists: taskListsCount,
            tasks: tasksCount,
            roles: rolesCount,
            charts: {
                tasksByStatus: tasksByStatus.map((item: any) => ({ name: item.Status, value: item._count?.Status || 0 })),
                tasksByPriority: tasksByPriority.map((item: any) => ({ name: item.Priority, value: item._count?.Priority || 0 }))
            }
        });
    } catch (error) {
        console.error('Error fetching admin stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
