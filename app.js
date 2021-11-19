class Person {
  constructor(age, name) {
    this.age = age;
    this.name = name;
  }
  age = null;
  name = null;

  getName(){
    return this.name;
  }
  getAge(){
    return this.age;
  }
}

class Student extends Person {
  constructor(age, name, score) {
    super(age, name);
    this.score = score;
  }
  score = null;

  getScore(){
    return this.getName();
  }
}

const studentGio = new Student(32, 'Gio', 80);
const studentGela = new Student(19, 'Gela', 100);

console.log(studentGio.getName());
console.log(studentGela.getName());
