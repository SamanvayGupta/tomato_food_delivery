import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email } = req.body;
  const resend = new Resend(process.env.VITE_RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "TOMATO 🍅 <onboarding@resend.dev>",
      to: email,
      subject: `Welcome to TOMATO, ${name}!`,
      html: `<h2>Hey ${name} 👋</h2><p>Welcome to TOMATO!</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}
