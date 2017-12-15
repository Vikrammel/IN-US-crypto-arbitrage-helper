$(document).ready(function() {
    window.setInterval(function() {
        //in here, get buy price (sometimes called 'lowest Ask') and 
        //sell price ('highest bid') from relevant APIs using OAuth if necessary
        //and get time from API usually as field "unixtime" in response JSON object
        //load results into relevant HTML elements

        // function success(data){
        //     console.log(data.amount);
        // }
        // $.ajax({
        //     url: "https://api.coinbase.com/v2/prices/BTC-USD/buy",
        //     // authorization: 'Bearer',
        //     data: 'Bearer',
        //     success: success(data),
        //     dataType: jsonp
        //   });
          
        $("#coinbaseBuy").html("test");
        // $("#coinbaseBuy").html();
        // $("#krakenBuy").html(get("https://api.kraken.com/0/public/Ticker", [BTC-USD]));
        // $("#coinbaseBuy").html(get("https://api.gemini.com/v1/pubticker/btcusd"));

        // $("#zebpaySell").html(get("https://www.zebapi.com/api/v1/market/ticker/btc/inr"));
        // $("#unocoinSell").html(get("https://www.unocoin.com/trade.php?sell"));
        // $("#coinsecureSell").html(get("https://api.coinsecure.in/v1/exchange/bid/high"));
    }, 60);
});

$("button").click(function(){
    //export to spreadsheet code here
});