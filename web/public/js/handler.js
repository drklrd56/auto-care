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

var pos = {lat : 0 , lng : 0} ;

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(function(position) {
        pos.lat = position.coords.latitude;
        pos.lng = position.coords.longitude;
      },
      function(error) {
        if (error.code == error.PERMISSION_DENIED)
            signup_button.disabled = true;
            error_signup.style.display =  'block';
            error_signup.innerHTML = '<h3 class=\'error-message\' style=\"font-size: 1.2em;color: #851515;\">'+
            'Location permission is required.'+'</h3>';
    });
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