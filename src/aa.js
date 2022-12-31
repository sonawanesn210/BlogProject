Array.prototype.myUcase = function() {
    for (let i = 0; i < this.length; i++) {
      this[i] = this[i].toUpperCase();
    }
  
  };

  var fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.myUcase()
console.log(fruits);


Array.prototype.doSomthing=function(){
   return 2+2
}

const arr=[1,2,3]

console.log(arr.doSomthing())