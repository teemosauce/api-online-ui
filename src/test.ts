interface Person {
    readonly name: string,
    desc?: string,
    hello(): string,
    hello(str: string): string,
}



function D({ name, desc = "", hello }: Person): string {
    console.log(`${name}【${desc}】say ${hello()}!`);
    return ""
}

let person: Person = {
    name: '小方',
    desc: '眼镜大又圆',
    hello: () => {
        return "唱、跳、Rap!"
    }
}

class Student {
    constructor(public name: string, public desc: string) {

    }

    hello(): string {
        return "有钱没钱，回家过年"
    }

    run(type: number) {
        switch (type) {
            case 1:
                
            case 2:
                break
            default:
                break;
        }
    }
}

const student = new Student("小宋", "身材高大")

D(student)