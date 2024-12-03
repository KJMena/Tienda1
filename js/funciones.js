const app = Vue.createApp({
    data() {
        return {
            productos: [],
            categorias: [],
            categoriaSeleccionada: "",
            terminoBusqueda: "",
        };
    },
    computed: {
        productosFiltrados() {
            let filtrados = this.productos;

            if (this.terminoBusqueda) {
                const termino = this.terminoBusqueda.toLowerCase();
                filtrados = filtrados.filter(producto =>
                    producto.title.toLowerCase().includes(termino)
                );
            }

            if (this.categoriaSeleccionada) {
                filtrados = filtrados.filter(producto =>
                    producto.category === this.categoriaSeleccionada
                );
            }

            return filtrados;
        },
        porcentajeProgreso() {
            return Math.round((this.productosFiltrados.length / this.productos.length) * 100);
        },
        color() {
            return {
                'bg-danger': this.porcentajeProgreso <= 35,
                'bg-warning': this.porcentajeProgreso >= 35 && this.porcentajeProgreso <= 75,
                'bg-success': this.porcentajeProgreso > 75
            }
        }
    },
    methods: {
        aumentarCantidad(producto) {
            if (producto.cantidad < 10) {
                producto.cantidad++;
            }
        },
        disminuirCantidad(producto) {
            if (producto.cantidad > 1) {
                producto.cantidad--;
            }
        },
        cargarProductos() {
            axios.get("https://dummyjson.com/products")
                .then(respuesta => {
                    this.productos = respuesta.data.products.map(producto => ({
                        ...producto,
                        cantidad: 1,
                    }));
                    this.categorias = [...new Set(this.productos.map(producto => producto.category))];
                })
                .catch(error => {
                    console.error("Error al cargar los productos:", error);
                });
        },
    },
    created() {
        this.cargarProductos();
    },
});

app.mount("#contenedor");