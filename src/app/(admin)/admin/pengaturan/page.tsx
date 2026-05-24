"use client";

import { useState, useEffect } from "react";

export default function AdminSettingsPage() {
  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [inisial, setInisial] = useState("A");

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifAlert, setNotifAlert] = useState(false);

  const [passLama, setPassLama] = useState("");
  const [passBaru, setPassBaru] = useState("");
  const [passKonfirm, setPassKonfirm] = useState("");

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMsg, setSaveMsg] = useState("Perubahan berhasil disimpan!");
  const [errorProfil, setErrorProfil] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [loadingProfil, setLoadingProfil] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  // Ambil data admin dari DB saat halaman load
  useEffect(() => {
    fetch("/api/admin/pengaturan")
      .then((res) => res.json())
      .then((data) => {
        if (data.namaLengkap) {
          setNamaLengkap(data.namaLengkap);
          setInisial(data.namaLengkap.charAt(0).toUpperCase());
        }
        if (data.email) setEmail(data.email);
      })
      .catch(() => {});
  }, []);

  const showToast = (msg: string) => {
    setSaveMsg(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Simpan profil (nama & email)
  const handleSimpan = async () => {
    setErrorProfil("");
    if (!namaLengkap || !email) {
      setErrorProfil("Nama dan email wajib diisi");
      return;
    }
    setLoadingProfil(true);
    try {
      const res = await fetch("/api/admin/pengaturan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaLengkap, email }),
      });
      const data = await res.json();
      if (res.ok) {
        setInisial(namaLengkap.charAt(0).toUpperCase());
        showToast("Profil berhasil diperbarui!");
      } else {
        setErrorProfil(data.error || "Gagal menyimpan profil");
      }
    } catch {
      setErrorProfil("Terjadi kesalahan jaringan");
    } finally {
      setLoadingProfil(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    setErrorPass("");
    if (!passLama || !passBaru || !passKonfirm) {
      setErrorPass("Semua field kata sandi wajib diisi");
      return;
    }
    if (passBaru !== passKonfirm) {
      setErrorPass("Konfirmasi kata sandi tidak cocok");
      return;
    }
    if (passBaru.length < 8) {
      setErrorPass("Kata sandi baru minimal 8 karakter");
      return;
    }
    setLoadingPass(true);
    try {
      const res = await fetch("/api/admin/pengaturan", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passLama, passBaru, passKonfirm }),
      });
      const data = await res.json();
      if (res.ok) {
        setPassLama("");
        setPassBaru("");
        setPassKonfirm("");
        showToast("Kata sandi berhasil diperbarui!");
      } else {
        setErrorPass(data.error || "Gagal mengupdate kata sandi");
      }
    } catch {
      setErrorPass("Terjadi kesalahan jaringan");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <>
      <style>{`
        .sg-title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 24px; }

        /* CARD */
        .sg-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 22px 24px; margin-bottom: 20px; background: #fff; }
        .sg-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
        .sg-card-title { font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 3px; }
        .sg-card-desc { font-size: 12px; color: #6b7280; }
        .sg-card-icon { width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; display: flex; align-items: center; justify-content: center; }

        /* PROFIL ROW */
        .sg-profil-row { display: flex; gap: 32px; align-items: flex-start; }
        .sg-foto-col { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 130px; flex-shrink: 0; }
        .sg-foto { width: 90px; height: 90px; border-radius: 50%; background: #0f1629; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 700; color: #fff; }
        .sg-foto-hint { font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.4; }
        .sg-link { color: #2563eb; font-size: 12px; font-weight: 500; cursor: pointer; }
        .sg-form-col { flex: 1; display: flex; flex-direction: column; gap: 14px; }

        /* FORM */
        .sg-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .sg-field { display: flex; flex-direction: column; gap: 5px; }
        .sg-label { font-size: 11px; font-weight: 600; color: #374151; letter-spacing: 0.3px; text-transform: uppercase; }
        .sg-input { padding: 9px 12px; border: 1px solid #e5e7eb; border-radius: 7px; font-size: 13px; color: #111827; outline: none; transition: border 0.15s; width: 100%; box-sizing: border-box; }
        .sg-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .sg-input:disabled { background: #f9fafb; color: #9ca3af; cursor: not-allowed; }

        /* TWO COLUMN GRID */
        .sg-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }

        /* NOTIF */
        .sg-notif-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid #f3f4f6; }
        .sg-notif-row:last-child { border-bottom: none; padding-bottom: 0; }
        .sg-notif-label { font-size: 13px; font-weight: 500; color: #111827; margin-bottom: 2px; }
        .sg-notif-desc { font-size: 11px; color: #6b7280; }

        /* TOGGLE */
        .sg-toggle { position: relative; width: 42px; height: 24px; flex-shrink: 0; cursor: pointer; display: inline-block; }
        .sg-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
        .sg-toggle-track { position: absolute; inset: 0; border-radius: 999px; background: #e2e8f0; transition: background 0.2s; }
        .sg-toggle input:checked + .sg-toggle-track { background: #2563eb; }
        .sg-toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.2); transition: transform 0.2s; pointer-events: none; }
        .sg-toggle input:checked ~ .sg-toggle-thumb { transform: translateX(18px); }

        /* BUTTONS */
        .sg-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 20px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.15s; }
        .sg-btn-primary { background: #2563eb; color: #fff; }
        .sg-btn-primary:hover:not(:disabled) { background: #1d4ed8; }
        .sg-btn-primary:disabled { background: #93c5fd; cursor: not-allowed; }
        .sg-btn-outline { background: #fff; color: #374151; border: 1px solid #e5e7eb; }
        .sg-btn-outline:hover { background: #f9fafb; }
        .sg-btn-full { width: 100%; justify-content: center; }

        /* ERROR */
        .sg-error { font-size: 12px; color: #dc2626; margin-top: 6px; }

        /* TOAST */
        .sg-toast { position: fixed; bottom: 24px; right: 24px; background: #111827; color: #fff; padding: 12px 20px; border-radius: 8px; font-size: 13px; font-weight: 500; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 100; display: flex; align-items: center; gap: 8px; }

        @media (max-width: 768px) {
          .sg-two-col { grid-template-columns: 1fr; }
          .sg-grid-2 { grid-template-columns: 1fr; }
          .sg-profil-row { flex-direction: column; }
        }
      `}</style>

      <div>
        <p className="sg-title">Pengaturan</p>

        {/* ── PROFIL & AKUN ── */}
        <div className="sg-card">
          <div className="sg-card-header">
            <div>
              <p className="sg-card-title">Profil & Akun Admin</p>
              <p className="sg-card-desc">Kelola informasi pribadi dan pengaturan identitas Anda.</p>
            </div>
            <button
              className="sg-btn sg-btn-primary"
              onClick={handleSimpan}
              disabled={loadingProfil}
            >
              {loadingProfil ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>

          <div className="sg-profil-row">
            <div className="sg-foto-col">
              <div className="sg-foto">{inisial}</div>
              <p className="sg-foto-hint">Format: JPG, PNG. Maks 2MB.</p>
              <span className="sg-link">Ganti Foto Profil</span>
            </div>
            <div className="sg-form-col">
              <div className="sg-field">
                <label className="sg-label">Nama Lengkap</label>
                <input
                  className="sg-input"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="sg-field">
                <label className="sg-label">Email Kerja</label>
                <input
                  className="sg-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email"
                />
              </div>
              {errorProfil && <p className="sg-error">{errorProfil}</p>}
            </div>
          </div>
        </div>

        {/* ── NOTIFIKASI + KEAMANAN ── */}
        <div className="sg-two-col">

          {/* Notifikasi */}
          <div className="sg-card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div className="sg-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              <div>
                <p className="sg-card-title" style={{ marginBottom: 0 }}>Notifikasi & Email</p>
                <p className="sg-card-desc">Atur bagaimana kami menghubungi Anda.</p>
              </div>
            </div>

            {[
              { label: "Email pendaftaran baru", desc: "Terima alert saat ada peserta baru mendaftar.", val: notifEmail, set: setNotifEmail },
              { label: "Alert sistem", desc: "Notifikasi kegagalan pembayaran atau error teknis.", val: notifAlert, set: setNotifAlert },
            ].map((item) => (
              <div key={item.label} className="sg-notif-row">
                <div>
                  <p className="sg-notif-label">{item.label}</p>
                  <p className="sg-notif-desc">{item.desc}</p>
                </div>
                <label className="sg-toggle">
                  <input type="checkbox" checked={item.val} onChange={() => item.set(!item.val)} />
                  <div className="sg-toggle-track"></div>
                  <div className="sg-toggle-thumb"></div>
                </label>
              </div>
            ))}
          </div>

          {/* Keamanan */}
          <div className="sg-card" style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div className="sg-card-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <p className="sg-card-title" style={{ marginBottom: 0 }}>Keamanan</p>
                <p className="sg-card-desc">Amankan akses ke panel administrasi.</p>
              </div>
            </div>

            <p style={{ fontSize: "11px", fontWeight: 600, color: "#374151", letterSpacing: "0.3px", textTransform: "uppercase", marginBottom: "12px" }}>
              Ganti Kata Sandi
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                className="sg-input"
                type="password"
                placeholder="Kata Sandi Saat Ini"
                value={passLama}
                onChange={(e) => setPassLama(e.target.value)}
              />
              <div className="sg-grid-2">
                <input
                  className="sg-input"
                  type="password"
                  placeholder="Kata Sandi Baru"
                  value={passBaru}
                  onChange={(e) => setPassBaru(e.target.value)}
                />
                <input
                  className="sg-input"
                  type="password"
                  placeholder="Konfirmasi Kata Sandi"
                  value={passKonfirm}
                  onChange={(e) => setPassKonfirm(e.target.value)}
                />
              </div>
              {errorPass && <p className="sg-error">{errorPass}</p>}
              <button
                className="sg-btn sg-btn-primary sg-btn-full"
                onClick={handleUpdatePassword}
                disabled={loadingPass}
              >
                {loadingPass ? "Memperbarui..." : "Update Kata Sandi"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="sg-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {saveMsg}
        </div>
      )}
    </>
  );
}
