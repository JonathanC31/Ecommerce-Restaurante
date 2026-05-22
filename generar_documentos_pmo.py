import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

OUTPUT_DIR = os.path.join("docs", "entregables_finales")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Data
PROYECTO = "CHOW YINN – Ecommerce"
INTEGRANTES = [
    "Jonathan Alejandro Carballo Gómez (Líder)",
    "Nicolas Mosquera Perdomo",
    "David Felipe Roa Rocha",
    "Amaydy Quimboa",
    "David Astudillo"
]
PROFESOR = "Eduardo Martinez Vidal"
MATERIA = "Ingeniería Orientada a Objetos"
FECHA = "20/05/2026"
CLIENTE = "Restaurante CHOW YINN – Algeciras, Huila, Colombia"
EMPRESA = "Universidad Surcolombiana – Facultad de Ingeniería"

def set_cell_background(cell, color_hex):
    """Set background color of a table cell."""
    tc = cell._tc
    tcPr = tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), color_hex)
    tcPr.append(shd)

def create_pmo_header(doc, title):
    # Header
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run("La Oficina de Proyectos de Informática PMO\n\n\n\n\n\n\n\n")
    run.bold = True
    run.font.size = Pt(14)
    
    # Title
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_title = p_title.add_run(title)
    run_title.bold = True
    run_title.font.size = Pt(24)
    
    p_proj = doc.add_paragraph()
    p_proj.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_proj = p_proj.add_run(f"\n{PROYECTO}\nFecha: {FECHA}\n\n\n\n\n\n\n\n\n")
    run_proj.font.size = Pt(16)
    
    p_foot = doc.add_paragraph()
    p_foot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_foot = p_foot.add_run(f"Profesor: {PROFESOR}\n{MATERIA}\n\nIntegrantes:\n" + "\n".join(INTEGRANTES))
    run_foot.font.size = Pt(12)
    
    doc.add_page_break()

def add_historial_versiones(doc):
    doc.add_heading("Historial de Versiones", level=1)
    table = doc.add_table(rows=2, cols=5)
    table.style = 'Table Grid'
    headers = ["Fecha", "Versión", "Autor", "Organización", "Descripción"]
    for i, h in enumerate(headers):
        cell = table.cell(0, i)
        cell.text = h
        set_cell_background(cell, "D9D9D9")
    
    row = table.rows[1].cells
    row[0].text = FECHA
    row[1].text = "1.1"
    row[2].text = "Jonathan Carballo Gómez"
    row[3].text = "USCO"
    row[4].text = "Actualización de arquitectura y servidor"
    doc.add_paragraph("\n")

def add_info_proyecto(doc):
    doc.add_heading("Información del Proyecto", level=1)
    table = doc.add_table(rows=5, cols=2)
    table.style = 'Table Grid'
    data = [
        ("Empresa / Organización", EMPRESA),
        ("Proyecto", PROYECTO),
        ("Fecha de preparación", FECHA),
        ("Cliente", CLIENTE),
        ("Gerente / Líder de Proyecto", INTEGRANTES[0])
    ]
    for i, (k, v) in enumerate(data):
        table.cell(i, 0).text = k
        set_cell_background(table.cell(i, 0), "D9D9D9")
        table.cell(i, 1).text = v
    doc.add_paragraph("\n")

