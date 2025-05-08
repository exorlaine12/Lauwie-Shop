let pendingAddItem = null;

document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.querySelector(".cart-icon");
  const cartCount = document.getElementById("cart-count");
  const modal = document.getElementById("add-confirm-modal");
  const confirmYes = document.getElementById("add-confirm-yes");
  const confirmNo = document.getElementById("add-confirm-no");

  // ➤ PERSISTENT CART COUNT ON PAGE LOAD
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
    if (cartCount) {
      cartCount.textContent = totalItems;
    }
  }

  updateCartCount(); // ← Call it right away

  // ➤ HANDLE ADD TO CART BUTTONS
  document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function () {
      pendingAddItem = {
        name: this.dataset.name,
        price: parseFloat(this.dataset.price),
        image: this.dataset.image
      };
      document.getElementById("add-confirm-text").textContent = `Are you sure you want to add "${pendingAddItem.name}" to your cart?`;
      modal.style.display = "flex";
    });
  });

  // ➤ CONFIRM ADD TO CART
  confirmYes.addEventListener("click", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || {};
    const item = pendingAddItem;

    if (cart[item.name]) {
      cart[item.name].quantity++;
    } else {
      cart[item.name] = { ...item, quantity: 1 };
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartCount(); // ← Update count after adding

    // Add animation
    if (cartCount) {
      cartCount.classList.add("animate");
      setTimeout(() => cartCount.classList.remove("animate"), 500);
    }

    if (cartIcon) {
      cartIcon.classList.add("animate");
      setTimeout(() => cartIcon.classList.remove("animate"), 500);
    }

    alert(`${item.name} has been added to your cart!`);
    modal.style.display = "none";
    pendingAddItem = null;
  });

  // ➤ CANCEL ADD TO CART
  confirmNo.addEventListener("click", function () {
    modal.style.display = "none";
    pendingAddItem = null;
  });
});