// Función para registrar un nuevo usuario
function registrarUsuario() {
  // Obtener los datos del formulario
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  const correo = document.getElementById("correo").value;
  const contraseña = document.getElementById("contraseña").value;
  const confirmarContraseña = document.getElementById("confirmarContraseña").value;

  // Verificar si la contraseña coincide con la confirmación de la contraseña
  if (contraseña !== confirmarContraseña) {
      alert("Las contraseñas no coinciden");
      return false; // Evitar que el formulario se envíe si las contraseñas no coinciden
  }

  // Enviar los datos al servidor
  const data = { nombre, apellido, correo, contraseña };
  fetch("/registro", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  })
      .then((response) => response.text())
      .then((message) => {
          // Manejar la respuesta del servidor
          alert(message);
          // Redireccionar al usuario a la página de inicio si el registro fue exitoso
          if (message === "Usuario registrado correctamente") {
              window.location.href = "/index.html"; // Redirigir al usuario al index.html
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
  fetch("/get-productos")
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
        const userLink = document.getElementById("userLink"); // Agregamos referencia al enlace del dashboard
        const accountOptions = document.getElementById("accountOptions");
        const logoutLink = document.getElementById("logoutLink");
  
        if (data.loggedin) {
          authSection.innerHTML = '<a href="/cerrarSesion">Cerrar sesión</a>';
          if (data.rol !== null && data.rol === 2) {
            adminLink.removeAttribute("hidden");
            userLink.removeAttribute("hidden"); // Mostramos el enlace del dashboard si el usuario tiene rol de administrador
          } else {
            adminLink.setAttribute("hidden", "true");
            userLink.setAttribute("hidden", "true"); // Ocultamos el enlace del dashboard si el usuario no tiene rol de administrador
          }
          accountOptions.style.display = "block"; // Mostrar las opciones de cuenta
          logoutLink.style.display = "block"; // Mostrar el enlace de cerrar sesión
        } else {
          authSection.innerHTML =
            '<a href="./inicio.html">Iniciar sesión</a> <a href="./registro.html">Registrarse</a>';
          adminLink.setAttribute("hidden", "true");
          userLink.setAttribute("hidden", "true"); // Ocultamos el enlace del dashboard si el usuario no está autenticado
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
  window.location.href = "/admin.html";
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

















const roles = {
    1: 'Cliente',
    2: 'Admin',
    3: 'Repartidor'
};

document.addEventListener('DOMContentLoaded', function() {
    const tablaUsuarios = document.getElementById('tabla-usuarios');

    tablaUsuarios.addEventListener('click', function(event) {
        if (event.target.classList.contains('btn-modificar')) {
            const userID = obtenerUserIDDesdeBoton(event);
            cargarDatosUsuario(userID);
        }
    });
    // Realizar una solicitud al servidor para obtener la lista de usuarios
    fetch('/obtener-usuarios')
        .then(response => response.json())
        .then(usuarios => {
            // Generar dinámicamente las filas de la tabla con los datos de los usuarios
            usuarios.forEach(usuario => {
                const filaUsuario = `
                    <tr>
                        <th scope="row">${usuario.userID}</th>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.apellido}</td>
                        <td>${usuario.correo}</td>
                        <td>${roles[usuario.rol]}</td>
                        <td>
                     
                        <button class="btn btn-primary btn-sm btn-modificar" data-userid="${usuario.userID}">Modificar</button>


                            <button class="btn btn-danger btn-sm" onclick="confirmarEliminar(${usuario.userID})">Eliminar</button>
                        </td>
                    </tr>
                `;
                tablaUsuarios.innerHTML += filaUsuario;
            });
        })
        .catch(error => console.error('Error al obtener la lista de usuarios:', error));
});













// Función para confirmar la eliminación de un usuario
function confirmarEliminar(userID) {
  if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      eliminarUsuario(userID);
  }
}

// Función para eliminar un usuario
function eliminarUsuario(userID) {
  fetch(`/eliminar-usuario/${userID}`, { method: 'DELETE' })
      .then(response => {
          if (response.ok) {
              // Eliminación exitosa, recargar la página para actualizar la tabla
              location.reload();
          } else {
              console.error('Error al eliminar el usuario');
          }
      })
      .catch(error => console.error('Error al eliminar el usuario:', error));
}

// Función para redirigir a la página de agregar usuario
function agregarUsuarioVista() {
  window.location.href = '/agregarUsuario';
}

// Función para redirigir a la página de modificar usuario
function modificarUsuario() {
  window.location.href = `/modificarUsuario`;
}
// Función para eliminar un usuario
function eliminarUsuario(userID) {
  // Mostrar un mensaje de confirmación
  if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      // Realizar una solicitud al servidor para eliminar el usuario con el userID especificado
      fetch(`/eliminarUsuario?userID=${userID}`, { method: 'DELETE' })
          .then(response => {
              if (response.ok) {
                  console.log('Usuario eliminado correctamente');
                  // Recargar la página después de eliminar el usuario
                  window.location.reload();
              } else {
                  console.error('Error al eliminar el usuario');
              }
          })
          .catch(error => console.error('Error al eliminar el usuario:', error));
  }
}
function redirectUsuarios() {
  window.location.href = '/users'; // Cambia '/usuarios' por la ruta correcta de tu página de usuarios
}






function agregarUsuario() {
  // Obtener los valores de los campos de entrada
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const correo = document.getElementById('correo').value;
  const contraseña = document.getElementById('contraseña').value;
  const rol = document.getElementById('rol').value;

  // Crear un objeto con los datos del usuario
  const datosUsuario = {
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      contraseña: contraseña,
      rol: rol
  };

  // Enviar una solicitud POST al servidor para agregar el nuevo usuario
  fetch("/agregarUsuario", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(datosUsuario)
  })
  .then(response => response.text())
  .then(result => {
      console.log(result); // Imprimir mensaje de respuesta del servidor en la consola
      // Aquí puedes agregar cualquier lógica adicional después de agregar el usuario, si es necesario
  })
  .catch(error => console.error('Error al agregar usuario:', error));
}







// Realizar una solicitud al servidor para obtener los datos de facturación
fetch('/obtener-facturacion')
    .then(response => response.json())
    .then(facturaciones => {
        const tablaRepartidor = document.getElementById('tabla-repartidor');
        facturaciones.forEach(facturacion => {
            const estado = obtenerEstado(facturacion.estado); // Traducir el estado numérico a texto
            const filaRepartidor = `
                <tr>
                    <th scope="row">${facturacion.facturaID}</th>
                    <td>${facturacion.nombre}</td>
                    <td>${facturacion.apellido}</td>
                    <td>${facturacion.provincia}</td>
                    <td>${facturacion.canton}</td>
                    <td>${facturacion.distrito}, ${facturacion.direccion}</td>
                    <td>${facturacion.telefono}</td>
                    <td>${facturacion.correo}</td>
                    <td>${estado}</td> <!-- Mostrar el estado traducido -->
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="realizarEnvio('${facturacion.facturaID}')">Realizar Envío</button>
                        <button class="btn btn-success btn-sm" onclick="marcarEntregado(${facturacion.facturaID})">Entregado</button>
                    </td>
                </tr>
            `;
            tablaRepartidor.innerHTML += filaRepartidor;
        });
    })
    .catch(error => console.error('Error al obtener los datos de facturación:', error));

// Función para traducir el estado numérico a texto
function obtenerEstado(estadoNum) {
    switch (estadoNum) {
        case 1:
            return "Recibido";
        case 2:
            return "Pendiente";
        case 3:
            return "En camino";
        default:
            return "Desconocido";
    }
}




// Realizar una solicitud al servidor para obtener los datos de facturación
fetch('/obtener-facturacion')
    .then(response => response.json())
    .then(facturaciones => {
        const tablaPedidoRealizado = document.getElementById('tabla-pedidoRealizado');
        facturaciones.forEach(facturacion => {
            const estado = obtenerEstado(facturacion.estado); // Traducir el estado numérico a texto
            const filaPedidoRealizado = `
                <tr>
                    <th scope="row">${facturacion.facturaID}</th>
                    <td>${facturacion.nombre}</td>
                    <td>${facturacion.apellido}</td>
                    <td>${facturacion.provincia}</td>
                    <td>${facturacion.canton}</td>
                    <td>${facturacion.distrito}, ${facturacion.direccion}</td>
                    <td>${facturacion.telefono}</td>
                    <td>${facturacion.correo}</td>
                    <td>${estado}</td> <!-- Mostrar el estado traducido -->
                    <td>
                        ${generarBotones(facturacion.estado)}
                    </td>
                </tr>
            `;
            tablaPedidoRealizado.innerHTML += filaPedidoRealizado;
        });
    })
    .catch(error => console.error('Error al obtener los datos de facturación:', error));

// Función para traducir el estado numérico a texto
function obtenerEstado(estadoNum) {
    switch (estadoNum) {
        case 1:
            return "Recibido";
        case 2:
            return "Pendiente";
        case 3:
            return "En camino";
        default:
            return "Desconocido";
    }
}

// Función para generar los botones según el estado de la factura
function generarBotones(estado) {
    switch (estado) {
        case 1: // Recibido
            return ``;
        case 3: // En camino
            return `<button class="btn btn-info btn-sm" onclick="verDetallePedido()">Ver Detalle</button>`;
        default:
            return ''; // No se muestran botones para otros estados
    }
}

function verDetallePedido() {
  // Redirigir al usuario a la vista de detallePedido
  window.location.href = '/detallePedido';
}













// Función para marcar como entregado y eliminar el registro de la base de datos
function marcarEntregado(facturaID) {
  // Realizar una solicitud DELETE al servidor para eliminar la factura por su ID
  fetch(`/eliminar-facturacion/${facturaID}`, {
      method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
      console.log(data.message);
      // Actualizar la interfaz o hacer cualquier otra acción necesaria después de eliminar el registro
  })
  .catch(error => console.error('Error al eliminar la factura:', error));
}


function realizarEnvio(facturaID) {
  // Realizar una solicitud al servidor para obtener los datos de la factura seleccionada
  fetch(`/obtener-factura/${facturaID}`)
      .then(response => response.json())
      .then(facturacion => {
        // Almacenar los datos de la factura en el almacenamiento local
        localStorage.setItem('facturacionSeleccionada', JSON.stringify(facturacion));
  
        // Redirigir a la vista de pedido
        window.location.href = '/pedido';

        // Llenar los campos con los datos de la factura recibidos del servidor
        const informacionContacto = document.getElementById('informacion-contacto');
        informacionContacto.innerHTML = `
            <h5>Información de Contacto</h5>
            <ul>
                <li>
                    <h6><i class="fa fa-map-marker"></i> Cliente</h6>
                    <p>${facturacion.nombre} ${facturacion.apellido}</p>
                </li>
                <li>
                    <h6><i class="fa fa-map-marker"></i> Provincia</h6>
                    <p>${facturacion.provincia}</p>
                </li>
                <li>
                    <h6><i class="fa fa-map-marker"></i> Canton</h6>
                    <p>${facturacion.canton}</p>
                </li>
                <li>
                    <h6><i class="fa fa-map-marker"></i> Distrito</h6>
                    <p>${facturacion.distrito}</p>
                </li>
                <li>
                    <h6><i class="fa fa-map-marker"></i> Dirección</h6>
                    <p>${facturacion.direccion}</p>
                </li>
                <li>
                    <h6><i class="fa fa-phone"></i> Teléfono</h6>
                    <p><span>${facturacion.telefono}</span></p>
                </li>
                <li>
                    <h6><i class="fa fa-headphones"></i> Correo Electrónico</h6>
                    <p>${facturacion.correo}</p>
                </li>
            </ul>
        `;
      })
      .catch(error => console.error('Error al obtener los datos de la factura:', error));
}
