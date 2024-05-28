const js_validate = {
    isString: a => (typeof a === "string"),
    isFilledString: a => js_validate.isString(a) && (a.trim().length > 0),
    stringMinLength: (text, length) => (js_validate.isString(text) && text.length >= length),
    stringMaxLength: (text, length) => (js_validate.isString(text) && text.length <= length),
    isNumber: a => (typeof a === "number"),
    isInt: a => (js_validate.isNumber(a)) && (Math.floor(a) == a),
    intMin: (int, value) => (js_validate.isInt(int) && js_validate.isInt(value)&& int >= value),
    intMax: (int, value) => (js_validate.isInt(int) && js_validate.isInt(value) && int <= value),

    encrypt: {
        validFormat: a => ["ascii", "base64", "binary", "text"].includes(a)
    }
}