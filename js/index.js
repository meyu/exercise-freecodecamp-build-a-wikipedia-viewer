var maxResult = 15; //設定搜尋結果的上限
var penURL = "https://codepen.io/meyu/full/gRORMj/"; //本作品的主網址
var myGist = "//gist.github.com/meyu/21c1a268b2504e6d2c416605b8be4b5b";
var wikiURL = "wikipedia.org",
	wiki = "wikipedia.org";

$(document).ready(function() {
	bindMultiLang();
	setModal();
	setShyScroll();
	$(".tooltipped").tooltip();
	$("select").material_select();
});

//////////////////////////////////
// 資料結繫
//////////////////////////////////

// 取得並輸出查詢結果，搜尋方案為：https://www.mediawiki.org/wiki/API:Search
function getWiki(inputKeyword) {
	$.ajax({
		url: "//" + wikiURL + "/w/api.php",
		data: {
			action: "query",
			list: "search",
			srinfo: "suggestion",
			srprop: "snippet",
			srlimit: maxResult,
			srsearch: inputKeyword,
			format: "json"
		},
		dataType: "jsonp",
		success: function(data) {
			var html = "";
			var orderID = 1,
				prefixID = "result"; //為每個結果安排一個id
			//羅列結果
			$.each(data.query.search, function(i, obj) {
				html += cardHTML(
					obj.title,
					obj.snippet,
					"//" + wikiURL + "/wiki/" + obj.title,
					prefixID + orderID
				);
				getWikiImage(obj.title, prefixID + orderID); //由於API:Search無法取得文章的代表圖源，故需逐一要圖
				orderID += 1;
			});
			$("#result").html('<div class="row">' + html + "</div>");
		}
	});
}

// 取得指定文章之主要縮圖，並嵌入文章中。取用方案：https://www.mediawiki.org/wiki/Extension:PageImages
function getWikiImage(title, targetID) {
	$.ajax({
		url: "//" + wikiURL + "/w/api.php",
		data: {
			action: "query",
			prop: "pageimages",
			piprop: "thumbnail",
			pithumbsize: 200,
			pilimit: 1,
			titles: title,
			format: "json"
		},
		dataType: "jsonp",
		success: function(data) {
			var obj = data.query.pages[Object.keys(data.query.pages)[0]];
			var key = "thumbnail";
			if (key in obj) {
				var src = obj[key].source;
				$("#" + targetID).css("background-image", 'url("' + src + '")');
			} else {
				$("#" + targetID).css("background-image", 'url("#")');
			}
		}
	});
}

// 土炮製作語系清單
// TODO: 仍在尋找能顯示 Wikipedia 可選語系的 API
function bindMultiLang() {
	var laHTML =
		'<option value="en">English</option>' +
		'<option value="zh">中文</option>' +
		'<option value="es">Español</option>' +
		'<option value="ja">日本語</option>' +
		'<option value="de">Deutsch</option>' +
		'<option value="ru">Русский</option>' +
		'<option value="fr">Français</option>' +
		'<option value="it">Italiano</option>' +
		'<option value="pt">Português</option>' +
		'<option value="pl">Polski</option>';
	$("#lang").html(laHTML);
	wikiURL = $("#lang option:selected").val() + "." + wiki;
}

// 客製化 Modal 觸發動作，使能結繫 trigger 所指定之連結，並觸發載入特效
function setModal() {
	$(".modal").modal({
		ready: function(modal, trigger) {
			var url = trigger.data("url");
			if (url.length !== '' && url != myGist) {
				var iframe = document.getElementById("showWiki");
				iframe.src = url;
				doIframeLoadShow(iframe);
			} else {
				$("#myGist").show();
			}
			setOpenMeButton(url);
			setTweetMeButton(trigger.data("title"), url);
			// 由於抓不到 random 轉址後的網址，故為 random 時不顯示這些按鈕
			if (url == $("#ranWiki").data("url")) {
				$("#openMe").hide();
				$("#tweetMe").hide();
			}
		},
		complete: function() {
			$("iframe").hide();
			$("#myGist").hide();
			$("#openMe").hide();
			$("#tweetMe").hide();
		}
	});
}

