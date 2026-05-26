const nodemailer = require("nodemailer");
const { getSupabaseAdminClient } = require("./_supabase");

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return response(200, {});
  if (event.httpMethod !== "POST") return response(405, { message: "Method Not Allowed" });

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return response(400, { message: "Invalid request body." });
  }

  const { name, email, phone, service, message } = data;
  if (!name || !email || !service || !message) {
    return response(400, { message: "Missing required fields: name, email, service, message." });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase.from("inquiries").insert([
      { name, email, phone: phone || null, service, message },
    ]);
    if (error) {
      console.error("Supabase inquiry insert error:", error);
      return response(500, { message: "Failed to save inquiry." });
    }
  } catch (error) {
    console.error("Supabase configuration error:", error.message);
    return response(500, { message: "Server misconfiguration: missing Supabase credentials" });
  }

  const requiredEnv = ["EMAIL_USER", "EMAIL_PASS"];
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    return response(200, { message: "Inquiry saved successfully." });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"DBA Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
      subject: `New Inquiry: ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #16324f;">New Website Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Message:</strong><br>${message}</p>
        </div>
      `,
    });
  } catch (error) {
    console.warn("Inquiry email failed:", error.message);
  }

  return response(200, { message: "Inquiry submitted successfully." });
};
