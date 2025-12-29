import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
    let recipient = to;

    // CRITICAL: Safety Trap
    // Prefer safe testing in dev to avoid spamming real users
    if (process.env.NODE_ENV !== 'production') {
        console.warn(
            `[Email] Development mode detected. Redirecting email from ${to} to human.builds.admin@gmail.com`
        );
        recipient = 'human.builds.admin@gmail.com';
    }

    try {
        const data = await resend.emails.send({
            from: 'habit.sys <habit.sys@humanbuilds.dev>',
            to: recipient,
            subject: subject,
            html: html,
        });

        return { success: true, data };
    } catch (error) {
        console.error('[Email] Failed to send email:', error);
        return { success: false, error };
    }
}
