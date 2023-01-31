//////////////////////////
//DECORATORS
///////////////////////////

//Function factory
function Logger2(constructor: any) {
    console.log(`Hola logger 2`);
    console.log(constructor);
}

function Logger(title: string, el: string) {
    return function <T extends { new(...args: any[]): { name: string } }>(originalConstructor: T) {
        return class extends originalConstructor { //this decorator replace the class of the decorator was put on
            constructor(..._: any[]) {
                super();
                const htmlElement = document.getElementById(el)!;
                htmlElement.innerHTML = title;
                // const p = new originalConstructor('pedro');
                console.log(`Hola desde Logger - ${this.name}`);
                console.log(originalConstructor);
            }
        }
    }
}
@Logger2 //Se ejecuta de segundas
@Logger("Loger for person", "paragraph-text") //Se ejecuta primero
class Person {
    public name: string;

    constructor(name: string) {
        this.name = name;
        console.log("Creating a person");
    }
}
const test = new Person("juan");

/// ----

function Log(target: any, property: string) {
    console.log("Nuevo decorador");
    console.log(target, property);
}

function Log2(target: any, name: string | symbol, descriptor: PropertyDescriptor) {
    console.log("From setter");
    console.log(target);
    console.log(name);
    console.log(descriptor);
}

function Log3(target: any, name: string | symbol, position: number) {
    console.log("From parameter");
    console.log(target);
    console.log(name);
    console.log(position);
}

class Person1 {
    @Log
    title: string;
    price: number;

    @Log2
    priceSet(@Log3 p: number) {
        this.price = p;
    }

    constructor(t: string, p: number) {
        this.title = t;
        this.price = p;
    }


}

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor): PropertyDescriptor{
    const functionValue = descriptor.value;
    console.log("Si entro!!!!")
    return {
        configurable: true,
        enumerable: false,
        get() {
            return functionValue.bind(this)
        },
    }
}

class Boton{
    title: string = "Click me is a test 2";

    @Autobind
    showMessage(){
        console.log(this.title);
    }
}

const btn = new Boton();

const btnHtml = document.getElementById("btn-test")! as HTMLButtonElement;
btnHtml.addEventListener("click", btn.showMessage);

interface validations {
    [prop: string]: {
        [field: string]: [rules: string];
    };
}

let allRules: validations = {};

const Required = function(target: any, name: string){
    allRules[target.constructor.name] = {
        ...allRules[target.constructor.name],
        [name]: ['Required'],
    }
}
const Positive = function(target: any, name: string){
    allRules[target.constructor.name] = {
        ...allRules[target.constructor.name],
        [name]: ['Positive'],
    }
}

const isValid = function(obj: any){
    const config = allRules[obj.constructor.name];
    let isValid = true;
    console.log('config ', config);
    for(const field in config){
        console.log('Field ', field);
        for(const restriction of config[field]){
            console.log('restriction ', restriction);
            switch(restriction){
                case 'Required':
                    isValid = isValid && !!obj[field]
                    break;
                case 'Positive':
                    isValid = isValid && !(parseFloat(obj[field]) <= 0 || isNaN(parseFloat(obj[field])))
                    break;
            }
        }
    }
    return isValid;
}

class Course {
    @Required
    title: string;
    @Positive
    price: number;

    constructor(t: string, p: number){
        this.title = t;
        this.price = p;
    }
}

const form = document.querySelector('form')!;
form.addEventListener('submit', function(e){
    e.preventDefault();
    const titleEl = document.getElementById('title')! as HTMLInputElement;
    const priceEl = document.getElementById('price')! as HTMLInputElement;
    const course = new Course(titleEl.value, parseFloat(priceEl.value));
    if(!isValid(course)){
        alert("Error on courses")
    }
    console.log('El curso es', course);
});
