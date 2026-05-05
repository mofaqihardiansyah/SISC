export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(d);
}

export function formatEventDate(dateInput: Date | string | null): string {
  if (!dateInput) return "TANGGAL BELUM DITENTUKAN";
  
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  
  const optionsDay: Intl.DateTimeFormatOptions = { weekday: 'long' };
  const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  
  const hari = new Intl.DateTimeFormat('id-ID', optionsDay).format(date).toUpperCase();
  const tglBulan = new Intl.DateTimeFormat('id-ID', optionsDate).format(date).toUpperCase();
  const jam = new Intl.DateTimeFormat('id-ID', optionsTime).format(date);
  
  return `${hari}, ${tglBulan} • ${jam}`.replace('.', ':');
}
