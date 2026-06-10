"use client";

import React from 'react';
import AuthLayout from '@/components/auth/auth-layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useForm, useWatch, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { registerUser } from '@/actions/auth';
import { FileUpload } from '@/components/shared/FileUpload';
import { FileText, Eye, EyeOff, AlertCircle } from 'lucide-react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const visitorSchema = z.object({
  namaLengkap: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  nomorTelepon: z.string({ message: 'Nomor HP wajib diisi' }).min(1, 'Nomor HP wajib diisi').refine((val) => {
    try { return isValidPhoneNumber(val); } catch { return false; }
  }, 'Nomor telepon tidak valid untuk negara tersebut'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenisKelamin: z.enum(['Laki-laki', 'Perempuan'], { message: 'Pilih jenis kelamin' }),
  institusi: z.string().min(3, 'Institusi minimal 3 karakter'),
  pekerjaan: z.string().min(3, 'Pekerjaan minimal 3 karakter'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Password harus mengandung kombinasi huruf dan angka'),
});

const organizerSchema = visitorSchema.omit({ institusi: true, tanggalLahir: true, jenisKelamin: true, pekerjaan: true, namaLengkap: true }).extend({
  namaInstansi: z.string().min(3, 'Nama instansi minimal 3 karakter'),
  deskripsiInstansi: z.string().min(10, 'Deskripsi minimal 10 karakter'),
  urlDokumenLegalitas: z.string().optional(),
});

