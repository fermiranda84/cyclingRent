//Creo la clase cliente con un constructor para los datos de la persona
class Cliente {

    constructor (id, nombre, actividad, edad, altura, tiempo, extras, descuento, tipo, rodado) {
        this.id = id
        this.nombre = nombre
        this.actividad = actividad
        this.edad = edad
        this.altura = altura
        this.tiempo = tiempo
        this.extras = extras
        this.descuento = descuento
        this.tipo = tipo
        this.rodado = rodado
    }

    //Metodo para determinar que tipo de bici quiere el cliente
    determinarBici() {

        switch (this.actividad) {

            case 'paseo':
                this.tipo = 'paseo'
                break
    
            case 'montañismo':
                this.tipo = 'mtb'
                break
    
            case 'ruta':
                this.tipo = 'ruta'
                break
    
            default:
                this.tipo = 'indeterminada'
                break
    
        }

    }

    //Metodo para determinar que rodado necesita el cliente
    determinarRodado() {

        if(this.edad <= 10 && this.altura <= 160) { this.rodado = 12 }

        else if( (this.edad > 10 && this.altura <= 160) || (this.edad <= 10 && this.altura > 160) ) { this.rodado = 26 }

        else if(this.edad > 10 && this.altura > 160) { this.rodado = 29 }

        else {
            this.rodado = 'indeterminado'
        }

    }


    valorExtras() {

        switch (this.extras) {
            case "SI": this.extras = 50
            break
        
            case "NO": this.extras = 0
            break
        
            default: this.extras = 0
            break
        }

    }

}



//Obtengo con JQuery las etiquetas HTML que voy a usar
const contenedor = $('#contenedor')
const contenedorFiltradas = $('#contenedor-filtradas')
const tituloFiltradas = $('#titulo-filtradas')
const contenedorDatosGuardados = $('#contenedorDatosGuardados')



//Funcion para agregar todo el stock de bicis a la pagina principal
const agregarStock = (clienteTiempo, clienteExtras, clienteDescuento) => {

    //Obtengo con fetch el stock de bicis (es propio pero esta subido a un servidor para no tener problemas de cors)
    fetch('https://www.biciregistro.com.ar/stockBicis.json')
        .then((respuesta) => respuesta.json())
        .then((data) => {

    
            for (const stockBicis of data) {

                      
                contenedor.append(`
                <div id="idCard${stockBicis.id}" class="col">
                <div id="idRecuadro${stockBicis.id}" class="card shadow-sm">
                <img src="${stockBicis.img}" width="100%" height="auto" alt="${stockBicis.nombre}">
                <div class="card-body">
                <h5><b>${stockBicis.nombre}</b><span class="text-secondary"> ${stockBicis.tipo}, rodado ${stockBicis.rodado}</span></h5>
                <h5 class="text-success mt-3"><b>$${stockBicis.precio}</b><span class="text-secondary"> / minuto</span></h5>
                <button id="${stockBicis.id}" class="btn btn-success btn-sm">Agregar al Carrito</button>
                </div>
                </div>
                </div>
                `)


                //Funcion que uso para manejar los modal al hacer click en agregar carrito
                const abrirModalAgregado = () => {

                    Swal.fire({
                        icon: 'success',
                        title: 'Agregada al carrito',
                        confirmButtonColor: '#0dcaf0',
                        html: 'La bicicleta <b>'+stockBicis.nombre+'</b> se agregó a tu carrito de compras'
                      })
                        
        
                }
        


                const botonCarrito = $(`#${stockBicis.id}`)
                botonCarrito.click(() => {


                    //Determino si el item que se quiere agregar exite en el carrito o no
                    let itemExiste = carritoDeCompras.find ( (itemLS) => itemLS.id === stockBicis.id )

                    stockBicis.precio *= clienteTiempo
                    stockBicis.precio += clienteExtras
                    stockBicis.precio -= (stockBicis.precio * clienteDescuento) / 100

                    
                    
                    
                    if (itemExiste === undefined) { //si el item no existe en el carrito lo agrego y actualizo el numero que indica la cantiad de items que agregue
                

                        carritoDeCompras.push(stockBicis) 
                        localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))

                        const cantidadCarrito = carritoDeCompras.filter( (bike) => bike.precio > 0  ).length
                        $('#cantidadCarrito').text(cantidadCarrito)
                        $('#cantidadCarritoBody').text(cantidadCarrito + ' ítems')

                        abrirModalAgregado()
                                

                    }


                    else if (itemExiste.precio == 0) { //si el item fue borrado del carrito anteriormente, lo vuelvo a agregar

                        //Si el usuario hace click en agregar al carrito, lo agrego y muestro el modal de operacion realizada 
                        itemExiste.precio = stockBicis.precio
                        localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))

                        const cantidadCarrito = carritoDeCompras.filter( (bike) => bike.precio > 0  ).length
                        $('#cantidadCarrito').text(cantidadCarrito)
                        $('#cantidadCarritoBody').text(cantidadCarrito + ' ítems')

                        abrirModalAgregado()
                        
                    }


                    //Si el item ya esta en el carrito, muestro un aviso
                    else { 

                        Swal.fire({
                            icon: 'error',
                            title: 'No se agregó al carrito',
                            confirmButtonColor: '#0dcaf0',
                            html: 'La bicicleta <b>'+itemExiste.nombre+'</b> ya se encuentra en tu carrito de compras'
                        })     
                        
                    } 


                })


                //Agrego eventos para cuando paso el mouse por encima del item me lo marque con un recuadro
                const recuadroItem = $(`#idRecuadro${stockBicis.id}`)

                recuadroItem.mouseover(() => {
                    recuadroItem.addClass('recuadro-activo')
                })

                recuadroItem.mouseleave(() => {
                    recuadroItem.removeClass('recuadro-activo')
                })
            


            }

        })

}


