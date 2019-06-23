(function(){
    var array = [];
    for(var i=0;i<documents.length;i++){
        array[i] = documents[i].fullName.toString();
    }
    return JSON.stringify(array);
})();