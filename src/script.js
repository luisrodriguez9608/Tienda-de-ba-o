// Función para registrar un nuevo usuario
function registrarUsuario() {
  // Obtener los datos del formulario
  const data = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    correo: document.getElementById("correo").value,
    contraseña: document.getElementById("contraseña").value,
    confirmarContraseña: document.getElementById("confirmarContraseña").value,
  };

    // Enviar los datos al servidor
    fetch('/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.text())
    .then(message => {
        // Manejar la respuesta del servidor
        alert(message);
        // Redireccionar al usuario a la página de inicio si el registro fue exitoso
        if (message === 'Usuario registrado correctamente') {
            window.location.href = '/'; // Redirigir al usuario al index.html
        }
    })
    .catch((error) => console.error("Error al registrar usuario:", error));

  // Evitar que el formulario se envíe de forma convencional
  return false;
}

// Función para agregar un producto al carrito
function agregarAlCarrito(productoId) {
  if (!productoId) {
    console.error("ID del producto indefinido");
    return;
  }

  fetch("/agregar-al-carrito", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productoId: productoId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al agregar el producto al carrito");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
      // Actualizar la cantidad en el ícono del carrito después de agregar un producto
      actualizarCantidadCarrito(data.cantidadTotal);
    })
    .catch((error) =>
      console.error("Error al agregar el producto al carrito: ", error)
    );
}

