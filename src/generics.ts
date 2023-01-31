//GENERICS
function merge <T extends object, U extends object>(obj1: T, obj2: U){
    return Object.assign(obj1, obj2);
}

const obj = merge({name: "Miguel", last: "Vargas"}, {passion: "travel", has: "bike"});
console.log(obj.passion);

interface Lengthy {
    length: number;
}

function lengthAndDescription<T extends Lengthy>(el: T): [T, string]{
    let description = 'No elements';
    if(el.length === 1){
        description = `Got 1 element`;
    }else if(el.length > 1){
        description = `Got ${el.length} elements`;
    }
    return [el, description];
}

console.log(lengthAndDescription(["hola","como ", null]))

function extract<T extends object, U extends keyof T>(obj: T, key: U): string {
    return `Values is ${obj[key]}`;
}

console.log(extract({name: "Miguel"}, "name"));

class Generico<T extends string | number | boolean>{
    private data: T[] = [];
    addItem(val: T){
        this.data.push(val);
    }
    
    removeItem(val: T){
        this.data.splice(this.data.indexOf(val), 1);
    }
    getItems(){
        console.log(this.data);
    }
}

const h1 = new Generico<string>();
h1.addItem('10');
h1.removeItem('10');
h1.addItem('100');
console.log(h1.getItems());