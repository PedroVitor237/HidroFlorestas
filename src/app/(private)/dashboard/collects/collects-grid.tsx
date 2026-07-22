import CollectCard, { CollectCardData } from "./collect-card";

const collects: CollectCardData[] = [
  {
    id: "1",
    localName: "Beira Rio de Itapecuru-Mirim",
    created: "2026-04-03T00:00:00.000Z",
    lastUpdate: "2026-04-09T00:00:00.000Z",
    status: "INACTIVE",
    local_url: "https://maps.google.com",
    image: null,
  },
  {
    id: "2",
    localName: "Bairro Trizidela Campi",
    created: "2026-02-19T00:00:00.000Z",
    lastUpdate: "2026-06-27T00:00:00.000Z",
    status: "ACTIVE",
    local_url: "https://maps.google.com",
    image: null,
  },
  {
    id: "3",
    localName: "Margem do Rio",
    created: "2026-03-11T00:00:00.000Z",
    lastUpdate: "2026-06-15T00:00:00.000Z",
    status: "ACTIVE",
    local_url: "https://maps.google.com",
    image: null,
  },
  
];

export default function CollectsGrid() {
  return (
    <section
      className="
        grid
        gap-6
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-5
      "
    >
      {collects.map((collect) => (
        <CollectCard key={collect.id} collect={collect} />
      ))}
    </section>
  );
}
