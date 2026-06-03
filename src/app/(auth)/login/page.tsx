"use client";

import React, { useState } from 'react';
import AuthLayout from '@/components/auth/auth-layout';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signIn, getSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setGlobalError(null);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result) {
        setGlobalError('Terjadi kesalahan pada server');
        return;
      }

      if (result?.error) {
        setGlobalError('Email atau kata sandi salah');
        return;
      }

      if (result?.ok) {
        // Ambil session untuk cek role
        const session = await getSession();
        const role = (session?.user as { role?: string })?.role;

        toast.success('Berhasil masuk!');
        
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else if (role === 'organizer') {
          router.push('/penyelenggara');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setGlobalError('Terjadi kesalahan, silakan coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout leftTitle="Kelola acara dan tim anda dengan mudah.">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-heading font-black text-slate-900 mb-1 tracking-tight">
            Selamat Datang
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Masuk ke akun Anda untuk melanjutkan
          </p>
        </div>

        {globalError && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg flex items-start gap-3 text-sm font-medium animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p>{globalError}</p>
          </div>
        )}

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
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Masukkan kata sandi" 
                  className="bg-white border-slate-200 h-12 px-4 pr-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                  autoComplete="current-password"
                  disabled={isLoading}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
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