//Chequeo si existen datos del usuario guardados previamente
let usuario = sessionStorage.getItem('usuario')
let datosUsuario = JSON.parse(localStorage.getItem('datos'))


//Defino variables globales para los datos del usuario
let actividad
let edad
let altura
let tiempo
let extras
let descuento


//Funciones de SweetAlert para ir mostrando al usuario a medida que avanza ingresando datos.
const sweetAlertActividad = (usuario) => {


    Swal.fire({
        title: usuario,
        allowOutsideClick: false,
        input: 'select',
        inputOptions: {
            'paseo': 'Paseo por la ciudad',
            'montañismo': 'Ciclismo de Montaña',
            'ruta': 'Ciclismo de Ruta'
             },
        inputLabel: 'Por favor indicanos cual es tu actividad favorita',
        imageUrl: './img/actividad-01.png',
        imageWidth: '75%',
        imageAlt: 'Custom image',
        inputPlaceholder: 'Elegí tu actividad',
        confirmButtonText: 'Siguiente',
        confirmButtonColor: '#0dcaf0',
        showClass: {popup: 'animate__animated animate__fadeInRight animate__faster'},
        hideClass: {popup: 'animate__animated animate__fadeOutLeft animate__faster'},
        inputValidator: (value) => {
            if (!value) {
              return 'Por favor, elegí una actividad'
            }
          }
        
    }).then((resultActividad) => {
      
        if (resultActividad.isConfirmed) { 
            
            actividad = resultActividad.value

            sweetAlertEdad(usuario)

        }

    })


}




const sweetAlertEdad = (usuario) => {


    Swal.fire({
        title: 'Edad',
        allowOutsideClick: false,
        input: 'range',
        inputLabel: 'Que edad tenés?',
        inputAttributes: {
            min: 1,
            max: 120,
            step: 1
        },
        inputValue: 1,
        imageUrl: './img/edad-02.png',
        imageWidth: '75%',
        imageAlt: 'Edad',
        confirmButtonText: 'Siguiente',
        confirmButtonColor: '#0dcaf0',
        showDenyButton: true,
        denyButtonColor: '#c7c8ca',
        denyButtonText: 'Anterior',
        showClass: {popup: 'animate__animated animate__fadeInRight animate__faster'},
        hideClass: {popup: 'animate__animated animate__fadeOutLeft animate__faster'}
        
    }).then((resultEdad) => {
      
        if (resultEdad.isConfirmed) { 
            
            edad = resultEdad.value

            sweetAlertAltura(usuario)
            

        }

        else if (resultEdad.isDenied) { sweetAlertActividad(usuario) }

    })


}




