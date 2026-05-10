import React from 'react';
import { FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

interface PaperSubmission {
  id: number;
  judul: string;
  konferensi: string;
  penulis: string;
  status: 'submitted' | 'reviewing' | 'accepted' | 'rejected';
  tanggalSubmit: string;
  feedback?: string;
}

interface PaperSubmissionCardProps {
  paper: PaperSubmission;
  onViewDetails?: (paperId: number) => void;
}

export function PaperSubmissionCard({ paper, onViewDetails }: PaperSubmissionCardProps) {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'submitted':
        return {
          label: 'Submitted',
          color: 'bg-blue-100 text-blue-700',
          icon: Clock,
        };
      case 'reviewing':
        return {
          label: 'Sedang Direview',
          color: 'bg-yellow-100 text-yellow-700',
          icon: Clock,
        };
      case 'accepted':
        return {
          label: 'Diterima',
          color: 'bg-green-100 text-green-700',
          icon: CheckCircle,
        };
      case 'rejected':
        return {
          label: 'Ditolak',
          color: 'bg-red-100 text-red-700',
          icon: XCircle,
        };
      default:
        return {
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-700',
          icon: FileText,
        };
    }
  };

  const statusInfo = getStatusInfo(paper.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-bold text-slate-900">{paper.judul}</h3>
            <p className="text-sm text-slate-600">{paper.konferensi}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${statusInfo.color}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-xs font-semibold">{statusInfo.label}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <p className="text-slate-600">
          <span className="font-semibold">Penulis:</span> {paper.penulis}
        </p>
        <p className="text-slate-600">
          <span className="font-semibold">Tanggal Submit:</span>{' '}
          {new Date(paper.tanggalSubmit).toLocaleDateString('id-ID')}
        </p>
      </div>

      {paper.feedback && (
        <div className="mb-4 p-3 bg-slate-50 rounded border border-slate-200">
          <p className="text-xs font-semibold text-slate-700 mb-1">Feedback</p>
          <p className="text-xs text-slate-600">{paper.feedback}</p>
        </div>
      )}

      <button
        onClick={() => onViewDetails?.(paper.id)}
        className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
      >
        Lihat Detail →
      </button>
    </div>
  );
}

interface PaperSubmissionListProps {
  submissions: PaperSubmission[];
  loading?: boolean;
  onViewDetails?: (paperId: number) => void;
}

export function PaperSubmissionList({
  submissions,
  loading = false,
  onViewDetails,
}: PaperSubmissionListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
            <div className="h-4 bg-slate-200 rounded mb-4 w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded mb-4 w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg border border-slate-200 p-12 text-center">
        <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada submission</h3>
        <p className="text-slate-600">
          Mulai submit paper Anda dengan memilih konferensi yang tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((paper) => (
        <PaperSubmissionCard
          key={paper.id}
          paper={paper}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

interface PaperUploadFormProps {
  conferenceTitle: string;
  onSubmit: (data: {
    judul: string;
    abstrak: string;
    penulis: string;
    email: string;
    file: File;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function PaperUploadForm({
  conferenceTitle,
  onSubmit,
  isLoading = false,
}: PaperUploadFormProps) {
  const [formData, setFormData] = React.useState({
    judul: '',
    abstrak: '',
    penulis: '',
    email: '',
    file: null as File | null,
  });

  const [fileName, setFileName] = React.useState('');
  const [error, setError] = React.useState('');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Format file harus PDF');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Ukuran file maksimal 10MB');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        file,
      }));
      setFileName(file.name);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!formData.judul.trim()) {
      setError('Judul tidak boleh kosong');
      return;
    }
    if (!formData.abstrak.trim()) {
      setError('Abstrak tidak boleh kosong');
      return;
    }
    if (!formData.penulis.trim()) {
      setError('Nama penulis tidak boleh kosong');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email tidak boleh kosong');
      return;
    }
    if (!formData.file) {
      setError('File harus diunggah');
      return;
    }

    try {
      await onSubmit(formData as Required<typeof formData>);
      setFormData({
        judul: '',
        abstrak: '',
        penulis: '',
        email: '',
        file: null,
      });
      setFileName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <span className="font-semibold">Konferensi:</span> {conferenceTitle}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Judul Paper <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="judul"
          value={formData.judul}
          onChange={handleInputChange}
          placeholder="Masukkan judul paper"
          disabled={isLoading}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Abstrak <span className="text-red-600">*</span>
        </label>
        <textarea
          name="abstrak"
          value={formData.abstrak}
          onChange={handleInputChange}
          placeholder="Masukkan abstrak paper"
          rows={5}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Nama Penulis <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="penulis"
            value={formData.penulis}
            onChange={handleInputChange}
            placeholder="Nama penulis utama"
            disabled={isLoading}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email Anda"
            disabled={isLoading}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">
          Upload File PDF <span className="text-red-600">*</span>
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            disabled={isLoading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-900 font-semibold">
              {fileName ? `✓ ${fileName}` : 'Klik atau drag file PDF'}
            </p>
            <p className="text-xs text-slate-500">Format: PDF | Maks: 10MB</p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !formData.file}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isLoading ? 'Mengunggah...' : 'Kirim Paper'}
      </button>
    </form>
  );
}
