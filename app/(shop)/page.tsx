import CategoryGrid from "@/components/storefront/CategoryGrid";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import Hero from "@/components/storefront/Hero";
import Bestseller from "@/components/storefront/Bestseller";
import PullQuote from "@/components/storefront/PullQuote";
import { listCategories, listProducts } from "@/lib/db";

export default async function HomePage() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);

  return (
    <>
      <Hero />
      <PullQuote />
      <FeaturedProducts products={products} />
      <CategoryGrid categories={categories} />
      <Bestseller />
    </>
  );
}
