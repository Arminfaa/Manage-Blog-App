import Header from "@/components/Header";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="container xl:max-w-screen-xl flex-1 h-full"> {children}</div>
    </>
  );
}
