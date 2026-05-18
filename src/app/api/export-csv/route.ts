import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { getAdminInfo } from '@/lib/admin_fakultas';
import { formatLocalDateTime } from '@/lib/datetime';
import type { Peminjaman } from '@/types/peminjaman';

export async function GET(request: NextRequest) {
  void request;
  const session = await getSession();
  if (!session || (session.role !== 'admin_fakultas' && session.role !== 'super_admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let query = supabase
    .from('peminjaman')
    .select(`
      *,
      rooms!inner (
        building_id,
        buildings!inner (
          fakultas_id
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (session.role === 'admin_fakultas') {
    const adminInfo = await getAdminInfo(session.user_id);
    if (!adminInfo?.fakultas_id) {
      return NextResponse.json({ error: 'Admin belum ditugaskan ke fakultas' }, { status: 403 });
    }
    query = query.eq('rooms.buildings.fakultas_id', adminInfo.fakultas_id);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Build CSV
  const headers = ['ID', 'Room ID', 'User ID', 'Nama Kegiatan', 'Tanggal Mulai', 'Tanggal Selesai', 'Jumlah Peserta', 'Status', 'Dibuat'];
  const rows = (data ?? []).map((p: Peminjaman) => [
    p.peminjaman_id,
    p.room_id,
    p.user_id,
    `"${(p.nama_kegiatan || '').replace(/"/g, '""')}"`,
    formatLocalDateTime(p.tanggal_dimulai),
    formatLocalDateTime(p.tanggal_selesai),
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
