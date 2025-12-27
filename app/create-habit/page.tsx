'use client'

import { initializeProtocol } from './actions'
import { HabitWizard } from '@/components/HabitWizard/HabitWizard'

export default function NewHabitPage() {
    return (
        <HabitWizard
            action={initializeProtocol}
            mode="create"
        />
    )
}
