//////////////////////////////////
// ---------------------
//  1) Base functions
//      1.1. Cards' constructor
//      1.2. Suffle deck
//      1.3. Get card game deck
//      1.4. Add card to board
//      1.5. Clean board
//      1.6. Sum card
//      1.7. Give a card
//      1.8. Start a new game
//
//  2) Buttons
//      2.1. Hide/unhide buttons
//      2.2. Start New Game
//      2.3. Reset     
//      2.4  Hit
//      2.5  Stan
//
//  3) Create game setting
//      3.1. Create deck
//      3.2. Counters
//
// ---------------------
//////////////////////////////////

// --------------------------
// 1) Cards 
// --------------------------

// 1.1. Cards' constructor
function createCard(suit,cardNumber){
    this.suit = suit; // card suit
    this.cardNumber = cardNumber; // card base number from 1:13
    switch(cardNumber){ // Add values and card names
        case 1: // Ace
            this.value = 11;  // value in the game 
            this.str = "Ace of " + suit; // String displayed for the card (e.g. Ace of Spades)
            break;
        case 11: // Jack
            this.value = 10;
            this.str = "Jack of " + suit;
            break;
        case 12: // Queen
            this.value = 10;
            this.str = "Queen of " + suit;
            break;
        case 13: // King
            this.value = 10;
            this.str = "King of " + suit;
            break;
        default: // any other card
            this.value = cardNumber;
            this.str = cardNumber + " of " + suit; // use the number instead of an specific string
            break; 
    }
}

// 1.2 Suffle deck

// Aplication of Fisher–Yates shuffle
// see https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
function suffle(arr) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled;
}

//  1.3. Get card from game deck
function getCardFromDeck(){
    let card = playingDeck.splice(0,1); // mutate the playing deck | sampling without replacement
    return [card,playingDeck];

}

//   1.4. Add card to board
function addCardToBoard(boardID,cardID){
    // Create card
    let imageSource = "./images/cards/" + cardID + ".png"; //create imagesource
    const cardImg = document.createElement("img");    // create card as image 
    cardImg.classList.add("card");   // card image clas
    cardImg.src = imageSource;
    // Add card to the board
    const  board = document.getElementById(boardID); // get the playboard
    board.appendChild(cardImg);  // add cell to playboard
}
//   1.5. Clean board
function cleanBoard(boardID){
    const  board = document.getElementById(boardID); // get the playboard
    while (board.firstChild) {              // while there are child elements...
        board.removeChild(board.lastChild); // ...remove the last child element
      }
}

//   1.6. Sum card
function sumUpPoints(who,cardValue){
    // inner sum function
    let innerSum = function(who){
        sum = who.arr.reduce(function(a, b){ // sum array value, to get the points
            return a + b;
        }, 0);
        return sum;
    }
    // push card into cards array
    who.arr.push(cardValue);
    // sum up results
    if(who.arr.includes(11) && (innerSum(who)>20)){ // check Aces
        for(let i = 0; i<who.arr.length; i++){   // check Aces loop
            if(who.arr.includes(11) && (innerSum(who)>21) && ((who.arr[i]) == 11)){
                who.arr[i] = 1;  
            }
        }// end of loop
    }// end of check Aces
    who.points = innerSum(who); //sum 
 
    if(who == dealer){
        document.getElementById("dealer").innerHTML = who.points;
    }else if(who == player){
        document.getElementById("player").innerHTML = who.points;
    }
}

//   1.7. Give a card
function giveCardTo(who){
    let card = getCardFromDeck()[0][0]; // get card
    if(who == "dealer"){
        sumUpPoints(dealer,card.value);
        addCardToBoard("dealerBoard",card.id);
    }else if(who == "player"){
        sumUpPoints(player,card.value);
        addCardToBoard("playerBoard",card.id);
    }
}

