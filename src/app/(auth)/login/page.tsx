"use client";

import React, { useState } from 'react';
import AuthLayout from '@/components/auth/auth-layout';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result) {
        toast.error('Terjadi kesalahan pada server');
        setIsLoading(false);
        return;
      }

      if (result?.error) {
        toast.error(result.error || 'Email atau kata sandi salah');
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success('Berhasil masuk!');
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout leftTitle="Kelola acara dan tim anda dengan mudah.">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-heading font-black text-slate-900 mb-2 tracking-tight">
            Selamat Datang
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Selamat datang kembali! Silakan masuk untuk melanjutkan.
          </p>
        </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-0.5">
                Alamat Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Masukkan email anda" 
                className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                disabled={isLoading}
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-0.5">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">Kata Sandi</Label>
                <a href="/forgot-password" className="text-primary text-[11px] font-bold hover:underline">Lupa kata sandi?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="Masukkan kata sandi" 
                className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                autoComplete="current-password"
                disabled={isLoading}
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-[#02336B] h-12 text-white font-bold rounded-lg shadow-none transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? 'Masuk...' : 'Masuk'}
              </Button>
            </div>
          </form>

        <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              Belum punya akun? <a href="/register" className="text-primary font-bold hover:underline">Daftar sekarang.</a>
            </p>
        </div>
      </div>
    </AuthLayout>
  );
}