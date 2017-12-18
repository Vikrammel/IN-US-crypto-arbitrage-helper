//scripts.js
var buyPrices = {}; //dictionary of buy prices
var sellPrices = {}; //dictionary of sell prices
var times = {}; //dictionary of server times (or local time substitutes)
var exportClicked = false; //track if user has clicked export button

//wrapper for ajax request so enchance readability in the $(document).ready() function
function callExchangeApi(type, url, dataType, success, error) {
    return $.ajax({
        type: type,
        url: url,
        //data:{},
        dataType: dataType,
        success: success,
        error: error
    });
}

$(document).ready(function () {

    //in here, get buy price (sometimes called 'lowest Ask') and 
    //sell price ('highest bid') from relevant APIs
    //and get time from API usually as field "unixtime" in response JSON object
    //store this data in relevant variables at top of this file
    //load results into relevant HTML elements
    function getApiData() {
        var coinbaseCall = callExchangeApi('GET', 'https://api.gdax.com/products/BTC-USD/ticker',
            'json', coinbaseSuccess, coinbaseError);
        coinbaseCall.done(function () {
            //write to html objects after call finishes (success or error)
            $("#coinbaseBuy").html(buyPrices.coinbaseBuy);
            $("#coinbaseDateTime").html(times.coinbaseTime);
        });
        coinbaseCall.fail(function () {
            $("#coinbaseBuy").html("Error getting Coinbase price data.");
            $("#coinbaseDateTime").html("Error getting Coinbase timestamp.");
        });

        var krakenPriceCall = callExchangeApi('GET', 'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD',
            'json', krakenPriceSuccess, krakenPriceError);
        krakenPriceCall.done(function () {
            $("#krakenBuy").html(buyPrices.krakenBuy);
        });
        krakenPriceCall.fail(function () {
            $("#krakenBuy").html("Error getting Kraken price data.");
            $("#krakenDateTime").html("Error getting Kraken timestamp.");
        });

        var krakenTimeCall = callExchangeApi('GET', 'https://api.kraken.com/0/public/Time',
            'json', krakenTimeSuccess, krakenTimeError);
        krakenTimeCall.done(function () {
            $("#krakenDateTime").html(times.krakenTime);
        });
        krakenTimeCall.fail(function () {
            $("#krakenDateTime").html("Error getting Kraken timestamp.");
        });

        var geminiCall = callExchangeApi('GET', 'https://api.gemini.com/v1/pubticker/btcusd',
            'json', geminiSuccess, geminiError);
        geminiCall.done(function () {
            $("#geminiBuy").html(buyPrices.geminiBuy);
            $("#geminiDateTime").html(times.geminiTime);
        });
        geminiCall.fail(function () {
            $("#geminiBuy").html("Error getting Gemini price data.");
            $("#geminiDateTime").html("Error getting Gemini timestamp.");
        });

        var zebpayCall = callExchangeApi('GET', 'https://www.zebapi.com/api/v1/market/ticker/btc/inr',
            'json', zebpaySuccess, zebpayError);
        zebpayCall.done(function () {
            $("#zebpaySell").html(sellPrices.zebpaySell);
            $("#zebpayDateTime").html(times.zebpayTime);
        });
        zebpayCall.fail(function () {
            $("#zebpaySell").html("Error getting Zebpay data.");
            $("#zebpayDateTime").html("Error getting Zebpay timestamp.");
        });

        var unocoinCall = callExchangeApi('GET', 'https://www.unocoin.com/trade?sell',
            '', unocoinSuccess, unocoinError);
        unocoinCall.done(function () {
            $("#unocoinSell").html(sellPrices.unocoinSell);
            $("#unocoinDateTime").html(times.unocoinTime);
        });
        unocoinCall.fail(function () {
            $("#unocoinSell").html("Error getting Unocoin price data.");
            $("#unocoinDateTime").html("Error getting Unocoin timestamp.");
        });
        var coinsecureCall = callExchangeApi('GET', 'https://api.coinsecure.in/v1/exchange/bid/high',
            '', coinsecureSuccess, coinsecureError);
        coinsecureCall.done(function () {
            $("#coinsecureSell").html(sellPrices.coinsecureSell);
            $("#coinsecureDateTime").html(times.coinsecureTime);
        });
        coinsecureCall.fail(function () {
            $("#coinsecureSell").html("Error getting Coinsecure price data.");
            $("#coinsecureDateTime").html("Error getting Coinsecure timestamp.");
        });
    }
    getApiData();
    window.setInterval(function () {
        getApiData();
    }, 5000);
});

$("button").click(function () {
    //export the data from the html table element into a file
    var table;
    if (!exportClicked) {
        table = $("table").tableExport();
        exportClicked = true;
    }
    else {
        table.reset();
        table = $("table").tableExport();
    }
});