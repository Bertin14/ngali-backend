import nodemailer from 'nodemailer'

const transportOptions = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  family: 4, // force IPv4 — avoids ENETUNREACH on hosts without outbound IPv6
}

const transporter = nodemailer.createTransport(transportOptions as Parameters<typeof nodemailer.createTransport>[0])

export async function sendContactNotification(name: string, email: string, message: string) {
  await transporter.sendMail({
    from: `"Ngali Holdings Website" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Contact Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #161616; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #C9824B; margin: 0;">New Contact Message</h2>
          <p style="color: #999; margin: 5px 0 0;">Ngali Holdings Website</p>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #C9824B;">
            ${message}
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Reply to this message from your 
            <a href="https://ngaliholdings.vercel.app/admin/contacts" style="color: #C9824B;">
              admin dashboard
            </a>
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendApplicationNotification(
  name: string,
  email: string,
  jobId: string,
  coverLetter: string
) {
  await transporter.sendMail({
    from: `"Ngali Holdings Website" <${process.env.GMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Job Application — ${jobId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #161616; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #C9824B; margin: 0;">New Job Application</h2>
          <p style="color: #999; margin: 5px 0 0;">Ngali Holdings Careers</p>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p><strong>Applicant:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Position:</strong> ${jobId}</p>
          <p><strong>Cover Letter:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #C9824B;">
            ${coverLetter}
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">
            Review this application from your 
            <a href="https://ngaliholdings.vercel.app/admin/applications" style="color: #C9824B;">
              admin dashboard
            </a>
          </p>
        </div>
      </div>
    `,
  })
}

export async function sendReply(to: string, name: string, replyMessage: string, originalMessage: string) {
  await transporter.sendMail({
    from: `"Ngali Holdings" <${process.env.GMAIL_USER}>`,
    to: `${name} <${to}>`,
    subject: `Re: Your message to Ngali Holdings`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #161616; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="color: #C9824B; margin: 0;">Ngali Holdings</h2>
          <p style="color: #999; margin: 5px 0 0;">Reply to your message</p>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px;">
          <p>Dear ${name},</p>
          <div style="background: white; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            ${replyMessage}
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="color: #999; font-size: 13px;">Your original message:</p>
          <div style="color: #999; font-size: 13px; padding: 10px; background: #eee; border-radius: 6px;">
            ${originalMessage}
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 13px;">
            Best regards,<br/>
            <strong>Ngali Holdings Team</strong>
          </p>
        </div>
      </div>
    `,
  })
}