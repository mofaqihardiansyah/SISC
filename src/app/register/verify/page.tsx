"use client";

import React from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { verifyOtpAction, resendOtpAction } from '@/actions/auth';
import { Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [otp, setOtp] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Silakan masukkan 6 digit kode OTP');
      return;
    }

    setIsVerifying(true);
    const result = await verifyOtpAction(email, otp);
    setIsVerifying(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Verifikasi berhasil! Akun anda telah aktif.');
    router.push('/login');
  };

  const handleResend = async () => {
    setIsResending(true);
    const result = await resendOtpAction(email);
    setIsResending(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Kode OTP baru telah dikirim ke email anda.');
  };

  return (
    <AuthLayout leftTitle="Masukan kode OTP anda dan join sebagai bagian dari POLIVENTS">
      <div className="space-y-10">
        <div className="text-left">
          <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Masukan Kode OTP
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            Satu langkah lagi! Masukkan kode OTP yang dikirim melalui E-mail untuk melanjutkan proses registrasi.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">VERIFIKASI OTP</p>
          <p className="text-xs text-gray-400">Masukkan 6-digit kode yang telah kami kirimkan ke alamat email anda.</p>
          
          <InputOTP 
            maxLength={6} 
            value={otp} 
            onChange={setOtp}
            className="gap-2"
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} className="w-12 h-14 text-xl font-bold rounded-lg border-2 data-[active=true]:border-primary" />
              <InputOTPSlot index={1} className="w-12 h-14 text-xl font-bold rounded-lg border-2 data-[active=true]:border-primary" />
              <InputOTPSlot index={2} className="w-12 h-14 text-xl font-bold rounded-lg border-2 data-[active=true]:border-primary" />
              <InputOTPSlot index={3} className="w-12 h-14 text-xl font-bold rounded-lg border-2 data-[active=true]:border-primary" />
              <InputOTPSlot index={4} className="w-12 h-14 text-xl font-bold rounded-lg border-2 data-[active=true]:border-primary" />
              <InputOTPSlot index={5} className="w-12 h-14 text-xl font-bold rounded-lg border-2 data-[active=true]:border-primary" />
            </InputOTPGroup>
          </InputOTP>

          <Button 
            onClick={handleVerify}
            className="w-full bg-[#0061E5] hover:bg-[#0052cc] h-14 text-white font-bold rounded-xl mt-2 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isVerifying ? 'Memverifikasi...' : 'Verifikasi Sekarang →'}
          </Button>

          <p className="text-xs text-gray-400">
            Belum menerima kode?{' '}
            <button 
              onClick={handleResend}
              disabled={isResending}
              className="text-[#0061E5] font-bold hover:underline disabled:opacity-50"
            >
              {isResending ? 'Mengirim...' : 'Kirim ulang kode'}
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