const sweetAlertAltura = (usuario) => {


    Swal.fire({
        title: 'Altura',
        allowOutsideClick: false,
        input: 'range',
        inputLabel: 'Indicanos tu altura en centímetros',
        inputAttributes: {
            min: 50,
            max: 240,
            step: 1
        },
        inputValue: 50,
        imageUrl: './img/altura-03.png',
        imageWidth: '75%',
        imageAlt: 'Altura',
        confirmButtonText: 'Siguiente',
        confirmButtonColor: '#0dcaf0',
        showDenyButton: true,
        denyButtonColor: '#c7c8ca',
        denyButtonText: 'Anterior',
        showClass: {popup: 'animate__animated animate__fadeInRight animate__faster'},
        hideClass: {popup: 'animate__animated animate__fadeOutLeft animate__faster'}
        
    }).then((resultAltura) => {
      
        if (resultAltura.isConfirmed) { 
            
            altura = resultAltura.value

            sweetAlertTiempo(usuario)

        }

        else if (resultAltura.isDenied) { sweetAlertEdad(usuario) }

    })


}




const sweetAlertTiempo = (usuario) => {


    Swal.fire({
        title: 'Tiempo',
        allowOutsideClick: false,
        input: 'range',
        inputLabel: 'Cuanto tiempo necesitas usar la bici? (en minutos)',
        inputAttributes: {
            min: 10,
            max: 3600,
            step: 10
        },
        inputValue: 10,
        imageUrl: './img/tiempo-04.png',
        imageWidth: '75%',
        imageAlt: 'Tiempo',
        confirmButtonText: 'Siguiente',
        confirmButtonColor: '#0dcaf0',
        showDenyButton: true,
        denyButtonColor: '#c7c8ca',
        denyButtonText: 'Anterior',
        showClass: {popup: 'animate__animated animate__fadeInRight animate__faster'},
        hideClass: {popup: 'animate__animated animate__fadeOutLeft animate__faster'}
        
    }).then((resultTiempo) => {
      
        if (resultTiempo.isConfirmed) { 
            
            tiempo = resultTiempo.value

            sweetAlertExtras(usuario)

        }

        else if (resultTiempo.isDenied) { sweetAlertAltura(usuario) }

    })


}



const sweetAlertExtras = (usuario) => {


    Swal.fire({
        title: 'Extras',
        html: 'Necesitas casco, luces e inflador? (tiene un costo de $50)',
        allowOutsideClick: false,
        input: 'radio',
        inputOptions: {
            'SI': 'Si, por favor',
            'NO': 'No, ya tengo'
             },
        inputValidator: (value) => {
          if (!value) {
            return 'Por favor, indicá una opción'
          }
        },
        imageUrl: './img/extras-05.png',
        imageWidth: '75%',
        imageAlt: 'Extras',
        confirmButtonText: 'Siguiente',
        confirmButtonColor: '#0dcaf0',
        showDenyButton: true,
        denyButtonColor: '#c7c8ca',
        denyButtonText: 'Anterior',
        showClass: {popup: 'animate__animated animate__fadeInRight animate__faster'},
        hideClass: {popup: 'animate__animated animate__fadeOutLeft animate__faster'}
        
    }).then((resultExtras) => {
      
        if (resultExtras.isConfirmed) { 
            
            extras = resultExtras.value

            sweetAlertDescuento(usuario)

        }

        else if (resultExtras.isDenied) { sweetAlertTiempo(usuario) }

    })


}



