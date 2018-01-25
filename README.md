# README

### What is this?

* Crypto Arbitrage Helper - helps find abritrage oppportunities between the US and India for cryptos
* Version Alpha

### How do I get set up?

* `git clone <this repo's url>` or download contents of the repo
* open index.html with a web browser from the root project directory

### TO DO (no longer in development)

* **V1.0**
* instead of making calls from front end jQuery, set up node backend server to make calls
* get top 10-15 exchanges by volume integrated by API and look for differences in price while taking fees into account
* if it's a good opportunity (above threshhold of 0.x% after fees or maybe 1.x%) display BUY <!crypto> on <!exchange> for <!price> and SELL on <!exchange> for <!price> for <!%profit> profit in <!currency>
* if timestamps of prices that were used to find opportunity mismatch by more than 15s (idk might need adjustment) then add a warning that this info might be unreliable to the user for that opportunity displayed
* somehow check something like the mean transaction time of crypto and signal whether it's a risky arbitrage opportunity if it's a long transaction time on the opportunity when displayed as well
* allow user to filter abitrage opportunities by specific crypto to flip? (maybe in backlog?)

* **backlog**
* allow user to change native curency (default USD) to covert all prices to and check opportunities for? but also check for btc gains opportunities in addition to this native currency? more thought needs to be put into this feature
* make routes for an api to report arbitrage opportunities to callers
