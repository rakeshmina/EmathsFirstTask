
let form= document.getElementById('updateProfile');

form.addEventListener('submit', function(event){
    event.preventDefault();
    //alert('you have doing well')

    let name=form.name.value;
    let grade=form.grade.value;

    let details={
        name:name,
        grade: grade
    };

    
    alert(`your name is ${name} and you in ${grade} grade.`);

    fetch("/updateProfile", {
        method:"POST",
        headers:{
            Accept: "application/json",
            "Content-Type": "application/json",
            "CSRF-Token": Cookies.get("XSRF-TOKEN"),
        },
        body:JSON.stringify({details}),
    });      
    window.location.assign("/userTasks")
      
                   return false;                            
});