# --- DOC 1: Proceso ---
def gen_doc1():
    doc = Document()
    create_pmo_header(doc, "Documento explicando el proceso de desarrollo")
    add_historial_versiones(doc)
    add_info_proyecto(doc)
    
    doc.add_heading("Proceso de Desarrollo: Cascada Específico", level=1)
    doc.add_paragraph("Para este proyecto se mantiene la metodología de Cascada (Waterfall), pero con una especificación mucho más detallada de sus fases, integrando las nuevas arquitecturas de servidor y despliegue (Backend en Spring Boot, Frontend en Angular).")
    doc.add_paragraph("El diagrama visual del proceso ha sido modelado en Figma para mayor precisión.")
    
    doc.add_heading("Esquema gráfico (Figma)", level=2)
    doc.add_paragraph("El diagrama de proceso se encuentra en nuestro espacio de trabajo de Figma y detalla la secuencia estricta: Requisitos -> Diseño -> Implementación -> Pruebas -> Despliegue Local.")
    
    fases = [
        ("Fase 1: Análisis de Requisitos", "Jonathan Carballo", "Levantamiento de requerimientos funcionales y no funcionales, incluyendo infraestructura (Tomcat embebido, Angular CLI).", "Documento de requerimientos aprobado."),
        ("Fase 2: Diseño del Sistema", "Nicolas Mosquera", "Diseño de la arquitectura cliente-servidor (SPA + API REST). Diseño de BD MySQL y UI en Figma.", "Prototipos, SAD, Diagramas UML, MER."),
        ("Fase 3: Implementación", "David Roa & Amaydy Quimboa", "Codificación del Backend (Java/Spring Boot) en el puerto 8080 y Frontend (Angular) en el puerto 4200. Integración de Mercado Pago Sandbox.", "Código fuente funcional."),
        ("Fase 4: Verificación y Pruebas", "David Astudillo", "Pruebas de endpoints con Postman. Pruebas de integración del flujo de pagos y carrito de compras.", "Reporte de pruebas."),
        ("Fase 5: Despliegue y Mantenimiento", "Jonathan Carballo", "Despliegue en entorno local. Configuración de base de datos local y Tomcat. Ejecución simultánea de servicios.", "Plataforma operativa localmente.")
    ]
    
    for f_titulo, f_rol, f_act, f_ent in fases:
        doc.add_heading(f_titulo, level=2)
        table = doc.add_table(rows=3, cols=2)
        table.style = 'Table Grid'
        table.cell(0, 0).text = "Responsable / Rol"
        table.cell(0, 1).text = f_rol
        table.cell(1, 0).text = "Actividades y Tareas"
        table.cell(1, 1).text = f_act
        table.cell(2, 0).text = "Entregable"
        table.cell(2, 1).text = f_ent
        for i in range(3):
            set_cell_background(table.cell(i, 0), "D9D9D9")
        doc.add_paragraph("\n")
        
    doc.save(os.path.join(OUTPUT_DIR, "01_Proceso_Desarrollo.docx"))

# --- DOC 2: Prototipo ---
def gen_doc2():
    doc = Document()
    create_pmo_header(doc, "Prototipo de la Solución (Figma)")
    add_historial_versiones(doc)
    add_info_proyecto(doc)
    
    doc.add_heading("Prototipo Interactivo", level=1)
    doc.add_paragraph("El prototipo interactivo y los esquemas gráficos (incluyendo el diagrama del proceso de desarrollo en cascada) han sido construidos en Figma.")
    
    doc.add_heading("Enlace de Acceso", level=2)
    doc.add_paragraph("URL: [Enlace al proyecto de Figma de CHOW YINN]")
    
    doc.add_heading("Pantallas Diseñadas", level=2)
    table = doc.add_table(rows=5, cols=2)
    table.style = 'Table Grid'
    headers = ["Sección", "Descripción"]
    for i, h in enumerate(headers):
        table.cell(0, i).text = h
        set_cell_background(table.cell(0, i), "D9D9D9")
        
    data = [
        ("Cliente - Home", "Catálogo de productos divididos por categorías, con botón para agregar al carrito."),
        ("Cliente - Checkout", "Formulario de datos de entrega y selección de método de pago (Mercado Pago)."),
        ("Cocina", "Pantalla de visualización de pedidos en estado PREPARANDO con recarga automática."),
        ("Admin - Inventario", "Panel de gestión de insumos, entradas, salidas y recetas vinculadas.")
    ]
    for i, (sec, desc) in enumerate(data, start=1):
        table.cell(i, 0).text = sec
        table.cell(i, 1).text = desc

    doc.save(os.path.join(OUTPUT_DIR, "02_Prototipo_Solucion.docx"))

