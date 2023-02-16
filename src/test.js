const obj = {
    amigo: "hola",
    prueba: "nombre",
    persona: {
        nombre: "Miguel",
        prueba: "fallida"
    }
};

const { amigo, prueba, persona:test } = obj;
console.log(amigo, prueba, test)