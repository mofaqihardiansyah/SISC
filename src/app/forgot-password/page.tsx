"use client";

import React from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { requestPasswordReset } from '@/actions/auth';
import { Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email tidak valid'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordValues) => {
    try {
      const result = await requestPasswordReset(data.email) as { error?: string };
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success('Kode OTP reset password telah dikirim ke email Anda.');
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (_error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  return (
    <AuthLayout leftTitle="Kembalikan akses ke akun POLIVENTS Anda.">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-heading font-black text-slate-900 mb-2 tracking-tight">
            Lupa Kata Sandi?
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Masukkan alamat email Anda yang terdaftar, kami akan mengirimkan instruksi untuk mereset kata sandi Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-0.5">
              Alamat Email
            </Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="nama@email.com" 
              className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
              {...register('email')}
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-[#02336B] h-12 text-white font-bold rounded-lg shadow-none transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isSubmitting ? 'Mengirim...' : 'Kirim Kode Reset'}
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 font-medium">
            Ingat kata sandi Anda? <a href="/login" className="text-primary font-bold hover:underline">Masuk.</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
