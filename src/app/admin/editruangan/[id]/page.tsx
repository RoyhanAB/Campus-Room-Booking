import { detailroom, getAllBuildings } from '@/lib/ruangan';
import EditRuanganForm from './EditRuanganForm';

export const revalidate = 0;

export default async function EditRuanganPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const roomId = resolvedParams.id;

  const [room, buildings] = await Promise.all([
    detailroom(roomId),
    getAllBuildings(),
  ]);

  return <EditRuanganForm room={room} buildings={buildings} />;
}
