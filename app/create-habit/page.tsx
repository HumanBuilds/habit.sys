import { initializeProtocol } from './actions'
import { HabitWizard } from '@/components/HabitWizard/HabitWizard'
import { Window } from '@/components/Window'

export default function NewHabitPage() {
    return (
        <div className="h-full p-4 md:p-8 !pb-0 flex flex-col items-center justify-center">
            <Window title="NEW_HABIT_WIZARD.EXE" className="w-full max-w-2xl min-h-0">
                <HabitWizard
                    action={initializeProtocol}
                    mode="create"
                />
            </Window>
        </div>
    )
}
