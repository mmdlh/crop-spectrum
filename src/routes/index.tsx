import { createFileRoute } from "@tanstack/react-router";
import { FarmDashboard } from "@/components/FarmDashboard";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "智慧养殖数据中枢 — 牧云智养" },
    { name: "description", content: "牧云智养智慧养殖平台，全场生产、环境、健康与设备数据实时汇聚。" },
    { property: "og:title", content: "智慧养殖数据中枢 — 牧云智养" },
    { property: "og:description", content: "全场生产、环境、健康与设备数据实时汇聚。" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function Index() {
  return <FarmDashboard page="overview" />;
}
