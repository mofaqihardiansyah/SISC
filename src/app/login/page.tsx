"use client";

import React from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [role, setRole] = React.useState('visitor');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        role: role,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Login gagal. Periksa kembali email dan password anda.');
        return;
      }

      toast.success('Login berhasil!');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
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
            Masukkan detail anda untuk mengakses akun.
          </p>
        </div>

        <Tabs defaultValue="visitor" className="w-full" onValueChange={setRole}>
          <TabsList className="grid w-full grid-cols-3 bg-transparent p-0 rounded-none border-b border-slate-200 mb-8 h-auto gap-0">
            <TabsTrigger 
              value="visitor" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#03428B] data-[state=active]:text-[#03428B] data-[state=active]:bg-transparent py-3 text-slate-400 font-semibold text-sm transition-all shadow-none -mb-[1px]"
            >
              Pengunjung
            </TabsTrigger>
            <TabsTrigger 
              value="organizer" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#03428B] data-[state=active]:text-[#03428B] data-[state=active]:bg-transparent py-3 text-slate-400 font-semibold text-sm transition-all shadow-none -mb-[1px]"
            >
              Penyelenggara
            </TabsTrigger>
            <TabsTrigger 
              value="admin" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#03428B] data-[state=active]:text-[#03428B] data-[state=active]:bg-transparent py-3 text-slate-400 font-semibold text-sm transition-all shadow-none -mb-[1px]"
            >
              Admin
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-slate-700 ml-0.5">
                Alamat Email
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="nama@email.com" 
                className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 ml-0.5">
                  Kata Sandi
                </Label>
                <a href="/forgot-password" className="text-xs font-bold text-[#03428B] hover:underline">Lupa?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="Masukkan kata sandi" 
                className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#03428B] hover:bg-[#02336B] h-12 text-white font-bold rounded-lg mt-4 shadow-none transition-all active:scale-[0.98] cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Masuk...' : 'Masuk'}
            </Button>
          </form>
        </Tabs>

        <div className="text-center pt-4">
          {role !== 'admin' ? (
            <p className="text-sm text-slate-500 font-medium">
              Belum punya akun? <a href="/register" className="text-[#03428B] font-bold hover:underline">Daftar sekarang.</a>
            </p>
          ) : (
            <p className="text-xs text-slate-400 font-medium italic">
              Akses Admin dibatasi hanya untuk personil resmi.
            </p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
