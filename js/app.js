card_list = ["space-shuttle", "space-shuttle", "laptop", "laptop", "git-square", "git-square", "gamepad", "gamepad",
    "headphones", "headphones", "rocket", "rocket", "linux", "linux", "reddit-alien", "reddit-alien"
];

var matchers = 0;
var movesCount = 0;
var starCounts = 3;
var opened_cards = [];


$score_panel = $('.score-panel');
$score_panel.hide()
$timer = $('.timer');
$restarter = $('.restart');
$moves = $('.moves');
$finalStars = $('.finalStars');
$finalTimer = $('.finalTimer');
$deck = $('.deck');
currentTimer = null;

var nowTime
/*
display:
prepare the deck in general;
- shuffles and display the cards on the deck.
- call prepareCounters.
- start a timer and displays it on the deck.
*/
function initTime() {
    var time = 0;
    var minutes;
    var seconds;
     nowTime = setInterval(function () {
        minutes = Math.floor(time / 60);
        seconds = time - minutes * 60;
        $timer.text(`${ minutes}` + ':' + `${seconds}`)

        time += 1;
    }, 1000);
}

function display(cards,shuffled) {
    $deck.empty()
    initTime()
    // shuffled = shuffle(cards);

    for (let i = 0; i < shuffled.length; i++) {
        $card = memoryCard(shuffled[i]);
        $deck.append($card);
    }
}


/*
prepareCounters:
- displays number of moves on the deck.
- list the stars on the deck.
*/
function prepareCounters() {

    $moves.text(`${movesCount}`);

    let j = 2;
    while (j >= 0) {
        $('.stars').append('<li><i class="fa fa-star"></i></li>');
        j--;
    }
}

/*
memoryCard:
- prepare a card.
- it does the following functionalities:
    - if a card clicked, it displays its symbol.
    - if multiple cards been clicked, it call check function to check if they're matched.
    - it reduces stars count after certain number of cards clicks.
*/
function memoryCard(name) {
    $card = $(`<li class="card">
               <i class="fa fa-${name}"></i>
           </li>`);

    $card.on("click", function () {

        if (!$(this).hasClass('show open')) {

            $moves.text(++movesCount);

            if (!opened_cards.includes($(this))) {
                $(this).addClass("show open");
                opened_cards.push($(this));

            }

            if (opened_cards.length == 2) {
                check_for_match();
            }

            if (movesCount % 10 == 0) {
                if (starCounts >= 0) {
                    $('.stars').children()[starCounts - 1].remove();
                    $('.stars').append('<li><i class="fa fa-star-o"></i></li>');

                    starCounts -= 1;
                }
            }
        }

    });

    return $card;
}




/*
check_for_match:
- check if two opened cards are mathed, if so.. it add class match and increment the number of matchers then clean the opened cards array.
- in case it reaches 8 matchers, it shows the winning div.
-
*/
function check_for_match() {
    if (opened_cards[0].children().attr('class') == opened_cards[1].children().attr('class')) {

        opened_cards[0].addClass("match");
        opened_cards[1].addClass("match");

        matchers += 1;
        if (matchers == 8) {
            game_over($moves.text(),$timer.text())
        }
        $('.matches').html(matchers)
    } else {
        close_cards(opened_cards)
    }

    opened_cards = [];
}

/*
restart:
- it resets everything to play the game again.
*/
function restart(){
 	$('.deck').empty();
  $('.timer').empty();
  $('.restart').empty();
  $('.moves').empty();
 	opened_cards =[];
  cleanStars();
 	matchers = 0;
  movesCount = 0;
  resetTimer(currentTimer);

  start_game();

}
/*
cleanStars:
- it removes the empty stars during restarting the game so that the filled stars will take its place.
*/
function cleanStars() {
  let j = 2;
  while(j >= 0){
  $('.stars').children()[j].remove();
    j--;
  }
}

async function close_cards(array_cards) {
    let del = await delay(1000)
    array_cards[0].removeClass('show open')
    array_cards[1].removeClass('show open')
}
function open_cards(cards,shuffled) {
    // array_cards = shuffle(cards);
    for (let i = 0; i < shuffled.length; i++) {
        $card = memoryCard(shuffled[i]);
        $card.addClass('show open')
        $('.deck').append($card);
    }
}
// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
;
    return array;
}
async function start_game() {
    var shuffled = shuffle(card_list);
    $deck.empty();
    open_cards(card_list,shuffled)
    let delayres = await delay(5000);
    $score_panel.show();
    display(card_list,shuffled)
}

async function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}

function game_over(move,time) {
    if(nowTime)
    {
        clearInterval(nowTime)
    }
    swal({
        title:'You Win',
        type:'success',
        html:' You Take '+move+' moves and time '+time+' seconds<br>Play Again?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, play again!'
    }).then((response)=>{
        if(response.value)
        {
            start_game();
        }

    });
}

start_game();