const sweetAlertDescuento = (usuario) => {


    Swal.fire({
        title: 'Cupón de descuento',
        allowOutsideClick: false,
        input: 'select',
        inputLabel: 'Indicanos que descuento obtuviste',
        inputOptions: {
            '25': '25% de descuento',
            '30': '30% de descuento',
            '35': '35% de descuento',
            '40': '40% de descuento',
            '45': '45% de descuento',
            '50': '50% de descuento',
        },
        inputValidator: (value) => {
          if (!value) {
            return 'Por favor, indicá tu descuento'
          }
        },
        imageUrl: './img/descuento-06.png',
        imageWidth: '75%',
        imageAlt: 'Descuento',
        inputPlaceholder: 'Indicá tu descuento',
        confirmButtonText: 'Siguiente',
        confirmButtonColor: '#0dcaf0',
        showDenyButton: true,
        denyButtonColor: '#c7c8ca',
        denyButtonText: 'Anterior',
        showClass: {popup: 'animate__animated animate__fadeInRight animate__faster'},
        hideClass: {popup: 'animate__animated animate__fadeOutLeft animate__faster'}
        
    }).then((resultDescuento) => {
      
        if (resultDescuento.isConfirmed) { 
            
            descuento = resultDescuento.value

            //Creo un Array y le agrego un objeto nuevo dentro con los datos del cliente.
            const clienteNuevo = []

            clienteNuevo.push(new Cliente(1, usuario, actividad, edad, altura, tiempo, extras, descuento))

            //Agrego los items al LS
            localStorage.setItem('datos', JSON.stringify(clienteNuevo))

            //Obtengo los items y ejecuto la funcion que se encarga de cargar todos los datos en la pagina
            datosUsuario = JSON.parse(localStorage.getItem('datos'))

            datosGuardados()

            

        }

        else if (resultDescuento.isDenied) { sweetAlertExtras(usuario) }

    })


}




//Funcion que voy a usar en caso que los datos que el usuario ingreso existan, para agregar sus datos y los datos de las bicis a la pagina principal
const datosGuardados = () => {


    let carrito = JSON.parse( localStorage.getItem('carrito') )
    let cantidadCarrito

    if (carrito != null) {
        cantidadCarrito = carrito.filter( (bike) => bike.precio > 0  ).length
    }

    else {cantidadCarrito = 0}


    $('#usuarioHeader').append(
        `
        <a href="./datos.html" class="link-light"><strong>${usuario}</strong></a>
        <span> &#124; </span>
        <a href="./carrito.html" class="link-light"><img src="./img/carrito-01.png" alt="Carrito"> <span id="cantidadCarrito">${cantidadCarrito}</span></a>
        `
    )


    fetch('https://www.biciregistro.com.ar/stockBicis.json')
        .then((respuesta) => respuesta.json())
        .then((data) => {


            
            let nombre = datosUsuario[0].nombre
            let actividad = datosUsuario[0].actividad
            let edad = parseInt(datosUsuario[0].edad)
            let altura = parseInt(datosUsuario[0].altura)
            let tiempo = parseInt(datosUsuario[0].tiempo)
            let extras = datosUsuario[0].extras
            let descuento = parseInt(datosUsuario[0].descuento)

            const clienteGuardado = []

            clienteGuardado.push(new Cliente(1, nombre, actividad, edad, altura, tiempo, extras, descuento))

            for (const clientes of clienteGuardado) {
                clientes.determinarBici()
                clientes.determinarRodado()
                clientes.valorExtras()
            }


            //Busco las bicis que coinciden con las especificaciones del usuario
            const busquedaBici = data.filter( (bike) => bike.tipo == clienteGuardado[0].tipo && bike.rodado == clienteGuardado[0].rodado )
            
            //Para las bicis filtradas ejecuto la funcion que las agrega a la pagina como sugerencias
            busquedaBici.forEach( (bike) => { agregarCarrito(bike.id, clienteGuardado[0].tiempo, clienteGuardado[0].extras, clienteGuardado[0].descuento) } )

            //Muestro el numero de bicicletas que se ajustan al usuario al cargar la pagina
            Swal.fire({
                icon: 'info',
                title: 'Bicis disponibles',
                confirmButtonColor: '#0dcaf0',
                text: `${usuario}, ${busquedaBici.length} de ${data.length} bicicletas en el local se ajustan a tus especificaciones`
              })
            
            //Cargo todas las bicis en stock debajo
            agregarStock(clienteGuardado[0].tiempo, clienteGuardado[0].extras, clienteGuardado[0].descuento)
            
            contenedorDatosGuardados.append(
                `
                <div class="row justify-content-md-center">
                    <div class="col text-center col-lg-3">
                    <img src="./img/usuario-07.png" alt="Usuario">
                    <h3 class="font-weight-bold text-secondary">${usuario}</h3>
                    <a class="btn btn-secondary text-white font-weight-bold mt-1" href="./datos.html" role="button">Modificar mis datos</a>
                    </div>
                    <div class="col text-center col-md-auto my-auto"><div class="vl"></div></div>
                    <div class="col text-center col-lg-3">
                    <img src="./img/carrito-08.png" alt="Carrito">
                    <h3 id="cantidadCarritoBody" class="font-weight-bold text-secondary">${cantidadCarrito} ítems</h3>
                    <a class="btn btn-secondary text-white font-weight-bold mt-1" href="./carrito.html" role="button">Ir a mi Carrito</a>
                    </div>
                </div>
                `
            )
     

        })


}

