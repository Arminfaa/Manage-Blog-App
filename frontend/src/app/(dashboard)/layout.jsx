import Header from "./profile/_componnets/Header";
import SideBar from "./profile/_componnets/SideBar";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export const metadata = {
  title: "پروفایل",
  description: "پروفایل",
};

export default function RootLayout({ children }) {
  return (
    <div className="bg-secondary-0 w-full">
      <div className="flex flex-col lg:grid lg:grid-cols-12 lg:grid-rows-[auto_1fr] h-screen">
        <aside className="hidden lg:block col-span-3 xl:col-span-2 row-span-2">
          <SideBar />
        </aside>
        <div className="grid-cols-12 lg:col-span-9 xl:col-span-10 row-span-1">
          <Header />
        </div>
        <main className="grid-cols-12 lg:col-span-9 xl:col-span-10 bg-secondary-100 rounded-tr-3xl p-4 md:p-6 overflow-y-auto">
          <div className="">{children}</div>
        </main>
      </div>
    </div>
  );
}
