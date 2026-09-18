import { EnvironmentalDataPage } from "@/components/environmental-data/environmental-data-page";
import type { EnvironmentalContext } from "@/types/environmental-data.type";
export default function Page({params}:{params:Promise<EnvironmentalContext>}) {return <EnvironmentalDataPage params={params} registration={false}/>;}
