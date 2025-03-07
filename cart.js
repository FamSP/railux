// ใช้ localStorage เพื่อเก็บและดึงข้อมูลตะกร้าสินค้า
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || {};
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

const cart = getCart();

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
      const productId = button.getAttribute("data-product-id");
      const price = parseFloat(button.getAttribute("data-price"));
      
      if (!cart[productId]) {
          cart[productId] = { quantity: 1, price: price };
      } else {
          cart[productId].quantity++;
      }
      saveCart(cart);
  });
});

function updateCartDisplay() {
  const cartElement = document.getElementById("cart");
  cartElement.innerHTML = "";

  let totalPrice = 0;
  const table = document.createElement("table");
  table.classList.add("table", "table-striped");

  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  ["Product", "Quantity", "Price", "Total", "Actions"].forEach((text) => {
      const th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  for (const productId in cart) {
      const item = cart[productId];
      const itemTotalPrice = item.quantity * item.price;
      totalPrice += itemTotalPrice;

      const tr = document.createElement("tr");
      tr.innerHTML = `
          <td>${productId}</td>
          <td>${item.quantity}</td>
          <td>฿${item.price}</td>
          <td>฿${itemTotalPrice}</td>
          <td><button class="btn btn-danger" onclick="removeFromCart('${productId}')">ลบ</button></td>
      `;
      tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  cartElement.appendChild(table);

  if (Object.keys(cart).length === 0) {
      cartElement.innerHTML = "<p>No items in cart.</p>";
  } else {
      const totalPriceElement = document.createElement("p");
      totalPriceElement.textContent = `Total Price: ฿${totalPrice}`;
      cartElement.appendChild(totalPriceElement);
  }
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart(cart);
}

document.getElementById("printCart").addEventListener("click", () => {
  printReceipt("Cart Receipt", generateCartReceipt());
});

function printReceipt(title, content) {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`<html><head><title>${title}</title></head><body>${content}</body></html>`);
  printWindow.document.close();
  printWindow.print();
}

function generateCartReceipt() {
  let receiptContent = `<h2>Cart Receipt</h2><table><thead><tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr></thead><tbody>`;
  let totalPrice = 0;

  for (const productId in cart) {
      const item = cart[productId];
      const itemTotalPrice = item.quantity * item.price;
      receiptContent += `<tr><td>${productId}</td><td>${item.quantity}</td><td>฿${item.price}</td><td>฿${itemTotalPrice}</td></tr>`;
      totalPrice += itemTotalPrice;
  }

  receiptContent += `</tbody></table><p>Total ฿${totalPrice}</p>`;
  return receiptContent;
}

document.addEventListener("DOMContentLoaded", updateCartDisplay);
