 let cart = [];

        async function fetchBooks(category, containerId) {
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${category}`);
            const data = await response.json();
            const container = document.getElementById(containerId);
            container.innerHTML = "";
            if (data.items) {
                data.items.slice(0, 10).forEach(book => {
                    const bookInfo = book.volumeInfo;
                    const previewLink = bookInfo.previewLink || null;
                    const bookElement = document.createElement("div");
                    bookElement.className = "book-card";
                    bookElement.innerHTML = `
            <img src="${bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/100'}" alt="Book Cover">
            <h3>${bookInfo.title}</h3>
            <p><strong>Author:</strong> ${bookInfo.authors?.join(", ") || "Unknown"}</p>
            <p><strong>Price:</strong> ₹${(Math.random() * 300 + 400).toFixed(2)}</p>
            ${previewLink ? `<button onclick="previewBook('${previewLink}')">Read Preview</button>` : '<p>No preview available</p>'}
            <button onclick="addToCart('${bookInfo.title}')">Add to Cart</button>
          `;
                    container.appendChild(bookElement);
                });
            }
        }

        function searchBooks() {
            const searchValue = document.getElementById("searchInput").value;
            fetchBooks(searchValue, "booksContainer");
        }

        // ✅ Enter key for search
        document.getElementById("searchInput").addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                searchBooks();
            }
        });

        function previewBook(previewLink) {
            window.open(previewLink, "_blank");
        }

        function addToCart(title) {
            cart.push(title);
            updateCartUI();
            showCartPopup(); // ✅ Show popup when book is added
        }

        function updateCartUI() {
            document.getElementById("cartCount").innerText = cart.length;
            const cartItems = document.getElementById("cartItems");
            cartItems.innerHTML = "";
            cart.forEach((item, index) => {
                const li = document.createElement("li");
                li.innerText = item;
                li.innerHTML += ` <button onclick="removeFromCart(${index})">Remove</button>`;
                cartItems.appendChild(li);
            });
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartUI();
        }

        function toggleCart() {
            const cartModal = document.getElementById("cart");
            cartModal.style.display = cartModal.style.display === "block" ? "none" : "block";
        }

        function buyItems() {
            if (cart.length === 0) {
                alert("Your cart is empty!");
            } else {
                alert("Thank you for your purchase: " + cart.join(", "));
                cart = [];
                updateCartUI();
                toggleCart();
            }
        }

        function openModal(id) {
            document.getElementById(id).style.display = "block";
        }

        function closeModal(id) {
            document.getElementById(id).style.display = "none";
        }

        // ✅ Show popup function
        function showCartPopup() {
            const popup = document.getElementById("cartPopup");
            popup.classList.add("show");
            setTimeout(() => {
                popup.classList.remove("show");
            }, 2000);
        }

        // Load books initially
        fetchBooks("fiction", "fictionContainer");
        fetchBooks("non-fiction", "nonFictionContainer");