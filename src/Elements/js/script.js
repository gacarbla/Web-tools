/**
 * @typedef {Object} ElementConfig
 * @property {string} name - The name of the element to be replaced.
 * @property {string} style - The styles to be inserted for the element.
 * @property {string} value - The new HTML structure to replace the original element.
 * @property {function} [beforeCreate] - Function to execute before creating the new element.
 * @property {function} [onClick] - Function to execute when the new element is clicked.
 * @property {function} [onInput] - Function to execute when text is input in the new element.
 * @property {function} [afterCreate] - Function to execute after the new element is created.
 */
/**
 * ElementImporter class to import and replace custom HTML elements with specified configurations.
 */
const ElementImporter = class {
    /**
     * @param {ElementConfig[]} elementConfigs - Configuration objects for elements to be replaced.
    */
    constructor(elementConfigs) {
        this.importContainer = document.querySelector('el-import');
        if (!this.importContainer) {
            console.error("No se encontró el elemento 'el-import'");
            return;
        }
        this.elementConfigs = elementConfigs;
        this.insertStyles();
        this.replaceElements();
    }
    /**
     * Inserts styles defined in the element configurations into the 'el-import' container.
     * @return {void}
     */
    insertStyles() {
        if (!this.importContainer) return;
        const styles = this.elementConfigs.map(config => config.style).join('');
        this.importContainer.innerHTML = styles;
    }
    /**
     * Replaces elements specified in the element configurations.
     * Executes optional lifecycle functions at the appropriate stages.
     * @return {void}
     */
    replaceElements() {
        if (!this.importContainer) return;
        this.elementConfigs.forEach(config => {
            const elements = document.querySelectorAll(config.name);
            elements.forEach(originalElement => {
                if (config.beforeCreate) config.beforeCreate(originalElement);
                const newElement = document.createElement('div');
                newElement.className = config.name
                newElement.innerHTML = config.value;
                const replacementElement = newElement.firstElementChild;
                if (replacementElement) {
                    Array.from(originalElement.attributes).forEach(attr => {
                        replacementElement.setAttribute(attr.name, attr.value);
                    });
                    if (config.value.includes('$content')) {
                        replacementElement.innerHTML = replacementElement.innerHTML.replace('$content', originalElement.innerHTML);
                    } else {
                        replacementElement.innerHTML = originalElement.innerHTML;
                    }
                    if (config.onClick) {
                        replacementElement.addEventListener('click', () => config.onClick(replacementElement));
                    }
                    if (config.onInput && replacementElement.tagName.toLowerCase() === 'input') {
                        replacementElement.addEventListener('input', () => config.onInput(replacementElement));
                    }
                    originalElement.replaceWith(replacementElement);
                    if (config.afterCreate) config.afterCreate(replacementElement);
                }
            });
        });
    }
}