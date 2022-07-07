const { ipcRenderer } = require("electron");
const { default: Swal } = require("sweetalert2");
let moment = require('moment');
moment.locale('es');

const regMoves = document.getElementById('regMoves');
const selectEmpleados = document.getElementById('selectEmpleados');
const inputFacturaAplica = document.getElementById('inputFacturaAplica');
const selectDocType = document.getElementById('selectDocType');
const inputMonto = document.getElementById('inputMonto');
const inputFecha = document.getElementById('inputFecha');
const btnRegMove = document.getElementById('btnRegMove');
const btnToggleMoves = document.getElementById('btnToggleMoves');
const btnToggleFactura = document.getElementById('btnToggleFactura');
const tableFactura = document.getElementById('tableFactura');
const tbodyEmpleados = document.getElementById('tbodyEmpleados');
const tbodyClientes = document.getElementById('tbodyClientes');

ipc = ipcRenderer

 document.addEventListener("DOMContentLoaded",()=>{
   ipc.send('consultaEmpleados')
   ipc.send('consultaClientes')
   ipc.send('consultaMovimientos')
   ipc.send('consultaFacturas')
 })


 btnToggleFactura.addEventListener('click',()=>{
  tableFactura.classList.add('active');
  btnToggleMoves.classList.remove('toggleActive')
  btnToggleFactura.classList.add('toggleActive')
  ipc.send('consultaFacturas')
 })

 btnToggleMoves.addEventListener('click',()=>{
  tableFactura.classList.remove('active');
  btnToggleFactura.classList.remove('toggleActive')
  btnToggleMoves.classList.add('toggleActive')
  ipc.send('consultaMovimientos')
 })

 ipc.on('dataEmpleados',(e,dataEmpleados)=>{

   let empleadoOptions = `
   <option value="selected">Seleccionar</option>
   `

   let Empleados = ''

   dataEmpleados.forEach(empleado => {


    let fecha_empleado = moment(empleado.fecha_ingreso);

    Empleados += `
    
    <tr class='tr'>
      <td class='td'>${empleado.nombre}</td>
      <td class='td'>${empleado.apellido}</td>
      <td class='td'>${fecha_empleado.format("dddd Do MMMM YYYY")}</td>
    </tr>

    `

    empleadoOptions += `
    <option value="${empleado.id_empleado}">${empleado.nombre}</option>
    `

   });

   selectEmpleados.innerHTML = empleadoOptions;
   tbodyEmpleados.innerHTML = Empleados;
 })

// REGISTRAR MOVIMIENTO DE FACTURA

 btnRegMove.addEventListener("click",()=>{

  const newMoveObj = {
    factura_aplica:parseInt(inputFacturaAplica.value),
    tipo_documento:parseInt(selectDocType.value),
    monto_documentado:parseInt(inputMonto.value),
    fecha_documento:inputFecha.value,
    codigo_empleado:parseInt(selectEmpleados.value)
  }



  if(selectDocType.value != "selected" && inputMonto.value != "" && newMoveObj.fecha_documento != "" && selectEmpleados.value != "selected"){
    ipc.invoke("addNewMove",newMoveObj);

    selectDocType.value = "selected"
    inputFecha.value = ""
    inputMonto.value = ""
    selectEmpleados.value = "selected"
    inputFacturaAplica.value = ""

    Swal.fire({
      icon: 'success',
      title: 'Satisfactorio',
      text: 'Se ha registrado el movimiento',
    })

    ipc.send('consultaMovimientos')
    
  }else{
    Swal.fire({
      icon: 'error',
      title: 'Hubo un problema',
      text: 'Tienes que completar todos los datos correctamente.',
    })

  }

 })


//  MOSTRAR LOS MOVIMIENTOS EN LA TABLA

const movTable = document.getElementById("movTable")

ipc.on("dataMovimientos",(e,dataMovimientos)=>{


  let dataTable = ""
  
  dataMovimientos.forEach(movimiento => {
    
    let fecha_documento = moment(movimiento.fecha_documento)
    
    dataTable += `
    <tr class="tr">
      <td>${movimiento.numero_documento}</td>
      <td>${(movimiento.des_larga).toUpperCase()}</td>
      <td>${fecha_documento.format("dddd Do MMMM YYYY")}</td>
      <td>${movimiento.factura_aplica}</td>
      <td>${movimiento.monto_documentado}</td>
      <td>${(movimiento.nombre).toUpperCase()}</td>
    </tr>
    `
  });

  movTable.innerHTML = dataTable;

})

//  MOSTRAR LOS FACTURAS EN LA TABLA

const facTable = document.getElementById("facTable")

ipc.on("dataFacturas",(e,dataFacturas)=>{

  let dataTable = ""
  
  dataFacturas.forEach(factura => {
    
    let fecha_factura = moment(factura.fecha)
    
    dataTable += `
    <tr class="tr">
      <td class='td'>${factura.id_factura}</td>
      <td class='td'>${fecha_factura.format("dddd Do MMMM YYYY")}</td>
      <td class='td'>${(factura.nombre).toUpperCase()}</td>
      <td class='td'>${factura.montoFactura}</td>
      <td class='td'>${factura.balanceFactura}</td>
    </tr>
    `
  });

  facTable.innerHTML = dataTable;

})




// ACTUALIZAR LISTA DE EMPLEADOS EN EL SELECT DE REGISTRAR MOVIMIENTO
regMoves.addEventListener("click",()=>{
  ipc.send('consultaEmpleados')
})


