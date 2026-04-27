import { PastureDetail } from "@/components/pastures/pasture-detail";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PastureDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <PastureDetail pastureId={id} />;
}
