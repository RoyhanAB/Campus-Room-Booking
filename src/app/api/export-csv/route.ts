import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== 'admin_fakultas' && session.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('peminjaman')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Build CSV
  const headers = ['ID', 'Room ID', 'User ID', 'Nama Kegiatan', 'Tanggal Mulai', 'Tanggal Selesai', 'Jumlah Peserta', 'Status', 'Dibuat'];
  const rows = (data ?? []).map((p: any) => [
    p.peminjaman_id,
    p.room_id,
    p.user_id,
    `"${(p.nama_kegiatan || '').replace(/"/g, '""')}"`,
    new Date(p.tanggal_dimulai).toLocaleString('id-ID'),
    new Date(p.tanggal_selesai).toLocaleString('id-ID'),
    p.jumlah_peserta,
    p.status,
    new Date(p.created_at).toLocaleString('id-ID'),
  ].join(','));

  const csv = [headers.join(','), ...rows].join('\n');
  const bom = '\uFEFF'; // UTF-8 BOM for Excel

  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="laporan-peminjaman-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
