# Visualizador de Líneas Equipotenciales y Campo Eléctrico

**Laboratorio Electricidad y Magnetismo**  
Este proyecto es un visualizador interactivo que permite observar y entender cómo se comportan las líneas de campo eléctrico y las líneas equipotenciales generadas por dos barras cargadas. Se enfoca en ilustrar conceptos fundamentales del electromagnetismo de forma clara y visual.


## Instalación

1. Clona el repositorio
```bash
git clone https://github.com/axensz/Visualizador_Equipotenciales.git
```

2. Accede a la carpeta del proyecto
```bash
cd Visualizador_Equispotenciales
```

3. Instala las dependencias
```bash
npm install
```

4. Inicia el proyecto
```bash
npm run dev
```
   
---

## Conceptos Clave

### Líneas de Campo Eléctrico  
Las líneas de campo eléctrico son una representación visual del campo eléctrico en el espacio. Estas:

- Comienzan en cargas positivas y terminan en cargas negativas  
- Apuntan en la dirección de la fuerza sobre una carga de prueba positiva  
- Tienen una densidad proporcional a la intensidad del campo  
- Nunca se cruzan entre sí  

### Líneas Equipotenciales  
Las líneas equipotenciales conectan puntos con el mismo potencial eléctrico. Estas:

- Son siempre perpendiculares a las líneas de campo eléctrico  
- No requieren trabajo para mover una carga a lo largo de ellas  
- Están más juntas donde el campo eléctrico es más fuerte  
- Forman lazos cerrados o se extienden al infinito  

### Placas Paralelas Cargadas  
Para dos placas (o barras) cargadas paralelamente:

- El campo eléctrico es aproximadamente uniforme entre las placas  
- La intensidad del campo disminuye a medida que aumenta la separación  
- Las superficies equipotenciales son paralelas a las placas y están igualmente espaciadas en un campo uniforme  
- La diferencia de potencial entre las placas es directamente proporcional a su separación  

### Relaciones Matemáticas  
Para una carga puntual, la intensidad del campo eléctrico se calcula con la fórmula:  

```
E = kq / r²
```

Donde *k* es la constante de Coulomb, *q* es la carga y *r* es la distancia desde la carga.  

El potencial eléctrico se relaciona con el campo eléctrico mediante:  

```
E = -∇V
```

Donde *V* es el potencial eléctrico y ∇ es el operador gradiente.  

---

## Tecnologías Usadas

- React + Tailwind CSS  
- Vercel V0 UI  
- Física: Conceptos de campos eléctricos y potenciales eléctricos  

---

## Créditos

Se realizó el código a partir de conocimientos propios y de la web, apoyándonos con la IA [Vercel v0](https://v0.dev)
