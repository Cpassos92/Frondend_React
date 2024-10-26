import './App.css';
import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menubar } from 'primereact/menubar';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';       
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Panel } from 'primereact/panel';

import { Skeleton } from 'primereact/skeleton';
        


        
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';

// Datos simulados para la lista de clientes
const mockClientes = [
  { idCliente: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', telefono: '123456789', direccion: 'Calle Falsa 123' },
  { idCliente: 2, nombre: 'María', apellido: 'García', email: 'maria@example.com', telefono: '987654321', direccion: 'Av. Siempre Viva 742' }
];

// Componente de Login
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '', password: '' };
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    if (this.state.username === 'admin' && this.state.password === 'admin') {
      this.props.onLogin();
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  }

  render() {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Ocupa toda la altura de la pantalla
        backgroundColor: '#f8f9fa' // Color de fondo opcional
      }}>
        <Skeleton size="24rem">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Iniciar sesión</h2>
            <InputText placeholder="Usuario" value={this.state.username} onChange={(e) => this.setState({ username: e.target.value })} />
            <br />
            <InputText type="password" placeholder="Contraseña" value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
            <br />
            <Button label="Ingresar" onClick={this.handleLogin} />
          </div>
        </Skeleton>
      </div>
    );
  }
}


// Componente principal de la aplicación
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loggedIn: false,
      visible: false,
      clientes: { idCliente: null, nombre: null, apellido: null, email: null, telefono: null, direccion: null },
      cliente: mockClientes,
      selectedCliente: {}
    };

    this.items = [
      { label: 'Nuevo', icon: 'pi pi-fw pi-user-plus', command: () => { this.showSaveDialog(); } },
      { label: 'Editar', icon: 'pi pi-fw pi-user-edit', command: () => { this.showEditDialog(); } },
      { label: 'Eliminar', icon: 'pi pi-fw pi-user-minus', command: () => { this.delete(); } }
    ];

    this.save = this.save.bind(this);
    this.footer = <div><Button label="Guardar" icon="pi pi-check" onClick={this.save} /></div>;
    this.toast = React.createRef();
  }

  save() {
    const newClientes = [...this.state.cliente];
    const newCliente = { ...this.state.clientes, idCliente: Date.now() }; // Crear ID único
    newClientes.push(newCliente);
    this.setState({ cliente: newClientes, visible: false, clientes: { idCliente: null, nombre: null, apellido: null, email: null, telefono: null, direccion: null } });
    this.toast.current.show({ severity: "success", summary: "Atención!", detail: "Cliente guardado exitosamente" });
  }

  delete() {
    if (window.confirm("¿Desea eliminar este cliente?")) {
      const newClientes = this.state.cliente.filter(c => c.idCliente !== this.state.selectedCliente.idCliente);
      this.setState({ cliente: newClientes, selectedCliente: {} });
      this.toast.current.show({ severity: "success", summary: "Atención!", detail: "Cliente eliminado exitosamente" });
    }
  }

  showSaveDialog() {
    this.setState({ visible: true, clientes: { idCliente: null, nombre: null, apellido: null, email: null, telefono: null, direccion: null } });
  }

  showEditDialog() {
    const { selectedCliente } = this.state;
    this.setState({
      visible: true,
      clientes: {
        idCliente: selectedCliente.idCliente,
        nombre: selectedCliente.nombre,
        apellido: selectedCliente.apellido,
        email: selectedCliente.email,
        telefono: selectedCliente.telefono,
        direccion: selectedCliente.direccion,
      }
    });
  }

  render() {
    if (!this.state.loggedIn) {
      return <Login onLogin={() => this.setState({ loggedIn: true })} />;
    }

    return (
      <div style={{ width: '80%', margin: '20px auto 0px' }}>
        <Menubar model={this.items} />
        <br />
        <Panel header="CRUD de clientes">
          <DataTable value={this.state.cliente} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
            selectionMode="single" selection={this.state.selectedCliente}
            onSelectionChange={(e) => this.setState({ selectedCliente: e.value })}>
            <Column field="idCliente" header="ID"></Column>
            <Column field="nombre" header="Nombres"></Column>
            <Column field="apellido" header="Apellidos"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="direccion" header="Direccion"></Column>
            <Column field="telefono" header="Telefono"></Column>
          </DataTable>
        </Panel>

        <Dialog header="Clientes" visible={this.state.visible} style={{ width: '400px' }} footer={this.footer} modal={true} onHide={() => this.setState({ visible: false })}>
          <FloatLabel><InputText style={{ width: "100%" }} value={this.state.clientes.nombre} id='nombre' onChange={(e) => this.setState(prevState => ({ clientes: { ...prevState.clientes, nombre: e.target.value } }))} /><label htmlFor="nombre">Nombres:</label></FloatLabel><br />
          <FloatLabel><InputText style={{ width: "100%" }} value={this.state.clientes.apellido} id='apellido' onChange={(e) => this.setState(prevState => ({ clientes: { ...prevState.clientes, apellido: e.target.value } }))} /><label htmlFor="apellido">Apellidos:</label></FloatLabel><br />
          <FloatLabel><InputText style={{ width: "100%" }} value={this.state.clientes.email} id='email' onChange={(e) => this.setState(prevState => ({ clientes: { ...prevState.clientes, email: e.target.value } }))} /><label htmlFor="email">Email:</label></FloatLabel><br />
          <FloatLabel><InputText style={{ width: "100%" }} value={this.state.clientes.direccion} id='direccion' onChange={(e) => this.setState(prevState => ({ clientes: { ...prevState.clientes, direccion: e.target.value } }))} /><label htmlFor="direccion">Direccion:</label></FloatLabel><br />
          <FloatLabel><InputText style={{ width: "100%" }} value={this.state.clientes.telefono} id='telefono' onChange={(e) => this.setState(prevState => ({ clientes: { ...prevState.clientes, telefono: e.target.value } }))} /><label htmlFor="telefono">Telefono</label></FloatLabel><br />
        </Dialog>

        <Toast ref={this.toast} />
      </div>
    );
  }
}