# --- DOC 3: Propuesta ---
def gen_doc3():
    doc = Document()
    create_pmo_header(doc, "Propuesta de Servicios Profesionales")
    add_historial_versiones(doc)
    add_info_proyecto(doc)
    
    doc.add_heading("Resumen Ejecutivo", level=1)
    doc.add_paragraph("El proyecto surge de la necesidad del restaurante de tener presencia digital en un entorno local donde ningún establecimiento similar cuenta con plataforma web. El objetivo del proyecto es desarrollar una plataforma de comercio electrónico (ecommerce) funcional que permita al restaurante publicar su menú, gestionar productos e inventario, y procesar pedidos y pagos en línea mediante integración con Mercado Pago.")
    
    doc.add_heading("Nuestro Entendimiento", level=1)
    doc.add_paragraph("El Restaurante CHOW YINN opera en Algeciras (Huila) y depende del boca a boca. Requiere un canal digital que solucione la visibilidad reducida y permita pedidos en línea eficientes de forma local.")
    
    doc.add_heading("Alcance (Actualizado con Servidor y Despliegue)", level=1)
    doc.add_paragraph("Módulos incluidos:")
    doc.add_paragraph("- Autenticación y autorización (Spring Security + JWT)")
    doc.add_paragraph("- Catálogo, Carrito y Pagos (Mercado Pago)")
    doc.add_paragraph("- Administración (CRUD productos, inventario, reportes)")
    doc.add_paragraph("- Servidor y Despliegue: El backend se ejecuta en un servidor Tomcat embebido en Spring Boot (puerto 8080). El frontend Angular se sirve localmente (puerto 4200). La base de datos MySQL se aloja en localhost:3306. El despliegue actual es en entorno local para desarrollo y demostración.")
    
    doc.add_heading("Capacidades Técnicas", level=1)
    table = doc.add_table(rows=6, cols=2)
    table.style = 'Table Grid'
    caps = [
        ("Frontend", "Angular 18.2, PrimeNG, TypeScript"),
        ("Backend", "Java 17, Spring Boot 3.3.3"),
        ("Servidor de App", "Tomcat Embebido (Backend), Node/Angular CLI (Frontend)"),
        ("Seguridad", "Spring Security, JWT, Google OAuth2"),
        ("Base de Datos", "MySQL (restaurantebd)"),
        ("Integraciones", "Mercado Pago (Sandbox)")
    ]
    for i, (k, v) in enumerate(caps):
        table.cell(i, 0).text = k
        set_cell_background(table.cell(i, 0), "D9D9D9")
        table.cell(i, 1).text = v

    doc.save(os.path.join(OUTPUT_DIR, "03_Propuesta.docx"))

