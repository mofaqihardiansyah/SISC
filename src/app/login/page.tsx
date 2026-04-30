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
    <AuthLayout leftTitle="Masukan akun anda dan join sebagai bagian dari POLIVENTS">
      <div className="space-y-10">
        <div>
          <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Login
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            Satu langkah lagi menuju momen seru yang kamu tunggu.
          </p>
        </div>

        <Tabs defaultValue="visitor" className="w-full" onValueChange={setRole}>
          <TabsList className="grid w-full grid-cols-3 bg-transparent border-b border-slate-100 rounded-none h-auto p-0 mb-8">
            <TabsTrigger 
              value="visitor" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0061E5] data-[state=active]:text-[#0061E5] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-slate-400 font-bold text-xs uppercase tracking-widest transition-all"
            >
              Pengunjung
            </TabsTrigger>
            <TabsTrigger 
              value="organizer" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0061E5] data-[state=active]:text-[#0061E5] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-slate-400 font-bold text-xs uppercase tracking-widest transition-all"
            >
              Penyelenggara
            </TabsTrigger>
            <TabsTrigger 
              value="admin" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0061E5] data-[state=active]:text-[#0061E5] data-[state=active]:bg-transparent data-[state=active]:shadow-none py-3 px-0 text-slate-400 font-bold text-xs uppercase tracking-widest transition-all"
            >
              Admin
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                EMAIL ADDRESS
              </Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="Budi Santoso" 
                className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                {...register('email')}
              />
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">
                PASSWORD
              </Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="budi@email.com" 
                className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                {...register('password')}
              />
              {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#0061E5] hover:bg-[#0052cc] h-14 text-white font-bold rounded-xl mt-4 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : 'Masuk Sekarang →'}
            </Button>
          </form>
        </Tabs>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400 font-medium mb-6 px-4 leading-relaxed">
            Dengan mendaftar, Anda menyetujui <a href="#" className="text-[#0061E5] hover:underline">Ketentuan Layanan</a> dan <a href="#" className="text-[#0061E5] hover:underline">Kebijakan Privasi</a> POLIVENTS.
          </p>
          <p className="text-sm text-slate-500 font-medium">
            Belum punya akun? <a href="/register" className="text-[#0061E5] font-bold hover:underline">Daftar</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
