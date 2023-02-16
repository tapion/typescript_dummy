interface Validatable {
    value: string | number;
    required: boolean;
    maxLength?: number;
    minLength?: number;
    max?: number;
    min?: number;
}

interface Draggable {
    dragStarHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
    dragOverHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
}

enum ProjectStatus { Active, Finished }


class Project {
    constructor(public id: string, public title: string, public description: string, public people: number, public state: ProjectStatus) { }
}

type Listener = (items: Project[]) => void;

function validate(val: Validatable): boolean {
    let isValid = true;
    if (val.required) {
        isValid = isValid && val.value.toString().trim().length > 0;
    }
    if (typeof val.value === "string") {
        if (val.maxLength) {
            isValid = isValid && val.value.length < val.maxLength;
        }
        if (val.minLength) {
            isValid = isValid && val.value.length > val.minLength;
        }
    }
    if (typeof val.value === "number") {
        if (val.max) {
            isValid = isValid && val.value < val.max;
        }
        if (val.min) {
            isValid = isValid && val.value > val.min;
        }
    }
    return isValid;
}


function Bindable(_: any, _2: string, descriptor: PropertyDescriptor): PropertyDescriptor {
    return {
        configurable: true,
        enumerable: false,
        get() {
            return descriptor.value.bind(this)
        }
    }
}

class ProjectState {
    private projects: Project[] = [];
    private listenersList: Listener[] = [];
    private static instance: any;

    addProject(title: string, description: string, people: number) {
        this.projects.push({
            id: Math.random().toString(),
            title,
            description,
            people,
            state: ProjectStatus.Active
        });
        console.log(this.projects)
        this.emitToListeners();
    }

    addListeners(listener: Listener) {
        this.listenersList.push(listener);
    }

    private emitToListeners() {
        for (const listener of this.listenersList) {
            listener(this.projects.slice());
        }
    }

    switchProject(projectId: string, state: ProjectStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.state !== state) {
            project.state = state;
            this.emitToListeners();
        }
    }

    public static getInstance() {
        this.instance = this.instance || new ProjectState()
        return this.instance;
    }
}

const projectState = ProjectState.getInstance();

abstract class Component<T extends HTMLElement, U extends HTMLElement>{
    mainElement: T;
    projectEl: U;

    constructor(mainApp: string, componentId: string, afterbegin: boolean) {
        this.mainElement = document.getElementById(mainApp)! as T;
        const template = document.getElementById(componentId) as HTMLTemplateElement;
        const templateNode = document.importNode(template.content, true);
        const sectionNode = templateNode.firstElementChild as U;
        this.projectEl = sectionNode;
        this.mainElement.insertAdjacentElement(afterbegin ? 'afterbegin' : 'beforeend', this.projectEl);
    }
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {

    get persons() {
        if (this.project.people == 1) {
            return `1 person`;
        }
        return `${this.project.people} persons`;
    }

    constructor(mainEl: string, public project: Project) {
        super(mainEl, "single-project", false);
        this.projectEl.querySelector("h2")!.textContent = project.title;
        this.projectEl.querySelector("h3")!.textContent = this.persons + ' Assigned';
        this.projectEl.querySelector("p")!.textContent = project.description;
        this.projectEl.addEventListener("dragstart", this.dragStarHandler);
        this.projectEl.addEventListener("dragend", this.dragEndHandler);
    }

    @Bindable
    dragStarHandler(event: DragEvent): void {
        console.log(event);
        event.dataTransfer!.setData("text/plain", this.project.id)
    }

    dragEndHandler(_: DragEvent): void {
        console.log('end');
    }
}

class Projects extends Component<HTMLDivElement, HTMLElement> implements DragTarget {

    constructor(private type: 'active' | 'finished') {
        super("app", "project-list", false)
        this.projectEl.querySelector('h2')!.textContent = `${this.type.toUpperCase()} PROJECTS`;
        this.projectEl.id = `${type}-projects`;
        const ul = this.projectEl.querySelector('ul')! as HTMLUListElement;
        ul.id = `${type}-lists`;
        projectState.addListeners((projects: Project[]) => {
            ul.innerHTML = '';
            const validProject = projects.filter(prj => {
                if (type === 'active') {
                    return prj.state === ProjectStatus.Active
                }
                return prj.state === ProjectStatus.Finished
            });
            for (const project of validProject) {
                new ProjectItem(ul.id, project);
            }
        });
        this.projectEl.addEventListener("dragleave", this.dragLeaveHandler);
        this.projectEl.addEventListener("dragover", this.dragOverHandler);
        this.projectEl.addEventListener("drop", this.dropHandler);
    }

    @Bindable
    dragLeaveHandler(_: DragEvent): void {
        this.projectEl.classList.remove("droppable");
    }

    @Bindable
    dragOverHandler(event: DragEvent): void {
        if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
            event.preventDefault();
            this.projectEl.classList.add("droppable");
        }
    }

    @Bindable
    dropHandler(event: DragEvent): void {
        projectState.switchProject(event.dataTransfer?.getData("text/plain"), this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
        // console.log(event.dataTransfer?.getData("text/plain"))
    }

}

class AddContent extends Component<HTMLDivElement, HTMLFormElement>{

    constructor() {
        super("app", "project-input", true);
        this.projectEl.id = "user-input";
        this.configure(this.projectEl);
    }

    @Bindable
    private submitForm(event: Event) {
        event.preventDefault();
        const insertedInfo = this.gatherInformation();
        if (Array.isArray(insertedInfo)) {
            projectState.addProject(insertedInfo[0], insertedInfo[1], insertedInfo[2]);
            this.clearValues(this.projectEl);
        }
    }

    private gatherInformation(): [string, string, number] | undefined {
        const titleEl = this.projectEl.querySelector("#title")! as HTMLInputElement;
        const descriptionEl = this.projectEl.querySelector("#description")! as HTMLInputElement;
        const peopleEl = this.projectEl.querySelector("#people")! as HTMLInputElement;
        const valTitle: Validatable = {
            value: titleEl.value,
            required: true,
            maxLength: 100,
            minLength: 5,
        };
        const valDescription: Validatable = {
            value: descriptionEl.value,
            required: true,
            maxLength: 100,
            minLength: 5,
        };
        const valPeople: Validatable = {
            value: peopleEl.value,
            required: true,
            min: 0,
            max: 10,
        };
        if (!validate(valTitle)
            || !validate(valDescription)
            || !validate(valPeople)
        ) {
            alert('Empty values not allowed');
            return;
        }
        return [titleEl.value, descriptionEl.value, +peopleEl.value];
    }

    private configure(formNode: HTMLFormElement) {
        formNode.addEventListener('submit', this.submitForm);
    }

    private clearValues(formNode: HTMLFormElement) {
        (formNode.querySelector("#title")! as HTMLInputElement).value = '';
        (formNode.querySelector("#description")! as HTMLInputElement).value = '';
        (formNode.querySelector("#people")! as HTMLInputElement).value = '';
    }
}

const main = new AddContent();
const activeProject = new Projects('active');
const finishedProject = new Projects('finished');