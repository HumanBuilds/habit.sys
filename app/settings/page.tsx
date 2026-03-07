import { auth, currentUser } from '@clerk/nextjs/server';
import { Window } from '@/components/Window';
import { SettingsClient } from '@/components/SettingsPanel/SettingsClient';
import { getAlias, getPointsBalance } from './actions';

export default async function SettingsPage() {
    const { userId } = await auth();
    const user = userId ? await currentUser() : null;
    const [aliasResult, pointsResult] = await Promise.all([
        userId ? getAlias() : Promise.resolve({ alias: null }),
        userId ? getPointsBalance() : Promise.resolve({ balance: 0 }),
    ]);

    const userData = userId ? {
        email: user?.emailAddresses[0]?.emailAddress ?? null,
        alias: aliasResult.alias,
        hasPassword: user?.passwordEnabled ?? false,
    } : null;

    return (
        <div className="h-full p-4 md:p-8 !pb-0 flex flex-col items-center justify-center">
            <Window
                title="SYS.CONFIG"
                className="w-full max-w-2xl min-h-[442px]"
            >
                <SettingsClient isAuthenticated={!!userId} userData={userData} pointsBalance={pointsResult.balance} />
            </Window>
        </div>
    );
}
