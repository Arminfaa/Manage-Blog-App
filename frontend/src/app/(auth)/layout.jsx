function Layout({ children }) {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-full max-w-md px-6 lg:py-2 lg:px-2">{children}</div>
    </div>
  );
}
export default Layout;
