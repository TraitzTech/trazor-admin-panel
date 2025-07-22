import SpecialtyClientView from "@/components/ui/specialty-client-view";
import {apiFetch} from "@/lib/api";

export default function Page({ params }: { params: { id: string } }) {
  return <SpecialtyClientView id={params.id} />;
}

export async function generateStaticParams() {
  const data = await apiFetch('/specialties'); // already parsed
  return data.specialties.map((specialty: any) => ({
    id: specialty.id.toString(),
  }));
}