type VisitorValues = z.infer<typeof visitorSchema>;
type OrganizerValues = z.infer<typeof organizerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const visitorForm = useForm<VisitorValues>({
    resolver: zodResolver(visitorSchema),
  });

  const organizerForm = useForm<OrganizerValues>({
    resolver: zodResolver(organizerSchema),
    defaultValues: {
      urlDokumenLegalitas: "",
    }
  });

  const currentDokumenUrl = useWatch({
    control: organizerForm.control,
    name: 'urlDokumenLegalitas',
  });

  const [showVisitorPassword, setShowVisitorPassword] = React.useState(false);
  const [showOrganizerPassword, setShowOrganizerPassword] = React.useState(false);
  const [globalError, setGlobalError] = React.useState<string | null>(null);


  const visitorPasswordValue = useWatch({ control: visitorForm.control, name: 'password', defaultValue: '' });
  const organizerPasswordValue = useWatch({ control: organizerForm.control, name: 'password', defaultValue: '' });

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-200' };
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score, label: 'Lemah', color: 'bg-red-500' };
    if (score === 2 || score === 3) return { score, label: 'Sedang', color: 'bg-yellow-500' };
    return { score, label: 'Kuat', color: 'bg-green-500' };
  };

  const visitorStrength = calculateStrength(visitorPasswordValue);
  const organizerStrength = calculateStrength(organizerPasswordValue);

  const onVisitorSubmit = async (data: VisitorValues) => {
    setGlobalError(null);
    const result = await registerUser(data, 'visitor');

    if (result.error) {
      setGlobalError(result.error);
      return;
    }
    toast.success('Pendaftaran berhasil! Periksa email anda untuk kode OTP.');
    router.push('/register/verify?email=' + encodeURIComponent(data.email));
  };

  const onOrganizerSubmit = async (data: OrganizerValues) => {
    if (!data.urlDokumenLegalitas) {
      setGlobalError('Harap unggah dokumen legalitas (PDF)');
      return;
    }

    setGlobalError(null);
    const result = await registerUser(data, 'organizer');

    if (result.error) {
      setGlobalError(result.error);
      return;
    }
    toast.success('Pendaftaran berhasil! Periksa email anda untuk kode OTP.');
    router.push('/register/verify?email=' + encodeURIComponent(data.email));
  };

  return (
    <AuthLayout leftTitle="Bergabunglah dengan platform acara terbaik.">
      <style>{`
        .phone-input-custom { display: flex; align-items: center; }
        .phone-input-custom .PhoneInputInput {
          flex: 1;
          height: 3rem;
          padding: 0 1rem;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          background-color: #ffffff;
          font-size: 0.875rem;
          font-weight: 500;
          color: #0f172a;
          outline: none;
          transition: all 0.2s;
        }
        .phone-input-custom .PhoneInputInput:focus-visible {
          border-color: #2563eb;
          box-shadow: 0 0 0 1px #2563eb;
        }
        .phone-input-custom .PhoneInputCountry { margin-right: 0.75rem; }
      `}</style>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Buat Akun
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Gabung dengan POLIVENTS dan mulai perjalanan anda hari ini.
          </p>
        </div>

        {globalError && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg flex items-start gap-3 text-sm font-medium animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p>{globalError}</p>
          </div>
        )}

        <Tabs defaultValue="visitor" className="w-full">
          <TabsList variant="line" className="flex w-full bg-transparent p-0 border-b border-slate-200 mb-8 gap-0 h-12">
            <TabsTrigger 
              value="visitor" 
              className="flex-1 px-0 py-3 text-slate-400 data-active:text-primary data-active:font-bold transition-all"
            >
              Pengunjung
            </TabsTrigger>
            <TabsTrigger 
              value="organizer" 
              className="flex-1 px-0 py-3 text-slate-400 data-active:text-primary data-active:font-bold transition-all"
            >
              Penyelenggara
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visitor">
            <form onSubmit={visitorForm.handleSubmit(onVisitorSubmit)} className="space-y-4" autoComplete="off">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Nama Lengkap</Label>
                <Input 
                  placeholder="Nama Pengunjung" 
                  className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                  {...visitorForm.register('namaLengkap')}
                />
                {visitorForm.formState.errors.namaLengkap && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{visitorForm.formState.errors.namaLengkap.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Alamat Email</Label>
                <Input 
                  id="visitor-email" 
                  type="email" 
                  placeholder="Masukkan email anda" 
                  className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                  {...visitorForm.register('email')}
                />
                {visitorForm.formState.errors.email && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{visitorForm.formState.errors.email.message}</p>}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">No. HP</Label>
                  <Controller
                    name="nomorTelepon"
                    control={visitorForm.control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        international
                        defaultCountry="ID"
                        placeholder="Contoh: 812 3456 7890"
                        className="phone-input-custom"
                      />
                    )}
                  />
                  {visitorForm.formState.errors.nomorTelepon && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{visitorForm.formState.errors.nomorTelepon.message}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">Tanggal Lahir</Label>
                  <Input 
                    type="date"
                    className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...visitorForm.register('tanggalLahir')}
                  />
                  {visitorForm.formState.errors.tanggalLahir && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{visitorForm.formState.errors.tanggalLahir.message}</p>}
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">Jenis Kelamin</Label>
                  <select 
                    className="flex h-12 w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium ring-offset-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 transition-all"
                    {...visitorForm.register('jenisKelamin')}
                  >
                    <option value="">Pilih Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  {visitorForm.formState.errors.jenisKelamin && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{visitorForm.formState.errors.jenisKelamin.message}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">Institusi / Asal Instansi</Label>
                  <Input 
                    placeholder="Nama Sekolah/Kampus/Perusahaan"
                    className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...visitorForm.register('institusi')}
                  />
                  {visitorForm.formState.errors.institusi && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{visitorForm.formState.errors.institusi.message}</p>}
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">Pekerjaan</Label>
                  <Input 
                    placeholder="Contoh: Mahasiswa, Dosen, dll"
                    className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...visitorForm.register('pekerjaan')}
                  />
                  {visitorForm.formState.errors.pekerjaan && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{visitorForm.formState.errors.pekerjaan.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Kata Sandi</Label>
                <div className="relative">
                  <Input 
                    type={showVisitorPassword ? "text" : "password"} 
                    autoComplete="new-password"
                    placeholder="Minimal 8 Karakter (Huruf & Angka)" 
                    className="bg-white border-slate-200 h-12 px-4 pr-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...visitorForm.register('password')}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowVisitorPassword(!showVisitorPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    aria-label={showVisitorPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showVisitorPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </div>
                {visitorPasswordValue && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      <div className={`flex-1 rounded-full ${visitorStrength.score >= 1 ? visitorStrength.color : 'bg-slate-200'}`} />
                      <div className={`flex-1 rounded-full ${visitorStrength.score >= 2 ? visitorStrength.color : 'bg-slate-200'}`} />
                      <div className={`flex-1 rounded-full ${visitorStrength.score >= 4 ? visitorStrength.color : 'bg-slate-200'}`} />
                    </div>
                    <p className="text-xxs font-bold text-slate-500 text-right">{visitorStrength.label}</p>
                  </div>
                )}
                {visitorForm.formState.errors.password && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{visitorForm.formState.errors.password.message}</p>}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-sisc-auth h-12 text-white font-bold rounded-lg mt-2 shadow-none transition-all active:scale-[0.98] cursor-pointer"
                disabled={visitorForm.formState.isSubmitting}
              >
                {visitorForm.formState.isSubmitting ? 'Mendaftar...' : 'Buat Akun'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="organizer">
            <form onSubmit={organizerForm.handleSubmit(onOrganizerSubmit)} className="space-y-4" autoComplete="off">

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">Nama Institusi</Label>
                  <Input 
                    placeholder="Nama Institusi" 
                    className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...organizerForm.register('namaInstansi')}
                  />
                  {organizerForm.formState.errors.namaInstansi && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{organizerForm.formState.errors.namaInstansi.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Deskripsi Institusi</Label>
                <Input 
                  placeholder="Deskripsi Singkat Institusi" 
                  className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                  {...organizerForm.register('deskripsiInstansi')}
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">Alamat Email</Label>
                  <Input 
                    type="email" 
                    autoComplete="off"
                    placeholder="Masukkan email anda" 
                    className="bg-white border-slate-200 h-12 px-4 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                    {...organizerForm.register('email')}
                  />
                  {organizerForm.formState.errors.email && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{organizerForm.formState.errors.email.message}</p>}
                </div>
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">No. HP</Label>
                  <Controller
                    name="nomorTelepon"
                    control={organizerForm.control}
                    render={({ field }) => (
                      <PhoneInput
                        {...field}
                        international
                        defaultCountry="ID"
                        placeholder="Contoh: 812 3456 7890"
                        className="phone-input-custom"
                      />
                    )}
                  />
                  {organizerForm.formState.errors.nomorTelepon && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{organizerForm.formState.errors.nomorTelepon.message}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label className="text-sm font-semibold text-slate-700 ml-0.5">Kata Sandi</Label>
                  <div className="relative">
                    <Input 
                      type={showOrganizerPassword ? "text" : "password"} 
                      autoComplete="new-password"
                      placeholder="Minimal 8 Karakter (Huruf & Angka)" 
                      className="bg-white border-slate-200 h-12 px-4 pr-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary text-slate-900 font-medium placeholder:text-slate-400 transition-all shadow-none"
                      {...organizerForm.register('password')}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowOrganizerPassword(!showOrganizerPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      aria-label={showOrganizerPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    >
                      {showOrganizerPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                  {organizerPasswordValue && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1 h-1">
                        <div className={`flex-1 rounded-full ${organizerStrength.score >= 1 ? organizerStrength.color : 'bg-slate-200'}`} />
                        <div className={`flex-1 rounded-full ${organizerStrength.score >= 2 ? organizerStrength.color : 'bg-slate-200'}`} />
                        <div className={`flex-1 rounded-full ${organizerStrength.score >= 4 ? organizerStrength.color : 'bg-slate-200'}`} />
                      </div>
                      <p className="text-xxs font-bold text-slate-500 text-right">{organizerStrength.label}</p>
                    </div>
                  )}
                  {organizerForm.formState.errors.password && <p className="text-red-500 text-xxs font-bold mt-1 ml-1">{organizerForm.formState.errors.password.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 ml-0.5">Dokumen Legalitas (PDF)</Label>
                <FileUpload
                  type="document"
                  variant="button"
                  currentUrl={currentDokumenUrl}
                  onSuccess={(url) => {
                    organizerForm.setValue('urlDokumenLegalitas', url);
                  }}
                />
                <p className="mt-2 text-xs text-slate-400 flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1.5" /> Pastikan dokumen dalam format PDF (Maks. 20MB)
                </p>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-sisc-auth h-12 text-white font-bold rounded-lg shadow-none transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                  disabled={organizerForm.formState.isSubmitting}
                >
                  {organizerForm.formState.isSubmitting ? 'Mendaftarkan...' : 'Daftar Penyelenggara'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 font-medium">
            Sudah punya akun? <a href="/login" className="text-primary font-bold hover:underline">Masuk.</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
