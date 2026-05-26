const nodemailer = require('nodemailer');
const { getSupabaseAdminClient } = require('./_supabase');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Invalid request body.' }),
    };
  }

  const { name, email, service, date, time, type, files } = data;

  if (!name || !email || !service) {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Missing required fields: name, email, service.' }),
    };
  }

  // Initialize Supabase client
  let supabase;
  try {
    supabase = getSupabaseAdminClient();
  } catch (error) {
    console.error('Missing Supabase env vars');
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Server misconfiguration: missing Supabase credentials' }),
    };
  }

  const requiredEnv = ['EMAIL_USER', 'EMAIL_PASS'];
  const missing = requiredEnv.filter(key => !process.env[key]);
  if (missing.length) {
    console.error('Missing env vars:', missing.join(', '));
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Server misconfiguration: missing ${missing.join(', ')}` }),
    };
  }

  // Insert appointment into Supabase
  const { error: dbError } = await supabase.from('appointments').insert([
    {
      name,
      email,
      service,
      date,
      time,
      type,
      files,
    }
  ]);
  if (dbError) {
    console.error('Supabase insert error:', dbError);
    // continue; email will still be sent
  }

  // Create SMTP transporter using Netlify env variables
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: true, // true for port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const receiver = process.env.EMAIL_RECEIVER || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"DBA Booking System" <${process.env.EMAIL_USER}>`,
    to: receiver,
    subject: `📅 New Appointment: ${service}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #1a1a2e; border-bottom: 2px solid #c8a96e; padding-bottom: 12px;">New Appointment Booking</h2>
        <table style="width:100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Client Name</td><td style="padding: 8px;">${name}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px; font-weight: bold; color: #555;">Email</td><td style="padding: 8px;">${email}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Service</td><td style="padding: 8px;">${service}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px; font-weight: bold; color: #555;">Date</td><td style="padding: 8px;">${date || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Time</td><td style="padding: 8px;">${time || 'Not specified'}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px; font-weight: bold; color: #555;">Type</td><td style="padding: 8px;">${type || 'Online'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Attachments</td><td style="padding: 8px;">${files || 0} file(s)</td></tr>
        </table>
        <p style="margin-top: 20px; color: #888; font-size: 12px;">This booking was submitted via the Dilip Borge Associates website.</p>
      </div>
    `,
  };

  // Also send confirmation email to client
  const clientMailOptions = {
    from: `"Dilip Borge Associates" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `✅ Appointment Confirmed – ${service}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
        <h2 style="color: #1a1a2e;">Your Appointment is Confirmed</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for booking a consultation with <strong>Dilip Borge Associates</strong>. Here are your appointment details:</p>
        <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Service</td><td style="padding: 8px;">${service}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px; font-weight: bold; color: #555;">Date</td><td style="padding: 8px;">${date || 'To be confirmed'}</td></tr>
          <tr><td style="padding: 8px; font-weight: bold; color: #555;">Time</td><td style="padding: 8px;">${time || 'To be confirmed'}</td></tr>
          <tr style="background:#fff;"><td style="padding: 8px; font-weight: bold; color: #555;">Type</td><td style="padding: 8px;">${type || 'Online'}</td></tr>
        </table>
        <p>We will reach out to confirm the final details. For any queries, contact us at <a href="tel:+919898563718">+91 98985 63718</a>.</p>
        <p style="color: #888; font-size: 12px;">Dilip Borge Associates | Pune, Maharashtra</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    // Try sending client confirmation (non-blocking — don't fail if this fails)
    transporter.sendMail(clientMailOptions).catch((err) => console.warn('Client confirmation email failed:', err.message));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Appointment booked! A confirmation email has been sent.' }),
    };
  } catch (err) {
    console.error('Email error:', err);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Failed to send appointment email. Please try again or call us directly.' }),
    };
  }
};
