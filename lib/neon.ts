import { auth } from '@clerk/nextjs/server'
import { NeonPostgrestClient, fetchWithToken } from '@neondatabase/postgrest-js'

export async function createNeonClient() {
    const { getToken } = await auth()
    // Specify the Clerk JWT template name you created for Neon (usually 'neon')
    const token = await getToken({ template: 'neon' })

    const authFetch = fetchWithToken(async () => token ?? '')

    return new NeonPostgrestClient({
        dataApiUrl: process.env.NEXT_PUBLIC_NEON_DATA_API_URL!,
        options: {
            global: { fetch: authFetch },
        },
    })
}
