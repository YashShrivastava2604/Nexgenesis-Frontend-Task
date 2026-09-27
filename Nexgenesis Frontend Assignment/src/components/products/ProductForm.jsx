import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  brand: "",
  thumbnail: "",
};

const ProductForm = ({
  initialData,
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        price: initialData.price ?? "",
        stock: initialData.stock ?? "",
        category: initialData.category || "",
        brand: initialData.brand || "",
        thumbnail: initialData.thumbnail || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Category is required.";
    }

    if (form.price === "" || Number(form.price) <= 0) {
      nextErrors.price = "Price must be greater than 0.";
    }

    if (
      form.stock === "" ||
      Number(form.stock) < 0
    ) {
      nextErrors.stock = "Stock cannot be negative.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (loading) return;

    if (!validate()) {
      return;
    }

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category.trim(),
      brand: form.brand.trim(),
      thumbnail: form.thumbnail.trim(),
    });
  };

  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="text-sm font-medium text-slate-700">
          Title
        </label>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className={fieldClass}
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          className={fieldClass}
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Price
          </label>

          <input
            type="number"
            min="0"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            className={fieldClass}
          />

          {errors.price && (
            <p className="mt-1 text-sm text-red-600">
              {errors.price}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Stock
          </label>

          <input
            type="number"
            min="0"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            className={fieldClass}
          />

          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">
              {errors.stock}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-slate-700">
            Category
          </label>

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className={fieldClass}
            placeholder="e.g. smartphones"
          />

          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">
            Brand
          </label>

          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-slate-700">
          Image URL
        </label>

        <input
          name="thumbnail"
          value={form.thumbnail}
          onChange={handleChange}
          className={fieldClass}
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Saving..."
          : initialData
          ? "Update Product"
          : "Create Product"}
      </button>
    </form>
  );
};

export default ProductForm;