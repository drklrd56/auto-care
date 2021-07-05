var primary = document.getElementById('primary');
var secondary = document.getElementById('secondary');
var logout_button = document.getElementsByClassName('header__btn');
var signUP = false;
var User = {
    id: -1,
    name: ""
};


function login(){
    if(main_button.disabled == 0 ) {
        var userEmail = document.getElementById("login-email").value;
        var userPass = document.getElementById("login-password").value;
        firebaseApp.auth().signInWithEmailAndPassword(userEmail, userPass)
        .catch( (error) => {
            error_login.style.display =  'block';
            error_login.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
            'Invalid Email/Password'+'</h3>';
        });
    }
}

function signup(){
    if(signup_button.disabled == 0) {
        var signup_password = document.getElementById('signup-password');
        var signup_Secpassword = document.getElementById('signup-secpassword');
        var Name = document.getElementById('Name');
        if(Name.value == null) {
            error_signup.style.display =  'block';
            error_signup.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
            'Name field is empty'+'</h3>';
        }
        else {
            if(signup_password.value == signup_Secpassword.value) {
                error_signup.style.display =  "none";
                var user = firebaseApp.auth().createUserWithEmailAndPassword(signup_email.value, signup_password.value);
                user.catch( (error) => {
                    error_signup.style.display =  'block';
                    error_signup.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
                    'Email already in use'+'</h3>';
                });
                signUP = true;
            }
            else {
                error_signup.style.display =  'block';
                error_signup.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
                'Password fields don\'t match'+'</h3>';
            }
        }
    }
    
}

function logout(){
    firebaseApp.auth().signOut();
}

firebaseApp.auth().onAuthStateChanged(function(user) {
    if (user) {
        logout_button[0].style.display="flex";
        primary.style.display = "block";
        secondary.style.display = "none";
    }
    var user = firebaseApp.auth().currentUser;
    if(user != null){
        if(signUP) {
            writeNewRecord(user.uid);
            signUP = false;
        }
        document.getElementById('details-msg').innerHTML = 
        "Click on any Request/Response to view details.";
        document.querySelector('.request__list').innerHTML="";
        document.querySelector('.accepted__list').innerHTML="";
        responses_queue = []; results_queue = [];
        setHospitalName(user.uid);
        User.id = user.uid;
        requestRecords(user.uid);
    }
    else {
        document.getElementsByClassName('header__btn')[0].style.display="none";
        document.getElementById('primary').style.display = "none";
        document.getElementById('secondary').style.display = "block";
    }
});


function setHospitalName(id) {
    document.getElementById('HosName').innerHTML = "";
    db.collection("Hospital").where("hospital_id", "==", id).get()
    .then( (snapshot) => {
        snapshot.docs.forEach(element => {
            User.name = element.data().name;
            document.getElementById('HosName').innerHTML = element.data().name;
        });
    });
}

function writeNewRecord(id) {
    db.collection("Hospital").doc(id).set({
        location_latitude : pos.lat,
        location_longitude : pos.lng,
        name:  document.getElementById('Name').value,
        contact_number : document.getElementById('Contact_No').value,
        registration_id : document.getElementById('Registration_ID').value,
        hospital_id: id
    });
}

function requestRecords(id) {
     var page = db.collection("Request").where("designated_hospital_id", "==", id).get()
    .then( (snapshot) => {
        document.getElementsByClassName('main-display__content')[0].style.display="flex";
        snapshot.docs.forEach(element => {
            renderRequests(element);
        });
        if(results_queue.length==0 && responses_queue.length==0) {
            document.getElementById('details-msg').innerHTML = 
            'Currently, there are no incoming/accepted requests';
        
        }
        setButtons();
        display();
    })
}

function renderRequests(doc) {
    var icon = "css/img/ic_blood.png";
    if (doc.data().type=="request_ambulance")
        icon = "css/img/ic_amb.png";
    var newHtml = "<li class=\"list__item\" id=#"+doc.data().rid;
    if(doc.data().status=="ongoing")
        newHtml += " onclick=\"displayDetails(1,id)\">";
    else if (doc.data().status=="accepted")
        newHtml += " onclick=\"displayDetails(2,id)\">";
    newHtml += "<img class=\"item-icon\" src="+icon+"><div class=\"item-main\">"
    +minimize(doc.data().user_name)+"</div></li>";

    if(doc.data().status=="ongoing") {
        results_queue.push({
            id : doc.data().rid,
            data : newHtml
        });
    }
    else if (doc.data().status=="accepted") {
        responses_queue.push({
            id : doc.data().rid,
            data : newHtml
        });
    }
}

