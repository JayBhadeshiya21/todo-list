import { cookies } from 'next/headers';
import { prisma } from './db';

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const userIdStr = cookieStore.get('userId')?.value || cookieStore.get('adminId')?.value;

    if (!userIdStr) return null;

    const userId = parseInt(userIdStr);
    if (isNaN(userId)) return null;

    const user = await prisma.users.findUnique({
        where: { UserID: userId },
        include: {
            userroles: {
                include: { roles: true },
            },
        },
    });

    return user;
}

export async function getUserRole() {
    const user = await getCurrentUser();
    if (!user || user.userroles.length === 0) return null;
    return user.userroles[0].roles.RoleName;
}

export function normalizeRole(roleName: string | null) {
    if (!roleName) return null;
    const normalized = roleName.toUpperCase().replace(/\s/g, '').replace(/_/g, '');

    if (normalized === 'ADMIN') return 'Admin';
    if (normalized === 'MANAGER' || normalized === 'PROJECTMANAGER') return 'Project Manager';
    if (normalized === 'TEAMMEMBER' || normalized === 'DEVELOPER' || normalized === 'USER') return 'Team Member';

    return roleName; // Return original if unknown
}

export async function isProjectManager() {
    const role = await getUserRole();
    const normalized = normalizeRole(role);
    return normalized === 'Project Manager';
}

export async function isAdmin() {
    const role = await getUserRole();
    const normalized = normalizeRole(role);
    return normalized === 'Admin';
}

export async function isTeamMember() {
    const role = await getUserRole();
    const normalized = normalizeRole(role);
    return normalized === 'Team Member';
}
