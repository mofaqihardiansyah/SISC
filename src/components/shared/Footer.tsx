export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white mt-16 py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">

        {/* Brand */}
        <div className="col-span-2 sm:col-span-1">
          <h2 className="text-xl font-extrabold mb-3">POLIVENTS</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Hubungkan koneksi anda dan tambah wawasan anda melalui seminar dan conference
          </p>
        </div>

        {/* Bantuan */}
        <div>
          <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">Bantuan</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/faq" className="hover:text-white transition">FAQ</a></li>
            <li><a href="/kontak" className="hover:text-white transition">Kontak</a></li>
          </ul>
        </div>

        {/* Jelajah Event */}
        <div>
          <h3 className="font-bold mb-3 text-sm uppercase tracking-wide">Jelajah Event</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/jelajah" className="hover:text-white transition">Jelajah</a></li>
            <li><a href="/jelajah?type=polines" className="hover:text-white transition">Event Polines</a></li>
            <li><a href="/jelajah?type=umum" className="hover:text-white transition">Event Umum</a></li>
          </ul>
        </div>

        {/* Copyright */}
        <div className="flex items-end justify-end col-span-2 sm:col-span-1">
          <p className="text-sm text-gray-400">© 2026 POLIVENTS.</p>
        </div>

      </div>
    </footer>
  );
}