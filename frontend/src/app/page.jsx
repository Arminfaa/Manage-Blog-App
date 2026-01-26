import Button from "@/ui/Button";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata = {
  title: "خانه  - وب اپلیکیشن مدیریت بلاگ",
};

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center flex-1 h-full px-4">
        <h1 className="font-bold text-center text-2xl md:text-5xl text-secondary-800 mb-4 md:mb-20">
          اپلیکیشن مدیریت بلاگ
        </h1>

        <div>
          <p className="text-center text-secondary-500 text-lg leading-loose">
            جایی که قراره بتونی یه اپلیکیشن بلاگ کامل رو مدیریت کنی!
            <br /> بتونی بلاگ بسازی - کامنت بگذاری و در پنلت همه اتفاقات رو رصد
            کنی!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 w-full mt-6 sm:mt-10">
            <Button variant="outline">
              <Link href="/blogs">مطالعه بلاگ ها</Link>
            </Button>
            <Button variant="primary">
              <Link href="/profile">مدیریت بلاگ ها</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
