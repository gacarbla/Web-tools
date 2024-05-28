const ts_validate = {
    isFilledString: (a:string) => a.trim().length > 0,
    stringMinLength: (text:string, length:number) => text.length >= length,
    stringMaxLength: (text:string, length:number) => text.length <= length,
    isInt: (a:number) => Math.floor(a) == a,
    intMin: (int:number, value:number) => (ts_validate.isInt(int) && ts_validate.isInt(value) && int >= value),
    intMax: (int:number, value:number) => (ts_validate.isInt(int) && ts_validate.isInt(value) && int <= value),

    encrypt: {
        validFormat: (a:string) => ["ascii", "base64", "binary", "text"].includes(a)
    }
}