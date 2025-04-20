import { getPayload } from "payload";
import { Footer } from "~/modules/home/ui/components/footer";
import { Navbar } from "~/modules/home/ui/components/navbar";
import { SearchFilters } from "~/modules/home/ui/components/search-filters";
import configPromise from "@payload-config";
import { Category } from "~/payload-types";
import { CustomCategory } from "~/modules/categories/types";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const payload = await getPayload({
    config: configPromise,
  });
  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        equals: false,
      },
    },
    sort: "name",
  });
  const formattedData: CustomCategory[] = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((subdocs) => ({
      // Because of 'depth: 1' we are confident doc will be a type of "Category"
      ...(subdocs as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#f4f4f4]">{children}</div>
      <Footer />
    </div>
  );
};
export default Layout;
