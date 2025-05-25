/**
 * Lógica de front-end para El Rincón Perfumado
 */

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar tooltips de Bootstrap
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Inicializar popovers de Bootstrap
  const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
  popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl);
  });

  // Seleccionar elementos del DOM para manipulación
  const formLogin = document.getElementById('formLogin');
  const formAddPerfume = document.getElementById('formAddPerfume');
  const formEditPerfume = document.getElementById('formEditPerfume');
  const deleteButtons = document.querySelectorAll('.btn-delete-perfume');
  const editButtons = document.querySelectorAll('.btn-edit-perfume');
  
  // Validación del formulario de login
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      const username = document.getElementById('username');
      const password = document.getElementById('password');
      
      if (!username.value.trim() || !password.value.trim()) {
        e.preventDefault();
        mostrarAlerta('Todos los campos son obligatorios', 'danger');
      }
    });
  }
  
  // Validación del formulario para agregar perfume
  if (formAddPerfume) {
    formAddPerfume.addEventListener('submit', (e) => {
      const nombre = document.getElementById('nombre');
      const cantidad = document.getElementById('cantidad');
      
      if (!nombre.value.trim()) {
        e.preventDefault();
        mostrarAlerta('El nombre del perfume es obligatorio', 'danger');
      }
      
      if (cantidad.value < 0) {
        e.preventDefault();
        mostrarAlerta('La cantidad no puede ser negativa', 'danger');
      }
    });
  }
  
  // Configurar botones de eliminación
  if (deleteButtons) {
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Obtener el botón incluso si se hace clic en el ícono dentro del botón
        const button = e.target.closest('.btn-delete-perfume');
        if (!button) return;
        
        const id = button.getAttribute('data-id');
        const nombre = button.getAttribute('data-nombre');
        
        document.getElementById('confirmDeleteId').value = id;
        document.getElementById('confirmDeleteName').textContent = nombre;
      });
    });
  }
  
  // Configurar botones de edición
  if (editButtons) {
    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // Obtener el botón incluso si se hace clic en el ícono dentro del botón
        const button = e.target.closest('.btn-edit-perfume');
        if (!button) return;
        
        const id = button.getAttribute('data-id');
        const nombre = button.getAttribute('data-nombre');
        const cantidad = button.getAttribute('data-cantidad');
        
        document.getElementById('editId').value = id;
        document.getElementById('editNombre').value = nombre;
        document.getElementById('editCantidad').value = cantidad;
      });
    });
  }
});

/**
 * Función para mostrar alertas en la interfaz
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de alerta (success, danger, warning, info)
 */
function mostrarAlerta(mensaje, tipo) {
  const alertPlaceholder = document.getElementById('alertPlaceholder');
  
  // Si no existe el contenedor de alertas, crear uno temporal
  if (!alertPlaceholder) {
    const tempAlert = document.createElement('div');
    tempAlert.className = `alert alert-${tipo} alert-dismissible fade show mt-3`;
    tempAlert.innerHTML = `
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.insertBefore(tempAlert, document.body.firstChild);
    
    // Auto cerrar después de 3 segundos
    setTimeout(() => {
      tempAlert.remove();
    }, 3000);
    
    return;
  }
  
  // Si existe el contenedor, usarlo
  const wrapper = document.createElement('div');
  wrapper.className = `alert alert-${tipo} alert-dismissible fade show`;
  wrapper.innerHTML = `
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  alertPlaceholder.appendChild(wrapper);
  
  // Auto cerrar después de 3 segundos
  setTimeout(() => {
    wrapper.remove();
  }, 3000);
} 