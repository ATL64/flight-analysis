# flight-analysis
Short flight delay analysis + viz in D3

This project contains

- A website with a D3 chart currently hosted here: http://www.atl64-flightanalysis.com/  (static site on Google Cloud);

- A Jupyter Notebook with a short exploratory analysis;

- An R file to preprocess data so that D3 can make the chart

- An R file with an attempt to model cancellations (turned out not to be very insighful)


Observations:

Line chart (D3) is not very clear without an axis or popup on mouse-over to show what it is (counts per month), by default the viz does not have this feature, so just the title will have to do.

Creating the data input for the D3 charts is not very practical, it looks like it would end up rather clumsy if we want to make this dynamic, but I might be missing something here.



