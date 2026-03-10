import { NextResponse } from 'next/server';
import { getCurrentUser, normalizeRole } from '@/lib/auth';

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const roleName = user.userroles[0]?.roles?.RoleName || null;
    const normalizedRole = normalizeRole(roleName);

    return NextResponse.json({
        userId: user.UserID,
        username: user.UserName,
        email: user.Email,
        role: normalizedRole,
        originalRole: roleName
    });
}
