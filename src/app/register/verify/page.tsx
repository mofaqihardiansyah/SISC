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
    const result = await verifyOtpAction(email, otp) as { error?: string };
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
    const result = await resendOtpAction(email) as { error?: string };
    setIsResending(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Kode OTP baru telah dikirim ke email anda.');
  };

  return (
    <AuthLayout leftTitle="Amankan akun anda dengan kode verifikasi.">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-heading font-black text-slate-900 mb-2 tracking-tight">
            Verifikasi Email
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Kami telah mengirimkan 6 digit kode ke alamat email anda.
          </p>
        </div>

        <div className="flex flex-col items-center gap-8 py-4">
          <InputOTP 
            maxLength={6} 
            value={otp} 
            onChange={setOtp}
            className="gap-3"
          >
            <InputOTPGroup className="gap-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot 
                  key={index}
                  index={index} 
                  className="w-12 h-14 text-2xl font-bold rounded-lg border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary" 
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <div className="w-full space-y-4">
            <Button 
              onClick={handleVerify}
              className="w-full bg-primary hover:bg-[#02336B] h-12 text-white font-bold rounded-lg shadow-none transition-all active:scale-[0.98] cursor-pointer"
              disabled={isVerifying || otp.length !== 6}
            >
              {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isVerifying ? 'Memverifikasi...' : 'Verifikasi Kode'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-slate-500 font-medium">
                Tidak menerima kode?{' '}
                <button 
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary font-bold hover:underline disabled:opacity-50 cursor-pointer"
                >
                  {isResending ? 'Mengirim...' : 'Kirim Ulang Kode'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
