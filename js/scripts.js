//--------------------------------------------------------------------------------------------------------------------
//scripts.js

//global vars
var buyPrices = {}; //dictionary of buy prices
var sellPrices = {}; //dictionary of sell prices
var times = {}; //dictionary of server times (or local time substitutes)
var exportClicked = false; //track if user has clicked export button
var krakenTimeStale = false; //since kraken's time is a different call than the price,
//krakenTimeStale is to keep track of whether they're in sync

//--------------------------------------------------------------------------------------------------------------------
//functions for http requests. .fail() = request error function, .done() = success function, .always() = either (request complete)

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

// call exchange APIs and store resonse data is appropriate dictionaries
function getExchangeData(){
    //request coinbase data from their API
    var coinbaseCall = callExchangeApi('GET', 'https://api.gdax.com/products/BTC-USD/ticker', 
        {}, 'json');
    coinbaseCall.fail(function(){
        if(!buyPrices.coinbaseBuy || buyPrices.coinbaseBuy.length < 1){
            buyPrices.coinbaseBuy = "coinbase price GET error";
        }
        if(!times.coinbaseTime || times.coinbaseTime.length < 1){
            times.coinbaseTime = "coinbase time GET error";
        }
    });
    coinbaseCall.done(function(responseData){
        buyPrices.coinbaseBuy = "$" + responseData.ask;
        times.coinbaseTime = new Date(responseData.time);
    });
    coinbaseCall.always(function(){
        //write to html objects after call finishes (success or error)
        $("#coinbaseBuy").html(buyPrices.coinbaseBuy);
        $("#coinbaseTime").html(times.coinbaseTime);
    });

    //request kraken data from their API
    var krakenPriceCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD', 
        {'Access-Control-Allow-Origin': '*'}, 'json');
    krakenPriceCall.fail(function(){
        if(!buyPrices.krakenBuy || buyPrices.krakenBuy.length < 1){
            buyPrices.krakenBuy = "kraken price GET error";
        }
    });
    krakenPriceCall.done(function(responseData){
        if (responseData.error.length > 0){
            if(!buyPrices.krakenBuy || buyPrices.krakenBuy.length < 1){
                buyPrices.krakenBuy = "kraken API returned an error";
            }
        }
        else{
            buyPrices.krakenBuy = "$" + responseData.result.XXBTZUSD.a[0];
        }
    });
    krakenPriceCall.always(function(){
        $("#krakenBuy").html(buyPrices.krakenBuy);
        var krakenTimeCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://api.kraken.com/0/public/Time', 
            {'Access-Control-Allow-Origin': '*'}, 'json');
        krakenTimeCall.fail(function(){
            if(!times.krakenTime || times.krakenTime.length < 1){
                times.krakenTime = "kraken time GET error";
            }
            else{
                if(!krakenTimeStale){
                    times.krakenTime += " (stale)"
                    krakenTimeStale = true;
                }
            }
        });
        krakenTimeCall.done(function(responseData){
            if (responseData.error.length > 0){
                if(!times.krakenTime || times.krakenTime.length < 1){
                    times.krakenTime = "kraken API returned an error";
                }
                else{
                    if(!krakenTimeStale){
                        times.krakenTime += " (stale)"
                        krakenTimeStale = true;
                    }
                }
            }
            else{
                var krakenEpochSecs = responseData.result.unixtime;
                // convert from unixtime to rfc1123    
                var d = new Date(0); // make new date with epoch seconds = 0
                d.setUTCSeconds(krakenEpochSecs); //add kraken epoch secs
                times.krakenTime = d;
                krakenTimeStale = false;        
            }
        });
        krakenTimeCall.always(function(){
            $("#krakenTime").html(times.krakenTime);
        });
    });

    //request gemini data from their API
    var geminiCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://api.gemini.com/v1/pubticker/btcusd', 
        {'Access-Control-Allow-Origin': '*'}, 'json');
    geminiCall.fail(function(){
        if(!buyPrices.geminiBuy || buyPrices.geminiBuy.length < 1){
            buyPrices.geminiBuy = "gemini price GET error";
        }
        if(!times.geminiTime || times.geminiTime.length < 1){
            times.geminiTime = "gemini time GET error";
        }
    });
    geminiCall.done(function(responseData){
        buyPrices.geminiBuy = "$" + responseData.ask;
        var geminiEpochMs = responseData.volume.timestamp; //num milisecs after epoch from gemini
        // convert from unixtime to rfc1123    
        var d = new Date(0); // make new date with epoch miliseconds = 0
        d.setUTCMilliseconds(geminiEpochMs); //add gemini epoch ms
        times.geminiTime = d;
    });
    geminiCall.always(function(){
        $("#geminiBuy").html(buyPrices.geminiBuy);
        $("#geminiTime").html(times.geminiTime);
    });

    //request zebpay data from their API
    var zebpayCall = callExchangeApi('GET', 'https://www.zebapi.com/api/v1/market/ticker/btc/inr', 
        {}, 'json');
    zebpayCall.fail(function(){
        if(!sellPrices.zebpaySell || sellPrices.zebpaySell.length < 1){
            sellPrices.zebpaySell = "zebpay price GET error";
        }
        if(!times.zebpayTime || times.zebpayTime.length < 1){
            times.zebpayTime = "zebpay time GET error";
        }
    });
    zebpayCall.done(function(responseData){
        sellPrices.zebpaySell = "Rs." + responseData.sell;
        var d = new Date();
        times.zebpayTime = d;
    });
    zebpayCall.always(function(){
        $("#zebpaySell").html(sellPrices.zebpaySell);
        $("#zebpayTime").html(times.zebpayTime);
    });

    //request koinex data from their API
    var koinexCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://koinex.in/api/ticker', 
        {'Access-Control-Allow-Origin': '*'}, 'json');
    koinexCall.fail(function(){
        if(!sellPrices.koinexSell || sellPrices.koinexSell.length < 1){
            sellPrices.koinexSell = "koinex price GET error";
        }
        if(!times.koinexTime || times.koinexTime.length < 1){
            times.koinexTime = "koinex time GET error";
        }
    });
    koinexCall.done(function(responseData){
        sellPrices.koinexSell = "Rs." + responseData.prices.BTC;
        var d = new Date();
        times.koinexTime = d;
    });
    koinexCall.always(function(){
        $("#koinexSell").html(sellPrices.koinexSell);
        $("#koinexTime").html(times.koinexTime);
    });

    //request coinsecure data from their API
    var coinsecureCall = callExchangeApi('GET', 'https://cors-anywhere.herokuapp.com/https://api.coinsecure.in/v1/exchange/bid/high', 
        {'Access-Control-Allow-Origin': '*', 'x-requested-with':'api.coinsecure.in'}, 'json');
    coinsecureCall.fail(function(){
        if(!sellPrices.coinsecureSell || sellPrices.coinsecureSell.length < 1){
            sellPrices.coinsecureSell = "coinsecure price GET error";
        }
        if(!times.coinsecureTime || times.coinsecureTime.length < 1){
            times.coinsecureTime = "coinsecure time GET error";
        }
    });
    coinsecureCall.done(function(responseData){
        //divide rate by 100, last 2 digits are paise
        sellPrices.coinsecureSell = "Rs." + float(responseData.message.rate)/100.00;
        times.coinsecureTime = responseData.time;
        //TODO: convert to rfc1123
    });
    coinsecureCall.always(function(){
        $("#coinsecureSell").html(sellPrices.coinsecureSell);
        $("#coinsecureTime").html(times.coinsecureTime);
    });
}

//--------------------------------------------------------------------------------------------------------------------
//jQuery event functions

$(document).ready(function() {
    getExchangeData();
    window.setInterval(function() {
        getExchangeData();
    }, 10000);
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