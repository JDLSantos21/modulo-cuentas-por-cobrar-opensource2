
const btnRegCliente = document.getElementById("btnRegCliente")

const nombreCliente = document.getElementById("inputNombreCliente")
const dirCliente = document.getElementById("inputDireccionCliente")
const telCliente = document.getElementById("inputTelCliente")
const credCliente = document.getElementById("inputCreditoCliente")


btnRegCliente.addEventListener("click",()=>{

  const newClienteObj = {
    nombre:nombreCliente.value,
    direccion:dirCliente.value,
    telefono:telCliente.value,
    credito:credCliente.value
  }

  if(nombreCliente.value != "" && dirCliente.value != "" && telCliente.value != "" && credCliente.value != ""){

    ipc.invoke("addNewClient",newClienteObj);

    nombreCliente.value = ""
    dirCliente.value = ""
    telCliente.value = ""
    credCliente.value = ""

    Swal.fire({
      icon:"success",
      title:"Completado",
      text:"Se ha registrado el cliente satisfactoriamente."
    })

    ipc.send('consultaClientes')
    
  }else{

    Swal.fire({
      icon:"error",
      title:"Hubo un problema",
      text:"Todos los campos son requeridos."
    })

  }


})
