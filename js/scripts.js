//scripts.js

var buyPrices = {}; //dictionary of buy prices
var sellPrices = {}; //dictionary of sell prices
var times = {}; //dictionary of server times (or local time substitutes)
var exportClicked = false; //track if user has clicked export button

//functions to define behavior in the case of success/failure of specific requests
function coinbaseSuccess(responseData){
    buyPrices.coinbaseBuy = "$" + responseData.ask;
    times.coinbaseTime = new Date(responseData.time);
}

function coinbaseError(){
    if (buyPrices.coinbaseBuy.length < 1){
        buyPrices.coinbaseBuy = "coinbase price GET error";
    }
    else{
        buyPrices.coinbaseBuy += " (stale)";        
    }
    if (times.coinbaseTime.length < 1){
        times.coinbaseTime = "coinbase time GET error";
    }
    else{
        times.coinbaseTime += " (stale)";        
    }
}

function krakenPriceSuccess(responseData){
    if (responseData.error.length > 0){
        if (buyPrices.krakenBuy.length < 1){
            buyPrices.krakenBuy = "errors retrieving price from kraken";
        }
        else{
            buyPrices.krakenBuy += " (s-stale)"
        }
    }
    else{
        buyPrices.krakenBuy = "$" + responseData.result.XXBTZUSD.a[0];                   
    }
}

function krakenPriceError(){
    if (buyPrices.krakenBuy.length < 1){
        buyPrices.krakenBuy = "kraken price GET error";
    }
    else{
        buyPrices.krakenBuy += " (stale)";        
    }
}

function krakenTimeSuccess(responseData){
    if (responseData.error.length > 0){
        if (times.krakenTime.length < 1){
            times.krakenTime = "errors retrieving time from kraken";
        }
        else{
            times.krakenTime += " (s-stale)";        
        }
    }
    else{
        var krakenEpochSecs = responseData.result.unixtime;
        // convert from unixtime to rfc1123    
        var d = new Date(0); // make new date with epoch seconds = 0
        d.setUTCSeconds(krakenEpochSecs); //add kraken epoch secs
        times.krakenTime = d;
    }
}

function krakenTimeError(){
    // some reason some kraken time GET calls get in here, 
    // commenting out so it doesn't update old valid times with an error string, 
    // instead indicate time is old
    if (times.krakenTime.length < 1){
        times.krakenTime = "kraken time GET error";
    }
    else{
        times.krakenTime += " (stale)";        
    }
}

function geminiSuccess(responseData){
    buyPrices.geminiBuy = "$" + responseData.ask;
    var geminiEpochMs = responseData.volume.timestamp; //num milisecs after epoch from gemini
    // convert from unixtime to rfc1123    
    var d = new Date(0); // make new date with epoch miliseconds = 0
    d.setUTCMilliseconds(geminiEpochMs); //add gemini epoch ms
    times.geminiTime = d;
}

function geminiError(){
    if (buyPrices.geminiBuy.length < 1){
        buyPrices.geminiBuy = "gemini price GET error";
    }
    else{
        buyPrices.geminiBuy += " (stale)";        
    }
    if (times.geminiTime.length < 1){
        times.geminiTime = "gemini time GET error";
    }
    else{
        times.geminiTime += " (stale)";        
    }
}

function zebpaySuccess(responseData){
    sellPrices.zebpaySell = "Rs." + responseData.sell;
    var d = new Date();
    times.zebpayTime = d;
}

function zebpayError(){
    if (sellPrices.zebpaySell.length < 1){
        sellPrices.zebpaySell = "zebpay price GET error";
    }
    else{
        sellPrices.zebpaySell += " (stale)";        
    }
    if (times.zebpayTime.length < 1){
        times.zebpayTime = "zebpay time GET error";
    }
    else{
        times.zebpayTime += " (stale)";        
    }
}

function unocoinSuccess(responseData){
    sellPrices.unocoinSell = "Rs." + responseData;
    var d = new Date();
    times.unocoinTime = d;
}

function unocoinError(){
    if (sellPrices.unocoinSell.length < 1){
        sellPrices.unocoinSell = "unocoin price GET error";
    }
    else{
        sellPrices.unocoinSell += " (stale)";        
    }
    if (times.unocoinTime.length < 1){
        times.unocoinTime = "unocoin time GET error";
    }
    else{
        times.unocoinTime += " (stale)";        
    }
}

