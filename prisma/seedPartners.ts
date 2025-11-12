// prisma/seedPartners.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const partners = [
  {
    id: "cmf363dfl0004jtb9duug85b5",
    name: "Anjos Crematório Pet",
    url: "https://www.instagram.com/anjoscrematorio?igsh=aXJjM3ZlNGV6ZXJw",
    logoUrl:
      "https://res.cloudinary.com/dfdusa7i2/image/upload/v1757467719/ylyoywwoo8azrun44w1g.jpg",
    active: true,
    order: 0,
  },
  {
    id: "cmfdb059k0000df9ovhy9q3wb",
    name: "Tymba Laundry",
    url: "https://www.instagram.com/tymba.laundry?igsh=aGozam5jcGN4YW02",
    logoUrl:
      "https://res.cloudinary.com/dfdusa7i2/image/upload/v1757467881/mcb9dsaa8qnapblt2p45.jpg",
    active: true,
    order: 0,
  },
  {
    id: "cmfdy1aef0000efewxo96gptc",
    name: "Mopi Premium",
    url: "https://www.instagram.com/racoesmopi?igsh=ZDc5bW44Nm4yeWMy",
    logoUrl:
      "https://res.cloudinary.com/dfdusa7i2/image/upload/v1757506567/h7t1cp8qawbbhjtvct8d.webp",
    active: true,
    order: 0,
  },
  {
    id: "cmfdy2yoz0001efeww8o1kj2k",
    name: "Hospital Veterinário Sonho Meu",
    url: "https://www.instagram.com/sonhomeuhospitalvet?igsh=MW5kdDhqZDM1MXI5eA==",
    logoUrl:
      "https://res.cloudinary.com/dfdusa7i2/image/upload/v1757506645/son3dzks8yenn9vofkvj.png",
    active: true,
    order: 0,
  },
  {
    id: "cmfdy6zk50002efewf7ywfhm0",
    name: "Cantinho Dos Bichos",
    url: "https://www.instagram.com/cantinho_dos_bichos?igsh=MXFyZ3FsNnhrZjNqYw==",
    logoUrl:
      "https://res.cloudinary.com/dfdusa7i2/image/upload/v1757506765/mmog4y57i3shj7xa2jil.png",
    active: true,
    order: 0,
  },
  {
    id: "cmfdy7tx60003efewwb1m3ynq",
    name: "Importadora Bagé",
    url: "https://www.instagram.com/importadora_bage?igsh=eTM3MDByano4cWFt",
    logoUrl:
      "https://res.cloudinary.com/dfdusa7i2/image/upload/v1757506872/w7us2j7zmheletwt2dh2.jpg",
    active: true,
    order: 0,
  },
  {
    id: "cmfolg62r0000nwy4nqrlspcp",
    name: "Plaquinhas Pet",
    url: "https://www.instagram.com/placa.pet?igsh=MXB5OW80YTB4YzBhcg==",
    logoUrl:
      "https://res.cloudinary.com/dfdusa7i2/image/upload/v1758150504/dz4mlhqhtqkejdzcojby.png",
    active: true,
    order: 0,
  },
  {
    id: "cmfpufhrx0000txoc0y13bks7",
    name: "Shopping Total",
    url: "https://www.instagram.com/totalshopping?igsh=MXZqczJxbDQ0MGg2cg==",
    logoUrl:
      "https://res.cloudinary.com/dfdusa7i2/image/upload/v1758226108/b79eutchhzc3fbluucqp.jpg",
    active: true,
    order: 0,
  },
] as const;

async function main() {
  for (const p of partners) {
    await prisma.partner.upsert({
      where: { id: p.id },
      update: { name: p.name, url: p.url, logoUrl: p.logoUrl, active: p.active, order: p.order },
      create: {
        id: p.id,
        name: p.name,
        url: p.url,
        logoUrl: p.logoUrl,
        active: p.active,
        order: p.order,
      },
    });
  }
  console.log(`✅ ${partners.length} parceiros upsertados`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