//   1.8. Start a new game
function startNewGame(){
    //reset dealer and player:
    dealer = {arr:[],points:0};
    player = {arr:[],points:0};
    // clean dealer board;
    cleanBoard('dealerBoard');
    addCardToBoard('dealerBoard','backside');
    // clean player board;
    cleanBoard('playerBoard');
    addCardToBoard('playerBoard','backside');
    // Suffle deck:
    playingDeck = suffle(baseDeck);
    // Give cards to dealer:
    giveCardTo("dealer");
    giveCardTo("player");
    giveCardTo("player");
    return playingDeck;
}


// --------------------------
// 2) Buttons 
// --------------------------
// 2.1. Hide/unhide buttons
function displayOrHide(type,startButton){
    let buttonsDisplay = "";
    let startDisplay = "";
    if(type == "unhide" && startButton == "start"){
        console.log("reset unhide")
        buttonsDisplay = "inline";
        startDisplay = "none";
    }else if(type == "hide" && startButton == "reset"){
        buttonsDisplay = "none";
        startDisplay = "inline";
    }else{
        buttonsDisplay = "inline";
        startDisplay = "inline";
    }

    const buttons = document.getElementsByClassName("hdnButton");
    for(let i = 0; i<buttons.length; i++){ 
        buttons[i].style.display = buttonsDisplay;
    }
    // start/reset button
    const startBtn = document.getElementById(startButton);
    startBtn.style.display = startDisplay;
}


// 2.2. Start New Game
function start(){
    // start game
    startNewGame();
    if(player.points == 21){    // if blackjack, just display it
        displayOrHide("hide","reset");
        document.getElementById("comments").innerHTML = "Blackjack at first try! Incredible!";
    }else{ // else, normal game
        displayOrHide("unhide","start");
        document.getElementById("comments").innerHTML = "Let's play!";

    }
    return playingDeck;
}

// 2.3. Reset
function reset(){
    startNewGame();
    if(player.points == 21){     // if blackjack, just display it
        displayOrHide("hide","reset");
        document.getElementById("comments").innerHTML = "Blackjack! You win!";
    }else{ // else, normal game
        displayOrHide("unhide","reset");
        document.getElementById("comments").innerHTML = "Need a reset?";
    }
    return playingDeck;
}

// 2.4. Hit
function hit(){
    giveCardTo("player");
    if(player.points > 21){     // if blackjack, just display it
        displayOrHide("hide","reset");
        document.getElementById("comments").innerHTML = "You busted with " + player.points + ". You lose.";
    }else{
        document.getElementById("comments").innerHTML = "Hit or Stand.";
    }
    return playingDeck;
}
// 2.5. Stan
var interval = setInterval(()=>{},1); // set timer interval
function stan(){
    displayOrHide("hide","reset");
    interval = setInterval(// repeat every second
         () =>{
            if(dealer.points<17){ // if the dealer have less than 17, keep playing
                giveCardTo("dealer");
            }else{ // if the dealer have less than 17, keep playing
                if(dealer.points>21){ //different scenarios 
                    document.getElementById("comments").innerHTML = "Dealer busted with " + dealer.points + ". You win!";
                }else if(dealer.points > player.points){
                    document.getElementById("comments").innerHTML = "Your lose with " + player.points + " versus the dealer " + dealer.points + ".";
                }else if(dealer.points == player.points){
                    document.getElementById("comments").innerHTML = "It's a tie with " + player.points + ".";

                }else{
                    document.getElementById("comments").innerHTML = "You won! You have " + player.points + ".";
                }
                clearInterval(interval);    // if dealer is over 17, stop interval       
            }
        },1000)
}

// --------------------------
// 3) Create game setting 
// --------------------------

// 3.1. Create deck
let baseDeck = new Array(52); // create base deck witch all cards ordered
let suits = ["Clubs","Diamonds","Hearts","Spades"];

let n = 0;
suits.map((suit)=>{  // go thorught the suits
    for(let i=1; i<14;i++){
        baseDeck[n] = new createCard(suit,i); //create the cards
        baseDeck[n].id = n+1;
        n += 1;
    }
})

var playingDeck = suffle(baseDeck); // create playing deck (this will be mutated)

// 3.2. Counters
dealer = {arr:[],points:0};
player = {arr:[],points:0};