function coinsecureSuccess(responseData){
    //divide rate by 100, last 2 digits are paise
    sellPrices.coinsecureSell = "Rs." + float(data.message.rate)/100.00;
    times.coinsecureTime = data.time;
    //TODO: convert to rfc1123
}

function coinsecureError(){
    if (sellPrices.coinsecureSell.length < 1){
        sellPrices.coinsecureSell = "coinsecure price GET error";
    }
    else{
        sellPrices.coinsecureSell += " (stale)";        
    }
    if (times.coinsecureTime.length < 1){
        times.coinsecureTime = "coinsecure time GET error";
    }
    else{
        times.coinsecureTime += " (stale)";        
    }
}

//wrapper for ajax request so enchance readability in the $(document).ready() function
function callExchangeApi(type, url, headers, dataType, success, error){
    return $.ajax({
        type: type,
        url: url,
        headers: headers,
        crossDomain: true,
        //data:{},
        dataType: dataType,
        success: success,
        error: error
    });
}

$(document).ready(function() {
    window.setInterval(function() {
        //in here, get buy price (sometimes called 'lowest Ask') and 
        //sell price ('highest bid') from relevant APIs
        //and get time from API usually as field "unixtime" in response JSON object
        //store this data in relevant variables at top of this file
        //load results into relevant HTML elements

        var coinbaseCall = callExchangeApi('GET', 'https://api.gdax.com/products/BTC-USD/ticker', 
            {}, 'json', coinbaseSuccess, coinbaseError);
        coinbaseCall.always(function(){
            //write to html objects after call finishes (success or error)
            $("#coinbaseBuy").html(buyPrices.coinbaseBuy);
            $("#coinbaseDateTime").html(times.coinbaseTime);
        });
        
        var krakenPriceCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD', 
            {'Access-Control-Allow-Origin': '*'}, 'json', krakenPriceSuccess, krakenPriceError);
        krakenPriceCall.always(function(){
            $("#krakenBuy").html(buyPrices.krakenBuy);
            var krakenTimeCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://api.kraken.com/0/public/Time', 
                {'Access-Control-Allow-Origin': '*'}, 'json', krakenTimeSuccess, krakenTimeError);
            krakenTimeCall.always(function(){
                $("#krakenDateTime").html(times.krakenTime);
            });
        });

        var geminiCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://api.gemini.com/v1/pubticker/btcusd', 
            {'Access-Control-Allow-Origin': '*'}, 'json', geminiSuccess, geminiError);
        geminiCall.always(function(){
            $("#geminiBuy").html(buyPrices.geminiBuy);
            $("#geminiDateTime").html(times.geminiTime);
        });

        var zebpayCall = callExchangeApi('GET', 'https://www.zebapi.com/api/v1/market/ticker/btc/inr', 
            {}, 'json', zebpaySuccess, zebpayError);
        zebpayCall.always(function(){
            $("#zebpaySell").html(sellPrices.zebpaySell);
            $("#zebpayDateTime").html(times.zebpayTime);
        });

        // var unocoinCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://www.unocoin.com/trade?sell', 
        //     {'Access-Control-Allow-Origin': '*'}, '', unocoinSuccess, unocoinError);
        // unocoinCall.always(function(){
        //     $("#unocoinSell").html(sellPrices.unocoinSell);
        //     $("#unocoinDateTime").html(times.unocoinTime);
        // });
        
        // var coinsecureCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://api.coinsecure.in/v1/exchange/bid/high', 
        //     {'Access-Control-Allow-Origin': '*'}, '', coinsecureSuccess, coinsecureError);
        // coinsecureCall.always(function(){
        //     $("#coinsecureSell").html(sellPrices.coinsecureSell);
        //     $("#coinsecureDateTime").html(times.coinsecureTime);
        // });

    }, 120);
});

$("button").click(function(){
    //export the data from the html table element into a file
    var table;
    if(!exportClicked){
        table = $("table").tableExport();
        exportClicked = true;        
    }
    else{
        table.reset();
        table = $("table").tableExport();
    }
});