// 隨機文章配合語系選擇
$("#ranWiki").data("url", "//" + wikiURL + "/wiki/Special:Random");
$("#demoGist").data("url", myGist);

//////////////////////////////////
// 互動觸發
//////////////////////////////////

// 觸發即時搜尋
var keyword = $("#keyword");
keyword.on("input", function() {
	doSearch();
});
function doSearch() {
	if (keyword.val().trim().length > 0) {
		getWiki(keyword.val());
	} else {
		$("#result").html("");
	}
}

// 變更語系目標
$("#lang").change(function() {
	wikiURL = this.value + "." + wiki;
	$("#ranWiki").data("url", "//" + wikiURL + "/wiki/Special:Random");
	doSearch();
});

//////////////////////////////////
// 安排物件
//////////////////////////////////

// 在 iframe 完成載入後，再顯示 iframe，並隱藏 progress bar
// 偵測 iframe 載入情況無現成方法，偵浮方案係參考：https://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/
function doIframeLoadShow(iframe) {
	$(".progress").show();
	if (iframe.attachEvent) {
		iframe.attachEvent("onload", function() {
			iframe.style.display = "block";
			$(".progress").hide();
		});
	} else {
		iframe.onload = function() {
			iframe.style.display = "block";
			$(".progress").hide();
		};
	}
}

// 設定另開視窗的按鈕
function setOpenMeButton(url) {
	$("#openMe").attr("href", url);
	$("#openMe").show();
}

// 設定 Tweet 按鈕 (https://dev.twitter.com/web/tweet-button/web-intent)
function setTweetMeButton(text, url) {
	//由於特殊符號無法放入URL，故在這裡將其轉為全形符號
	text = 		text.replace(/,/g,"，").replace(/\//g,"／").replace(/\?/g,"？").replace(/\:/g,"：").replace(/@/g,"＠").replace(/&/g,"＆").replace(/=/g,"＝").replace(/\+/g,"＋").replace(/\$/g,"＄").replace(/#/g,"＃"); 
	//由於wikipedai會將網址中的空格轉為底線，所以這裡也要比照辦理才行。另，由於wikipedia的網址會包含特殊符號，非一般URL的規範，無法放入tweet的url參數中，故一併放入內容中
	url = url.replace(/\s/g,"_").replace(/\+/g,"plus"); 
	var tweetURL =
		"//twitter.com/share?text=" +
		text + ' -- https:' + url + "&url=''";
	$("#tweetMe").attr("href", tweetURL);
	$("#tweetMe").show();
}

// 輸入區的捲動佈局
function setShyScroll() {
	window.addEventListener("scroll", function(e) {
		var offsetY = window.scrollY;
		var shyPoint = 50;
		if (offsetY > shyPoint) {
			$("header").addClass("shy");
			$("#iconSearch").addClass("shy");
			$(".moreInfo").hide();
		} else {
			$("header").removeClass("shy");
			$("#iconSearch").removeClass("shy");
			$(".moreInfo").show();
		}
	});
}

// 輸出 card 的 html 語句
function cardHTML(title, content, link, ID) {
	var content =
		'<div class="card-content white-text">' +
		'<span class="card-title" >' +
		title +
		"</span>" +
		"<p>" +
		content +
		"</p>" +
		"</div>";
	var clickable =
		'<a href="#showDetail" data-url="' +
		link +
		'" data-title="' +
		title +
		'">' +
		content +
		"</a>";
	return (
		'<div class="col s12 m12 l6 xl4">' +
		'<div id="' +
		ID +
		'" class="card brown lighten-2 z-depth-3">' +
		clickable +
		"</div>" +
		"</div>"
	);
}