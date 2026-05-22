import os
import base64
import urllib.request
import json
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH

# Datos generales
PROYECTO = "CHOW YINN"
INTEGRANTES = [
    "Jonathan Alejandro Carballo Gómez (Líder)",
    "Nicolas Mosquera Perdomo",
    "David Felipe Roa Rocha",
    "Amaydy Quimboa",
    "David Astudillo"
]
PROFESOR = "Eduardo Martinez Vidal"
MATERIA = "Ingeniería Orientada a Objetos"
FECHA = "Mayo 2026"
OUTPUT_DIR = os.path.join("docs", "entregables_finales")

def add_header(doc, title):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run = p.add_run(f"UNIVERSIDAD SURCOLOMBIANA\n{MATERIA}\n{PROFESOR}\n\n")
    run.bold = True
    run.font.size = Pt(14)
    
    title_p = doc.add_heading(title, level=1)
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    p2 = doc.add_paragraph()
    p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run2 = p2.add_run(f"\nProyecto: {PROYECTO}\n\nIntegrantes:\n" + "\n".join(INTEGRANTES) + f"\n\n{FECHA}")
    run2.font.size = Pt(12)
    doc.add_page_break()

def get_mermaid_image(mermaid_code, filename):
    try:
        # Encode mermaid code to base64
        import zlib
        encoded = base64.b64encode(mermaid_code.encode('utf-8')).decode('utf-8')
        url = f"https://mermaid.ink/img/{encoded}"
        img_path = os.path.join(OUTPUT_DIR, filename)
        
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(img_path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        return img_path
    except Exception as e:
        print(f"Error generando diagrama {filename}: {e}")
        return None

def gen_doc1():
    doc = Document()
    add_header(doc, "1. Proceso de Desarrollo")
    
    doc.add_heading("Metodología: Scrum", level=2)
    doc.add_paragraph(
        "Para el desarrollo de la plataforma web CHOW YINN, se decidió migrar de una metodología de Cascada a una "
        "metodología ágil (Scrum). Esta decisión se tomó para permitir una mayor flexibilidad, iteración rápida, "
        "y adaptabilidad a los requerimientos cambiantes."
    )
    
    doc.add_heading("Fases y Actividades", level=3)
    doc.add_paragraph("1. Sprint Planning: Se define el Sprint Goal y se seleccionan las tareas del Product Backlog para el Sprint Backlog.")
    doc.add_paragraph("2. Ejecución del Sprint: Desarrollo iterativo e incremental del producto, integrando Frontend (Angular), Backend (Spring Boot) y BD (MySQL).")
    doc.add_paragraph("3. Daily Scrum: Sincronización diaria del equipo para evaluar progreso.")
    doc.add_paragraph("4. Sprint Review: Presentación de la funcionalidad completada.")
    doc.add_paragraph("5. Sprint Retrospective: Análisis de mejoras para el siguiente ciclo.")
    
    doc.add_heading("Roles", level=3)
    doc.add_paragraph("- Scrum Master: Jonathan Alejandro Carballo Gómez")
    doc.add_paragraph("- Product Owner: Leonardo Carballo (Cliente / Negocio)")
    doc.add_paragraph("- Development Team: Nicolas Mosquera, David Roa, Amaydy Quimboa, David Astudillo")
    
    doc.add_heading("Esquema Gráfico del Proceso", level=3)
    mermaid = """
    graph TD
    A[Product Backlog] --> B(Sprint Planning)
    B --> C[Sprint Backlog]
    C --> D{Sprint Execution}
    D -->|Daily Scrum| D
    D --> E(Sprint Review)
    E --> F(Sprint Retrospective)
    F --> G[Incremento Potencialmente Entregable]
    """
    img = get_mermaid_image(mermaid, "scrum.png")
    if img:
        doc.add_picture(img, width=Inches(6))
    
    doc.save(os.path.join(OUTPUT_DIR, "01_Proceso_Desarrollo.docx"))

def gen_doc2():
    doc = Document()
    add_header(doc, "2. Prototipo de la Solución")
    doc.add_paragraph("El prototipo interactivo de la solución ha sido diseñado utilizando la herramienta colaborativa Figma.")
    doc.add_paragraph("Debido a la naturaleza visual y de navegación del prototipo, se ha centralizado en el siguiente enlace de Figma para su revisión:")
    doc.add_paragraph("Enlace al Prototipo: [Figma - CHOW YINN Ecommerce]")
    doc.add_paragraph("(Nota: El diseño incluye pantallas para la vista de cliente, menú de productos, carrito de compras, integración de pagos y panel de administrador).")
    doc.save(os.path.join(OUTPUT_DIR, "02_Prototipo_Solucion.docx"))

def gen_doc3():
    doc = Document()
    add_header(doc, "3. Propuesta de Servicios Profesionales")
    
    doc.add_heading("Resumen Ejecutivo", level=2)
    doc.add_paragraph(
        "El proyecto surge de la necesidad de CHOW YINN de tener presencia digital en un entorno local. "
        "El objetivo es desarrollar una plataforma de comercio electrónico funcional que permita gestionar productos, "
        "inventario y procesar pagos en línea mediante Mercado Pago."
    )
    
    doc.add_heading("Alcance Actualizado (Servidor y Despliegue)", level=2)
    doc.add_paragraph(
        "La solución actual está compuesta por una arquitectura Cliente-Servidor (SPA + API REST). El alcance abarca:"
    )
    doc.add_paragraph("- Autenticación y Autorización (Spring Security + JWT).")
    doc.add_paragraph("- Catálogo, Carrito y Pasarela de Pagos (Mercado Pago).")
    doc.add_paragraph("- Servidor Local: El Backend ha sido desarrollado en Spring Boot utilizando un servidor Tomcat embebido (puerto 8080).")
    doc.add_paragraph("- Frontend: Desarrollado en Angular 18, ejecutándose localmente (puerto 4200).")
    doc.add_paragraph("- Base de Datos: MySQL ejecutándose en el entorno local (localhost:3306) con la base de datos 'restaurantebd'.")
    doc.add_paragraph("- Despliegue actual: Hasta la fecha, el despliegue es estrictamente en entorno local para pruebas y demostración, conectando ambos servicios locales a la pasarela de pagos en modo sandbox.")
    
    doc.add_heading("Capacidades Técnicas", level=2)
    doc.add_paragraph("Frontend: Angular 18, PrimeNG, TypeScript, HTML/CSS.")
    doc.add_paragraph("Backend: Java 17/21, Spring Boot, Spring Security.")
    doc.add_paragraph("Base de Datos: MySQL, Hibernate/JPA.")
    
    doc.save(os.path.join(OUTPUT_DIR, "03_Propuesta.docx"))

def gen_doc4():
    doc = Document()
    add_header(doc, "4. Documento de Requerimientos")
    
    doc.add_heading("Requerimientos Funcionales", level=2)
    doc.add_paragraph("RF01: El sistema debe permitir el registro e inicio de sesión de usuarios (Admin y Cliente).")
    doc.add_paragraph("RF02: El sistema debe mostrar un catálogo de productos (platos) con imágenes, nombre, descripción y precio.")
    doc.add_paragraph("RF03: El sistema debe permitir al usuario agregar productos a un carrito de compras.")
    doc.add_paragraph("RF04: El sistema debe procesar transacciones de pago utilizando la API de Mercado Pago.")
    doc.add_paragraph("RF05: El sistema debe permitir al administrador gestionar (CRUD) los productos del menú.")
    
    doc.add_heading("Requerimientos No Funcionales y Despliegue", level=2)
    doc.add_paragraph("RNF01: La aplicación Backend debe estar construida en Spring Boot y ejecutarse en un contenedor Tomcat embebido.")
    doc.add_paragraph("RNF02: La interfaz de usuario debe estar construida en Angular 18 y ser responsiva (Single Page Application).")
    doc.add_paragraph("RNF03: La persistencia de datos debe manejarse mediante MySQL utilizando Hibernate (DDL-auto update).")
    doc.add_paragraph("RNF04: La comunicación entre Frontend y Backend debe realizarse vía peticiones HTTP utilizando tokens JWT en los headers de autorización.")
    
    doc.save(os.path.join(OUTPUT_DIR, "04_Requerimientos.docx"))

def gen_doc5():
    doc = Document()
    add_header(doc, "5. Historias de Usuario")
    
    historias = [
        ("HU01", "Como cliente, quiero poder registrarme en la plataforma para poder realizar pedidos y guardar mi historial."),
        ("HU02", "Como cliente, quiero ver el catálogo completo de platos para decidir qué voy a ordenar."),
        ("HU03", "Como cliente, quiero agregar y quitar productos de mi carrito para ajustar mi pedido antes de pagar."),
        ("HU04", "Como cliente, quiero pagar con diferentes medios de pago a través de Mercado Pago para que mi transacción sea segura."),
        ("HU05", "Como administrador, quiero gestionar los productos (crear, editar, eliminar) para mantener el menú actualizado."),
        ("HU06", "Como administrador, quiero poder ver la lista de pedidos realizados para despacharlos.")
    ]
    
    for hu_id, desc in historias:
        doc.add_heading(f"Historia {hu_id}", level=3)
        doc.add_paragraph(desc)
        doc.add_paragraph("Criterios de aceptación: [...] (Definidos según estándar).")
        
    doc.save(os.path.join(OUTPUT_DIR, "05_Historias_Usuario.docx"))

def gen_doc6():
    doc = Document()
    add_header(doc, "6. Pila del Producto (Product Backlog)")
    
    doc.add_heading("Product Backlog Priorizado", level=2)
    items = [
        "1. Sistema de autenticación con Spring Security y JWT (Alta)",
        "2. Diseño de la base de datos MySQL (Alta)",
        "3. Configuración del proyecto Angular y enrutamiento (Alta)",
        "4. Visualización del catálogo de productos (Alta)",
        "5. Lógica del Carrito de compras (Media)",
        "6. Integración con Mercado Pago Sandbox (Media)",
        "7. Panel de Administración CRUD de productos (Media)",
        "8. Envío de correos / notificaciones de pedidos (Baja)"
    ]
    
    for item in items:
        doc.add_paragraph(item)
        
    doc.save(os.path.join(OUTPUT_DIR, "06_Pila_Producto.docx"))

def gen_doc7():
    doc = Document()
    add_header(doc, "7. Lista de Tareas")
    
    doc.add_heading("Tareas Técnicas (Sprint Backlog representativo)", level=2)
    tareas = [
        "[Backend] Configurar dependencias en pom.xml (JPA, Web, Security, MySQL).",
        "[Backend] Configurar application.properties (URL de BD, JWT Secret).",
        "[Backend] Crear Entidad Usuario y Rol.",
        "[Backend] Implementar JwtProvider y filtros de seguridad.",
        "[Backend] Exponer controlador REST para Catálogo.",
        "[Frontend] Crear componentes (Header, Footer, Home, Products).",
        "[Frontend] Implementar servicio Angular HttpClient para consumir la API de productos.",
        "[Frontend] Crear guardia de rutas (AuthGuard).",
        "[Integración] Configurar SDK de Mercado Pago con Access Token de prueba.",
        "[Integración] Realizar pruebas end-to-end (Postman y navegador)."
    ]
    
    for t in tareas:
        doc.add_paragraph(f"- {t}")
        
    doc.save(os.path.join(OUTPUT_DIR, "07_Lista_Tareas.docx"))

def gen_doc8():
    doc = Document()
    add_header(doc, "8. Software Architecture Document (SAD)")
    
    doc.add_heading("Visión General", level=2)
    doc.add_paragraph("La arquitectura de CHOW YINN está basada en un patrón Cliente-Servidor (SPA + API REST).")
    
    doc.add_heading("Capa de Presentación (Frontend)", level=3)
    doc.add_paragraph("Desarrollada en Angular. Utiliza servicios para comunicarse con el Backend. Componentes aislados y reutilizables.")
    
    doc.add_heading("Capa de Negocio e Integración (Backend)", level=3)
    doc.add_paragraph("Desarrollada en Spring Boot. Separada en Controladores (REST API), Servicios (Lógica de Negocio), y Repositorios (Data Access).")
    
    doc.add_heading("Capa de Datos", level=3)
    doc.add_paragraph("Base de datos relacional MySQL. Se utiliza Hibernate como ORM.")
    
    doc.add_heading("Servidor y Despliegue Actual", level=3)
    doc.add_paragraph("El entorno de desarrollo y pruebas se basa en un servidor Tomcat embebido en la aplicación Spring Boot, corriendo en el puerto 8080 local. Angular se sirve de forma local mediante Node.js en el puerto 4200. MySQL se aloja localmente.")
    
    doc.save(os.path.join(OUTPUT_DIR, "08_SAD.docx"))

def gen_doc9():
    doc = Document()
    add_header(doc, "9. Diagramas UML")
    
    # Clases
    doc.add_heading("Diagrama de Clases", level=2)
    mermaid_clases = """
    classDiagram
      class User {
        +Long id
        +String username
        +String password
      }
      class Product {
        +Long id
        +String name
        +Double price
      }
      class Order {
        +Long id
        +Date date
        +Double total
      }
      User "1" -- "*" Order
      Order "*" -- "*" Product
    """
    img1 = get_mermaid_image(mermaid_clases, "uml_clases.png")
    if img1: doc.add_picture(img1, width=Inches(5))
    
    # Secuencia
    doc.add_heading("Diagrama de Secuencia (Pago)", level=2)
    mermaid_secuencia = """
    sequenceDiagram
      participant C as Cliente
      participant F as Frontend (Angular)
      participant B as Backend (Spring)
      participant M as MercadoPago
      C->>F: Confirmar Compra
      F->>B: POST /api/orders
      B->>M: Generar Preferencia de Pago
      M-->>B: Preference ID
      B-->>F: URL de Pago
      F-->>C: Redirigir a MercadoPago
    """
    img2 = get_mermaid_image(mermaid_secuencia, "uml_secuencia.png")
    if img2: doc.add_picture(img2, width=Inches(5.5))
    
    # Componentes
    doc.add_heading("Diagrama de Componentes", level=2)
    mermaid_comp = """
    graph LR
      A[Navegador del Cliente] -->|HTTP / REST| B[Servidor Angular :4200]
      A -->|HTTP / REST| C[API Spring Boot :8080]
      C -->|JDBC| D[(MySQL Local)]
      C -->|API| E[Mercado Pago]
    """
    img3 = get_mermaid_image(mermaid_comp, "uml_componentes.png")
    if img3: doc.add_picture(img3, width=Inches(6))
    
    doc.save(os.path.join(OUTPUT_DIR, "09_UML.docx"))

def gen_doc10():
    doc = Document()
    add_header(doc, "10. Modelo Relacional de Base de Datos")
    
    doc.add_heading("Lógica de Datos y Esquema", level=2)
    doc.add_paragraph("La persistencia del e-commerce se maneja mediante MySQL con el framework Hibernate que genera automáticamente las tablas.")
    
    doc.add_heading("Tablas Principales", level=3)
    doc.add_paragraph("1. user: Almacena credenciales de acceso.")
    doc.add_paragraph("2. user_authority: Tabla intermedia para roles (ADMIN, USER).")
    doc.add_paragraph("3. product: Información del catálogo (nombre, precio, descripción).")
    doc.add_paragraph("4. category: Clasificación de productos.")
    doc.add_paragraph("5. order: Pedidos realizados por clientes.")
    
    mermaid_er = """
    erDiagram
        USER ||--o{ ORDER : places
        USER {
            int id
            string email
        }
        ORDER ||--|{ PRODUCT : contains
        ORDER {
            int id
            float total
        }
        PRODUCT }|--|| CATEGORY : belongs_to
        PRODUCT {
            int id
            string name
            float price
        }
    """
    img = get_mermaid_image(mermaid_er, "mer_db.png")
    if img:
        doc.add_picture(img, width=Inches(5.5))
        
    doc.save(os.path.join(OUTPUT_DIR, "10_Modelo_Relacional.docx"))

if __name__ == "__main__":
    print("Generando Documentos...")
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
    print("Documentos generados correctamente en", OUTPUT_DIR)
