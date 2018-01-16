document.addEventListener("DOMContentLoaded",function(){
    // database setup
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.mozIndexedDB || window.MsIndexedDB;
    var db, request, index;

    if(!indexedDB){
        alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }else{
        request = indexedDB.open("clientsDB",1);
        //onupgrageneeded BD function
        request.onupgradeneeded = function(event){
            db = event.target.result;
            if(!db.objectStoreNames.contains('clients')){
                let os = db.createObjectStore('clients',{keyPath: "id", autoIncrement: true}); 
            }
        };
        //success BD open
        request.onsuccess = function(event){
            console.log("Success open batabase");
            db = event.target.result;

        };
        //error BD open
        request.onerror = function(event){
            console.log("Cannot open database "+event.target.errorCode);
        };
    }

    // button Event Listener (adding client)
    let btn = document.getElementsByClassName("new_btn")[0];
    btn.addEventListener('click',addClient);
    
    //adding client function
    function addClient(){
        let name = document.getElementById("add_Name").value;
        let number = document.getElementById("add_Number").value;
        // wrong date
        if(number<0)
            number*=-1;
        if(name==="" || number==="" || !Number.isInteger(Number(number)) || Number(name))
            alert("Wrong date!");
        else{
            //correct date, defind transaction and build client object
            let transaction = db.transaction(["clients"],"readwrite");
            let store = transaction.objectStore("clients");
            let client = {
                "name": name,
                "number": number
            }
            //sent client to store 
            request = store.add(client);
            request.onsuccess = function(){
                console.log("Added client");
            }
            request.onerror = function(){
                console.log("Error, not added client")
            }
        }
    }

});


