import { prisma } from "@/lib/prisma";
import DonateZone from "@/components/DonateZone";
import AnimalsZone from "@/components/AnimalsZone";
import EventsZone from "@/components/EventsZone";
import HeroSection from "@/components/HeroSection";
import PartnersSection from "@/components/PartnersSection";

export default async function HomePage() {
  await warm(); // acorda o Neon
  const destaques = await prisma.animal.findMany({
    include: { photos: true },
    orderBy: { criadoEm: "desc" },
    take: 4,
  });

  return (
    <>
      <HeroSection />
      <DonateZone />
      <AnimalsZone destaques={destaques} />
      <EventsZone />
      <PartnersSection showMax={10} ctaHref="/sobre#parceiros" />
    </>
  );
}
