import { prisma } from "@/lib/prisma";
import { PropertyType } from "@prisma/client";
import { Container } from "@/components/ui/container";
import { AutoSlider } from "@/components/animations/auto-slider";
import { PropertyCard } from "@/components/features/property-card";
import { FadeIn } from "@/components/animations/fade-in";

async function getFeaturedProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        status: "AVAILABLE",
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return properties;
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
}

export async function FeaturedProjects() {
  const properties = await getFeaturedProperties();

  if (properties.length === 0) {
    return null;
  }

  const propertyCards = properties.map((property) => (
    <div key={property.id} className="px-2 w-full sm:w-1/2 lg:w-1/3">
      <PropertyCard property={property} />
    </div>
  ));

  return (
    <section className="py-16 bg-white">
      <Container>
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-neutral-600">
              Discover our handpicked selection of premium properties
            </p>
          </div>
        </FadeIn>
        <AutoSlider
          items={propertyCards}
          interval={6000}
          showDots={true}
          showArrows={true}
        />
      </Container>
    </section>
  );
}
