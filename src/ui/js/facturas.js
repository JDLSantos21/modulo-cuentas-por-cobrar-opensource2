
const btnRegFactura = document.getElementById("btnRegFactura")
const regFactura = document.getElementById("regFactura")

const fechaFactura = document.getElementById("inputFechaFactura")
const idCliente = document.getElementById("selectClientes")
const montoFactura = document.getElementById("inputMontoFactura")


//  TRAER DATOS CLIENTES AL SELECT CLIENTES DE FACTURAS

ipc.on('dataClientes',(e,dataClientes)=>{

  let clienteOptions = `
  <option value="selected">Seleccionar</option>
  `
  let Clientes = ''

  dataClientes.forEach(cliente => {

   clienteOptions += `
   <option value="${cliente.id_cliente}">${cliente.nombre}</option>
   `

   Clientes += `
   <tr class='tr'>
      <td class='td'>${cliente.nombre}</td>
      <td class='td'>${cliente.direccion}</td>
      <td class='td'>${cliente.telefono}</td>
      <td class='td'>${cliente.credito}</td>
    </tr>
   `

  });

  idCliente.innerHTML = clienteOptions;
  tbodyClientes.innerHTML = Clientes;

})


btnRegFactura.addEventListener("click",()=>{

  const newFacturaObj = {
    fecha:fechaFactura.value,
    id_cliente:idCliente.value,
    montoFactura:montoFactura.value,
    balanceFactura:montoFactura.value
  }

  if(fechaFactura.value != "" && idCliente.value != "selected" && montoFactura.value != ""){

    ipc.invoke("addNewFactura",newFacturaObj);

    fechaFactura.value = ""
    idCliente.value = "selected"
    montoFactura.value = ""

    Swal.fire({
      icon:"success",
      title:"Completado",
      text:"Se ha registrado la factura satisfactoriamente."
    })
    
  }else{

    Swal.fire({
      icon:"error",
      title:"Hubo un problema",
      text:"Todos los campos son requeridos."
    })

  }

})

// ACTUALIZAR LISTA DE CLIENTES EN EL SELECT DE REGISTRAR FACTURA
regFactura.addEventListener("click",()=>{
  ipc.send('consultaClientes')
})

//ACTUALIZAR TABLA DE FACTURAS AL REGISTRAR UNA FACTURA
btnRegFactura.addEventListener("click",()=>{
  ipc.send('consultaFacturas')
})