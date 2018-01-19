document.addEventListener("DOMContentLoaded", function(){
    // DOM elements
    let search_Input = document.getElementById("search_Input"); 
    let items = document.getElementsByClassName("list-box");
    let lists = document.getElementsByClassName("list");
    search_Input.addEventListener("input",function(){
        let value = search_Input.value;
        showList(value);
    });
    // show match Client function
    function showList(value){
        // show/hide clients
        for(var i=0; i<items.length; i++){ 
            let name = items[i].getElementsByClassName("list_item--name")[0];
            if(name.innerHTML.toUpperCase().indexOf(value.toUpperCase()) > -1)
                items[i].style.display = "";
            else 
                items[i].style.display = "none";
        };
        // show/hide letters
        for(var i=0; i<lists.length; i++){
            let display_clients = lists[i].getElementsByClassName("list-box");
            let amount = 0;
            for(var j=0; j < display_clients.length; j++){
                var style = window.getComputedStyle(display_clients[j]),
                display = style.getPropertyValue('display');
                if(display === "none")
                    amount++; 
            }
            if(amount == display_clients.length)
                lists[i].style.display = "none";
            else
                lists[i].style.display = "";
            };
        
    }
});