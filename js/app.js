const localStorageKey = "ListaCarrito";

class Componente {
    constructor(tipoComponente, socaloMicro, socaloDisco, socaloRam) {
        this.tipoComponente = tipoComponente.toUpperCase();
        this.socaloMicro = socaloMicro;
        this.socaloDisco = socaloDisco;
        this.socaloRam = socaloRam;
    }
}

class Producto {
    constructor(id, tipoItem, marca, modelo, precio, stock, img, componente) {
        this.id = id;
        this.tipoItem = tipoItem;
        this.marca = marca.toUpperCase();
        this.modelo = modelo.toUpperCase();
        this.precio = parseFloat(precio);
        this.stock = parseInt(stock);
        this.cantidadSeleccionados = 1;
        this.img = img;
        this.componente = componente;
    }

    descripcionCarrito() {
        return `<div class="card mb-3" style="max-width: 540px;">
        <div class="row g-0">
            <div class="col-md-4">
                <img src="${this.img}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <p class="card-text">Item: ${this.tipoItem}</p>
                    <h5 class="card-title">${this.marca}  ${this.modelo}</h5>
                    <p class="card-text">Cantidad: ${this.cantidadSeleccionados}</p>
                    <p class="card-text">Precio: $${this.precio}</p>
                </div>
            </div>
        </div>
    </div>`
    }

    descripcionProducto() {
        return `<div class="card" style="width: 15rem;">
        <img src="${this.img}" class="card-img-top" alt="...">
        <div class="card-body">
        <h5 class="card-title">${this.marca}  ${this.modelo}</h5>
        <p class="card-text">Precio: $${this.precio}</p>
        <button class="btn btn-primary" id= "ap-${this.id}">Añadir al Carrito</button>
        </div>
        </div>`
    }
}

class Microprocesador {
    constructor(socket, graficaIntegrada) {

        this.socket = socket;
        this.graficaIntegrada = graficaIntegrada;
    }
}

class PlacaMadre {
    constructor(socket, tipoRam, cantidadModulosRam, tipoDisco, cantidadDisco, tamaño) {

        this.socket = socket;
        this.tipoRam = tipoRam;
        this.cantidadModulosRam = cantidadModulosRam;
        this.tipoDisco = tipoDisco;
        this.cantidadDisco = cantidadDisco;
        this.tamaño = tamaño;
    }
}

class Disco {
    constructor(tipo, conexion, capacidad, tamaño) {

        this.tipo = tipo;
        this.conexion = conexion;
        this.capacidad = capacidad;
        this.tamaño = tamaño;
    }
}

class MemoriaRam {
    constructor(tipo, capacidad, frecuencia) {

        this.tipo = tipo;
        this.capacidad = capacidad;
        this.frecuencia = frecuencia;
    }
}

class Fuente {
    constructor(tipo, potencia, modular, certificacion) {

        this.tipo = tipo;
        this.potencia = potencia;
        this.modular = modular;
        this.certificacion = certificacion;
    }
}

class Gabinete {
    constructor(tamañoMaximo, capacidadDiscosSSD, capacidadDiscosHDD, capacidadCoolers, coolersIncluidos) {

        this.tamañoMaximo = tamañoMaximo;
        this.capacidadDiscosSSD = capacidadDiscosSSD;
        this.capacidadDiscosHDD = capacidadDiscosHDD;
        this.capacidadCoolers = capacidadCoolers;
        this.coolersIncluidos = coolersIncluidos;
    }
}

class Carrito {
    constructor() {
        this.listaCarrito = [];
        this.total = 0;
    }

