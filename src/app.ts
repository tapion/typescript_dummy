// Code goes here!
type option1 = {
    name: string;
    privileges: string[];
}

type option2 = {
    name: string;
    date: Date;
}

type general = option1 & option2;
type general2 = option1 | option2;

const amigo: general = {
    name: "hola",
    privileges: ['Otro privilegio'],
    date: new Date(),
}

const amigo1: general2 = {
    name: "Name amigo1",
    privileges: ['Otro privilegio'],
    date: new Date(),
}

type opt1 = string | number;
type opt2 = number | boolean;

const vopt1 = 2;
const vopt11 = 2;
type opt3 = opt1 & opt2;

const hola: opt3 = 1;

class test1 {
    doSomth(val: general2) {
        console.log(val.name);
    }
}

class test2 {
    doSomth(val: general2) {
        console.log(val.name);
    }
    hello() {
        console.log('hello');
    }
}

type tests = test1 | test2;

const vt1 = new test1();
const vt2 = new test2();

function testing(val: tests, param: general2) {
    val.doSomth(param);
    if (val instanceof test2) {
        val.hello();
    }
}


function say(val1: general2) {
    console.log('Nombre general', val1.name);
    if ('date' in val1) {
        console.log('Date general', val1.date);
    }
    return;
}

interface Bird {
    type: 'bird';
    flySpeed: number;
}

interface Horse {
    type: 'horse';
    runningSpeed: number;
}

type Animal = Bird | Horse;

function animales(an: Animal) {
    let speed;
    switch (an.type) {
        case 'bird':
            speed = an.flySpeed;
            break;
        case 'horse':
            speed = an.runningSpeed;
            break;
    }
    console.log('Moving at this spped ', speed);
}

console.log('hola amigos', amigo.date)
console.log(optFun(vopt1, vopt11));
say(amigo1);
testing(vt2, amigo1);

animales({type: 'bird', flySpeed: 10});

// const htmlElement = <HTMLParagraphElement>document.getElementById('paragraph-text');
const htmlElement = document.getElementById('paragraph-text');
if(htmlElement){
    (htmlElement as HTMLParagraphElement).innerHTML = "hola";

}

//INDEX PROPERTIES
interface ErrorMessages {
    [prop: string]: string;
}

const errors: ErrorMessages = {
    textError: "This is an error",
    screenError: "This is an error two",
}

//Functions overload
function optFun(val1: number, val2: number): number;
function optFun(val1: string, val2: string): string;
function optFun(val1: opt1, val2: opt1) {
    if (typeof val1 === 'string' || typeof val2 === 'string') {
        return val1.toString() + val2.toString();
    }
    return val1 + val2;
}

console.log(optFun("hola ","como te va").split(' '));
