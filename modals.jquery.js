/**
@Version: 2.0
@Author: Hideo Kubota
@Contact: hideo@hkub3.com
@Description: This plugin can be used for:
 - Display an empty modal popup,
 - Display a tooltip beside an element

---------------------
What's new in this version?
 - Change Html for the popup, now <div> instead of <table>
 - Add sTransition option
 - Add popupPosition option
 - Add sTheme option
 - Add manualPosition option
 - Add displayOverlay option
 - Not compliant with IE6 anymore. It's on your own!

---------------------
How to use this plugin?
To use this plugin, you have to:
	- Add the JQuery library in your page,
	- Add the "plugin.easyPopup.js" in your page,
	- Add your javascript file which call the plugin function,
	- Add the "popup" folder, which contains all needed images for the plugin, in your "images" folder. The best practice is to create a folder for each theme.
	- Add the "popup.css" in your "css" folder.

---------------------
Example:
<script type="text/javascript" src="/js/jquery.latest.js" />
<script type="text/javascript" src="/js/plugin.easyPopup.js" />
<script type="text/javascript" src="/js/yourScript.js" />
<link rel="stylesheet" type="text/css" href="/css/popup.css" media="screen" />

In "yourScript.js":
$('div.content ul li a').click(function(e){
	e.preventDefault();
	var sAjaxPageUrl = $(this).attr('rel');
	var sTitle = $(this).html();
	
	$(this).easyPopup({ajaxPageUrl:sAjaxPageUrl, popupTitle:sTitle});
});

---------------------
Options:
	- containerId [string]: Set it with the ID of your container which contains your content, which is present in the DOM. By default, it is empty.
	- ajaxPageUrl [string]: Set it with the url of the external page which contains what you want to display. By default, it is empty.
	- isImage [boolean]: If the ajaxPageUrl is an image, set this param to true. By default, it is false.
	- popupBgColor [string]: Set the color of the overlay. By default, it is "#000000".
	- popupOpacity [float]: Set the percentage of opacity of the overlay. By default, it is 0.7 (= 70% of opacity).
	- popupTitle [string]: Set the title of the modal popup. By default, it is empty.
	- popupWidth [int]: Set the width of the modal popup. By default, it will be calculated automatically.
	- popupHeight [int]: Set the height of the modal popup. By default, it will be calculated automatically.
	- displayOuterCloseButton [boolean]: Display the close button at the top-right of the modal popup if true, otherwise, it will not be displayed.
	- displayInnerCloseButton [boolean]: Display the close button inside the modal popup if true, otherwise, it will not be displayed.
	- displayCloseLabel [boolean]: If set to true, display the close label in the <a href> but the displayInnerCloseButton must be set to true too. If set to false, it will not be displayed
	- sHtml [string]: Display your html code after the loaded content. By default, it is embty. 
	- closeLabel [string]: Set the label of the close button which will be displayed at the bottom of your content. By default, it is "Close". This label is also used for the alternative of the close button.
	- callFunction [string] : Execute the provided function. By default, it is empty.
	- addClass [string] : Add a class to the popup container. This can be usefull if you have severals modalPopup in the same page with different skins. By default, it is empty.
	- sDataType [string] : Type of datas (html, xml, json...). By default, it is "html".
	- popupPosition [string] : Put this parameter as a class in <div class="popupContainer">. By default, it is "fixed".
	- sTransition [string] : Not used but will be in the next version. By default, it is "fade".
	- sTheme [string] : Add class to the popupContainer div. This will be use to create several themes. By default, it is "default".
	- manualPosition [boolean] : Do not set the position of the popup if set to "true". By defalut, it is "false" and the popup is centered.
	- displayOverlay [boolean] : Do not display the overlay if set to "true". By defalut, it is "true".
	- isTooltip [boolean] : If set to true, it will not hide elements such as "object", "input", "select" and "iframe". By default, it is false.

---------------------
Note:
	- To work, you have to specify either "containerId" or "ajaxPageUrl" or "sHtml". Otherwise, you will have a warning message in your modalPopup
	- If you specify both "containerId" and "ajaxPageUrl", the content of "containerId" will be displayed
	- If you have any suggestions to improve this plugin, you're welcome!

**/

$(document).ready(function (e) {
    detectModalLinks();
    handleCloseModal();
});

function detectModalLinks() {
    $('.easyPopup').each(function (i, elem) {
        handleClickModalLinks(elem);
    });
}
function handleClickModalLinks(elem) {
    var oModal;
    $(elem).on("click", function (e) {
        e.preventDefault();
        var dataOptions = $(this).attr('data-options');
        var options = JSON.parse(dataOptions);
        oModal = $(this).easyPopup(options);
        handleCloseModal(oModal);
    });
}

function handleCloseModal() {
    $(document).on('click', '.popupClose', function (e) {
        e.preventDefault();
        $(this).easyPopup.close();
    });
}

