//buy prices and times from APIs
var coinbaseBuy;
var coinbaseTime;
var krakenBuy;
var krakenTime;
var geminiBuy;
var geminiTime;

//sell prices and times from APIs
var zebpaySell;
var zebpayTime;
var unocoinSell;
var unocoinTime;
var coinsecureSell;
var coinsecureTime;

//functions to define behavior in the case of success/failure of specific requests
function coinbaseSuccess(responseData){
    coinbaseBuy = "$" + responseData.ask;
    coinbaseTime = responseData.time;
}
function coinbaseError(){
    coinbaseBuy = "coinbase price GET error";
    coinbaseTime = "coinbase time GET error";
}

function krakenPriceSuccess(responseData){
    if (length(responseData.error)>0){
        krakenBuy = "errors retrieving price from kraken";
    }
    else{
        krakenBuy = "$" + responseData.result.XXBTZUSD.a[0];                   
    }
}

function krakenPriceError(){
    krakenBuy = "kraken price GET error";
}

function krakenTimeSuccess(responseData){
    if (length(responseData.error)>0){
        krakenTime = "errors retrieving time from kraken";
    }
    else{
        krakenTime = responseData.result.rfc1123;
    }
}

function krakenTimeError(){
    krakenTime = "kraken time GET error";
}

function geminiSuccess(responseData){
    geminiBuy = "$" + responseData.ask;
    geminiTime = responseData.volume.timestamp;
    //TODO: convert geminiTime from unixtime to rfc1123
}

function geminiError(){
    geminiBuy = "gemini price GET error";
    geminiTime = "gemini time GET error";
}

function zebpaySuccess(responseData){
    zebpaySell = "Rs." + responseData.sell;
    var d = new Date();
    zebpayTime = d;
}

function zebpayError(){
    zebpaySell = "zebpay price GET error";
    zebpayTime = "zebpay time GET error";
}

function unocoinSuccess(responseData){
    unocoinSell = "Rs." + responseData;
    var d = new Date();
    unocoinTime = d;
}

function unocoinError(){
    unocoinSell = "unocoin price GET error";
    unocoinTime = "unocoin time GET error";
}

function coinsecureSuccess(responseData){
    //divide rate by 100, last 2 digits are paise
    coinsecureSell = "Rs." + float(data.message.rate)/100.00;
    coinsecureTime = data.time;
    //TODO: convert to rfc1123
}

function coinsecureError(){
    coinsecureSell = "coinsecure price GET error";
    coinsecureTime = "coinsecure time GET error";
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
            $("#coinbaseBuy").html(coinbaseBuy);
            $("#coinbaseDateTime").html(coinbaseTime);
        });
        
        var krakenPriceCall = callExchangeApi('GET', 'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD', 
            'json', krakenPriceSuccess, krakenPriceError);
        krakenPriceCall.always(function(){
            $("#krakenBuy").html(krakenBuy);
            var krakenTimeCall = callExchangeApi('GET', 'https://api.kraken.com/0/public/Time', 
                'json', krakenTimeSuccess, krakenTimeError);
            krakenTimeCall.always(function(){
                $("#krakenDateTime").html(krakenTime);
            });
        });

        var geminiCall = callExchangeApi('GET', 'https://api.gemini.com/v1/pubticker/btcusd', 
            'json', geminiSuccess, geminiError);
        geminiCall.always(function(){
            $("#geminiBuy").html(geminiBuy);
            $("#geminiDateTime").html(geminiTime);
        });

        var zebpayCall = callExchangeApi('GET', 'https://www.zebapi.com/api/v1/market/ticker/btc/inr', 
            'json', zebpaySuccess, zebpayError);
        zebpayCall.always(function(){
            $("#zebpaySell").html(zebpaySell);
            $("#zebpayDateTime").html(zebpayTime);
        });

        var unocoinCall = callExchangeApi('GET', 'https://www.unocoin.com/trade?sell', 
            '', unocoinSuccess, unocoinError);
        unocoinCall.always(function(){
            $("#unocoinSell").html(unocoinSell);
            $("#unocoinDateTime").html(unocoinTime);
        });
        
        var coinsecureCall = callExchangeApi('GET', 'https://api.coinsecure.in/v1/exchange/bid/high', 
            '', coinsecureSuccess, coinsecureError);
        coinsecureCall.always(function(){
            $("#coinsecureSell").html(coinsecureSell);
            $("#coinsecureDateTime").html(coinsecureTime);
        });

    }, 120);
});

$("button").click(function(){
    //export to spreadsheet code here
    //export the data from the vars at the top of this file into a .csv(or .xls if there's an easy way to it) file
});