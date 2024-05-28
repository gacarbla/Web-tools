# Elements `v1.0`

¿Te gustaría poder tener un HTML más limpio?
Con Elements podrás lograrlo sin recurrir a herramientas server-side.
Importa el script en tu página y utiliza la clase `ElementImporter` para hacer elementos personalizados.

Ejemplo de elemento personalizado:
```js
const element = {
    name: 'my-custom-element',
    style: ```<style>
/* Estilo que deseas darle al elemento */
/* Puedes llamar al elemento mediante la clase que contenga su mismo nombre */
.my-custom-element {
    border: 1px solid black;
}
</style```
    value: '<span>$content</span>'
}

new ElementImporter(element);
```

<!> Atención: Acuérdate de utilizarlo una vez el HTML haya sido cargado. Puedes utilizar el eventListener de DOMContentLoaded para lograrlo.

Así es como debes declararlo en el HTML:

```html
<my-custom-element atributos="del elemento">Contenido del elemento</my-custom-element>
```

Y así es como se vería:

```html
<div class="my-custom-element">
    <span atributos="del elemento">Contenido del elemento</span>
</div>
```

También puedes añadir funciones para hacer que el elemento ejecute ciertas acciones en ciertos eventos.

## Importación

Copia el script de [`este enlace`]() o añade a tu página el siguiente elemento:
```html
<script src=""></script>
```