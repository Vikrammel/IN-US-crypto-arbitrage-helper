# README #

* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### What is this repository for? ###

* Crypto Arbitrage Helper - finds abritrage oppportunities for cryptos and notifies the user of them
* Version Alpha

### How do I get set up? ###

* git clone repo
* open index.html with a web browser from the root project directory

### Contribution guidelines ###

* always push new features to a branch unless another teammate has reviewed them, then merge to master when deemed complete
* pull before pushing
* good commenting and naming to describe what functions/vars do
* try to care at least a little about efficiency while writing functions and algorithms (computational efficiency not so much code eficiency) since we are writing an arbitrage bot that should act reasonably fast

### TO DO ###

* ~~V1.0~~
* instead of making calls from front end jQuery, set up node backend server to make calls
* get top 10-15 exchanges by volume integrated by API and look for differences in price while taking fees into account
* if it's a good opportunity (above threshhold of 0.x% after fees or maybe 1.x%) display BUY <!crypto> on <!exchange> for <!price> and SELL on <!exchange> for <!price> for <!%profit> profit in <!currency>
* if timestamps of prices that were used to find opportunity mismatch by more than 15s (idk might need adjustment) then add a warning that this info might be unreliable to the user for that opportunity displayed
* somehow check something like the mean transaction time of crypto and signal whether it's a risky arbitrage opportunity if it's a long transaction time on the opportunity when displayed as well

* ~~backlog~~
* allow user to change native curency (default USD) to covert all prices to and check opportunities for? but also check for btc gains opportunities in addition to this native currency? more thought needs to be put into this feature
* make routes for an api to report arbitrage opportunities to callers
