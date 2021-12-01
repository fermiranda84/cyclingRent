//Obtengo el usuario guardado en el SS y agrego en el html el nombre
let usuario = sessionStorage.getItem('usuario')

if (usuario !== null) {

    $('#usuarioHeader').append(`<a href="./datos.html" class="link-light"><strong>${usuario}</strong></a>`)

    const tagUsuario = $('#nombreUsuario')
    tagUsuario.addClass('fw-light mb-5')
    tagUsuario.text(`${usuario}, estas son las bicicletas de tu carrito de compras`)

}


//Parseo el carrito guardado en LS
let carrito = JSON.parse( localStorage.getItem('carrito') )

const contenedorCarrito = $('#contenedorCarrito')

//Si el resultado no es nulo, agrego al html los datos
if (carrito !== null) { 

    

    //Uso reduce para sumar el precio total de todos los items que hay en el carrito y lo agrego al HTML
    const precioTotal = carrito.reduce( (acumulador, el) => acumulador += el.precio, 0)

    //Si el precio total de los items del carrito es 0 significa que esta vacio, por lo que muestro un mensaje
    if (precioTotal == 0) {contenedorCarrito.append(`<div class="alertVacio">El carrito de compras está vacio.</div>`)}

    else {

        const contenedorPrecioTotal = $('#precioTotal')

        contenedorPrecioTotal.append(`
        <div id="total" class"col">
        <div class="row mb-2">
        <div class="col"></div>
        <div class="col-2">
        <h5 class="text-primary mt-3"><span class="text-secondary">Total: </span><b>$${precioTotal}</b></h5>
        </div>
        </div>
        <div class="col text-center"><button id="finalizarCompra" class="btn btn-lg btn-success text-white font-weight-bold mt-5">Finalizar Compra</button></div>
        </div>
        `)

        //Boton para finalizar la compra de los items
        $('#finalizarCompra').click( () => { finalizarCompra() } )

    }

    
 

    for (const item of carrito) {

        if (item.precio > 0) { //Si el precio del item es mayor que 0, lo muestro en el carrito (esto lo use para poder eliminar items del carrito y que no los agregue al HTML)

            

            contenedorCarrito.append(`
            <div id="item${item.id}" class="col">
            <div class="row mb-2">
            <div class="col">
            <h5><img id="${item.id}" src="./img/trash.png" width="25px" height="auto" alt="Eliminar"> <img src="${item.img}" width="75px" height="auto" alt="${item.nombre}"><span class="m-2"><b>${item.nombre}</b></span></h5>
            </div>
            <div class="col-2">
            <h5 class="text-success mt-3"><b>$${item.precio}</b><span class="text-secondary"> / final</span></h5>
            </div>
            </div>
            <hr class="solid">
            </div>
            `)
            

            //Creo un evento de JQuery para el icono eliminar de cada item y cuando hago click, pongo el precio en 0 y hago una animacion slideUp
            const iconoEliminar = $(`#${item.id}`)
            iconoEliminar.click(() => {

                
                Swal.fire({

                    icon: 'warning',
                    title: 'Eliminar del carrito',
                    showCancelButton: true,
                    confirmButtonText: 'Eliminar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#0dcaf0',
                    denyButtonColor: '#c7c8ca',
                    html: 'La bicicleta <b>'+item.nombre+'</b> se eliminará del carrito de compras'

                }).then((result) => {

                    if (result.isConfirmed) {

                        let itemCarrito = carrito.indexOf(item)
                        carrito[itemCarrito].precio = 0
        
                        $(`#item${item.id}`).slideUp()
        
                        //Vuelvo a calcular el precio total sin los items borrados y lo actualizo en el HTML
                        const precioTotal = carrito.reduce( (acumulador, el) => acumulador += el.precio, 0)
        
                        if (precioTotal == 0) {
        
                            contenedorCarrito.append(`<div class="alertVacio">El carrito de compras está vacio.</div>`)
                            $('#total').addClass('oculto')
        
                        }
        
                        else {
        
                            $('#total').html(`
                            <div class="row mb-2">
                            <div class="col"></div>
                            <div class="col-2">
                            <h5 class="text-primary mt-3"><span class="text-secondary">Total: </span><b>$${precioTotal}</b></h5>
                            </div>
                            </div>
                            <div class="col text-center"><button id="finalizarCompra" class="btn btn-lg btn-success text-white font-weight-bold mt-5">Finalizar Compra</button></div>
                            `)

                            //Boton para finalizar la compra de los items
                            $('#finalizarCompra').click( () => { finalizarCompra() } )
        
                        }
        
                        //Actualizo el carrito guardado en LS
                        localStorage.setItem('carrito', JSON.stringify(carrito))


                    } 
                })

        

            })


        }
        

    }


    //Funcion para implementar el checkout API de Mercado Pago
    const finalizarCompra = async () => {

        let carritoValidas = carrito.filter( (bike) => bike.precio > 0  )

        const carritoAPagar = carritoValidas.map(el => ({
                title: el.nombre,
                description: "",
                picture_url: "",
                category_id: el.id,
                quantity: 1,
                currency_id: "ARS",
                unit_price: el.precio
        }))


        const resp = await fetch('https://api.mercadopago.com/checkout/preferences', 
        {
            method: "POST",
            headers: {
                Authorization: "Bearer TEST-2329233790661670-091600-d15cf1096f2982c75ba7ad77e66eafcf-359670125"
            },
            body: JSON.stringify({
                items: carritoAPagar,
                back_urls: {
                    success: 'http://127.0.0.1:5500/finalFernandoMiranda/index.html',
                    failure: 'http://127.0.0.1:5500/finalFernandoMiranda/index.html'
                }
            })
        })

        const data = await resp.json()

        //Vacio el carrito y lo guardo en LS para que no me siga mostrando los items que ya compre
        carrito = []
        localStorage.setItem('carrito', JSON.stringify(carrito))

        window.location.replace(data.init_point)
    }



}



//Si no hay items guarados en el carrito, muestro un mensaje en el html
else { 

    contenedorCarrito.append(`<div class="alertVacio">El carrito de compras está vacio.</div>`)

}