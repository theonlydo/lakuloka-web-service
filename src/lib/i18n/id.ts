const id = {
  // Header
  header_address: 'Alamat',

  // Search
  search_placeholder: 'Cari menu...',

  // Category
  category_all: 'Semua',

  // Product
  product_add: 'Tambah',
  product_select: 'Pilih',
  product_unavailable: 'Habis',
  product_stock: 'Stok: {stock}',

  // Variant modal
  variant_title: 'Pilih Varian',
  variant_select: 'Pilih {group}',
  variant_note_label: 'Catatan (opsional)',
  variant_note_placeholder: 'Contoh: Tanpa bawang, level pedas 2...',
  variant_required: 'Wajib pilih',
  variant_add_to_cart: 'Tambah ke Keranjang',
  variant_update_cart: 'Perbarui Keranjang',

  // Cart
  cart_empty: 'Keranjang masih kosong',
  cart_empty_desc: 'Tambahkan menu yang ingin kamu pesan',
  cart_title: 'Keranjang',
  cart_total: 'Total',
  cart_checkout: 'Pesan Sekarang',
  cart_item_remove: 'Hapus',
  cart_note: 'Catatan: {note}',
  cart_note_add: '+ Tambah catatan',
  cart_note_placeholder: 'Catatan untuk item ini...',

  // Checkout form
  checkout_title: 'Detail Pesanan',
  checkout_name_label: 'Nama',
  checkout_name_placeholder: 'Masukkan nama kamu',
  checkout_table_label: 'Nomor Meja',
  checkout_table_placeholder: 'Masukkan nomor meja',
  checkout_note_label: 'Catatan (opsional)',
  checkout_note_placeholder: 'Catatan tambahan untuk pesanan...',
  checkout_submit: 'Konfirmasi Pesanan',
  checkout_name_required: 'Nama wajib diisi',
  checkout_table_required: 'Nomor meja wajib diisi',
  checkout_phone_label: 'Nomor HP',
  checkout_phone_placeholder: 'Contoh: 08123456789',
  checkout_phone_required: 'Nomor HP wajib diisi',
  checkout_phone_invalid: 'Format nomor HP tidak valid',

  // Order result — pending (can_paylater)
  order_pending_title: 'Pesanan Diterima!',
  order_pending_desc: 'Pesananmu sudah masuk dan menunggu persetujuan kasir. Kasir akan segera memproses pesananmu.',
  order_pending_note: 'Harap tunggu konfirmasi dari kasir ya.',
  order_new_order: 'Pesan Lagi',

  // Order result — QR
  order_qr_title: 'Tunjukkan QR ini ke Kasir',
  order_qr_desc: 'Kasir akan men-scan QR ini untuk memproses pesananmu.',
  order_qr_expires: 'QR ini berlaku 30 menit',

  // Self-pay checkout (F-33)
  selfpay_checkout_title: 'Bayar Sekarang',
  selfpay_submit: 'Bayar {total} via QRIS',
  selfpay_disclaimer: 'Pesananmu akan diproses otomatis setelah pembayaran berhasil, tanpa perlu menunggu persetujuan kasir.',
  selfpay_qris_title: 'Scan untuk Bayar',
  selfpay_qris_desc: 'Gunakan aplikasi e-wallet atau m-banking yang mendukung QRIS.',
  selfpay_waiting: 'Menunggu pembayaran...',
  selfpay_dont_close: 'Jangan tutup halaman ini sampai pembayaran selesai.',
  selfpay_paid_title: 'Pembayaran Berhasil!',
  selfpay_paid_desc: 'Pesananmu sudah lunas dan langsung diproses dapur/kasir.',
  selfpay_failed_title: 'Pembayaran Gagal',
  selfpay_failed_desc: 'QRIS sudah kedaluwarsa atau dibatalkan. Silahkan coba pesan lagi.',

  // Search
  search_no_results: 'Menu tidak ditemukan.',

  // Errors
  error_business_not_found: 'Toko tidak ditemukan.',
  error_menu_disabled: 'Menu digital tidak tersedia untuk toko ini.',
  error_load_menu: 'Gagal memuat menu. Silahkan refresh halaman.',
  error_order_failed: 'Gagal membuat pesanan. Silahkan coba lagi.',

  // Common
  back: 'Kembali',
  close: 'Tutup',
  loading: 'Memuat...',
};

export default id;
export type TranslationKey = keyof typeof id;