    agregar(producto) {
        if (producto instanceof Producto) {
            this.listaCarrito.push(producto);
        }
        this.calcularTotal();
    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito);
        localStorage.setItem(localStorageKey, listaCarritoJSON);
    }

    recuperarStorage() {
        let CarritoJSON = localStorage.getItem(localStorageKey);
        let listaCarritoJS = JSON.parse(CarritoJSON);
        let listaAux = [];

        if (listaCarritoJS !== null) {
            listaCarritoJS.forEach(producto => {
                let nuevoProducto = new Producto(producto.id, producto.tipoItem, producto.marca, producto.modelo, producto.precio, producto.stock, producto.img)
                listaAux.push(nuevoProducto);
            })
        }

        this.listaCarrito = listaAux;
        carrito.calcularTotal();
        carrito.mostrarTotal();
    }

    mostrarProducto() {
        let contenedor_carrito = document.getElementById("contenedor_carrito");
        contenedor_carrito.innerHTML = ``;
        this.listaCarrito.forEach(producto => {
            contenedor_carrito.innerHTML += producto.descripcionCarrito();
        });
    }

    vaciarCarrito() {
        let btnLimpiarCarrito = document.getElementById("limpiar_carrito");
        btnLimpiarCarrito.addEventListener("click", () => {
            this.listaCarrito = [];
            this.guardarEnStorage();
            this.mostrarProducto();
            this.total = 0;
            this.mostrarTotal();
        })
    }

    calcularTotal() {
        let acc = 0;

        this.listaCarrito.forEach(producto => {
            acc += producto.precio;
        })
        this.total = acc;
    }

    mostrarTotal() {
        let mostrarTotal = document.getElementById("calcular_total");
        mostrarTotal.innerHTML = this.total;
    }

    mostrarFinalizarCompra() {
        let finalizarCompra = document.getElementById("finalizar_compra");
        finalizarCompra.addEventListener("click", ()=>{
            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: 'btn btn-success',
                    cancelButton: 'btn btn-danger'
                },
                buttonsStyling: false
            })
    
            swalWithBootstrapButtons.fire({
                title: 'Finalizar Compra?',
                text: "Se direccionara al formulario de Pago",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'No, Seguir Comprando',
                cancelButtonText: 'Si, Ir a Pagar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    swalWithBootstrapButtons.fire(
                        'Puedes Seguir Comprando',
                        'Tu carrito sigue ahi',
                        'success'
                    )
                } else if (
                    /* Read more about handling dismissals below */
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(
                        'Error',
                        'Todavia no se Programo esto :(',
                        'error'
                    )
                }
            })
        })
        
    }
}



const listaMicros = [];

listaMicros.push(new Producto(1, "Microporcesador", "AMD", "Ryzen 3 3200G", 89000, 5, "images/micro-ryzen3-3200g-8843.jpg", new Microprocesador("AM4", true)));
listaMicros.push(new Producto(2, "Microporcesador", "AMD", "Ryzen 5 5600G", 126000, 5, "images/ryzen-5-5600g-440ghz-1948.jpg", new Microprocesador("AM4", true)));
listaMicros.push(new Producto(3, "Microporcesador", "AMD", "Ryzen 7 5700G", 189000, 5, "images/amd-ryzen-7-5700g-01-2356.jpg", new Microprocesador("AM4", true)));

const listaPlacasMadre = [];

listaPlacasMadre.push(new Producto(4, "placa Madre", "MSI", "A320M", 49000, 5, "images/mother-msi-a320ma-pro-0.jpg", new PlacaMadre("AM4", "DDR4", 2, "SATA", 4, "MicroATX")));
listaPlacasMadre.push(new Producto(5, "Placa Madre", "Gigabyte", "A520M", 63000, 5, "images/mother-gigabyte-a520m-k-v2-ddr4-am4-0.jpg", new PlacaMadre("AM4", "DDR4", 2, "SATA", 4, "MicroATX")));
listaPlacasMadre.push(new Producto(6, "Placa Madre", "Gigabyte", "B550M", 89000, 5, "images/mother-gigabyte-b550m-ds3h-0.jpg", new PlacaMadre("AM4", "DDR4", 4, "SATA", 4, "MiniATX")));

const listaDiscos = [];

listaDiscos.push(new Producto(7, "Disco", "Kingston", "A400 240GB", 13000, 5, "images/hd-ssd-240gb-kingston-a400-sata-iii-25-0.jpg", new Disco("SSD", "SATA", "240GB", "2.5")));
listaDiscos.push(new Producto(8, "Disco", "Kingston", "A400 480GB", 19000, 5, "images/hd-ssd-480gb-kingston-a400-sata-iii-25-0.jpg", new Disco("SSD", "SATA", "480GB", "2.5")));
listaDiscos.push(new Producto(9, "Disco", "Kingston", "A400 960GB", 37000, 5, "images/hd-ssd-960gb-kingston-a400-sata-iii-25-0.jpg", new Disco("SSD", "SATA", "480GB", "2.5")));