function minimize(name) {
    var returnName = name;
    if(name.length > 10) {
        returnName = ""
        for (var i=0 ; i< 9 ;i++)
            returnName += name[i];
        returnName+='...';
    }
    return returnName;
}

function displayDetails(panel,id) {
    id = id.replace('#','');
    var type="";
    clearFields();
    document.getElementsByClassName('details-item')[0].style.display = 'none';
    var database_element=db.collection("Request").where("rid", "==", id).get();
    database_element.then( (snapshot) => {
        document.getElementsByClassName('details-item')[0].style.display = 'block';
        document.getElementsByClassName('details__wall')[0].style.display = "none";
        snapshot.docs.forEach(element => {
            if(element.data().type=="request_blood")
                type="Blood";
            else if (element.data().type=="request_ambulance")
                type="Ambulance";
            if(panel == 1) {
                for( var i = 0 ; i < results_queue.length ; i++ ) {
                    if( results_queue[i].id == element.data().rid) {
                        results_queue[i].id = element.id;
                        break;
                    }
                }
            }
            if(panel == 2) {
                for( var i = 0 ; i < responses_queue.length ; i++ ) {
                    if( responses_queue[i].id == element.data().rid) {
                        responses_queue[i].id = element.id;
                        break;
                    }
                }
            }
            document.getElementById('Detail_AcceptTime').style.display = "none";
            document.getElementById('DetailName').innerHTML = element.data().user_name;
            document.getElementById('DetailType').innerHTML = type;
            document.getElementById('DetailStatus').innerHTML = element.data().status;
            document.getElementById('DetailRTime').innerHTML = getTime(element.data().request_timestamp);
            if(document.getElementById('DetailLocation') != null)
                document.getElementById('DetailLocation').innerHTML = element.data().location;
            if(element.data().status=="ongoing") {
                document.getElementById('button-container').innerHTML = 
                "<div class=\"btn btn-btm btn-btm-submit accept-button\" id=\""+element.id+"\"  onclick=\"acceptRequest(1,id)\">Accept Request</div>";
            }
            else if (element.data().status=="accepted") {
                document.getElementById('Detail_AcceptTime').style.display= "block";
                document.getElementById('DetailATime').innerHTML = getTime(element.data().accept_timestamp);
                document.getElementById('button-container').innerHTML = 
                "<div class=\"btn btn-btm btn-btm-submit accept-button\" id=\""+element.id+"\"  onclick=\"acceptRequest(2,id)\">Complete Request</div></div>"; 
            }
        });
    });
    database_element.catch(() => {
        var element = document.getElementById('#'+id);
        element. parentNode. removeChild(element);
    })
}

function acceptRequest(type,rid) {
    var Change;
    rid = rid.replace('#','');
    try {
     var database_element=db.collection("Request").where("rid", "==", rid).get();
    }
    catch(error) {
        if(error) {
            document.getElementsByClassName('details-item')[0].style.display = "none";
            document.getElementsByClassName('details__wall')[0].style.display = "block";
            return;
        }
    }
    document.querySelector('.details-item').style.display = "none";
    if(type == 1) {
        var index ;
        for( var i = 0 ; i < results_queue.length ; i++ ) {
            if( results_queue[i].id == rid) {
                index = i;
                responses_queue.push(results_queue[i]);
                break;
            }
        }
        if (index > -1) {
            results_queue.splice(index, 1);
        }
        Change = db.collection("Request").doc(rid).update( {
            status : "accepted",
            hospital_id : User.id,
            accepted_by : User.name,
            accept_timestamp : new Date().getTime()
        });
        Change.catch( (error) => {
          console.log(error);
        })
    }
    else {
        var index ;
        for( var i = 0 ; i < responses_queue.length ; i++ ) {
            if( responses_queue[i].id == rid) {
                index = i;
                break;
            }
        }
        if (index > -1) {
            responses_queue.splice(index, 1);
        }
      Change=db.collection("Request").doc(rid).update( {
        status : "completed",
      });
    }
    document.querySelector('.request__list').innerHTML="";
    document.querySelector('.accepted__list').innerHTML="";
    display();
}



