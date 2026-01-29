const API_BASE = "http://localhost:3000";
document.getElementById("apiBaseText").textContent = `API: ${API_BASE}`;

const booksWrap = document.getElementById("booksWrap");
const btnRefresh = document.getElementById("btnRefresh");

const formAddBook = document.getElementById("formAddBook");
const addBookResult = document.getElementById("addBookResult");

const formBorrow = document.getElementById("formBorrow");
const borrowResult = document.getElementById("borrowResult");
const btnGetLocation = document.getElementById("btnGetLocation");

function pretty(obj) {
  return JSON.stringify(obj, null, 2);
}

function renderBooksTable(books) {
  const rows = books.map(b => `
    <tr>
      <td>${b.id}</td>
      <td>${b.title}</td>
      <td>${b.author}</td>
      <td>${b.stock}</td>
    </tr>
  `).join("");

  booksWrap.innerHTML = `
    <table>
      <thead>
        <tr><th>ID</th><th>Title</th><th>Author</th><th>Stock</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function fetchBooks() {
  booksWrap.textContent = "Loading...";
  try {
    const res = await fetch(`${API_BASE}/api/books`);
    const data = await res.json();
    if (!res.ok) throw data;
    renderBooksTable(Array.isArray(data) ? data : []);
  } catch (err) {
    booksWrap.innerHTML = `<pre class="result">${pretty(err)}</pre>`;
  }
}

btnRefresh.addEventListener("click", fetchBooks);

// Admin: tambah buku
formAddBook.addEventListener("submit", async (e) => {
  e.preventDefault();
  addBookResult.textContent = "Loading...";
  try {
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const stock = Number(document.getElementById("stock").value);

    const res = await fetch(`${API_BASE}/api/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": "admin"
      },
      body: JSON.stringify({ title, author, stock })
    });

    const data = await res.json();
    if (!res.ok) throw data;

    addBookResult.textContent = pretty(data);
    formAddBook.reset();
    document.getElementById("stock").value = 1;
    await fetchBooks();
  } catch (err) {
    addBookResult.textContent = pretty(err);
  }
});

// Ambil lokasi otomatis
btnGetLocation.addEventListener("click", () => {
  borrowResult.textContent = "";
  if (!navigator.geolocation) {
    borrowResult.textContent = pretty({ message: "Geolocation tidak didukung browser ini." });
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      document.getElementById("latitude").value = pos.coords.latitude;
      document.getElementById("longitude").value = pos.coords.longitude;
    },
    (err) => {
      borrowResult.textContent = pretty({ message: "Gagal ambil lokasi", error: err.message });
    }
  );
});

// User: pinjam buku
formBorrow.addEventListener("submit", async (e) => {
  e.preventDefault();
  borrowResult.textContent = "Loading...";
  try {
    const bookId = Number(document.getElementById("borrowBookId").value);
    const latitude = Number(document.getElementById("latitude").value);
    const longitude = Number(document.getElementById("longitude").value);

    const res = await fetch(`${API_BASE}/api/borrow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-role": "user",
        "x-user-id": "1"
      },
      body: JSON.stringify({ bookId, latitude, longitude })
    });

    const data = await res.json();
    if (!res.ok) throw data;

    borrowResult.textContent = pretty(data);
    await fetchBooks();
  } catch (err) {
    borrowResult.textContent = pretty(err);
  }
});

// load awal
fetchBooks();
