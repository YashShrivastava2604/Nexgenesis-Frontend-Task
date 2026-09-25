import { useAuth } from "../context/AuthContext";

const Products = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold">
            Product Admin
          </h1>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              {user?.firstName} {user?.lastName}
            </span>

            <button
              onClick={logout}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl p-6">
        <h2 className="text-2xl font-bold">
          Products
        </h2>

        <p className="mt-2 text-slate-500">
          Product management coming next.
        </p>
      </main>
    </div>
  );
};

export default Products;