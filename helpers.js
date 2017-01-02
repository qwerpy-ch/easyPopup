var helpers = {

    /**********************************************
     * Sizes function
     * @return an object that contains some useful sizes
     * accessible by these keys:
     *      - helpers.Sizes.height
     *      - helpers.Sizes.width
     *      - helpers.Sizes.top
     *      - helpers.Sizes.left
     **********************************************/
    Sizes: function () {
        var allSizes = {};

        allSizes.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        allSizes.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        allSizes.scrollX = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft;
        allSizes.scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        allSizes.left = (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0);
        allSizes.top = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);

        return allSizes;
    }(),

    /**********************************************
     * GetLang function
     * Retrieve lang from <html lang> attribute
     **********************************************/
    GetLang: function () {
        return document.getElementsByTagName("html")[0].getAttribute('lang').toLowerCase();
    },

    /**********************************************
     * QueryString function
     * @return an object that contains queryString values
     * accessible by queryString key
     * @example: 
     *      - url : http://www.azerpy.com/home.aspx?key=value
     *      - javascript: helpers.QueryString.key
     **********************************************/
    QueryString: function () {
        var query_string = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], pair[1]];
                query_string[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        return query_string;
    }(),

    /**********************************************
     * ElementSizes function
     * @return an object that contains some useful sizes
     * accessible by these keys:
     *      - helpers.ElementSizes(elem).height
     *      - helpers.ElementSizes(elem).width
     *      - helpers.ElementSizes(elem).top
     *      - helpers.ElementSizes(elem).left
     **********************************************/
    ElementSizes: function (elem) {
        var allSizes = {};

        allSizes.height = elem.offsetHeight;
        allSizes.width = elem.offsetWidth;
        allSizes.left = elem.offsetLeft;
        allSizes.top = elem.offsetTop;

        return allSizes;
    },

    /**********************************************
     * ScrollTo function
     * Scroll to an element
     * @param:
     *  - to: Element to scroll to
     *  - callback: callback function
     *  - duration: time of the animation
     **********************************************/
    ScrollTo: function (to, callback, duration) {
        var toPosition = helpers.ElementSizes(to).top - 60;
        function move(amount) {
            document.documentElement.scrollTop = amount;
            document.body.parentNode.scrollTop = amount;
            document.body.scrollTop = amount;
        }
        function position() {
            return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop;
        }
        var start = position(),
          change = toPosition - start,
          currentTime = 0,
          increment = 20;

        duration = (typeof (duration) === 'undefined') ? 500 : duration;
        var animateScroll = function () {
            // increment the time
            currentTime += increment;
            // find the value with the quadratic in-out easing function
            var val = Math.easeInOutQuad(currentTime, start, change, duration);
            // move the document.body
            move(val);
            // do the animation unless its over
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            } else {
                if (callback && typeof (callback) === 'function') {
                    // the animation is done so lets callback
                    callback();
                }
            }
        };
        animateScroll();
    },
};

/**********************************************
 * String Extension
 * isNullOrWhiteSpace function
 * @return true if a string is empty
 * @example: myString.isNullOrWhiteSpace();
 **********************************************/
String.prototype.isNullOrWhiteSpace = function () {
    //console.log("in isNullOrWhitespace: ", this);
    if (typeof this === 'undefined' || this === null || this === "") return true;
    return this.replace(/\s/g, '').length < 1;
};

/**********************************************
 * String Extension
 * isEmailValid function
 * @return true if string is an email
 * @example: myString.isEmailValid();
 **********************************************/
String.prototype.isEmailValid = function () {
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]{2,}\.)+[a-zA-Z]{2,}))$/;
    return (reg.test(this));
};

/**********************************************
 * String Extension
 * isEmailValidOrNull function
 * @return true if string is an email or null
 * @example: myString.isEmailValidOrNull();
 **********************************************/
String.prototype.isEmailValidOrNull = function () {
    if (this.isNullOrWhiteSpace()) return true;
    var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]{2,}\.)+[a-zA-Z]{2,}))$/;
    return (reg.test(this));
};

/**********************************************
 * String Extension
 * isDateValid function
 * @return true if string is an email
 * @example: myString.isEmailValid();
 **********************************************/
String.prototype.isDateValid = function () {
    if (Object.prototype.toString.call(this) === "[object Date]") {
        return (isNaN(d.getTime()));
    }
    else return false;
};

/**********************************************
 * Math Extension
 * easeInOutQuad function
 **********************************************/
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d / 2;
    if (t < 1) {
        return c / 2 * t * t + b;
    }
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
};
