var buyPrices = {}; //dictionary of buy prices
var sellPrices = {}; //dictionary of sell prices
var times = {}; //dictionary of server times (or local time substitutes)

//functions to define behavior in the case of success/failure of specific requests
function coinbaseSuccess(responseData){
    buyPrices.coinbaseBuy = "$" + responseData.ask;
    times.coinbaseTime = responseData.time;
}

function coinbaseError(){
    buyPrices.coinbaseBuy = "coinbase price GET error";
    times.coinbaseTime = "coinbase time GET error";
}

function krakenPriceSuccess(responseData){
    if (length(responseData.error)>0){
        buyPrices.krakenBuy = "errors retrieving price from kraken";
    }
    else{
        buyPrices.krakenBuy = "$" + responseData.result.XXBTZUSD.a[0];                   
    }
}

function krakenPriceError(){
    buyPrices.krakenBuy = "kraken price GET error";
}

function krakenTimeSuccess(responseData){
    if (length(responseData.error)>0){
        times.krakenTime = "errors retrieving time from kraken";
    }
    else{
        times.krakenTime = responseData.result.rfc1123;
    }
}

function krakenTimeError(){
    times.krakenTime = "kraken time GET error";
}

function geminiSuccess(responseData){
    buyPrices.geminiBuy = "$" + responseData.ask;
    times.geminiTime = responseData.volume.timestamp;
    //TODO: convert geminiTime from unixtime to rfc1123
}

function geminiError(){
    buyPrices.geminiBuy = "gemini price GET error";
    times.geminiTime = "gemini time GET error";
}

function zebpaySuccess(responseData){
    sellPrices.zebpaySell = "Rs." + responseData.sell;
    var d = new Date();
    times.zebpayTime = d;
}

function zebpayError(){
    sellPrices.zebpaySell = "zebpay price GET error";
    times.zebpayTime = "zebpay time GET error";
}

function unocoinSuccess(responseData){
    sellPrices.unocoinSell = "Rs." + responseData;
    var d = new Date();
    times.unocoinTime = d;
}

function unocoinError(){
    sellPrices.unocoinSell = "unocoin price GET error";
    times.unocoinTime = "unocoin time GET error";
}

function coinsecureSuccess(responseData){
    //divide rate by 100, last 2 digits are paise
    sellPrices.coinsecureSell = "Rs." + float(data.message.rate)/100.00;
    times.coinsecureTime = data.time;
    //TODO: convert to rfc1123
}

function coinsecureError(){
    sellPrices.coinsecureSell = "coinsecure price GET error";
    times.coinsecureTime = "coinsecure time GET error";
}

function callExchangeApi(type, url, dataType, success, error){
    return $.ajax({
        type: type,
        url: url,
        //data:{},
        dataType: dataType,
        success: success,
        error: error
    });
}

$(document).ready(function() {
    window.setInterval(function() {
        //in here, get buy price (sometimes called 'lowest Ask') and 
        //sell price ('highest bid') from relevant APIs using OAuth if necessary
        //and get time from API usually as field "unixtime" in response JSON object
        //store this data in relevant variables at top of this file
        //load results into relevant HTML elements

        var coinbaseCall = callExchangeApi('GET', 'https://api.gdax.com/products/BTC-USD/ticker', 
            'json', coinbaseSuccess, coinbaseError);
        coinbaseCall.always(function(){
            //write to html objects after call finishes (success or error)
            $("#coinbaseBuy").html(buyPrices.coinbaseBuy);
            $("#coinbaseDateTime").html(times.coinbaseTime);
        });
        
        var krakenPriceCall = callExchangeApi('GET', 'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD', 
            'json', krakenPriceSuccess, krakenPriceError);
        krakenPriceCall.always(function(){
            $("#krakenBuy").html(buyPrices.krakenBuy);
            var krakenTimeCall = callExchangeApi('GET', 'https://api.kraken.com/0/public/Time', 
                'json', krakenTimeSuccess, krakenTimeError);
            krakenTimeCall.always(function(){
                $("#krakenDateTime").html(times.krakenTime);
            });
        });

        var geminiCall = callExchangeApi('GET', 'https://api.gemini.com/v1/pubticker/btcusd', 
            'json', geminiSuccess, geminiError);
        geminiCall.always(function(){
            $("#geminiBuy").html(buyPrices.geminiBuy);
            $("#geminiDateTime").html(times.geminiTime);
        });

        var zebpayCall = callExchangeApi('GET', 'https://www.zebapi.com/api/v1/market/ticker/btc/inr', 
            'json', zebpaySuccess, zebpayError);
        zebpayCall.always(function(){
            $("#zebpaySell").html(sellPrices.zebpaySell);
            $("#zebpayDateTime").html(times.zebpayTime);
        });

        var unocoinCall = callExchangeApi('GET', 'https://www.unocoin.com/trade?sell', 
            '', unocoinSuccess, unocoinError);
        unocoinCall.always(function(){
            $("#unocoinSell").html(sellPrices.unocoinSell);
            $("#unocoinDateTime").html(times.unocoinTime);
        });
        
        var coinsecureCall = callExchangeApi('GET', 'https://api.coinsecure.in/v1/exchange/bid/high', 
            '', coinsecureSuccess, coinsecureError);
        coinsecureCall.always(function(){
            $("#coinsecureSell").html(sellPrices.coinsecureSell);
            $("#coinsecureDateTime").html(times.coinsecureTime);
        });

    }, 120);
});

$("button").click(function(){
    //export to spreadsheet code here
    //export the data from the vars at the top of this file into a .csv(or .xls if there's an easy way to it) file
});