document.addEventListener("DOMContentLoaded",function(){
 window.indexedDB = window.indexedDB || window.mozIndexedDB || window.mozIndexedDB || window.MsIndexedDB;

if(!indexedDB){
    alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}else{
    let request = indexedDB.open("clientsDB",1);
    //onupgrageneeded BD function
    request.onupgradeneeded = function(event){
        let db = event.target.result;
        if(!db.objectStoreNames.contains('clients')){
            let os = db.createObjectStore('clients',{keyPath: "id", autoIncrement: true}); 
        }
    };
    //success BD open
    request.onsuccess = function(event){
        console.log("Success open batabase");
        let db = event.target.result;
        // showData();
    };
    //error BD open
    request.onerror = function(event){
        console.log("Cannot open database "+event.target.errorCode);
    };
}
});