// Función para eliminar un producto del carrito
function eliminarProductoDelCarrito(productoId) {
  fetch(`/eliminarDelCarrito/${productoId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "No se encontró el producto en el carrito para eliminar"
        );
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      location.reload(); // Recargar la página para reflejar los cambios en el carrito
    })
    .catch((error) => {
      console.error("Error al eliminar el producto del carrito:", error);
      alert(
        error.message ||
          "Error al eliminar el producto del carrito. Por favor, inténtalo de nuevo."
      );
    });
}

// Evento que se ejecuta cuando el contenido del DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Obtener los productos en el carrito y mostrarlos
  fetch("/productos-carrito")
    .then((response) => response.json())
    .then((productos) => {
      const cartItemsTable = document.getElementById("cart-items-table");
      const subtotalElement = document.getElementById("subtotal");
      const totalElement = document.getElementById("total");
      let subtotal = 0;

      // Objeto para almacenar los productos en el carrito
      const carrito = {};

      // Limpiar la tabla antes de agregar los productos
      cartItemsTable.querySelector("tbody").innerHTML = "";

      // Recorrer los productos en el carrito
      productos.forEach((producto) => {
        const precioTotal = producto.precio * producto.cantidad;
        subtotal += precioTotal;

        // Verificar si el producto tiene cantidad mayor que 0
        if (producto.cantidad > 0) {
          // Verificar si el producto ya está en el carrito
          if (carrito[producto.productoID]) {
            // Si el producto ya está en el carrito, actualiza la cantidad
            carrito[producto.productoID].cantidad += producto.cantidad;
          } else {
            // Si el producto no está en el carrito, agrégalo
            carrito[producto.productoID] = {
              ...producto,
            };
          }
        }
      });

      // Recorrer el carrito y mostrar los productos en la tabla
      Object.values(carrito).forEach((producto) => {
        const precioTotal = producto.precio * producto.cantidad;

        const productoHTML = `
                    <tr>
                        <td class="cart__product__item">
                            <img src="${
                              producto.imagen
                            }" class="cart-product-img" alt="${
          producto.nombre
        }">
                            <div class="cart__product__item__title">
                                <h6>${producto.nombre}</h6>
                            </div>
                        </td>
                        <td class="cart__price">$${producto.precio}</td>
                        <td class="cart__quantity">${producto.cantidad}</td>
                        <td class="cart__total">$${precioTotal.toFixed(2)}</td>
                        <td class="cart__close"><button class="close-btn" data-product-id="${
                          producto.productoID
                        }"><span class="icon_close"></span></button></td>
                    </tr>
                `;

        cartItemsTable.querySelector("tbody").innerHTML += productoHTML;
      });

      // Agregar evento de clic a los botones "Close"
      const closeButtons = document.querySelectorAll(".close-btn");
      closeButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const productoId = this.getAttribute("data-product-id");
          eliminarProductoDelCarrito(productoId);
        });
      });

      // Actualizar los totales
      subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
      totalElement.textContent = `$${subtotal.toFixed(2)}`;
    })
    .catch((error) =>
      console.error("Error al obtener productos del carrito: ", error)
    );

  // Obtener los productos disponibles en la tienda y mostrarlos
  fetch("/admin")
    .then((response) => response.json())
    .then((productos) => {
      const productosContainer = document.getElementById("productos-container");
      const productIdSet = new Set(); // Conjunto para almacenar los IDs de productos únicos

      productos.forEach((producto) => {
        // Verificar si el ID del producto ya está en el conjunto
        if (!productIdSet.has(producto.productoID)) {
          productIdSet.add(producto.productoID); // Agregar el ID del producto al conjunto

          const productoHTML = `
                        <div class="col-lg-4 col-md-6">
                            <div class="product__item">
                                <div class="product__item__pic">
                                    <img src="${producto.imagen}" alt="${producto.nombre}">
                                    <div class="label new">New</div>
                                    <ul class="product__hover">
                                        <li><a href="product-details.html?producto=${producto.productoID}"><span class="arrow_expand"></span></a></li>
                                       
                                        <li><a href="#" class="agregar-al-carrito" data-producto-id="${producto.productoID}"><span class="icon_bag_alt"></span></a></li>
                                    </ul>
                                </div>
                                <div class="product__item__text">
                                    <h6><a href="#">${producto.nombre}</a></h6>
                                    <div class="product__price">$ ${producto.precio}</div>
                                </div>
                            </div>
                        </div> 
                    `;

          productosContainer.innerHTML += productoHTML;
        }
      });

      // Agregar evento de clic a los botones "Agregar al carrito"
      const botonesAgregarAlCarrito = document.querySelectorAll(
        ".agregar-al-carrito"
      );
      botonesAgregarAlCarrito.forEach((boton) => {
        boton.addEventListener("click", function (event) {
          event.preventDefault(); // Evitar la acción por defecto del enlace
          const productoId = this.getAttribute("data-producto-id");
          agregarAlCarrito(productoId);
        });
      });
    })
    .catch((error) => console.error("Error al obtener productos: ", error));
});

// Función para actualizar la cantidad en el ícono del carrito
function actualizarCantidadCarrito() {
  // Obtener los productos en el carrito y calcular la cantidad total
  fetch("/productos-carrito")
    .then((response) => response.json())
    .then((productos) => {
      const cantidadTotal = productos.reduce(
        (total, producto) => total + producto.cantidad,
        0
      );
      // Obtener el elemento que muestra la cantidad en el ícono del carrito
      const cantidadCarritoElemento = document.querySelector(".tip");
      if (cantidadTotal > 0) {
        // Mostrar la cantidad si hay productos en el carrito
        cantidadCarritoElemento.textContent = cantidadTotal.toString();
        cantidadCarritoElemento.style.display = "inline";
      } else {
        // Ocultar la cantidad si no hay productos en el carrito
        cantidadCarritoElemento.style.display = "none";
      }
    })
    .catch((error) =>
      console.error("Error al obtener productos del carrito: ", error)
    );
}

// Llamar a la función para actualizar la cantidad en el ícono del carrito cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", actualizarCantidadCarrito);

// También llamamos a la función después de agregar un producto al carrito para reflejar los cambios
function agregarAlCarrito(productoId) {
  if (!productoId) {
    console.error("ID del producto indefinido");
    return;
  }

  fetch("/agregar-al-carrito", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productoId: productoId }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al agregar el producto al carrito");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
      // Llamar a la función para actualizar la cantidad en el ícono del carrito después de agregar un producto
      actualizarCantidadCarrito();
    })
    .catch((error) =>
      console.error("Error al agregar el producto al carrito: ", error)
    );
}

// También llamamos a la función después de eliminar un producto del carrito para reflejar los cambios
function eliminarProductoDelCarrito(productoId) {
  fetch(`/eliminarDelCarrito/${productoId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "No se encontró el producto en el carrito para eliminar"
        );
      }
      return response.json();
    })
    .then((data) => {
      alert(data.message);
      // Llamar a la función para actualizar la cantidad en el ícono del carrito después de eliminar un producto
      actualizarCantidadCarrito();
      location.reload(); // Recargar la página para reflejar los cambios en el carrito
    })
    .catch((error) => {
      console.error("Error al eliminar el producto del carrito:", error);
      alert(
        error.message ||
          "Error al eliminar el producto del carrito. Por favor, inténtalo de nuevo."
      );
    });
}

