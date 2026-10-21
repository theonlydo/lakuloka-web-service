import { getDummyKitchenOrders } from '~lib/kitchen';
import QueueBoard from '~components/queue/QueueBoard';

interface Props {
  params: Promise<{ businessId: string }>;
}

export default async function QueuePage({ params }: Props) {
  const { businessId } = await params;
  // TODO(lakuloka-be): resolve the outlet display name via
  // fetchBusinessInfo(businessId) once kitchen auth is wired.
  const businessName = businessId === 'demo' ? 'Cafe Lakuloka Demo' : businessId;
  const orders = getDummyKitchenOrders(businessId);
  return (
    <QueueBoard businessId={businessId} businessName={businessName} initialOrders={orders} />
  );
}
