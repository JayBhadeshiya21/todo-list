import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser, normalizeRole } from '@/lib/auth';

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const normalizedRole = normalizeRole(user.userroles[0]?.roles?.RoleName);
    const isAdmin = normalizedRole === 'Admin';
    const isPM = normalizedRole === 'Project Manager';
    const isTM = normalizedRole === 'Team Member';

    try {
        // Define filters based on role
        let projectFilter: any = {};
        let taskFilter: any = {};

        if (isPM) {
            projectFilter = {
                OR: [
                    { CreatedBy: user.UserID },
                    {
                        tasklists: {
                            some: {
                                tasks: {
                                    some: { AssignedTo: user.UserID }
                                }
                            }
                        }
                    }
                ]
            };
            taskFilter = {
                OR: [
                    { tasklists: { projects: { CreatedBy: user.UserID } } },
                    { AssignedTo: user.UserID }
                ]
            };
        } else if (isTM) {
            projectFilter = {
                tasklists: {
                    some: {
                        tasks: {
                            some: { AssignedTo: user.UserID }
                        }
                    }
                }
            };
            taskFilter = { AssignedTo: user.UserID };
        }

        const [projectsCount, tasksCount, tasksByStatus, tasksByPriority, recentActivity] = await prisma.$transaction([
            prisma.projects.count({ where: projectFilter }),
            prisma.tasks.count({ where: taskFilter }),
            prisma.tasks.groupBy({
                by: ['Status'],
                where: taskFilter,
                _count: { Status: true },
                orderBy: { Status: 'asc' }
            }),
            prisma.tasks.groupBy({
                by: ['Priority'],
                where: taskFilter,
                _count: { Priority: true },
                orderBy: { Priority: 'asc' }
            }),
            prisma.taskhistory.findMany({
                where: isTM 
                    ? { tasks: { AssignedTo: user.UserID } } 
                    : (isPM 
                        ? { 
                            OR: [
                                { tasks: { tasklists: { projects: { CreatedBy: user.UserID } } } },
                                { tasks: { AssignedTo: user.UserID } }
                            ]
                        } 
                        : {}),
                include: {
                    tasks: true,
                    users: { select: { UserName: true } }
                },
                orderBy: { ChangeTime: 'desc' },
                take: 5
            })
        ]);

        // Users count is only specifically for Admin or maybe PMs in their projects
        let teamCount = 0;
        if (isAdmin) {
            teamCount = await prisma.users.count();
        } else {
            // Count unique people assigned to tasks in PM/TM projects
            const assignedUsers = await prisma.tasks.findMany({
                where: taskFilter,
                select: { AssignedTo: true },
                distinct: ['AssignedTo']
            });
            teamCount = assignedUsers.filter(u => u.AssignedTo !== null).length;
        }

        return NextResponse.json({
            role: normalizedRole,
            projects: projectsCount,
            tasks: tasksCount,
            team: teamCount,
            charts: {
                status: tasksByStatus.map((item: any) => ({ name: item.Status, value: item._count?.Status || 0 })),
                priority: tasksByPriority.map((item: any) => ({ name: item.Priority, value: item._count?.Priority || 0 }))
            },
            activity: recentActivity.map((a: any) => ({
                id: a.HistoryID,
                taskTitle: a.tasks.Title,
                type: a.ChangeType,
                user: a.users?.UserName || 'System',
                time: a.ChangeTime
            }))
        });

    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
