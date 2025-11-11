import { Resend } from "resend";

export async function sendEmail(name: string, email: string) {
  const resend = new Resend(process.env.VITE_RESEND_API_KEY);

  await resend.emails.send({
    from: "TOMATO 🍅 <onboarding@resend.dev>",
    to: email,
    subject: `Welcome to TOMATO, ${name}!`,
    html: `
      <h2>Hey ${name} 👋</h2>
      <p>Thanks for connecting with <b>TOMATO</b>!</p>
      <ul>
        <li>Late-night cravings? 🌙</li>
        <li>Pocket-friendly meals 💸</li>
        <li>Best food spots around campus 🍔</li>
      </ul>
      <p><a href="https://tomatofoodfelivery.vercel.app">Open TOMATO</a></p>
      <p>❤️ The Tomato Team</p>
    `,
  });
}
