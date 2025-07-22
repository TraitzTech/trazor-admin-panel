import EditSpecialtyClientView from "@/components/ui/edit-specilaty-client-view";
import {apiFetch} from "@/lib/api";


export default function Page({ params }: { params: { id: string } }) {
  return <EditSpecialtyClientView id={params.id} />;
}
//
// export async function generateStaticParams() {
//   const data = await apiFetch('/specialties');
//
//   return data.specialties.map((specialty: any) => ({
//     id: specialty.id.toString(),
//   }));
// }
