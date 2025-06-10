export default function Layout({ children }) {
  return (
    <div data-theme="mytheme" className="min-h-screen bg-base-200">
      <header className="p-4 bg-base-100 shadow mb-4">
        <h1 className="text-2xl font-bold">DietApp</h1>
      </header>
      {children}
    </div>
  );
}
