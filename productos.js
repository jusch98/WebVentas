let allProducts = [];

// Fetch products from API
fetch('https://products-foniuhqsba-uc.a.run.app/Smartwatches%20and%20gadgets')
  .then((response) => response.json())
  .then((data) => {
    console.log('Datos de la API:', data); // Verificar datos obtenidos
    allProducts = data;
    const categories = [...new Set(data.map(product => product.category || 'Sin categoría'))];
    populateCategories(categories);
    renderProducts(data);
  })
  .catch((error) => console.error('Error al obtener los datos de la API:', error));

// Renderizar productos
function renderProducts(products) {
  const container = document.getElementById("product-container");
  const template = document.getElementById("product-card-template");

  if (!container) {
    console.error('El contenedor con ID "product-container" no existe.');
    return;
  }

  if (!template) {
    console.error('El template con ID "product-card-template" no existe.');
    return;
  }

  container.innerHTML = ''; // Limpiar productos anteriores

  products.forEach((product) => {
    const clone = template.content.cloneNode(true);

    // Validaciones para evitar errores
    const productTitle = clone.querySelector("h3");
    const productImage = clone.querySelector("img");
    const productDate = clone.querySelector("p.text-sm");
    const productRating = clone.querySelector(".text-yellow-500 + span");
    const productPrice = clone.querySelector("p.text-blue-600");

    if (productTitle) productTitle.textContent = product.title || 'Producto sin título';
    if (productImage) productImage.src = product.image || 'https://via.placeholder.com/150';
    if (productDate) productDate.textContent = `Lanzado: ${product.date || 'N/A'}`;
    if (productRating) productRating.textContent = product.rating || 'N/A';
    if (productPrice) productPrice.textContent = product.price || 'N/A';

    // Asignar evento para mostrar detalles
    const detailButton = clone.querySelector("button");
    if (detailButton) {
      detailButton.addEventListener("click", () => {
        showProductDetail(product);
      });
    }

    container.appendChild(clone);
  });
}

// Llenar categorías
function populateCategories(categories) {
  const categoryList = document.getElementById("category-list");

  if (!categoryList) {
    console.error('El elemento con ID "category-list" no existe.');
    return;
  }

  categoryList.innerHTML = ''; // Limpiar categorías anteriores

  categories.forEach(category => {
    const li = document.createElement("li");
    li.textContent = category;
    li.className = "cursor-pointer hover:text-blue-600";
    li.addEventListener("click", () => {
      const filteredProducts = allProducts.filter(product => product.category === category);
      renderProducts(filteredProducts);
      const popover = document.getElementById("filter-popover");
      if (popover) popover.classList.add("hidden"); // Cerrar popover
    });
    categoryList.appendChild(li);
  });
}

// Mostrar detalles del producto
function showProductDetail(product) {
  const detailImage = document.getElementById("detail-image");
  const detailTitle = document.getElementById("detail-title");
  const detailDescription = document.getElementById("detail-description");
  const detailPrice = document.getElementById("detail-price");
  const featuresList = document.getElementById("detail-features");

  if (detailImage) detailImage.src = product.image || 'https://via.placeholder.com/150';
  if (detailTitle) detailTitle.textContent = product.title || 'Producto sin título';
  if (detailDescription) detailDescription.textContent = product.description || 'Sin descripción disponible.';
  if (detailPrice) detailPrice.textContent = product.price || 'N/A';
  if (featuresList) {
    featuresList.innerHTML = '';
    (product.features || []).forEach((feature) => {
      const li = document.createElement("li");
      li.textContent = `${feature.type}: ${feature.value}`;
      featuresList.appendChild(li);
    });
  }

  const productDetail = document.getElementById("product-detail");
  const productContainer = document.getElementById("product-container");
  if (productDetail) productDetail.classList.remove("hidden");
  if (productContainer) productContainer.classList.add("hidden");
}

// Volver al catálogo
const backToCatalogButton = document.getElementById("back-to-catalog");
if (backToCatalogButton) {
  backToCatalogButton.addEventListener("click", () => {
    const productContainer = document.getElementById("product-container");
    const productDetail = document.getElementById("product-detail");
    if (productContainer) productContainer.classList.remove("hidden");
    if (productDetail) productDetail.classList.add("hidden");
  });
}

// Toggle Cart
function toggleCart() {
  const cartContainer = document.getElementById("cart-container");
  if (cartContainer) cartContainer.classList.toggle("hidden");
}

// Agregar al carrito
function addToCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const totalPrice = document.getElementById("total-price");
  const productDetail = document.getElementById("detail-title").textContent;
  const productPrice = parseFloat(document.getElementById("detail-price").textContent.replace('$', '').trim()) || 0;

  if (!cartItems || !cartCount || !totalPrice) {
    console.error("No se encontraron elementos del carrito.");
    return;
  }

  const li = document.createElement("li");
  li.textContent = productDetail + ' - $' + productPrice;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Eliminar";
  removeBtn.className = "ml-4 text-sky-600 underline cursor-pointer";
  removeBtn.addEventListener("click", () => {
    const currentTotal = parseFloat(totalPrice.textContent.replace('$', '').trim());
    totalPrice.textContent = `$${(currentTotal - productPrice).toFixed(2)}`;
    cartItems.removeChild(li);
    cartCount.textContent = cartItems.children.length;
  });

  li.appendChild(removeBtn);
  cartItems.appendChild(li);

  cartCount.textContent = cartItems.children.length;
  const currentTotal = parseFloat(totalPrice.textContent.replace('$', '').trim()) || 0;
  totalPrice.textContent = `$${(currentTotal + productPrice).toFixed(2)}`;
}

// Popover de filtro
const filterButton = document.getElementById("filter-btn");
if (filterButton) {
  filterButton.addEventListener("click", () => {
    const popover = document.getElementById("filter-popover");
    if (popover) popover.classList.toggle("hidden");
  });
}

// Actualizar el valor del filtro de precio
const priceFilterInput = document.getElementById("price-filter");
if (priceFilterInput) {
  priceFilterInput.addEventListener("input", (event) => {
    const priceValue = document.getElementById("price-value");
    if (priceValue) priceValue.textContent = event.target.value;
  });
}

// Aplicar filtro
const applyFiltersButton = document.getElementById("apply-filters");
if (applyFiltersButton) {
  applyFiltersButton.addEventListener("click", () => {
    const priceFilter = parseFloat(document.getElementById("price-filter").value);
    const filteredProducts = allProducts.filter(product => {
      const productPrice = parseFloat(product.price.replace('$', '').trim()) || 0;
      return productPrice <= priceFilter;
    });
    renderProducts(filteredProducts);
    const popover = document.getElementById("filter-popover");
    if (popover) popover.classList.add("hidden");
  });
}
//
function searchProducts() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filteredProducts = allProducts.filter((product) =>
    product.title.toLowerCase().includes(searchTerm)
  );
  renderProducts(filteredProducts);
}
//para proceder compra
function procederCompra(){
  alert ("La compra se ha realizado");
  document.getElementById ("cart-items").innerHTML ="";
  document.getElementById ("cart-count").textContent ="0";
  document.getElementById ("total-price").textContent ="$0.00";
}