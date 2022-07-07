const {BrowserWindow, ipcMain, Notification} = require('electron');
const {getConnection} = require('./database');

ipc = ipcMain

ipc.on('consultaClientes',async()=>{
  const conn = await getConnection();
  conn.query(`SELECT * FROM clientes ORDER BY id_cliente DESC`,(error,results,fields)=>{
    window.webContents.send('dataClientes',results)
  })
})

ipc.on('consultaEmpleados',async()=>{
  const conn = await getConnection();
  conn.query(`SELECT * FROM empleado ORDER BY id_empleado DESC`,(error,results,fields)=>{
    window.webContents.send('dataEmpleados',results)
  })
})

ipc.on('consultaFacturas',async()=>{
  const conn = await getConnection();
  conn.query(`select facturascxc.id_factura, facturascxc.fecha, clientes.nombre,facturascxc.montoFactura,facturascxc.balanceFactura from facturascxc inner join clientes on facturascxc.id_cliente=clientes.id_cliente ORDER BY facturascxc.id_factura DESC`,(error,results,fields)=>{
    window.webContents.send('dataFacturas',results)
  })
})

ipc.on('consultaMovimientos',async()=>{
  const conn = await getConnection();
  conn.query(`select movimientofactura.numero_documento, tipo_documento.des_larga, movimientofactura.fecha_documento, movimientofactura.factura_aplica, movimientofactura.monto_documentado, empleado.nombre from movimientofactura INNER JOIN tipo_documento on movimientofactura.tipo_documento=tipo_documento.tipo_documento INNER JOIN empleado on movimientofactura.codigo_empleado=empleado.id_empleado ORDER BY movimientofactura.numero_documento DESC`,(error,results,fields)=>{
    window.webContents.send('dataMovimientos',results)
  })
})

// REGISTRAR MOVIMIENTO

ipc.handle("addNewMove",async(e,moveData)=>{

  const conn = await getConnection();

  conn.query("INSERT INTO movimientofactura SET ?",moveData)

  if(moveData.tipo_documento === 2 || moveData.tipo_documento === 4){
    conn.query(`UPDATE facturascxc Set balanceFactura = balanceFactura - ${moveData.monto_documentado} WHERE id_factura = ${moveData.factura_aplica}`)
  }else{
    conn.query(`UPDATE facturascxc Set balanceFactura = balanceFactura + ${moveData.monto_documentado} WHERE id_factura = ${moveData.factura_aplica}`)
  }

})

// REGISTRAR NUEVO CLIENTE

ipc.handle("addNewClient",async(e,clientData)=>{

  const conn = await getConnection();

  conn.query("INSERT INTO clientes SET ?", clientData)

})

ipc.handle("addNewEmployee",async(e,employeeData)=>{

  const conn = await getConnection();

  conn.query("INSERT INTO empleado SET ?", employeeData)

})

ipc.handle("addNewFactura",async(e,facturaData)=>{

  const conn = await getConnection();

  conn.query("INSERT INTO facturascxc SET ?", facturaData)

})



let window

function createWindow() {

  window = new BrowserWindow({
    width:1024,
    minWidth:928,
    minHeight:850,
    height:850,
    frame:false,
    webPreferences:{
      nodeIntegration:true,
      contextIsolation:false,
    }
  })

  window.loadFile('src/ui/index.html');
}

//CLOSE BTN

ipc.on('closeApp',()=>{
  window.close();
})

//Maximize BTN

ipc.on('maxApp',()=>{
  if(window.isMaximized()){
    window.restore();
  }else{
    window.maximize();
  }
})

//Minimize BTN

ipc.on('minApp',()=>{
  window.minimize();
})

module.exports = {
  createWindow
}
