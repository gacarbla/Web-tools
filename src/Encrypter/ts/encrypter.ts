import "../../Validator/ts/validator"

/**
 * 
 * **Oh oh..**
 * 
 * Esta clase no consta de ninguna función o variable estáticos
 */
class TS_Encryption {
    #key: string;
    #displacement: number;
    private valid_types = ["ascii", "binary", "text"];

    /**
     * 
     * -----
     * 
     * Gracias a esta clase podrás crear funciones de codificación y descodificación que
     * compartan características para que no sea necesario repetir constantemente la
     * contraseña al encriptar un elevado número de elementos.
     * 
     * -----
     * 
     * @param {string} pssw Campo: Contraseña
     * @param {number} displacement Campo: Desplazamiento de caracteres
     * @example
     * var crp = new Encryption("Contraseña", 123)
     * crp.encrypt("Texto que quieres encriptar", "text")
     * crp.encrypt("Otro texto que quieres encriptar", "text")
     * crp.encrypt("Y otro más", "text")
     */
    constructor(pssw: string, displacement: number) {
        console.groupCollapsed("#️⃣ Creación de objeto de encriptación");
        try {
            if (!ts_validate.stringMinLength(pssw, 3)) throw new Error("Invalid password");
            if (!ts_validate.intMin(displacement, 0)) throw new Error("Invalid displacement");
            this.#key = pssw;
            this.#displacement = displacement;
            console.log("✅ Objeto creado correctamente");
        } catch (e) {
            console.groupCollapsed("❌ No ha sido posible crear el objeto");
            console.error(e);
            console.groupEnd();
        } finally {
            console.groupEnd();
        }
    }

    private math = {
        encrypt: (letter: number, key: string, displacement: number, n: number) => 
            Math.floor((letter + key.charCodeAt(n % key.length) + displacement) * (key.length - (n % key.length))),
        decrypt: (letter: number, key: string, displacement: number, n: number) => 
            Math.floor((letter / (key.length - (n % key.length))) - key.charCodeAt(n % key.length) - displacement)
    };

