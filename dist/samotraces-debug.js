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
     this.data = model.list_Types_Obsles;
     this.draw();


};

DisplayModel.prototype = {
  init_DOM: function() {
    "use strict";
    var div_elmt = d3.select(this.element);
    this.div_elmt = d3.select(this.element);
    this.svg = div_elmt.append('svg');
    //this.svg = div_elmt.append('svg').attr('height', '10px');
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
    if (this.data.length !== 0){
    var images = this.svg.selectAll("circle,image,rect")
      .data(this.data, function(d) {
        return d.id;
      })
      .enter()
      .append("image");



    var that = this;

    var images_att =  images.attr('class', 'Samotraces-obsel')
      .attr('y', this.options.y_Img)
      .attr('x', 17)
      .attr('width', function(){ return (that.getValueAttributStyle(this.__data__.type,'width')); })
      .attr('height', function(){ return (that.getValueAttributStyle(this.__data__.type,'height'));})
			.attr('xlink:href', function(){ return (that.getValueAttributStyle(this.__data__.type,'icon')); });
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
    }
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
/*    this.form.input_label = document.createElement('input');
    this.form.input_label.size = 20;
    this.form.text2 = document.createTextNode(' label: ');*/
    this.form.button = document.createElement('button');
    $(this.form.button).append('create');

    $(this.element).append(this.form.text1);
    $(this.element).append(this.form.input_id);
    //$(this.element).append(this.form.text2);
    //$(this.element).append(this.form.input_label);
    $(this.element).append(this.form.button);

    $(this.form.button).click(this.create_trace.bind(this));

  },
  create_trace: function(e) {
    if ($(this.form.input_id).val() !== "") {
      console.log("Creating a new trace...");
      this.base.create_model($(this.form.input_id).val());
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
    this.form.input_model = document.createElement('input');
    this.form.input_model.size = 20;
    this.form.text3 = document.createTextNode(' MODEL URI: ');
    this.form.button = document.createElement('button');
    $(this.form.button).append('create');

    $(this.element).append(this.form.text1);
    $(this.element).append(this.form.input_id);
    $(this.element).append(this.form.text2);
    $(this.element).append(this.form.input_label);
    $(this.element).append(this.form.text3);
    $(this.element).append(this.form.input_model);
    $(this.element).append(this.form.button);

    $(this.form.button).click(this.create_trace.bind(this));

  },
  create_trace: function(e) {
    if ($(this.form.input_id).val() !== "") {
      console.log("Creating a new trace...");
      this.base.create_stored_trace($(this.form.input_id).val(), $(this.form.input_model).val(), null, null, $(this.form.input_label).val());
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
  this.data = this.trace.obsel_list;
  //this.data = this.trace.list_obsels();


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
    var that = this;

    this.d3Obsels()
    .attr('x', this.options.x)
    .attr('y', function(){ return (that.getValueAttributStyle(this.__data__.type,'y')); });
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
    this.d3Obsels()
    .exit()
    .remove();
    this.d3Obsels()
    .enter()
    .append('image')
    .attr('class', 'Samotraces-obsel')
    .attr('x', this.options.x)
    .attr('y', function(){ return (that.getValueAttributStyle(this.__data__.type,'y')); })
    .attr('width', function(){ return (that.getValueAttributStyle(this.__data__.type,'width')); })
    .attr('height', function(){ return (that.getValueAttributStyle(this.__data__.type,'height')); })
    .attr('xlink:href', function(){ return (that.getValueAttributStyle(this.__data__.type,'icon')); });
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
    var that = this;

    var sel = this.d3Obsels()
			.filter(function(o) {
  //				console.log('data:id,obsel_edit_id',id,obs.get_id(),id == obs.get_id());
  return o.get_id() == obs.get_id();
			})
			.datum(obs)
			.attr('x', this.options.x)
			.attr('y',  function(){ return (that.getValueAttributStyle(this.__data__.type,'y')); })
			.attr('width', function(){ return (that.getValueAttributStyle(this.__data__.type,'width')); })
			.attr('height', function(){ return (that.getValueAttributStyle(this.__data__.type,'height'));})
			.attr('xlink:href', function(){ return (that.getValueAttributStyle(this.__data__.type,'icon')); });
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

    this.d3Obsels()
      .exit()
      .remove();
      this.d3Obsels()
      .enter()
      .append('image')
      .attr('class', 'Samotraces-obsel')
      .attr('x', this.options.x)
      .attr('y', function(){ return (that.getValueAttributStyle(this.__data__.type,'y')); })
      .attr('width', function(){ return (that.getValueAttributStyle(this.__data__.type,'width')); })
      .attr('height', function(){ return (that.getValueAttributStyle(this.__data__.type,'height')); })
      .attr('xlink:href', function(){ return (that.getValueAttributStyle(this.__data__.type,'icon')); });
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
    var that = this;
    this.d3Obsels()
    .attr('x', this.options.x)
    .attr('y', function(){ return (that.getValueAttributStyle(this.__data__.type,'y')); });

    var f = this.element.getElementsByClassName("brush");
    f[0].parentNode.removeChild(f[0]);
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

    this.d3Obsels()
    .exit()
    .remove();
    this.d3Obsels()
    .enter()
    .append('image')
    .attr('class', 'Samotraces-obsel')
    .attr('x', this.options.x)
    .attr('y', function(){ return (that.getValueAttributStyle(this.__data__.type,'y')); })
    .attr('width', function(){ return (that.getValueAttributStyle(this.__data__.type,'width')); })
    .attr('height', function(){ return (that.getValueAttributStyle(this.__data__.type,'height')); })
    .attr('xlink:href', function(){ return (that.getValueAttributStyle(this.__data__.type,'icon')); });
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
    var that = this;

    this.d3Obsels()
    .attr('x', this.options.x)
    .attr('y', function(){ return (that.getValueAttributStyle(this.__data__.type,'y')); });
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
  function getValueAttributStyle  (type,attribut) {
    if (this.stylesheet[type]) {
          if ((this.stylesheet[type][attribut])&&(this.stylesheet[type][attribut] !==""))
              {return this.stylesheet[type][attribut];}
          else
            {return this.stylesheet['default'][attribut];}
    } else {
      return this.stylesheet['default'][attribut];
    }
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
    this.getValueAttributStyle = getValueAttributStyle;
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
  this.attributes = {};
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
  list_models: function() {
    return this.models;
  },
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
    new_trace.hasModel = (model === undefined  || model ===  null)?"http://liris.cnrs.fr/silex/2011/simple-trace-model":model;
    new_trace.origin = (origin === undefined || origin ===  null )?"1970-01-01T00:00:00Z":origin;
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
  * Create a stored trace in the kTBS.
  * Returns a Promise with the new created base as a parameter if the creation succeed.
  * @param id {String} ID of the created trace
  * @param [model] {Model} Model of the trace
  * @param [origin] {Origin} Origin of the trace
  * @param [default_subject] {String} Default subject of the trace
  * @param [label] {String} Label of the trace 
  */
  create_trace: function(id, model, origin, default_subject, label){
    
    // Setting the attributes of the trace.
    var new_trace = {
      "@context": "http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
      "@type":  "StoredTrace",
      "@id":    id + "/"
    };
    new_trace.hasModel = (model === undefined  || model ===  null)?"http://liris.cnrs.fr/silex/2011/simple-trace-model":model;
    new_trace.origin = (origin === undefined || origin ===  null )?"1970-01-01T00:00:00Z":origin;
    if (default_subject !== undefined) new_trace.default_subject = default_subject;
    if (label !== undefined) new_trace.label = label;
    
    // Put the `Base` object in temp var `that`, for later use.
    var that = this;
    
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: that.uri,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(new_trace),
          success: function(){
            resolve(new Samotraces.Ktbs.Base(that.uri));
          },  
          error: function(jqXHR, textStatus, error) {
            console.log('query error');
            console.log([jqXHR, textStatus, error]);
            reject([jqXHR, textStatus, error]);
          }
      });
    });
  },
  
  /**
  * Change the attributes of the Base. Add or change the attributes passed in parameter.
  * Example of attributes :
  * attributes = [ [attributes_name_1,attribute_value_1], [attribute_name_2,attribute_value_2], ...]; 
  *
  * Returns a Promise with the base as a parameter if the modification succeed.
  * @param attributes {Array} Array of Array, with the name of the attribute in the 1st position, the value of the parameter in the 2nd position.
  */
  modify_attributes: function( attributes ){
    var that = this;
    return new Promise(function(resolve, reject) {
      
      that.force_state_refresh( {'_on_state_refresh_': true} , function(){
        
        var old_attributes = that.attributes;
        for(var i = 0; i < attributes.length; i++){
          old_attributes[attributes[i][0]] = attributes[i][1];
        }
        var modeldata = JSON.stringify(old_attributes);
        
        var etag = that.etag;
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', that.uri, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('If-Match', etag);
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if(xhr.status === 200) {
              resolve(new Samotraces.Ktbs.Base(that.uri, that.id));
            } else {
              reject(xhr);
            }
          }
        };
        xhr.onerror = function() {
          reject(Error('There was a network error.'));
        };
        xhr.send(modeldata);
      
      } );
    });
    
  },  

  /**
  * Create a TraceModel in the KTBS. 
  * Returns a Promise, with the created TraceModel as a parameter.
  * @param id {String} ID of the created TraceModel.
  * @param [label] {String} Label of the TraceModel.
  */
  create_model: function(id, label) {
    var doc = {
      '@context': 'http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context',
      '@graph': [{
        '@id': id,
        'label':label,
        '@type': 'TraceModel',
        'inBase': './',
        'hasUnit': 'millisecond'
      }]
    };
    var new_model_data = JSON.stringify(doc);
    var that = this;
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: that.uri,
        type: 'POST',
        contentType: 'application/json',
        data: new_model_data,
        success: function(){
          that.force_state_refresh(
            null,
            resolve(new Samotraces.Ktbs.Model(that.uri + id )),
            null  
          );
        },
        error: function(jqXHR, textStatus, error) {
          console.log('query error');
          console.log([jqXHR, textStatus, error]);
          reject([jqXHR, textStatus, error]);
        }
      });
    });
  },



  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  create_computed_trace: function(id, method, parameters, sources, label) {},
  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  //create_model: function(id, parents, label) {},
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
    this._check_change_('attributes', data, 'base:attrSet');
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
  this.force_state_refresh();

};

Model.prototype = {

  _on_state_refresh_: function(data) {
    var etag = this.get_etag();
    this.trigger('Model:get');
    this.list_Types_Obsles = this.list_obsels(data["@graph"]);
  },
  list_obsels: function(data) {
    ListeObselType = [];
    var M = this;
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

      if (o.id === ident)   {
        Att = o.attributes
      }

    }
    )
    return Att;
  },

  put_model: function(modeldata) {
    this.force_state_refresh();
    var that = this;
    return new Promise(function(resolve, reject) {
      that.on ('Model:get', function(){
       var etag = that.etag;

    // PUT
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('If-Match', etag);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 200) {
          console.log('OKOKOK');
          resolve(new Samotraces.Ktbs.Model(that.id));
        } else {
          reject(xhr);
        }
      }
    };
    xhr.onerror = function() {
      reject(Error('There was a network error.'));
    };
    xhr.send(modeldata);

  })
  });
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
   * @summary Returns the URI of the Resource.
   * @memberof Samotraces.KTBS.Resource.prototype
   * @returns {String} Resource URI.
   */
function get_etag() { return this.etag; }
    /**
  	 * @summary Forces the Resource to synchronise with the KTBS.
  	 * @memberof Samotraces.KTBS.Resource.prototype
     * @param {Object} options 
     *  'options._on_state_refresh_': true|false
     *   enable or disable the old behavior of calling _on_state_refresh_ on the resource after synchronise completes
  	 * @description
  	 * Forces the Resource to synchronise with the KTBS.
  	 * This method triggers a Ajax query that will
  	 * trigger the _on_state_refresh_ method of the Resource
  	 * on success.
  	 */
  function force_state_refresh(options, success, reject) {
    
    success = success || function () {};
    reject = reject || function () {};
    options = options || {'_on_state_refresh_': true}; // For backward compatibility

    console.log("TESTEST");

    var url = this.uri;
    var trc = this ;
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      error: function(XHR, textStatus, errorThrown) {

        if (XHR.status === '401') {
          console.log (XHR.getAllResponseHeaders());
          var Link = XHR.getResponseHeader('Link');
          var D = Link.split (',');
          for (var i = 0;i < D.length;i++)          {
            var SousD = D[i].split(';');
            var link;
            var URLSuccess;
            if (SousD[1] === " rel=oauth_resource_server")            {
              link = SousD[0].substr(1, SousD[0].length - 2);
            }
            if (SousD[1] === " rel=successful_login_redirect")            {
              URLSuccess = SousD[0].substr(2, SousD[0].length - 3);
            }
          }
          window.open (link) ;
        }
        reject(XHR);
      },
      success: function (data, textStatus, xhr){
        trc.etag = xhr.getResponseHeader('ETag');
        trc.trigger('getetag');
        if (options._on_state_refresh_) {
          trc._on_state_refresh_(data);
        }
        success(data);
      }
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
    this.get_etag = get_etag;
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
  get_base: function() {
    "use strict";
    return this.getAbsoluteURLFromRlative(this.get_uri(),this.base_uri);
  },
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

    if (dataRecu.obsels) {
      this._on_refresh_obsel_list_group(dataRecu.obsels, i, end);
    }
    else {
      this._on_refresh_obsel_list_group(dataRecu, i, end);
    }


  },
  _on_refresh_obsel_list_group: function(dataRecu, i, end) {
    "use strict";
    var count = 0;
    var d = dataRecu.length ;
    var dataToDraw = dataRecu.slice (i, end);
    console.log ('_on_refresh_obsel_list_group');
      for (var j=0 ;  j < dataToDraw.length; j++){
        this._parse_get_obsel_(dataToDraw[j]);
        if (j === dataToDraw.length -1){
          this.trigger('trace:updateT');
          var i = Number(i) + dataToDraw.length + Number(1);
          var end = (Number(i) + Number(100) > d)?dataRecu.length : Number(i) + Number(100)
          if (i <= d)  {
              this._on_refresh_obsel_list_group(dataRecu, i, end);
            } else {
              this.trigger('trace:updateCompleted');
            }
        }
      }
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
    this._check_change_('base_uri', data.inBase, 'trace:base');
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

  /**
  * Uploads an array of obsels to the trace.
  * @param  {Array} obsels And array of obsel to post on the trace.
  * @returns A Promise.
  */
  create_obsels: function(obsels){
    
    var new_obsels_data = JSON.stringify(obsels);
    var that = this;
    
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: that.uri,
        type: 'POST',
        contentType: 'application/json',
        data: new_obsels_data,
        success: function(){
           resolve("obsels upload");
        },
        error: function(jqXHR, textStatus, error) {
          console.log('query error');
          console.log([jqXHR, textStatus, error]);
          reject([jqXHR, textStatus, error]);
        }
      });
    });
    
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVUkvV2lkZ2V0cy9EaXNwbGF5TW9kZWwuanMiLCJzcmMvVUkvV2lkZ2V0cy9JbXBvcnRUcmFjZS5qcyIsInNyYy9VSS9XaWRnZXRzL0ludGVydmFsVGltZUZvcm0uanMiLCJzcmMvVUkvV2lkZ2V0cy9MaXN0QmFzZXMuanMiLCJzcmMvVUkvV2lkZ2V0cy9MaXN0TW9kZWxJbkJhc2VzLmpzIiwic3JjL1VJL1dpZGdldHMvTGlzdFRyYWNlc0luQmFzZXMuanMiLCJzcmMvVUkvV2lkZ2V0cy9PYnNlbEluc3BlY3Rvci5qcyIsInNyYy9VSS9XaWRnZXRzL09ic2VsVHlwZUluc3BlY3Rvci5qcyIsInNyYy9VSS9XaWRnZXRzL1JlYWRhYmxlVGltZUZvcm0uanMiLCJzcmMvVUkvV2lkZ2V0cy9UaW1lRm9ybS5qcyIsInNyYy9VSS9XaWRnZXRzL1RpbWVTbGlkZXIuanMiLCJzcmMvVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29ucy5qcyIsInNyYy9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheUljb25zRml4LmpzIiwic3JjL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5SWNvbnNab29tLmpzIiwic3JjL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcy5qcyIsInNyYy9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheVRleHQuanMiLCJzcmMvVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlab29tQ29udGV4dC5qcyIsInNyYy9VSS9XaWRnZXRzL1dpZGdldC5qcyIsInNyYy9VSS9XaWRnZXRzL1dpbmRvd1NjYWxlLmpzIiwic3JjL1VJL1dpZGdldHMvV2luZG93U2NhbGVGaXguanMiLCJzcmMvVUkvV2lkZ2V0cy9XaW5kb3dTbGlkZXIuanMiLCJzcmMvY29yZS9FdmVudEhhbmRsZXIuanMiLCJzcmMvY29yZS9LVEJTLkJhc2UuanMiLCJzcmMvY29yZS9LVEJTLk1vZGVsLmpzIiwic3JjL2NvcmUvS1RCUy5PYnNlbC5qcyIsInNyYy9jb3JlL0tUQlMuUmVzb3VyY2UuanMiLCJzcmMvY29yZS9LVEJTLlRyYWNlLmpzIiwic3JjL2NvcmUvS1RCUy5qcyIsInNyYy9jb3JlL0xvY2FsVHJhY2UuanMiLCJzcmMvY29yZS9PYnNlbC5qcyIsInNyYy9jb3JlL1NlbGVjdG9yLmpzIiwic3JjL2NvcmUvVGltZVdpbmRvdy5qcyIsInNyYy9jb3JlL1RpbWVyLmpzIiwic3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN09BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgZGlzcGxheWluZyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbFxuICogQGNsYXNzIFdpZGdldCBmb3IgaW1wb3J0aW5nIGEgdHJhY2UgZnJvbSBhIENTViBmaWxlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm58RmF0bWEgRGVyYmVsXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAc2VlIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5CYXNpYy5JbXBvcnRUcmFjZVxuICogQHRvZG8gQVRURU5USU9OIGNvZGUgcXVpIHZpZW50IGQnYWlsbGV1cnMgIVxuICogQGRlc2NyaXB0aW9uIG5vIGRlc2NyaXB0aW9uXG4gKiBAcGFyYW0ge29iamVjdH1cdGh0bWxFbGVtZW50XG4gKiAgICAgVGhlIEhUTUwgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgd2lkZ2V0XG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVHJhY2V9IHRyYWNlXG4gKiAgICAgVHJhY2Ugb2JqZWN0IGluIHdoaWNoIHRoZSBvYnNlbHMgd2lsbCBiZSBpbXBvcnRlZC5cbiAqL1xuXG52YXIgRGlzcGxheU1vZGVsID0gZnVuY3Rpb24oaHRtbEVsZW1lbnQsIG1vZGVsLCBvcHRpb25zKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAvL29wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sRWxlbWVudCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VNb2RlbCcpO1xuICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIHRoaXMubW9kZWwub24oJ01vZGVsOkRyYXdfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdmFyIHRoaXNfd2lkZ2V0ID0gdGhpcztcbiAgdGhpcy5tb2RlbC5vbignTW9kZWw6bGlzdGVUeXBlJywgZnVuY3Rpb24oZSkge1xuICAgIHRoaXNfd2lkZ2V0LmRhdGEgPSBlLmRhdGE7XG4gICAgdGhpc193aWRnZXQuZHJhdygpO1xuXG4gIH0pO1xuXG5cbiAgdmFyIGJpbmRfZnVuY3Rpb24gPSBmdW5jdGlvbih2YWxfb3JfZnVuKSB7XG4gICAgaWYgKHZhbF9vcl9mdW4gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW4uYmluZCh0aGlzX3dpZGdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWxfb3JfZnVuO1xuICAgIH1cbiAgfTtcbiAgdmFyIHggPSAwO1xuICB2YXIgeDEgPSAxNjtcbiAgdGhpcy5vcHRpb25zID0ge307XG4gIHRoaXMub3B0aW9ucy55X0ltZyA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy54IHx8IGZ1bmN0aW9uKCkge1xuICAgIHggPSB4ICsgMTY7XG4gICAgcmV0dXJuIHg7XG4gIH0pO1xuICB0aGlzLm9wdGlvbnMueV90ZXh0ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnggfHwgZnVuY3Rpb24oKSB7XG4gICAgeDEgPSB4MSArIDE2O1xuICAgIHJldHVybiB4MTtcbiAgfSk7XG4gIC8vdGhpcy5vcHRpb25zLnkgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueSB8fCAxNyk7XG4gIC8vdGhpcy5vcHRpb25zLndpZHRoID0gYmluZF9mdW5jdGlvbihvcHRpb25zLndpZHRoIHx8IDE2KTtcbiAgLy90aGlzLm9wdGlvbnMuaGVpZ2h0ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLmhlaWdodCB8fCAxNik7XG4gIC8vdGhpcy5vcHRpb25zLnVybCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy51cmwgfHwgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBRzdBQUFCdXdCSG5VNE5RQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUtzU1VSQlZEaU5yWk5MYUZOcEZNZC8zM2Z2VGE1dFlwdXEweWF0Rld1Z1JoRVh3OUF1aEpFWkJDa2lxSldDSUVycnhwMjQxQzZMNjY1ME0vV0Jvd3Vub3lDRENqS3JHWVowSWJpd3hrZFViR3lhUG1nU204ZDlmMjVNYlhVbHpIOTV6di84T09kd2psQktzVmFqVTFrRXRKaWF2TkJzYUtjQnFxNS8zZktEU3dyS1kzM0pkWDdSQUl4T1pRR00zYkhJeW1DeVBaaFpxVDhwMmQ0c1FHdFk3K3lPYnZoeE1qc3ZwNHVWS09BMlFFSXB4ZWhVRmwySXZ1RlVaM3JaY3UvKzlYN1JXcWc3Snh3L1FBRmhUZExSRkpvWTZONFNhek9ObzFjenMvMmVVbE5qZlVuMFJpc25lK1BwOXl2MThUdlp3cmw5aVZiMkoySkVRaG9LS05rZTZVSjU1TGZNQjRhU0hlTW5lK1BwYXkveUFrQmNUTDltYTdOcDdZdTMvbjFsT2pkUTh3TE83OTNHemxnekZkY2pZdWpvVXBBdDE3ajhMSWZqQjV6ZHZmWEJ2M09sWDNOVnk1U0FPSlZLaFA5NE0yOVVYQjhGRkdvV0U4OW51ZlRrSFE5bkZsRUtlalp1b0xlMWlZcnI4K2ZiZWU5VUtoRUdoQjZTWXJCb3VkUEx0bnNBUUNuRjc2OEtxMXYyQXhBQzZsN0FzdVVDc0dTNWg0dVdPeDJTWWxCcVFveVVIVy9POWdPKzFpOWRiZnljaUtHQS93b2wzcFRyQU5oK1FObng1alFoUnVRM1ZaKzFaMU9VZzkyYmlaa0cvK1NMM0h1N2dQZlZ6UUJJWDZtSmxwQWVEMnZyV2RzM210aCt3T3RTbFVjelMxUmRmelVYMWlRdElUM3VLeldoTzRHYWpKbkduYzJtY2YrajR4MXVtSjR1VlNoVWJSU3dVSFBXd2R2Q3h1T1lhUnh3QWpVcEFYVWprN2VQOWJUckVVTmJOZjMwUTVUaFhWMGM2V2tuR3ZvU2p4Z2F4M2UwdXpjeWVSdFFjcXd2U2E1cW1hWXVCNGFTSGVNTmlFSmdhaEo5eldRUlEyTW8yVEZ1Nm5JZ1Y3WE1kWmQ0OCtWYy8zQ3FNMzBtMVhYM3djeGk4ZDNIMnNpdGwzbVVBQ2tFeVphbTI0ZTJiVEhiVE9QYzFjeHNmNlB1LzNtbXRmcmVkLzRFU1FOS1hHOFZBQ29BQUFBQVNVVk9SSzVDWUlJPScpO1xuXG4gICAgIHRoaXMuc3R5bGVzaGVldCA9IG9wdGlvbnMgfHwge30gO1xuICAgICB0aGlzLmRhdGEgPSBtb2RlbC5saXN0X1R5cGVzX09ic2xlcztcbiAgICAgdGhpcy5kcmF3KCk7XG5cblxufTtcblxuRGlzcGxheU1vZGVsLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuZGl2X2VsbXQgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJyk7XG4gICAgLy90aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJykuYXR0cignaGVpZ2h0JywgJzEwcHgnKTtcbiAgICAvLyBjcmVhdGUgdGhlIChyZWQpIGxpbmUgcmVwcmVzZW50aW5nIGN1cnJlbnQgdGltZVxuXG4gICAgdGhpcy54ID0gMTY7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB2YXIgeCA9IGQzLnRpbWUuc2NhbGUoKVxuICAgICAgLmRvbWFpbihbbmV3IERhdGUoMjAxNCwgNCwgMSksIG5ldyBEYXRlKDIwMTQsIDQsIDE1KSAtIDFdKVxuICAgICAgLy8gLmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aF0pO1xuXG4gICAgdmFyIG1hcmdpbiA9IHt0b3A6IDIwMCwgcmlnaHQ6IDQwLCBib3R0b206IDIwMCwgbGVmdDogNDB9LFxuICAgICAgaGVpZ2h0ID0gNTAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gICAgLyp0aGlzLnN2Z19ncCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHRoaXMuc3ZnX3RleHQgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTsqL1xuICAgIHRoaXMuc3ZnX3NlbGVjdGVkX29ic2VsID0gZGl2X2VsbXQuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyKCd4MScsICcwJylcbiAgICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgICAuYXR0cigneDInLCAnMCcpXG4gICAgICAuYXR0cigneTInLCAnMTAwJScpXG4gICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAuYXR0cignc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgIC5hdHRyKCdvcGFjaXR5JywgJzAuMycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJylcbiAgICAgIC5zdHlsZSgnZGlzcGxheScsICdub25lJyk7XG4gIH0sXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZSxpbWFnZSxyZWN0JylcbiAgICAgIC8vIFRPRE86IEFUVEVOVElPTiEgV0FSTklORyEgb2JzZWxzIE1VU1QgaGF2ZSBhIGZpZWxkIGlkIC0+IHVzZWQgYXMgYSBrZXkuXG4gICAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7IC8vIFRPRE86IGJvZ3VlIGluIGNhc2Ugbm8gSUQgZXhpc3RzIC0+IG1pZ2h0IGhhcHBlbiB3aXRoIEtUQlMgdHJhY2VzIGFuZCBuZXcgb2JzZWxzXG4gIH0sXG5cbiAgZDNPYnNlbHN0ZXh0OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5zdmdfdGV4dFxuICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlLGltYWdlLHJlY3QnKVxuICAgICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggIT09IDApe1xuICAgIHZhciBpbWFnZXMgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoXCJjaXJjbGUsaW1hZ2UscmVjdFwiKVxuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBkLmlkO1xuICAgICAgfSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwiaW1hZ2VcIik7XG5cblxuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdmFyIGltYWdlc19hdHQgPSAgaW1hZ2VzLmF0dHIoJ2NsYXNzJywgJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLm9wdGlvbnMueV9JbWcpXG4gICAgICAuYXR0cigneCcsIDE3KVxuICAgICAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3dpZHRoJykpOyB9KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdoZWlnaHQnKSk7fSlcblx0XHRcdC5hdHRyKCd4bGluazpocmVmJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2ljb24nKSk7IH0pO1xuICAgICAgLy8uYXR0cigneGxpbms6aHJlZicsIHRoaXMub3B0aW9ucy51cmwpO1xuICAgICAgLy8uYXR0cigneGxpbms6aHJlZicsICdpbWFnZXMvT3JhbmdlLnBuZycpO1xuICAgIHZhciB0ZXh0ID0gdGhpcy5zdmcuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpO1xuICAgIHZhciB0ZXh0TGFiZWxzID0gdGV4dFxuICAgICAgLmF0dHIoXCJ4XCIsICczNScpXG4gICAgICAuYXR0cihcInlcIiwgdGhpcy5vcHRpb25zLnlfdGV4dClcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudHlwZTt9KVxuICAgICAgLmF0dHIoXCJmb250LWZhbWlseVwiLCBcInNhbnMtc2VyaWZcIilcbiAgICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIFwiMTVweFwiKTtcbiAgICAkKCdpbWFnZScsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHJlZnJlc2hfeDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB0aGlzLnN2Z19ncFxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcbiAgICAgIC5hdHRyKCd5JywgdGhpcy5vcHRpb25zLnkpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwbGF5TW9kZWw7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgaW1wb3J0aW5nIGEgdHJhY2UgZnJvbSBhIENTViBmaWxlLlxuICogQGNsYXNzIFdpZGdldCBmb3IgaW1wb3J0aW5nIGEgdHJhY2UgZnJvbSBhIENTViBmaWxlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBzZWUgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLkJhc2ljLkltcG9ydFRyYWNlXG4gKiBAdG9kbyBBVFRFTlRJT04gY29kZSBxdWkgdmllbnQgZCdhaWxsZXVycyAhXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLkJhc2ljLkltcG9ydFRyYWNlfSB3aWRnZXQgaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gaW1wb3J0IGEgdHJhY2UgZnJvbSBhIENTViBmaWxlLlxuICpcbiAqIFRoaXMgd2lkZ2V0IGN1cnJlbnRseSBhY2NlcHQgdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gKlxuICogMS4gVGhlIENTViBmaWxlIGNhbiB1c2UgZWl0aGVyICcsJyBvciAnOycgYXMgYSB2YWx1ZSBzZXBhcmF0b3JcbiAqIDIuIEVhY2ggbGluZSByZXByZXNlbnRzIGFuIG9ic2VsXG4gKiAzLiBUaGUgZmlyc3QgY29sdW1uIHJlcHJlc2VudHMgdGhlIHRpbWUgd2hlbiB0aGUgb2JzZWwgb2NjdXJzXG4gKiA0LiBUaGUgc2Vjb25kIGNvbHVtbiByZXByZXNlbnRzIHRoZSB0eXBlIG9mIHRoZSBvYnNlbFxuICogNS4gVGhlIGZvbGxvd2luZyBjb2x1bW5zIHJlcHJlc2VudCBwYWlycyBvZiBcImF0dHJpYnV0ZVwiIC8gXCJ2YWx1ZVwiIGNvbHVtbnNcbiAqXG4gKiBUaGUgbnVtYmVyIG9mIGNvbHVtbnMgbWF5IHZhcnkgZnJvbSBsaW5lIHRvIGxpbmUuXG4gKiBGb3IgZXhhbXBsZSwgYSBDU1YgZmlsZSBtaWdodCBsb29rIGxpa2UgdGhpczpcbiAqIDxwcmU+XG4gKiAwLGNsaWNrLHRhcmdldCxidXR0b24yXG4gKiAyLGNsaWNrLHRhcmdldCxidXR0b24xLHZhbHVlLHRvdG9cbiAqIDMsZm9jdXMsdGFyZ2V0LHN1Ym1pdFxuICogNSxjbGljayx0YXJnZXQsc3VibWl0XG4gKiA8L3ByZT5cbiAqIEB0b2RvIERFU0NSSUJFIFRIRSBGT1JNQVQgT0YgVEhFIENTViBGSUxFLlxuICogQHBhcmFtIHtvYmplY3R9XHRodG1sRWxlbWVudFxuICogICAgIFRoZSBIVE1MIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVzZWQgYnkgdGhlIHdpZGdldFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLlRyYWNlfSB0cmFjZVxuICogICAgIFRyYWNlIG9iamVjdCBpbiB3aGljaCB0aGUgb2JzZWxzIHdpbGwgYmUgaW1wb3J0ZWQuXG4gKi9cblxudmFyIEltcG9ydFRyYWNlID0gZnVuY3Rpb24oaHRtbEVsZW1lbnQsIHRyYWNlKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIEltcG9ydFRyYWNlIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxFbGVtZW50KTtcbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLmluaXRfRE9NKCk7XG59O1xuXG5JbXBvcnRUcmFjZS5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBwX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdJbXBvcnQgYSB0cmFjZTogJyk7XG5cbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnZmlsZScpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnY3N2LWZpbGVbXScpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ211bHRpcGxlJywgJ3RydWUnKTtcbiAgICAvL1x0XHR0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywxNSk7XG4gICAgLy9cdFx0dGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLHRoaXMudGltZXIudGltZSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaW5wdXRfZWxlbWVudCk7XG5cbiAgICAvL1x0XHR2YXIgc3VibWl0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIC8vXHRcdHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsJ3N1Ym1pdCcpO1xuICAgIC8vXHRcdHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCdJbXBvcnQnKTtcbiAgICAvL1x0XHRwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoc3VibWl0X2VsZW1lbnQpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMub25fY2hhbmdlLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYXBwZW5kQ2hpbGQocF9lbGVtZW50KTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5mb3JtX2VsZW1lbnQpO1xuXG4gICAgdmFyIGJ1dHRvbl9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB2YXIgYV9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhX2VsLmhyZWYgPSBcIlwiO1xuICAgIGFfZWwuaW5uZXJIVE1MID0gXCJ0b2dnbGUgY29uc29sZVwiO1xuICAgIGJ1dHRvbl9lbC5hcHBlbmRDaGlsZChhX2VsKTtcbiAgICAvL1x0XHRidXR0b25fZWwuaW5uZXJIVE1MID0gXCI8YSBocmVmPVxcXCJcXFwiPnRvZ2dsZSBjb25zb2xlPC9hPlwiO1xuICAgIGFfZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uX3RvZ2dsZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoYnV0dG9uX2VsKTtcblxuICAgIHRoaXMuZGlzcGxheV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheV9lbGVtZW50KTtcbiAgfSxcblxuICBvbl9jaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBmaWxlcyA9IGUudGFyZ2V0LmZpbGVzO1xuICAgIHZhciB0aXRsZV9lbCwgY29udGVudF9lbDtcbiAgICBmb3IgKHZhciBpID0gMCwgZmlsZTsgZmlsZSA9IGZpbGVzW2ldOyBpKyspIHtcbiAgICAgIHRpdGxlX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuICAgICAgdGl0bGVfZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZmlsZS5uYW1lKSk7XG4gICAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5hcHBlbmRDaGlsZCh0aXRsZV9lbCk7XG4gICAgICBjb250ZW50X2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcbiAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IChmdW5jdGlvbihlbCwgcGFyc2VyLCB0cmFjZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHBhcnNlcihlLnRhcmdldC5yZXN1bHQsIHRyYWNlKTtcbiAgICAgICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlLnRhcmdldC5yZXN1bHQpKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKGNvbnRlbnRfZWwsIHRoaXMucGFyc2VfY3N2LCB0aGlzLnRyYWNlKTtcbiAgICAgIC8qXHRcdFx0cmVhZGVyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKSB7XG4gICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuICAgICAgXHRcdFx0fTsqL1xuICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gICAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5hcHBlbmRDaGlsZChjb250ZW50X2VsKTtcbiAgICAgIHRoaXMudHJhY2UudHJpZ2dlciAoXCJiZWZvckxvYWRGaWxlXCIpO1xuICAgIH1cbiAgfSxcblxuICBvbl90b2dnbGU6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHRoaXMuZGlzcGxheV9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiKSB7XG4gICAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcGFyc2VfY3N2OiBmdW5jdGlvbih0ZXh0LCB0cmFjZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy9mdW5jdGlvbiBjc3ZUb0FycmF5KCkgZnJvbVxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTI5MzE0Ny9qYXZhc2NyaXB0LWNvZGUtdG8tcGFyc2UtY3N2LWRhdGFcblxuICAgIC8vIFRoaXMgd2lsbCBwYXJzZSBhIGRlbGltaXRlZCBzdHJpbmcgaW50byBhbiBhcnJheSBvZlxuICAgIC8vIGFycmF5cy4gVGhlIGRlZmF1bHQgZGVsaW1pdGVyIGlzIHRoZSBjb21tYSwgYnV0IHRoaXNcbiAgICAvLyBjYW4gYmUgb3ZlcnJpZGVuIGluIHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gICAgZnVuY3Rpb24gY3N2VG9BcnJheShzdHJEYXRhLCBzdHJEZWxpbWl0ZXIpIHtcbiAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZGVsaW1pdGVyIGlzIGRlZmluZWQuIElmIG5vdCxcbiAgICAgIC8vIHRoZW4gZGVmYXVsdCB0byBjb21tYS5cbiAgICAgIHN0ckRlbGltaXRlciA9IChzdHJEZWxpbWl0ZXIgfHwgXCIsXCIpO1xuXG4gICAgICAvLyBDcmVhdGUgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcGFyc2UgdGhlIENTViB2YWx1ZXMuXG4gICAgICB2YXIgb2JqUGF0dGVybiA9IG5ldyBSZWdFeHAoXG4gICAgICAoXG4gICAgICAvLyBEZWxpbWl0ZXJzLlxuICAgICAgXCIoXFxcXFwiICsgc3RyRGVsaW1pdGVyICsgXCJ8XFxcXHI/XFxcXG58XFxcXHJ8XilcIiArXG5cbiAgICAgIC8vIFF1b3RlZCBmaWVsZHMuXG4gICAgICBcIig/OlxcXCIoW15cXFwiXSooPzpcXFwiXFxcIlteXFxcIl0qKSopXFxcInxcIiArXG5cbiAgICAgIC8vIFN0YW5kYXJkIGZpZWxkcy5cbiAgICAgIFwiKFteXFxcIlxcXFxcIiArIHN0ckRlbGltaXRlciArIFwiXFxcXHJcXFxcbl0qKSlcIlxuICAgICAgKSxcbiAgICAgIFwiZ2lcIlxuICAgICAgKTtcblxuICAgICAgLy8gQ3JlYXRlIGFuIGFycmF5IHRvIGhvbGQgb3VyIGRhdGEuIEdpdmUgdGhlIGFycmF5XG4gICAgICAvLyBhIGRlZmF1bHQgZW1wdHkgZmlyc3Qgcm93LlxuICAgICAgdmFyIGFyckRhdGEgPSBbW11dO1xuXG4gICAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgaW5kaXZpZHVhbCBwYXR0ZXJuXG4gICAgICAvLyBtYXRjaGluZyBncm91cHMuXG4gICAgICB2YXIgYXJyTWF0Y2hlcyA9IG51bGw7XG5cbiAgICAgIC8vIEtlZXAgbG9vcGluZyBvdmVyIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gbWF0Y2hlc1xuICAgICAgLy8gdW50aWwgd2UgY2FuIG5vIGxvbmdlciBmaW5kIGEgbWF0Y2guXG4gICAgICB3aGlsZSAoYXJyTWF0Y2hlcyA9IG9ialBhdHRlcm4uZXhlYyhzdHJEYXRhKSkge1xuXG4gICAgICAgIC8vIEdldCB0aGUgZGVsaW1pdGVyIHRoYXQgd2FzIGZvdW5kLlxuICAgICAgICB2YXIgc3RyTWF0Y2hlZERlbGltaXRlciA9IGFyck1hdGNoZXNbIDEgXTtcblxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGdpdmVuIGRlbGltaXRlciBoYXMgYSBsZW5ndGhcbiAgICAgICAgLy8gKGlzIG5vdCB0aGUgc3RhcnQgb2Ygc3RyaW5nKSBhbmQgaWYgaXQgbWF0Y2hlc1xuICAgICAgICAvLyBmaWVsZCBkZWxpbWl0ZXIuIElmIGlkIGRvZXMgbm90LCB0aGVuIHdlIGtub3dcbiAgICAgICAgLy8gdGhhdCB0aGlzIGRlbGltaXRlciBpcyBhIHJvdyBkZWxpbWl0ZXIuXG4gICAgICAgIGlmIChzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJiAoc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gc3RyRGVsaW1pdGVyKSkge1xuXG4gICAgICAgICAgLy8gU2luY2Ugd2UgaGF2ZSByZWFjaGVkIGEgbmV3IHJvdyBvZiBkYXRhLFxuICAgICAgICAgIC8vIGFkZCBhbiBlbXB0eSByb3cgdG8gb3VyIGRhdGEgYXJyYXkuXG4gICAgICAgICAgYXJyRGF0YS5wdXNoKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIGRlbGltaXRlciBvdXQgb2YgdGhlIHdheSxcbiAgICAgICAgLy8gbGV0J3MgY2hlY2sgdG8gc2VlIHdoaWNoIGtpbmQgb2YgdmFsdWUgd2VcbiAgICAgICAgLy8gY2FwdHVyZWQgKHF1b3RlZCBvciB1bnF1b3RlZCkuXG4gICAgICAgIGlmIChhcnJNYXRjaGVzWyAyIF0pIHtcblxuICAgICAgICAgIC8vIFdlIGZvdW5kIGEgcXVvdGVkIHZhbHVlLiBXaGVuIHdlIGNhcHR1cmVcbiAgICAgICAgICAvLyB0aGlzIHZhbHVlLCB1bmVzY2FwZSBhbnkgZG91YmxlIHF1b3Rlcy5cbiAgICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMiBdLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cChcIlxcXCJcXFwiXCIsIFwiZ1wiKSwgXCJcXFwiXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbm9uLXF1b3RlZCB2YWx1ZS5cbiAgICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMyBdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IHRoYXQgd2UgaGF2ZSBvdXIgdmFsdWUgc3RyaW5nLCBsZXQncyBhZGRcbiAgICAgICAgLy8gaXQgdG8gdGhlIGRhdGEgYXJyYXkuXG4gICAgICAgIGFyckRhdGFbIGFyckRhdGEubGVuZ3RoIC0gMSBdLnB1c2goc3RyTWF0Y2hlZFZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgZGF0YS5cbiAgICAgIHJldHVybiAoYXJyRGF0YSk7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ2ZpY2hpZXIgY2hhcmfDqScpO1xuICAgIC8vIEd1ZXNzaW5nIHRoZSBzZXBhcmF0b3JcbiAgICB2YXIgc2VwID0gdGV4dFt0ZXh0LnNlYXJjaChcIlssO1xcdF1cIildO1xuICAgIHZhciBjc3YgPSBjc3ZUb0FycmF5KHRleHQsIHNlcCk7XG4gICAgY3N2LnBvcCgpOyAvLyByZW1vdmUgdGhlIGxhc3QgbGluZS4uLiBXaHk/Li4uXG4gICAgLy9cdGNvbnNvbGUubG9nKCdmaWNoaWVyIHBhcnPDqScpO1xuICAgIGNzdi5tYXAoZnVuY3Rpb24obGluZSxqKSB7XG4gICAgICB2YXIgb19hdHRyID0ge307XG4gICAgICBvX2F0dHIuYmVnaW4gPSBsaW5lLnNoaWZ0KCk7XG4gICAgICBvX2F0dHIudHlwZSA9IGxpbmUuc2hpZnQoKTtcbiAgICAgIG9fYXR0ci5hdHRyaWJ1dGVzID0ge307XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IChsaW5lLmxlbmd0aCAtIDEpIC8gMiA7IGkrKykge1xuICAgICAgICBpZiAobGluZVsyICogaV0gIT09IFwiXCIpIHtcbiAgICAgICAgICBvX2F0dHIuYXR0cmlidXRlc1tsaW5lWzIgKiBpXV0gPSBsaW5lWzIgKiBpICsgMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChqPT09MCkge3RyYWNlLnRyaWdnZXIgKFwiZmlyc3RPYnNlbExvY2FsXCIsb19hdHRyKX07XG4gICAgICBpZiAoaj09PWNzdi5sZW5ndGgtMSkge3RyYWNlLnRyaWdnZXIgKFwiTGFzdE9ic2VsTG9jYWxcIixvX2F0dHIpfTtcblxuICAgICAgdHJhY2UuY3JlYXRlX29ic2VsKG9fYXR0cik7XG4gICAgfSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW1wb3J0VHJhY2U7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xuXG52YXIgSW50ZXJ2YWxUaW1lRm9ybSA9IGZ1bmN0aW9uKGh0bWxfaWQsIHRpbWVXaW5kb3cpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1SZWFkYWJsZVRpbWVGb3JtJyk7XG4gIHRoaXMud2luZG93ID0gdGltZVdpbmRvdztcbiAgdGhpcy53aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcbiAgLy90aGlzLnRpbWVyLm9uKCd0aW1lcjp1cGRhdGUnLHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcbiAgLy90aGlzLnRpbWVyLm9uKCd0aW1lcjpwbGF5OnVwZGF0ZScsdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuICB0aGlzLmluaXRfRE9NKCk7XG4gIHRoaXMucmVmcmVzaCgpO1xuXHR9O1xuXG5JbnRlcnZhbFRpbWVGb3JtLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0ZST006ICcpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICd5ZWFyJyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgNCk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy55ZWFyX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLycpKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9udGgnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubW9udGhfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcvJykpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdkYXknKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXlfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgLSAnKSk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ2hvdXInKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmhvdXJfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCc6JykpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdtaW51dGUnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5taW51dGVfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCc6JykpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdzZWNvbmQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDgpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zZWNvbmRfZWxlbWVudCk7XG5cbiAgICAvL3ZhciBwX2VsZW1lbnQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHZhciB0ZXh0X25vZGUxID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1RvOiAnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dF9ub2RlMSk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ3llYXInKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCdzaXplJywgNCk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMueWVhcl9lbGVtZW50MSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcvJykpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnbmFtZScsICdtb250aCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudDEuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5tb250aF9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1vbnRoX2VsZW1lbnQxKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy8nKSk7XG4gICAgdGhpcy5kYXlfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ2RheScpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF5X2VsZW1lbnQxKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAtICcpKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnaG91cicpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5ob3VyX2VsZW1lbnQxKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzonKSk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ21pbnV0ZScpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWludXRlX2VsZW1lbnQxKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzonKSk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ3NlY29uZCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnc2l6ZScsIDgpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuc2Vjb25kX2VsZW1lbnQxKTtcblxuXG5cblxuXG4gICAgdmFyIHN1Ym1pdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnc3VibWl0Jyk7XG4gICAgc3VibWl0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICdVcGRhdGUgdGltZScpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChzdWJtaXRfZWxlbWVudCk7XG4gICAgdGhpcy5mb3JtX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5idWlsZF9jYWxsYmFjaygnc3VibWl0JykpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYXBwZW5kQ2hpbGQocF9lbGVtZW50KTtcblxuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZm9ybV9lbGVtZW50KTtcbiAgfSxcbiAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG5cbiAgICB0aW1lc3RhcnQgPSB0aGlzLndpbmRvdy5zdGFydDtcbiAgICB0aW1lRW5kID0gdGhpcy53aW5kb3cuZW5kO1xuXG4gICAgdmFyIGRhdGVzdGFydCA9IG5ldyBEYXRlKCk7XG4gICAgZGF0ZXN0YXJ0LnNldFRpbWUodGltZXN0YXJ0KTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC52YWx1ZSAgID0gZGF0ZXN0YXJ0LmdldEZ1bGxZZWFyKCk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnZhbHVlICA9IGRhdGVzdGFydC5nZXRNb250aCgpICsgMTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnZhbHVlICAgID0gZGF0ZXN0YXJ0LmdldERhdGUoKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC52YWx1ZSAgID0gZGF0ZXN0YXJ0LmdldEhvdXJzKCk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC52YWx1ZSA9IGRhdGVzdGFydC5nZXRNaW51dGVzKCk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC52YWx1ZSA9IGRhdGVzdGFydC5nZXRTZWNvbmRzKCkgKyBkYXRlc3RhcnQuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwO1xuXG4gICAgdmFyIGRhdGVFbmQgPSBuZXcgRGF0ZSgpO1xuICAgIGRhdGVFbmQuc2V0VGltZSh0aW1lRW5kKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEudmFsdWUgICA9IGRhdGVFbmQuZ2V0RnVsbFllYXIoKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQxLnZhbHVlICA9IGRhdGVFbmQuZ2V0TW9udGgoKSArIDE7XG4gICAgdGhpcy5kYXlfZWxlbWVudDEudmFsdWUgICAgPSBkYXRlRW5kLmdldERhdGUoKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudDEudmFsdWUgICA9IGRhdGVFbmQuZ2V0SG91cnMoKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50MS52YWx1ZSA9IGRhdGVFbmQuZ2V0TWludXRlcygpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxLnZhbHVlID0gZGF0ZUVuZC5nZXRTZWNvbmRzKCkgKyBkYXRlRW5kLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMDtcbiAgfSxcbiAgYnVpbGRfY2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRpbWVyV2luZG93ID0gdGhpcy53aW5kb3c7XG4gICAgdmFyIHRpbWVfZm9ybSA9IHRoaXM7XG4gICAgc3dpdGNoIChldmVudCkge1xuICAgICAgY2FzZSAnc3VibWl0JzpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdXaWRnZXRCYXNpY1RpbWVGb3JtLnN1Ym1pdCcpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuXG4gICAgICAgICAgdmFyIGRhdGVzdGFydCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgZGF0ZXN0YXJ0LnNldEZ1bGxZZWFyKHRpbWVfZm9ybS55ZWFyX2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGVzdGFydC5zZXRNb250aCh0aW1lX2Zvcm0ubW9udGhfZWxlbWVudC52YWx1ZSAtIDEpO1xuICAgICAgICAgIGRhdGVzdGFydC5zZXREYXRlKHRpbWVfZm9ybS5kYXlfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZXN0YXJ0LnNldEhvdXJzKHRpbWVfZm9ybS5ob3VyX2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGVzdGFydC5zZXRNaW51dGVzKHRpbWVfZm9ybS5taW51dGVfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZXN0YXJ0LnNldFNlY29uZHModGltZV9mb3JtLnNlY29uZF9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICB2YXIgZGF0ZWVuZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXRGdWxsWWVhcih0aW1lX2Zvcm0ueWVhcl9lbGVtZW50MS52YWx1ZSk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXRNb250aCh0aW1lX2Zvcm0ubW9udGhfZWxlbWVudDEudmFsdWUgLSAxKTtcbiAgICAgICAgICBkYXRlZW5kLnNldERhdGUodGltZV9mb3JtLmRheV9lbGVtZW50MS52YWx1ZSk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXRIb3Vycyh0aW1lX2Zvcm0uaG91cl9lbGVtZW50MS52YWx1ZSk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXRNaW51dGVzKHRpbWVfZm9ybS5taW51dGVfZWxlbWVudDEudmFsdWUpO1xuICAgICAgICAgIGRhdGVlbmQuc2V0U2Vjb25kcyh0aW1lX2Zvcm0uc2Vjb25kX2VsZW1lbnQxLnZhbHVlKTtcbiAgICAgICAgICB0aW1lcldpbmRvdy5zZXRfc3RhcnQoZGF0ZXN0YXJ0LmdldFRpbWUoKSk7XG4gICAgICAgICAgdGltZXJXaW5kb3cuc2V0X2VuZCAoZGF0ZWVuZC5nZXRUaW1lKCkpXG4gICAgICAgICAgLy90aW1lci5zZXQoZGF0ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuXHR9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVydmFsVGltZUZvcm07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuLi8uLi9jb3JlL0V2ZW50SGFuZGxlci5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgR2VuZXJpYyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIHRoZSBhdmFpbGFibGUgYmFzZXMgb2YgYSBLVEJTLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogVE9ETyBlY3JpcmUgZGVzY3JpcHRpb25cbiAqIEB0b2RvIEVDUklSRSBMQSBERVNDUklQVElPTlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sX2lkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5LVEJTfSBrdGJzXG4gKiAgICAgS1RCUyB0byBiaW5kIHRvLlxuICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5FdmVudEhhbmRsZXIuRXZlbnRDb25maWd9IFtldmVudHNdXG4gKiAgICAgRXZlbnRzIHRvIGxpc3RlbiB0byBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBjYWxsYmFja3MuXG4gKi9cbnZhciBMaXN0QmFzZXMgPSBmdW5jdGlvbihodG1sX2lkLCBrdGJzLCBldmVudHMpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcywgZXZlbnRzKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1MaXN0QmFzZXMnKTtcblxuICB0aGlzLmt0YnMgPSBrdGJzO1xuICBrdGJzLm9uKCdrdGJzOnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG59O1xuXG5MaXN0QmFzZXMucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgLy90aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAvLyQodGhpcy5lbGVtZW50KS5hcHBlbmQoJzxoMj5LVEJTIHJvb3Q6ICcrdGhpcy5rdGJzLmdldF91cmkoKSsnPC9oMj4nKTtcbiAgICAvKlxuICAgIFx0XHR2YXIgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIFx0XHR2YXIgdGl0bGVfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdLVEJTIHJvb3Q6ICcrdGhpcy5rdGJzLmdldF91cmkoKSk7XG4gICAgXHRcdHRpdGxlLmFwcGVuZENoaWxkKHRpdGxlX3RleHQpO1xuICAgIFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGl0bGUpO1xuKi9cbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRhdGFsaXN0X2VsZW1lbnQpO1xuXG4gICAgdGhpcy5hZGRfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmFkZF9idXR0b24pLmFwcGVuZCgnTmV3IGJhc2UnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5hZGRfYnV0dG9uKTtcbiAgICAkKHRoaXMuYWRkX2J1dHRvbikuY2xpY2sodGhpcy5vcGVuX2Zvcm0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIG9wZW5fZm9ybTogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5mb3JtID0ge307XG5cbiAgICB0aGlzLmZvcm0uaW5wdXRfaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9pZC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQxID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBCYXNlIElEOiAnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9sYWJlbC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBsYWJlbDogJyk7XG4gICAgdGhpcy5mb3JtLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICQodGhpcy5mb3JtLmJ1dHRvbikuYXBwZW5kKCdjcmVhdGUnKTtcblxuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLnRleHQxKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5pbnB1dF9pZCk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0udGV4dDIpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X2xhYmVsKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5idXR0b24pO1xuXG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5jbGljayh0aGlzLmNyZWF0ZV9iYXNlLmJpbmQodGhpcykpO1xuXG4gIH0sXG4gIGNyZWF0ZV9iYXNlOiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKCQodGhpcy5mb3JtLmlucHV0X2lkKS52YWwoKSAhPT0gXCJcIikge1xuICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBhIG5ldyBiYXNlLi4uXCIpO1xuICAgICAgdGhpcy5rdGJzLmNyZWF0ZV9iYXNlKCQodGhpcy5mb3JtLmlucHV0X2lkKS52YWwoKSwgJCh0aGlzLmZvcm0uaW5wdXRfbGFiZWwpLnZhbCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJFbXB0eSBiYXNlIG5hbWUuLi4gTm8gYmFzZSBjcmVhdGVkXCIpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gdGhpcy5mb3JtKSB7XG4gICAgICBpZiAodGhpcy5mb3JtLmhhc093blByb3BlcnR5KGspKSAgICAgIHskKHRoaXMuZm9ybVtrXSkucmVtb3ZlKCk7fVxuICAgIH1cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfSxcbiAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgLy8gY2xlYXJcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgdmFyIGxpX2VsZW1lbnQ7XG4gICAgdGhpcy5rdGJzLmxpc3RfYmFzZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGIpIHtcbiAgICAgIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgbGlfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgbGlfbGluay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJhc2VcIik7XG4gICAgICBsaV9saW5rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGIpKTtcbiAgICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfbGluayk7XG4gICAgICBsaV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGZ1bmN0aW9uKCkge3RoaXMudHJpZ2dlcigndWk6Y2xpY2s6YmFzZScsIGIpfSkuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy50cmlnZ2VyKFwiTGlzdEJhc2VcIik7XG5cbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdEJhc2VzO1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi4vLi4vY29yZS9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQGNsYXNzIEdlbmVyaWMgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgYXZhaWxhYmxlIGJhc2VzIG9mIGEgS1RCUy5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuIC8vIGZhdG1hIERFcmJlbFxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBUT0RPIGVjcmlyZSBkZXNjcmlwdGlvblxuICogQHRvZG8gRUNSSVJFIExBIERFU0NSSVBUSU9OXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxFbGVtZW50XG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5LVEJTLkJhc2V9IGt0YnNCYXNlXG4gKiAgICAgS1RCUyBCYXNlIHRvIGJpbmQgdG8uXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuTGliLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ30gW2V2ZW50c11cbiAqICAgICBFdmVudHMgdG8gbGlzdGVuIHRvIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIGNhbGxiYWNrcy5cbiAqL1xudmFyIExpc3RNb2RlbEluQmFzZXMgPSBmdW5jdGlvbihodG1sRWxlbWVudCwga3Ric0Jhc2UsIGV2ZW50cykge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxFbGVtZW50KTtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcywgZXZlbnRzKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1MaXN0VHJhY2VzJyk7XG5cbiAgdGhpcy5iYXNlID0ga3Ric0Jhc2U7XG4gIHRoaXMuYmFzZS5vbignYmFzZTp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xufTtcblxuTGlzdE1vZGVsSW5CYXNlcy5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICAvL3RoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgLyp2YXIgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIFx0XHR2YXIgdGl0bGVfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdCYXNlOiAnK3RoaXMuYmFzZS5nZXRfdXJpKCkpO1xuICAgIFx0XHR0aXRsZS5hcHBlbmRDaGlsZCh0aXRsZV90ZXh0KTtcbiAgICBcdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRpdGxlKTsqL1xuXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXRhbGlzdF9lbGVtZW50KTtcblxuXG4gICAgdGhpcy5hZGRfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmFkZF9idXR0b24pLmFwcGVuZCgnTmV3IE1vZGVsJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYWRkX2J1dHRvbik7XG4gICAgJCh0aGlzLmFkZF9idXR0b24pLmNsaWNrKHRoaXMub3Blbl9mb3JtLmJpbmQodGhpcykpO1xuXG4gICAgLyp0aGlzLnJlbW92ZV9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBcdFx0JCh0aGlzLnJlbW92ZV9idXR0b24pLmFwcGVuZCgnRGVsZXRlIGJhc2UnKTtcbiAgICBcdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucmVtb3ZlX2J1dHRvbik7XG4gICAgXHRcdCQodGhpcy5yZW1vdmVfYnV0dG9uKS5jbGljayh0aGlzLnJlbW92ZV9iYXNlLmJpbmQodGhpcykpOyovXG5cblxuICB9LFxuICBvcGVuX2Zvcm06IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5hZGRfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZm9ybSA9IHt9O1xuXG4gICAgdGhpcy5mb3JtLmlucHV0X2lkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfaWQuc2l6ZSA9IDIwO1xuICAgIHRoaXMuZm9ybS50ZXh0MSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgTW9kZWwgSUQ6ICcpO1xuLyogICAgdGhpcy5mb3JtLmlucHV0X2xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfbGFiZWwuc2l6ZSA9IDIwO1xuICAgIHRoaXMuZm9ybS50ZXh0MiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgbGFiZWw6ICcpOyovXG4gICAgdGhpcy5mb3JtLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICQodGhpcy5mb3JtLmJ1dHRvbikuYXBwZW5kKCdjcmVhdGUnKTtcblxuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLnRleHQxKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5pbnB1dF9pZCk7XG4gICAgLy8kKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS50ZXh0Mik7XG4gICAgLy8kKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5pbnB1dF9sYWJlbCk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uYnV0dG9uKTtcblxuICAgICQodGhpcy5mb3JtLmJ1dHRvbikuY2xpY2sodGhpcy5jcmVhdGVfdHJhY2UuYmluZCh0aGlzKSk7XG5cbiAgfSxcbiAgY3JlYXRlX3RyYWNlOiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKCQodGhpcy5mb3JtLmlucHV0X2lkKS52YWwoKSAhPT0gXCJcIikge1xuICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBhIG5ldyB0cmFjZS4uLlwiKTtcbiAgICAgIHRoaXMuYmFzZS5jcmVhdGVfbW9kZWwoJCh0aGlzLmZvcm0uaW5wdXRfaWQpLnZhbCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJFbXB0eSB0cmFjZSBuYW1lLi4uIE5vIHRyYWNlIGNyZWF0ZWRcIik7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayBpbiB0aGlzLmZvcm0pIHtcbiAgICAgICQodGhpcy5mb3JtW2tdKS5yZW1vdmUoKTtcbiAgICB9XG4gICAgdGhpcy5hZGRfYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gIH0sXG4gIHJlbW92ZV9iYXNlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmJhc2UucmVtb3ZlKCk7XG4gIH0sXG4gIHJlZnJlc2g6IGZ1bmN0aW9uKCkge1xuICAgIC8vIGNsZWFyXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgIHZhciBsaV9lbGVtZW50O1xuICAgIHRoaXMuYmFzZS5saXN0X3RyYWNlcygpLmZvckVhY2goZnVuY3Rpb24odCkge1xuICAgICAgaWYgKHRbJ0B0eXBlJ10gPT0gXCJUcmFjZU1vZGVsXCIpIHtcbiAgICAgICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGxpX2xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgbGlfbGluay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1vZGVsXCIpO1xuICAgICAgICBsaV9saW5rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRbJ0BpZCddKSk7XG4gICAgICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfbGluayk7XG4gICAgICAgIGxpX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZnVuY3Rpb24oKSB7dGhpcy50cmlnZ2VyKCd1aTpjbGljazp0cmFjZScsIHRbJ0BpZCddKX0pLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO31cbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLnRyaWdnZXIoXCJMaXN0TW9kZWxcIik7XG4gIH0sXG4gIHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdE1vZGVsSW5CYXNlcztcbiIsInZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4uLy4uL2NvcmUvRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBHZW5lcmljIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgdGhlIGF2YWlsYWJsZSBiYXNlcyBvZiBhIEtUQlMuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBUT0RPIGVjcmlyZSBkZXNjcmlwdGlvblxuICogQHRvZG8gRUNSSVJFIExBIERFU0NSSVBUSU9OXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxfaWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuTGliLktUQlMuQmFzZX0ga3Ric19iYXNlXG4gKiAgICAgS1RCUyBCYXNlIHRvIGJpbmQgdG8uXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuTGliLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ30gW2V2ZW50c11cbiAqICAgICBFdmVudHMgdG8gbGlzdGVuIHRvIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIGNhbGxiYWNrcy5cbiAqL1xudmFyIExpc3RUcmFjZXNJbkJhc2VzID0gZnVuY3Rpb24oaHRtbF9pZCwga3Ric19iYXNlLCBldmVudHMpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcywgZXZlbnRzKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1MaXN0VHJhY2VzJyk7XG5cbiAgdGhpcy5iYXNlID0ga3Ric19iYXNlO1xuICB0aGlzLmJhc2Uub24oJ2Jhc2U6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbn07XG5cbkxpc3RUcmFjZXNJbkJhc2VzLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIC8vdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAvKnZhciB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgXHRcdHZhciB0aXRsZV90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0Jhc2U6ICcrdGhpcy5iYXNlLmdldF91cmkoKSk7XG4gICAgXHRcdHRpdGxlLmFwcGVuZENoaWxkKHRpdGxlX3RleHQpO1xuICAgIFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGl0bGUpOyovXG5cbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRhdGFsaXN0X2VsZW1lbnQpO1xuXG4gICAgLyp0aGlzLnJlbW92ZV9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBcdFx0JCh0aGlzLnJlbW92ZV9idXR0b24pLmFwcGVuZCgnRGVsZXRlIGJhc2UnKTtcbiAgICBcdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucmVtb3ZlX2J1dHRvbik7XG4gICAgXHRcdCQodGhpcy5yZW1vdmVfYnV0dG9uKS5jbGljayh0aGlzLnJlbW92ZV9iYXNlLmJpbmQodGhpcykpOyovXG5cbiAgICB0aGlzLmFkZF9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAkKHRoaXMuYWRkX2J1dHRvbikuYXBwZW5kKCdOZXcgdHJhY2UnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5hZGRfYnV0dG9uKTtcbiAgICAkKHRoaXMuYWRkX2J1dHRvbikuY2xpY2sodGhpcy5vcGVuX2Zvcm0uYmluZCh0aGlzKSk7XG5cbiAgfSxcbiAgb3Blbl9mb3JtOiBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuYWRkX2J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICB0aGlzLmZvcm0gPSB7fTtcblxuICAgIHRoaXMuZm9ybS5pbnB1dF9pZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X2lkLnNpemUgPSAyMDtcbiAgICB0aGlzLmZvcm0udGV4dDEgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIFRyYWNlIElEOiAnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9sYWJlbC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBsYWJlbDogJyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X21vZGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfbW9kZWwuc2l6ZSA9IDIwO1xuICAgIHRoaXMuZm9ybS50ZXh0MyA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgTU9ERUwgVVJJOiAnKTtcbiAgICB0aGlzLmZvcm0uYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5hcHBlbmQoJ2NyZWF0ZScpO1xuXG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0udGV4dDEpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X2lkKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS50ZXh0Mik7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uaW5wdXRfbGFiZWwpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLnRleHQzKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5pbnB1dF9tb2RlbCk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uYnV0dG9uKTtcblxuICAgICQodGhpcy5mb3JtLmJ1dHRvbikuY2xpY2sodGhpcy5jcmVhdGVfdHJhY2UuYmluZCh0aGlzKSk7XG5cbiAgfSxcbiAgY3JlYXRlX3RyYWNlOiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKCQodGhpcy5mb3JtLmlucHV0X2lkKS52YWwoKSAhPT0gXCJcIikge1xuICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBhIG5ldyB0cmFjZS4uLlwiKTtcbiAgICAgIHRoaXMuYmFzZS5jcmVhdGVfc3RvcmVkX3RyYWNlKCQodGhpcy5mb3JtLmlucHV0X2lkKS52YWwoKSwgJCh0aGlzLmZvcm0uaW5wdXRfbW9kZWwpLnZhbCgpLCBudWxsLCBudWxsLCAkKHRoaXMuZm9ybS5pbnB1dF9sYWJlbCkudmFsKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVtcHR5IHRyYWNlIG5hbWUuLi4gTm8gdHJhY2UgY3JlYXRlZFwiKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrIGluIHRoaXMuZm9ybSkge1xuICAgICAgaWYgKHRoaXMuZm9ybS5oYXNPd25Qcm9wZXJ0eShrKSkgICAgICB7JCh0aGlzLmZvcm1ba10pLnJlbW92ZSgpO31cbiAgICB9XG4gICAgdGhpcy5hZGRfYnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gIH0sXG4gIHJlbW92ZV9iYXNlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmJhc2UucmVtb3ZlKCk7XG4gIH0sXG4gIHJlZnJlc2g6IGZ1bmN0aW9uKCkge1xuICAgIC8vIGNsZWFyXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuICAgIHZhciBsaV9lbGVtZW50O1xuICAgIHRoaXMuYmFzZS5saXN0X3RyYWNlcygpLmZvckVhY2goZnVuY3Rpb24odCkge1xuICAgICAgaWYgKHRbJ0B0eXBlJ10gPT0gXCJTdG9yZWRUcmFjZVwiKSB7XG4gICAgICAgIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsaV9saW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGxpX2xpbmsuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ0cmFjZVwiKTtcbiAgICAgICAgbGlfbGluay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0WydAaWQnXSkpO1xuICAgICAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2xpbmspO1xuICAgICAgICAvL2xpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodFsnQGlkJ10pKTtcbiAgICAgICAgbGlfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChmdW5jdGlvbigpIHt0aGlzLnRyaWdnZXIoJ3VpOmNsaWNrOnRyYWNlJywgdFsnQGlkJ10pfSkuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7fVxuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMudHJpZ2dlcihcIkxpc3RUcmFjZVwiKTtcblxuICB9LFxuICBzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RUcmFjZXNJbkJhc2VzO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGFuIE9ic2VsIGFzIGFuIEhUTUwgbGlzdC5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGFuIE9ic2VsIGFzIGFuIEhUTUwgbGlzdC5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5PYnNlbEluc3BlY3RvciBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgT2JzZWxzLlxuICpcbiAqIFRoaXMgd2lkZ2V0IG9ic2VydmVzIGEge0BsaW5rIFNhbW90cmFjZXMuTGliLlNlbGVjdG9yfFNlbGVjdG9yfVxuICogb2JqZWN0LiBXaGVuIGFuIG9ic2VsIGlzIHNlbGVjdGVkLCB0aGUgaW5mb3JtYXRpb24gYWJvdXRcbiAqIHRoaXMgb2JzZWwgaXMgZGlzcGxheWVkIGluIHRoZSB3aWRnZXQuIFdoZW4gYW4gb2JzZWwgaXNcbiAqIHVuc2VsZWN0ZWQsIHRoZSB3aWRnZXQgY2xvc2VzLiBDbGlja2luZyBvbiB0aGUgcmVkIGNyb3NzXG4gKiB3aWxsIGNsb3NlIHRoZSB3aWRnZXQgKGFuZCBhdXRvbWF0aWNhbGx5IHVuc2VsZWN0IHRoZSBvYnNlbCkuXG4gKiBXaGVuIG5vIG9ic2VsIGFyZSBzZWxlY3RlZCwgdGhlIHdpZGdldCBpcyBub3QgdmlzaWJsZSxcbiAqIHNlbGVjdGluZyBhbiBvYnNlbCB3aWxsIG1ha2UgaXQgYXBwZWFyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0aHRtbF9pZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2VsZWN0b3IuPE9ic2VsPn0gb2JzZWxfc2VsZWN0b3JcbiAqICAgICBBIFNlbGVjdG9yIG9mIE9ic2VsIHRvIG9ic2VydmUuXG4gKi9cbnZhciBPYnNlbEluc3BlY3RvciA9IGZ1bmN0aW9uKGh0bWxfaWQsIG9ic2VsX3NlbGVjdG9yKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtT2JzZWxJbnNwZWN0b3InKTtcblxuICB0aGlzLm9ic2VsID0gb2JzZWxfc2VsZWN0b3I7XG4gIHRoaXMub2JzZWwub24oJ3NlbGVjdGlvbjphZGQnLCB0aGlzLmluc3BlY3QuYmluZCh0aGlzKSk7XG4gIHRoaXMub2JzZWwub24oJ3NlbGVjdGlvbjplbXB0eScsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG4gIHRoaXMub2JzZWwub24oJ3NlbGVjdGlvbjpyZW1vdmUnLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbn07XG5cbk9ic2VsSW5zcGVjdG9yLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5jbG9zZV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHZhciBpbWdfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZ19lbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUZQU1VSQlZEaU5sWk94VGdKUkVFWFBmVXVQRW15TXJRU0xKYUhXaENpbHRZWC9vWjJWc2NMS3I2Q2dwZ09NUm4vQVJSQXRpVFlZc1ZkMkxGaklzdGtsY1pxWHpNeTVNNW1acHhFVWYrSEM0QVJvTzdqZU0zc2p4VjZrVWpqUFBSUTBjOURRTXpRTXptTjVueUVjK1daQkhBNGszMEVQS0M1OGdodjFZUXpzSklxdGlLVEJrWDA0d1cxS3QwVUh2YjVVNlV1VkRCaWdyU0dVUW5ndzJFcEdEYjZqVmplU01jRkVzQzh6STVCOEQ3cHBJbWttbU15Zzdwc0ZEc0EzQzJaUUYweitBd1BJekpiQmFGaDN3R1lHUHcyaEZ0K1FpMGM5OEpUd0phbzdEN3k0YjVrOGtLbzJuME0rUzhBZ2I5QWRTTlVWZ1FqdUFJVXNPR1lGZzg1Q1JFOVFkdkNZQVUrak4yMG1Yd1lIem9Pek5GZ3dDYUVXUWkxak93WEJoZnJ3RG13bjRmaXExdHpKMkFsYTYyQllleWROamFENE0vK05wd2IzT2Jnc203Mm10TXhRMmczbnVjZUNWZzZ1L2dCczU0YWxvbndkV1FBQUFBQkpSVTVFcmtKZ2dnPT0nKTtcbiAgICB0aGlzLmNsb3NlX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW1nX2VsZW1lbnQpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNsb3NlX2VsZW1lbnQpO1xuXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXRhbGlzdF9lbGVtZW50KTtcblxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgdGhpcy5jbG9zZV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsb3NlQWN0aW9uLmJpbmQodGhpcykpO1xuICB9LFxuICBpbnNwZWN0OiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBvYnMgPSBldmVudC5kYXRhO1xuICAgIC8vIGNsZWFyXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBvYnMuYXR0cmlidXRlcztcblxuICAgIHZhciBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdpZDogJyArIG9icy5nZXRfaWQoKSkpO1xuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTtcblxuICAgIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3R5cGU6ICcgKyBvYnMuZ2V0X3R5cGUoKSkpO1xuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTtcblxuICAgIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ2JlZ2luOiAnICsgb2JzLmdldF9iZWdpbigpKSk7XG4gICAgLy9cdGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ2JlZ2luOiAnKyAobmV3IERhdGUob2JzLmdldF9iZWdpbigpKSkudG9TdHJpbmcoKSkpO1xuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTtcblxuICAgIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ2VuZDogJyArIG9icy5nZXRfZW5kKCkpKTtcbiAgICAvL1x0bGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnZW5kOiAnKyAobmV3IERhdGUob2JzLmdldF9lbmQoKSkpLnRvU3RyaW5nKCkpKTtcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gb2JzLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmIChvYnMuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSAgICAgIHtsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShrZXkgICsgJzogJyArIG9icy5hdHRyaWJ1dGVzW2tleV0pKTtcbiAgICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTt9XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICB9LFxuICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH0sXG4gIG9uQ2xvc2VBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMub2JzZWwudW5zZWxlY3QoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlbEluc3BlY3RvcjtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhbiBPYnNlbCBhcyBhbiBIVE1MIGxpc3QuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhbiBPYnNlbCBhcyBhbiBIVE1MIGxpc3QuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVybiAvLyBGYXRtYSBEZXJiZWxcbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLk9ic2VsSW5zcGVjdG9yIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSBPYnNlbHMuXG4gKlxuICogVGhpcyB3aWRnZXQgb2JzZXJ2ZXMgYSB7QGxpbmsgU2Ftb3RyYWNlcy5MaWIuU2VsZWN0b3J8U2VsZWN0b3J9XG4gKiBvYmplY3QuIFdoZW4gYW4gb2JzZWwgaXMgc2VsZWN0ZWQsIHRoZSBpbmZvcm1hdGlvbiBhYm91dFxuICogdGhpcyBvYnNlbCBpcyBkaXNwbGF5ZWQgaW4gdGhlIHdpZGdldC4gV2hlbiBhbiBvYnNlbCBpc1xuICogdW5zZWxlY3RlZCwgdGhlIHdpZGdldCBjbG9zZXMuIENsaWNraW5nIG9uIHRoZSByZWQgY3Jvc3NcbiAqIHdpbGwgY2xvc2UgdGhlIHdpZGdldCAoYW5kIGF1dG9tYXRpY2FsbHkgdW5zZWxlY3QgdGhlIG9ic2VsKS5cbiAqIFdoZW4gbm8gb2JzZWwgYXJlIHNlbGVjdGVkLCB0aGUgd2lkZ2V0IGlzIG5vdCB2aXNpYmxlLFxuICogc2VsZWN0aW5nIGFuIG9ic2VsIHdpbGwgbWFrZSBpdCBhcHBlYXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sX2lkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTZWxlY3Rvci48T2JzZWw+fSBvYnNlbF9zZWxlY3RvclxuICogICAgIEEgU2VsZWN0b3Igb2YgT2JzZWwgdG8gb2JzZXJ2ZS5cbiAqL1xudmFyIE9ic2VsVHlwZUluc3BlY3RvciA9IGZ1bmN0aW9uKGh0bWxfaWQsIG9ic2VsX3NlbGVjdG9yKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtT2JzZWxJbnNwZWN0b3JUeXBlJyk7XG5cbiAgdGhpcy5vYnNlbCA9IG9ic2VsX3NlbGVjdG9yO1xuICB0aGlzLm9ic2VsLm9uKCdzZWxlY3Rpb246YWRkJywgdGhpcy5pbnNwZWN0LmJpbmQodGhpcykpO1xuICB0aGlzLm9ic2VsLm9uKCdzZWxlY3Rpb246ZW1wdHknLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuICB0aGlzLm9ic2VsLm9uKCdzZWxlY3Rpb246cmVtb3ZlJywgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG59O1xuXG5PYnNlbFR5cGVJbnNwZWN0b3IucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLmNsb3NlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdmFyIGltZ19lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBRlBTVVJCVkRpTmxaT3hUZ0pSRUVYUGZVdVBFbXlNclFTTEphSFdoQ2lsdFlYL29aMlZzY0xLcjZDZ3BnT01Sbi9BUlJBdGlUWVlzVmQyTEZqSXN0a2xjWnFYek15NU01bVpweEVVZitIQzRBUm9PN2plTTNzanhWNmtVampQUFJRMGM5RFFNelFNem1ONW55RWMrV1pCSEE0azMwRVBLQzU4Z2h2MVlRenNKSXF0aUtUQmtYMDR3VzFLdDBVSHZiNVU2VXVWREJpZ3JTR1VRbmd3MkVwR0RiNmpWamVTTWNGRXNDOHpJNUI4RDdwcElta21tTXlnN3BzRkRzQTNDMlpRRjB6K0F3UEl6SmJCYUZoM3dHWUdQdzJoRnQrUWkwYzk4SlR3SmFvN0Q3eTRiNWs4a0tvMm4wTStTOEFnYjlBZFNOVVZnUWp1QUlVc09HWUZnODVDUkU5UWR2Q1lBVStqTjIwbVh3WUh6b096TkZnd0NhRVdRaTFqT3dYQmhmcndEbXduNGZpcTF0ekoyQWxhNjJCWWV5ZE5qYUQ0TS8rTnB3YjNPYmdzbTcybXRNeFEyZzNudWNlQ1ZnNnUvZ0JzNTRhbG9ud2RXUUFBQUFCSlJVNUVya0pnZ2c9PScpO1xuICAgIHRoaXMuY2xvc2VfZWxlbWVudC5hcHBlbmRDaGlsZChpbWdfZWxlbWVudCk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY2xvc2VfZWxlbWVudCk7XG5cbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRhdGFsaXN0X2VsZW1lbnQpO1xuXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICB0aGlzLmNsb3NlX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xvc2VBY3Rpb24uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGluc3BlY3Q6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIG9icyA9IGV2ZW50LmRhdGE7XG4gICAgLy8gY2xlYXJcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG5cbiAgICB2YXIgYXR0cmlidXRlcyA9IG9icy5hdHRyaWJ1dGVzO1xuICAgIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIC8vbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgndHlwZTogJysgb2JzLmdldF90eXBlKCkpKTtcbiAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCd0eXBlOiAnICsgb2JzW1widHlwZVwiXSkpO1xuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTtcblxuXG4gICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQXR0cmlidXQ6ICcpKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JzLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGZvciAodmFyIHZhbCBpbiBvYnMuYXR0cmlidXRlc1trZXldKSAgICAgIHtcblxuXG4gICAgICAgIC8vICBsaV9lbGVtZW50X0EuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodmFsICArJzogJysgb2JzLmF0dHJpYnV0ZXNba2V5XVt2YWxdKSk7XG5cblxuXG5cbiAgICAgICAgaWYgKHZhbCA9PSBcIkBpZFwiKSAgICAgICAge1xuICAgICAgICAgIHVsX2VsZW1lbnRfQSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgICAgICAgbGlfZWxlbWVudF9BID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgICBsaV90ZXh0ID0gb2JzLmF0dHJpYnV0ZXNba2V5XVt2YWxdICsgJyA6ICcgO1xuICAgICAgICB9ICAgICAgICBlbHNlIGlmICh2YWwgPT0gXCJsYWJlbFwiKSAgICAgICAge1xuXG4gICAgICAgICAgbGlfZWxlbWVudF9BLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGxpX3RleHQgKyBvYnMuYXR0cmlidXRlc1trZXldW3ZhbF0pKTtcbiAgICAgICAgICB1bF9lbGVtZW50X0EuYXBwZW5kQ2hpbGQobGlfZWxlbWVudF9BKVxuICAgICAgICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQodWxfZWxlbWVudF9BKTtcbiAgICAgICAgfVxuXG5cblxuXG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH0sXG4gIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfSxcbiAgb25DbG9zZUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vYnNlbC51bnNlbGVjdCgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VsVHlwZUluc3BlY3RvcjtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgY3VycmVudCB0aW1lIGFzIGEgZGF0ZS90aW1lLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgdGhlIGN1cnJlbnQgdGltZSBhcyBhIGRhdGUvdGltLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuV2lkZ2V0cy5XaWRnZXRcbiAqIEBzZWUgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRpbWVGb3JtXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5SZWFkYWJsZVRpbWVGb3JtIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSB0aGUgY3VycmVudCB0aW1lLlxuICpcbiAqIFRoZSB0aW1lIChpbiBtcyBmcm9tIHRoZSAwMS8wMS8xOTcwKSBpcyBjb252ZXJ0ZWQgaW4gYVxuICogaHVtYW4gcmVhZGFibGUgZm9ybWF0IChhcyBvcHBvc2VkIHRvXG4gKiB7QGxpbmsgU2Ftb3RyYWNlcy5XaWRnZXRzLlRpbWVGb3JtfSB3aWRnZXRcbiAqIHdoaWNoIGRpc3BsYXkgcmF3IHRpbWUpLlxuICpcbiAqIFRoaXMgd2lkZ2V0IG9ic2VydmVzIGEgU2Ftb3RyYWNlcy5MaWIuVGltZXIgb2JqZWN0LlxuICogV2hlbiB0aGUgdGltZXIgY2hhbmdlcyB0aGUgbmV3IHRpbWUgaXMgZGlzcGxheWVkLlxuICogVGhpcyB3aWRnZXQgYWxzbyBhbGxvdyB0byBjaGFuZ2UgdGhlIHRpbWUgb2YgdGhlIHRpbWVyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0aHRtbF9pZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UaW1lcn0gdGltZXJcbiAqICAgICBUaW1lciBvYmplY3QgdG8gb2JzZXJ2ZS5cbiAqL1xudmFyIFJlYWRhYmxlVGltZUZvcm0gPSBmdW5jdGlvbihodG1sX2lkLCB0aW1lcikge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuXG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtUmVhZGFibGVUaW1lRm9ybScpO1xuXG4gIHRoaXMudGltZXIgPSB0aW1lcjtcbiAgdGhpcy50aW1lci5vbigndGltZXI6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuICB0aGlzLnRpbWVyLm9uKCd0aW1lcjpwbGF5OnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG4gIHRoaXMucmVmcmVzaCh7ZGF0YTogdGhpcy50aW1lci50aW1lfSk7XG59O1xuXG5SZWFkYWJsZVRpbWVGb3JtLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQ3VycmVudCB0aW1lOiAnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcblxuXG4gICAgdGhpcy55ZWFyX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ3llYXInKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCA0KTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnllYXJfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcvJykpO1xuXG4gICAgdGhpcy5tb250aF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ21vbnRoJyk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1vbnRoX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLycpKTtcblxuICAgIHRoaXMuZGF5X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdkYXknKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXlfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgLSAnKSk7XG5cbiAgICB0aGlzLmhvdXJfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnaG91cicpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaG91cl9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzonKSk7XG5cbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbWludXRlJyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWludXRlX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnOicpKTtcblxuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdzZWNvbmQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDgpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zZWNvbmRfZWxlbWVudCk7XG4gICAgLypcbiAgICBcdFx0dGhpcy5pbnB1dF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBcdFx0dGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsJ3RleHQnKTtcbiAgICBcdFx0dGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsJycpO1xuICAgIFx0XHR0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywxNSk7XG4gICAgXHRcdHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJyx0aGlzLnRpbWVyLnRpbWUpO1xuICAgIFx0XHRwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dF9lbGVtZW50KTtcbiovXG4gICAgdmFyIHN1Ym1pdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnc3VibWl0Jyk7XG4gICAgc3VibWl0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICdVcGRhdGUgdGltZScpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChzdWJtaXRfZWxlbWVudCk7XG5cbiAgICB0aGlzLmZvcm1fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICB0aGlzLmZvcm1fZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLmJ1aWxkX2NhbGxiYWNrKCdzdWJtaXQnKSk7XG5cbiAgICB0aGlzLmZvcm1fZWxlbWVudC5hcHBlbmRDaGlsZChwX2VsZW1lbnQpO1xuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZm9ybV9lbGVtZW50KTtcbiAgfSxcblxuICByZWZyZXNoOiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHRpbWUgPSBlLmRhdGFcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgZGF0ZS5zZXRUaW1lKHRpbWUpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnZhbHVlICAgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnZhbHVlICA9IGRhdGUuZ2V0TW9udGgoKSArIDE7XG4gICAgdGhpcy5kYXlfZWxlbWVudC52YWx1ZSAgICA9IGRhdGUuZ2V0RGF0ZSgpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnZhbHVlICAgPSBkYXRlLmdldEhvdXJzKCk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC52YWx1ZSA9IGRhdGUuZ2V0TWludXRlcygpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQudmFsdWUgPSBkYXRlLmdldFNlY29uZHMoKSArIGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwO1xuICB9LFxuXG4gIGJ1aWxkX2NhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciB0aW1lciA9IHRoaXMudGltZXI7XG4gICAgdmFyIHRpbWVfZm9ybSA9IHRoaXM7XG4gICAgc3dpdGNoIChldmVudCkge1xuICAgICAgY2FzZSAnc3VibWl0JzpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdXaWRnZXRCYXNpY1RpbWVGb3JtLnN1Ym1pdCcpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuXG4gICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgIGRhdGUuc2V0RnVsbFllYXIodGltZV9mb3JtLnllYXJfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZS5zZXRNb250aCh0aW1lX2Zvcm0ubW9udGhfZWxlbWVudC52YWx1ZSAtIDEpO1xuICAgICAgICAgIGRhdGUuc2V0RGF0ZSh0aW1lX2Zvcm0uZGF5X2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGUuc2V0SG91cnModGltZV9mb3JtLmhvdXJfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZS5zZXRNaW51dGVzKHRpbWVfZm9ybS5taW51dGVfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZS5zZXRTZWNvbmRzKHRpbWVfZm9ybS5zZWNvbmRfZWxlbWVudC52YWx1ZSk7XG5cbiAgICAgICAgICB0aW1lci5zZXQoZGF0ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWRhYmxlVGltZUZvcm07XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgdGhlIGN1cnJlbnQgdGltZSBhcyBhIG51bWJlci5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIHRoZSBjdXJyZW50IHRpbWUgYXMgYSBudW1iZXIuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQHNlZSBTYW1vdHJhY2VzLlVJLldpZGdldHMuUmVhZGFibGVUaW1lRm9ybVxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLlVJLldpZGdldHMuVGltZUZvcm0gaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIHRoZSBjdXJyZW50IHRpbWUuXG4gKlxuICogVGhlIHRpbWUgaXMgZGlzcGxheWVkIGFzIGEgbnVtYmVyLiBTZWVcbiAqIHtAbGluayBTYW1vdHJhY2VzLldpZGdldHMuVGltZUZvcm19IHRvIGNvbnZlcnRcbiAqIHJhdyB0aW1lIChpbiBtcyBmcm9tIHRoZSAwMS8wMS8xOTcwKSB0byBhIGh1bWFuIHJlYWRhYmxlXG4gKiBmb3JtYXQuXG4gKlxuICogVGhpcyB3aWRnZXQgb2JzZXJ2ZXMgYSBTYW1vdHJhY2VzLkxpYi5UaW1lciBvYmplY3QuXG4gKiBXaGVuIHRoZSB0aW1lciBjaGFuZ2VzIHRoZSBuZXcgdGltZSBpcyBkaXNwbGF5ZWQuXG4gKiBUaGlzIHdpZGdldCBhbHNvIGFsbG93IHRvIGNoYW5nZSB0aGUgdGltZSBvZiB0aGUgdGltZXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sX2lkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLlRpbWVyfSB0aW1lclxuICogICAgIFRpbWVyIG9iamVjdCB0byBvYnNlcnZlLlxuICovXG52YXIgVGltZUZvcm0gPSBmdW5jdGlvbihodG1sX2lkLCB0aW1lcikge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuXG4gIHRoaXMudGltZXIgPSB0aW1lcjtcbiAgdGhpcy50aW1lci5vbigndGltZXI6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuICB0aGlzLnRpbWVyLm9uKCd0aW1lcjpwbGF5OnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG4gIHRoaXMucmVmcmVzaCh7ZGF0YTogdGhpcy50aW1lci50aW1lfSk7XG59O1xuXG5UaW1lRm9ybS5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuICAgIHZhciBwX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0N1cnJlbnQgdGltZTogJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XG5cbiAgICB0aGlzLmlucHV0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAndGltZScpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAxNSk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCB0aGlzLnRpbWVyLnRpbWUpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmlucHV0X2VsZW1lbnQpO1xuXG4gICAgdmFyIHN1Ym1pdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnc3VibWl0Jyk7XG4gICAgc3VibWl0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICdVcGRhdGUgdGltZScpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChzdWJtaXRfZWxlbWVudCk7XG5cbiAgICB0aGlzLmZvcm1fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICB0aGlzLmZvcm1fZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLmJ1aWxkX2NhbGxiYWNrKCdzdWJtaXQnKSk7XG5cbiAgICB0aGlzLmZvcm1fZWxlbWVudC5hcHBlbmRDaGlsZChwX2VsZW1lbnQpO1xuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZm9ybV9lbGVtZW50KTtcbiAgfSxcblxuICByZWZyZXNoOiBmdW5jdGlvbihlKSB7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnZhbHVlID0gZS5kYXRhO1xuICB9LFxuXG4gIGJ1aWxkX2NhbGxiYWNrOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciB0aW1lciA9IHRoaXMudGltZXI7XG4gICAgdmFyIGlucHV0X2VsZW1lbnQgPSB0aGlzLmlucHV0X2VsZW1lbnQ7XG4gICAgc3dpdGNoIChldmVudCkge1xuICAgICAgY2FzZSAnc3VibWl0JzpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdXaWRnZXRCYXNpY1RpbWVGb3JtLnN1Ym1pdCcpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICB0aW1lci5zZXQoaW5wdXRfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZUZvcm07XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0aW1lIHNsaWRlci5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdGltZSBzbGlkZXIuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLlVJLldpZGdldHMuZDNCYXNpYy5UaW1lU2xpZGVyIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSB0aGUgY3VycmVudCB0aW1lIGluIGEgdGVtcG9yYWwgd2luZG93XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHRkaXZJZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB0aW1lX3dpbmRvd1xuICogICAgIFRpbWVXaW5kb3cgb2JqZWN0IC0+IHJlcHJlc2VudGluZyB0aGUgd2lkZSB3aW5kb3dcbiAqICAgICAoZS5nLiwgdGhlIHdob2xlIHRyYWNlKVxuICogQHBhcmFtIHRpbWVyXG4gKiAgICAgVGltZWVyIG9iamVjdCAtPiBjb250YWluaW5nIHRoZSBjdXJyZW50IHRpbWVcbiAqL1xudmFyIFRpbWVTbGlkZXIgPSBmdW5jdGlvbihodG1sX2lkLCB0aW1lX3dpbmRvdywgdGltZXIpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcblxuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVRpbWVTbGlkZXInKTtcbiAgJCh3aW5kb3cpLnJlc2l6ZSh0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy50aW1lciA9IHRpbWVyO1xuICB0aGlzLnRpbWVyLm9uKCd0aW1lcjp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudGltZXIub24oJ3RpbWVyOnBsYXk6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuXG4gIHRoaXMudGltZV93aW5kb3cgPSB0aW1lX3dpbmRvdztcbiAgdGhpcy50aW1lX3dpbmRvdy5vbigndHc6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuXG4gIC8vIHVwZGF0ZSBzbGlkZXIgc3R5bGVcbiAgdGhpcy5zbGlkZXJfb2Zmc2V0ID0gMDtcblxuICB0aGlzLmluaXRfRE9NKCk7XG4gIC8vIHVwZGF0ZSBzbGlkZXIncyBwb3NpdGlvblxuICB0aGlzLmRyYXcoKTtcblxufTtcblxuVGltZVNsaWRlci5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICAvLyBjcmVhdGUgdGhlIHNsaWRlclxuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zbGlkZXJfZWxlbWVudCk7XG5cbiAgICAvLyBoYW5kIG1hZGUgZHJhZyZkcm9wXG4gICAgdmFyIHdpZGdldCA9IHRoaXM7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCdjaGFuZ2VUaW1lT25EcmFnJywgdGhpcy5zbGlkZXJfZWxlbWVudCwge1xuICAgICAgb25VcENhbGxiYWNrOiBmdW5jdGlvbihkZWx0YV94KSB7XG4gICAgICAgIHZhciBuZXdfdGltZSA9IHdpZGdldC50aW1lci50aW1lICsgZGVsdGFfeCAqIHdpZGdldC50aW1lX3dpbmRvdy5nZXRfd2lkdGgoKSAvIHdpZGdldC5lbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICB3aWRnZXQudGltZXIuc2V0KG5ld190aW1lKTtcbiAgICAgIH0sXG4gICAgICBvbk1vdmVDYWxsYmFjazogZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgICAgIHZhciBvZmZzZXQgPSB3aWRnZXQuc2xpZGVyX29mZnNldCArIG9mZnNldDtcbiAgICAgICAgd2lkZ2V0LnNsaWRlcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnbGVmdDogJyArIG9mZnNldCArICdweDsnKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zbGlkZXJfb2Zmc2V0ID0gKHRoaXMudGltZXIudGltZSAtIHRoaXMudGltZV93aW5kb3cuc3RhcnQpICogdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy50aW1lX3dpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnNsaWRlcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnbGVmdDonICsgdGhpcy5zbGlkZXJfb2Zmc2V0ICsgJ3B4OyBkaXNwbGF5OiBibG9jazsnKTtcbiAgfSxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lU2xpZGVyO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdHJhY2Ugd2hlcmUgb2JzZWxzIGFyZSBkaXNwbGF5ZWQgYXMgaW1hZ2VzLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0cmFjZSB3aGVyZSBvYnNlbHMgYXJlIGRpc3BsYXllZCBhcyBpbWFnZXNcbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgZDMuanMgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9kM2pzLm9yZ1wiPmQzanMub3JnPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIHtAbGluayBTYW1vdHJhY2VzLlVJLldpZGdldHMuVHJhY2VEaXNwbGF5SWNvbnN8VHJhY2VEaXNwbGF5SWNvbnN9IHdpZGdldFxuICogaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIHRyYWNlcyB3aXRoIGltYWdlcy4gVGhpcyB3aWRnZXQgdXNlc1xuICogZDMuanMgdG8gZGlzcGxheSB0cmFjZXMgYXMgaW1hZ2VzIGluIGEgU1ZHIGltYWdlLlxuICogVGhlIGRlZmF1bHQgc2V0dGluZ3MgYXJlIHNldCB1cCB0byB2aXN1YWxpc2UgMTZ4MTYgcGl4ZWxzXG4gKiBpY29ucy4gSWYgbm8gdXJsIGlzIGRlZmluZWQgKHNlZSBvcHRpb25zKSwgYSBxdWVzdGlvbm1hcmtcbiAqIGljb24gd2lsbCBiZSBkaXNwbGF5ZWQgYnkgZGVmYXVsdCBmb3IgZWFjaCBvYnNlbC5cbiAqXG4gKiBOb3RlIHRoYXQgY2xpY2tpbmcgb24gYW4gb2JzZWwgd2lsbCB0cmlnZ2VyIGFcbiAqIHtAbGluayBTYW1vdHJhY2VzLlVJLldpZGdldHMuVHJhY2VEaXNwbGF5SWNvbnMjdWk6Y2xpY2s6b2JzZWx8dWk6Y2xpY2s6b2JzZWx9XG4gKiBldmVudC5cbiAqXG4gKiBUdXRvcmlhbHMge0B0dXRvcmlhbCB0dXRvMS4xX3RyYWNlX3Zpc3VhbGlzYXRpb259LFxuICoge0B0dXRvcmlhbCB0dXRvMS4yX2FkZGluZ193aWRnZXRzfSwgYW5kXG4gKiB7QHR1dG9yaWFsIHR1dG8xLjNfdmlzdWFsaXNhdGlvbl9wZXJzb25hbGlzYXRpb259IGlsbHVzdHJhdGVzXG4gKiBpbiBtb3JlIGRldGFpbHMgaG93IHRvIHVzZSB0aGlzIGNsYXNzLlxuICogQHBhcmFtIHtTdHJpbmd9XHRkaXZJZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7VHJhY2V9XHR0cmFjZVxuICogICAgIFRyYWNlIG9iamVjdCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge1RpbWVXaW5kb3d9IHRpbWVfd2luZG93XG4gKiAgICAgVGltZVdpbmRvdyBvYmplY3QgdGhhdCBkZWZpbmVzIHRoZSB0aW1lIGZyYW1lXG4gKiAgICAgYmVpbmcgY3VycmVudGx5IGRpc3BsYXllZC5cbiAqXG4gKiBAcGFyYW0ge1Zpc3VDb25maWd9IFtvcHRpb25zXVxuICogICAgIE9iamVjdCBkZXRlcm1pbmluZyBob3cgdG8gZGlzcGxheSB0aGUgaWNvbnNcbiAqICAgICAoT3B0aW9uYWwpLiBBbGwgdGhlIG9wdGlvbnMgZmllbGQgY2FuIGJlIGVpdGhlclxuICogICAgIGEgdmFsdWUgb3IgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIGJ5XG4gKiAgICAgZDMuanMuIFRoZSBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgYXMgdGhlIGZpcnN0XG4gKiAgICAgYXJndW1lbnQgdGhlIE9ic2VsIHRvIGRpc3BsYXkgYW5kIHNob3VsZCByZXR1cm5cbiAqICAgICB0aGUgY2FsY3VsYXRlZCB2YWx1ZS5cbiAqICAgICBJZiBhIGZ1bmN0aW9uIGlzIGRlZmluZWQgYXMgYW4gYXJndW1lbnQsIGl0IHdpbGxcbiAqICAgICBiZSBiaW5kZWQgdG8gdGhlIFRyYWNlRGlzcGxheUljb25zIGluc3RhbmNlLlxuICogICAgIFRoaXMgbWVhbnMgdGhhdCB5b3UgY2FuIGNhbGwgYW55IG1ldGhvZCBvZiB0aGVcbiAqICAgICBUcmFjZURpc3BsYXlJY29ucyBpbnN0YW5jZSB0byBoZWxwIGNhbGN1bGF0ZVxuICogICAgIHRoZSB4IHBvc2l0aW9uIG9yIHkgcG9zaXRpb24gb2YgYW4gaWNvbi4gVGhpc1xuICogICAgIG1ha2VzIGl0IGVhc3kgdG8gZGVmaW5lIHZhcmlvdXMgdHlwZXMgb2YgYmVoYXZpb3Vycy5cbiAqICAgICBSZWxldmFudCBtZXRob2RzIHRvIHVzZSBhcmU6XG4gKiAgICAgbGluayBTYW1vdHJhY2VzLlVJLldpZGdldHMuVHJhY2VEaXNwbGF5SWNvbnMuY2FsY3VsYXRlX3h9XG4gKiAgICAgU2VlIHR1dG9yaWFsXG4gKiAgICAge0B0dXRvcmlhbCB0dXRvMS4zX3Zpc3VhbGlzYXRpb25fcGVyc29uYWxpc2F0aW9ufVxuICogICAgIGZvciBtb3JlIGRldGFpbHMgYW5kIGV4YW1wbGVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgb3B0aW9ucyA9IHtcbiAqICAgICB5OiAyMCxcbiAqICAgICB3aWR0aDogMzIsXG4gKiAgICAgaGVpZ2h0OiAzMixcbiAqICAgICB1cmw6IGZ1bmN0aW9uKG9ic2VsKSB7XG4gKiAgICAgICAgIHN3aXRjaChvYnNlbC50eXBlKSB7XG4gKiAgICAgICAgICAgICBjYXNlICdjbGljayc6XG4gKiAgICAgICAgICAgICAgICAgcmV0dXJuICdpbWFnZXMvY2xpY2sucG5nJztcbiAqICAgICAgICAgICAgIGNhc2UgJ2ZvY3VzJzpcbiAqICAgICAgICAgICAgICAgICByZXR1cm4gJ2ltYWdlcy9mb2N1cy5wbmcnO1xuICogICAgICAgICAgICAgZGVmYXVsdDpcbiAqICAgICAgICAgICAgICAgICByZXR1cm4gJ2ltYWdlcy9kZWZhdWx0LnBuZyc7XG4gKiAgICAgICAgIH1cbiAqICAgICB9XG4gKiB9O1xuICovXG52YXIgVHJhY2VEaXNwbGF5SWNvbnMgPSBmdW5jdGlvbihkaXZJZCwgdHJhY2UsIHRpbWVfd2luZG93LCBvcHRpb25zKSB7XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBkaXZJZCk7XG5cbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1UcmFjZURpc3BsYXlJY29ucycpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuXG4gIHRoaXMudHJhY2UgPSB0cmFjZTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnJlbW92ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMub2JzZWxfcmVkcmF3LmJpbmQodGhpcykpO1xuXG4gIHRoaXMud2luZG93ID0gdGltZV93aW5kb3c7XG4gIHRoaXMud2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMudHJhbnNsYXRlX3guYmluZCh0aGlzKSk7XG5cbiAgLy9cdHRoaXMub2JzZWxfc2VsZWN0b3IgPSBvYnNlbF9zZWxlY3RvcjtcbiAgLy9cdHRoaXMud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJycsdGhpcy4uYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7XG4gIC8vdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuXG5cbiAgLyoqXG4gIFx0ICogVmlzdUNvbmZpZyBpcyBhIHNob3J0bmFtZSBmb3IgdGhlXG4gIFx0ICoge0BsaW5rIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29ucy5WaXN1Q29uZmlnfVxuICBcdCAqIG9iamVjdC5cbiAgXHQgKiBAdHlwZWRlZiBWaXN1Q29uZmlnXG4gIFx0ICogQHNlZSBTYW1vdHJhY2VzLlVJLldpZGdldHMuVHJhY2VEaXNwbGF5SWNvbnMuVmlzdUNvbmZpZ1xuICBcdCAqL1xuICAvKipcbiAgXHQgKiBAdHlwZWRlZiBTYW1vdHJhY2VzLlVJLldpZGdldHMuVHJhY2VEaXNwbGF5SWNvbnMuVmlzdUNvbmZpZ1xuICBcdCAqIEBwcm9wZXJ0eSB7KG51bWJlcnxmdW5jdGlvbil9XHRbeF1cbiAgXHQgKiAgICAgWCBjb29yZGluYXRlcyBvZiB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZVxuICBcdCAqICAgICBpbWFnZSAoZGVmYXVsdDogPGNvZGU+ZnVuY3Rpb24obykge1xuICBcdCAqICAgICAgICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlX3goby50aW1lc3RhbXApIC0gODtcbiAgXHQgKiAgICAgfSk8L2NvZGU+KVxuICBcdCAqIEBwcm9wZXJ0eSB7KG51bWJlcnxmdW5jdGlvbil9XHRbeT0xN11cbiAgXHQgKiAgICAgWSBjb29yZGluYXRlcyBvZiB0aGUgdG9wLWxlZnQgY29ybmVyIG9mIHRoZVxuICBcdCAqICAgICBpbWFnZVxuICBcdCAqIEBwcm9wZXJ0eSB7KG51bWJlcnxmdW5jdGlvbil9XHRbd2lkdGg9MTZdXG4gIFx0ICogICAgIFdpZHRoIG9mIHRoZSBpbWFnZVxuICBcdCAqIEBwcm9wZXJ0eSB7KG51bWJlcnxmdW5jdGlvbil9XHRbaGVpZ2h0PTE2XVxuICBcdCAqICAgICBIZWlnaHQgb2YgdGhlIGltYWdlXG4gIFx0ICogQHByb3BlcnR5IHsoc3RyaW5nfGZ1bmN0aW9uKX1cdFt1cmw9YSBxdWVzdGlvbm1hcmsgZGF0YXVybCBzdHJpbmddXG4gIFx0ICogICAgIFVybCBvZiB0aGUgaW1hZ2UgdG8gZGlzcGxheVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIE9iamVjdCBkZXRlcm1pbmluZyBob3cgdG8gZGlzcGxheSB0aGUgaWNvbnNcbiAgXHQgKiAoT3B0aW9uYWwpLiBBbGwgdGhlIG9wdGlvbnMgZmllbGQgY2FuIGJlIGVpdGhlclxuICBcdCAqIGEgdmFsdWUgb3IgYSBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgY2FsbGVkIGJ5XG4gIFx0ICogZDMuanMuIFRoZSBmdW5jdGlvbiB3aWxsIHJlY2VpdmUgYXMgdGhlIGZpcnN0XG4gIFx0ICogYXJndW1lbnQgdGhlIE9ic2VsIHRvIGRpc3BsYXkgYW5kIHNob3VsZCByZXR1cm5cbiAgXHQgKiB0aGUgY2FsY3VsYXRlZCB2YWx1ZS5cbiAgXHQgKiBJZiBhIGZ1bmN0aW9uIGlzIGRlZmluZWQgYXMgYW4gYXJndW1lbnQsIGl0IHdpbGxcbiAgXHQgKiBiZSBiaW5kZWQgdG8gdGhlIFRyYWNlRGlzcGxheUljb25zIGluc3RhbmNlLlxuICBcdCAqIFRoaXMgbWVhbnMgdGhhdCB5b3UgY2FuIGNhbGwgYW55IG1ldGhvZCBvZiB0aGVcbiAgXHQgKiBUcmFjZURpc3BsYXlJY29ucyBpbnN0YW5jZSB0byBoZWxwIGNhbGN1bGF0ZVxuICBcdCAqIHRoZSB4IHBvc2l0aW9uIG9yIHkgcG9zaXRpb24gb2YgYW4gaWNvbi4gVGhpc1xuICBcdCAqIG1ha2VzIGl0IGVhc3kgdG8gZGVmaW5lIHZhcmlvdXMgdHlwZXMgb2YgYmVoYXZpb3Vycy5cbiAgXHQgKiBSZWxldmFudCBtZXRob2RzIHRvIHVzZSBhcmU6XG4gIFx0ICogbGluayBTYW1vdHJhY2VzLlVJLldpZGdldHMuVHJhY2VEaXNwbGF5SWNvbnMuY2FsY3VsYXRlX3h9XG4gIFx0ICogU2VlIHR1dG9yaWFsXG4gIFx0ICoge0B0dXRvcmlhbCB0dXRvMS4zX3Zpc3VhbGlzYXRpb25fcGVyc29uYWxpc2F0aW9ufVxuICBcdCAqIGZvciBtb3JlIGRldGFpbHMgYW5kIGV4YW1wbGVzLlxuICBcdCAqL1xuICAvLyBjcmVhdGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHZhbHVlIG9yIGZ1bmN0aW9uXG4gIHZhciB0aGlzX3dpZGdldCA9IHRoaXM7XG4gIHZhciBiaW5kX2Z1bmN0aW9uID0gZnVuY3Rpb24odmFsX29yX2Z1bikge1xuICAgIGlmICh2YWxfb3JfZnVuIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIHJldHVybiB2YWxfb3JfZnVuLmJpbmQodGhpc193aWRnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bjtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5vcHRpb25zID0ge307XG4gIHRoaXMub3B0aW9ucy54ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnggfHwgZnVuY3Rpb24obykge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZV94KG8uZ2V0X2JlZ2luKCkpIC0gODtcbiAgfSk7XG4gIHRoaXMuc3R5bGVzaGVldCA9IG9wdGlvbnMgO1xuICAvL3RoaXMub3B0aW9ucy55ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnkgfHwgMTcpO1xuICAvL3RoaXMub3B0aW9ucy53aWR0aCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy53aWR0aCB8fCAxNik7XG4gIC8vdGhpcy5vcHRpb25zLmhlaWdodCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy5oZWlnaHQgfHwgMTYpO1xuICAvL3RoaXMub3B0aW9ucy51cmwgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMudXJsIHx8ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQUc3QUFBQnV3QkhuVTROUUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFLc1NVUkJWRGlOclpOTGFGTnBGTWQvMzNmdlRhNXRZcHVxMHlhdEZXdWdSaEVYdzlBdWhKRVpCQ2tpcUpXQ0lFcnJ4cDI0MUM2TDY2NTBNL1dCb3d1bm95Q0RDaktyR1laMEliaXd4a2RVYkd5YVBtZ1NtOGQ5ZjI1TWJYVWx6SDk1enYvOE9PZHdqbEJLc1ZhalUxa0V0Smlhdk5Cc2FLY0JxcTUvM2ZLRFN3cktZMzNKZFg3UkFJeE9aUUdNM2JISXltQ3lQWmhacVQ4cDJkNHNRR3RZNyt5T2J2aHhNanN2cDR1VktPQTJRRUlweGVoVUZsMkl2dUZVWjNyWmN1Lys5WDdSV3FnN0p4dy9RQUZoVGRMUkZKb1k2TjRTYXpPTm8xY3pzLzJlVWxOamZVbjBSaXNuZStQcDl5djE4VHZad3JsOWlWYjJKMkpFUWhvS0tOa2U2VUo1NUxmTUI0YVNIZU1uZStQcGF5L3lBa0JjVEw5bWE3TnA3WXUzL24xbE9qZFE4d0xPNzkzR3psZ3pGZGNqWXVqb1VwQXQxN2o4TElmakI1emR2ZlhCdjNPbFgzTlZ5NVNBT0pWS2hQOTRNMjlVWEI4RkZHb1dFODludWZUa0hROW5GbEVLZWpadW9MZTFpWXJyOCtmYmVlOVVLaEVHaEI2U1lyQm91ZFBMdG5zQVFDbkY3NjhLcTF2MkF4QUM2bDdBc3VVQ3NHUzVoNHVXT3gyU1lsQnFRb3lVSFcvTzlnTysxaTlkYmZ5Y2lLR0Evd29sM3BUckFOaCtRTm54NWpRaFJ1UTNWWisxWjFPVWc5MmJpWmtHLytTTDNIdTdnUGZWelFCSVg2bUpscEFlRDJ2cldkczNtdGgrd090U2xVY3pTMVJkZnpVWDFpUXRJVDN1S3pXaE80R2FqSm5HbmMybWNmK2o0eDF1bUo0dVZTaFViUlN3VUhQV3dkdkN4dU9ZYVJ4d0FqVXBBWFVqazdlUDliVHJFVU5iTmYzMFE1VGhYVjBjNldrbkd2b1NqeGdheDNlMHV6Y3llUnRRY3F3dlNhNXFtYVl1QjRhU0hlTU5pRUpnYWhKOXpXUVJRMk1vMlRGdTZuSWdWN1hNZFpkNDgrVmMvM0NxTTMwbTFYWDN3Y3hpOGQzSDJzaXRsM21VQUNrRXlaYW0yNGUyYlRIYlRPUGMxY3hzZjZQdS8zbW10ZnJlZC80RVNRTktYRzhWQUNvQUFBQUFTVVZPUks1Q1lJST0nKTtcblxuICB0aGlzLmRyYXcoKTtcbn07XG5cblRyYWNlRGlzcGxheUljb25zLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG5cbiAgICAvL3ZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCgnIycrdGhpcy5pZCk7XG4gICAgdmFyIGRpdl9lbG10ID0gZDMuc2VsZWN0KHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5zdmcgPSBkaXZfZWxtdC5hcHBlbmQoJ3N2ZycpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSAocmVkKSBsaW5lIHJlcHJlc2VudGluZyBjdXJyZW50IHRpbWVcbiAgICBpZiAodHlwZW9mICh0aGlzLndpbmRvdy50aW1lcikgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0cigneDEnLCAnNTAlJylcbiAgICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgICAuYXR0cigneDInLCAnNTAlJylcbiAgICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgIC5hdHRyKCdzdHJva2UnLCAncmVkJylcbiAgICAgIC5hdHRyKCdvcGFjaXR5JywgJzAuMycpO1xuICAgIH1cblxuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG5cbiAgICB0aGlzLnN2Z19ncCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHRoaXMuc3ZnX3NlbGVjdGVkX29ic2VsID0gdGhpcy5zdmcuYXBwZW5kKCdsaW5lJylcbiAgICAuYXR0cigneDEnLCAnMCcpXG4gICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAuYXR0cigneDInLCAnMCcpXG4gICAgLmF0dHIoJ3kyJywgJzEwMCUnKVxuICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAuYXR0cignc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAuYXR0cignb3BhY2l0eScsICcwLjMnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAgIC5zdHlsZSgnZGlzcGxheScsICdub25lJyk7XG5cbiAgICAvLyBldmVudCBsaXN0ZW5lcnNcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcztcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoJ2NoYW5nZVRpbWVPbkRyYWcnLCB0aGlzLmVsZW1lbnQsIHtcbiAgICAgIG9uVXBDYWxsYmFjazogZnVuY3Rpb24oZGVsdGFfeCkge1xuICAgICAgICB2YXIgdGltZV9kZWx0YSA9IC1kZWx0YV94ICogd2lkZ2V0LndpbmRvdy5nZXRfd2lkdGgoKSAvIHdpZGdldC5lbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICB3aWRnZXQuc3ZnX2dwLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICgtd2lkZ2V0LnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICAgICAgICB3aWRnZXQud2luZG93LnRyYW5zbGF0ZSh0aW1lX2RlbHRhKTtcbiAgICAgIH0sXG4gICAgICBvbk1vdmVDYWxsYmFjazogZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgICAgIHdpZGdldC5zdmdfZ3AuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9mZnNldCAtIHdpZGdldC50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCd6b21tT25TY3JvbGwnLCB0aGlzLmVsZW1lbnQsIHt0aW1lV2luZG93OiB0aGlzLndpbmRvd30pO1xuICB9LFxuXG5cbiAgLy8gVE9ETzogbmVlZHMgdG8gYmUgbmFtZWQgZm9sbG93aW5nIGEgY29udmVudGlvblxuICAvLyB0byBiZSBkZWNpZGVkIG9uXG4gIC8qKlxuICBcdCAqIENhbGN1bGF0ZXMgdGhlIFggcG9zaXRpb24gaW4gcGl4ZWxzIGNvcnJlc3BvbmRpbmcgdG9cbiAgXHQgKiB0aGUgdGltZSBnaXZlbiBpbiBwYXJhbWV0ZXIuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgVGltZSBmb3Igd2hpY2ggdG8gc2VlayB0aGUgY29ycmVzcG9uZGluZyB4IHBhcmFtZXRlclxuICBcdCAqL1xuICBjYWxjdWxhdGVfeDogZnVuY3Rpb24odGltZSkge1xuXG4gICAgdmFyIHggPSAodGltZSAtIHRoaXMud2luZG93LnN0YXJ0KSAqIHRoaXMuc2NhbGVfeCArIHRoaXMudHJhbnNsYXRlX29mZnNldDtcbiAgICByZXR1cm4geDtcbiAgfSxcbiAgdHJhbnNsYXRlX3g6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgdGltZV9kZWx0YSA9IGUuZGF0YTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgKz0gdGltZV9kZWx0YSAqIHRoaXMuc2NhbGVfeDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAoLXRoaXMudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gIH0sXG5cbiAgcmVmcmVzaF94OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5hdHRyKCd4JywgdGhpcy5vcHRpb25zLngpXG4gICAgLmF0dHIoJ3knLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwneScpKTsgfSk7XG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIGlmIChlKSB7XG4gICAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgICBjYXNlIFwidHJhY2U6dXBkYXRlXCI6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDsgLy8gZG8gbm90IHdhbnQgdG8gdHJpZ2dlciB0aGUgcmVmcmVzaGluZyBvZiBsaXN0X29ic2VscygpLi4uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5leGl0KClcbiAgICAucmVtb3ZlKCk7XG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKCdpbWFnZScpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgIC5hdHRyKCd4JywgdGhpcy5vcHRpb25zLngpXG4gICAgLmF0dHIoJ3knLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwneScpKTsgfSlcbiAgICAuYXR0cignd2lkdGgnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnd2lkdGgnKSk7IH0pXG4gICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdoZWlnaHQnKSk7IH0pXG4gICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnaWNvbicpKTsgfSk7XG4gICAgLy8gU3RvcmluZyBvYnNlbCBkYXRhIHdpdGggalF1ZXJ5IGZvciBhY2Nlc3NpYmlsaXR5IGZyb21cbiAgICAvLyBldmVudHMgZGVmaW5lZCBieSB1c2VycyB3aXRoIGpRdWVyeVxuICAgICQoJ2ltYWdlJywgdGhpcy5lbGVtZW50KS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAkLmRhdGEoZWwsIHtcbiAgICAgICAgJ1NhbW90cmFjZXMtdHlwZSc6ICdvYnNlbCcsXG4gICAgICAgICdTYW1vdHJhY2VzLWRhdGEnOiBkMy5zZWxlY3QoZWwpLmRhdHVtKClcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIG9ic2VsX3JlZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIHZhciBvYnMgPSBlLmRhdGE7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdmFyIHNlbCA9IHRoaXMuZDNPYnNlbHMoKVxuXHRcdFx0LmZpbHRlcihmdW5jdGlvbihvKSB7XG4gIC8vXHRcdFx0XHRjb25zb2xlLmxvZygnZGF0YTppZCxvYnNlbF9lZGl0X2lkJyxpZCxvYnMuZ2V0X2lkKCksaWQgPT0gb2JzLmdldF9pZCgpKTtcbiAgcmV0dXJuIG8uZ2V0X2lkKCkgPT0gb2JzLmdldF9pZCgpO1xuXHRcdFx0fSlcblx0XHRcdC5kYXR1bShvYnMpXG5cdFx0XHQuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuXHRcdFx0LmF0dHIoJ3knLCAgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3knKSk7IH0pXG5cdFx0XHQuYXR0cignd2lkdGgnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnd2lkdGgnKSk7IH0pXG5cdFx0XHQuYXR0cignaGVpZ2h0JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2hlaWdodCcpKTt9KVxuXHRcdFx0LmF0dHIoJ3hsaW5rOmhyZWYnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnaWNvbicpKTsgfSk7XG4gIH0sXG5cbiAgZDNPYnNlbHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN2Z19ncFxuICAgIC5zZWxlY3RBbGwoJ2NpcmNsZSxpbWFnZSxyZWN0JylcbiAgICAvLyBUT0RPOiBBVFRFTlRJT04hIFdBUk5JTkchIG9ic2VscyBNVVNUIGhhdmUgYSBmaWVsZCBpZCAtPiB1c2VkIGFzIGEga2V5LlxuICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7IC8vIFRPRE86IGJvZ3VlIGluIGNhc2Ugbm8gSUQgZXhpc3RzIC0+IG1pZ2h0IGhhcHBlbiB3aXRoIEtUQlMgdHJhY2VzIGFuZCBuZXcgb2JzZWxzXG4gIH0sXG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZURpc3BsYXlJY29ucztcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbnZhciBUcmFjZURpc3BsYXlJY29uc0ZpeCA9IGZ1bmN0aW9uKGRpdklkLCB0cmFjZUlOSVRJQSwgdGltZV93aW5kb3csIHRpbWVfd2luZG93X1pvb20sIG9wdGlvbnMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGRpdklkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1UcmFjZURpc3BsYXlJY29ucycpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlID0gdHJhY2VJTklUSUE7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdyA9IHRpbWVfd2luZG93O1xuICB0aGlzLndpbmRvd1pvb20gPSB0aW1lX3dpbmRvd19ab29tO1xuICAvL3RoaXMud2luZG93Lm9uKCd0dzp1cGRhdGUnLHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICAvL3RoaXMud2luZG93Lm9uKCd0dzp0cmFuc2xhdGUnLHRoaXMudHJhbnNsYXRlX3guYmluZCh0aGlzKSk7XG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0O1xuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuICB2YXIgYmluZF9mdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbF9vcl9mdW4pIHtcbiAgICBpZiAodmFsX29yX2Z1biBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bi5iaW5kKHRoaXNfd2lkZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW47XG4gICAgfVxuICB9O1xuXG4vKiAgdGhpcy5vcHRpb25zLnkgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueSB8fCAxNyk7XG4gIHRoaXMub3B0aW9ucy53aWR0aCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy53aWR0aCB8fCAxNik7XG4gIHRoaXMub3B0aW9ucy5oZWlnaHQgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMuaGVpZ2h0IHx8IDE2KTtcbiAgdGhpcy5vcHRpb25zLnVybCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy51cmwgfHwgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBRzdBQUFCdXdCSG5VNE5RQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUtzU1VSQlZEaU5yWk5MYUZOcEZNZC8zM2Z2VGE1dFlwdXEweWF0Rld1Z1JoRVh3OUF1aEpFWkJDa2lxSldDSUVycnhwMjQxQzZMNjY1ME0vV0Jvd3Vub3lDRENqS3JHWVowSWJpd3hrZFViR3lhUG1nU204ZDlmMjVNYlhVbHpIOTV6di84T09kd2psQktzVmFqVTFrRXRKaWF2TkJzYUtjQnFxNS8zZktEU3dyS1kzM0pkWDdSQUl4T1pRR00zYkhJeW1DeVBaaFpxVDhwMmQ0c1FHdFk3K3lPYnZoeE1qc3ZwNHVWS09BMlFFSXB4ZWhVRmwySXZ1RlVaM3JaY3UvKzlYN1JXcWc3Snh3L1FBRmhUZExSRkpvWTZONFNhek9ObzFjenMvMmVVbE5qZlVuMFJpc25lK1BwOXl2MThUdlp3cmw5aVZiMkoySkVRaG9LS05rZTZVSjU1TGZNQjRhU0hlTW5lK1BwYXkveUFrQmNUTDltYTdOcDdZdTMvbjFsT2pkUTh3TE83OTNHemxnekZkY2pZdWpvVXBBdDE3ajhMSWZqQjV6ZHZmWEJ2M09sWDNOVnk1U0FPSlZLaFA5NE0yOVVYQjhGRkdvV0U4OW51ZlRrSFE5bkZsRUtlalp1b0xlMWlZcnI4K2ZiZWU5VUtoRUdoQjZTWXJCb3VkUEx0bnNBUUNuRjc2OEtxMXYyQXhBQzZsN0FzdVVDc0dTNWg0dVdPeDJTWWxCcVFveVVIVy9POWdPKzFpOWRiZnljaUtHQS93b2wzcFRyQU5oK1FObng1alFoUnVRM1ZaKzFaMU9VZzkyYmlaa0cvK1NMM0h1N2dQZlZ6UUJJWDZtSmxwQWVEMnZyV2RzM210aCt3T3RTbFVjelMxUmRmelVYMWlRdElUM3VLeldoTzRHYWpKbkduYzJtY2YrajR4MXVtSjR1VlNoVWJSU3dVSFBXd2R2Q3h1T1lhUnh3QWpVcEFYVWprN2VQOWJUckVVTmJOZjMwUTVUaFhWMGM2V2tuR3ZvU2p4Z2F4M2UwdXpjeWVSdFFjcXd2U2E1cW1hWXVCNGFTSGVNTmlFSmdhaEo5eldRUlEyTW8yVEZ1Nm5JZ1Y3WE1kWmQ0OCtWYy8zQ3FNMzBtMVhYM3djeGk4ZDNIMnNpdGwzbVVBQ2tFeVphbTI0ZTJiVEhiVE9QYzFjeHNmNlB1LzNtbXRmcmVkLzRFU1FOS1hHOFZBQ29BQUFBQVNVVk9SSzVDWUlJPScpO1xuICAqL1xuXG4gIHRoaXMub3B0aW9ucyA9IHt9O1xuICB0aGlzLm9wdGlvbnMueCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy54IHx8IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKSAtIDg7XG4gIH0pO1xuICB0aGlzLnN0eWxlc2hlZXQgPSBvcHRpb25zIDtcbiAgdGhpcy5kcmF3KCk7XG59O1xuXG5UcmFjZURpc3BsYXlJY29uc0ZpeC5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgZGl2X2VsbXQgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJyk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIChyZWQpIGxpbmUgcmVwcmVzZW50aW5nIGN1cnJlbnQgdGltZVxuICAgIGlmICh0eXBlb2YgKHRoaXMud2luZG93LnRpbWVyKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyKCd4MScsICc1MCUnKVxuICAgICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAgIC5hdHRyKCd4MicsICc1MCUnKVxuICAgICAgLmF0dHIoJ3kyJywgJzEwMCUnKVxuICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsICcxcHgnKVxuICAgICAgLmF0dHIoJ3N0cm9rZScsICdyZWQnKVxuICAgICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB2YXIgeCA9IGQzLnRpbWUuc2NhbGUoKSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgIC8vIC5kb21haW4oW25ldyBEYXRlKDIwMTQsIDQsIDEpLCBuZXcgRGF0ZSgyMDE0LCA0LCAxNSkgLSAxXSlcbiAgICAgIC5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKVxuICAgICAgLnJhbmdlKFswLCB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGhdKTtcbiAgICB0aGlzLnN2Z19ncCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdGhpcy5zdmdfc2VsZWN0ZWRfb2JzZWwgPSB0aGlzLnN2Zy5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgIC5hdHRyKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAgICAgLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICB0aGlzLmFkZGJydXNoKCk7XG4gIH0sXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZSxpbWFnZSxyZWN0JylcbiAgICAgIC8vIFRPRE86IEFUVEVOVElPTiEgV0FSTklORyEgb2JzZWxzIE1VU1QgaGF2ZSBhIGZpZWxkIGlkIC0+IHVzZWQgYXMgYSBrZXkuXG4gICAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7IC8vIFRPRE86IGJvZ3VlIGluIGNhc2Ugbm8gSUQgZXhpc3RzIC0+IG1pZ2h0IGhhcHBlbiB3aXRoIEtUQlMgdHJhY2VzIGFuZCBuZXcgb2JzZWxzXG4gIH0sXG4gIGNhbGN1bGF0ZV94OiBmdW5jdGlvbih0aW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuICh0aW1lIC0gdGhpcy53aW5kb3cuc3RhcnQpICogdGhpcy5zY2FsZV94ICsgdGhpcy50cmFuc2xhdGVfb2Zmc2V0O1xuICB9LFxuICB0cmFuc2xhdGVfeDogZnVuY3Rpb24oZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGNvbnNvbGUubG9nIChcInRyYW5zbGF0ZVwiKTtcbiAgICB2YXIgdGltZV9kZWx0YSA9IGUuZGF0YTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgKz0gdGltZV9kZWx0YSAqIHRoaXMuc2NhbGVfeDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAoLXRoaXMudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gIH0sXG4gIGFkZGJydXNoOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbWFyZ2luID0ge3RvcDogMjAwLCByaWdodDogNDAsIGJvdHRvbTogMjAwLCBsZWZ0OiA0MH0sXG4gICAgICBoZWlnaHQgPSA1MDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgICB2YXIgeCA9IGQzLnRpbWUuc2NhbGUoKVxuICAgIC5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKVxuICAgIC5yYW5nZShbMCwgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXSk7XG5cbiAgICB2YXIgYnJ1c2hlbmRlZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGV4dGVuZDAgPSB3aWRnZXQuYnJ1c2hQLmV4dGVudCgpO1xuICAgICAgd2lkZ2V0LndpbmRvd1pvb20uc2V0X3N0YXJ0IChuZXcgRGF0ZShleHRlbmQwWzBdKS5nZXRUaW1lKCkpO1xuICAgICAgd2lkZ2V0LndpbmRvd1pvb20uc2V0X2VuZCAobmV3IERhdGUoZXh0ZW5kMFsxXSkuZ2V0VGltZSgpKTtcbiAgICB9O1xuXG4gICAgdmFyIGJydXNoID0gZDMuc3ZnLmJydXNoKClcbiAgICAgIC54KHgpXG4gICAgICAub24oXCJicnVzaGVuZFwiLCBicnVzaGVuZGVkKTtcbiAgICB0aGlzLmJydXNoUCA9IGJydXNoO1xuICAgIHRoaXMuZ0JydXNoID0gdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKVxuICAgICAgLmF0dHIoXCJjbGFzc1wiLCBcImJydXNoXCIpXG4gICAgICAuYXR0cignaWQnLCAnYnJ1c2gnKVxuICAgICAgLmNhbGwoYnJ1c2gpXG4gICAgICAuYXR0cihcIndpZHRoXCIsIFwiMTg0MFwiKTtcbiAgICB0aGlzLmdCcnVzaC5zZWxlY3RBbGwoXCJyZWN0XCIpXG4gICAgICAuYXR0cihcImhlaWdodFwiLCBoZWlnaHQpO1xuICAgIHZhciB3aWRnZXQgPSB0aGlzO1xuICB9LFxuICBkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKGUpIHtcbiAgICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0cmFjZTp1cGRhdGVcIjpcbiAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuXG4gICAgICAgIC8vdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2Vscyh0aGlzLndpbmRvdy5zdGFydCx0aGlzLndpbmRvdy5lbmQpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0OyAvLyBkbyBub3Qgd2FudCB0byB0cmlnZ2VyIHRoZSByZWZyZXNoaW5nIG9mIGxpc3Rfb2JzZWxzKCkuLi5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgICAgLmV4aXQoKVxuICAgICAgLnJlbW92ZSgpO1xuICAgICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgnaW1hZ2UnKVxuICAgICAgLmF0dHIoJ2NsYXNzJywgJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcbiAgICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3knKSk7IH0pXG4gICAgICAuYXR0cignd2lkdGgnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnd2lkdGgnKSk7IH0pXG4gICAgICAuYXR0cignaGVpZ2h0JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2hlaWdodCcpKTsgfSlcbiAgICAgIC5hdHRyKCd4bGluazpocmVmJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2ljb24nKSk7IH0pO1xuICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgLy8gZXZlbnRzIGRlZmluZWQgYnkgdXNlcnMgd2l0aCBqUXVlcnlcbiAgICAkKCdpbWFnZScsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9LFxuICByZWZyZXNoX3g6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdGhpcy5zdmdfZ3AuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5hdHRyKCd4JywgdGhpcy5vcHRpb25zLngpXG4gICAgLmF0dHIoJ3knLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwneScpKTsgfSk7XG5cbiAgICB2YXIgZiA9IHRoaXMuZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnJ1c2hcIik7XG4gICAgZlswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZbMF0pO1xuICAgIHRoaXMuYWRkYnJ1c2goKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5SWNvbnNGaXg7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG52YXIgVHJhY2VEaXNwbGF5SWNvbnNab29tID0gZnVuY3Rpb24oZGl2SWQsIHRyYWNlLCB0aW1lX3dpbmRvdywgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBkaXZJZCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VEaXNwbGF5SWNvbnMnKTtcbiAgLy8kKHdpbmRvdykucmVzaXplKHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlID0gdHJhY2U7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdyA9IHRpbWVfd2luZG93O1xuICB0aGlzLndpbmRvdy5vbigndHc6dXBkYXRlJywgdGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG4gIC8vdGhpcy53aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsdGhpcy50cmFuc2xhdGVfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy5pbml0X0RPTSgpO1xuICAvLyB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKHRpbWVfd2luZG93LnN0YXJ0LHRpbWVfd2luZG93LmVuZCk7XG4gIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDtcbiAgdmFyIHRoaXNfd2lkZ2V0ID0gdGhpcztcbiAgdmFyIGJpbmRfZnVuY3Rpb24gPSBmdW5jdGlvbih2YWxfb3JfZnVuKSB7XG4gICAgaWYgKHZhbF9vcl9mdW4gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW4uYmluZCh0aGlzX3dpZGdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWxfb3JfZnVuO1xuICAgIH1cbiAgfTtcbiAgLyp0aGlzLm9wdGlvbnMueCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy54IHx8IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKSAtIDg7XG4gIH0pO1xuICB0aGlzLm9wdGlvbnMueSA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy55IHx8IDE3KTtcbiAgdGhpcy5vcHRpb25zLndpZHRoID0gYmluZF9mdW5jdGlvbihvcHRpb25zLndpZHRoIHx8IDE2KTtcbiAgdGhpcy5vcHRpb25zLmhlaWdodCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy5oZWlnaHQgfHwgMTYpO1xuICB0aGlzLm9wdGlvbnMudXJsID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnVybCB8fCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFHN0FBQUJ1d0JIblU0TlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBS3NTVVJCVkRpTnJaTkxhRk5wRk1kLzMzZnZUYTV0WXB1cTB5YXRGV3VnUmhFWHc5QXVoSkVaQkNraXFKV0NJRXJyeHAyNDFDNkw2NjUwTS9XQm93dW5veUNEQ2pLckdZWjBJYml3eGtkVWJHeWFQbWdTbThkOWYyNU1iWFVsekg5NXp2LzhPT2R3amxCS3NWYWpVMWtFdEppYXZOQnNhS2NCcXE1LzNmS0RTd3JLWTMzSmRYN1JBSXhPWlFHTTNiSEl5bUN5UFpoWnFUOHAyZDRzUUd0WTcreU9idmh4TWpzdnA0dVZLT0EyUUVJcHhlaFVGbDJJdnVGVVozclpjdS8rOVg3UldxZzdKeHcvUUFGaFRkTFJGSm9ZNk40U2F6T05vMWN6cy8yZVVsTmpmVW4wUmlzbmUrUHA5eXYxOFR2WndybDlpVmIySjJKRVFob0tLTmtlNlVKNTVMZk1CNGFTSGVNbmUrUHBheS95QWtCY1RMOW1hN05wN1l1My9uMWxPamRROHdMTzc5M0d6bGd6RmRjall1am9VcEF0MTdqOExJZmpCNXpkdmZYQnYzT2xYM05WeTVTQU9KVktoUDk0TTI5VVhCOEZGR29XRTg5bnVmVGtIUTluRmxFS2VqWnVvTGUxaVlycjgrZmJlZTlVS2hFR2hCNlNZckJvdWRQTHRuc0FRQ25GNzY4S3ExdjJBeEFDNmw3QXN1VUNzR1M1aDR1V094MlNZbEJxUW95VUhXL085Z08rMWk5ZGJmeWNpS0dBL3dvbDNwVHJBTmgrUU5ueDVqUWhSdVEzVlorMVoxT1VnOTJiaVprRy8rU0wzSHU3Z1BmVnpRQklYNm1KbHBBZUQydnJXZHMzbXRoK3dPdFNsVWN6UzFSZGZ6VVgxaVF0SVQzdUt6V2hPNEdhakpuR25jMm1jZitqNHgxdW1KNHVWU2hVYlJTd1VIUFd3ZHZDeHVPWWFSeHdBalVwQVhVams3ZVA5YlRyRVVOYk5mMzBRNVRoWFYwYzZXa25Hdm9TanhnYXgzZTB1emN5ZVJ0UWNxd3ZTYTVxbWFZdUI0YVNIZU1OaUVKZ2FoSjl6V1FSUTJNbzJURnU2bklnVjdYTWRaZDQ4K1ZjLzNDcU0zMG0xWFgzd2N4aThkM0gyc2l0bDNtVUFDa0V5WmFtMjRlMmJUSGJUT1BjMWN4c2Y2UHUvM21tdGZyZWQvNEVTUU5LWEc4VkFDb0FBQUFBU1VWT1JLNUNZSUk9Jyk7XG5cbiAgKi9cbiAgdGhpcy5vcHRpb25zID0ge307XG4gIHRoaXMub3B0aW9ucy54ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnggfHwgZnVuY3Rpb24obykge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZV94KG8uZ2V0X2JlZ2luKCkpIC0gODtcbiAgfSk7XG4gIHRoaXMuc3R5bGVzaGVldCA9IG9wdGlvbnMgO1xuICB0aGlzLmRyYXcoKTtcblx0fTtcblxuVHJhY2VEaXNwbGF5SWNvbnNab29tLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIGRpdl9lbG10ID0gZDMuc2VsZWN0KHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5zdmcgPSBkaXZfZWxtdC5hcHBlbmQoJ3N2ZycpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSAocmVkKSBsaW5lIHJlcHJlc2VudGluZyBjdXJyZW50IHRpbWVcbiAgICBpZiAodHlwZW9mICh0aGlzLndpbmRvdy50aW1lcikgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0cigneDEnLCAnNTAlJylcbiAgICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgICAuYXR0cigneDInLCAnNTAlJylcbiAgICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgIC5hdHRyKCdzdHJva2UnLCAncmVkJylcbiAgICAgIC5hdHRyKCdvcGFjaXR5JywgJzAuMycpO1xuICAgIH1cblxuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdmFyIHggPSBkMy50aW1lLnNjYWxlKClcbi8vIC5kb21haW4oW25ldyBEYXRlKDIwMTQsIDQsIDEpLCBuZXcgRGF0ZSgyMDE0LCA0LCAxNSkgLSAxXSlcbi5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKVxuLnJhbmdlKFswLCB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGhdKTtcbiAgICB2YXIgbWFyZ2luID0ge3RvcDogMjAwLCByaWdodDogNDAsIGJvdHRvbTogMjAwLCBsZWZ0OiA0MH0sXG4gICAgIGhlaWdodCA9IDUwMCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuICAgIHRoaXMuc3ZnX2dwID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcblx0XHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB0aGlzLnN2Z19zZWxlY3RlZF9vYnNlbCA9IHRoaXMuc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgLmF0dHIoJ3gyJywgJzAnKVxuICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgLmF0dHIoJ3N0cm9rZScsICdibGFjaycpXG4gICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJylcbiAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gIH0sXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAuc2VsZWN0QWxsKCdjaXJjbGUsaW1hZ2UscmVjdCcpXG4gICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pOyAvLyBUT0RPOiBib2d1ZSBpbiBjYXNlIG5vIElEIGV4aXN0cyAtPiBtaWdodCBoYXBwZW4gd2l0aCBLVEJTIHRyYWNlcyBhbmQgbmV3IG9ic2Vsc1xuICB9LFxuICBjYWxjdWxhdGVfeDogZnVuY3Rpb24odGltZSkge1xuICAgIHZhciB4ID0gKHRpbWUgLSB0aGlzLndpbmRvdy5zdGFydCkgKiB0aGlzLnNjYWxlX3ggKyB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQ7XG4gICAgcmV0dXJuIHg7XG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oZSkge1xuXG4gICAgaWYgKGUpIHtcbiAgICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0cmFjZTp1cGRhdGVcIjpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG5cbiAgICAgICAgICAvL3RoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHModGhpcy53aW5kb3cuc3RhcnQsdGhpcy53aW5kb3cuZW5kKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7IC8vIGRvIG5vdCB3YW50IHRvIHRyaWdnZXIgdGhlIHJlZnJlc2hpbmcgb2YgbGlzdF9vYnNlbHMoKS4uLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuZXhpdCgpXG4gICAgLnJlbW92ZSgpO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZCgnaW1hZ2UnKVxuICAgIC5hdHRyKCdjbGFzcycsICdTYW1vdHJhY2VzLW9ic2VsJylcbiAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3knKSk7IH0pXG4gICAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3dpZHRoJykpOyB9KVxuICAgIC5hdHRyKCdoZWlnaHQnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnaGVpZ2h0JykpOyB9KVxuICAgIC5hdHRyKCd4bGluazpocmVmJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2ljb24nKSk7IH0pO1xuICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgLy8gZXZlbnRzIGRlZmluZWQgYnkgdXNlcnMgd2l0aCBqUXVlcnlcbiAgICAkKCdpbWFnZScsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9LFxuICByZWZyZXNoX3g6IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3knKSk7IH0pO1xuICB9LFxuXHRcdH07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5SWNvbnNab29tO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdHJhY2UuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRyYWNlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBkMy5qcyBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2QzanMub3JnXCI+ZDNqcy5vcmc8L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBERVNDUklQVElPTiBUTyBDT01FLi4uLlxuICogQHBhcmFtIHtTdHJpbmd9XHRkaXZJZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UcmFjZX1cdHRyYWNlXG4gKiAgICAgVHJhY2Ugb2JqZWN0IHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UaW1lV2luZG93fSB0aW1lX3dpbmRvd1xuICogICAgIFRpbWVXaW5kb3cgb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgdGltZSBmcmFtZVxuICogICAgIGJlaW5nIGN1cnJlbnRseSBkaXNwbGF5ZWQuXG4gKiBAdG9kbyBhZGQgZGVzY3JpcHRpb24gYW5kIHVwZGF0ZSBkb2MuLi5cbiAqL1xudmFyIFRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXMgPSBmdW5jdGlvbihkaXZJZCwgdHJhY2UsIHRpbWVfd2luZG93KSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgZGl2SWQpO1xuXG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtT2JzZWxPY2N1cnJlbmNlcycpO1xuICAvL3RoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcycpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuXG4gIHRoaXMudHJhY2UgPSB0cmFjZTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnJlbW92ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMub2JzZWxfcmVkcmF3LmJpbmQodGhpcykpO1xuXG4gIHRoaXMud2luZG93ID0gdGltZV93aW5kb3c7XG4gIHRoaXMud2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMudHJhbnNsYXRlX3guYmluZCh0aGlzKSk7XG5cbiAgLy9cdHRoaXMub2JzZWxfc2VsZWN0b3IgPSBvYnNlbF9zZWxlY3RvcjtcbiAgLy9cdHRoaXMud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJycsdGhpcy4uYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG5cbiAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB2YWx1ZSBvciBmdW5jdGlvblxuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuXG4gIHRoaXMuZHJhdygpO1xufTtcblxuVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcy5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuXG4gICAgdmFyIGRpdl9lbG10ID0gZDMuc2VsZWN0KCcjJyArIHRoaXMuaWQpO1xuICAgIHRoaXMuc3ZnID0gZGl2X2VsbXQuYXBwZW5kKCdzdmcnKVxuICAgIC5hdHRyKFwieG1sbnNcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiKVxuICAgIC5hdHRyKFwidmVyc2lvblwiLCBcIjEuMVwiKTtcblxuXG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcblxuICAgIHRoaXMuc3ZnX2dwID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG5cbiAgICAvLyBldmVudCBsaXN0ZW5lcnNcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcztcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoJ2NoYW5nZVRpbWVPbkRyYWcnLCB0aGlzLmVsZW1lbnQsIHtcbiAgICAgIG9uVXBDYWxsYmFjazogZnVuY3Rpb24oZGVsdGFfeCkge1xuICAgICAgICB2YXIgdGltZV9kZWx0YSA9IC1kZWx0YV94ICogd2lkZ2V0LndpbmRvdy5nZXRfd2lkdGgoKSAvIHdpZGdldC5lbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICB3aWRnZXQuc3ZnX2dwLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICgtd2lkZ2V0LnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICAgICAgICB3aWRnZXQud2luZG93LnRyYW5zbGF0ZSh0aW1lX2RlbHRhKTtcbiAgICAgIH0sXG4gICAgICBvbk1vdmVDYWxsYmFjazogZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgICAgIHdpZGdldC5zdmdfZ3AuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKG9mZnNldCAtIHdpZGdldC50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCd6b21tT25TY3JvbGwnLCB0aGlzLmVsZW1lbnQsIHt0aW1lV2luZG93OiB0aGlzLndpbmRvd30pO1xuICB9LFxuXG5cbiAgLy8gVE9ETzogbmVlZHMgdG8gYmUgbmFtZWQgZm9sbG93aW5nIGEgY29udmVudGlvblxuICAvLyB0byBiZSBkZWNpZGVkIG9uXG4gIC8qKlxuICBcdCAqIENhbGN1bGF0ZXMgdGhlIFggcG9zaXRpb24gaW4gcGl4ZWxzIGNvcnJlc3BvbmRpbmcgdG9cbiAgXHQgKiB0aGUgdGltZSBnaXZlbiBpbiBwYXJhbWV0ZXIuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgVGltZSBmb3Igd2hpY2ggdG8gc2VlayB0aGUgY29ycmVzcG9uZGluZyB4IHBhcmFtZXRlclxuICBcdCAqL1xuICBjYWxjdWxhdGVfeDogZnVuY3Rpb24obykge1xuICAgIHZhciB4ID0gKG8uZ2V0X2JlZ2luKCkgLSB0aGlzLndpbmRvdy5zdGFydCkgKiB0aGlzLnNjYWxlX3ggKyB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQ7XG4gICAgcmV0dXJuIHhcblxuICB9LFxuICBjYWxjdWxhdGVfd2lkdGg6IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgeCA9IE1hdGgubWF4KDAuMDEsIChvLmdldF9lbmQoKSAtIG8uZ2V0X2JlZ2luKCkpICogdGhpcy5zY2FsZV94KTsgLy8gd2lkdGggb2YgMCA9PiBub3QgZGlzcGxheWVkXG4gICAgcmV0dXJuIHhcbiAgfSxcbiAgdHJhbnNsYXRlX3g6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgdGltZV9kZWx0YSA9IGUuZGF0YTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgKz0gdGltZV9kZWx0YSAqIHRoaXMuc2NhbGVfeDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAoLXRoaXMudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gIH0sXG5cbiAgcmVmcmVzaF94OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5hdHRyKCd4JywgdGhpcy5jYWxjdWxhdGVfeC5iaW5kKHRoaXMpKVxuICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMuY2FsY3VsYXRlX3dpZHRoLmJpbmQodGhpcykpXG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIGlmIChlKSB7XG4gICAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgICBjYXNlIFwidHJhY2U6dXBkYXRlXCI6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDsgLy8gZG8gbm90IHdhbnQgdG8gdHJpZ2dlciB0aGUgcmVmcmVzaGluZyBvZiBsaXN0X29ic2VscygpLi4uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmV4aXQoKVxuICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgIC8vLmF0dHIoJ2NsYXNzJywnU2Ftb3RyYWNlcy1vYnNlbCcpXG4gICAgLmF0dHIoJ3gnLCB0aGlzLmNhbGN1bGF0ZV94LmJpbmQodGhpcykpXG4gICAgLmF0dHIoJ3knLCAnMCcpXG4gICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5jYWxjdWxhdGVfd2lkdGguYmluZCh0aGlzKSlcbiAgICAuYXR0cignaGVpZ2h0JywgJzIwJyk7XG4gICAgLy8uYXR0cignc3Ryb2tlLXdpZHRoJywnMXB4JylcbiAgICAvLy5hdHRyKCdzdHJva2UnLCdibGFjaycpO1xuICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgLy8gZXZlbnRzIGRlZmluZWQgYnkgdXNlcnMgd2l0aCBqUXVlcnlcbiAgICAkKCdyZWN0JywgdGhpcy5lbGVtZW50KS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAkLmRhdGEoZWwsIHtcbiAgICAgICAgJ1NhbW90cmFjZXMtdHlwZSc6ICdvYnNlbCcsXG4gICAgICAgICdTYW1vdHJhY2VzLWRhdGEnOiBkMy5zZWxlY3QoZWwpLmRhdHVtKClcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIG9ic2VsX3JlZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIHZhciBvYnMgPSBlLmRhdGE7XG4gICAgdmFyIHNlbCA9IHRoaXMuZDNPYnNlbHMoKVxuXHRcdFx0LmZpbHRlcihmdW5jdGlvbihvKSB7XG4gIC8vXHRcdFx0XHRjb25zb2xlLmxvZygnZGF0YTppZCxvYnNlbF9lZGl0X2lkJyxpZCxvYnMuZ2V0X2lkKCksaWQgPT0gb2JzLmdldF9pZCgpKTtcbiAgcmV0dXJuIG8uZ2V0X2lkKCkgPT0gb2JzLmdldF9pZCgpO1xuXHRcdFx0fSlcblx0XHRcdC5kYXR1bShvYnMpXG5cdFx0XHQuYXR0cigneCcsIHRoaXMuY2FsY3VsYXRlX3guYmluZCh0aGlzKSlcblx0XHRcdC5hdHRyKCd3aWR0aCcsIHRoaXMuY2FsY3VsYXRlX3dpZHRoLmJpbmQodGhpcykpXG5cdFx0XHQuYXR0cigneGxpbms6aHJlZicsIHRoaXMub3B0aW9ucy51cmwpO1xuICB9LFxuXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAuc2VsZWN0QWxsKCdjaXJjbGUsaW1hZ2UscmVjdCcpXG4gICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pOyAvLyBUT0RPOiBib2d1ZSBpbiBjYXNlIG5vIElEIGV4aXN0cyAtPiBtaWdodCBoYXBwZW4gd2l0aCBLVEJTIHRyYWNlcyBhbmQgbmV3IG9ic2Vsc1xuICB9LFxuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcztcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbnZhciBUcmFjZURpc3BsYXlUZXh0ID0gZnVuY3Rpb24oZGl2SWQsIHRyYWNlLCB0aW1lV2luZG93KSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBXaWRnZXQuY2FsbCh0aGlzLCBkaXZJZCk7XG4gIHRoaXMuZGl2SWQgPSBkaXZJZDtcbiAgdGhpcy5hZGRfY2xhc3MoXCJXaWRnZXQtVHJhY2VEaXNwbGF5VGV4dFwiKTtcbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLnRyYWNlLm9uKFwidHJhY2U6dXBkYXRlVFwiLCB0aGlzLnJlZnJlc2hYLmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKFwidHJhY2U6Y3JlYXRlX29ic2VsX1RleHRcIiwgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdyA9IHRpbWVXaW5kb3c7XG4gIHRoaXMud2luZG93Lm9uKFwidHc6dXBkYXRlXCIsIHRoaXMucmVmcmVzaFguYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93Lm9uKFwiQ2hhbmdlTGFuZ2FnZVwiLCB0aGlzLnJlZnJlc2hYLmJpbmQodGhpcykpO1xuICB0aGlzLnJlZnJlc2hYKCk7XG4gIHRoaXMuZGF0YU9iID0gW107XG59O1xuXG5UcmFjZURpc3BsYXlUZXh0LnByb3RvdHlwZSA9IHtcbiAgZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuZGF0YU9iLnB1c2goSlNPTi5zdHJpbmdpZnkoZS5kYXRhKSk7XG4gICAgLy90aGlzLmRhdGFPYiA9IEpTT04uc3RyaW5naWZ5IChlLmRhdGEpO1xuICAgIC8vIEFzc2lzdC5WaWV3VHJhY2UuYWRkT2JzZWxWaXN1KGUuZGF0YSwgdGhpcy5kaXZJZCk7IC8vIFRPRE8gd2hhdCBpcyBBc3Npc3QgP1xuICAgICQoXCIjXCIgKyBlLmRhdGFbXCJAaWRcIl0pLmhpZGUoKTtcbiAgfSxcbiAgcmVmcmVzaFg6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB0aW1lV2luZG93ID0gdGhpcy53aW5kb3c7XG4gICAgdGhpcy50cmFjZS5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKHRpbWVXaW5kb3cuc3RhcnQgPD0gby5nZXRfYmVnaW4oKSAmJiBvLmdldF9iZWdpbigpIDw9IHRpbWVXaW5kb3cuZW5kKSB7XG4gICAgICAgICQoXCIjXCIgKyBvLmdldF9pZCgpKS5zaG93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKFwiI1wiICsgby5nZXRfaWQoKSkuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICByZWRyYXc6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZGl2SWQpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5kYXRhT2IuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAvLyBBc3Npc3QuVmlld1RyYWNlLmFkZE9ic2VsVmlzdShKU09OLnBhcnNlKG8pLCB3aWRqLmRpdklkKTsgLy8gVE9ETyB3aGF0IGlzIEFzc2lzdCA/XG4gICAgICAkKFwiI1wiICsgSlNPTi5wYXJzZShvKVtcIkBpZFwiXSkuaGlkZSgpO1xuICAgIH0pO1xuICAgIHRoaXMucmVmcmVzaFgoKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5VGV4dDtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRyYWNlLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0cmFjZS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgZDMuanMgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9kM2pzLm9yZ1wiPmQzanMub3JnPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogREVTQ1JJUFRJT04gVE8gQ09NRS4uLi5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0ZGl2SWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVHJhY2V9XHR0cmFjZVxuICogICAgIFRyYWNlIG9iamVjdCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVGltZVdpbmRvd30gdGltZV93aW5kb3dcbiAqICAgICBUaW1lV2luZG93IG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIHRpbWUgZnJhbWVcbiAqICAgICBiZWluZyBjdXJyZW50bHkgZGlzcGxheWVkLlxuICogQHRvZG8gYWRkIGRlc2NyaXB0aW9uIGFuZCB1cGRhdGUgZG9jLi4uXG4gKi9cbnZhciBUcmFjZURpc3BsYXlab29tQ29udGV4dCA9IGZ1bmN0aW9uKGRpdklkLCB0cmFjZSwgdGltZV93aW5kb3cxLCB0aW1lX3dpbmRvdzIsIG9wdGlvbnMxLCBvcHRpb25zMikge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGRpdklkKTtcblxuICB0aGlzLm1vZGUgPSAnd2luZG93X3N5bmMnO1xuICBpZiAob3B0aW9uczEgIT09IHVuZGVmaW5lZCB8fCBvcHRpb25zMiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5tb2RlID0gJ29ic2VsX3N5bmMnO1xuICAgIGlmIChvcHRpb25zMSAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMxLmhhc093blByb3BlcnR5KCd4JykpIHtcbiAgICAgIHRoaXMueDEgPSBvcHRpb25zMS54LmJpbmQodGhpcyk7XG4gICAgfVxuICAgIGlmIChvcHRpb25zMiAhPT0gdW5kZWZpbmVkICYmIG9wdGlvbnMyLmhhc093blByb3BlcnR5KCd4JykpIHtcbiAgICAgIHRoaXMueDIgPSBvcHRpb25zMi54LmJpbmQodGhpcyk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1PYnNlbE9jY3VycmVuY2VzJyk7XG4gIC8vdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1UcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6cmVtb3ZlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcy5vYnNlbF9yZWRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy53aW5kb3cxID0gdGltZV93aW5kb3cxO1xuICB0aGlzLndpbmRvdzEub24oJ3R3OnVwZGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdzEub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuXG4gIHRoaXMud2luZG93MiA9IHRpbWVfd2luZG93MjtcbiAgdGhpcy53aW5kb3cyLm9uKCd0dzp1cGRhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cyLm9uKCd0dzp0cmFuc2xhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcblxuICAvL1x0dGhpcy5vYnNlbF9zZWxlY3RvciA9IG9ic2VsX3NlbGVjdG9yO1xuICAvL1x0dGhpcy53aW5kb3cxLmFkZEV2ZW50TGlzdGVuZXIoJycsdGhpcy4uYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG5cbiAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB2YWx1ZSBvciBmdW5jdGlvblxuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuXG4gIHRoaXMuZHJhdygpO1xufTtcblxuVHJhY2VEaXNwbGF5Wm9vbUNvbnRleHQucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cblxuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCgnIycgKyB0aGlzLmlkKTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJylcbiAgICAuYXR0cihcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIilcbiAgICAuYXR0cihcInZlcnNpb25cIiwgXCIxLjFcIik7XG5cblxuICAgIHRoaXMuc2NhbGVfeDEgPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdzEuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy5zY2FsZV94MiA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93Mi5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuXG4gICAgdGhpcy5zeW5jX3BhdGggPSB0aGlzLnN2Zy5hcHBlbmQoJ3BhdGgnKVxuICAgIC5hdHRyKCdzdHlsZScsICdzdHJva2U6Z3JleTtzdHJva2Utd2lkdGg6MXB4O2ZpbGw6I2RkZDsnKTtcbiAgICB0aGlzLnN2Z19ncCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuXG4gIH0sXG5cblxuICAvLyBUT0RPOiBuZWVkcyB0byBiZSBuYW1lZCBmb2xsb3dpbmcgYSBjb252ZW50aW9uXG4gIC8vIHRvIGJlIGRlY2lkZWQgb25cbiAgLyoqXG4gIFx0ICogQ2FsY3VsYXRlcyB0aGUgWCBwb3NpdGlvbiBpbiBwaXhlbHMgY29ycmVzcG9uZGluZyB0b1xuICBcdCAqIHRoZSB0aW1lIGdpdmVuIGluIHBhcmFtZXRlci5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gdGltZSBUaW1lIGZvciB3aGljaCB0byBzZWVrIHRoZSBjb3JyZXNwb25kaW5nIHggcGFyYW1ldGVyXG4gIFx0ICovXG4gIGNhbGN1bGF0ZV94OiBmdW5jdGlvbih0KSB7XG4gICAgdmFyIHggPSAodCAtIHRoaXMud19zdGFydCkgKiB0aGlzLnNjYWxlX3g7XG4gICAgcmV0dXJuIHggO1xuICB9LFxuICBvMngxOiBmdW5jdGlvbihvKSB7XG4gICAgdGhpcy53X3N0YXJ0ID0gdGhpcy53aW5kb3cxLnN0YXJ0O1xuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuc2NhbGVfeDE7XG4gICAgcmV0dXJuIHRoaXMueDEobyk7XG4gIH0sXG4gIG8yeDI6IGZ1bmN0aW9uKG8pIHtcbiAgICB0aGlzLndfc3RhcnQgPSB0aGlzLndpbmRvdzIuc3RhcnQ7XG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5zY2FsZV94MjtcbiAgICByZXR1cm4gdGhpcy54MihvKTtcbiAgfSxcbiAgeDE6IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKTtcbiAgfSxcbiAgeDI6IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKTtcbiAgfSxcbiAgY2FsY3VsYXRlX3BhdGg6IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgcCA9IFtdO1xuICAgIHZhciB4MSA9IHRoaXMubzJ4MShvKTtcbiAgICB2YXIgeDIgPSB0aGlzLm8yeDIobyk7XG4gICAgcCA9IFsnTScsIHgxLCAnMCcsICdDJywgeDEsICcxMCwnLCB4MiwgJzEwLCcsIHgyLCAnMjAnXTtcbiAgICByZXR1cm4gcC5qb2luKCcgJyk7XG4gIH0sXG4gIGNhbGN1bGF0ZV92aXNpYmlsaXR5OiBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHgxID0gdGhpcy5vMngxKG8pO1xuICAgIGlmICh4MSA8IDApIHJldHVybiBmYWxzZTtcbiAgICBpZiAoeDEgPiB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGgpIHJldHVybiBmYWxzZTtcbiAgICB2YXIgeDIgPSB0aGlzLm8yeDIobyk7XG4gICAgaWYgKHgyID4gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHgyIDwgMCkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBjYWxjdWxhdGVfc3R5bGU6IGZ1bmN0aW9uKG8pIHtcbiAgICBpZiAodGhpcy5jYWxjdWxhdGVfdmlzaWJpbGl0eShvKSkge1xuICAgICAgLy9pZih0cnVlKSB7XG4gICAgICByZXR1cm4gJ3N0cm9rZTpncmV5O3N0cm9rZS13aWR0aDoxcHg7ZmlsbDpub25lOyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnc3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjFweDtmaWxsOm5vbmU7JztcbiAgICB9XG4gIH0sXG4gIHRyYW5zbGF0ZV94OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHRpbWVfZGVsdGEgPSBlLmRhdGE7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ICs9IHRpbWVfZGVsdGEgKiB0aGlzLnNjYWxlX3g7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKC10aGlzLnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICB9LFxuXG4gIHJlZnJlc2hfeDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zY2FsZV94MSA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93MS5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnNjYWxlX3gyID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cyLmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgaWYgKHRoaXMubW9kZSA9PSBcIm9ic2VsX3N5bmNcIikge1xuICAgICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuYXR0cignZCcsIHRoaXMuY2FsY3VsYXRlX3BhdGguYmluZCh0aGlzKSlcbiAgICAgIC5hdHRyKCdzdHlsZScsIHRoaXMuY2FsY3VsYXRlX3N0eWxlLmJpbmQodGhpcykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN5bmNfcGF0aC5hdHRyKCdkJywgdGhpcy5jYWxjdWxhdGVfc3luY19wYXRoLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0cmFjZTp1cGRhdGVcIjpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0OyAvLyBkbyBub3Qgd2FudCB0byB0cmlnZ2VyIHRoZSByZWZyZXNoaW5nIG9mIGxpc3Rfb2JzZWxzKCkuLi5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRoaXMubW9kZSA9PSBcIm9ic2VsX3N5bmNcIikge1xuICAgICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuZXhpdCgpXG4gICAgICAucmVtb3ZlKCk7XG4gICAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdwYXRoJylcbiAgICAgIC8vLmF0dHIoJ2NsYXNzJywnU2Ftb3RyYWNlcy1vYnNlbCcpXG4gICAgICAuYXR0cignZCcsIHRoaXMuY2FsY3VsYXRlX3BhdGguYmluZCh0aGlzKSlcbiAgICAgIC5hdHRyKCdzdHlsZScsIHRoaXMuY2FsY3VsYXRlX3N0eWxlLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5kM09ic2VscygpXG4gICAgICAvLy5hdHRyKCdzdHJva2Utd2lkdGgnLCcxcHgnKVxuICAgICAgLy8uYXR0cignc3Ryb2tlJywnYmxhY2snKTtcbiAgICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgICAvLyBldmVudHMgZGVmaW5lZCBieSB1c2VycyB3aXRoIGpRdWVyeVxuICAgICAgJCgncGF0aCcsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgICAkLmRhdGEoZWwsIHtcbiAgICAgICAgICAnU2Ftb3RyYWNlcy10eXBlJzogJ29ic2VsJyxcbiAgICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3luY19wYXRoLmF0dHIoJ2QnLCB0aGlzLmNhbGN1bGF0ZV9zeW5jX3BhdGguYmluZCh0aGlzKSk7XG4gICAgfVxuICB9LFxuICBjYWxjdWxhdGVfc3luY19wYXRoOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHMgPSBNYXRoLm1heCh0aGlzLndpbmRvdzEuc3RhcnQsIHRoaXMud2luZG93Mi5zdGFydCk7XG4gICAgdmFyIHRlID0gTWF0aC5taW4odGhpcy53aW5kb3cxLmVuZCwgdGhpcy53aW5kb3cyLmVuZCk7XG4gICAgdmFyIHgxcyA9IChNYXRoLm1pbih0cywgdGhpcy53aW5kb3cxLmVuZCkgLSB0aGlzLndpbmRvdzEuc3RhcnQpICogdGhpcy5zY2FsZV94MTtcbiAgICB2YXIgeDJzID0gKE1hdGgubWluKHRzLCB0aGlzLndpbmRvdzIuZW5kKSAtIHRoaXMud2luZG93Mi5zdGFydCkgKiB0aGlzLnNjYWxlX3gyO1xuICAgIHZhciB4MWUgPSAoTWF0aC5tYXgodGUsIHRoaXMud2luZG93MS5zdGFydCkgLSB0aGlzLndpbmRvdzEuc3RhcnQpICogdGhpcy5zY2FsZV94MTtcbiAgICB2YXIgeDJlID0gKE1hdGgubWF4KHRlLCB0aGlzLndpbmRvdzIuc3RhcnQpIC0gdGhpcy53aW5kb3cyLnN0YXJ0KSAqIHRoaXMuc2NhbGVfeDI7XG4gICAgdmFyIHAgPSBbXCJNXCIsIHgxcywgXCIwXCIsIFwiQ1wiLCB4MXMsIFwiMjAsXCIsIHgycywgXCIwLFwiLCB4MnMsIFwiMjBcIiwgXCJMXCIsIHgyZSwgXCIyMFwiLCBcIkNcIiwgeDJlLCBcIjAsXCIsIHgxZSwgXCIyMCxcIiwgeDFlLCBcIjBcIiwgXCJaXCJdO1xuICAgIHJldHVybiBwLmpvaW4oXCIgXCIpO1xuICB9LFxuICBvYnNlbF9yZWRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgb2JzID0gZS5kYXRhO1xuICAgIHZhciBzZWwgPSB0aGlzLmQzT2JzZWxzKClcblx0XHRcdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAvL1x0XHRcdFx0Y29uc29sZS5sb2coJ2RhdGE6aWQsb2JzZWxfZWRpdF9pZCcsaWQsb2JzLmdldF9pZCgpLGlkID09IG9icy5nZXRfaWQoKSk7XG4gIHJldHVybiBvLmdldF9pZCgpID09IG9icy5nZXRfaWQoKTtcblx0XHRcdH0pXG5cdFx0XHQuZGF0dW0ob2JzKVxuXHRcdFx0LmF0dHIoJ2QnLCB0aGlzLmNhbGN1bGF0ZV9wYXRoLmJpbmQodGhpcykpXG4gIH0sXG5cbiAgZDNPYnNlbHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN2Z19ncFxuICAgIC5zZWxlY3RBbGwoJ3BhdGgnKVxuICAgIC8vIFRPRE86IEFUVEVOVElPTiEgV0FSTklORyEgb2JzZWxzIE1VU1QgaGF2ZSBhIGZpZWxkIGlkIC0+IHVzZWQgYXMgYSBrZXkuXG4gICAgLy8uZGF0YSh0aGlzLmRhdGEpOyAvLyxmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pO1xuICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcblxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlRGlzcGxheVpvb21Db250ZXh0O1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xucmVxdWlyZSgnanF1ZXJ5LW1vdXNld2hlZWwnKSgkKTtcblxuLyoqXG4gKiBAbWl4aW5cbiAqIEByZXF1aXJlcyBqUXVlcnkgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9qcXVlcnkuY29tXCI+anF1ZXJ5LmNvbTwvYT4pXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IE1vdXNlIFdoZWVsIHBsdWdpbiAoc2VlIDxhIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vYnJhbmRvbmFhcm9uL2pxdWVyeS1tb3VzZXdoZWVsXCI+TW91c2UgV2hlZWwgcGx1Z2luPC9hPilcbiAqIEBkZXNjcmlwdGlvblxuICogQWxsIHdpZGdldHMgc2hvdWxkIGluaGVyaXQgZnJvbSB0aGlzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXQuXG4gKlxuICogSW4gb3JkZXIgdG8gdXNlIGNyZWF0ZSBhIHdpZGdldCB0aGF0IGluaGVyaXRzIGZyb20gdGhlXG4gKiBXaWRnZXQgY2xhc3MsIG9uZSBtdXNoIGluY2x1ZGUgdGhlIGZvbGxvd2luZyBjb2RlIGluXG4gKiB0aGUgY29uc3RydWN0b3Igb2YgdGhlaXIgd2lkZ2V0LlxuICogPGNvZGU+XG4gKiA8L2NvZGU+XG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkIElkIG9mIHRoZSBIVE1MIGVsZW1lbnQgdGhlXG4gKiBXaWRnZXQgaXMgYXR0YWNoZWQgdG8uXG4gKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fSBlbGVtZW50IEhUTUwgZWxlbWVudCB0aGVcbiAqIFdpZGdldCBpcyBhdHRhY2hlZCB0by5cbiAqL1xudmFyIFdpZGdldCA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gIFx0ICogQWRkcyB0aGUgZ2l2ZW4gY2xhc3MgdG8gdGhlIEhUTUwgZWxlbWVudCB0byB3aGljaFxuICBcdCAqIHRoaXMgV2lkZ2V0IGlzIGF0dGFjaGVkIHRvLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLldpZGdldHMuV2lkZ2V0LnByb3RvdHlwZVxuICBcdCAqIEBwdWJsaWNcbiAgXHQgKiBAbWV0aG9kXG4gIFx0ICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzX25hbWUgTmFtZSBvZiB0aGUgY2xhc3MgdG8gYWRkXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGFkZF9jbGFzcyhjbGFzc19uYW1lKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc19uYW1lO1xuICB9XG4gIGZ1bmN0aW9uIGdldFZhbHVlQXR0cmlidXRTdHlsZSAgKHR5cGUsYXR0cmlidXQpIHtcbiAgICBpZiAodGhpcy5zdHlsZXNoZWV0W3R5cGVdKSB7XG4gICAgICAgICAgaWYgKCh0aGlzLnN0eWxlc2hlZXRbdHlwZV1bYXR0cmlidXRdKSYmKHRoaXMuc3R5bGVzaGVldFt0eXBlXVthdHRyaWJ1dF0gIT09XCJcIikpXG4gICAgICAgICAgICAgIHtyZXR1cm4gdGhpcy5zdHlsZXNoZWV0W3R5cGVdW2F0dHJpYnV0XTt9XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAge3JldHVybiB0aGlzLnN0eWxlc2hlZXRbJ2RlZmF1bHQnXVthdHRyaWJ1dF07fVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZXNoZWV0WydkZWZhdWx0J11bYXR0cmlidXRdO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB1bmxvYWQoKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTmFtZSA9ICcnO1xuICAgIC8vXHRcdHRoaXMuZWxlbWVudC5cbiAgfVxuICAvKipcbiAgXHQgKiBDcmVhdGVzIGEgbmV3IGJlaGF2aW91ciAoaW50ZXJhY3Rpb24gcG9zc2liaWxpdHkpXG4gIFx0ICogd2l0aCB0aGUgd2lkZ2V0LlxuICBcdCAqIFR3byBiZWhhdmlvdXJzIGFyZSBpbXBsZW1lbnRlZCBzbyBmYXI6XG4gIFx0ICogMS4gJ2NoYW5nZVRpbWVPbkRyYWcnXG4gIFx0ICogMi4gJ3pvbW1PblNjcm9sbCdcbiAgXHQgKlxuICBcdCAqIDEuICdjaGFuZ2VUaW1lT25EcmFnJyBiZWhhdmlvdXIgYWxsb3dzIHRvIGNoYW5nZVxuICBcdCAqIGEge0BsaW5rIFNhbW90cmFjZXMuTGliLlRpbWVyfSBvbiBhIGRyYWctbi1kcm9wIGxpa2UgZXZlbnRcbiAgXHQgKiAoSmF2YVNjcmlwdCAnbW91c2Vkb3duJywgJ21vdXNlbW92ZScsICdtb3VzZXVwJyBhbmQgJ21vdXNlbGVhdmUnXG4gIFx0ICogZXZlbnRzKS4gVGhpcyBhbGxvd3MgdG8gY2hhbmdlIHRoZSBjdXJyZW50IHRpbWUgYnkgZHJhZ2dpbmdcbiAgXHQgKiBhIHRyYWNlIHZpc3VhbGlzYXRpb24gb3IgYSBzbGlkZXIgZm9yIGluc3RhbmNlLlxuICBcdCAqXG4gIFx0ICogMi4gJ2NoYW5nZVRpbWVPbkRyYWcnIGJlaGF2aW91ciBhbGxvd3MgdG8gY2hhbmdlXG4gIFx0ICogYSB7QGxpbmsgU2Ftb3RyYWNlcy5MaWIuVGltZVdpbmRvd30gb24gYSBtb3VzZSBzY3JvbGwgZXZlbnRcbiAgXHQgKiAoSmF2YVNjcmlwdCAnd2hlZWwnIGV2ZW50KVxuICBcdCAqXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuV2lkZ2V0cy5XaWRnZXQucHJvdG90eXBlXG4gIFx0ICogQHB1YmxpY1xuICBcdCAqIEBtZXRob2RcbiAgXHQgKiBAcGFyYW0ge1N0cmluZ30gYmVoYXZpb3VyTmFtZSBOYW1lIG9mIHRoZSBiZWhhdmlvdXJcbiAgXHQgKiAgICAgKCdjaGFuZ2VUaW1lT25EcmFnJyBvciAnem9tbU9uU2Nyb2xsJykuIFNlZSBkZXNjcmlwdGlvbiBhYm92ZS5cbiAgXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBldmVudFRhcmdldEVsZW1lbnQgSFRNTCBFbGVtZW50IG9uIHdoaWNoXG4gIFx0ICogICAgIGFuIGV2ZW50TGlzdGVuZXIgd2lsbCBiZSBjcmVhdGVkICh0eXBpY2FsbHksIHRoZSBlbGVtZW50IHlvdVxuICBcdCAqICAgICB3YW50IHRvIGludGVyYWN0IHdpdGgpLlxuICBcdCAqIEBwYXJhbSB7T2JqZWN0fSBvcHQgT3B0aW9ucyB0aGF0IHZhcnkgZGVwZW5kaW5nIG9uIHRoZVxuICBcdCAqICAgICBzZWxlY3RlZCBiZWhhdmlvdXIuXG4gIFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0Lm9uVXBDYWxsYmFja1xuICBcdCAqICAgIChmb3IgJ2NoYW5nZVRpbWVPbkRyYWcnIGJlaGF2aW91ciBvbmx5KVxuICBcdCAqICAgIENhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ21vdXNldXAnIGV2ZW50IHdpbGwgYmVcbiAgXHQgKiAgICB0cmlnZ2VyZWQuIFRoZSBhcmd1bWVudCBkZWx0YV94IGlzIHBhc3NlZCB0byB0aGUgY2FsbGJhY2tcbiAgXHQgKiAgICBhbmQgcmVwcmVzZW50cyB0aGUgb2Zmc2V0IG9mIHRoZSB4IGF4aXMgaW4gcGl4ZWxzIGJldHdlZW4gdGhlXG4gIFx0ICogICAgbW9tZW50IHRoZSBtb3VzZWRvd24gZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkIGFuZCB0aGUgbW9tZW50XG4gIFx0ICogICAgdGhlIGN1cnJlbnQgbW91c2V1cCBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gIFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gb3B0Lm9uTW92ZUNhbGxiYWNrXG4gIFx0ICogICAgKGZvciAnY2hhbmdlVGltZU9uRHJhZycgYmVoYXZpb3VyIG9ubHkpXG4gIFx0ICogICAgQ2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnbW91c2Vtb3ZlJyBldmVudCB3aWxsIGJlXG4gIFx0ICogICAgdHJpZ2dlcmVkLiBUaGUgYXJndW1lbnQgZGVsdGFfeCBpcyBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrXG4gIFx0ICogICAgYW5kIHJlcHJlc2VudHMgdGhlIG9mZnNldCBvZiB0aGUgeCBheGlzIGluIHBpeGVscyBiZXR3ZWVuIHRoZVxuICBcdCAqICAgIG1vbWVudCB0aGUgbW91c2Vkb3duIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZCBhbmQgdGhlIG1vbWVudFxuICBcdCAqICAgIHRoZSBjdXJyZW50IG1vdXNlbW92ZSBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQuXG4gIFx0ICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5UaW1lV2luZG93fSBvcHQudGltZVdpbmRvd1xuICBcdCAqICAgIChmb3IgJ3pvbW1PblNjcm9sbCcgYmVoYXZpb3VyIG9ubHkpXG4gIFx0ICogICAge0BsaW5rIFNhbW90cmFjZXMuTGliLlRpbWVXaW5kb3d9IG9iamVjdCB0aGF0IHdpbGxcbiAgXHQgKiAgICBiZSBlZGl0ZWQgd2hlbiB0aGUgem9vbSBhY3Rpb24gaXMgcHJvZHVjZWQuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGFkZF9iZWhhdmlvdXIoYmVoYXZpb3VyTmFtZSwgZXZlbnRUYXJnZXRFbGVtZW50LCBvcHQpIHtcblxuICAgIHN3aXRjaCAoYmVoYXZpb3VyTmFtZSkge1xuICAgICAgY2FzZSAnY2hhbmdlVGltZU9uRHJhZyc6XG4gICAgICAgIHZhciBtb3VzZWRvd24sIG1vdXNldXAsIG1vdXNlbW92ZTtcbiAgICAgICAgdmFyIGluaXRfY2xpZW50X3g7XG4gICAgICAgIG1vdXNlZG93biA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAvL1x0Y29uc29sZS5sb2coJ21vdXNlZG93bicpO1xuICAgICAgICAgIGluaXRfY2xpZW50X3ggPSBlLmNsaWVudFg7XG4gICAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZSk7XG4gICAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZXVwKTtcbiAgICAgICAgICBldmVudFRhcmdldEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIG1vdXNldXApO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgbW91c2V1cCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAvL1x0Y29uc29sZS5sb2coJ21vdXNldXAnKTtcbiAgICAgICAgICBpZiAoaW5pdF9jbGllbnRfeCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgZGVsdGFfeCA9IChlLmNsaWVudFggLSBpbml0X2NsaWVudF94KTtcbiAgICAgICAgICAgIG9wdC5vblVwQ2FsbGJhY2soZGVsdGFfeCk7XG4gICAgICAgICAgICBldmVudFRhcmdldEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlKTtcbiAgICAgICAgICAgIGV2ZW50VGFyZ2V0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cCk7XG4gICAgICAgICAgICBldmVudFRhcmdldEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIG1vdXNldXApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIG1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICB2YXIgZGVsdGFfeCA9IChlLmNsaWVudFggLSBpbml0X2NsaWVudF94KTtcbiAgICAgICAgICBvcHQub25Nb3ZlQ2FsbGJhY2soZGVsdGFfeCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICBldmVudFRhcmdldEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgbW91c2Vkb3duKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd6b21tT25TY3JvbGwnOlxuICAgICAgICB2YXIgd2hlZWw7XG5cbiAgICAgICAgd2hlZWwgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGNvZWYgPSBNYXRoLnBvdygwLjgsIGUuZGVsdGFZKTtcbiAgICAgICAgICBvcHQudGltZVdpbmRvdy56b29tKGNvZWYpO1xuICAgICAgICAgIC8vXHRcdFx0XHRvcHQub25XaGVlbENhbGxiYWNrLmNhbGwob3B0LmJpbmQsY29lZik7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgJChldmVudFRhcmdldEVsZW1lbnQpLm1vdXNld2hlZWwod2hlZWwpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oaWQpIHtcbiAgICAvLyBET0NVTUVOVEVEIEFCT1ZFXG4gICAgLy90aGlzLmlkID0gaWQ7XG4gICAgLy90aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcbiAgICB0aGlzLmVsZW1lbnQgPSBpZDtcbiAgICB0aGlzLmlkID0gdGhpcy5lbGVtZW50LmlkO1xuXG4gICAgdGhpcy5hZGRfY2xhc3MgPSBhZGRfY2xhc3M7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyID0gYWRkX2JlaGF2aW91cjtcblxuICAgIC8vIGNhbGwgbWV0aG9kXG4gICAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldCcpO1xuICAgIHRoaXMuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlID0gZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaWRnZXQ7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0aW1lIHNjYWxlLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0aW1lIHNjYWxlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBkMy5qcyBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2QzanMub3JnXCI+ZDNqcy5vcmc8L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2luZG93U2NhbGUgaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIHRoZSB0ZW1wb3JhbCBzY2FsZSBvZiBhXG4gKiB7QGxpbmsgU2Ftb3RyYWNlcy5UaW1lV2luZG93fFRpbWVXaW5kb3d9LiBUaGlzXG4gKiB3aWRnZXQgdXNlcyBkMy5qcyB0byBjYWxjdWxhdGUgYW5kIGRpc3BsYXkgdGhlIHNjYWxlLlxuICpcbiAqIE5vdGU6IHVubGVzcyB0aGUgb3B0aW9uYWwgYXJndW1lbnQgaXNKYXZhc2NyaXB0RGF0ZSBpcyBkZWZpbmVkLFxuICogdGhlIHdpZGdldCB3aWxsIHRyeSB0byBndWVzcyBpZiB0aW1lIGlzIGRpc3BsYXllZCBhcyBudW1iZXJzLFxuICogb3IgaWYgdGltZSBpcyBkaXNwbGF5ZWQgaW4geWVhci9tb250aC9kYXkvaG91cnMvZXRjLlxuICogVGhpcyBzZWNvbmQgb3B0aW9uIGFzc3VtZXMgdGhhdCB0aGUgdGltZSBpcyByZXByZXNlbnRlZCBpblxuICogbWlsbGlzZWNvbmRzIHNpbmNlIDEgSmFudWFyeSAxOTcwIFVUQy5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0ZGl2SWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge30gdGltZVdpbmRvd1xuICogICAgIFRpbWVXaW5kb3dDZW50ZXJlZE9uVGltZSBvYmplY3RcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW2lzSmF2YXNjcmlwdERhdGVdXG4gKiAgICAgQm9vbGVhbiB0aGF0IGRlc2NyaWJlcyBpZiB0aGUgc2NhbGUgcmVwcmVzZW50cyBhIEphdmFTY3JpcHQgRGF0ZSBvYmplY3QuXG4gKiAgICAgSWYgc2V0IHRvIHRydWUsIHRoZSB3aWRnZXQgd2lsbCBkaXNwbGF5IHllYXJzLCBtb250aHMsIGRheXMsIGhvdXJzLCBtaW51dGVzLi4uXG4gKiAgICAgYXMgaWYgdGhlIHRpbWUgZ2l2ZW4gd2FzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGVsbGFwc2VkIHNpbmNlIDEgSmFudWFyeSAxOTcwIFVUQy5cbiAqICAgICBJZiBzZXQgdG8gZmFsc2UsIHRoZSB3aWRnZXQgd2lsbCBkaXNwbGF5IHRoZSBudW1iZXJzIHdpdGhvdXQgYXR0ZW1wdGluZ1xuICogICAgIGFueSBjb252ZXJzaW9uLlxuICogICAgIFRoaXMgYXJndW1lbnQgaXMgb3B0aW9uYWwuIElmIG5vdCBzZXQsIHRoZSB3aWRnZXQgd2lsbCB0cnkgdG8gZ3Vlc3M6XG4gKiAgICAgSWYgdGhlIG51bWJlciBvZiB0aGUgc3RhcnQgb2YgdGhlIGdpdmVuIFRpbWVXaW5kb3cgaXMgYWJvdmUgYSBiaWxsaW9uLCB0aGVuXG4gKiAgICAgaXQgaXMgYXNzdW1lZCB0aGF0IHRoZSBKYXZhU2NyaXB0IERhdGUgb2JqZWN0IGhhcyBiZWVuIHVzZWQgdG8gcmVwcmVzZW50IHRpbWUuXG4gKiAgICAgT3RoZXJ3aXNlLCB0aGUgbnVtZXJpY2FsIHZhbHVlIG9mIHRpbWUgd2lsbCBiZSBkaXNwbGF5ZWQuXG4gKi9cbnZhciBXaW5kb3dTY2FsZSA9IGZ1bmN0aW9uKGh0bWxFbGVtZW50LCB0aW1lV2luZG93LCBpc0phdmFzY3JpcHREYXRlKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxFbGVtZW50KTtcblxuICB0aGlzLmFkZF9jbGFzcyhcIldpZGdldC1XaW5kb3dTY2FsZVwiKTtcbiAgJCh3aW5kb3cpLnJlc2l6ZSh0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy53aW5kb3cgPSB0aW1lV2luZG93O1xuICB0aGlzLndpbmRvdy5vbihcInR3OnVwZGF0ZVwiLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93Lm9uKFwidHc6dHJhbnNsYXRlXCIsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcblxuICAvLyBUcnlpbmcgdG8gZ3Vlc3MgaWYgdGltZVdpbmRvdyBpcyByZWxhdGVkIHRvIGEgRGF0ZSgpIG9iamVjdFxuICBpZiAodGhpcy53aW5kb3cuc3RhcnQgPiAxMDAwMDAwMDAwKSB7IC8vIDFvXjkgPiAxMSBKYW4gMTk3MCBpZiBhIERhdGUgb2JqZWN0XG4gICAgdGhpcy5pc0phdmFzY3JpcHREYXRlID0gaXNKYXZhc2NyaXB0RGF0ZSB8fCB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuaXNKYXZhc2NyaXB0RGF0ZSA9IGlzSmF2YXNjcmlwdERhdGUgfHwgZmFsc2U7XG4gIH1cblxuICB0aGlzLmluaXRET00oKTtcbiAgLy8gVXBkYXRlIHNsaWRlcidzIHBvc2l0aW9uXG4gIHRoaXMuZHJhdygpO1xuXG59O1xuXG5XaW5kb3dTY2FsZS5wcm90b3R5cGUgPSB7XG4gIGluaXRET006IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8vIENyZWF0ZSB0aGUgc2xpZGVyXG4gICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KS5hcHBlbmQoXCJzdmdcIik7XG4gICAgaWYgKHRoaXMuaXNKYXZhc2NyaXB0RGF0ZSkge1xuICAgICAgdGhpcy54ID0gZDMudGltZS5zY2FsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnggPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICB9XG4gICAgdGhpcy54QXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUodGhpcy54KTtcbiAgICB0aGlzLnguZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSk7XG4gICAgdGhpcy5zdmdBeGlzID0gdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKTtcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoXCJ6b21tT25TY3JvbGxcIiwgdGhpcy5lbGVtZW50LCB7dGltZVdpbmRvdzogdGhpcy53aW5kb3d9KTtcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLngucmFuZ2UoWzAsIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aF0pO1xuICAgIHRoaXMueC5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKTtcbiAgICB0aGlzLnN2Z0F4aXMuY2FsbCh0aGlzLnhBeGlzKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93U2NhbGU7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG52YXIgV2luZG93U2NhbGVGaXggPSBmdW5jdGlvbihodG1sX2lkLCB0aW1lX3dpbmRvdywgaXNfamF2YXNjcmlwdF9kYXRlKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtV2luZG93U2NhbGUnKTtcbiAgJCh3aW5kb3cpLnJlc2l6ZSh0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93ID0gdGltZV93aW5kb3c7XG4gIC8vIHRyeWluZyB0byBndWVzcyBpZiB0aW1lX3dpbmRvdyBpcyByZWxhdGVkIHRvIGEgRGF0ZSgpIG9iamVjdFxuICBpZiAodGhpcy53aW5kb3cuc3RhcnQgPiAxMDAwMDAwMDAwKSB7IC8vIDFvXjkgPiAxMSBKYW4gMTk3MCBpZiBhIERhdGUgb2JqZWN0XG4gICAgdGhpcy5pc19qYXZhc2NyaXB0X2RhdGUgPSBpc19qYXZhc2NyaXB0X2RhdGUgfHwgdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmlzX2phdmFzY3JpcHRfZGF0ZSA9IGlzX2phdmFzY3JpcHRfZGF0ZSB8fCBmYWxzZTtcbiAgfVxuICB0aGlzLndpbmRvdy5vbigndHc6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLmluaXRfRE9NKCk7XG4gIC8vIHVwZGF0ZSBzbGlkZXIncyBwb3NpdGlvblxuICB0aGlzLmRyYXcoKTtcblx0XHR9O1xuXG5XaW5kb3dTY2FsZUZpeC5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICAvLyBjcmVhdGUgdGhlIHNsaWRlclxuICAgIC8vdGhpcy5zdmcgPSBkMy5zZWxlY3QoXCIjXCIrdGhpcy5pZCkuYXBwZW5kKFwic3ZnXCIpO1xuICAgIHRoaXMuc3ZnID0gZDMuc2VsZWN0KHRoaXMuZWxlbWVudCkuYXBwZW5kKFwic3ZnXCIpO1xuICAgIGlmICh0aGlzLmlzX2phdmFzY3JpcHRfZGF0ZSkge1xuICAgICAgdGhpcy54ID0gZDMudGltZS5zY2FsZSgpOyAvLy5yYW5nZShbMCx0aGlzLmVsZW1lbnQuZ2V0U2l6ZSgpLnhdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54ID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgfVxuICAgIC8vdGhpcy54QXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUodGhpcy54KTsgLy8ub3JpZW50KFwiYm90dG9tXCIpO1xuICAgIHRoaXMueEF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHRoaXMueCk7XG4gICAgLy8udGlja3MoZDMudGltZS5kYXlzKTtcbiAgICB0aGlzLnguZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSk7XG4gICAgdGhpcy5zdmdBeGlzID0gdGhpcy5zdmcuYXBwZW5kKFwiZ1wiKTtcblxuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMueC5yYW5nZShbMCwgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXSk7Ly8gPSBkMy50aW1lLnNjYWxlKCkucmFuZ2UoWzAsdGhpcy5lbGVtZW50LmdldFNpemUoKS54XSk7XG4gICAgdGhpcy54LmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pO1xuICAgIHRoaXMuc3ZnQXhpcy5jYWxsKHRoaXMueEF4aXMpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dTY2FsZUZpeDtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHdpbmRvdyBzbGlkZXIuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHdpbmRvdyBzbGlkZXIuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLlVJLldpZGdldHMuZDNCYXNpYy5XaW5kb3dTbGlkZXIgaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIGEgdGVtcG9yYWwgd2luZG93XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHRkaXZJZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB3aWRlX3dpbmRvd1xuICogICAgIFRpbWVXaW5kb3cgb2JqZWN0IC0+IHJlcHJlc2VudGluZyB0aGUgd2lkZSB3aW5kb3dcbiAqICAgICAoZS5nLiwgdGhlIHdob2xlIHRyYWNlKVxuICogQHBhcmFtIHNsaWRlcl93aW5kb3dcbiAqICAgICBUaW1lV2luZG93IG9iamVjdCAtPiByZXByZXNlbnRpbmcgdGhlIHNtYWxsIHdpbmRvd1xuICogICAgIChlLmcuLCB0aGUgY3VycmVudCB0aW1lIHdpbmRvdyBiZWluZyB2aXN1YWxpc2VkIHdpdGggYW5vdGhlciB3aWRnZXQpXG4gKi9cbnZhciBXaW5kb3dTbGlkZXIgPSBmdW5jdGlvbihodG1sX2lkLCB3aWRlX3dpbmRvdywgc2xpZGVyX3dpbmRvdykge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuXG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtV2luZG93U2xpZGVyJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5kcmF3LmJpbmQodGhpcykpO1xuXG4gIHRoaXMud2lkZV93aW5kb3cgPSB3aWRlX3dpbmRvdztcbiAgdGhpcy53aWRlX3dpbmRvdy5vbigndHc6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpZGVfd2luZG93Lm9uKCd0dzp0cmFuc2xhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMuc2xpZGVyX3dpbmRvdyA9IHNsaWRlcl93aW5kb3c7XG4gIHRoaXMuc2xpZGVyX3dpbmRvdy5vbigndHc6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnNsaWRlcl93aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcblxuICB0aGlzLnNsaWRlcl9vZmZzZXQgPSAwO1xuICB0aGlzLndpZHRoID0gMDtcblxuICB0aGlzLmluaXRfRE9NKCk7XG4gIC8vIHVwZGF0ZSBzbGlkZXIncyBwb3NpdGlvblxuICB0aGlzLmRyYXcoKTtcbn07XG5cbldpbmRvd1NsaWRlci5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuICAgIC8vIGNyZWF0ZSB0aGUgc2xpZGVyXG4gICAgdGhpcy5zbGlkZXJfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNsaWRlcl9lbGVtZW50KTtcblxuICAgIC8vIGhhbmQgbWFkZSBkcmFnJmRyb3BcbiAgICAvLyBldmVudCBsaXN0ZW5lcnNcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcztcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoJ2NoYW5nZVRpbWVPbkRyYWcnLCB0aGlzLnNsaWRlcl9lbGVtZW50LCB7XG4gICAgICBvblVwQ2FsbGJhY2s6IGZ1bmN0aW9uKGRlbHRhX3gpIHtcbiAgICAgICAgdmFyIHRpbWVfZGVsdGEgPSBkZWx0YV94ICogd2lkZ2V0LndpZGVfd2luZG93LmdldF93aWR0aCgpIC8gd2lkZ2V0LmVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIHdpZGdldC5zbGlkZXJfd2luZG93LnRyYW5zbGF0ZSh0aW1lX2RlbHRhKTtcbiAgICAgIH0sXG4gICAgICBvbk1vdmVDYWxsYmFjazogZnVuY3Rpb24ob2Zmc2V0KSB7XG4gICAgICAgIHdpZGdldC5zbGlkZXJfZWxlbWVudC5zdHlsZS5sZWZ0ID0gd2lkZ2V0LnNsaWRlcl9vZmZzZXQgKyBvZmZzZXQgKyAncHgnO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoJ3pvbW1PblNjcm9sbCcsIHRoaXMuZWxlbWVudCwge3RpbWVXaW5kb3c6IHRoaXMuc2xpZGVyX3dpbmRvd30pO1xuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMud2lkdGggPSB0aGlzLnNsaWRlcl93aW5kb3cuZ2V0X3dpZHRoKCkgLyB0aGlzLndpZGVfd2luZG93LmdldF93aWR0aCgpICogdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIHRoaXMuc2xpZGVyX29mZnNldCA9ICh0aGlzLnNsaWRlcl93aW5kb3cuc3RhcnQgLSB0aGlzLndpZGVfd2luZG93LnN0YXJ0KSAqIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2lkZV93aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy5zbGlkZXJfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLnNsaWRlcl9lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aCArICdweCc7XG4gICAgdGhpcy5zbGlkZXJfZWxlbWVudC5zdHlsZS5sZWZ0ID0gdGhpcy5zbGlkZXJfb2Zmc2V0ICsgJ3B4JztcbiAgfSxcblxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd1NsaWRlcjtcbiIsIi8qKlxuICogQG1peGluXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSBFdmVudEhhbmRsZXIgT2JqZWN0IGlzIG5vdCBhIGNsYXNzLiBIb3dldmVyLCBpdCBpc1xuICogZGVzaWduZWQgZm9yIG90aGVyIGNsYXNzZXMgdG8gaW5oZXJpdCBvZiBhIHByZWRlZmluZWRcbiAqIE9ic2VydmFibGUgYmVoYXZpb3VyLiBGb3IgdGhpcyByZWFzb24sIHRoaXMgZnVuY3Rpb24gaXNcbiAqIGRvY3VtZW50ZWQgYXMgYSBDbGFzcy5cbiAqXG4gKiBJbiBvcmRlciB0byB1c2UgY3JlYXRlIGEgY2xhc3MgdGhhdCBcImluaGVyaXRzXCIgZnJvbSB0aGVcbiAqIFwiRXZlbnRIYW5kbGVyIGNsYXNzXCIsIG9uZSBtdXN0IHJ1biB0aGUgZm9sbG93aW5nIGNvZGUgaW5cbiAqIHRoZSBjb25zdHJ1Y3RvcjpcbiAqIDxjb2RlPlxuICogU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIuY2FsbCh0aGlzKTtcbiAqIDwvY29kZT5cbiAqXG4gKiBAcHJvcGVydHkge09iamVjdH0gY2FsbGJhY2tzXG4gKiAgICAgSGFzaCBtYXRjaGluZyBjYWxsYmFja3MgdG8gZXZlbnRfdHlwZXMuXG4gKi9cbnZhciBFdmVudEhhbmRsZXIgPSAoZnVuY3Rpb24oKSB7XG4gIC8qKlxuICBcdCAqIFRyaWdnZXJzIGFsbCB0aGUgcmVnaXN0cmVkIGNhbGxiYWNrcy5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIucHJvdG90eXBlXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50X3R5cGVcbiAgXHQgKiAgICAgVGhlIHR5cGUgb2YgdGhlIHRyaWdnZXJlZCBldmVudC5cbiAgXHQgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gIFx0ICogICAgIE9iamVjdCBzZW50IHdpdGggdGhlIG1lc3NhZ2UgdG8gdGhlIGxpc3RlbmVycyAoc2VlXG4gIFx0ICogICAgIHtAbGluayBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlciNvbn0pLlxuICBcdCAqL1xuICBmdW5jdGlvbiB0cmlnZ2VyKGV2ZW50X3R5cGUsIG9iamVjdCkge1xuICAgIHZhciBlID0geyB0eXBlOiBldmVudF90eXBlLCBkYXRhOiBvYmplY3QgfTtcbiAgICBpZiAodGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0pIHtcbiAgICAgIHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdLm1hcChmdW5jdGlvbihmKSB7IGYoZSk7IH0pO1xuICAgIH1cbiAgICAvKlxuICAgIFx0XHR0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXS5mb3JFYWNoKGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gICAgXHRcdFx0Y2FsbGJhY2soZSk7XG4gICAgXHRcdH0pO1xuICAgIFx0XHQqL1xuICB9XG4gIC8qKlxuICBcdCAqIEFkZHMgYSBjYWxsYmFjayBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5wcm90b3R5cGVcbiAgXHQgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRfdHlwZVxuICBcdCAqICAgICBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIHRvLlxuICBcdCAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gIFx0ICogICAgIENhbGxiYWNrIHRvIGNhbGwgd2hlbiB0aGUgYW4gZXZlbnQgb2YgdHlwZVxuICBcdCAqICAgICBldmVudF90eXBlIGlzIHRyaWdnZXJlZC4gTm90ZTogdGhlIGNhbGxiYWNrXG4gIFx0ICogICAgIGNhbiByZWNlaXZlIG9uZSBhcmd1bWVudCB0aGF0IGNvbnRhaW5zXG4gIFx0ICogICAgIGRldGFpbHMgYWJvdXQgdGhlIHRyaWdnZXJlZCBldmVudC5cbiAgXHQgKiAgICAgVGhpcyBldmVudCBhcmd1bWVudCBjb250YWlucyB0d28gZmllbGRzOlxuICBcdCAqICAgICBldmVudC50eXBlOiB0aGUgdHlwZSBvZiBldmVudCB0aGF0IGlzIHRyaWdnZXJlZFxuICBcdCAqICAgICBldmVudC5kYXRhOiBvcHRpb25hbCBkYXRhIHRoYXQgaXMgdHJhbnNtaXR0ZWQgd2l0aCB0aGUgZXZlbnRcbiAgXHQgKi9cbiAgZnVuY3Rpb24gb24oZXZlbnRfdHlwZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoe30udG9TdHJpbmcuY2FsbChjYWxsYmFjaykgIT09ICdbb2JqZWN0IEZ1bmN0aW9uXScpIHtcbiAgICAgIGNvbnNvbGUubG9nKGNhbGxiYWNrKTtcbiAgICAgIHRocm93IFwiQ2FsbGJhY2sgZm9yIGV2ZW50IFwiICsgZXZlbnRfdHlwZSArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCI7XG4gICAgfVxuICAgIHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdID0gdGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0gfHwgW107XG4gICAgdGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0ucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oZXZlbnRzKSB7XG4gICAgLy8gRE9DVU1FTlRFRCBBQk9WRVxuICAgIHRoaXMuY2FsbGJhY2tzID0gdGhpcy5jYWxsYmFja3MgfHwge307XG4gICAgdGhpcy50cmlnZ2VyID0gdHJpZ2dlcjtcbiAgICB0aGlzLm9uID0gb247XG4gICAgLyoqXG4gICAgXHRcdCAqIEV2ZW50Q29uZmlnIGlzIGEgc2hvcnRuYW1lIGZvciB0aGVcbiAgICBcdFx0ICoge0BsaW5rIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnfVxuICAgIFx0XHQgKiBvYmplY3QuXG4gICAgXHRcdCAqIEB0eXBlZGVmIEV2ZW50Q29uZmlnXG4gICAgXHRcdCAqIEBzZWUgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIuRXZlbnRDb25maWdcbiAgICBcdFx0ICovXG4gICAgLyoqXG4gICAgXHRcdCAqIFRoZSBFdmVudENvbmZpZyBvYmplY3QgaXMgdXNlZCBmb3IgY29uZmlndXJhdGluZyB0aGVcbiAgICBcdFx0ICogZnVuY3Rpb25zIHRvIGNhbGwgZXZlbnRzIGFyZSB0cmlnZ2VyZWQgYnkgYW4gRXZlbnRIYW5kbGVyIE9iamVjdC5cbiAgICBcdFx0ICogRWFjaCBhdHRyaWJ1dGUgbmFtZSBvZiB0aGUgRXZlbnRDb25maWcgY29ycmVzcG9uZHNcbiAgICBcdFx0ICogdG8gYSB0eXBlIG9mIGV2ZW50IGxpc3RlbmVkIHRvLCBhbmQgZWFjaFxuICAgIFx0XHQgKiB2YWx1ZSBpcyB0aGUgZnVuY3Rpb24gdG8gdHJpZ2dlciBvbiB0aGlzIGV2ZW50LlxuICAgIFx0XHQgKiBAdHlwZWRlZiBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ1xuICAgIFx0XHQgKiBAdHlwZSB7T2JqZWN0LjxzdHJpbmcsIGZ1bmN0aW9uPn1cbiAgICBcdFx0ICogQHByb3BlcnR5IHtmdW5jdGlvbn0gZXZlbnROYW1lIC0gRnVuY3Rpb24gdG8gdHJpZ2dlciBvbiB0aGlzIGV2ZW50LlxuICAgIFx0XHQgKi9cbiAgICBmdW5jdGlvbiBjYWxsYmFjayhlKSB7IGZ1bihlLmRhdGEpOyB9XG4gICAgZm9yICh2YXIgZXZlbnRfbmFtZSBpbiBldmVudHMpIHtcbiAgICAgIFx0XHRpZiAoZXZlbnQuaGFzT3duUHJvcGVydHkoZXZlbnRfbmFtZSkpIHtcbiAgICAgICAgXHRcdHZhciBmdW4gPSBldmVudHNbZXZlbnRfbmFtZV07XG4gICAgICAgIFx0XHR0aGlzLm9uKGV2ZW50X25hbWUsIGNhbGxiYWNrKTtcbiAgICAgIFx0XHR9XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEhhbmRsZXI7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBLVEJTLkJhc2UgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBqUXVlcnkgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9qcXVlcnkuY29tXCI+anF1ZXJ5LmNvbTwvYT4pXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZVxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLktUQlMuQmFzZSBpcyBhIEphdmFzY3JpcHQgS1RCUyBiYXNlXG4gKiBvYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuIFRoaXMgT2JqZWN0IGltcGxlbWVudHMgdGhlIEtUQlMgQVBJLlxuICogTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIGdldCB0aGVcbiAqIGxpc3Qgb2YgdHJhY2VzIGF2YWlsYWJsZSBpbiB0aGUgS1RCUyBiYXNlLiBBY2Nlc3MgYVxuICogc3BlY2lmaWMgdHJhY2UsIGV0Yy5cbiAqXG4gKiBAdG9kbyBGdWxseSBpbXBsZW1lbnQgS1RCUyBBUElcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBCYXNlIHRvIGxvYWQuXG4gKiBAcGFyYW0ge1N0cmluZ31cdFtpZF1cdElEIG9mIHRoZSBCYXNlIHRvIGxvYWQuXG4gKi9cbnZhciBCYXNlID0gZnVuY3Rpb24gQmFzZSh1cmksIGlkKSB7XG4gIC8vIEtUQlMuQmFzZSBpcyBhIFJlc291cmNlXG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7IGlkID0gdXJpOyB9XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIGlkLCB1cmksICdCYXNlJywgXCJcIik7XG4gIHRoaXMudHJhY2VzID0gW107XG4gIHRoaXMubW9kZWxzID0gW107XG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xuICB0aGlzLmF0dHJpYnV0ZXMgPSB7fTtcbn07XG5cbkJhc2UucHJvdG90eXBlID0ge1xuICBnZXQ6IGZ1bmN0aW9uKGlkKSB7fSxcbiAgLyoqXG4gIFx0ICogR2V0cyB0aGUgbGlzdCBvZiB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBiYXNlLlxuICBcdCAqIEByZXR1cm5zIHtBcnJheS48U3RyaW5nPn0gQXJyYXkgb2YgdGhlIElEIG9mIHRoZSB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBCYXNlLlxuICBcdCAqL1xuICBsaXN0X3RyYWNlczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2VzO1xuICB9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGxpc3RfbW9kZWxzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbHM7XG4gIH0sXG4gIC8qKlxuICBcdCAqIENyZWF0ZSBhIHN0b3JlZCB0cmFjZSBpbiB0aGUgS1RCU1xuICBcdCAqIEBwYXJhbSBpZCB7U3RyaW5nfSBJRCBvZiB0aGUgY3JlYXRlZCB0cmFjZVxuICBcdCAqIEBwYXJhbSBbbW9kZWxdIHtNb2RlbH0gTW9kZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtvcmlnaW5dIHtPcmlnaW59IE9yaWdpbiBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW2RlZmF1bHRfc3ViamVjdF0ge1N0cmluZ30gRGVmYXVsdCBzdWJqZWN0IG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbbGFiZWxdIHtTdHJpbmd9IExhYmVsIG9mIHRoZSB0cmFjZVxuICBcdCAqL1xuICBjcmVhdGVfc3RvcmVkX3RyYWNlOiBmdW5jdGlvbihpZCwgbW9kZWwsIG9yaWdpbiwgZGVmYXVsdF9zdWJqZWN0LCBsYWJlbCkge1xuICAgIHZhciBuZXdfdHJhY2UgPSB7XG4gICAgICBcIkBjb250ZXh0XCI6XHRcImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEva3Ricy1qc29ubGQtY29udGV4dFwiLFxuICAgICAgXCJAdHlwZVwiOlx0XCJTdG9yZWRUcmFjZVwiLFxuICAgICAgXCJAaWRcIjpcdFx0aWQgKyBcIi9cIlxuICAgIH07XG4gICAgbmV3X3RyYWNlLmhhc01vZGVsID0gKG1vZGVsID09PSB1bmRlZmluZWQgIHx8IG1vZGVsID09PSAgbnVsbCk/XCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL3NpbXBsZS10cmFjZS1tb2RlbFwiOm1vZGVsO1xuICAgIG5ld190cmFjZS5vcmlnaW4gPSAob3JpZ2luID09PSB1bmRlZmluZWQgfHwgb3JpZ2luID09PSAgbnVsbCApP1wiMTk3MC0wMS0wMVQwMDowMDowMFpcIjpvcmlnaW47XG4gICAgLy9cdFx0XHRpZihvcmlnaW49PXVuZGVmaW5lZCkgbmV3X3RyYWNlLm9yaWdpbiA9IG9yaWdpbjtcbiAgICBpZiAoZGVmYXVsdF9zdWJqZWN0ID09PSB1bmRlZmluZWQpIG5ld190cmFjZS5kZWZhdWx0X3N1YmplY3QgPSBkZWZhdWx0X3N1YmplY3Q7XG4gICAgaWYgKGxhYmVsID09PSB1bmRlZmluZWQpIG5ld190cmFjZS5sYWJlbCA9IGxhYmVsO1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMudXJpLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ld190cmFjZSksXG4gICAgICBzdWNjZXNzOiB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3F1ZXJ5IGVycm9yJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgXG4gIC8qKlxuICAqIENyZWF0ZSBhIHN0b3JlZCB0cmFjZSBpbiB0aGUga1RCUy5cbiAgKiBSZXR1cm5zIGEgUHJvbWlzZSB3aXRoIHRoZSBuZXcgY3JlYXRlZCBiYXNlIGFzIGEgcGFyYW1ldGVyIGlmIHRoZSBjcmVhdGlvbiBzdWNjZWVkLlxuICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBJRCBvZiB0aGUgY3JlYXRlZCB0cmFjZVxuICAqIEBwYXJhbSBbbW9kZWxdIHtNb2RlbH0gTW9kZWwgb2YgdGhlIHRyYWNlXG4gICogQHBhcmFtIFtvcmlnaW5dIHtPcmlnaW59IE9yaWdpbiBvZiB0aGUgdHJhY2VcbiAgKiBAcGFyYW0gW2RlZmF1bHRfc3ViamVjdF0ge1N0cmluZ30gRGVmYXVsdCBzdWJqZWN0IG9mIHRoZSB0cmFjZVxuICAqIEBwYXJhbSBbbGFiZWxdIHtTdHJpbmd9IExhYmVsIG9mIHRoZSB0cmFjZSBcbiAgKi9cbiAgY3JlYXRlX3RyYWNlOiBmdW5jdGlvbihpZCwgbW9kZWwsIG9yaWdpbiwgZGVmYXVsdF9zdWJqZWN0LCBsYWJlbCl7XG4gICAgXG4gICAgLy8gU2V0dGluZyB0aGUgYXR0cmlidXRlcyBvZiB0aGUgdHJhY2UuXG4gICAgdmFyIG5ld190cmFjZSA9IHtcbiAgICAgIFwiQGNvbnRleHRcIjogXCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgIFwiQHR5cGVcIjogIFwiU3RvcmVkVHJhY2VcIixcbiAgICAgIFwiQGlkXCI6ICAgIGlkICsgXCIvXCJcbiAgICB9O1xuICAgIG5ld190cmFjZS5oYXNNb2RlbCA9IChtb2RlbCA9PT0gdW5kZWZpbmVkICB8fCBtb2RlbCA9PT0gIG51bGwpP1wiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9zaW1wbGUtdHJhY2UtbW9kZWxcIjptb2RlbDtcbiAgICBuZXdfdHJhY2Uub3JpZ2luID0gKG9yaWdpbiA9PT0gdW5kZWZpbmVkIHx8IG9yaWdpbiA9PT0gIG51bGwgKT9cIjE5NzAtMDEtMDFUMDA6MDA6MDBaXCI6b3JpZ2luO1xuICAgIGlmIChkZWZhdWx0X3N1YmplY3QgIT09IHVuZGVmaW5lZCkgbmV3X3RyYWNlLmRlZmF1bHRfc3ViamVjdCA9IGRlZmF1bHRfc3ViamVjdDtcbiAgICBpZiAobGFiZWwgIT09IHVuZGVmaW5lZCkgbmV3X3RyYWNlLmxhYmVsID0gbGFiZWw7XG4gICAgXG4gICAgLy8gUHV0IHRoZSBgQmFzZWAgb2JqZWN0IGluIHRlbXAgdmFyIGB0aGF0YCwgZm9yIGxhdGVyIHVzZS5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB0aGF0LnVyaSxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXdfdHJhY2UpLFxuICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICByZXNvbHZlKG5ldyBTYW1vdHJhY2VzLkt0YnMuQmFzZSh0aGF0LnVyaSkpO1xuICAgICAgICAgIH0sICBcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncXVlcnkgZXJyb3InKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgICAgICAgIHJlamVjdChbanFYSFIsIHRleHRTdGF0dXMsIGVycm9yXSk7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG4gIFxuICAvKipcbiAgKiBDaGFuZ2UgdGhlIGF0dHJpYnV0ZXMgb2YgdGhlIEJhc2UuIEFkZCBvciBjaGFuZ2UgdGhlIGF0dHJpYnV0ZXMgcGFzc2VkIGluIHBhcmFtZXRlci5cbiAgKiBFeGFtcGxlIG9mIGF0dHJpYnV0ZXMgOlxuICAqIGF0dHJpYnV0ZXMgPSBbIFthdHRyaWJ1dGVzX25hbWVfMSxhdHRyaWJ1dGVfdmFsdWVfMV0sIFthdHRyaWJ1dGVfbmFtZV8yLGF0dHJpYnV0ZV92YWx1ZV8yXSwgLi4uXTsgXG4gICpcbiAgKiBSZXR1cm5zIGEgUHJvbWlzZSB3aXRoIHRoZSBiYXNlIGFzIGEgcGFyYW1ldGVyIGlmIHRoZSBtb2RpZmljYXRpb24gc3VjY2VlZC5cbiAgKiBAcGFyYW0gYXR0cmlidXRlcyB7QXJyYXl9IEFycmF5IG9mIEFycmF5LCB3aXRoIHRoZSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgaW4gdGhlIDFzdCBwb3NpdGlvbiwgdGhlIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgaW4gdGhlIDJuZCBwb3NpdGlvbi5cbiAgKi9cbiAgbW9kaWZ5X2F0dHJpYnV0ZXM6IGZ1bmN0aW9uKCBhdHRyaWJ1dGVzICl7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIFxuICAgICAgdGhhdC5mb3JjZV9zdGF0ZV9yZWZyZXNoKCB7J19vbl9zdGF0ZV9yZWZyZXNoXyc6IHRydWV9ICwgZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBvbGRfYXR0cmlidXRlcyA9IHRoYXQuYXR0cmlidXRlcztcbiAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIG9sZF9hdHRyaWJ1dGVzW2F0dHJpYnV0ZXNbaV1bMF1dID0gYXR0cmlidXRlc1tpXVsxXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbW9kZWxkYXRhID0gSlNPTi5zdHJpbmdpZnkob2xkX2F0dHJpYnV0ZXMpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGV0YWcgPSB0aGF0LmV0YWc7XG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ1BVVCcsIHRoYXQudXJpLCB0cnVlKTtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdJZi1NYXRjaCcsIGV0YWcpO1xuICAgICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgaWYoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgIHJlc29sdmUobmV3IFNhbW90cmFjZXMuS3Ricy5CYXNlKHRoYXQudXJpLCB0aGF0LmlkKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QoeGhyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmVqZWN0KEVycm9yKCdUaGVyZSB3YXMgYSBuZXR3b3JrIGVycm9yLicpKTtcbiAgICAgICAgfTtcbiAgICAgICAgeGhyLnNlbmQobW9kZWxkYXRhKTtcbiAgICAgIFxuICAgICAgfSApO1xuICAgIH0pO1xuICAgIFxuICB9LCAgXG5cbiAgLyoqXG4gICogQ3JlYXRlIGEgVHJhY2VNb2RlbCBpbiB0aGUgS1RCUy4gXG4gICogUmV0dXJucyBhIFByb21pc2UsIHdpdGggdGhlIGNyZWF0ZWQgVHJhY2VNb2RlbCBhcyBhIHBhcmFtZXRlci5cbiAgKiBAcGFyYW0gaWQge1N0cmluZ30gSUQgb2YgdGhlIGNyZWF0ZWQgVHJhY2VNb2RlbC5cbiAgKiBAcGFyYW0gW2xhYmVsXSB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgVHJhY2VNb2RlbC5cbiAgKi9cbiAgY3JlYXRlX21vZGVsOiBmdW5jdGlvbihpZCwgbGFiZWwpIHtcbiAgICB2YXIgZG9jID0ge1xuICAgICAgJ0Bjb250ZXh0JzogJ2h0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEva3Ricy1qc29ubGQtY29udGV4dCcsXG4gICAgICAnQGdyYXBoJzogW3tcbiAgICAgICAgJ0BpZCc6IGlkLFxuICAgICAgICAnbGFiZWwnOmxhYmVsLFxuICAgICAgICAnQHR5cGUnOiAnVHJhY2VNb2RlbCcsXG4gICAgICAgICdpbkJhc2UnOiAnLi8nLFxuICAgICAgICAnaGFzVW5pdCc6ICdtaWxsaXNlY29uZCdcbiAgICAgIH1dXG4gICAgfTtcbiAgICB2YXIgbmV3X21vZGVsX2RhdGEgPSBKU09OLnN0cmluZ2lmeShkb2MpO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IHRoYXQudXJpLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIGRhdGE6IG5ld19tb2RlbF9kYXRhLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgIHRoYXQuZm9yY2Vfc3RhdGVfcmVmcmVzaChcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICByZXNvbHZlKG5ldyBTYW1vdHJhY2VzLkt0YnMuTW9kZWwodGhhdC51cmkgKyBpZCApKSxcbiAgICAgICAgICAgIG51bGwgIFxuICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygncXVlcnkgZXJyb3InKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhbanFYSFIsIHRleHRTdGF0dXMsIGVycm9yXSk7XG4gICAgICAgICAgcmVqZWN0KFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cblxuXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgY3JlYXRlX2NvbXB1dGVkX3RyYWNlOiBmdW5jdGlvbihpZCwgbWV0aG9kLCBwYXJhbWV0ZXJzLCBzb3VyY2VzLCBsYWJlbCkge30sXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgLy9jcmVhdGVfbW9kZWw6IGZ1bmN0aW9uKGlkLCBwYXJlbnRzLCBsYWJlbCkge30sXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgY3JlYXRlX21ldGhvZDogZnVuY3Rpb24oaWQsIHBhcmVudCwgcGFyYW1ldGVycywgbGFiZWwpIHt9LFxuICAvLy8vLy8vLy8vL1xuICAvKipcbiAgXHQgKiBPdmVybG9hZHMgdGhlIHtAbGluayBTYW1vdHJhY2VzLktUQlMuUmVzb3VjZSNfb25fc3RhdGVfcmVmcmVzaF99IG1ldGhvZC5cbiAgXHQgKiBAcHJpdmF0ZVxuICBcdCAqL1xuICBfb25fc3RhdGVfcmVmcmVzaF86IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAvL1x0Y29uc29sZS5sb2coZGF0YSk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnbGFiZWwnLCBkYXRhW1wiaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsXCJdLCAnYmFzZTp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCd0cmFjZXMnLCBkYXRhLmNvbnRhaW5zLCAnYmFzZTp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdhdHRyaWJ1dGVzJywgZGF0YSwgJ2Jhc2U6YXR0clNldCcpO1xuICB9LFxuICAvLy8vLy8vLy8vLyBBRERFRCAvIEFQSVxuICAvKipcbiAgXHQgKiBHZXRzIGEgdHJhY2UgZnJvbSBpdHMgSURcbiAgXHQgKiBAcGFyYW0gaWQge1N0cmluZ30gSUQgb2YgdGhlIHRyYWNlIHRvIGdldC5cbiAgXHQgKiBAcmV0dXJuIHtTYW1vdHJhY2VzLktUQlMuVHJhY2V9IFRoZSByZXRyaWV2ZWQgVHJhY2UuXG4gIFx0ICovXG4gIGdldF90cmFjZTogZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gbmV3IFNhbW90cmFjZXMuS1RCUy5UcmFjZSh0aGlzLnVyaSArIGlkICsgJy8nLCBpZCk7XG4gIH0sXG4gIC8vLy8vLy8vLy8vL1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFRyYWNlIG9iamVjdCB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIEtUQlMuXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBNb2RlbCBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgTW9kZWwuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVybiAvIERFUkJFTCBGYXRtYVxuICogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuS1RCUy5Nb2RlbGlzIGEgSmF2YXNjcmlwdCBUcmFjZSBvYmplY3RcbiAqIHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIE1vZGVsLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXRcbiAqIHRoZSBMaXN0ZSBvZiB0eXBlIG9mIE9ic2VscyBmcm9tIHRoZSBLVEJTIE1vZGVsLCAuXG4gKlxuICpcbiAqXG4gKiBAdG9kbyBGdWxseSBpbXBsZW1lbnQgS1RCUyBBUElcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKiBAcGFyYW0ge1N0cmluZ31cdFtpZF1cdElEIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKi9cblxuXG52YXIgTW9kZWwgPSBmdW5jdGlvbih1cmksIGlkKSB7XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7IGlkID0gdXJpOyB9XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBpZCwgdXJpLCAnTW9kZWwnLCBcIlwiKTtcbiAgdGhpcy5saXN0X1R5cGVzX09ic2xlcyA9IFtdXG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xuXG59O1xuXG5Nb2RlbC5wcm90b3R5cGUgPSB7XG5cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGV0YWcgPSB0aGlzLmdldF9ldGFnKCk7XG4gICAgdGhpcy50cmlnZ2VyKCdNb2RlbDpnZXQnKTtcbiAgICB0aGlzLmxpc3RfVHlwZXNfT2JzbGVzID0gdGhpcy5saXN0X29ic2VscyhkYXRhW1wiQGdyYXBoXCJdKTtcbiAgfSxcbiAgbGlzdF9vYnNlbHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBMaXN0ZU9ic2VsVHlwZSA9IFtdO1xuICAgIHZhciBNID0gdGhpcztcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWwsIGtleSkge1xuICAgICAgdmFyIG9icyA9IHthdHRyaWJ1dGVzOiBbXX07XG4gICAgICBpZiAoZWxbXCJAdHlwZVwiXSA9PSBcIk9ic2VsVHlwZVwiKSAgICAgIHtcbiAgICAgICAgb2JzLmlkID0gZWxbXCJAaWRcIl07XG4gICAgICAgIG9icy50eXBlID0gZWxbXCJAaWRcIl0uc3Vic3RyKDEpO1xuICAgICAgICBvYnMuY29jaGUgPSBmYWxzZTtcbiAgICAgICAgLy9vYnNba2V5XSA9IGVsW2tleV1cbiAgICAgICAgaWYgKGVsWydoYXNTdXBlck9ic2VsVHlwZSddKSAgICAgICAge1xuICAgICAgICAgIG9icy5oYXNTdXBlck9ic2VsVHlwZSA9IGVsWydoYXNTdXBlck9ic2VsVHlwZSddXG4gICAgICAgIH1cbiAgICAgICAgTGlzdGVPYnNlbFR5cGUucHVzaChvYnMpO1xuICAgICAgICAvL00udHJpZ2dlcignTW9kZWw6RHJhd19vYnNlbCcsIG9icyk7XG4gICAgICAgIC8vY29uc29sZS5sb2cgKCd0cmlnZXInKVxuICAgICAgfSAgICAgIGVsc2UgaWYgKGVsW1wiQHR5cGVcIl0gPT0gXCJBdHRyaWJ1dGVUeXBlXCIpICAgICAge1xuICAgICAgICBvYnMgPSBNLkdldE9ic2VsVHlwZShlbFtcImhhc0F0dHJpYnV0ZU9ic2VsVHlwZVwiXSwgTGlzdGVPYnNlbFR5cGUpO1xuICAgICAgICBlbFsnY29jaGUnXSA9IGZhbHNlO1xuICAgICAgICBvYnMuYXR0cmlidXRlcy5wdXNoKGVsKTtcblxuICAgICAgfVxuXG4gICAgfSk7XG4gICAgTGlzdGVPYnNlbFR5cGUuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5oYXNTdXBlck9ic2VsVHlwZSkgICAgICB7XG5cbiAgICAgICAgby5hdHRyaWJ1dGVzID0gTS5nZXRBdHRyaWJ1dGVzIChvLmhhc1N1cGVyT2JzZWxUeXBlWzBdKVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIE0udHJpZ2dlcignTW9kZWw6bGlzdGVUeXBlJywgTGlzdGVPYnNlbFR5cGUpO1xuICAgIHJldHVybiBMaXN0ZU9ic2VsVHlwZTtcblxuICB9LFxuXG4gIEdldE9ic2VsVHlwZTogZnVuY3Rpb24oaWQsIExpc3RlT2JzZWxUeXBlKSAge1xuICAgIHZhciBvYnMgPSBbXTtcbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG9bXCJpZFwiXSA9PSBpZCkgICAgICB7XG5cbiAgICAgICAgb2JzUiA9IG87XG5cbiAgICAgIH1cblxuICAgIH1cbiAgICApXG4gICAgcmV0dXJuIG9ic1I7XG4gIH0sXG5cbiAgZ2V0QXR0cmlidXRlczogZnVuY3Rpb24oaWRlbnQpICB7XG5cbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG8uaWQgPT09IGlkZW50KSAgIHtcbiAgICAgICAgQXR0ID0gby5hdHRyaWJ1dGVzXG4gICAgICB9XG5cbiAgICB9XG4gICAgKVxuICAgIHJldHVybiBBdHQ7XG4gIH0sXG5cbiAgcHV0X21vZGVsOiBmdW5jdGlvbihtb2RlbGRhdGEpIHtcbiAgICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdGhhdC5vbiAoJ01vZGVsOmdldCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgdmFyIGV0YWcgPSB0aGF0LmV0YWc7XG5cbiAgICAvLyBQVVRcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BVVCcsIHRoYXQuaWQsIHRydWUpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdJZi1NYXRjaCcsIGV0YWcpO1xuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgaWYoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ09LT0tPSycpO1xuICAgICAgICAgIHJlc29sdmUobmV3IFNhbW90cmFjZXMuS3Ricy5Nb2RlbCh0aGF0LmlkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHhocik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QoRXJyb3IoJ1RoZXJlIHdhcyBhIG5ldHdvcmsgZXJyb3IuJykpO1xuICAgIH07XG4gICAgeGhyLnNlbmQobW9kZWxkYXRhKTtcblxuICB9KVxuICB9KTtcbn1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBPYnNlbCA9IHJlcXVpcmUoXCIuL09ic2VsLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBTYW1vdHJhY2VzLktUQlMuT2JzZWwgaXMgcGFydCBvZiB0aGUgU2Ftb3RyYWNlcy5LVEJTIGltcGxlbWVudGF0aW9uLlxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuT2JzZWxcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEB0b2RvIFRPRE8gdXBkYXRlIHNldF9tZXRob2RzXG4gKiAtPiBzeW5jIHdpdGggS1RCUyBpbnN0ZWFkIG9mIGxvY2FsIGNoYW5nZVxuICovXG52YXIgS1RCU09ic2VsID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgcGFyYW0uaWQsIHBhcmFtLnVyaSwgJ09ic2VsJywgcGFyYW0ubGFiZWwgfHwgXCJcIik7XG5cbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ3RyYWNlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0eXBlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2JlZ2luJyxcdERhdGUubm93KCkpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdlbmQnLFx0XHR0aGlzLmJlZ2luKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnYXR0cmlidXRlcycsXHR7fSk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdyZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2ludmVyc2VfcmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdzb3VyY2Vfb2JzZWxzJyxcdFx0W10pO1xufVxuXG5LVEJTT2JzZWwucHJvdG90eXBlID0gT2JzZWwucHJvdG90eXBlO1xuXG4vKlxuU2Ftb3RyYWNlcy5LVEJTLk9ic2VsLnByb3RvdHlwZS5nZXRfa3Ric19zdGF0dXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMua3Ric19zdGF0dXNcbn07XG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNPYnNlbDtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgUmVzb3VyY2UgT2JqZWN0cyB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIGtUQlNcbiAqIEBkZXNjcmlwdGlvbiBSZXNvdXJjZSBPYmplY3RzIGFyZSBLVEJTIG9iamVjdHMuIEFsbCByZXNvdXJjZXNcbiAqIGhhdmUgYW4gdXJpLCBhbiBpZCBhbmQgYW4gb3B0aW9uYWwgbGFiZWxcbiAqIEBjbGFzcyBSZXNvdXJjZSBPYmplY3RzIGhhdmUgYW4gdXJpLCBhbiBpZCBhbmQgYW4gb3B0aW9uYWwgbGFiZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBJZCBvZiB0aGUgUmVzb3VyY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJJIG9mIHRoZSBSZXNvdXJjZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBvZiB0aGUgUmVzb3VyY2UgKCdLVEJTJywnQmFzZScsXG4gKiAgICAgJ1RyYWNlJywnU3RvcmVkVHJhY2UnLCdDb21wdXRlZFRyYWNlJyBvciAnT2JzZWwnKVxuICogQHBhcmFtIHtsYWJlbH0gW2xhYmVsXSBMYWJlbCBvZiB0aGUgUmVzb3VyY2VcbiAqL1xudmFyIEtUQlNSZXNvdXJjZSA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgcmVzb3VyY2UgdHlwZSBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSB0eXBlICgnS1RCUycsJ0Jhc2UnLFxuICBcdCAqICAgICAnVHJhY2UnLCdTdG9yZWRUcmFjZScsJ0NvbXB1dGVkVHJhY2UnIG9yICdPYnNlbCcpLlxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfcmVzb3VyY2VfdHlwZSgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy50eXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZShiYXNlLCByZWxhdGl2ZSkge1xuICAgIHZhciBzdGFjayA9IGJhc2Uuc3BsaXQoXCIvXCIpLFxuICAgICAgICBwYXJ0cyA9IHJlbGF0aXZlLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgc3RhY2sucG9wKCk7IC8vIHJlbW92ZSBjdXJyZW50IGZpbGUgbmFtZSAob3IgZW1wdHkgc3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgLy8gKG9taXQgaWYgXCJiYXNlXCIgaXMgdGhlIGN1cnJlbnQgZm9sZGVyIHdpdGhvdXQgdHJhaWxpbmcgc2xhc2gpXG4gICAgZm9yICh2YXIgaT0wOyBpPHBhcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChwYXJ0c1tpXSA9PSBcIi5cIilcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBpZiAocGFydHNbaV0gPT0gXCIuLlwiKVxuICAgICAgICAgICAgc3RhY2sucG9wKCk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHN0YWNrLnB1c2gocGFydHNbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gc3RhY2suam9pbihcIi9cIik7XG4gIH1cbiAgLy8gUkVTT1VSQ0UgQVBJXG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIElEIG9mIHRoZSBSZXNvdXJjZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IFJlc291cmNlIElELlxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfaWQoKSB7IHJldHVybiB0aGlzLmlkOyB9XG4gICAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgVVJJIG9mIHRoZSBSZXNvdXJjZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IFJlc291cmNlIFVSSS5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X3VyaSgpIHsgcmV0dXJuIHRoaXMudXJpLnJlcGxhY2UoJy4vJywgJycpOyB9XG4gIC8qKlxuICAgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBVUkkgb2YgdGhlIFJlc291cmNlLlxuICAgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICAgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSBVUkkuXG4gICAqL1xuZnVuY3Rpb24gZ2V0X2V0YWcoKSB7IHJldHVybiB0aGlzLmV0YWc7IH1cbiAgICAvKipcbiAgXHQgKiBAc3VtbWFyeSBGb3JjZXMgdGhlIFJlc291cmNlIHRvIHN5bmNocm9uaXNlIHdpdGggdGhlIEtUQlMuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBcbiAgICAgKiAgJ29wdGlvbnMuX29uX3N0YXRlX3JlZnJlc2hfJzogdHJ1ZXxmYWxzZVxuICAgICAqICAgZW5hYmxlIG9yIGRpc2FibGUgdGhlIG9sZCBiZWhhdmlvciBvZiBjYWxsaW5nIF9vbl9zdGF0ZV9yZWZyZXNoXyBvbiB0aGUgcmVzb3VyY2UgYWZ0ZXIgc3luY2hyb25pc2UgY29tcGxldGVzXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogRm9yY2VzIHRoZSBSZXNvdXJjZSB0byBzeW5jaHJvbmlzZSB3aXRoIHRoZSBLVEJTLlxuICBcdCAqIFRoaXMgbWV0aG9kIHRyaWdnZXJzIGEgQWpheCBxdWVyeSB0aGF0IHdpbGxcbiAgXHQgKiB0cmlnZ2VyIHRoZSBfb25fc3RhdGVfcmVmcmVzaF8gbWV0aG9kIG9mIHRoZSBSZXNvdXJjZVxuICBcdCAqIG9uIHN1Y2Nlc3MuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGZvcmNlX3N0YXRlX3JlZnJlc2gob3B0aW9ucywgc3VjY2VzcywgcmVqZWN0KSB7XG4gICAgXG4gICAgc3VjY2VzcyA9IHN1Y2Nlc3MgfHwgZnVuY3Rpb24gKCkge307XG4gICAgcmVqZWN0ID0gcmVqZWN0IHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHsnX29uX3N0YXRlX3JlZnJlc2hfJzogdHJ1ZX07IC8vIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cbiAgICBjb25zb2xlLmxvZyhcIlRFU1RFU1RcIik7XG5cbiAgICB2YXIgdXJsID0gdGhpcy51cmk7XG4gICAgdmFyIHRyYyA9IHRoaXMgO1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIHhockZpZWxkczoge1xuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuXG4gICAgICAgIGlmIChYSFIuc3RhdHVzID09PSAnNDAxJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nIChYSFIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgICAgICAgIHZhciBMaW5rID0gWEhSLmdldFJlc3BvbnNlSGVhZGVyKCdMaW5rJyk7XG4gICAgICAgICAgdmFyIEQgPSBMaW5rLnNwbGl0ICgnLCcpO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBELmxlbmd0aDtpKyspICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhciBTb3VzRCA9IERbaV0uc3BsaXQoJzsnKTtcbiAgICAgICAgICAgIHZhciBsaW5rO1xuICAgICAgICAgICAgdmFyIFVSTFN1Y2Nlc3M7XG4gICAgICAgICAgICBpZiAoU291c0RbMV0gPT09IFwiIHJlbD1vYXV0aF9yZXNvdXJjZV9zZXJ2ZXJcIikgICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxpbmsgPSBTb3VzRFswXS5zdWJzdHIoMSwgU291c0RbMF0ubGVuZ3RoIC0gMik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoU291c0RbMV0gPT09IFwiIHJlbD1zdWNjZXNzZnVsX2xvZ2luX3JlZGlyZWN0XCIpICAgICAgICAgICAge1xuICAgICAgICAgICAgICBVUkxTdWNjZXNzID0gU291c0RbMF0uc3Vic3RyKDIsIFNvdXNEWzBdLmxlbmd0aCAtIDMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB3aW5kb3cub3BlbiAobGluaykgO1xuICAgICAgICB9XG4gICAgICAgIHJlamVjdChYSFIpO1xuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzLCB4aHIpe1xuICAgICAgICB0cmMuZXRhZyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignRVRhZycpO1xuICAgICAgICB0cmMudHJpZ2dlcignZ2V0ZXRhZycpO1xuICAgICAgICBpZiAob3B0aW9ucy5fb25fc3RhdGVfcmVmcmVzaF8pIHtcbiAgICAgICAgICB0cmMuX29uX3N0YXRlX3JlZnJlc2hfKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHN1Y2Nlc3MoZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgICAvKipcbiAgXHQgKiBAc3VtbWFyeSBGb3JjZXMgdGhlIFJlc291cmNlIHRvIHN5bmNocm9uaXNlXG4gIFx0ICogd2l0aCBhdCBhIGdpdmVuIHJlZnJlc2hpbmcgcmF0ZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2Ugd2l0aCB0aGUgS1RCU1xuICBcdCAqIGV2ZXJ5IHBlcmlvZCBzZWNvbmRzLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBwZXJpb2QgVGltZSBpbiBzZWNvbmRzIGJldHdlZW4gdHdvIHN5bmNocm9uaXNhdGlvbnMuXG4gIFx0ICovXG5cblxuICBmdW5jdGlvbiBzdGFydF9hdXRvX3JlZnJlc2gocGVyaW9kKSB7XG4gICAgdmFyIGEgPSB0aGlzLmF1dG9fcmVmcmVzaF9pZD90aGlzLnN0b3BfYXV0b19yZWZyZXNoKCk6bnVsbDtcbiAgICB0aGlzLmF1dG9fcmVmcmVzaF9pZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSwgcGVyaW9kICogMTAwMCk7XG4gIH1cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgU3RvcHMgdGhlIGF1dG9yZWZyZXNoIHN5bmNocm9uaXNhdGlvblxuICBcdCAqIG9mIHRoZSBSZXNvdXJjZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFN0b3BzIHRoZSBhdXRvcmVmcmVzaCBzeW5jaHJvbmlzYXRpb24gb2ZcbiAgXHQgKiB0aGUgUmVzb3VyY2UuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHN0b3BfYXV0b19yZWZyZXNoKCkge1xuICAgIGlmICh0aGlzLmF1dG9fcmVmcmVzaF9pZCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5hdXRvX3JlZnJlc2hfaWQpO1xuICAgICAgZGVsZXRlKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICB9XG4gIH1cbiAgLy9cdFx0ZnVuY3Rpb24gX29uX3N0YXRlX3JlZnJlc2hfKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YTsgY29uc29sZS5sb2coXCJoZXJlXCIpOyB9XG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X3JlYWRfb25seSgpIHt9XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IERlbGV0ZSB0aGUgcmVzb3VyY2UgZnJvbSB0aGUgS1RCU1xuICBcdCAqIEB0b2RvIElNUFJPVkUgVEhJUyBNRVRIT0QgU08gVEhBVCBQUk9QRVIgRVZFTlQgSVMgUkFJU0VEXG4gIFx0ICogICAgIFdIRU4gQSBSRVNPVVJDRSBJUyBERUxFVEVELlxuICBcdCAqL1xuICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgZnVuY3Rpb24gcmVmcmVzaF9wYXJlbnQoKSB7XG4gICAgICAvL1RST1VWRVIgVU4gTU9ZRU4gTUFMSU4gREUgUkFGUkFJQ0hJUiBMQSBMSVNURSBERVMgQkFTRVMgRFUgS1RCUy4uLlxuICAgIH1cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgc3VjY2VzczogcmVmcmVzaF9wYXJlbnQuYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgdGhyb3cgXCJDYW5ub3QgZGVsZXRlIFwiICsgdGhpcy5nZXRfcmVzb3VyY2VfdHlwZSgpICsgXCIgXCIgKyB0aGlzLnVyaSArIFwiOiBcIiArIHRleHRTdGF0dXMgKyAnICcgKyBKU09OLnN0cmluZ2lmeShlcnJvclRocm93bik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgbGFiZWwgb2YgdGhlIFJlc291cmNlXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF9sYWJlbCgpIHsgcmV0dXJuIHRoaXMubGFiZWw7IH1cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBmdW5jdGlvbiBzZXRfbGFiZWwoKSB7fVxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHJlc2V0X2xhYmVsKCkge31cblxuICAvLyBBRERFRCBGVU5DVElPTlNcbiAgLyoqXG4gIFx0ICogTWV0aG9kIHVzZWQgdG8gY2hlY2sgaWYgdGhlIGRpc3RhbnQgdmFsdWUgaXMgZGlmZmVyZW50XG4gIFx0ICogZnJvbSB0aGUgY3VycmVudCBsb2NhbCB2YWx1ZSAoYW5kIHVwZGF0ZSB0aGUgbG9jYWwgdmFsdWVcbiAgXHQgKiBpZiB0aGVyZSBpcyBhIGRpZmZlcmVuY2UuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKiBAcGFyYW0gbG9jYWxfZmllbGQge1N0cmluZ30gTmFtZSBvZiB0aGUgZmllbGQgb2YgdGhlIHRoaXNcbiAgXHQgKiAgICAgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGluZm9ybWF0aW9uIHRvIGNoZWNrLlxuICBcdCAqIEBwYXJhbSBkaXN0YW50IHtWYWx1ZX0gVmFsdWUgb2YgdGhlIGRpc3RhbnQgaW5mb3JtYXRpb24uXG4gIFx0ICogQHBhcmFtIG1lc3NhZ2VfaWZfY2hhbmdlZCB7U3RyaW5nfSBNZXNzYWdlIHRvIHRyaWdnZXIgaWZcbiAgXHQgKiAgICAgdGhlIGluZm9ybWF0aW9uIGhhcyBiZWVuIHVwZGF0ZWQuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIF9jaGVja19jaGFuZ2VfKGxvY2FsX2ZpZWxkLCBkaXN0YW50LCBtZXNzYWdlX2lmX2NoYW5nZWQpIHtcbiAgICAvLyBUT0RPIGNoZWNrIGlmIHRoaXMgaXMgdGhlIHdhbnRlZCBiZWhhdmlvdXI6XG4gICAgLy8gSWYgZGlzdGFudCBpcyB1bmRlZmluZWQgLT4gd2hhdCB0byBkbz9cbiAgICBpZiAoZGlzdGFudCAhPT0gdW5kZWZpbmVkICYmIHRoaXNbbG9jYWxfZmllbGRdICE9PSBkaXN0YW50KSB7XG4gICAgICB0aGlzW2xvY2FsX2ZpZWxkXSA9IGRpc3RhbnQ7XG4gICAgICB0aGlzLnRyaWdnZXIobWVzc2FnZV9pZl9jaGFuZ2VkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oaWQsIHVyaSwgdHlwZSwgbGFiZWwpIHtcbiAgICAvLyBhIFJlc291cmNlIGlzIGFuIEV2ZW50SGFuZGxlclxuICAgIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgLy8gRE9DVU1FTlRFRCBBQk9WRVxuICAgIC8vIEFUVFJJQlVURVNcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy51cmkgPSB1cmk7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgLy8gQVBJIE1FVEhPRFNcbiAgICB0aGlzLmdldF9pZCA9IGdldF9pZDtcbiAgICB0aGlzLmdldF91cmkgPSBnZXRfdXJpO1xuICAgIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCA9IGZvcmNlX3N0YXRlX3JlZnJlc2g7XG4gICAgdGhpcy5nZXRfcmVhZF9vbmx5ID0gZ2V0X3JlYWRfb25seTtcbiAgICB0aGlzLnJlbW92ZSA9IHJlbW92ZTtcbiAgICB0aGlzLmdldF9sYWJlbCA9IGdldF9sYWJlbDtcbiAgICB0aGlzLnNldF9sYWJlbCA9IHNldF9sYWJlbDtcbiAgICB0aGlzLnJlc2V0X2xhYmVsID0gcmVzZXRfbGFiZWw7XG4gICAgdGhpcy5nZXRfZXRhZyA9IGdldF9ldGFnO1xuICAgIC8vIGhlbHBlclxuICAgIHRoaXMuZ2V0X3Jlc291cmNlX3R5cGUgPSBnZXRfcmVzb3VyY2VfdHlwZTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfID0gX2NoZWNrX2NoYW5nZV87XG4gICAgdGhpcy5zdGFydF9hdXRvX3JlZnJlc2ggPSBzdGFydF9hdXRvX3JlZnJlc2g7XG4gICAgdGhpcy5zdG9wX2F1dG9fcmVmcmVzaCA9IHN0b3BfYXV0b19yZWZyZXNoO1xuICAgIHRoaXMuZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZT1nZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSkoKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNSZXNvdXJjZTtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIEtUQlNPYnNlbCA9IHJlcXVpcmUoXCIuL0tUQlMuT2JzZWwuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgVHJhY2Ugb2JqZWN0IHRoYXQgaXMgc3luY2hyb25pc2VkIHRvIGEgS1RCUy5cbiAqIEBjbGFzcyBKYXZhc2NyaXB0IFRyYWNlIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUyB0cmFjZS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5LVEJTLlRyYWNlIGlzIGEgSmF2YXNjcmlwdCBUcmFjZSBvYmplY3RcbiAqIHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIHRyYWNlLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXRcbiAqIHRoZSBPYnNlbHMgZnJvbSB0aGUgS1RCUyB0cmFjZSwgY3JlYXRlIG5ldyBPYnNlbHMsIGV0Yy5cbiAqXG4gKiBOb3RlOiB0aGlzIFRyYWNlIG9iamVjdCBkb2VzIG5vdCBpbXBsZW1lbnQgYWxsIHRoZSBtZXRob2RzXG4gKiBhdmFpbGFibGUgaW4gdGhlIEtUQlMgQVBJIHlldC5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBjbGFzcyBkbyBub3Qgc3VwcG9ydCB0cmFuc2Zvcm1hdGlvbnMuXG4gKlxuICogQHRvZG8gRnVsbHkgaW1wbGVtZW50IEtUQlMgQVBJXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHR1cmlcdFVSSSBvZiB0aGUgS1RCUyB0cmFjZSB0byBsb2FkLlxuICogQHBhcmFtIHtTdHJpbmd9XHRbaWRdXHRJRCBvZiB0aGUgS1RCUyB0cmFjZSB0byBsb2FkLlxuICovXG52YXIgS1RCU1RyYWNlID0gZnVuY3Rpb24gVHJhY2UodXJpLCBpZCkge1xuICAvLyBLVEJTLlRyYWNlIGlzIGEgUmVzb3VyY2VcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7IGlkID0gdXJpOyB9XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIGlkLCB1cmksICdCYXNlJywgXCJcIik7XG5cbiAgdGhpcy50ZW1wID0ge307IC8vIGF0dHJpYnV0ZSB1c2VkIHRvIHN0b3JlIGFjdGlvbnMgbWFkZSBieSB0aGUgdXNlciBvbiB0aGUgdHJhY2Ugd2hpbGUgbm90IGtub3dpbmcgaWYgdGhleSBhcmUgYWxsb3dlZC4gZS5nLiwgY3JlYXRlX29ic2VsLCB3aGVuIHdlIGRvbid0IGtub3cgeWV0IGlmIHRoZSBUcmFjZSBpcyBhIFN0b3JlZFRyYWNlIGJlY2F1c2UgdGhlIEtUQlMgZGlkbid0IHJlcGx5IHlldC5cbiAgdGhpcy5kZWZhdWx0X3N1YmplY3QgPSBcIlwiO1xuICB0aGlzLm1vZGVsX3VyaSA9IFwiXCI7XG4gIHRoaXMub2JzZWxfbGlzdF91cmkgPSB1cmkgKyBcIkBvYnNlbHNcIjtcbiAgdGhpcy5iYXNlX3VyaSA9IFwiXCI7XG4gIHRoaXMub3JpZ2luID0gXCJcIjtcbiAgLy90aGlzLm9yaWdpbl9vZmZzZXQgPSAobmV3IERhdGUoMCkpLmdldE1pbGxpc2Vjb25kcygpO1xuICB0aGlzLm9ic2VsX2xpc3QgPSBbXTsgdGhpcy50cmFjZVNldCA9IFtdO1xuICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbn07XG5cbktUQlNUcmFjZS5wcm90b3R5cGUgPSB7XG4gIC8vLy8vLy8vLy8vIE9GRklDSUFMIEFQSVxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBHZXRzIHRoZSBiYXNlIHdoZXJlIHRoZSB0cmFjZSBpcyBzdG9yZWQuXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gVVJJIG9mIHRoZSBiYXNlIHdoZXJlIHRoZSB0cmFjZSBpcyBzdG9yZWQuXG4gIFx0ICovXG4gIGdldF9iYXNlOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5nZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlKHRoaXMuZ2V0X3VyaSgpLHRoaXMuYmFzZV91cmkpO1xuICB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBHZXRzIHRoZSBtb2RlbCBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHJldHVybnMge01vZGVsfSBNb2RlbCBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHRvZG8gREVGSU5FIFdIQVQgSVMgQSBNT0RFTFxuICBcdCAqL1xuICBnZXRfbW9kZWw6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZSh0aGlzLmdldF91cmkoKSx0aGlzLm1vZGVsX3VyaSk7XG4gfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgb3JpZ2luIG9mIHRoZSB0cmFjZS5cbiAgXHQgKiBAcmV0dXJucyB7T3JpZ2lufSBPcmlnaW4gb2YgdGhlIHRyYWNlLlxuICBcdCAqIEB0b2RvIERFRklORSBXSEFUIElTIEFOIE9SSUdJTlxuICBcdCAqL1xuICBnZXRfb3JpZ2luOiBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7IHJldHVybiB0aGlzLm9yaWdpbjsgfSxcbiAgLy9nZXRfb3JpZ2luX29mZnNldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm9yaWdpbl9vZmZzZXQ7IH0sXG4gIC8qa3Ric19vcmlnaW5fdG9fbXM6IGZ1bmN0aW9uKGt0YnNfZGF0ZV9zdHIpIHtcbiAgXHRcdHZhciBZID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMCw0KTtcbiAgXHRcdHZhciBNID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoNSwyKSAtIDE7XG4gIFx0XHR2YXIgRCA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDgsMik7XG4gIFx0XHR2YXIgaCA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDExLDIpO1xuICBcdFx0dmFyIG0gPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigxNCwyKTtcbiAgXHRcdHZhciBzID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMTcsMik7XG4gIFx0XHR2YXIgbXMgPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigyMCwzKTtcbiAgXHRcdHJldHVybiBEYXRlLlVUQyhZLE0sRCxoLG0scyxtcyk7XG4gIFx0fSwqL1xuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGxpc3Rfc291cmNlX3RyYWNlczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBsaXN0X3RyYW5zZm9ybWVkX3RyYWNlczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgbGlzdCBvZiBvYnNlbHMgaW4gYW4gb3B0aW9uYWwgdGltZSBpbnRlcnZhbC5cbiAgXHQgKiBJZiBubyBtaW5pbXVtIHRpbWUgYW5kIG5vIG1heGltdW0gdGltZSBjb25zdHJhaW50IGFyZVxuICBcdCAqIGRlZmluZWQsIHJldHVybnMgdGhlIHdob2xlIGxpc3Qgb2Ygb2JzZWxzLlxuICBcdCAqIElmIG9uZSBvZiB0aGUgdHdvIGNvbnN0cmFpbnRzIGFyZSBkZWZpbmVkLCB0aGVuIHJldHVybnNcbiAgXHQgKiBvYnNlbHMgbWF0Y2hpbmcgdGhlIHRpbWUgY29uc3RyYWludHMuXG4gIFx0ICpcbiAgXHQgKiBOb3RlOiBpZiBhbiBvYnNlbCBvdmVybGFwcyB3aXRoIHRoZSBzdGFydCBvciB0aGUgZW5kXG4gIFx0ICogY29uc3RyYWludCwgdGhlbiBpdCB3aWxsIGJlIGluY2x1ZGVkIChmb3IgaW5zdGFuY2UgYW5cbiAgXHQgKiBvYnNlbCB0aGF0IHN0YXJ0cyBiZWZvcmUgdGhlIHN0YXJ0IGNvbnN0cmFpbnQgYW5kIGVuZHNcbiAgXHQgKiBhZnRlciB0aGF0IGNvbnN0cmFpbnQgd2lsbCBiZSBpbmNsdWRlZCkuXG4gIFx0ICpcbiAgXHQgKiBOb3RlOiB0aGUgbGlzdCByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCBpcyB0aGVcbiAgXHQgKiBsaXN0IG9mIE9ic2VscyB0aGF0IGFyZSBsb2FkZWQgbG9jYWxseS5cbiAgXHQgKiBXaGVuIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCwgYSBxdWVyeSB0byB0aGUgS1RCU1xuICBcdCAqIGlzIG1hZGUgdG8ga25vdyBpZiB0aGVyZSBhcmUgb3RoZXIgT2JzZWxzIG1hdGNoaW5nXG4gIFx0ICogdGhlIHF1ZXJ5LiBJZiBzbywgdGhlc2Ugb3RoZXIgb2JzZWxzIHdpbGwgYmUgbG9hZGVkXG4gIFx0ICogaW4gdGhlIGxvY2FsIGNvcHkgb2YgdGhlIHRyYWNlIGFuZCBhXG4gIFx0ICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6Y3JlYXRlOm9ic2VsfHRyYWNlOmNyZWF0ZTpvYnNlbH1cbiAgXHQgKiBldmVudCBvciBhXG4gIFx0ICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6dXBkYXRlfHRyYWNlOnVwZGF0ZX1cbiAgXHQgKiBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCB0byBub3RpZnkgdGhhdCBvdGhlclxuICBcdCAqIE9ic2VscyBoYXZlIGJlZW4gbG9hZGVkLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbYmVnaW5dIE1pbmltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtlbmRdIE1heGltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtCb29sZWFufSBbcmV2ZXJzZT1mYWxzZV0gUmV0dXJucyB0aGUgb2JzZWwgbGlzdCBpblxuICBcdCAqICAgICByZXZlcnNlIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgdHJ1ZSBhbmQgaW4gbm9ybWFsXG4gIFx0ICogICAgIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgZmFsc2UuXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxPYnNlbD59IExpc3Qgb2YgcmVsZXZhbnQgb2JzZWxzXG4gIFx0ICogQHRvZG8gUkVWRVJTRSBJUyBOT1QgWUVUIFRBS0VOIElOVE8gQUNDT1VOVFxuICBcdCAqL1xuICAvLyBUT0RPIGFkZCBhbiBvcHRpb25hbCBDQUxMQkFDSz8/P1xuICBsaXN0X29ic2VsczogZnVuY3Rpb24oYmVnaW4sIGVuZCwgcmV2ZXJzZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMub2JzZWxfbGlzdF91cmkgPSB0aGlzLnVyaSArIFwiQG9ic2Vsc1wiO1xuICAgIGlmICh0aGlzLm9ic2VsX2xpc3RfdXJpID09PSBcIlwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIEtUQlM6VHJhY2U6bGlzdF9vYnNlbHMoKSB1bmtub3duIHVyaVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgT0JKID0gdGhpcztcblxuICAgIC8vXHRcdCQuZ2V0SlNPTih0aGlzLm9ic2VsX2xpc3RfdXJpLHRoaXMuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF8uYmluZCh0aGlzKSk7XG4gICAgdmFyIE9CSiA9IHRoaXM7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy5vYnNlbF9saXN0X3VyaSwvLysnLmpzb24nLFxuICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgZGF0YToge21pbmI6IGJlZ2luLCBtYXhiOiBlbmQsIHJldmVyc2U6IHJldmVyc2V9LFxuICAgICAgeGhyRmllbGRzOiB7IHdpdGhDcmVkZW50aWFsczogdHJ1ZSB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKFhIUikge1xuICAgICAgICBpZiAoWEhSLnN0YXR1cyA9PT0gJzQwMScpIHtcbiAgICAgICAgICB2YXIgbGlua2hlYWRlciA9IFhIUi5nZXRSZXNwb25zZUhlYWRlcignTGluaycpO1xuICAgICAgICAgIHZhciBkID0gbGlua2hlYWRlci5zcGxpdCAoJywnKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgZC5sZW5ndGg7aSsrKSAgICAgICAgICB7XG4gICAgICAgICAgICB2YXIgc291c0QgPSBkW2ldLnNwbGl0KCc7Jyk7XG4gICAgICAgICAgICBpZiAoc291c0RbMV0gPT09IFwiIHJlbD1vYXV0aF9yZXNvdXJjZV9zZXJ2ZXJcIikgICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhciBsaW5rID0gc291c0RbMF0uc3Vic3RyKDEsIHNvdXNEWzBdLmxlbmd0aCAtIDIpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzb3VzRFsxXSA9PT0gXCIgcmVsPXN1Y2Nlc3NmdWxfbG9naW5fcmVkaXJlY3RcIikgICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vXHR2YXJcdFVSTFN1Y2Nlc3MgPSBzb3VzRFswXS5zdWJzdHIoMixzb3VzRFswXS5sZW5ndGgtMyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdpbmRvdy5vcGVuIChsaW5rKSA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHRpZiAoZGF0YS5vYnNlbHMubGVuZ3RoID4gMClcdHtPQkouQmVmb3JlX29uX3JlZnJlc2hfb2JzZWxfbGlzdF8gKGRhdGEpO31cdH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5vYnNlbF9saXN0LmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoZW5kICYmIG8uZ2V0X2JlZ2luKCkgPiBlbmQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBpZiAoYmVnaW4gJiYgby5nZXRfZW5kKCkgPCBiZWdpbikgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9LFxuXG4gIEJlZm9yZV9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhUmVjdSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8vIHBhciBwYXF1ZXRcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOkNvbmZpZycsIGRhdGFSZWN1KTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGVuZCA9IE51bWJlcihpKSArIE51bWJlcigxMDApO1xuXG4gICAgaWYgKGRhdGFSZWN1Lm9ic2Vscykge1xuICAgICAgdGhpcy5fb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwKGRhdGFSZWN1Lm9ic2VscywgaSwgZW5kKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLl9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAoZGF0YVJlY3UsIGksIGVuZCk7XG4gICAgfVxuXG5cbiAgfSxcbiAgX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cDogZnVuY3Rpb24oZGF0YVJlY3UsIGksIGVuZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBjb3VudCA9IDA7XG4gICAgdmFyIGQgPSBkYXRhUmVjdS5sZW5ndGggO1xuICAgIHZhciBkYXRhVG9EcmF3ID0gZGF0YVJlY3Uuc2xpY2UgKGksIGVuZCk7XG4gICAgY29uc29sZS5sb2cgKCdfb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwJyk7XG4gICAgICBmb3IgKHZhciBqPTAgOyAgaiA8IGRhdGFUb0RyYXcubGVuZ3RoOyBqKyspe1xuICAgICAgICB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfKGRhdGFUb0RyYXdbal0pO1xuICAgICAgICBpZiAoaiA9PT0gZGF0YVRvRHJhdy5sZW5ndGggLTEpe1xuICAgICAgICAgIHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlVCcpO1xuICAgICAgICAgIHZhciBpID0gTnVtYmVyKGkpICsgZGF0YVRvRHJhdy5sZW5ndGggKyBOdW1iZXIoMSk7XG4gICAgICAgICAgdmFyIGVuZCA9IChOdW1iZXIoaSkgKyBOdW1iZXIoMTAwKSA+IGQpP2RhdGFSZWN1Lmxlbmd0aCA6IE51bWJlcihpKSArIE51bWJlcigxMDApXG4gICAgICAgICAgaWYgKGkgPD0gZCkgIHtcbiAgICAgICAgICAgICAgdGhpcy5fb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwKGRhdGFSZWN1LCBpLCBlbmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTp1cGRhdGVDb21wbGV0ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICB9LFxuXG4gIF9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGNvdW50ID0gMDtcblxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgY291bnQgKys7XG4gICAgICB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfKGVsKTtcbiAgICAgIGlmIChjb3VudCA9PT0gZGF0YS5sZW5ndGgpICAgICAge3RoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlVCcsIHRoaXMpO31cbiAgICB9LCB0aGlzKTtcblxuXG4gIH0sXG5cbiAgZ2V0X0xhc3Rfb2JzZWw6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnM7XG4gICAgdmFyIG1heCA9IDA7XG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uZ2V0X2JlZ2luKCkgPiBtYXgpIHsgb2JzID0gbzsgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYnM7XG4gIH0sXG4gIGdldF9GaXJzdF9vYnNlbDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icztcbiAgICB2YXIgbWluMSA9IDk5OTk5OTk5OTk5OTk7XG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uZ2V0X2JlZ2luKCkgPCBtaW4xKSB7IG9icyA9IG87IH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JzO1xuICB9LFxuICBnZXRfTGlzdF9vYnNlbF9QYXJUeXBlOiBmdW5jdGlvbihvYnNlbFR5cGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbGlzdGUgPSBbXTtcblxuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLnR5cGUgPT09IG9ic2VsVHlwZSkgeyBsaXN0ZS5wdXNoKG8pOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGxpc3RlO1xuICB9LFxuXG5cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgRm9yY2VzIHRoZSBsb2NhbCBvYnNlbCBsaXN0IHRvIGJlIHN5bmNocm9uaXNlZFxuICBcdCAqIHdpdGggdGhlIEtUQlMgYXQgYSBnaXZlbiByZWZyZXNoaW5nIHJhdGUuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IHBlcmlvZCBUaW1lIGluIHNlY29uZHMgYmV0d2VlbiB0d28gc3luY2hyb25pc2F0aW9ucy5cbiAgXHQgKi9cbiAgc3RhcnRfYXV0b19yZWZyZXNoX29ic2VsX2xpc3Q6IGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBhID0gdGhpcy5hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdF9pZD90aGlzLnN0b3BfYXV0b19yZWZyZXNoX29ic2VsX2xpc3QoKTpudWxsO1xuICAgIHRoaXMuYXV0b19yZWZyZXNoX29ic2VsX2xpc3RfaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5saXN0X29ic2Vscy5iaW5kKHRoaXMpLCBwZXJpb2QgKiAxMDAwKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgU3RvcHMgdGhlIGF1dG9yZWZyZXNoIHN5bmNocm9uaXNhdGlvblxuICBcdCAqIG9mIHRoZSBvYnNlbCBsaXN0LlxuICBcdCAqL1xuICBzdG9wX2F1dG9fcmVmcmVzaF9vYnNlbF9saXN0OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdF9pZCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5hdXRvX3JlZnJlc2hfaWQpO1xuICAgICAgZGVsZXRlKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gIFx0ICogUmV0cmlldmUgYW4gb2JzZWwgaW4gdGhlIHRyYWNlIGZyb20gaXRzIElELlxuICBcdCAqIElmIHRoZSBvYnNlbCBkb2VzIG5vdCBleGlzdCBsb2NhbGx5LCByZXR1cm5zXG4gIFx0ICogdW5kZWZpbmVkIGFuZCBzZW5kIGEgcXVlcnkgdG8gdGhlIEtUQlNcbiAgXHQgKiAod2hpY2ggd2lsbCByZXN1bHQgaW4gYWRkaW5nIHRoaXMgb2JzZWwgbG9jYWxseVxuICBcdCAqIGlmIGl0IGV4aXN0cyBvbiB0aGUgS1RCUykuXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGlkIElEIG9mIHRoZSBPYnNlbCB0byByZXRyaWV2ZVxuICBcdCAqIEByZXR1cm5zIHtPYnNlbH0gT2JzZWwgdGhhdCBjb3JyZXNwb25kcyB0byB0aGlzIElEXG4gIFx0ICogICAgIG9yIHVuZGVmaW5lZCBpZiB0aGUgb2JzZWwgd2FzIG5vdCBmb3VuZC5cbiAgXHQgKiBAdG9kbyBUT0RPIGFkZCBhbiBvcHRpb25hbCBDQUxMQkFDS1xuICBcdCAqL1xuICBnZXRfb2JzZWw6IGZ1bmN0aW9uKGlkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icztcbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5nZXRfaWQoKSA9PT0gaWQpIHsgb2JzID0gbzsgfVxuICAgIH0pO1xuICAgIGlmIChvYnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gc2VuZHMgYSBxdWVyeSB0byBmaW5kIHRoZSBvYnNlbFxuICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAvLyBUT0RPIGlkZWFsbHkgSlNPTi4uLiBXaGVuIEtUQlMgc3VwcG9ydHMgaXQhXG4gICAgICAgIHVybDogdGhpcy51cmkgKyBpZCxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHN1Y2Nlc3M6IHRoaXMuX3BhcnNlX2dldF9vYnNlbF8uYmluZCh0aGlzKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb2JzO1xuICB9LFxuICAvKipcbiAgXHQgKiBDYWxsYmFjayBmb3IgcXVlcmllcyB3aGVyZSBhbiBvYnNlbCBpcyBleHBlY3RlZCBhcyBhIHJlc3VsdFxuICBcdCAqIFBhcnNlcyB0aGUgSlNPTiBkYXRhIGZyb20gdGhlIEtUQlMgdG8gY3JlYXRlIGEgbmV3IE9ic2VsIGxvY2FsbHlcbiAgXHQgKiBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHkuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKi9cbiAgX3BhcnNlX2dldF9vYnNlbF86IGZ1bmN0aW9uKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icyA9IHtcbiAgICAgIGF0dHJpYnV0ZXM6IHt9XG4gICAgfTtcblxuICAgIC8vIE9CU0VMIElEXG4gICAgb2JzLmlkID0gZGF0YVtcIkBpZFwiXTtcbiAgICBpZiAodGhpcy50eXBlID09PSBcIkNvbXB1dGVkVHJhY2VcIikge29icy5pZCA9IG9icy50eXBlICsgXCJfXCIgKyBvYnMuaWQ7fVxuICAgIGlmIChvYnMuaWQuc3Vic3RyKDAsIDIpID09PSBcIi4vXCIpIHsgb2JzLmlkID0gb2JzLmlkLnN1YnN0cigyKTsgfVxuXG4gICAgLy8gT0JTRUwgVFJBQ0VcbiAgICAvLyBkYXRhLmhhc1RyYWNlO1xuICAgIG9icy50cmFjZSA9IHRoaXM7XG5cbiAgICAvLyBPQlNFTCBUWVBFXG4gICAgLy8gZGF0YVtcIkB0eXBlXCJdOyAvLyBUT0RPIEJVRyBLVEJTIC0+IFVTRSBcIm06dHlwZVwiIGluc3RlYWRcbiAgICAvLyBkYXRhW1wibTp0eXBlXCJdO1xuICAgIG9icy50eXBlID0gZGF0YVtcIkB0eXBlXCJdLnN1YnN0cigyKTtcblxuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KCdodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnKSkge1xuICAgICAgb2JzLmxhYmVsID0gZGF0YVsnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ107XG4gICAgfVxuICAgIC8vb2JzLmJlZ2luID0gZGF0YS5iZWdpbjtcbiAgICAvL29icy5lbmQgPSBkYXRhLmVuZDtcbiAgICB2YXIgZCA9IG5ldyBEYXRlICh0aGlzLm9yaWdpbik7XG4gICAgb2JzLmJlZ2luID0gZC5nZXRUaW1lKCkgKyBkYXRhLmJlZ2luIDtcbiAgICBvYnMuZW5kID0gZC5nZXRUaW1lKCkgKyBkYXRhLmVuZDtcblxuICAgIC8vIERFTEVUSU5HIFBST1BFUlRJRVMgVEhBVCBIQVZFIEFMUkVBRFkgQkVFTiBDT1BJRURcbiAgICBkZWxldGUgZGF0YVtcIkBpZFwiXTtcbiAgICBkZWxldGUgZGF0YS5oYXNUcmFjZTtcbiAgICBkZWxldGUgZGF0YVtcIkB0eXBlXCJdO1xuICAgIGRlbGV0ZSBkYXRhLmJlZ2luO1xuICAgIGRlbGV0ZSBkYXRhLmVuZDtcbiAgICBkZWxldGUgZGF0YVsnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ107XG4gICAgLy9kZWxldGUgZGF0YVtcIm06dHlwZVwiXTtcblxuXG4gICAgLy8gQVRUUklCVVRFU1xuICAgIGZvciAodmFyIGF0dHIgaW4gZGF0YSkge1xuICAgICAgaWYgKGF0dHIuc3Vic3RyKDAsIDIpID09PSBcIm06XCIpIHsgLy8gVE9ETyB0aGlzIGlzIG5vdCBnZW5lcmljISEhIVxuICAgICAgICBvYnMuYXR0cmlidXRlc1thdHRyLnN1YnN0cigyKV0gPSBkYXRhW2F0dHJdO1xuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKGRhdGEsb2JzKTtcbiAgICB2YXIgbyA9IG5ldyBLVEJTT2JzZWwob2JzKTtcbiAgICBpZiAoIXRoaXMuX2NoZWNrX29ic2VsX2xvYWRlZF8obykpIHsgLy8gVE9ETyBmaXJzdCBhcHByb3hpbWF0aW9uXG4gICAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIG8pO1xuICAgIH1cbiAgfSxcblxuICAvLy8vLy8vLy8vL1xuICAvKipcbiAgXHQgKiBPdmVybG9hZHMgdGhlIHtAbGluayBTYW1vdHJhY2VzLktUQlMuUmVzb3VjZSNfb25fc3RhdGVfcmVmcmVzaF99IG1ldGhvZC5cbiAgXHQgKiBAcHJpdmF0ZVxuICBcdCAqL1xuICBfb25fc3RhdGVfcmVmcmVzaF86IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAvL1x0XHRjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLl9jaGVja19hbmRfdXBkYXRlX3RyYWNlX3R5cGVfKGRhdGFbJ0B0eXBlJ10pO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2RlZmF1bHRfc3ViamVjdCcsIGRhdGEuaGFzRGVmYXVsdFN1YmplY3QsICcnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdtb2RlbF91cmknLCBkYXRhLmhhc01vZGVsLCAndHJhY2U6bW9kZWwnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdvYnNlbF9saXN0X3VyaScsIGRhdGEuaGFzT2JzZWxMaXN0LCAndHJhY2U6dXBkYXRlJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnYmFzZV91cmknLCBkYXRhLmluQmFzZSwgJ3RyYWNlOmJhc2UnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdvcmlnaW4nLCBkYXRhLm9yaWdpbiwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2xhYmVsJywgZGF0YS5sYWJlbCwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlRGF0YScsIGRhdGEpO1xuICAgIC8vdGhpcy5fY2hlY2tfY2hhbmdlXygnb3JpZ2luX29mZnNldCcsdGhpcy5rdGJzX29yaWdpbl90b19tcyhkYXRhLm9yaWdpbiksJycpO1xuICB9LFxuICBfdXBkYXRlX21ldGhvZF86IGZ1bmN0aW9uKHRyYWNlX3R5cGUsIG1ldGhvZF9uYW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpc1ttZXRob2RfbmFtZV0gPSB0aGlzW3RyYWNlX3R5cGUgKyBcIl9tZXRob2RzXCJdW21ldGhvZF9uYW1lXTtcbiAgICBpZiAodGhpcy50ZW1wW21ldGhvZF9uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRlbXBbbWV0aG9kX25hbWVdLmZvckVhY2goZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgICAgdGhpc1ttZXRob2RfbmFtZV0ocGFyYW0pO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICBfY2hlY2tfYW5kX3VwZGF0ZV90cmFjZV90eXBlXzogZnVuY3Rpb24odHlwZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLnR5cGUgIT09IHR5cGUpIHtcbiAgICAgIGZvciAodmFyIG1ldGhvZF9uYW1lIGluIHRoaXNbdHlwZSArIFwiX21ldGhvZHNcIl0pIHtcbiAgICAgICAgaWYgKHRoaXNbdHlwZSArIFwiX21ldGhvZHNcIl0uaGFzT3duUHJvcGVydHkobWV0aG9kX25hbWUpKSAgICAgICAge3RoaXMuX3VwZGF0ZV9tZXRob2RfKHR5cGUsIG1ldGhvZF9uYW1lKTt9XG4gICAgICB9XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgfSxcbiAgLy8vLy8vLy8vLy9cbiAgLypcdF9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhKSB7XG4gIC8vXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuICBcdFx0dmFyIGlkLCBsYWJlbCwgdHlwZSwgYmVnaW4sIGVuZCwgYXR0cmlidXRlcywgb2JzO1xuICBcdFx0dmFyIG5ld19vYnNlbF9sb2FkZWQgPSBmYWxzZTtcbiAgXHRcdGRhdGEub2JzZWxzLmZvckVhY2goZnVuY3Rpb24oZWwsa2V5KSB7XG4gIFx0XHRcdHRoaXMuX3BhcnNlX2dldF9vYnNlbF8oZWwpO1xuICAvKlxuICBcdFx0XHR2YXIgYXR0ciA9IHt9O1xuICBcdFx0XHRhdHRyLmlkID0gZWxbJ0BpZCddO1xuICBcdFx0XHRhdHRyLnRyYWNlID0gdGhpcztcbiAgXHRcdFx0YXR0ci5sYWJlbCA9IGVsWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXSB8fCB1bmRlZmluZWQ7XG4gIFx0XHRcdGF0dHIudHlwZSA9IGVsWydAdHlwZSddO1xuICBcdFx0XHRhdHRyLmJlZ2luID0gZWxbJ2JlZ2luJ107XG4gIFx0XHRcdGF0dHIuZW5kID0gZWxbJ2VuZCddO1xuICBcdFx0XHRhdHRyLmF0dHJpYnV0ZXMgPSBlbDtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snQGlkJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXSk7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ0B0eXBlJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydiZWdpbiddKTtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snZW5kJ10pO1xuICBcdFx0XHRvYnMgPSBuZXcgU2Ftb3RyYWNlcy5LVEJTLk9ic2VsKGF0dHIpO1xuXG4gIFx0XHRcdGlmKCEgdGhpcy5fY2hlY2tfb2JzZWxfbG9hZGVkXyhvYnMpKSB7XG4gIFx0XHRcdFx0bmV3X29ic2VsX2xvYWRlZCA9IHRydWU7XG4gIFx0XHRcdH1cbiovXG4gIC8vfSx0aGlzKTtcbiAgLypcdFx0aWYobmV3X29ic2VsX2xvYWRlZCkge1xuICBcdFx0XHR0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZScsdGhpcy50cmFjZVNldCk7XG4gIFx0XHR9XG4qL1xuICAvL30sKi9cbiAgX2NoZWNrX29ic2VsX2xvYWRlZF86IGZ1bmN0aW9uKG9icykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLm9ic2VsX2xpc3Quc29tZShmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5nZXRfaWQoKSA9PT0gb2JzLmdldF9pZCgpOyAvLyBmaXJzdCBhcHByb3hpbWF0aW9uOiBvYnNlbCBoYXMgdGhlIHNhbWUgSUQgPT4gaXQgaXMgYWxyZWFkeSBsb2FkZWQuLi4gV2UgZG9uJ3QgY2hlY2sgaWYgdGhlIG9ic2VsIGhhcyBjaGFuZ2VkIVxuICAgIH0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vYnNlbF9saXN0LnB1c2gob2JzKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIFN0b3JlZFRyYWNlX21ldGhvZHM6IHtcbiAgICBzZXRfbW9kZWw6IGZ1bmN0aW9uKG1vZGVsKSB7fSxcbiAgICBzZXRfb3JpZ2luOiBmdW5jdGlvbihvcmlnaW4pIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XG4gICAgICAvL1x0dGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKG9yaWdpbikpLmdldE1pbGxpc2Vjb25kcygpO1xuICAgICAgLy8gVE9ETyBzeW5jIHdpdGggS1RCU1xuICAgIH0sXG4gICAgZ2V0X2RlZmF1bHRfc3ViamVjdDogZnVuY3Rpb24oKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRfc3ViamVjdDtcbiAgICB9LFxuICAgIHNldF9kZWZhdWx0X3N1YmplY3Q6IGZ1bmN0aW9uKHN1YmplY3QpIHt9LFxuICAgIGNyZWF0ZV9vYnNlbDogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAvLyBMT0NBTCBUUkFDRVxuICAgICAgLy92YXIgb2JzID0gbmV3IFNhbW90cmFjZXMuT2JzZWwob2JzZWxfcGFyYW1zKTtcbiAgICAgIC8vIEtUQlMgQk9HVUVcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgdmFyIGpzb25fb2JzZWwgPSB7XG4gICAgICAgIFwiQGNvbnRleHRcIjpcdFtcbiAgICAgICAgXCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgICAgICAgICAgIHsgXCJtXCI6IFwiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9zaW1wbGUtdHJhY2UtbW9kZWwjXCIgfVxuICAgICAgICBdLFxuICAgICAgICBcIkB0eXBlXCI6XHRcIm06XCIgKyBwYXJhbXMudHlwZSwgLy8gZml4ZWQ6IFwiU2ltcGxlT2JzZWxcIiwgLy8gVE9ETyBLVEJTIEJVRyBUTyBGSVhcbiAgICAgICAgaGFzVHJhY2U6XHRcIlwiLFxuICAgICAgICBzdWJqZWN0Olx0cGFyYW1zLmhhc093blByb3BlcnR5KFwic3ViamVjdFwiKT9wYXJhbXMuc3ViamVjdDp0aGlzLmdldF9kZWZhdWx0X3N1YmplY3QoKSxcbiAgICAgICAgLy9cIm06dHlwZVwiOlx0cGFyYW1zLnR5cGVcbiAgICAgIH07XG4gICAgICAvL2NvbnNvbGUubG9nKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIik/cGFyYW1zLnN1YmplY3Q6dGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCkscGFyYW1zLmhhc093blByb3BlcnR5KFwic3ViamVjdFwiKSxwYXJhbXMuc3ViamVjdCx0aGlzLmdldF9kZWZhdWx0X3N1YmplY3QoKSk7XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KFwiYmVnaW5cIikpIHsganNvbl9vYnNlbC5iZWdpbiA9IHBhcmFtcy5iZWdpbjsgfVxuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImVuZFwiKSkgeyBqc29uX29ic2VsLmJlZ2luID0gcGFyYW1zLmVuZDt9XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KFwiYXR0cmlidXRlc1wiKSkge1xuICAgICAgICBmb3IgKHZhciBhdHRyIGluIHBhcmFtcy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgaWYgKHBhcmFtcy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHIpKSAgICAgICAgICB7anNvbl9vYnNlbFtcIm06XCIgKyBhdHRyXSA9IHBhcmFtcy5hdHRyaWJ1dGVzW2F0dHJdO31cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gX29uX2NyZWF0ZV9vYnNlbF9zdWNjZXNzXyhkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgICAgICAvKlxuICAgICAgICBcdFx0XHRcdHZhciB1cmwgPSBqcVhIUi5nZXRSZXNwb25zZUhlYWRlcignTG9jYXRpb24nKTtcbiAgICAgICAgXHRcdFx0XHR2YXIgdXJsX2FycmF5ID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgIFx0XHRcdFx0Ki9cblxuICAgICAgICB2YXIgdXJsX2FycmF5ID0gZGF0YS5zcGxpdCgnLycpO1xuICAgICAgICB2YXIgb2JzZWxfaWQgPSB1cmxfYXJyYXlbdXJsX2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgICAvL3RoaXMuZ2V0X29ic2VsKG9ic2VsX2lkKTtcbiAgICAgICAgLy8gT3B0aW1pc2F0aW9uOiBkbyBub3QgZG8gYSBHRVQgcXVlcnkgdG8gZ2V0IHRoZSBPQlNFTFxuICAgICAgICAvLyBUaGUgT2JzZWwgcGFyYW1ldGVycyBhcmUgYWxyZWFkeSBrbm93biBpbiBwYXJhbVxuICAgICAgICAvLyBXZSBqdXN0IG5lZWQgdG8gYWRkIHRoZSBJRC5cbiAgICAgICAgcGFyYW1zLmlkID0gb2JzZWxfaWQ7XG4gICAgICAgIHBhcmFtcy50cmFjZSA9IHRoaXM7XG4gICAgICAgIHZhciBvID0gbmV3IEtUQlNPYnNlbChwYXJhbXMpO1xuICAgICAgICBpZiAoIXRoaXMuX2NoZWNrX29ic2VsX2xvYWRlZF8obykpIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIG8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IHRoaXMudXJpLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIHN1Y2Nlc3M6IF9vbl9jcmVhdGVfb2JzZWxfc3VjY2Vzc18uYmluZCh0aGlzKSxcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoanNvbl9vYnNlbClcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBDb21wdXRlZFRyYWNlX21ldGhvZHM6IHtcbiAgICBzZXRfbWV0aG9kOiBmdW5jdGlvbihtZXRob2QpIHt9LFxuICAgIGxpc3RfcGFyYW1ldGVyczogZnVuY3Rpb24oaW5jbHVkZV9pbmhlcml0ZWQpIHt9LFxuICAgIGdldF9wYXJhbWV0ZXI6IGZ1bmN0aW9uKGtleSkge30sXG4gICAgc2V0X3BhcmFtZXRlcjogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge30sXG4gICAgZGVsX3BhcmFtZXRlcjogZnVuY3Rpb24oa2V5KSB7fVxuICB9LFxuXG4gIC8qKlxuICAqIFVwbG9hZHMgYW4gYXJyYXkgb2Ygb2JzZWxzIHRvIHRoZSB0cmFjZS5cbiAgKiBAcGFyYW0gIHtBcnJheX0gb2JzZWxzIEFuZCBhcnJheSBvZiBvYnNlbCB0byBwb3N0IG9uIHRoZSB0cmFjZS5cbiAgKiBAcmV0dXJucyBBIFByb21pc2UuXG4gICovXG4gIGNyZWF0ZV9vYnNlbHM6IGZ1bmN0aW9uKG9ic2Vscyl7XG4gICAgXG4gICAgdmFyIG5ld19vYnNlbHNfZGF0YSA9IEpTT04uc3RyaW5naWZ5KG9ic2Vscyk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIFxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogdGhhdC51cmksXG4gICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgZGF0YTogbmV3X29ic2Vsc19kYXRhLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICByZXNvbHZlKFwib2JzZWxzIHVwbG9hZFwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdxdWVyeSBlcnJvcicpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgICAgICByZWplY3QoW2pxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvcl0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgfSxcblxuICAvLyBURU1QT1JBUlkgTUVUSE9EU1xuICBjcmVhdGVfb2JzZWw6IGZ1bmN0aW9uKG9ic2VsX3BhcmFtcykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICghdGhpcy5jcmVhdGVfb2JzZWwuaGFzT3duUHJvcGVydHkoJ2NyZWF0ZV9vYnNlbCcpKSB7XG4gICAgICB0aGlzLnRlbXAuY3JlYXRlX29ic2VsID0gW107XG4gICAgfVxuICAgIHRoaXMudGVtcC5jcmVhdGVfb2JzZWwucHVzaCAob2JzZWxfcGFyYW1zKTtcbiAgfSxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTVHJhY2U7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBLVEJTQmFzZSA9IHJlcXVpcmUoXCIuL0tUQlMuQmFzZS5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuLyoqXG4qIEBzdW1tYXJ5IEphdmFzY3JpcHQgS1RCUyBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuXG4qIEBjbGFzcyBKYXZhc2NyaXB0IEtUQlMgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLlxuKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuKiBAY29uc3RydWN0b3JcbiogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiogQGRlc2NyaXB0aW9uXG4qIFNhbW90cmFjZXMuS1RCUyBpcyBhIEphdmFzY3JpcHQgS1RCUyBvYmplY3QgdGhhdFxuKiBpcyBib3VuZCB0byBhIEtUQlMuIFRoaXMgT2JqZWN0IGltcGxlbWV0bnMgdGhlIEtUQlMgQVBJLlxuKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0IHRoZSBsaXN0IG9mIGJhc2VzXG4qIGF2YWlsYWJsZSBpbiB0aGUgS1RCUy4gQWNjZXNzIGEgc3BlY2lmaWMgYmFzZSwgZXRjLlxuKlxuKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRvIGxvYWQuXG4qL1xudmFyIEtUQlMgPSBmdW5jdGlvbiBLVEJTKHVyaSkge1xuICAvLyBLVEJTIGlzIGEgUmVzb3VyY2VcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIHVyaSwgdXJpLCAnS1RCUycsIFwiXCIpO1xuICB0aGlzLmJhc2VzID0gW107XG4gIHRoaXMuYnVpbHRpbl9tZXRob2RzID0gW107XG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xufTtcblxuS1RCUy5wcm90b3R5cGUgPSB7XG4gIC8vLy8vLy8vLy8vIE9GRklDSUFMIEFQSVxuICAvKipcbiAgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4qL1xuICBsaXN0X2J1aWx0aW5fbWV0aG9kczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuKi9cbiAgZ2V0X2J1aWx0aW5fbWV0aG9kOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiB0aGUgVVJJIG9mIHRoZSBiYXNlcyBjb250YWluZWQgaW4gdGhlIEtUQlNcbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gQXJyYXkgb2YgVVJJIG9mIGJhc2VzLlxuKi9cbiAgbGlzdF9iYXNlczogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuYmFzZXM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIEtUQlMuQmFzZSB3aXRoIHRoZSBnaXZlbiBJRC5cbiAgKiBAcmV0dXJucyBTYW1vdHJhY2VzLktUQlMuQmFzZSBCYXNlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIElEXG4gICogQHBhcmFtIGlkIHtTdHJpbmd9IFVSSSBvZiB0aGUgYmFzZVxuKi9cbiAgZ2V0X2Jhc2U6IGZ1bmN0aW9uKGlkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIG5ldyBLVEJTQmFzZSh0aGlzLnVyaSArIGlkLCBpZCk7XG4gIH0sXG4gIC8qKlxuICAqIENyZWF0ZSBhIG5ldyBiYXNlLlxuICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBVUkkgb2YgdGhlIGJhc2UgKG9wdGlvbmFsKVxuICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgYmFzZSAob3B0aW9uYWwpXG4qL1xuICBjcmVhdGVfYmFzZTogZnVuY3Rpb24oaWQsIGxhYmVsKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5ld19iYXNlID0ge1xuICAgICAgXCJAY29udGV4dFwiOlx0XCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgIFwiQHR5cGVcIjpcdFwiQmFzZVwiLFxuICAgICAgXCJAaWRcIjpcdFx0aWQgKyBcIi9cIixcbiAgICAgIFwibGFiZWxcIjpcdGxhYmVsXG4gICAgfTtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXdfYmFzZSksXG4gICAgICBzdWNjZXNzOiB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3F1ZXJ5IGVycm9yJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgLy8vLy8vLy8vLy9cbiAgLyoqXG4gICogT3ZlcmxvYWRzIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5LVEJTLlJlc291Y2UjX29uX3N0YXRlX3JlZnJlc2hffSBtZXRob2QuXG4gICogQHByaXZhdGVcbiovXG4gIF9vbl9zdGF0ZV9yZWZyZXNoXzogZnVuY3Rpb24oZGF0YSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2Jhc2VzJywgZGF0YS5oYXNCYXNlLCAna3Riczp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdidWlsdGluX21ldGhvZHMnLCBkYXRhLmhhc0J1aWxkaW5NZXRob2QsICdrdGJzOnVwZGF0ZScpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTO1xuIiwidmFyIE9ic2VsID0gcmVxdWlyZShcIi4vT2JzZWwuanNcIik7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IEphdmFzY3JpcHQgVHJhY2UgT2JqZWN0LlxuICogQGNsYXNzIEphdmFzY3JpcHQgVHJhY2UgT2JqZWN0LlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5UcmFjZVxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLkRlbW9UcmFjZSBpcyBhIEphdmFzY3JpcHQgVHJhY2Ugb2JqZWN0LlxuICogTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIGdldFxuICogdGhlIE9ic2VscyBmcm9tIHRoZSB0cmFjZSwgY3JlYXRlIG5ldyBPYnNlbHMsIGV0Yy5cbiAqXG4gKiBUaGUgdHJhY2UgaXMgaW5pdGlhbGlzZWQgZW1wdHkuIE9ic2VscyBoYXZlIHRvIGJlIGNyZWF0ZWRcbiAqIGJ5IHVzaW5nIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5EZW1vVHJhY2UjbmV3T2JzZWx9IG1ldGhvZC5cbiAqL1xudmFyIExvY2FsVHJhY2UgPSBmdW5jdGlvbihzb3VyY2VfdHJhY2VzKSB7XG4gIC8vIEFkZGludCB0aGUgT2JzZXJ2YWJsZSB0cmFpdFxuICBcInVzZSBzdHJpY3RcIjtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG5cbiAgLyogTm9tYnJlIGQnb2JzZWxzIGRhbnMgbGEgdHJhY2UgKi9cbiAgdGhpcy5jb3VudCA9IDA7IC8vIHNlcnQgZCdJRCBwb3VyIGxlIHByb2NoYWluIG9ic2VydsOpLlxuICAvKiBBcnJheSBkJ29ic2VscyAqL1xuICB0aGlzLm9ic2VsX2xpc3QgPSBbXTtcbiAgdGhpcy5zb3VyY2VfdHJhY2VzID0gKHNvdXJjZV90cmFjZXMgIT09IHVuZGVmaW5lZCk/c291cmNlX3RyYWNlczpbXTtcbiAgdGhpcy5zb3VyY2VfdHJhY2VzLmZvckVhY2goZnVuY3Rpb24odCkge1xuICAgIHQudHJhbnNmb3JtZWRfdHJhY2VzLnB1c2godGhpcyk7XG4gIH0pO1xuICB0aGlzLnRyYW5zZm9ybWVkX3RyYWNlcyA9IFtdO1xuICB0aGlzLm9yaWdpbiA9IFwiXCI7XG4gIC8vdGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKDApKS5nZXRNaWxsaXNlY29uZHMoKTtcblxufTtcblxuTG9jYWxUcmFjZS5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEdldHMgdGhlIGxhYmVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IExhYmVsIG9mIHRoZSB0cmFjZVxuICBcdCAqL1xuICBnZXRfbGFiZWw6IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy5sYWJlbDsgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogU2V0cyB0aGUgbGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGxibCBMYWJlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKi9cbiAgc2V0X2xhYmVsOiBmdW5jdGlvbihsYmwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLmxhYmVsID0gbGJsO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6ZWRpdF9tZXRhJyk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJlc2V0cyB0aGUgbGFiZWwgdG8gdGhlIGVtcHR5IHN0cmluZ1xuICBcdCAqL1xuICByZXNldF9sYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5sYWJlbCA9IFwiXCI7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcblxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBSZXR1cm5zIHRoZSBtb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcmV0dXJucyBNb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAdG9kbyBVUERBVEUgV0hBVCBJUyBBIE1PREVMXG4gIFx0ICovXG4gIGdldF9tb2RlbDogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO3JldHVybiB0aGlzLm1vZGVsOyB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBSZXR1cm5zIHRoZSBvcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHJldHVybnMgT3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEB0b2RvIFVQREFURSBXSEFUIElTIEFOIE9SSUdJTlxuICBcdCAqL1xuICBnZXRfb3JpZ2luOiBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIHRoaXMub3JpZ2luOyB9LFxuICAvL2dldF9vcmlnaW5fb2Zmc2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMub3JpZ2luX29mZnNldDsgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgc291cmNlIHRyYWNlcyBvZiB0aGlzIHRyYWNlXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxUcmFjZT59IFNvdXJjZSB0cmFjZXMgb2YgdGhpcyB0cmFjZS5cbiAgXHQgKi9cbiAgbGlzdF9zb3VyY2VfdHJhY2VzOiBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIHRoaXMuc291cmNlX3RyYWNlczsgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgdHJhY2VzIHRyYW5zZm9ybWVkIGZyb20gdGhpcyB0cmFjZVxuICBcdCAqIEByZXR1cm5zIHtBcnJheS48VHJhY2U+fSBUcmFjZSB0cmFuc2Zvcm1lZCBmcm9tIHRoaXMgdHJhY2VcbiAgXHQgKi9cbiAgbGlzdF90cmFuc2Zvcm1lZF90cmFjZXM6IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy50cmFuc2Zvcm1lZF90cmFjZXM7IH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIGxpc3Qgb2Ygb2JzZWxzIGluIGFuIG9wdGlvbmFsIHRpbWUgaW50ZXJ2YWwuXG4gIFx0ICogSWYgbm8gbWluaW11bSB0aW1lIGFuZCBubyBtYXhpbXVtIHRpbWUgY29uc3RyYWludCBhcmVcbiAgXHQgKiBkZWZpbmVkLCByZXR1cm5zIHRoZSB3aG9sZSBsaXN0IG9mIG9ic2Vscy5cbiAgXHQgKiBJZiBvbmUgb2YgdGhlIHR3byBjb25zdHJhaW50cyBhcmUgZGVmaW5lZCwgdGhlbiByZXR1cm5zXG4gIFx0ICogb2JzZWxzIG1hdGNoaW5nIHRoZSB0aW1lIGNvbnN0cmFpbnRzLlxuICBcdCAqXG4gIFx0ICogTm90ZTogaWYgYW4gb2JzZWwgb3ZlcmxhcHMgd2l0aCB0aGUgc3RhcnQgb3IgdGhlIGVuZFxuICBcdCAqIGNvbnN0cmFpbnQsIHRoZW4gaXQgd2lsbCBiZSBpbmNsdWRlZCAoZm9yIGluc3RhbmNlIGFuXG4gIFx0ICogb2JzZWwgdGhhdCBzdGFydHMgYmVmb3JlIHRoZSBzdGFydCBjb25zdHJhaW50IGFuZCBlbmRzXG4gIFx0ICogYWZ0ZXIgdGhhdCBjb25zdHJhaW50IHdpbGwgYmUgaW5jbHVkZWQpLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbYmVnaW5dIE1pbmltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtlbmRdIE1heGltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtCb29sZWFufSBbcmV2ZXJzZT1mYWxzZV0gUmV0dXJucyB0aGUgb2JzZWwgbGlzdCBpblxuICBcdCAqICAgICByZXZlcnNlIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgdHJ1ZSBhbmQgaW4gbm9ybWFsXG4gIFx0ICogICAgIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgZmFsc2UuXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxPYnNlbD59IExpc3Qgb2YgcmVsZXZhbnQgb2JzZWxzXG4gIFx0ICogQHRvZG8gUkVWRVJTRSBJUyBOT1QgWUVUIFRBS0VOIElOVE8gQUNDT1VOVFxuICBcdCAqL1xuICBsaXN0X29ic2VsczogZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8vIFRPRE8gcmV2ZXJzZSBpcyBpZ25vcmVkLlxuICAgIHJldHVybiB0aGlzLm9ic2VsX2xpc3QuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChlbmQgJiYgby5nZXRfYmVnaW4oKSA+IGVuZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGlmIChiZWdpbiAmJiBvLmdldF9lbmQoKSA8IGJlZ2luKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gIFx0ICogUmV0cmlldmUgYW4gb2JzZWwgaW4gdGhlIHRyYWNlIGZyb20gaXRzIElELlxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBpZCBJRCBvZiB0aGUgT2JzZWwgdG8gcmV0cmlldmVcbiAgXHQgKiBAcmV0dXJucyB7T2JzZWx9IE9ic2VsIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhpcyBJRFxuICBcdCAqICAgICBvciB1bmRlZmluZWQgaWYgdGhlIG9ic2VsIHdhcyBub3QgZm91bmQuXG4gIFx0ICogQHRvZG8gdXNlIEtUQlMgYWJzdHJhY3QgQVBJLlxuICBcdCAqL1xuICBnZXRfb2JzZWw6IGZ1bmN0aW9uKGlkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icztcbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5nZXRfaWQoKSA9PT0gaWQpIHsgb2JzID0gbzsgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYnM7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFNldHMgdGhlIG1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBtb2RlbCBNb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAdG9kbyBVUERBVEUgV0hBVCBJUyBBIE1PREVMXG4gIFx0ICovXG4gIHNldF9tb2RlbDogZnVuY3Rpb24obW9kZWwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogU2V0cyB0aGUgb3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBvcmlnaW4gT3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEB0b2RvIFVQREFURSBXSEFUIElTIEFOIE9SSUdJTlxuICBcdCAqL1xuICBzZXRfb3JpZ2luOiBmdW5jdGlvbihvcmlnaW4pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbiAgICAvL1x0dGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKG9yaWdpbikpLmdldE1pbGxpc2Vjb25kcygpO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6ZWRpdF9tZXRhJyk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIGRlZmF1bHQgc3ViamVjdCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdHJhY2UgZGVmYXVsdCBzdWJqZWN0XG4gIFx0ICovXG4gIGdldF9kZWZhdWx0X3N1YmplY3Q6IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy5zdWJqZWN0O30sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFNldCB0aGUgZGVmYXVsdCBzdWJqZWN0IG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBzdWJqZWN0IFRoZSB0cmFjZSBkZWZhdWx0IHN1YmplY3RcbiAgXHQgKi9cbiAgc2V0X2RlZmF1bHRfc3ViamVjdDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3Q7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcblxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBDcmVhdGUgYSBuZXcgb2JzZWwgaW4gdGhlIHRyYWNlIHdpdGggdGhlXG4gIFx0ICogZ2l2ZW4gcHJvcGVydGllc1xuICBcdCAqIEBwYXJhbSB7T2JzZWxQYXJhbX0gb2JzZWxfcGFyYW1zIFBhcmFtZXRlcnNcbiAgXHQgKiAgICAgY29ycmVzcG9uZGluZyB0byB0aGUgb2JzZWwgdG8gY3JlYXRlLlxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBvYnNlbF9wYXJhbXMudHlwZSBUeXBlIG9mIHRoZSBvYnNlbC5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gW29ic2VsX3BhcmFtcy5iZWdpbl0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbb2JzZWxfcGFyYW1zLmVuZF0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiAgXHQgKiBAcGFyYW0ge09iamVjdH0gW29ic2VsX3BhcmFtcy5hdHRyaWJ1dGVzXSBBdHRyaWJ1dGVzIG9mIHRoZSBvYnNlbC5cbiAgXHQgKiBAcGFyYW0ge0FycmF5PFJlbGF0aW9uPn0gW29ic2VsX3BhcmFtcy5yZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4gIFx0ICogQHBhcmFtIHtBcnJheTxSZWxhdGlvbj59IFtvYnNlbF9wYXJhbXMuaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuICBcdCAqIEBwYXJhbSB7QXJyYXk8T2JzZWw+fSBbb2JzZWxfcGFyYW1zLnNvdXJjZV9vYnNlbHNdIFNvdXJjZSBvYnNlbHMgb2YgdGhlIG9ic2VsLlxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBbb2JzZWxfcGFyYW1zLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4gIFx0ICovXG4gIGNyZWF0ZV9vYnNlbDogZnVuY3Rpb24ob2JzZWxfcGFyYW1zKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgb2JzZWxfcGFyYW1zLmlkID0gdGhpcy5jb3VudDtcbiAgICB0aGlzLmNvdW50Kys7XG4gICAgb2JzZWxfcGFyYW1zLnRyYWNlID0gdGhpcztcbiAgICB2YXIgb2JzID0gbmV3IE9ic2VsKG9ic2VsX3BhcmFtcyk7XG4gICAgdGhpcy5vYnNlbF9saXN0LnB1c2gob2JzKTtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIG9icyk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJlbW92ZXMgdGhlIGdpdmVuIG9ic2VsIGZyb20gdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIHtPYnNlbH0gb2JzIE9ic2VsIHRvIHJlbW92ZVxuICBcdCAqL1xuICByZW1vdmVfb2JzZWw6IGZ1bmN0aW9uKG9icykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMub2JzZWxfbGlzdCA9IHRoaXMub2JzZWxfbGlzdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIChvID09PSBvYnMpP2ZhbHNlOnRydWU7XG4gICAgfSk7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpyZW1vdmVfb2JzZWwnLCBvYnMpO1xuICB9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBUT0RPIGRvY3VtZW50IHRoaXMgbWV0aG9kXG4gIFx0ICovXG4gIHRyYW5zZm9ybTogZnVuY3Rpb24odHJhbnNmb3JtYXRpb25fbWV0aG9kLCBwYXJhbWV0ZXJzKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRyYW5zZm9ybWF0aW9uX21ldGhvZCh0aGlzLCBwYXJhbWV0ZXJzKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gVE9ETyBkb2N1bWVudCB0aGlzIG1ldGhvZFxuICBcdCAqL1xuICB0cmFuc2Zvcm1hdGlvbnM6IHtcblxuICAgIGR1cGxpY2F0ZTogZnVuY3Rpb24odHJhY2UpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgLy8gVE9ETyBiZXR0ZXIgZGVlcCBjb3B5XG4gICAgICB2YXIgdHJhbnNmb3JtZWRfdHJhY2UgPSBuZXcgTG9jYWxUcmFjZShbdHJhY2VdKTtcbiAgICAgIHRyYWNlLmxpc3Rfb2JzZWxzKCkuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgIH0pO1xuICAgICAgdHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG8gPSBlLmRhdGE7XG4gICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybWVkX3RyYWNlO1xuICAgIH0sXG4gICAgZmlsdGVyX29ic2VsX3R5cGU6IGZ1bmN0aW9uKHRyYWNlLCBvcHQpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgLy8gVE9ETzogaW1wbGVtZW50XG4gICAgICAvLyBUT0RPIGJldHRlciBkZWVwIGNvcHlcbiAgICAgIHZhciB0cmFuc2Zvcm1lZF90cmFjZSA9IG5ldyBMb2NhbFRyYWNlKFt0cmFjZV0pO1xuICAgICAgdHJhY2UubGlzdF9vYnNlbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgaWYgKG9wdC50eXBlcy5zb21lKGZ1bmN0aW9uKHR5cGUpIHtyZXR1cm4gdHlwZSA9PT0gby5nZXRfb2JzZWxfdHlwZSgpO30pKSB7XG4gICAgICAgICAgaWYgKG9wdC5tb2RlID09PSBcImtlZXBcIikge1xuICAgICAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IFwicmVtb3ZlXCIpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG8gPSBlLmRhdGE7XG4gICAgICAgIGlmIChvcHQudHlwZXMuc29tZShmdW5jdGlvbih0eXBlKSB7cmV0dXJuIHR5cGUgPT09IG8uZ2V0X29ic2VsX3R5cGUoKTt9KSkge1xuICAgICAgICAgIGlmIChvcHQubW9kZSA9PT0gXCJrZWVwXCIpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdC5tb2RlID09PSBcInJlbW92ZVwiKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1lZF90cmFjZS5jcmVhdGVfb2JzZWwoby50b19PYmplY3QoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm1lZF90cmFjZTtcbiAgICB9LFxuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2NhbFRyYWNlO1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiogT2JzZWwgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5PYnNlbH1cbiogb2JqZWN0LlxuKiBAdHlwZWRlZiBPYnNlbFxuKiBAc2VlIFNhbW90cmFjZXMuT2JzZWxcbiovXG5cbi8qKlxuKiBPYnNlbFBhcmFtIGlzIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHBhcmFtZXRlcnNcbiogbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIG5ldyBvYnNlbC5cbiogVGhpcyB0eXBlIG9mIG9iamVjdCBpcyB1c2VkIGluIHNldmVyYWwgbWV0aG9kc1xuKiBzdWNoIGFzIHRoZSBPYnNlbCBjb25zdHJ1Y3Rvciwgb3IgdGhlXG4qIFRyYWNlLmNyZWF0ZV9vYnNlbCBtZXRob2QuXG4qIFRoZSBvcHRpb25hbCBwb3JwZXJ0aWVzIHZhcmllcyBkZXBlbmRpbmcgb24gdGhlXG4qIG1ldGhvZCBjYWxsZWQuXG4qIEB0eXBlZGVmIE9ic2VsUGFyYW1cbiogQHByb3BlcnR5IHtTdHJpbmd9IFtpZF0gSWQgb2YgdGhlIG9ic2VsXG4qIEBwcm9wZXJ0eSB7VHJhY2V9IFt0cmFjZV0gVHJhY2Ugb2YgdGhlIG9ic2VsXG4qIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZV0gVHlwZSBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtOdW1iZXJ9IFtiZWdpbl0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuKiBAcHJvcGVydHkge051bWJlcn0gW2VuZF0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiogQHByb3BlcnR5IHtPYmplY3R9IFthdHRyaWJ1dGVzXSBBdHRyaWJ1dGVzIG9mIHRoZSBvYnNlbC5cbiogQHByb3BlcnR5IHtBcnJheTxSZWxhdGlvbj59IFtyZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7QXJyYXk8UmVsYXRpb24+fSBbaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuKiBAcHJvcGVydHkge0FycmF5PE9ic2VsPn0gW3NvdXJjZV9vYnNlbHNdIFNvdXJjZSBvYnNlbHMgb2YgdGhlIG9ic2VsLlxuKiBAcHJvcGVydHkge1N0cmluZ30gW3BhcmFtLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qIEB0b2RvIEZJWE1FIERFRklORSBXSEFUIElTIEEgUkVMQVRJT05cbiovXG5cbi8qKlxuKiBAc3VtbWFyeSBKYXZhU2NyaXB0IE9ic2VsIGNsYXNzXG4qIEBjbGFzcyBKYXZhU2NyaXB0IE9ic2VsIGNsYXNzXG4qIEBwYXJhbSB7T2JzZWxQYXJhbX0gcGFyYW0gUGFyYW1ldGVycyBvZiB0aGUgb2JzZWxcbiogQHBhcmFtIHtTdHJpbmd9IHBhcmFtLmlkIElkZW50aWZpZXIgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge1RyYWNlfSBwYXJhbS5UcmFjZSBUcmFjZSBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7U3RyaW5nfSBwYXJhbS50eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtLmJlZ2luPURhdGUubm93KCldIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBvYnNlbCBzdGFydHNcbiogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbS5lbmQ9cGFyYW0uYmVnaW5dIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBvYnNlbCBlbmRzXG4qIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW0uYXR0cmlidXRlc10gQXR0cmlidXRlcyBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7QXJyYXk8UmVsYXRpb24+fSBbcGFyYW0ucmVsYXRpb25zXSBSZWxhdGlvbnMgZnJvbSB0aGlzIG9ic2VsLlxuKiBAcGFyYW0ge0FycmF5PFJlbGF0aW9uPn0gW3BhcmFtLmludmVyc2VfcmVsYXRpb25zXSBSZWxhdGlvbnMgdG8gdGhpcyBvYnNlbC5cbiogQHBhcmFtIHtBcnJheTxPYnNlbD59IFtwYXJhbS5zb3VyY2Vfb2JzZWxzXSBTb3VyY2Ugb2JzZWxzIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtTdHJpbmd9IFtwYXJhbS5sYWJlbF0gTGFiZWwgb2YgdGhlIG9ic2VsLlxuKiBAdG9kbyBGSVhNRSBSRUxBVElPTlMgQVJFIE5PVCBZRVQgU1VQUE9SVEVEXG4qL1xuXG52YXIgT2JzZWwgPSBmdW5jdGlvbiBPYnNlbChwYXJhbSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ2lkJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0cmFjZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAndHlwZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdiZWdpbicsXHREYXRlLm5vdygpKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnZW5kJyxcdFx0dGhpcy5iZWdpbik7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2F0dHJpYnV0ZXMnLFx0e30pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAncmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdpbnZlcnNlX3JlbGF0aW9ucycsXHRbXSk7IC8vIFRPRE8gYWpvdXRlciByZWwgw6AgbCdhdXRyZSBvYnNlbFxuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnc291cmNlX29ic2VscycsXHRcdFtdKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2xhYmVsJyxcdFx0XCJcIik7XG59O1xuXG5PYnNlbC5wcm90b3R5cGUgPSB7XG4gIC8vIEFUVFJJQlVURVNcbiAgYXR0cmlidXRlczoge30sXG4gIHJlbGF0aW9uczogW10sXG4gIGludmVyc2VfcmVsYXRpb25zOiBbXSxcbiAgc291cmNlX29ic2VsczogW10sXG4gIGxhYmVsOiBcIlwiLFxuICAvKipcbiAgKiBJZiBhdHRyaWJ1dGUgZXhpc3RzLCB0aGVuIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2VcbiAgKiBzZXQgdGhlIGF0dHJpYnV0ZSBvZiB0aGUgc2FtZSBuYW1lIHdpdGggdGhlIGRlZmF1bHRcbiAgKiB2YWx1ZS5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwYXJhbSB2YWx1ZSBEZWZhdWx0IHZhbHVlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX2RlZmF1bHQ6IGZ1bmN0aW9uKHBhcmFtLCBhdHRyLCB2YWx1ZSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpc1thdHRyXSA9IChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKT9wYXJhbVthdHRyXTp2YWx1ZTtcbn0sXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIG5vdGhpbmcgaGFwcGVucy5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwcml2YXRlXG4qL1xuICBfcHJpdmF0ZV9jaGVja191bmRlZjogZnVuY3Rpb24ocGFyYW0sIGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1thdHRyXSA9IHBhcmFtW2F0dHJdO1xuICB9XG59LFxuICAvKipcbiAgKiBJZiBhdHRyaWJ1dGUgZXhpc3RzLCB0aGVuIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2VcbiAgKiB0aHJvdyBhbiBlcnJvci5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwcml2YXRlXG4qL1xuICBfcHJpdmF0ZV9jaGVja19lcnJvcjogZnVuY3Rpb24ocGFyYW0sIGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1thdHRyXSA9IHBhcmFtW2F0dHJdO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFwiUGFyYW1ldGVyIFwiICsgYXR0ciArIFwiIHJlcXVpcmVkLlwiO1xuICB9XG59LFxuICAvLyBSRVNPVVJDRVxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJlbW92ZSB0aGUgb2JzZWwgZnJvbSBpdHMgdHJhY2UuXG4gICogQGRlc2NyaXB0aW9uXG4gICogUmVtb3ZlIHRoZSBvYnNlbCBmcm9tIGl0cyB0cmFjZS5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTpyZW1vdmVfb2JzZWx9IGV2ZW50XG4qL1xuICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5nZXRfdHJhY2UoKS5yZW1vdmVfb2JzZWwodGhpcyk7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBJZCBvZiB0aGUgb2JzZWwuXG4qL1xuICBnZXRfaWQ6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgcmV0dXJuIHRoaXMuaWQ7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qL1xuICBnZXRfbGFiZWw6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgcmV0dXJuIHRoaXMubGFiZWw7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbC5cbiAgKiBAcGFyYW0ge1N0cmluZ30gTGFiZWwgb2YgdGhlIG9ic2VsLlxuKi9cbiAgc2V0X2xhYmVsOiBmdW5jdGlvbihsYmwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5sYWJlbCA9IGxibDsgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSBsYWJlbCBvZiB0aGUgT2JzZWwgdG8gdGhlIGVtcHR5IHN0cmluZy5cbiovXG4gIHJlc2V0X2xhYmVsOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG50aGlzLmxhYmVsID0gXCJcIjsgfSxcbiAgLy8gT0JTRUxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSB0cmFjZSB0aGUgT2JzZWwgYmVsb25ncyB0by5cbiAgKiBAcmV0dXJucyB7VHJhY2V9IFRyYWNlIHRoZSBPYnNlbCBiZWxvbmdzIHRvLlxuKi9cbiAgZ2V0X3RyYWNlOiBcdFx0ZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xucmV0dXJuIHRoaXMudHJhY2U7IH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogQHJldHVybnMge1N0cmluZ30gVHlwZSBvZiB0aGUgb2JzZWwuXG4gICogQHRvZG8gVE9ETyBkaWZmZXJzIGZyb20gS1RCUyBBUEkgLT4gZXhwcmVzcyBpdCBjbGVhcmx5XG4qL1xuICBnZXRfdHlwZTogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xucmV0dXJuIHRoaXMudHlwZTsgfSxcbiAgLyoqXG4gICogUmV0dXJucyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4gICogQHJldHVybnMge051bWJlcn0gVGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4qL1xuICBnZXRfYmVnaW46IFx0XHRmdW5jdGlvbigpIHtcbiAgICAvL3JldHVybiB0aGlzLmdldF90cmFjZSgpLmdldF9vcmlnaW5fb2Zmc2V0KCkgKyB0aGlzLmJlZ2luO1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLmJlZ2luO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4qL1xuICBnZXRfZW5kOiBcdFx0ZnVuY3Rpb24oKSB7XG4gICAgLy9yZXR1cm4gdGhpcy5nZXRfdHJhY2UoKS5nZXRfb3JpZ2luX29mZnNldCgpICsgdGhpcy5lbmQ7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuZW5kO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHR5cGUgb2YgdGhlIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFNldHMgdGhlIHR5cGUgb2YgdGhlIE9ic2VsLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7U3RyaW5nfSB0eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuICAqIEB0b2RvIFRPRE8gbm90IEtUQlMgQVBJIGNvbXBsaWFudFxuICAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIG1pZ2h0IG5vdCBiZSBzdXBwb3J0ZWQgaW4gdGhlIGZ1dHVyZS5cbiovXG4gIGZvcmNlX3NldF9vYnNlbF90eXBlOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTplZGl0X29ic2VsfSBldmVudFxuICAqIEBwYXJhbXMge051bWJlcn0gYmVnaW4gVGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X2JlZ2luOiBmdW5jdGlvbihiZWdpbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuYmVnaW4gPSBiZWdpbjtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogQGRlc2NyaXB0aW9uXG4gICogU2V0cyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7TnVtYmVyfSBlbmQgVGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIEB0b2RvIFRPRE8gbm90IEtUQlMgQVBJIGNvbXBsaWFudFxuICAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIG1pZ2h0IG5vdCBiZSBzdXBwb3J0ZWQgaW4gdGhlIGZ1dHVyZS5cbiovXG4gIGZvcmNlX3NldF9lbmQ6IFx0ZnVuY3Rpb24oZW5kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgdGhpcy50cmFjZS50cmlnZ2VyKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcyk7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgc291cmNlIE9ic2VscyBvZiB0aGUgY3VycmVudCBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8T2JzZWw+fSBTb3VyY2UgT2JzZWxzIG9mIHRoZSBjdXJyZW50IE9ic2VsLlxuKi9cbiAgbGlzdF9zb3VyY2Vfb2JzZWxzOiBcdGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmxpc3Rfc291cmNlX29ic2VscyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZV9vYnNlbHM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgYXR0cmlidXRlIG5hbWVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gQXR0cmlidXRlIG5hbWVzIG9mIHRoZSBPYnNlbC5cbiovXG4gIGxpc3RfYXR0cmlidXRlX3R5cGVzOiBcdGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gW107IH1cbiAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpICAgICAge1xuICAgICAgICBhdHRycy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJzO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gUmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfcmVsYXRpb25fdHlwZXM6IFx0ZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAodGhpcy5yZWxhdGlvbnMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gW107IH1cbiAgdmFyIHJlbHMgPSBbXTtcbiAgdGhpcy5yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICBpZiAoJC5pbkFycmF5KHIudHlwZSwgcmVscykgPT09IC0xKSB7XG4gICAgICByZWxzLnB1c2goci50eXBlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVscztcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgT2JzZWxzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgT2JzZWwgd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gdHlwZS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVsYXRpb25fdHlwZSBSZWxhdGlvbiB0eXBlLlxuICAqIEByZXR1cm5zIHtBcnJheTxPYnNlbD59IE9ic2VscyByZWxhdGVkIHRvIHRoZSBjdXJyZW50IE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfcmVsYXRlZF9vYnNlbHM6IFx0ZnVuY3Rpb24ocmVsYXRpb25fdHlwZSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIG9ic3MgPSBbXTtcbiAgaWYgKHRoaXMucmVsYXRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnJlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIC8vdmFyIHVuaXF1ZU5hbWVzID0gW107XG4gICAgICBpZiAoci50eXBlID09PSByZWxhdGlvbl90eXBlKSB7XG4gICAgICAgIG9ic3MucHVzaChyLm9ic2VsX3RvKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAodGhpcy5pbnZlcnNlX3JlbGF0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5pbnZlcnNlX3JlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIC8vdmFyIHVuaXF1ZU5hbWVzID0gW107XG4gICAgICBpZiAoci50eXBlID09PSByZWxhdGlvbl90eXBlKSB7XG4gICAgICAgIG9ic3MucHVzaChyLm9ic2VsX3RvKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2Jzcztcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgaW52ZXJzZSByZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG4gICogQHJldHVybnMge0FycmF5PFN0cmluZz59IEludmVyc2UgcmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfaW52ZXJzZV9yZWxhdGlvbl90eXBlczogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAodGhpcy5pbnZlcnNlX3JlbGF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICB2YXIgcmVscyA9IFtdO1xuICB0aGlzLmludmVyc2VfcmVsYXRpb25zLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgIC8vdmFyIHVuaXF1ZU5hbWVzID0gW107XG4gICAgaWYgKCQuaW5BcnJheShyLnR5cGUsIHJlbHMpID09PSAtMSkge1xuICAgICAgcmVscy5wdXNoKHIudHlwZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlbHM7XG59LFxuICAvL1x0ZGVsX2F0dHJpYnV0ZV92YWx1ZTpcdGZ1bmN0aW9uKGF0dHIpIHt9LCAvLyBUT0RPIGVycmV1ciBkZSBsJ0FQSSBLVEJTP1xuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBdHRyaWJ1dGUgbmFtZS5cbiAgKiBAcmV0dXJucyB7T2JqZWN0fSBBdHRyaWJ1dGUgdmFsdWUuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBnZXRfYXR0cmlidXRlOlx0ZnVuY3Rpb24oYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHRoaXMuYXR0cmlidXRlc1thdHRyXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgXCJBdHRyaWJ1dGUgXCIgKyBhdHRyICsgXCIgaXMgbm90IGRlZmluZWRcIjsgLy8gVE9ET1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gIH1cbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIEF0dHJpYnV0ZSBuYW1lLlxuICAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgQXR0cmlidXRlIHZhbHVlLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSVxuKi9cbiAgc2V0X2F0dHJpYnV0ZTpcdGZ1bmN0aW9uKGF0dHIsIHZhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5hdHRyaWJ1dGVzW2F0dHJdID0gdmFsO1xuICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmVtb3ZlcyB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICogQGRlc2NyaXB0aW9uXG4gICogUmVtb3ZlcyB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUEkuXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgQXR0cmlidXRlIG5hbWUuXG4qL1xuICBkZWxfYXR0cmlidXRlOlx0XHRcdGZ1bmN0aW9uKGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICAvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBBZGRzIGEgcmVsYXRpb24gd2l0aCBhbiBPYnNlbC5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBOT1QgWUVUIElNUExFTUVOVEVEXG4gICogQHBhcmFtIHtTdHJpbmd9IHJlbCBSZWxhdGlvbiB0eXBlLlxuICAqIEBwYXJhbSB7T2JzZWx9IG9icyBUYXJnZXQgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBhZGRfcmVsYXRlZF9vYnNlbDpcdFx0ZnVuY3Rpb24ocmVsLCBvYnMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gVE9ET1xuICB0aHJvdyBcIm1ldGhvZCBub3QgaW1wbGVtZW50ZWQgeWV0XCI7XG4gIC8vIFRPRE8gZW52b3llciB1biBldmVudCBwb3VyIGRpZXIgcXVlIGwnb2JzZWwgYSBjaGFuZ8OpXG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJlbW92ZXMgYSByZWxhdGlvbiB3aXRoIGFuIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIE5PVCBZRVQgSU1QTEVNRU5URURcbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVsIFJlbGF0aW9uIHR5cGUuXG4gICogQHBhcmFtIHtPYnNlbH0gb2JzIFRhcmdldCBPYnNlbC5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcbiovXG4gIGRlbF9yZWxhdGVkX29ic2VsOlx0XHRmdW5jdGlvbihyZWwsIG9icykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUT0RPXG4gIHRocm93IFwibWV0aG9kIG5vdCBpbXBsZW1lbnRlZCB5ZXRcIjtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG5cbiAgLy8gTk9UIElOIEtUQlMgQVBJXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogQ29waWVzIHRoZSBPYnNlbCBwcm9wZXJ0aWVzIGluIGFuIE9iamVjdC5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBDb3BpZXMgdGhlIE9ic2VsIHByb3BlcnRpZXMgaW4gYW4gT2JqZWN0XG4gICogdGhhdCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYW4gT2JzZWwgd2l0aFxuICAqIHtAbGluayBTYW1vdHJhY2VzLk9ic2VsI09ic2VsfSBjb25zdHJ1Y3RvciBvclxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI2NyZWF0ZV9vYnNlbH0gbWV0aG9kLlxuICAqIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCB0aGF0XG4qL1xuICB0b19PYmplY3Q6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIG9iaiA9IHtcbiAgICBpZDogdGhpcy5pZCxcbiAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgYmVnaW46IHRoaXMuYmVnaW4sXG4gICAgZW5kOiB0aGlzLmVuZCxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAvLyB1c2UgLnNsaWNlIHRvIGNvcHlcbiAgICAvLyBUT0RPIGlzIGl0IGVub3VnaD8gPC0gbWlnaHQgY3JlYXRlIGJ1Z3NcbiAgICByZWxhdGlvbnM6IHRoaXMucmVsYXRpb25zLnNsaWNlKCksXG4gICAgaW52ZXJzZV9yZWxhdGlvbnM6IHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuc2xpY2UoKSxcbiAgICBzb3VyY2Vfb2JzZWxzOiB0aGlzLnNvdXJjZV9vYnNlbHMuc2xpY2UoKSxcbiAgICBsYWJlbDogdGhpcy5sYWJlbFxuICB9O1xuICAvLyBjb3B5IGVhY2ggYXR0cmlidXRlc1xuICBmb3IgKHZhciBhdHRyIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgIG9iai5hdHRyaWJ1dGVzW2F0dHJdID0gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqO1xufSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZWw7XG4iLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiogU2VsZWN0b3IgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5TZWxlY3Rvcn1cbiogb2JqZWN0LlxuKiBAdHlwZWRlZiBTZWxlY3RvclxuKiBAc2VlIFNhbW90cmFjZXMuU2VsZWN0b3JcbiovXG4vKipcbiogQHN1bW1hcnkgT2JqZWN0IHRoYXQgc3RvcmVzIGEgc2VsZWN0aW9uIG9mIG9iamVjdHNcbiogQGNsYXNzIE9iamVjdCB0aGF0IHN0b3JlcyBhIHNlbGVjdGlvbiBvZiBvYmplY3RzXG4qIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4qIEBjb25zdHJ1Y3RvclxuKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiogQGZpcmVzIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmFkZFxuKiBAZmlyZXMgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246cmVtb3ZlXG4qIEBmaXJlcyBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjplbXB0eVxuKiBAZGVzY3JpcHRpb25cbiogVGhlIHtAbGluayBTYW1vdHJhY2VzLlNlbGVjdG9yfFNlbGVjdG9yfSBvYmplY3RcbiogaXMgYSBKYXZhc2NyaXB0IG9iamVjdCB0aGF0IHN0b3JlcyBhIHNlbGVjdGlvbiBvZiBPYmplY3RzLlxuKiBUaGlzIE9iamVjdCBzdG9yZXMgT2JqZWN0cyB0aGF0IGFyZSBzZWxlY3RlZCBhbmQgaW5mb3Jtc1xuKiB3aWRnZXRzIG9yIG90aGVyIG9iamVjdHMgKHZpYSB0aGVcbiogdHJpZ2dlcmVkIGV2ZW50cykgd2hlbiB0aGUgc2VsZWN0aW9uIGNoYW5nZXMuXG4qIFdoZW4gZmlyc3QgaW5zdGFuY2lhdGVkLCB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LlxuKlxuKiBJbiBvcmRlciB0byBzZWxlY3QgYW4gb2JqZWN0LCB0aGVcbioge0BsaW5rIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0fFNlbGVjdG9yI3NlbGVjdCgpfVxuKiBtZXRob2QgaGFzIHRvIGJlIGNhbGxlZC5cbiogU2ltaWxhcmx5LCBpbiBvcmRlciB0byB1bnNlbGVjdCBhbiBvYmplY3QsIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5TZWxlY3RvciN1bnNlbGVjdHxTZWxlY3RvciN1bnNlbGVjdCgpfVxuKiBtZXRob2QgaGFzIHRvIGJlIGNhbGxlZC5cbiogVGhlIHdob2xlIHNlbGVjdGlvbiBjYW4gYmUgZW1wdGllZCBhdCBvbmNlIHdpdGggdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLlNlbGVjdG9yI2VtcHR5fFNlbGVjdG9yI2VtcHR5KCl9XG4qIG1ldGhvZC5cbipcbiogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBBIHN0cmluZyBkZXNjcmliaW5nIHRoZSB0eXBlIG9mXG4qICAgICBvYmplY3QgdG8gYmUgc2VsZWN0ZWQgKCdPYnNlbCcsICdUcmFjZScsICdUaW1lV2luZG93JywgZXRjLikuXG4qIEBwYXJhbSB7c3RyaW5nfSBbc2VsZWN0aW9uX21vZGU9J3NpbmdsZSddXG4qICAgICBJbiAnc2luZ2xlJyBtb2RlLCB0aGUgc2VsZWN0aW9uIGNvbnRhaW5zIG9uZSBvYmplY3QgbWF4aW11bS5cbiogICAgIFRoaXMgbWVhbnMgdGhhdCBhZGRpbmcgYW4gb2JqZWN0IHRvIGEgbm9uLWVtcHR5IHNlbGVjdGlvblxuKiAgICAgd2lsbCByZXBsYWNlIHRoZSBwcmV2aW91c2x5IHNlbGVjdGVkIG9iamVjdCB3aXRoIHRoZSBuZXcgb25lLlxuKiAgICAgSW4gJ211bHRpcGxlJyBtb2RlLCB0aGUgc2VsZWN0aW9uIGNhbiBiZSBleHRlbmRlZCBhbmQgb2JqZWN0c1xuKiAgICAgY2FuIGJlIGluZGl2aWR1YWxseSBhZGRlZCBvciByZW1vdmVkLlxuKiBAcGFyYW0ge0V2ZW50Q29uZmlnfVx0W2V2ZW50c11cbiogICAgIEV2ZW50cyB0byBsaXN0ZW4gdG8gYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2tzLlxuKi9cbnZhciBTZWxlY3RvciA9IGZ1bmN0aW9uKHR5cGUsIHNlbGVjdGlvbl9tb2RlLCBldmVudHMpIHtcbiAgLy8gQWRkaW5nIHRoZSBPYnNlcnZhYmxlIHRyYWl0XG4gIFwidXNlIHN0cmljdFwiO1xuICBFdmVudEhhbmRsZXIuY2FsbCh0aGlzLCBldmVudHMpO1xuICB0aGlzLm1vZGUgPSBzZWxlY3Rpb25fbW9kZSB8fCAnc2luZ2xlJzsgLy8gb3RoZXIgb3B0aW9uIGlzICdtdWx0aXBsZSdcbiAgdGhpcy50eXBlID0gdHlwZTtcbiAgdGhpcy5zZWxlY3Rpb24gPSBbXTtcbiAgLy8gVE9ETzogYWpvdXRlciBldmVudExpc3RlbmVyIHN1ciBUcmFjZSBzaSB0eXBlID0gb2JzZWxcbiAgLy8gLT4gUXVhbmQgXCJ0cmFjZTpyZW1vdmU6b2JzZWxcIiAtPiB2w6lyaWZpZSBzaSB1biBvYnNlbCBhXG4gIC8vIMOpdMOpIHN1cHByaW3DqSBkZSBsYSBzw6lsZWN0aW9uLlxufTtcblxuU2VsZWN0b3IucHJvdG90eXBlID0ge1xuICAvKipcbiAgKiBNZXRob2QgdG8gY2FsbCB0byBzZWxlY3QgYW4gT2JqZWN0LlxuICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgKiAgICAgT2JqZWN0IHRvIGFkZCB0byB0aGUgc2VsZWN0aW9uXG4gICogQGZpcmVzIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmFkZFxuICAqL1xuICBzZWxlY3Q6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgdGhpcy5zZWxlY3Rpb24ucHVzaChvYmplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbiA9IFtvYmplY3RdO1xuICAgIH1cbiAgICAvKipcbiAgICAqIE9iamVjdCBzZWxlY3RlZCBldmVudC5cbiAgICAqIEBldmVudCBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjphZGRcbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInNlbGVjdGlvbjphZGRcIikuXG4gICAgKiBAcHJvcGVydHkge09iamVjdH0gZGF0YSAtIFRoZSBzZWxlY3RlZCBvYmplY3QuXG4gICAgKi9cbiAgICB0aGlzLnRyaWdnZXIoJ3NlbGVjdGlvbjphZGQnLCBvYmplY3QpO1xuICB9LFxuICAvKipcbiAgKiBNZXRob2QgdG8gZW1wdHkgdGhlIGN1cnJlbnQgc2VsZWN0aW9uLlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjplbXB0eVxuICAqL1xuICBlbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBbXTtcbiAgICAvKipcbiAgICAqIE9iamVjdCB1bnNlbGVjdGVkIGV2ZW50LlxuICAgICogQGV2ZW50IFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmVtcHR5XG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgKD0gXCJzZWxlY3Rpb246ZW1wdHlcIikuXG4gICAgKi9cbiAgICB0aGlzLnRyaWdnZXIoJ3NlbGVjdGlvbjplbXB0eScpO1xuICB9LFxuICAvKipcbiAgKiBNZXRob2QgdGhhdCBjaGVja3MgaWYgdGhlIHNlbGVjdGlvbiBpcyBlbXB0eVxuICAqIEByZXR1cm5zIHtCb29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIHNlbGVjdGlvbiBhbmQgZW1wdHlcbiAgKiAgICAgYW5kIGZhbHNlIGlmIHRoZSBzZWxlY3Rpb24gaXMgbm90IGVtcHR5LlxuICAqL1xuICBpc19lbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuICh0aGlzLnNlbGVjdGlvbi5sZW5ndGggPT09IDApO1xuICB9LFxuICAvKipcbiAgKiBHZXRzIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuICAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2Ygc2VsZWN0ZWQgb2JqZWN0c1xuICAqL1xuICBnZXRfc2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb247XG4gIH0sXG4gIC8qKlxuICAqIE1ldGhvZCB0byBjYWxsIHRvIHJlbW92ZSBhbiBPYmplY3QgZnJvbSB0aGUgc2VsZWN0aW9uLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgKiAgICAgT2JqZWN0IHRvIHJlbW92ZSBmcm9tIHRoZSBzZWxlY3Rpb25cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246cmVtb3ZlXG4gICovXG4gIHVuc2VsZWN0OiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24uZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmIChlbCA9PT0gb2JqZWN0KSB7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoIWZvdW5kKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbiA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAqIE9iamVjdCB1bnNlbGVjdGVkIGV2ZW50LlxuICAgICogQGV2ZW50IFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOnJlbW92ZVxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIGV2ZW50ICg9IFwic2VsZWN0aW9uOnJlbW92ZVwiKS5cbiAgICAqL1xuICAgIHRoaXMudHJpZ2dlcignc2VsZWN0aW9uOnJlbW92ZScsIG9iamVjdCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIC8qKlxuICAqIE1ldGhvZCB0byBjYWxsIHRvIHRvZ2dsZSB0aGUgc2VsZWN0aW9uIG9mIGFuIE9iamVjdC5cbiAgKiBJZiB0aGUgT2JqZWN0IHdhcyBwcmV2aW91c2x5IHVuc2VsZWN0ZWQsIGl0IGJlY29tZXMgc2VsZWN0ZWQuXG4gICogSWYgdGhlIE9iamVjdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZCwgaXQgYmVjb21lcyB1bnNlbGVjdGVkLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgKiAgICBPYmplY3QgdG8gdG9nZ2xlIGZyb20gdGhlIHNlbGVjdGlvblxuICAqL1xuICB0b2dnbGU6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgIGlmICghdGhpcy51bnNlbGVjdChvYmplY3QpKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KG9iamVjdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbi5sZW5ndGggPT09IDAgfHwgdGhpcy5zZWxlY3Rpb25bMF0gIT09IG9iamVjdCkge1xuICAgICAgICB0aGlzLnNlbGVjdChvYmplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51bnNlbGVjdChvYmplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RvcjtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuKiBUaW1lV2luZG93IGlzIGEgc2hvcnRuYW1lIGZvciB0aGVcbioge0BsaW5rIFNhbW90cmFjZXMuVGltZVdpbmRvd31cbiogb2JqZWN0LlxuKiBAdHlwZWRlZiBUaW1lV2luZG93XG4qIEBzZWUgU2Ftb3RyYWNlcy5UaW1lV2luZG93XG4qL1xuLyoqXG4qIEBzdW1tYXJ5IE9iamVjdCB0aGF0IHN0b3JlcyB0aGUgY3VycmVudCB0aW1lIHdpbmRvd1xuKiBAY2xhc3MgT2JqZWN0IHRoYXQgc3RvcmVzIHRoZSBjdXJyZW50IHRpbWUgd2luZG93XG4qIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4qIEBjb25zdHJ1Y3RvclxuKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiogQGRlc2NyaXB0aW9uXG4qIFRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5UaW1lV2luZG93fSBvYmplY3QgaXMgYSBKYXZhc2NyaXB0IE9iamVjdFxuKiB0aGF0IHN0b3JlcyB0aGUgY3VycmVudCB0aW1lIHdpbmRvdy5cbiogVGhpcyBPYmplY3Qgc3RvcmVzIGEgdGltZSB3aW5kb3cgYW5kIGluZm9ybXMgd2lkZ2V0cyBvciBvdGhlclxuKiBvYmplY3RzIHdoZW4gdGhlIHRpbWUgd2luZG93IGNoYW5nZXMgdmlhIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnVwZGF0ZXx0dzp1cGRhdGV9XG4qIGV2ZW50LlxuKiBBIHtAbGluayBTYW1vdHJhY2VzLlRpbWVXaW5kb3d8VGltZVdpbmRvd30gY2FuIGJlIGRlZmluZWQgaW4gdHdvIHdheXM6XG4qXG4qIDEuICBieSBkZWZpbmluZyBhIGxvd2VyIGFuZCB1cHBlciBib3VuZFxuKiAyLiAgYnkgZGVmaW5pbmcgYSB0aW1lciBhbmQgYSB3aWR0aC5cbipcbiogQHBhcmFtIHtPYmplY3R9IG9wdFx0T3B0aW9uIHBhcmFtZXRlciB0aGF0IGRlZmluZXMgdGhlIHRpbWVcbiogICAgIHdpbmRvdy4gVmFyaWFibGVzIG9wdC5zdGFydCBhbmQgb3B0LmVuZCBtdXN0XG4qICAgICBiZSBkZWZpbmVkIGlmIHVzaW5nIGxvd2VyIGFuZCB1cHBlciBib3VuZCBkZWZpbml0aW9uLlxuKiAgICAgVmFyaWFibGVzIG9wdC50aW1lciBhbmQgb3B0LndpZHRoIG11c3RcbiogICAgIGJlIGRlZmluZWQgaWYgdXNpbmcgdGltZXIgYW5kIHdpZHRoIGRlZmluaXRpb24uXG4qIEBwYXJhbSB7TnVtYmVyfSBvcHQuc3RhcnQgU3RhcnRpbmcgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cgKGxvd2VyIGJvdW5kKS5cbiogQHBhcmFtIHtOdW1iZXJ9IG9wdC5lbmQgRW5kaW5nIHRpbWUgb2YgdGhlIHRpbWUgd2luZG93ICh1cHBlciBib3VuZCkuXG4qIEBwYXJhbSB7U2Ftb3RyYWNlcy5UaW1lcn0gb3B0LnRpbWVyIFRpbWVyIG9iamVjdCwgd2hpY2ggdGltZVxuKiAgICAgaXMgdXNlZCB0byBkZWZpbmUgdGhlIG1pZGRsZSBvZiB0aGUgY3VycmVudCB0aW1lIHdpbmRvdy5cbiogQHBhcmFtIHtOdW1iZXJ9IG9wdC53aWR0aCBXaWR0aCBvZiB0aGUgdGltZSB3aW5kb3cuXG4qXG4qL1xudmFyIFRpbWVXaW5kb3cgPSBmdW5jdGlvbiBUaW1lV2luZG93KG9wdCkge1xuICAvLyBBZGRpbmcgdGhlIE9ic2VydmFibGUgdHJhaXRcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICBpZiAob3B0LnN0YXJ0ICE9PSB1bmRlZmluZWQgJiYgb3B0LmVuZCAgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuc3RhcnQgPSBvcHQuc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBvcHQuZW5kO1xuICAgIHRoaXMuX19jYWxjdWxhdGVfd2lkdGgoKTtcbiAgfSBlbHNlIGlmIChvcHQudGltZXIgIT09IHVuZGVmaW5lZCAmJiBvcHQud2lkdGggICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnNldF93aWR0aChvcHQud2lkdGgsIG9wdC50aW1lci50aW1lKTtcbiAgICB0aGlzLnRpbWVyID0gb3B0LnRpbWVyO1xuICAgIHRoaXMudGltZXIub24oJ3RpbWVyOnVwZGF0ZScsIHRoaXMuX3ByaXZhdGVfdXBkYXRlVGltZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnRpbWVyLm9uKCd0aW1lcjpwbGF5OnVwZGF0ZScsIHRoaXMuX3ByaXZhdGVfdXBkYXRlVGltZS5iaW5kKHRoaXMpKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdygnU2Ftb3RyYWNlcy5UaW1lV2luZG93IGVycm9yLiBBcmd1bWVudHMgY291bGQgbm90IGJlIHBhcnNlZC4nKTtcbiAgfVxufTtcblxuVGltZVdpbmRvdy5wcm90b3R5cGUgPSB7XG5cbiAgX19jYWxjdWxhdGVfd2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMud2lkdGggPSB0aGlzLmVuZCAtIHRoaXMuc3RhcnQ7XG4gIH0sXG4gIF9wcml2YXRlX3VwZGF0ZVRpbWU6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdGltZSA9IGUuZGF0YTtcbiAgICB2YXIgZGVsdGEgPSB0aW1lIC0gKHRoaXMuc3RhcnQgKyB0aGlzLndpZHRoIC8gMik7XG5cbiAgICB0aGlzLnN0YXJ0ID0gdGltZSAtIHRoaXMud2lkdGggLyAyO1xuICAgIHRoaXMuZW5kID0gdGltZSArIHRoaXMud2lkdGggLyAyO1xuICAgIHRoaXMudHJpZ2dlcigndHc6dHJhbnNsYXRlJywgZGVsdGEpO1xuXG4gICAgLy9cdFx0dGhpcy5zZXRfd2lkdGgodGhpcy53aWR0aCx0aW1lKTtcbiAgfSxcbiAgLyoqXG4gICogU2V0cyB0aGUgc3RhcnQgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgU3RhcnRpbmcgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQGZpcmVzIFNhbW90cmFjZXMuVGltZVdpbmRvdyN0dzp1cGRhdGVcbiAgKi9cbiAgc2V0X3N0YXJ0OiBmdW5jdGlvbih0aW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuc3RhcnQgIT09IHRpbWUpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSB0aW1lO1xuICAgICAgdGhpcy5fX2NhbGN1bGF0ZV93aWR0aCgpO1xuICAgICAgLyoqXG4gICAgICAqIFRpbWUgd2luZG93IGNoYW5nZSBldmVudC5cbiAgICAgICogQGV2ZW50IFNhbW90cmFjZXMuVGltZVdpbmRvdyN0dzp1cGRhdGVcbiAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgKD0gXCJ0dzp1cGRhdGVcIikuXG4gICAgICovXG4gICAgICB0aGlzLnRyaWdnZXIoJ3R3OnVwZGF0ZScpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICogU2V0cyB0aGUgZW5kIHRpbWUgb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIEVuZGluZyB0aW1lIG9mIHRoZSB0aW1lIHdpbmRvdy5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnVwZGF0ZVxuICovXG4gIHNldF9lbmQ6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5lbmQgIT09IHRpbWUpIHtcbiAgICAgIHRoaXMuZW5kID0gdGltZTtcbiAgICAgIHRoaXMuX19jYWxjdWxhdGVfd2lkdGgoKTtcbiAgICAgIHRoaXMudHJpZ2dlcigndHc6dXBkYXRlJyk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgKiBHZXRzIHRoZSB3aWR0aCBvZiB0aGUgdGltZSB3aW5kb3cgKGR1cmF0aW9uIGJldHdlZW4gc3RhcnQgYW5kIGVuZClcbiAgKiBAcmV0dXJucyB7TnVtYmVyfSBXaWR0aCBvZiB0aGUgdGltZSB3aW5kb3dcbiAgKi9cbiAgZ2V0X3dpZHRoOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcbiAgfSxcbiAgLyoqXG4gICogU2V0cyB0aGUgd2lkdGggb2YgdGhlIHRpbWUgb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCBOZXcgd2lkdGggb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbY2VudGVyPShzdGFydCtlbmQpLzJdIE5ldyBjZW50ZXIgb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVXaW5kb3cjdHc6dXBkYXRlXG4gICovXG4gIHNldF93aWR0aDogZnVuY3Rpb24od2lkdGgsIGNlbnRlcikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmIChjZW50ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY2VudGVyID0gdGhpcy5zdGFydCArIHRoaXMud2lkdGggLyAyO1xuICAgIH1cbiAgICB0aGlzLnN0YXJ0ID0gY2VudGVyIC0gd2lkdGggLyAyO1xuICAgIHRoaXMuZW5kID0gY2VudGVyICsgd2lkdGggLyAyO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLnRyaWdnZXIoJ3R3OnVwZGF0ZScpO1xuICB9LFxuICAvKipcbiAgKiBUcmFuc2xhdGVzIHRoZSB0aW1lIHdpbmRvdyB3aXRoIGEgdGltZSBkZWx0YS5cbiAgKiBAcGFyYW0ge051bWJlcn0gZGVsdGEgVGltZSBkZWx0YXQgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSB0aW1lIHdpbmRvdy5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnRyYW5zbGF0ZVxuICAqL1xuICB0cmFuc2xhdGU6IGZ1bmN0aW9uKGRlbHRhKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgIHRoaXMudGltZXIuc2V0KHRoaXMudGltZXIudGltZSArIGRlbHRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGFydCA9IHRoaXMuc3RhcnQgKyBkZWx0YTtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5lbmQgKyBkZWx0YTtcbiAgICAgIHRoaXMudHJpZ2dlcigndHc6dHJhbnNsYXRlJywgZGVsdGEpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICogWm9vbXMgdGhlIHRpbWV3aW5kb3cgYnkgbXVsdGlwbHlpbmcgdGhlIGN1cnJlbnQgd2lkdGhcbiAgKiBieSB0aGUgZ2l2ZW4gY29lZmZpY2llbnQuIFpvb20gaW4gaWYgdGhlIGNvZWZmaWNpZW50XG4gICogaXMgbGVzcyB0aGFuIDEgYW5kIG91dCBpZiBpdCBpcyBtb3JlIHRoYW4gMS5cbiAgKiBAcGFyYW0ge051bWJlcn0gY29lZiBDb2VmZmljaWVudCBvZiB0aGUgem9vbSB0byBhcHBseS5cbiAgKi9cbiAgem9vbTogZnVuY3Rpb24oY29lZikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuc2V0X3dpZHRoKHRoaXMud2lkdGggKiBjb2VmKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZVdpbmRvdztcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuKiBAc3VtbWFyeSBPYmplY3QgdGhhdCBzdG9yZXMgdGhlIGN1cnJlbnQgdGltZVxuKiBAY2xhc3MgT2JqZWN0IHRoYXQgc3RvcmVzIHRoZSBjdXJyZW50IHRpbWVcbiogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiogQGNvbnN0cnVjdG9yXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lciN0aW1lcjp1cGRhdGVcbiogQGRlc2NyaXB0aW9uXG4qIFNhbW90cmFjZXMuVGltZXIgaXMgYSBKYXZhc2NyaXB0IG9iamVjdCB0aGF0IHN0b3Jlc1xuKiB0aGUgY3VycmVudCB0aW1lLlxuKiBUaGlzIE9iamVjdCBzdG9yZXMgYSB0aW1lIGFuZCBpbmZvcm1zIHdpZGdldHMgb3Igb3RoZXJcbiogb2JqZWN0cyB3aGVuIHRoZSB0aW1lIGNoYW5nZXMuXG4qXG4qIEBwYXJhbSB7TnVtYmVyfSBbaW5pdF90aW1lPTBdXG4qICAgICBJbml0aWFsIHRpbWUgb2YgdGhlIHRpbWVyIChvcHRpb25hbCwgZGVmYXVsdDogMCkuXG4qIEBwYXJhbSB7TnVtYmVyfSBbcGVyaW9kPTIwMDBdXG4qICAgICBQZXJkaW9kIChpbiBtcykgYXQgd2hpY2ggdGhlIHRpbWVyIHdpbGwgdXBkYXRlIGl0c2VsZiBpblxuKiAgICAgXCJwbGF5XCIgbW9kZS5cbiogQHBhcmFtIHtmdW5jdGlvbn0gW3VwZGF0ZV9mdW5jdGlvbl1cbiogICAgIEZ1bmN0aW9uIGNhbGxlZCB0byB1cGRhdGUgdGhlIHRpbWVyIHdoZW4gaW4gXCJwbGF5XCIgbW9kZVxuKiAgICAgKGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgb2ZcbiogICAgIDxjb2RlPkRhdGUubm93KCk8L2NvZGU+IGJ5IGRlZmF1bHQpLlxuKi9cblxudmFyIFRpbWVyID0gZnVuY3Rpb24gVGltZXIoaW5pdF90aW1lLCBwZXJpb2QsIHVwZGF0ZV9mdW5jdGlvbikge1xuICAvLyBBZGRpbmcgdGhlIE9ic2VydmFibGUgdHJhaXRcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICB0aGlzLnRpbWUgPSBpbml0X3RpbWUgfHwgMDtcbiAgdGhpcy5wZXJpb2QgPSBwZXJpb2QgfHwgMjAwMDtcbiAgdGhpcy51cGRhdGVfZnVuY3Rpb24gPSB1cGRhdGVfZnVuY3Rpb24gfHwgZnVuY3Rpb24oKSB7cmV0dXJuIERhdGUubm93KCk7fTtcbiAgdGhpcy5pc19wbGF5aW5nID0gZmFsc2U7XG59O1xuXG5UaW1lci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAqIFNldHMgdGhlIFRpbWVyIHRvIHRoZSBnaXZlbiB0aW1lLlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnVwZGF0ZVxuICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIE5ldyB0aW1lXG4qL1xuICBzZXRfdGltZTogZnVuY3Rpb24odGltZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBuZXdfdGltZSA9IE51bWJlcih0aW1lKTtcbiAgICBpZiAodGhpcy50aW1lICE9PSBuZXdfdGltZSkge1xuICAgICAgdGhpcy50aW1lID0gbmV3X3RpbWU7XG4gICAgICAvKipcbiAgICAgICogVGltZSBjaGFuZ2UgZXZlbnQuXG4gICAgICAqIEBldmVudCBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnVwZGF0ZVxuICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInRpbWVyOnVwZGF0ZVwiKS5cbiovXG4gICAgICB0aGlzLnRyaWdnZXIoJ3RpbWVyOnVwZGF0ZScsIHRoaXMudGltZSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgKiBTZXRzIHRoZSBUaW1lciB0byB0aGUgZ2l2ZW4gdGltZS5cbiAgKiBAZGVwcmVjYXRlZCBVc2Uge0BsaW5rIFNhbW90cmFjZXMuVGltZXIuc2V0X3RpbWV8c2V0X3RpbWV9IGluc3RlYWQuXG4gICogQGZpcmVzIFNhbW90cmFjZXMuVGltZXIjdGltZXI6dXBkYXRlXG4gICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgTmV3IHRpbWVcbiovXG4gIHNldDogZnVuY3Rpb24odCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICByZXR1cm4gdGhpcy5zZXRfdGltZSh0KTsgfSxcbiAgLyoqXG4gICogR2V0cyB0aGUgY3VycmVudCB0aW1lIG9mIHRoZSBUaW1lclxuICAqIEByZXR1cm5zIHtOdW1iZXJ9IEN1cnJlbnQgdGltZSBvZiB0aGUgVGltZXIuXG4qL1xuICBnZXRfdGltZTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMudGltZTtcbiAgfSxcbiAgLyoqXG4gICogU2V0cyBvciBnZXQgdGhlIFRpbWVyJ3MgY3VycmVudCB0aW1lLlxuICAqIElmIG5vIHBhcmFtZXRlciBpcyBnaXZlbiwgdGhlIGN1cnJlbnQgdGltZSBpcyByZXR1cm5lZC5cbiAgKiBPdGhlcndpc2UsIHNldHMgdGhlIFRpbWVyIHRvIHRoZSBnaXZlbnQgdGltZS5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lciN0aW1lcjp1cGRhdGVcbiAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVdIE5ldyB0aW1lXG4qL1xuICB0aW1lOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRpbWUpIHtcbiAgICAgIHZhciBuZXdfdGltZSA9IE51bWJlcih0aW1lKTtcbiAgICAgIGlmICh0aGlzLnRpbWUgIT09IG5ld190aW1lKSB7XG4gICAgICAgIHRoaXMudGltZSA9IG5ld190aW1lO1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3RpbWVyOnVwZGF0ZScsIHRoaXMudGltZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRpbWU7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAqIFN0YXJ0cyB0aGUgcGxheSBtb2RlOiB0aGUgdGltZXIgd2lsbCBiZSB1cGRhdGVkXG4gICogYWNjb3JkaW5nIHRvIHRoZSB1cGRhdGVfZnVuY3Rpb24gZXZlcnkgcGVyaW9kXG4gICogYXMgc3BlY2lmaWVkIGF0IHRoZSBpbml0aWFsaXNhdGlvbiBvZiB0aGUgVGltZXIuXG4gICogQHRvZG8gU1BFQ0lGWSBXQVlTIFRPIENIQU5HRSBQRVJJT0QgQU5EIFVQREFURV9GVU5DVElPblxuKi9cbiAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLyp2YXIgdXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50aW1lID0gdGhpcy51cGRhdGVfZnVuY3Rpb24odGhpcy50aW1lKTtcbiAgICAvKipcbiAgICAqIFRpbWUgY2hhbmdlIGV2ZW50IChhY3R1YWxpc2luZyB0aW1lIHdoZW4gcGxheWluZylcbiAgICAqIEBldmVudCBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnBsYXk6dXBkYXRlXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHR5cGVcbiAgICAqICAgICAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInRpbWVyOnBsYXk6dXBkYXRlXCIpLlxuICAgICovXG4gICAgLyp0aGlzLnRyaWdnZXIoJ3RpbWVyOnBsYXk6dXBkYXRlJyx0aGlzLnRpbWUpO1xuICAgIH07XG5cdFx0Ki9cbiAgICB0aGlzLmludGVydmFsX2lkID0gd2luZG93LnNldEludGVydmFsKHRoaXMudXBkYXRlX2Z1bmN0aW9uLmJpbmQodGhpcyksIHRoaXMucGVyaW9kKTtcbiAgICB0aGlzLmlzX3BsYXlpbmcgPSB0cnVlO1xuICAgIHRoaXMudHJpZ2dlcigndGltZXI6cGxheScsIHRoaXMudGltZSk7XG4gIH0sXG4gIC8qKlxuICAqIFN0b3BzIHRoZSBwbGF5IG1vZGUuXG4qL1xuICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbF9pZCk7XG4gICAgdGhpcy5pc19wbGF5aW5nID0gZmFsc2U7XG4gICAgdGhpcy50cmlnZ2VyKCd0aW1lcjpwYXVzZScsIHRoaXMudGltZSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XG4iLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vY29yZS9FdmVudEhhbmRsZXIuanNcIik7XG52YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIE9ic2VsID0gcmVxdWlyZShcIi4vY29yZS9PYnNlbC5qc1wiKTtcbnZhciBUaW1lV2luZG93ID0gcmVxdWlyZShcIi4vY29yZS9UaW1lV2luZG93LmpzXCIpO1xudmFyIFRpbWVyID0gcmVxdWlyZShcIi4vY29yZS9UaW1lci5qc1wiKTtcbnZhciBTZWxlY3RvciA9IHJlcXVpcmUoXCIuL2NvcmUvU2VsZWN0b3IuanNcIik7XG52YXIgTG9jYWxUcmFjZSA9IHJlcXVpcmUoXCIuL2NvcmUvTG9jYWxUcmFjZS5qc1wiKTtcbnZhciBLdGJzID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLmpzXCIpO1xudmFyIEt0YnNNb2RlbCA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5Nb2RlbC5qc1wiKTtcbnZhciBLdGJzQmFzZSA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5CYXNlLmpzXCIpO1xudmFyIEt0YnNUcmFjZSA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5UcmFjZS5qc1wiKTtcblxudmFyIEltcG9ydFRyYWNlID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9JbXBvcnRUcmFjZS5qc1wiKTtcbnZhciBJbnRlcnZhbFRpbWVGb3JtID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9JbnRlcnZhbFRpbWVGb3JtLmpzXCIpO1xudmFyIExpc3RCYXNlcyA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvTGlzdEJhc2VzLmpzXCIpO1xudmFyIExpc3RNb2RlbEluQmFzZXMgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0xpc3RNb2RlbEluQmFzZXMuanNcIik7XG52YXIgTGlzdFRyYWNlc0luQmFzZXMgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0xpc3RUcmFjZXNJbkJhc2VzLmpzXCIpO1xudmFyIE9ic2VsSW5zcGVjdG9yID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9PYnNlbEluc3BlY3Rvci5qc1wiKTtcbnZhciBPYnNlbFR5cGVJbnNwZWN0b3IgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL09ic2VsVHlwZUluc3BlY3Rvci5qc1wiKTtcbnZhciBSZWFkYWJsZVRpbWVGb3JtID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9SZWFkYWJsZVRpbWVGb3JtLmpzXCIpO1xudmFyIFRpbWVGb3JtID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UaW1lRm9ybS5qc1wiKTtcbnZhciBUaW1lU2xpZGVyID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UaW1lU2xpZGVyLmpzXCIpO1xudmFyIFRyYWNlRGlzcGxheUljb25zID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29ucy5qc1wiKTtcbnZhciBUcmFjZURpc3BsYXlJY29uc0ZpeCA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5SWNvbnNGaXguanNcIik7XG52YXIgVHJhY2VEaXNwbGF5SWNvbnNab29tID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29uc1pvb20uanNcIik7XG52YXIgVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcyA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcy5qc1wiKTtcbnZhciBUcmFjZURpc3BsYXlUZXh0ID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlUZXh0LmpzXCIpO1xudmFyIFRyYWNlRGlzcGxheVpvb21Db250ZXh0ID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlab29tQ29udGV4dC5qc1wiKTtcbnZhciBEaXNwbGF5TW9kZWwgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0Rpc3BsYXlNb2RlbC5qc1wiKTtcbnZhciBXaW5kb3dTY2FsZSA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvV2luZG93U2NhbGUuanNcIik7XG52YXIgV2luZG93U2NhbGVGaXggPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1dpbmRvd1NjYWxlRml4LmpzXCIpO1xudmFyIFdpbmRvd1NsaWRlciA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvV2luZG93U2xpZGVyLmpzXCIpO1xuXG52YXIgU2Ftb3RyYWNlcyA9IHtcbiAgT2JzZWw6IE9ic2VsLFxuICBUaW1lV2luZG93OiBUaW1lV2luZG93LFxuICBUaW1lcjogVGltZXIsXG4gIFNlbGVjdG9yOiBTZWxlY3RvcixcbiAgRXZlbnRIYW5kbGVyOiBFdmVudEhhbmRsZXIsXG4gIExvY2FsVHJhY2U6IExvY2FsVHJhY2UsXG4gIEt0YnM6IHtcbiAgICBLdGJzOiBLdGJzLFxuICAgIFJlc291cmNlOiBLVEJTUmVzb3VyY2UsXG4gICAgTW9kZWw6IEt0YnNNb2RlbCxcbiAgICBCYXNlOiBLdGJzQmFzZSxcbiAgICBUcmFjZTogS3Ric1RyYWNlLFxuICB9LFxuICBVaToge1xuICAgIFdpZGdldHM6IHtcbiAgICAgIEltcG9ydFRyYWNlOiBJbXBvcnRUcmFjZSxcbiAgICAgIEludGVydmFsVGltZUZvcm06IEludGVydmFsVGltZUZvcm0sXG4gICAgICBPYnNlbEluc3BlY3RvcjogT2JzZWxJbnNwZWN0b3IsXG4gICAgICBPYnNlbFR5cGVJbnNwZWN0b3I6IE9ic2VsVHlwZUluc3BlY3RvcixcbiAgICAgIFJlYWRhYmxlVGltZUZvcm06IFJlYWRhYmxlVGltZUZvcm0sXG4gICAgICBUaW1lRm9ybTogVGltZUZvcm0sXG4gICAgICBUaW1lU2xpZGVyOiBUaW1lU2xpZGVyLFxuICAgICAgVHJhY2VEaXNwbGF5SWNvbnM6IFRyYWNlRGlzcGxheUljb25zLFxuICAgICAgVHJhY2VEaXNwbGF5SWNvbnNGaXg6IFRyYWNlRGlzcGxheUljb25zRml4LFxuICAgICAgVHJhY2VEaXNwbGF5SWNvbnNab29tOiBUcmFjZURpc3BsYXlJY29uc1pvb20sXG4gICAgICBUcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzOiBUcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzLFxuICAgICAgVHJhY2VEaXNwbGF5VGV4dDogVHJhY2VEaXNwbGF5VGV4dCxcbiAgICAgIFRyYWNlRGlzcGxheVpvb21Db250ZXh0OiBUcmFjZURpc3BsYXlab29tQ29udGV4dCxcbiAgICAgIERpc3BsYXlNb2RlbDogRGlzcGxheU1vZGVsLFxuICAgICAgV2luZG93U2NhbGU6IFdpbmRvd1NjYWxlLFxuICAgICAgV2luZG93U2NhbGVGaXg6IFdpbmRvd1NjYWxlRml4LFxuICAgICAgV2luZG93U2xpZGVyOiBXaW5kb3dTbGlkZXIsXG4gICAgICBLdGJzOiB7XG4gICAgICAgIExpc3RCYXNlczogTGlzdEJhc2VzLFxuICAgICAgICBMaXN0TW9kZWxJbkJhc2VzOiBMaXN0TW9kZWxJbkJhc2VzLFxuICAgICAgICBMaXN0VHJhY2VzSW5CYXNlczogTGlzdFRyYWNlc0luQmFzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2Ftb3RyYWNlcztcbiJdfQ==
