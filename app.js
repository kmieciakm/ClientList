document.addEventListener("DOMContentLoaded",function(){
    // database setup
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.mozIndexedDB || window.MsIndexedDB;
    var db, request;

    if(!indexedDB){
        alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }else{
        request = indexedDB.open("clientsDB",1);
        //success BD open
        request.onsuccess = function(event){
            console.log("Success open batabase");
            db = event.target.result;
            showClients();
        };
        //onupgrageneeded BD function
        request.onupgradeneeded = function(event){
            db = event.target.result;
            if(!db.objectStoreNames.contains('clients')){
                let os = db.createObjectStore('clients',{keyPath: "id", autoIncrement: true}); 
                //create index for name
                os.createIndex('name','name',{unique: false});
            }
        };
        //error BD open
        request.onerror = function(event){
            console.log("Cannot open database "+event.target.errorCode);
        };
    }

    // button Event Listener (adding client)
    let add_btn = document.getElementsByClassName("add_btn")[0];
    add_btn.addEventListener('click',addClient);
    
    //adding client function
    function addClient(){
        let name = document.getElementById("add_Name").value;
        let number = document.getElementById("add_Number").value;
        // wrong date
        if(number<0)
            number*=-1;
        if(name==="" || number==="" || !Number.isInteger(Number(number)) || Number(name))
            alert("Wrong data!");
        else{
            //correct date, defind transaction and build client object
            let transaction = db.transaction(["clients"],"readwrite");
            let store = transaction.objectStore("clients");
            let client = {
                "name": name,
                "number": number
            };
            //sent client to store 
            request = store.add(client);
            request.onsuccess = function(){
                alert("Added client");
                showClients();
            }
            request.onerror = function(event){
                alert("Sorry, the client was not added");
                console.log("Error: "+event.target.error.name);
            }
        }
    }

    //getting data to DOM, show client function
    function showClients(e){
        let transaction = db.transaction(["clients"],"readonly");
        let store = transaction.objectStore("clients");
        let index = store.index('name');

        let output = "";
        let lastLetter = "";
        let currentLetter = "";
        index.openCursor().onsuccess = function(e){
            var cursor = e.target.result;
            if(cursor){
                    currentLetter = cursor.value.name[0].toUpperCase();
                    //create output;
                    if(currentLetter != lastLetter && lastLetter!="")
                        output+="</div>"+"</ul>";
                    if(currentLetter != lastLetter){
                        output +="<ul class='list'>"
                            +"<li class='list_item list_item--header'>"+cursor.value.name[0].toUpperCase()+"</li>";
                    }
                    output +="<div class='list-box'>"
                            +"<li class='list_item list_item--name'>"+cursor.value.name+"</li>"
                                +"<li class='list_item list_item--number'>"+cursor.value.number
                                    +"<span class='list_item list_item--remove' name="+cursor.value.id+">&times;</span>"
                                +"</li>"
                            +"</div>";
                    //continue
                    lastLetter = currentLetter;
                    cursor.continue();
            }
            //show in DOM
            document.getElementById("client_output").innerHTML = output;

            // button Event Listener (removing client button)
            let remove_btn = document.getElementsByClassName("list_item--remove");
            for(var i=0; i<remove_btn.length; i++)
                remove_btn[i].addEventListener('click',removeClient);
        }
    }

    //remove client function
    function removeClient(event){
        let clientToRemoveId = Number(event.target.getAttribute("name"));
        let transaction = db.transaction(["clients"],"readwrite");
        let store = transaction.objectStore("clients");
        
        //remove client from database
        request = store.delete(clientToRemoveId);
        request.onsuccess = function(){
            alert("Removed client");
        }
        request.onerror = function(event){
            alert("Sorry, the client was not deleted");
            console.log("Error: "+event.target.error.name);
        }
        showClients();
    }

});