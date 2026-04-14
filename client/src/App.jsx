import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

const emptyAuthForm = { email: "", password: "" };
const emptyProductForm = { name: "", price: "", image: null };
const emptyPaymentForm = { amount: "" };

function App() {
  const [registerForm, setRegisterForm] = useState(emptyAuthForm);
  const [loginForm, setLoginForm] = useState(emptyAuthForm);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [paymentForm, setPaymentForm] = useState(emptyPaymentForm);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [statusMessage, setStatusMessage] = useState(
    "Backend connected. Register or login to continue."
  );
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoadingProducts(true);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Unable to fetch products."));
    } finally {
      setLoadingProducts(false);
    }
  }

  async function registerUser(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        registerForm
      );
      setStatusMessage(response.data.message || "Registration complete.");
      setRegisterForm(emptyAuthForm);
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Registration failed."));
    }
  }

  async function loginUser(event) {
    event.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        loginForm
      );
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      setStatusMessage("Login successful. Protected actions are now unlocked.");
      setLoginForm(emptyAuthForm);
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Login failed."));
    }
  }

  async function addProduct(event) {
    event.preventDefault();

    if (!token) {
      setStatusMessage("Please login before adding a product.");
      return;
    }

    if (!productForm.image) {
      setStatusMessage("Please choose an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", productForm.name);
    formData.append("price", productForm.price);
    formData.append("image", productForm.image);

    try {
      await axios.post(`${API_BASE_URL}/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage("Product added successfully.");
      setProductForm(emptyProductForm);
      const imageInput = document.getElementById("product-image-input");
      if (imageInput) {
        imageInput.value = "";
      }
      fetchProducts();
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Product upload failed."));
    }
  }

  async function submitPayment(event) {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/payment`, {
        amount: Number(paymentForm.amount),
      });
      setStatusMessage(
        `Payment ${response.data.status} for amount Rs. ${response.data.amount}`
      );
      setPaymentForm(emptyPaymentForm);
    } catch (error) {
      setStatusMessage(getErrorMessage(error, "Payment failed."));
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken("");
    setStatusMessage("Logged out.");
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="label">FSD Project Dashboard</p>
          <h1>Complete Full-Stack Project</h1>
          <p>
            A React frontend connected to the Express, MongoDB, JWT
            authentication, product upload, and payment APIs.
          </p>
          <div className="hero-actions">
            <span className="token-state">
              {token ? "Logged in" : "Not logged in"}
            </span>
            {token ? (
              <button className="button secondary" onClick={logout} type="button">
                Logout
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="status-card">
        <h2>Status</h2>
        <p>{statusMessage}</p>
      </section>

      <section className="grid two-column">
        <form className="card" onSubmit={registerUser}>
          <h2>Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={registerForm.email}
            onChange={(event) =>
              setRegisterForm({ ...registerForm, email: event.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={registerForm.password}
            onChange={(event) =>
              setRegisterForm({
                ...registerForm,
                password: event.target.value,
              })
            }
            required
          />
          <button className="button" type="submit">
            Register
          </button>
        </form>

        <form className="card" onSubmit={loginUser}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Email"
            value={loginForm.email}
            onChange={(event) =>
              setLoginForm({ ...loginForm, email: event.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(event) =>
              setLoginForm({ ...loginForm, password: event.target.value })
            }
            required
          />
          <button className="button" type="submit">
            Login
          </button>
        </form>
      </section>

      <section className="grid two-column">
        <form className="card" onSubmit={addProduct}>
          <h2>Add Product</h2>
          <input
            type="text"
            placeholder="Product name"
            value={productForm.name}
            onChange={(event) =>
              setProductForm({ ...productForm, name: event.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={productForm.price}
            onChange={(event) =>
              setProductForm({ ...productForm, price: event.target.value })
            }
            required
          />
          <input
            id="product-image-input"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setProductForm({
                ...productForm,
                image: event.target.files?.[0] || null,
              })
            }
            required
          />
          <button className="button" type="submit">
            Upload Product
          </button>
        </form>

        <form className="card" onSubmit={submitPayment}>
          <h2>Mock Payment</h2>
          <input
            type="number"
            placeholder="Amount"
            value={paymentForm.amount}
            onChange={(event) =>
              setPaymentForm({ ...paymentForm, amount: event.target.value })
            }
            required
          />
          <button className="button" type="submit">
            Pay
          </button>
        </form>
      </section>

      <section className="card">
        <div className="section-header">
          <h2>Products</h2>
          <button className="button secondary" onClick={fetchProducts} type="button">
            Refresh
          </button>
        </div>

        {loadingProducts ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products available yet.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <article className="product-card" key={product._id}>
                <img
                  src={`${API_BASE_URL}/${product.image}`}
                  alt={product.name}
                />
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p>Rs. {product.price}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getErrorMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.response?.data?.errors?.[0]?.msg ||
    fallbackMessage
  );
}

export default App;
