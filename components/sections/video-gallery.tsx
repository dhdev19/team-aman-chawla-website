import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { AutoSlider } from "@/components/animations/auto-slider";
import { VideoCard } from "@/components/features/video-card";
import { FadeIn } from "@/components/animations/fade-in";

async function getVideos() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { order: "asc" },
      take: 10,
    });
    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

export async function VideoGallery() {
  const videos = await getVideos();

  if (videos.length === 0) {
    return null;
  }

  const videoCards = videos.map((video) => (
    <div key={video.id} className="px-2">
      <VideoCard video={video} />
    </div>
  ));

  return (
    <section className="py-16 bg-neutral-50">
      <Container>
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Video Gallery
            </h2>
            <p className="text-lg text-neutral-600">
              Explore our property showcases and virtual tours
            </p>
          </div>
        </FadeIn>
        <AutoSlider
          items={videoCards}
          interval={5000}
          showDots={true}
          showArrows={true}
        />
      </Container>
    </section>
  );
}
