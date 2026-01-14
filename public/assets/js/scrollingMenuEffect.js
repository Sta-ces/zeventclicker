/*
 * author : Cedric Staes
 * alias : Staces
 * uri : https://staces.be/
 * Description : Add a custom class to your selected element on scrolling, if it is under the top window.
 */

// _sectionsClass = Class on your HTML elements with attribute [data-section-scrolling]
// _menuClass = Custom class adding automaticaly to your HTML element with atribute [data-scrolling]
// _offsetTop = (optionnal) Distance between the top of your window and the top of the HTML elements (sections)
function ScrollingMenuEffect(_sectionsClass, _menuClass, _offsetTop = 75){
	var sectionsClass = _sectionsClass.replace(".","");
	var menuClass = _menuClass.replace(".","");
	var offsetTop = _offsetTop;

	addEventListener("scroll", function(){
		var li_menu = null;
		var sections = document.querySelectorAll("."+sectionsClass);
		var doc_scroll = document.scrollingElement.scrollTop;

		var se = document.querySelectorAll("."+menuClass);

		if(se.length > 0){
			for (var i = 0; i < se.length; i++){
				se[i].classList.remove(menuClass);
			}
		}

		for (var i = 0; i < sections.length; i++) {
			if(doc_scroll >= (sections[i].offsetTop - offsetTop)){
				li_menu = document.querySelector("*[data-scrolling='"+sections[i].getAttribute("data-section-scrolling")+"']");
			}
			else break;
		}

		if(li_menu != null){
			if(!li_menu.classList.contains(menuClass)){
				li_menu.classList.add(menuClass);
			}
		}
	}, false);
}

ScrollingMenuEffect(".sectionsScrolling", "menuScrollingElement");
//ScrollingMenuEffect("sectionTitle", "titleElement", 0);