//Si el usuario no existe, muestro el modal para ingresar el nombre y mediante un formulario lo guardo en SS

$(document).ready( () => { 


    if (usuario == null) {

        Swal.fire({
            title: 'Bienvenido!',
            allowOutsideClick: false,
            input: 'text',
            inputLabel: 'Para continuar, vamos a necesitar tu nombre',
            inputPlaceholder: 'Ingresá tu nombre',
            confirmButtonText: 'Siguiente',
            confirmButtonColor: '#0dcaf0',
            inputValidator: (value) => {
                if (!value) {
                  return 'Por favor, ingresá tu nombre'
                }
              }
            
        }).then((result) => {
          
            if (result.isConfirmed) {

                usuario = result.value

                sessionStorage.setItem('usuario', usuario)

                if (datosUsuario == null) { sweetAlertActividad(usuario) }

                else { 
                    
                    if (usuario == datosUsuario[0].nombre) { datosGuardados() }

                    else { sweetAlertActividad(usuario) }                 
                
                }

    
            }

        })
  

    }

    else {

        //Si no hay datos del usuario guardados, muestro el modal para cargarlos, de otra manera los cargo en la pagina principal
        if (datosUsuario == null) { sweetAlertActividad(usuario) }

        else { datosGuardados() }
     
    }


})



//Creo un array vacio para agregar items al carrito
let carritoDeCompras = []

//Me fijo si tengo un array del carrito guardado en LS, si lo tengo cargo el array parseado en el array carritoDeCompras
const carritoLS = JSON.parse(localStorage.getItem('carrito'))
if (carritoLS !== null) {carritoDeCompras = carritoLS}