# --- DOC 4: Requerimientos ---
def gen_doc4():
    doc = Document()
    create_pmo_header(doc, "Documento de Requerimientos de Software")
    add_historial_versiones(doc)
    add_info_proyecto(doc)
    
    doc.add_heading("1. Propósito", level=1)
    doc.add_paragraph("Este documento especifica los requerimientos de software para el sistema CHOW YINN Ecommerce. Cubre la totalidad del sistema, incluyendo el módulo de frontend (Angular 18), el backend (Java Spring Boot), la base de datos (MySQL) y los mecanismos de seguridad (Spring Security + JWT).")
    
    doc.add_heading("7. Requerimientos Funcionales", level=1)
    table = doc.add_table(rows=19, cols=6)
    table.style = 'Table Grid'
    headers = ["ID", "Nombre", "Descripción", "Entradas", "Salidas", "Prioridad"]
    for i, h in enumerate(headers):
        table.cell(0, i).text = h
        set_cell_background(table.cell(0, i), "D9D9D9")
        
    reqs = [
        ("RF-001", "Registrar usuarios", "Permitir crear una cuenta.", "Nombre, email, password", "Usuario registrado", "Crítica"),
        ("RF-002", "Iniciar sesión", "Permitir acceso al sistema.", "Email, password", "Inicio de sesión", "Crítica"),
        ("RF-003", "Gestionar roles", "Diferenciar admin/usuario.", "Usuario, rol", "Acceso según rol", "Crítica"),
        ("RF-004", "Visualizar inicio", "Consultar información general.", "Petición", "Página de inicio", "Alta"),
        ("RF-005", "Consultar menú", "Visualizar los productos.", "Petición", "Lista de productos", "Crítica"),
        ("RF-006", "Detalle producto", "Ver información detallada.", "ID producto", "Detalle del producto", "Alta"),
        ("RF-007", "Agregar a carrito", "Añadir productos.", "ID, cantidad", "Producto en carrito", "Crítica"),
        ("RF-008", "Modificar carrito", "Cambiar cantidad.", "ID, nueva cantidad", "Carrito actualizado", "Alta"),
        ("RF-009", "Eliminar del carrito", "Retirar productos.", "ID producto", "Producto eliminado", "Alta"),
        ("RF-010", "Realizar pedido", "Confirmar compra.", "Carrito, datos", "Pedido registrado", "Crítica"),
        ("RF-011", "Pago en línea", "Pagar pedido.", "Monto, método", "Pago realizado", "Crítica"),
        ("RF-012", "Confirmar pedido", "Informar al usuario.", "Pedido generado", "Confirmación", "Alta"),
        ("RF-013", "Crear productos", "Registrar nuevos productos.", "Datos producto", "Producto creado", "Crítica"),
        ("RF-014", "Editar productos", "Actualizar información.", "Nuevos datos", "Producto actualizado", "Alta"),
        ("RF-015", "Eliminar productos", "Retirar productos.", "ID producto", "Producto eliminado", "Alta"),
        ("RF-016", "Consultar pedidos", "Revisar pedidos.", "Petición", "Lista de pedidos", "Alta"),
        ("RF-017", "Gestionar inventario", "Controlar disponibilidad.", "Insumos, cantidades", "Inventario actualizado", "Alta"),
        ("RF-018", "Generar reportes", "Consultar métricas.", "Fechas, filtros", "Reporte generado", "Media")
    ]
    for i, r in enumerate(reqs, start=1):
        for j, val in enumerate(r):
            table.cell(i, j).text = val
            
    doc.add_heading("10. Requerimientos No Funcionales (Incluyendo Despliegue)", level=1)
    doc.add_paragraph("RNF-001: El tiempo de respuesta de la API no debe superar los 2 segundos.")
    doc.add_paragraph("RNF-002: El sistema debe utilizar JWT para la protección de endpoints.")
    doc.add_paragraph("RNF-003 [Infraestructura]: El backend debe ejecutarse en un contenedor Tomcat embebido provisto por Spring Boot en el puerto 8080 local.")
    doc.add_paragraph("RNF-004 [Infraestructura]: El frontend debe correr de forma independiente (Standalone) usando el servidor de desarrollo de Angular en el puerto 4200 local.")
    doc.add_paragraph("RNF-005 [Infraestructura]: El sistema debe conectarse a un motor MySQL local en el puerto 3306 usando Hibernate para auto-generación de esquemas.")

    doc.save(os.path.join(OUTPUT_DIR, "04_Requerimientos.docx"))

# --- DOC 5: Historias ---
def gen_doc5():
    doc = Document()
    create_pmo_header(doc, "Historias de Usuario y Criterios de Aceptación")
    
    doc.add_heading("Historias de Usuario", level=1)
    table = doc.add_table(rows=7, cols=5)
    table.style = 'Table Grid'
    headers = ["Identificador", "Rol", "Característica / Funcionalidad", "Razón / Resultado", "Criterios de Aceptación"]
    for i, h in enumerate(headers):
        table.cell(0, i).text = h
        set_cell_background(table.cell(0, i), "D9D9D9")
        
    hus = [
        ("HU-001", "Cliente", "Necesito registrarme e iniciar sesión", "Para guardar mi historial de pedidos", "1. Registro exitoso con datos válidos.\n2. Acceso denegado con clave errónea."),
        ("HU-002", "Cliente", "Necesito ver el menú de productos", "Para decidir qué ordenar", "1. Muestra productos por categoría.\n2. Muestra precio y disponibilidad."),
        ("HU-003", "Cliente", "Necesito un carrito de compras", "Para agrupar mi pedido", "1. Suma correcta del total e IVA.\n2. Permite cambiar cantidades."),
        ("HU-004", "Cliente", "Necesito pagar en línea", "Para confirmar mi orden sin efectivo", "1. Redirige a MercadoPago.\n2. Aprueba pago y genera factura."),
        ("HU-005", "Admin", "Necesito un panel CRUD de productos", "Para mantener el menú actualizado", "1. Creación exitosa guarda en BD.\n2. Edición actualiza la vista del cliente."),
        ("HU-006", "Admin", "Necesito ver pedidos en cocina", "Para preparar y entregar los platos", "1. Refresco automático cada 10s.\n2. Permite marcar como 'Entregado'.")
    ]
    for i, r in enumerate(hus, start=1):
        for j, val in enumerate(r):
            table.cell(i, j).text = val

    doc.save(os.path.join(OUTPUT_DIR, "05_Historias_Usuario.docx"))