const listaMemorias = [];

listaMemorias.push(new Producto(10, "MemoriaRam", "Crucial", "8GB 2666mhz", 15000, 5, "images/memoria-8gb-ddr4-2666-crucial-0.jpg", new MemoriaRam("DDR4", "8GB", "2666mhz")));
listaMemorias.push(new Producto(11, "MemoriaRam", "Kingston", "Fury Beast 8GB 3200mhz", 19000, 5, "images/memoria-8gb-ddr4-2666-kingston-fury-beast-0.jpg", new MemoriaRam("DDR4", "8GB", "3200mhz")));
listaMemorias.push(new Producto(12, "MemoriaRam", "Hyper X", "Fury RGB 16GB 3200mhz", 33000, 5, "images/memoria-8gb-ddr4-3200-kingston-fury-beast-white-rgb-0.jpg", new MemoriaRam("DDR4", "16GB", "3200mhz")));

const listaFuentes = [];

listaFuentes.push(new Producto(13, "Fuente", "Gigabyte", "650W", 35000, 5, "images/1078-producto-fuente-gigabyte-p650b-650w-80-plus-bronze-black-pngp-p650b1-8105.jpg", new Fuente("ATX", "650W", false, "bronze")));
listaFuentes.push(new Producto(14, "Fuente", "Gigabyte", "750W", 48000, 5, "images/fuente-750w-gigabyte-p750gm-80-plus-gold-modular-0.jpg", new Fuente("ATX", "750W", false, "bronze")));
listaFuentes.push(new Producto(15, "Fuente", "Gigabyte", "850W", 56000, 5, "images/fuente-850w-gigabyte-p850gm-80-plus-gold-modular-0.jpg", new Fuente("ATX", "850W", false, "bronze")));

const listaGabinetes = [];

listaGabinetes.push(new Producto(16, "Gabinete", "Performance", "ATX", 31000, 5, "images/gabinete2801Performance.jpg", new Gabinete("ATX", 1, 2, 1, 0)));
listaGabinetes.push(new Producto(17, "Gabinete", "Gamemax", "Nova N5", 37000, 5, "images/gabinete-gamemax-nova-n5-1-fan-rgb-0.jpg", new Gabinete("ATX", 2, 2, 4, 1)));
listaGabinetes.push(new Producto(18, "Gabinete", "Thermaltake", "N200", 58000, 5, "images/gabinete-thermaltake-h570-tg-3-fan-argb-mesh-snow-white-0.jpg", new Gabinete("ATX", 2, 3, 6, 3)));


const contenedor_micros = document.getElementById("contenedor_microprocesadores");
const contenedor_placasmadre = document.getElementById("contenedor_placasmadre");
const contenedor_discos = document.getElementById("contenedor_discos");
const contenedor_memorias = document.getElementById("contenedor_memorias");
const contenedor_fuentes = document.getElementById("contenedor_fuentes");
const contenedor_gabinetes = document.getElementById("contenedor_gabinetes");

function mostrarProductos(arrayProducto, contenedor) {
    arrayProducto.forEach(producto => {
        contenedor.innerHTML += producto.descripcionProducto();
    });

    arrayProducto.forEach(producto => {
        const btn_ap = document.getElementById(`ap-${producto.id}`)

        btn_ap.addEventListener("click", () => {
            carrito.agregar(producto);
            carrito.guardarEnStorage();
            carrito.mostrarProducto();
            carrito.calcularTotal();
            carrito.mostrarTotal();
        })
    });
}

const carrito = new Carrito();
carrito.mostrarTotal();

carrito.recuperarStorage();
carrito.mostrarProducto();


mostrarProductos(listaMicros, contenedor_microprocesadores);
mostrarProductos(listaPlacasMadre, contenedor_placasmadre);
mostrarProductos(listaDiscos, contenedor_discos);
mostrarProductos(listaMemorias, contenedor_memorias);
mostrarProductos(listaFuentes, contenedor_fuentes);
mostrarProductos(listaGabinetes, contenedor_gabinetes);

carrito.vaciarCarrito();
carrito.mostrarFinalizarCompra();

