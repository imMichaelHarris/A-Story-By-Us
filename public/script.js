let phrase = document.getElementById('phrase');
const userInput = document.getElementById('userInput');
const submit = document.querySelector('.submitBtn');
const error = document.querySelector('.error');
const sumbitInfo = document.querySelector('.submitted');
const tip = document.querySelector('.tip');
const topic = document.getElementById('topic');
let ip ;

//checks to see if user has already submitted a post to the db
//if user has submitted before button will be disabled
$(document).ready(function(){
    $.get('https://jsonip.com', function(res){
        ip = res.ip.toString();
    if(db.collection("users").doc(ip).get()
    .then(function(doc){
        if(doc.exists){
            sumbitInfo.textContent = `You've already submitted.`;
            submit.style.background = 'lightgrey';
            submit.disabled = true;
        } else {
            console.log("You haven't submitted yet!");
        }
    }));
    })
})
  
const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true
  });



//Call to database to grab phrase
db.collection("Phrases").doc("December 2018").get()
    .then(function(doc){
        if(doc.exists){
            topic.textContent = doc.data().Topic;
            phrase.textContent = doc.data().phrase;
        } else {
            console.log("No such document!");
        }
    }).catch(function(err){
        console.log("There was an error! " + err)
    });


//Function that adds users to the database and adds their phrase to phrase db

const addPhrase = () => {
    const length = userInput.value.length;
    if(length >= 3 && length <= 25){
        const uInput = userInput.value;
        //Filters to check if submission has profanity words
        if(!uInput.includes("nigga") && !uInput.includes("bitch") && !uInput.includes("nigger") && !uInput.includes("ass") && !uInput.includes("pussy") && !uInput.includes("cunt") && !uInput.includes("dick")){
            db.collection("users").doc(ip).set({
                user: ip
            }).then(function() {
            db.collection("Phrases").doc("December 2018").update({
                phrase: `${phrase.textContent} ${userInput.value}`
            })})
            .then(function() {
                sumbitInfo.style.color = 'green';
                sumbitInfo.textContent = "Your phrase has been added!";
                console.log("Document successfully written!");
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            });
        } else {
            error.textContent = 'No profanity please';
        }

    } else {
       error.textContent = length <= 3 ? 'Submission requirements are 3-25 characters' : 'Submission requirements are 3-25 characters'
    }

}

