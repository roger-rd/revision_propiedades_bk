# 🏡 Sistema de Revisión de Casas - Backend

Este proyecto gestiona la inspección de viviendas nuevas mediante un sistema web con arquitectura **MVC**, permitiendo la generación de informes técnicos personalizados en PDF. Soporta multitenencia: cada empresa gestiona su información, branding y usuarios.

---

## 📁 Estructura del Proyecto

```
├── routes/             # Endpoints API REST
├── controllers/        # Lógica de negocio
├── models/             # Consultas SQL
├── templates/          # Plantilla HTML del informe
├── public/informes/    # PDFs generados
├── config/             # Conexión a la base de datos
```

---

## 🧠 Módulos Implementados

### 1. Clientes
| Acción             | Método | Endpoint                         |
|--------------------|--------|----------------------------------|
| Crear cliente      | POST   | `/api/clientes`                 |
| Listar por empresa | GET    | `/api/clientes/:id_empresa`     |

---

### 2. Usuarios
| Acción  | Método | Endpoint                  |
|---------|--------|---------------------------|
| Login   | POST   | `/api/usuarios/login`     |

---

### 3. Solicitudes
| Acción                    | Método | Endpoint                                  |
|---------------------------|--------|-------------------------------------------|
| Crear solicitud           | POST   | `/api/solicitudes`                        |
| Listar por empresa        | GET    | `/api/solicitudes/empresa/:id_empresa`    |
| Obtener solicitud completa| GET    | `/api/solicitudes/:id/completa`           |

---

### 4. Observaciones
| Acción              | Método | Endpoint                        |
|---------------------|--------|---------------------------------|
| Crear observación   | POST   | `/api/observaciones`           |
| Actualizar estado   | PUT    | `/api/observaciones/:id`       |
| Eliminar observación| DELETE | `/api/observaciones/:id`       |

---

### 5. Espacios
| Acción          | Método | Endpoint            |
|-----------------|--------|---------------------|
| Crear espacio   | POST   | `/api/espacios`     |

---

### 6. Empresas
| Acción          | Método | Endpoint          |
|-----------------|--------|-------------------|
| Crear empresa   | POST   | `/api/empresas`   |
| Listar activas  | GET    | `/api/empresas`   |

---

### 7. Informes PDF
| Acción               | Método | Endpoint                        |
|----------------------|--------|---------------------------------|
| Generar PDF Informe  | GET    | `/api/informes/:id/generar`     |

---

## 🎨 Multitenencia & Branding

Cada empresa tiene su propio:

- Logo
- Colores personalizados
- Datos de contacto
- Usuarios
- Informes con identidad visual propia

---

## 🚀 Stack Tecnológico

- Node.js + Express
- PostgreSQL (pgAdmin)
- Puppeteer (PDF)
- HTML5/CSS para plantilla
- Postman para pruebas

---

## 💬 Autor

Desarrollado por Roger Rodríguez 🧑‍💻 con guía de Anto 💕