// Evento que se ejecuta cuando el contenido del DOM está completamente cargado
document.addEventListener("DOMContentLoaded", function () {
  // Obtener los productos en el carrito y mostrarlos
  fetch("/productos-carrito")
    .then((response) => response.json())
    .then((productos) => {
      // Calcular la cantidad total de productos en el carrito
      const cantidadTotal = productos.reduce(
        (total, producto) => total + producto.cantidad,
        0
      );
      // Actualizar la cantidad en el ícono del carrito
      actualizarCantidadCarrito(cantidadTotal);
    })
    .catch((error) =>
      console.error("Error al obtener productos del carrito: ", error)
    );
});
function checkSession() {
    fetch("/checkSession")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Respuesta del servidor no válida");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuesta del servidor:", data);
        const authSection = document.getElementById("authSection");
        const adminLink = document.getElementById("adminLink");
        const dashboardLink = document.getElementById("dashboardLink"); // Agregamos referencia al enlace del dashboard
        const accountOptions = document.getElementById("accountOptions");
        const logoutLink = document.getElementById("logoutLink");
  
        if (data.loggedin) {
          authSection.innerHTML = '<a href="/cerrarSesion">Cerrar sesión</a>';
          if (data.rol !== null && data.rol === 2) {
            adminLink.removeAttribute("hidden");
            dashboardLink.removeAttribute("hidden"); // Mostramos el enlace del dashboard si el usuario tiene rol de administrador
          } else {
            adminLink.setAttribute("hidden", "true");
            dashboardLink.setAttribute("hidden", "true"); // Ocultamos el enlace del dashboard si el usuario no tiene rol de administrador
          }
          accountOptions.style.display = "block"; // Mostrar las opciones de cuenta
          logoutLink.style.display = "block"; // Mostrar el enlace de cerrar sesión
        } else {
          authSection.innerHTML =
            '<a href="./inicio.html">Iniciar sesión</a> <a href="./registro.html">Registrarse</a>';
          adminLink.setAttribute("hidden", "true");
          dashboardLink.setAttribute("hidden", "true"); // Ocultamos el enlace del dashboard si el usuario no está autenticado
          accountOptions.style.display = "none"; // Ocultar las opciones de cuenta
          logoutLink.style.display = "none"; // Ocultar el enlace de cerrar sesión
        }
      })
      .catch((error) => console.error("Error al verificar la sesión: ", error));
  }
  
  document.addEventListener("DOMContentLoaded", checkSession);
  



function confirmarEliminacion(productoID) {
  console.log("ID del producto a eliminar:", productoID);
  const confirmacion = window.confirm(
    "¿Estás seguro de que deseas eliminar este producto?"
  );

  if (confirmacion) {
    // Si el usuario confirmó, llamar a la función para eliminar el producto
    eliminarProducto(productoID);
  }
}

