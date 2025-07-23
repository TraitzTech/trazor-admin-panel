import SpecialtyClientView from "@/components/ui/specialty-client-view";
import {apiFetch} from "@/lib/api";

export default function Page({ params }: { params: { id: string } }) {
  return <SpecialtyClientView id={params.id} />;
}

export async function generateStaticParams() {
  return [];
}

export const revalidate = 60;