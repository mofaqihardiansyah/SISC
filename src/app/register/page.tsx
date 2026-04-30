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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerUser } from '@/actions/auth';
import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { FileText, Check, Loader2 } from 'lucide-react';

const visitorSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  nomorTelepon: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const organizerSchema = visitorSchema.extend({
  namaInstansi: z.string().min(3, 'Nama instansi minimal 3 karakter'),
  deskripsiInstansi: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  dokumenLegalitasUrl: z.string().optional(),
});

type VisitorValues = z.infer<typeof visitorSchema>;
type OrganizerValues = z.infer<typeof organizerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = React.useState('visitor');

  const [isUploading, setIsUploading] = React.useState(false);

  const visitorForm = useForm<VisitorValues>({
    resolver: zodResolver(visitorSchema),
  });

  const organizerForm = useForm<OrganizerValues>({
    resolver: zodResolver(organizerSchema),
    defaultValues: {
      dokumenLegalitasUrl: "",
    }
  });

  const onVisitorSubmit = async (data: VisitorValues) => {
    const result = await registerUser(data, 'visitor');
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Pendaftaran berhasil! Periksa email anda untuk kode OTP.');
    router.push('/register/verify?email=' + encodeURIComponent(data.email));
  };

  const onOrganizerSubmit = async (data: OrganizerValues) => {
    if (!data.dokumenLegalitasUrl) {
      toast.error('Harap unggah dokumen legalitas (PDF)');
      return;
    }

    const result = await registerUser(data, 'organizer');
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success('Pendaftaran berhasil! Periksa email anda untuk kode OTP.');
    router.push('/register/verify?email=' + encodeURIComponent(data.email));
  };

  return (
    <AuthLayout leftTitle="Bergabunglah dengan platform acara terbaik.">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-heading font-black text-slate-900 mb-1 tracking-tight">
            Buat Akun
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Gabung dengan POLIVENTS dan mulai perjalanan anda hari ini.
          </p>
        </div>

        <Tabs defaultValue="visitor" className="w-full" onValueChange={setRole}>
          <TabsList className="flex w-full bg-transparent p-0 rounded-none border-b border-slate-200 mb-8 h-auto gap-0">
            <TabsTrigger 
              value="visitor" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#03428B] data-[state=active]:text-[#03428B] data-[state=active]:bg-transparent py-3 text-slate-400 font-semibold text-sm transition-all shadow-none -mb-[1px]"
            >
              Pengunjung
            </TabsTrigger>
            <TabsTrigger 
              value="organizer" 
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-[#03428B] data-[state=active]:text-[#03428B] data-[state=active]:bg-transparent py-3 text-slate-400 font-semibold text-sm transition-all shadow-none -mb-[1px]"
            >
              Penyelenggara
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visitor">
            <form onSubmit={visitorForm.handleSubmit(onVisitorSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Nama Lengkap</Label>
                <Input 
                  placeholder="Nama Pengunjung" 
                  className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                  {...visitorForm.register('namaLengkap')}
                />
                {visitorForm.formState.errors.namaLengkap && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{visitorForm.formState.errors.namaLengkap.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Alamat Email</Label>
                <Input 
                  type="email" 
                  placeholder="Email Pengunjung" 
                  className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                  {...visitorForm.register('email')}
                />
                {visitorForm.formState.errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{visitorForm.formState.errors.email.message}</p>}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">No. HP</Label>
                  <Input 
                    placeholder="Nomor Telepon" 
                    className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...visitorForm.register('nomorTelepon')}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">Kata Sandi</Label>
                  <Input 
                    type="password" 
                    placeholder="Password Minimal 8 Karakter" 
                    className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...visitorForm.register('password')}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#03428B] hover:bg-[#02336B] h-12 text-white font-bold rounded-lg mt-2 shadow-none transition-all active:scale-[0.98] cursor-pointer"
                disabled={visitorForm.formState.isSubmitting}
              >
                {visitorForm.formState.isSubmitting ? 'Mendaftar...' : 'Buat Akun'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="organizer">
            <form onSubmit={organizerForm.handleSubmit(onOrganizerSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Nama Lengkap</Label>
                <Input 
                  placeholder="Nama Lengkap" 
                  className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                  {...organizerForm.register('namaLengkap')}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">Alamat Email</Label>
                  <Input 
                    type="email" 
                    placeholder="Email Organisasi" 
                    className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...organizerForm.register('email')}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">No. HP</Label>
                  <Input 
                    placeholder="Nomor Telepon" 
                    className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...organizerForm.register('nomorTelepon')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Nama Institusi</Label>
                <Input 
                  placeholder="Nama Institusi" 
                  className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-[#03428B] focus-visible:border-[#03428B] text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                  {...organizerForm.register('namaInstansi')}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Dokumen Legalitas (PDF)</Label>
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200 border-dashed hover:border-[#03428B]/50 transition-colors">
                  <div className="bg-blue-50 p-2.5 rounded-lg">
                    <FileText className="w-5 h-5 text-[#03428B]" />
                  </div>
                  <div className="flex-1">
                    {organizerForm.watch('dokumenLegalitasUrl') ? (
                      <div className="flex items-center text-xs font-bold text-green-600">
                        <Check className="w-3.5 h-3.5 mr-1.5" /> Dokumen Terunggah
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-slate-400">PDF, Maks 4MB</p>
                    )}
                  </div>
                  <UploadButton<OurFileRouter, "pdfUploader">
                    endpoint="pdfUploader"
                    onUploadProgress={() => setIsUploading(true)}
                    onClientUploadComplete={(res) => {
                      organizerForm.setValue('dokumenLegalitasUrl', res[0].url);
                      setIsUploading(false);
                      toast.success('Dokumen berhasil diunggah');
                    }}
                    onUploadError={(error: Error) => {
                      setIsUploading(false);
                      toast.error(`Gagal unggah: ${error.message}`);
                    }}
                    content={{
                      button: ({ ready }) => (
                        <div className="text-xs font-bold text-[#03428B] hover:text-[#02336B] cursor-pointer">
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pilih Berkas'}
                        </div>
                      ),
                      allowedContent: () => null
                    }}
                    appearance={{
                      button: "bg-transparent hover:bg-transparent shadow-none w-auto h-auto p-0 border-none",
                      container: "w-auto"
                    }}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#03428B] hover:bg-[#02336B] h-12 text-white font-bold rounded-lg mt-2 shadow-none transition-all active:scale-[0.98] cursor-pointer"
                disabled={organizerForm.formState.isSubmitting || isUploading}
              >
                {organizerForm.formState.isSubmitting ? 'Memproses Akun...' : 'Buat Akun'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 font-medium">
            Sudah punya akun? <a href="/login" className="text-[#03428B] font-bold hover:underline">Masuk.</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
