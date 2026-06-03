/**
 * Servicio para generar e imprimir el comprobante oficial de citas en formato PDF (con diseño institucional)
 */
export const imprimirComprobante = (item) => {
  // Configurar los datos de la cita
  const codAtencion = `AG-${item.id.substring(0, 8).toUpperCase()}`;
  const fechaEmision = new Date().toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const nombreOficina = item.comuna || "Oficina Registro Civil";
  const direccionOficina = item.direccion || "Dirección de sucursal seleccionada";
  const fechaCita = item.selectedDate || "Por confirmar";
  const horaCita = item.selectedTime || "Por confirmar";
  const rutCiudadano = item.rut || "No especificado";
  const emailCiudadano = item.email || "No especificado";

  // Abrir ventana nueva para impresión
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Comprobante de Cita - Registro Civil</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap');
        
        body {
          font-family: 'Outfit', sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 40px;
          background-color: #ffffff;
        }

        /* Estilos de Impresión */
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .page-border {
            border: none !important;
            box-shadow: none !important;
          }
        }

        .page-border {
          border: 1px solid #e2e8f0;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
          border-radius: 16px;
          padding: 40px;
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          background: #ffffff;
        }

        /* Franja tricolor chilena en el borde superior */
        .franja-tricolor {
          display: flex;
          height: 6px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          border-top-left-radius: 16px;
          border-top-right-radius: 16px;
          overflow: hidden;
        }
        .tricolor-azul { flex: 1; bg-color: #0f2d59; background-color: #0f2d59; }
        .tricolor-blanco { flex: 1; bg-color: #ffffff; background-color: #ffffff; }
        .tricolor-rojo { flex: 1; bg-color: #c8102e; background-color: #c8102e; }

        /* Cabecera */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-b: 2px solid #0f2d59;
          border-bottom: 2px solid #0f2d59;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }

        .header-logo {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .escudo-chile {
          width: 50px;
          height: 50px;
        }

        .logo-text h1 {
          font-size: 13px;
          font-weight: 800;
          margin: 0;
          color: #0f2d59;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .logo-text p {
          font-size: 10px;
          font-weight: 600;
          margin: 2px 0 0 0;
          color: #64748b;
          text-transform: uppercase;
        }

        .voucher-title {
          text-align: right;
        }

        .voucher-title h2 {
          font-size: 18px;
          font-weight: 800;
          color: #0f2d59;
          margin: 0;
        }

        .voucher-title p {
          font-size: 11px;
          color: #64748b;
          margin: 5px 0 0 0;
          font-weight: 600;
        }

        /* Banner de Código de Atención */
        .code-banner {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .code-info h3 {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          color: #64748b;
          margin: 0 0 4px 0;
          letter-spacing: 0.5px;
        }

        .code-info p {
          font-size: 24px;
          font-weight: 800;
          color: #0f2d59;
          margin: 0;
          font-family: monospace;
          letter-spacing: 1px;
        }

        .code-date {
          text-align: right;
        }

        .code-date span {
          display: block;
          font-size: 10px;
          font-weight: 700;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .code-date strong {
          font-size: 12px;
          color: #334155;
        }

        /* Tabla de Información */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .info-card {
          border: 1px solid #f1f5f9;
          background-color: #fdfdfd;
          padding: 16px;
          border-radius: 12px;
        }

        .info-card h4 {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          color: #94a3b8;
          margin: 0 0 8px 0;
          letter-spacing: 0.5px;
        }

        .info-card p {
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          margin: 0;
          line-height: 1.5;
        }

        .info-card.highlight {
          grid-column: span 2;
          background-color: #eff6ff;
          border-color: #bfdbfe;
        }

        .info-card.highlight p {
          color: #1e3a8a;
          font-size: 14px;
        }

        /* QR y Firma */
        .footer-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-t: 1px dashed #e2e8f0;
          border-top: 1px dashed #e2e8f0;
          padding-top: 30px;
          margin-top: 30px;
        }

        .instructions {
          flex: 1;
          padding-right: 30px;
        }

        .instructions h5 {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 10px 0;
          color: #0f2d59;
        }

        .instructions ul {
          margin: 0;
          padding-left: 20px;
          font-size: 11px;
          color: #475569;
          line-height: 1.6;
        }

        .instructions li {
          margin-bottom: 6px;
        }

        .qr-code-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        /* Sello digital */
        .digital-seal {
          margin-top: 35px;
          text-align: center;
          border-t: 1px solid #f1f5f9;
          border-top: 1px solid #f1f5f9;
          padding-top: 15px;
          font-size: 9px;
          color: #94a3b8;
          line-height: 1.4;
          font-weight: 500;
        }

        /* Botón de Impresión de Respaldo */
        .print-btn-container {
          text-align: center;
          margin-top: 25px;
        }

        .print-btn {
          background-color: #0f2d59;
          color: white;
          border: none;
          padding: 12px 30px;
          font-size: 14px;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .print-btn:hover {
          background-color: #1e40af;
        }
      </style>
    </head>
    <body>

      <div class="page-border">
        <!-- Tricolor -->
        <div class="franja-tricolor">
          <div class="tricolor-azul"></div>
          <div class="tricolor-blanco"></div>
          <div class="tricolor-rojo"></div>
        </div>

        <!-- Header -->
        <div class="header">
          <div class="header-logo">
            <!-- Escudo Chileno Simplificado SVG -->
            <svg class="escudo-chile" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#0f2d59" />
              <path d="M 50 15 L 80 50 L 50 85 L 20 50 Z" fill="#c8102e" />
              <circle cx="50" cy="50" r="18" fill="#ffffff" />
              <polygon points="50,38 54,49 65,49 56,56 60,67 50,60 40,67 44,56 35,49 46,49" fill="#0f2d59" />
            </svg>
            <div class="logo-text">
              <h1>Servicio de Registro Civil</h1>
              <p>e Identificación · Chile</p>
            </div>
          </div>
          <div class="voucher-title">
            <h2>Comprobante Cita</h2>
            <p>Reserva de Atención Preferencial</p>
          </div>
        </div>

        <!-- Código -->
        <div class="code-banner">
          <div class="code-info">
            <h3>Código de Reserva</h3>
            <p>${codAtencion}</p>
          </div>
          <div class="code-date">
            <span>Fecha Emisión</span>
            <strong>${fechaEmision}</strong>
          </div>
        </div>

        <!-- Detalles -->
        <div class="info-grid">
          <div class="info-card highlight">
            <h4>Trámite Solicitado</h4>
            <p>Renovación / Obtención de Cédula de Identidad Chilena</p>
          </div>
          <div class="info-card">
            <h4>Fecha de la Cita</h4>
            <p>${fechaCita}</p>
          </div>
          <div class="info-card">
            <h4>Hora Bloque</h4>
            <p>${horaCita} hrs.</p>
          </div>
          <div class="info-card">
            <h4>Oficina de Atención</h4>
            <p>${nombreOficina}</p>
          </div>
          <div class="info-card">
            <h4>Dirección de Oficina</h4>
            <p>${direccionOficina}</p>
          </div>
          <div class="info-card">
            <h4>Solicitante (RUT)</h4>
            <p>${rutCiudadano}</p>
          </div>
          <div class="info-card">
            <h4>Correo de Confirmación</h4>
            <p>${emailCiudadano}</p>
          </div>
        </div>

        <!-- Instrucciones y QR -->
        <div class="footer-row">
          <div class="instructions">
            <h5>Instrucciones importantes</h5>
            <ul>
              <li><strong>Puntualidad:</strong> Preséntese al menos 10 minutos antes de la hora señalada.</li>
              <li><strong>Ingreso Preferencial:</strong> Al ingresar, diríjase al dispensador de números (tótem), ingrese su RUT e imprima su ticket de reserva.</li>
              <li><strong>Documentos:</strong> Lleve su cédula vencida o en mal estado. Si fue por extravío, informe al funcionario.</li>
              <li><strong>Vigencia:</strong> Este comprobante es válido únicamente para el día y bloque horario agendados.</li>
            </ul>
          </div>
          <div class="qr-code-box">
            <!-- QR code simulado con SVG -->
            <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="border: 2px solid #0f2d59; border-radius: 6px; padding: 4px;">
              <rect width="100" height="100" fill="#ffffff" />
              <!-- QR Patterns -->
              <rect x="5" y="5" width="25" height="25" fill="#0f2d59" />
              <rect x="10" y="10" width="15" height="15" fill="#ffffff" />
              <rect x="12" y="12" width="11" height="11" fill="#0f2d59" />

              <rect x="70" y="5" width="25" height="25" fill="#0f2d59" />
              <rect x="75" y="10" width="15" height="15" fill="#ffffff" />
              <rect x="77" y="12" width="11" height="11" fill="#0f2d59" />

              <rect x="5" y="70" width="25" height="25" fill="#0f2d59" />
              <rect x="10" y="75" width="15" height="15" fill="#ffffff" />
              <rect x="12" y="77" width="11" height="11" fill="#0f2d59" />

              <!-- Random Pixels -->
              <rect x="35" y="5" width="5" height="10" fill="#0f2d59" />
              <rect x="45" y="15" width="10" height="5" fill="#0f2d59" />
              <rect x="60" y="5" width="5" height="20" fill="#0f2d59" />
              <rect x="35" y="25" width="20" height="5" fill="#0f2d59" />

              <rect x="5" y="35" width="10" height="5" fill="#0f2d59" />
              <rect x="20" y="45" width="5" height="15" fill="#0f2d59" />
              <rect x="15" y="60" width="15" height="5" fill="#0f2d59" />

              <rect x="35" y="35" width="15" height="15" fill="#0f2d59" />
              <rect x="40" y="40" width="5" height="5" fill="#ffffff" />
              <rect x="55" y="40" width="10" height="10" fill="#0f2d59" />
              <rect x="45" y="55" width="20" height="5" fill="#0f2d59" />

              <rect x="75" y="35" width="15" height="5" fill="#0f2d59" />
              <rect x="80" y="45" width="15" height="15" fill="#0f2d59" />
              <rect x="70" y="65" width="10" height="5" fill="#0f2d59" />

              <rect x="35" y="70" width="5" height="20" fill="#0f2d59" />
              <rect x="45" y="80" width="15" height="15" fill="#0f2d59" />
              <rect x="65" y="75" width="15" height="5" fill="#0f2d59" />
              <rect x="70" y="85" width="25" height="10" fill="#0f2d59" />
            </svg>
            <span style="font-size: 8px; font-weight: 700; color: #64748b; letter-spacing: 0.5px;">VALIDACIÓN QR</span>
          </div>
        </div>

        <!-- Sello digital -->
        <div class="digital-seal">
          Documento electrónico firmado digitalmente. Código verificador: ${codAtencion}.<br>
          Servicio de Registro Civil e Identificación de Chile · Gobierno de Chile.
        </div>
      </div>

      <!-- Botón visible sólo en pantalla para forzar impresión si el navegador bloquea el auto-print -->
      <div class="no-print print-btn-container">
        <button class="print-btn" onclick="window.print()">Imprimir / Guardar PDF</button>
      </div>

      <script>
        // Disparar la impresión automáticamente al cargar
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
