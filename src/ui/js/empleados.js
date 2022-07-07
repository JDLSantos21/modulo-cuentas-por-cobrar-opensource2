
const btnRegEmpleado = document.getElementById("btnRegEmpleado")

const nombreEmpleado = document.getElementById("inputNombreEmpleado")
const apellidoEmpleado = document.getElementById("inputApellidoEmpleado")
const fechaIngreso = document.getElementById("inputFechaEmpleado")


btnRegEmpleado.addEventListener("click",()=>{

  const newEmployeeObj = {
    nombre:nombreEmpleado.value,
    apellido:apellidoEmpleado.value,
    fecha_ingreso:fechaIngreso.value,
  }

  if(nombreEmpleado.value != "" && apellidoEmpleado.value != "" && fechaIngreso.value != ""){

    ipc.invoke("addNewEmployee",newEmployeeObj);

    nombreEmpleado.value = ""
    apellidoEmpleado.value = ""
    fechaIngreso.value = ""

    Swal.fire({
      icon:"success",
      title:"Completado",
      text:"Se ha registrado el Empleado satisfactoriamente."
    })

    ipc.send('consultaEmpleados')
    
  }else{

    Swal.fire({
      icon:"error",
      title:"Hubo un problema",
      text:"Todos los campos son requeridos."
    })

  }

})