function eliminarProducto(productoID) {
  // Enviar la solicitud al servidor para eliminar el producto con el ID dado
  fetch(`/eliminarProducto/${productoID}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Respuesta del servidor:", data); // Imprime la respuesta del servidor
      alert(data.message); // Puedes manejar la respuesta del servidor como desees
      // Recargar la página o actualizar la lista de productos después de eliminar
      window.location.reload();
    })
    .catch((error) => console.error("Error al eliminar producto: ", error));
}

document.addEventListener("DOMContentLoaded", function () {
  let productosCargados = false;

  if (!productosCargados) {
    fetch("/admin")
      .then((response) => response.json())
      .then((productos) => {
        const productosContainer = document.getElementById(
          "productos-container-admin"
        );
        productosContainer.innerHTML = ""; // Limpiar el contenedor antes de agregar nuevos productos

        productos.forEach((producto) => {
          const productoHTML = `
                        <div class="col-lg-4 col-md-6">
                            <div class="product__item">
                                <div class="product__item__pic">
                                    <img src="${producto.imagen}" alt="${producto.nombre}">
                                    <div class="label new">New</div>
                                    <ul class="product__hover">
                                        <li><a href="product-details.html?producto=${producto.productoID}"><span class="arrow_expand"></span></a></li>
                                        <li><a href="#" onclick="confirmarEliminacion(${producto.productoID})"><span class="icon_bag_alt"></span></a></li>
                                    </ul>
                                </div>
                                <div class="product__item__text">
                                    <h6><a href="#">${producto.nombre}</a></h6>
                                    <div class="product__price">$ ${producto.precio}</div>
                                </div>
                            </div>
                        </div>
                    `;

          productosContainer.innerHTML += productoHTML;
        });

        productosCargados = true;
      })
      .catch((error) => console.error("Error al obtener productos: ", error));
  }
});

$(document).ready(function () {
  // Inicializar el control deslizante de rango
  $("#price-range-slider").slider({
    range: true,
    min: 0,
    max: 200,
    values: [0, 200],
    slide: function (event, ui) {
      $("#minamount").val(ui.values[0]);
      $("#maxamount").val(ui.values[1]);
    },
  });

  // Manejar el evento de clic en el botón de filtrado
  $("#filterButton").click(function (event) {
    event.preventDefault();

    const minPrice = parseFloat($("#minamount").val());
    const maxPrice = parseFloat($("#maxamount").val());

    // Realizar la solicitud de filtrado con los valores de precio
    fetch(`/productos/filtrar?minPrice=${minPrice}&maxPrice=${maxPrice}`)
      .then((response) => response.json())
      .then((productosFiltrados) => {
        // Hacer algo con los productos filtrados
        console.log(productosFiltrados);
      })
      .catch((error) => console.error("Error al filtrar productos: ", error));
  });
});

// Función para agregar un producto al carrito
function agregarProducto() {
  // Obtener los datos del formulario
  const nombre = document.getElementById("nombre").value;
  const descripcion = document.getElementById("descripcion").value;
  const imagen = document.getElementById("imagen").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;
  const categoria = document.getElementById("categoria").value;

  // Verificar si todos los campos requeridos están llenos
  if (!nombre || !descripcion || !imagen || !precio || !stock || !categoria) {
    alert("Por favor, complete todos los campos.");
    return false;
  }

  // Enviar los datos al servidor
  fetch("/agregarProducto", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nombre,
      descripcion,
      imagen,
      precio,
      stock,
      categoria,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Error al agregar el producto. Por favor, inténtalo de nuevo."
        );
      }
      return response.text();
    })
    .then((message) => {
      alert(message);
      if (message === "Producto agregado exitosamente") {
        window.location.href = "/admin.html";
      }
    })
    .catch((error) => {
      console.error("Error al agregar el producto:", error.message);
      alert(error.message);
    });

  // Evitar que el formulario se envíe de forma convencional
  return false;
}

    
    function cancelarAccion() {
        // Redirigir a admin.html sin agregar el producto
        window.location.href = '/admin';
    }
    
// Agregar una variable booleana para verificar si los productos ya se cargaron
let productosCargados = false;

document.addEventListener("DOMContentLoaded", function () {
  // Verificar si los productos ya se cargaron antes de llamar a la función de carga de productos
  if (!productosCargados) {
    fetch("/productos")
      .then((response) => response.json())
      .then((productos) => {
        mostrarProductos(productos);
        // Establecer la bandera en verdadero una vez que los productos se carguen correctamente
        productosCargados = true;
      })
      .catch((error) => console.error("Error al obtener productos: ", error));
  }
});

// Obtener los elementos de filtro y agregar el evento de clic a cada uno
const filterControls = document.querySelectorAll(".filter__controls li");
filterControls.forEach((control) => {
  control.addEventListener("click", function () {
    const categoria = this.getAttribute("data-filter").substring(1); // Eliminar el punto inicial
    mostrarProductosPorCategoria(categoria);
  });
});

// Obtener los productos disponibles en la tienda y mostrarlos
fetch("/productos-por-categoria?categoria=masculino") // Endpoint para obtener productos masculinos
  .then((response) => response.json())
  .then((productos) => {
    const productosContainer = document.getElementById(
      "productos-container-masculino"
    );
    const productIdSet = new Set(); // Conjunto para almacenar los IDs de productos únicos

    productos.forEach((producto) => {
      // Verificar si el ID del producto ya está en el conjunto
      if (!productIdSet.has(producto.productoID)) {
        productIdSet.add(producto.productoID); // Agregar el ID del producto al conjunto

        const productoHTML = `
                    <div class="col-lg-4 col-md-6">
                        <div class="product__item">
                            <div class="product__item__pic">
                                <img src="${producto.imagen}" alt="${producto.nombre}">
                                <div class="label new">New</div>
                                <ul class="product__hover">
                                    <li><a href="product-details.html?producto=${producto.productoID}"><span class="arrow_expand"></span></a></li>
                                 
                                    <li><a href="#" class="agregar-al-carrito" data-producto-id="${producto.productoID}"><span class="icon_bag_alt"></span></a></li>
                                </ul>
                            </div>
                            <div class="product__item__text">
                                <h6><a href="#">${producto.nombre}</a></h6>
                                <div class="product__price">$ ${producto.precio}</div>
                            </div>
                        </div>
                    </div> 
                `;

        productosContainer.innerHTML += productoHTML;
      }
    });

    // Agregar evento de clic a los botones "Agregar al carrito"
    const botonesAgregarAlCarrito = document.querySelectorAll(
      ".agregar-al-carrito"
    );
    botonesAgregarAlCarrito.forEach((boton) => {
      boton.addEventListener("click", function (event) {
        event.preventDefault(); // Evitar la acción por defecto del enlace
        const productoId = this.getAttribute("data-producto-id");
        agregarAlCarrito(productoId);
      });
    });
  })
  .catch((error) =>
    console.error("Error al obtener productos masculinos: ", error)
  );

document.addEventListener("DOMContentLoaded", function () {
  // Obtener el ID del producto del parámetro de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const productoID = urlParams.get("productoID");

  // Obtener la información del producto del servidor
  fetch(`/obtener-producto/${productoID}`)
    .then((response) => response.json())
    .then((producto) => {
      // Actualizar el nombre del producto
      document.getElementById("product-name").textContent = producto.nombre;
      // Actualizar la descripción del producto
      document.getElementById("product-description").textContent =
        producto.descripcion;
      // Actualizar el precio del producto
      document.getElementById("product-price").textContent = producto.precio;
      // Actualizar la categoría del producto
      document.getElementById(
        "product-category"
      ).textContent = `Categoría: ${producto.categoria}`;
    })
    .catch((error) => console.error("Error al obtener el producto: ", error));
});


