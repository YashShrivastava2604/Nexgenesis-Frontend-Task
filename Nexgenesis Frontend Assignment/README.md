# Nexgenesis-Frontend-Task
# Product Admin Dashboard

A responsive Product Admin Dashboard built as a frontend assignment using React, Tailwind CSS, Axios, and the DummyJSON API.

## Live Demo

Vercel Link : https://nexgenesis-frontend-task.vercel.app/

## GitHub Repository

https://github.com/YashShrivastava2604/Nexgenesis-Frontend-Task/

---

## Tech Stack

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- DummyJSON API
- JavaScript
- Git & GitHub
- Vercel

> Note: The assignment mentions Next.js. This implementation uses React + Vite because the required functionality is client-side and the assignment requirements are centered around React, Tailwind CSS, Axios, and the DummyJSON API.

---

## Features

### Authentication

- Login using the DummyJSON authentication API.
- Test credentials:
  - Username: `user`
  - Password: `userpass`
- Authentication token stored in `localStorage`.
- Protected product routes.
- Logout functionality.
- Prevents duplicate login submissions while a request is in progress.
- Axios interceptor automatically attaches the authentication token to API requests.
- Centralized handling of unauthorized responses.

### Product Listing

- Displays:
  - Product image
  - Title
  - Category
  - Price
  - Rating
  - Stock
- Responsive desktop table.
- Responsive mobile card layout.
- Product details accessible by clicking a product.

### Pagination

- Page-by-page pagination using DummyJSON's `limit` and `skip`.
- Previous and Next navigation.
- Page size options:
  - 10
  - 20
  - 50
- Displays the current result range and total number of products.
- Pagination state is stored in the URL.

### Search

- Product search using DummyJSON's search endpoint.
- Debounced search input to avoid an API request for every keystroke.
- Search automatically resets pagination to page 1.
- Search state is stored in the URL.
- Previous requests are cancelled when a newer request is started to prevent stale results from appearing.
- Category filtering is disabled while searching because DummyJSON does not support combining search and category filtering in the required way.

### Filtering & Sorting

- Filter products by category.
- Categories are loaded from the DummyJSON API.
- Sort products by:
  - Price
  - Rating
  - Title
- Sorting and filtering reset pagination to page 1.
- Filter and sort state is stored in the URL.

### Product Details

- Dedicated product details page.
- Displays:
  - Product images
  - Title
  - Description
  - Price
  - Rating
  - Stock
  - Category
  - Reviews
- Handles invalid product IDs.

### Add Product

- Add new products through a dedicated form.
- Form validation.
- Prevents duplicate submissions while saving.
- Uses DummyJSON's product creation endpoint.
- Locally stores the created product so the change remains visible in the application.

### Edit Product

- Edit existing products.
- Form is pre-filled with existing product information.
- Validation before submission.
- Uses DummyJSON's update endpoint.
- Locally stores the updated product so the change remains visible in the application.

### Delete Product

- Delete products with confirmation.
- Uses DummyJSON's delete endpoint.
- Locally tracks deleted products so they disappear from the application.

### UI States

The application handles:

- Loading states
- Empty states
- API errors
- Retry functionality
- Invalid URL parameters
- Responsive layouts

---

## Project Structure

```text
src/
├── api/
│   ├── axios.js
│   ├── authApi.js
│   └── productsApi.js
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── products/
│   │   ├── ProductTable.jsx
│   │   ├── ProductCards.jsx
│   │   ├── ProductFilters.jsx
│   │   ├── Pagination.jsx
│   │   └── ProductForm.jsx
│   └── ProtectedRoute.jsx
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useDebounce.js
│   └── useProducts.js
│
├── pages/
│   ├── Login.jsx
│   ├── Products.jsx
│   ├── ProductDetails.jsx
│   ├── AddProduct.jsx
│   └── EditProduct.jsx
│
├── utils/
│   └── productStorage.js
│
├── App.jsx
├── main.jsx
└── index.css