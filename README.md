# purpose
For the challenge of freeCodeCamp's ["Build a Wikipedia Viewer"](https://www.freecodecamp.com/challenges/build-a-wikipedia-viewer), and wanna make the searching more lively .

# build by

## MediaWiki action API

* a little bit hard for me to understand the whole [API of MediaWiki](https://www.mediawiki.org/wiki/API:Main_page).
* the searching part, I use the [API:Search](https://www.mediawiki.org/wiki/API:Search) as a start. 
* API:Search did fit the need, but I want the results could be more intuitive with their own picture. Since API:Search got only text information, I found [Extension:PageImages](https://www.mediawiki.org/wiki/Extension:PageImages) to fetching the thumbnails for each result.
* Multi Language Searching is necessary, I think. So I made a drop down list to change the API domain. was plan to get full list of languages, from API, that Wikipedia can offer. Yet, found no clue for doing that. 

## Materialize v0.98.2

* cause was fascinated by the Material design, and [Materialize](http://materializecss.com/) was the easiest CSS framework, and, relatively, it did interpret the design really well.
* the Modals, Cards and inputs fields are stunning, but still took me a lot of CSS tuning work.

## Tweet

* just wanna place a share button, so I made a tweet button.
* thought it should be easy, but fell down when passing text with special sign as URL parameter. 