# --- DOC 6: Backlog ---
def gen_doc6():
    doc = Document()
    create_pmo_header(doc, "Pila del Producto (Product Backlog)")
    
    doc.add_heading("Product Backlog", level=1)
    table = doc.add_table(rows=7, cols=6)
    table.style = 'Table Grid'
    headers = ["ID", "Enunciado de la Historia", "Estado", "Dimensión", "Iteración", "Prioridad"]
    for i, h in enumerate(headers):
        table.cell(0, i).text = h
        set_cell_background(table.cell(0, i), "D9D9D9")
        
    items = [
        ("PB-01", "Configurar estructura Base Spring Boot y Angular", "Terminado", "13", "Sprint 1", "Alta"),
        ("PB-02", "Implementar Seguridad JWT y Usuarios", "Terminado", "8", "Sprint 1", "Alta"),
        ("PB-03", "Desarrollar CRUD de Productos e Inventario", "Terminado", "8", "Sprint 2", "Alta"),
        ("PB-04", "Desarrollar Carrito y Catálogo de Cliente", "Terminado", "5", "Sprint 2", "Alta"),
        ("PB-05", "Integrar Pasarela Mercado Pago", "Terminado", "13", "Sprint 3", "Crítica"),
        ("PB-06", "Panel de Cocina y Reportes", "Terminado", "5", "Sprint 3", "Media")
    ]
    for i, r in enumerate(items, start=1):
        for j, val in enumerate(r):
            table.cell(i, j).text = val

    doc.save(os.path.join(OUTPUT_DIR, "06_Pila_Producto.docx"))

# --- DOC 7: Tareas ---
def gen_doc7():
    doc = Document()
    create_pmo_header(doc, "Lista de Tareas (Sprint Backlog)")
    
    doc.add_heading("Lista de Tareas Técnicas", level=1)
    table = doc.add_table(rows=7, cols=5)
    table.style = 'Table Grid'
    headers = ["Elemento Backlog", "Tarea", "Estimación (Hrs)", "Responsable", "Estado"]
    for i, h in enumerate(headers):
        table.cell(0, i).text = h
        set_cell_background(table.cell(0, i), "D9D9D9")
        
    tareas = [
        ("PB-02", "Configurar SecurityConfig y Filtros JWT", "8", "Jonathan", "Terminado"),
        ("PB-02", "Crear LoginComponent y AuthService en Angular", "6", "Nicolas", "Terminado"),
        ("PB-03", "Crear Entidad, Repo y Controller de Productos", "4", "David Roa", "Terminado"),
        ("PB-04", "Desarrollar lógica localStorage para Carrito", "5", "Amaydy", "Terminado"),
        ("PB-05", "Implementar VentaService con SDK MercadoPago", "10", "Jonathan", "Terminado"),
        ("PB-06", "Crear dashboard de reportes con gráficos", "6", "David Astudillo", "Terminado")
    ]
    for i, r in enumerate(tareas, start=1):
        for j, val in enumerate(r):
            table.cell(i, j).text = val

    doc.save(os.path.join(OUTPUT_DIR, "07_Lista_Tareas.docx"))

# --- DOC 8: SAD ---
def gen_doc8():
    doc = Document()
    create_pmo_header(doc, "Software Architecture Document (SAD)")
    
    doc.add_heading("1. Introducción", level=1)
    doc.add_paragraph("Este documento proporciona una apreciación global arquitectónica comprensiva del sistema CHOW YINN Ecommerce, usando diferentes vistas para ilustrar los aspectos del sistema.")
    
    doc.add_heading("2. Representación Arquitectónica", level=1)
    doc.add_paragraph("Se utiliza una arquitectura de N-Capas con el patrón Cliente-Servidor. El cliente es una Single Page Application (SPA) en Angular, y el servidor es una API REST construida en Java Spring Boot.")
    
    doc.add_heading("5. Vista Lógica", level=1)
    doc.add_paragraph("Backend (Spring Boot): Se divide en capas Controllers (@RestController), Services (@Service para lógica de negocio), y Repositories (Spring Data JPA).")
    doc.add_paragraph("Frontend (Angular): Componentes standalone, guards (AdminGuard), interceptores HTTP (AuthInterceptor) y servicios para consumo de APIs.")
    
    doc.add_heading("7. Vista de Implementación / Despliegue", level=1)
    doc.add_paragraph("La arquitectura de despliegue actual se basa en un ecosistema local integral:")
    doc.add_paragraph("- Servidor Web/API: Tomcat embebido en la aplicación Spring Boot, escuchando en el puerto 8080 de localhost.")
    doc.add_paragraph("- Servidor Frontend: Servidor de desarrollo Node/Angular CLI sirviendo la aplicación en el puerto 4200.")
    doc.add_paragraph("- Base de Datos: Servidor MySQL ejecutándose de forma local en el puerto 3306 (restaurantebd).")
    doc.add_paragraph("- Servicios Externos: Conexión HTTPS a la API de Mercado Pago y validación OAuth2 contra Google.")

    doc.save(os.path.join(OUTPUT_DIR, "08_SAD.docx"))