//Funcion flecha para agregar items al array del carrito de compras
const agregarCarrito = (id, clienteTiempo, clienteExtras, clienteDescuento) => {

    fetch('https://www.biciregistro.com.ar/stockBicis.json')
    .then((respuesta) => respuesta.json())
    .then((data) => {


    
        let itemCarrito = data.find( (item) => item.id === id )

        itemCarrito.precio *= clienteTiempo
        itemCarrito.precio += clienteExtras
        itemCarrito.precio -= (itemCarrito.precio * clienteDescuento) / 100
        Math.round(itemCarrito.precio * 100) / 100 //Redondeo el precio total para que no me muestre muchos decimales

        //Agrego a la pagina principal los items que coinciden con las especificaciones del usuario
        contenedorFiltradas.append(`
        <div class="col">
        <div class="card shadow-sm">
        <img src="${itemCarrito.img}" width="100%" height="auto" alt="${itemCarrito.nombre}">
        <div class="card-body">
        <h5><b>${itemCarrito.nombre}</b><span class="text-secondary"> ${itemCarrito.tipo}, rodado ${itemCarrito.rodado}</span></h5>
        <h5 class="text-success mt-3"><b>$${itemCarrito.precio}</b><span class="text-secondary"> / total</span></h5>
        <button id="filtrada${itemCarrito.id}" class="btn btn-success btn-sm">Agregar al Carrito</button>
        </div>
        </div>
        </div>
        `)



        const abrirModalAgregado = () => {

            Swal.fire({
                icon: 'success',
                title: 'Agregada al carrito',
                confirmButtonColor: '#0dcaf0',
                html: 'La bicicleta <b>'+itemCarrito.nombre+'</b> se agregó a tu carrito de compras'
              })
                

        }




        tituloFiltradas.text('Estas bicis se adaptan mejor a tus características')



        const botonResultados = $(`#filtrada${itemCarrito.id}`)

        botonResultados.click(() => {

            let itemExiste = carritoDeCompras.find ( (itemLS) => itemLS.id === id )


            if (itemExiste === undefined) { //si el item no existe en el carrito, calculo el precio total y pregunto si quiere agregarlo al carrito

                //Si el usuario hace click en agregar al carrito, lo agrego y muestro el modal de operacion realizada 
                carritoDeCompras.push(itemCarrito) 
                localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))

                const cantidadCarrito = carritoDeCompras.filter( (bike) => bike.precio > 0  ).length
                $('#cantidadCarrito').text(cantidadCarrito)
                $('#cantidadCarritoBody').text(cantidadCarrito + ' ítems')

                abrirModalAgregado()
                
            }


            else if (itemExiste.precio == 0) { //si el item fue borrado del carrito anteriormente, lo vuelvo a agregar

                //Si el usuario hace click en agregar al carrito, lo agrego y muestro el modal de operacion realizada 
                itemExiste.precio = itemCarrito.precio
                localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))

                const cantidadCarrito = carritoDeCompras.filter( (bike) => bike.precio > 0  ).length
                $('#cantidadCarrito').text(cantidadCarrito)
                $('#cantidadCarritoBody').text(cantidadCarrito + ' ítems')

                abrirModalAgregado()
                
            }

            //Si el item ya esta en el carrito, muestro un aviso
            else {
                
                Swal.fire({
                    icon: 'error',
                    title: 'No se agregó al carrito',
                    confirmButtonColor: '#0dcaf0',
                    html: 'La bicicleta <b>'+itemExiste.nombre+'</b> ya se encuentra en tu carrito de compras'
                  })                 

            } 

        })

    })

   
}



//Obtengo con querySelector los checkbox que voy a usar para filtrar el stock de bicis
const inputPaseo = $('[name=checkboxPaseo]')
const inputMTB = $('[name=checkboxMTB]')
const inputRuta = $('[name=checkboxRuta]')


fetch('https://www.biciregistro.com.ar/stockBicis.json')
    .then((respuesta) => respuesta.json())
    .then((data) => {


        //Separo cada tipo de bici en un array diferente
        const bicisPaseo = data.filter( (bike) => bike.tipo == "paseo" )
        const bicisMTB = data.filter( (bike) => bike.tipo == "mtb" )
        const bicisRuta = data.filter( (bike) => bike.tipo == "ruta" )



        //A cada checkbox le agrego un evento change en JQuery y le cambio el css para mostrarlo/ocultarlo segun elija, con slideToggle

        inputPaseo.change(() => {

            for(let itemPaseo of bicisPaseo) {

                const biciPaseo = $(`#idCard${itemPaseo.id}`)

                biciPaseo.slideToggle()

            }   

        })


        inputMTB.change(() => {

            for(let itemMTB of bicisMTB) {

                const biciMTB = $(`#idCard${itemMTB.id}`)

                biciMTB.slideToggle()

            }   

        })


        inputRuta.change(() => {

            for(let itemRuta of bicisRuta) {

                const biciRuta = $(`#idCard${itemRuta.id}`)

                biciRuta.slideToggle()

            }   

        })



    })
