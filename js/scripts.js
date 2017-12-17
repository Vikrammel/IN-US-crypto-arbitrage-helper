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

$(document).ready(function() {
    window.setInterval(function() {
        //in here, get buy price (sometimes called 'lowest Ask') and 
        //sell price ('highest bid') from relevant APIs using OAuth if necessary
        //and get time from API usually as field "unixtime" in response JSON object
        //store this data in relevant variables at top of this file
        //load results into relevant HTML elements
        
        $.ajax({
            type: 'GET',
            url: 'https://api.gdax.com/products/BTC-USD/ticker',
            dataType: 'json',
            success: function(data){
                coinbaseBuy = "$" + data.ask;
                coinbaseTime = data.time;
            }
        });
        $("#coinbaseBuy").html(coinbaseBuy);
        $("#coinbaseDateTime").html(coinbaseTime);

        $.ajax({
            type: 'GET',
            url: 'https://api.kraken.com/0/public/Ticker?pair=XXBTZUSD',
            dataType: 'json',
            success: function(error, result){
                // console.log("SUCCESSS!!!! in kraken buy success function");
                if (length(error)>0){
                    krakenBuy = "errors retrieving price from kraken";
                }
                else{
                    krakenBuy = "$" + result.XXBTZUSD.a[0];                   
                }
                $.ajax({
                    type: 'GET',
                    url: 'https://api.kraken.com/0/public/Time',
                    dataType: 'json',
                    success: function(error, result){
                        if (length(error)>0){
                            krakenTime = "errors retrieving time from kraken";
                        }
                        else{
                            krakenTime = result.rfc1123;
                        }
                    }
                });
            },
            error: function(){
                //going in here. maybe not supplying necessary data with request?
                krakenBuy = 'kraken price GET error';
                krakenTime = 'kraken time GET error';
            }
        });
        $("#krakenBuy").html(krakenBuy);
        $("#krakenDateTime").html(krakenTime);

        $.ajax({
            type: 'GET',
            url: 'https://api.gemini.com/v1/pubticker/btcusd',
            dataType: 'json',
            // data: {},
            success: function(data){
                console.log("in gemini success function");
                geminiBuy = "$" + data.ask;
                geminiTime = data.volume.timestamp;
            },
            error: function(){
                geminiBuy = "gemini price GET error";
                geminiTime = "gemini time GET error";
            }
        });
        $("#geminiBuy").html(geminiBuy);
        $("#geminiDateTime").html(geminiTime);

        $.ajax({
            type: 'GET',
            url: 'https://www.zebapi.com/api/v1/market/ticker/btc/inr',
            dataType: 'json',
            // data: {},
            success: function(data){
                //console.log("in zebpay success function");
                zebpaySell = "Rs." + data.sell;
                var d = new Date();
                zebpayTime = d;
            },
            error: function(){
                zebpayBuy = "zebpay price GET error";
                zebpayTime = "zebpay time GET error";
            }
        });
        $("#zebpaySell").html(zebpaySell);
        $("#zebpayDateTime").html(zebpayTime);

        $.ajax({
            type: 'GET',
            url: 'https://www.unocoin.com/trade?sell',
            //dataType: 'json',
            // data: {},
            success: function(data){
                //console.log("in zebpay success function");
                unocoinSell = "Rs." + data;
                var d = new Date();
                unocoinTime = d;
            },
            error: function(){
                unocoinSell = "unocoin price GET error";
                unocoinTime = "unocoin time GET error";
            }
        });
        $("#unocoinSell").html(unocoinSell);
        $("#unocoinDateTime").html(unocoinTime);
        
        $.ajax({
            type: 'GET',
            url: 'https://api.coinsecure.in/v1/exchange/bid/high',
            //dataType: 'json',
            // data: {},
            success: function(data){
                //console.log("in zebpay success function");
                coinsecureSell = "Rs." + data.message.rate;
                coinsecureTime = data.time;
            },
            error: function(){
                coinsecureSell = "coinsecure price GET error";
                coinsecureTime = "coinsecure time GET error";
            }
        });
        $("#coinsecureSell").html(coinsecureSell);
        $("#coinsecureDateTime").html(coinsecureTime);
    }, 120);
});

$("button").click(function(){
    //export to spreadsheet code here
    //export the data from the vars at the top of this file into a .csv(or .xls if there's an easy way to it) file
});