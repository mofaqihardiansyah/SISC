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
    <AuthLayout leftTitle="Daftarkan akun anda dan join sebagai bagian dari POLIVENTS">
      <div className="space-y-10">
        <div>
          <h3 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
            Registrasi
          </h3>
          <p className="text-slate-500 text-sm font-medium">
            Langkah awal untuk pengalaman event yang tak terlupakan.
          </p>
        </div>

        <Tabs defaultValue="visitor" className="w-full" onValueChange={setRole}>
          <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-slate-100 rounded-none h-auto p-0 mb-8">
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
          </TabsList>

          <TabsContent value="visitor">
            <form onSubmit={visitorForm.handleSubmit(onVisitorSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">NAMA LENGKAP</Label>
                <Input 
                  placeholder="Budi Santoso" 
                  className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                  {...visitorForm.register('namaLengkap')}
                />
                {visitorForm.formState.errors.namaLengkap && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{visitorForm.formState.errors.namaLengkap.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">EMAIL ADDRESS</Label>
                <Input 
                  type="email" 
                  placeholder="budi@email.com" 
                  className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                  {...visitorForm.register('email')}
                />
                {visitorForm.formState.errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{visitorForm.formState.errors.email.message}</p>}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">NO HP</Label>
                  <Input 
                    placeholder="0812..." 
                    className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                    {...visitorForm.register('nomorTelepon')}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">PASSWORD</Label>
                  <Input 
                    type="password" 
                    placeholder="********" 
                    className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                    {...visitorForm.register('password')}
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#0061E5] hover:bg-[#0052cc] h-14 text-white font-bold rounded-xl mt-4 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                disabled={visitorForm.formState.isSubmitting}
              >
                {visitorForm.formState.isSubmitting ? 'Loading...' : 'Daftar Sekarang →'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="organizer">
            <form onSubmit={organizerForm.handleSubmit(onOrganizerSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">NAMA LENGKAP</Label>
                <Input 
                  placeholder="John Doe" 
                  className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                  {...organizerForm.register('namaLengkap')}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">EMAIL</Label>
                  <Input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                    {...organizerForm.register('email')}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">NO HP</Label>
                  <Input 
                    placeholder="08123456789" 
                    className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                    {...organizerForm.register('nomorTelepon')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">NAMA INSTITUSI / ORGANISASI</Label>
                <Input 
                  placeholder="PT. Inovasi Kreasi" 
                  className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                  {...organizerForm.register('namaInstansi')}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">DESKRIPSI SINGKAT</Label>
                <Input 
                  placeholder="Ceritakan sedikit tentang visi lembaga Anda..." 
                  className="bg-slate-50 border-none h-14 px-5 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20 text-slate-600 font-medium placeholder:text-slate-300"
                  {...organizerForm.register('deskripsiInstansi')}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1">DOKUMEN LEGALITAS (PDF)</Label>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FileText className="w-6 h-6 text-[#0061E5]" />
                  </div>
                  <div className="flex-1">
                    {organizerForm.watch('dokumenLegalitasUrl') ? (
                      <div className="flex items-center text-xs font-bold text-green-600">
                        <Check className="w-3 h-3 mr-1" /> Dokumen Terunggah
                      </div>
                    ) : (
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Format PDF, Maks 4MB</p>
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
                        <div className="text-xs font-black text-[#0061E5] uppercase tracking-wider hover:underline cursor-pointer">
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Pilih File'}
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
                className="w-full bg-[#0061E5] hover:bg-[#0052cc] h-14 text-white font-bold rounded-xl mt-4 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                disabled={organizerForm.formState.isSubmitting || isUploading}
              >
                {organizerForm.formState.isSubmitting ? 'Mendaftarkan...' : 'Daftar Sekarang →'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center pt-2">
          <p className="text-[11px] text-slate-400 font-medium mb-6 px-4 leading-relaxed">
            Dengan mendaftar, Anda menyetujui <a href="#" className="text-[#0061E5] hover:underline">Ketentuan Layanan</a> dan <a href="#" className="text-[#0061E5] hover:underline">Kebijakan Privasi</a> POLIVENTS.
          </p>
          <p className="text-sm text-slate-500 font-medium">
            Sudah punya akun? <a href="/login" className="text-[#0061E5] font-bold hover:underline">Masuk</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
