import { getDummyKitchenOrders } from '~lib/kitchen';
import KitchenBoard from '~components/kitchen/KitchenBoard';

interface Props {
  params: Promise<{ businessId: string }>;
}

export default async function KitchenPage({ params }: Props) {
  const { businessId } = await params;
  // TODO: validate outlet access (?key= PIN) against lakuloka-be here.
  // Dummy phase: serve mock tickets for any businessId.
  const orders = getDummyKitchenOrders(businessId);
  return <KitchenBoard businessId={businessId} initialOrders={orders} />;
}