(function ($) {
    // EasyPlugin definition
    $.fn.easyPopup = function (options) {

        // Default parameters
        var defaults = {
            containerId: "",
            ajaxPageUrl: "",
            callFunction: "",
            isImage: false,
            popupBgColor: "#000000",
            popupOpacity: 0.7,
            popupTitle: "",
            popupWidth: 660,
            popupHeight: 0,
            displayOuterCloseButton: true,
            displayInnerCloseButton: false,
            displayCloseLabel: false,
            sHtml: "",
            closeLabel: "Close",
            addClass: "",
            sTransition: "fade",
            popupPosition: "fixed",
            sDataType: "html",
            sTheme: "default",
            manualPosition: false,
            appendToContainerId: "",
            displayOverlay: true,
            isTooltip: false,
            disableCloseOverlay: false,
            disableCloseEsc: false,
            idtofill: [],
            fn: null,
            callbackOpen: null,
            callbackClose: null
        };

        var vars = {
            opts: {},
            tempDefaults: {},
            popupContainer: null,
            pc2: null,
            popupOverlay: null,
            closePopup: null,
            popupInnerContainer: null,
        };

        // Mix of given parameters and default parameters
        vars.opts = $.extend(defaults, options);



        // getDatas
        function GetDatas() {
            var oOut;
            if (vars.opts.containerId) {
                var oContainerId = document.getElementById(vars.opts.containerId);
                var oDiv = document.createElement('div');
                oDiv.classList.add(vars.opts.containerId);
                oDiv.innerHTML = oContainerId.innerHTML;
                $('.popupContainer .popupInner').append(oDiv);
            }
            else {
                if (vars.opts.ajaxPageUrl) {
                    if (vars.opts.isImage) {
                        var img = document.createElement("img");
                        img.src = vars.opts.ajaxPageUrl;
                        $('.popupContainer .popupInner').append(img);
                    }
                    else {

                        $.ajax({
                            url: vars.opts.ajaxPageUrl,
                            context: document.body,
                            dataType: vars.opts.sDataType,
                            success: function (data) {
                                var htmlData = document.createElement('div');
                                htmlData.setAttribute('class', 'ajaxInnerContent');
                                htmlData.innerHTML = data;
                                $('.popupContainer .popupInner').append(htmlData);
                                InitializePosition();
                                if (typeof vars.opts.callbackOpen === 'function') { // make sure the callback is a function
                                    vars.opts.callbackOpen.call(this); // brings the scope to the callback
                                }
                                if (vars.opts.callFunction)
                                    eval(vars.opts.callFunction);
                            }
                        });

                    }
                }
                else {
                    if (!vars.opts.sHtml) {
                        var p = document.createElement('p');
                        p.innerHTML = "Please specify either \"containerId\" or \"ajaxPageUrl\" or \"sHtml\" option";
                        $('.popupContainer .popupInner').append(p);
                    }
                }
            }
        }

        // HTML of the popup
        function createPopup() {
            var sHtml = document.createElement("div");
            var sHtmlPopup = "";
            var sPopupClass = (vars.opts.displayOuterCloseButton) ? 'popupContainer close ' + vars.opts.popupPosition + '' : 'popupContainer ' + vars.opts.popupPosition + '';
            var spopupClose = (vars.opts.displayOuterCloseButton) ? '<a href="#" class="popupClose" title="' + vars.opts.closeLabel + '">&nbsp;</a>' : '&nbsp;';

            sHtml.setAttribute('class', sPopupClass + ' ' + vars.opts.addClass + ' ' + vars.opts.sTheme);
            sHtml.setAttribute('data-custom-id', vars.opts.dataCustomId);

            sHtmlPopup += (vars.opts.displayOverlay) ? '<div class="popupOverlay"></div>' : '';
            sHtmlPopup += '<div class="pc2">';
            sHtmlPopup += '<div class="close clearfix">' + spopupClose + '</div>';
            sHtmlPopup += '<div class="popupContent">';
            if (vars.opts.popupTitle || vars.opts.displayInnerCloseButton) {
                sHtmlPopup += '<div class="head clearfix">';
                if (vars.opts.popupTitle)
                    sHtmlPopup += '<h1>' + vars.opts.popupTitle + '</h1>';
                if (vars.opts.displayInnerCloseButton)
                    if (vars.opts.displayCloseLabel)
                        sHtmlPopup += '<a href="#" class="popupClose" alt="' + vars.opts.closeLabel + '">' + vars.opts.closeLabel + '</a>';
                    else
                        sHtmlPopup += '<a href="#" class="popupClose" alt="' + vars.opts.closeLabel + '">&nbsp;</a>';
                sHtmlPopup += '</div>';
            }
            sHtmlPopup += '<div class="popupInnerContainer clearfix">';
            sHtmlPopup += '<div class="popupInner clearfix"></div>';
            if (vars.opts.sHtml)
                sHtmlPopup += vars.opts.sHtml;
            sHtmlPopup += '</div>'; // END popupInnerContainer
            sHtmlPopup += '</div>'; // END popupContent
            sHtmlPopup += '</div>';

            sHtml.innerHTML = sHtmlPopup;

            return sHtml;
        }

        // Add "show" class to modal popup, transition is done on css side.
        function ShowModal() {
            vars.popupContainer.classList.add("show");
            //hsdk.PrefixedEvent(vars.popupOverlay, "TransitionEnd", function () {
            executeFunctions();
            //});
        }

        // Execute called functions
        function executeFunctions() {
            if (vars.opts && vars.opts.fn) {
                var allFunctions = vars.opts.fn.split(',');
                for (var i = 0; i < allFunctions.length; i++) {
                    var functionName = allFunctions[i];
                    var functionToExecute = window[functionName];
                    if (typeof functionToExecute === 'function') {
                        functionToExecute(vars.popupContainer);
                    }
                }
            }
        }

        // Load modal popup
        function loadPopup() {

            var oHtmlPopup = createPopup();

            if (vars.opts.appendToContainerId !== "") {
                document.getElementById(vars.opts.appendToContainerId).appendChild(oHtmlPopup);
            }
            else {
                document.getElementsByTagName('body')[0].appendChild(oHtmlPopup);
            }

            GetDatas();
            //$('.popupContainer .popupInner').append(oOut);

            InitializeVariables();

            InitializePosition();
            ShowModal();

            //Close popup when clicking on the background overlay
            if (!vars.opts.disableCloseOverlay) {
                $('div.popupOverlay').on('click', function () {
                    close();
                });
            }

            // Close popup
            $('.popupClose').on('click', function (e) {
                e.preventDefault();
                close();
            });

            // Close the popup with "ESC" key
            if (!vars.opts.disableCloseEsc) {
                $(document).keyup(function (e) {
                    if (e.keyCode == 27) close();
                });
            }
        }

        function InitializePosition() {

            vars.pc2.style.width = (parseInt(vars.opts.popupWidth) !== 0) ? vars.opts.popupWidth + "px" : "90%";

            var popupHeight = (vars.opts.popupHeight !== 0) ? vars.opts.popupHeight : vars.pc2.offsetHeight;

            var halfWidth = ((helpers.Sizes.width - vars.pc2.offsetWidth) / 2);
            var halfHeight = (parseInt(helpers.Sizes.height - popupHeight) / 2);


            halfHeight = (halfHeight < 0) ? 30 : halfHeight;
            halfWidth = (halfWidth < 0) ? 30 : halfWidth;

            // console.log(" -- vars.pc2.offsetHeight : " + vars.pc2.offsetHeight + " -- scrollY : " + scrollY + " -- halfHeight : " + halfHeight + " -- popupHeight : " + popupHeight + " -- helpers.Sizes.height: " + helpers.Sizes.height);

            var c = vars.popupOverlay.style;
            c.backgroundColor = vars.opts.popupBgColor;
            c.opacity = vars.opts.popupOpacity;
            //c.width = (helpers.Sizes.width + helpers.Sizes.scrollX) + "px";
            c.width = "100%";
            //c.height = (helpers.Sizes.height + helpers.Sizes.scrollY) + "px";
            c.height = "100%";
            c.top = 0;
            c.position = "fixed";

            document.getElementsByTagName("body")[0].style.overflow = "hidden";

            var c1 = vars.pc2.style;
            if (!vars.opts.manualPosition) {
                c1.top = halfHeight + "px";
                c1.left = halfWidth + "px";
            }
            if (popupHeight > helpers.Sizes.height) {
                c1.height = (helpers.Sizes.height - 100) + "px";
            }

            var c2 = vars.popupInnerContainer.style;
            if (popupHeight > helpers.Sizes.height) {
                c2.height = (helpers.Sizes.height - 170) + "px";
                c2.overflowY = "auto";
            }

        }


        // Initialize global variable
        function InitializeVariables() {
            vars.popupContainer = document.getElementsByClassName('popupContainer')[0];
            vars.popupOverlay = document.getElementsByClassName('popupOverlay')[0];
            vars.pc2 = document.getElementsByClassName('pc2')[0];
            vars.closePopup = document.getElementsByClassName('popupClose');
            vars.popupInnerContainer = document.getElementsByClassName('popupInnerContainer')[0];
        }

        function close() {

            $("div.popupOverlay").fadeOut(500, function () { $("div.popupOverlay").remove(); });
            $("div.popupContainer").fadeOut(500, function () { $("div.popupContainer").remove(); });

            document.getElementsByTagName("body")[0].style.overflow = "visible";

            if (typeof vars.opts.callbackClose === 'function') { // make sure the callback is a function
                vars.opts.callbackClose.call(this); // brings the scope to the callback
            }
        }

        loadPopup();

        // interface fluide
        return this;
    };

    $.fn.easyPopup.close = function () {

        $("div.popupOverlay").fadeOut(500, function () { $("div.popupOverlay").remove(); });
        $("div.popupContainer").fadeOut(500, function () { $("div.popupContainer").remove(); });

        document.getElementsByTagName("body")[0].style.overflow = "visible";
    };

})(jQuery);