    /**
     * Función para encriptar determinado texto con la contraseña y desplazamiento indicados
     * con anterioridad en el constructor.
     * 
     * -----
     * 
     * **ANTES DE USARLO**
     * 
     * > Recuerda crear un objeto `Encryption` para configurar la contraseña y desplazamiento
     * de caracteres que deben ser empleados.
     * > ```ts
     * var crp = new Encryption("Contraseña", 123)
     * crp.encrypt("Texto", "text")
     * > ```
     * 
     * -----
     * 
     * @param {string} text 
     * @param {"ascii"|"binary"|"text"} format 
     * @return {{ascii: string, binary: string, text: string} | null}
     */
    encrypt(text: string, format: "ascii" | "binary" | "text"): { ascii: string | null, binary: string | null, text: string | null } | null {
        console.groupCollapsed("#️⃣ Función de encriptación");
        const encr: number[] = [];
        try {
            if (!ts_validate.isFilledString(text)) throw new Error("El valor texto no es tipo string o no contiene caracteres.");
            if (!ts_validate.isFilledString(format)) throw new Error("Es necesario especificar el nombre de un formato.");
            format = format.toLowerCase() as "ascii" | "binary" | "text";
            if (!this.valid_types.includes(format)) throw new Error("El formato introducido no es reconocido.");
            console.log("✅ Los valores introducidos son correctos y válidos");
            let n = 0;
            this.convertToAscii(text, format)?.forEach(letter => encr.push(this.math.encrypt(letter, this.#key, this.#displacement, n++)));
            console.log("✅ Aplicación de la fórmula matemática necesaria");
            console.groupCollapsed("#️⃣ Convirtiendo resultado...");
            const toLogOut = {
                text: this.convertFromAscii(encr, "text"),
                binary: this.convertFromAscii(encr, "binary"),
                ascii: this.convertFromAscii(encr, "ascii"),
            };
            console.groupEnd();
            console.groupEnd();
            return toLogOut;
        } catch (e) {
            console.groupCollapsed("❌ No ha sido posible ejecutar la función correctamente");
            console.error(e);
            console.groupEnd();
            console.groupEnd();
            return null;
        }
    }

    /**
     * 
     * @param {string} text 
     * @param {"ascii"|"binary"|"text"} format
     * @return {{ascii: string, binary: string, text: string} | null}
     */
    decrypt(text: string, format: "ascii" | "binary" | "text"): { ascii: string | null, binary: string | null, text: string | null } | null {
        console.groupCollapsed("#️⃣ Función de desencriptado");
        try {
            if (!ts_validate.isFilledString(text)) throw new Error("El valor texto no es tipo string o no contiene caracteres.");
            if (!ts_validate.isFilledString(format)) throw new Error("Es necesario especificar el nombre de un formato.");
            format = format.toLowerCase() as "ascii" | "binary" | "text";
            if (!this.valid_types.includes(format)) throw new Error("El formato introducido no es reconocido.");
            console.log("✅ Los valores introducidos son correctos y válidos");
            const encr: number[] = [];
            let n = 0;
            this.convertToAscii(text, format)?.forEach(letter => encr.push(this.math.decrypt(letter, this.#key, this.#displacement, n++)));
            console.log("✅ Aplicación de la fórmula matemática necesaria");
            console.groupCollapsed("#️⃣ Convirtiendo resultado...");
            const toLogOut = {
                text: this.convertFromAscii(encr, "text"),
                binary: this.convertFromAscii(encr, "binary"),
                ascii: this.convertFromAscii(encr, "ascii"),
            };
            console.groupEnd();
            console.groupEnd();
            return toLogOut;
        } catch (e) {
            console.groupCollapsed("❌ No ha sido posible ejecutar la función correctamente");
            console.error(e);
            console.groupEnd();
            console.groupEnd();
            return null;
        }
    }

    /**
     * @param {string} text 
     * @param {"ascii"|"binary"|"text"} type 
     * @returns {number[] | null}
     */
    private convertToAscii(text: string, type: "ascii" | "binary" | "text"): number[] | null {
        console.groupCollapsed("#️⃣ Iniciando conversión a array ASCII");
        try {
            if (!ts_validate.isFilledString(text)) throw new Error("El valor introducido no es tipo string o no contiene caracteres.");
            const base: number[] = [];
            console.log(`*️⃣ Tipo de texto reconocido como: "${type}"`);
            switch (type) {
                case "ascii":
                    text.trim().split(/ +/g).forEach(letter => base.push(parseInt(letter)));
                    break;
                case "binary":
                    text.trim().split(/ +/g).forEach(letter => base.push(parseInt(letter, 2)));
                    break;
                case "text":
                    text.trim().split("").forEach(letter => base.push(letter.charCodeAt(0)));
                    break;
            }
            console.log("✅ Conversión finalizada exitosamente");
            console.groupEnd();
            return base;
        } catch (e) {
            console.groupCollapsed("❌ No ha sido posible realizar la conversión");
            console.error(e);
            console.groupEnd();
            console.groupEnd();
            return null;
        }
    }

    /**
     * 
     * @param {number[]} text 
     * @param {"ascii"|"binary"|"text"} type 
     * @returns {string | null}
     */
    private convertFromAscii(text: number[], type: "ascii" | "binary" | "text"): string | null {
        console.groupCollapsed("#️⃣ Iniciando conversión desde array ASCII");
        try {
            let result: string;
            console.log(`*️⃣ Tipo de texto reconocido como: "${type}"`);
            switch (type) {
                case "ascii":
                    result = text.join(" ");
                    break;
                case "binary":
                    const textArrayBinary: string[] = [];
                    text.forEach(letter => textArrayBinary.push(letter.toString(2)));
                    result = textArrayBinary.join(" ");
                    break;
                case "text":
                    const textArrayText: string[] = [];
                    text.forEach(letter => textArrayText.push(String.fromCharCode(letter)));
                    result = textArrayText.join("");
                    break;
                default:
                    throw new Error("Tipo de texto no soportado");
            }
            console.log("✅ Conversión finalizada exitosamente");
            console.groupEnd();
            return result;
        } catch (e) {
            console.groupCollapsed("❌ No ha sido posible realizar la conversión");
            console.error(e);
            console.groupEnd();
            console.groupEnd();
            return null;
        }
    }
}

export { TS_Encryption }