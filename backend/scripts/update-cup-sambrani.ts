import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const description = [
    "Pure Temple Loban in Ready-to-Light Herbal Havan Cups",
    "",
    "Handcrafted in our Peelamedu workshop using authentic natural tree loban, sacred guggul resin, and crushed botanical herbs. When lit, each cup releases dense, serene white smoke that clears stagnant air, dispels negativity, and recreates the sanctified calm of South Indian dawn temple aartis in your home.",
    "",
    "Crafted without synthetic chemical accelerants or black soot, our sambrani cups burn smoothly and gently, leaving a soul-soothing resin fragrance that stays for hours.",
    "",
    "Burning Time: 25 - 30 minutes per cup",
    "Size: 12 Traditional Havan Cups",
    "Count: 12 Havan Cups + Plate",
    "Ingredients: Natural Tree Loban, Guggul Gum, Herbal Wood Paste, Sacred Ash Binder",
    "",
    "What's Inside:",
    "- 12 Ready-to-light Pure Loban Havan Cups",
    "- 1 Metal burning plate for safe home placement",
    "",
    "Why Choose:",
    "- 100% natural forest tree gums & sacred herbs",
    "- Long-lasting serene aroma that lingers for hours",
    "- Soothing white smoke safe for morning family prayer",
  ].join("\n");

  const updated = await prisma.product.updateMany({
    where: {
      slug: { in: ["cup-sambarani", "cup-sambrani"] },
    },
    data: {
      shortDescription: "12 Cups · Pure Loban Sambrani · Metal Plate Included",
      description: description,
    },
  });

  console.log(`Updated ${updated.count} product records in database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
