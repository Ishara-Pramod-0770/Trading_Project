import { Newspaper } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { NewsBoard } from "@/components/news/news-board";
import { getNews } from "@/lib/news";

export const revalidate = 600;

export default async function NewsPage() {
  const items = await getNews();
  return (
    <div>
      <PageHeader
        title="Crypto News"
        description="The latest headlines across Bitcoin, altcoins, DeFi and the broader market."
        icon={Newspaper}
      />
      <NewsBoard items={items} />
    </div>
  );
}
