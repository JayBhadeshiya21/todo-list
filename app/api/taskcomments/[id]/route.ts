import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

/* =========================
   GET COMMENT BY ID
========================= */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
        return NextResponse.json(
            { error: 'commentId is required' },
            { status: 400 }
        );
    }

    try {
        const comment = await prisma.taskcomments.findUnique({
            where: {
                CommentID: parseInt(commentId),
            },
            include: {
                users: {
                    select: {
                        UserID: true,
                        UserName: true,
                        Email: true,
                    },
                },
                tasks: {
                    select: {
                        TaskID: true,
                        Title: true,
                    },
                },
            },
        });

        if (!comment) {
            return NextResponse.json(
                { error: 'Comment not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(comment);
    } catch (error) {
        console.error('Error fetching comment:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comment' },
            { status: 500 }
        );
    }
}

/* =========================
   UPDATE COMMENT (PUT)
========================= */
export async function PUT(request: Request) {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
        return NextResponse.json(
            { error: 'commentId is required' },
            { status: 400 }
        );
    }

    try {
        const body = await request.json();
        const { CommentText } = body;

        if (!CommentText) {
            return NextResponse.json(
                { error: 'CommentText is required' },
                { status: 400 }
            );
        }

        const updatedComment = await prisma.taskcomments.update({
            where: {
                CommentID: parseInt(commentId),
            },
            data: {
                CommentText,
            },
        });

        return NextResponse.json(updatedComment);
    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json(
            { error: 'Failed to update comment' },
            { status: 500 }
        );
    }
}

/* =========================
   DELETE COMMENT
========================= */
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');

    if (!commentId) {
        return NextResponse.json(
            { error: 'commentId is required' },
            { status: 400 }
        );
    }

    try {
        await prisma.taskcomments.delete({
            where: {
                CommentID: parseInt(commentId),
            },
        });

        return NextResponse.json(
            { message: 'Comment deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json(
            { error: 'Failed to delete comment' },
            { status: 500 }
        );
    }
}
