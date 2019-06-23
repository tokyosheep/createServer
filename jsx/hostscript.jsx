function openImages(array){
    for(var i=0;i<array.length;i++){
        var f = new File(array[i]);
        app.open(f);
    }
}