import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        let whereClause: any = {};
        if (userId) {
            whereClause.CreatedBy = parseInt(userId);
        }

        const projects = await prisma.projects.findMany({
            where: whereClause,
            include: {
                users: { // Creator info
                    select: {
                        UserName: true,
                        Email: true
                    }
                }
            },
            orderBy: {
                CreatedAt: 'desc',
            },
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { ProjectName, Description, CreatedBy } = body;

        if (!ProjectName || !CreatedBy) {
            return NextResponse.json(
                { error: 'ProjectName and CreatedBy are required' },
            );
        }

        const newProject = await prisma.projects.create({
            data: {
                ProjectName,
                Description,
                CreatedBy: parseInt(CreatedBy),
            },
        });

        return NextResponse.json(newProject, { status: 201 });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
