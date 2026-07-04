import type { APIRoute } from 'astro';
import { CONTACT_EMAIL, RESEND_API_KEY, RESEND_FROM } from 'astro:env/server';
import { Resend } from 'resend';
import { renderContactEmailTemplate } from '../../utils/templates/contactEmail';

export const prerender = false;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, service, message } = await request.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isValidEmail(email.trim())) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedService = service?.trim() || 'Not specified';
    const trimmedMessage = message.trim();

    const { data, error } = await resend.emails.send({
      from: RESEND_FROM,
      to: [CONTACT_EMAIL],
      replyTo: trimmedEmail,
      subject: `New Project Inquiry: ${trimmedService}`,
      html: renderContactEmailTemplate({
        name: trimmedName,
        email: trimmedEmail,
        service: trimmedService,
        message: trimmedMessage,
      }),
    });

    if (error) {
      console.error('Resend API Error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to send email. Please try again later.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Message sent successfully.', id: data?.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Contact API Route Error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected server error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
