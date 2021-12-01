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

//Busco todos los elementos del html que voy a usar
const inputActividad = $('#select-actividad')
const inputEdad = $('#edad')
const inputAltura = $('#altura')
const inputTiempo = $('#tiempo')
const inputExtras = $('#select-extras')
const inputDescuento = $('#select-descuento')
const formularioDatos = $('#formulario-datos')
const circuloEdad = $('#circulo-edad')
const circuloAltura = $('#circulo-altura')
const circuloTiempo = $('#circulo-tiempo')
const bajadaDatos = $('#bajada-datos')
const botonModificar = $('#botonModificar')

//Obtengo el usuario guardado en el SS y agrego en el html el nombre
let datosUsuario = JSON.parse(localStorage.getItem('datos'))

if (datosUsuario !== null) {

    let carrito = JSON.parse( localStorage.getItem('carrito') )
    let cantidadCarrito
    
    if (carrito != null) {
        cantidadCarrito = carrito.filter( (bike) => bike.precio > 0  ).length
    }
    
    else {cantidadCarrito = 0}
    

    let nombre = datosUsuario[0].nombre
    let actividad = datosUsuario[0].actividad
    let edad = parseInt(datosUsuario[0].edad)
    let altura = parseInt(datosUsuario[0].altura)
    let tiempo = parseInt(datosUsuario[0].tiempo)
    let extras = datosUsuario[0].extras
    let descuento = parseInt(datosUsuario[0].descuento)

    $('#usuarioHeader').append(
        `
        <strong>${nombre}</strong>
        <span> &#124; </span>
        <a href="./carrito.html" class="link-light"><img src="./img/carrito-01.png" alt="Carrito"> <span id="cantidadCarrito">${cantidadCarrito}</span></a>
        `
    )


    inputActividad.val(actividad)
    inputEdad.val(edad)
    inputAltura.val(altura)
    inputTiempo.val(tiempo)
    inputExtras.val(extras)
    inputDescuento.val(descuento)


    $('#titulo-datos').text(`${nombre}, estos son tus datos`)


    //Cuando hago click en el lapiz de editar, le quito la propiedad disabled para poder editar el input
    $('#editarActividad').click(() => {
        inputActividad.removeAttr("disabled")
        botonModificar.removeAttr("disabled")
    })

    $('#editarEdad').click(() => {
        inputEdad.removeAttr("disabled")
        botonModificar.removeAttr("disabled")
    })

    $('#editarAltura').click(() => {
        inputAltura.removeAttr("disabled")
        botonModificar.removeAttr("disabled")
    })

    $('#editarTiempo').click(() => {
        inputTiempo.removeAttr("disabled")
        botonModificar.removeAttr("disabled")
    })

    $('#editarExtras').click(() => {
        inputExtras.removeAttr("disabled")
        botonModificar.removeAttr("disabled")
    })

    $('#editarDescuento').click(() => {
        inputDescuento.removeAttr("disabled")
        botonModificar.removeAttr("disabled")
    })
    

}




//Muestro al lado de los campos de numeros un circulo rojo o verde dependiendo si estan vacios o no
inputEdad.on('input', (e) =>{

    const edadV = e.target.value.trim()


    if (edadV == '' || edadV <= 0 || edadV > 120) {
        circuloEdad.addClass('circulo-rojo')
        circuloEdad.removeClass('circulo-verde')
    }

    else {
        circuloEdad.addClass('circulo-verde')
        circuloEdad.removeClass('circulo-rojo') 
    }
})


inputAltura.on('input', (e) =>{

    const alturaV = e.target.value.trim()


    if (alturaV == '' || alturaV < 50 || alturaV > 240) {
        circuloAltura.addClass('circulo-rojo')
        circuloAltura.removeClass('circulo-verde')
    }

    else {
        circuloAltura.addClass('circulo-verde')
        circuloAltura.removeClass('circulo-rojo') 
    }
})


inputTiempo.on('input', (e) =>{

    const tiempoV = e.target.value.trim()


    if (tiempoV == '' || tiempoV < 10 || tiempoV > 3600) {
        circuloTiempo.addClass('circulo-rojo')
        circuloTiempo.removeClass('circulo-verde')
    }

    else {
        circuloTiempo.addClass('circulo-verde')
        circuloTiempo.removeClass('circulo-rojo') 
    }
})



//Mediante un formulario guardo las modificaciones y creo algunas validaciones para los campos
formularioDatos.submit((e) => {

    e.preventDefault()

    actividad = inputActividad.val()
    edad = inputEdad.val()
    altura = inputAltura.val()
    tiempo = inputTiempo.val()
    extras = inputExtras.val()
    descuento = inputDescuento.val()



    if (edad == '' || altura == '' || tiempo == '') {
        bajadaDatos.addClass('textoRojo')
        bajadaDatos.text('Por favor, completá todos los campos')
    }

    else if (edad <= 0 || edad > 120 || altura < 50 || altura > 240 || tiempo < 10 || tiempo > 3600) {
        bajadaDatos.addClass('textoRojo')
        bajadaDatos.text('Por favor, verificá los datos que ingresaste')
    }

    else {

        //Creo un Array y le agrego un objeto nuevo dentro con los datos del cliente.
        const clienteNuevo = []

        clienteNuevo.push(new Cliente(1, datosUsuario[0].nombre, actividad, edad, altura, tiempo, extras, descuento))

        localStorage.setItem('datos', JSON.stringify(clienteNuevo)) 

        //Vuelvo a poner la propiedad disabled a los inputs
        inputActividad.attr("disabled", true)
        inputEdad.attr("disabled", true)
        inputAltura.attr("disabled", true)
        inputTiempo.attr("disabled", true)
        inputExtras.attr("disabled", true)
        inputDescuento.attr("disabled", true)
        botonModificar.attr("disabled", true)

        Swal.fire({
            icon: 'success',
            title: 'Datos modificados',
            confirmButtonColor: '#0dcaf0',
            html: datosUsuario[0].nombre + ', tus datos fueron modificados correctamente'
          })
        
    }

})

