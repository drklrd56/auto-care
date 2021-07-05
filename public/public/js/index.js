var email  = document.getElementById('login-email');
var signup_email = document.getElementById('signup-email');

var main_button = document.getElementById('login-button');
var signup_button = document.getElementById('signup-button');

var error_login=document.getElementById('error-login');
var error_signup=document.getElementById('error-signup');
var Registration_id = document.getElementById('Registration_ID');
var contact_no = document.getElementById('Contact_No');

var result_currentPage = 1;
var result_first = 0;
var results_queue = new Array();
var result_capacity = 6;
var response_currentPage = 1;
var response_first = 0;
var responses_queue= new Array();
var response_capacity = 6 ;

var pos = {lat : 0 , lng : 0} ;


if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
        pos.lat = position.coords.latitude;
        pos.lng = position.coords.longitude;
    },
    function(error) {
        if (error.code == error.PERMISSION_DENIED) {
            signup_button.disabled = true;
            error_signup.style.display =  'block';
            error_signup.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
            'Location permission is required.'+'</h3>';
        }
    });
}


function getTime(time) {

    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = new Date(time);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return convdataTime;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


if(email != null) {
    email.addEventListener('change', () => {
        if(validateEmail(email.value) ==0 ) {
            main_button.disabled = true;
            error_login.style.display =  'block';
            error_login.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
            'Invalid Email format'+'</h3>';
        } else {
            main_button.disabled = false;
            error_login.style.display =  'none';
        }
    });
}

if(Registration_id != null) {
    Registration_id.addEventListener('change', () => {
        if(Registration_id.value.length != 13 ) {
            signup_button.disabled = true;
            error_signup.style.display =  'block';
            error_signup.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
            'Registration Length no valid'+'</h3>';
        } else {
            signup_button.disabled = false;
            error_signup.style.display =  'none';
        }
    });
}

if(contact_no != null) {
    contact_no.addEventListener('change', () => {
        if(contact_no.value.length != 11 ) {
            signup_button.disabled = true;
            error_signup.style.display =  'block';
            error_signup.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
            'Contact NO Length no valid'+'</h3>';
        } else {
            signup_button.disabled = false;
            error_signup.style.display =  'none';
        }
    });
}


if(signup_email != null) {
    signup_email.addEventListener('change', () => {
        if(validateEmail(signup_email.value) ==0 ) {
            signup_button.disabled = true;
            error_signup.style.display =  'block';
            error_signup.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
            'Invalid Email format'+'</h3>';
        } else {
            signup_button.disabled = false;
            error_signup.style.display =  'none';
        }
    });
}

var requests = document.getElementsByClassName('list__item');



function hide(whichOne) {
    if(whichOne == 1) {
        document.getElementById("signIN").style.display = "none";
        document.getElementById("signUP").style.display = "block";
    }
    else if(whichOne == 0) {
        document.getElementById("signUP").style.display = "none";
        document.getElementById("signIN").style.display = "block";
    }
}
function clearFields() {
    document.getElementById('DetailName').innerHTML = "";
    document.getElementById('DetailType').innerHTML = "";
    document.getElementById('DetailStatus').innerHTML = "";
    document.getElementById('DetailRTime').innerHTML = "";
    document.getElementById('DetailATime').innerHTML = "";
    document.getElementById('DetailLocation').innerHTML = "";
    
}

function setButtons() {

    if(response_capacity < responses_queue.length)
        document.getElementById('response_next-btn').style.display = "flex"; 
    if(result_capacity < results_queue.length)
        document.getElementById('result_next-btn').style.display = "flex"; 

    if(result_currentPage == 1)
        document.getElementById('result_prev-btn').style.display = "none"; 
    if(response_currentPage == 1)
        document.getElementById('response_prev-btn').style.display = "none"; 

    if(response_capacity >= responses_queue.length )
        document.getElementById('response_next-btn').style.display = "none";

    if(result_capacity >= results_queue.length)
        document.getElementById('result_next-btn').style.display = "none"; 

    if(result_currentPage != 1)
        document.getElementById('result_prev-btn').style.display = "flex"; 
    if(response_currentPage != 1)
        document.getElementById('response_prev-btn').style.display = "flex"; 
}

document.getElementById('result_next-btn').addEventListener( "click", () => {
    if(document.getElementById('result_next-btn').disabled == false) {
        switch_btn(0,1);
        setTimeout(()=>{
            switch_btn(0,0);
        },600);
        document.querySelector('.request__list').innerHTML="";
        result_currentPage+=1;
        result_first = result_capacity;
        result_capacity+=6;
        setTimeout(()=>{displayResults();},500);
        setButtons();
    }
})
document.getElementById('response_next-btn').addEventListener( "click", () => {
    if(document.getElementById('response_next-btn').disabled ==false) {
        switch_btn(2,1);
        setTimeout(()=>{
            switch_btn(2,0);
        },600);
        document.querySelector('.accepted__list').innerHTML="";
        response_currentPage+=1;
        response_first = response_capacity;
        response_capacity+=6;
        setTimeout(()=>{displayResponses();},500);
        setButtons();
    }
    
})

document.getElementById('result_prev-btn').addEventListener( "click", () => {
    if(document.getElementById('result_prev-btn').disabled == false) {
        switch_btn(0,1);
        setTimeout(()=>{
            switch_btn(0,0);
        },600);
        document.querySelector('.request__list').innerHTML="";
        result_currentPage -= 1;
        result_capacity -= 6;
        result_first -= 6;
        setTimeout(()=>{displayResults();},500);
        setButtons();
    }
})

document.getElementById('response_prev-btn').addEventListener( "click", () => {
    if(document.getElementById('response_prev-btn').disabled ==false) {
        switch_btn(2,1);
        setTimeout(()=>{
            switch_btn(2,0);
        },600);
        document.querySelector('.accepted__list').innerHTML="";
        response_currentPage -= 1;
        response_capacity -= 6;
        response_first -= 6;
        setTimeout(()=>{displayResponses();},500);
        setButtons();
    }
    
})


function display() {
    displayResponses();
    displayResults();
}

function displayResponses() {
    for(var i = response_first; i< response_capacity;i++) {
        if(responses_queue[i] != null)
            document.querySelector('.accepted__list').insertAdjacentHTML('beforeend', responses_queue[i].data);   
    }
}
function displayResults() {
    for(var i = result_first; i< result_capacity ;i++) {
        if(results_queue[i] != null)
            document.querySelector('.request__list').insertAdjacentHTML('beforeend', results_queue[i].data);
    }
}


function clearDisplyPanels() {
    document.querySelector('.request__list').innerHTML="";
    document.querySelector('.accepted__list').innerHTML="";
}

function switch_btn(type,state) {
    if(type == 0) { 
        document.getElementById('result_prev-btn').disabled = state;
        document.getElementById('result_next-btn').disabled = state;
    }
    if(type == 2) { 
        document.getElementById('response_prev-btn').disabled = state;
        document.getElementById('response_next-btn').disabled = state;
    }
}

// FireBase Functions


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
        var Name = document.getElementById('hos_name');
        console.log(Name.value == undefined,Name.value == null);
        if(Name.value == "") {
            error_signup.style.display =  'block';
            error_signup.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
            'Name field is empty'+'</h3>';
        }
        else {
            if(signup_password.value == signup_Secpassword.value) {
                if(signup_email.value !=null &&
                    contact_no.value != null && Name!=""
                    && pos.lat!=0 && pos.lng!=0) {
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
                        'Invalid Data.Please try again.'+'</h3>';
                }
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
    if(user != null) {
        if(signUP) {
            writeNewRecord(user.uid);
            signUP = false;
        }
        User.id = user.uid;
        document.getElementById('details-msg').innerHTML = 
        "Click on any Request/Response to view details.";
        document.querySelector('.request__list').innerHTML="";
        document.querySelector('.accepted__list').innerHTML="";
        responses_queue = []; results_queue = [];
        setHospitalName(user.uid);
        requestRecords(user.uid);
    }
    else {
        document.getElementsByClassName('header__btn')[0].style.display="none";
        document.getElementById('primary').style.display = "none";
        document.getElementById('secondary').style.display = "block";
    }
});


function setHospitalName(id) {
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
        name:  document.getElementById('hos_name').value,
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

function acceptRequest(type,docID) {
    var index = 0;
    var pushObj;
    docID = docID.replace('#','');
    var database_element=db.collection("Request").doc(docID).get();
    var job = database_element.then((snapshot) => {
        if(type == 1) {
            for( index = 0 ; index < results_queue.length ; index++ ) 
                if( results_queue[index].id == docID) 
                    break;
                if( index > -1 ) {
                    pushObj = results_queue[index];
                    results_queue.splice(index, 1); 
                }
        }
        else if (type == 2) {
            for( index = 0 ; index < responses_queue.length ; index++ )
                if( responses_queue[index].id == docID)
                    break;
        }
        document.querySelector('.request__list').innerHTML="";
        document.querySelector('.accepted__list').innerHTML="";
        if(snapshot.exists) {
            document.querySelector('.details-item').style.display = "none";
            if(type == 1) {
                responses_queue.push(pushObj);
                display();
                db.collection("Request").doc(docID).update( {
                    status : "accepted",
                    hospital_id : User.id,
                    accepted_by : User.name,
                    accept_timestamp : new Date().getTime()
                });
            }
            else {
                responses_queue.splice(index, 1);
                display();
                db.collection("Request").doc(docID).update( {
                    status : "completed",
                });
            }
        }
        else {
            display();
            document.getElementsByClassName('details-item')[0].style.display = 'none';
            document.getElementsByClassName('details__wall')[0].style.display = 'block';
            alert( "Request cancelled by patient");
        }
    });
}
