"use client";

import React, { useState } from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { resetPassword, verifyResetOtpAction, requestPasswordReset } from '@/actions/auth';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password minimal 6 karakter'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Kata sandi tidak cocok",
  path: ["confirmPassword"],
});

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Silakan masukkan 6 digit kode OTP');
      return;
    }

    setIsVerifyingOTP(true);
    try {
      const result = await verifyResetOtpAction(email, otp) as { error?: string };
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Kode OTP valid. Silakan masukkan kata sandi baru Anda.');
        setStep(2);
      }
    } catch {
      toast.error('Terjadi kesalahan saat memverifikasi OTP.');
    } finally {
      setIsVerifyingOTP(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await requestPasswordReset(email) as { error?: string };
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Kode OTP baru telah dikirim ke email anda.');
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: ResetPasswordValues) => {
    try {
      const result = await resetPassword(email, otp, data.password) as { error?: string };
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Kata sandi berhasil direset! Anda akan dialihkan ke beranda.');
      
      const signInResult = await signIn('credentials', {
        email,
        password: data.password,
        redirect: false
      });
      
      if (signInResult?.ok) {
        window.location.href = '/'; // Redirect to dashboard / home
      } else {
        window.location.href = '/login';
      }
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <AuthLayout leftTitle="Buat kata sandi baru untuk akun Anda.">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {step === 1 ? 'Verifikasi OTP' : 'Kata Sandi Baru'}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {step === 1 
              ? <>Masukkan kode OTP yang telah kami kirimkan ke <b>{email}</b>.</>
              : 'Silakan buat kata sandi baru untuk mengamankan akun Anda.'}
          </p>
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-6 py-2">
            <div className="space-y-3 flex flex-col items-center">
              <Label className="text-sm font-semibold text-slate-700 ml-0.5 w-full text-left">Kode OTP</Label>
              <InputOTP 
                maxLength={6} 
                value={otp} 
                onChange={setOtp}
                className="gap-3"
              >
                <InputOTPGroup className="gap-3 w-full justify-between">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot 
                      key={index}
                      index={index} 
                      className="w-12 h-14 text-2xl font-bold rounded-lg border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary" 
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              onClick={handleVerifyOTP}
              className="w-full bg-primary hover:bg-sisc-auth h-12 text-white font-bold rounded-lg shadow-none transition-all active:scale-[0.98] cursor-pointer"
              disabled={isVerifyingOTP || otp.length !== 6}
            >
              {isVerifyingOTP ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isVerifyingOTP ? 'Memverifikasi...' : 'Verifikasi Kode'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-slate-500 font-medium">
                Tidak menerima kode?{' '}
                <Button 
                  variant="link"
                  onClick={handleResend}
                  disabled={isResending}
                  className="font-bold"
                >
                  {isResending ? 'Mengirim...' : 'Kirim Ulang Kode'}
                </Button>
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-0.5">
                Kata Sandi Baru
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="Minimal 6 karakter" 
                className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700 ml-0.5">
                Konfirmasi Kata Sandi
              </Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="Masukkan ulang kata sandi baru" 
                className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-sisc-auth h-12 text-white font-bold rounded-lg shadow-none transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {isSubmitting ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordContent />
    </React.Suspense>
  );
}
