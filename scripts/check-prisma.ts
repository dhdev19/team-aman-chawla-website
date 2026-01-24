import { prisma } from "../lib/prisma";

async function main() {
  // eslint-disable-next-line no-console
  console.log("hasCareerApplication", (prisma as any).careerApplication !== undefined);
  // eslint-disable-next-line no-console
  console.log("delegateType", typeof (prisma as any).careerApplication);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
