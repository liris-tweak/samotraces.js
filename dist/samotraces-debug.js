(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Samotraces = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");
var d3 = require("d3");

/**
 * @summary Widget for displaying a representation of the model
 * @class Widget for importing a trace from a CSV file.
 * @author Benoît Mathern|Fatma Derbel
 * @constructor
 * @augments Samotraces.UI.Widgets.Widget
 * @see Samotraces.UI.Widgets.Basic.ImportTrace
 * @todo ATTENTION code qui vient d'ailleurs !
 * @description no description
 * @param {object}	htmlElement
 *     The HTML element that will be used by the widget
 * @param {Samotraces.Trace} trace
 *     Trace object in which the obsels will be imported.
 */

var DisplayModel = function(htmlElement, model, options) {
  "use strict";
  //options = options || {};
  Widget.call(this, htmlElement);
  this.add_class('Widget-TraceModel');
  this.model = model;
  this.model.on('Model:Draw_obsel', this.draw.bind(this));
  this.init_DOM();
  var this_widget = this;
  this.model.on('Model:listeType', function(e) {
    this_widget.data = e.data;
    this_widget.draw();

  });
  var bind_function = function(val_or_fun) {
    if (val_or_fun instanceof Function) {
      return val_or_fun.bind(this_widget);
    } else {
      return val_or_fun;
    }
  };
  var x = 0;
  var x1 = 16;
  this.options = {};
  this.options.y_Img = bind_function(options.x || function() {
    x = x + 16;
    return x;
  });
  this.options.y_text = bind_function(options.x || function() {
    x1 = x1 + 16;
    return x1;
  });
  //this.options.y = bind_function(options.y || 17);
  //this.options.width = bind_function(options.width || 16);
  //this.options.height = bind_function(options.height || 16);
  //this.options.url = bind_function(options.url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG7AAABuwBHnU4NQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKsSURBVDiNrZNLaFNpFMd/33fvTa5tYpuq0yatFWugRhEXw9AuhJEZBCkiqJWCIErrxp241C6L6650M/WBowunoyCDCjKrGYZ0IbiwxkdUbGyaPmgSm8d9f25MbXUlzH95zv/8OOdwjlBKsVajU1kEtJiavNBsaKcBqq5/3fKDSwrKY33JdX7RAIxOZQGM3bHIymCyPZhZqT8p2d4sQGtY7+yObvhxMjsvp4uVKOA2QEIpxehUFl2IvuFUZ3rZcu/+9X7RWqg7Jxw/QAFhTdLRFJoY6N4SazONo1czs/2eUlNjfUn0Risne+Pp9yv18TvZwrl9iVb2J2JEQhoKKNke6UJ55LfMB4aSHeMne+Ppay/yAkBcTL9ma7Np7Yu3/n1lOjdQ8wLO793GzlgzFdcjYujoUpAt17j8LIfjB5zdvfXBv3OlX3NVy5SAOJVKhP94M29UXB8FFGoWE89nufTkHQ9nFlEKejZuoLe1iYrr8+fbee9UKhEGhB6SYrBoudPLtnsAQCnF768Kq1v2AxAC6l7AsuUCsGS5h4uWOx2SYlBqQoyUHW/O9gO+1i9dbfyciKGA/wol3pTrANh+QNnx5jQhRuQ3VZ+1Z1OUg92biZkG/+SL3Hu7gPfVzQBIX6mJlpAeD2vrWds3mth+wOtSlUczS1RdfzUX1iQtIT3uKzWhO4GajJnGnc2mcf+j4x1umJ4uVShUbRSwUHPWwdvCxuOYaRxwAjUpAXUjk7eP9bTrEUNbNf30Q5ThXV0c6WknGvoSjxgax3e0uzcyeRtQcqwvSa5qmaYuB4aSHeMNiEJgahJ9zWQRQ2Mo2TFu6nIgV7XMdZd48+Vc/3CqM30m1XX3wcxi8d3H2sitl3mUACkEyZam24e2bTHbTOPc1cxsf6Pu/3mmtfred/4ESQNKXG8VACoAAAAASUVORK5CYII=');

     this.stylesheet = options || {} ;


};

DisplayModel.prototype = {
  init_DOM: function() {
    "use strict";
    var div_elmt = d3.select(this.element);
    this.div_elmt = d3.select(this.element);
    this.svg = div_elmt.append('svg').attr('height', '1000px');
    // create the (red) line representing current time

    this.x = 16;
    this.translate_offset = 0;
    var x = d3.time.scale()
      .domain([new Date(2014, 4, 1), new Date(2014, 4, 15) - 1])
      // .domain([this.window.start, this.window.end])
      .range([0, this.element.clientWidth]);

    var margin = {top: 200, right: 40, bottom: 200, left: 40},
      height = 500 - margin.top - margin.bottom;
    /*this.svg_gp = this.svg.append('g')
    .attr('transform', 'translate(0,0)');
    this.svg_text = this.svg.append('g')
    .attr('transform', 'translate(0,0)');*/
    this.svg_selected_obsel = div_elmt.append('line')
      .attr('x1', '0')
      .attr('y1', '0%')
      .attr('x2', '0')
      .attr('y2', '100%')
      .attr('stroke-width', '1px')
      .attr('stroke', 'black')
      .attr('opacity', '0.3')
      .attr('transform', 'translate(0,0)')
      .style('display', 'none');
  },
  d3Obsels: function() {
    "use strict";
    return this.svg_gp
      .selectAll('circle,image,rect')
      // TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
      //.data(this.data); //,function(d) { return d.id;});
      .data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
  },

  d3Obselstext: function() {
    "use strict";
    return this.svg_text
      .selectAll('circle,image,rect')
      // TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
      //.data(this.data); //,function(d) { return d.id;});
      .data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
  },

  draw: function(e) {
    "use strict";
    var images = this.svg.selectAll("circle,image,rect")
      .data(this.data, function(d) {
        return d.id;
      })
      .enter()
      .append("image");



    var that = this;
    var getIconPath = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].icon;
      } else {
        return self.stylesheet.default.icon;
      }
    }
    var getWidth = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].width;
      } else {
        return self.stylesheet.default.width;
      }
    }

    var getHeight = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].height;
      } else {
        return self.stylesheet.default.height;
      }
    }

    var getY = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].y;
      } else {
        return self.stylesheet.default.y;
      }
    }


    var images_att =  images.attr('class', 'Samotraces-obsel')
      .attr('y', this.options.y_Img)
      .attr('x', 17)
      .attr('width', getWidth)
      .attr('height', getHeight)
      .attr('xlink:href', getIconPath);
      //.attr('xlink:href', this.options.url);
      //.attr('xlink:href', 'images/Orange.png');
    var text = this.svg.selectAll("text")
      .data(this.data)
      .enter()
      .append("text");
    var textLabels = text
      .attr("x", '35')
      .attr("y", this.options.y_text)
      .text(function(d) { return d.type;})
      .attr("font-family", "sans-serif")
      .attr("font-size", "15px");
    $('image', this.element).each(function(i, el) {
      $.data(el, {
        'Samotraces-type': 'obsel',
        'Samotraces-data': d3.select(el).datum()
      });
    });
  },
  refresh_x: function() {
    "use strict";
    this.scale_x = this.element.clientWidth / this.window.get_width();
    this.translate_offset = 0;
    this.svg_gp
      .attr('transform', 'translate(0,0)');
    this.d3Obsels()
      .attr('x', this.options.x)
      .attr('y', this.options.y);
  },
};

module.exports = DisplayModel;

},{"./Widget.js":18,"d3":"d3","jquery":"jquery"}],2:[function(require,module,exports){
var Widget = require("./Widget.js");

/**
 * @summary Widget for importing a trace from a CSV file.
 * @class Widget for importing a trace from a CSV file.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.UI.Widgets.Widget
 * @see Samotraces.UI.Widgets.Basic.ImportTrace
 * @todo ATTENTION code qui vient d'ailleurs !
 * @description
 * The {@link Samotraces.UI.Widgets.Basic.ImportTrace} widget is a generic
 * Widget to import a trace from a CSV file.
 *
 * This widget currently accept the following format:
 *
 * 1. The CSV file can use either ',' or ';' as a value separator
 * 2. Each line represents an obsel
 * 3. The first column represents the time when the obsel occurs
 * 4. The second column represents the type of the obsel
 * 5. The following columns represent pairs of "attribute" / "value" columns
 *
 * The number of columns may vary from line to line.
 * For example, a CSV file might look like this:
 * <pre>
 * 0,click,target,button2
 * 2,click,target,button1,value,toto
 * 3,focus,target,submit
 * 5,click,target,submit
 * </pre>
 * @todo DESCRIBE THE FORMAT OF THE CSV FILE.
 * @param {object}	htmlElement
 *     The HTML element that will be used by the widget
 * @param {Samotraces.Trace} trace
 *     Trace object in which the obsels will be imported.
 */

var ImportTrace = function(htmlElement, trace) {
  "use strict";

  // ImportTrace is a Widget
  Widget.call(this, htmlElement);
  this.trace = trace;
  this.init_DOM();
};

ImportTrace.prototype = {
  init_DOM: function() {
    "use strict";

    var p_element = document.createElement('p');
    var text_node = document.createTextNode('Import a trace: ');

    p_element.appendChild(text_node);
    this.input_element = document.createElement('input');
    this.input_element.setAttribute('type', 'file');
    this.input_element.setAttribute('name', 'csv-file[]');
    this.input_element.setAttribute('multiple', 'true');
    //		this.input_element.setAttribute('size',15);
    //		this.input_element.setAttribute('value',this.timer.time);
    p_element.appendChild(this.input_element);

    //		var submit_element = document.createElement('input');
    //		submit_element.setAttribute('type','submit');
    //		submit_element.setAttribute('value','Import');
    //		p_element.appendChild(submit_element);

    this.form_element = document.createElement('form');
    this.input_element.addEventListener('change', this.on_change.bind(this));

    this.form_element.appendChild(p_element);
    this.element.appendChild(this.form_element);

    var button_el = document.createElement('p');
    var a_el = document.createElement('a');
    a_el.href = "";
    a_el.innerHTML = "toggle console";
    button_el.appendChild(a_el);
    //		button_el.innerHTML = "<a href=\"\">toggle console</a>";
    a_el.addEventListener('click', this.on_toggle.bind(this));
    this.element.appendChild(button_el);

    this.display_element = document.createElement("div");
    this.display_element.style.display = "none";
    this.element.appendChild(this.display_element);
  },

  on_change: function(e) {
    "use strict";

    var files = e.target.files;
    var title_el, content_el;
    for (var i = 0, file; file = files[i]; i++) {
      title_el = document.createElement("h2");
      title_el.appendChild(document.createTextNode(file.name));
      this.display_element.appendChild(title_el);
      content_el = document.createElement("pre");
      var reader = new FileReader();
      reader.onload = (function(el, parser, trace) {
        return function(e) {
          parser(e.target.result, trace);
          el.appendChild(document.createTextNode(e.target.result));
        };
      })(content_el, this.parse_csv, this.trace);
      /*			reader.onprogress = function(e) {
      				console.log(e);
      			};*/
      reader.readAsText(file);
      this.display_element.appendChild(content_el);
      this.trace.trigger ("beforLoadFile");
    }
  },

  on_toggle: function(e) {
    "use strict";
    e.preventDefault();
    if (this.display_element.style.display === "none") {
      this.display_element.style.display = "block";
    } else {
      this.display_element.style.display = "none";
    }
    return false;
  },
  parse_csv: function(text, trace) {
    "use strict";

    //function csvToArray() from
    // http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data

    // This will parse a delimited string into an array of
    // arrays. The default delimiter is the comma, but this
    // can be overriden in the second argument.
    function csvToArray(strData, strDelimiter) {
      // Check to see if the delimiter is defined. If not,
      // then default to comma.
      strDelimiter = (strDelimiter || ",");

      // Create a regular expression to parse the CSV values.
      var objPattern = new RegExp(
      (
      // Delimiters.
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

      // Quoted fields.
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

      // Standard fields.
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
      );

      // Create an array to hold our data. Give the array
      // a default empty first row.
      var arrData = [[]];

      // Create an array to hold our individual pattern
      // matching groups.
      var arrMatches = null;

      // Keep looping over the regular expression matches
      // until we can no longer find a match.
      while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter !== strDelimiter)) {

          // Since we have reached a new row of data,
          // add an empty row to our data array.
          arrData.push([]);
        }

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]) {

          // We found a quoted value. When we capture
          // this value, unescape any double quotes.
          var strMatchedValue = arrMatches[ 2 ].replace(
          new RegExp("\"\"", "g"), "\"");
        } else {
          // We found a non-quoted value.
          var strMatchedValue = arrMatches[ 3 ];
        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push(strMatchedValue);
      }

      // Return the parsed data.
      return (arrData);
    }

    // console.log('fichier chargé');
    // Guessing the separator
    var sep = text[text.search("[,;\t]")];
    var csv = csvToArray(text, sep);
    csv.pop(); // remove the last line... Why?...
    //	console.log('fichier parsé');
    csv.map(function(line,j) {
      var o_attr = {};
      o_attr.begin = line.shift();
      o_attr.type = line.shift();
      o_attr.attributes = {};
      for (var i = 0; i < (line.length - 1) / 2 ; i++) {
        if (line[2 * i] !== "") {
          o_attr.attributes[line[2 * i]] = line[2 * i + 1];
        }
      }
      if (j===0) {trace.trigger ("firstObselLocal",o_attr)};
      if (j===csv.length-1) {trace.trigger ("LastObselLocal",o_attr)};

      trace.create_obsel(o_attr);
    });
  }
};

module.exports = ImportTrace;

},{"./Widget.js":18}],3:[function(require,module,exports){
var Widget = require("./Widget.js");

var IntervalTimeForm = function(html_id, timeWindow) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);
  this.add_class('Widget-ReadableTimeForm');
  this.window = timeWindow;
  this.window.on('tw:update', this.refresh.bind(this));
  this.window.on('tw:translate', this.refresh.bind(this));
  //this.timer.on('timer:update',this.refresh.bind(this));
  //this.timer.on('timer:play:update',this.refresh.bind(this));
  this.init_DOM();
  this.refresh();
	};

IntervalTimeForm.prototype = {
  init_DOM: function() {

    var p_element = document.createElement('p');
    var text_node = document.createTextNode('FROM: ');
    p_element.appendChild(text_node);
    this.year_element = document.createElement('input');
    this.year_element.setAttribute('type', 'text');
    this.year_element.setAttribute('name', 'year');
    this.year_element.setAttribute('size', 4);
    this.year_element.setAttribute('value', '');
    p_element.appendChild(this.year_element);
    p_element.appendChild(document.createTextNode('/'));
    this.month_element = document.createElement('input');
    this.month_element.setAttribute('type', 'text');
    this.month_element.setAttribute('name', 'month');
    this.month_element.setAttribute('size', 2);
    this.month_element.setAttribute('value', '');
    p_element.appendChild(this.month_element);
    p_element.appendChild(document.createTextNode('/'));
    this.day_element = document.createElement('input');
    this.day_element.setAttribute('type', 'text');
    this.day_element.setAttribute('name', 'day');
    this.day_element.setAttribute('size', 2);
    this.day_element.setAttribute('value', '');
    p_element.appendChild(this.day_element);
    p_element.appendChild(document.createTextNode(' - '));
    this.hour_element = document.createElement('input');
    this.hour_element.setAttribute('type', 'text');
    this.hour_element.setAttribute('name', 'hour');
    this.hour_element.setAttribute('size', 2);
    this.hour_element.setAttribute('value', '');
    p_element.appendChild(this.hour_element);
    p_element.appendChild(document.createTextNode(':'));
    this.minute_element = document.createElement('input');
    this.minute_element.setAttribute('type', 'text');
    this.minute_element.setAttribute('name', 'minute');
    this.minute_element.setAttribute('size', 2);
    this.minute_element.setAttribute('value', '');
    p_element.appendChild(this.minute_element);
    p_element.appendChild(document.createTextNode(':'));
    this.second_element = document.createElement('input');
    this.second_element.setAttribute('type', 'text');
    this.second_element.setAttribute('name', 'second');
    this.second_element.setAttribute('size', 8);
    this.second_element.setAttribute('value', '');
    p_element.appendChild(this.second_element);

    //var p_element1 = document.createElement('p');
    var text_node1 = document.createTextNode('To: ');
    p_element.appendChild(text_node1);
    this.year_element1 = document.createElement('input');
    this.year_element1.setAttribute('type', 'text');
    this.year_element1.setAttribute('name', 'year');
    this.year_element1.setAttribute('size', 4);
    this.year_element1.setAttribute('value', '');
    p_element.appendChild(this.year_element1);
    p_element.appendChild(document.createTextNode('/'));
    this.month_element1 = document.createElement('input');
    this.month_element1.setAttribute('type', 'text');
    this.month_element1.setAttribute('name', 'month');
    this.month_element1.setAttribute('size', 2);
    this.month_element1.setAttribute('value', '');
    p_element.appendChild(this.month_element1);
    p_element.appendChild(document.createTextNode('/'));
    this.day_element1 = document.createElement('input');
    this.day_element1.setAttribute('type', 'text');
    this.day_element1.setAttribute('name', 'day');
    this.day_element1.setAttribute('size', 2);
    this.day_element1.setAttribute('value', '');
    p_element.appendChild(this.day_element1);
    p_element.appendChild(document.createTextNode(' - '));
    this.hour_element1 = document.createElement('input');
    this.hour_element1.setAttribute('type', 'text');
    this.hour_element1.setAttribute('name', 'hour');
    this.hour_element1.setAttribute('size', 2);
    this.hour_element1.setAttribute('value', '');
    p_element.appendChild(this.hour_element1);
    p_element.appendChild(document.createTextNode(':'));
    this.minute_element1 = document.createElement('input');
    this.minute_element1.setAttribute('type', 'text');
    this.minute_element1.setAttribute('name', 'minute');
    this.minute_element1.setAttribute('size', 2);
    this.minute_element1.setAttribute('value', '');
    p_element.appendChild(this.minute_element1);
    p_element.appendChild(document.createTextNode(':'));
    this.second_element1 = document.createElement('input');
    this.second_element1.setAttribute('type', 'text');
    this.second_element1.setAttribute('name', 'second');
    this.second_element1.setAttribute('size', 8);
    this.second_element1.setAttribute('value', '');
    p_element.appendChild(this.second_element1);





    var submit_element = document.createElement('input');
    submit_element.setAttribute('type', 'submit');
    submit_element.setAttribute('value', 'Update time');
    p_element.appendChild(submit_element);
    this.form_element = document.createElement('form');
    this.form_element.addEventListener('submit', this.build_callback('submit'));

    this.form_element.appendChild(p_element);


    this.element.appendChild(this.form_element);
  },
  refresh: function() {

    timestart = this.window.start;
    timeEnd = this.window.end;

    var datestart = new Date();
    datestart.setTime(timestart);
    this.year_element.value   = datestart.getFullYear();
    this.month_element.value  = datestart.getMonth() + 1;
    this.day_element.value    = datestart.getDate();
    this.hour_element.value   = datestart.getHours();
    this.minute_element.value = datestart.getMinutes();
    this.second_element.value = datestart.getSeconds() + datestart.getMilliseconds() / 1000;

    var dateEnd = new Date();
    dateEnd.setTime(timeEnd);
    this.year_element1.value   = dateEnd.getFullYear();
    this.month_element1.value  = dateEnd.getMonth() + 1;
    this.day_element1.value    = dateEnd.getDate();
    this.hour_element1.value   = dateEnd.getHours();
    this.minute_element1.value = dateEnd.getMinutes();
    this.second_element1.value = dateEnd.getSeconds() + dateEnd.getMilliseconds() / 1000;
  },
  build_callback: function(event) {
    var timerWindow = this.window;
    var time_form = this;
    switch (event) {
      case 'submit':
        return function(e) {
          //console.log('WidgetBasicTimeForm.submit');
          e.preventDefault();


          var datestart = new Date();
          datestart.setFullYear(time_form.year_element.value);
          datestart.setMonth(time_form.month_element.value - 1);
          datestart.setDate(time_form.day_element.value);
          datestart.setHours(time_form.hour_element.value);
          datestart.setMinutes(time_form.minute_element.value);
          datestart.setSeconds(time_form.second_element.value);
          var dateend = new Date();
          dateend.setFullYear(time_form.year_element1.value);
          dateend.setMonth(time_form.month_element1.value - 1);
          dateend.setDate(time_form.day_element1.value);
          dateend.setHours(time_form.hour_element1.value);
          dateend.setMinutes(time_form.minute_element1.value);
          dateend.setSeconds(time_form.second_element1.value);
          timerWindow.set_start(datestart.getTime());
          timerWindow.set_end (dateend.getTime())
          //timer.set(date.getTime());
          return false;
        };
      default:
        return function() {};
    }
  }
	};

module.exports = IntervalTimeForm;

},{"./Widget.js":18}],4:[function(require,module,exports){
var $ = require("jquery");
var Widget = require("./Widget.js");
var EventHandler = require("../../core/EventHandler.js");

/**
 * @class Generic Widget for visualising the available bases of a KTBS.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @description
 * TODO ecrire description
 * @todo ECRIRE LA DESCRIPTION
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.KTBS} ktbs
 *     KTBS to bind to.
 * @param {Samotraces.Lib.EventHandler.EventConfig} [events]
 *     Events to listen to and their corresponding callbacks.
 */
var ListBases = function(html_id, ktbs, events) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);
  EventHandler.call(this, events);
  this.add_class('Widget-ListBases');

  this.ktbs = ktbs;
  ktbs.on('ktbs:update', this.refresh.bind(this));

  this.init_DOM();
};

ListBases.prototype = {
  init_DOM: function() {
    //this.element.innerHTML = "";
    //$(this.element).append('<h2>KTBS root: '+this.ktbs.get_uri()+'</h2>');
    /*
    		var title = document.createElement('h2');
    		var title_text = document.createTextNode('KTBS root: '+this.ktbs.get_uri());
    		title.appendChild(title_text);
    		this.element.appendChild(title);
*/
    this.datalist_element = document.createElement('ul');
    this.element.appendChild(this.datalist_element);

    this.add_button = document.createElement('button');
    $(this.add_button).append('New base');
    this.element.appendChild(this.add_button);
    $(this.add_button).click(this.open_form.bind(this));
  },
  open_form: function() {

    this.add_button.disabled = true;

    this.form = {};

    this.form.input_id = document.createElement('input');
    this.form.input_id.size = 20;
    this.form.text1 = document.createTextNode(' Base ID: ');
    this.form.input_label = document.createElement('input');
    this.form.input_label.size = 20;
    this.form.text2 = document.createTextNode(' label: ');
    this.form.button = document.createElement('button');
    $(this.form.button).append('create');

    $(this.element).append(this.form.text1);
    $(this.element).append(this.form.input_id);
    $(this.element).append(this.form.text2);
    $(this.element).append(this.form.input_label);
    $(this.element).append(this.form.button);

    $(this.form.button).click(this.create_base.bind(this));

  },
  create_base: function(e) {
    if ($(this.form.input_id).val() !== "") {
      console.log("Creating a new base...");
      this.ktbs.create_base($(this.form.input_id).val(), $(this.form.input_label).val());
    } else {
      console.log("Empty base name... No base created");
    }

    for (var k in this.form) {
      if (this.form.hasOwnProperty(k))      {$(this.form[k]).remove();}
    }
    this.add_button.disabled = false;
  },
  refresh: function() {
    // clear
    this.datalist_element.innerHTML = '';
    var li_element;
    this.ktbs.list_bases().forEach(function(b) {
      li_element = document.createElement('li');
      li_link = document.createElement('button');
      li_link.setAttribute("class", "base");
      li_link.appendChild(document.createTextNode(b));
      li_element.appendChild(li_link);
      li_element.addEventListener('click', (function() {this.trigger('ui:click:base', b)}).bind(this));
      this.datalist_element.appendChild(li_element);
    }, this);
    this.trigger("ListBase");

  },
};

module.exports = ListBases;

},{"../../core/EventHandler.js":22,"./Widget.js":18,"jquery":"jquery"}],5:[function(require,module,exports){
var $ = require("jquery");
var Widget = require("./Widget.js");
var EventHandler = require("../../core/EventHandler.js");

/**
 * @class Generic Widget for visualising the available bases of a KTBS.
 * @author Benoît Mathern // fatma DErbel
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @description
 * TODO ecrire description
 * @todo ECRIRE LA DESCRIPTION
 * @param {String}	htmlElement
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.KTBS.Base} ktbsBase
 *     KTBS Base to bind to.
 * @param {Samotraces.Lib.EventHandler.EventConfig} [events]
 *     Events to listen to and their corresponding callbacks.
 */
var ListModelInBases = function(htmlElement, ktbsBase, events) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, htmlElement);
  EventHandler.call(this, events);
  this.add_class('Widget-ListTraces');

  this.base = ktbsBase;
  this.base.on('base:update', this.refresh.bind(this));

  this.init_DOM();
};

ListModelInBases.prototype = {
  init_DOM: function() {
    //this.element.innerHTML = "";

    /*var title = document.createElement('h2');
    		var title_text = document.createTextNode('Base: '+this.base.get_uri());
    		title.appendChild(title_text);
    		this.element.appendChild(title);*/

    this.datalist_element = document.createElement('ul');
    this.element.appendChild(this.datalist_element);


    this.add_button = document.createElement('button');
    $(this.add_button).append('New Model');
    this.element.appendChild(this.add_button);
    $(this.add_button).click(this.open_form.bind(this));

    /*this.remove_button = document.createElement('button');
    		$(this.remove_button).append('Delete base');
    		this.element.appendChild(this.remove_button);
    		$(this.remove_button).click(this.remove_base.bind(this));*/


  },
  open_form: function() {

    this.add_button.disabled = true;

    this.form = {};

    this.form.input_id = document.createElement('input');
    this.form.input_id.size = 20;
    this.form.text1 = document.createTextNode(' Model ID: ');
    this.form.input_label = document.createElement('input');
    this.form.input_label.size = 20;
    this.form.text2 = document.createTextNode(' label: ');
    this.form.button = document.createElement('button');
    $(this.form.button).append('create');

    $(this.element).append(this.form.text1);
    $(this.element).append(this.form.input_id);
    $(this.element).append(this.form.text2);
    $(this.element).append(this.form.input_label);
    $(this.element).append(this.form.button);

    $(this.form.button).click(this.create_trace.bind(this));

  },
  create_trace: function(e) {
    if ($(this.form.input_id).val() !== "") {
      console.log("Creating a new trace...");
      this.base.create_stored_trace($(this.form.input_id).val(), null, null, null, $(this.form.input_label).val());
    } else {
      console.log("Empty trace name... No trace created");
    }

    for (var k in this.form) {
      $(this.form[k]).remove();
    }
    this.add_button.disabled = false;
  },
  remove_base: function() {
    this.base.remove();
  },
  refresh: function() {
    // clear
    this.datalist_element.innerHTML = '';
    var li_element;
    this.base.list_traces().forEach(function(t) {
      if (t['@type'] == "TraceModel") {
        li_element = document.createElement('li');
        li_link = document.createElement('button');
        li_link.setAttribute("class", "model");
        li_link.appendChild(document.createTextNode(t['@id']));
        li_element.appendChild(li_link);
        li_element.addEventListener('click', (function() {this.trigger('ui:click:trace', t['@id'])}).bind(this));
      this.datalist_element.appendChild(li_element);}
    }, this);
    this.trigger("ListModel");
  },
  select: function() {
	}
};

module.exports = ListModelInBases;

},{"../../core/EventHandler.js":22,"./Widget.js":18,"jquery":"jquery"}],6:[function(require,module,exports){
var $ = require("jquery");
var Widget = require("./Widget.js");
var EventHandler = require("../../core/EventHandler.js");

/**
 * @class Generic Widget for visualising the available bases of a KTBS.
 * @author Benoît Mathern
 * @constructor
 * @augments Samotraces.Widgets.Widget
 * @description
 * TODO ecrire description
 * @todo ECRIRE LA DESCRIPTION
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Lib.KTBS.Base} ktbs_base
 *     KTBS Base to bind to.
 * @param {Samotraces.Lib.EventHandler.EventConfig} [events]
 *     Events to listen to and their corresponding callbacks.
 */
var ListTracesInBases = function(html_id, ktbs_base, events) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);
  EventHandler.call(this, events);
  this.add_class('Widget-ListTraces');

  this.base = ktbs_base;
  this.base.on('base:update', this.refresh.bind(this));

  this.init_DOM();
};

ListTracesInBases.prototype = {
  init_DOM: function() {
    //this.element.innerHTML = "";

    /*var title = document.createElement('h2');
    		var title_text = document.createTextNode('Base: '+this.base.get_uri());
    		title.appendChild(title_text);
    		this.element.appendChild(title);*/

    this.datalist_element = document.createElement('ul');
    this.element.appendChild(this.datalist_element);

    /*this.remove_button = document.createElement('button');
    		$(this.remove_button).append('Delete base');
    		this.element.appendChild(this.remove_button);
    		$(this.remove_button).click(this.remove_base.bind(this));*/

    this.add_button = document.createElement('button');
    $(this.add_button).append('New trace');
    this.element.appendChild(this.add_button);
    $(this.add_button).click(this.open_form.bind(this));

  },
  open_form: function() {

    this.add_button.disabled = true;

    this.form = {};

    this.form.input_id = document.createElement('input');
    this.form.input_id.size = 20;
    this.form.text1 = document.createTextNode(' Trace ID: ');
    this.form.input_label = document.createElement('input');
    this.form.input_label.size = 20;
    this.form.text2 = document.createTextNode(' label: ');
    this.form.button = document.createElement('button');
    $(this.form.button).append('create');

    $(this.element).append(this.form.text1);
    $(this.element).append(this.form.input_id);
    $(this.element).append(this.form.text2);
    $(this.element).append(this.form.input_label);
    $(this.element).append(this.form.button);

    $(this.form.button).click(this.create_trace.bind(this));

  },
  create_trace: function(e) {
    if ($(this.form.input_id).val() !== "") {
      console.log("Creating a new trace...");
      this.base.create_stored_trace($(this.form.input_id).val(), null, null, null, $(this.form.input_label).val());
    } else {
      console.log("Empty trace name... No trace created");
    }

    for (var k in this.form) {
      if (this.form.hasOwnProperty(k))      {$(this.form[k]).remove();}
    }
    this.add_button.disabled = false;
  },
  remove_base: function() {
    this.base.remove();
  },
  refresh: function() {
    // clear
    this.datalist_element.innerHTML = '';
    var li_element;
    this.base.list_traces().forEach(function(t) {
      if (t['@type'] == "StoredTrace") {
        li_element = document.createElement('li');
        li_link = document.createElement('button');
        li_link.setAttribute("class", "trace");
        li_link.appendChild(document.createTextNode(t['@id']));
        li_element.appendChild(li_link);
        //li_element.appendChild(document.createTextNode(t['@id']));
        li_element.addEventListener('click', (function() {this.trigger('ui:click:trace', t['@id'])}).bind(this));
      this.datalist_element.appendChild(li_element);}
    }, this);
    this.trigger("ListTrace");

  },
  select: function() {
	}
};

module.exports = ListTracesInBases;

},{"../../core/EventHandler.js":22,"./Widget.js":18,"jquery":"jquery"}],7:[function(require,module,exports){
var Widget = require("./Widget.js");

/**
 * @summary Widget for visualising an Obsel as an HTML list.
 * @class Widget for visualising an Obsel as an HTML list.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.ObselInspector is a generic
 * Widget to visualise Obsels.
 *
 * This widget observes a {@link Samotraces.Lib.Selector|Selector}
 * object. When an obsel is selected, the information about
 * this obsel is displayed in the widget. When an obsel is
 * unselected, the widget closes. Clicking on the red cross
 * will close the widget (and automatically unselect the obsel).
 * When no obsel are selected, the widget is not visible,
 * selecting an obsel will make it appear.
 *
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Selector.<Obsel>} obsel_selector
 *     A Selector of Obsel to observe.
 */
var ObselInspector = function(html_id, obsel_selector) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);
  this.add_class('Widget-ObselInspector');

  this.obsel = obsel_selector;
  this.obsel.on('selection:add', this.inspect.bind(this));
  this.obsel.on('selection:empty', this.close.bind(this));
  this.obsel.on('selection:remove', this.close.bind(this));

  this.init_DOM();
};

ObselInspector.prototype = {
  init_DOM: function() {

    this.close_element = document.createElement('span');
    var img_element = document.createElement('img');
    img_element.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFPSURBVDiNlZOxTgJREEXPfUuPEmyMrQSLJaHWhCiltYX/oZ2VscLKr6CgpgOMRn/ARRAtiTYYsVd2LFjIstklcZqXzMy5M5mZpxEUf+HC4ARoO7jeM3sjxV6kUjjPPRQ0c9DQMzQMzmN5nyEc+WZBHA4k30EPKC58ghv1YQzsJIqtiKTBkX04wW1Kt0UHvb5U6UuVDBigrSGUQngw2EpGDb6jVjeSMcFEsC8zI5B8D7ppImkmmMyg7psFDsA3C2ZQF0z+AwPIzJbBaFh3wGYGPw2hFt+Qi0c98JTwJao7D7y4b5k8kKo2n0M+S8Agb9AdSNUVgQjuAIUsOGYFg85CRE9QdvCYAU+jN20mXwYHzoOzNFgwCaEWQi1jOwXBhfrwDmwn4fiq1tzJ2Ala62BYeydNjaD4M/+Npwb3Obgsm72mtMxQ2g3nuceCVg6u/gBs54alonwdWQAAAABJRU5ErkJggg==');
    this.close_element.appendChild(img_element);
    this.element.appendChild(this.close_element);

    this.datalist_element = document.createElement('ul');
    this.element.appendChild(this.datalist_element);

    this.element.style.display = 'none';

    this.close_element.addEventListener('click', this.onCloseAction.bind(this));
  },
  inspect: function(event) {
    var obs = event.data;
    // clear
    this.datalist_element.innerHTML = '';

    var attributes = obs.attributes;

    var li_element = document.createElement('li');
    li_element.appendChild(document.createTextNode('id: ' + obs.get_id()));
    this.datalist_element.appendChild(li_element);

    li_element = document.createElement('li');
    li_element.appendChild(document.createTextNode('type: ' + obs.get_type()));
    this.datalist_element.appendChild(li_element);

    li_element = document.createElement('li');
    li_element.appendChild(document.createTextNode('begin: ' + obs.get_begin()));
    //	li_element.appendChild(document.createTextNode('begin: '+ (new Date(obs.get_begin())).toString()));
    this.datalist_element.appendChild(li_element);

    li_element = document.createElement('li');
    li_element.appendChild(document.createTextNode('end: ' + obs.get_end()));
    //	li_element.appendChild(document.createTextNode('end: '+ (new Date(obs.get_end())).toString()));
    this.datalist_element.appendChild(li_element);

    for (var key in obs.attributes) {
      if (obs.attributes.hasOwnProperty(key))      {li_element = document.createElement('li');
        li_element.appendChild(document.createTextNode(key  + ': ' + obs.attributes[key]));
      this.datalist_element.appendChild(li_element);}
    }

    this.element.style.display = 'block';
  },
  close: function() {
    this.element.style.display = 'none';
  },
  onCloseAction: function() {
    this.obsel.unselect();
  }
};

module.exports = ObselInspector;

},{"./Widget.js":18}],8:[function(require,module,exports){
var Widget = require("./Widget.js");

/**
 * @summary Widget for visualising an Obsel as an HTML list.
 * @class Widget for visualising an Obsel as an HTML list.
 * @author Benoît Mathern // Fatma Derbel
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.ObselInspector is a generic
 * Widget to visualise Obsels.
 *
 * This widget observes a {@link Samotraces.Lib.Selector|Selector}
 * object. When an obsel is selected, the information about
 * this obsel is displayed in the widget. When an obsel is
 * unselected, the widget closes. Clicking on the red cross
 * will close the widget (and automatically unselect the obsel).
 * When no obsel are selected, the widget is not visible,
 * selecting an obsel will make it appear.
 *
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Selector.<Obsel>} obsel_selector
 *     A Selector of Obsel to observe.
 */
var ObselTypeInspector = function(html_id, obsel_selector) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);
  this.add_class('Widget-ObselInspectorType');

  this.obsel = obsel_selector;
  this.obsel.on('selection:add', this.inspect.bind(this));
  this.obsel.on('selection:empty', this.close.bind(this));
  this.obsel.on('selection:remove', this.close.bind(this));

  this.init_DOM();
};

ObselTypeInspector.prototype = {
  init_DOM: function() {

    this.close_element = document.createElement('span');
    var img_element = document.createElement('img');
    img_element.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAN1wAADdcBQiibeAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFPSURBVDiNlZOxTgJREEXPfUuPEmyMrQSLJaHWhCiltYX/oZ2VscLKr6CgpgOMRn/ARRAtiTYYsVd2LFjIstklcZqXzMy5M5mZpxEUf+HC4ARoO7jeM3sjxV6kUjjPPRQ0c9DQMzQMzmN5nyEc+WZBHA4k30EPKC58ghv1YQzsJIqtiKTBkX04wW1Kt0UHvb5U6UuVDBigrSGUQngw2EpGDb6jVjeSMcFEsC8zI5B8D7ppImkmmMyg7psFDsA3C2ZQF0z+AwPIzJbBaFh3wGYGPw2hFt+Qi0c98JTwJao7D7y4b5k8kKo2n0M+S8Agb9AdSNUVgQjuAIUsOGYFg85CRE9QdvCYAU+jN20mXwYHzoOzNFgwCaEWQi1jOwXBhfrwDmwn4fiq1tzJ2Ala62BYeydNjaD4M/+Npwb3Obgsm72mtMxQ2g3nuceCVg6u/gBs54alonwdWQAAAABJRU5ErkJggg==');
    this.close_element.appendChild(img_element);
    this.element.appendChild(this.close_element);

    this.datalist_element = document.createElement('ul');
    this.element.appendChild(this.datalist_element);

    this.element.style.display = 'none';

    this.close_element.addEventListener('click', this.onCloseAction.bind(this));
  },
  inspect: function(event) {
    var obs = event.data;
    // clear
    this.datalist_element.innerHTML = '';

    var attributes = obs.attributes;
    li_element = document.createElement('li');
    //li_element.appendChild(document.createTextNode('type: '+ obs.get_type()));
    li_element.appendChild(document.createTextNode('type: ' + obs["type"]));
    this.datalist_element.appendChild(li_element);


    li_element = document.createElement('li');
    li_element.appendChild(document.createTextNode('Attribut: '));
    for (var key in obs.attributes) {
      for (var val in obs.attributes[key])      {


        //  li_element_A.appendChild(document.createTextNode(val  +': '+ obs.attributes[key][val]));




        if (val == "@id")        {
          ul_element_A = document.createElement('ul');
          li_element_A = document.createElement('li');
          li_text = obs.attributes[key][val] + ' : ' ;
        }        else if (val == "label")        {

          li_element_A.appendChild(document.createTextNode(li_text + obs.attributes[key][val]));
          ul_element_A.appendChild(li_element_A)
          li_element.appendChild(ul_element_A);
        }




      }
    }
    this.datalist_element.appendChild(li_element);
    this.element.style.display = 'block';
  },
  close: function() {
    this.element.style.display = 'none';
  },
  onCloseAction: function() {
    this.obsel.unselect();
  }
};

module.exports = ObselTypeInspector;

},{"./Widget.js":18}],9:[function(require,module,exports){
var Widget = require("./Widget.js");

/**
 * @summary Widget for visualising the current time as a date/time.
 * @class Widget for visualising the current time as a date/tim.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.Widgets.Widget
 * @see Samotraces.UI.Widgets.TimeForm
 * @description
 * Samotraces.UI.Widgets.ReadableTimeForm is a generic
 * Widget to visualise the current time.
 *
 * The time (in ms from the 01/01/1970) is converted in a
 * human readable format (as opposed to
 * {@link Samotraces.Widgets.TimeForm} widget
 * which display raw time).
 *
 * This widget observes a Samotraces.Lib.Timer object.
 * When the timer changes the new time is displayed.
 * This widget also allow to change the time of the timer.
 *
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Timer} timer
 *     Timer object to observe.
 */
var ReadableTimeForm = function(html_id, timer) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);

  this.add_class('Widget-ReadableTimeForm');

  this.timer = timer;
  this.timer.on('timer:update', this.refresh.bind(this));
  this.timer.on('timer:play:update', this.refresh.bind(this));

  this.init_DOM();
  this.refresh({data: this.timer.time});
};

ReadableTimeForm.prototype = {
  init_DOM: function() {

    var p_element = document.createElement('p');

    var text_node = document.createTextNode('Current time: ');
    p_element.appendChild(text_node);


    this.year_element = document.createElement('input');
    this.year_element.setAttribute('type', 'text');
    this.year_element.setAttribute('name', 'year');
    this.year_element.setAttribute('size', 4);
    this.year_element.setAttribute('value', '');
    p_element.appendChild(this.year_element);
    p_element.appendChild(document.createTextNode('/'));

    this.month_element = document.createElement('input');
    this.month_element.setAttribute('type', 'text');
    this.month_element.setAttribute('name', 'month');
    this.month_element.setAttribute('size', 2);
    this.month_element.setAttribute('value', '');
    p_element.appendChild(this.month_element);
    p_element.appendChild(document.createTextNode('/'));

    this.day_element = document.createElement('input');
    this.day_element.setAttribute('type', 'text');
    this.day_element.setAttribute('name', 'day');
    this.day_element.setAttribute('size', 2);
    this.day_element.setAttribute('value', '');
    p_element.appendChild(this.day_element);
    p_element.appendChild(document.createTextNode(' - '));

    this.hour_element = document.createElement('input');
    this.hour_element.setAttribute('type', 'text');
    this.hour_element.setAttribute('name', 'hour');
    this.hour_element.setAttribute('size', 2);
    this.hour_element.setAttribute('value', '');
    p_element.appendChild(this.hour_element);
    p_element.appendChild(document.createTextNode(':'));

    this.minute_element = document.createElement('input');
    this.minute_element.setAttribute('type', 'text');
    this.minute_element.setAttribute('name', 'minute');
    this.minute_element.setAttribute('size', 2);
    this.minute_element.setAttribute('value', '');
    p_element.appendChild(this.minute_element);
    p_element.appendChild(document.createTextNode(':'));

    this.second_element = document.createElement('input');
    this.second_element.setAttribute('type', 'text');
    this.second_element.setAttribute('name', 'second');
    this.second_element.setAttribute('size', 8);
    this.second_element.setAttribute('value', '');
    p_element.appendChild(this.second_element);
    /*
    		this.input_element = document.createElement('input');
    		this.input_element.setAttribute('type','text');
    		this.input_element.setAttribute('name','');
    		this.input_element.setAttribute('size',15);
    		this.input_element.setAttribute('value',this.timer.time);
    		p_element.appendChild(this.input_element);
*/
    var submit_element = document.createElement('input');
    submit_element.setAttribute('type', 'submit');
    submit_element.setAttribute('value', 'Update time');
    p_element.appendChild(submit_element);

    this.form_element = document.createElement('form');
    this.form_element.addEventListener('submit', this.build_callback('submit'));

    this.form_element.appendChild(p_element);

    this.element.appendChild(this.form_element);
  },

  refresh: function(e) {
    var time = e.data
    var date = new Date();
    date.setTime(time);
    this.year_element.value   = date.getFullYear();
    this.month_element.value  = date.getMonth() + 1;
    this.day_element.value    = date.getDate();
    this.hour_element.value   = date.getHours();
    this.minute_element.value = date.getMinutes();
    this.second_element.value = date.getSeconds() + date.getMilliseconds() / 1000;
  },

  build_callback: function(event) {
    var timer = this.timer;
    var time_form = this;
    switch (event) {
      case 'submit':
        return function(e) {
          //console.log('WidgetBasicTimeForm.submit');
          e.preventDefault();


          var date = new Date();
          date.setFullYear(time_form.year_element.value);
          date.setMonth(time_form.month_element.value - 1);
          date.setDate(time_form.day_element.value);
          date.setHours(time_form.hour_element.value);
          date.setMinutes(time_form.minute_element.value);
          date.setSeconds(time_form.second_element.value);

          timer.set(date.getTime());
          return false;
        };
      default:
        return function() {};
    }
  }

};

module.exports = ReadableTimeForm;

},{"./Widget.js":18}],10:[function(require,module,exports){
var Widget = require("./Widget.js");

/**
 * @summary Widget for visualising the current time as a number.
 * @class Widget for visualising the current time as a number.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @see Samotraces.UI.Widgets.ReadableTimeForm
 * @description
 * Samotraces.UI.Widgets.TimeForm is a generic
 * Widget to visualise the current time.
 *
 * The time is displayed as a number. See
 * {@link Samotraces.Widgets.TimeForm} to convert
 * raw time (in ms from the 01/01/1970) to a human readable
 * format.
 *
 * This widget observes a Samotraces.Lib.Timer object.
 * When the timer changes the new time is displayed.
 * This widget also allow to change the time of the timer.
 *
 * @param {String}	html_id
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Timer} timer
 *     Timer object to observe.
 */
var TimeForm = function(html_id, timer) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);

  this.timer = timer;
  this.timer.on('timer:update', this.refresh.bind(this));
  this.timer.on('timer:play:update', this.refresh.bind(this));

  this.init_DOM();
  this.refresh({data: this.timer.time});
};

TimeForm.prototype = {
  init_DOM: function() {

    var p_element = document.createElement('p');

    var text_node = document.createTextNode('Current time: ');
    p_element.appendChild(text_node);

    this.input_element = document.createElement('input');
    this.input_element.setAttribute('type', 'text');
    this.input_element.setAttribute('name', 'time');
    this.input_element.setAttribute('size', 15);
    this.input_element.setAttribute('value', this.timer.time);
    p_element.appendChild(this.input_element);

    var submit_element = document.createElement('input');
    submit_element.setAttribute('type', 'submit');
    submit_element.setAttribute('value', 'Update time');
    p_element.appendChild(submit_element);

    this.form_element = document.createElement('form');
    this.form_element.addEventListener('submit', this.build_callback('submit'));

    this.form_element.appendChild(p_element);

    this.element.appendChild(this.form_element);
  },

  refresh: function(e) {
    this.input_element.value = e.data;
  },

  build_callback: function(event) {
    var timer = this.timer;
    var input_element = this.input_element;
    switch (event) {
      case 'submit':
        return function(e) {
          //console.log('WidgetBasicTimeForm.submit');
          e.preventDefault();
          timer.set(input_element.value);
          return false;
        };
      default:
        return function() {};
    }
  }

};

module.exports = TimeForm;

},{"./Widget.js":18}],11:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");

/**
 * @summary Widget for visualising a time slider.
 * @class Widget for visualising a time slider.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.d3Basic.TimeSlider is a generic
 * Widget to visualise the current time in a temporal window
 *
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param time_window
 *     TimeWindow object -> representing the wide window
 *     (e.g., the whole trace)
 * @param timer
 *     Timeer object -> containing the current time
 */
var TimeSlider = function(html_id, time_window, timer) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);

  this.add_class('Widget-TimeSlider');
  $(window).resize(this.draw.bind(this));

  this.timer = timer;
  this.timer.on('timer:update', this.draw.bind(this));
  this.timer.on('timer:play:update', this.refresh.bind(this));

  this.time_window = time_window;
  this.time_window.on('tw:update', this.draw.bind(this));

  // update slider style
  this.slider_offset = 0;

  this.init_DOM();
  // update slider's position
  this.draw();

};

TimeSlider.prototype = {
  init_DOM: function() {
    // create the slider
    this.slider_element = document.createElement('div');
    this.element.appendChild(this.slider_element);

    // hand made drag&drop
    var widget = this;
    this.add_behaviour('changeTimeOnDrag', this.slider_element, {
      onUpCallback: function(delta_x) {
        var new_time = widget.timer.time + delta_x * widget.time_window.get_width() / widget.element.clientWidth;
        widget.timer.set(new_time);
      },
      onMoveCallback: function(offset) {
        var offset = widget.slider_offset + offset;
        widget.slider_element.setAttribute('style', 'left: ' + offset + 'px;');
      },
    });
  },

  draw: function() {
    this.slider_offset = (this.timer.time - this.time_window.start) * this.element.clientWidth / this.time_window.get_width();
    this.slider_element.setAttribute('style', 'left:' + this.slider_offset + 'px; display: block;');
  },

};

module.exports = TimeSlider;

},{"./Widget.js":18,"jquery":"jquery"}],12:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");
var d3 = require("d3");

/**
 * @summary Widget for visualising a trace where obsels are displayed as images.
 * @class Widget for visualising a trace where obsels are displayed as images
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * The {@link Samotraces.UI.Widgets.TraceDisplayIcons|TraceDisplayIcons} widget
 * is a generic
 * Widget to visualise traces with images. This widget uses
 * d3.js to display traces as images in a SVG image.
 * The default settings are set up to visualise 16x16 pixels
 * icons. If no url is defined (see options), a questionmark
 * icon will be displayed by default for each obsel.
 *
 * Note that clicking on an obsel will trigger a
 * {@link Samotraces.UI.Widgets.TraceDisplayIcons#ui:click:obsel|ui:click:obsel}
 * event.
 *
 * Tutorials {@tutorial tuto1.1_trace_visualisation},
 * {@tutorial tuto1.2_adding_widgets}, and
 * {@tutorial tuto1.3_visualisation_personalisation} illustrates
 * in more details how to use this class.
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Trace}	trace
 *     Trace object to display
 * @param {TimeWindow} time_window
 *     TimeWindow object that defines the time frame
 *     being currently displayed.
 *
 * @param {VisuConfig} [options]
 *     Object determining how to display the icons
 *     (Optional). All the options field can be either
 *     a value or a function that will be called by
 *     d3.js. The function will receive as the first
 *     argument the Obsel to display and should return
 *     the calculated value.
 *     If a function is defined as an argument, it will
 *     be binded to the TraceDisplayIcons instance.
 *     This means that you can call any method of the
 *     TraceDisplayIcons instance to help calculate
 *     the x position or y position of an icon. This
 *     makes it easy to define various types of behaviours.
 *     Relevant methods to use are:
 *     link Samotraces.UI.Widgets.TraceDisplayIcons.calculate_x}
 *     See tutorial
 *     {@tutorial tuto1.3_visualisation_personalisation}
 *     for more details and examples.
 *
 * @example
 * var options = {
 *     y: 20,
 *     width: 32,
 *     height: 32,
 *     url: function(obsel) {
 *         switch(obsel.type) {
 *             case 'click':
 *                 return 'images/click.png';
 *             case 'focus':
 *                 return 'images/focus.png';
 *             default:
 *                 return 'images/default.png';
 *         }
 *     }
 * };
 */
var TraceDisplayIcons = function(divId, trace, time_window, options) {

  options = options || {};

  // WidgetBasicTimeForm is a Widget
  Widget.call(this, divId);

  this.add_class('Widget-TraceDisplayIcons');
  $(window).resize(this.refresh_x.bind(this));

  this.trace = trace;
  this.trace.on('trace:update', this.draw.bind(this));
  this.trace.on('trace:create_obsel', this.draw.bind(this));
  this.trace.on('trace:remove_obsel', this.draw.bind(this));
  this.trace.on('trace:edit_obsel', this.obsel_redraw.bind(this));

  this.window = time_window;
  this.window.on('tw:update', this.refresh_x.bind(this));
  this.window.on('tw:translate', this.translate_x.bind(this));

  //	this.obsel_selector = obsel_selector;
  //	this.window.addEventListener('',this..bind(this));

  this.init_DOM();
  this.data = this.trace.list_obsels();


  /**
  	 * VisuConfig is a shortname for the
  	 * {@link Samotraces.UI.Widgets.TraceDisplayIcons.VisuConfig}
  	 * object.
  	 * @typedef VisuConfig
  	 * @see Samotraces.UI.Widgets.TraceDisplayIcons.VisuConfig
  	 */
  /**
  	 * @typedef Samotraces.UI.Widgets.TraceDisplayIcons.VisuConfig
  	 * @property {(number|function)}	[x]
  	 *     X coordinates of the top-left corner of the
  	 *     image (default: <code>function(o) {
  	 *         return this.calculate_x(o.timestamp) - 8;
  	 *     })</code>)
  	 * @property {(number|function)}	[y=17]
  	 *     Y coordinates of the top-left corner of the
  	 *     image
  	 * @property {(number|function)}	[width=16]
  	 *     Width of the image
  	 * @property {(number|function)}	[height=16]
  	 *     Height of the image
  	 * @property {(string|function)}	[url=a questionmark dataurl string]
  	 *     Url of the image to display
  	 * @description
  	 * Object determining how to display the icons
  	 * (Optional). All the options field can be either
  	 * a value or a function that will be called by
  	 * d3.js. The function will receive as the first
  	 * argument the Obsel to display and should return
  	 * the calculated value.
  	 * If a function is defined as an argument, it will
  	 * be binded to the TraceDisplayIcons instance.
  	 * This means that you can call any method of the
  	 * TraceDisplayIcons instance to help calculate
  	 * the x position or y position of an icon. This
  	 * makes it easy to define various types of behaviours.
  	 * Relevant methods to use are:
  	 * link Samotraces.UI.Widgets.TraceDisplayIcons.calculate_x}
  	 * See tutorial
  	 * {@tutorial tuto1.3_visualisation_personalisation}
  	 * for more details and examples.
  	 */
  // create function that returns value or function
  var this_widget = this;
  var bind_function = function(val_or_fun) {
    if (val_or_fun instanceof Function) {
      return val_or_fun.bind(this_widget);
    } else {
      return val_or_fun;
    }
  };

  this.options = {};
  this.options.x = bind_function(options.x || function(o) {
    return this.calculate_x(o.get_begin()) - 8;
  });
  this.stylesheet = options ;
  //this.options.y = bind_function(options.y || 17);
  //this.options.width = bind_function(options.width || 16);
  //this.options.height = bind_function(options.height || 16);
  //this.options.url = bind_function(options.url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG7AAABuwBHnU4NQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKsSURBVDiNrZNLaFNpFMd/33fvTa5tYpuq0yatFWugRhEXw9AuhJEZBCkiqJWCIErrxp241C6L6650M/WBowunoyCDCjKrGYZ0IbiwxkdUbGyaPmgSm8d9f25MbXUlzH95zv/8OOdwjlBKsVajU1kEtJiavNBsaKcBqq5/3fKDSwrKY33JdX7RAIxOZQGM3bHIymCyPZhZqT8p2d4sQGtY7+yObvhxMjsvp4uVKOA2QEIpxehUFl2IvuFUZ3rZcu/+9X7RWqg7Jxw/QAFhTdLRFJoY6N4SazONo1czs/2eUlNjfUn0Risne+Pp9yv18TvZwrl9iVb2J2JEQhoKKNke6UJ55LfMB4aSHeMne+Ppay/yAkBcTL9ma7Np7Yu3/n1lOjdQ8wLO793GzlgzFdcjYujoUpAt17j8LIfjB5zdvfXBv3OlX3NVy5SAOJVKhP94M29UXB8FFGoWE89nufTkHQ9nFlEKejZuoLe1iYrr8+fbee9UKhEGhB6SYrBoudPLtnsAQCnF768Kq1v2AxAC6l7AsuUCsGS5h4uWOx2SYlBqQoyUHW/O9gO+1i9dbfyciKGA/wol3pTrANh+QNnx5jQhRuQ3VZ+1Z1OUg92biZkG/+SL3Hu7gPfVzQBIX6mJlpAeD2vrWds3mth+wOtSlUczS1RdfzUX1iQtIT3uKzWhO4GajJnGnc2mcf+j4x1umJ4uVShUbRSwUHPWwdvCxuOYaRxwAjUpAXUjk7eP9bTrEUNbNf30Q5ThXV0c6WknGvoSjxgax3e0uzcyeRtQcqwvSa5qmaYuB4aSHeMNiEJgahJ9zWQRQ2Mo2TFu6nIgV7XMdZd48+Vc/3CqM30m1XX3wcxi8d3H2sitl3mUACkEyZam24e2bTHbTOPc1cxsf6Pu/3mmtfred/4ESQNKXG8VACoAAAAASUVORK5CYII=');

  this.draw();
};

TraceDisplayIcons.prototype = {
  init_DOM: function() {


    //var div_elmt = d3.select('#'+this.id);
    var div_elmt = d3.select(this.element);
    this.svg = div_elmt.append('svg');

    // create the (red) line representing current time
    if (typeof (this.window.timer) !== "undefined") {
      this.svg.append('line')
      .attr('x1', '50%')
      .attr('y1', '0%')
      .attr('x2', '50%')
      .attr('y2', '100%')
      .attr('stroke-width', '1px')
      .attr('stroke', 'red')
      .attr('opacity', '0.3');
    }

    this.scale_x = this.element.clientWidth / this.window.get_width();
    this.translate_offset = 0;

    this.svg_gp = this.svg.append('g')
    .attr('transform', 'translate(0,0)');
    this.svg_selected_obsel = this.svg.append('line')
    .attr('x1', '0')
    .attr('y1', '0%')
    .attr('x2', '0')
    .attr('y2', '100%')
    .attr('stroke-width', '1px')
    .attr('stroke', 'black')
    .attr('opacity', '0.3')
    .attr('transform', 'translate(0,0)')
    .style('display', 'none');

    // event listeners
    var widget = this;
    this.add_behaviour('changeTimeOnDrag', this.element, {
      onUpCallback: function(delta_x) {
        var time_delta = -delta_x * widget.window.get_width() / widget.element.clientWidth;
        widget.svg_gp.attr('transform', 'translate(' + (-widget.translate_offset) + ',0)');
        widget.window.translate(time_delta);
      },
      onMoveCallback: function(offset) {
        widget.svg_gp.attr('transform', 'translate(' + (offset - widget.translate_offset) + ',0)');
      },
    });
    this.add_behaviour('zommOnScroll', this.element, {timeWindow: this.window});
  },


  // TODO: needs to be named following a convention
  // to be decided on
  /**
  	 * Calculates the X position in pixels corresponding to
  	 * the time given in parameter.
  	 * @param {Number} time Time for which to seek the corresponding x parameter
  	 */
  calculate_x: function(time) {

    var x = (time - this.window.start) * this.scale_x + this.translate_offset;
    return x;
  },
  translate_x: function(e) {
    var time_delta = e.data;
    this.translate_offset += time_delta * this.scale_x;
    this.svg_gp
    .attr('transform', 'translate(' + (-this.translate_offset) + ',0)');
  },

  refresh_x: function() {
    this.scale_x = this.element.clientWidth / this.window.get_width();
    this.translate_offset = 0;
    this.svg_gp
    .attr('transform', 'translate(0,0)');
    this.d3Obsels()
    .attr('x', this.options.x)
    .attr('y', this.options.y);
  },

  draw: function(e) {
    if (e) {
      switch (e.type) {
        case "trace:update":
          this.data = this.trace.list_obsels();
          break;
        default:
          this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
          break;
      }
    }

    var that = this;
    var getIconPath = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].icon;
      } else {
        return self.stylesheet.default.icon;
      }
    }

    var getWidth = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].width;
      } else {
        return self.stylesheet.default.width;
      }
    }

    var getHeight = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].height;
      } else {
        return self.stylesheet.default.height;
      }
    }

    var getY = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].y;
      } else {
        return self.stylesheet.default.y;
      }
    }
    this.d3Obsels()
    .exit()
    .remove();
    this.d3Obsels()
    .enter()
    .append('image')
    .attr('class', 'Samotraces-obsel')
    .attr('x', this.options.x)
    .attr('y', getY)
    .attr('width', getWidth)
    .attr('height', getHeight)
    //.attr('xlink:href', this.options.url);
    .attr('xlink:href', getIconPath);
    // Storing obsel data with jQuery for accessibility from
    // events defined by users with jQuery
    $('image', this.element).each(function(i, el) {
      $.data(el, {
        'Samotraces-type': 'obsel',
        'Samotraces-data': d3.select(el).datum()
      });
    });
  },

  obsel_redraw: function(e) {
    var obs = e.data;
    var sel = this.d3Obsels()
			.filter(function(o) {
  //				console.log('data:id,obsel_edit_id',id,obs.get_id(),id == obs.get_id());
  return o.get_id() == obs.get_id();
			})
			.datum(obs)
			.attr('x', this.options.x)
			.attr('y', this.options.y)
			.attr('width', this.options.width)
			.attr('height', this.options.height)
			.attr('xlink:href', this.options.url);
  },

  d3Obsels: function() {
    return this.svg_gp
    .selectAll('circle,image,rect')
    // TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
    //.data(this.data); //,function(d) { return d.id;});
    .data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
  },


};

module.exports = TraceDisplayIcons;

},{"./Widget.js":18,"d3":"d3","jquery":"jquery"}],13:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");
var d3 = require("d3");

var TraceDisplayIconsFix = function(divId, traceINITIA, time_window, time_window_Zoom, options) {
  "use strict";
  options = options || {};
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, divId);
  this.add_class('Widget-TraceDisplayIcons');
  $(window).resize(this.refresh_x.bind(this));
  this.trace = traceINITIA;
  this.trace.on('trace:update', this.draw.bind(this));
  this.trace.on('trace:create_obsel', this.draw.bind(this));
  this.window = time_window;
  this.windowZoom = time_window_Zoom;
  //this.window.on('tw:update',this.refresh_x.bind(this));
  //this.window.on('tw:translate',this.translate_x.bind(this));
  this.init_DOM();
  this.data = this.trace.obsel_list;
  var this_widget = this;
  var bind_function = function(val_or_fun) {
    if (val_or_fun instanceof Function) {
      return val_or_fun.bind(this_widget);
    } else {
      return val_or_fun;
    }
  };

/*  this.options.y = bind_function(options.y || 17);
  this.options.width = bind_function(options.width || 16);
  this.options.height = bind_function(options.height || 16);
  this.options.url = bind_function(options.url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG7AAABuwBHnU4NQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKsSURBVDiNrZNLaFNpFMd/33fvTa5tYpuq0yatFWugRhEXw9AuhJEZBCkiqJWCIErrxp241C6L6650M/WBowunoyCDCjKrGYZ0IbiwxkdUbGyaPmgSm8d9f25MbXUlzH95zv/8OOdwjlBKsVajU1kEtJiavNBsaKcBqq5/3fKDSwrKY33JdX7RAIxOZQGM3bHIymCyPZhZqT8p2d4sQGtY7+yObvhxMjsvp4uVKOA2QEIpxehUFl2IvuFUZ3rZcu/+9X7RWqg7Jxw/QAFhTdLRFJoY6N4SazONo1czs/2eUlNjfUn0Risne+Pp9yv18TvZwrl9iVb2J2JEQhoKKNke6UJ55LfMB4aSHeMne+Ppay/yAkBcTL9ma7Np7Yu3/n1lOjdQ8wLO793GzlgzFdcjYujoUpAt17j8LIfjB5zdvfXBv3OlX3NVy5SAOJVKhP94M29UXB8FFGoWE89nufTkHQ9nFlEKejZuoLe1iYrr8+fbee9UKhEGhB6SYrBoudPLtnsAQCnF768Kq1v2AxAC6l7AsuUCsGS5h4uWOx2SYlBqQoyUHW/O9gO+1i9dbfyciKGA/wol3pTrANh+QNnx5jQhRuQ3VZ+1Z1OUg92biZkG/+SL3Hu7gPfVzQBIX6mJlpAeD2vrWds3mth+wOtSlUczS1RdfzUX1iQtIT3uKzWhO4GajJnGnc2mcf+j4x1umJ4uVShUbRSwUHPWwdvCxuOYaRxwAjUpAXUjk7eP9bTrEUNbNf30Q5ThXV0c6WknGvoSjxgax3e0uzcyeRtQcqwvSa5qmaYuB4aSHeMNiEJgahJ9zWQRQ2Mo2TFu6nIgV7XMdZd48+Vc/3CqM30m1XX3wcxi8d3H2sitl3mUACkEyZam24e2bTHbTOPc1cxsf6Pu/3mmtfred/4ESQNKXG8VACoAAAAASUVORK5CYII=');
  */

  this.options = {};
  this.options.x = bind_function(options.x || function(o) {
    return this.calculate_x(o.get_begin()) - 8;
  });
  this.stylesheet = options ;
  this.draw();
};

TraceDisplayIconsFix.prototype = {
  init_DOM: function() {
    "use strict";
    var div_elmt = d3.select(this.element);
    this.svg = div_elmt.append('svg');

    // create the (red) line representing current time
    if (typeof (this.window.timer) !== "undefined") {
      this.svg.append('line')
      .attr('x1', '50%')
      .attr('y1', '0%')
      .attr('x2', '50%')
      .attr('y2', '100%')
      .attr('stroke-width', '1px')
      .attr('stroke', 'red')
      .attr('opacity', '0.3');
    }

    this.scale_x = this.element.clientWidth / this.window.get_width();
    this.translate_offset = 0;
    var x = d3.time.scale() // jshint ignore:line
      // .domain([new Date(2014, 4, 1), new Date(2014, 4, 15) - 1])
      .domain([this.window.start, this.window.end])
      .range([0, this.element.clientWidth]);
    this.svg_gp = this.svg.append('g')
      .attr('transform', 'translate(0,0)');
    this.svg_selected_obsel = this.svg.append('line')
      .attr('x1', '0')
      .attr('y1', '0%')
      .attr('x2', '0')
      .attr('y2', '100%')
      .attr('stroke-width', '1px')
      .attr('stroke', 'black')
      .attr('opacity', '0.3')
      .attr('transform', 'translate(0,0)')
      .style('display', 'none');
    this.addbrush();
  },
  d3Obsels: function() {
    "use strict";
    return this.svg_gp
      .selectAll('circle,image,rect')
      // TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
      //.data(this.data); //,function(d) { return d.id;});
      .data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
  },
  calculate_x: function(time) {
    "use strict";
    return (time - this.window.start) * this.scale_x + this.translate_offset;
  },
  translate_x: function(e) {
    "use strict";
    console.log ("translate");
    var time_delta = e.data;
    this.translate_offset += time_delta * this.scale_x;
    this.svg_gp
    .attr('transform', 'translate(' + (-this.translate_offset) + ',0)');
  },
  addbrush: function() {
    "use strict";
    var margin = {top: 200, right: 40, bottom: 200, left: 40},
      height = 500 - margin.top - margin.bottom;
    var x = d3.time.scale()
    .domain([this.window.start, this.window.end])
    .range([0, this.element.clientWidth]);

    var brushended = function() {
      var extend0 = widget.brushP.extent();
      widget.windowZoom.set_start (new Date(extend0[0]).getTime());
      widget.windowZoom.set_end (new Date(extend0[1]).getTime());
    };

    var brush = d3.svg.brush()
      .x(x)
      .on("brushend", brushended);
    this.brushP = brush;
    this.gBrush = this.svg.append("g")
      .attr("class", "brush")
      .attr('id', 'brush')
      .call(brush)
      .attr("width", "1840");
    this.gBrush.selectAll("rect")
      .attr("height", height);
    var widget = this;
  },
  draw: function(e) {
    "use strict";
    if (e) {
      switch (e.type) {
        case "trace:update":
        this.data = this.trace.list_obsels();

        //this.data = this.trace.list_obsels(this.window.start,this.window.end);
        break;
        default:
        this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
        break;
      }
    }
    var that = this;
    var getIconPath = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].icon;
      } else {
        return self.stylesheet.default.icon;
      }
    }
    var getWidth = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].width;
      } else {
        return self.stylesheet.default.width;
      }
    }

    var getHeight = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].height;
      } else {
        return self.stylesheet.default.height;
      }
    }

    var getY = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].y;
      } else {
        return self.stylesheet.default.y;
      }
    }

    this.d3Obsels()
      .exit()
      .remove();
      this.d3Obsels()
      .enter()
      .append('image')
      .attr('class', 'Samotraces-obsel')
      .attr('x', this.options.x)
      .attr('y', getY)
      .attr('width', getWidth)
      .attr('height', getHeight)
      .attr('xlink:href', getIconPath);
    // Storing obsel data with jQuery for accessibility from
    // events defined by users with jQuery
    $('image', this.element).each(function(i, el) {
      $.data(el, {
        'Samotraces-type': 'obsel',
        'Samotraces-data': d3.select(el).datum()
      });
    });

  },
  refresh_x: function() {
    "use strict";
    this.scale_x = this.element.clientWidth / this.window.get_width();
    this.translate_offset = 0;
    this.svg_gp.attr('transform', 'translate(0,0)');
    this.d3Obsels()
      .attr('x', this.options.x)
      .attr('y', this.options.y);

    var f = this.element.getElementsByClassName("brush");
    f.parentNode.removeChild(f);
    this.addbrush();
  },
};

module.exports = TraceDisplayIconsFix;

},{"./Widget.js":18,"d3":"d3","jquery":"jquery"}],14:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");
var d3 = require("d3");

var TraceDisplayIconsZoom = function(divId, trace, time_window, options) {
  options = options || {};
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, divId);
  this.add_class('Widget-TraceDisplayIcons');
  //$(window).resize(this.refresh_x.bind(this));
  this.trace = trace;
  this.trace.on('trace:update', this.draw.bind(this));
  this.trace.on('trace:create_obsel', this.draw.bind(this));
  this.window = time_window;
  this.window.on('tw:update', this.refresh_x.bind(this));
  //this.window.on('tw:translate',this.translate_x.bind(this));
  this.init_DOM();
  // this.data = this.trace.list_obsels(time_window.start,time_window.end);
  this.data = this.trace.obsel_list;
  var this_widget = this;
  var bind_function = function(val_or_fun) {
    if (val_or_fun instanceof Function) {
      return val_or_fun.bind(this_widget);
    } else {
      return val_or_fun;
    }
  };
  /*this.options.x = bind_function(options.x || function(o) {
    return this.calculate_x(o.get_begin()) - 8;
  });
  this.options.y = bind_function(options.y || 17);
  this.options.width = bind_function(options.width || 16);
  this.options.height = bind_function(options.height || 16);
  this.options.url = bind_function(options.url || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAG7AAABuwBHnU4NQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKsSURBVDiNrZNLaFNpFMd/33fvTa5tYpuq0yatFWugRhEXw9AuhJEZBCkiqJWCIErrxp241C6L6650M/WBowunoyCDCjKrGYZ0IbiwxkdUbGyaPmgSm8d9f25MbXUlzH95zv/8OOdwjlBKsVajU1kEtJiavNBsaKcBqq5/3fKDSwrKY33JdX7RAIxOZQGM3bHIymCyPZhZqT8p2d4sQGtY7+yObvhxMjsvp4uVKOA2QEIpxehUFl2IvuFUZ3rZcu/+9X7RWqg7Jxw/QAFhTdLRFJoY6N4SazONo1czs/2eUlNjfUn0Risne+Pp9yv18TvZwrl9iVb2J2JEQhoKKNke6UJ55LfMB4aSHeMne+Ppay/yAkBcTL9ma7Np7Yu3/n1lOjdQ8wLO793GzlgzFdcjYujoUpAt17j8LIfjB5zdvfXBv3OlX3NVy5SAOJVKhP94M29UXB8FFGoWE89nufTkHQ9nFlEKejZuoLe1iYrr8+fbee9UKhEGhB6SYrBoudPLtnsAQCnF768Kq1v2AxAC6l7AsuUCsGS5h4uWOx2SYlBqQoyUHW/O9gO+1i9dbfyciKGA/wol3pTrANh+QNnx5jQhRuQ3VZ+1Z1OUg92biZkG/+SL3Hu7gPfVzQBIX6mJlpAeD2vrWds3mth+wOtSlUczS1RdfzUX1iQtIT3uKzWhO4GajJnGnc2mcf+j4x1umJ4uVShUbRSwUHPWwdvCxuOYaRxwAjUpAXUjk7eP9bTrEUNbNf30Q5ThXV0c6WknGvoSjxgax3e0uzcyeRtQcqwvSa5qmaYuB4aSHeMNiEJgahJ9zWQRQ2Mo2TFu6nIgV7XMdZd48+Vc/3CqM30m1XX3wcxi8d3H2sitl3mUACkEyZam24e2bTHbTOPc1cxsf6Pu/3mmtfred/4ESQNKXG8VACoAAAAASUVORK5CYII=');

  */
  this.options = {};
  this.options.x = bind_function(options.x || function(o) {
    return this.calculate_x(o.get_begin()) - 8;
  });
  this.stylesheet = options ;
  this.draw();
	};

TraceDisplayIconsZoom.prototype = {
  init_DOM: function() {

    var div_elmt = d3.select(this.element);
    this.svg = div_elmt.append('svg');

    // create the (red) line representing current time
    if (typeof (this.window.timer) !== "undefined") {
      this.svg.append('line')
      .attr('x1', '50%')
      .attr('y1', '0%')
      .attr('x2', '50%')
      .attr('y2', '100%')
      .attr('stroke-width', '1px')
      .attr('stroke', 'red')
      .attr('opacity', '0.3');
    }

    this.scale_x = this.element.clientWidth / this.window.get_width();
    this.translate_offset = 0;
    var x = d3.time.scale()
// .domain([new Date(2014, 4, 1), new Date(2014, 4, 15) - 1])
.domain([this.window.start, this.window.end])
.range([0, this.element.clientWidth]);
    var margin = {top: 200, right: 40, bottom: 200, left: 40},
     height = 500 - margin.top - margin.bottom;
    this.svg_gp = this.svg.append('g')
						.attr('transform', 'translate(0,0)');
    this.svg_selected_obsel = this.svg.append('line')
    .attr('x1', '0')
    .attr('y1', '0%')
    .attr('x2', '0')
    .attr('y2', '100%')
    .attr('stroke-width', '1px')
    .attr('stroke', 'black')
    .attr('opacity', '0.3')
    .attr('transform', 'translate(0,0)')
    .style('display', 'none');

  },
  d3Obsels: function() {
    return this.svg_gp
    .selectAll('circle,image,rect')
    // TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
    //.data(this.data); //,function(d) { return d.id;});
    .data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
  },
  calculate_x: function(time) {
    var x = (time - this.window.start) * this.scale_x + this.translate_offset;
    return x;
  },

  draw: function(e) {

    if (e) {
      switch (e.type) {
        case "trace:update":
          this.data = this.trace.list_obsels();

          //this.data = this.trace.list_obsels(this.window.start,this.window.end);
          break;
        default:
          this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
          break;
      }
    }
    var that = this;
    var getIconPath = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].icon;
      } else {
        return self.stylesheet.default.icon;
      }
    }
    var getWidth = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].width;
      } else {
        return self.stylesheet.default.width;
      }
    }

    var getHeight = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].height;
      } else {
        return self.stylesheet.default.height;
      }
    }

    var getY = function () {
      // ``self```is the widget instance
      var self = that;

      // ``this`` is the DOM element where d3 is setting things

      var type = this.__data__.type;
      if (self.stylesheet[type]) {
        return self.stylesheet[type].y;
      } else {
        return self.stylesheet.default.y;
      }
    }

    this.d3Obsels()
    .exit()
    .remove();
    this.d3Obsels()
    .enter()
    .append('image')
    .attr('class', 'Samotraces-obsel')
    .attr('x', this.options.x)
    .attr('y', getY)
    .attr('width', getWidth)
    .attr('height', getHeight)
    .attr('xlink:href', getIconPath);
    // Storing obsel data with jQuery for accessibility from
    // events defined by users with jQuery
    $('image', this.element).each(function(i, el) {
      $.data(el, {
        'Samotraces-type': 'obsel',
        'Samotraces-data': d3.select(el).datum()
      });
    });

  },
  refresh_x: function() {

    this.scale_x = this.element.clientWidth / this.window.get_width();
    this.translate_offset = 0;
    this.svg_gp
    .attr('transform', 'translate(0,0)');
    this.d3Obsels()
    .attr('x', this.options.x)
    .attr('y', this.options.y);
  },
		};

module.exports = TraceDisplayIconsZoom;

},{"./Widget.js":18,"d3":"d3","jquery":"jquery"}],15:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");
var d3 = require("d3");

/**
 * @summary Widget for visualising a trace.
 * @class Widget for visualising a trace.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * DESCRIPTION TO COME....
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Trace}	trace
 *     Trace object to display
 * @param {Samotraces.TimeWindow} time_window
 *     TimeWindow object that defines the time frame
 *     being currently displayed.
 * @todo add description and update doc...
 */
var TraceDisplayObselOccurrences = function(divId, trace, time_window) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, divId);

  this.add_class('Widget-ObselOccurrences');
  //this.add_class('Widget-TraceDisplayObselOccurrences');
  $(window).resize(this.refresh_x.bind(this));

  this.trace = trace;
  this.trace.on('trace:update', this.draw.bind(this));
  this.trace.on('trace:create_obsel', this.draw.bind(this));
  this.trace.on('trace:remove_obsel', this.draw.bind(this));
  this.trace.on('trace:edit_obsel', this.obsel_redraw.bind(this));

  this.window = time_window;
  this.window.on('tw:update', this.refresh_x.bind(this));
  this.window.on('tw:translate', this.translate_x.bind(this));

  //	this.obsel_selector = obsel_selector;
  //	this.window.addEventListener('',this..bind(this));

  this.init_DOM();
  this.data = this.trace.list_obsels();

  // create function that returns value or function
  var this_widget = this;

  this.draw();
};

TraceDisplayObselOccurrences.prototype = {
  init_DOM: function() {


    var div_elmt = d3.select('#' + this.id);
    this.svg = div_elmt.append('svg')
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("version", "1.1");


    this.scale_x = this.element.clientWidth / this.window.get_width();
    this.translate_offset = 0;

    this.svg_gp = this.svg.append('g')
    .attr('transform', 'translate(0,0)');

    // event listeners
    var widget = this;
    this.add_behaviour('changeTimeOnDrag', this.element, {
      onUpCallback: function(delta_x) {
        var time_delta = -delta_x * widget.window.get_width() / widget.element.clientWidth;
        widget.svg_gp.attr('transform', 'translate(' + (-widget.translate_offset) + ',0)');
        widget.window.translate(time_delta);
      },
      onMoveCallback: function(offset) {
        widget.svg_gp.attr('transform', 'translate(' + (offset - widget.translate_offset) + ',0)');
      },
    });
    this.add_behaviour('zommOnScroll', this.element, {timeWindow: this.window});
  },


  // TODO: needs to be named following a convention
  // to be decided on
  /**
  	 * Calculates the X position in pixels corresponding to
  	 * the time given in parameter.
  	 * @param {Number} time Time for which to seek the corresponding x parameter
  	 */
  calculate_x: function(o) {
    var x = (o.get_begin() - this.window.start) * this.scale_x + this.translate_offset;
    return x

  },
  calculate_width: function(o) {
    var x = Math.max(0.01, (o.get_end() - o.get_begin()) * this.scale_x); // width of 0 => not displayed
    return x
  },
  translate_x: function(e) {
    var time_delta = e.data;
    this.translate_offset += time_delta * this.scale_x;
    this.svg_gp
    .attr('transform', 'translate(' + (-this.translate_offset) + ',0)');
  },

  refresh_x: function() {
    this.scale_x = this.element.clientWidth / this.window.get_width();
    this.translate_offset = 0;
    this.svg_gp
    .attr('transform', 'translate(0,0)');
    this.d3Obsels()
    .attr('x', this.calculate_x.bind(this))
    .attr('width', this.calculate_width.bind(this))
  },

  draw: function(e) {
    if (e) {
      switch (e.type) {
        case "trace:update":
          this.data = this.trace.list_obsels();
          break;
        default:
          this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
          break;
      }
    }

    this.d3Obsels()
    .exit()
    .remove();
    this.d3Obsels()
    .enter()
    .append('rect')
    //.attr('class','Samotraces-obsel')
    .attr('x', this.calculate_x.bind(this))
    .attr('y', '0')
    .attr('width', this.calculate_width.bind(this))
    .attr('height', '20');
    //.attr('stroke-width','1px')
    //.attr('stroke','black');
    // Storing obsel data with jQuery for accessibility from
    // events defined by users with jQuery
    $('rect', this.element).each(function(i, el) {
      $.data(el, {
        'Samotraces-type': 'obsel',
        'Samotraces-data': d3.select(el).datum()
      });
    });
  },

  obsel_redraw: function(e) {
    var obs = e.data;
    var sel = this.d3Obsels()
			.filter(function(o) {
  //				console.log('data:id,obsel_edit_id',id,obs.get_id(),id == obs.get_id());
  return o.get_id() == obs.get_id();
			})
			.datum(obs)
			.attr('x', this.calculate_x.bind(this))
			.attr('width', this.calculate_width.bind(this))
			.attr('xlink:href', this.options.url);
  },

  d3Obsels: function() {
    return this.svg_gp
    .selectAll('circle,image,rect')
    // TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
    //.data(this.data); //,function(d) { return d.id;});
    .data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
  },


};

module.exports = TraceDisplayObselOccurrences;

},{"./Widget.js":18,"d3":"d3","jquery":"jquery"}],16:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");

var TraceDisplayText = function(divId, trace, timeWindow) {
  "use strict";
  Widget.call(this, divId);
  this.divId = divId;
  this.add_class("Widget-TraceDisplayText");
  this.trace = trace;
  this.trace.on("trace:updateT", this.refreshX.bind(this));
  this.trace.on("trace:create_obsel_Text", this.draw.bind(this));
  this.window = timeWindow;
  this.window.on("tw:update", this.refreshX.bind(this));
  this.window.on("ChangeLangage", this.refreshX.bind(this));
  this.refreshX();
  this.dataOb = [];
};

TraceDisplayText.prototype = {
  draw: function(e) {
    "use strict";
    this.dataOb.push(JSON.stringify(e.data));
    //this.dataOb = JSON.stringify (e.data);
    // Assist.ViewTrace.addObselVisu(e.data, this.divId); // TODO what is Assist ?
    $("#" + e.data["@id"]).hide();
  },
  refreshX: function() {
    "use strict";
    var timeWindow = this.window;
    this.trace.obsel_list.forEach(function(o) {
      if (timeWindow.start <= o.get_begin() && o.get_begin() <= timeWindow.end) {
        $("#" + o.get_id()).show();
      } else {
        $("#" + o.get_id()).hide();
      }
    });
  },
  redraw: function() {
    "use strict";
    document.getElementById(this.divId).innerHTML = "";
    this.dataOb.forEach(function(o) {
      // Assist.ViewTrace.addObselVisu(JSON.parse(o), widj.divId); // TODO what is Assist ?
      $("#" + JSON.parse(o)["@id"]).hide();
    });
    this.refreshX();
  },
};

module.exports = TraceDisplayText;

},{"./Widget.js":18,"jquery":"jquery"}],17:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");
var d3 = require("d3");

/**
 * @summary Widget for visualising a trace.
 * @class Widget for visualising a trace.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * DESCRIPTION TO COME....
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {Samotraces.Trace}	trace
 *     Trace object to display
 * @param {Samotraces.TimeWindow} time_window
 *     TimeWindow object that defines the time frame
 *     being currently displayed.
 * @todo add description and update doc...
 */
var TraceDisplayZoomContext = function(divId, trace, time_window1, time_window2, options1, options2) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, divId);

  this.mode = 'window_sync';
  if (options1 !== undefined || options2 !== undefined) {
    this.mode = 'obsel_sync';
    if (options1 !== undefined && options1.hasOwnProperty('x')) {
      this.x1 = options1.x.bind(this);
    }
    if (options2 !== undefined && options2.hasOwnProperty('x')) {
      this.x2 = options2.x.bind(this);
    }
  }

  this.add_class('Widget-ObselOccurrences');
  //this.add_class('Widget-TraceDisplayObselOccurrences');
  $(window).resize(this.refresh_x.bind(this));

  this.trace = trace;
  this.trace.on('trace:update', this.draw.bind(this));
  this.trace.on('trace:create_obsel', this.draw.bind(this));
  this.trace.on('trace:remove_obsel', this.draw.bind(this));
  this.trace.on('trace:edit_obsel', this.obsel_redraw.bind(this));

  this.window1 = time_window1;
  this.window1.on('tw:update', this.refresh_x.bind(this));
  this.window1.on('tw:translate', this.refresh_x.bind(this));

  this.window2 = time_window2;
  this.window2.on('tw:update', this.refresh_x.bind(this));
  this.window2.on('tw:translate', this.refresh_x.bind(this));

  //	this.obsel_selector = obsel_selector;
  //	this.window1.addEventListener('',this..bind(this));

  this.init_DOM();
  this.data = this.trace.list_obsels();

  // create function that returns value or function
  var this_widget = this;

  this.draw();
};

TraceDisplayZoomContext.prototype = {
  init_DOM: function() {


    var div_elmt = d3.select('#' + this.id);
    this.svg = div_elmt.append('svg')
    .attr("xmlns", "http://www.w3.org/2000/svg")
    .attr("version", "1.1");


    this.scale_x1 = this.element.clientWidth / this.window1.get_width();
    this.scale_x2 = this.element.clientWidth / this.window2.get_width();
    this.translate_offset = 0;

    this.sync_path = this.svg.append('path')
    .attr('style', 'stroke:grey;stroke-width:1px;fill:#ddd;');
    this.svg_gp = this.svg.append('g')
    .attr('transform', 'translate(0,0)');

  },


  // TODO: needs to be named following a convention
  // to be decided on
  /**
  	 * Calculates the X position in pixels corresponding to
  	 * the time given in parameter.
  	 * @param {Number} time Time for which to seek the corresponding x parameter
  	 */
  calculate_x: function(t) {
    var x = (t - this.w_start) * this.scale_x;
    return x ;
  },
  o2x1: function(o) {
    this.w_start = this.window1.start;
    this.scale_x = this.scale_x1;
    return this.x1(o);
  },
  o2x2: function(o) {
    this.w_start = this.window2.start;
    this.scale_x = this.scale_x2;
    return this.x2(o);
  },
  x1: function(o) {
    return this.calculate_x(o.get_begin());
  },
  x2: function(o) {
    return this.calculate_x(o.get_begin());
  },
  calculate_path: function(o) {
    var p = [];
    var x1 = this.o2x1(o);
    var x2 = this.o2x2(o);
    p = ['M', x1, '0', 'C', x1, '10,', x2, '10,', x2, '20'];
    return p.join(' ');
  },
  calculate_visibility: function(o) {
    var x1 = this.o2x1(o);
    if (x1 < 0) return false;
    if (x1 > this.element.clientWidth) return false;
    var x2 = this.o2x2(o);
    if (x2 > this.element.clientWidth) return false;
    if (x2 < 0) return false;
    return true;
  },
  calculate_style: function(o) {
    if (this.calculate_visibility(o)) {
      //if(true) {
      return 'stroke:grey;stroke-width:1px;fill:none;';
    } else {
      return 'stroke:none;stroke-width:1px;fill:none;';
    }
  },
  translate_x: function(e) {
    var time_delta = e.data;
    this.translate_offset += time_delta * this.scale_x;
    this.svg_gp
    .attr('transform', 'translate(' + (-this.translate_offset) + ',0)');
  },

  refresh_x: function() {
    this.scale_x1 = this.element.clientWidth / this.window1.get_width();
    this.scale_x2 = this.element.clientWidth / this.window2.get_width();
    this.translate_offset = 0;
    this.svg_gp
    .attr('transform', 'translate(0,0)');
    if (this.mode == "obsel_sync") {
      this.d3Obsels()
      .attr('d', this.calculate_path.bind(this))
      .attr('style', this.calculate_style.bind(this));
    } else {
      this.sync_path.attr('d', this.calculate_sync_path.bind(this));
    }
  },

  draw: function(e) {
    if (e) {
      switch (e.type) {
        case "trace:update":
          this.data = this.trace.list_obsels();
          break;
        default:
          this.data = this.trace.obsel_list; // do not want to trigger the refreshing of list_obsels()...
          break;
      }
    }
    if (this.mode == "obsel_sync") {
      this.d3Obsels()
      .exit()
      .remove();
      this.d3Obsels()
      .enter()
      .append('path')
      //.attr('class','Samotraces-obsel')
      .attr('d', this.calculate_path.bind(this))
      .attr('style', this.calculate_style.bind(this));
      this.d3Obsels()
      //.attr('stroke-width','1px')
      //.attr('stroke','black');
      // Storing obsel data with jQuery for accessibility from
      // events defined by users with jQuery
      $('path', this.element).each(function(i, el) {
        $.data(el, {
          'Samotraces-type': 'obsel',
          'Samotraces-data': d3.select(el).datum()
        });
      });
    } else {
      this.sync_path.attr('d', this.calculate_sync_path.bind(this));
    }
  },
  calculate_sync_path: function() {
    var ts = Math.max(this.window1.start, this.window2.start);
    var te = Math.min(this.window1.end, this.window2.end);
    var x1s = (Math.min(ts, this.window1.end) - this.window1.start) * this.scale_x1;
    var x2s = (Math.min(ts, this.window2.end) - this.window2.start) * this.scale_x2;
    var x1e = (Math.max(te, this.window1.start) - this.window1.start) * this.scale_x1;
    var x2e = (Math.max(te, this.window2.start) - this.window2.start) * this.scale_x2;
    var p = ["M", x1s, "0", "C", x1s, "20,", x2s, "0,", x2s, "20", "L", x2e, "20", "C", x2e, "0,", x1e, "20,", x1e, "0", "Z"];
    return p.join(" ");
  },
  obsel_redraw: function(e) {
    var obs = e.data;
    var sel = this.d3Obsels()
			.filter(function(o) {
  //				console.log('data:id,obsel_edit_id',id,obs.get_id(),id == obs.get_id());
  return o.get_id() == obs.get_id();
			})
			.datum(obs)
			.attr('d', this.calculate_path.bind(this))
  },

  d3Obsels: function() {
    return this.svg_gp
    .selectAll('path')
    // TODO: ATTENTION! WARNING! obsels MUST have a field id -> used as a key.
    //.data(this.data); //,function(d) { return d.id;});
    .data(this.data, function(d) { return d.id;}); // TODO: bogue in case no ID exists -> might happen with KTBS traces and new obsels
  },


};

module.exports = TraceDisplayZoomContext;

},{"./Widget.js":18,"d3":"d3","jquery":"jquery"}],18:[function(require,module,exports){
var $ = require("jquery");
require('jquery-mousewheel')($);

/**
 * @mixin
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @requires jQuery Mouse Wheel plugin (see <a href="https://github.com/brandonaaron/jquery-mousewheel">Mouse Wheel plugin</a>)
 * @description
 * All widgets should inherit from this Samotraces.UI.Widgets.Widget.
 *
 * In order to use create a widget that inherits from the
 * Widget class, one mush include the following code in
 * the constructor of their widget.
 * <code>
 * </code>
 *
 * @property {string} id Id of the HTML element the
 * Widget is attached to.
 * @property {HTMLElement} element HTML element the
 * Widget is attached to.
 */
var Widget = (function() {
  /**
  	 * Adds the given class to the HTML element to which
  	 * this Widget is attached to.
  	 * @memberof Samotraces.Widgets.Widget.prototype
  	 * @public
  	 * @method
  	 * @param {string} class_name Name of the class to add
  	 */
  function add_class(class_name) {
    this.element.className += ' ' + class_name;
  }

  function unload() {
    this.element.className = '';
    //		this.element.
  }
  /**
  	 * Creates a new behaviour (interaction possibility)
  	 * with the widget.
  	 * Two behaviours are implemented so far:
  	 * 1. 'changeTimeOnDrag'
  	 * 2. 'zommOnScroll'
  	 *
  	 * 1. 'changeTimeOnDrag' behaviour allows to change
  	 * a {@link Samotraces.Lib.Timer} on a drag-n-drop like event
  	 * (JavaScript 'mousedown', 'mousemove', 'mouseup' and 'mouseleave'
  	 * events). This allows to change the current time by dragging
  	 * a trace visualisation or a slider for instance.
  	 *
  	 * 2. 'changeTimeOnDrag' behaviour allows to change
  	 * a {@link Samotraces.Lib.TimeWindow} on a mouse scroll event
  	 * (JavaScript 'wheel' event)
  	 *
  	 * @memberof Samotraces.Widgets.Widget.prototype
  	 * @public
  	 * @method
  	 * @param {String} behaviourName Name of the behaviour
  	 *     ('changeTimeOnDrag' or 'zommOnScroll'). See description above.
  	 * @param {HTMLElement} eventTargetElement HTML Element on which
  	 *     an eventListener will be created (typically, the element you
  	 *     want to interact with).
  	 * @param {Object} opt Options that vary depending on the
  	 *     selected behaviour.
  	 * @param {Function} opt.onUpCallback
  	 *    (for 'changeTimeOnDrag' behaviour only)
  	 *    Callback that will be called when the 'mouseup' event will be
  	 *    triggered. The argument delta_x is passed to the callback
  	 *    and represents the offset of the x axis in pixels between the
  	 *    moment the mousedown event has been triggered and the moment
  	 *    the current mouseup event has been triggered.
  	 * @param {Function} opt.onMoveCallback
  	 *    (for 'changeTimeOnDrag' behaviour only)
  	 *    Callback that will be called when the 'mousemove' event will be
  	 *    triggered. The argument delta_x is passed to the callback
  	 *    and represents the offset of the x axis in pixels between the
  	 *    moment the mousedown event has been triggered and the moment
  	 *    the current mousemove event has been triggered.
  	 * @param {Samotraces.Lib.TimeWindow} opt.timeWindow
  	 *    (for 'zommOnScroll' behaviour only)
  	 *    {@link Samotraces.Lib.TimeWindow} object that will
  	 *    be edited when the zoom action is produced.
  	 */
  function add_behaviour(behaviourName, eventTargetElement, opt) {

    switch (behaviourName) {
      case 'changeTimeOnDrag':
        var mousedown, mouseup, mousemove;
        var init_client_x;
        mousedown = function(e) {
          //	console.log('mousedown');
          init_client_x = e.clientX;
          eventTargetElement.addEventListener('mousemove', mousemove);
          eventTargetElement.addEventListener('mouseup', mouseup);
          eventTargetElement.addEventListener('mouseleave', mouseup);
          return false;
        };
        mouseup = function(e) {
          //	console.log('mouseup');
          if (init_client_x !== undefined) {
            var delta_x = (e.clientX - init_client_x);
            opt.onUpCallback(delta_x);
            eventTargetElement.removeEventListener('mousemove', mousemove);
            eventTargetElement.removeEventListener('mouseup', mouseup);
            eventTargetElement.removeEventListener('mouseleave', mouseup);
          }
          return false;
        };
        mousemove = function(e) {
          var delta_x = (e.clientX - init_client_x);
          opt.onMoveCallback(delta_x);
          return false;
        };
        eventTargetElement.addEventListener('mousedown', mousedown);
        break;
      case 'zommOnScroll':
        var wheel;

        wheel = function(e) {
          var coef = Math.pow(0.8, e.deltaY);
          opt.timeWindow.zoom(coef);
          //				opt.onWheelCallback.call(opt.bind,coef);
          e.preventDefault();
          return false;
        };
        $(eventTargetElement).mousewheel(wheel);
        break;
      default:
        break;
    }
  }
  return function(id) {
    // DOCUMENTED ABOVE
    //this.id = id;
    //this.element = document.getElementById(this.id);
    this.element = id;
    this.id = this.element.id;

    this.add_class = add_class;
    this.add_behaviour = add_behaviour;

    // call method
    this.add_class('Widget');
    return this;
  };
})();

module.exports = Widget;

},{"jquery":"jquery","jquery-mousewheel":"jquery-mousewheel"}],19:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");
var d3 = require("d3");

/**
 * @summary Widget for visualising a time scale.
 * @class Widget for visualising a time scale.
 * @author Benoît Mathern
 * @requires d3.js framework (see <a href="http://d3js.org">d3js.org</a>)
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.WindowScale is a generic
 * Widget to visualise the temporal scale of a
 * {@link Samotraces.TimeWindow|TimeWindow}. This
 * widget uses d3.js to calculate and display the scale.
 *
 * Note: unless the optional argument isJavascriptDate is defined,
 * the widget will try to guess if time is displayed as numbers,
 * or if time is displayed in year/month/day/hours/etc.
 * This second option assumes that the time is represented in
 * milliseconds since 1 January 1970 UTC.
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param {} timeWindow
 *     TimeWindowCenteredOnTime object
 * @param {Boolean} [isJavascriptDate]
 *     Boolean that describes if the scale represents a JavaScript Date object.
 *     If set to true, the widget will display years, months, days, hours, minutes...
 *     as if the time given was the number of milliseconds ellapsed since 1 January 1970 UTC.
 *     If set to false, the widget will display the numbers without attempting
 *     any conversion.
 *     This argument is optional. If not set, the widget will try to guess:
 *     If the number of the start of the given TimeWindow is above a billion, then
 *     it is assumed that the JavaScript Date object has been used to represent time.
 *     Otherwise, the numerical value of time will be displayed.
 */
var WindowScale = function(htmlElement, timeWindow, isJavascriptDate) {
  "use strict";
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, htmlElement);

  this.add_class("Widget-WindowScale");
  $(window).resize(this.draw.bind(this));

  this.window = timeWindow;
  this.window.on("tw:update", this.draw.bind(this));
  this.window.on("tw:translate", this.draw.bind(this));

  // Trying to guess if timeWindow is related to a Date() object
  if (this.window.start > 1000000000) { // 1o^9 > 11 Jan 1970 if a Date object
    this.isJavascriptDate = isJavascriptDate || true;
  } else {
    this.isJavascriptDate = isJavascriptDate || false;
  }

  this.initDOM();
  // Update slider's position
  this.draw();

};

WindowScale.prototype = {
  initDOM: function() {
    "use strict";
    // Create the slider
    this.svg = d3.select(this.element).append("svg");
    if (this.isJavascriptDate) {
      this.x = d3.time.scale();
    } else {
      this.x = d3.scale.linear();
    }
    this.xAxis = d3.svg.axis().scale(this.x);
    this.x.domain([this.window.start, this.window.end]);
    this.svgAxis = this.svg.append("g");
    this.add_behaviour("zommOnScroll", this.element, {timeWindow: this.window});
  },

  draw: function() {
    "use strict";
    this.x.range([0, this.element.clientWidth]);
    this.x.domain([this.window.start, this.window.end]);
    this.svgAxis.call(this.xAxis);
  },
};

module.exports = WindowScale;

},{"./Widget.js":18,"d3":"d3","jquery":"jquery"}],20:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");
var d3 = require("d3");

var WindowScaleFix = function(html_id, time_window, is_javascript_date) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);
  this.add_class('Widget-WindowScale');
  $(window).resize(this.draw.bind(this));
  this.window = time_window;
  // trying to guess if time_window is related to a Date() object
  if (this.window.start > 1000000000) { // 1o^9 > 11 Jan 1970 if a Date object
    this.is_javascript_date = is_javascript_date || true;
  } else {
    this.is_javascript_date = is_javascript_date || false;
  }
  this.window.on('tw:update', this.draw.bind(this));
  this.init_DOM();
  // update slider's position
  this.draw();
		};

WindowScaleFix.prototype = {
  init_DOM: function() {
    // create the slider
    //this.svg = d3.select("#"+this.id).append("svg");
    this.svg = d3.select(this.element).append("svg");
    if (this.is_javascript_date) {
      this.x = d3.time.scale(); //.range([0,this.element.getSize().x]);
    } else {
      this.x = d3.scale.linear();
    }
    //this.xAxis = d3.svg.axis().scale(this.x); //.orient("bottom");
    this.xAxis = d3.svg.axis().scale(this.x);
    //.ticks(d3.time.days);
    this.x.domain([this.window.start, this.window.end]);
    this.svgAxis = this.svg.append("g");

  },

  draw: function() {
    this.x.range([0, this.element.clientWidth]);// = d3.time.scale().range([0,this.element.getSize().x]);
    this.x.domain([this.window.start, this.window.end]);
    this.svgAxis.call(this.xAxis);
  },
};

module.exports = WindowScaleFix;

},{"./Widget.js":18,"d3":"d3","jquery":"jquery"}],21:[function(require,module,exports){
var Widget = require("./Widget.js");
var $ = require("jquery");

/**
 * @summary Widget for visualising a window slider.
 * @class Widget for visualising a window slider.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.UI.Widgets.Widget
 * @description
 * Samotraces.UI.Widgets.d3Basic.WindowSlider is a generic
 * Widget to visualise a temporal window
 *
 * @param {String}	divId
 *     Id of the DIV element where the widget will be
 *     instantiated
 * @param wide_window
 *     TimeWindow object -> representing the wide window
 *     (e.g., the whole trace)
 * @param slider_window
 *     TimeWindow object -> representing the small window
 *     (e.g., the current time window being visualised with another widget)
 */
var WindowSlider = function(html_id, wide_window, slider_window) {
  // WidgetBasicTimeForm is a Widget
  Widget.call(this, html_id);

  this.add_class('Widget-WindowSlider');
  $(window).resize(this.draw.bind(this));

  this.wide_window = wide_window;
  this.wide_window.on('tw:update', this.draw.bind(this));
  this.wide_window.on('tw:translate', this.draw.bind(this));
  this.slider_window = slider_window;
  this.slider_window.on('tw:update', this.draw.bind(this));
  this.slider_window.on('tw:translate', this.draw.bind(this));

  this.slider_offset = 0;
  this.width = 0;

  this.init_DOM();
  // update slider's position
  this.draw();
};

WindowSlider.prototype = {
  init_DOM: function() {

    // create the slider
    this.slider_element = document.createElement('div');
    this.element.appendChild(this.slider_element);

    // hand made drag&drop
    // event listeners
    var widget = this;
    this.add_behaviour('changeTimeOnDrag', this.slider_element, {
      onUpCallback: function(delta_x) {
        var time_delta = delta_x * widget.wide_window.get_width() / widget.element.clientWidth;
        widget.slider_window.translate(time_delta);
      },
      onMoveCallback: function(offset) {
        widget.slider_element.style.left = widget.slider_offset + offset + 'px';
      },
    });
    this.add_behaviour('zommOnScroll', this.element, {timeWindow: this.slider_window});
  },

  draw: function() {
    this.width = this.slider_window.get_width() / this.wide_window.get_width() * this.element.clientWidth;
    this.slider_offset = (this.slider_window.start - this.wide_window.start) * this.element.clientWidth / this.wide_window.get_width();
    this.slider_element.style.display = 'block';
    this.slider_element.style.width = this.width + 'px';
    this.slider_element.style.left = this.slider_offset + 'px';
  },


};

module.exports = WindowSlider;

},{"./Widget.js":18,"jquery":"jquery"}],22:[function(require,module,exports){
/**
 * @mixin
 * @description
 * The EventHandler Object is not a class. However, it is
 * designed for other classes to inherit of a predefined
 * Observable behaviour. For this reason, this function is
 * documented as a Class.
 *
 * In order to use create a class that "inherits" from the
 * "EventHandler class", one must run the following code in
 * the constructor:
 * <code>
 * Samotraces.EventHandler.call(this);
 * </code>
 *
 * @property {Object} callbacks
 *     Hash matching callbacks to event_types.
 */
var EventHandler = (function() {
  /**
  	 * Triggers all the registred callbacks.
  	 * @memberof Samotraces.EventHandler.prototype
  	 * @param {String} event_type
  	 *     The type of the triggered event.
  	 * @param {Object} object
  	 *     Object sent with the message to the listeners (see
  	 *     {@link Samotraces.EventHandler#on}).
  	 */
  function trigger(event_type, object) {
    var e = { type: event_type, data: object };
    if (this.callbacks[event_type]) {
      this.callbacks[event_type].map(function(f) { f(e); });
    }
    /*
    		this.callbacks[event_type].forEach(function(callback) {
    			callback(e);
    		});
    		*/
  }
  /**
  	 * Adds a callback for the specified event
  	 * @memberof Samotraces.EventHandler.prototype
  	 * @param {String} event_type
  	 *     The type of the event to listen to.
  	 * @param {Function} callback
  	 *     Callback to call when the an event of type
  	 *     event_type is triggered. Note: the callback
  	 *     can receive one argument that contains
  	 *     details about the triggered event.
  	 *     This event argument contains two fields:
  	 *     event.type: the type of event that is triggered
  	 *     event.data: optional data that is transmitted with the event
  	 */
  function on(event_type, callback) {
    if ({}.toString.call(callback) !== '[object Function]') {
      console.log(callback);
      throw "Callback for event " + event_type + " is not a function";
    }
    this.callbacks[event_type] = this.callbacks[event_type] || [];
    this.callbacks[event_type].push(callback);
  }

  return function(events) {
    // DOCUMENTED ABOVE
    this.callbacks = this.callbacks || {};
    this.trigger = trigger;
    this.on = on;
    /**
    		 * EventConfig is a shortname for the
    		 * {@link Samotraces.EventHandler.EventConfig}
    		 * object.
    		 * @typedef EventConfig
    		 * @see Samotraces.EventHandler.EventConfig
    		 */
    /**
    		 * The EventConfig object is used for configurating the
    		 * functions to call events are triggered by an EventHandler Object.
    		 * Each attribute name of the EventConfig corresponds
    		 * to a type of event listened to, and each
    		 * value is the function to trigger on this event.
    		 * @typedef Samotraces.EventHandler.EventConfig
    		 * @type {Object.<string, function>}
    		 * @property {function} eventName - Function to trigger on this event.
    		 */
    function callback(e) { fun(e.data); }
    for (var event_name in events) {
      		if (event.hasOwnProperty(event_name)) {
        		var fun = events[event_name];
        		this.on(event_name, callback);
      		}
    }
    return this;
  };
})();

module.exports = EventHandler;

},{}],23:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");

/**
 * @class Javascript KTBS.Base Object that is bound to a KTBS.
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @augments Samotraces.KTBS.Resource
 * @description
 * Samotraces.KTBS.Base is a Javascript KTBS base
 * object that is bound to a KTBS. This Object implements the KTBS API.
 * Methods are available to get the
 * list of traces available in the KTBS base. Access a
 * specific trace, etc.
 *
 * @todo Fully implement KTBS API
 *
 * @param {String}	uri	URI of the Base to load.
 * @param {String}	[id]	ID of the Base to load.
 */
var Base = function Base(uri, id) {
  // KTBS.Base is a Resource
  if (id === undefined) { id = uri; }
  KTBSResource.call(this, id, uri, 'Base', "");
  this.traces = [];
  this.models = [];
  this.force_state_refresh();
};

Base.prototype = {
  get: function(id) {},
  /**
  	 * Gets the list of traces available in the base.
  	 * @returns {Array.<String>} Array of the ID of the traces available in the Base.
  	 */
  list_traces: function() {
    return this.traces;
  },
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  list_models: function() { return this.models; },
  /**
  	 * Create a stored trace in the KTBS
  	 * @param id {String} ID of the created trace
  	 * @param [model] {Model} Model of the trace
  	 * @param [origin] {Origin} Origin of the trace
  	 * @param [default_subject] {String} Default subject of the trace
  	 * @param [label] {String} Label of the trace
  	 */
  create_stored_trace: function(id, model, origin, default_subject, label) {
    var new_trace = {
      "@context":	"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
      "@type":	"StoredTrace",
      "@id":		id + "/"
    };
    new_trace.hasModel = (model === undefined)?"http://liris.cnrs.fr/silex/2011/simple-trace-model":model;
    new_trace.origin = (origin === undefined)?"1970-01-01T00:00:00Z":origin;
    //			if(origin==undefined) new_trace.origin = origin;
    if (default_subject === undefined) new_trace.default_subject = default_subject;
    if (label === undefined) new_trace.label = label;
    $.ajax({
      url: this.uri,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(new_trace),
      success: this.force_state_refresh.bind(this),
      error: function(jqXHR, textStatus, error) {
        console.log('query error');
        console.log([jqXHR, textStatus, error]);
      }
    });
  },

  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  create_computed_trace: function(id, method, parameters, sources, label) {},
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  create_model: function(id, parents, label) {},
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  create_method: function(id, parent, parameters, label) {},
  ///////////
  /**
  	 * Overloads the {@link Samotraces.KTBS.Resouce#_on_state_refresh_} method.
  	 * @private
  	 */
  _on_state_refresh_: function(data) {
    //	console.log(data);
    this._check_change_('label', data["http://www.w3.org/2000/01/rdf-schema#label"], 'base:update');
    this._check_change_('traces', data.contains, 'base:update');
  },
  /////////// ADDED / API
  /**
  	 * Gets a trace from its ID
  	 * @param id {String} ID of the trace to get.
  	 * @return {Samotraces.KTBS.Trace} The retrieved Trace.
  	 */
  get_trace: function(id) {
    return new Samotraces.KTBS.Trace(this.uri + id + '/', id);
  },
  ////////////
};

module.exports = Base;

},{"./KTBS.Resource.js":26}],24:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var EventHandler = require("./EventHandler.js");

/**
 * @summary Trace object that is synchronised to a KTBS.
 * @class Javascript Model Object that is bound to a KTBS Model.
 * @author Benoît Mathern / DERBEL Fatma
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @augments Samotraces.KTBS.Resource
 * @description
 * Samotraces.KTBS.Modelis a Javascript Trace object
 * that is bound to a KTBS Model. This Object implements the KTBS API.
 * Methods are available to get
 * the Liste of type of Obsels from the KTBS Model, .
 *
 *
 *
 * @todo Fully implement KTBS API
 *
 * @param {String}	uri	URI of the KTBS trace to load.
 * @param {String}	[id]	ID of the KTBS trace to load.
 */


var Model = function(uri, id) {
  if (id === undefined) { id = uri; }
  EventHandler.call(this);
  KTBSResource.call(this, id, uri, 'Model', "");
  this.list_Types_Obsles = []
  //if (data !== 'null')
  //{ this.list_Types_Obsles= this.list_obsels(data);}
  this.force_state_refresh();

};

Model.prototype = {

  _on_state_refresh_: function(data) {
    this.list_Types_Obsles = this.list_obsels(data["@graph"]);
  },
  list_obsels: function(data) {
    ListeObselType = [];
    M = this;
    data.forEach(function(el, key) {
      var obs = {attributes: []};
      if (el["@type"] == "ObselType")      {
        obs.id = el["@id"];
        obs.type = el["@id"].substr(1);
        obs.coche = false;
        //obs[key] = el[key]
        if (el['hasSuperObselType'])        {
          obs.hasSuperObselType = el['hasSuperObselType']
        }
        ListeObselType.push(obs);
        //M.trigger('Model:Draw_obsel', obs);
        //console.log ('triger')
      }      else if (el["@type"] == "AttributeType")      {
        obs = M.GetObselType(el["hasAttributeObselType"], ListeObselType);
        el['coche'] = false;
        obs.attributes.push(el);

      }

    });
    ListeObselType.forEach(function(o) {
      if (o.hasSuperObselType)      {

        o.attributes = M.getAttributes (o.hasSuperObselType[0])
      }

    })

    M.trigger('Model:listeType', ListeObselType);
    return ListeObselType;

  },

  GetObselType: function(id, ListeObselType)  {
    var obs = [];
    ListeObselType.forEach(function(o)    {

      if (o["id"] == id)      {

        obsR = o;

      }

    }
    )
    return obsR;
  },




  getAttributes: function(ident)  {

    ListeObselType.forEach(function(o)    {

      if (o.id === ident)                                  {Att = o.attributes}

    }
    )
    return Att;
  }


};

module.exports = Model;

},{"./EventHandler.js":22,"./KTBS.Resource.js":26}],25:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var Obsel = require("./Obsel.js");

/**
 * @class Samotraces.KTBS.Obsel is part of the Samotraces.KTBS implementation.
 * @augments Samotraces.Obsel
 * @augments Samotraces.KTBS.Resource
 * @todo TODO update set_methods
 * -> sync with KTBS instead of local change
 */
var KTBSObsel = function(param) {
  KTBSResource.call(this, param.id, param.uri, 'Obsel', param.label || "");

  this._private_check_error(param, 'trace');
  this._private_check_error(param, 'type');
  this._private_check_default(param, 'begin',	Date.now());
  this._private_check_default(param, 'end',		this.begin);
  this._private_check_default(param, 'attributes',	{});
  this._private_check_undef(param, 'relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param, 'inverse_relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param, 'source_obsels',		[]);
}

KTBSObsel.prototype = Obsel.prototype;

/*
Samotraces.KTBS.Obsel.prototype.get_ktbs_status = function() {
	return this.ktbs_status
};
*/

module.exports = KTBSObsel;

},{"./KTBS.Resource.js":26,"./Obsel.js":30}],26:[function(require,module,exports){
var EventHandler = require("./EventHandler.js");
var $ = require("jquery");

/**
 * @summary Resource Objects that is synchronised to a kTBS
 * @description Resource Objects are KTBS objects. All resources
 * have an uri, an id and an optional label
 * @class Resource Objects have an uri, an id and an optional label
 * @param {String} id Id of the Resource
 * @param {String} url URI of the Resource
 * @param {String} type Type of the Resource ('KTBS','Base',
 *     'Trace','StoredTrace','ComputedTrace' or 'Obsel')
 * @param {label} [label] Label of the Resource
 */
var KTBSResource = (function() {
  /**
  	 * @summary Returns the resource type of the Resource.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @returns {String} Resource type ('KTBS','Base',
  	 *     'Trace','StoredTrace','ComputedTrace' or 'Obsel').
  	 */
  function get_resource_type() {
    "use strict";
    return this.type;
  }

  function getAbsoluteURLFromRlative(base, relative) {
    var stack = base.split("/"),
        parts = relative.split("/");
    stack.pop(); // remove current file name (or empty string)
                 // (omit if "base" is the current folder without trailing slash)
    for (var i=0; i<parts.length; i++) {
        if (parts[i] == ".")
            continue;
        if (parts[i] == "..")
            stack.pop();
        else
            stack.push(parts[i]);
    }
    return stack.join("/");
  }
  // RESOURCE API
  /**
  	 * @summary Returns the ID of the Resource.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @returns {String} Resource ID.
  	 */
  function get_id() { return this.id; }
  /**
  	 * @summary Returns the URI of the Resource.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @returns {String} Resource URI.
  	 */
  function get_uri() { return this.uri.replace('./', ''); }
  /**
  	 * @summary Forces the Resource to synchronise with the KTBS.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @description
  	 * Forces the Resource to synchronise with the KTBS.
  	 * This method triggers a Ajax query that will
  	 * trigger the _on_state_refresh_ method of the Resource
  	 * on success.
  	 */
  function force_state_refresh() {
    url = this.uri;
    var trc = this ;
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      error: function(XHR, textStatus, errorThrown) {

        if (XHR.status == '401') {
          console.log (XHR.getAllResponseHeaders());
          Link = XHR.getResponseHeader('Link');
          D = Link.split (',');
          for (var i = 0;i < D.length;i++)          {
            var SousD = D[i].split(';');
            if (SousD[1] === " rel=oauth_resource_server")            {
              link = SousD[0].substr(1, SousD[0].length - 2)

            }

            if (SousD[1] === " rel=successful_login_redirect")            {
              URLSuccess = SousD[0].substr(2, SousD[0].length - 3)
            }

          }


          win = window.open (link) ;
        }
      },
      success: trc._on_state_refresh_.bind(trc),

    });
  }
  /**
  	 * @summary Forces the Resource to synchronise
  	 * with at a given refreshing rate.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @description
  	 * Forces the Resource to synchronise with the KTBS
  	 * every period seconds.
  	 * @param {Number} period Time in seconds between two synchronisations.
  	 */


  function start_auto_refresh(period) {
    var a = this.auto_refresh_id?this.stop_auto_refresh():null;
    this.auto_refresh_id = window.setInterval(this.force_state_refresh.bind(this), period * 1000);
  }
  /**
  	 * @summary Stops the autorefresh synchronisation
  	 * of the Resource.
  	 * @memberof Samotraces.KTBS.Resource.prototype
  	 * @description
  	 * Stops the autorefresh synchronisation of
  	 * the Resource.
  	 */
  function stop_auto_refresh() {
    if (this.auto_refresh_id) {
      window.clearInterval(this.auto_refresh_id);
      delete(this.auto_refresh_id);
    }
  }
  //		function _on_state_refresh_(data) { this.data = data; console.log("here"); }
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  function get_read_only() {}
  /**
  	 * @summary Delete the resource from the KTBS
  	 * @todo IMPROVE THIS METHOD SO THAT PROPER EVENT IS RAISED
  	 *     WHEN A RESOURCE IS DELETED.
  	 */
  function remove() {
    function refresh_parent() {
      //TROUVER UN MOYEN MALIN DE RAFRAICHIR LA LISTE DES BASES DU KTBS...
    }
    $.ajax({
      url: this.uri,
      type: 'DELETE',
      success: refresh_parent.bind(this),
      error: function(jqXHR, textStatus, errorThrown) {
        throw "Cannot delete " + this.get_resource_type() + " " + this.uri + ": " + textStatus + ' ' + JSON.stringify(errorThrown);
      }
    });
  }
  /**
  	 * @summary Returns the label of the Resource
  	 */
  function get_label() { return this.label; }
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  function set_label() {}
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  function reset_label() {}

  // ADDED FUNCTIONS
  /**
  	 * Method used to check if the distant value is different
  	 * from the current local value (and update the local value
  	 * if there is a difference.
  	 * @private
  	 * @param local_field {String} Name of the field of the this
  	 *     object containing the information to check.
  	 * @param distant {Value} Value of the distant information.
  	 * @param message_if_changed {String} Message to trigger if
  	 *     the information has been updated.
  	 */
  function _check_change_(local_field, distant, message_if_changed) {
    // TODO check if this is the wanted behaviour:
    // If distant is undefined -> what to do?
    if (distant !== undefined && this[local_field] !== distant) {
      this[local_field] = distant;
      this.trigger(message_if_changed);
    }
  }

  return function(id, uri, type, label) {
    // a Resource is an EventHandler
    Samotraces.EventHandler.call(this);
    // DOCUMENTED ABOVE
    // ATTRIBUTES
    this.id = id;
    this.uri = uri;
    this.label = label;
    this.type = type;
    // API METHODS
    this.get_id = get_id;
    this.get_uri = get_uri;
    this.force_state_refresh = force_state_refresh;
    this.get_read_only = get_read_only;
    this.remove = remove;
    this.get_label = get_label;
    this.set_label = set_label;
    this.reset_label = reset_label;
    // helper
    this.get_resource_type = get_resource_type;
    this._check_change_ = _check_change_;
    this.start_auto_refresh = start_auto_refresh;
    this.stop_auto_refresh = stop_auto_refresh;
    this.getAbsoluteURLFromRlative=getAbsoluteURLFromRlative;
    return this;
  };
})();


module.exports = KTBSResource;

},{"./EventHandler.js":22,"jquery":"jquery"}],27:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var KTBSObsel = require("./KTBS.Obsel.js");
var $ = require("jquery");

/**
 * @summary Trace object that is synchronised to a KTBS.
 * @class Javascript Trace Object that is bound to a KTBS trace.
 * @author Benoît Mathern
 * @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
 * @constructor
 * @augments Samotraces.EventHandler
 * @augments Samotraces.KTBS.Resource
 * @description
 * Samotraces.KTBS.Trace is a Javascript Trace object
 * that is bound to a KTBS trace. This Object implements the KTBS API.
 * Methods are available to get
 * the Obsels from the KTBS trace, create new Obsels, etc.
 *
 * Note: this Trace object does not implement all the methods
 * available in the KTBS API yet.
 * For instance, this class do not support transformations.
 *
 * @todo Fully implement KTBS API
 *
 * @param {String}	uri	URI of the KTBS trace to load.
 * @param {String}	[id]	ID of the KTBS trace to load.
 */
var KTBSTrace = function Trace(uri, id) {
  // KTBS.Trace is a Resource
  "use strict";
  if (id === undefined) { id = uri; }
  KTBSResource.call(this, id, uri, 'Base', "");

  this.temp = {}; // attribute used to store actions made by the user on the trace while not knowing if they are allowed. e.g., create_obsel, when we don't know yet if the Trace is a StoredTrace because the KTBS didn't reply yet.
  this.default_subject = "";
  this.model_uri = "";
  this.obsel_list_uri = uri + "@obsels";
  this.base_uri = "";
  this.origin = "";
  //this.origin_offset = (new Date(0)).getMilliseconds();
  this.obsel_list = []; this.traceSet = [];
  this.force_state_refresh();
};

KTBSTrace.prototype = {
  /////////// OFFICIAL API
  /**
  	 * @description
  	 * Gets the base where the trace is stored.
  	 * @returns {String} URI of the base where the trace is stored.
  	 */
  get_base: function() { "use strict";return this.base_uri; },
  /**
  	 * @description
  	 * Gets the model of the trace.
  	 * @returns {Model} Model of the trace.
  	 * @todo DEFINE WHAT IS A MODEL
  	 */
  get_model: function() {
    "use strict";

    return this.getAbsoluteURLFromRlative(this.get_uri(),this.model_uri);
 },
  /**
  	 * @description
  	 * Gets the origin of the trace.
  	 * @returns {Origin} Origin of the trace.
  	 * @todo DEFINE WHAT IS AN ORIGIN
  	 */
  get_origin: function() { "use strict"; return this.origin; },
  //get_origin_offset: function() { return this.origin_offset; },
  /*ktbs_origin_to_ms: function(ktbs_date_str) {
  		var Y = ktbs_date_str.substr(0,4);
  		var M = ktbs_date_str.substr(5,2) - 1;
  		var D = ktbs_date_str.substr(8,2);
  		var h = ktbs_date_str.substr(11,2);
  		var m = ktbs_date_str.substr(14,2);
  		var s = ktbs_date_str.substr(17,2);
  		var ms = ktbs_date_str.substr(20,3);
  		return Date.UTC(Y,M,D,h,m,s,ms);
  	},*/
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  list_source_traces: function() {},
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  list_transformed_traces: function() {},
  /**
  	 * @description
  	 * Returns the list of obsels in an optional time interval.
  	 * If no minimum time and no maximum time constraint are
  	 * defined, returns the whole list of obsels.
  	 * If one of the two constraints are defined, then returns
  	 * obsels matching the time constraints.
  	 *
  	 * Note: if an obsel overlaps with the start or the end
  	 * constraint, then it will be included (for instance an
  	 * obsel that starts before the start constraint and ends
  	 * after that constraint will be included).
  	 *
  	 * Note: the list returned by this method is the
  	 * list of Obsels that are loaded locally.
  	 * When this method is called, a query to the KTBS
  	 * is made to know if there are other Obsels matching
  	 * the query. If so, these other obsels will be loaded
  	 * in the local copy of the trace and a
  	 * {@link Samotraces.Trace#trace:create:obsel|trace:create:obsel}
  	 * event or a
  	 * {@link Samotraces.Trace#trace:update|trace:update}
  	 * event will be triggered to notify that other
  	 * Obsels have been loaded.
  	 * @param {Number} [begin] Minimum time constraint
  	 * @param {Number} [end] Maximum time constraint
  	 * @param {Boolean} [reverse=false] Returns the obsel list in
  	 *     reverse chronological order if true and in normal
  	 *     chronological order if false.
  	 * @returns {Array.<Obsel>} List of relevant obsels
  	 * @todo REVERSE IS NOT YET TAKEN INTO ACCOUNT
  	 */
  // TODO add an optional CALLBACK???
  list_obsels: function(begin, end, reverse) {
    "use strict";
    this.obsel_list_uri = this.uri + "@obsels";
    if (this.obsel_list_uri === "") {
      console.log("Error in KTBS:Trace:list_obsels() unknown uri");
      return false;
    }

    var OBJ = this;

    //		$.getJSON(this.obsel_list_uri,this._on_refresh_obsel_list_.bind(this));
    var OBJ = this;
    $.ajax({
      url: this.obsel_list_uri,//+'.json',
      type: 'GET',
      dataType: 'json',
      data: {minb: begin, maxb: end, reverse: reverse},
      xhrFields: { withCredentials: true },
      error: function(XHR) {
        if (XHR.status === '401') {
          var linkheader = XHR.getResponseHeader('Link');
          var d = linkheader.split (',');
          for (var i = 0;i < d.length;i++)          {
            var sousD = d[i].split(';');
            if (sousD[1] === " rel=oauth_resource_server")            {
              var link = sousD[0].substr(1, sousD[0].length - 2);

            }

            if (sousD[1] === " rel=successful_login_redirect")            {
              //	var	URLSuccess = sousD[0].substr(2,sousD[0].length-3);
            }
          }
          window.open (link) ;
        }
      },
      success: function(data) {	if (data.obsels.length > 0)	{OBJ.Before_on_refresh_obsel_list_ (data);}	}
    });
    return this.obsel_list.filter(function(o) {
      if (end && o.get_begin() > end) { return false; }
      if (begin && o.get_end() < begin) { return false; }
      return true;
    });
  },

  Before_on_refresh_obsel_list_: function(dataRecu) {
    "use strict";
    // par paquet
    this.trigger('trace:Config', dataRecu);
    var i = 0;
    var end = Number(i) + Number(100);

    if (dataRecu.obsels) {this._on_refresh_obsel_list_group(dataRecu.obsels, i, end);}    else { this._on_refresh_obsel_list_group(dataRecu, i, end);}


  },
  _on_refresh_obsel_list_group: function(dataRecu, i, end) {
    "use strict";
    var count = 0;
    var d = dataRecu.length - Number(1);
    var DataO = dataRecu.slice (i, end);
    console.log ('_on_refresh_obsel_list_group');
    var that = this;
    DataO.forEach(function(el) {
      count ++;
      this._parse_get_obsel_(el);
      var Objet = this;
      if (count === DataO.length)      {
        this.trigger('trace:updateT');
        i = Number(i) + DataO.length + Number(1);
        end = Number(i) + Number(100);
        if (end > dataRecu.length) {end = dataRecu.length - Number(1);}
        setTimeout(function() {
          if ((i <= d) && (end <= d)) {
            Objet._on_refresh_obsel_list_group(dataRecu, i, end);
          } else {
            that.trigger('trace:updateCompleted');
          }
        }, 2000);

        $("#waiting").hide();

      }
    }, this);

  },

  _on_refresh_obsel_list_: function(data) {
    "use strict";
    var count = 0;

    data.forEach(function(el) {
      count ++;
      this._parse_get_obsel_(el);
      if (count === data.length)      {this.trigger('trace:updateT', this);}
    }, this);


  },

  get_Last_obsel: function() {
    "use strict";
    var obs;
    var max = 0;
    this.obsel_list.forEach(function(o) {
      if (o.get_begin() > max) { obs = o; }
    });
    return obs;
  },
  get_First_obsel: function() {
    "use strict";
    var obs;
    var min1 = 9999999999999;
    this.obsel_list.forEach(function(o) {
      if (o.get_begin() < min1) { obs = o; }
    });
    return obs;
  },
  get_List_obsel_ParType: function(obselType) {
    "use strict";
    var liste = [];

    this.obsel_list.forEach(function(o) {
      if (o.type === obselType) { liste.push(o); }
    });
    return liste;
  },


  /**
  	 * @summary Forces the local obsel list to be synchronised
  	 * with the KTBS at a given refreshing rate.
  	 * @param {Number} period Time in seconds between two synchronisations.
  	 */
  start_auto_refresh_obsel_list: function(period) {
    "use strict";
    var a = this.auto_refresh_obsel_list_id?this.stop_auto_refresh_obsel_list():null;
    this.auto_refresh_obsel_list_id = window.setInterval(this.list_obsels.bind(this), period * 1000);
  },
  /**
  	 * @summary Stops the autorefresh synchronisation
  	 * of the obsel list.
  	 */
  stop_auto_refresh_obsel_list: function() {
    "use strict";
    if (this.auto_refresh_obsel_list_id) {
      window.clearInterval(this.auto_refresh_id);
      delete(this.auto_refresh_id);
    }
  },

  /**
  	 * Retrieve an obsel in the trace from its ID.
  	 * If the obsel does not exist locally, returns
  	 * undefined and send a query to the KTBS
  	 * (which will result in adding this obsel locally
  	 * if it exists on the KTBS).
  	 * @param {String} id ID of the Obsel to retrieve
  	 * @returns {Obsel} Obsel that corresponds to this ID
  	 *     or undefined if the obsel was not found.
  	 * @todo TODO add an optional CALLBACK
  	 */
  get_obsel: function(id) {
    "use strict";
    var obs;
    this.obsel_list.forEach(function(o) {
      if (o.get_id() === id) { obs = o; }
    });
    if (obs === undefined) {
      // sends a query to find the obsel
      jQuery.ajax({
        // TODO ideally JSON... When KTBS supports it!
        url: this.uri + id,
        dataType: 'json',
        type: 'GET',
        success: this._parse_get_obsel_.bind(this),
      });
    }
    return obs;
  },
  /**
  	 * Callback for queries where an obsel is expected as a result
  	 * Parses the JSON data from the KTBS to create a new Obsel locally
  	 * if it doesn't exist already.
  	 * @private
  	 */
  _parse_get_obsel_: function(data, textStatus, jqXHR) {
    "use strict";
    var obs = {
      attributes: {}
    };

    // OBSEL ID
    obs.id = data["@id"];
    if (this.type === "ComputedTrace") {obs.id = obs.type + "_" + obs.id;}
    if (obs.id.substr(0, 2) === "./") { obs.id = obs.id.substr(2); }

    // OBSEL TRACE
    // data.hasTrace;
    obs.trace = this;

    // OBSEL TYPE
    // data["@type"]; // TODO BUG KTBS -> USE "m:type" instead
    // data["m:type"];
    obs.type = data["@type"].substr(2);

    if (data.hasOwnProperty('http://www.w3.org/2000/01/rdf-schema#label')) {
      obs.label = data['http://www.w3.org/2000/01/rdf-schema#label'];
    }
    //obs.begin = data.begin;
    //obs.end = data.end;
    var d = new Date (this.origin);
    obs.begin = d.getTime() + data.begin ;
    obs.end = d.getTime() + data.end;

    // DELETING PROPERTIES THAT HAVE ALREADY BEEN COPIED
    delete data["@id"];
    delete data.hasTrace;
    delete data["@type"];
    delete data.begin;
    delete data.end;
    delete data['http://www.w3.org/2000/01/rdf-schema#label'];
    //delete data["m:type"];


    // ATTRIBUTES
    for (var attr in data) {
      if (attr.substr(0, 2) === "m:") { // TODO this is not generic!!!!
        obs.attributes[attr.substr(2)] = data[attr];
      }
    }
    //console.log(data,obs);
    var o = new KTBSObsel(obs);
    if (!this._check_obsel_loaded_(o)) { // TODO first approximation
      this.trigger('trace:create_obsel', o);
    }
  },

  ///////////
  /**
  	 * Overloads the {@link Samotraces.KTBS.Resouce#_on_state_refresh_} method.
  	 * @private
  	 */
  _on_state_refresh_: function(data) {
    //		console.log(data);
    "use strict";
    this._check_and_update_trace_type_(data['@type']);
    this._check_change_('default_subject', data.hasDefaultSubject, '');
    this._check_change_('model_uri', data.hasModel, 'trace:model');
    this._check_change_('obsel_list_uri', data.hasObselList, 'trace:update');
    this._check_change_('base_uri', data.inBase, '');
    this._check_change_('origin', data.origin, 'trace:update');
    this._check_change_('label', data.label, 'trace:update');
    this.trigger('trace:updateData', data);
    //this._check_change_('origin_offset',this.ktbs_origin_to_ms(data.origin),'');
  },
  _update_method_: function(trace_type, method_name) {
    "use strict";
    this[method_name] = this[trace_type + "_methods"][method_name];
    if (this.temp[method_name] !== undefined) {
      this.temp[method_name].forEach(function(param) {
        this[method_name](param);
      }, this);
    }
  },
  _check_and_update_trace_type_: function(type) {
    "use strict";
    if (this.type !== type) {
      for (var method_name in this[type + "_methods"]) {
        if (this[type + "_methods"].hasOwnProperty(method_name))        {this._update_method_(type, method_name);}
      }
      this.type = type;
    }
  },
  ///////////
  /*	_on_refresh_obsel_list_: function(data) {
  //		console.log(data);
  		var id, label, type, begin, end, attributes, obs;
  		var new_obsel_loaded = false;
  		data.obsels.forEach(function(el,key) {
  			this._parse_get_obsel_(el);
  /*
  			var attr = {};
  			attr.id = el['@id'];
  			attr.trace = this;
  			attr.label = el['http://www.w3.org/2000/01/rdf-schema#label'] || undefined;
  			attr.type = el['@type'];
  			attr.begin = el['begin'];
  			attr.end = el['end'];
  			attr.attributes = el;
  			delete(attr.attributes['@id']);
  			delete(attr.attributes['http://www.w3.org/2000/01/rdf-schema#label']);
  			delete(attr.attributes['@type']);
  			delete(attr.attributes['begin']);
  			delete(attr.attributes['end']);
  			obs = new Samotraces.KTBS.Obsel(attr);

  			if(! this._check_obsel_loaded_(obs)) {
  				new_obsel_loaded = true;
  			}
*/
  //},this);
  /*		if(new_obsel_loaded) {
  			this.trigger('trace:update',this.traceSet);
  		}
*/
  //},*/
  _check_obsel_loaded_: function(obs) {
    "use strict";
    if (this.obsel_list.some(function(o) {
      return o.get_id() === obs.get_id(); // first approximation: obsel has the same ID => it is already loaded... We don't check if the obsel has changed!
    })) {
      return true;
    } else {
      this.obsel_list.push(obs);
      return false;
    }
  },
  StoredTrace_methods: {
    set_model: function(model) {},
    set_origin: function(origin) {
      "use strict";
      this.origin = origin;
      //	this.origin_offset = (new Date(origin)).getMilliseconds();
      // TODO sync with KTBS
    },
    get_default_subject: function() {
      "use strict";
      return this.default_subject;
    },
    set_default_subject: function(subject) {},
    create_obsel: function(params) {
      // LOCAL TRACE
      //var obs = new Samotraces.Obsel(obsel_params);
      // KTBS BOGUE
      "use strict";
      var json_obsel = {
        "@context":	[
        "http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
               { "m": "http://liris.cnrs.fr/silex/2011/simple-trace-model#" }
        ],
        "@type":	"m:" + params.type, // fixed: "SimpleObsel", // TODO KTBS BUG TO FIX
        hasTrace:	"",
        subject:	params.hasOwnProperty("subject")?params.subject:this.get_default_subject(),
        //"m:type":	params.type
      };
      //console.log(params.hasOwnProperty("subject")?params.subject:this.get_default_subject(),params.hasOwnProperty("subject"),params.subject,this.get_default_subject());
      if (params.hasOwnProperty("begin")) { json_obsel.begin = params.begin; }
      if (params.hasOwnProperty("end")) { json_obsel.begin = params.end;}
      if (params.hasOwnProperty("attributes")) {
        for (var attr in params.attributes) {
          if (params.attributes.hasOwnProperty(attr))          {json_obsel["m:" + attr] = params.attributes[attr];}
        }
      }
      function _on_create_obsel_success_(data, textStatus, jqXHR) {
        /*
        				var url = jqXHR.getResponseHeader('Location');
        				var url_array = url.split('/');
        				*/

        var url_array = data.split('/');
        var obsel_id = url_array[url_array.length - 1];
        //this.get_obsel(obsel_id);
        // Optimisation: do not do a GET query to get the OBSEL
        // The Obsel parameters are already known in param
        // We just need to add the ID.
        params.id = obsel_id;
        params.trace = this;
        var o = new KTBSObsel(params);
        if (!this._check_obsel_loaded_(o)) {
          this.trigger('trace:create_obsel', o);
        }
      }
      $.ajax({
        url: this.uri,
        type: 'POST',
        contentType: 'application/json',
        success: _on_create_obsel_success_.bind(this),
        data: JSON.stringify(json_obsel)
      });
    }
  },

  ComputedTrace_methods: {
    set_method: function(method) {},
    list_parameters: function(include_inherited) {},
    get_parameter: function(key) {},
    set_parameter: function(key, value) {},
    del_parameter: function(key) {}
  },

  // TEMPORARY METHODS
  create_obsel: function(obsel_params) {
    "use strict";
    if (!this.create_obsel.hasOwnProperty('create_obsel')) {
      this.temp.create_obsel = [];
    }
    this.temp.create_obsel.push (obsel_params);
  },

};

module.exports = KTBSTrace;

},{"./KTBS.Obsel.js":25,"./KTBS.Resource.js":26,"jquery":"jquery"}],28:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var KTBSBase = require("./KTBS.Base.js");
var $ = require("jquery");

/**
* @summary Javascript KTBS Object that is bound to a KTBS.
* @class Javascript KTBS Object that is bound to a KTBS.
* @author Benoît Mathern
* @requires jQuery framework (see <a href="http://jquery.com">jquery.com</a>)
* @constructor
* @augments Samotraces.EventHandler
* @augments Samotraces.KTBS.Resource
* @description
* Samotraces.KTBS is a Javascript KTBS object that
* is bound to a KTBS. This Object implemetns the KTBS API.
* Methods are available to get the list of bases
* available in the KTBS. Access a specific base, etc.
*
* @param {String}	uri	URI of the KTBS to load.
*/
var KTBS = function KTBS(uri) {
  // KTBS is a Resource
  "use strict";
  KTBSResource.call(this, uri, uri, 'KTBS', "");
  this.bases = [];
  this.builtin_methods = [];
  this.force_state_refresh();
};

KTBS.prototype = {
  /////////// OFFICIAL API
  /**
  * @todo METHOD NOT IMPLEMENTED
*/
  list_builtin_methods: function() {},
  /**
  * @todo METHOD NOT IMPLEMENTED
*/
  get_builtin_method: function() {},
  /**
  * Returns the array of the URI of the bases contained in the KTBS
  * @returns {Array<String>} Array of URI of bases.
*/
  list_bases: function() {
    "use strict";
    return this.bases;
  },
  /**
  * @summary Returns the KTBS.Base with the given ID.
  * @returns Samotraces.KTBS.Base Base corresponding to the given ID
  * @param id {String} URI of the base
*/
  get_base: function(id) {
    "use strict";
    return new KTBSBase(this.uri + id, id);
  },
  /**
  * Create a new base.
  * @param id {String} URI of the base (optional)
  * @param label {String} Label of the base (optional)
*/
  create_base: function(id, label) {
    "use strict";
    var new_base = {
      "@context":	"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
      "@type":	"Base",
      "@id":		id + "/",
      "label":	label
    };
    $.ajax({
      url: this.uri,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(new_base),
      success: this.force_state_refresh.bind(this),
      error: function(jqXHR, textStatus, error) {
        console.log('query error');
        console.log([jqXHR, textStatus, error]);
      }
    });
  },
  ///////////
  /**
  * Overloads the {@link Samotraces.KTBS.Resouce#_on_state_refresh_} method.
  * @private
*/
  _on_state_refresh_: function(data) {
    "use strict";
    this._check_change_('bases', data.hasBase, 'ktbs:update');
    this._check_change_('builtin_methods', data.hasBuildinMethod, 'ktbs:update');
  },
};

module.exports = KTBS;

},{"./KTBS.Base.js":23,"./KTBS.Resource.js":26,"jquery":"jquery"}],29:[function(require,module,exports){
var Obsel = require("./Obsel.js");
var EventHandler = require("./EventHandler.js");

/**
 * @summary Javascript Trace Object.
 * @class Javascript Trace Object.
 * @author Benoît Mathern
 * @constructor
 * @mixes Samotraces.EventHandler
 * @augments Samotraces.Trace
 * @description
 * Samotraces.DemoTrace is a Javascript Trace object.
 * Methods are available to get
 * the Obsels from the trace, create new Obsels, etc.
 *
 * The trace is initialised empty. Obsels have to be created
 * by using the {@link Samotraces.DemoTrace#newObsel} method.
 */
var LocalTrace = function(source_traces) {
  // Addint the Observable trait
  "use strict";
  EventHandler.call(this);

  /* Nombre d'obsels dans la trace */
  this.count = 0; // sert d'ID pour le prochain observé.
  /* Array d'obsels */
  this.obsel_list = [];
  this.source_traces = (source_traces !== undefined)?source_traces:[];
  this.source_traces.forEach(function(t) {
    t.transformed_traces.push(this);
  });
  this.transformed_traces = [];
  this.origin = "";
  //this.origin_offset = (new Date(0)).getMilliseconds();

};

LocalTrace.prototype = {
  /**
  	 * @description
  	 * Gets the label of the trace
  	 * @returns {String} Label of the trace
  	 */
  get_label: function() { "use strict";return this.label; },
  /**
  	 * @description
  	 * Sets the label of the trace
  	 * @param {String} lbl Label of the trace
  	 */
  set_label: function(lbl) {
    "use strict";
    this.label = lbl;
    this.trigger('trace:edit_meta');
  },
  /**
  	 * @description
  	 * Resets the label to the empty string
  	 */
  reset_label: function() {
    "use strict";
    this.label = "";
    this.trigger('trace:edit_meta');
  },

  /**
  	 * @description
  	 * Returns the model of the trace
  	 * @returns Model of the trace
  	 * @todo UPDATE WHAT IS A MODEL
  	 */
  get_model: function() { "use strict";return this.model; },
  /**
  	 * @description
  	 * Returns the origin of the trace
  	 * @returns Origin of the trace
  	 * @todo UPDATE WHAT IS AN ORIGIN
  	 */
  get_origin: function() { "use strict";return this.origin; },
  //get_origin_offset: function() { return this.origin_offset; },
  /**
  	 * @description
  	 * Returns the source traces of this trace
  	 * @returns {Array.<Trace>} Source traces of this trace.
  	 */
  list_source_traces: function() { "use strict";return this.source_traces; },
  /**
  	 * @description
  	 * Returns the traces transformed from this trace
  	 * @returns {Array.<Trace>} Trace transformed from this trace
  	 */
  list_transformed_traces: function() { "use strict";return this.transformed_traces; },
  /**
  	 * @description
  	 * Returns the list of obsels in an optional time interval.
  	 * If no minimum time and no maximum time constraint are
  	 * defined, returns the whole list of obsels.
  	 * If one of the two constraints are defined, then returns
  	 * obsels matching the time constraints.
  	 *
  	 * Note: if an obsel overlaps with the start or the end
  	 * constraint, then it will be included (for instance an
  	 * obsel that starts before the start constraint and ends
  	 * after that constraint will be included).
  	 * @param {Number} [begin] Minimum time constraint
  	 * @param {Number} [end] Maximum time constraint
  	 * @param {Boolean} [reverse=false] Returns the obsel list in
  	 *     reverse chronological order if true and in normal
  	 *     chronological order if false.
  	 * @returns {Array.<Obsel>} List of relevant obsels
  	 * @todo REVERSE IS NOT YET TAKEN INTO ACCOUNT
  	 */
  list_obsels: function(begin, end) {
    "use strict";
    // TODO reverse is ignored.
    return this.obsel_list.filter(function(o) {
      if (end && o.get_begin() > end) { return false; }
      if (begin && o.get_end() < begin) { return false; }
      return true;
    });
  },

  /**
  	 * Retrieve an obsel in the trace from its ID.
  	 * @param {String} id ID of the Obsel to retrieve
  	 * @returns {Obsel} Obsel that corresponds to this ID
  	 *     or undefined if the obsel was not found.
  	 * @todo use KTBS abstract API.
  	 */
  get_obsel: function(id) {
    "use strict";
    var obs;
    this.obsel_list.forEach(function(o) {
      if (o.get_id() === id) { obs = o; }
    });
    return obs;
  },
  /**
  	 * @description
  	 * Sets the model of the trace
  	 * @param model Model of the trace
  	 * @todo UPDATE WHAT IS A MODEL
  	 */
  set_model: function(model) {
    "use strict";
    this.model = model;
    this.trigger('trace:edit_meta');
  },
  /**
  	 * @description
  	 * Sets the origin of the trace
  	 * @param origin Origin of the trace
  	 * @todo UPDATE WHAT IS AN ORIGIN
  	 */
  set_origin: function(origin) {
    "use strict";
    this.origin = origin;
    //	this.origin_offset = (new Date(origin)).getMilliseconds();
    this.trigger('trace:edit_meta');
  },
  /**
  	 * @description
  	 * Returns the default subject of the trace
  	 * @returns {String} The trace default subject
  	 */
  get_default_subject: function() { "use strict";return this.subject;},
  /**
  	 * @description
  	 * Set the default subject of the trace
  	 * @param {String} subject The trace default subject
  	 */
  set_default_subject: function(subject) {
    "use strict";
    this.subject = subject;
    this.trigger('trace:edit_meta');
  },

  /**
  	 * @description
  	 * Create a new obsel in the trace with the
  	 * given properties
  	 * @param {ObselParam} obsel_params Parameters
  	 *     corresponding to the obsel to create.
  	 * @param {String} obsel_params.type Type of the obsel.
  	 * @param {Number} [obsel_params.begin] Timestamp of when the obsel starts
  	 * @param {Number} [obsel_params.end] Timestamp of when the obsel ends
  	 * @param {Object} [obsel_params.attributes] Attributes of the obsel.
  	 * @param {Array<Relation>} [obsel_params.relations] Relations from this obsel.
  	 * @param {Array<Relation>} [obsel_params.inverse_relations] Relations to this obsel.
  	 * @param {Array<Obsel>} [obsel_params.source_obsels] Source obsels of the obsel.
  	 * @param {String} [obsel_params.label] Label of the obsel.
  	 */
  create_obsel: function(obsel_params) {
    "use strict";
    obsel_params.id = this.count;
    this.count++;
    obsel_params.trace = this;
    var obs = new Obsel(obsel_params);
    this.obsel_list.push(obs);
    this.trigger('trace:create_obsel', obs);
  },
  /**
  	 * @description
  	 * Removes the given obsel from the trace
  	 * @param {Obsel} obs Obsel to remove
  	 */
  remove_obsel: function(obs) {
    "use strict";
    this.obsel_list = this.obsel_list.filter(function(o) {
      return (o === obs)?false:true;
    });
    this.trigger('trace:remove_obsel', obs);
  },
  /**
  	 * @todo TODO document this method
  	 */
  transform: function(transformation_method, parameters) {
    "use strict";
    return transformation_method(this, parameters);
  },
  /**
  	 * @todo TODO document this method
  	 */
  transformations: {

    duplicate: function(trace) {
      "use strict";
      // TODO better deep copy
      var transformed_trace = new LocalTrace([trace]);
      trace.list_obsels().forEach(function(o) {
        transformed_trace.create_obsel(o.to_Object());
      });
      trace.on('trace:create_obsel', function(e) {
        var o = e.data;
        transformed_trace.create_obsel(o.to_Object());
      });
      return transformed_trace;
    },
    filter_obsel_type: function(trace, opt) {
      "use strict";
      // TODO: implement
      // TODO better deep copy
      var transformed_trace = new LocalTrace([trace]);
      trace.list_obsels().forEach(function(o) {
        if (opt.types.some(function(type) {return type === o.get_obsel_type();})) {
          if (opt.mode === "keep") {
            transformed_trace.create_obsel(o.to_Object());
          }
        } else {
          if (opt.mode === "remove") {
            transformed_trace.create_obsel(o.to_Object());
          }
        }
      });
      trace.on('trace:create_obsel', function(e) {
        var o = e.data;
        if (opt.types.some(function(type) {return type === o.get_obsel_type();})) {
          if (opt.mode === "keep") {
            transformed_trace.create_obsel(o.to_Object());
          }
        } else {
          if (opt.mode === "remove") {
            transformed_trace.create_obsel(o.to_Object());
          }
        }
      });
      return transformed_trace;
    },
  },
};

module.exports = LocalTrace;

},{"./EventHandler.js":22,"./Obsel.js":30}],30:[function(require,module,exports){
var $ = require("jquery");

/**
* Obsel is a shortname for the
* {@link Samotraces.Obsel}
* object.
* @typedef Obsel
* @see Samotraces.Obsel
*/

/**
* ObselParam is an object that contains parameters
* necessary to create a new obsel.
* This type of object is used in several methods
* such as the Obsel constructor, or the
* Trace.create_obsel method.
* The optional porperties varies depending on the
* method called.
* @typedef ObselParam
* @property {String} [id] Id of the obsel
* @property {Trace} [trace] Trace of the obsel
* @property {String} [type] Type of the obsel
* @property {Number} [begin] Timestamp of when the obsel starts
* @property {Number} [end] Timestamp of when the obsel ends
* @property {Object} [attributes] Attributes of the obsel.
* @property {Array<Relation>} [relations] Relations from this obsel.
* @property {Array<Relation>} [inverse_relations] Relations to this obsel.
* @property {Array<Obsel>} [source_obsels] Source obsels of the obsel.
* @property {String} [param.label] Label of the obsel.
* @todo FIXME DEFINE WHAT IS A RELATION
*/

/**
* @summary JavaScript Obsel class
* @class JavaScript Obsel class
* @param {ObselParam} param Parameters of the obsel
* @param {String} param.id Identifier of the obsel.
* @param {Trace} param.Trace Trace of the obsel.
* @param {String} param.type Type of the obsel.
* @param {Number} [param.begin=Date.now()] Timestamp of when the obsel starts
* @param {Number} [param.end=param.begin] Timestamp of when the obsel ends
* @param {Object} [param.attributes] Attributes of the obsel.
* @param {Array<Relation>} [param.relations] Relations from this obsel.
* @param {Array<Relation>} [param.inverse_relations] Relations to this obsel.
* @param {Array<Obsel>} [param.source_obsels] Source obsels of the obsel.
* @param {String} [param.label] Label of the obsel.
* @todo FIXME RELATIONS ARE NOT YET SUPPORTED
*/

var Obsel = function Obsel(param) {
  "use strict";
  this._private_check_error(param, 'id');
  this._private_check_error(param, 'trace');
  this._private_check_error(param, 'type');
  this._private_check_default(param, 'begin',	Date.now());
  this._private_check_default(param, 'end',		this.begin);
  this._private_check_default(param, 'attributes',	{});
  this._private_check_undef(param, 'relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param, 'inverse_relations',	[]); // TODO ajouter rel à l'autre obsel
  this._private_check_undef(param, 'source_obsels',		[]);
  this._private_check_undef(param, 'label',		"");
};

Obsel.prototype = {
  // ATTRIBUTES
  attributes: {},
  relations: [],
  inverse_relations: [],
  source_obsels: [],
  label: "",
  /**
  * If attribute exists, then set the class attribute
  * of the same name to the attribute value, otherwise
  * set the attribute of the same name with the default
  * value.
  * @param {Object} param Object from which attribute is copied
  * @param {String} attr Name of the attribute
  * @param value Default value
  * @private
*/
  _private_check_default: function(param, attr, value) {
  "use strict";
  this[attr] = (param[attr] !== undefined)?param[attr]:value;
},
  /**
  * If attribute exists, then set the class attribute
  * of the same name to the attribute value, otherwise
  * nothing happens.
  * @param {Object} param Object from which attribute is copied
  * @param {String} attr Name of the attribute
  * @private
*/
  _private_check_undef: function(param, attr) {
  "use strict";
  if (param[attr] !== undefined) {
    this[attr] = param[attr];
  }
},
  /**
  * If attribute exists, then set the class attribute
  * of the same name to the attribute value, otherwise
  * throw an error.
  * @param {Object} param Object from which attribute is copied
  * @param {String} attr Name of the attribute
  * @private
*/
  _private_check_error: function(param, attr) {
  "use strict";
  if (param[attr] !== undefined) {
    this[attr] = param[attr];
  } else {
    throw "Parameter " + attr + " required.";
  }
},
  // RESOURCE
  /**
  * @summary
  * Remove the obsel from its trace.
  * @description
  * Remove the obsel from its trace.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:remove_obsel} event
*/
  remove: function() {
  "use strict";
  this.get_trace().remove_obsel(this);
},
  /**
  * @summary
  * Returns the id of the Obsel.
  * @returns {String} Id of the obsel.
*/
  get_id: function() {
  "use strict";
  return this.id;
},
  /**
  * @summary
  * Returns the label of the Obsel.
  * @returns {String} Label of the obsel.
*/
  get_label: function() {
  "use strict";
  return this.label;
},
  /**
  * @summary
  * Sets the label of the Obsel.
  * @param {String} Label of the obsel.
*/
  set_label: function(lbl) {
    "use strict";
  this.label = lbl; },
  /**
  * @summary
  * Sets the label of the Obsel to the empty string.
*/
  reset_label: function() {
  "use strict";
this.label = ""; },
  // OBSEL
  /**
  * @summary
  * Returns the trace the Obsel belongs to.
  * @returns {Trace} Trace the Obsel belongs to.
*/
  get_trace: 		function() {
  "use strict";
return this.trace; },
  /**
  * @summary
  * Returns the type of the Obsel.
  * @returns {String} Type of the obsel.
  * @todo TODO differs from KTBS API -> express it clearly
*/
  get_type: function() {
  "use strict";
return this.type; },
  /**
  * Returns the time when the Obsel starts.
  * @returns {Number} Time when the Obsel starts.
*/
  get_begin: 		function() {
    //return this.get_trace().get_origin_offset() + this.begin;
    "use strict";
    return this.begin;
  },
  /**
  * @summary
  * Returns the time when the Obsel ends.
  * @returns {Number} Time when the Obsel ends.
*/
  get_end: 		function() {
    //return this.get_trace().get_origin_offset() + this.end;
    "use strict";
    return this.end;
  },
  /**
  * @summary
  * Sets the type of the Obsel.
  * @description
  * Sets the type of the Obsel.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:edit_obsel} event
  * @params {String} type Type of the obsel.
  * @todo TODO not KTBS API compliant
  * @deprecated This method might not be supported in the future.
*/
  force_set_obsel_type: function(type) {
    "use strict";
    this.type = type;
    this.trace.trigger('trace:edit_obsel', this);
  },
  /**
  * @summary
  * Sets the time when the Obsel starts.
  * @description
  * Sets the time when the Obsel starts.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:edit_obsel} event
  * @params {Number} begin Time when the Obsel starts.
  * @todo TODO not KTBS API compliant
  * @deprecated This method might not be supported in the future.
*/
  force_set_begin: function(begin) {
    "use strict";
    this.begin = begin;
    this.trace.trigger('trace:edit_obsel', this);
  },
  /**
  * @summary
  * Sets the time when the Obsel ends.
  * @description
  * Sets the time when the Obsel ends.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:edit_obsel} event
  * @params {Number} end Time when the Obsel ends.
  * @todo TODO not KTBS API compliant
  * @deprecated This method might not be supported in the future.
*/
  force_set_end: 	function(end) {
    "use strict";
    this.end = end;
    this.trace.trigger('trace:edit_obsel', this);
  },
  /**
  * @summary
  * Returns the source Obsels of the current Obsel.
  * @returns {Array<Obsel>} Source Obsels of the current Obsel.
*/
  list_source_obsels: 	function() {
    "use strict";
    if (this.list_source_obsels === undefined) { return []; }
    return this.source_obsels;
  },
  /**
  * @summary
  * Returns the attribute names of the Obsel.
  * @returns {Array<String>} Attribute names of the Obsel.
*/
  list_attribute_types: 	function() {
    "use strict";
    if (this.attributes === undefined) { return []; }
    var attrs = [];
    for (var key in this.attributes) {
      if (this.attributes.hasOwnProperty(key))      {
        attrs.push(key);
      }
    }

    return attrs;
  },
  /**
  * @summary
  * Returns the relation types of the Obsel.
  * @returns {Array<String>} Relation types of the Obsel.
  * @todo TODO Check how it is supposed to work in KTBS API
*/
  list_relation_types: 	function() {
  "use strict";
  if (this.relations === undefined) { return []; }
  var rels = [];
  this.relations.forEach(function(r) {
    //var uniqueNames = [];
    if ($.inArray(r.type, rels) === -1) {
      rels.push(r.type);
    }
  });
  return rels;
},
  /**
  * @summary
  * Returns the Obsels related to the current Obsel with the given relation type.
  * @param {String} relation_type Relation type.
  * @returns {Array<Obsel>} Obsels related to the current Obsel.
  * @todo TODO Check how it is supposed to work in KTBS API
*/
  list_related_obsels: 	function(relation_type) {
  "use strict";
  var obss = [];
  if (this.relations !== undefined) {
    this.relations.forEach(function(r) {
      //var uniqueNames = [];
      if (r.type === relation_type) {
        obss.push(r.obsel_to);
      }
    });
  }
  if (this.inverse_relations !== undefined) {
    this.inverse_relations.forEach(function(r) {
      //var uniqueNames = [];
      if (r.type === relation_type) {
        obss.push(r.obsel_to);
      }
    });
  }
  return obss;
},
  /**
  * @summary
  * Returns the inverse relation types of the Obsel.
  * @returns {Array<String>} Inverse relation types of the Obsel.
  * @todo TODO Check how it is supposed to work in KTBS API
*/
  list_inverse_relation_types: function() {
  "use strict";
  if (this.inverse_relations === undefined) { return []; }
  var rels = [];
  this.inverse_relations.forEach(function(r) {
    //var uniqueNames = [];
    if ($.inArray(r.type, rels) === -1) {
      rels.push(r.type);
    }
  });
  return rels;
},
  //	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
  /**
  * @summary
  * Returns the value of an attribute.
  * @param {String} attr Attribute name.
  * @returns {Object} Attribute value.
  * @todo TODO Check consistency with KTBS API
*/
  get_attribute:	function(attr) {
  "use strict";
  if (this.attributes[attr] === undefined) {
    throw "Attribute " + attr + " is not defined"; // TODO
  } else {
    return this.attributes[attr];
  }
},
  //	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
  /**
  * @summary
  * Sets the value of an attribute.
  * @param {String} attr Attribute name.
  * @param {Object} val Attribute value.
  * @todo TODO Check consistency with KTBS API
*/
  set_attribute:	function(attr, val) {
  "use strict";
  this.attributes[attr] = val;
  this.trace.trigger('trace:edit_obsel', this);
  // TODO envoyer un event pour dier que l'obsel a changé
},
  //	del_attribute_value:	function(attr) {}, // TODO erreur de l'API KTBS?
  /**
  * @summary
  * Removes the attribute with the given name.
  * @description
  * Removes the attribute with the given name.
  * The trace will trigger a
  * {@link Samotraces.Trace#trace:edit_obsel} event
  * @todo TODO Check consistency with KTBS API.
  * @param {String} attr Attribute name.
*/
  del_attribute:			function(attr) {
  "use strict";
  delete this.attributes[attr];
  this.trace.trigger('trace:edit_obsel', this);
  // TODO envoyer un event pour dier que l'obsel a changé
},
  /**
  * @summary
  * Adds a relation with an Obsel.
  * @description
  * NOT YET IMPLEMENTED
  * @param {String} rel Relation type.
  * @param {Obsel} obs Target Obsel.
  * @todo TODO Check consistency with KTBS API
*/
  add_related_obsel:		function(rel, obs) {
  "use strict";

  // TODO
  throw "method not implemented yet";
  // TODO envoyer un event pour dier que l'obsel a changé
},
  /**
  * @summary
  * Removes a relation with an Obsel.
  * @description
  * NOT YET IMPLEMENTED
  * @param {String} rel Relation type.
  * @param {Obsel} obs Target Obsel.
  * @todo TODO Check consistency with KTBS API
*/
  del_related_obsel:		function(rel, obs) {
  "use strict";

  // TODO
  throw "method not implemented yet";
  // TODO envoyer un event pour dier que l'obsel a changé
},

  // NOT IN KTBS API
  /**
  * @summary
  * Copies the Obsel properties in an Object.
  * @description
  * Copies the Obsel properties in an Object
  * that can be used to create an Obsel with
  * {@link Samotraces.Obsel#Obsel} constructor or
  * {@link Samotraces.Trace#create_obsel} method.
  * @returns {Object} Object that
*/
  to_Object: function() {
  "use strict";
  var obj = {
    id: this.id,
    type: this.type,
    begin: this.begin,
    end: this.end,
    attributes: {},
    // use .slice to copy
    // TODO is it enough? <- might create bugs
    relations: this.relations.slice(),
    inverse_relations: this.inverse_relations.slice(),
    source_obsels: this.source_obsels.slice(),
    label: this.label
  };
  // copy each attributes
  for (var attr in this.attributes) {
    if (this.attributes.hasOwnProperty(attr)) {
      obj.attributes[attr] = this.attributes[attr];
    }
  }
  return obj;
},
};

module.exports = Obsel;

},{"jquery":"jquery"}],31:[function(require,module,exports){
var EventHandler = require("./EventHandler.js");

/**
* Selector is a shortname for the
* {@link Samotraces.Selector}
* object.
* @typedef Selector
* @see Samotraces.Selector
*/
/**
* @summary Object that stores a selection of objects
* @class Object that stores a selection of objects
* @author Benoît Mathern
* @constructor
* @augments Samotraces.EventHandler
* @fires Samotraces.Selector#selection:add
* @fires Samotraces.Selector#selection:remove
* @fires Samotraces.Selector#selection:empty
* @description
* The {@link Samotraces.Selector|Selector} object
* is a Javascript object that stores a selection of Objects.
* This Object stores Objects that are selected and informs
* widgets or other objects (via the
* triggered events) when the selection changes.
* When first instanciated, the selection is empty.
*
* In order to select an object, the
* {@link Samotraces.Selector#select|Selector#select()}
* method has to be called.
* Similarly, in order to unselect an object, the
* {@link Samotraces.Selector#unselect|Selector#unselect()}
* method has to be called.
* The whole selection can be emptied at once with the
* {@link Samotraces.Selector#empty|Selector#empty()}
* method.
*
* @param {string} type - A string describing the type of
*     object to be selected ('Obsel', 'Trace', 'TimeWindow', etc.).
* @param {string} [selection_mode='single']
*     In 'single' mode, the selection contains one object maximum.
*     This means that adding an object to a non-empty selection
*     will replace the previously selected object with the new one.
*     In 'multiple' mode, the selection can be extended and objects
*     can be individually added or removed.
* @param {EventConfig}	[events]
*     Events to listen to and their corresponding callbacks.
*/
var Selector = function(type, selection_mode, events) {
  // Adding the Observable trait
  "use strict";
  EventHandler.call(this, events);
  this.mode = selection_mode || 'single'; // other option is 'multiple'
  this.type = type;
  this.selection = [];
  // TODO: ajouter eventListener sur Trace si type = obsel
  // -> Quand "trace:remove:obsel" -> vérifie si un obsel a
  // été supprimé de la sélection.
};

Selector.prototype = {
  /**
  * Method to call to select an Object.
  * @param {Object} object
  *     Object to add to the selection
  * @fires Samotraces.Selector#selection:add
  */
  select: function(object) {
    "use strict";

    if (this.mode === 'multiple') {
      this.selection.push(object);
    } else {
      this.selection = [object];
    }
    /**
    * Object selected event.
    * @event Samotraces.Selector#selection:add
    * @type {object}
    * @property {String} type - The type of the event (= "selection:add").
    * @property {Object} data - The selected object.
    */
    this.trigger('selection:add', object);
  },
  /**
  * Method to empty the current selection.
  * @fires Samotraces.Selector#selection:empty
  */
  empty: function() {
    "use strict";
    this.selection = [];
    /**
    * Object unselected event.
    * @event Samotraces.Selector#selection:empty
    * @type {object}
    * @property {String} type - The type of the event (= "selection:empty").
    */
    this.trigger('selection:empty');
  },
  /**
  * Method that checks if the selection is empty
  * @returns {Boolean} Returns true if the selection and empty
  *     and false if the selection is not empty.
  */
  is_empty: function() {
    "use strict";
    return (this.selection.length === 0);
  },
  /**
  * Gets the current selection
  * @returns {Array} Array of selected objects
  */
  get_selection: function() {
    "use strict";
    return this.selection;
  },
  /**
  * Method to call to remove an Object from the selection.
  * @param {Object} object
  *     Object to remove from the selection
  * @fires Samotraces.Selector#selection:remove
  */
  unselect: function(object) {
    "use strict";
    if (this.mode === 'multiple') {
      var found = false;
      this.selection = this.selection.filter(function(el) {
        if (el === object) {
          found = true;
          return false;
        } else {
          return true;
        }
      });
      if (!found) { return false; }
    } else {
      this.selection = [];
    }
    /**
    * Object unselected event.
    * @event Samotraces.Selector#selection:remove
    * @type {object}
    * @property {String} type - The type of the event (= "selection:remove").
    */
    this.trigger('selection:remove', object);
    return true;
  },
  /**
  * Method to call to toggle the selection of an Object.
  * If the Object was previously unselected, it becomes selected.
  * If the Object was previously selected, it becomes unselected.
  * @param {Object} object
  *    Object to toggle from the selection
  */
  toggle: function(object) {
    "use strict";
    if (this.mode === 'multiple') {
      if (!this.unselect(object)) {
        this.select(object);
      }
    } else {
      if (this.selection.length === 0 || this.selection[0] !== object) {
        this.select(object);
      } else {
        this.unselect(object);
      }
    }
  }
};

module.exports = Selector;

},{"./EventHandler.js":22}],32:[function(require,module,exports){
var EventHandler = require("./EventHandler.js");

/**
* TimeWindow is a shortname for the
* {@link Samotraces.TimeWindow}
* object.
* @typedef TimeWindow
* @see Samotraces.TimeWindow
*/
/**
* @summary Object that stores the current time window
* @class Object that stores the current time window
* @author Benoît Mathern
* @constructor
* @augments Samotraces.EventHandler
* @description
* The {@link Samotraces.TimeWindow} object is a Javascript Object
* that stores the current time window.
* This Object stores a time window and informs widgets or other
* objects when the time window changes via the
* {@link Samotraces.TimeWindow#tw:update|tw:update}
* event.
* A {@link Samotraces.TimeWindow|TimeWindow} can be defined in two ways:
*
* 1.  by defining a lower and upper bound
* 2.  by defining a timer and a width.
*
* @param {Object} opt	Option parameter that defines the time
*     window. Variables opt.start and opt.end must
*     be defined if using lower and upper bound definition.
*     Variables opt.timer and opt.width must
*     be defined if using timer and width definition.
* @param {Number} opt.start Starting time of the time window (lower bound).
* @param {Number} opt.end Ending time of the time window (upper bound).
* @param {Samotraces.Timer} opt.timer Timer object, which time
*     is used to define the middle of the current time window.
* @param {Number} opt.width Width of the time window.
*
*/
var TimeWindow = function TimeWindow(opt) {
  // Adding the Observable trait
  "use strict";
  EventHandler.call(this);
  if (opt.start !== undefined && opt.end  !== undefined) {
    this.start = opt.start;
    this.end = opt.end;
    this.__calculate_width();
  } else if (opt.timer !== undefined && opt.width  !== undefined) {
    this.set_width(opt.width, opt.timer.time);
    this.timer = opt.timer;
    this.timer.on('timer:update', this._private_updateTime.bind(this));
    this.timer.on('timer:play:update', this._private_updateTime.bind(this));
  } else {
    throw('Samotraces.TimeWindow error. Arguments could not be parsed.');
  }
};

TimeWindow.prototype = {

  __calculate_width: function() {
    "use strict";
    this.width = this.end - this.start;
  },
  _private_updateTime: function(e) {
    "use strict";
    var time = e.data;
    var delta = time - (this.start + this.width / 2);

    this.start = time - this.width / 2;
    this.end = time + this.width / 2;
    this.trigger('tw:translate', delta);

    //		this.set_width(this.width,time);
  },
  /**
  * Sets the start time of the time window.
  * @param {Number} time Starting time of the time window.
  * @fires Samotraces.TimeWindow#tw:update
  */
  set_start: function(time) {
    "use strict";
    if (this.start !== time) {
      this.start = time;
      this.__calculate_width();
      /**
      * Time window change event.
      * @event Samotraces.TimeWindow#tw:update
      * @type {object}
      * @property {String} type - The type of the event (= "tw:update").
     */
      this.trigger('tw:update');
    }
  },
  /**
  * Sets the end time of the time window.
  * @param {Number} time Ending time of the time window.
  * @fires Samotraces.TimeWindow#tw:update
 */
  set_end: function(time) {
    "use strict";
    if (this.end !== time) {
      this.end = time;
      this.__calculate_width();
      this.trigger('tw:update');
    }
  },
  /**
  * Gets the width of the time window (duration between start and end)
  * @returns {Number} Width of the time window
  */
  get_width: function() {
    "use strict";
    return this.width;
  },
  /**
  * Sets the width of the time of the time window.
  * @param {Number} width New width of the time window.
  * @param {Number} [center=(start+end)/2] New center of the time window.
  * @fires Samotraces.TimeWindow#tw:update
  */
  set_width: function(width, center) {
    "use strict";
    if (center === undefined) {
      center = this.start + this.width / 2;
    }
    this.start = center - width / 2;
    this.end = center + width / 2;
    this.width = width;
    this.trigger('tw:update');
  },
  /**
  * Translates the time window with a time delta.
  * @param {Number} delta Time deltat that will be added to the time window.
  * @fires Samotraces.TimeWindow#tw:translate
  */
  translate: function(delta) {
    "use strict";
    if (this.timer) {
      this.timer.set(this.timer.time + delta);
    } else {
      this.start = this.start + delta;
      this.end = this.end + delta;
      this.trigger('tw:translate', delta);
    }
  },
  /**
  * Zooms the timewindow by multiplying the current width
  * by the given coefficient. Zoom in if the coefficient
  * is less than 1 and out if it is more than 1.
  * @param {Number} coef Coefficient of the zoom to apply.
  */
  zoom: function(coef) {
    "use strict";
    this.set_width(this.width * coef);
  },
};

module.exports = TimeWindow;

},{"./EventHandler.js":22}],33:[function(require,module,exports){
var EventHandler = require("./EventHandler.js");

/**
* @summary Object that stores the current time
* @class Object that stores the current time
* @author Benoît Mathern
* @constructor
* @augments Samotraces.EventHandler
* @fires Samotraces.Timer#timer:update
* @description
* Samotraces.Timer is a Javascript object that stores
* the current time.
* This Object stores a time and informs widgets or other
* objects when the time changes.
*
* @param {Number} [init_time=0]
*     Initial time of the timer (optional, default: 0).
* @param {Number} [period=2000]
*     Perdiod (in ms) at which the timer will update itself in
*     "play" mode.
* @param {function} [update_function]
*     Function called to update the timer when in "play" mode
*     (function that returns the value of
*     <code>Date.now()</code> by default).
*/

var Timer = function Timer(init_time, period, update_function) {
  // Adding the Observable trait
  "use strict";
  EventHandler.call(this);
  this.time = init_time || 0;
  this.period = period || 2000;
  this.update_function = update_function || function() {return Date.now();};
  this.is_playing = false;
};

Timer.prototype = {
  /**
  * Sets the Timer to the given time.
  * @fires Samotraces.Timer#timer:update
  * @param {Number} time New time
*/
  set_time: function(time) {
    "use strict";
    var new_time = Number(time);
    if (this.time !== new_time) {
      this.time = new_time;
      /**
      * Time change event.
      * @event Samotraces.Timer#timer:update
      * @type {object}
      * @property {String} type - The type of the event (= "timer:update").
*/
      this.trigger('timer:update', this.time);
    }
  },
  /**
  * Sets the Timer to the given time.
  * @deprecated Use {@link Samotraces.Timer.set_time|set_time} instead.
  * @fires Samotraces.Timer#timer:update
  * @param {Number} time New time
*/
  set: function(t) {
    "use strict";
  return this.set_time(t); },
  /**
  * Gets the current time of the Timer
  * @returns {Number} Current time of the Timer.
*/
  get_time: function() {
    "use strict";
    return this.time;
  },
  /**
  * Sets or get the Timer's current time.
  * If no parameter is given, the current time is returned.
  * Otherwise, sets the Timer to the givent time.
  * @fires Samotraces.Timer#timer:update
  * @param {Number} [time] New time
*/
  time: function(time) {
    "use strict";
    if (time) {
      var new_time = Number(time);
      if (this.time !== new_time) {
        this.time = new_time;
        this.trigger('timer:update', this.time);
      }
    } else {
      return this.time;
    }
  },

  /**
  * Starts the play mode: the timer will be updated
  * according to the update_function every period
  * as specified at the initialisation of the Timer.
  * @todo SPECIFY WAYS TO CHANGE PERIOD AND UPDATE_FUNCTIOn
*/
  play: function() {
    "use strict";
    /*var update = function() {
    this.time = this.update_function(this.time);
    /**
    * Time change event (actualising time when playing)
    * @event Samotraces.Timer#timer:play:update
    * @type {object}
    * @property {String} type
    *     - The type of the event (= "timer:play:update").
    */
    /*this.trigger('timer:play:update',this.time);
    };
		*/
    this.interval_id = window.setInterval(this.update_function.bind(this), this.period);
    this.is_playing = true;
    this.trigger('timer:play', this.time);
  },
  /**
  * Stops the play mode.
*/
  pause: function() {
    "use strict";
    window.clearInterval(this.interval_id);
    this.is_playing = false;
    this.trigger('timer:pause', this.time);
  }
};

module.exports = Timer;

},{"./EventHandler.js":22}],34:[function(require,module,exports){
var EventHandler = require("./core/EventHandler.js");
var KTBSResource = require("./core/KTBS.Resource.js");
var Obsel = require("./core/Obsel.js");
var TimeWindow = require("./core/TimeWindow.js");
var Timer = require("./core/Timer.js");
var Selector = require("./core/Selector.js");
var LocalTrace = require("./core/LocalTrace.js");
var Ktbs = require("./core/KTBS.js");
var KtbsModel = require("./core/KTBS.Model.js");
var KtbsBase = require("./core/KTBS.Base.js");
var KtbsTrace = require("./core/KTBS.Trace.js");

var ImportTrace = require("./UI/Widgets/ImportTrace.js");
var IntervalTimeForm = require("./UI/Widgets/IntervalTimeForm.js");
var ListBases = require("./UI/Widgets/ListBases.js");
var ListModelInBases = require("./UI/Widgets/ListModelInBases.js");
var ListTracesInBases = require("./UI/Widgets/ListTracesInBases.js");
var ObselInspector = require("./UI/Widgets/ObselInspector.js");
var ObselTypeInspector = require("./UI/Widgets/ObselTypeInspector.js");
var ReadableTimeForm = require("./UI/Widgets/ReadableTimeForm.js");
var TimeForm = require("./UI/Widgets/TimeForm.js");
var TimeSlider = require("./UI/Widgets/TimeSlider.js");
var TraceDisplayIcons = require("./UI/Widgets/TraceDisplayIcons.js");
var TraceDisplayIconsFix = require("./UI/Widgets/TraceDisplayIconsFix.js");
var TraceDisplayIconsZoom = require("./UI/Widgets/TraceDisplayIconsZoom.js");
var TraceDisplayObselOccurrences = require("./UI/Widgets/TraceDisplayObselOccurrences.js");
var TraceDisplayText = require("./UI/Widgets/TraceDisplayText.js");
var TraceDisplayZoomContext = require("./UI/Widgets/TraceDisplayZoomContext.js");
var DisplayModel = require("./UI/Widgets/DisplayModel.js");
var WindowScale = require("./UI/Widgets/WindowScale.js");
var WindowScaleFix = require("./UI/Widgets/WindowScaleFix.js");
var WindowSlider = require("./UI/Widgets/WindowSlider.js");

var Samotraces = {
  Obsel: Obsel,
  TimeWindow: TimeWindow,
  Timer: Timer,
  Selector: Selector,
  EventHandler: EventHandler,
  LocalTrace: LocalTrace,
  Ktbs: {
    Ktbs: Ktbs,
    Resource: KTBSResource,
    Model: KtbsModel,
    Base: KtbsBase,
    Trace: KtbsTrace,
  },
  Ui: {
    Widgets: {
      ImportTrace: ImportTrace,
      IntervalTimeForm: IntervalTimeForm,
      ObselInspector: ObselInspector,
      ObselTypeInspector: ObselTypeInspector,
      ReadableTimeForm: ReadableTimeForm,
      TimeForm: TimeForm,
      TimeSlider: TimeSlider,
      TraceDisplayIcons: TraceDisplayIcons,
      TraceDisplayIconsFix: TraceDisplayIconsFix,
      TraceDisplayIconsZoom: TraceDisplayIconsZoom,
      TraceDisplayObselOccurrences: TraceDisplayObselOccurrences,
      TraceDisplayText: TraceDisplayText,
      TraceDisplayZoomContext: TraceDisplayZoomContext,
      DisplayModel: DisplayModel,
      WindowScale: WindowScale,
      WindowScaleFix: WindowScaleFix,
      WindowSlider: WindowSlider,
      Ktbs: {
        ListBases: ListBases,
        ListModelInBases: ListModelInBases,
        ListTracesInBases: ListTracesInBases,
      }
    },
  },
};

module.exports = Samotraces;

},{"./UI/Widgets/DisplayModel.js":1,"./UI/Widgets/ImportTrace.js":2,"./UI/Widgets/IntervalTimeForm.js":3,"./UI/Widgets/ListBases.js":4,"./UI/Widgets/ListModelInBases.js":5,"./UI/Widgets/ListTracesInBases.js":6,"./UI/Widgets/ObselInspector.js":7,"./UI/Widgets/ObselTypeInspector.js":8,"./UI/Widgets/ReadableTimeForm.js":9,"./UI/Widgets/TimeForm.js":10,"./UI/Widgets/TimeSlider.js":11,"./UI/Widgets/TraceDisplayIcons.js":12,"./UI/Widgets/TraceDisplayIconsFix.js":13,"./UI/Widgets/TraceDisplayIconsZoom.js":14,"./UI/Widgets/TraceDisplayObselOccurrences.js":15,"./UI/Widgets/TraceDisplayText.js":16,"./UI/Widgets/TraceDisplayZoomContext.js":17,"./UI/Widgets/WindowScale.js":19,"./UI/Widgets/WindowScaleFix.js":20,"./UI/Widgets/WindowSlider.js":21,"./core/EventHandler.js":22,"./core/KTBS.Base.js":23,"./core/KTBS.Model.js":24,"./core/KTBS.Resource.js":26,"./core/KTBS.Trace.js":27,"./core/KTBS.js":28,"./core/LocalTrace.js":29,"./core/Obsel.js":30,"./core/Selector.js":31,"./core/TimeWindow.js":32,"./core/Timer.js":33}]},{},[34])(34)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVUkvV2lkZ2V0cy9EaXNwbGF5TW9kZWwuanMiLCJzcmMvVUkvV2lkZ2V0cy9JbXBvcnRUcmFjZS5qcyIsInNyYy9VSS9XaWRnZXRzL0ludGVydmFsVGltZUZvcm0uanMiLCJzcmMvVUkvV2lkZ2V0cy9MaXN0QmFzZXMuanMiLCJzcmMvVUkvV2lkZ2V0cy9MaXN0TW9kZWxJbkJhc2VzLmpzIiwic3JjL1VJL1dpZGdldHMvTGlzdFRyYWNlc0luQmFzZXMuanMiLCJzcmMvVUkvV2lkZ2V0cy9PYnNlbEluc3BlY3Rvci5qcyIsInNyYy9VSS9XaWRnZXRzL09ic2VsVHlwZUluc3BlY3Rvci5qcyIsInNyYy9VSS9XaWRnZXRzL1JlYWRhYmxlVGltZUZvcm0uanMiLCJzcmMvVUkvV2lkZ2V0cy9UaW1lRm9ybS5qcyIsInNyYy9VSS9XaWRnZXRzL1RpbWVTbGlkZXIuanMiLCJzcmMvVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29ucy5qcyIsInNyYy9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheUljb25zRml4LmpzIiwic3JjL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5SWNvbnNab29tLmpzIiwic3JjL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcy5qcyIsInNyYy9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheVRleHQuanMiLCJzcmMvVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlab29tQ29udGV4dC5qcyIsInNyYy9VSS9XaWRnZXRzL1dpZGdldC5qcyIsInNyYy9VSS9XaWRnZXRzL1dpbmRvd1NjYWxlLmpzIiwic3JjL1VJL1dpZGdldHMvV2luZG93U2NhbGVGaXguanMiLCJzcmMvVUkvV2lkZ2V0cy9XaW5kb3dTbGlkZXIuanMiLCJzcmMvY29yZS9FdmVudEhhbmRsZXIuanMiLCJzcmMvY29yZS9LVEJTLkJhc2UuanMiLCJzcmMvY29yZS9LVEJTLk1vZGVsLmpzIiwic3JjL2NvcmUvS1RCUy5PYnNlbC5qcyIsInNyYy9jb3JlL0tUQlMuUmVzb3VyY2UuanMiLCJzcmMvY29yZS9LVEJTLlRyYWNlLmpzIiwic3JjL2NvcmUvS1RCUy5qcyIsInNyYy9jb3JlL0xvY2FsVHJhY2UuanMiLCJzcmMvY29yZS9PYnNlbC5qcyIsInNyYy9jb3JlL1NlbGVjdG9yLmpzIiwic3JjL2NvcmUvVGltZVdpbmRvdy5qcyIsInNyYy9jb3JlL1RpbWVyLmpzIiwic3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDek1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgZGlzcGxheWluZyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbFxuICogQGNsYXNzIFdpZGdldCBmb3IgaW1wb3J0aW5nIGEgdHJhY2UgZnJvbSBhIENTViBmaWxlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm58RmF0bWEgRGVyYmVsXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAc2VlIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5CYXNpYy5JbXBvcnRUcmFjZVxuICogQHRvZG8gQVRURU5USU9OIGNvZGUgcXVpIHZpZW50IGQnYWlsbGV1cnMgIVxuICogQGRlc2NyaXB0aW9uIG5vIGRlc2NyaXB0aW9uXG4gKiBAcGFyYW0ge29iamVjdH1cdGh0bWxFbGVtZW50XG4gKiAgICAgVGhlIEhUTUwgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgd2lkZ2V0XG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVHJhY2V9IHRyYWNlXG4gKiAgICAgVHJhY2Ugb2JqZWN0IGluIHdoaWNoIHRoZSBvYnNlbHMgd2lsbCBiZSBpbXBvcnRlZC5cbiAqL1xuXG52YXIgRGlzcGxheU1vZGVsID0gZnVuY3Rpb24oaHRtbEVsZW1lbnQsIG1vZGVsLCBvcHRpb25zKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAvL29wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sRWxlbWVudCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VNb2RlbCcpO1xuICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIHRoaXMubW9kZWwub24oJ01vZGVsOkRyYXdfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdmFyIHRoaXNfd2lkZ2V0ID0gdGhpcztcbiAgdGhpcy5tb2RlbC5vbignTW9kZWw6bGlzdGVUeXBlJywgZnVuY3Rpb24oZSkge1xuICAgIHRoaXNfd2lkZ2V0LmRhdGEgPSBlLmRhdGE7XG4gICAgdGhpc193aWRnZXQuZHJhdygpO1xuXG4gIH0pO1xuICB2YXIgYmluZF9mdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbF9vcl9mdW4pIHtcbiAgICBpZiAodmFsX29yX2Z1biBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bi5iaW5kKHRoaXNfd2lkZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW47XG4gICAgfVxuICB9O1xuICB2YXIgeCA9IDA7XG4gIHZhciB4MSA9IDE2O1xuICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgdGhpcy5vcHRpb25zLnlfSW1nID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnggfHwgZnVuY3Rpb24oKSB7XG4gICAgeCA9IHggKyAxNjtcbiAgICByZXR1cm4geDtcbiAgfSk7XG4gIHRoaXMub3B0aW9ucy55X3RleHQgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueCB8fCBmdW5jdGlvbigpIHtcbiAgICB4MSA9IHgxICsgMTY7XG4gICAgcmV0dXJuIHgxO1xuICB9KTtcbiAgLy90aGlzLm9wdGlvbnMueSA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy55IHx8IDE3KTtcbiAgLy90aGlzLm9wdGlvbnMud2lkdGggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMud2lkdGggfHwgMTYpO1xuICAvL3RoaXMub3B0aW9ucy5oZWlnaHQgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMuaGVpZ2h0IHx8IDE2KTtcbiAgLy90aGlzLm9wdGlvbnMudXJsID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnVybCB8fCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFHN0FBQUJ1d0JIblU0TlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBS3NTVVJCVkRpTnJaTkxhRk5wRk1kLzMzZnZUYTV0WXB1cTB5YXRGV3VnUmhFWHc5QXVoSkVaQkNraXFKV0NJRXJyeHAyNDFDNkw2NjUwTS9XQm93dW5veUNEQ2pLckdZWjBJYml3eGtkVWJHeWFQbWdTbThkOWYyNU1iWFVsekg5NXp2LzhPT2R3amxCS3NWYWpVMWtFdEppYXZOQnNhS2NCcXE1LzNmS0RTd3JLWTMzSmRYN1JBSXhPWlFHTTNiSEl5bUN5UFpoWnFUOHAyZDRzUUd0WTcreU9idmh4TWpzdnA0dVZLT0EyUUVJcHhlaFVGbDJJdnVGVVozclpjdS8rOVg3UldxZzdKeHcvUUFGaFRkTFJGSm9ZNk40U2F6T05vMWN6cy8yZVVsTmpmVW4wUmlzbmUrUHA5eXYxOFR2WndybDlpVmIySjJKRVFob0tLTmtlNlVKNTVMZk1CNGFTSGVNbmUrUHBheS95QWtCY1RMOW1hN05wN1l1My9uMWxPamRROHdMTzc5M0d6bGd6RmRjall1am9VcEF0MTdqOExJZmpCNXpkdmZYQnYzT2xYM05WeTVTQU9KVktoUDk0TTI5VVhCOEZGR29XRTg5bnVmVGtIUTluRmxFS2VqWnVvTGUxaVlycjgrZmJlZTlVS2hFR2hCNlNZckJvdWRQTHRuc0FRQ25GNzY4S3ExdjJBeEFDNmw3QXN1VUNzR1M1aDR1V094MlNZbEJxUW95VUhXL085Z08rMWk5ZGJmeWNpS0dBL3dvbDNwVHJBTmgrUU5ueDVqUWhSdVEzVlorMVoxT1VnOTJiaVprRy8rU0wzSHU3Z1BmVnpRQklYNm1KbHBBZUQydnJXZHMzbXRoK3dPdFNsVWN6UzFSZGZ6VVgxaVF0SVQzdUt6V2hPNEdhakpuR25jMm1jZitqNHgxdW1KNHVWU2hVYlJTd1VIUFd3ZHZDeHVPWWFSeHdBalVwQVhVams3ZVA5YlRyRVVOYk5mMzBRNVRoWFYwYzZXa25Hdm9TanhnYXgzZTB1emN5ZVJ0UWNxd3ZTYTVxbWFZdUI0YVNIZU1OaUVKZ2FoSjl6V1FSUTJNbzJURnU2bklnVjdYTWRaZDQ4K1ZjLzNDcU0zMG0xWFgzd2N4aThkM0gyc2l0bDNtVUFDa0V5WmFtMjRlMmJUSGJUT1BjMWN4c2Y2UHUvM21tdGZyZWQvNEVTUU5LWEc4VkFDb0FBQUFBU1VWT1JLNUNZSUk9Jyk7XG5cbiAgICAgdGhpcy5zdHlsZXNoZWV0ID0gb3B0aW9ucyB8fCB7fSA7XG5cblxufTtcblxuRGlzcGxheU1vZGVsLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuZGl2X2VsbXQgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJykuYXR0cignaGVpZ2h0JywgJzEwMDBweCcpO1xuICAgIC8vIGNyZWF0ZSB0aGUgKHJlZCkgbGluZSByZXByZXNlbnRpbmcgY3VycmVudCB0aW1lXG5cbiAgICB0aGlzLnggPSAxNjtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHZhciB4ID0gZDMudGltZS5zY2FsZSgpXG4gICAgICAuZG9tYWluKFtuZXcgRGF0ZSgyMDE0LCA0LCAxKSwgbmV3IERhdGUoMjAxNCwgNCwgMTUpIC0gMV0pXG4gICAgICAvLyAuZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSlcbiAgICAgIC5yYW5nZShbMCwgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXSk7XG5cbiAgICB2YXIgbWFyZ2luID0ge3RvcDogMjAwLCByaWdodDogNDAsIGJvdHRvbTogMjAwLCBsZWZ0OiA0MH0sXG4gICAgICBoZWlnaHQgPSA1MDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgICAvKnRoaXMuc3ZnX2dwID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdGhpcy5zdmdfdGV4dCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpOyovXG4gICAgdGhpcy5zdmdfc2VsZWN0ZWRfb2JzZWwgPSBkaXZfZWxtdC5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgIC5hdHRyKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAgICAgLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgfSxcbiAgZDNPYnNlbHM6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLnN2Z19ncFxuICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlLGltYWdlLHJlY3QnKVxuICAgICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcblxuICBkM09ic2Vsc3RleHQ6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLnN2Z190ZXh0XG4gICAgICAuc2VsZWN0QWxsKCdjaXJjbGUsaW1hZ2UscmVjdCcpXG4gICAgICAvLyBUT0RPOiBBVFRFTlRJT04hIFdBUk5JTkchIG9ic2VscyBNVVNUIGhhdmUgYSBmaWVsZCBpZCAtPiB1c2VkIGFzIGEga2V5LlxuICAgICAgLy8uZGF0YSh0aGlzLmRhdGEpOyAvLyxmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pO1xuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pOyAvLyBUT0RPOiBib2d1ZSBpbiBjYXNlIG5vIElEIGV4aXN0cyAtPiBtaWdodCBoYXBwZW4gd2l0aCBLVEJTIHRyYWNlcyBhbmQgbmV3IG9ic2Vsc1xuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgaW1hZ2VzID0gdGhpcy5zdmcuc2VsZWN0QWxsKFwiY2lyY2xlLGltYWdlLHJlY3RcIilcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkge1xuICAgICAgICByZXR1cm4gZC5pZDtcbiAgICAgIH0pXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcImltYWdlXCIpO1xuXG5cblxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgZ2V0SWNvblBhdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBgYHNlbGZgYGBpcyB0aGUgd2lkZ2V0IGluc3RhbmNlXG4gICAgICB2YXIgc2VsZiA9IHRoYXQ7XG5cbiAgICAgIC8vIGBgdGhpc2BgIGlzIHRoZSBET00gZWxlbWVudCB3aGVyZSBkMyBpcyBzZXR0aW5nIHRoaW5nc1xuXG4gICAgICB2YXIgdHlwZSA9IHRoaXMuX19kYXRhX18udHlwZTtcbiAgICAgIGlmIChzZWxmLnN0eWxlc2hlZXRbdHlwZV0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldFt0eXBlXS5pY29uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldC5kZWZhdWx0Lmljb247XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBnZXRXaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGBgc2VsZmBgYGlzIHRoZSB3aWRnZXQgaW5zdGFuY2VcbiAgICAgIHZhciBzZWxmID0gdGhhdDtcblxuICAgICAgLy8gYGB0aGlzYGAgaXMgdGhlIERPTSBlbGVtZW50IHdoZXJlIGQzIGlzIHNldHRpbmcgdGhpbmdzXG5cbiAgICAgIHZhciB0eXBlID0gdGhpcy5fX2RhdGFfXy50eXBlO1xuICAgICAgaWYgKHNlbGYuc3R5bGVzaGVldFt0eXBlXSkge1xuICAgICAgICByZXR1cm4gc2VsZi5zdHlsZXNoZWV0W3R5cGVdLndpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldC5kZWZhdWx0LndpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBnZXRIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBgYHNlbGZgYGBpcyB0aGUgd2lkZ2V0IGluc3RhbmNlXG4gICAgICB2YXIgc2VsZiA9IHRoYXQ7XG5cbiAgICAgIC8vIGBgdGhpc2BgIGlzIHRoZSBET00gZWxlbWVudCB3aGVyZSBkMyBpcyBzZXR0aW5nIHRoaW5nc1xuXG4gICAgICB2YXIgdHlwZSA9IHRoaXMuX19kYXRhX18udHlwZTtcbiAgICAgIGlmIChzZWxmLnN0eWxlc2hlZXRbdHlwZV0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldFt0eXBlXS5oZWlnaHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5zdHlsZXNoZWV0LmRlZmF1bHQuaGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBnZXRZID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gYGBzZWxmYGBgaXMgdGhlIHdpZGdldCBpbnN0YW5jZVxuICAgICAgdmFyIHNlbGYgPSB0aGF0O1xuXG4gICAgICAvLyBgYHRoaXNgYCBpcyB0aGUgRE9NIGVsZW1lbnQgd2hlcmUgZDMgaXMgc2V0dGluZyB0aGluZ3NcblxuICAgICAgdmFyIHR5cGUgPSB0aGlzLl9fZGF0YV9fLnR5cGU7XG4gICAgICBpZiAoc2VsZi5zdHlsZXNoZWV0W3R5cGVdKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXRbdHlwZV0ueTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXQuZGVmYXVsdC55O1xuICAgICAgfVxuICAgIH1cblxuXG4gICAgdmFyIGltYWdlc19hdHQgPSAgaW1hZ2VzLmF0dHIoJ2NsYXNzJywgJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLm9wdGlvbnMueV9JbWcpXG4gICAgICAuYXR0cigneCcsIDE3KVxuICAgICAgLmF0dHIoJ3dpZHRoJywgZ2V0V2lkdGgpXG4gICAgICAuYXR0cignaGVpZ2h0JywgZ2V0SGVpZ2h0KVxuICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBnZXRJY29uUGF0aCk7XG4gICAgICAvLy5hdHRyKCd4bGluazpocmVmJywgdGhpcy5vcHRpb25zLnVybCk7XG4gICAgICAvLy5hdHRyKCd4bGluazpocmVmJywgJ2ltYWdlcy9PcmFuZ2UucG5nJyk7XG4gICAgdmFyIHRleHQgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIik7XG4gICAgdmFyIHRleHRMYWJlbHMgPSB0ZXh0XG4gICAgICAuYXR0cihcInhcIiwgJzM1JylcbiAgICAgIC5hdHRyKFwieVwiLCB0aGlzLm9wdGlvbnMueV90ZXh0KVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50eXBlO30pXG4gICAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsIFwic2Fucy1zZXJpZlwiKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgXCIxNXB4XCIpO1xuICAgICQoJ2ltYWdlJywgdGhpcy5lbGVtZW50KS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAkLmRhdGEoZWwsIHtcbiAgICAgICAgJ1NhbW90cmFjZXMtdHlwZSc6ICdvYnNlbCcsXG4gICAgICAgICdTYW1vdHJhY2VzLWRhdGEnOiBkMy5zZWxlY3QoZWwpLmRhdHVtKClcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuICByZWZyZXNoX3g6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAgIC5hdHRyKCd4JywgdGhpcy5vcHRpb25zLngpXG4gICAgICAuYXR0cigneScsIHRoaXMub3B0aW9ucy55KTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheU1vZGVsO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIGltcG9ydGluZyBhIHRyYWNlIGZyb20gYSBDU1YgZmlsZS5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIGltcG9ydGluZyBhIHRyYWNlIGZyb20gYSBDU1YgZmlsZS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAc2VlIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5CYXNpYy5JbXBvcnRUcmFjZVxuICogQHRvZG8gQVRURU5USU9OIGNvZGUgcXVpIHZpZW50IGQnYWlsbGV1cnMgIVxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUge0BsaW5rIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5CYXNpYy5JbXBvcnRUcmFjZX0gd2lkZ2V0IGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIGltcG9ydCBhIHRyYWNlIGZyb20gYSBDU1YgZmlsZS5cbiAqXG4gKiBUaGlzIHdpZGdldCBjdXJyZW50bHkgYWNjZXB0IHRoZSBmb2xsb3dpbmcgZm9ybWF0OlxuICpcbiAqIDEuIFRoZSBDU1YgZmlsZSBjYW4gdXNlIGVpdGhlciAnLCcgb3IgJzsnIGFzIGEgdmFsdWUgc2VwYXJhdG9yXG4gKiAyLiBFYWNoIGxpbmUgcmVwcmVzZW50cyBhbiBvYnNlbFxuICogMy4gVGhlIGZpcnN0IGNvbHVtbiByZXByZXNlbnRzIHRoZSB0aW1lIHdoZW4gdGhlIG9ic2VsIG9jY3Vyc1xuICogNC4gVGhlIHNlY29uZCBjb2x1bW4gcmVwcmVzZW50cyB0aGUgdHlwZSBvZiB0aGUgb2JzZWxcbiAqIDUuIFRoZSBmb2xsb3dpbmcgY29sdW1ucyByZXByZXNlbnQgcGFpcnMgb2YgXCJhdHRyaWJ1dGVcIiAvIFwidmFsdWVcIiBjb2x1bW5zXG4gKlxuICogVGhlIG51bWJlciBvZiBjb2x1bW5zIG1heSB2YXJ5IGZyb20gbGluZSB0byBsaW5lLlxuICogRm9yIGV4YW1wbGUsIGEgQ1NWIGZpbGUgbWlnaHQgbG9vayBsaWtlIHRoaXM6XG4gKiA8cHJlPlxuICogMCxjbGljayx0YXJnZXQsYnV0dG9uMlxuICogMixjbGljayx0YXJnZXQsYnV0dG9uMSx2YWx1ZSx0b3RvXG4gKiAzLGZvY3VzLHRhcmdldCxzdWJtaXRcbiAqIDUsY2xpY2ssdGFyZ2V0LHN1Ym1pdFxuICogPC9wcmU+XG4gKiBAdG9kbyBERVNDUklCRSBUSEUgRk9STUFUIE9GIFRIRSBDU1YgRklMRS5cbiAqIEBwYXJhbSB7b2JqZWN0fVx0aHRtbEVsZW1lbnRcbiAqICAgICBUaGUgSFRNTCBlbGVtZW50IHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHRoZSB3aWRnZXRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UcmFjZX0gdHJhY2VcbiAqICAgICBUcmFjZSBvYmplY3QgaW4gd2hpY2ggdGhlIG9ic2VscyB3aWxsIGJlIGltcG9ydGVkLlxuICovXG5cbnZhciBJbXBvcnRUcmFjZSA9IGZ1bmN0aW9uKGh0bWxFbGVtZW50LCB0cmFjZSkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBJbXBvcnRUcmFjZSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sRWxlbWVudCk7XG4gIHRoaXMudHJhY2UgPSB0cmFjZTtcbiAgdGhpcy5pbml0X0RPTSgpO1xufTtcblxuSW1wb3J0VHJhY2UucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgcF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnSW1wb3J0IGEgdHJhY2U6ICcpO1xuXG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2ZpbGUnKTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ2Nzdi1maWxlW10nKTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCdtdWx0aXBsZScsICd0cnVlJyk7XG4gICAgLy9cdFx0dGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsMTUpO1xuICAgIC8vXHRcdHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJyx0aGlzLnRpbWVyLnRpbWUpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmlucHV0X2VsZW1lbnQpO1xuXG4gICAgLy9cdFx0dmFyIHN1Ym1pdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAvL1x0XHRzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCdzdWJtaXQnKTtcbiAgICAvL1x0XHRzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywnSW1wb3J0Jyk7XG4gICAgLy9cdFx0cF9lbGVtZW50LmFwcGVuZENoaWxkKHN1Ym1pdF9lbGVtZW50KTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm9uX2NoYW5nZS5iaW5kKHRoaXMpKTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFwcGVuZENoaWxkKHBfZWxlbWVudCk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZm9ybV9lbGVtZW50KTtcblxuICAgIHZhciBidXR0b25fZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdmFyIGFfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYV9lbC5ocmVmID0gXCJcIjtcbiAgICBhX2VsLmlubmVySFRNTCA9IFwidG9nZ2xlIGNvbnNvbGVcIjtcbiAgICBidXR0b25fZWwuYXBwZW5kQ2hpbGQoYV9lbCk7XG4gICAgLy9cdFx0YnV0dG9uX2VsLmlubmVySFRNTCA9IFwiPGEgaHJlZj1cXFwiXFxcIj50b2dnbGUgY29uc29sZTwvYT5cIjtcbiAgICBhX2VsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbl90b2dnbGUuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGJ1dHRvbl9lbCk7XG5cbiAgICB0aGlzLmRpc3BsYXlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5kaXNwbGF5X2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRpc3BsYXlfZWxlbWVudCk7XG4gIH0sXG5cbiAgb25fY2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgZmlsZXMgPSBlLnRhcmdldC5maWxlcztcbiAgICB2YXIgdGl0bGVfZWwsIGNvbnRlbnRfZWw7XG4gICAgZm9yICh2YXIgaSA9IDAsIGZpbGU7IGZpbGUgPSBmaWxlc1tpXTsgaSsrKSB7XG4gICAgICB0aXRsZV9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMlwiKTtcbiAgICAgIHRpdGxlX2VsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGZpbGUubmFtZSkpO1xuICAgICAgdGhpcy5kaXNwbGF5X2VsZW1lbnQuYXBwZW5kQ2hpbGQodGl0bGVfZWwpO1xuICAgICAgY29udGVudF9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwcmVcIik7XG4gICAgICB2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgIHJlYWRlci5vbmxvYWQgPSAoZnVuY3Rpb24oZWwsIHBhcnNlciwgdHJhY2UpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBwYXJzZXIoZS50YXJnZXQucmVzdWx0LCB0cmFjZSk7XG4gICAgICAgICAgZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZS50YXJnZXQucmVzdWx0KSk7XG4gICAgICAgIH07XG4gICAgICB9KShjb250ZW50X2VsLCB0aGlzLnBhcnNlX2NzdiwgdGhpcy50cmFjZSk7XG4gICAgICAvKlx0XHRcdHJlYWRlci5vbnByb2dyZXNzID0gZnVuY3Rpb24oZSkge1xuICAgICAgXHRcdFx0XHRjb25zb2xlLmxvZyhlKTtcbiAgICAgIFx0XHRcdH07Ki9cbiAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGUpO1xuICAgICAgdGhpcy5kaXNwbGF5X2VsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGVudF9lbCk7XG4gICAgICB0aGlzLnRyYWNlLnRyaWdnZXIgKFwiYmVmb3JMb2FkRmlsZVwiKTtcbiAgICB9XG4gIH0sXG5cbiAgb25fdG9nZ2xlOiBmdW5jdGlvbihlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLmRpc3BsYXlfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSBcIm5vbmVcIikge1xuICAgICAgdGhpcy5kaXNwbGF5X2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kaXNwbGF5X2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIHBhcnNlX2NzdjogZnVuY3Rpb24odGV4dCwgdHJhY2UpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vZnVuY3Rpb24gY3N2VG9BcnJheSgpIGZyb21cbiAgICAvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzEyOTMxNDcvamF2YXNjcmlwdC1jb2RlLXRvLXBhcnNlLWNzdi1kYXRhXG5cbiAgICAvLyBUaGlzIHdpbGwgcGFyc2UgYSBkZWxpbWl0ZWQgc3RyaW5nIGludG8gYW4gYXJyYXkgb2ZcbiAgICAvLyBhcnJheXMuIFRoZSBkZWZhdWx0IGRlbGltaXRlciBpcyB0aGUgY29tbWEsIGJ1dCB0aGlzXG4gICAgLy8gY2FuIGJlIG92ZXJyaWRlbiBpbiB0aGUgc2Vjb25kIGFyZ3VtZW50LlxuICAgIGZ1bmN0aW9uIGNzdlRvQXJyYXkoc3RyRGF0YSwgc3RyRGVsaW1pdGVyKSB7XG4gICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGRlbGltaXRlciBpcyBkZWZpbmVkLiBJZiBub3QsXG4gICAgICAvLyB0aGVuIGRlZmF1bHQgdG8gY29tbWEuXG4gICAgICBzdHJEZWxpbWl0ZXIgPSAoc3RyRGVsaW1pdGVyIHx8IFwiLFwiKTtcblxuICAgICAgLy8gQ3JlYXRlIGEgcmVndWxhciBleHByZXNzaW9uIHRvIHBhcnNlIHRoZSBDU1YgdmFsdWVzLlxuICAgICAgdmFyIG9ialBhdHRlcm4gPSBuZXcgUmVnRXhwKFxuICAgICAgKFxuICAgICAgLy8gRGVsaW1pdGVycy5cbiAgICAgIFwiKFxcXFxcIiArIHN0ckRlbGltaXRlciArIFwifFxcXFxyP1xcXFxufFxcXFxyfF4pXCIgK1xuXG4gICAgICAvLyBRdW90ZWQgZmllbGRzLlxuICAgICAgXCIoPzpcXFwiKFteXFxcIl0qKD86XFxcIlxcXCJbXlxcXCJdKikqKVxcXCJ8XCIgK1xuXG4gICAgICAvLyBTdGFuZGFyZCBmaWVsZHMuXG4gICAgICBcIihbXlxcXCJcXFxcXCIgKyBzdHJEZWxpbWl0ZXIgKyBcIlxcXFxyXFxcXG5dKikpXCJcbiAgICAgICksXG4gICAgICBcImdpXCJcbiAgICAgICk7XG5cbiAgICAgIC8vIENyZWF0ZSBhbiBhcnJheSB0byBob2xkIG91ciBkYXRhLiBHaXZlIHRoZSBhcnJheVxuICAgICAgLy8gYSBkZWZhdWx0IGVtcHR5IGZpcnN0IHJvdy5cbiAgICAgIHZhciBhcnJEYXRhID0gW1tdXTtcblxuICAgICAgLy8gQ3JlYXRlIGFuIGFycmF5IHRvIGhvbGQgb3VyIGluZGl2aWR1YWwgcGF0dGVyblxuICAgICAgLy8gbWF0Y2hpbmcgZ3JvdXBzLlxuICAgICAgdmFyIGFyck1hdGNoZXMgPSBudWxsO1xuXG4gICAgICAvLyBLZWVwIGxvb3Bpbmcgb3ZlciB0aGUgcmVndWxhciBleHByZXNzaW9uIG1hdGNoZXNcbiAgICAgIC8vIHVudGlsIHdlIGNhbiBubyBsb25nZXIgZmluZCBhIG1hdGNoLlxuICAgICAgd2hpbGUgKGFyck1hdGNoZXMgPSBvYmpQYXR0ZXJuLmV4ZWMoc3RyRGF0YSkpIHtcblxuICAgICAgICAvLyBHZXQgdGhlIGRlbGltaXRlciB0aGF0IHdhcyBmb3VuZC5cbiAgICAgICAgdmFyIHN0ck1hdGNoZWREZWxpbWl0ZXIgPSBhcnJNYXRjaGVzWyAxIF07XG5cbiAgICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBnaXZlbiBkZWxpbWl0ZXIgaGFzIGEgbGVuZ3RoXG4gICAgICAgIC8vIChpcyBub3QgdGhlIHN0YXJ0IG9mIHN0cmluZykgYW5kIGlmIGl0IG1hdGNoZXNcbiAgICAgICAgLy8gZmllbGQgZGVsaW1pdGVyLiBJZiBpZCBkb2VzIG5vdCwgdGhlbiB3ZSBrbm93XG4gICAgICAgIC8vIHRoYXQgdGhpcyBkZWxpbWl0ZXIgaXMgYSByb3cgZGVsaW1pdGVyLlxuICAgICAgICBpZiAoc3RyTWF0Y2hlZERlbGltaXRlci5sZW5ndGggJiYgKHN0ck1hdGNoZWREZWxpbWl0ZXIgIT09IHN0ckRlbGltaXRlcikpIHtcblxuICAgICAgICAgIC8vIFNpbmNlIHdlIGhhdmUgcmVhY2hlZCBhIG5ldyByb3cgb2YgZGF0YSxcbiAgICAgICAgICAvLyBhZGQgYW4gZW1wdHkgcm93IHRvIG91ciBkYXRhIGFycmF5LlxuICAgICAgICAgIGFyckRhdGEucHVzaChbXSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciBkZWxpbWl0ZXIgb3V0IG9mIHRoZSB3YXksXG4gICAgICAgIC8vIGxldCdzIGNoZWNrIHRvIHNlZSB3aGljaCBraW5kIG9mIHZhbHVlIHdlXG4gICAgICAgIC8vIGNhcHR1cmVkIChxdW90ZWQgb3IgdW5xdW90ZWQpLlxuICAgICAgICBpZiAoYXJyTWF0Y2hlc1sgMiBdKSB7XG5cbiAgICAgICAgICAvLyBXZSBmb3VuZCBhIHF1b3RlZCB2YWx1ZS4gV2hlbiB3ZSBjYXB0dXJlXG4gICAgICAgICAgLy8gdGhpcyB2YWx1ZSwgdW5lc2NhcGUgYW55IGRvdWJsZSBxdW90ZXMuXG4gICAgICAgICAgdmFyIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDIgXS5yZXBsYWNlKFxuICAgICAgICAgIG5ldyBSZWdFeHAoXCJcXFwiXFxcIlwiLCBcImdcIiksIFwiXFxcIlwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBXZSBmb3VuZCBhIG5vbi1xdW90ZWQgdmFsdWUuXG4gICAgICAgICAgdmFyIHN0ck1hdGNoZWRWYWx1ZSA9IGFyck1hdGNoZXNbIDMgXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIHZhbHVlIHN0cmluZywgbGV0J3MgYWRkXG4gICAgICAgIC8vIGl0IHRvIHRoZSBkYXRhIGFycmF5LlxuICAgICAgICBhcnJEYXRhWyBhcnJEYXRhLmxlbmd0aCAtIDEgXS5wdXNoKHN0ck1hdGNoZWRWYWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJldHVybiB0aGUgcGFyc2VkIGRhdGEuXG4gICAgICByZXR1cm4gKGFyckRhdGEpO1xuICAgIH1cblxuICAgIC8vIGNvbnNvbGUubG9nKCdmaWNoaWVyIGNoYXJnw6knKTtcbiAgICAvLyBHdWVzc2luZyB0aGUgc2VwYXJhdG9yXG4gICAgdmFyIHNlcCA9IHRleHRbdGV4dC5zZWFyY2goXCJbLDtcXHRdXCIpXTtcbiAgICB2YXIgY3N2ID0gY3N2VG9BcnJheSh0ZXh0LCBzZXApO1xuICAgIGNzdi5wb3AoKTsgLy8gcmVtb3ZlIHRoZSBsYXN0IGxpbmUuLi4gV2h5Py4uLlxuICAgIC8vXHRjb25zb2xlLmxvZygnZmljaGllciBwYXJzw6knKTtcbiAgICBjc3YubWFwKGZ1bmN0aW9uKGxpbmUsaikge1xuICAgICAgdmFyIG9fYXR0ciA9IHt9O1xuICAgICAgb19hdHRyLmJlZ2luID0gbGluZS5zaGlmdCgpO1xuICAgICAgb19hdHRyLnR5cGUgPSBsaW5lLnNoaWZ0KCk7XG4gICAgICBvX2F0dHIuYXR0cmlidXRlcyA9IHt9O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAobGluZS5sZW5ndGggLSAxKSAvIDIgOyBpKyspIHtcbiAgICAgICAgaWYgKGxpbmVbMiAqIGldICE9PSBcIlwiKSB7XG4gICAgICAgICAgb19hdHRyLmF0dHJpYnV0ZXNbbGluZVsyICogaV1dID0gbGluZVsyICogaSArIDFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoaj09PTApIHt0cmFjZS50cmlnZ2VyIChcImZpcnN0T2JzZWxMb2NhbFwiLG9fYXR0cil9O1xuICAgICAgaWYgKGo9PT1jc3YubGVuZ3RoLTEpIHt0cmFjZS50cmlnZ2VyIChcIkxhc3RPYnNlbExvY2FsXCIsb19hdHRyKX07XG5cbiAgICAgIHRyYWNlLmNyZWF0ZV9vYnNlbChvX2F0dHIpO1xuICAgIH0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEltcG9ydFRyYWNlO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcblxudmFyIEludGVydmFsVGltZUZvcm0gPSBmdW5jdGlvbihodG1sX2lkLCB0aW1lV2luZG93KSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtUmVhZGFibGVUaW1lRm9ybScpO1xuICB0aGlzLndpbmRvdyA9IHRpbWVXaW5kb3c7XG4gIHRoaXMud2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93Lm9uKCd0dzp0cmFuc2xhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG4gIC8vdGhpcy50aW1lci5vbigndGltZXI6dXBkYXRlJyx0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG4gIC8vdGhpcy50aW1lci5vbigndGltZXI6cGxheTp1cGRhdGUnLHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcbiAgdGhpcy5pbml0X0RPTSgpO1xuICB0aGlzLnJlZnJlc2goKTtcblx0fTtcblxuSW50ZXJ2YWxUaW1lRm9ybS5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuICAgIHZhciBwX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdGUk9NOiAnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAneWVhcicpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDQpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMueWVhcl9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy8nKSk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ21vbnRoJyk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1vbnRoX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLycpKTtcbiAgICB0aGlzLmRheV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnZGF5Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF5X2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIC0gJykpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdob3VyJyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5ob3VyX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnOicpKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbWludXRlJyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWludXRlX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnOicpKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnc2Vjb25kJyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCA4KTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuc2Vjb25kX2VsZW1lbnQpO1xuXG4gICAgLy92YXIgcF9lbGVtZW50MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB2YXIgdGV4dF9ub2RlMSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdUbzogJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRleHRfbm9kZTEpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnbmFtZScsICd5ZWFyJyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnc2l6ZScsIDQpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnllYXJfZWxlbWVudDEpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLycpKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9udGgnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tb250aF9lbGVtZW50MSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcvJykpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmRheV9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnbmFtZScsICdkYXknKTtcbiAgICB0aGlzLmRheV9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLmRheV9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRheV9lbGVtZW50MSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgLSAnKSk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ2hvdXInKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaG91cl9lbGVtZW50MSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCc6JykpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnbmFtZScsICdtaW51dGUnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1pbnV0ZV9lbGVtZW50MSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCc6JykpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnbmFtZScsICdzZWNvbmQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3NpemUnLCA4KTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNlY29uZF9lbGVtZW50MSk7XG5cblxuXG5cblxuICAgIHZhciBzdWJtaXRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgc3VibWl0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3N1Ym1pdCcpO1xuICAgIHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnVXBkYXRlIHRpbWUnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoc3VibWl0X2VsZW1lbnQpO1xuICAgIHRoaXMuZm9ybV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuYnVpbGRfY2FsbGJhY2soJ3N1Ym1pdCcpKTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFwcGVuZENoaWxkKHBfZWxlbWVudCk7XG5cblxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmZvcm1fZWxlbWVudCk7XG4gIH0sXG4gIHJlZnJlc2g6IGZ1bmN0aW9uKCkge1xuXG4gICAgdGltZXN0YXJ0ID0gdGhpcy53aW5kb3cuc3RhcnQ7XG4gICAgdGltZUVuZCA9IHRoaXMud2luZG93LmVuZDtcblxuICAgIHZhciBkYXRlc3RhcnQgPSBuZXcgRGF0ZSgpO1xuICAgIGRhdGVzdGFydC5zZXRUaW1lKHRpbWVzdGFydCk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQudmFsdWUgICA9IGRhdGVzdGFydC5nZXRGdWxsWWVhcigpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC52YWx1ZSAgPSBkYXRlc3RhcnQuZ2V0TW9udGgoKSArIDE7XG4gICAgdGhpcy5kYXlfZWxlbWVudC52YWx1ZSAgICA9IGRhdGVzdGFydC5nZXREYXRlKCk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQudmFsdWUgICA9IGRhdGVzdGFydC5nZXRIb3VycygpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQudmFsdWUgPSBkYXRlc3RhcnQuZ2V0TWludXRlcygpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQudmFsdWUgPSBkYXRlc3RhcnQuZ2V0U2Vjb25kcygpICsgZGF0ZXN0YXJ0LmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMDtcblxuICAgIHZhciBkYXRlRW5kID0gbmV3IERhdGUoKTtcbiAgICBkYXRlRW5kLnNldFRpbWUodGltZUVuZCk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQxLnZhbHVlICAgPSBkYXRlRW5kLmdldEZ1bGxZZWFyKCk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50MS52YWx1ZSAgPSBkYXRlRW5kLmdldE1vbnRoKCkgKyAxO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQxLnZhbHVlICAgID0gZGF0ZUVuZC5nZXREYXRlKCk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQxLnZhbHVlICAgPSBkYXRlRW5kLmdldEhvdXJzKCk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudDEudmFsdWUgPSBkYXRlRW5kLmdldE1pbnV0ZXMoKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50MS52YWx1ZSA9IGRhdGVFbmQuZ2V0U2Vjb25kcygpICsgZGF0ZUVuZC5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDA7XG4gIH0sXG4gIGJ1aWxkX2NhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciB0aW1lcldpbmRvdyA9IHRoaXMud2luZG93O1xuICAgIHZhciB0aW1lX2Zvcm0gPSB0aGlzO1xuICAgIHN3aXRjaCAoZXZlbnQpIHtcbiAgICAgIGNhc2UgJ3N1Ym1pdCc6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZygnV2lkZ2V0QmFzaWNUaW1lRm9ybS5zdWJtaXQnKTtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cblxuICAgICAgICAgIHZhciBkYXRlc3RhcnQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIGRhdGVzdGFydC5zZXRGdWxsWWVhcih0aW1lX2Zvcm0ueWVhcl9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlc3RhcnQuc2V0TW9udGgodGltZV9mb3JtLm1vbnRoX2VsZW1lbnQudmFsdWUgLSAxKTtcbiAgICAgICAgICBkYXRlc3RhcnQuc2V0RGF0ZSh0aW1lX2Zvcm0uZGF5X2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGVzdGFydC5zZXRIb3Vycyh0aW1lX2Zvcm0uaG91cl9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlc3RhcnQuc2V0TWludXRlcyh0aW1lX2Zvcm0ubWludXRlX2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGVzdGFydC5zZXRTZWNvbmRzKHRpbWVfZm9ybS5zZWNvbmRfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgdmFyIGRhdGVlbmQgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIGRhdGVlbmQuc2V0RnVsbFllYXIodGltZV9mb3JtLnllYXJfZWxlbWVudDEudmFsdWUpO1xuICAgICAgICAgIGRhdGVlbmQuc2V0TW9udGgodGltZV9mb3JtLm1vbnRoX2VsZW1lbnQxLnZhbHVlIC0gMSk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXREYXRlKHRpbWVfZm9ybS5kYXlfZWxlbWVudDEudmFsdWUpO1xuICAgICAgICAgIGRhdGVlbmQuc2V0SG91cnModGltZV9mb3JtLmhvdXJfZWxlbWVudDEudmFsdWUpO1xuICAgICAgICAgIGRhdGVlbmQuc2V0TWludXRlcyh0aW1lX2Zvcm0ubWludXRlX2VsZW1lbnQxLnZhbHVlKTtcbiAgICAgICAgICBkYXRlZW5kLnNldFNlY29uZHModGltZV9mb3JtLnNlY29uZF9lbGVtZW50MS52YWx1ZSk7XG4gICAgICAgICAgdGltZXJXaW5kb3cuc2V0X3N0YXJ0KGRhdGVzdGFydC5nZXRUaW1lKCkpO1xuICAgICAgICAgIHRpbWVyV2luZG93LnNldF9lbmQgKGRhdGVlbmQuZ2V0VGltZSgpKVxuICAgICAgICAgIC8vdGltZXIuc2V0KGRhdGUuZ2V0VGltZSgpKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cblx0fTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcnZhbFRpbWVGb3JtO1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi4vLi4vY29yZS9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQGNsYXNzIEdlbmVyaWMgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgYXZhaWxhYmxlIGJhc2VzIG9mIGEgS1RCUy5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFRPRE8gZWNyaXJlIGRlc2NyaXB0aW9uXG4gKiBAdG9kbyBFQ1JJUkUgTEEgREVTQ1JJUFRJT05cbiAqIEBwYXJhbSB7U3RyaW5nfVx0aHRtbF9pZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuS1RCU30ga3Ric1xuICogICAgIEtUQlMgdG8gYmluZCB0by5cbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnfSBbZXZlbnRzXVxuICogICAgIEV2ZW50cyB0byBsaXN0ZW4gdG8gYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2tzLlxuICovXG52YXIgTGlzdEJhc2VzID0gZnVuY3Rpb24oaHRtbF9pZCwga3RicywgZXZlbnRzKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMsIGV2ZW50cyk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtTGlzdEJhc2VzJyk7XG5cbiAgdGhpcy5rdGJzID0ga3RicztcbiAga3Ricy5vbigna3Riczp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xufTtcblxuTGlzdEJhc2VzLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIC8vdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG4gICAgLy8kKHRoaXMuZWxlbWVudCkuYXBwZW5kKCc8aDI+S1RCUyByb290OiAnK3RoaXMua3Ricy5nZXRfdXJpKCkrJzwvaDI+Jyk7XG4gICAgLypcbiAgICBcdFx0dmFyIHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICBcdFx0dmFyIHRpdGxlX3RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnS1RCUyByb290OiAnK3RoaXMua3Ricy5nZXRfdXJpKCkpO1xuICAgIFx0XHR0aXRsZS5hcHBlbmRDaGlsZCh0aXRsZV90ZXh0KTtcbiAgICBcdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRpdGxlKTtcbiovXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXRhbGlzdF9lbGVtZW50KTtcblxuICAgIHRoaXMuYWRkX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICQodGhpcy5hZGRfYnV0dG9uKS5hcHBlbmQoJ05ldyBiYXNlJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYWRkX2J1dHRvbik7XG4gICAgJCh0aGlzLmFkZF9idXR0b24pLmNsaWNrKHRoaXMub3Blbl9mb3JtLmJpbmQodGhpcykpO1xuICB9LFxuICBvcGVuX2Zvcm06IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5hZGRfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZm9ybSA9IHt9O1xuXG4gICAgdGhpcy5mb3JtLmlucHV0X2lkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfaWQuc2l6ZSA9IDIwO1xuICAgIHRoaXMuZm9ybS50ZXh0MSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgQmFzZSBJRDogJyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X2xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfbGFiZWwuc2l6ZSA9IDIwO1xuICAgIHRoaXMuZm9ybS50ZXh0MiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgbGFiZWw6ICcpO1xuICAgIHRoaXMuZm9ybS5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAkKHRoaXMuZm9ybS5idXR0b24pLmFwcGVuZCgnY3JlYXRlJyk7XG5cbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS50ZXh0MSk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uaW5wdXRfaWQpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLnRleHQyKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5pbnB1dF9sYWJlbCk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uYnV0dG9uKTtcblxuICAgICQodGhpcy5mb3JtLmJ1dHRvbikuY2xpY2sodGhpcy5jcmVhdGVfYmFzZS5iaW5kKHRoaXMpKTtcblxuICB9LFxuICBjcmVhdGVfYmFzZTogZnVuY3Rpb24oZSkge1xuICAgIGlmICgkKHRoaXMuZm9ybS5pbnB1dF9pZCkudmFsKCkgIT09IFwiXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgYSBuZXcgYmFzZS4uLlwiKTtcbiAgICAgIHRoaXMua3Ricy5jcmVhdGVfYmFzZSgkKHRoaXMuZm9ybS5pbnB1dF9pZCkudmFsKCksICQodGhpcy5mb3JtLmlucHV0X2xhYmVsKS52YWwoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRW1wdHkgYmFzZSBuYW1lLi4uIE5vIGJhc2UgY3JlYXRlZFwiKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrIGluIHRoaXMuZm9ybSkge1xuICAgICAgaWYgKHRoaXMuZm9ybS5oYXNPd25Qcm9wZXJ0eShrKSkgICAgICB7JCh0aGlzLmZvcm1ba10pLnJlbW92ZSgpO31cbiAgICB9XG4gICAgdGhpcy5hZGRfYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gIH0sXG4gIHJlZnJlc2g6IGZ1bmN0aW9uKCkge1xuICAgIC8vIGNsZWFyXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgIHZhciBsaV9lbGVtZW50O1xuICAgIHRoaXMua3Ricy5saXN0X2Jhc2VzKCkuZm9yRWFjaChmdW5jdGlvbihiKSB7XG4gICAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgIGxpX2xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgIGxpX2xpbmsuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJiYXNlXCIpO1xuICAgICAgbGlfbGluay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShiKSk7XG4gICAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2xpbmspO1xuICAgICAgbGlfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChmdW5jdGlvbigpIHt0aGlzLnRyaWdnZXIoJ3VpOmNsaWNrOmJhc2UnLCBiKX0pLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMudHJpZ2dlcihcIkxpc3RCYXNlXCIpO1xuXG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RCYXNlcztcbiIsInZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4uLy4uL2NvcmUvRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBHZW5lcmljIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgdGhlIGF2YWlsYWJsZSBiYXNlcyBvZiBhIEtUQlMuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVybiAvLyBmYXRtYSBERXJiZWxcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogVE9ETyBlY3JpcmUgZGVzY3JpcHRpb25cbiAqIEB0b2RvIEVDUklSRSBMQSBERVNDUklQVElPTlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sRWxlbWVudFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuS1RCUy5CYXNlfSBrdGJzQmFzZVxuICogICAgIEtUQlMgQmFzZSB0byBiaW5kIHRvLlxuICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5FdmVudEhhbmRsZXIuRXZlbnRDb25maWd9IFtldmVudHNdXG4gKiAgICAgRXZlbnRzIHRvIGxpc3RlbiB0byBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBjYWxsYmFja3MuXG4gKi9cbnZhciBMaXN0TW9kZWxJbkJhc2VzID0gZnVuY3Rpb24oaHRtbEVsZW1lbnQsIGt0YnNCYXNlLCBldmVudHMpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sRWxlbWVudCk7XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMsIGV2ZW50cyk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtTGlzdFRyYWNlcycpO1xuXG4gIHRoaXMuYmFzZSA9IGt0YnNCYXNlO1xuICB0aGlzLmJhc2Uub24oJ2Jhc2U6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbn07XG5cbkxpc3RNb2RlbEluQmFzZXMucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgLy90aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgIC8qdmFyIHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICBcdFx0dmFyIHRpdGxlX3RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQmFzZTogJyt0aGlzLmJhc2UuZ2V0X3VyaSgpKTtcbiAgICBcdFx0dGl0bGUuYXBwZW5kQ2hpbGQodGl0bGVfdGV4dCk7XG4gICAgXHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aXRsZSk7Ki9cblxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF0YWxpc3RfZWxlbWVudCk7XG5cblxuICAgIHRoaXMuYWRkX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICQodGhpcy5hZGRfYnV0dG9uKS5hcHBlbmQoJ05ldyBNb2RlbCcpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmFkZF9idXR0b24pO1xuICAgICQodGhpcy5hZGRfYnV0dG9uKS5jbGljayh0aGlzLm9wZW5fZm9ybS5iaW5kKHRoaXMpKTtcblxuICAgIC8qdGhpcy5yZW1vdmVfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgXHRcdCQodGhpcy5yZW1vdmVfYnV0dG9uKS5hcHBlbmQoJ0RlbGV0ZSBiYXNlJyk7XG4gICAgXHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnJlbW92ZV9idXR0b24pO1xuICAgIFx0XHQkKHRoaXMucmVtb3ZlX2J1dHRvbikuY2xpY2sodGhpcy5yZW1vdmVfYmFzZS5iaW5kKHRoaXMpKTsqL1xuXG5cbiAgfSxcbiAgb3Blbl9mb3JtOiBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuYWRkX2J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICB0aGlzLmZvcm0gPSB7fTtcblxuICAgIHRoaXMuZm9ybS5pbnB1dF9pZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X2lkLnNpemUgPSAyMDtcbiAgICB0aGlzLmZvcm0udGV4dDEgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIE1vZGVsIElEOiAnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9sYWJlbC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBsYWJlbDogJyk7XG4gICAgdGhpcy5mb3JtLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICQodGhpcy5mb3JtLmJ1dHRvbikuYXBwZW5kKCdjcmVhdGUnKTtcblxuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLnRleHQxKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5pbnB1dF9pZCk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0udGV4dDIpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X2xhYmVsKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5idXR0b24pO1xuXG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5jbGljayh0aGlzLmNyZWF0ZV90cmFjZS5iaW5kKHRoaXMpKTtcblxuICB9LFxuICBjcmVhdGVfdHJhY2U6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoJCh0aGlzLmZvcm0uaW5wdXRfaWQpLnZhbCgpICE9PSBcIlwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGEgbmV3IHRyYWNlLi4uXCIpO1xuICAgICAgdGhpcy5iYXNlLmNyZWF0ZV9zdG9yZWRfdHJhY2UoJCh0aGlzLmZvcm0uaW5wdXRfaWQpLnZhbCgpLCBudWxsLCBudWxsLCBudWxsLCAkKHRoaXMuZm9ybS5pbnB1dF9sYWJlbCkudmFsKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVtcHR5IHRyYWNlIG5hbWUuLi4gTm8gdHJhY2UgY3JlYXRlZFwiKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrIGluIHRoaXMuZm9ybSkge1xuICAgICAgJCh0aGlzLmZvcm1ba10pLnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfSxcbiAgcmVtb3ZlX2Jhc2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYmFzZS5yZW1vdmUoKTtcbiAgfSxcbiAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgLy8gY2xlYXJcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgdmFyIGxpX2VsZW1lbnQ7XG4gICAgdGhpcy5iYXNlLmxpc3RfdHJhY2VzKCkuZm9yRWFjaChmdW5jdGlvbih0KSB7XG4gICAgICBpZiAodFsnQHR5cGUnXSA9PSBcIlRyYWNlTW9kZWxcIikge1xuICAgICAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGlfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBsaV9saW5rLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibW9kZWxcIik7XG4gICAgICAgIGxpX2xpbmsuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodFsnQGlkJ10pKTtcbiAgICAgICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9saW5rKTtcbiAgICAgICAgbGlfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChmdW5jdGlvbigpIHt0aGlzLnRyaWdnZXIoJ3VpOmNsaWNrOnRyYWNlJywgdFsnQGlkJ10pfSkuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7fVxuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMudHJpZ2dlcihcIkxpc3RNb2RlbFwiKTtcbiAgfSxcbiAgc2VsZWN0OiBmdW5jdGlvbigpIHtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0TW9kZWxJbkJhc2VzO1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi4vLi4vY29yZS9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQGNsYXNzIEdlbmVyaWMgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgYXZhaWxhYmxlIGJhc2VzIG9mIGEgS1RCUy5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFRPRE8gZWNyaXJlIGRlc2NyaXB0aW9uXG4gKiBAdG9kbyBFQ1JJUkUgTEEgREVTQ1JJUFRJT05cbiAqIEBwYXJhbSB7U3RyaW5nfVx0aHRtbF9pZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuS1RCUy5CYXNlfSBrdGJzX2Jhc2VcbiAqICAgICBLVEJTIEJhc2UgdG8gYmluZCB0by5cbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnfSBbZXZlbnRzXVxuICogICAgIEV2ZW50cyB0byBsaXN0ZW4gdG8gYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2tzLlxuICovXG52YXIgTGlzdFRyYWNlc0luQmFzZXMgPSBmdW5jdGlvbihodG1sX2lkLCBrdGJzX2Jhc2UsIGV2ZW50cykge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuICBFdmVudEhhbmRsZXIuY2FsbCh0aGlzLCBldmVudHMpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LUxpc3RUcmFjZXMnKTtcblxuICB0aGlzLmJhc2UgPSBrdGJzX2Jhc2U7XG4gIHRoaXMuYmFzZS5vbignYmFzZTp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xufTtcblxuTGlzdFRyYWNlc0luQmFzZXMucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgLy90aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgIC8qdmFyIHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICBcdFx0dmFyIHRpdGxlX3RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQmFzZTogJyt0aGlzLmJhc2UuZ2V0X3VyaSgpKTtcbiAgICBcdFx0dGl0bGUuYXBwZW5kQ2hpbGQodGl0bGVfdGV4dCk7XG4gICAgXHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aXRsZSk7Ki9cblxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF0YWxpc3RfZWxlbWVudCk7XG5cbiAgICAvKnRoaXMucmVtb3ZlX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIFx0XHQkKHRoaXMucmVtb3ZlX2J1dHRvbikuYXBwZW5kKCdEZWxldGUgYmFzZScpO1xuICAgIFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5yZW1vdmVfYnV0dG9uKTtcbiAgICBcdFx0JCh0aGlzLnJlbW92ZV9idXR0b24pLmNsaWNrKHRoaXMucmVtb3ZlX2Jhc2UuYmluZCh0aGlzKSk7Ki9cblxuICAgIHRoaXMuYWRkX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICQodGhpcy5hZGRfYnV0dG9uKS5hcHBlbmQoJ05ldyB0cmFjZScpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmFkZF9idXR0b24pO1xuICAgICQodGhpcy5hZGRfYnV0dG9uKS5jbGljayh0aGlzLm9wZW5fZm9ybS5iaW5kKHRoaXMpKTtcblxuICB9LFxuICBvcGVuX2Zvcm06IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5hZGRfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZm9ybSA9IHt9O1xuXG4gICAgdGhpcy5mb3JtLmlucHV0X2lkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfaWQuc2l6ZSA9IDIwO1xuICAgIHRoaXMuZm9ybS50ZXh0MSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgVHJhY2UgSUQ6ICcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X2xhYmVsLnNpemUgPSAyMDtcbiAgICB0aGlzLmZvcm0udGV4dDIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIGxhYmVsOiAnKTtcbiAgICB0aGlzLmZvcm0uYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5hcHBlbmQoJ2NyZWF0ZScpO1xuXG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0udGV4dDEpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X2lkKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS50ZXh0Mik7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uaW5wdXRfbGFiZWwpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmJ1dHRvbik7XG5cbiAgICAkKHRoaXMuZm9ybS5idXR0b24pLmNsaWNrKHRoaXMuY3JlYXRlX3RyYWNlLmJpbmQodGhpcykpO1xuXG4gIH0sXG4gIGNyZWF0ZV90cmFjZTogZnVuY3Rpb24oZSkge1xuICAgIGlmICgkKHRoaXMuZm9ybS5pbnB1dF9pZCkudmFsKCkgIT09IFwiXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgYSBuZXcgdHJhY2UuLi5cIik7XG4gICAgICB0aGlzLmJhc2UuY3JlYXRlX3N0b3JlZF90cmFjZSgkKHRoaXMuZm9ybS5pbnB1dF9pZCkudmFsKCksIG51bGwsIG51bGwsIG51bGwsICQodGhpcy5mb3JtLmlucHV0X2xhYmVsKS52YWwoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRW1wdHkgdHJhY2UgbmFtZS4uLiBObyB0cmFjZSBjcmVhdGVkXCIpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gdGhpcy5mb3JtKSB7XG4gICAgICBpZiAodGhpcy5mb3JtLmhhc093blByb3BlcnR5KGspKSAgICAgIHskKHRoaXMuZm9ybVtrXSkucmVtb3ZlKCk7fVxuICAgIH1cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfSxcbiAgcmVtb3ZlX2Jhc2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYmFzZS5yZW1vdmUoKTtcbiAgfSxcbiAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgLy8gY2xlYXJcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgdmFyIGxpX2VsZW1lbnQ7XG4gICAgdGhpcy5iYXNlLmxpc3RfdHJhY2VzKCkuZm9yRWFjaChmdW5jdGlvbih0KSB7XG4gICAgICBpZiAodFsnQHR5cGUnXSA9PSBcIlN0b3JlZFRyYWNlXCIpIHtcbiAgICAgICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGxpX2xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgbGlfbGluay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInRyYWNlXCIpO1xuICAgICAgICBsaV9saW5rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRbJ0BpZCddKSk7XG4gICAgICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfbGluayk7XG4gICAgICAgIC8vbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0WydAaWQnXSkpO1xuICAgICAgICBsaV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGZ1bmN0aW9uKCkge3RoaXMudHJpZ2dlcigndWk6Y2xpY2s6dHJhY2UnLCB0WydAaWQnXSl9KS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTt9XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy50cmlnZ2VyKFwiTGlzdFRyYWNlXCIpO1xuXG4gIH0sXG4gIHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdFRyYWNlc0luQmFzZXM7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYW4gT2JzZWwgYXMgYW4gSFRNTCBsaXN0LlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYW4gT2JzZWwgYXMgYW4gSFRNTCBsaXN0LlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLk9ic2VsSW5zcGVjdG9yIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSBPYnNlbHMuXG4gKlxuICogVGhpcyB3aWRnZXQgb2JzZXJ2ZXMgYSB7QGxpbmsgU2Ftb3RyYWNlcy5MaWIuU2VsZWN0b3J8U2VsZWN0b3J9XG4gKiBvYmplY3QuIFdoZW4gYW4gb2JzZWwgaXMgc2VsZWN0ZWQsIHRoZSBpbmZvcm1hdGlvbiBhYm91dFxuICogdGhpcyBvYnNlbCBpcyBkaXNwbGF5ZWQgaW4gdGhlIHdpZGdldC4gV2hlbiBhbiBvYnNlbCBpc1xuICogdW5zZWxlY3RlZCwgdGhlIHdpZGdldCBjbG9zZXMuIENsaWNraW5nIG9uIHRoZSByZWQgY3Jvc3NcbiAqIHdpbGwgY2xvc2UgdGhlIHdpZGdldCAoYW5kIGF1dG9tYXRpY2FsbHkgdW5zZWxlY3QgdGhlIG9ic2VsKS5cbiAqIFdoZW4gbm8gb2JzZWwgYXJlIHNlbGVjdGVkLCB0aGUgd2lkZ2V0IGlzIG5vdCB2aXNpYmxlLFxuICogc2VsZWN0aW5nIGFuIG9ic2VsIHdpbGwgbWFrZSBpdCBhcHBlYXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sX2lkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTZWxlY3Rvci48T2JzZWw+fSBvYnNlbF9zZWxlY3RvclxuICogICAgIEEgU2VsZWN0b3Igb2YgT2JzZWwgdG8gb2JzZXJ2ZS5cbiAqL1xudmFyIE9ic2VsSW5zcGVjdG9yID0gZnVuY3Rpb24oaHRtbF9pZCwgb2JzZWxfc2VsZWN0b3IpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1PYnNlbEluc3BlY3RvcicpO1xuXG4gIHRoaXMub2JzZWwgPSBvYnNlbF9zZWxlY3RvcjtcbiAgdGhpcy5vYnNlbC5vbignc2VsZWN0aW9uOmFkZCcsIHRoaXMuaW5zcGVjdC5iaW5kKHRoaXMpKTtcbiAgdGhpcy5vYnNlbC5vbignc2VsZWN0aW9uOmVtcHR5JywgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5vYnNlbC5vbignc2VsZWN0aW9uOnJlbW92ZScsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xufTtcblxuT2JzZWxJbnNwZWN0b3IucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLmNsb3NlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdmFyIGltZ19lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBRlBTVVJCVkRpTmxaT3hUZ0pSRUVYUGZVdVBFbXlNclFTTEphSFdoQ2lsdFlYL29aMlZzY0xLcjZDZ3BnT01Sbi9BUlJBdGlUWVlzVmQyTEZqSXN0a2xjWnFYek15NU01bVpweEVVZitIQzRBUm9PN2plTTNzanhWNmtVampQUFJRMGM5RFFNelFNem1ONW55RWMrV1pCSEE0azMwRVBLQzU4Z2h2MVlRenNKSXF0aUtUQmtYMDR3VzFLdDBVSHZiNVU2VXVWREJpZ3JTR1VRbmd3MkVwR0RiNmpWamVTTWNGRXNDOHpJNUI4RDdwcElta21tTXlnN3BzRkRzQTNDMlpRRjB6K0F3UEl6SmJCYUZoM3dHWUdQdzJoRnQrUWkwYzk4SlR3SmFvN0Q3eTRiNWs4a0tvMm4wTStTOEFnYjlBZFNOVVZnUWp1QUlVc09HWUZnODVDUkU5UWR2Q1lBVStqTjIwbVh3WUh6b096TkZnd0NhRVdRaTFqT3dYQmhmcndEbXduNGZpcTF0ekoyQWxhNjJCWWV5ZE5qYUQ0TS8rTnB3YjNPYmdzbTcybXRNeFEyZzNudWNlQ1ZnNnUvZ0JzNTRhbG9ud2RXUUFBQUFCSlJVNUVya0pnZ2c9PScpO1xuICAgIHRoaXMuY2xvc2VfZWxlbWVudC5hcHBlbmRDaGlsZChpbWdfZWxlbWVudCk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY2xvc2VfZWxlbWVudCk7XG5cbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRhdGFsaXN0X2VsZW1lbnQpO1xuXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICB0aGlzLmNsb3NlX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xvc2VBY3Rpb24uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGluc3BlY3Q6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIG9icyA9IGV2ZW50LmRhdGE7XG4gICAgLy8gY2xlYXJcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG5cbiAgICB2YXIgYXR0cmlidXRlcyA9IG9icy5hdHRyaWJ1dGVzO1xuXG4gICAgdmFyIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ2lkOiAnICsgb2JzLmdldF9pZCgpKSk7XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuXG4gICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgndHlwZTogJyArIG9icy5nZXRfdHlwZSgpKSk7XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuXG4gICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnYmVnaW46ICcgKyBvYnMuZ2V0X2JlZ2luKCkpKTtcbiAgICAvL1x0bGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnYmVnaW46ICcrIChuZXcgRGF0ZShvYnMuZ2V0X2JlZ2luKCkpKS50b1N0cmluZygpKSk7XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuXG4gICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnZW5kOiAnICsgb2JzLmdldF9lbmQoKSkpO1xuICAgIC8vXHRsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdlbmQ6ICcrIChuZXcgRGF0ZShvYnMuZ2V0X2VuZCgpKSkudG9TdHJpbmcoKSkpO1xuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvYnMuYXR0cmlidXRlcykge1xuICAgICAgaWYgKG9icy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpICAgICAge2xpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGtleSAgKyAnOiAnICsgb2JzLmF0dHJpYnV0ZXNba2V5XSkpO1xuICAgICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO31cbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH0sXG4gIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfSxcbiAgb25DbG9zZUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vYnNlbC51bnNlbGVjdCgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VsSW5zcGVjdG9yO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGFuIE9ic2VsIGFzIGFuIEhUTUwgbGlzdC5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGFuIE9ic2VsIGFzIGFuIEhUTUwgbGlzdC5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuIC8vIEZhdG1hIERlcmJlbFxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLlVJLldpZGdldHMuT2JzZWxJbnNwZWN0b3IgaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIE9ic2Vscy5cbiAqXG4gKiBUaGlzIHdpZGdldCBvYnNlcnZlcyBhIHtAbGluayBTYW1vdHJhY2VzLkxpYi5TZWxlY3RvcnxTZWxlY3Rvcn1cbiAqIG9iamVjdC4gV2hlbiBhbiBvYnNlbCBpcyBzZWxlY3RlZCwgdGhlIGluZm9ybWF0aW9uIGFib3V0XG4gKiB0aGlzIG9ic2VsIGlzIGRpc3BsYXllZCBpbiB0aGUgd2lkZ2V0LiBXaGVuIGFuIG9ic2VsIGlzXG4gKiB1bnNlbGVjdGVkLCB0aGUgd2lkZ2V0IGNsb3Nlcy4gQ2xpY2tpbmcgb24gdGhlIHJlZCBjcm9zc1xuICogd2lsbCBjbG9zZSB0aGUgd2lkZ2V0IChhbmQgYXV0b21hdGljYWxseSB1bnNlbGVjdCB0aGUgb2JzZWwpLlxuICogV2hlbiBubyBvYnNlbCBhcmUgc2VsZWN0ZWQsIHRoZSB3aWRnZXQgaXMgbm90IHZpc2libGUsXG4gKiBzZWxlY3RpbmcgYW4gb2JzZWwgd2lsbCBtYWtlIGl0IGFwcGVhci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxfaWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NlbGVjdG9yLjxPYnNlbD59IG9ic2VsX3NlbGVjdG9yXG4gKiAgICAgQSBTZWxlY3RvciBvZiBPYnNlbCB0byBvYnNlcnZlLlxuICovXG52YXIgT2JzZWxUeXBlSW5zcGVjdG9yID0gZnVuY3Rpb24oaHRtbF9pZCwgb2JzZWxfc2VsZWN0b3IpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1PYnNlbEluc3BlY3RvclR5cGUnKTtcblxuICB0aGlzLm9ic2VsID0gb2JzZWxfc2VsZWN0b3I7XG4gIHRoaXMub2JzZWwub24oJ3NlbGVjdGlvbjphZGQnLCB0aGlzLmluc3BlY3QuYmluZCh0aGlzKSk7XG4gIHRoaXMub2JzZWwub24oJ3NlbGVjdGlvbjplbXB0eScsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG4gIHRoaXMub2JzZWwub24oJ3NlbGVjdGlvbjpyZW1vdmUnLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbn07XG5cbk9ic2VsVHlwZUluc3BlY3Rvci5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuY2xvc2VfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB2YXIgaW1nX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWdfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFGUFNVUkJWRGlObFpPeFRnSlJFRVhQZlV1UEVteU1yUVNMSmFIV2hDaWx0WVgvb1oyVnNjTEtyNkNncGdPTVJuL0FSUkF0aVRZWXNWZDJMRmpJc3RrbGNacVh6TXk1TTVtWnB4RVVmK0hDNEFSb083amVNM3NqeFY2a1VqalBQUlEwYzlEUU16UU16bU41bnlFYytXWkJIQTRrMzBFUEtDNThnaHYxWVF6c0pJcXRpS1RCa1gwNHdXMUt0MFVIdmI1VTZVdVZEQmlnclNHVVFuZ3cyRXBHRGI2alZqZVNNY0ZFc0M4ekk1QjhEN3BwSW1rbW1NeWc3cHNGRHNBM0MyWlFGMHorQXdQSXpKYkJhRmgzd0dZR1B3MmhGdCtRaTBjOThKVHdKYW83RDd5NGI1azhrS28ybjBNK1M4QWdiOUFkU05VVmdRanVBSVVzT0dZRmc4NUNSRTlRZHZDWUFVK2pOMjBtWHdZSHpvT3pORmd3Q2FFV1FpMWpPd1hCaGZyd0Rtd240ZmlxMXR6SjJBbGE2MkJZZXlkTmphRDRNLytOcHdiM09iZ3NtNzJtdE14UTJnM251Y2VDVmc2dS9nQnM1NGFsb253ZFdRQUFBQUJKUlU1RXJrSmdnZz09Jyk7XG4gICAgdGhpcy5jbG9zZV9lbGVtZW50LmFwcGVuZENoaWxkKGltZ19lbGVtZW50KTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jbG9zZV9lbGVtZW50KTtcblxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF0YWxpc3RfZWxlbWVudCk7XG5cbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgIHRoaXMuY2xvc2VfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbG9zZUFjdGlvbi5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgaW5zcGVjdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgb2JzID0gZXZlbnQuZGF0YTtcbiAgICAvLyBjbGVhclxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5pbm5lckhUTUwgPSAnJztcblxuICAgIHZhciBhdHRyaWJ1dGVzID0gb2JzLmF0dHJpYnV0ZXM7XG4gICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgLy9saV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCd0eXBlOiAnKyBvYnMuZ2V0X3R5cGUoKSkpO1xuICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3R5cGU6ICcgKyBvYnNbXCJ0eXBlXCJdKSk7XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuXG5cbiAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBdHRyaWJ1dDogJykpO1xuICAgIGZvciAodmFyIGtleSBpbiBvYnMuYXR0cmlidXRlcykge1xuICAgICAgZm9yICh2YXIgdmFsIGluIG9icy5hdHRyaWJ1dGVzW2tleV0pICAgICAge1xuXG5cbiAgICAgICAgLy8gIGxpX2VsZW1lbnRfQS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2YWwgICsnOiAnKyBvYnMuYXR0cmlidXRlc1trZXldW3ZhbF0pKTtcblxuXG5cblxuICAgICAgICBpZiAodmFsID09IFwiQGlkXCIpICAgICAgICB7XG4gICAgICAgICAgdWxfZWxlbWVudF9BID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICBsaV9lbGVtZW50X0EgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgIGxpX3RleHQgPSBvYnMuYXR0cmlidXRlc1trZXldW3ZhbF0gKyAnIDogJyA7XG4gICAgICAgIH0gICAgICAgIGVsc2UgaWYgKHZhbCA9PSBcImxhYmVsXCIpICAgICAgICB7XG5cbiAgICAgICAgICBsaV9lbGVtZW50X0EuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGlfdGV4dCArIG9icy5hdHRyaWJ1dGVzW2tleV1bdmFsXSkpO1xuICAgICAgICAgIHVsX2VsZW1lbnRfQS5hcHBlbmRDaGlsZChsaV9lbGVtZW50X0EpXG4gICAgICAgICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZCh1bF9lbGVtZW50X0EpO1xuICAgICAgICB9XG5cblxuXG5cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfSxcbiAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9LFxuICBvbkNsb3NlQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9ic2VsLnVuc2VsZWN0KCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZWxUeXBlSW5zcGVjdG9yO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIHRoZSBjdXJyZW50IHRpbWUgYXMgYSBkYXRlL3RpbWUuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgY3VycmVudCB0aW1lIGFzIGEgZGF0ZS90aW0uXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5XaWRnZXRzLldpZGdldFxuICogQHNlZSBTYW1vdHJhY2VzLlVJLldpZGdldHMuVGltZUZvcm1cbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlJlYWRhYmxlVGltZUZvcm0gaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIHRoZSBjdXJyZW50IHRpbWUuXG4gKlxuICogVGhlIHRpbWUgKGluIG1zIGZyb20gdGhlIDAxLzAxLzE5NzApIGlzIGNvbnZlcnRlZCBpbiBhXG4gKiBodW1hbiByZWFkYWJsZSBmb3JtYXQgKGFzIG9wcG9zZWQgdG9cbiAqIHtAbGluayBTYW1vdHJhY2VzLldpZGdldHMuVGltZUZvcm19IHdpZGdldFxuICogd2hpY2ggZGlzcGxheSByYXcgdGltZSkuXG4gKlxuICogVGhpcyB3aWRnZXQgb2JzZXJ2ZXMgYSBTYW1vdHJhY2VzLkxpYi5UaW1lciBvYmplY3QuXG4gKiBXaGVuIHRoZSB0aW1lciBjaGFuZ2VzIHRoZSBuZXcgdGltZSBpcyBkaXNwbGF5ZWQuXG4gKiBUaGlzIHdpZGdldCBhbHNvIGFsbG93IHRvIGNoYW5nZSB0aGUgdGltZSBvZiB0aGUgdGltZXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sX2lkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLlRpbWVyfSB0aW1lclxuICogICAgIFRpbWVyIG9iamVjdCB0byBvYnNlcnZlLlxuICovXG52YXIgUmVhZGFibGVUaW1lRm9ybSA9IGZ1bmN0aW9uKGh0bWxfaWQsIHRpbWVyKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG5cbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1SZWFkYWJsZVRpbWVGb3JtJyk7XG5cbiAgdGhpcy50aW1lciA9IHRpbWVyO1xuICB0aGlzLnRpbWVyLm9uKCd0aW1lcjp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG4gIHRoaXMudGltZXIub24oJ3RpbWVyOnBsYXk6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5yZWZyZXNoKHtkYXRhOiB0aGlzLnRpbWVyLnRpbWV9KTtcbn07XG5cblJlYWRhYmxlVGltZUZvcm0ucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgcF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdDdXJyZW50IHRpbWU6ICcpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xuXG5cbiAgICB0aGlzLnllYXJfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAneWVhcicpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDQpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMueWVhcl9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy8nKSk7XG5cbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9udGgnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubW9udGhfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcvJykpO1xuXG4gICAgdGhpcy5kYXlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ2RheScpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRheV9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAtICcpKTtcblxuICAgIHRoaXMuaG91cl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdob3VyJyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5ob3VyX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnOicpKTtcblxuICAgIHRoaXMubWludXRlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdtaW51dGUnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5taW51dGVfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCc6JykpO1xuXG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ3NlY29uZCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgOCk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNlY29uZF9lbGVtZW50KTtcbiAgICAvKlxuICAgIFx0XHR0aGlzLmlucHV0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIFx0XHR0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywndGV4dCcpO1xuICAgIFx0XHR0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywnJyk7XG4gICAgXHRcdHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLDE1KTtcbiAgICBcdFx0dGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLHRoaXMudGltZXIudGltZSk7XG4gICAgXHRcdHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmlucHV0X2VsZW1lbnQpO1xuKi9cbiAgICB2YXIgc3VibWl0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdzdWJtaXQnKTtcbiAgICBzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ1VwZGF0ZSB0aW1lJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHN1Ym1pdF9lbGVtZW50KTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuYnVpbGRfY2FsbGJhY2soJ3N1Ym1pdCcpKTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFwcGVuZENoaWxkKHBfZWxlbWVudCk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5mb3JtX2VsZW1lbnQpO1xuICB9LFxuXG4gIHJlZnJlc2g6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgdGltZSA9IGUuZGF0YVxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBkYXRlLnNldFRpbWUodGltZSk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQudmFsdWUgICA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQudmFsdWUgID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnZhbHVlICAgID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQudmFsdWUgICA9IGRhdGUuZ2V0SG91cnMoKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnZhbHVlID0gZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC52YWx1ZSA9IGRhdGUuZ2V0U2Vjb25kcygpICsgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDA7XG4gIH0sXG5cbiAgYnVpbGRfY2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRpbWVyID0gdGhpcy50aW1lcjtcbiAgICB2YXIgdGltZV9mb3JtID0gdGhpcztcbiAgICBzd2l0Y2ggKGV2ZW50KSB7XG4gICAgICBjYXNlICdzdWJtaXQnOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ1dpZGdldEJhc2ljVGltZUZvcm0uc3VibWl0Jyk7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cbiAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih0aW1lX2Zvcm0ueWVhcl9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlLnNldE1vbnRoKHRpbWVfZm9ybS5tb250aF9lbGVtZW50LnZhbHVlIC0gMSk7XG4gICAgICAgICAgZGF0ZS5zZXREYXRlKHRpbWVfZm9ybS5kYXlfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZS5zZXRIb3Vycyh0aW1lX2Zvcm0uaG91cl9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlLnNldE1pbnV0ZXModGltZV9mb3JtLm1pbnV0ZV9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlLnNldFNlY29uZHModGltZV9mb3JtLnNlY29uZF9lbGVtZW50LnZhbHVlKTtcblxuICAgICAgICAgIHRpbWVyLnNldChkYXRlLmdldFRpbWUoKSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhZGFibGVUaW1lRm9ybTtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgY3VycmVudCB0aW1lIGFzIGEgbnVtYmVyLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgdGhlIGN1cnJlbnQgdGltZSBhcyBhIG51bWJlci5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAc2VlIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5SZWFkYWJsZVRpbWVGb3JtXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UaW1lRm9ybSBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgdGhlIGN1cnJlbnQgdGltZS5cbiAqXG4gKiBUaGUgdGltZSBpcyBkaXNwbGF5ZWQgYXMgYSBudW1iZXIuIFNlZVxuICoge0BsaW5rIFNhbW90cmFjZXMuV2lkZ2V0cy5UaW1lRm9ybX0gdG8gY29udmVydFxuICogcmF3IHRpbWUgKGluIG1zIGZyb20gdGhlIDAxLzAxLzE5NzApIHRvIGEgaHVtYW4gcmVhZGFibGVcbiAqIGZvcm1hdC5cbiAqXG4gKiBUaGlzIHdpZGdldCBvYnNlcnZlcyBhIFNhbW90cmFjZXMuTGliLlRpbWVyIG9iamVjdC5cbiAqIFdoZW4gdGhlIHRpbWVyIGNoYW5nZXMgdGhlIG5ldyB0aW1lIGlzIGRpc3BsYXllZC5cbiAqIFRoaXMgd2lkZ2V0IGFsc28gYWxsb3cgdG8gY2hhbmdlIHRoZSB0aW1lIG9mIHRoZSB0aW1lci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxfaWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVGltZXJ9IHRpbWVyXG4gKiAgICAgVGltZXIgb2JqZWN0IHRvIG9ic2VydmUuXG4gKi9cbnZhciBUaW1lRm9ybSA9IGZ1bmN0aW9uKGh0bWxfaWQsIHRpbWVyKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG5cbiAgdGhpcy50aW1lciA9IHRpbWVyO1xuICB0aGlzLnRpbWVyLm9uKCd0aW1lcjp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG4gIHRoaXMudGltZXIub24oJ3RpbWVyOnBsYXk6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5yZWZyZXNoKHtkYXRhOiB0aGlzLnRpbWVyLnRpbWV9KTtcbn07XG5cblRpbWVGb3JtLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQ3VycmVudCB0aW1lOiAnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcblxuICAgIHRoaXMuaW5wdXRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICd0aW1lJyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDE1KTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRoaXMudGltZXIudGltZSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaW5wdXRfZWxlbWVudCk7XG5cbiAgICB2YXIgc3VibWl0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdzdWJtaXQnKTtcbiAgICBzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ1VwZGF0ZSB0aW1lJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHN1Ym1pdF9lbGVtZW50KTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuYnVpbGRfY2FsbGJhY2soJ3N1Ym1pdCcpKTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFwcGVuZENoaWxkKHBfZWxlbWVudCk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5mb3JtX2VsZW1lbnQpO1xuICB9LFxuXG4gIHJlZnJlc2g6IGZ1bmN0aW9uKGUpIHtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQudmFsdWUgPSBlLmRhdGE7XG4gIH0sXG5cbiAgYnVpbGRfY2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRpbWVyID0gdGhpcy50aW1lcjtcbiAgICB2YXIgaW5wdXRfZWxlbWVudCA9IHRoaXMuaW5wdXRfZWxlbWVudDtcbiAgICBzd2l0Y2ggKGV2ZW50KSB7XG4gICAgICBjYXNlICdzdWJtaXQnOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ1dpZGdldEJhc2ljVGltZUZvcm0uc3VibWl0Jyk7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRpbWVyLnNldChpbnB1dF9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lRm9ybTtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRpbWUgc2xpZGVyLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0aW1lIHNsaWRlci5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5kM0Jhc2ljLlRpbWVTbGlkZXIgaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIHRoZSBjdXJyZW50IHRpbWUgaW4gYSB0ZW1wb3JhbCB3aW5kb3dcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdGRpdklkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHRpbWVfd2luZG93XG4gKiAgICAgVGltZVdpbmRvdyBvYmplY3QgLT4gcmVwcmVzZW50aW5nIHRoZSB3aWRlIHdpbmRvd1xuICogICAgIChlLmcuLCB0aGUgd2hvbGUgdHJhY2UpXG4gKiBAcGFyYW0gdGltZXJcbiAqICAgICBUaW1lZXIgb2JqZWN0IC0+IGNvbnRhaW5pbmcgdGhlIGN1cnJlbnQgdGltZVxuICovXG52YXIgVGltZVNsaWRlciA9IGZ1bmN0aW9uKGh0bWxfaWQsIHRpbWVfd2luZG93LCB0aW1lcikge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuXG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVGltZVNsaWRlcicpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcblxuICB0aGlzLnRpbWVyID0gdGltZXI7XG4gIHRoaXMudGltZXIub24oJ3RpbWVyOnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50aW1lci5vbigndGltZXI6cGxheTp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy50aW1lX3dpbmRvdyA9IHRpbWVfd2luZG93O1xuICB0aGlzLnRpbWVfd2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG5cbiAgLy8gdXBkYXRlIHNsaWRlciBzdHlsZVxuICB0aGlzLnNsaWRlcl9vZmZzZXQgPSAwO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgLy8gdXBkYXRlIHNsaWRlcidzIHBvc2l0aW9uXG4gIHRoaXMuZHJhdygpO1xuXG59O1xuXG5UaW1lU2xpZGVyLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIC8vIGNyZWF0ZSB0aGUgc2xpZGVyXG4gICAgdGhpcy5zbGlkZXJfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNsaWRlcl9lbGVtZW50KTtcblxuICAgIC8vIGhhbmQgbWFkZSBkcmFnJmRyb3BcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcztcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoJ2NoYW5nZVRpbWVPbkRyYWcnLCB0aGlzLnNsaWRlcl9lbGVtZW50LCB7XG4gICAgICBvblVwQ2FsbGJhY2s6IGZ1bmN0aW9uKGRlbHRhX3gpIHtcbiAgICAgICAgdmFyIG5ld190aW1lID0gd2lkZ2V0LnRpbWVyLnRpbWUgKyBkZWx0YV94ICogd2lkZ2V0LnRpbWVfd2luZG93LmdldF93aWR0aCgpIC8gd2lkZ2V0LmVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIHdpZGdldC50aW1lci5zZXQobmV3X3RpbWUpO1xuICAgICAgfSxcbiAgICAgIG9uTW92ZUNhbGxiYWNrOiBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHdpZGdldC5zbGlkZXJfb2Zmc2V0ICsgb2Zmc2V0O1xuICAgICAgICB3aWRnZXQuc2xpZGVyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdsZWZ0OiAnICsgb2Zmc2V0ICsgJ3B4OycpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNsaWRlcl9vZmZzZXQgPSAodGhpcy50aW1lci50aW1lIC0gdGhpcy50aW1lX3dpbmRvdy5zdGFydCkgKiB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLnRpbWVfd2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdsZWZ0OicgKyB0aGlzLnNsaWRlcl9vZmZzZXQgKyAncHg7IGRpc3BsYXk6IGJsb2NrOycpO1xuICB9LFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVTbGlkZXI7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0cmFjZSB3aGVyZSBvYnNlbHMgYXJlIGRpc3BsYXllZCBhcyBpbWFnZXMuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRyYWNlIHdoZXJlIG9ic2VscyBhcmUgZGlzcGxheWVkIGFzIGltYWdlc1xuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBkMy5qcyBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2QzanMub3JnXCI+ZDNqcy5vcmc8L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUge0BsaW5rIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29uc3xUcmFjZURpc3BsYXlJY29uc30gd2lkZ2V0XG4gKiBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgdHJhY2VzIHdpdGggaW1hZ2VzLiBUaGlzIHdpZGdldCB1c2VzXG4gKiBkMy5qcyB0byBkaXNwbGF5IHRyYWNlcyBhcyBpbWFnZXMgaW4gYSBTVkcgaW1hZ2UuXG4gKiBUaGUgZGVmYXVsdCBzZXR0aW5ncyBhcmUgc2V0IHVwIHRvIHZpc3VhbGlzZSAxNngxNiBwaXhlbHNcbiAqIGljb25zLiBJZiBubyB1cmwgaXMgZGVmaW5lZCAoc2VlIG9wdGlvbnMpLCBhIHF1ZXN0aW9ubWFya1xuICogaWNvbiB3aWxsIGJlIGRpc3BsYXllZCBieSBkZWZhdWx0IGZvciBlYWNoIG9ic2VsLlxuICpcbiAqIE5vdGUgdGhhdCBjbGlja2luZyBvbiBhbiBvYnNlbCB3aWxsIHRyaWdnZXIgYVxuICoge0BsaW5rIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29ucyN1aTpjbGljazpvYnNlbHx1aTpjbGljazpvYnNlbH1cbiAqIGV2ZW50LlxuICpcbiAqIFR1dG9yaWFscyB7QHR1dG9yaWFsIHR1dG8xLjFfdHJhY2VfdmlzdWFsaXNhdGlvbn0sXG4gKiB7QHR1dG9yaWFsIHR1dG8xLjJfYWRkaW5nX3dpZGdldHN9LCBhbmRcbiAqIHtAdHV0b3JpYWwgdHV0bzEuM192aXN1YWxpc2F0aW9uX3BlcnNvbmFsaXNhdGlvbn0gaWxsdXN0cmF0ZXNcbiAqIGluIG1vcmUgZGV0YWlscyBob3cgdG8gdXNlIHRoaXMgY2xhc3MuXG4gKiBAcGFyYW0ge1N0cmluZ31cdGRpdklkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtUcmFjZX1cdHRyYWNlXG4gKiAgICAgVHJhY2Ugb2JqZWN0IHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7VGltZVdpbmRvd30gdGltZV93aW5kb3dcbiAqICAgICBUaW1lV2luZG93IG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIHRpbWUgZnJhbWVcbiAqICAgICBiZWluZyBjdXJyZW50bHkgZGlzcGxheWVkLlxuICpcbiAqIEBwYXJhbSB7VmlzdUNvbmZpZ30gW29wdGlvbnNdXG4gKiAgICAgT2JqZWN0IGRldGVybWluaW5nIGhvdyB0byBkaXNwbGF5IHRoZSBpY29uc1xuICogICAgIChPcHRpb25hbCkuIEFsbCB0aGUgb3B0aW9ucyBmaWVsZCBjYW4gYmUgZWl0aGVyXG4gKiAgICAgYSB2YWx1ZSBvciBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgYnlcbiAqICAgICBkMy5qcy4gVGhlIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBhcyB0aGUgZmlyc3RcbiAqICAgICBhcmd1bWVudCB0aGUgT2JzZWwgdG8gZGlzcGxheSBhbmQgc2hvdWxkIHJldHVyblxuICogICAgIHRoZSBjYWxjdWxhdGVkIHZhbHVlLlxuICogICAgIElmIGEgZnVuY3Rpb24gaXMgZGVmaW5lZCBhcyBhbiBhcmd1bWVudCwgaXQgd2lsbFxuICogICAgIGJlIGJpbmRlZCB0byB0aGUgVHJhY2VEaXNwbGF5SWNvbnMgaW5zdGFuY2UuXG4gKiAgICAgVGhpcyBtZWFucyB0aGF0IHlvdSBjYW4gY2FsbCBhbnkgbWV0aG9kIG9mIHRoZVxuICogICAgIFRyYWNlRGlzcGxheUljb25zIGluc3RhbmNlIHRvIGhlbHAgY2FsY3VsYXRlXG4gKiAgICAgdGhlIHggcG9zaXRpb24gb3IgeSBwb3NpdGlvbiBvZiBhbiBpY29uLiBUaGlzXG4gKiAgICAgbWFrZXMgaXQgZWFzeSB0byBkZWZpbmUgdmFyaW91cyB0eXBlcyBvZiBiZWhhdmlvdXJzLlxuICogICAgIFJlbGV2YW50IG1ldGhvZHMgdG8gdXNlIGFyZTpcbiAqICAgICBsaW5rIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29ucy5jYWxjdWxhdGVfeH1cbiAqICAgICBTZWUgdHV0b3JpYWxcbiAqICAgICB7QHR1dG9yaWFsIHR1dG8xLjNfdmlzdWFsaXNhdGlvbl9wZXJzb25hbGlzYXRpb259XG4gKiAgICAgZm9yIG1vcmUgZGV0YWlscyBhbmQgZXhhbXBsZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBvcHRpb25zID0ge1xuICogICAgIHk6IDIwLFxuICogICAgIHdpZHRoOiAzMixcbiAqICAgICBoZWlnaHQ6IDMyLFxuICogICAgIHVybDogZnVuY3Rpb24ob2JzZWwpIHtcbiAqICAgICAgICAgc3dpdGNoKG9ic2VsLnR5cGUpIHtcbiAqICAgICAgICAgICAgIGNhc2UgJ2NsaWNrJzpcbiAqICAgICAgICAgICAgICAgICByZXR1cm4gJ2ltYWdlcy9jbGljay5wbmcnO1xuICogICAgICAgICAgICAgY2FzZSAnZm9jdXMnOlxuICogICAgICAgICAgICAgICAgIHJldHVybiAnaW1hZ2VzL2ZvY3VzLnBuZyc7XG4gKiAgICAgICAgICAgICBkZWZhdWx0OlxuICogICAgICAgICAgICAgICAgIHJldHVybiAnaW1hZ2VzL2RlZmF1bHQucG5nJztcbiAqICAgICAgICAgfVxuICogICAgIH1cbiAqIH07XG4gKi9cbnZhciBUcmFjZURpc3BsYXlJY29ucyA9IGZ1bmN0aW9uKGRpdklkLCB0cmFjZSwgdGltZV93aW5kb3csIG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGRpdklkKTtcblxuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVRyYWNlRGlzcGxheUljb25zJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6cmVtb3ZlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcy5vYnNlbF9yZWRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy53aW5kb3cgPSB0aW1lX3dpbmRvdztcbiAgdGhpcy53aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdy5vbigndHc6dHJhbnNsYXRlJywgdGhpcy50cmFuc2xhdGVfeC5iaW5kKHRoaXMpKTtcblxuICAvL1x0dGhpcy5vYnNlbF9zZWxlY3RvciA9IG9ic2VsX3NlbGVjdG9yO1xuICAvL1x0dGhpcy53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignJyx0aGlzLi5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG4gIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcblxuXG4gIC8qKlxuICBcdCAqIFZpc3VDb25maWcgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuICBcdCAqIHtAbGluayBTYW1vdHJhY2VzLlVJLldpZGdldHMuVHJhY2VEaXNwbGF5SWNvbnMuVmlzdUNvbmZpZ31cbiAgXHQgKiBvYmplY3QuXG4gIFx0ICogQHR5cGVkZWYgVmlzdUNvbmZpZ1xuICBcdCAqIEBzZWUgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zLlZpc3VDb25maWdcbiAgXHQgKi9cbiAgLyoqXG4gIFx0ICogQHR5cGVkZWYgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zLlZpc3VDb25maWdcbiAgXHQgKiBAcHJvcGVydHkgeyhudW1iZXJ8ZnVuY3Rpb24pfVx0W3hdXG4gIFx0ICogICAgIFggY29vcmRpbmF0ZXMgb2YgdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGVcbiAgXHQgKiAgICAgaW1hZ2UgKGRlZmF1bHQ6IDxjb2RlPmZ1bmN0aW9uKG8pIHtcbiAgXHQgKiAgICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZV94KG8udGltZXN0YW1wKSAtIDg7XG4gIFx0ICogICAgIH0pPC9jb2RlPilcbiAgXHQgKiBAcHJvcGVydHkgeyhudW1iZXJ8ZnVuY3Rpb24pfVx0W3k9MTddXG4gIFx0ICogICAgIFkgY29vcmRpbmF0ZXMgb2YgdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGVcbiAgXHQgKiAgICAgaW1hZ2VcbiAgXHQgKiBAcHJvcGVydHkgeyhudW1iZXJ8ZnVuY3Rpb24pfVx0W3dpZHRoPTE2XVxuICBcdCAqICAgICBXaWR0aCBvZiB0aGUgaW1hZ2VcbiAgXHQgKiBAcHJvcGVydHkgeyhudW1iZXJ8ZnVuY3Rpb24pfVx0W2hlaWdodD0xNl1cbiAgXHQgKiAgICAgSGVpZ2h0IG9mIHRoZSBpbWFnZVxuICBcdCAqIEBwcm9wZXJ0eSB7KHN0cmluZ3xmdW5jdGlvbil9XHRbdXJsPWEgcXVlc3Rpb25tYXJrIGRhdGF1cmwgc3RyaW5nXVxuICBcdCAqICAgICBVcmwgb2YgdGhlIGltYWdlIHRvIGRpc3BsYXlcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBPYmplY3QgZGV0ZXJtaW5pbmcgaG93IHRvIGRpc3BsYXkgdGhlIGljb25zXG4gIFx0ICogKE9wdGlvbmFsKS4gQWxsIHRoZSBvcHRpb25zIGZpZWxkIGNhbiBiZSBlaXRoZXJcbiAgXHQgKiBhIHZhbHVlIG9yIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBieVxuICBcdCAqIGQzLmpzLiBUaGUgZnVuY3Rpb24gd2lsbCByZWNlaXZlIGFzIHRoZSBmaXJzdFxuICBcdCAqIGFyZ3VtZW50IHRoZSBPYnNlbCB0byBkaXNwbGF5IGFuZCBzaG91bGQgcmV0dXJuXG4gIFx0ICogdGhlIGNhbGN1bGF0ZWQgdmFsdWUuXG4gIFx0ICogSWYgYSBmdW5jdGlvbiBpcyBkZWZpbmVkIGFzIGFuIGFyZ3VtZW50LCBpdCB3aWxsXG4gIFx0ICogYmUgYmluZGVkIHRvIHRoZSBUcmFjZURpc3BsYXlJY29ucyBpbnN0YW5jZS5cbiAgXHQgKiBUaGlzIG1lYW5zIHRoYXQgeW91IGNhbiBjYWxsIGFueSBtZXRob2Qgb2YgdGhlXG4gIFx0ICogVHJhY2VEaXNwbGF5SWNvbnMgaW5zdGFuY2UgdG8gaGVscCBjYWxjdWxhdGVcbiAgXHQgKiB0aGUgeCBwb3NpdGlvbiBvciB5IHBvc2l0aW9uIG9mIGFuIGljb24uIFRoaXNcbiAgXHQgKiBtYWtlcyBpdCBlYXN5IHRvIGRlZmluZSB2YXJpb3VzIHR5cGVzIG9mIGJlaGF2aW91cnMuXG4gIFx0ICogUmVsZXZhbnQgbWV0aG9kcyB0byB1c2UgYXJlOlxuICBcdCAqIGxpbmsgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zLmNhbGN1bGF0ZV94fVxuICBcdCAqIFNlZSB0dXRvcmlhbFxuICBcdCAqIHtAdHV0b3JpYWwgdHV0bzEuM192aXN1YWxpc2F0aW9uX3BlcnNvbmFsaXNhdGlvbn1cbiAgXHQgKiBmb3IgbW9yZSBkZXRhaWxzIGFuZCBleGFtcGxlcy5cbiAgXHQgKi9cbiAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB2YWx1ZSBvciBmdW5jdGlvblxuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuICB2YXIgYmluZF9mdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbF9vcl9mdW4pIHtcbiAgICBpZiAodmFsX29yX2Z1biBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bi5iaW5kKHRoaXNfd2lkZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW47XG4gICAgfVxuICB9O1xuXG4gIHRoaXMub3B0aW9ucyA9IHt9O1xuICB0aGlzLm9wdGlvbnMueCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy54IHx8IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKSAtIDg7XG4gIH0pO1xuICB0aGlzLnN0eWxlc2hlZXQgPSBvcHRpb25zIDtcbiAgLy90aGlzLm9wdGlvbnMueSA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy55IHx8IDE3KTtcbiAgLy90aGlzLm9wdGlvbnMud2lkdGggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMud2lkdGggfHwgMTYpO1xuICAvL3RoaXMub3B0aW9ucy5oZWlnaHQgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMuaGVpZ2h0IHx8IDE2KTtcbiAgLy90aGlzLm9wdGlvbnMudXJsID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnVybCB8fCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFHN0FBQUJ1d0JIblU0TlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBS3NTVVJCVkRpTnJaTkxhRk5wRk1kLzMzZnZUYTV0WXB1cTB5YXRGV3VnUmhFWHc5QXVoSkVaQkNraXFKV0NJRXJyeHAyNDFDNkw2NjUwTS9XQm93dW5veUNEQ2pLckdZWjBJYml3eGtkVWJHeWFQbWdTbThkOWYyNU1iWFVsekg5NXp2LzhPT2R3amxCS3NWYWpVMWtFdEppYXZOQnNhS2NCcXE1LzNmS0RTd3JLWTMzSmRYN1JBSXhPWlFHTTNiSEl5bUN5UFpoWnFUOHAyZDRzUUd0WTcreU9idmh4TWpzdnA0dVZLT0EyUUVJcHhlaFVGbDJJdnVGVVozclpjdS8rOVg3UldxZzdKeHcvUUFGaFRkTFJGSm9ZNk40U2F6T05vMWN6cy8yZVVsTmpmVW4wUmlzbmUrUHA5eXYxOFR2WndybDlpVmIySjJKRVFob0tLTmtlNlVKNTVMZk1CNGFTSGVNbmUrUHBheS95QWtCY1RMOW1hN05wN1l1My9uMWxPamRROHdMTzc5M0d6bGd6RmRjall1am9VcEF0MTdqOExJZmpCNXpkdmZYQnYzT2xYM05WeTVTQU9KVktoUDk0TTI5VVhCOEZGR29XRTg5bnVmVGtIUTluRmxFS2VqWnVvTGUxaVlycjgrZmJlZTlVS2hFR2hCNlNZckJvdWRQTHRuc0FRQ25GNzY4S3ExdjJBeEFDNmw3QXN1VUNzR1M1aDR1V094MlNZbEJxUW95VUhXL085Z08rMWk5ZGJmeWNpS0dBL3dvbDNwVHJBTmgrUU5ueDVqUWhSdVEzVlorMVoxT1VnOTJiaVprRy8rU0wzSHU3Z1BmVnpRQklYNm1KbHBBZUQydnJXZHMzbXRoK3dPdFNsVWN6UzFSZGZ6VVgxaVF0SVQzdUt6V2hPNEdhakpuR25jMm1jZitqNHgxdW1KNHVWU2hVYlJTd1VIUFd3ZHZDeHVPWWFSeHdBalVwQVhVams3ZVA5YlRyRVVOYk5mMzBRNVRoWFYwYzZXa25Hdm9TanhnYXgzZTB1emN5ZVJ0UWNxd3ZTYTVxbWFZdUI0YVNIZU1OaUVKZ2FoSjl6V1FSUTJNbzJURnU2bklnVjdYTWRaZDQ4K1ZjLzNDcU0zMG0xWFgzd2N4aThkM0gyc2l0bDNtVUFDa0V5WmFtMjRlMmJUSGJUT1BjMWN4c2Y2UHUvM21tdGZyZWQvNEVTUU5LWEc4VkFDb0FBQUFBU1VWT1JLNUNZSUk9Jyk7XG5cbiAgdGhpcy5kcmF3KCk7XG59O1xuXG5UcmFjZURpc3BsYXlJY29ucy5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuXG4gICAgLy92YXIgZGl2X2VsbXQgPSBkMy5zZWxlY3QoJyMnK3RoaXMuaWQpO1xuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuc3ZnID0gZGl2X2VsbXQuYXBwZW5kKCdzdmcnKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgKHJlZCkgbGluZSByZXByZXNlbnRpbmcgY3VycmVudCB0aW1lXG4gICAgaWYgKHR5cGVvZiAodGhpcy53aW5kb3cudGltZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgJzUwJScpXG4gICAgICAuYXR0cigneTEnLCAnMCUnKVxuICAgICAgLmF0dHIoJ3gyJywgJzUwJScpXG4gICAgICAuYXR0cigneTInLCAnMTAwJScpXG4gICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAuYXR0cignc3Ryb2tlJywgJ3JlZCcpXG4gICAgICAuYXR0cignb3BhY2l0eScsICcwLjMnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuXG4gICAgdGhpcy5zdmdfZ3AgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB0aGlzLnN2Z19zZWxlY3RlZF9vYnNlbCA9IHRoaXMuc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgLmF0dHIoJ3gyJywgJzAnKVxuICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgLmF0dHIoJ3N0cm9rZScsICdibGFjaycpXG4gICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJylcbiAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgLy8gZXZlbnQgbGlzdGVuZXJzXG4gICAgdmFyIHdpZGdldCA9IHRoaXM7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCdjaGFuZ2VUaW1lT25EcmFnJywgdGhpcy5lbGVtZW50LCB7XG4gICAgICBvblVwQ2FsbGJhY2s6IGZ1bmN0aW9uKGRlbHRhX3gpIHtcbiAgICAgICAgdmFyIHRpbWVfZGVsdGEgPSAtZGVsdGFfeCAqIHdpZGdldC53aW5kb3cuZ2V0X3dpZHRoKCkgLyB3aWRnZXQuZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgd2lkZ2V0LnN2Z19ncC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAoLXdpZGdldC50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgICAgICAgd2lkZ2V0LndpbmRvdy50cmFuc2xhdGUodGltZV9kZWx0YSk7XG4gICAgICB9LFxuICAgICAgb25Nb3ZlQ2FsbGJhY2s6IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgICB3aWRnZXQuc3ZnX2dwLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvZmZzZXQgLSB3aWRnZXQudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91cignem9tbU9uU2Nyb2xsJywgdGhpcy5lbGVtZW50LCB7dGltZVdpbmRvdzogdGhpcy53aW5kb3d9KTtcbiAgfSxcblxuXG4gIC8vIFRPRE86IG5lZWRzIHRvIGJlIG5hbWVkIGZvbGxvd2luZyBhIGNvbnZlbnRpb25cbiAgLy8gdG8gYmUgZGVjaWRlZCBvblxuICAvKipcbiAgXHQgKiBDYWxjdWxhdGVzIHRoZSBYIHBvc2l0aW9uIGluIHBpeGVscyBjb3JyZXNwb25kaW5nIHRvXG4gIFx0ICogdGhlIHRpbWUgZ2l2ZW4gaW4gcGFyYW1ldGVyLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIFRpbWUgZm9yIHdoaWNoIHRvIHNlZWsgdGhlIGNvcnJlc3BvbmRpbmcgeCBwYXJhbWV0ZXJcbiAgXHQgKi9cbiAgY2FsY3VsYXRlX3g6IGZ1bmN0aW9uKHRpbWUpIHtcblxuICAgIHZhciB4ID0gKHRpbWUgLSB0aGlzLndpbmRvdy5zdGFydCkgKiB0aGlzLnNjYWxlX3ggKyB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQ7XG4gICAgcmV0dXJuIHg7XG4gIH0sXG4gIHRyYW5zbGF0ZV94OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHRpbWVfZGVsdGEgPSBlLmRhdGE7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ICs9IHRpbWVfZGVsdGEgKiB0aGlzLnNjYWxlX3g7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKC10aGlzLnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICB9LFxuXG4gIHJlZnJlc2hfeDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgIC5hdHRyKCd5JywgdGhpcy5vcHRpb25zLnkpO1xuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZSkge1xuICAgICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInRyYWNlOnVwZGF0ZVwiOlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7IC8vIGRvIG5vdCB3YW50IHRvIHRyaWdnZXIgdGhlIHJlZnJlc2hpbmcgb2YgbGlzdF9vYnNlbHMoKS4uLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgZ2V0SWNvblBhdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBgYHNlbGZgYGBpcyB0aGUgd2lkZ2V0IGluc3RhbmNlXG4gICAgICB2YXIgc2VsZiA9IHRoYXQ7XG5cbiAgICAgIC8vIGBgdGhpc2BgIGlzIHRoZSBET00gZWxlbWVudCB3aGVyZSBkMyBpcyBzZXR0aW5nIHRoaW5nc1xuXG4gICAgICB2YXIgdHlwZSA9IHRoaXMuX19kYXRhX18udHlwZTtcbiAgICAgIGlmIChzZWxmLnN0eWxlc2hlZXRbdHlwZV0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldFt0eXBlXS5pY29uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldC5kZWZhdWx0Lmljb247XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGdldFdpZHRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gYGBzZWxmYGBgaXMgdGhlIHdpZGdldCBpbnN0YW5jZVxuICAgICAgdmFyIHNlbGYgPSB0aGF0O1xuXG4gICAgICAvLyBgYHRoaXNgYCBpcyB0aGUgRE9NIGVsZW1lbnQgd2hlcmUgZDMgaXMgc2V0dGluZyB0aGluZ3NcblxuICAgICAgdmFyIHR5cGUgPSB0aGlzLl9fZGF0YV9fLnR5cGU7XG4gICAgICBpZiAoc2VsZi5zdHlsZXNoZWV0W3R5cGVdKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXRbdHlwZV0ud2lkdGg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5zdHlsZXNoZWV0LmRlZmF1bHQud2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGdldEhlaWdodCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGBgc2VsZmBgYGlzIHRoZSB3aWRnZXQgaW5zdGFuY2VcbiAgICAgIHZhciBzZWxmID0gdGhhdDtcblxuICAgICAgLy8gYGB0aGlzYGAgaXMgdGhlIERPTSBlbGVtZW50IHdoZXJlIGQzIGlzIHNldHRpbmcgdGhpbmdzXG5cbiAgICAgIHZhciB0eXBlID0gdGhpcy5fX2RhdGFfXy50eXBlO1xuICAgICAgaWYgKHNlbGYuc3R5bGVzaGVldFt0eXBlXSkge1xuICAgICAgICByZXR1cm4gc2VsZi5zdHlsZXNoZWV0W3R5cGVdLmhlaWdodDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXQuZGVmYXVsdC5oZWlnaHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGdldFkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBgYHNlbGZgYGBpcyB0aGUgd2lkZ2V0IGluc3RhbmNlXG4gICAgICB2YXIgc2VsZiA9IHRoYXQ7XG5cbiAgICAgIC8vIGBgdGhpc2BgIGlzIHRoZSBET00gZWxlbWVudCB3aGVyZSBkMyBpcyBzZXR0aW5nIHRoaW5nc1xuXG4gICAgICB2YXIgdHlwZSA9IHRoaXMuX19kYXRhX18udHlwZTtcbiAgICAgIGlmIChzZWxmLnN0eWxlc2hlZXRbdHlwZV0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldFt0eXBlXS55O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldC5kZWZhdWx0Lnk7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5leGl0KClcbiAgICAucmVtb3ZlKCk7XG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKCdpbWFnZScpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgIC5hdHRyKCd4JywgdGhpcy5vcHRpb25zLngpXG4gICAgLmF0dHIoJ3knLCBnZXRZKVxuICAgIC5hdHRyKCd3aWR0aCcsIGdldFdpZHRoKVxuICAgIC5hdHRyKCdoZWlnaHQnLCBnZXRIZWlnaHQpXG4gICAgLy8uYXR0cigneGxpbms6aHJlZicsIHRoaXMub3B0aW9ucy51cmwpO1xuICAgIC5hdHRyKCd4bGluazpocmVmJywgZ2V0SWNvblBhdGgpO1xuICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgLy8gZXZlbnRzIGRlZmluZWQgYnkgdXNlcnMgd2l0aCBqUXVlcnlcbiAgICAkKCdpbWFnZScsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBvYnNlbF9yZWRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgb2JzID0gZS5kYXRhO1xuICAgIHZhciBzZWwgPSB0aGlzLmQzT2JzZWxzKClcblx0XHRcdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAvL1x0XHRcdFx0Y29uc29sZS5sb2coJ2RhdGE6aWQsb2JzZWxfZWRpdF9pZCcsaWQsb2JzLmdldF9pZCgpLGlkID09IG9icy5nZXRfaWQoKSk7XG4gIHJldHVybiBvLmdldF9pZCgpID09IG9icy5nZXRfaWQoKTtcblx0XHRcdH0pXG5cdFx0XHQuZGF0dW0ob2JzKVxuXHRcdFx0LmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcblx0XHRcdC5hdHRyKCd5JywgdGhpcy5vcHRpb25zLnkpXG5cdFx0XHQuYXR0cignd2lkdGgnLCB0aGlzLm9wdGlvbnMud2lkdGgpXG5cdFx0XHQuYXR0cignaGVpZ2h0JywgdGhpcy5vcHRpb25zLmhlaWdodClcblx0XHRcdC5hdHRyKCd4bGluazpocmVmJywgdGhpcy5vcHRpb25zLnVybCk7XG4gIH0sXG5cbiAgZDNPYnNlbHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN2Z19ncFxuICAgIC5zZWxlY3RBbGwoJ2NpcmNsZSxpbWFnZSxyZWN0JylcbiAgICAvLyBUT0RPOiBBVFRFTlRJT04hIFdBUk5JTkchIG9ic2VscyBNVVNUIGhhdmUgYSBmaWVsZCBpZCAtPiB1c2VkIGFzIGEga2V5LlxuICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7IC8vIFRPRE86IGJvZ3VlIGluIGNhc2Ugbm8gSUQgZXhpc3RzIC0+IG1pZ2h0IGhhcHBlbiB3aXRoIEtUQlMgdHJhY2VzIGFuZCBuZXcgb2JzZWxzXG4gIH0sXG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZURpc3BsYXlJY29ucztcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbnZhciBUcmFjZURpc3BsYXlJY29uc0ZpeCA9IGZ1bmN0aW9uKGRpdklkLCB0cmFjZUlOSVRJQSwgdGltZV93aW5kb3csIHRpbWVfd2luZG93X1pvb20sIG9wdGlvbnMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGRpdklkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1UcmFjZURpc3BsYXlJY29ucycpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlID0gdHJhY2VJTklUSUE7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdyA9IHRpbWVfd2luZG93O1xuICB0aGlzLndpbmRvd1pvb20gPSB0aW1lX3dpbmRvd19ab29tO1xuICAvL3RoaXMud2luZG93Lm9uKCd0dzp1cGRhdGUnLHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICAvL3RoaXMud2luZG93Lm9uKCd0dzp0cmFuc2xhdGUnLHRoaXMudHJhbnNsYXRlX3guYmluZCh0aGlzKSk7XG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0O1xuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuICB2YXIgYmluZF9mdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbF9vcl9mdW4pIHtcbiAgICBpZiAodmFsX29yX2Z1biBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bi5iaW5kKHRoaXNfd2lkZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW47XG4gICAgfVxuICB9O1xuXG4vKiAgdGhpcy5vcHRpb25zLnkgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueSB8fCAxNyk7XG4gIHRoaXMub3B0aW9ucy53aWR0aCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy53aWR0aCB8fCAxNik7XG4gIHRoaXMub3B0aW9ucy5oZWlnaHQgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMuaGVpZ2h0IHx8IDE2KTtcbiAgdGhpcy5vcHRpb25zLnVybCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy51cmwgfHwgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBRzdBQUFCdXdCSG5VNE5RQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUtzU1VSQlZEaU5yWk5MYUZOcEZNZC8zM2Z2VGE1dFlwdXEweWF0Rld1Z1JoRVh3OUF1aEpFWkJDa2lxSldDSUVycnhwMjQxQzZMNjY1ME0vV0Jvd3Vub3lDRENqS3JHWVowSWJpd3hrZFViR3lhUG1nU204ZDlmMjVNYlhVbHpIOTV6di84T09kd2psQktzVmFqVTFrRXRKaWF2TkJzYUtjQnFxNS8zZktEU3dyS1kzM0pkWDdSQUl4T1pRR00zYkhJeW1DeVBaaFpxVDhwMmQ0c1FHdFk3K3lPYnZoeE1qc3ZwNHVWS09BMlFFSXB4ZWhVRmwySXZ1RlVaM3JaY3UvKzlYN1JXcWc3Snh3L1FBRmhUZExSRkpvWTZONFNhek9ObzFjenMvMmVVbE5qZlVuMFJpc25lK1BwOXl2MThUdlp3cmw5aVZiMkoySkVRaG9LS05rZTZVSjU1TGZNQjRhU0hlTW5lK1BwYXkveUFrQmNUTDltYTdOcDdZdTMvbjFsT2pkUTh3TE83OTNHemxnekZkY2pZdWpvVXBBdDE3ajhMSWZqQjV6ZHZmWEJ2M09sWDNOVnk1U0FPSlZLaFA5NE0yOVVYQjhGRkdvV0U4OW51ZlRrSFE5bkZsRUtlalp1b0xlMWlZcnI4K2ZiZWU5VUtoRUdoQjZTWXJCb3VkUEx0bnNBUUNuRjc2OEtxMXYyQXhBQzZsN0FzdVVDc0dTNWg0dVdPeDJTWWxCcVFveVVIVy9POWdPKzFpOWRiZnljaUtHQS93b2wzcFRyQU5oK1FObng1alFoUnVRM1ZaKzFaMU9VZzkyYmlaa0cvK1NMM0h1N2dQZlZ6UUJJWDZtSmxwQWVEMnZyV2RzM210aCt3T3RTbFVjelMxUmRmelVYMWlRdElUM3VLeldoTzRHYWpKbkduYzJtY2YrajR4MXVtSjR1VlNoVWJSU3dVSFBXd2R2Q3h1T1lhUnh3QWpVcEFYVWprN2VQOWJUckVVTmJOZjMwUTVUaFhWMGM2V2tuR3ZvU2p4Z2F4M2UwdXpjeWVSdFFjcXd2U2E1cW1hWXVCNGFTSGVNTmlFSmdhaEo5eldRUlEyTW8yVEZ1Nm5JZ1Y3WE1kWmQ0OCtWYy8zQ3FNMzBtMVhYM3djeGk4ZDNIMnNpdGwzbVVBQ2tFeVphbTI0ZTJiVEhiVE9QYzFjeHNmNlB1LzNtbXRmcmVkLzRFU1FOS1hHOFZBQ29BQUFBQVNVVk9SSzVDWUlJPScpO1xuICAqL1xuXG4gIHRoaXMub3B0aW9ucyA9IHt9O1xuICB0aGlzLm9wdGlvbnMueCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy54IHx8IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKSAtIDg7XG4gIH0pO1xuICB0aGlzLnN0eWxlc2hlZXQgPSBvcHRpb25zIDtcbiAgdGhpcy5kcmF3KCk7XG59O1xuXG5UcmFjZURpc3BsYXlJY29uc0ZpeC5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgZGl2X2VsbXQgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJyk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIChyZWQpIGxpbmUgcmVwcmVzZW50aW5nIGN1cnJlbnQgdGltZVxuICAgIGlmICh0eXBlb2YgKHRoaXMud2luZG93LnRpbWVyKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyKCd4MScsICc1MCUnKVxuICAgICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAgIC5hdHRyKCd4MicsICc1MCUnKVxuICAgICAgLmF0dHIoJ3kyJywgJzEwMCUnKVxuICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsICcxcHgnKVxuICAgICAgLmF0dHIoJ3N0cm9rZScsICdyZWQnKVxuICAgICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB2YXIgeCA9IGQzLnRpbWUuc2NhbGUoKSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIC8vIC5kb21haW4oW25ldyBEYXRlKDIwMTQsIDQsIDEpLCBuZXcgRGF0ZSgyMDE0LCA0LCAxNSkgLSAxXSlcbiAgICAgIC5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGhdKTtcbiAgICB0aGlzLnN2Z19ncCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdGhpcy5zdmdfc2VsZWN0ZWRfb2JzZWwgPSB0aGlzLnN2Zy5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgIC5hdHRyKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAgICAgLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICB0aGlzLmFkZGJydXNoKCk7XG4gIH0sXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZSxpbWFnZSxyZWN0JylcbiAgICAgIC8vIFRPRE86IEFUVEVOVElPTiEgV0FSTklORyEgb2JzZWxzIE1VU1QgaGF2ZSBhIGZpZWxkIGlkIC0+IHVzZWQgYXMgYSBrZXkuXG4gICAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7IC8vIFRPRE86IGJvZ3VlIGluIGNhc2Ugbm8gSUQgZXhpc3RzIC0+IG1pZ2h0IGhhcHBlbiB3aXRoIEtUQlMgdHJhY2VzIGFuZCBuZXcgb2JzZWxzXG4gIH0sXG4gIGNhbGN1bGF0ZV94OiBmdW5jdGlvbih0aW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuICh0aW1lIC0gdGhpcy53aW5kb3cuc3RhcnQpICogdGhpcy5zY2FsZV94ICsgdGhpcy50cmFuc2xhdGVfb2Zmc2V0O1xuICB9LFxuICB0cmFuc2xhdGVfeDogZnVuY3Rpb24oZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGNvbnNvbGUubG9nIChcInRyYW5zbGF0ZVwiKTtcbiAgICB2YXIgdGltZV9kZWx0YSA9IGUuZGF0YTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgKz0gdGltZV9kZWx0YSAqIHRoaXMuc2NhbGVfeDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAoLXRoaXMudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gIH0sXG4gIGFkZGJydXNoOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbWFyZ2luID0ge3RvcDogMjAwLCByaWdodDogNDAsIGJvdHRvbTogMjAwLCBsZWZ0OiA0MH0sXG4gICAgICBoZWlnaHQgPSA1MDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgICB2YXIgeCA9IGQzLnRpbWUuc2NhbGUoKVxuICAgIC5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKVxuICAgIC5yYW5nZShbMCwgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXSk7XG5cbiAgICB2YXIgYnJ1c2hlbmRlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGV4dGVuZDAgPSB3aWRnZXQuYnJ1c2hQLmV4dGVudCgpO1xuICAgICAgd2lkZ2V0LndpbmRvd1pvb20uc2V0X3N0YXJ0IChuZXcgRGF0ZShleHRlbmQwWzBdKS5nZXRUaW1lKCkpO1xuICAgICAgd2lkZ2V0LndpbmRvd1pvb20uc2V0X2VuZCAobmV3IERhdGUoZXh0ZW5kMFsxXSkuZ2V0VGltZSgpKTtcbiAgICB9O1xuXG4gICAgdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcbiAgICAgIC54KHgpXG4gICAgICAub24oXCJicnVzaGVuZFwiLCBicnVzaGVuZGVkKTtcbiAgICB0aGlzLmJydXNoUCA9IGJydXNoO1xuICAgIHRoaXMuZ0JydXNoID0gdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImJydXNoXCIpXG4gICAgICAuYXR0cignaWQnLCAnYnJ1c2gnKVxuICAgICAgLmNhbGwoYnJ1c2gpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIFwiMTg0MFwiKTtcbiAgICB0aGlzLmdCcnVzaC5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xuICAgIHZhciB3aWRnZXQgPSB0aGlzO1xuICB9LFxuICBkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKGUpIHtcbiAgICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0cmFjZTp1cGRhdGVcIjpcbiAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuXG4gICAgICAgIC8vdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2Vscyh0aGlzLndpbmRvdy5zdGFydCx0aGlzLndpbmRvdy5lbmQpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0OyAvLyBkbyBub3Qgd2FudCB0byB0cmlnZ2VyIHRoZSByZWZyZXNoaW5nIG9mIGxpc3Rfb2JzZWxzKCkuLi5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgZ2V0SWNvblBhdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBgYHNlbGZgYGBpcyB0aGUgd2lkZ2V0IGluc3RhbmNlXG4gICAgICB2YXIgc2VsZiA9IHRoYXQ7XG5cbiAgICAgIC8vIGBgdGhpc2BgIGlzIHRoZSBET00gZWxlbWVudCB3aGVyZSBkMyBpcyBzZXR0aW5nIHRoaW5nc1xuXG4gICAgICB2YXIgdHlwZSA9IHRoaXMuX19kYXRhX18udHlwZTtcbiAgICAgIGlmIChzZWxmLnN0eWxlc2hlZXRbdHlwZV0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldFt0eXBlXS5pY29uO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldC5kZWZhdWx0Lmljb247XG4gICAgICB9XG4gICAgfVxuICAgIHZhciBnZXRXaWR0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGBgc2VsZmBgYGlzIHRoZSB3aWRnZXQgaW5zdGFuY2VcbiAgICAgIHZhciBzZWxmID0gdGhhdDtcblxuICAgICAgLy8gYGB0aGlzYGAgaXMgdGhlIERPTSBlbGVtZW50IHdoZXJlIGQzIGlzIHNldHRpbmcgdGhpbmdzXG5cbiAgICAgIHZhciB0eXBlID0gdGhpcy5fX2RhdGFfXy50eXBlO1xuICAgICAgaWYgKHNlbGYuc3R5bGVzaGVldFt0eXBlXSkge1xuICAgICAgICByZXR1cm4gc2VsZi5zdHlsZXNoZWV0W3R5cGVdLndpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldC5kZWZhdWx0LndpZHRoO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBnZXRIZWlnaHQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBgYHNlbGZgYGBpcyB0aGUgd2lkZ2V0IGluc3RhbmNlXG4gICAgICB2YXIgc2VsZiA9IHRoYXQ7XG5cbiAgICAgIC8vIGBgdGhpc2BgIGlzIHRoZSBET00gZWxlbWVudCB3aGVyZSBkMyBpcyBzZXR0aW5nIHRoaW5nc1xuXG4gICAgICB2YXIgdHlwZSA9IHRoaXMuX19kYXRhX18udHlwZTtcbiAgICAgIGlmIChzZWxmLnN0eWxlc2hlZXRbdHlwZV0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldFt0eXBlXS5oZWlnaHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5zdHlsZXNoZWV0LmRlZmF1bHQuaGVpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBnZXRZID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gYGBzZWxmYGBgaXMgdGhlIHdpZGdldCBpbnN0YW5jZVxuICAgICAgdmFyIHNlbGYgPSB0aGF0O1xuXG4gICAgICAvLyBgYHRoaXNgYCBpcyB0aGUgRE9NIGVsZW1lbnQgd2hlcmUgZDMgaXMgc2V0dGluZyB0aGluZ3NcblxuICAgICAgdmFyIHR5cGUgPSB0aGlzLl9fZGF0YV9fLnR5cGU7XG4gICAgICBpZiAoc2VsZi5zdHlsZXNoZWV0W3R5cGVdKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXRbdHlwZV0ueTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXQuZGVmYXVsdC55O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgICAgLmV4aXQoKVxuICAgICAgLnJlbW92ZSgpO1xuICAgICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnaW1hZ2UnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcbiAgICAgIC5hdHRyKCd5JywgZ2V0WSlcbiAgICAgIC5hdHRyKCd3aWR0aCcsIGdldFdpZHRoKVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIGdldEhlaWdodClcbiAgICAgIC5hdHRyKCd4bGluazpocmVmJywgZ2V0SWNvblBhdGgpO1xuICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgLy8gZXZlbnRzIGRlZmluZWQgYnkgdXNlcnMgd2l0aCBqUXVlcnlcbiAgICAkKCdpbWFnZScsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9LFxuICByZWZyZXNoX3g6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdGhpcy5zdmdfZ3AuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLm9wdGlvbnMueSk7XG5cbiAgICB2YXIgZiA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnJ1c2hcIik7XG4gICAgZi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGYpO1xuICAgIHRoaXMuYWRkYnJ1c2goKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5SWNvbnNGaXg7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG52YXIgVHJhY2VEaXNwbGF5SWNvbnNab29tID0gZnVuY3Rpb24oZGl2SWQsIHRyYWNlLCB0aW1lX3dpbmRvdywgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBkaXZJZCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VEaXNwbGF5SWNvbnMnKTtcbiAgLy8kKHdpbmRvdykucmVzaXplKHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlID0gdHJhY2U7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdyA9IHRpbWVfd2luZG93O1xuICB0aGlzLndpbmRvdy5vbigndHc6dXBkYXRlJywgdGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG4gIC8vdGhpcy53aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsdGhpcy50cmFuc2xhdGVfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy5pbml0X0RPTSgpO1xuICAvLyB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKHRpbWVfd2luZG93LnN0YXJ0LHRpbWVfd2luZG93LmVuZCk7XG4gIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDtcbiAgdmFyIHRoaXNfd2lkZ2V0ID0gdGhpcztcbiAgdmFyIGJpbmRfZnVuY3Rpb24gPSBmdW5jdGlvbih2YWxfb3JfZnVuKSB7XG4gICAgaWYgKHZhbF9vcl9mdW4gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW4uYmluZCh0aGlzX3dpZGdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWxfb3JfZnVuO1xuICAgIH1cbiAgfTtcbiAgLyp0aGlzLm9wdGlvbnMueCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy54IHx8IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKSAtIDg7XG4gIH0pO1xuICB0aGlzLm9wdGlvbnMueSA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy55IHx8IDE3KTtcbiAgdGhpcy5vcHRpb25zLndpZHRoID0gYmluZF9mdW5jdGlvbihvcHRpb25zLndpZHRoIHx8IDE2KTtcbiAgdGhpcy5vcHRpb25zLmhlaWdodCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy5oZWlnaHQgfHwgMTYpO1xuICB0aGlzLm9wdGlvbnMudXJsID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnVybCB8fCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFHN0FBQUJ1d0JIblU0TlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBS3NTVVJCVkRpTnJaTkxhRk5wRk1kLzMzZnZUYTV0WXB1cTB5YXRGV3VnUmhFWHc5QXVoSkVaQkNraXFKV0NJRXJyeHAyNDFDNkw2NjUwTS9XQm93dW5veUNEQ2pLckdZWjBJYml3eGtkVWJHeWFQbWdTbThkOWYyNU1iWFVsekg5NXp2LzhPT2R3amxCS3NWYWpVMWtFdEppYXZOQnNhS2NCcXE1LzNmS0RTd3JLWTMzSmRYN1JBSXhPWlFHTTNiSEl5bUN5UFpoWnFUOHAyZDRzUUd0WTcreU9idmh4TWpzdnA0dVZLT0EyUUVJcHhlaFVGbDJJdnVGVVozclpjdS8rOVg3UldxZzdKeHcvUUFGaFRkTFJGSm9ZNk40U2F6T05vMWN6cy8yZVVsTmpmVW4wUmlzbmUrUHA5eXYxOFR2WndybDlpVmIySjJKRVFob0tLTmtlNlVKNTVMZk1CNGFTSGVNbmUrUHBheS95QWtCY1RMOW1hN05wN1l1My9uMWxPamRROHdMTzc5M0d6bGd6RmRjall1am9VcEF0MTdqOExJZmpCNXpkdmZYQnYzT2xYM05WeTVTQU9KVktoUDk0TTI5VVhCOEZGR29XRTg5bnVmVGtIUTluRmxFS2VqWnVvTGUxaVlycjgrZmJlZTlVS2hFR2hCNlNZckJvdWRQTHRuc0FRQ25GNzY4S3ExdjJBeEFDNmw3QXN1VUNzR1M1aDR1V094MlNZbEJxUW95VUhXL085Z08rMWk5ZGJmeWNpS0dBL3dvbDNwVHJBTmgrUU5ueDVqUWhSdVEzVlorMVoxT1VnOTJiaVprRy8rU0wzSHU3Z1BmVnpRQklYNm1KbHBBZUQydnJXZHMzbXRoK3dPdFNsVWN6UzFSZGZ6VVgxaVF0SVQzdUt6V2hPNEdhakpuR25jMm1jZitqNHgxdW1KNHVWU2hVYlJTd1VIUFd3ZHZDeHVPWWFSeHdBalVwQVhVams3ZVA5YlRyRVVOYk5mMzBRNVRoWFYwYzZXa25Hdm9TanhnYXgzZTB1emN5ZVJ0UWNxd3ZTYTVxbWFZdUI0YVNIZU1OaUVKZ2FoSjl6V1FSUTJNbzJURnU2bklnVjdYTWRaZDQ4K1ZjLzNDcU0zMG0xWFgzd2N4aThkM0gyc2l0bDNtVUFDa0V5WmFtMjRlMmJUSGJUT1BjMWN4c2Y2UHUvM21tdGZyZWQvNEVTUU5LWEc4VkFDb0FBQUFBU1VWT1JLNUNZSUk9Jyk7XG5cbiAgKi9cbiAgdGhpcy5vcHRpb25zID0ge307XG4gIHRoaXMub3B0aW9ucy54ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnggfHwgZnVuY3Rpb24obykge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZV94KG8uZ2V0X2JlZ2luKCkpIC0gODtcbiAgfSk7XG4gIHRoaXMuc3R5bGVzaGVldCA9IG9wdGlvbnMgO1xuICB0aGlzLmRyYXcoKTtcblx0fTtcblxuVHJhY2VEaXNwbGF5SWNvbnNab29tLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGRpdl9lbG10ID0gZDMuc2VsZWN0KHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5zdmcgPSBkaXZfZWxtdC5hcHBlbmQoJ3N2ZycpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSAocmVkKSBsaW5lIHJlcHJlc2VudGluZyBjdXJyZW50IHRpbWVcbiAgICBpZiAodHlwZW9mICh0aGlzLndpbmRvdy50aW1lcikgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0cigneDEnLCAnNTAlJylcbiAgICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgICAuYXR0cigneDInLCAnNTAlJylcbiAgICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgIC5hdHRyKCdzdHJva2UnLCAncmVkJylcbiAgICAgIC5hdHRyKCdvcGFjaXR5JywgJzAuMycpO1xuICAgIH1cblxuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdmFyIHggPSBkMy50aW1lLnNjYWxlKClcbi8vIC5kb21haW4oW25ldyBEYXRlKDIwMTQsIDQsIDEpLCBuZXcgRGF0ZSgyMDE0LCA0LCAxNSkgLSAxXSlcbi5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKVxuLnJhbmdlKFswLCB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGhdKTtcbiAgICB2YXIgbWFyZ2luID0ge3RvcDogMjAwLCByaWdodDogNDAsIGJvdHRvbTogMjAwLCBsZWZ0OiA0MH0sXG4gICAgIGhlaWdodCA9IDUwMCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuICAgIHRoaXMuc3ZnX2dwID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcblx0XHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB0aGlzLnN2Z19zZWxlY3RlZF9vYnNlbCA9IHRoaXMuc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgLmF0dHIoJ3gyJywgJzAnKVxuICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgLmF0dHIoJ3N0cm9rZScsICdibGFjaycpXG4gICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJylcbiAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gIH0sXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAuc2VsZWN0QWxsKCdjaXJjbGUsaW1hZ2UscmVjdCcpXG4gICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pOyAvLyBUT0RPOiBib2d1ZSBpbiBjYXNlIG5vIElEIGV4aXN0cyAtPiBtaWdodCBoYXBwZW4gd2l0aCBLVEJTIHRyYWNlcyBhbmQgbmV3IG9ic2Vsc1xuICB9LFxuICBjYWxjdWxhdGVfeDogZnVuY3Rpb24odGltZSkge1xuICAgIHZhciB4ID0gKHRpbWUgLSB0aGlzLndpbmRvdy5zdGFydCkgKiB0aGlzLnNjYWxlX3ggKyB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQ7XG4gICAgcmV0dXJuIHg7XG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oZSkge1xuXG4gICAgaWYgKGUpIHtcbiAgICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0cmFjZTp1cGRhdGVcIjpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG5cbiAgICAgICAgICAvL3RoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHModGhpcy53aW5kb3cuc3RhcnQsdGhpcy53aW5kb3cuZW5kKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7IC8vIGRvIG5vdCB3YW50IHRvIHRyaWdnZXIgdGhlIHJlZnJlc2hpbmcgb2YgbGlzdF9vYnNlbHMoKS4uLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGdldEljb25QYXRoID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gYGBzZWxmYGBgaXMgdGhlIHdpZGdldCBpbnN0YW5jZVxuICAgICAgdmFyIHNlbGYgPSB0aGF0O1xuXG4gICAgICAvLyBgYHRoaXNgYCBpcyB0aGUgRE9NIGVsZW1lbnQgd2hlcmUgZDMgaXMgc2V0dGluZyB0aGluZ3NcblxuICAgICAgdmFyIHR5cGUgPSB0aGlzLl9fZGF0YV9fLnR5cGU7XG4gICAgICBpZiAoc2VsZi5zdHlsZXNoZWV0W3R5cGVdKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXRbdHlwZV0uaWNvbjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXQuZGVmYXVsdC5pY29uO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgZ2V0V2lkdGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBgYHNlbGZgYGBpcyB0aGUgd2lkZ2V0IGluc3RhbmNlXG4gICAgICB2YXIgc2VsZiA9IHRoYXQ7XG5cbiAgICAgIC8vIGBgdGhpc2BgIGlzIHRoZSBET00gZWxlbWVudCB3aGVyZSBkMyBpcyBzZXR0aW5nIHRoaW5nc1xuXG4gICAgICB2YXIgdHlwZSA9IHRoaXMuX19kYXRhX18udHlwZTtcbiAgICAgIGlmIChzZWxmLnN0eWxlc2hlZXRbdHlwZV0pIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldFt0eXBlXS53aWR0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXQuZGVmYXVsdC53aWR0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZ2V0SGVpZ2h0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gYGBzZWxmYGBgaXMgdGhlIHdpZGdldCBpbnN0YW5jZVxuICAgICAgdmFyIHNlbGYgPSB0aGF0O1xuXG4gICAgICAvLyBgYHRoaXNgYCBpcyB0aGUgRE9NIGVsZW1lbnQgd2hlcmUgZDMgaXMgc2V0dGluZyB0aGluZ3NcblxuICAgICAgdmFyIHR5cGUgPSB0aGlzLl9fZGF0YV9fLnR5cGU7XG4gICAgICBpZiAoc2VsZi5zdHlsZXNoZWV0W3R5cGVdKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnN0eWxlc2hlZXRbdHlwZV0uaGVpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuc3R5bGVzaGVldC5kZWZhdWx0LmhlaWdodDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgZ2V0WSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGBgc2VsZmBgYGlzIHRoZSB3aWRnZXQgaW5zdGFuY2VcbiAgICAgIHZhciBzZWxmID0gdGhhdDtcblxuICAgICAgLy8gYGB0aGlzYGAgaXMgdGhlIERPTSBlbGVtZW50IHdoZXJlIGQzIGlzIHNldHRpbmcgdGhpbmdzXG5cbiAgICAgIHZhciB0eXBlID0gdGhpcy5fX2RhdGFfXy50eXBlO1xuICAgICAgaWYgKHNlbGYuc3R5bGVzaGVldFt0eXBlXSkge1xuICAgICAgICByZXR1cm4gc2VsZi5zdHlsZXNoZWV0W3R5cGVdLnk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5zdHlsZXNoZWV0LmRlZmF1bHQueTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuZXhpdCgpXG4gICAgLnJlbW92ZSgpO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZCgnaW1hZ2UnKVxuICAgIC5hdHRyKCdjbGFzcycsICdTYW1vdHJhY2VzLW9ic2VsJylcbiAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgIC5hdHRyKCd5JywgZ2V0WSlcbiAgICAuYXR0cignd2lkdGgnLCBnZXRXaWR0aClcbiAgICAuYXR0cignaGVpZ2h0JywgZ2V0SGVpZ2h0KVxuICAgIC5hdHRyKCd4bGluazpocmVmJywgZ2V0SWNvblBhdGgpO1xuICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgLy8gZXZlbnRzIGRlZmluZWQgYnkgdXNlcnMgd2l0aCBqUXVlcnlcbiAgICAkKCdpbWFnZScsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9LFxuICByZWZyZXNoX3g6IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgIC5hdHRyKCd5JywgdGhpcy5vcHRpb25zLnkpO1xuICB9LFxuXHRcdH07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5SWNvbnNab29tO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdHJhY2UuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRyYWNlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBkMy5qcyBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2QzanMub3JnXCI+ZDNqcy5vcmc8L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBERVNDUklQVElPTiBUTyBDT01FLi4uLlxuICogQHBhcmFtIHtTdHJpbmd9XHRkaXZJZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UcmFjZX1cdHRyYWNlXG4gKiAgICAgVHJhY2Ugb2JqZWN0IHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UaW1lV2luZG93fSB0aW1lX3dpbmRvd1xuICogICAgIFRpbWVXaW5kb3cgb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgdGltZSBmcmFtZVxuICogICAgIGJlaW5nIGN1cnJlbnRseSBkaXNwbGF5ZWQuXG4gKiBAdG9kbyBhZGQgZGVzY3JpcHRpb24gYW5kIHVwZGF0ZSBkb2MuLi5cbiAqL1xudmFyIFRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXMgPSBmdW5jdGlvbihkaXZJZCwgdHJhY2UsIHRpbWVfd2luZG93KSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgZGl2SWQpO1xuXG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtT2JzZWxPY2N1cnJlbmNlcycpO1xuICAvL3RoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcycpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuXG4gIHRoaXMudHJhY2UgPSB0cmFjZTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnJlbW92ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMub2JzZWxfcmVkcmF3LmJpbmQodGhpcykpO1xuXG4gIHRoaXMud2luZG93ID0gdGltZV93aW5kb3c7XG4gIHRoaXMud2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMudHJhbnNsYXRlX3guYmluZCh0aGlzKSk7XG5cbiAgLy9cdHRoaXMub2JzZWxfc2VsZWN0b3IgPSBvYnNlbF9zZWxlY3RvcjtcbiAgLy9cdHRoaXMud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJycsdGhpcy4uYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG5cbiAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB2YWx1ZSBvciBmdW5jdGlvblxuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuXG4gIHRoaXMuZHJhdygpO1xufTtcblxuVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcy5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuXG4gICAgdmFyIGRpdl9lbG10ID0gZDMuc2VsZWN0KCcjJyArIHRoaXMuaWQpO1xuICAgIHRoaXMuc3ZnID0gZGl2X2VsbXQuYXBwZW5kKCdzdmcnKVxuICAgIC5hdHRyKFwieG1sbnNcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiKVxuICAgIC5hdHRyKFwidmVyc2lvblwiLCBcIjEuMVwiKTtcblxuXG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcblxuICAgIHRoaXMuc3ZnX2dwID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG5cbiAgICAvLyBldmVudCBsaXN0ZW5lcnNcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcztcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoJ2NoYW5nZVRpbWVPbkRyYWcnLCB0aGlzLmVsZW1lbnQsIHtcbiAgICAgIG9uVXBDYWxsYmFjazogZnVuY3Rpb24oZGVsdGFfeCkge1xuICAgICAgICB2YXIgdGltZV9kZWx0YSA9IC1kZWx0YV94ICogd2lkZ2V0LndpbmRvdy5nZXRfd2lkdGgoKSAvIHdpZGdldC5lbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICB3aWRnZXQuc3ZnX2dwLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICgtd2lkZ2V0LnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICAgICAgICB3aWRnZXQud2luZG93LnRyYW5zbGF0ZSh0aW1lX2RlbHRhKTtcbiAgICAgIH0sXG4gICAgICBvbk1vdmVDYWxsYmFjazogZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgICAgIHdpZGdldC5zdmdfZ3AuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9mZnNldCAtIHdpZGdldC50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCd6b21tT25TY3JvbGwnLCB0aGlzLmVsZW1lbnQsIHt0aW1lV2luZG93OiB0aGlzLndpbmRvd30pO1xuICB9LFxuXG5cbiAgLy8gVE9ETzogbmVlZHMgdG8gYmUgbmFtZWQgZm9sbG93aW5nIGEgY29udmVudGlvblxuICAvLyB0byBiZSBkZWNpZGVkIG9uXG4gIC8qKlxuICBcdCAqIENhbGN1bGF0ZXMgdGhlIFggcG9zaXRpb24gaW4gcGl4ZWxzIGNvcnJlc3BvbmRpbmcgdG9cbiAgXHQgKiB0aGUgdGltZSBnaXZlbiBpbiBwYXJhbWV0ZXIuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgVGltZSBmb3Igd2hpY2ggdG8gc2VlayB0aGUgY29ycmVzcG9uZGluZyB4IHBhcmFtZXRlclxuICBcdCAqL1xuICBjYWxjdWxhdGVfeDogZnVuY3Rpb24obykge1xuICAgIHZhciB4ID0gKG8uZ2V0X2JlZ2luKCkgLSB0aGlzLndpbmRvdy5zdGFydCkgKiB0aGlzLnNjYWxlX3ggKyB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQ7XG4gICAgcmV0dXJuIHhcblxuICB9LFxuICBjYWxjdWxhdGVfd2lkdGg6IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgeCA9IE1hdGgubWF4KDAuMDEsIChvLmdldF9lbmQoKSAtIG8uZ2V0X2JlZ2luKCkpICogdGhpcy5zY2FsZV94KTsgLy8gd2lkdGggb2YgMCA9PiBub3QgZGlzcGxheWVkXG4gICAgcmV0dXJuIHhcbiAgfSxcbiAgdHJhbnNsYXRlX3g6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgdGltZV9kZWx0YSA9IGUuZGF0YTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgKz0gdGltZV9kZWx0YSAqIHRoaXMuc2NhbGVfeDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAoLXRoaXMudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gIH0sXG5cbiAgcmVmcmVzaF94OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5hdHRyKCd4JywgdGhpcy5jYWxjdWxhdGVfeC5iaW5kKHRoaXMpKVxuICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMuY2FsY3VsYXRlX3dpZHRoLmJpbmQodGhpcykpXG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIGlmIChlKSB7XG4gICAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgICBjYXNlIFwidHJhY2U6dXBkYXRlXCI6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDsgLy8gZG8gbm90IHdhbnQgdG8gdHJpZ2dlciB0aGUgcmVmcmVzaGluZyBvZiBsaXN0X29ic2VscygpLi4uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmV4aXQoKVxuICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgIC8vLmF0dHIoJ2NsYXNzJywnU2Ftb3RyYWNlcy1vYnNlbCcpXG4gICAgLmF0dHIoJ3gnLCB0aGlzLmNhbGN1bGF0ZV94LmJpbmQodGhpcykpXG4gICAgLmF0dHIoJ3knLCAnMCcpXG4gICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5jYWxjdWxhdGVfd2lkdGguYmluZCh0aGlzKSlcbiAgICAuYXR0cignaGVpZ2h0JywgJzIwJyk7XG4gICAgLy8uYXR0cignc3Ryb2tlLXdpZHRoJywnMXB4JylcbiAgICAvLy5hdHRyKCdzdHJva2UnLCdibGFjaycpO1xuICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgLy8gZXZlbnRzIGRlZmluZWQgYnkgdXNlcnMgd2l0aCBqUXVlcnlcbiAgICAkKCdyZWN0JywgdGhpcy5lbGVtZW50KS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAkLmRhdGEoZWwsIHtcbiAgICAgICAgJ1NhbW90cmFjZXMtdHlwZSc6ICdvYnNlbCcsXG4gICAgICAgICdTYW1vdHJhY2VzLWRhdGEnOiBkMy5zZWxlY3QoZWwpLmRhdHVtKClcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIG9ic2VsX3JlZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIHZhciBvYnMgPSBlLmRhdGE7XG4gICAgdmFyIHNlbCA9IHRoaXMuZDNPYnNlbHMoKVxuXHRcdFx0LmZpbHRlcihmdW5jdGlvbihvKSB7XG4gIC8vXHRcdFx0XHRjb25zb2xlLmxvZygnZGF0YTppZCxvYnNlbF9lZGl0X2lkJyxpZCxvYnMuZ2V0X2lkKCksaWQgPT0gb2JzLmdldF9pZCgpKTtcbiAgcmV0dXJuIG8uZ2V0X2lkKCkgPT0gb2JzLmdldF9pZCgpO1xuXHRcdFx0fSlcblx0XHRcdC5kYXR1bShvYnMpXG5cdFx0XHQuYXR0cigneCcsIHRoaXMuY2FsY3VsYXRlX3guYmluZCh0aGlzKSlcblx0XHRcdC5hdHRyKCd3aWR0aCcsIHRoaXMuY2FsY3VsYXRlX3dpZHRoLmJpbmQodGhpcykpXG5cdFx0XHQuYXR0cigneGxpbms6aHJlZicsIHRoaXMub3B0aW9ucy51cmwpO1xuICB9LFxuXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAuc2VsZWN0QWxsKCdjaXJjbGUsaW1hZ2UscmVjdCcpXG4gICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pOyAvLyBUT0RPOiBib2d1ZSBpbiBjYXNlIG5vIElEIGV4aXN0cyAtPiBtaWdodCBoYXBwZW4gd2l0aCBLVEJTIHRyYWNlcyBhbmQgbmV3IG9ic2Vsc1xuICB9LFxuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcztcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbnZhciBUcmFjZURpc3BsYXlUZXh0ID0gZnVuY3Rpb24oZGl2SWQsIHRyYWNlLCB0aW1lV2luZG93KSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBXaWRnZXQuY2FsbCh0aGlzLCBkaXZJZCk7XG4gIHRoaXMuZGl2SWQgPSBkaXZJZDtcbiAgdGhpcy5hZGRfY2xhc3MoXCJXaWRnZXQtVHJhY2VEaXNwbGF5VGV4dFwiKTtcbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLnRyYWNlLm9uKFwidHJhY2U6dXBkYXRlVFwiLCB0aGlzLnJlZnJlc2hYLmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKFwidHJhY2U6Y3JlYXRlX29ic2VsX1RleHRcIiwgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdyA9IHRpbWVXaW5kb3c7XG4gIHRoaXMud2luZG93Lm9uKFwidHc6dXBkYXRlXCIsIHRoaXMucmVmcmVzaFguYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93Lm9uKFwiQ2hhbmdlTGFuZ2FnZVwiLCB0aGlzLnJlZnJlc2hYLmJpbmQodGhpcykpO1xuICB0aGlzLnJlZnJlc2hYKCk7XG4gIHRoaXMuZGF0YU9iID0gW107XG59O1xuXG5UcmFjZURpc3BsYXlUZXh0LnByb3RvdHlwZSA9IHtcbiAgZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuZGF0YU9iLnB1c2goSlNPTi5zdHJpbmdpZnkoZS5kYXRhKSk7XG4gICAgLy90aGlzLmRhdGFPYiA9IEpTT04uc3RyaW5naWZ5IChlLmRhdGEpO1xuICAgIC8vIEFzc2lzdC5WaWV3VHJhY2UuYWRkT2JzZWxWaXN1KGUuZGF0YSwgdGhpcy5kaXZJZCk7IC8vIFRPRE8gd2hhdCBpcyBBc3Npc3QgP1xuICAgICQoXCIjXCIgKyBlLmRhdGFbXCJAaWRcIl0pLmhpZGUoKTtcbiAgfSxcbiAgcmVmcmVzaFg6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB0aW1lV2luZG93ID0gdGhpcy53aW5kb3c7XG4gICAgdGhpcy50cmFjZS5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKHRpbWVXaW5kb3cuc3RhcnQgPD0gby5nZXRfYmVnaW4oKSAmJiBvLmdldF9iZWdpbigpIDw9IHRpbWVXaW5kb3cuZW5kKSB7XG4gICAgICAgICQoXCIjXCIgKyBvLmdldF9pZCgpKS5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKFwiI1wiICsgby5nZXRfaWQoKSkuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICByZWRyYXc6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2SWQpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5kYXRhT2IuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAvLyBBc3Npc3QuVmlld1RyYWNlLmFkZE9ic2VsVmlzdShKU09OLnBhcnNlKG8pLCB3aWRqLmRpdklkKTsgLy8gVE9ETyB3aGF0IGlzIEFzc2lzdCA/XG4gICAgICAkKFwiI1wiICsgSlNPTi5wYXJzZShvKVtcIkBpZFwiXSkuaGlkZSgpO1xuICAgIH0pO1xuICAgIHRoaXMucmVmcmVzaFgoKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5VGV4dDtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRyYWNlLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0cmFjZS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgZDMuanMgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9kM2pzLm9yZ1wiPmQzanMub3JnPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogREVTQ1JJUFRJT04gVE8gQ09NRS4uLi5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0ZGl2SWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVHJhY2V9XHR0cmFjZVxuICogICAgIFRyYWNlIG9iamVjdCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVGltZVdpbmRvd30gdGltZV93aW5kb3dcbiAqICAgICBUaW1lV2luZG93IG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIHRpbWUgZnJhbWVcbiAqICAgICBiZWluZyBjdXJyZW50bHkgZGlzcGxheWVkLlxuICogQHRvZG8gYWRkIGRlc2NyaXB0aW9uIGFuZCB1cGRhdGUgZG9jLi4uXG4gKi9cbnZhciBUcmFjZURpc3BsYXlab29tQ29udGV4dCA9IGZ1bmN0aW9uKGRpdklkLCB0cmFjZSwgdGltZV93aW5kb3cxLCB0aW1lX3dpbmRvdzIsIG9wdGlvbnMxLCBvcHRpb25zMikge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGRpdklkKTtcblxuICB0aGlzLm1vZGUgPSAnd2luZG93X3N5bmMnO1xuICBpZiAob3B0aW9uczEgIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5tb2RlID0gJ29ic2VsX3N5bmMnO1xuICAgIGlmIChvcHRpb25zMSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMxLmhhc093blByb3BlcnR5KCd4JykpIHtcbiAgICAgIHRoaXMueDEgPSBvcHRpb25zMS54LmJpbmQodGhpcyk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zMiAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMyLmhhc093blByb3BlcnR5KCd4JykpIHtcbiAgICAgIHRoaXMueDIgPSBvcHRpb25zMi54LmJpbmQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1PYnNlbE9jY3VycmVuY2VzJyk7XG4gIC8vdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1UcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6cmVtb3ZlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcy5vYnNlbF9yZWRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy53aW5kb3cxID0gdGltZV93aW5kb3cxO1xuICB0aGlzLndpbmRvdzEub24oJ3R3OnVwZGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdzEub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuXG4gIHRoaXMud2luZG93MiA9IHRpbWVfd2luZG93MjtcbiAgdGhpcy53aW5kb3cyLm9uKCd0dzp1cGRhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cyLm9uKCd0dzp0cmFuc2xhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcblxuICAvL1x0dGhpcy5vYnNlbF9zZWxlY3RvciA9IG9ic2VsX3NlbGVjdG9yO1xuICAvL1x0dGhpcy53aW5kb3cxLmFkZEV2ZW50TGlzdGVuZXIoJycsdGhpcy4uYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG5cbiAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB2YWx1ZSBvciBmdW5jdGlvblxuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuXG4gIHRoaXMuZHJhdygpO1xufTtcblxuVHJhY2VEaXNwbGF5Wm9vbUNvbnRleHQucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cblxuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCgnIycgKyB0aGlzLmlkKTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJylcbiAgICAuYXR0cihcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIilcbiAgICAuYXR0cihcInZlcnNpb25cIiwgXCIxLjFcIik7XG5cblxuICAgIHRoaXMuc2NhbGVfeDEgPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdzEuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy5zY2FsZV94MiA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93Mi5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuXG4gICAgdGhpcy5zeW5jX3BhdGggPSB0aGlzLnN2Zy5hcHBlbmQoJ3BhdGgnKVxuICAgIC5hdHRyKCdzdHlsZScsICdzdHJva2U6Z3JleTtzdHJva2Utd2lkdGg6MXB4O2ZpbGw6I2RkZDsnKTtcbiAgICB0aGlzLnN2Z19ncCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuXG4gIH0sXG5cblxuICAvLyBUT0RPOiBuZWVkcyB0byBiZSBuYW1lZCBmb2xsb3dpbmcgYSBjb252ZW50aW9uXG4gIC8vIHRvIGJlIGRlY2lkZWQgb25cbiAgLyoqXG4gIFx0ICogQ2FsY3VsYXRlcyB0aGUgWCBwb3NpdGlvbiBpbiBwaXhlbHMgY29ycmVzcG9uZGluZyB0b1xuICBcdCAqIHRoZSB0aW1lIGdpdmVuIGluIHBhcmFtZXRlci5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gdGltZSBUaW1lIGZvciB3aGljaCB0byBzZWVrIHRoZSBjb3JyZXNwb25kaW5nIHggcGFyYW1ldGVyXG4gIFx0ICovXG4gIGNhbGN1bGF0ZV94OiBmdW5jdGlvbih0KSB7XG4gICAgdmFyIHggPSAodCAtIHRoaXMud19zdGFydCkgKiB0aGlzLnNjYWxlX3g7XG4gICAgcmV0dXJuIHggO1xuICB9LFxuICBvMngxOiBmdW5jdGlvbihvKSB7XG4gICAgdGhpcy53X3N0YXJ0ID0gdGhpcy53aW5kb3cxLnN0YXJ0O1xuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuc2NhbGVfeDE7XG4gICAgcmV0dXJuIHRoaXMueDEobyk7XG4gIH0sXG4gIG8yeDI6IGZ1bmN0aW9uKG8pIHtcbiAgICB0aGlzLndfc3RhcnQgPSB0aGlzLndpbmRvdzIuc3RhcnQ7XG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5zY2FsZV94MjtcbiAgICByZXR1cm4gdGhpcy54MihvKTtcbiAgfSxcbiAgeDE6IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKTtcbiAgfSxcbiAgeDI6IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKTtcbiAgfSxcbiAgY2FsY3VsYXRlX3BhdGg6IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcCA9IFtdO1xuICAgIHZhciB4MSA9IHRoaXMubzJ4MShvKTtcbiAgICB2YXIgeDIgPSB0aGlzLm8yeDIobyk7XG4gICAgcCA9IFsnTScsIHgxLCAnMCcsICdDJywgeDEsICcxMCwnLCB4MiwgJzEwLCcsIHgyLCAnMjAnXTtcbiAgICByZXR1cm4gcC5qb2luKCcgJyk7XG4gIH0sXG4gIGNhbGN1bGF0ZV92aXNpYmlsaXR5OiBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHgxID0gdGhpcy5vMngxKG8pO1xuICAgIGlmICh4MSA8IDApIHJldHVybiBmYWxzZTtcbiAgICBpZiAoeDEgPiB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGgpIHJldHVybiBmYWxzZTtcbiAgICB2YXIgeDIgPSB0aGlzLm8yeDIobyk7XG4gICAgaWYgKHgyID4gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHgyIDwgMCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBjYWxjdWxhdGVfc3R5bGU6IGZ1bmN0aW9uKG8pIHtcbiAgICBpZiAodGhpcy5jYWxjdWxhdGVfdmlzaWJpbGl0eShvKSkge1xuICAgICAgLy9pZih0cnVlKSB7XG4gICAgICByZXR1cm4gJ3N0cm9rZTpncmV5O3N0cm9rZS13aWR0aDoxcHg7ZmlsbDpub25lOyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnc3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjFweDtmaWxsOm5vbmU7JztcbiAgICB9XG4gIH0sXG4gIHRyYW5zbGF0ZV94OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHRpbWVfZGVsdGEgPSBlLmRhdGE7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ICs9IHRpbWVfZGVsdGEgKiB0aGlzLnNjYWxlX3g7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKC10aGlzLnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICB9LFxuXG4gIHJlZnJlc2hfeDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zY2FsZV94MSA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93MS5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnNjYWxlX3gyID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cyLmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgaWYgKHRoaXMubW9kZSA9PSBcIm9ic2VsX3N5bmNcIikge1xuICAgICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuYXR0cignZCcsIHRoaXMuY2FsY3VsYXRlX3BhdGguYmluZCh0aGlzKSlcbiAgICAgIC5hdHRyKCdzdHlsZScsIHRoaXMuY2FsY3VsYXRlX3N0eWxlLmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN5bmNfcGF0aC5hdHRyKCdkJywgdGhpcy5jYWxjdWxhdGVfc3luY19wYXRoLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0cmFjZTp1cGRhdGVcIjpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0OyAvLyBkbyBub3Qgd2FudCB0byB0cmlnZ2VyIHRoZSByZWZyZXNoaW5nIG9mIGxpc3Rfb2JzZWxzKCkuLi5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMubW9kZSA9PSBcIm9ic2VsX3N5bmNcIikge1xuICAgICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuZXhpdCgpXG4gICAgICAucmVtb3ZlKCk7XG4gICAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC8vLmF0dHIoJ2NsYXNzJywnU2Ftb3RyYWNlcy1vYnNlbCcpXG4gICAgICAuYXR0cignZCcsIHRoaXMuY2FsY3VsYXRlX3BhdGguYmluZCh0aGlzKSlcbiAgICAgIC5hdHRyKCdzdHlsZScsIHRoaXMuY2FsY3VsYXRlX3N0eWxlLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5kM09ic2VscygpXG4gICAgICAvLy5hdHRyKCdzdHJva2Utd2lkdGgnLCcxcHgnKVxuICAgICAgLy8uYXR0cignc3Ryb2tlJywnYmxhY2snKTtcbiAgICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgICAvLyBldmVudHMgZGVmaW5lZCBieSB1c2VycyB3aXRoIGpRdWVyeVxuICAgICAgJCgncGF0aCcsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAkLmRhdGEoZWwsIHtcbiAgICAgICAgICAnU2Ftb3RyYWNlcy10eXBlJzogJ29ic2VsJyxcbiAgICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3luY19wYXRoLmF0dHIoJ2QnLCB0aGlzLmNhbGN1bGF0ZV9zeW5jX3BhdGguYmluZCh0aGlzKSk7XG4gICAgfVxuICB9LFxuICBjYWxjdWxhdGVfc3luY19wYXRoOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHMgPSBNYXRoLm1heCh0aGlzLndpbmRvdzEuc3RhcnQsIHRoaXMud2luZG93Mi5zdGFydCk7XG4gICAgdmFyIHRlID0gTWF0aC5taW4odGhpcy53aW5kb3cxLmVuZCwgdGhpcy53aW5kb3cyLmVuZCk7XG4gICAgdmFyIHgxcyA9IChNYXRoLm1pbih0cywgdGhpcy53aW5kb3cxLmVuZCkgLSB0aGlzLndpbmRvdzEuc3RhcnQpICogdGhpcy5zY2FsZV94MTtcbiAgICB2YXIgeDJzID0gKE1hdGgubWluKHRzLCB0aGlzLndpbmRvdzIuZW5kKSAtIHRoaXMud2luZG93Mi5zdGFydCkgKiB0aGlzLnNjYWxlX3gyO1xuICAgIHZhciB4MWUgPSAoTWF0aC5tYXgodGUsIHRoaXMud2luZG93MS5zdGFydCkgLSB0aGlzLndpbmRvdzEuc3RhcnQpICogdGhpcy5zY2FsZV94MTtcbiAgICB2YXIgeDJlID0gKE1hdGgubWF4KHRlLCB0aGlzLndpbmRvdzIuc3RhcnQpIC0gdGhpcy53aW5kb3cyLnN0YXJ0KSAqIHRoaXMuc2NhbGVfeDI7XG4gICAgdmFyIHAgPSBbXCJNXCIsIHgxcywgXCIwXCIsIFwiQ1wiLCB4MXMsIFwiMjAsXCIsIHgycywgXCIwLFwiLCB4MnMsIFwiMjBcIiwgXCJMXCIsIHgyZSwgXCIyMFwiLCBcIkNcIiwgeDJlLCBcIjAsXCIsIHgxZSwgXCIyMCxcIiwgeDFlLCBcIjBcIiwgXCJaXCJdO1xuICAgIHJldHVybiBwLmpvaW4oXCIgXCIpO1xuICB9LFxuICBvYnNlbF9yZWRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgb2JzID0gZS5kYXRhO1xuICAgIHZhciBzZWwgPSB0aGlzLmQzT2JzZWxzKClcblx0XHRcdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAvL1x0XHRcdFx0Y29uc29sZS5sb2coJ2RhdGE6aWQsb2JzZWxfZWRpdF9pZCcsaWQsb2JzLmdldF9pZCgpLGlkID09IG9icy5nZXRfaWQoKSk7XG4gIHJldHVybiBvLmdldF9pZCgpID09IG9icy5nZXRfaWQoKTtcblx0XHRcdH0pXG5cdFx0XHQuZGF0dW0ob2JzKVxuXHRcdFx0LmF0dHIoJ2QnLCB0aGlzLmNhbGN1bGF0ZV9wYXRoLmJpbmQodGhpcykpXG4gIH0sXG5cbiAgZDNPYnNlbHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN2Z19ncFxuICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgIC8vIFRPRE86IEFUVEVOVElPTiEgV0FSTklORyEgb2JzZWxzIE1VU1QgaGF2ZSBhIGZpZWxkIGlkIC0+IHVzZWQgYXMgYSBrZXkuXG4gICAgLy8uZGF0YSh0aGlzLmRhdGEpOyAvLyxmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pO1xuICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcblxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlRGlzcGxheVpvb21Db250ZXh0O1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xucmVxdWlyZSgnanF1ZXJ5LW1vdXNld2hlZWwnKSgkKTtcblxuLyoqXG4gKiBAbWl4aW5cbiAqIEByZXF1aXJlcyBqUXVlcnkgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9qcXVlcnkuY29tXCI+anF1ZXJ5LmNvbTwvYT4pXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IE1vdXNlIFdoZWVsIHBsdWdpbiAoc2VlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYnJhbmRvbmFhcm9uL2pxdWVyeS1tb3VzZXdoZWVsXCI+TW91c2UgV2hlZWwgcGx1Z2luPC9hPilcbiAqIEBkZXNjcmlwdGlvblxuICogQWxsIHdpZGdldHMgc2hvdWxkIGluaGVyaXQgZnJvbSB0aGlzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXQuXG4gKlxuICogSW4gb3JkZXIgdG8gdXNlIGNyZWF0ZSBhIHdpZGdldCB0aGF0IGluaGVyaXRzIGZyb20gdGhlXG4gKiBXaWRnZXQgY2xhc3MsIG9uZSBtdXNoIGluY2x1ZGUgdGhlIGZvbGxvd2luZyBjb2RlIGluXG4gKiB0aGUgY29uc3RydWN0b3Igb2YgdGhlaXIgd2lkZ2V0LlxuICogPGNvZGU+XG4gKiA8L2NvZGU+XG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIElkIG9mIHRoZSBIVE1MIGVsZW1lbnQgdGhlXG4gKiBXaWRnZXQgaXMgYXR0YWNoZWQgdG8uXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50IEhUTUwgZWxlbWVudCB0aGVcbiAqIFdpZGdldCBpcyBhdHRhY2hlZCB0by5cbiAqL1xudmFyIFdpZGdldCA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gIFx0ICogQWRkcyB0aGUgZ2l2ZW4gY2xhc3MgdG8gdGhlIEhUTUwgZWxlbWVudCB0byB3aGljaFxuICBcdCAqIHRoaXMgV2lkZ2V0IGlzIGF0dGFjaGVkIHRvLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLldpZGdldHMuV2lkZ2V0LnByb3RvdHlwZVxuICBcdCAqIEBwdWJsaWNcbiAgXHQgKiBAbWV0aG9kXG4gIFx0ICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzX25hbWUgTmFtZSBvZiB0aGUgY2xhc3MgdG8gYWRkXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGFkZF9jbGFzcyhjbGFzc19uYW1lKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc19uYW1lO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5sb2FkKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUgPSAnJztcbiAgICAvL1x0XHR0aGlzLmVsZW1lbnQuXG4gIH1cbiAgLyoqXG4gIFx0ICogQ3JlYXRlcyBhIG5ldyBiZWhhdmlvdXIgKGludGVyYWN0aW9uIHBvc3NpYmlsaXR5KVxuICBcdCAqIHdpdGggdGhlIHdpZGdldC5cbiAgXHQgKiBUd28gYmVoYXZpb3VycyBhcmUgaW1wbGVtZW50ZWQgc28gZmFyOlxuICBcdCAqIDEuICdjaGFuZ2VUaW1lT25EcmFnJ1xuICBcdCAqIDIuICd6b21tT25TY3JvbGwnXG4gIFx0ICpcbiAgXHQgKiAxLiAnY2hhbmdlVGltZU9uRHJhZycgYmVoYXZpb3VyIGFsbG93cyB0byBjaGFuZ2VcbiAgXHQgKiBhIHtAbGluayBTYW1vdHJhY2VzLkxpYi5UaW1lcn0gb24gYSBkcmFnLW4tZHJvcCBsaWtlIGV2ZW50XG4gIFx0ICogKEphdmFTY3JpcHQgJ21vdXNlZG93bicsICdtb3VzZW1vdmUnLCAnbW91c2V1cCcgYW5kICdtb3VzZWxlYXZlJ1xuICBcdCAqIGV2ZW50cykuIFRoaXMgYWxsb3dzIHRvIGNoYW5nZSB0aGUgY3VycmVudCB0aW1lIGJ5IGRyYWdnaW5nXG4gIFx0ICogYSB0cmFjZSB2aXN1YWxpc2F0aW9uIG9yIGEgc2xpZGVyIGZvciBpbnN0YW5jZS5cbiAgXHQgKlxuICBcdCAqIDIuICdjaGFuZ2VUaW1lT25EcmFnJyBiZWhhdmlvdXIgYWxsb3dzIHRvIGNoYW5nZVxuICBcdCAqIGEge0BsaW5rIFNhbW90cmFjZXMuTGliLlRpbWVXaW5kb3d9IG9uIGEgbW91c2Ugc2Nyb2xsIGV2ZW50XG4gIFx0ICogKEphdmFTY3JpcHQgJ3doZWVsJyBldmVudClcbiAgXHQgKlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLldpZGdldHMuV2lkZ2V0LnByb3RvdHlwZVxuICBcdCAqIEBwdWJsaWNcbiAgXHQgKiBAbWV0aG9kXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGJlaGF2aW91ck5hbWUgTmFtZSBvZiB0aGUgYmVoYXZpb3VyXG4gIFx0ICogICAgICgnY2hhbmdlVGltZU9uRHJhZycgb3IgJ3pvbW1PblNjcm9sbCcpLiBTZWUgZGVzY3JpcHRpb24gYWJvdmUuXG4gIFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZXZlbnRUYXJnZXRFbGVtZW50IEhUTUwgRWxlbWVudCBvbiB3aGljaFxuICBcdCAqICAgICBhbiBldmVudExpc3RlbmVyIHdpbGwgYmUgY3JlYXRlZCAodHlwaWNhbGx5LCB0aGUgZWxlbWVudCB5b3VcbiAgXHQgKiAgICAgd2FudCB0byBpbnRlcmFjdCB3aXRoKS5cbiAgXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0IE9wdGlvbnMgdGhhdCB2YXJ5IGRlcGVuZGluZyBvbiB0aGVcbiAgXHQgKiAgICAgc2VsZWN0ZWQgYmVoYXZpb3VyLlxuICBcdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdC5vblVwQ2FsbGJhY2tcbiAgXHQgKiAgICAoZm9yICdjaGFuZ2VUaW1lT25EcmFnJyBiZWhhdmlvdXIgb25seSlcbiAgXHQgKiAgICBDYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdtb3VzZXVwJyBldmVudCB3aWxsIGJlXG4gIFx0ICogICAgdHJpZ2dlcmVkLiBUaGUgYXJndW1lbnQgZGVsdGFfeCBpcyBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrXG4gIFx0ICogICAgYW5kIHJlcHJlc2VudHMgdGhlIG9mZnNldCBvZiB0aGUgeCBheGlzIGluIHBpeGVscyBiZXR3ZWVuIHRoZVxuICBcdCAqICAgIG1vbWVudCB0aGUgbW91c2Vkb3duIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZCBhbmQgdGhlIG1vbWVudFxuICBcdCAqICAgIHRoZSBjdXJyZW50IG1vdXNldXAgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICBcdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdC5vbk1vdmVDYWxsYmFja1xuICBcdCAqICAgIChmb3IgJ2NoYW5nZVRpbWVPbkRyYWcnIGJlaGF2aW91ciBvbmx5KVxuICBcdCAqICAgIENhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ21vdXNlbW92ZScgZXZlbnQgd2lsbCBiZVxuICBcdCAqICAgIHRyaWdnZXJlZC4gVGhlIGFyZ3VtZW50IGRlbHRhX3ggaXMgcGFzc2VkIHRvIHRoZSBjYWxsYmFja1xuICBcdCAqICAgIGFuZCByZXByZXNlbnRzIHRoZSBvZmZzZXQgb2YgdGhlIHggYXhpcyBpbiBwaXhlbHMgYmV0d2VlbiB0aGVcbiAgXHQgKiAgICBtb21lbnQgdGhlIG1vdXNlZG93biBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQgYW5kIHRoZSBtb21lbnRcbiAgXHQgKiAgICB0aGUgY3VycmVudCBtb3VzZW1vdmUgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICBcdCAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuVGltZVdpbmRvd30gb3B0LnRpbWVXaW5kb3dcbiAgXHQgKiAgICAoZm9yICd6b21tT25TY3JvbGwnIGJlaGF2aW91ciBvbmx5KVxuICBcdCAqICAgIHtAbGluayBTYW1vdHJhY2VzLkxpYi5UaW1lV2luZG93fSBvYmplY3QgdGhhdCB3aWxsXG4gIFx0ICogICAgYmUgZWRpdGVkIHdoZW4gdGhlIHpvb20gYWN0aW9uIGlzIHByb2R1Y2VkLlxuICBcdCAqL1xuICBmdW5jdGlvbiBhZGRfYmVoYXZpb3VyKGJlaGF2aW91ck5hbWUsIGV2ZW50VGFyZ2V0RWxlbWVudCwgb3B0KSB7XG5cbiAgICBzd2l0Y2ggKGJlaGF2aW91ck5hbWUpIHtcbiAgICAgIGNhc2UgJ2NoYW5nZVRpbWVPbkRyYWcnOlxuICAgICAgICB2YXIgbW91c2Vkb3duLCBtb3VzZXVwLCBtb3VzZW1vdmU7XG4gICAgICAgIHZhciBpbml0X2NsaWVudF94O1xuICAgICAgICBtb3VzZWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgLy9cdGNvbnNvbGUubG9nKCdtb3VzZWRvd24nKTtcbiAgICAgICAgICBpbml0X2NsaWVudF94ID0gZS5jbGllbnRYO1xuICAgICAgICAgIGV2ZW50VGFyZ2V0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmUpO1xuICAgICAgICAgIGV2ZW50VGFyZ2V0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cCk7XG4gICAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBtb3VzZXVwKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIG1vdXNldXAgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgLy9cdGNvbnNvbGUubG9nKCdtb3VzZXVwJyk7XG4gICAgICAgICAgaWYgKGluaXRfY2xpZW50X3ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIGRlbHRhX3ggPSAoZS5jbGllbnRYIC0gaW5pdF9jbGllbnRfeCk7XG4gICAgICAgICAgICBvcHQub25VcENhbGxiYWNrKGRlbHRhX3gpO1xuICAgICAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZSk7XG4gICAgICAgICAgICBldmVudFRhcmdldEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXApO1xuICAgICAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBtb3VzZXVwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICBtb3VzZW1vdmUgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGRlbHRhX3ggPSAoZS5jbGllbnRYIC0gaW5pdF9jbGllbnRfeCk7XG4gICAgICAgICAgb3B0Lm9uTW92ZUNhbGxiYWNrKGRlbHRhX3gpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlZG93bik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnem9tbU9uU2Nyb2xsJzpcbiAgICAgICAgdmFyIHdoZWVsO1xuXG4gICAgICAgIHdoZWVsID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHZhciBjb2VmID0gTWF0aC5wb3coMC44LCBlLmRlbHRhWSk7XG4gICAgICAgICAgb3B0LnRpbWVXaW5kb3cuem9vbShjb2VmKTtcbiAgICAgICAgICAvL1x0XHRcdFx0b3B0Lm9uV2hlZWxDYWxsYmFjay5jYWxsKG9wdC5iaW5kLGNvZWYpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgICQoZXZlbnRUYXJnZXRFbGVtZW50KS5tb3VzZXdoZWVsKHdoZWVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG4gICAgLy8gRE9DVU1FTlRFRCBBQk9WRVxuICAgIC8vdGhpcy5pZCA9IGlkO1xuICAgIC8vdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XG4gICAgdGhpcy5lbGVtZW50ID0gaWQ7XG4gICAgdGhpcy5pZCA9IHRoaXMuZWxlbWVudC5pZDtcblxuICAgIHRoaXMuYWRkX2NsYXNzID0gYWRkX2NsYXNzO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91ciA9IGFkZF9iZWhhdmlvdXI7XG5cbiAgICAvLyBjYWxsIG1ldGhvZFxuICAgIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQnKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2lkZ2V0O1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdGltZSBzY2FsZS5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdGltZSBzY2FsZS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgZDMuanMgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9kM2pzLm9yZ1wiPmQzanMub3JnPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpbmRvd1NjYWxlIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSB0aGUgdGVtcG9yYWwgc2NhbGUgb2YgYVxuICoge0BsaW5rIFNhbW90cmFjZXMuVGltZVdpbmRvd3xUaW1lV2luZG93fS4gVGhpc1xuICogd2lkZ2V0IHVzZXMgZDMuanMgdG8gY2FsY3VsYXRlIGFuZCBkaXNwbGF5IHRoZSBzY2FsZS5cbiAqXG4gKiBOb3RlOiB1bmxlc3MgdGhlIG9wdGlvbmFsIGFyZ3VtZW50IGlzSmF2YXNjcmlwdERhdGUgaXMgZGVmaW5lZCxcbiAqIHRoZSB3aWRnZXQgd2lsbCB0cnkgdG8gZ3Vlc3MgaWYgdGltZSBpcyBkaXNwbGF5ZWQgYXMgbnVtYmVycyxcbiAqIG9yIGlmIHRpbWUgaXMgZGlzcGxheWVkIGluIHllYXIvbW9udGgvZGF5L2hvdXJzL2V0Yy5cbiAqIFRoaXMgc2Vjb25kIG9wdGlvbiBhc3N1bWVzIHRoYXQgdGhlIHRpbWUgaXMgcmVwcmVzZW50ZWQgaW5cbiAqIG1pbGxpc2Vjb25kcyBzaW5jZSAxIEphbnVhcnkgMTk3MCBVVEMuXG4gKiBAcGFyYW0ge1N0cmluZ31cdGRpdklkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHt9IHRpbWVXaW5kb3dcbiAqICAgICBUaW1lV2luZG93Q2VudGVyZWRPblRpbWUgb2JqZWN0XG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpc0phdmFzY3JpcHREYXRlXVxuICogICAgIEJvb2xlYW4gdGhhdCBkZXNjcmliZXMgaWYgdGhlIHNjYWxlIHJlcHJlc2VudHMgYSBKYXZhU2NyaXB0IERhdGUgb2JqZWN0LlxuICogICAgIElmIHNldCB0byB0cnVlLCB0aGUgd2lkZ2V0IHdpbGwgZGlzcGxheSB5ZWFycywgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcy4uLlxuICogICAgIGFzIGlmIHRoZSB0aW1lIGdpdmVuIHdhcyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBlbGxhcHNlZCBzaW5jZSAxIEphbnVhcnkgMTk3MCBVVEMuXG4gKiAgICAgSWYgc2V0IHRvIGZhbHNlLCB0aGUgd2lkZ2V0IHdpbGwgZGlzcGxheSB0aGUgbnVtYmVycyB3aXRob3V0IGF0dGVtcHRpbmdcbiAqICAgICBhbnkgY29udmVyc2lvbi5cbiAqICAgICBUaGlzIGFyZ3VtZW50IGlzIG9wdGlvbmFsLiBJZiBub3Qgc2V0LCB0aGUgd2lkZ2V0IHdpbGwgdHJ5IHRvIGd1ZXNzOlxuICogICAgIElmIHRoZSBudW1iZXIgb2YgdGhlIHN0YXJ0IG9mIHRoZSBnaXZlbiBUaW1lV2luZG93IGlzIGFib3ZlIGEgYmlsbGlvbiwgdGhlblxuICogICAgIGl0IGlzIGFzc3VtZWQgdGhhdCB0aGUgSmF2YVNjcmlwdCBEYXRlIG9iamVjdCBoYXMgYmVlbiB1c2VkIHRvIHJlcHJlc2VudCB0aW1lLlxuICogICAgIE90aGVyd2lzZSwgdGhlIG51bWVyaWNhbCB2YWx1ZSBvZiB0aW1lIHdpbGwgYmUgZGlzcGxheWVkLlxuICovXG52YXIgV2luZG93U2NhbGUgPSBmdW5jdGlvbihodG1sRWxlbWVudCwgdGltZVdpbmRvdywgaXNKYXZhc2NyaXB0RGF0ZSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sRWxlbWVudCk7XG5cbiAgdGhpcy5hZGRfY2xhc3MoXCJXaWRnZXQtV2luZG93U2NhbGVcIik7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5kcmF3LmJpbmQodGhpcykpO1xuXG4gIHRoaXMud2luZG93ID0gdGltZVdpbmRvdztcbiAgdGhpcy53aW5kb3cub24oXCJ0dzp1cGRhdGVcIiwgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdy5vbihcInR3OnRyYW5zbGF0ZVwiLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG5cbiAgLy8gVHJ5aW5nIHRvIGd1ZXNzIGlmIHRpbWVXaW5kb3cgaXMgcmVsYXRlZCB0byBhIERhdGUoKSBvYmplY3RcbiAgaWYgKHRoaXMud2luZG93LnN0YXJ0ID4gMTAwMDAwMDAwMCkgeyAvLyAxb145ID4gMTEgSmFuIDE5NzAgaWYgYSBEYXRlIG9iamVjdFxuICAgIHRoaXMuaXNKYXZhc2NyaXB0RGF0ZSA9IGlzSmF2YXNjcmlwdERhdGUgfHwgdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmlzSmF2YXNjcmlwdERhdGUgPSBpc0phdmFzY3JpcHREYXRlIHx8IGZhbHNlO1xuICB9XG5cbiAgdGhpcy5pbml0RE9NKCk7XG4gIC8vIFVwZGF0ZSBzbGlkZXIncyBwb3NpdGlvblxuICB0aGlzLmRyYXcoKTtcblxufTtcblxuV2luZG93U2NhbGUucHJvdG90eXBlID0ge1xuICBpbml0RE9NOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvLyBDcmVhdGUgdGhlIHNsaWRlclxuICAgIHRoaXMuc3ZnID0gZDMuc2VsZWN0KHRoaXMuZWxlbWVudCkuYXBwZW5kKFwic3ZnXCIpO1xuICAgIGlmICh0aGlzLmlzSmF2YXNjcmlwdERhdGUpIHtcbiAgICAgIHRoaXMueCA9IGQzLnRpbWUuc2NhbGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54ID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgfVxuICAgIHRoaXMueEF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHRoaXMueCk7XG4gICAgdGhpcy54LmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pO1xuICAgIHRoaXMuc3ZnQXhpcyA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIik7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKFwiem9tbU9uU2Nyb2xsXCIsIHRoaXMuZWxlbWVudCwge3RpbWVXaW5kb3c6IHRoaXMud2luZG93fSk7XG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy54LnJhbmdlKFswLCB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGhdKTtcbiAgICB0aGlzLnguZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSk7XG4gICAgdGhpcy5zdmdBeGlzLmNhbGwodGhpcy54QXhpcyk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd1NjYWxlO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxudmFyIFdpbmRvd1NjYWxlRml4ID0gZnVuY3Rpb24oaHRtbF9pZCwgdGltZV93aW5kb3csIGlzX2phdmFzY3JpcHRfZGF0ZSkge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVdpbmRvd1NjYWxlJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdyA9IHRpbWVfd2luZG93O1xuICAvLyB0cnlpbmcgdG8gZ3Vlc3MgaWYgdGltZV93aW5kb3cgaXMgcmVsYXRlZCB0byBhIERhdGUoKSBvYmplY3RcbiAgaWYgKHRoaXMud2luZG93LnN0YXJ0ID4gMTAwMDAwMDAwMCkgeyAvLyAxb145ID4gMTEgSmFuIDE5NzAgaWYgYSBEYXRlIG9iamVjdFxuICAgIHRoaXMuaXNfamF2YXNjcmlwdF9kYXRlID0gaXNfamF2YXNjcmlwdF9kYXRlIHx8IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pc19qYXZhc2NyaXB0X2RhdGUgPSBpc19qYXZhc2NyaXB0X2RhdGUgfHwgZmFsc2U7XG4gIH1cbiAgdGhpcy53aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy5pbml0X0RPTSgpO1xuICAvLyB1cGRhdGUgc2xpZGVyJ3MgcG9zaXRpb25cbiAgdGhpcy5kcmF3KCk7XG5cdFx0fTtcblxuV2luZG93U2NhbGVGaXgucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgLy8gY3JlYXRlIHRoZSBzbGlkZXJcbiAgICAvL3RoaXMuc3ZnID0gZDMuc2VsZWN0KFwiI1wiK3RoaXMuaWQpLmFwcGVuZChcInN2Z1wiKTtcbiAgICB0aGlzLnN2ZyA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpLmFwcGVuZChcInN2Z1wiKTtcbiAgICBpZiAodGhpcy5pc19qYXZhc2NyaXB0X2RhdGUpIHtcbiAgICAgIHRoaXMueCA9IGQzLnRpbWUuc2NhbGUoKTsgLy8ucmFuZ2UoWzAsdGhpcy5lbGVtZW50LmdldFNpemUoKS54XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMueCA9IGQzLnNjYWxlLmxpbmVhcigpO1xuICAgIH1cbiAgICAvL3RoaXMueEF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHRoaXMueCk7IC8vLm9yaWVudChcImJvdHRvbVwiKTtcbiAgICB0aGlzLnhBeGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh0aGlzLngpO1xuICAgIC8vLnRpY2tzKGQzLnRpbWUuZGF5cyk7XG4gICAgdGhpcy54LmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pO1xuICAgIHRoaXMuc3ZnQXhpcyA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIik7XG5cbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLngucmFuZ2UoWzAsIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aF0pOy8vID0gZDMudGltZS5zY2FsZSgpLnJhbmdlKFswLHRoaXMuZWxlbWVudC5nZXRTaXplKCkueF0pO1xuICAgIHRoaXMueC5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKTtcbiAgICB0aGlzLnN2Z0F4aXMuY2FsbCh0aGlzLnhBeGlzKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93U2NhbGVGaXg7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB3aW5kb3cgc2xpZGVyLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB3aW5kb3cgc2xpZGVyLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLmQzQmFzaWMuV2luZG93U2xpZGVyIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSBhIHRlbXBvcmFsIHdpbmRvd1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0ZGl2SWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0gd2lkZV93aW5kb3dcbiAqICAgICBUaW1lV2luZG93IG9iamVjdCAtPiByZXByZXNlbnRpbmcgdGhlIHdpZGUgd2luZG93XG4gKiAgICAgKGUuZy4sIHRoZSB3aG9sZSB0cmFjZSlcbiAqIEBwYXJhbSBzbGlkZXJfd2luZG93XG4gKiAgICAgVGltZVdpbmRvdyBvYmplY3QgLT4gcmVwcmVzZW50aW5nIHRoZSBzbWFsbCB3aW5kb3dcbiAqICAgICAoZS5nLiwgdGhlIGN1cnJlbnQgdGltZSB3aW5kb3cgYmVpbmcgdmlzdWFsaXNlZCB3aXRoIGFub3RoZXIgd2lkZ2V0KVxuICovXG52YXIgV2luZG93U2xpZGVyID0gZnVuY3Rpb24oaHRtbF9pZCwgd2lkZV93aW5kb3csIHNsaWRlcl93aW5kb3cpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcblxuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVdpbmRvd1NsaWRlcicpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcblxuICB0aGlzLndpZGVfd2luZG93ID0gd2lkZV93aW5kb3c7XG4gIHRoaXMud2lkZV93aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aWRlX3dpbmRvdy5vbigndHc6dHJhbnNsYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnNsaWRlcl93aW5kb3cgPSBzbGlkZXJfd2luZG93O1xuICB0aGlzLnNsaWRlcl93aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy5zbGlkZXJfd2luZG93Lm9uKCd0dzp0cmFuc2xhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5zbGlkZXJfb2Zmc2V0ID0gMDtcbiAgdGhpcy53aWR0aCA9IDA7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICAvLyB1cGRhdGUgc2xpZGVyJ3MgcG9zaXRpb25cbiAgdGhpcy5kcmF3KCk7XG59O1xuXG5XaW5kb3dTbGlkZXIucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBjcmVhdGUgdGhlIHNsaWRlclxuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zbGlkZXJfZWxlbWVudCk7XG5cbiAgICAvLyBoYW5kIG1hZGUgZHJhZyZkcm9wXG4gICAgLy8gZXZlbnQgbGlzdGVuZXJzXG4gICAgdmFyIHdpZGdldCA9IHRoaXM7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCdjaGFuZ2VUaW1lT25EcmFnJywgdGhpcy5zbGlkZXJfZWxlbWVudCwge1xuICAgICAgb25VcENhbGxiYWNrOiBmdW5jdGlvbihkZWx0YV94KSB7XG4gICAgICAgIHZhciB0aW1lX2RlbHRhID0gZGVsdGFfeCAqIHdpZGdldC53aWRlX3dpbmRvdy5nZXRfd2lkdGgoKSAvIHdpZGdldC5lbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICB3aWRnZXQuc2xpZGVyX3dpbmRvdy50cmFuc2xhdGUodGltZV9kZWx0YSk7XG4gICAgICB9LFxuICAgICAgb25Nb3ZlQ2FsbGJhY2s6IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgICB3aWRnZXQuc2xpZGVyX2VsZW1lbnQuc3R5bGUubGVmdCA9IHdpZGdldC5zbGlkZXJfb2Zmc2V0ICsgb2Zmc2V0ICsgJ3B4JztcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCd6b21tT25TY3JvbGwnLCB0aGlzLmVsZW1lbnQsIHt0aW1lV2luZG93OiB0aGlzLnNsaWRlcl93aW5kb3d9KTtcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5zbGlkZXJfd2luZG93LmdldF93aWR0aCgpIC8gdGhpcy53aWRlX3dpbmRvdy5nZXRfd2lkdGgoKSAqIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICB0aGlzLnNsaWRlcl9vZmZzZXQgPSAodGhpcy5zbGlkZXJfd2luZG93LnN0YXJ0IC0gdGhpcy53aWRlX3dpbmRvdy5zdGFydCkgKiB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpZGVfd2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5zbGlkZXJfZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnO1xuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQuc3R5bGUubGVmdCA9IHRoaXMuc2xpZGVyX29mZnNldCArICdweCc7XG4gIH0sXG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dTbGlkZXI7XG4iLCIvKipcbiAqIEBtaXhpblxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgRXZlbnRIYW5kbGVyIE9iamVjdCBpcyBub3QgYSBjbGFzcy4gSG93ZXZlciwgaXQgaXNcbiAqIGRlc2lnbmVkIGZvciBvdGhlciBjbGFzc2VzIHRvIGluaGVyaXQgb2YgYSBwcmVkZWZpbmVkXG4gKiBPYnNlcnZhYmxlIGJlaGF2aW91ci4gRm9yIHRoaXMgcmVhc29uLCB0aGlzIGZ1bmN0aW9uIGlzXG4gKiBkb2N1bWVudGVkIGFzIGEgQ2xhc3MuXG4gKlxuICogSW4gb3JkZXIgdG8gdXNlIGNyZWF0ZSBhIGNsYXNzIHRoYXQgXCJpbmhlcml0c1wiIGZyb20gdGhlXG4gKiBcIkV2ZW50SGFuZGxlciBjbGFzc1wiLCBvbmUgbXVzdCBydW4gdGhlIGZvbGxvd2luZyBjb2RlIGluXG4gKiB0aGUgY29uc3RydWN0b3I6XG4gKiA8Y29kZT5cbiAqIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gKiA8L2NvZGU+XG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9IGNhbGxiYWNrc1xuICogICAgIEhhc2ggbWF0Y2hpbmcgY2FsbGJhY2tzIHRvIGV2ZW50X3R5cGVzLlxuICovXG52YXIgRXZlbnRIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xuICAvKipcbiAgXHQgKiBUcmlnZ2VycyBhbGwgdGhlIHJlZ2lzdHJlZCBjYWxsYmFja3MuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLnByb3RvdHlwZVxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudF90eXBlXG4gIFx0ICogICAgIFRoZSB0eXBlIG9mIHRoZSB0cmlnZ2VyZWQgZXZlbnQuXG4gIFx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICBcdCAqICAgICBPYmplY3Qgc2VudCB3aXRoIHRoZSBtZXNzYWdlIHRvIHRoZSBsaXN0ZW5lcnMgKHNlZVxuICBcdCAqICAgICB7QGxpbmsgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIjb259KS5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gdHJpZ2dlcihldmVudF90eXBlLCBvYmplY3QpIHtcbiAgICB2YXIgZSA9IHsgdHlwZTogZXZlbnRfdHlwZSwgZGF0YTogb2JqZWN0IH07XG4gICAgaWYgKHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXS5tYXAoZnVuY3Rpb24oZikgeyBmKGUpOyB9KTtcbiAgICB9XG4gICAgLypcbiAgICBcdFx0dGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0uZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIFx0XHRcdGNhbGxiYWNrKGUpO1xuICAgIFx0XHR9KTtcbiAgICBcdFx0Ki9cbiAgfVxuICAvKipcbiAgXHQgKiBBZGRzIGEgY2FsbGJhY2sgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnRcbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIucHJvdG90eXBlXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50X3R5cGVcbiAgXHQgKiAgICAgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRvIGxpc3RlbiB0by5cbiAgXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICBcdCAqICAgICBDYWxsYmFjayB0byBjYWxsIHdoZW4gdGhlIGFuIGV2ZW50IG9mIHR5cGVcbiAgXHQgKiAgICAgZXZlbnRfdHlwZSBpcyB0cmlnZ2VyZWQuIE5vdGU6IHRoZSBjYWxsYmFja1xuICBcdCAqICAgICBjYW4gcmVjZWl2ZSBvbmUgYXJndW1lbnQgdGhhdCBjb250YWluc1xuICBcdCAqICAgICBkZXRhaWxzIGFib3V0IHRoZSB0cmlnZ2VyZWQgZXZlbnQuXG4gIFx0ICogICAgIFRoaXMgZXZlbnQgYXJndW1lbnQgY29udGFpbnMgdHdvIGZpZWxkczpcbiAgXHQgKiAgICAgZXZlbnQudHlwZTogdGhlIHR5cGUgb2YgZXZlbnQgdGhhdCBpcyB0cmlnZ2VyZWRcbiAgXHQgKiAgICAgZXZlbnQuZGF0YTogb3B0aW9uYWwgZGF0YSB0aGF0IGlzIHRyYW5zbWl0dGVkIHdpdGggdGhlIGV2ZW50XG4gIFx0ICovXG4gIGZ1bmN0aW9uIG9uKGV2ZW50X3R5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoY2FsbGJhY2spICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XG4gICAgICBjb25zb2xlLmxvZyhjYWxsYmFjayk7XG4gICAgICB0aHJvdyBcIkNhbGxiYWNrIGZvciBldmVudCBcIiArIGV2ZW50X3R5cGUgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiO1xuICAgIH1cbiAgICB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXSA9IHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdIHx8IFtdO1xuICAgIHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50cykge1xuICAgIC8vIERPQ1VNRU5URUQgQUJPVkVcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHRoaXMuY2FsbGJhY2tzIHx8IHt9O1xuICAgIHRoaXMudHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgdGhpcy5vbiA9IG9uO1xuICAgIC8qKlxuICAgIFx0XHQgKiBFdmVudENvbmZpZyBpcyBhIHNob3J0bmFtZSBmb3IgdGhlXG4gICAgXHRcdCAqIHtAbGluayBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ31cbiAgICBcdFx0ICogb2JqZWN0LlxuICAgIFx0XHQgKiBAdHlwZWRlZiBFdmVudENvbmZpZ1xuICAgIFx0XHQgKiBAc2VlIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnXG4gICAgXHRcdCAqL1xuICAgIC8qKlxuICAgIFx0XHQgKiBUaGUgRXZlbnRDb25maWcgb2JqZWN0IGlzIHVzZWQgZm9yIGNvbmZpZ3VyYXRpbmcgdGhlXG4gICAgXHRcdCAqIGZ1bmN0aW9ucyB0byBjYWxsIGV2ZW50cyBhcmUgdHJpZ2dlcmVkIGJ5IGFuIEV2ZW50SGFuZGxlciBPYmplY3QuXG4gICAgXHRcdCAqIEVhY2ggYXR0cmlidXRlIG5hbWUgb2YgdGhlIEV2ZW50Q29uZmlnIGNvcnJlc3BvbmRzXG4gICAgXHRcdCAqIHRvIGEgdHlwZSBvZiBldmVudCBsaXN0ZW5lZCB0bywgYW5kIGVhY2hcbiAgICBcdFx0ICogdmFsdWUgaXMgdGhlIGZ1bmN0aW9uIHRvIHRyaWdnZXIgb24gdGhpcyBldmVudC5cbiAgICBcdFx0ICogQHR5cGVkZWYgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIuRXZlbnRDb25maWdcbiAgICBcdFx0ICogQHR5cGUge09iamVjdC48c3RyaW5nLCBmdW5jdGlvbj59XG4gICAgXHRcdCAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGV2ZW50TmFtZSAtIEZ1bmN0aW9uIHRvIHRyaWdnZXIgb24gdGhpcyBldmVudC5cbiAgICBcdFx0ICovXG4gICAgZnVuY3Rpb24gY2FsbGJhY2soZSkgeyBmdW4oZS5kYXRhKTsgfVxuICAgIGZvciAodmFyIGV2ZW50X25hbWUgaW4gZXZlbnRzKSB7XG4gICAgICBcdFx0aWYgKGV2ZW50Lmhhc093blByb3BlcnR5KGV2ZW50X25hbWUpKSB7XG4gICAgICAgIFx0XHR2YXIgZnVuID0gZXZlbnRzW2V2ZW50X25hbWVdO1xuICAgICAgICBcdFx0dGhpcy5vbihldmVudF9uYW1lLCBjYWxsYmFjayk7XG4gICAgICBcdFx0fVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRIYW5kbGVyO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG5cbi8qKlxuICogQGNsYXNzIEphdmFzY3JpcHQgS1RCUy5CYXNlIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUy5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5LVEJTLkJhc2UgaXMgYSBKYXZhc2NyaXB0IEtUQlMgYmFzZVxuICogb2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXQgdGhlXG4gKiBsaXN0IG9mIHRyYWNlcyBhdmFpbGFibGUgaW4gdGhlIEtUQlMgYmFzZS4gQWNjZXNzIGFcbiAqIHNwZWNpZmljIHRyYWNlLCBldGMuXG4gKlxuICogQHRvZG8gRnVsbHkgaW1wbGVtZW50IEtUQlMgQVBJXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHR1cmlcdFVSSSBvZiB0aGUgQmFzZSB0byBsb2FkLlxuICogQHBhcmFtIHtTdHJpbmd9XHRbaWRdXHRJRCBvZiB0aGUgQmFzZSB0byBsb2FkLlxuICovXG52YXIgQmFzZSA9IGZ1bmN0aW9uIEJhc2UodXJpLCBpZCkge1xuICAvLyBLVEJTLkJhc2UgaXMgYSBSZXNvdXJjZVxuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgeyBpZCA9IHVyaTsgfVxuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBpZCwgdXJpLCAnQmFzZScsIFwiXCIpO1xuICB0aGlzLnRyYWNlcyA9IFtdO1xuICB0aGlzLm1vZGVscyA9IFtdO1xuICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbn07XG5cbkJhc2UucHJvdG90eXBlID0ge1xuICBnZXQ6IGZ1bmN0aW9uKGlkKSB7fSxcbiAgLyoqXG4gIFx0ICogR2V0cyB0aGUgbGlzdCBvZiB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBiYXNlLlxuICBcdCAqIEByZXR1cm5zIHtBcnJheS48U3RyaW5nPn0gQXJyYXkgb2YgdGhlIElEIG9mIHRoZSB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBCYXNlLlxuICBcdCAqL1xuICBsaXN0X3RyYWNlczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2VzO1xuICB9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGxpc3RfbW9kZWxzOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMubW9kZWxzOyB9LFxuICAvKipcbiAgXHQgKiBDcmVhdGUgYSBzdG9yZWQgdHJhY2UgaW4gdGhlIEtUQlNcbiAgXHQgKiBAcGFyYW0gaWQge1N0cmluZ30gSUQgb2YgdGhlIGNyZWF0ZWQgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW21vZGVsXSB7TW9kZWx9IE1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbb3JpZ2luXSB7T3JpZ2lufSBPcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtkZWZhdWx0X3N1YmplY3RdIHtTdHJpbmd9IERlZmF1bHQgc3ViamVjdCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW2xhYmVsXSB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKi9cbiAgY3JlYXRlX3N0b3JlZF90cmFjZTogZnVuY3Rpb24oaWQsIG1vZGVsLCBvcmlnaW4sIGRlZmF1bHRfc3ViamVjdCwgbGFiZWwpIHtcbiAgICB2YXIgbmV3X3RyYWNlID0ge1xuICAgICAgXCJAY29udGV4dFwiOlx0XCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgIFwiQHR5cGVcIjpcdFwiU3RvcmVkVHJhY2VcIixcbiAgICAgIFwiQGlkXCI6XHRcdGlkICsgXCIvXCJcbiAgICB9O1xuICAgIG5ld190cmFjZS5oYXNNb2RlbCA9IChtb2RlbCA9PT0gdW5kZWZpbmVkKT9cImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEvc2ltcGxlLXRyYWNlLW1vZGVsXCI6bW9kZWw7XG4gICAgbmV3X3RyYWNlLm9yaWdpbiA9IChvcmlnaW4gPT09IHVuZGVmaW5lZCk/XCIxOTcwLTAxLTAxVDAwOjAwOjAwWlwiOm9yaWdpbjtcbiAgICAvL1x0XHRcdGlmKG9yaWdpbj09dW5kZWZpbmVkKSBuZXdfdHJhY2Uub3JpZ2luID0gb3JpZ2luO1xuICAgIGlmIChkZWZhdWx0X3N1YmplY3QgPT09IHVuZGVmaW5lZCkgbmV3X3RyYWNlLmRlZmF1bHRfc3ViamVjdCA9IGRlZmF1bHRfc3ViamVjdDtcbiAgICBpZiAobGFiZWwgPT09IHVuZGVmaW5lZCkgbmV3X3RyYWNlLmxhYmVsID0gbGFiZWw7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy51cmksXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkobmV3X3RyYWNlKSxcbiAgICAgIHN1Y2Nlc3M6IHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaC5iaW5kKHRoaXMpLFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygncXVlcnkgZXJyb3InKTtcbiAgICAgICAgY29uc29sZS5sb2coW2pxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvcl0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgY3JlYXRlX2NvbXB1dGVkX3RyYWNlOiBmdW5jdGlvbihpZCwgbWV0aG9kLCBwYXJhbWV0ZXJzLCBzb3VyY2VzLCBsYWJlbCkge30sXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgY3JlYXRlX21vZGVsOiBmdW5jdGlvbihpZCwgcGFyZW50cywgbGFiZWwpIHt9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGNyZWF0ZV9tZXRob2Q6IGZ1bmN0aW9uKGlkLCBwYXJlbnQsIHBhcmFtZXRlcnMsIGxhYmVsKSB7fSxcbiAgLy8vLy8vLy8vLy9cbiAgLyoqXG4gIFx0ICogT3ZlcmxvYWRzIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5LVEJTLlJlc291Y2UjX29uX3N0YXRlX3JlZnJlc2hffSBtZXRob2QuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKi9cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgLy9cdGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2xhYmVsJywgZGF0YVtcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbFwiXSwgJ2Jhc2U6dXBkYXRlJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygndHJhY2VzJywgZGF0YS5jb250YWlucywgJ2Jhc2U6dXBkYXRlJyk7XG4gIH0sXG4gIC8vLy8vLy8vLy8vIEFEREVEIC8gQVBJXG4gIC8qKlxuICBcdCAqIEdldHMgYSB0cmFjZSBmcm9tIGl0cyBJRFxuICBcdCAqIEBwYXJhbSBpZCB7U3RyaW5nfSBJRCBvZiB0aGUgdHJhY2UgdG8gZ2V0LlxuICBcdCAqIEByZXR1cm4ge1NhbW90cmFjZXMuS1RCUy5UcmFjZX0gVGhlIHJldHJpZXZlZCBUcmFjZS5cbiAgXHQgKi9cbiAgZ2V0X3RyYWNlOiBmdW5jdGlvbihpZCkge1xuICAgIHJldHVybiBuZXcgU2Ftb3RyYWNlcy5LVEJTLlRyYWNlKHRoaXMudXJpICsgaWQgKyAnLycsIGlkKTtcbiAgfSxcbiAgLy8vLy8vLy8vLy8vXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgVHJhY2Ugb2JqZWN0IHRoYXQgaXMgc3luY2hyb25pc2VkIHRvIGEgS1RCUy5cbiAqIEBjbGFzcyBKYXZhc2NyaXB0IE1vZGVsIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUyBNb2RlbC5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuIC8gREVSQkVMIEZhdG1hXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5LVEJTLk1vZGVsaXMgYSBKYXZhc2NyaXB0IFRyYWNlIG9iamVjdFxuICogdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgTW9kZWwuIFRoaXMgT2JqZWN0IGltcGxlbWVudHMgdGhlIEtUQlMgQVBJLlxuICogTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIGdldFxuICogdGhlIExpc3RlIG9mIHR5cGUgb2YgT2JzZWxzIGZyb20gdGhlIEtUQlMgTW9kZWwsIC5cbiAqXG4gKlxuICpcbiAqIEB0b2RvIEZ1bGx5IGltcGxlbWVudCBLVEJTIEFQSVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0dXJpXHRVUkkgb2YgdGhlIEtUQlMgdHJhY2UgdG8gbG9hZC5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0W2lkXVx0SUQgb2YgdGhlIEtUQlMgdHJhY2UgdG8gbG9hZC5cbiAqL1xuXG5cbnZhciBNb2RlbCA9IGZ1bmN0aW9uKHVyaSwgaWQpIHtcbiAgaWYgKGlkID09PSB1bmRlZmluZWQpIHsgaWQgPSB1cmk7IH1cbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIGlkLCB1cmksICdNb2RlbCcsIFwiXCIpO1xuICB0aGlzLmxpc3RfVHlwZXNfT2JzbGVzID0gW11cbiAgLy9pZiAoZGF0YSAhPT0gJ251bGwnKVxuICAvL3sgdGhpcy5saXN0X1R5cGVzX09ic2xlcz0gdGhpcy5saXN0X29ic2VscyhkYXRhKTt9XG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xuXG59O1xuXG5Nb2RlbC5wcm90b3R5cGUgPSB7XG5cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdGhpcy5saXN0X1R5cGVzX09ic2xlcyA9IHRoaXMubGlzdF9vYnNlbHMoZGF0YVtcIkBncmFwaFwiXSk7XG4gIH0sXG4gIGxpc3Rfb2JzZWxzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgTGlzdGVPYnNlbFR5cGUgPSBbXTtcbiAgICBNID0gdGhpcztcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWwsIGtleSkge1xuICAgICAgdmFyIG9icyA9IHthdHRyaWJ1dGVzOiBbXX07XG4gICAgICBpZiAoZWxbXCJAdHlwZVwiXSA9PSBcIk9ic2VsVHlwZVwiKSAgICAgIHtcbiAgICAgICAgb2JzLmlkID0gZWxbXCJAaWRcIl07XG4gICAgICAgIG9icy50eXBlID0gZWxbXCJAaWRcIl0uc3Vic3RyKDEpO1xuICAgICAgICBvYnMuY29jaGUgPSBmYWxzZTtcbiAgICAgICAgLy9vYnNba2V5XSA9IGVsW2tleV1cbiAgICAgICAgaWYgKGVsWydoYXNTdXBlck9ic2VsVHlwZSddKSAgICAgICAge1xuICAgICAgICAgIG9icy5oYXNTdXBlck9ic2VsVHlwZSA9IGVsWydoYXNTdXBlck9ic2VsVHlwZSddXG4gICAgICAgIH1cbiAgICAgICAgTGlzdGVPYnNlbFR5cGUucHVzaChvYnMpO1xuICAgICAgICAvL00udHJpZ2dlcignTW9kZWw6RHJhd19vYnNlbCcsIG9icyk7XG4gICAgICAgIC8vY29uc29sZS5sb2cgKCd0cmlnZXInKVxuICAgICAgfSAgICAgIGVsc2UgaWYgKGVsW1wiQHR5cGVcIl0gPT0gXCJBdHRyaWJ1dGVUeXBlXCIpICAgICAge1xuICAgICAgICBvYnMgPSBNLkdldE9ic2VsVHlwZShlbFtcImhhc0F0dHJpYnV0ZU9ic2VsVHlwZVwiXSwgTGlzdGVPYnNlbFR5cGUpO1xuICAgICAgICBlbFsnY29jaGUnXSA9IGZhbHNlO1xuICAgICAgICBvYnMuYXR0cmlidXRlcy5wdXNoKGVsKTtcblxuICAgICAgfVxuXG4gICAgfSk7XG4gICAgTGlzdGVPYnNlbFR5cGUuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5oYXNTdXBlck9ic2VsVHlwZSkgICAgICB7XG5cbiAgICAgICAgby5hdHRyaWJ1dGVzID0gTS5nZXRBdHRyaWJ1dGVzIChvLmhhc1N1cGVyT2JzZWxUeXBlWzBdKVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIE0udHJpZ2dlcignTW9kZWw6bGlzdGVUeXBlJywgTGlzdGVPYnNlbFR5cGUpO1xuICAgIHJldHVybiBMaXN0ZU9ic2VsVHlwZTtcblxuICB9LFxuXG4gIEdldE9ic2VsVHlwZTogZnVuY3Rpb24oaWQsIExpc3RlT2JzZWxUeXBlKSAge1xuICAgIHZhciBvYnMgPSBbXTtcbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG9bXCJpZFwiXSA9PSBpZCkgICAgICB7XG5cbiAgICAgICAgb2JzUiA9IG87XG5cbiAgICAgIH1cblxuICAgIH1cbiAgICApXG4gICAgcmV0dXJuIG9ic1I7XG4gIH0sXG5cblxuXG5cbiAgZ2V0QXR0cmlidXRlczogZnVuY3Rpb24oaWRlbnQpICB7XG5cbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG8uaWQgPT09IGlkZW50KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7QXR0ID0gby5hdHRyaWJ1dGVzfVxuXG4gICAgfVxuICAgIClcbiAgICByZXR1cm4gQXR0O1xuICB9XG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbDtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIE9ic2VsID0gcmVxdWlyZShcIi4vT2JzZWwuanNcIik7XG5cbi8qKlxuICogQGNsYXNzIFNhbW90cmFjZXMuS1RCUy5PYnNlbCBpcyBwYXJ0IG9mIHRoZSBTYW1vdHJhY2VzLktUQlMgaW1wbGVtZW50YXRpb24uXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5PYnNlbFxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZVxuICogQHRvZG8gVE9ETyB1cGRhdGUgc2V0X21ldGhvZHNcbiAqIC0+IHN5bmMgd2l0aCBLVEJTIGluc3RlYWQgb2YgbG9jYWwgY2hhbmdlXG4gKi9cbnZhciBLVEJTT2JzZWwgPSBmdW5jdGlvbihwYXJhbSkge1xuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBwYXJhbS5pZCwgcGFyYW0udXJpLCAnT2JzZWwnLCBwYXJhbS5sYWJlbCB8fCBcIlwiKTtcblxuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAndHJhY2UnKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ3R5cGUnKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnYmVnaW4nLFx0RGF0ZS5ub3coKSk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2VuZCcsXHRcdHRoaXMuYmVnaW4pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdhdHRyaWJ1dGVzJyxcdHt9KTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ3JlbGF0aW9ucycsXHRbXSk7IC8vIFRPRE8gYWpvdXRlciByZWwgw6AgbCdhdXRyZSBvYnNlbFxuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnaW52ZXJzZV9yZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ3NvdXJjZV9vYnNlbHMnLFx0XHRbXSk7XG59XG5cbktUQlNPYnNlbC5wcm90b3R5cGUgPSBPYnNlbC5wcm90b3R5cGU7XG5cbi8qXG5TYW1vdHJhY2VzLktUQlMuT2JzZWwucHJvdG90eXBlLmdldF9rdGJzX3N0YXR1cyA9IGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcy5rdGJzX3N0YXR1c1xufTtcbiovXG5cbm1vZHVsZS5leHBvcnRzID0gS1RCU09ic2VsO1xuIiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuL0V2ZW50SGFuZGxlci5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBSZXNvdXJjZSBPYmplY3RzIHRoYXQgaXMgc3luY2hyb25pc2VkIHRvIGEga1RCU1xuICogQGRlc2NyaXB0aW9uIFJlc291cmNlIE9iamVjdHMgYXJlIEtUQlMgb2JqZWN0cy4gQWxsIHJlc291cmNlc1xuICogaGF2ZSBhbiB1cmksIGFuIGlkIGFuZCBhbiBvcHRpb25hbCBsYWJlbFxuICogQGNsYXNzIFJlc291cmNlIE9iamVjdHMgaGF2ZSBhbiB1cmksIGFuIGlkIGFuZCBhbiBvcHRpb25hbCBsYWJlbFxuICogQHBhcmFtIHtTdHJpbmd9IGlkIElkIG9mIHRoZSBSZXNvdXJjZVxuICogQHBhcmFtIHtTdHJpbmd9IHVybCBVUkkgb2YgdGhlIFJlc291cmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZSBUeXBlIG9mIHRoZSBSZXNvdXJjZSAoJ0tUQlMnLCdCYXNlJyxcbiAqICAgICAnVHJhY2UnLCdTdG9yZWRUcmFjZScsJ0NvbXB1dGVkVHJhY2UnIG9yICdPYnNlbCcpXG4gKiBAcGFyYW0ge2xhYmVsfSBbbGFiZWxdIExhYmVsIG9mIHRoZSBSZXNvdXJjZVxuICovXG52YXIgS1RCU1Jlc291cmNlID0gKGZ1bmN0aW9uKCkge1xuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSByZXNvdXJjZSB0eXBlIG9mIHRoZSBSZXNvdXJjZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IFJlc291cmNlIHR5cGUgKCdLVEJTJywnQmFzZScsXG4gIFx0ICogICAgICdUcmFjZScsJ1N0b3JlZFRyYWNlJywnQ29tcHV0ZWRUcmFjZScgb3IgJ09ic2VsJykuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF9yZXNvdXJjZV90eXBlKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLnR5cGU7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlKGJhc2UsIHJlbGF0aXZlKSB7XG4gICAgdmFyIHN0YWNrID0gYmFzZS5zcGxpdChcIi9cIiksXG4gICAgICAgIHBhcnRzID0gcmVsYXRpdmUuc3BsaXQoXCIvXCIpO1xuICAgIHN0YWNrLnBvcCgpOyAvLyByZW1vdmUgY3VycmVudCBmaWxlIG5hbWUgKG9yIGVtcHR5IHN0cmluZylcbiAgICAgICAgICAgICAgICAgLy8gKG9taXQgaWYgXCJiYXNlXCIgaXMgdGhlIGN1cnJlbnQgZm9sZGVyIHdpdGhvdXQgdHJhaWxpbmcgc2xhc2gpXG4gICAgZm9yICh2YXIgaT0wOyBpPHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChwYXJ0c1tpXSA9PSBcIi5cIilcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBpZiAocGFydHNbaV0gPT0gXCIuLlwiKVxuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YWNrLnB1c2gocGFydHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RhY2suam9pbihcIi9cIik7XG4gIH1cbiAgLy8gUkVTT1VSQ0UgQVBJXG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIElEIG9mIHRoZSBSZXNvdXJjZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IFJlc291cmNlIElELlxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfaWQoKSB7IHJldHVybiB0aGlzLmlkOyB9XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFVSSSBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSBVUkkuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF91cmkoKSB7IHJldHVybiB0aGlzLnVyaS5yZXBsYWNlKCcuLycsICcnKTsgfVxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBGb3JjZXMgdGhlIFJlc291cmNlIHRvIHN5bmNocm9uaXNlIHdpdGggdGhlIEtUQlMuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBGb3JjZXMgdGhlIFJlc291cmNlIHRvIHN5bmNocm9uaXNlIHdpdGggdGhlIEtUQlMuXG4gIFx0ICogVGhpcyBtZXRob2QgdHJpZ2dlcnMgYSBBamF4IHF1ZXJ5IHRoYXQgd2lsbFxuICBcdCAqIHRyaWdnZXIgdGhlIF9vbl9zdGF0ZV9yZWZyZXNoXyBtZXRob2Qgb2YgdGhlIFJlc291cmNlXG4gIFx0ICogb24gc3VjY2Vzcy5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gZm9yY2Vfc3RhdGVfcmVmcmVzaCgpIHtcbiAgICB1cmwgPSB0aGlzLnVyaTtcbiAgICB2YXIgdHJjID0gdGhpcyA7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdXJsLFxuICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgeGhyRmllbGRzOiB7XG4gICAgICAgIHdpdGhDcmVkZW50aWFsczogdHJ1ZVxuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG5cbiAgICAgICAgaWYgKFhIUi5zdGF0dXMgPT0gJzQwMScpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyAoWEhSLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgICAgICAgICBMaW5rID0gWEhSLmdldFJlc3BvbnNlSGVhZGVyKCdMaW5rJyk7XG4gICAgICAgICAgRCA9IExpbmsuc3BsaXQgKCcsJyk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IEQubGVuZ3RoO2krKykgICAgICAgICAge1xuICAgICAgICAgICAgdmFyIFNvdXNEID0gRFtpXS5zcGxpdCgnOycpO1xuICAgICAgICAgICAgaWYgKFNvdXNEWzFdID09PSBcIiByZWw9b2F1dGhfcmVzb3VyY2Vfc2VydmVyXCIpICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsaW5rID0gU291c0RbMF0uc3Vic3RyKDEsIFNvdXNEWzBdLmxlbmd0aCAtIDIpXG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKFNvdXNEWzFdID09PSBcIiByZWw9c3VjY2Vzc2Z1bF9sb2dpbl9yZWRpcmVjdFwiKSAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVVJMU3VjY2VzcyA9IFNvdXNEWzBdLnN1YnN0cigyLCBTb3VzRFswXS5sZW5ndGggLSAzKVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgICB3aW4gPSB3aW5kb3cub3BlbiAobGluaykgO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzczogdHJjLl9vbl9zdGF0ZV9yZWZyZXNoXy5iaW5kKHRyYyksXG5cbiAgICB9KTtcbiAgfVxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBGb3JjZXMgdGhlIFJlc291cmNlIHRvIHN5bmNocm9uaXNlXG4gIFx0ICogd2l0aCBhdCBhIGdpdmVuIHJlZnJlc2hpbmcgcmF0ZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2Ugd2l0aCB0aGUgS1RCU1xuICBcdCAqIGV2ZXJ5IHBlcmlvZCBzZWNvbmRzLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBwZXJpb2QgVGltZSBpbiBzZWNvbmRzIGJldHdlZW4gdHdvIHN5bmNocm9uaXNhdGlvbnMuXG4gIFx0ICovXG5cblxuICBmdW5jdGlvbiBzdGFydF9hdXRvX3JlZnJlc2gocGVyaW9kKSB7XG4gICAgdmFyIGEgPSB0aGlzLmF1dG9fcmVmcmVzaF9pZD90aGlzLnN0b3BfYXV0b19yZWZyZXNoKCk6bnVsbDtcbiAgICB0aGlzLmF1dG9fcmVmcmVzaF9pZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSwgcGVyaW9kICogMTAwMCk7XG4gIH1cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgU3RvcHMgdGhlIGF1dG9yZWZyZXNoIHN5bmNocm9uaXNhdGlvblxuICBcdCAqIG9mIHRoZSBSZXNvdXJjZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFN0b3BzIHRoZSBhdXRvcmVmcmVzaCBzeW5jaHJvbmlzYXRpb24gb2ZcbiAgXHQgKiB0aGUgUmVzb3VyY2UuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHN0b3BfYXV0b19yZWZyZXNoKCkge1xuICAgIGlmICh0aGlzLmF1dG9fcmVmcmVzaF9pZCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5hdXRvX3JlZnJlc2hfaWQpO1xuICAgICAgZGVsZXRlKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICB9XG4gIH1cbiAgLy9cdFx0ZnVuY3Rpb24gX29uX3N0YXRlX3JlZnJlc2hfKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YTsgY29uc29sZS5sb2coXCJoZXJlXCIpOyB9XG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X3JlYWRfb25seSgpIHt9XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IERlbGV0ZSB0aGUgcmVzb3VyY2UgZnJvbSB0aGUgS1RCU1xuICBcdCAqIEB0b2RvIElNUFJPVkUgVEhJUyBNRVRIT0QgU08gVEhBVCBQUk9QRVIgRVZFTlQgSVMgUkFJU0VEXG4gIFx0ICogICAgIFdIRU4gQSBSRVNPVVJDRSBJUyBERUxFVEVELlxuICBcdCAqL1xuICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgZnVuY3Rpb24gcmVmcmVzaF9wYXJlbnQoKSB7XG4gICAgICAvL1RST1VWRVIgVU4gTU9ZRU4gTUFMSU4gREUgUkFGUkFJQ0hJUiBMQSBMSVNURSBERVMgQkFTRVMgRFUgS1RCUy4uLlxuICAgIH1cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgc3VjY2VzczogcmVmcmVzaF9wYXJlbnQuYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgdGhyb3cgXCJDYW5ub3QgZGVsZXRlIFwiICsgdGhpcy5nZXRfcmVzb3VyY2VfdHlwZSgpICsgXCIgXCIgKyB0aGlzLnVyaSArIFwiOiBcIiArIHRleHRTdGF0dXMgKyAnICcgKyBKU09OLnN0cmluZ2lmeShlcnJvclRocm93bik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgbGFiZWwgb2YgdGhlIFJlc291cmNlXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF9sYWJlbCgpIHsgcmV0dXJuIHRoaXMubGFiZWw7IH1cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBmdW5jdGlvbiBzZXRfbGFiZWwoKSB7fVxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHJlc2V0X2xhYmVsKCkge31cblxuICAvLyBBRERFRCBGVU5DVElPTlNcbiAgLyoqXG4gIFx0ICogTWV0aG9kIHVzZWQgdG8gY2hlY2sgaWYgdGhlIGRpc3RhbnQgdmFsdWUgaXMgZGlmZmVyZW50XG4gIFx0ICogZnJvbSB0aGUgY3VycmVudCBsb2NhbCB2YWx1ZSAoYW5kIHVwZGF0ZSB0aGUgbG9jYWwgdmFsdWVcbiAgXHQgKiBpZiB0aGVyZSBpcyBhIGRpZmZlcmVuY2UuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKiBAcGFyYW0gbG9jYWxfZmllbGQge1N0cmluZ30gTmFtZSBvZiB0aGUgZmllbGQgb2YgdGhlIHRoaXNcbiAgXHQgKiAgICAgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGluZm9ybWF0aW9uIHRvIGNoZWNrLlxuICBcdCAqIEBwYXJhbSBkaXN0YW50IHtWYWx1ZX0gVmFsdWUgb2YgdGhlIGRpc3RhbnQgaW5mb3JtYXRpb24uXG4gIFx0ICogQHBhcmFtIG1lc3NhZ2VfaWZfY2hhbmdlZCB7U3RyaW5nfSBNZXNzYWdlIHRvIHRyaWdnZXIgaWZcbiAgXHQgKiAgICAgdGhlIGluZm9ybWF0aW9uIGhhcyBiZWVuIHVwZGF0ZWQuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIF9jaGVja19jaGFuZ2VfKGxvY2FsX2ZpZWxkLCBkaXN0YW50LCBtZXNzYWdlX2lmX2NoYW5nZWQpIHtcbiAgICAvLyBUT0RPIGNoZWNrIGlmIHRoaXMgaXMgdGhlIHdhbnRlZCBiZWhhdmlvdXI6XG4gICAgLy8gSWYgZGlzdGFudCBpcyB1bmRlZmluZWQgLT4gd2hhdCB0byBkbz9cbiAgICBpZiAoZGlzdGFudCAhPT0gdW5kZWZpbmVkICYmIHRoaXNbbG9jYWxfZmllbGRdICE9PSBkaXN0YW50KSB7XG4gICAgICB0aGlzW2xvY2FsX2ZpZWxkXSA9IGRpc3RhbnQ7XG4gICAgICB0aGlzLnRyaWdnZXIobWVzc2FnZV9pZl9jaGFuZ2VkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oaWQsIHVyaSwgdHlwZSwgbGFiZWwpIHtcbiAgICAvLyBhIFJlc291cmNlIGlzIGFuIEV2ZW50SGFuZGxlclxuICAgIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgLy8gRE9DVU1FTlRFRCBBQk9WRVxuICAgIC8vIEFUVFJJQlVURVNcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy51cmkgPSB1cmk7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgLy8gQVBJIE1FVEhPRFNcbiAgICB0aGlzLmdldF9pZCA9IGdldF9pZDtcbiAgICB0aGlzLmdldF91cmkgPSBnZXRfdXJpO1xuICAgIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCA9IGZvcmNlX3N0YXRlX3JlZnJlc2g7XG4gICAgdGhpcy5nZXRfcmVhZF9vbmx5ID0gZ2V0X3JlYWRfb25seTtcbiAgICB0aGlzLnJlbW92ZSA9IHJlbW92ZTtcbiAgICB0aGlzLmdldF9sYWJlbCA9IGdldF9sYWJlbDtcbiAgICB0aGlzLnNldF9sYWJlbCA9IHNldF9sYWJlbDtcbiAgICB0aGlzLnJlc2V0X2xhYmVsID0gcmVzZXRfbGFiZWw7XG4gICAgLy8gaGVscGVyXG4gICAgdGhpcy5nZXRfcmVzb3VyY2VfdHlwZSA9IGdldF9yZXNvdXJjZV90eXBlO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8gPSBfY2hlY2tfY2hhbmdlXztcbiAgICB0aGlzLnN0YXJ0X2F1dG9fcmVmcmVzaCA9IHN0YXJ0X2F1dG9fcmVmcmVzaDtcbiAgICB0aGlzLnN0b3BfYXV0b19yZWZyZXNoID0gc3RvcF9hdXRvX3JlZnJlc2g7XG4gICAgdGhpcy5nZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlPWdldEFic29sdXRlVVJMRnJvbVJsYXRpdmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59KSgpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gS1RCU1Jlc291cmNlO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgS1RCU09ic2VsID0gcmVxdWlyZShcIi4vS1RCUy5PYnNlbC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBUcmFjZSBvYmplY3QgdGhhdCBpcyBzeW5jaHJvbmlzZWQgdG8gYSBLVEJTLlxuICogQGNsYXNzIEphdmFzY3JpcHQgVHJhY2UgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIHRyYWNlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBqUXVlcnkgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9qcXVlcnkuY29tXCI+anF1ZXJ5LmNvbTwvYT4pXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZVxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLktUQlMuVHJhY2UgaXMgYSBKYXZhc2NyaXB0IFRyYWNlIG9iamVjdFxuICogdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgdHJhY2UuIFRoaXMgT2JqZWN0IGltcGxlbWVudHMgdGhlIEtUQlMgQVBJLlxuICogTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIGdldFxuICogdGhlIE9ic2VscyBmcm9tIHRoZSBLVEJTIHRyYWNlLCBjcmVhdGUgbmV3IE9ic2VscywgZXRjLlxuICpcbiAqIE5vdGU6IHRoaXMgVHJhY2Ugb2JqZWN0IGRvZXMgbm90IGltcGxlbWVudCBhbGwgdGhlIG1ldGhvZHNcbiAqIGF2YWlsYWJsZSBpbiB0aGUgS1RCUyBBUEkgeWV0LlxuICogRm9yIGluc3RhbmNlLCB0aGlzIGNsYXNzIGRvIG5vdCBzdXBwb3J0IHRyYW5zZm9ybWF0aW9ucy5cbiAqXG4gKiBAdG9kbyBGdWxseSBpbXBsZW1lbnQgS1RCUyBBUElcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKiBAcGFyYW0ge1N0cmluZ31cdFtpZF1cdElEIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKi9cbnZhciBLVEJTVHJhY2UgPSBmdW5jdGlvbiBUcmFjZSh1cmksIGlkKSB7XG4gIC8vIEtUQlMuVHJhY2UgaXMgYSBSZXNvdXJjZVxuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKGlkID09PSB1bmRlZmluZWQpIHsgaWQgPSB1cmk7IH1cbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgaWQsIHVyaSwgJ0Jhc2UnLCBcIlwiKTtcblxuICB0aGlzLnRlbXAgPSB7fTsgLy8gYXR0cmlidXRlIHVzZWQgdG8gc3RvcmUgYWN0aW9ucyBtYWRlIGJ5IHRoZSB1c2VyIG9uIHRoZSB0cmFjZSB3aGlsZSBub3Qga25vd2luZyBpZiB0aGV5IGFyZSBhbGxvd2VkLiBlLmcuLCBjcmVhdGVfb2JzZWwsIHdoZW4gd2UgZG9uJ3Qga25vdyB5ZXQgaWYgdGhlIFRyYWNlIGlzIGEgU3RvcmVkVHJhY2UgYmVjYXVzZSB0aGUgS1RCUyBkaWRuJ3QgcmVwbHkgeWV0LlxuICB0aGlzLmRlZmF1bHRfc3ViamVjdCA9IFwiXCI7XG4gIHRoaXMubW9kZWxfdXJpID0gXCJcIjtcbiAgdGhpcy5vYnNlbF9saXN0X3VyaSA9IHVyaSArIFwiQG9ic2Vsc1wiO1xuICB0aGlzLmJhc2VfdXJpID0gXCJcIjtcbiAgdGhpcy5vcmlnaW4gPSBcIlwiO1xuICAvL3RoaXMub3JpZ2luX29mZnNldCA9IChuZXcgRGF0ZSgwKSkuZ2V0TWlsbGlzZWNvbmRzKCk7XG4gIHRoaXMub2JzZWxfbGlzdCA9IFtdOyB0aGlzLnRyYWNlU2V0ID0gW107XG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xufTtcblxuS1RCU1RyYWNlLnByb3RvdHlwZSA9IHtcbiAgLy8vLy8vLy8vLy8gT0ZGSUNJQUwgQVBJXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEdldHMgdGhlIGJhc2Ugd2hlcmUgdGhlIHRyYWNlIGlzIHN0b3JlZC5cbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBVUkkgb2YgdGhlIGJhc2Ugd2hlcmUgdGhlIHRyYWNlIGlzIHN0b3JlZC5cbiAgXHQgKi9cbiAgZ2V0X2Jhc2U6IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy5iYXNlX3VyaTsgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgbW9kZWwgb2YgdGhlIHRyYWNlLlxuICBcdCAqIEByZXR1cm5zIHtNb2RlbH0gTW9kZWwgb2YgdGhlIHRyYWNlLlxuICBcdCAqIEB0b2RvIERFRklORSBXSEFUIElTIEEgTU9ERUxcbiAgXHQgKi9cbiAgZ2V0X21vZGVsOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB0aGlzLmdldEFic29sdXRlVVJMRnJvbVJsYXRpdmUodGhpcy5nZXRfdXJpKCksdGhpcy5tb2RlbF91cmkpO1xuIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEdldHMgdGhlIG9yaWdpbiBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHJldHVybnMge09yaWdpbn0gT3JpZ2luIG9mIHRoZSB0cmFjZS5cbiAgXHQgKiBAdG9kbyBERUZJTkUgV0hBVCBJUyBBTiBPUklHSU5cbiAgXHQgKi9cbiAgZ2V0X29yaWdpbjogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiOyByZXR1cm4gdGhpcy5vcmlnaW47IH0sXG4gIC8vZ2V0X29yaWdpbl9vZmZzZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vcmlnaW5fb2Zmc2V0OyB9LFxuICAvKmt0YnNfb3JpZ2luX3RvX21zOiBmdW5jdGlvbihrdGJzX2RhdGVfc3RyKSB7XG4gIFx0XHR2YXIgWSA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDAsNCk7XG4gIFx0XHR2YXIgTSA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDUsMikgLSAxO1xuICBcdFx0dmFyIEQgPSBrdGJzX2RhdGVfc3RyLnN1YnN0cig4LDIpO1xuICBcdFx0dmFyIGggPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigxMSwyKTtcbiAgXHRcdHZhciBtID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMTQsMik7XG4gIFx0XHR2YXIgcyA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDE3LDIpO1xuICBcdFx0dmFyIG1zID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMjAsMyk7XG4gIFx0XHRyZXR1cm4gRGF0ZS5VVEMoWSxNLEQsaCxtLHMsbXMpO1xuICBcdH0sKi9cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBsaXN0X3NvdXJjZV90cmFjZXM6IGZ1bmN0aW9uKCkge30sXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgbGlzdF90cmFuc2Zvcm1lZF90cmFjZXM6IGZ1bmN0aW9uKCkge30sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIGxpc3Qgb2Ygb2JzZWxzIGluIGFuIG9wdGlvbmFsIHRpbWUgaW50ZXJ2YWwuXG4gIFx0ICogSWYgbm8gbWluaW11bSB0aW1lIGFuZCBubyBtYXhpbXVtIHRpbWUgY29uc3RyYWludCBhcmVcbiAgXHQgKiBkZWZpbmVkLCByZXR1cm5zIHRoZSB3aG9sZSBsaXN0IG9mIG9ic2Vscy5cbiAgXHQgKiBJZiBvbmUgb2YgdGhlIHR3byBjb25zdHJhaW50cyBhcmUgZGVmaW5lZCwgdGhlbiByZXR1cm5zXG4gIFx0ICogb2JzZWxzIG1hdGNoaW5nIHRoZSB0aW1lIGNvbnN0cmFpbnRzLlxuICBcdCAqXG4gIFx0ICogTm90ZTogaWYgYW4gb2JzZWwgb3ZlcmxhcHMgd2l0aCB0aGUgc3RhcnQgb3IgdGhlIGVuZFxuICBcdCAqIGNvbnN0cmFpbnQsIHRoZW4gaXQgd2lsbCBiZSBpbmNsdWRlZCAoZm9yIGluc3RhbmNlIGFuXG4gIFx0ICogb2JzZWwgdGhhdCBzdGFydHMgYmVmb3JlIHRoZSBzdGFydCBjb25zdHJhaW50IGFuZCBlbmRzXG4gIFx0ICogYWZ0ZXIgdGhhdCBjb25zdHJhaW50IHdpbGwgYmUgaW5jbHVkZWQpLlxuICBcdCAqXG4gIFx0ICogTm90ZTogdGhlIGxpc3QgcmV0dXJuZWQgYnkgdGhpcyBtZXRob2QgaXMgdGhlXG4gIFx0ICogbGlzdCBvZiBPYnNlbHMgdGhhdCBhcmUgbG9hZGVkIGxvY2FsbHkuXG4gIFx0ICogV2hlbiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQsIGEgcXVlcnkgdG8gdGhlIEtUQlNcbiAgXHQgKiBpcyBtYWRlIHRvIGtub3cgaWYgdGhlcmUgYXJlIG90aGVyIE9ic2VscyBtYXRjaGluZ1xuICBcdCAqIHRoZSBxdWVyeS4gSWYgc28sIHRoZXNlIG90aGVyIG9ic2VscyB3aWxsIGJlIGxvYWRlZFxuICBcdCAqIGluIHRoZSBsb2NhbCBjb3B5IG9mIHRoZSB0cmFjZSBhbmQgYVxuICBcdCAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmNyZWF0ZTpvYnNlbHx0cmFjZTpjcmVhdGU6b2JzZWx9XG4gIFx0ICogZXZlbnQgb3IgYVxuICBcdCAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOnVwZGF0ZXx0cmFjZTp1cGRhdGV9XG4gIFx0ICogZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgdG8gbm90aWZ5IHRoYXQgb3RoZXJcbiAgXHQgKiBPYnNlbHMgaGF2ZSBiZWVuIGxvYWRlZC5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gW2JlZ2luXSBNaW5pbXVtIHRpbWUgY29uc3RyYWludFxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbZW5kXSBNYXhpbXVtIHRpbWUgY29uc3RyYWludFxuICBcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JldmVyc2U9ZmFsc2VdIFJldHVybnMgdGhlIG9ic2VsIGxpc3QgaW5cbiAgXHQgKiAgICAgcmV2ZXJzZSBjaHJvbm9sb2dpY2FsIG9yZGVyIGlmIHRydWUgYW5kIGluIG5vcm1hbFxuICBcdCAqICAgICBjaHJvbm9sb2dpY2FsIG9yZGVyIGlmIGZhbHNlLlxuICBcdCAqIEByZXR1cm5zIHtBcnJheS48T2JzZWw+fSBMaXN0IG9mIHJlbGV2YW50IG9ic2Vsc1xuICBcdCAqIEB0b2RvIFJFVkVSU0UgSVMgTk9UIFlFVCBUQUtFTiBJTlRPIEFDQ09VTlRcbiAgXHQgKi9cbiAgLy8gVE9ETyBhZGQgYW4gb3B0aW9uYWwgQ0FMTEJBQ0s/Pz9cbiAgbGlzdF9vYnNlbHM6IGZ1bmN0aW9uKGJlZ2luLCBlbmQsIHJldmVyc2UpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLm9ic2VsX2xpc3RfdXJpID0gdGhpcy51cmkgKyBcIkBvYnNlbHNcIjtcbiAgICBpZiAodGhpcy5vYnNlbF9saXN0X3VyaSA9PT0gXCJcIikge1xuICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbiBLVEJTOlRyYWNlOmxpc3Rfb2JzZWxzKCkgdW5rbm93biB1cmlcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIE9CSiA9IHRoaXM7XG5cbiAgICAvL1x0XHQkLmdldEpTT04odGhpcy5vYnNlbF9saXN0X3VyaSx0aGlzLl9vbl9yZWZyZXNoX29ic2VsX2xpc3RfLmJpbmQodGhpcykpO1xuICAgIHZhciBPQkogPSB0aGlzO1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMub2JzZWxfbGlzdF91cmksLy8rJy5qc29uJyxcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIGRhdGE6IHttaW5iOiBiZWdpbiwgbWF4YjogZW5kLCByZXZlcnNlOiByZXZlcnNlfSxcbiAgICAgIHhockZpZWxkczogeyB3aXRoQ3JlZGVudGlhbHM6IHRydWUgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihYSFIpIHtcbiAgICAgICAgaWYgKFhIUi5zdGF0dXMgPT09ICc0MDEnKSB7XG4gICAgICAgICAgdmFyIGxpbmtoZWFkZXIgPSBYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0xpbmsnKTtcbiAgICAgICAgICB2YXIgZCA9IGxpbmtoZWFkZXIuc3BsaXQgKCcsJyk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGQubGVuZ3RoO2krKykgICAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNvdXNEID0gZFtpXS5zcGxpdCgnOycpO1xuICAgICAgICAgICAgaWYgKHNvdXNEWzFdID09PSBcIiByZWw9b2F1dGhfcmVzb3VyY2Vfc2VydmVyXCIpICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YXIgbGluayA9IHNvdXNEWzBdLnN1YnN0cigxLCBzb3VzRFswXS5sZW5ndGggLSAyKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc291c0RbMV0gPT09IFwiIHJlbD1zdWNjZXNzZnVsX2xvZ2luX3JlZGlyZWN0XCIpICAgICAgICAgICAge1xuICAgICAgICAgICAgICAvL1x0dmFyXHRVUkxTdWNjZXNzID0gc291c0RbMF0uc3Vic3RyKDIsc291c0RbMF0ubGVuZ3RoLTMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB3aW5kb3cub3BlbiAobGluaykgO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1x0aWYgKGRhdGEub2JzZWxzLmxlbmd0aCA+IDApXHR7T0JKLkJlZm9yZV9vbl9yZWZyZXNoX29ic2VsX2xpc3RfIChkYXRhKTt9XHR9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMub2JzZWxfbGlzdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgaWYgKGVuZCAmJiBvLmdldF9iZWdpbigpID4gZW5kKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGJlZ2luICYmIG8uZ2V0X2VuZCgpIDwgYmVnaW4pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfSxcblxuICBCZWZvcmVfb25fcmVmcmVzaF9vYnNlbF9saXN0XzogZnVuY3Rpb24oZGF0YVJlY3UpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvLyBwYXIgcGFxdWV0XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpDb25maWcnLCBkYXRhUmVjdSk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBlbmQgPSBOdW1iZXIoaSkgKyBOdW1iZXIoMTAwKTtcblxuICAgIGlmIChkYXRhUmVjdS5vYnNlbHMpIHt0aGlzLl9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAoZGF0YVJlY3Uub2JzZWxzLCBpLCBlbmQpO30gICAgZWxzZSB7IHRoaXMuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cChkYXRhUmVjdSwgaSwgZW5kKTt9XG5cblxuICB9LFxuICBfb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwOiBmdW5jdGlvbihkYXRhUmVjdSwgaSwgZW5kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICB2YXIgZCA9IGRhdGFSZWN1Lmxlbmd0aCAtIE51bWJlcigxKTtcbiAgICB2YXIgRGF0YU8gPSBkYXRhUmVjdS5zbGljZSAoaSwgZW5kKTtcbiAgICBjb25zb2xlLmxvZyAoJ19vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAnKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgRGF0YU8uZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgY291bnQgKys7XG4gICAgICB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfKGVsKTtcbiAgICAgIHZhciBPYmpldCA9IHRoaXM7XG4gICAgICBpZiAoY291bnQgPT09IERhdGFPLmxlbmd0aCkgICAgICB7XG4gICAgICAgIHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlVCcpO1xuICAgICAgICBpID0gTnVtYmVyKGkpICsgRGF0YU8ubGVuZ3RoICsgTnVtYmVyKDEpO1xuICAgICAgICBlbmQgPSBOdW1iZXIoaSkgKyBOdW1iZXIoMTAwKTtcbiAgICAgICAgaWYgKGVuZCA+IGRhdGFSZWN1Lmxlbmd0aCkge2VuZCA9IGRhdGFSZWN1Lmxlbmd0aCAtIE51bWJlcigxKTt9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKChpIDw9IGQpICYmIChlbmQgPD0gZCkpIHtcbiAgICAgICAgICAgIE9iamV0Ll9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAoZGF0YVJlY3UsIGksIGVuZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoYXQudHJpZ2dlcigndHJhY2U6dXBkYXRlQ29tcGxldGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAyMDAwKTtcblxuICAgICAgICAkKFwiI3dhaXRpbmdcIikuaGlkZSgpO1xuXG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG5cbiAgfSxcblxuICBfb25fcmVmcmVzaF9vYnNlbF9saXN0XzogZnVuY3Rpb24oZGF0YSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgIGNvdW50ICsrO1xuICAgICAgdGhpcy5fcGFyc2VfZ2V0X29ic2VsXyhlbCk7XG4gICAgICBpZiAoY291bnQgPT09IGRhdGEubGVuZ3RoKSAgICAgIHt0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZVQnLCB0aGlzKTt9XG4gICAgfSwgdGhpcyk7XG5cblxuICB9LFxuXG4gIGdldF9MYXN0X29ic2VsOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgb2JzO1xuICAgIHZhciBtYXggPSAwO1xuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmdldF9iZWdpbigpID4gbWF4KSB7IG9icyA9IG87IH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JzO1xuICB9LFxuICBnZXRfRmlyc3Rfb2JzZWw6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnM7XG4gICAgdmFyIG1pbjEgPSA5OTk5OTk5OTk5OTk5O1xuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmdldF9iZWdpbigpIDwgbWluMSkgeyBvYnMgPSBvOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9icztcbiAgfSxcbiAgZ2V0X0xpc3Rfb2JzZWxfUGFyVHlwZTogZnVuY3Rpb24ob2JzZWxUeXBlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGxpc3RlID0gW107XG5cbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby50eXBlID09PSBvYnNlbFR5cGUpIHsgbGlzdGUucHVzaChvKTsgfVxuICAgIH0pO1xuICAgIHJldHVybiBsaXN0ZTtcbiAgfSxcblxuXG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IEZvcmNlcyB0aGUgbG9jYWwgb2JzZWwgbGlzdCB0byBiZSBzeW5jaHJvbmlzZWRcbiAgXHQgKiB3aXRoIHRoZSBLVEJTIGF0IGEgZ2l2ZW4gcmVmcmVzaGluZyByYXRlLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBwZXJpb2QgVGltZSBpbiBzZWNvbmRzIGJldHdlZW4gdHdvIHN5bmNocm9uaXNhdGlvbnMuXG4gIFx0ICovXG4gIHN0YXJ0X2F1dG9fcmVmcmVzaF9vYnNlbF9saXN0OiBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgYSA9IHRoaXMuYXV0b19yZWZyZXNoX29ic2VsX2xpc3RfaWQ/dGhpcy5zdG9wX2F1dG9fcmVmcmVzaF9vYnNlbF9saXN0KCk6bnVsbDtcbiAgICB0aGlzLmF1dG9fcmVmcmVzaF9vYnNlbF9saXN0X2lkID0gd2luZG93LnNldEludGVydmFsKHRoaXMubGlzdF9vYnNlbHMuYmluZCh0aGlzKSwgcGVyaW9kICogMTAwMCk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFN0b3BzIHRoZSBhdXRvcmVmcmVzaCBzeW5jaHJvbmlzYXRpb25cbiAgXHQgKiBvZiB0aGUgb2JzZWwgbGlzdC5cbiAgXHQgKi9cbiAgc3RvcF9hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuYXV0b19yZWZyZXNoX29ic2VsX2xpc3RfaWQpIHtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICAgIGRlbGV0ZSh0aGlzLmF1dG9fcmVmcmVzaF9pZCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICBcdCAqIFJldHJpZXZlIGFuIG9ic2VsIGluIHRoZSB0cmFjZSBmcm9tIGl0cyBJRC5cbiAgXHQgKiBJZiB0aGUgb2JzZWwgZG9lcyBub3QgZXhpc3QgbG9jYWxseSwgcmV0dXJuc1xuICBcdCAqIHVuZGVmaW5lZCBhbmQgc2VuZCBhIHF1ZXJ5IHRvIHRoZSBLVEJTXG4gIFx0ICogKHdoaWNoIHdpbGwgcmVzdWx0IGluIGFkZGluZyB0aGlzIG9ic2VsIGxvY2FsbHlcbiAgXHQgKiBpZiBpdCBleGlzdHMgb24gdGhlIEtUQlMpLlxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBpZCBJRCBvZiB0aGUgT2JzZWwgdG8gcmV0cmlldmVcbiAgXHQgKiBAcmV0dXJucyB7T2JzZWx9IE9ic2VsIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhpcyBJRFxuICBcdCAqICAgICBvciB1bmRlZmluZWQgaWYgdGhlIG9ic2VsIHdhcyBub3QgZm91bmQuXG4gIFx0ICogQHRvZG8gVE9ETyBhZGQgYW4gb3B0aW9uYWwgQ0FMTEJBQ0tcbiAgXHQgKi9cbiAgZ2V0X29ic2VsOiBmdW5jdGlvbihpZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnM7XG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uZ2V0X2lkKCkgPT09IGlkKSB7IG9icyA9IG87IH1cbiAgICB9KTtcbiAgICBpZiAob2JzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIHNlbmRzIGEgcXVlcnkgdG8gZmluZCB0aGUgb2JzZWxcbiAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgLy8gVE9ETyBpZGVhbGx5IEpTT04uLi4gV2hlbiBLVEJTIHN1cHBvcnRzIGl0IVxuICAgICAgICB1cmw6IHRoaXMudXJpICsgaWQsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICBzdWNjZXNzOiB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfLmJpbmQodGhpcyksXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG9icztcbiAgfSxcbiAgLyoqXG4gIFx0ICogQ2FsbGJhY2sgZm9yIHF1ZXJpZXMgd2hlcmUgYW4gb2JzZWwgaXMgZXhwZWN0ZWQgYXMgYSByZXN1bHRcbiAgXHQgKiBQYXJzZXMgdGhlIEpTT04gZGF0YSBmcm9tIHRoZSBLVEJTIHRvIGNyZWF0ZSBhIG5ldyBPYnNlbCBsb2NhbGx5XG4gIFx0ICogaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5LlxuICBcdCAqIEBwcml2YXRlXG4gIFx0ICovXG4gIF9wYXJzZV9nZXRfb2JzZWxfOiBmdW5jdGlvbihkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnMgPSB7XG4gICAgICBhdHRyaWJ1dGVzOiB7fVxuICAgIH07XG5cbiAgICAvLyBPQlNFTCBJRFxuICAgIG9icy5pZCA9IGRhdGFbXCJAaWRcIl07XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gXCJDb21wdXRlZFRyYWNlXCIpIHtvYnMuaWQgPSBvYnMudHlwZSArIFwiX1wiICsgb2JzLmlkO31cbiAgICBpZiAob2JzLmlkLnN1YnN0cigwLCAyKSA9PT0gXCIuL1wiKSB7IG9icy5pZCA9IG9icy5pZC5zdWJzdHIoMik7IH1cblxuICAgIC8vIE9CU0VMIFRSQUNFXG4gICAgLy8gZGF0YS5oYXNUcmFjZTtcbiAgICBvYnMudHJhY2UgPSB0aGlzO1xuXG4gICAgLy8gT0JTRUwgVFlQRVxuICAgIC8vIGRhdGFbXCJAdHlwZVwiXTsgLy8gVE9ETyBCVUcgS1RCUyAtPiBVU0UgXCJtOnR5cGVcIiBpbnN0ZWFkXG4gICAgLy8gZGF0YVtcIm06dHlwZVwiXTtcbiAgICBvYnMudHlwZSA9IGRhdGFbXCJAdHlwZVwiXS5zdWJzdHIoMik7XG5cbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eSgnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJykpIHtcbiAgICAgIG9icy5sYWJlbCA9IGRhdGFbJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbCddO1xuICAgIH1cbiAgICAvL29icy5iZWdpbiA9IGRhdGEuYmVnaW47XG4gICAgLy9vYnMuZW5kID0gZGF0YS5lbmQ7XG4gICAgdmFyIGQgPSBuZXcgRGF0ZSAodGhpcy5vcmlnaW4pO1xuICAgIG9icy5iZWdpbiA9IGQuZ2V0VGltZSgpICsgZGF0YS5iZWdpbiA7XG4gICAgb2JzLmVuZCA9IGQuZ2V0VGltZSgpICsgZGF0YS5lbmQ7XG5cbiAgICAvLyBERUxFVElORyBQUk9QRVJUSUVTIFRIQVQgSEFWRSBBTFJFQURZIEJFRU4gQ09QSUVEXG4gICAgZGVsZXRlIGRhdGFbXCJAaWRcIl07XG4gICAgZGVsZXRlIGRhdGEuaGFzVHJhY2U7XG4gICAgZGVsZXRlIGRhdGFbXCJAdHlwZVwiXTtcbiAgICBkZWxldGUgZGF0YS5iZWdpbjtcbiAgICBkZWxldGUgZGF0YS5lbmQ7XG4gICAgZGVsZXRlIGRhdGFbJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbCddO1xuICAgIC8vZGVsZXRlIGRhdGFbXCJtOnR5cGVcIl07XG5cblxuICAgIC8vIEFUVFJJQlVURVNcbiAgICBmb3IgKHZhciBhdHRyIGluIGRhdGEpIHtcbiAgICAgIGlmIChhdHRyLnN1YnN0cigwLCAyKSA9PT0gXCJtOlwiKSB7IC8vIFRPRE8gdGhpcyBpcyBub3QgZ2VuZXJpYyEhISFcbiAgICAgICAgb2JzLmF0dHJpYnV0ZXNbYXR0ci5zdWJzdHIoMildID0gZGF0YVthdHRyXTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhkYXRhLG9icyk7XG4gICAgdmFyIG8gPSBuZXcgS1RCU09ic2VsKG9icyk7XG4gICAgaWYgKCF0aGlzLl9jaGVja19vYnNlbF9sb2FkZWRfKG8pKSB7IC8vIFRPRE8gZmlyc3QgYXBwcm94aW1hdGlvblxuICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCBvKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8vLy8vLy8vLy9cbiAgLyoqXG4gIFx0ICogT3ZlcmxvYWRzIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5LVEJTLlJlc291Y2UjX29uX3N0YXRlX3JlZnJlc2hffSBtZXRob2QuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKi9cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgLy9cdFx0Y29uc29sZS5sb2coZGF0YSk7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5fY2hlY2tfYW5kX3VwZGF0ZV90cmFjZV90eXBlXyhkYXRhWydAdHlwZSddKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdkZWZhdWx0X3N1YmplY3QnLCBkYXRhLmhhc0RlZmF1bHRTdWJqZWN0LCAnJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnbW9kZWxfdXJpJywgZGF0YS5oYXNNb2RlbCwgJ3RyYWNlOm1vZGVsJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnb2JzZWxfbGlzdF91cmknLCBkYXRhLmhhc09ic2VsTGlzdCwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2Jhc2VfdXJpJywgZGF0YS5pbkJhc2UsICcnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdvcmlnaW4nLCBkYXRhLm9yaWdpbiwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2xhYmVsJywgZGF0YS5sYWJlbCwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlRGF0YScsIGRhdGEpO1xuICAgIC8vdGhpcy5fY2hlY2tfY2hhbmdlXygnb3JpZ2luX29mZnNldCcsdGhpcy5rdGJzX29yaWdpbl90b19tcyhkYXRhLm9yaWdpbiksJycpO1xuICB9LFxuICBfdXBkYXRlX21ldGhvZF86IGZ1bmN0aW9uKHRyYWNlX3R5cGUsIG1ldGhvZF9uYW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpc1ttZXRob2RfbmFtZV0gPSB0aGlzW3RyYWNlX3R5cGUgKyBcIl9tZXRob2RzXCJdW21ldGhvZF9uYW1lXTtcbiAgICBpZiAodGhpcy50ZW1wW21ldGhvZF9uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRlbXBbbWV0aG9kX25hbWVdLmZvckVhY2goZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgICAgdGhpc1ttZXRob2RfbmFtZV0ocGFyYW0pO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICBfY2hlY2tfYW5kX3VwZGF0ZV90cmFjZV90eXBlXzogZnVuY3Rpb24odHlwZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLnR5cGUgIT09IHR5cGUpIHtcbiAgICAgIGZvciAodmFyIG1ldGhvZF9uYW1lIGluIHRoaXNbdHlwZSArIFwiX21ldGhvZHNcIl0pIHtcbiAgICAgICAgaWYgKHRoaXNbdHlwZSArIFwiX21ldGhvZHNcIl0uaGFzT3duUHJvcGVydHkobWV0aG9kX25hbWUpKSAgICAgICAge3RoaXMuX3VwZGF0ZV9tZXRob2RfKHR5cGUsIG1ldGhvZF9uYW1lKTt9XG4gICAgICB9XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgfSxcbiAgLy8vLy8vLy8vLy9cbiAgLypcdF9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhKSB7XG4gIC8vXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuICBcdFx0dmFyIGlkLCBsYWJlbCwgdHlwZSwgYmVnaW4sIGVuZCwgYXR0cmlidXRlcywgb2JzO1xuICBcdFx0dmFyIG5ld19vYnNlbF9sb2FkZWQgPSBmYWxzZTtcbiAgXHRcdGRhdGEub2JzZWxzLmZvckVhY2goZnVuY3Rpb24oZWwsa2V5KSB7XG4gIFx0XHRcdHRoaXMuX3BhcnNlX2dldF9vYnNlbF8oZWwpO1xuICAvKlxuICBcdFx0XHR2YXIgYXR0ciA9IHt9O1xuICBcdFx0XHRhdHRyLmlkID0gZWxbJ0BpZCddO1xuICBcdFx0XHRhdHRyLnRyYWNlID0gdGhpcztcbiAgXHRcdFx0YXR0ci5sYWJlbCA9IGVsWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXSB8fCB1bmRlZmluZWQ7XG4gIFx0XHRcdGF0dHIudHlwZSA9IGVsWydAdHlwZSddO1xuICBcdFx0XHRhdHRyLmJlZ2luID0gZWxbJ2JlZ2luJ107XG4gIFx0XHRcdGF0dHIuZW5kID0gZWxbJ2VuZCddO1xuICBcdFx0XHRhdHRyLmF0dHJpYnV0ZXMgPSBlbDtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snQGlkJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXSk7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ0B0eXBlJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydiZWdpbiddKTtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snZW5kJ10pO1xuICBcdFx0XHRvYnMgPSBuZXcgU2Ftb3RyYWNlcy5LVEJTLk9ic2VsKGF0dHIpO1xuXG4gIFx0XHRcdGlmKCEgdGhpcy5fY2hlY2tfb2JzZWxfbG9hZGVkXyhvYnMpKSB7XG4gIFx0XHRcdFx0bmV3X29ic2VsX2xvYWRlZCA9IHRydWU7XG4gIFx0XHRcdH1cbiovXG4gIC8vfSx0aGlzKTtcbiAgLypcdFx0aWYobmV3X29ic2VsX2xvYWRlZCkge1xuICBcdFx0XHR0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZScsdGhpcy50cmFjZVNldCk7XG4gIFx0XHR9XG4qL1xuICAvL30sKi9cbiAgX2NoZWNrX29ic2VsX2xvYWRlZF86IGZ1bmN0aW9uKG9icykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLm9ic2VsX2xpc3Quc29tZShmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5nZXRfaWQoKSA9PT0gb2JzLmdldF9pZCgpOyAvLyBmaXJzdCBhcHByb3hpbWF0aW9uOiBvYnNlbCBoYXMgdGhlIHNhbWUgSUQgPT4gaXQgaXMgYWxyZWFkeSBsb2FkZWQuLi4gV2UgZG9uJ3QgY2hlY2sgaWYgdGhlIG9ic2VsIGhhcyBjaGFuZ2VkIVxuICAgIH0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vYnNlbF9saXN0LnB1c2gob2JzKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIFN0b3JlZFRyYWNlX21ldGhvZHM6IHtcbiAgICBzZXRfbW9kZWw6IGZ1bmN0aW9uKG1vZGVsKSB7fSxcbiAgICBzZXRfb3JpZ2luOiBmdW5jdGlvbihvcmlnaW4pIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XG4gICAgICAvL1x0dGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKG9yaWdpbikpLmdldE1pbGxpc2Vjb25kcygpO1xuICAgICAgLy8gVE9ETyBzeW5jIHdpdGggS1RCU1xuICAgIH0sXG4gICAgZ2V0X2RlZmF1bHRfc3ViamVjdDogZnVuY3Rpb24oKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRfc3ViamVjdDtcbiAgICB9LFxuICAgIHNldF9kZWZhdWx0X3N1YmplY3Q6IGZ1bmN0aW9uKHN1YmplY3QpIHt9LFxuICAgIGNyZWF0ZV9vYnNlbDogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAvLyBMT0NBTCBUUkFDRVxuICAgICAgLy92YXIgb2JzID0gbmV3IFNhbW90cmFjZXMuT2JzZWwob2JzZWxfcGFyYW1zKTtcbiAgICAgIC8vIEtUQlMgQk9HVUVcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgdmFyIGpzb25fb2JzZWwgPSB7XG4gICAgICAgIFwiQGNvbnRleHRcIjpcdFtcbiAgICAgICAgXCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgICAgICAgICAgIHsgXCJtXCI6IFwiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9zaW1wbGUtdHJhY2UtbW9kZWwjXCIgfVxuICAgICAgICBdLFxuICAgICAgICBcIkB0eXBlXCI6XHRcIm06XCIgKyBwYXJhbXMudHlwZSwgLy8gZml4ZWQ6IFwiU2ltcGxlT2JzZWxcIiwgLy8gVE9ETyBLVEJTIEJVRyBUTyBGSVhcbiAgICAgICAgaGFzVHJhY2U6XHRcIlwiLFxuICAgICAgICBzdWJqZWN0Olx0cGFyYW1zLmhhc093blByb3BlcnR5KFwic3ViamVjdFwiKT9wYXJhbXMuc3ViamVjdDp0aGlzLmdldF9kZWZhdWx0X3N1YmplY3QoKSxcbiAgICAgICAgLy9cIm06dHlwZVwiOlx0cGFyYW1zLnR5cGVcbiAgICAgIH07XG4gICAgICAvL2NvbnNvbGUubG9nKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIik/cGFyYW1zLnN1YmplY3Q6dGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCkscGFyYW1zLmhhc093blByb3BlcnR5KFwic3ViamVjdFwiKSxwYXJhbXMuc3ViamVjdCx0aGlzLmdldF9kZWZhdWx0X3N1YmplY3QoKSk7XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KFwiYmVnaW5cIikpIHsganNvbl9vYnNlbC5iZWdpbiA9IHBhcmFtcy5iZWdpbjsgfVxuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImVuZFwiKSkgeyBqc29uX29ic2VsLmJlZ2luID0gcGFyYW1zLmVuZDt9XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KFwiYXR0cmlidXRlc1wiKSkge1xuICAgICAgICBmb3IgKHZhciBhdHRyIGluIHBhcmFtcy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgaWYgKHBhcmFtcy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHIpKSAgICAgICAgICB7anNvbl9vYnNlbFtcIm06XCIgKyBhdHRyXSA9IHBhcmFtcy5hdHRyaWJ1dGVzW2F0dHJdO31cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gX29uX2NyZWF0ZV9vYnNlbF9zdWNjZXNzXyhkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgICAgICAvKlxuICAgICAgICBcdFx0XHRcdHZhciB1cmwgPSBqcVhIUi5nZXRSZXNwb25zZUhlYWRlcignTG9jYXRpb24nKTtcbiAgICAgICAgXHRcdFx0XHR2YXIgdXJsX2FycmF5ID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgIFx0XHRcdFx0Ki9cblxuICAgICAgICB2YXIgdXJsX2FycmF5ID0gZGF0YS5zcGxpdCgnLycpO1xuICAgICAgICB2YXIgb2JzZWxfaWQgPSB1cmxfYXJyYXlbdXJsX2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgICAvL3RoaXMuZ2V0X29ic2VsKG9ic2VsX2lkKTtcbiAgICAgICAgLy8gT3B0aW1pc2F0aW9uOiBkbyBub3QgZG8gYSBHRVQgcXVlcnkgdG8gZ2V0IHRoZSBPQlNFTFxuICAgICAgICAvLyBUaGUgT2JzZWwgcGFyYW1ldGVycyBhcmUgYWxyZWFkeSBrbm93biBpbiBwYXJhbVxuICAgICAgICAvLyBXZSBqdXN0IG5lZWQgdG8gYWRkIHRoZSBJRC5cbiAgICAgICAgcGFyYW1zLmlkID0gb2JzZWxfaWQ7XG4gICAgICAgIHBhcmFtcy50cmFjZSA9IHRoaXM7XG4gICAgICAgIHZhciBvID0gbmV3IEtUQlNPYnNlbChwYXJhbXMpO1xuICAgICAgICBpZiAoIXRoaXMuX2NoZWNrX29ic2VsX2xvYWRlZF8obykpIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIG8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IHRoaXMudXJpLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIHN1Y2Nlc3M6IF9vbl9jcmVhdGVfb2JzZWxfc3VjY2Vzc18uYmluZCh0aGlzKSxcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoanNvbl9vYnNlbClcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBDb21wdXRlZFRyYWNlX21ldGhvZHM6IHtcbiAgICBzZXRfbWV0aG9kOiBmdW5jdGlvbihtZXRob2QpIHt9LFxuICAgIGxpc3RfcGFyYW1ldGVyczogZnVuY3Rpb24oaW5jbHVkZV9pbmhlcml0ZWQpIHt9LFxuICAgIGdldF9wYXJhbWV0ZXI6IGZ1bmN0aW9uKGtleSkge30sXG4gICAgc2V0X3BhcmFtZXRlcjogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge30sXG4gICAgZGVsX3BhcmFtZXRlcjogZnVuY3Rpb24oa2V5KSB7fVxuICB9LFxuXG4gIC8vIFRFTVBPUkFSWSBNRVRIT0RTXG4gIGNyZWF0ZV9vYnNlbDogZnVuY3Rpb24ob2JzZWxfcGFyYW1zKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKCF0aGlzLmNyZWF0ZV9vYnNlbC5oYXNPd25Qcm9wZXJ0eSgnY3JlYXRlX29ic2VsJykpIHtcbiAgICAgIHRoaXMudGVtcC5jcmVhdGVfb2JzZWwgPSBbXTtcbiAgICB9XG4gICAgdGhpcy50ZW1wLmNyZWF0ZV9vYnNlbC5wdXNoIChvYnNlbF9wYXJhbXMpO1xuICB9LFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNUcmFjZTtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIEtUQlNCYXNlID0gcmVxdWlyZShcIi4vS1RCUy5CYXNlLmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiogQHN1bW1hcnkgSmF2YXNjcmlwdCBLVEJTIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUy5cbiogQGNsYXNzIEphdmFzY3JpcHQgS1RCUyBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuXG4qIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4qIEByZXF1aXJlcyBqUXVlcnkgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9qcXVlcnkuY29tXCI+anF1ZXJ5LmNvbTwvYT4pXG4qIEBjb25zdHJ1Y3RvclxuKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiogQGF1Z21lbnRzIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZVxuKiBAZGVzY3JpcHRpb25cbiogU2Ftb3RyYWNlcy5LVEJTIGlzIGEgSmF2YXNjcmlwdCBLVEJTIG9iamVjdCB0aGF0XG4qIGlzIGJvdW5kIHRvIGEgS1RCUy4gVGhpcyBPYmplY3QgaW1wbGVtZXRucyB0aGUgS1RCUyBBUEkuXG4qIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXQgdGhlIGxpc3Qgb2YgYmFzZXNcbiogYXZhaWxhYmxlIGluIHRoZSBLVEJTLiBBY2Nlc3MgYSBzcGVjaWZpYyBiYXNlLCBldGMuXG4qXG4qIEBwYXJhbSB7U3RyaW5nfVx0dXJpXHRVUkkgb2YgdGhlIEtUQlMgdG8gbG9hZC5cbiovXG52YXIgS1RCUyA9IGZ1bmN0aW9uIEtUQlModXJpKSB7XG4gIC8vIEtUQlMgaXMgYSBSZXNvdXJjZVxuICBcInVzZSBzdHJpY3RcIjtcbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgdXJpLCB1cmksICdLVEJTJywgXCJcIik7XG4gIHRoaXMuYmFzZXMgPSBbXTtcbiAgdGhpcy5idWlsdGluX21ldGhvZHMgPSBbXTtcbiAgdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG59O1xuXG5LVEJTLnByb3RvdHlwZSA9IHtcbiAgLy8vLy8vLy8vLy8gT0ZGSUNJQUwgQVBJXG4gIC8qKlxuICAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiovXG4gIGxpc3RfYnVpbHRpbl9tZXRob2RzOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4qL1xuICBnZXRfYnVpbHRpbl9tZXRob2Q6IGZ1bmN0aW9uKCkge30sXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGFycmF5IG9mIHRoZSBVUkkgb2YgdGhlIGJhc2VzIGNvbnRhaW5lZCBpbiB0aGUgS1RCU1xuICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fSBBcnJheSBvZiBVUkkgb2YgYmFzZXMuXG4qL1xuICBsaXN0X2Jhc2VzOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5iYXNlcztcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnkgUmV0dXJucyB0aGUgS1RCUy5CYXNlIHdpdGggdGhlIGdpdmVuIElELlxuICAqIEByZXR1cm5zIFNhbW90cmFjZXMuS1RCUy5CYXNlIEJhc2UgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gSURcbiAgKiBAcGFyYW0gaWQge1N0cmluZ30gVVJJIG9mIHRoZSBiYXNlXG4qL1xuICBnZXRfYmFzZTogZnVuY3Rpb24oaWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gbmV3IEtUQlNCYXNlKHRoaXMudXJpICsgaWQsIGlkKTtcbiAgfSxcbiAgLyoqXG4gICogQ3JlYXRlIGEgbmV3IGJhc2UuXG4gICogQHBhcmFtIGlkIHtTdHJpbmd9IFVSSSBvZiB0aGUgYmFzZSAob3B0aW9uYWwpXG4gICogQHBhcmFtIGxhYmVsIHtTdHJpbmd9IExhYmVsIG9mIHRoZSBiYXNlIChvcHRpb25hbClcbiovXG4gIGNyZWF0ZV9iYXNlOiBmdW5jdGlvbihpZCwgbGFiZWwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbmV3X2Jhc2UgPSB7XG4gICAgICBcIkBjb250ZXh0XCI6XHRcImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEva3Ricy1qc29ubGQtY29udGV4dFwiLFxuICAgICAgXCJAdHlwZVwiOlx0XCJCYXNlXCIsXG4gICAgICBcIkBpZFwiOlx0XHRpZCArIFwiL1wiLFxuICAgICAgXCJsYWJlbFwiOlx0bGFiZWxcbiAgICB9O1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMudXJpLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ld19iYXNlKSxcbiAgICAgIHN1Y2Nlc3M6IHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaC5iaW5kKHRoaXMpLFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygncXVlcnkgZXJyb3InKTtcbiAgICAgICAgY29uc29sZS5sb2coW2pxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvcl0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvLy8vLy8vLy8vL1xuICAvKipcbiAgKiBPdmVybG9hZHMgdGhlIHtAbGluayBTYW1vdHJhY2VzLktUQlMuUmVzb3VjZSNfb25fc3RhdGVfcmVmcmVzaF99IG1ldGhvZC5cbiAgKiBAcHJpdmF0ZVxuKi9cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnYmFzZXMnLCBkYXRhLmhhc0Jhc2UsICdrdGJzOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2J1aWx0aW5fbWV0aG9kcycsIGRhdGEuaGFzQnVpbGRpbk1ldGhvZCwgJ2t0YnM6dXBkYXRlJyk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlM7XG4iLCJ2YXIgT2JzZWwgPSByZXF1aXJlKFwiLi9PYnNlbC5qc1wiKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgSmF2YXNjcmlwdCBUcmFjZSBPYmplY3QuXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBUcmFjZSBPYmplY3QuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLlRyYWNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuRGVtb1RyYWNlIGlzIGEgSmF2YXNjcmlwdCBUcmFjZSBvYmplY3QuXG4gKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0XG4gKiB0aGUgT2JzZWxzIGZyb20gdGhlIHRyYWNlLCBjcmVhdGUgbmV3IE9ic2VscywgZXRjLlxuICpcbiAqIFRoZSB0cmFjZSBpcyBpbml0aWFsaXNlZCBlbXB0eS4gT2JzZWxzIGhhdmUgdG8gYmUgY3JlYXRlZFxuICogYnkgdXNpbmcgdGhlIHtAbGluayBTYW1vdHJhY2VzLkRlbW9UcmFjZSNuZXdPYnNlbH0gbWV0aG9kLlxuICovXG52YXIgTG9jYWxUcmFjZSA9IGZ1bmN0aW9uKHNvdXJjZV90cmFjZXMpIHtcbiAgLy8gQWRkaW50IHRoZSBPYnNlcnZhYmxlIHRyYWl0XG4gIFwidXNlIHN0cmljdFwiO1xuICBFdmVudEhhbmRsZXIuY2FsbCh0aGlzKTtcblxuICAvKiBOb21icmUgZCdvYnNlbHMgZGFucyBsYSB0cmFjZSAqL1xuICB0aGlzLmNvdW50ID0gMDsgLy8gc2VydCBkJ0lEIHBvdXIgbGUgcHJvY2hhaW4gb2JzZXJ2w6kuXG4gIC8qIEFycmF5IGQnb2JzZWxzICovXG4gIHRoaXMub2JzZWxfbGlzdCA9IFtdO1xuICB0aGlzLnNvdXJjZV90cmFjZXMgPSAoc291cmNlX3RyYWNlcyAhPT0gdW5kZWZpbmVkKT9zb3VyY2VfdHJhY2VzOltdO1xuICB0aGlzLnNvdXJjZV90cmFjZXMuZm9yRWFjaChmdW5jdGlvbih0KSB7XG4gICAgdC50cmFuc2Zvcm1lZF90cmFjZXMucHVzaCh0aGlzKTtcbiAgfSk7XG4gIHRoaXMudHJhbnNmb3JtZWRfdHJhY2VzID0gW107XG4gIHRoaXMub3JpZ2luID0gXCJcIjtcbiAgLy90aGlzLm9yaWdpbl9vZmZzZXQgPSAobmV3IERhdGUoMCkpLmdldE1pbGxpc2Vjb25kcygpO1xuXG59O1xuXG5Mb2NhbFRyYWNlLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgbGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gTGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICovXG4gIGdldF9sYWJlbDogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO3JldHVybiB0aGlzLmxhYmVsOyB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBTZXRzIHRoZSBsYWJlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0ge1N0cmluZ30gbGJsIExhYmVsIG9mIHRoZSB0cmFjZVxuICBcdCAqL1xuICBzZXRfbGFiZWw6IGZ1bmN0aW9uKGxibCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMubGFiZWwgPSBsYmw7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmVzZXRzIHRoZSBsYWJlbCB0byB0aGUgZW1wdHkgc3RyaW5nXG4gIFx0ICovXG4gIHJlc2V0X2xhYmVsOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLmxhYmVsID0gXCJcIjtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmVkaXRfbWV0YScpO1xuICB9LFxuXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIG1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEByZXR1cm5zIE1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEB0b2RvIFVQREFURSBXSEFUIElTIEEgTU9ERUxcbiAgXHQgKi9cbiAgZ2V0X21vZGVsOiBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIHRoaXMubW9kZWw7IH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIG9yaWdpbiBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcmV0dXJucyBPcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHRvZG8gVVBEQVRFIFdIQVQgSVMgQU4gT1JJR0lOXG4gIFx0ICovXG4gIGdldF9vcmlnaW46IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy5vcmlnaW47IH0sXG4gIC8vZ2V0X29yaWdpbl9vZmZzZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vcmlnaW5fb2Zmc2V0OyB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBSZXR1cm5zIHRoZSBzb3VyY2UgdHJhY2VzIG9mIHRoaXMgdHJhY2VcbiAgXHQgKiBAcmV0dXJucyB7QXJyYXkuPFRyYWNlPn0gU291cmNlIHRyYWNlcyBvZiB0aGlzIHRyYWNlLlxuICBcdCAqL1xuICBsaXN0X3NvdXJjZV90cmFjZXM6IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy5zb3VyY2VfdHJhY2VzOyB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBSZXR1cm5zIHRoZSB0cmFjZXMgdHJhbnNmb3JtZWQgZnJvbSB0aGlzIHRyYWNlXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxUcmFjZT59IFRyYWNlIHRyYW5zZm9ybWVkIGZyb20gdGhpcyB0cmFjZVxuICBcdCAqL1xuICBsaXN0X3RyYW5zZm9ybWVkX3RyYWNlczogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO3JldHVybiB0aGlzLnRyYW5zZm9ybWVkX3RyYWNlczsgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgbGlzdCBvZiBvYnNlbHMgaW4gYW4gb3B0aW9uYWwgdGltZSBpbnRlcnZhbC5cbiAgXHQgKiBJZiBubyBtaW5pbXVtIHRpbWUgYW5kIG5vIG1heGltdW0gdGltZSBjb25zdHJhaW50IGFyZVxuICBcdCAqIGRlZmluZWQsIHJldHVybnMgdGhlIHdob2xlIGxpc3Qgb2Ygb2JzZWxzLlxuICBcdCAqIElmIG9uZSBvZiB0aGUgdHdvIGNvbnN0cmFpbnRzIGFyZSBkZWZpbmVkLCB0aGVuIHJldHVybnNcbiAgXHQgKiBvYnNlbHMgbWF0Y2hpbmcgdGhlIHRpbWUgY29uc3RyYWludHMuXG4gIFx0ICpcbiAgXHQgKiBOb3RlOiBpZiBhbiBvYnNlbCBvdmVybGFwcyB3aXRoIHRoZSBzdGFydCBvciB0aGUgZW5kXG4gIFx0ICogY29uc3RyYWludCwgdGhlbiBpdCB3aWxsIGJlIGluY2x1ZGVkIChmb3IgaW5zdGFuY2UgYW5cbiAgXHQgKiBvYnNlbCB0aGF0IHN0YXJ0cyBiZWZvcmUgdGhlIHN0YXJ0IGNvbnN0cmFpbnQgYW5kIGVuZHNcbiAgXHQgKiBhZnRlciB0aGF0IGNvbnN0cmFpbnQgd2lsbCBiZSBpbmNsdWRlZCkuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtiZWdpbl0gTWluaW11bSB0aW1lIGNvbnN0cmFpbnRcbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gW2VuZF0gTWF4aW11bSB0aW1lIGNvbnN0cmFpbnRcbiAgXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZXZlcnNlPWZhbHNlXSBSZXR1cm5zIHRoZSBvYnNlbCBsaXN0IGluXG4gIFx0ICogICAgIHJldmVyc2UgY2hyb25vbG9naWNhbCBvcmRlciBpZiB0cnVlIGFuZCBpbiBub3JtYWxcbiAgXHQgKiAgICAgY2hyb25vbG9naWNhbCBvcmRlciBpZiBmYWxzZS5cbiAgXHQgKiBAcmV0dXJucyB7QXJyYXkuPE9ic2VsPn0gTGlzdCBvZiByZWxldmFudCBvYnNlbHNcbiAgXHQgKiBAdG9kbyBSRVZFUlNFIElTIE5PVCBZRVQgVEFLRU4gSU5UTyBBQ0NPVU5UXG4gIFx0ICovXG4gIGxpc3Rfb2JzZWxzOiBmdW5jdGlvbihiZWdpbiwgZW5kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLy8gVE9ETyByZXZlcnNlIGlzIGlnbm9yZWQuXG4gICAgcmV0dXJuIHRoaXMub2JzZWxfbGlzdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgaWYgKGVuZCAmJiBvLmdldF9iZWdpbigpID4gZW5kKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGJlZ2luICYmIG8uZ2V0X2VuZCgpIDwgYmVnaW4pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgXHQgKiBSZXRyaWV2ZSBhbiBvYnNlbCBpbiB0aGUgdHJhY2UgZnJvbSBpdHMgSUQuXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGlkIElEIG9mIHRoZSBPYnNlbCB0byByZXRyaWV2ZVxuICBcdCAqIEByZXR1cm5zIHtPYnNlbH0gT2JzZWwgdGhhdCBjb3JyZXNwb25kcyB0byB0aGlzIElEXG4gIFx0ICogICAgIG9yIHVuZGVmaW5lZCBpZiB0aGUgb2JzZWwgd2FzIG5vdCBmb3VuZC5cbiAgXHQgKiBAdG9kbyB1c2UgS1RCUyBhYnN0cmFjdCBBUEkuXG4gIFx0ICovXG4gIGdldF9vYnNlbDogZnVuY3Rpb24oaWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgb2JzO1xuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmdldF9pZCgpID09PSBpZCkgeyBvYnMgPSBvOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9icztcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogU2V0cyB0aGUgbW9kZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIG1vZGVsIE1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEB0b2RvIFVQREFURSBXSEFUIElTIEEgTU9ERUxcbiAgXHQgKi9cbiAgc2V0X21vZGVsOiBmdW5jdGlvbihtb2RlbCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmVkaXRfbWV0YScpO1xuICB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBTZXRzIHRoZSBvcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIG9yaWdpbiBPcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHRvZG8gVVBEQVRFIFdIQVQgSVMgQU4gT1JJR0lOXG4gIFx0ICovXG4gIHNldF9vcmlnaW46IGZ1bmN0aW9uKG9yaWdpbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMub3JpZ2luID0gb3JpZ2luO1xuICAgIC8vXHR0aGlzLm9yaWdpbl9vZmZzZXQgPSAobmV3IERhdGUob3JpZ2luKSkuZ2V0TWlsbGlzZWNvbmRzKCk7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgZGVmYXVsdCBzdWJqZWN0IG9mIHRoZSB0cmFjZVxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0cmFjZSBkZWZhdWx0IHN1YmplY3RcbiAgXHQgKi9cbiAgZ2V0X2RlZmF1bHRfc3ViamVjdDogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO3JldHVybiB0aGlzLnN1YmplY3Q7fSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogU2V0IHRoZSBkZWZhdWx0IHN1YmplY3Qgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IHN1YmplY3QgVGhlIHRyYWNlIGRlZmF1bHQgc3ViamVjdFxuICBcdCAqL1xuICBzZXRfZGVmYXVsdF9zdWJqZWN0OiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdDtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmVkaXRfbWV0YScpO1xuICB9LFxuXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIENyZWF0ZSBhIG5ldyBvYnNlbCBpbiB0aGUgdHJhY2Ugd2l0aCB0aGVcbiAgXHQgKiBnaXZlbiBwcm9wZXJ0aWVzXG4gIFx0ICogQHBhcmFtIHtPYnNlbFBhcmFtfSBvYnNlbF9wYXJhbXMgUGFyYW1ldGVyc1xuICBcdCAqICAgICBjb3JyZXNwb25kaW5nIHRvIHRoZSBvYnNlbCB0byBjcmVhdGUuXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IG9ic2VsX3BhcmFtcy50eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbb2JzZWxfcGFyYW1zLmJlZ2luXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgc3RhcnRzXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtvYnNlbF9wYXJhbXMuZW5kXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgZW5kc1xuICBcdCAqIEBwYXJhbSB7T2JqZWN0fSBbb2JzZWxfcGFyYW1zLmF0dHJpYnV0ZXNdIEF0dHJpYnV0ZXMgb2YgdGhlIG9ic2VsLlxuICBcdCAqIEBwYXJhbSB7QXJyYXk8UmVsYXRpb24+fSBbb2JzZWxfcGFyYW1zLnJlbGF0aW9uc10gUmVsYXRpb25zIGZyb20gdGhpcyBvYnNlbC5cbiAgXHQgKiBAcGFyYW0ge0FycmF5PFJlbGF0aW9uPn0gW29ic2VsX3BhcmFtcy5pbnZlcnNlX3JlbGF0aW9uc10gUmVsYXRpb25zIHRvIHRoaXMgb2JzZWwuXG4gIFx0ICogQHBhcmFtIHtBcnJheTxPYnNlbD59IFtvYnNlbF9wYXJhbXMuc291cmNlX29ic2Vsc10gU291cmNlIG9ic2VscyBvZiB0aGUgb2JzZWwuXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IFtvYnNlbF9wYXJhbXMubGFiZWxdIExhYmVsIG9mIHRoZSBvYnNlbC5cbiAgXHQgKi9cbiAgY3JlYXRlX29ic2VsOiBmdW5jdGlvbihvYnNlbF9wYXJhbXMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBvYnNlbF9wYXJhbXMuaWQgPSB0aGlzLmNvdW50O1xuICAgIHRoaXMuY291bnQrKztcbiAgICBvYnNlbF9wYXJhbXMudHJhY2UgPSB0aGlzO1xuICAgIHZhciBvYnMgPSBuZXcgT2JzZWwob2JzZWxfcGFyYW1zKTtcbiAgICB0aGlzLm9ic2VsX2xpc3QucHVzaChvYnMpO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6Y3JlYXRlX29ic2VsJywgb2JzKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmVtb3ZlcyB0aGUgZ2l2ZW4gb2JzZWwgZnJvbSB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0ge09ic2VsfSBvYnMgT2JzZWwgdG8gcmVtb3ZlXG4gIFx0ICovXG4gIHJlbW92ZV9vYnNlbDogZnVuY3Rpb24ob2JzKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5vYnNlbF9saXN0ID0gdGhpcy5vYnNlbF9saXN0LmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gKG8gPT09IG9icyk/ZmFsc2U6dHJ1ZTtcbiAgICB9KTtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOnJlbW92ZV9vYnNlbCcsIG9icyk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEB0b2RvIFRPRE8gZG9jdW1lbnQgdGhpcyBtZXRob2RcbiAgXHQgKi9cbiAgdHJhbnNmb3JtOiBmdW5jdGlvbih0cmFuc2Zvcm1hdGlvbl9tZXRob2QsIHBhcmFtZXRlcnMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdHJhbnNmb3JtYXRpb25fbWV0aG9kKHRoaXMsIHBhcmFtZXRlcnMpO1xuICB9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBUT0RPIGRvY3VtZW50IHRoaXMgbWV0aG9kXG4gIFx0ICovXG4gIHRyYW5zZm9ybWF0aW9uczoge1xuXG4gICAgZHVwbGljYXRlOiBmdW5jdGlvbih0cmFjZSkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAvLyBUT0RPIGJldHRlciBkZWVwIGNvcHlcbiAgICAgIHZhciB0cmFuc2Zvcm1lZF90cmFjZSA9IG5ldyBMb2NhbFRyYWNlKFt0cmFjZV0pO1xuICAgICAgdHJhY2UubGlzdF9vYnNlbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgfSk7XG4gICAgICB0cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbyA9IGUuZGF0YTtcbiAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtZWRfdHJhY2U7XG4gICAgfSxcbiAgICBmaWx0ZXJfb2JzZWxfdHlwZTogZnVuY3Rpb24odHJhY2UsIG9wdCkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAvLyBUT0RPOiBpbXBsZW1lbnRcbiAgICAgIC8vIFRPRE8gYmV0dGVyIGRlZXAgY29weVxuICAgICAgdmFyIHRyYW5zZm9ybWVkX3RyYWNlID0gbmV3IExvY2FsVHJhY2UoW3RyYWNlXSk7XG4gICAgICB0cmFjZS5saXN0X29ic2VscygpLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgICBpZiAob3B0LnR5cGVzLnNvbWUoZnVuY3Rpb24odHlwZSkge3JldHVybiB0eXBlID09PSBvLmdldF9vYnNlbF90eXBlKCk7fSkpIHtcbiAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IFwia2VlcFwiKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1lZF90cmFjZS5jcmVhdGVfb2JzZWwoby50b19PYmplY3QoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHQubW9kZSA9PT0gXCJyZW1vdmVcIikge1xuICAgICAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbyA9IGUuZGF0YTtcbiAgICAgICAgaWYgKG9wdC50eXBlcy5zb21lKGZ1bmN0aW9uKHR5cGUpIHtyZXR1cm4gdHlwZSA9PT0gby5nZXRfb2JzZWxfdHlwZSgpO30pKSB7XG4gICAgICAgICAgaWYgKG9wdC5tb2RlID09PSBcImtlZXBcIikge1xuICAgICAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IFwicmVtb3ZlXCIpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybWVkX3RyYWNlO1xuICAgIH0sXG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvY2FsVHJhY2U7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuKiBPYnNlbCBpcyBhIHNob3J0bmFtZSBmb3IgdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLk9ic2VsfVxuKiBvYmplY3QuXG4qIEB0eXBlZGVmIE9ic2VsXG4qIEBzZWUgU2Ftb3RyYWNlcy5PYnNlbFxuKi9cblxuLyoqXG4qIE9ic2VsUGFyYW0gaXMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgcGFyYW1ldGVyc1xuKiBuZWNlc3NhcnkgdG8gY3JlYXRlIGEgbmV3IG9ic2VsLlxuKiBUaGlzIHR5cGUgb2Ygb2JqZWN0IGlzIHVzZWQgaW4gc2V2ZXJhbCBtZXRob2RzXG4qIHN1Y2ggYXMgdGhlIE9ic2VsIGNvbnN0cnVjdG9yLCBvciB0aGVcbiogVHJhY2UuY3JlYXRlX29ic2VsIG1ldGhvZC5cbiogVGhlIG9wdGlvbmFsIHBvcnBlcnRpZXMgdmFyaWVzIGRlcGVuZGluZyBvbiB0aGVcbiogbWV0aG9kIGNhbGxlZC5cbiogQHR5cGVkZWYgT2JzZWxQYXJhbVxuKiBAcHJvcGVydHkge1N0cmluZ30gW2lkXSBJZCBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtUcmFjZX0gW3RyYWNlXSBUcmFjZSBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlXSBUeXBlIG9mIHRoZSBvYnNlbFxuKiBAcHJvcGVydHkge051bWJlcn0gW2JlZ2luXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgc3RhcnRzXG4qIEBwcm9wZXJ0eSB7TnVtYmVyfSBbZW5kXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgZW5kc1xuKiBAcHJvcGVydHkge09iamVjdH0gW2F0dHJpYnV0ZXNdIEF0dHJpYnV0ZXMgb2YgdGhlIG9ic2VsLlxuKiBAcHJvcGVydHkge0FycmF5PFJlbGF0aW9uPn0gW3JlbGF0aW9uc10gUmVsYXRpb25zIGZyb20gdGhpcyBvYnNlbC5cbiogQHByb3BlcnR5IHtBcnJheTxSZWxhdGlvbj59IFtpbnZlcnNlX3JlbGF0aW9uc10gUmVsYXRpb25zIHRvIHRoaXMgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7QXJyYXk8T2JzZWw+fSBbc291cmNlX29ic2Vsc10gU291cmNlIG9ic2VscyBvZiB0aGUgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7U3RyaW5nfSBbcGFyYW0ubGFiZWxdIExhYmVsIG9mIHRoZSBvYnNlbC5cbiogQHRvZG8gRklYTUUgREVGSU5FIFdIQVQgSVMgQSBSRUxBVElPTlxuKi9cblxuLyoqXG4qIEBzdW1tYXJ5IEphdmFTY3JpcHQgT2JzZWwgY2xhc3NcbiogQGNsYXNzIEphdmFTY3JpcHQgT2JzZWwgY2xhc3NcbiogQHBhcmFtIHtPYnNlbFBhcmFtfSBwYXJhbSBQYXJhbWV0ZXJzIG9mIHRoZSBvYnNlbFxuKiBAcGFyYW0ge1N0cmluZ30gcGFyYW0uaWQgSWRlbnRpZmllciBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7VHJhY2V9IHBhcmFtLlRyYWNlIFRyYWNlIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtTdHJpbmd9IHBhcmFtLnR5cGUgVHlwZSBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7TnVtYmVyfSBbcGFyYW0uYmVnaW49RGF0ZS5ub3coKV0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtLmVuZD1wYXJhbS5iZWdpbl0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiogQHBhcmFtIHtPYmplY3R9IFtwYXJhbS5hdHRyaWJ1dGVzXSBBdHRyaWJ1dGVzIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtBcnJheTxSZWxhdGlvbj59IFtwYXJhbS5yZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4qIEBwYXJhbSB7QXJyYXk8UmVsYXRpb24+fSBbcGFyYW0uaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuKiBAcGFyYW0ge0FycmF5PE9ic2VsPn0gW3BhcmFtLnNvdXJjZV9vYnNlbHNdIFNvdXJjZSBvYnNlbHMgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qIEB0b2RvIEZJWE1FIFJFTEFUSU9OUyBBUkUgTk9UIFlFVCBTVVBQT1JURURcbiovXG5cbnZhciBPYnNlbCA9IGZ1bmN0aW9uIE9ic2VsKHBhcmFtKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAnaWQnKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ3RyYWNlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0eXBlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2JlZ2luJyxcdERhdGUubm93KCkpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdlbmQnLFx0XHR0aGlzLmJlZ2luKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnYXR0cmlidXRlcycsXHR7fSk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdyZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2ludmVyc2VfcmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdzb3VyY2Vfb2JzZWxzJyxcdFx0W10pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnbGFiZWwnLFx0XHRcIlwiKTtcbn07XG5cbk9ic2VsLnByb3RvdHlwZSA9IHtcbiAgLy8gQVRUUklCVVRFU1xuICBhdHRyaWJ1dGVzOiB7fSxcbiAgcmVsYXRpb25zOiBbXSxcbiAgaW52ZXJzZV9yZWxhdGlvbnM6IFtdLFxuICBzb3VyY2Vfb2JzZWxzOiBbXSxcbiAgbGFiZWw6IFwiXCIsXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIHNldCB0aGUgYXR0cmlidXRlIG9mIHRoZSBzYW1lIG5hbWUgd2l0aCB0aGUgZGVmYXVsdFxuICAqIHZhbHVlLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICogQHBhcmFtIHZhbHVlIERlZmF1bHQgdmFsdWVcbiAgKiBAcHJpdmF0ZVxuKi9cbiAgX3ByaXZhdGVfY2hlY2tfZGVmYXVsdDogZnVuY3Rpb24ocGFyYW0sIGF0dHIsIHZhbHVlKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzW2F0dHJdID0gKHBhcmFtW2F0dHJdICE9PSB1bmRlZmluZWQpP3BhcmFtW2F0dHJdOnZhbHVlO1xufSxcbiAgLyoqXG4gICogSWYgYXR0cmlidXRlIGV4aXN0cywgdGhlbiBzZXQgdGhlIGNsYXNzIGF0dHJpYnV0ZVxuICAqIG9mIHRoZSBzYW1lIG5hbWUgdG8gdGhlIGF0dHJpYnV0ZSB2YWx1ZSwgb3RoZXJ3aXNlXG4gICogbm90aGluZyBoYXBwZW5zLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX3VuZGVmOiBmdW5jdGlvbihwYXJhbSwgYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHBhcmFtW2F0dHJdICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzW2F0dHJdID0gcGFyYW1bYXR0cl07XG4gIH1cbn0sXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIHRocm93IGFuIGVycm9yLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX2Vycm9yOiBmdW5jdGlvbihwYXJhbSwgYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHBhcmFtW2F0dHJdICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzW2F0dHJdID0gcGFyYW1bYXR0cl07XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgXCJQYXJhbWV0ZXIgXCIgKyBhdHRyICsgXCIgcmVxdWlyZWQuXCI7XG4gIH1cbn0sXG4gIC8vIFJFU09VUkNFXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmVtb3ZlIHRoZSBvYnNlbCBmcm9tIGl0cyB0cmFjZS5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBSZW1vdmUgdGhlIG9ic2VsIGZyb20gaXRzIHRyYWNlLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOnJlbW92ZV9vYnNlbH0gZXZlbnRcbiovXG4gIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLmdldF90cmFjZSgpLnJlbW92ZV9vYnNlbCh0aGlzKTtcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtTdHJpbmd9IElkIG9mIHRoZSBvYnNlbC5cbiovXG4gIGdldF9pZDogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICByZXR1cm4gdGhpcy5pZDtcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgbGFiZWwgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtTdHJpbmd9IExhYmVsIG9mIHRoZSBvYnNlbC5cbiovXG4gIGdldF9sYWJlbDogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICByZXR1cm4gdGhpcy5sYWJlbDtcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgbGFiZWwgb2YgdGhlIE9ic2VsLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qL1xuICBzZXRfbGFiZWw6IGZ1bmN0aW9uKGxibCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLmxhYmVsID0gbGJsOyB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbCB0byB0aGUgZW1wdHkgc3RyaW5nLlxuKi9cbiAgcmVzZXRfbGFiZWw6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbnRoaXMubGFiZWwgPSBcIlwiOyB9LFxuICAvLyBPQlNFTFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHRyYWNlIHRoZSBPYnNlbCBiZWxvbmdzIHRvLlxuICAqIEByZXR1cm5zIHtUcmFjZX0gVHJhY2UgdGhlIE9ic2VsIGJlbG9uZ3MgdG8uXG4qL1xuICBnZXRfdHJhY2U6IFx0XHRmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5yZXR1cm4gdGhpcy50cmFjZTsgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBUeXBlIG9mIHRoZSBvYnNlbC5cbiAgKiBAdG9kbyBUT0RPIGRpZmZlcnMgZnJvbSBLVEJTIEFQSSAtPiBleHByZXNzIGl0IGNsZWFybHlcbiovXG4gIGdldF90eXBlOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5yZXR1cm4gdGhpcy50eXBlOyB9LFxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiovXG4gIGdldF9iZWdpbjogXHRcdGZ1bmN0aW9uKCkge1xuICAgIC8vcmV0dXJuIHRoaXMuZ2V0X3RyYWNlKCkuZ2V0X29yaWdpbl9vZmZzZXQoKSArIHRoaXMuYmVnaW47XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuYmVnaW47XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiovXG4gIGdldF9lbmQ6IFx0XHRmdW5jdGlvbigpIHtcbiAgICAvL3JldHVybiB0aGlzLmdldF90cmFjZSgpLmdldF9vcmlnaW5fb2Zmc2V0KCkgKyB0aGlzLmVuZDtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5lbmQ7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogQGRlc2NyaXB0aW9uXG4gICogU2V0cyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAcGFyYW1zIHtTdHJpbmd9IHR5cGUgVHlwZSBvZiB0aGUgb2JzZWwuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X29ic2VsX3R5cGU6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgc3RhcnRzLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgc3RhcnRzLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7TnVtYmVyfSBiZWdpbiBUaW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAdG9kbyBUT0RPIG5vdCBLVEJTIEFQSSBjb21wbGlhbnRcbiAgKiBAZGVwcmVjYXRlZCBUaGlzIG1ldGhvZCBtaWdodCBub3QgYmUgc3VwcG9ydGVkIGluIHRoZSBmdXR1cmUuXG4qL1xuICBmb3JjZV9zZXRfYmVnaW46IGZ1bmN0aW9uKGJlZ2luKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5iZWdpbiA9IGJlZ2luO1xuICAgIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAcGFyYW1zIHtOdW1iZXJ9IGVuZCBUaW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X2VuZDogXHRmdW5jdGlvbihlbmQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBzb3VyY2UgT2JzZWxzIG9mIHRoZSBjdXJyZW50IE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxPYnNlbD59IFNvdXJjZSBPYnNlbHMgb2YgdGhlIGN1cnJlbnQgT2JzZWwuXG4qL1xuICBsaXN0X3NvdXJjZV9vYnNlbHM6IFx0ZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMubGlzdF9zb3VyY2Vfb2JzZWxzID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIFtdOyB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlX29ic2VscztcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBhdHRyaWJ1dGUgbmFtZXMgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fSBBdHRyaWJ1dGUgbmFtZXMgb2YgdGhlIE9ic2VsLlxuKi9cbiAgbGlzdF9hdHRyaWJ1dGVfdHlwZXM6IFx0ZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICAgIHZhciBhdHRycyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkgICAgICB7XG4gICAgICAgIGF0dHJzLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXR0cnM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgcmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fSBSZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuKi9cbiAgbGlzdF9yZWxhdGlvbl90eXBlczogXHRmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmICh0aGlzLnJlbGF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICB2YXIgcmVscyA9IFtdO1xuICB0aGlzLnJlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAvL3ZhciB1bmlxdWVOYW1lcyA9IFtdO1xuICAgIGlmICgkLmluQXJyYXkoci50eXBlLCByZWxzKSA9PT0gLTEpIHtcbiAgICAgIHJlbHMucHVzaChyLnR5cGUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZWxzO1xufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBPYnNlbHMgcmVsYXRlZCB0byB0aGUgY3VycmVudCBPYnNlbCB3aXRoIHRoZSBnaXZlbiByZWxhdGlvbiB0eXBlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSByZWxhdGlvbl90eXBlIFJlbGF0aW9uIHR5cGUuXG4gICogQHJldHVybnMge0FycmF5PE9ic2VsPn0gT2JzZWxzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuKi9cbiAgbGlzdF9yZWxhdGVkX29ic2VsczogXHRmdW5jdGlvbihyZWxhdGlvbl90eXBlKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgb2JzcyA9IFtdO1xuICBpZiAodGhpcy5yZWxhdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMucmVsYXRpb25zLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICAgIGlmIChyLnR5cGUgPT09IHJlbGF0aW9uX3R5cGUpIHtcbiAgICAgICAgb2Jzcy5wdXNoKHIub2JzZWxfdG8pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmICh0aGlzLmludmVyc2VfcmVsYXRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmludmVyc2VfcmVsYXRpb25zLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICAgIGlmIChyLnR5cGUgPT09IHJlbGF0aW9uX3R5cGUpIHtcbiAgICAgICAgb2Jzcy5wdXNoKHIub2JzZWxfdG8pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYnNzO1xufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIHJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gSW52ZXJzZSByZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuKi9cbiAgbGlzdF9pbnZlcnNlX3JlbGF0aW9uX3R5cGVzOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmICh0aGlzLmludmVyc2VfcmVsYXRpb25zID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIFtdOyB9XG4gIHZhciByZWxzID0gW107XG4gIHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICBpZiAoJC5pbkFycmF5KHIudHlwZSwgcmVscykgPT09IC0xKSB7XG4gICAgICByZWxzLnB1c2goci50eXBlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVscztcbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIEF0dHJpYnV0ZSBuYW1lLlxuICAqIEByZXR1cm5zIHtPYmplY3R9IEF0dHJpYnV0ZSB2YWx1ZS5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcbiovXG4gIGdldF9hdHRyaWJ1dGU6XHRmdW5jdGlvbihhdHRyKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAodGhpcy5hdHRyaWJ1dGVzW2F0dHJdID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBcIkF0dHJpYnV0ZSBcIiArIGF0dHIgKyBcIiBpcyBub3QgZGVmaW5lZFwiOyAvLyBUT0RPXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgfVxufSxcbiAgLy9cdGRlbF9hdHRyaWJ1dGVfdmFsdWU6XHRmdW5jdGlvbihhdHRyKSB7fSwgLy8gVE9ETyBlcnJldXIgZGUgbCdBUEkgS1RCUz9cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUuXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgQXR0cmlidXRlIG5hbWUuXG4gICogQHBhcmFtIHtPYmplY3R9IHZhbCBBdHRyaWJ1dGUgdmFsdWUuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBzZXRfYXR0cmlidXRlOlx0ZnVuY3Rpb24oYXR0ciwgdmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLmF0dHJpYnV0ZXNbYXR0cl0gPSB2YWw7XG4gIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICAvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxufSxcbiAgLy9cdGRlbF9hdHRyaWJ1dGVfdmFsdWU6XHRmdW5jdGlvbihhdHRyKSB7fSwgLy8gVE9ETyBlcnJldXIgZGUgbCdBUEkgS1RCUz9cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZW1vdmVzIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBSZW1vdmVzIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTplZGl0X29ic2VsfSBldmVudFxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBdHRyaWJ1dGUgbmFtZS5cbiovXG4gIGRlbF9hdHRyaWJ1dGU6XHRcdFx0ZnVuY3Rpb24oYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgdGhpcy50cmFjZS50cmlnZ2VyKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcyk7XG4gIC8vIFRPRE8gZW52b3llciB1biBldmVudCBwb3VyIGRpZXIgcXVlIGwnb2JzZWwgYSBjaGFuZ8OpXG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIEFkZHMgYSByZWxhdGlvbiB3aXRoIGFuIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIE5PVCBZRVQgSU1QTEVNRU5URURcbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVsIFJlbGF0aW9uIHR5cGUuXG4gICogQHBhcmFtIHtPYnNlbH0gb2JzIFRhcmdldCBPYnNlbC5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcbiovXG4gIGFkZF9yZWxhdGVkX29ic2VsOlx0XHRmdW5jdGlvbihyZWwsIG9icykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUT0RPXG4gIHRocm93IFwibWV0aG9kIG5vdCBpbXBsZW1lbnRlZCB5ZXRcIjtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmVtb3ZlcyBhIHJlbGF0aW9uIHdpdGggYW4gT2JzZWwuXG4gICogQGRlc2NyaXB0aW9uXG4gICogTk9UIFlFVCBJTVBMRU1FTlRFRFxuICAqIEBwYXJhbSB7U3RyaW5nfSByZWwgUmVsYXRpb24gdHlwZS5cbiAgKiBAcGFyYW0ge09ic2VsfSBvYnMgVGFyZ2V0IE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSVxuKi9cbiAgZGVsX3JlbGF0ZWRfb2JzZWw6XHRcdGZ1bmN0aW9uKHJlbCwgb2JzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRPRE9cbiAgdGhyb3cgXCJtZXRob2Qgbm90IGltcGxlbWVudGVkIHlldFwiO1xuICAvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxufSxcblxuICAvLyBOT1QgSU4gS1RCUyBBUElcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBDb3BpZXMgdGhlIE9ic2VsIHByb3BlcnRpZXMgaW4gYW4gT2JqZWN0LlxuICAqIEBkZXNjcmlwdGlvblxuICAqIENvcGllcyB0aGUgT2JzZWwgcHJvcGVydGllcyBpbiBhbiBPYmplY3RcbiAgKiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBhbiBPYnNlbCB3aXRoXG4gICoge0BsaW5rIFNhbW90cmFjZXMuT2JzZWwjT2JzZWx9IGNvbnN0cnVjdG9yIG9yXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjY3JlYXRlX29ic2VsfSBtZXRob2QuXG4gICogQHJldHVybnMge09iamVjdH0gT2JqZWN0IHRoYXRcbiovXG4gIHRvX09iamVjdDogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgb2JqID0ge1xuICAgIGlkOiB0aGlzLmlkLFxuICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICBiZWdpbjogdGhpcy5iZWdpbixcbiAgICBlbmQ6IHRoaXMuZW5kLFxuICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgIC8vIHVzZSAuc2xpY2UgdG8gY29weVxuICAgIC8vIFRPRE8gaXMgaXQgZW5vdWdoPyA8LSBtaWdodCBjcmVhdGUgYnVnc1xuICAgIHJlbGF0aW9uczogdGhpcy5yZWxhdGlvbnMuc2xpY2UoKSxcbiAgICBpbnZlcnNlX3JlbGF0aW9uczogdGhpcy5pbnZlcnNlX3JlbGF0aW9ucy5zbGljZSgpLFxuICAgIHNvdXJjZV9vYnNlbHM6IHRoaXMuc291cmNlX29ic2Vscy5zbGljZSgpLFxuICAgIGxhYmVsOiB0aGlzLmxhYmVsXG4gIH07XG4gIC8vIGNvcHkgZWFjaCBhdHRyaWJ1dGVzXG4gIGZvciAodmFyIGF0dHIgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgb2JqLmF0dHJpYnV0ZXNbYXR0cl0gPSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlbDtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuKiBTZWxlY3RvciBpcyBhIHNob3J0bmFtZSBmb3IgdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLlNlbGVjdG9yfVxuKiBvYmplY3QuXG4qIEB0eXBlZGVmIFNlbGVjdG9yXG4qIEBzZWUgU2Ftb3RyYWNlcy5TZWxlY3RvclxuKi9cbi8qKlxuKiBAc3VtbWFyeSBPYmplY3QgdGhhdCBzdG9yZXMgYSBzZWxlY3Rpb24gb2Ygb2JqZWN0c1xuKiBAY2xhc3MgT2JqZWN0IHRoYXQgc3RvcmVzIGEgc2VsZWN0aW9uIG9mIG9iamVjdHNcbiogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiogQGNvbnN0cnVjdG9yXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuKiBAZmlyZXMgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246YWRkXG4qIEBmaXJlcyBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjpyZW1vdmVcbiogQGZpcmVzIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmVtcHR5XG4qIEBkZXNjcmlwdGlvblxuKiBUaGUge0BsaW5rIFNhbW90cmFjZXMuU2VsZWN0b3J8U2VsZWN0b3J9IG9iamVjdFxuKiBpcyBhIEphdmFzY3JpcHQgb2JqZWN0IHRoYXQgc3RvcmVzIGEgc2VsZWN0aW9uIG9mIE9iamVjdHMuXG4qIFRoaXMgT2JqZWN0IHN0b3JlcyBPYmplY3RzIHRoYXQgYXJlIHNlbGVjdGVkIGFuZCBpbmZvcm1zXG4qIHdpZGdldHMgb3Igb3RoZXIgb2JqZWN0cyAodmlhIHRoZVxuKiB0cmlnZ2VyZWQgZXZlbnRzKSB3aGVuIHRoZSBzZWxlY3Rpb24gY2hhbmdlcy5cbiogV2hlbiBmaXJzdCBpbnN0YW5jaWF0ZWQsIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHkuXG4qXG4qIEluIG9yZGVyIHRvIHNlbGVjdCBhbiBvYmplY3QsIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3R8U2VsZWN0b3Ijc2VsZWN0KCl9XG4qIG1ldGhvZCBoYXMgdG8gYmUgY2FsbGVkLlxuKiBTaW1pbGFybHksIGluIG9yZGVyIHRvIHVuc2VsZWN0IGFuIG9iamVjdCwgdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLlNlbGVjdG9yI3Vuc2VsZWN0fFNlbGVjdG9yI3Vuc2VsZWN0KCl9XG4qIG1ldGhvZCBoYXMgdG8gYmUgY2FsbGVkLlxuKiBUaGUgd2hvbGUgc2VsZWN0aW9uIGNhbiBiZSBlbXB0aWVkIGF0IG9uY2Ugd2l0aCB0aGVcbioge0BsaW5rIFNhbW90cmFjZXMuU2VsZWN0b3IjZW1wdHl8U2VsZWN0b3IjZW1wdHkoKX1cbiogbWV0aG9kLlxuKlxuKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIHR5cGUgb2ZcbiogICAgIG9iamVjdCB0byBiZSBzZWxlY3RlZCAoJ09ic2VsJywgJ1RyYWNlJywgJ1RpbWVXaW5kb3cnLCBldGMuKS5cbiogQHBhcmFtIHtzdHJpbmd9IFtzZWxlY3Rpb25fbW9kZT0nc2luZ2xlJ11cbiogICAgIEluICdzaW5nbGUnIG1vZGUsIHRoZSBzZWxlY3Rpb24gY29udGFpbnMgb25lIG9iamVjdCBtYXhpbXVtLlxuKiAgICAgVGhpcyBtZWFucyB0aGF0IGFkZGluZyBhbiBvYmplY3QgdG8gYSBub24tZW1wdHkgc2VsZWN0aW9uXG4qICAgICB3aWxsIHJlcGxhY2UgdGhlIHByZXZpb3VzbHkgc2VsZWN0ZWQgb2JqZWN0IHdpdGggdGhlIG5ldyBvbmUuXG4qICAgICBJbiAnbXVsdGlwbGUnIG1vZGUsIHRoZSBzZWxlY3Rpb24gY2FuIGJlIGV4dGVuZGVkIGFuZCBvYmplY3RzXG4qICAgICBjYW4gYmUgaW5kaXZpZHVhbGx5IGFkZGVkIG9yIHJlbW92ZWQuXG4qIEBwYXJhbSB7RXZlbnRDb25maWd9XHRbZXZlbnRzXVxuKiAgICAgRXZlbnRzIHRvIGxpc3RlbiB0byBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBjYWxsYmFja3MuXG4qL1xudmFyIFNlbGVjdG9yID0gZnVuY3Rpb24odHlwZSwgc2VsZWN0aW9uX21vZGUsIGV2ZW50cykge1xuICAvLyBBZGRpbmcgdGhlIE9ic2VydmFibGUgdHJhaXRcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMsIGV2ZW50cyk7XG4gIHRoaXMubW9kZSA9IHNlbGVjdGlvbl9tb2RlIHx8ICdzaW5nbGUnOyAvLyBvdGhlciBvcHRpb24gaXMgJ211bHRpcGxlJ1xuICB0aGlzLnR5cGUgPSB0eXBlO1xuICB0aGlzLnNlbGVjdGlvbiA9IFtdO1xuICAvLyBUT0RPOiBham91dGVyIGV2ZW50TGlzdGVuZXIgc3VyIFRyYWNlIHNpIHR5cGUgPSBvYnNlbFxuICAvLyAtPiBRdWFuZCBcInRyYWNlOnJlbW92ZTpvYnNlbFwiIC0+IHbDqXJpZmllIHNpIHVuIG9ic2VsIGFcbiAgLy8gw6l0w6kgc3VwcHJpbcOpIGRlIGxhIHPDqWxlY3Rpb24uXG59O1xuXG5TZWxlY3Rvci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAqIE1ldGhvZCB0byBjYWxsIHRvIHNlbGVjdCBhbiBPYmplY3QuXG4gICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAqICAgICBPYmplY3QgdG8gYWRkIHRvIHRoZSBzZWxlY3Rpb25cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246YWRkXG4gICovXG4gIHNlbGVjdDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAodGhpcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5wdXNoKG9iamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uID0gW29iamVjdF07XG4gICAgfVxuICAgIC8qKlxuICAgICogT2JqZWN0IHNlbGVjdGVkIGV2ZW50LlxuICAgICogQGV2ZW50IFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmFkZFxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIGV2ZW50ICg9IFwic2VsZWN0aW9uOmFkZFwiKS5cbiAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhIC0gVGhlIHNlbGVjdGVkIG9iamVjdC5cbiAgICAqL1xuICAgIHRoaXMudHJpZ2dlcignc2VsZWN0aW9uOmFkZCcsIG9iamVjdCk7XG4gIH0sXG4gIC8qKlxuICAqIE1ldGhvZCB0byBlbXB0eSB0aGUgY3VycmVudCBzZWxlY3Rpb24uXG4gICogQGZpcmVzIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmVtcHR5XG4gICovXG4gIGVtcHR5OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IFtdO1xuICAgIC8qKlxuICAgICogT2JqZWN0IHVuc2VsZWN0ZWQgZXZlbnQuXG4gICAgKiBAZXZlbnQgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246ZW1wdHlcbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInNlbGVjdGlvbjplbXB0eVwiKS5cbiAgICAqL1xuICAgIHRoaXMudHJpZ2dlcignc2VsZWN0aW9uOmVtcHR5Jyk7XG4gIH0sXG4gIC8qKlxuICAqIE1ldGhvZCB0aGF0IGNoZWNrcyBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5XG4gICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VsZWN0aW9uIGFuZCBlbXB0eVxuICAqICAgICBhbmQgZmFsc2UgaWYgdGhlIHNlbGVjdGlvbiBpcyBub3QgZW1wdHkuXG4gICovXG4gIGlzX2VtcHR5OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gKHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCk7XG4gIH0sXG4gIC8qKlxuICAqIEdldHMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiBzZWxlY3RlZCBvYmplY3RzXG4gICovXG4gIGdldF9zZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbjtcbiAgfSxcbiAgLyoqXG4gICogTWV0aG9kIHRvIGNhbGwgdG8gcmVtb3ZlIGFuIE9iamVjdCBmcm9tIHRoZSBzZWxlY3Rpb24uXG4gICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAqICAgICBPYmplY3QgdG8gcmVtb3ZlIGZyb20gdGhlIHNlbGVjdGlvblxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjpyZW1vdmVcbiAgKi9cbiAgdW5zZWxlY3Q6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5maWx0ZXIoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgaWYgKGVsID09PSBvYmplY3QpIHtcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghZm91bmQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICogT2JqZWN0IHVuc2VsZWN0ZWQgZXZlbnQuXG4gICAgKiBAZXZlbnQgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246cmVtb3ZlXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgKD0gXCJzZWxlY3Rpb246cmVtb3ZlXCIpLlxuICAgICovXG4gICAgdGhpcy50cmlnZ2VyKCdzZWxlY3Rpb246cmVtb3ZlJywgb2JqZWN0KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgLyoqXG4gICogTWV0aG9kIHRvIGNhbGwgdG8gdG9nZ2xlIHRoZSBzZWxlY3Rpb24gb2YgYW4gT2JqZWN0LlxuICAqIElmIHRoZSBPYmplY3Qgd2FzIHByZXZpb3VzbHkgdW5zZWxlY3RlZCwgaXQgYmVjb21lcyBzZWxlY3RlZC5cbiAgKiBJZiB0aGUgT2JqZWN0IHdhcyBwcmV2aW91c2x5IHNlbGVjdGVkLCBpdCBiZWNvbWVzIHVuc2VsZWN0ZWQuXG4gICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAqICAgIE9iamVjdCB0byB0b2dnbGUgZnJvbSB0aGUgc2VsZWN0aW9uXG4gICovXG4gIHRvZ2dsZTogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgaWYgKCF0aGlzLnVuc2VsZWN0KG9iamVjdCkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Qob2JqZWN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCB8fCB0aGlzLnNlbGVjdGlvblswXSAhPT0gb2JqZWN0KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KG9iamVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVuc2VsZWN0KG9iamVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdG9yO1xuIiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuL0V2ZW50SGFuZGxlci5qc1wiKTtcblxuLyoqXG4qIFRpbWVXaW5kb3cgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5UaW1lV2luZG93fVxuKiBvYmplY3QuXG4qIEB0eXBlZGVmIFRpbWVXaW5kb3dcbiogQHNlZSBTYW1vdHJhY2VzLlRpbWVXaW5kb3dcbiovXG4vKipcbiogQHN1bW1hcnkgT2JqZWN0IHRoYXQgc3RvcmVzIHRoZSBjdXJyZW50IHRpbWUgd2luZG93XG4qIEBjbGFzcyBPYmplY3QgdGhhdCBzdG9yZXMgdGhlIGN1cnJlbnQgdGltZSB3aW5kb3dcbiogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiogQGNvbnN0cnVjdG9yXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuKiBAZGVzY3JpcHRpb25cbiogVGhlIHtAbGluayBTYW1vdHJhY2VzLlRpbWVXaW5kb3d9IG9iamVjdCBpcyBhIEphdmFzY3JpcHQgT2JqZWN0XG4qIHRoYXQgc3RvcmVzIHRoZSBjdXJyZW50IHRpbWUgd2luZG93LlxuKiBUaGlzIE9iamVjdCBzdG9yZXMgYSB0aW1lIHdpbmRvdyBhbmQgaW5mb3JtcyB3aWRnZXRzIG9yIG90aGVyXG4qIG9iamVjdHMgd2hlbiB0aGUgdGltZSB3aW5kb3cgY2hhbmdlcyB2aWEgdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLlRpbWVXaW5kb3cjdHc6dXBkYXRlfHR3OnVwZGF0ZX1cbiogZXZlbnQuXG4qIEEge0BsaW5rIFNhbW90cmFjZXMuVGltZVdpbmRvd3xUaW1lV2luZG93fSBjYW4gYmUgZGVmaW5lZCBpbiB0d28gd2F5czpcbipcbiogMS4gIGJ5IGRlZmluaW5nIGEgbG93ZXIgYW5kIHVwcGVyIGJvdW5kXG4qIDIuICBieSBkZWZpbmluZyBhIHRpbWVyIGFuZCBhIHdpZHRoLlxuKlxuKiBAcGFyYW0ge09iamVjdH0gb3B0XHRPcHRpb24gcGFyYW1ldGVyIHRoYXQgZGVmaW5lcyB0aGUgdGltZVxuKiAgICAgd2luZG93LiBWYXJpYWJsZXMgb3B0LnN0YXJ0IGFuZCBvcHQuZW5kIG11c3RcbiogICAgIGJlIGRlZmluZWQgaWYgdXNpbmcgbG93ZXIgYW5kIHVwcGVyIGJvdW5kIGRlZmluaXRpb24uXG4qICAgICBWYXJpYWJsZXMgb3B0LnRpbWVyIGFuZCBvcHQud2lkdGggbXVzdFxuKiAgICAgYmUgZGVmaW5lZCBpZiB1c2luZyB0aW1lciBhbmQgd2lkdGggZGVmaW5pdGlvbi5cbiogQHBhcmFtIHtOdW1iZXJ9IG9wdC5zdGFydCBTdGFydGluZyB0aW1lIG9mIHRoZSB0aW1lIHdpbmRvdyAobG93ZXIgYm91bmQpLlxuKiBAcGFyYW0ge051bWJlcn0gb3B0LmVuZCBFbmRpbmcgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cgKHVwcGVyIGJvdW5kKS5cbiogQHBhcmFtIHtTYW1vdHJhY2VzLlRpbWVyfSBvcHQudGltZXIgVGltZXIgb2JqZWN0LCB3aGljaCB0aW1lXG4qICAgICBpcyB1c2VkIHRvIGRlZmluZSB0aGUgbWlkZGxlIG9mIHRoZSBjdXJyZW50IHRpbWUgd2luZG93LlxuKiBAcGFyYW0ge051bWJlcn0gb3B0LndpZHRoIFdpZHRoIG9mIHRoZSB0aW1lIHdpbmRvdy5cbipcbiovXG52YXIgVGltZVdpbmRvdyA9IGZ1bmN0aW9uIFRpbWVXaW5kb3cob3B0KSB7XG4gIC8vIEFkZGluZyB0aGUgT2JzZXJ2YWJsZSB0cmFpdFxuICBcInVzZSBzdHJpY3RcIjtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gIGlmIChvcHQuc3RhcnQgIT09IHVuZGVmaW5lZCAmJiBvcHQuZW5kICAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5zdGFydCA9IG9wdC5zdGFydDtcbiAgICB0aGlzLmVuZCA9IG9wdC5lbmQ7XG4gICAgdGhpcy5fX2NhbGN1bGF0ZV93aWR0aCgpO1xuICB9IGVsc2UgaWYgKG9wdC50aW1lciAhPT0gdW5kZWZpbmVkICYmIG9wdC53aWR0aCAgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuc2V0X3dpZHRoKG9wdC53aWR0aCwgb3B0LnRpbWVyLnRpbWUpO1xuICAgIHRoaXMudGltZXIgPSBvcHQudGltZXI7XG4gICAgdGhpcy50aW1lci5vbigndGltZXI6dXBkYXRlJywgdGhpcy5fcHJpdmF0ZV91cGRhdGVUaW1lLmJpbmQodGhpcykpO1xuICAgIHRoaXMudGltZXIub24oJ3RpbWVyOnBsYXk6dXBkYXRlJywgdGhpcy5fcHJpdmF0ZV91cGRhdGVUaW1lLmJpbmQodGhpcykpO1xuICB9IGVsc2Uge1xuICAgIHRocm93KCdTYW1vdHJhY2VzLlRpbWVXaW5kb3cgZXJyb3IuIEFyZ3VtZW50cyBjb3VsZCBub3QgYmUgcGFyc2VkLicpO1xuICB9XG59O1xuXG5UaW1lV2luZG93LnByb3RvdHlwZSA9IHtcblxuICBfX2NhbGN1bGF0ZV93aWR0aDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy53aWR0aCA9IHRoaXMuZW5kIC0gdGhpcy5zdGFydDtcbiAgfSxcbiAgX3ByaXZhdGVfdXBkYXRlVGltZTogZnVuY3Rpb24oZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB0aW1lID0gZS5kYXRhO1xuICAgIHZhciBkZWx0YSA9IHRpbWUgLSAodGhpcy5zdGFydCArIHRoaXMud2lkdGggLyAyKTtcblxuICAgIHRoaXMuc3RhcnQgPSB0aW1lIC0gdGhpcy53aWR0aCAvIDI7XG4gICAgdGhpcy5lbmQgPSB0aW1lICsgdGhpcy53aWR0aCAvIDI7XG4gICAgdGhpcy50cmlnZ2VyKCd0dzp0cmFuc2xhdGUnLCBkZWx0YSk7XG5cbiAgICAvL1x0XHR0aGlzLnNldF93aWR0aCh0aGlzLndpZHRoLHRpbWUpO1xuICB9LFxuICAvKipcbiAgKiBTZXRzIHRoZSBzdGFydCB0aW1lIG9mIHRoZSB0aW1lIHdpbmRvdy5cbiAgKiBAcGFyYW0ge051bWJlcn0gdGltZSBTdGFydGluZyB0aW1lIG9mIHRoZSB0aW1lIHdpbmRvdy5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnVwZGF0ZVxuICAqL1xuICBzZXRfc3RhcnQ6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5zdGFydCAhPT0gdGltZSkge1xuICAgICAgdGhpcy5zdGFydCA9IHRpbWU7XG4gICAgICB0aGlzLl9fY2FsY3VsYXRlX3dpZHRoKCk7XG4gICAgICAvKipcbiAgICAgICogVGltZSB3aW5kb3cgY2hhbmdlIGV2ZW50LlxuICAgICAgKiBAZXZlbnQgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnVwZGF0ZVxuICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInR3OnVwZGF0ZVwiKS5cbiAgICAgKi9cbiAgICAgIHRoaXMudHJpZ2dlcigndHc6dXBkYXRlJyk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgKiBTZXRzIHRoZSBlbmQgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgRW5kaW5nIHRpbWUgb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVXaW5kb3cjdHc6dXBkYXRlXG4gKi9cbiAgc2V0X2VuZDogZnVuY3Rpb24odGltZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmVuZCAhPT0gdGltZSkge1xuICAgICAgdGhpcy5lbmQgPSB0aW1lO1xuICAgICAgdGhpcy5fX2NhbGN1bGF0ZV93aWR0aCgpO1xuICAgICAgdGhpcy50cmlnZ2VyKCd0dzp1cGRhdGUnKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAqIEdldHMgdGhlIHdpZHRoIG9mIHRoZSB0aW1lIHdpbmRvdyAoZHVyYXRpb24gYmV0d2VlbiBzdGFydCBhbmQgZW5kKVxuICAqIEByZXR1cm5zIHtOdW1iZXJ9IFdpZHRoIG9mIHRoZSB0aW1lIHdpbmRvd1xuICAqL1xuICBnZXRfd2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLndpZHRoO1xuICB9LFxuICAvKipcbiAgKiBTZXRzIHRoZSB3aWR0aCBvZiB0aGUgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIE5ldyB3aWR0aCBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtjZW50ZXI9KHN0YXJ0K2VuZCkvMl0gTmV3IGNlbnRlciBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQGZpcmVzIFNhbW90cmFjZXMuVGltZVdpbmRvdyN0dzp1cGRhdGVcbiAgKi9cbiAgc2V0X3dpZHRoOiBmdW5jdGlvbih3aWR0aCwgY2VudGVyKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKGNlbnRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjZW50ZXIgPSB0aGlzLnN0YXJ0ICsgdGhpcy53aWR0aCAvIDI7XG4gICAgfVxuICAgIHRoaXMuc3RhcnQgPSBjZW50ZXIgLSB3aWR0aCAvIDI7XG4gICAgdGhpcy5lbmQgPSBjZW50ZXIgKyB3aWR0aCAvIDI7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMudHJpZ2dlcigndHc6dXBkYXRlJyk7XG4gIH0sXG4gIC8qKlxuICAqIFRyYW5zbGF0ZXMgdGhlIHRpbWUgd2luZG93IHdpdGggYSB0aW1lIGRlbHRhLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YSBUaW1lIGRlbHRhdCB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHRpbWUgd2luZG93LlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVXaW5kb3cjdHc6dHJhbnNsYXRlXG4gICovXG4gIHRyYW5zbGF0ZTogZnVuY3Rpb24oZGVsdGEpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgdGhpcy50aW1lci5zZXQodGhpcy50aW1lci50aW1lICsgZGVsdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXJ0ID0gdGhpcy5zdGFydCArIGRlbHRhO1xuICAgICAgdGhpcy5lbmQgPSB0aGlzLmVuZCArIGRlbHRhO1xuICAgICAgdGhpcy50cmlnZ2VyKCd0dzp0cmFuc2xhdGUnLCBkZWx0YSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgKiBab29tcyB0aGUgdGltZXdpbmRvdyBieSBtdWx0aXBseWluZyB0aGUgY3VycmVudCB3aWR0aFxuICAqIGJ5IHRoZSBnaXZlbiBjb2VmZmljaWVudC4gWm9vbSBpbiBpZiB0aGUgY29lZmZpY2llbnRcbiAgKiBpcyBsZXNzIHRoYW4gMSBhbmQgb3V0IGlmIGl0IGlzIG1vcmUgdGhhbiAxLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBjb2VmIENvZWZmaWNpZW50IG9mIHRoZSB6b29tIHRvIGFwcGx5LlxuICAqL1xuICB6b29tOiBmdW5jdGlvbihjb2VmKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5zZXRfd2lkdGgodGhpcy53aWR0aCAqIGNvZWYpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lV2luZG93O1xuIiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuL0V2ZW50SGFuZGxlci5qc1wiKTtcblxuLyoqXG4qIEBzdW1tYXJ5IE9iamVjdCB0aGF0IHN0b3JlcyB0aGUgY3VycmVudCB0aW1lXG4qIEBjbGFzcyBPYmplY3QgdGhhdCBzdG9yZXMgdGhlIGN1cnJlbnQgdGltZVxuKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuKiBAY29uc3RydWN0b3JcbiogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4qIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnVwZGF0ZVxuKiBAZGVzY3JpcHRpb25cbiogU2Ftb3RyYWNlcy5UaW1lciBpcyBhIEphdmFzY3JpcHQgb2JqZWN0IHRoYXQgc3RvcmVzXG4qIHRoZSBjdXJyZW50IHRpbWUuXG4qIFRoaXMgT2JqZWN0IHN0b3JlcyBhIHRpbWUgYW5kIGluZm9ybXMgd2lkZ2V0cyBvciBvdGhlclxuKiBvYmplY3RzIHdoZW4gdGhlIHRpbWUgY2hhbmdlcy5cbipcbiogQHBhcmFtIHtOdW1iZXJ9IFtpbml0X3RpbWU9MF1cbiogICAgIEluaXRpYWwgdGltZSBvZiB0aGUgdGltZXIgKG9wdGlvbmFsLCBkZWZhdWx0OiAwKS5cbiogQHBhcmFtIHtOdW1iZXJ9IFtwZXJpb2Q9MjAwMF1cbiogICAgIFBlcmRpb2QgKGluIG1zKSBhdCB3aGljaCB0aGUgdGltZXIgd2lsbCB1cGRhdGUgaXRzZWxmIGluXG4qICAgICBcInBsYXlcIiBtb2RlLlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBbdXBkYXRlX2Z1bmN0aW9uXVxuKiAgICAgRnVuY3Rpb24gY2FsbGVkIHRvIHVwZGF0ZSB0aGUgdGltZXIgd2hlbiBpbiBcInBsYXlcIiBtb2RlXG4qICAgICAoZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBvZlxuKiAgICAgPGNvZGU+RGF0ZS5ub3coKTwvY29kZT4gYnkgZGVmYXVsdCkuXG4qL1xuXG52YXIgVGltZXIgPSBmdW5jdGlvbiBUaW1lcihpbml0X3RpbWUsIHBlcmlvZCwgdXBkYXRlX2Z1bmN0aW9uKSB7XG4gIC8vIEFkZGluZyB0aGUgT2JzZXJ2YWJsZSB0cmFpdFxuICBcInVzZSBzdHJpY3RcIjtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gIHRoaXMudGltZSA9IGluaXRfdGltZSB8fCAwO1xuICB0aGlzLnBlcmlvZCA9IHBlcmlvZCB8fCAyMDAwO1xuICB0aGlzLnVwZGF0ZV9mdW5jdGlvbiA9IHVwZGF0ZV9mdW5jdGlvbiB8fCBmdW5jdGlvbigpIHtyZXR1cm4gRGF0ZS5ub3coKTt9O1xuICB0aGlzLmlzX3BsYXlpbmcgPSBmYWxzZTtcbn07XG5cblRpbWVyLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICogU2V0cyB0aGUgVGltZXIgdG8gdGhlIGdpdmVuIHRpbWUuXG4gICogQGZpcmVzIFNhbW90cmFjZXMuVGltZXIjdGltZXI6dXBkYXRlXG4gICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgTmV3IHRpbWVcbiovXG4gIHNldF90aW1lOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5ld190aW1lID0gTnVtYmVyKHRpbWUpO1xuICAgIGlmICh0aGlzLnRpbWUgIT09IG5ld190aW1lKSB7XG4gICAgICB0aGlzLnRpbWUgPSBuZXdfdGltZTtcbiAgICAgIC8qKlxuICAgICAgKiBUaW1lIGNoYW5nZSBldmVudC5cbiAgICAgICogQGV2ZW50IFNhbW90cmFjZXMuVGltZXIjdGltZXI6dXBkYXRlXG4gICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIGV2ZW50ICg9IFwidGltZXI6dXBkYXRlXCIpLlxuKi9cbiAgICAgIHRoaXMudHJpZ2dlcigndGltZXI6dXBkYXRlJywgdGhpcy50aW1lKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAqIFNldHMgdGhlIFRpbWVyIHRvIHRoZSBnaXZlbiB0aW1lLlxuICAqIEBkZXByZWNhdGVkIFVzZSB7QGxpbmsgU2Ftb3RyYWNlcy5UaW1lci5zZXRfdGltZXxzZXRfdGltZX0gaW5zdGVhZC5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lciN0aW1lcjp1cGRhdGVcbiAgKiBAcGFyYW0ge051bWJlcn0gdGltZSBOZXcgdGltZVxuKi9cbiAgc2V0OiBmdW5jdGlvbih0KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHJldHVybiB0aGlzLnNldF90aW1lKHQpOyB9LFxuICAvKipcbiAgKiBHZXRzIHRoZSBjdXJyZW50IHRpbWUgb2YgdGhlIFRpbWVyXG4gICogQHJldHVybnMge051bWJlcn0gQ3VycmVudCB0aW1lIG9mIHRoZSBUaW1lci5cbiovXG4gIGdldF90aW1lOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy50aW1lO1xuICB9LFxuICAvKipcbiAgKiBTZXRzIG9yIGdldCB0aGUgVGltZXIncyBjdXJyZW50IHRpbWUuXG4gICogSWYgbm8gcGFyYW1ldGVyIGlzIGdpdmVuLCB0aGUgY3VycmVudCB0aW1lIGlzIHJldHVybmVkLlxuICAqIE90aGVyd2lzZSwgc2V0cyB0aGUgVGltZXIgdG8gdGhlIGdpdmVudCB0aW1lLlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnVwZGF0ZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZV0gTmV3IHRpbWVcbiovXG4gIHRpbWU6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGltZSkge1xuICAgICAgdmFyIG5ld190aW1lID0gTnVtYmVyKHRpbWUpO1xuICAgICAgaWYgKHRoaXMudGltZSAhPT0gbmV3X3RpbWUpIHtcbiAgICAgICAgdGhpcy50aW1lID0gbmV3X3RpbWU7XG4gICAgICAgIHRoaXMudHJpZ2dlcigndGltZXI6dXBkYXRlJywgdGhpcy50aW1lKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGltZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICogU3RhcnRzIHRoZSBwbGF5IG1vZGU6IHRoZSB0aW1lciB3aWxsIGJlIHVwZGF0ZWRcbiAgKiBhY2NvcmRpbmcgdG8gdGhlIHVwZGF0ZV9mdW5jdGlvbiBldmVyeSBwZXJpb2RcbiAgKiBhcyBzcGVjaWZpZWQgYXQgdGhlIGluaXRpYWxpc2F0aW9uIG9mIHRoZSBUaW1lci5cbiAgKiBAdG9kbyBTUEVDSUZZIFdBWVMgVE8gQ0hBTkdFIFBFUklPRCBBTkQgVVBEQVRFX0ZVTkNUSU9uXG4qL1xuICBwbGF5OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvKnZhciB1cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRpbWUgPSB0aGlzLnVwZGF0ZV9mdW5jdGlvbih0aGlzLnRpbWUpO1xuICAgIC8qKlxuICAgICogVGltZSBjaGFuZ2UgZXZlbnQgKGFjdHVhbGlzaW5nIHRpbWUgd2hlbiBwbGF5aW5nKVxuICAgICogQGV2ZW50IFNhbW90cmFjZXMuVGltZXIjdGltZXI6cGxheTp1cGRhdGVcbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZVxuICAgICogICAgIC0gVGhlIHR5cGUgb2YgdGhlIGV2ZW50ICg9IFwidGltZXI6cGxheTp1cGRhdGVcIikuXG4gICAgKi9cbiAgICAvKnRoaXMudHJpZ2dlcigndGltZXI6cGxheTp1cGRhdGUnLHRoaXMudGltZSk7XG4gICAgfTtcblx0XHQqL1xuICAgIHRoaXMuaW50ZXJ2YWxfaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy51cGRhdGVfZnVuY3Rpb24uYmluZCh0aGlzKSwgdGhpcy5wZXJpb2QpO1xuICAgIHRoaXMuaXNfcGxheWluZyA9IHRydWU7XG4gICAgdGhpcy50cmlnZ2VyKCd0aW1lcjpwbGF5JywgdGhpcy50aW1lKTtcbiAgfSxcbiAgLyoqXG4gICogU3RvcHMgdGhlIHBsYXkgbW9kZS5cbiovXG4gIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsX2lkKTtcbiAgICB0aGlzLmlzX3BsYXlpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnRyaWdnZXIoJ3RpbWVyOnBhdXNlJywgdGhpcy50aW1lKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9jb3JlL0V2ZW50SGFuZGxlci5qc1wiKTtcbnZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgT2JzZWwgPSByZXF1aXJlKFwiLi9jb3JlL09ic2VsLmpzXCIpO1xudmFyIFRpbWVXaW5kb3cgPSByZXF1aXJlKFwiLi9jb3JlL1RpbWVXaW5kb3cuanNcIik7XG52YXIgVGltZXIgPSByZXF1aXJlKFwiLi9jb3JlL1RpbWVyLmpzXCIpO1xudmFyIFNlbGVjdG9yID0gcmVxdWlyZShcIi4vY29yZS9TZWxlY3Rvci5qc1wiKTtcbnZhciBMb2NhbFRyYWNlID0gcmVxdWlyZShcIi4vY29yZS9Mb2NhbFRyYWNlLmpzXCIpO1xudmFyIEt0YnMgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuanNcIik7XG52YXIgS3Ric01vZGVsID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLk1vZGVsLmpzXCIpO1xudmFyIEt0YnNCYXNlID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLkJhc2UuanNcIik7XG52YXIgS3Ric1RyYWNlID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLlRyYWNlLmpzXCIpO1xuXG52YXIgSW1wb3J0VHJhY2UgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0ltcG9ydFRyYWNlLmpzXCIpO1xudmFyIEludGVydmFsVGltZUZvcm0gPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0ludGVydmFsVGltZUZvcm0uanNcIik7XG52YXIgTGlzdEJhc2VzID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9MaXN0QmFzZXMuanNcIik7XG52YXIgTGlzdE1vZGVsSW5CYXNlcyA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvTGlzdE1vZGVsSW5CYXNlcy5qc1wiKTtcbnZhciBMaXN0VHJhY2VzSW5CYXNlcyA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvTGlzdFRyYWNlc0luQmFzZXMuanNcIik7XG52YXIgT2JzZWxJbnNwZWN0b3IgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL09ic2VsSW5zcGVjdG9yLmpzXCIpO1xudmFyIE9ic2VsVHlwZUluc3BlY3RvciA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvT2JzZWxUeXBlSW5zcGVjdG9yLmpzXCIpO1xudmFyIFJlYWRhYmxlVGltZUZvcm0gPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1JlYWRhYmxlVGltZUZvcm0uanNcIik7XG52YXIgVGltZUZvcm0gPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RpbWVGb3JtLmpzXCIpO1xudmFyIFRpbWVTbGlkZXIgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RpbWVTbGlkZXIuanNcIik7XG52YXIgVHJhY2VEaXNwbGF5SWNvbnMgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheUljb25zLmpzXCIpO1xudmFyIFRyYWNlRGlzcGxheUljb25zRml4ID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29uc0ZpeC5qc1wiKTtcbnZhciBUcmFjZURpc3BsYXlJY29uc1pvb20gPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheUljb25zWm9vbS5qc1wiKTtcbnZhciBUcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzLmpzXCIpO1xudmFyIFRyYWNlRGlzcGxheVRleHQgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheVRleHQuanNcIik7XG52YXIgVHJhY2VEaXNwbGF5Wm9vbUNvbnRleHQgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheVpvb21Db250ZXh0LmpzXCIpO1xudmFyIERpc3BsYXlNb2RlbCA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvRGlzcGxheU1vZGVsLmpzXCIpO1xudmFyIFdpbmRvd1NjYWxlID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9XaW5kb3dTY2FsZS5qc1wiKTtcbnZhciBXaW5kb3dTY2FsZUZpeCA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvV2luZG93U2NhbGVGaXguanNcIik7XG52YXIgV2luZG93U2xpZGVyID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9XaW5kb3dTbGlkZXIuanNcIik7XG5cbnZhciBTYW1vdHJhY2VzID0ge1xuICBPYnNlbDogT2JzZWwsXG4gIFRpbWVXaW5kb3c6IFRpbWVXaW5kb3csXG4gIFRpbWVyOiBUaW1lcixcbiAgU2VsZWN0b3I6IFNlbGVjdG9yLFxuICBFdmVudEhhbmRsZXI6IEV2ZW50SGFuZGxlcixcbiAgTG9jYWxUcmFjZTogTG9jYWxUcmFjZSxcbiAgS3Riczoge1xuICAgIEt0YnM6IEt0YnMsXG4gICAgUmVzb3VyY2U6IEtUQlNSZXNvdXJjZSxcbiAgICBNb2RlbDogS3Ric01vZGVsLFxuICAgIEJhc2U6IEt0YnNCYXNlLFxuICAgIFRyYWNlOiBLdGJzVHJhY2UsXG4gIH0sXG4gIFVpOiB7XG4gICAgV2lkZ2V0czoge1xuICAgICAgSW1wb3J0VHJhY2U6IEltcG9ydFRyYWNlLFxuICAgICAgSW50ZXJ2YWxUaW1lRm9ybTogSW50ZXJ2YWxUaW1lRm9ybSxcbiAgICAgIE9ic2VsSW5zcGVjdG9yOiBPYnNlbEluc3BlY3RvcixcbiAgICAgIE9ic2VsVHlwZUluc3BlY3RvcjogT2JzZWxUeXBlSW5zcGVjdG9yLFxuICAgICAgUmVhZGFibGVUaW1lRm9ybTogUmVhZGFibGVUaW1lRm9ybSxcbiAgICAgIFRpbWVGb3JtOiBUaW1lRm9ybSxcbiAgICAgIFRpbWVTbGlkZXI6IFRpbWVTbGlkZXIsXG4gICAgICBUcmFjZURpc3BsYXlJY29uczogVHJhY2VEaXNwbGF5SWNvbnMsXG4gICAgICBUcmFjZURpc3BsYXlJY29uc0ZpeDogVHJhY2VEaXNwbGF5SWNvbnNGaXgsXG4gICAgICBUcmFjZURpc3BsYXlJY29uc1pvb206IFRyYWNlRGlzcGxheUljb25zWm9vbSxcbiAgICAgIFRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXM6IFRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXMsXG4gICAgICBUcmFjZURpc3BsYXlUZXh0OiBUcmFjZURpc3BsYXlUZXh0LFxuICAgICAgVHJhY2VEaXNwbGF5Wm9vbUNvbnRleHQ6IFRyYWNlRGlzcGxheVpvb21Db250ZXh0LFxuICAgICAgRGlzcGxheU1vZGVsOiBEaXNwbGF5TW9kZWwsXG4gICAgICBXaW5kb3dTY2FsZTogV2luZG93U2NhbGUsXG4gICAgICBXaW5kb3dTY2FsZUZpeDogV2luZG93U2NhbGVGaXgsXG4gICAgICBXaW5kb3dTbGlkZXI6IFdpbmRvd1NsaWRlcixcbiAgICAgIEt0YnM6IHtcbiAgICAgICAgTGlzdEJhc2VzOiBMaXN0QmFzZXMsXG4gICAgICAgIExpc3RNb2RlbEluQmFzZXM6IExpc3RNb2RlbEluQmFzZXMsXG4gICAgICAgIExpc3RUcmFjZXNJbkJhc2VzOiBMaXN0VHJhY2VzSW5CYXNlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTYW1vdHJhY2VzO1xuIl19