# --- DOC 9: UML ---
def gen_doc9():
    doc = Document()
    create_pmo_header(doc, "Diagramas UML")
    
    doc.add_heading("1. Diagrama de Clases", level=1)
    doc.add_paragraph("Las clases principales del dominio del Backend Java incluyen:")
    doc.add_paragraph("- AppUser (id, nombre, email, password, roles)")
    doc.add_paragraph("- Producto (id, nombre, categoria, precioUnitario)")
    doc.add_paragraph("- Venta (id, fecha, total, metodoPago, estado, factura)")
    doc.add_paragraph("- DetalleVenta (id, cantidad, subtotal, producto)")
    doc.add_paragraph("- InventarioItem (id, nombre, cantidadDisponible)")
    doc.add_paragraph("- RecetaItem (id, producto, inventarioItem, cantidadUsada)")
    doc.add_paragraph("(Nota: Ver diagrama estructural en Figma o generador UML adjunto).")
    
    doc.add_heading("2. Diagrama de Componentes y Despliegue", level=1)
    doc.add_paragraph("Navegador Cliente -> Angular (Puerto 4200) -> HTTP/JSON -> Spring Boot Tomcat (Puerto 8080) -> JDBC -> MySQL (Puerto 3306).")
    doc.add_paragraph("Spring Boot -> HTTPS -> Mercado Pago API.")
    
    doc.save(os.path.join(OUTPUT_DIR, "09_UML.docx"))

# --- DOC 10: MER ---
def gen_doc10():
    doc = Document()
    create_pmo_header(doc, "Modelo Relacional de Base de Datos")
    
    doc.add_heading("Lógica de Datos", level=1)
    doc.add_paragraph("El esquema de la base de datos MySQL ('restaurantebd') es generado automáticamente por Hibernate (ddl-auto=update) en base a las entidades JPA. La base de datos sigue el modelo relacional tradicional con llaves primarias y foráneas (foreign keys).")
    
    doc.add_heading("Tablas Principales y Relaciones", level=2)
    table = doc.add_table(rows=6, cols=3)
    table.style = 'Table Grid'
    headers = ["Tabla", "Descripción / Columnas Clave", "Relación"]
    for i, h in enumerate(headers):
        table.cell(0, i).text = h
        set_cell_background(table.cell(0, i), "D9D9D9")
        
    tablas = [
        ("users", "id, email, password, nombre", "1 a Muchos con ventas"),
        ("productos", "id, nombre, precioUnitario, categoria", "1 a Muchos con detalles_venta"),
        ("ventas", "id, fecha, total, estado, metodoPago", "1 a 1 con facturas, 1 a Muchos con detalles"),
        ("detalles_venta", "id, cantidad, subtotal", "FK venta_id, FK producto_id"),
        ("inventario_items", "id, nombre, cantidadDisponible", "1 a Muchos con receta_items")
    ]
    for i, r in enumerate(tablas, start=1):
        for j, val in enumerate(r):
            table.cell(i, j).text = val

    doc.save(os.path.join(OUTPUT_DIR, "10_Modelo_Relacional.docx"))

if __name__ == "__main__":
    gen_doc1()
    gen_doc2()
    gen_doc3()
    gen_doc4()
    gen_doc5()
    gen_doc6()
    gen_doc7()
    gen_doc8()
    gen_doc9()
    gen_doc10()
    print("Archivos DOCX generados con formato PMO.")
