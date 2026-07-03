import type { APIRoute } from 'astro';

export const prerender = false; // This API route must run dynamically on server/adapter

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, service, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'Name, email, and message are required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.log('--- Mock Contact Form Submission ---');
      console.log(`Name: ${name}`);
      console.log(`Email: ${email}`);
      console.log(`Service: ${service}`);
      console.log(`Message: ${message}`);
      console.log('------------------------------------');

      return new Response(
        JSON.stringify({ message: 'Success (Mock - RESEND_API_KEY not configured)' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email using Resend API
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Britnova Contact Form <onboarding@resend.dev>', // Resend sandbox requirement
        to: 'hello@britnova.com',
        subject: `New Project Inquiry: ${service}`,
        html: `
          <h3>New Lead from Britnova Technologies</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Project Scope:</strong> ${service}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br/>')}</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Resend API Error:', errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to send email via Resend.' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Message sent successfully.' }),
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
