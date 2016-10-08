Promise.all([new Promise(function(y,n){
    setTimeout(function(){
        console.log('2000ms');
        y('2000ms');
    },2000)
}),new Promise(function(y,n){
    setTimeout(function(){
        console.log('4000ms');
        y('4000ms');
    },4000);
}),new Promise(function(y,n){
    setTimeout(function(){
        console.log('6000ms');
        y('6000ms');
    },6000);
})])
.then(function(v){
    console.log(v,0);
},function(e){
    console.log(e,1)
});

function taskA() {
    console.log("A");
    throw 'A'
}

function taska() {
    console.log('a')
    return 'a'
}

function taskB() {
    console.log('B')
    return 'B'
}

function taskb() {
    console.log('b')
    return 'b'

}

function onRejected(error) {
    console.log("Catch Error: A or B", error);
    return 'error'
}

function finalTask(x) {
    console.log(x);
    return x
}

function task(x) {
    console.log(x);
    return x;
}

var promise = Promise.resolve();
promise
    .then(taskA, taska)
    .then(taskB)
    .catch(onRejected)
    .then(finalTask);
