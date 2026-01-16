import { prisma } from "@/lib/prisma";
import { PropertyType } from "@prisma/client";
import { StatCard } from "@/components/admin/stat-card";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { FadeIn } from "@/components/animations";

async function getDashboardStats() {
  try {
    const [
      totalProperties,
      propertiesByType,
      totalVideos,
      totalEnquiries,
      unreadEnquiries,
      totalTACRegistrations,
      recentEnquiries,
    ] = await Promise.all([
      // Total properties
      prisma.property.count(),
      // Properties by type
      prisma.property.groupBy({
        by: ["type"],
        _count: true,
      }),
      // Total videos
      prisma.video.count(),
      // Total enquiries
      prisma.enquiry.count(),
      // Unread enquiries (assuming we'll add a read field later)
      prisma.enquiry.count(),
      // Total TAC registrations
      prisma.tACRegistration.count(),
      // Recent enquiries (last 5)
      prisma.enquiry.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          property: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
    ]);

    const propertiesByTypeMap = propertiesByType.reduce(
      (acc, item) => {
        acc[item.type] = item._count;
        return acc;
      },
      {} as Record<PropertyType, number>
    );

    return {
      totalProperties,
      propertiesByType: {
        residential: propertiesByTypeMap.RESIDENTIAL || 0,
        plot: propertiesByTypeMap.PLOT || 0,
        commercial: propertiesByTypeMap.COMMERCIAL || 0,
        offices: propertiesByTypeMap.OFFICES || 0,
      },
      totalVideos,
      totalEnquiries,
      unreadEnquiries,
      totalTACRegistrations,
      recentEnquiries,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalProperties: 0,
      propertiesByType: {
        residential: 0,
        plot: 0,
        commercial: 0,
        offices: 0,
      },
      totalVideos: 0,
      totalEnquiries: 0,
      unreadEnquiries: 0,
      totalTACRegistrations: 0,
      recentEnquiries: [],
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <Container size="full">
      <FadeIn>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Dashboard
          </h1>
          <p className="text-neutral-600">
            Welcome to the admin panel. Here's an overview of your data.
          </p>
        </div>
      </FadeIn>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <FadeIn delay={0.1}>
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon="🏠"
            color="primary"
          />
        </FadeIn>
        <FadeIn delay={0.2}>
          <StatCard
            title="Total Videos"
            value={stats.totalVideos}
            icon="🎥"
            color="secondary"
          />
        </FadeIn>
        <FadeIn delay={0.3}>
          <StatCard
            title="Total Enquiries"
            value={stats.totalEnquiries}
            icon="📧"
            color="accent"
          />
        </FadeIn>
        <FadeIn delay={0.4}>
          <StatCard
            title="TAC Registrations"
            value={stats.totalTACRegistrations}
            icon="📝"
            color="primary"
          />
        </FadeIn>
      </div>

      {/* Properties by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FadeIn delay={0.5}>
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Properties by Type
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                <span className="text-neutral-700">Residential</span>
                <span className="font-semibold text-neutral-900">
                  {stats.propertiesByType.residential}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                <span className="text-neutral-700">Plot</span>
                <span className="font-semibold text-neutral-900">
                  {stats.propertiesByType.plot}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                <span className="text-neutral-700">Commercial</span>
                <span className="font-semibold text-neutral-900">
                  {stats.propertiesByType.commercial}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                <span className="text-neutral-700">Offices</span>
                <span className="font-semibold text-neutral-900">
                  {stats.propertiesByType.offices}
                </span>
              </div>
            </div>
          </Card>
        </FadeIn>

        {/* Recent Enquiries */}
        <FadeIn delay={0.6}>
          <Card>
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              Recent Enquiries
            </h2>
            {stats.recentEnquiries.length === 0 ? (
              <p className="text-neutral-500 text-center py-8">
                No enquiries yet
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentEnquiries.map((enquiry) => (
                  <div
                    key={enquiry.id}
                    className="p-3 bg-neutral-50 rounded-md border-l-4 border-primary-700"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-900">
                          {enquiry.name}
                        </p>
                        <p className="text-sm text-neutral-600">{enquiry.email}</p>
                        {enquiry.property && (
                          <p className="text-xs text-primary-700 mt-1">
                            Property: {enquiry.property.name}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-neutral-500">
                        {new Date(enquiry.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-700 mt-2 line-clamp-2">
                      {enquiry.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </FadeIn>
      </div>

      {/* Quick Actions */}
      <FadeIn delay={0.7}>
        <Card>
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/properties/new"
              className="p-4 bg-primary-50 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">➕</div>
              <div className="font-semibold text-primary-700">Add Property</div>
            </a>
            <a
              href="/admin/videos/new"
              className="p-4 bg-secondary-50 border border-secondary-200 rounded-md hover:bg-secondary-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">➕</div>
              <div className="font-semibold text-secondary-700">Add Video</div>
            </a>
            <a
              href="/admin/enquiries"
              className="p-4 bg-accent-50 border border-accent-200 rounded-md hover:bg-accent-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📧</div>
              <div className="font-semibold text-accent-700">View Enquiries</div>
            </a>
            <a
              href="/admin/stats"
              className="p-4 bg-neutral-50 border border-neutral-200 rounded-md hover:bg-neutral-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📈</div>
              <div className="font-semibold text-neutral-700">View Stats</div>
            </a>
          </div>
        </Card>
      </FadeIn>
    </Container>
  );
}
