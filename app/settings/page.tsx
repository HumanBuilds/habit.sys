import { auth } from '@clerk/nextjs/server';
import { Window } from '@/components/Window';
import { SettingsClient } from '@/components/SettingsPanel/SettingsClient';

export default async function SettingsPage() {
    const { userId } = await auth();

    return (
        <div className="h-full p-4 md:p-8 !pb-0 flex flex-col items-center justify-center">
            <Window
                title="SYS.CONFIG"
                className="w-full max-w-2xl min-h-[442px]"
            >
                <SettingsClient isAuthenticated={!!userId} />
            </Window>
        </div>
    );
}
