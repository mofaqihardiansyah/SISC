import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama, email, subjek, pesan } = body;

    if (!nama || !email || !subjek || !pesan) {
      return NextResponse.json(
        { error: 'Harap lengkapi semua field' },
        { status: 400 }
      );
    }

    // Configure nodemailer with Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'poliventsofficial@gmail.com', // fallback
        pass: process.env.EMAIL_PASS || '', 
      },
    });

    const mailOptions = {
      from: email, // This might be overridden by Gmail to the authenticated user, but we set replyTo
      replyTo: email,
      to: 'poliventsofficial@gmail.com', // Destination email
      subject: `Laporan ${subjek} - ${nama}`,
      text: `Nama: ${nama}\nEmail: ${email}\n\nPesan:\n${pesan}`,
      html: `
        <h3>Laporan Baru dari Form Bantuan</h3>
        <p><strong>Nama:</strong> ${nama}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subjek:</strong> ${subjek}</p>
        <hr/>
        <p><strong>Pesan:</strong></p>
        <p style="white-space: pre-wrap;">${pesan}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Pesan berhasil dikirim' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengirim pesan. Pastikan konfigurasi email sudah benar.' },
      { status: 500 }
    );
  }
}
