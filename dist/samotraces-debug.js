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
  	 * Create a stored trace in the KTBS
  	 * @param id {String} ID of the created trace
  	 * @param [model] {Model} Model of the trace
  	 * @param [origin] {Origin} Origin of the trace
  	 * @param [default_subject] {String} Default subject of the trace
  	 * @param [label] {String} Label of the trace
  	 */
  create_model: function(id) {
      var doc = {
      '@context': 'http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context',
      '@graph': [{
        '@id': id,
        '@type': 'TraceModel',
        'inBase': './',
        'hasUnit': 'millisecond'
      }]
    };
    var new_model_data = JSON.stringify(doc);
    $.ajax({
      url: this.uri,
      type: 'POST',
      contentType: 'application/json',
      data: new_model_data,
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

      if (o.id === ident)   {
        Att = o.attributes
      }

    }
    )
    return Att;
  },

  put_model: function(modeldata) {
    var etag = this.get_etag();
    /*var xhr = new XMLHttpRequest();
    xhr.open('PUT', this.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('If-Match', etag);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 200) {
          console.log('OKOKOK');

        } else {
          console.log('erreur');
        }
      }
    };
    xhr.send(modeldata);
  }*/

  var that = this;
  return new Promise(function(resolve, reject) {
    // PUT
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('If-Match', etag);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 200) {
          console.log('OKOKOK');
          resolve(new Samotraces.Ktbs.Model(xhr.responseURL));
        } else {
          reject(xhr);
        }
      }
    };
    xhr.onerror = function() {
      reject(Error('There was a network error.'));
    };
    xhr.send(modeldata);
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
      success: function (data, textStatus, xhr){
        trc.etag = xhr.getResponseHeader('ETag');
        trc._on_state_refresh_(data);
      }

      //trc._on_state_refresh_.bind(trc),
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVUkvV2lkZ2V0cy9EaXNwbGF5TW9kZWwuanMiLCJzcmMvVUkvV2lkZ2V0cy9JbXBvcnRUcmFjZS5qcyIsInNyYy9VSS9XaWRnZXRzL0ludGVydmFsVGltZUZvcm0uanMiLCJzcmMvVUkvV2lkZ2V0cy9MaXN0QmFzZXMuanMiLCJzcmMvVUkvV2lkZ2V0cy9MaXN0TW9kZWxJbkJhc2VzLmpzIiwic3JjL1VJL1dpZGdldHMvTGlzdFRyYWNlc0luQmFzZXMuanMiLCJzcmMvVUkvV2lkZ2V0cy9PYnNlbEluc3BlY3Rvci5qcyIsInNyYy9VSS9XaWRnZXRzL09ic2VsVHlwZUluc3BlY3Rvci5qcyIsInNyYy9VSS9XaWRnZXRzL1JlYWRhYmxlVGltZUZvcm0uanMiLCJzcmMvVUkvV2lkZ2V0cy9UaW1lRm9ybS5qcyIsInNyYy9VSS9XaWRnZXRzL1RpbWVTbGlkZXIuanMiLCJzcmMvVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29ucy5qcyIsInNyYy9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheUljb25zRml4LmpzIiwic3JjL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5SWNvbnNab29tLmpzIiwic3JjL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcy5qcyIsInNyYy9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheVRleHQuanMiLCJzcmMvVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlab29tQ29udGV4dC5qcyIsInNyYy9VSS9XaWRnZXRzL1dpZGdldC5qcyIsInNyYy9VSS9XaWRnZXRzL1dpbmRvd1NjYWxlLmpzIiwic3JjL1VJL1dpZGdldHMvV2luZG93U2NhbGVGaXguanMiLCJzcmMvVUkvV2lkZ2V0cy9XaW5kb3dTbGlkZXIuanMiLCJzcmMvY29yZS9FdmVudEhhbmRsZXIuanMiLCJzcmMvY29yZS9LVEJTLkJhc2UuanMiLCJzcmMvY29yZS9LVEJTLk1vZGVsLmpzIiwic3JjL2NvcmUvS1RCUy5PYnNlbC5qcyIsInNyYy9jb3JlL0tUQlMuUmVzb3VyY2UuanMiLCJzcmMvY29yZS9LVEJTLlRyYWNlLmpzIiwic3JjL2NvcmUvS1RCUy5qcyIsInNyYy9jb3JlL0xvY2FsVHJhY2UuanMiLCJzcmMvY29yZS9PYnNlbC5qcyIsInNyYy9jb3JlL1NlbGVjdG9yLmpzIiwic3JjL2NvcmUvVGltZVdpbmRvdy5qcyIsInNyYy9jb3JlL1RpbWVyLmpzIiwic3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeE9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcmNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgZGlzcGxheWluZyBhIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtb2RlbFxuICogQGNsYXNzIFdpZGdldCBmb3IgaW1wb3J0aW5nIGEgdHJhY2UgZnJvbSBhIENTViBmaWxlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm58RmF0bWEgRGVyYmVsXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAc2VlIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5CYXNpYy5JbXBvcnRUcmFjZVxuICogQHRvZG8gQVRURU5USU9OIGNvZGUgcXVpIHZpZW50IGQnYWlsbGV1cnMgIVxuICogQGRlc2NyaXB0aW9uIG5vIGRlc2NyaXB0aW9uXG4gKiBAcGFyYW0ge29iamVjdH1cdGh0bWxFbGVtZW50XG4gKiAgICAgVGhlIEhUTUwgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgd2lkZ2V0XG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVHJhY2V9IHRyYWNlXG4gKiAgICAgVHJhY2Ugb2JqZWN0IGluIHdoaWNoIHRoZSBvYnNlbHMgd2lsbCBiZSBpbXBvcnRlZC5cbiAqL1xuXG52YXIgRGlzcGxheU1vZGVsID0gZnVuY3Rpb24oaHRtbEVsZW1lbnQsIG1vZGVsLCBvcHRpb25zKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICAvL29wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sRWxlbWVudCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VNb2RlbCcpO1xuICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gIHRoaXMubW9kZWwub24oJ01vZGVsOkRyYXdfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdmFyIHRoaXNfd2lkZ2V0ID0gdGhpcztcbiAgdGhpcy5tb2RlbC5vbignTW9kZWw6bGlzdGVUeXBlJywgZnVuY3Rpb24oZSkge1xuICAgIHRoaXNfd2lkZ2V0LmRhdGEgPSBlLmRhdGE7XG4gICAgdGhpc193aWRnZXQuZHJhdygpO1xuXG4gIH0pO1xuXG5cbiAgdmFyIGJpbmRfZnVuY3Rpb24gPSBmdW5jdGlvbih2YWxfb3JfZnVuKSB7XG4gICAgaWYgKHZhbF9vcl9mdW4gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW4uYmluZCh0aGlzX3dpZGdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWxfb3JfZnVuO1xuICAgIH1cbiAgfTtcbiAgdmFyIHggPSAwO1xuICB2YXIgeDEgPSAxNjtcbiAgdGhpcy5vcHRpb25zID0ge307XG4gIHRoaXMub3B0aW9ucy55X0ltZyA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy54IHx8IGZ1bmN0aW9uKCkge1xuICAgIHggPSB4ICsgMTY7XG4gICAgcmV0dXJuIHg7XG4gIH0pO1xuICB0aGlzLm9wdGlvbnMueV90ZXh0ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnggfHwgZnVuY3Rpb24oKSB7XG4gICAgeDEgPSB4MSArIDE2O1xuICAgIHJldHVybiB4MTtcbiAgfSk7XG4gIC8vdGhpcy5vcHRpb25zLnkgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueSB8fCAxNyk7XG4gIC8vdGhpcy5vcHRpb25zLndpZHRoID0gYmluZF9mdW5jdGlvbihvcHRpb25zLndpZHRoIHx8IDE2KTtcbiAgLy90aGlzLm9wdGlvbnMuaGVpZ2h0ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLmhlaWdodCB8fCAxNik7XG4gIC8vdGhpcy5vcHRpb25zLnVybCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy51cmwgfHwgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBRzdBQUFCdXdCSG5VNE5RQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUtzU1VSQlZEaU5yWk5MYUZOcEZNZC8zM2Z2VGE1dFlwdXEweWF0Rld1Z1JoRVh3OUF1aEpFWkJDa2lxSldDSUVycnhwMjQxQzZMNjY1ME0vV0Jvd3Vub3lDRENqS3JHWVowSWJpd3hrZFViR3lhUG1nU204ZDlmMjVNYlhVbHpIOTV6di84T09kd2psQktzVmFqVTFrRXRKaWF2TkJzYUtjQnFxNS8zZktEU3dyS1kzM0pkWDdSQUl4T1pRR00zYkhJeW1DeVBaaFpxVDhwMmQ0c1FHdFk3K3lPYnZoeE1qc3ZwNHVWS09BMlFFSXB4ZWhVRmwySXZ1RlVaM3JaY3UvKzlYN1JXcWc3Snh3L1FBRmhUZExSRkpvWTZONFNhek9ObzFjenMvMmVVbE5qZlVuMFJpc25lK1BwOXl2MThUdlp3cmw5aVZiMkoySkVRaG9LS05rZTZVSjU1TGZNQjRhU0hlTW5lK1BwYXkveUFrQmNUTDltYTdOcDdZdTMvbjFsT2pkUTh3TE83OTNHemxnekZkY2pZdWpvVXBBdDE3ajhMSWZqQjV6ZHZmWEJ2M09sWDNOVnk1U0FPSlZLaFA5NE0yOVVYQjhGRkdvV0U4OW51ZlRrSFE5bkZsRUtlalp1b0xlMWlZcnI4K2ZiZWU5VUtoRUdoQjZTWXJCb3VkUEx0bnNBUUNuRjc2OEtxMXYyQXhBQzZsN0FzdVVDc0dTNWg0dVdPeDJTWWxCcVFveVVIVy9POWdPKzFpOWRiZnljaUtHQS93b2wzcFRyQU5oK1FObng1alFoUnVRM1ZaKzFaMU9VZzkyYmlaa0cvK1NMM0h1N2dQZlZ6UUJJWDZtSmxwQWVEMnZyV2RzM210aCt3T3RTbFVjelMxUmRmelVYMWlRdElUM3VLeldoTzRHYWpKbkduYzJtY2YrajR4MXVtSjR1VlNoVWJSU3dVSFBXd2R2Q3h1T1lhUnh3QWpVcEFYVWprN2VQOWJUckVVTmJOZjMwUTVUaFhWMGM2V2tuR3ZvU2p4Z2F4M2UwdXpjeWVSdFFjcXd2U2E1cW1hWXVCNGFTSGVNTmlFSmdhaEo5eldRUlEyTW8yVEZ1Nm5JZ1Y3WE1kWmQ0OCtWYy8zQ3FNMzBtMVhYM3djeGk4ZDNIMnNpdGwzbVVBQ2tFeVphbTI0ZTJiVEhiVE9QYzFjeHNmNlB1LzNtbXRmcmVkLzRFU1FOS1hHOFZBQ29BQUFBQVNVVk9SSzVDWUlJPScpO1xuXG4gICAgIHRoaXMuc3R5bGVzaGVldCA9IG9wdGlvbnMgfHwge30gO1xuICAgICB0aGlzLmRhdGEgPSBtb2RlbC5saXN0X1R5cGVzX09ic2xlcztcbiAgICAgdGhpcy5kcmF3KCk7XG5cblxufTtcblxuRGlzcGxheU1vZGVsLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuZGl2X2VsbXQgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJyk7XG4gICAgLy90aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJykuYXR0cignaGVpZ2h0JywgJzEwcHgnKTtcbiAgICAvLyBjcmVhdGUgdGhlIChyZWQpIGxpbmUgcmVwcmVzZW50aW5nIGN1cnJlbnQgdGltZVxuXG4gICAgdGhpcy54ID0gMTY7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB2YXIgeCA9IGQzLnRpbWUuc2NhbGUoKVxuICAgICAgLmRvbWFpbihbbmV3IERhdGUoMjAxNCwgNCwgMSksIG5ldyBEYXRlKDIwMTQsIDQsIDE1KSAtIDFdKVxuICAgICAgLy8gLmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aF0pO1xuXG4gICAgdmFyIG1hcmdpbiA9IHt0b3A6IDIwMCwgcmlnaHQ6IDQwLCBib3R0b206IDIwMCwgbGVmdDogNDB9LFxuICAgICAgaGVpZ2h0ID0gNTAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gICAgLyp0aGlzLnN2Z19ncCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHRoaXMuc3ZnX3RleHQgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTsqL1xuICAgIHRoaXMuc3ZnX3NlbGVjdGVkX29ic2VsID0gZGl2X2VsbXQuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyKCd4MScsICcwJylcbiAgICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgICAuYXR0cigneDInLCAnMCcpXG4gICAgICAuYXR0cigneTInLCAnMTAwJScpXG4gICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAuYXR0cignc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgIC5hdHRyKCdvcGFjaXR5JywgJzAuMycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJylcbiAgICAgIC5zdHlsZSgnZGlzcGxheScsICdub25lJyk7XG4gIH0sXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAgIC5zZWxlY3RBbGwoJ2NpcmNsZSxpbWFnZSxyZWN0JylcbiAgICAgIC8vIFRPRE86IEFUVEVOVElPTiEgV0FSTklORyEgb2JzZWxzIE1VU1QgaGF2ZSBhIGZpZWxkIGlkIC0+IHVzZWQgYXMgYSBrZXkuXG4gICAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7IC8vIFRPRE86IGJvZ3VlIGluIGNhc2Ugbm8gSUQgZXhpc3RzIC0+IG1pZ2h0IGhhcHBlbiB3aXRoIEtUQlMgdHJhY2VzIGFuZCBuZXcgb2JzZWxzXG4gIH0sXG5cbiAgZDNPYnNlbHN0ZXh0OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5zdmdfdGV4dFxuICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlLGltYWdlLHJlY3QnKVxuICAgICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuZGF0YS5sZW5ndGggIT09IDApe1xuICAgIHZhciBpbWFnZXMgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoXCJjaXJjbGUsaW1hZ2UscmVjdFwiKVxuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7XG4gICAgICAgIHJldHVybiBkLmlkO1xuICAgICAgfSlcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKFwiaW1hZ2VcIik7XG5cblxuXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdmFyIGltYWdlc19hdHQgPSAgaW1hZ2VzLmF0dHIoJ2NsYXNzJywgJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLm9wdGlvbnMueV9JbWcpXG4gICAgICAuYXR0cigneCcsIDE3KVxuICAgICAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3dpZHRoJykpOyB9KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdoZWlnaHQnKSk7fSlcblx0XHRcdC5hdHRyKCd4bGluazpocmVmJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2ljb24nKSk7IH0pO1xuICAgICAgLy8uYXR0cigneGxpbms6aHJlZicsIHRoaXMub3B0aW9ucy51cmwpO1xuICAgICAgLy8uYXR0cigneGxpbms6aHJlZicsICdpbWFnZXMvT3JhbmdlLnBuZycpO1xuICAgIHZhciB0ZXh0ID0gdGhpcy5zdmcuc2VsZWN0QWxsKFwidGV4dFwiKVxuICAgICAgLmRhdGEodGhpcy5kYXRhKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJ0ZXh0XCIpO1xuICAgIHZhciB0ZXh0TGFiZWxzID0gdGV4dFxuICAgICAgLmF0dHIoXCJ4XCIsICczNScpXG4gICAgICAuYXR0cihcInlcIiwgdGhpcy5vcHRpb25zLnlfdGV4dClcbiAgICAgIC50ZXh0KGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQudHlwZTt9KVxuICAgICAgLmF0dHIoXCJmb250LWZhbWlseVwiLCBcInNhbnMtc2VyaWZcIilcbiAgICAgIC5hdHRyKFwiZm9udC1zaXplXCIsIFwiMTVweFwiKTtcbiAgICAkKCdpbWFnZScsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB9XG4gIH0sXG4gIHJlZnJlc2hfeDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB0aGlzLnN2Z19ncFxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgICAgLmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcbiAgICAgIC5hdHRyKCd5JywgdGhpcy5vcHRpb25zLnkpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwbGF5TW9kZWw7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgaW1wb3J0aW5nIGEgdHJhY2UgZnJvbSBhIENTViBmaWxlLlxuICogQGNsYXNzIFdpZGdldCBmb3IgaW1wb3J0aW5nIGEgdHJhY2UgZnJvbSBhIENTViBmaWxlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBzZWUgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLkJhc2ljLkltcG9ydFRyYWNlXG4gKiBAdG9kbyBBVFRFTlRJT04gY29kZSBxdWkgdmllbnQgZCdhaWxsZXVycyAhXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLkJhc2ljLkltcG9ydFRyYWNlfSB3aWRnZXQgaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gaW1wb3J0IGEgdHJhY2UgZnJvbSBhIENTViBmaWxlLlxuICpcbiAqIFRoaXMgd2lkZ2V0IGN1cnJlbnRseSBhY2NlcHQgdGhlIGZvbGxvd2luZyBmb3JtYXQ6XG4gKlxuICogMS4gVGhlIENTViBmaWxlIGNhbiB1c2UgZWl0aGVyICcsJyBvciAnOycgYXMgYSB2YWx1ZSBzZXBhcmF0b3JcbiAqIDIuIEVhY2ggbGluZSByZXByZXNlbnRzIGFuIG9ic2VsXG4gKiAzLiBUaGUgZmlyc3QgY29sdW1uIHJlcHJlc2VudHMgdGhlIHRpbWUgd2hlbiB0aGUgb2JzZWwgb2NjdXJzXG4gKiA0LiBUaGUgc2Vjb25kIGNvbHVtbiByZXByZXNlbnRzIHRoZSB0eXBlIG9mIHRoZSBvYnNlbFxuICogNS4gVGhlIGZvbGxvd2luZyBjb2x1bW5zIHJlcHJlc2VudCBwYWlycyBvZiBcImF0dHJpYnV0ZVwiIC8gXCJ2YWx1ZVwiIGNvbHVtbnNcbiAqXG4gKiBUaGUgbnVtYmVyIG9mIGNvbHVtbnMgbWF5IHZhcnkgZnJvbSBsaW5lIHRvIGxpbmUuXG4gKiBGb3IgZXhhbXBsZSwgYSBDU1YgZmlsZSBtaWdodCBsb29rIGxpa2UgdGhpczpcbiAqIDxwcmU+XG4gKiAwLGNsaWNrLHRhcmdldCxidXR0b24yXG4gKiAyLGNsaWNrLHRhcmdldCxidXR0b24xLHZhbHVlLHRvdG9cbiAqIDMsZm9jdXMsdGFyZ2V0LHN1Ym1pdFxuICogNSxjbGljayx0YXJnZXQsc3VibWl0XG4gKiA8L3ByZT5cbiAqIEB0b2RvIERFU0NSSUJFIFRIRSBGT1JNQVQgT0YgVEhFIENTViBGSUxFLlxuICogQHBhcmFtIHtvYmplY3R9XHRodG1sRWxlbWVudFxuICogICAgIFRoZSBIVE1MIGVsZW1lbnQgdGhhdCB3aWxsIGJlIHVzZWQgYnkgdGhlIHdpZGdldFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLlRyYWNlfSB0cmFjZVxuICogICAgIFRyYWNlIG9iamVjdCBpbiB3aGljaCB0aGUgb2JzZWxzIHdpbGwgYmUgaW1wb3J0ZWQuXG4gKi9cblxudmFyIEltcG9ydFRyYWNlID0gZnVuY3Rpb24oaHRtbEVsZW1lbnQsIHRyYWNlKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIEltcG9ydFRyYWNlIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxFbGVtZW50KTtcbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLmluaXRfRE9NKCk7XG59O1xuXG5JbXBvcnRUcmFjZS5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBwX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdJbXBvcnQgYSB0cmFjZTogJyk7XG5cbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnZmlsZScpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnY3N2LWZpbGVbXScpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ211bHRpcGxlJywgJ3RydWUnKTtcbiAgICAvL1x0XHR0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywxNSk7XG4gICAgLy9cdFx0dGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLHRoaXMudGltZXIudGltZSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaW5wdXRfZWxlbWVudCk7XG5cbiAgICAvL1x0XHR2YXIgc3VibWl0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIC8vXHRcdHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsJ3N1Ym1pdCcpO1xuICAgIC8vXHRcdHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCdJbXBvcnQnKTtcbiAgICAvL1x0XHRwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoc3VibWl0X2VsZW1lbnQpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMub25fY2hhbmdlLmJpbmQodGhpcykpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYXBwZW5kQ2hpbGQocF9lbGVtZW50KTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5mb3JtX2VsZW1lbnQpO1xuXG4gICAgdmFyIGJ1dHRvbl9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB2YXIgYV9lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhX2VsLmhyZWYgPSBcIlwiO1xuICAgIGFfZWwuaW5uZXJIVE1MID0gXCJ0b2dnbGUgY29uc29sZVwiO1xuICAgIGJ1dHRvbl9lbC5hcHBlbmRDaGlsZChhX2VsKTtcbiAgICAvL1x0XHRidXR0b25fZWwuaW5uZXJIVE1MID0gXCI8YSBocmVmPVxcXCJcXFwiPnRvZ2dsZSBjb25zb2xlPC9hPlwiO1xuICAgIGFfZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uX3RvZ2dsZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoYnV0dG9uX2VsKTtcblxuICAgIHRoaXMuZGlzcGxheV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGlzcGxheV9lbGVtZW50KTtcbiAgfSxcblxuICBvbl9jaGFuZ2U6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBmaWxlcyA9IGUudGFyZ2V0LmZpbGVzO1xuICAgIHZhciB0aXRsZV9lbCwgY29udGVudF9lbDtcbiAgICBmb3IgKHZhciBpID0gMCwgZmlsZTsgZmlsZSA9IGZpbGVzW2ldOyBpKyspIHtcbiAgICAgIHRpdGxlX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgyXCIpO1xuICAgICAgdGl0bGVfZWwuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZmlsZS5uYW1lKSk7XG4gICAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5hcHBlbmRDaGlsZCh0aXRsZV9lbCk7XG4gICAgICBjb250ZW50X2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInByZVwiKTtcbiAgICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IChmdW5jdGlvbihlbCwgcGFyc2VyLCB0cmFjZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHBhcnNlcihlLnRhcmdldC5yZXN1bHQsIHRyYWNlKTtcbiAgICAgICAgICBlbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShlLnRhcmdldC5yZXN1bHQpKTtcbiAgICAgICAgfTtcbiAgICAgIH0pKGNvbnRlbnRfZWwsIHRoaXMucGFyc2VfY3N2LCB0aGlzLnRyYWNlKTtcbiAgICAgIC8qXHRcdFx0cmVhZGVyLm9ucHJvZ3Jlc3MgPSBmdW5jdGlvbihlKSB7XG4gICAgICBcdFx0XHRcdGNvbnNvbGUubG9nKGUpO1xuICAgICAgXHRcdFx0fTsqL1xuICAgICAgcmVhZGVyLnJlYWRBc1RleHQoZmlsZSk7XG4gICAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5hcHBlbmRDaGlsZChjb250ZW50X2VsKTtcbiAgICAgIHRoaXMudHJhY2UudHJpZ2dlciAoXCJiZWZvckxvYWRGaWxlXCIpO1xuICAgIH1cbiAgfSxcblxuICBvbl90b2dnbGU6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHRoaXMuZGlzcGxheV9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPT09IFwibm9uZVwiKSB7XG4gICAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRpc3BsYXlfZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgcGFyc2VfY3N2OiBmdW5jdGlvbih0ZXh0LCB0cmFjZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgLy9mdW5jdGlvbiBjc3ZUb0FycmF5KCkgZnJvbVxuICAgIC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTI5MzE0Ny9qYXZhc2NyaXB0LWNvZGUtdG8tcGFyc2UtY3N2LWRhdGFcblxuICAgIC8vIFRoaXMgd2lsbCBwYXJzZSBhIGRlbGltaXRlZCBzdHJpbmcgaW50byBhbiBhcnJheSBvZlxuICAgIC8vIGFycmF5cy4gVGhlIGRlZmF1bHQgZGVsaW1pdGVyIGlzIHRoZSBjb21tYSwgYnV0IHRoaXNcbiAgICAvLyBjYW4gYmUgb3ZlcnJpZGVuIGluIHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gICAgZnVuY3Rpb24gY3N2VG9BcnJheShzdHJEYXRhLCBzdHJEZWxpbWl0ZXIpIHtcbiAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZGVsaW1pdGVyIGlzIGRlZmluZWQuIElmIG5vdCxcbiAgICAgIC8vIHRoZW4gZGVmYXVsdCB0byBjb21tYS5cbiAgICAgIHN0ckRlbGltaXRlciA9IChzdHJEZWxpbWl0ZXIgfHwgXCIsXCIpO1xuXG4gICAgICAvLyBDcmVhdGUgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcGFyc2UgdGhlIENTViB2YWx1ZXMuXG4gICAgICB2YXIgb2JqUGF0dGVybiA9IG5ldyBSZWdFeHAoXG4gICAgICAoXG4gICAgICAvLyBEZWxpbWl0ZXJzLlxuICAgICAgXCIoXFxcXFwiICsgc3RyRGVsaW1pdGVyICsgXCJ8XFxcXHI/XFxcXG58XFxcXHJ8XilcIiArXG5cbiAgICAgIC8vIFF1b3RlZCBmaWVsZHMuXG4gICAgICBcIig/OlxcXCIoW15cXFwiXSooPzpcXFwiXFxcIlteXFxcIl0qKSopXFxcInxcIiArXG5cbiAgICAgIC8vIFN0YW5kYXJkIGZpZWxkcy5cbiAgICAgIFwiKFteXFxcIlxcXFxcIiArIHN0ckRlbGltaXRlciArIFwiXFxcXHJcXFxcbl0qKSlcIlxuICAgICAgKSxcbiAgICAgIFwiZ2lcIlxuICAgICAgKTtcblxuICAgICAgLy8gQ3JlYXRlIGFuIGFycmF5IHRvIGhvbGQgb3VyIGRhdGEuIEdpdmUgdGhlIGFycmF5XG4gICAgICAvLyBhIGRlZmF1bHQgZW1wdHkgZmlyc3Qgcm93LlxuICAgICAgdmFyIGFyckRhdGEgPSBbW11dO1xuXG4gICAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgaW5kaXZpZHVhbCBwYXR0ZXJuXG4gICAgICAvLyBtYXRjaGluZyBncm91cHMuXG4gICAgICB2YXIgYXJyTWF0Y2hlcyA9IG51bGw7XG5cbiAgICAgIC8vIEtlZXAgbG9vcGluZyBvdmVyIHRoZSByZWd1bGFyIGV4cHJlc3Npb24gbWF0Y2hlc1xuICAgICAgLy8gdW50aWwgd2UgY2FuIG5vIGxvbmdlciBmaW5kIGEgbWF0Y2guXG4gICAgICB3aGlsZSAoYXJyTWF0Y2hlcyA9IG9ialBhdHRlcm4uZXhlYyhzdHJEYXRhKSkge1xuXG4gICAgICAgIC8vIEdldCB0aGUgZGVsaW1pdGVyIHRoYXQgd2FzIGZvdW5kLlxuICAgICAgICB2YXIgc3RyTWF0Y2hlZERlbGltaXRlciA9IGFyck1hdGNoZXNbIDEgXTtcblxuICAgICAgICAvLyBDaGVjayB0byBzZWUgaWYgdGhlIGdpdmVuIGRlbGltaXRlciBoYXMgYSBsZW5ndGhcbiAgICAgICAgLy8gKGlzIG5vdCB0aGUgc3RhcnQgb2Ygc3RyaW5nKSBhbmQgaWYgaXQgbWF0Y2hlc1xuICAgICAgICAvLyBmaWVsZCBkZWxpbWl0ZXIuIElmIGlkIGRvZXMgbm90LCB0aGVuIHdlIGtub3dcbiAgICAgICAgLy8gdGhhdCB0aGlzIGRlbGltaXRlciBpcyBhIHJvdyBkZWxpbWl0ZXIuXG4gICAgICAgIGlmIChzdHJNYXRjaGVkRGVsaW1pdGVyLmxlbmd0aCAmJiAoc3RyTWF0Y2hlZERlbGltaXRlciAhPT0gc3RyRGVsaW1pdGVyKSkge1xuXG4gICAgICAgICAgLy8gU2luY2Ugd2UgaGF2ZSByZWFjaGVkIGEgbmV3IHJvdyBvZiBkYXRhLFxuICAgICAgICAgIC8vIGFkZCBhbiBlbXB0eSByb3cgdG8gb3VyIGRhdGEgYXJyYXkuXG4gICAgICAgICAgYXJyRGF0YS5wdXNoKFtdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vdyB0aGF0IHdlIGhhdmUgb3VyIGRlbGltaXRlciBvdXQgb2YgdGhlIHdheSxcbiAgICAgICAgLy8gbGV0J3MgY2hlY2sgdG8gc2VlIHdoaWNoIGtpbmQgb2YgdmFsdWUgd2VcbiAgICAgICAgLy8gY2FwdHVyZWQgKHF1b3RlZCBvciB1bnF1b3RlZCkuXG4gICAgICAgIGlmIChhcnJNYXRjaGVzWyAyIF0pIHtcblxuICAgICAgICAgIC8vIFdlIGZvdW5kIGEgcXVvdGVkIHZhbHVlLiBXaGVuIHdlIGNhcHR1cmVcbiAgICAgICAgICAvLyB0aGlzIHZhbHVlLCB1bmVzY2FwZSBhbnkgZG91YmxlIHF1b3Rlcy5cbiAgICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMiBdLnJlcGxhY2UoXG4gICAgICAgICAgbmV3IFJlZ0V4cChcIlxcXCJcXFwiXCIsIFwiZ1wiKSwgXCJcXFwiXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFdlIGZvdW5kIGEgbm9uLXF1b3RlZCB2YWx1ZS5cbiAgICAgICAgICB2YXIgc3RyTWF0Y2hlZFZhbHVlID0gYXJyTWF0Y2hlc1sgMyBdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IHRoYXQgd2UgaGF2ZSBvdXIgdmFsdWUgc3RyaW5nLCBsZXQncyBhZGRcbiAgICAgICAgLy8gaXQgdG8gdGhlIGRhdGEgYXJyYXkuXG4gICAgICAgIGFyckRhdGFbIGFyckRhdGEubGVuZ3RoIC0gMSBdLnB1c2goc3RyTWF0Y2hlZFZhbHVlKTtcbiAgICAgIH1cblxuICAgICAgLy8gUmV0dXJuIHRoZSBwYXJzZWQgZGF0YS5cbiAgICAgIHJldHVybiAoYXJyRGF0YSk7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coJ2ZpY2hpZXIgY2hhcmfDqScpO1xuICAgIC8vIEd1ZXNzaW5nIHRoZSBzZXBhcmF0b3JcbiAgICB2YXIgc2VwID0gdGV4dFt0ZXh0LnNlYXJjaChcIlssO1xcdF1cIildO1xuICAgIHZhciBjc3YgPSBjc3ZUb0FycmF5KHRleHQsIHNlcCk7XG4gICAgY3N2LnBvcCgpOyAvLyByZW1vdmUgdGhlIGxhc3QgbGluZS4uLiBXaHk/Li4uXG4gICAgLy9cdGNvbnNvbGUubG9nKCdmaWNoaWVyIHBhcnPDqScpO1xuICAgIGNzdi5tYXAoZnVuY3Rpb24obGluZSxqKSB7XG4gICAgICB2YXIgb19hdHRyID0ge307XG4gICAgICBvX2F0dHIuYmVnaW4gPSBsaW5lLnNoaWZ0KCk7XG4gICAgICBvX2F0dHIudHlwZSA9IGxpbmUuc2hpZnQoKTtcbiAgICAgIG9fYXR0ci5hdHRyaWJ1dGVzID0ge307XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IChsaW5lLmxlbmd0aCAtIDEpIC8gMiA7IGkrKykge1xuICAgICAgICBpZiAobGluZVsyICogaV0gIT09IFwiXCIpIHtcbiAgICAgICAgICBvX2F0dHIuYXR0cmlidXRlc1tsaW5lWzIgKiBpXV0gPSBsaW5lWzIgKiBpICsgMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChqPT09MCkge3RyYWNlLnRyaWdnZXIgKFwiZmlyc3RPYnNlbExvY2FsXCIsb19hdHRyKX07XG4gICAgICBpZiAoaj09PWNzdi5sZW5ndGgtMSkge3RyYWNlLnRyaWdnZXIgKFwiTGFzdE9ic2VsTG9jYWxcIixvX2F0dHIpfTtcblxuICAgICAgdHJhY2UuY3JlYXRlX29ic2VsKG9fYXR0cik7XG4gICAgfSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW1wb3J0VHJhY2U7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xuXG52YXIgSW50ZXJ2YWxUaW1lRm9ybSA9IGZ1bmN0aW9uKGh0bWxfaWQsIHRpbWVXaW5kb3cpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1SZWFkYWJsZVRpbWVGb3JtJyk7XG4gIHRoaXMud2luZG93ID0gdGltZVdpbmRvdztcbiAgdGhpcy53aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcbiAgLy90aGlzLnRpbWVyLm9uKCd0aW1lcjp1cGRhdGUnLHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcbiAgLy90aGlzLnRpbWVyLm9uKCd0aW1lcjpwbGF5OnVwZGF0ZScsdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuICB0aGlzLmluaXRfRE9NKCk7XG4gIHRoaXMucmVmcmVzaCgpO1xuXHR9O1xuXG5JbnRlcnZhbFRpbWVGb3JtLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0ZST006ICcpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICd5ZWFyJyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgNCk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy55ZWFyX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLycpKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9udGgnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubW9udGhfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcvJykpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdkYXknKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXlfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgLSAnKSk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ2hvdXInKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmhvdXJfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCc6JykpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdtaW51dGUnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5taW51dGVfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCc6JykpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdzZWNvbmQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDgpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zZWNvbmRfZWxlbWVudCk7XG5cbiAgICAvL3ZhciBwX2VsZW1lbnQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHZhciB0ZXh0X25vZGUxID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1RvOiAnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dF9ub2RlMSk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQxID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ3llYXInKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCdzaXplJywgNCk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMueWVhcl9lbGVtZW50MSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcvJykpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnbmFtZScsICdtb250aCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudDEuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5tb250aF9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1vbnRoX2VsZW1lbnQxKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy8nKSk7XG4gICAgdGhpcy5kYXlfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ2RheScpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF5X2VsZW1lbnQxKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAtICcpKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnaG91cicpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5ob3VyX2VsZW1lbnQxKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzonKSk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ21pbnV0ZScpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWludXRlX2VsZW1lbnQxKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzonKSk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ3NlY29uZCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnc2l6ZScsIDgpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuc2Vjb25kX2VsZW1lbnQxKTtcblxuXG5cblxuXG4gICAgdmFyIHN1Ym1pdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnc3VibWl0Jyk7XG4gICAgc3VibWl0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICdVcGRhdGUgdGltZScpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChzdWJtaXRfZWxlbWVudCk7XG4gICAgdGhpcy5mb3JtX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5idWlsZF9jYWxsYmFjaygnc3VibWl0JykpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYXBwZW5kQ2hpbGQocF9lbGVtZW50KTtcblxuXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZm9ybV9lbGVtZW50KTtcbiAgfSxcbiAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG5cbiAgICB0aW1lc3RhcnQgPSB0aGlzLndpbmRvdy5zdGFydDtcbiAgICB0aW1lRW5kID0gdGhpcy53aW5kb3cuZW5kO1xuXG4gICAgdmFyIGRhdGVzdGFydCA9IG5ldyBEYXRlKCk7XG4gICAgZGF0ZXN0YXJ0LnNldFRpbWUodGltZXN0YXJ0KTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC52YWx1ZSAgID0gZGF0ZXN0YXJ0LmdldEZ1bGxZZWFyKCk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnZhbHVlICA9IGRhdGVzdGFydC5nZXRNb250aCgpICsgMTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnZhbHVlICAgID0gZGF0ZXN0YXJ0LmdldERhdGUoKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC52YWx1ZSAgID0gZGF0ZXN0YXJ0LmdldEhvdXJzKCk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC52YWx1ZSA9IGRhdGVzdGFydC5nZXRNaW51dGVzKCk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC52YWx1ZSA9IGRhdGVzdGFydC5nZXRTZWNvbmRzKCkgKyBkYXRlc3RhcnQuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwO1xuXG4gICAgdmFyIGRhdGVFbmQgPSBuZXcgRGF0ZSgpO1xuICAgIGRhdGVFbmQuc2V0VGltZSh0aW1lRW5kKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEudmFsdWUgICA9IGRhdGVFbmQuZ2V0RnVsbFllYXIoKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQxLnZhbHVlICA9IGRhdGVFbmQuZ2V0TW9udGgoKSArIDE7XG4gICAgdGhpcy5kYXlfZWxlbWVudDEudmFsdWUgICAgPSBkYXRlRW5kLmdldERhdGUoKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudDEudmFsdWUgICA9IGRhdGVFbmQuZ2V0SG91cnMoKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50MS52YWx1ZSA9IGRhdGVFbmQuZ2V0TWludXRlcygpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQxLnZhbHVlID0gZGF0ZUVuZC5nZXRTZWNvbmRzKCkgKyBkYXRlRW5kLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMDtcbiAgfSxcbiAgYnVpbGRfY2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRpbWVyV2luZG93ID0gdGhpcy53aW5kb3c7XG4gICAgdmFyIHRpbWVfZm9ybSA9IHRoaXM7XG4gICAgc3dpdGNoIChldmVudCkge1xuICAgICAgY2FzZSAnc3VibWl0JzpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdXaWRnZXRCYXNpY1RpbWVGb3JtLnN1Ym1pdCcpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuXG4gICAgICAgICAgdmFyIGRhdGVzdGFydCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgZGF0ZXN0YXJ0LnNldEZ1bGxZZWFyKHRpbWVfZm9ybS55ZWFyX2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGVzdGFydC5zZXRNb250aCh0aW1lX2Zvcm0ubW9udGhfZWxlbWVudC52YWx1ZSAtIDEpO1xuICAgICAgICAgIGRhdGVzdGFydC5zZXREYXRlKHRpbWVfZm9ybS5kYXlfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZXN0YXJ0LnNldEhvdXJzKHRpbWVfZm9ybS5ob3VyX2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGVzdGFydC5zZXRNaW51dGVzKHRpbWVfZm9ybS5taW51dGVfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZXN0YXJ0LnNldFNlY29uZHModGltZV9mb3JtLnNlY29uZF9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICB2YXIgZGF0ZWVuZCA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXRGdWxsWWVhcih0aW1lX2Zvcm0ueWVhcl9lbGVtZW50MS52YWx1ZSk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXRNb250aCh0aW1lX2Zvcm0ubW9udGhfZWxlbWVudDEudmFsdWUgLSAxKTtcbiAgICAgICAgICBkYXRlZW5kLnNldERhdGUodGltZV9mb3JtLmRheV9lbGVtZW50MS52YWx1ZSk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXRIb3Vycyh0aW1lX2Zvcm0uaG91cl9lbGVtZW50MS52YWx1ZSk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXRNaW51dGVzKHRpbWVfZm9ybS5taW51dGVfZWxlbWVudDEudmFsdWUpO1xuICAgICAgICAgIGRhdGVlbmQuc2V0U2Vjb25kcyh0aW1lX2Zvcm0uc2Vjb25kX2VsZW1lbnQxLnZhbHVlKTtcbiAgICAgICAgICB0aW1lcldpbmRvdy5zZXRfc3RhcnQoZGF0ZXN0YXJ0LmdldFRpbWUoKSk7XG4gICAgICAgICAgdGltZXJXaW5kb3cuc2V0X2VuZCAoZGF0ZWVuZC5nZXRUaW1lKCkpXG4gICAgICAgICAgLy90aW1lci5zZXQoZGF0ZS5nZXRUaW1lKCkpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuXHR9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEludGVydmFsVGltZUZvcm07XG4iLCJ2YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuLi8uLi9jb3JlL0V2ZW50SGFuZGxlci5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgR2VuZXJpYyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIHRoZSBhdmFpbGFibGUgYmFzZXMgb2YgYSBLVEJTLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogVE9ETyBlY3JpcmUgZGVzY3JpcHRpb25cbiAqIEB0b2RvIEVDUklSRSBMQSBERVNDUklQVElPTlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sX2lkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5LVEJTfSBrdGJzXG4gKiAgICAgS1RCUyB0byBiaW5kIHRvLlxuICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5FdmVudEhhbmRsZXIuRXZlbnRDb25maWd9IFtldmVudHNdXG4gKiAgICAgRXZlbnRzIHRvIGxpc3RlbiB0byBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBjYWxsYmFja3MuXG4gKi9cbnZhciBMaXN0QmFzZXMgPSBmdW5jdGlvbihodG1sX2lkLCBrdGJzLCBldmVudHMpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcywgZXZlbnRzKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1MaXN0QmFzZXMnKTtcblxuICB0aGlzLmt0YnMgPSBrdGJzO1xuICBrdGJzLm9uKCdrdGJzOnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG59O1xuXG5MaXN0QmFzZXMucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgLy90aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAvLyQodGhpcy5lbGVtZW50KS5hcHBlbmQoJzxoMj5LVEJTIHJvb3Q6ICcrdGhpcy5rdGJzLmdldF91cmkoKSsnPC9oMj4nKTtcbiAgICAvKlxuICAgIFx0XHR2YXIgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIFx0XHR2YXIgdGl0bGVfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdLVEJTIHJvb3Q6ICcrdGhpcy5rdGJzLmdldF91cmkoKSk7XG4gICAgXHRcdHRpdGxlLmFwcGVuZENoaWxkKHRpdGxlX3RleHQpO1xuICAgIFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGl0bGUpO1xuKi9cbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRhdGFsaXN0X2VsZW1lbnQpO1xuXG4gICAgdGhpcy5hZGRfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmFkZF9idXR0b24pLmFwcGVuZCgnTmV3IGJhc2UnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5hZGRfYnV0dG9uKTtcbiAgICAkKHRoaXMuYWRkX2J1dHRvbikuY2xpY2sodGhpcy5vcGVuX2Zvcm0uYmluZCh0aGlzKSk7XG4gIH0sXG4gIG9wZW5fZm9ybTogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5mb3JtID0ge307XG5cbiAgICB0aGlzLmZvcm0uaW5wdXRfaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9pZC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQxID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBCYXNlIElEOiAnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9sYWJlbC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBsYWJlbDogJyk7XG4gICAgdGhpcy5mb3JtLmJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICQodGhpcy5mb3JtLmJ1dHRvbikuYXBwZW5kKCdjcmVhdGUnKTtcblxuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLnRleHQxKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5pbnB1dF9pZCk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0udGV4dDIpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X2xhYmVsKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5idXR0b24pO1xuXG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5jbGljayh0aGlzLmNyZWF0ZV9iYXNlLmJpbmQodGhpcykpO1xuXG4gIH0sXG4gIGNyZWF0ZV9iYXNlOiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKCQodGhpcy5mb3JtLmlucHV0X2lkKS52YWwoKSAhPT0gXCJcIikge1xuICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBhIG5ldyBiYXNlLi4uXCIpO1xuICAgICAgdGhpcy5rdGJzLmNyZWF0ZV9iYXNlKCQodGhpcy5mb3JtLmlucHV0X2lkKS52YWwoKSwgJCh0aGlzLmZvcm0uaW5wdXRfbGFiZWwpLnZhbCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJFbXB0eSBiYXNlIG5hbWUuLi4gTm8gYmFzZSBjcmVhdGVkXCIpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gdGhpcy5mb3JtKSB7XG4gICAgICBpZiAodGhpcy5mb3JtLmhhc093blByb3BlcnR5KGspKSAgICAgIHskKHRoaXMuZm9ybVtrXSkucmVtb3ZlKCk7fVxuICAgIH1cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfSxcbiAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgLy8gY2xlYXJcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgdmFyIGxpX2VsZW1lbnQ7XG4gICAgdGhpcy5rdGJzLmxpc3RfYmFzZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKGIpIHtcbiAgICAgIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgbGlfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgbGlfbGluay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJhc2VcIik7XG4gICAgICBsaV9saW5rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGIpKTtcbiAgICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfbGluayk7XG4gICAgICBsaV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGZ1bmN0aW9uKCkge3RoaXMudHJpZ2dlcigndWk6Y2xpY2s6YmFzZScsIGIpfSkuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy50cmlnZ2VyKFwiTGlzdEJhc2VcIik7XG5cbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdEJhc2VzO1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi4vLi4vY29yZS9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQGNsYXNzIEdlbmVyaWMgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgYXZhaWxhYmxlIGJhc2VzIG9mIGEgS1RCUy5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuIC8vIGZhdG1hIERFcmJlbFxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBUT0RPIGVjcmlyZSBkZXNjcmlwdGlvblxuICogQHRvZG8gRUNSSVJFIExBIERFU0NSSVBUSU9OXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxFbGVtZW50XG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5LVEJTLkJhc2V9IGt0YnNCYXNlXG4gKiAgICAgS1RCUyBCYXNlIHRvIGJpbmQgdG8uXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuTGliLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ30gW2V2ZW50c11cbiAqICAgICBFdmVudHMgdG8gbGlzdGVuIHRvIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIGNhbGxiYWNrcy5cbiAqL1xudmFyIExpc3RNb2RlbEluQmFzZXMgPSBmdW5jdGlvbihodG1sRWxlbWVudCwga3Ric0Jhc2UsIGV2ZW50cykge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxFbGVtZW50KTtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcywgZXZlbnRzKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1MaXN0VHJhY2VzJyk7XG5cbiAgdGhpcy5iYXNlID0ga3Ric0Jhc2U7XG4gIHRoaXMuYmFzZS5vbignYmFzZTp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xufTtcblxuTGlzdE1vZGVsSW5CYXNlcy5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICAvL3RoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgLyp2YXIgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIFx0XHR2YXIgdGl0bGVfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdCYXNlOiAnK3RoaXMuYmFzZS5nZXRfdXJpKCkpO1xuICAgIFx0XHR0aXRsZS5hcHBlbmRDaGlsZCh0aXRsZV90ZXh0KTtcbiAgICBcdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRpdGxlKTsqL1xuXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXRhbGlzdF9lbGVtZW50KTtcblxuXG4gICAgdGhpcy5hZGRfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmFkZF9idXR0b24pLmFwcGVuZCgnTmV3IE1vZGVsJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYWRkX2J1dHRvbik7XG4gICAgJCh0aGlzLmFkZF9idXR0b24pLmNsaWNrKHRoaXMub3Blbl9mb3JtLmJpbmQodGhpcykpO1xuXG4gICAgLyp0aGlzLnJlbW92ZV9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBcdFx0JCh0aGlzLnJlbW92ZV9idXR0b24pLmFwcGVuZCgnRGVsZXRlIGJhc2UnKTtcbiAgICBcdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMucmVtb3ZlX2J1dHRvbik7XG4gICAgXHRcdCQodGhpcy5yZW1vdmVfYnV0dG9uKS5jbGljayh0aGlzLnJlbW92ZV9iYXNlLmJpbmQodGhpcykpOyovXG5cblxuICB9LFxuICBvcGVuX2Zvcm06IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5hZGRfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZm9ybSA9IHt9O1xuXG4gICAgdGhpcy5mb3JtLmlucHV0X2lkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfaWQuc2l6ZSA9IDIwO1xuICAgIHRoaXMuZm9ybS50ZXh0MSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgTW9kZWwgSUQ6ICcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X2xhYmVsLnNpemUgPSAyMDtcbiAgICB0aGlzLmZvcm0udGV4dDIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIGxhYmVsOiAnKTtcbiAgICB0aGlzLmZvcm0uYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5hcHBlbmQoJ2NyZWF0ZScpO1xuXG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0udGV4dDEpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X2lkKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS50ZXh0Mik7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uaW5wdXRfbGFiZWwpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmJ1dHRvbik7XG5cbiAgICAkKHRoaXMuZm9ybS5idXR0b24pLmNsaWNrKHRoaXMuY3JlYXRlX3RyYWNlLmJpbmQodGhpcykpO1xuXG4gIH0sXG4gIGNyZWF0ZV90cmFjZTogZnVuY3Rpb24oZSkge1xuICAgIGlmICgkKHRoaXMuZm9ybS5pbnB1dF9pZCkudmFsKCkgIT09IFwiXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiQ3JlYXRpbmcgYSBuZXcgdHJhY2UuLi5cIik7XG4gICAgICB0aGlzLmJhc2UuY3JlYXRlX3N0b3JlZF90cmFjZSgkKHRoaXMuZm9ybS5pbnB1dF9pZCkudmFsKCksIG51bGwsIG51bGwsIG51bGwsICQodGhpcy5mb3JtLmlucHV0X2xhYmVsKS52YWwoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRW1wdHkgdHJhY2UgbmFtZS4uLiBObyB0cmFjZSBjcmVhdGVkXCIpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gdGhpcy5mb3JtKSB7XG4gICAgICAkKHRoaXMuZm9ybVtrXSkucmVtb3ZlKCk7XG4gICAgfVxuICAgIHRoaXMuYWRkX2J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICB9LFxuICByZW1vdmVfYmFzZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5iYXNlLnJlbW92ZSgpO1xuICB9LFxuICByZWZyZXNoOiBmdW5jdGlvbigpIHtcbiAgICAvLyBjbGVhclxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICB2YXIgbGlfZWxlbWVudDtcbiAgICB0aGlzLmJhc2UubGlzdF90cmFjZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKHQpIHtcbiAgICAgIGlmICh0WydAdHlwZSddID09IFwiVHJhY2VNb2RlbFwiKSB7XG4gICAgICAgIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsaV9saW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGxpX2xpbmsuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtb2RlbFwiKTtcbiAgICAgICAgbGlfbGluay5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0WydAaWQnXSkpO1xuICAgICAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2xpbmspO1xuICAgICAgICBsaV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGZ1bmN0aW9uKCkge3RoaXMudHJpZ2dlcigndWk6Y2xpY2s6dHJhY2UnLCB0WydAaWQnXSl9KS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTt9XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy50cmlnZ2VyKFwiTGlzdE1vZGVsXCIpO1xuICB9LFxuICBzZWxlY3Q6IGZ1bmN0aW9uKCkge1xuXHR9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExpc3RNb2RlbEluQmFzZXM7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuLi8uLi9jb3JlL0V2ZW50SGFuZGxlci5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgR2VuZXJpYyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIHRoZSBhdmFpbGFibGUgYmFzZXMgb2YgYSBLVEJTLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogVE9ETyBlY3JpcmUgZGVzY3JpcHRpb25cbiAqIEB0b2RvIEVDUklSRSBMQSBERVNDUklQVElPTlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sX2lkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5LVEJTLkJhc2V9IGt0YnNfYmFzZVxuICogICAgIEtUQlMgQmFzZSB0byBiaW5kIHRvLlxuICogQHBhcmFtIHtTYW1vdHJhY2VzLkxpYi5FdmVudEhhbmRsZXIuRXZlbnRDb25maWd9IFtldmVudHNdXG4gKiAgICAgRXZlbnRzIHRvIGxpc3RlbiB0byBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBjYWxsYmFja3MuXG4gKi9cbnZhciBMaXN0VHJhY2VzSW5CYXNlcyA9IGZ1bmN0aW9uKGh0bWxfaWQsIGt0YnNfYmFzZSwgZXZlbnRzKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMsIGV2ZW50cyk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtTGlzdFRyYWNlcycpO1xuXG4gIHRoaXMuYmFzZSA9IGt0YnNfYmFzZTtcbiAgdGhpcy5iYXNlLm9uKCdiYXNlOnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG59O1xuXG5MaXN0VHJhY2VzSW5CYXNlcy5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICAvL3RoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xuXG4gICAgLyp2YXIgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMicpO1xuICAgIFx0XHR2YXIgdGl0bGVfdGV4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdCYXNlOiAnK3RoaXMuYmFzZS5nZXRfdXJpKCkpO1xuICAgIFx0XHR0aXRsZS5hcHBlbmRDaGlsZCh0aXRsZV90ZXh0KTtcbiAgICBcdFx0dGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRpdGxlKTsqL1xuXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXRhbGlzdF9lbGVtZW50KTtcblxuICAgIC8qdGhpcy5yZW1vdmVfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgXHRcdCQodGhpcy5yZW1vdmVfYnV0dG9uKS5hcHBlbmQoJ0RlbGV0ZSBiYXNlJyk7XG4gICAgXHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnJlbW92ZV9idXR0b24pO1xuICAgIFx0XHQkKHRoaXMucmVtb3ZlX2J1dHRvbikuY2xpY2sodGhpcy5yZW1vdmVfYmFzZS5iaW5kKHRoaXMpKTsqL1xuXG4gICAgdGhpcy5hZGRfYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmFkZF9idXR0b24pLmFwcGVuZCgnTmV3IHRyYWNlJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYWRkX2J1dHRvbik7XG4gICAgJCh0aGlzLmFkZF9idXR0b24pLmNsaWNrKHRoaXMub3Blbl9mb3JtLmJpbmQodGhpcykpO1xuXG4gIH0sXG4gIG9wZW5fZm9ybTogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5mb3JtID0ge307XG5cbiAgICB0aGlzLmZvcm0uaW5wdXRfaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9pZC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQxID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBUcmFjZSBJRDogJyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X2xhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfbGFiZWwuc2l6ZSA9IDIwO1xuICAgIHRoaXMuZm9ybS50ZXh0MiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgbGFiZWw6ICcpO1xuICAgIHRoaXMuZm9ybS5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAkKHRoaXMuZm9ybS5idXR0b24pLmFwcGVuZCgnY3JlYXRlJyk7XG5cbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS50ZXh0MSk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uaW5wdXRfaWQpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLnRleHQyKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5pbnB1dF9sYWJlbCk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uYnV0dG9uKTtcblxuICAgICQodGhpcy5mb3JtLmJ1dHRvbikuY2xpY2sodGhpcy5jcmVhdGVfdHJhY2UuYmluZCh0aGlzKSk7XG5cbiAgfSxcbiAgY3JlYXRlX3RyYWNlOiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKCQodGhpcy5mb3JtLmlucHV0X2lkKS52YWwoKSAhPT0gXCJcIikge1xuICAgICAgY29uc29sZS5sb2coXCJDcmVhdGluZyBhIG5ldyB0cmFjZS4uLlwiKTtcbiAgICAgIHRoaXMuYmFzZS5jcmVhdGVfc3RvcmVkX3RyYWNlKCQodGhpcy5mb3JtLmlucHV0X2lkKS52YWwoKSwgbnVsbCwgbnVsbCwgbnVsbCwgJCh0aGlzLmZvcm0uaW5wdXRfbGFiZWwpLnZhbCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5sb2coXCJFbXB0eSB0cmFjZSBuYW1lLi4uIE5vIHRyYWNlIGNyZWF0ZWRcIik7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayBpbiB0aGlzLmZvcm0pIHtcbiAgICAgIGlmICh0aGlzLmZvcm0uaGFzT3duUHJvcGVydHkoaykpICAgICAgeyQodGhpcy5mb3JtW2tdKS5yZW1vdmUoKTt9XG4gICAgfVxuICAgIHRoaXMuYWRkX2J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICB9LFxuICByZW1vdmVfYmFzZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5iYXNlLnJlbW92ZSgpO1xuICB9LFxuICByZWZyZXNoOiBmdW5jdGlvbigpIHtcbiAgICAvLyBjbGVhclxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICB2YXIgbGlfZWxlbWVudDtcbiAgICB0aGlzLmJhc2UubGlzdF90cmFjZXMoKS5mb3JFYWNoKGZ1bmN0aW9uKHQpIHtcbiAgICAgIGlmICh0WydAdHlwZSddID09IFwiU3RvcmVkVHJhY2VcIikge1xuICAgICAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGlfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBsaV9saW5rLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwidHJhY2VcIik7XG4gICAgICAgIGxpX2xpbmsuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodFsnQGlkJ10pKTtcbiAgICAgICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9saW5rKTtcbiAgICAgICAgLy9saV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRbJ0BpZCddKSk7XG4gICAgICAgIGxpX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZnVuY3Rpb24oKSB7dGhpcy50cmlnZ2VyKCd1aTpjbGljazp0cmFjZScsIHRbJ0BpZCddKX0pLmJpbmQodGhpcykpO1xuICAgICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO31cbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLnRyaWdnZXIoXCJMaXN0VHJhY2VcIik7XG5cbiAgfSxcbiAgc2VsZWN0OiBmdW5jdGlvbigpIHtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0VHJhY2VzSW5CYXNlcztcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhbiBPYnNlbCBhcyBhbiBIVE1MIGxpc3QuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhbiBPYnNlbCBhcyBhbiBIVE1MIGxpc3QuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLlVJLldpZGdldHMuT2JzZWxJbnNwZWN0b3IgaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIE9ic2Vscy5cbiAqXG4gKiBUaGlzIHdpZGdldCBvYnNlcnZlcyBhIHtAbGluayBTYW1vdHJhY2VzLkxpYi5TZWxlY3RvcnxTZWxlY3Rvcn1cbiAqIG9iamVjdC4gV2hlbiBhbiBvYnNlbCBpcyBzZWxlY3RlZCwgdGhlIGluZm9ybWF0aW9uIGFib3V0XG4gKiB0aGlzIG9ic2VsIGlzIGRpc3BsYXllZCBpbiB0aGUgd2lkZ2V0LiBXaGVuIGFuIG9ic2VsIGlzXG4gKiB1bnNlbGVjdGVkLCB0aGUgd2lkZ2V0IGNsb3Nlcy4gQ2xpY2tpbmcgb24gdGhlIHJlZCBjcm9zc1xuICogd2lsbCBjbG9zZSB0aGUgd2lkZ2V0IChhbmQgYXV0b21hdGljYWxseSB1bnNlbGVjdCB0aGUgb2JzZWwpLlxuICogV2hlbiBubyBvYnNlbCBhcmUgc2VsZWN0ZWQsIHRoZSB3aWRnZXQgaXMgbm90IHZpc2libGUsXG4gKiBzZWxlY3RpbmcgYW4gb2JzZWwgd2lsbCBtYWtlIGl0IGFwcGVhci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxfaWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NlbGVjdG9yLjxPYnNlbD59IG9ic2VsX3NlbGVjdG9yXG4gKiAgICAgQSBTZWxlY3RvciBvZiBPYnNlbCB0byBvYnNlcnZlLlxuICovXG52YXIgT2JzZWxJbnNwZWN0b3IgPSBmdW5jdGlvbihodG1sX2lkLCBvYnNlbF9zZWxlY3Rvcikge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LU9ic2VsSW5zcGVjdG9yJyk7XG5cbiAgdGhpcy5vYnNlbCA9IG9ic2VsX3NlbGVjdG9yO1xuICB0aGlzLm9ic2VsLm9uKCdzZWxlY3Rpb246YWRkJywgdGhpcy5pbnNwZWN0LmJpbmQodGhpcykpO1xuICB0aGlzLm9ic2VsLm9uKCdzZWxlY3Rpb246ZW1wdHknLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuICB0aGlzLm9ic2VsLm9uKCdzZWxlY3Rpb246cmVtb3ZlJywgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG59O1xuXG5PYnNlbEluc3BlY3Rvci5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuY2xvc2VfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB2YXIgaW1nX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWdfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFGUFNVUkJWRGlObFpPeFRnSlJFRVhQZlV1UEVteU1yUVNMSmFIV2hDaWx0WVgvb1oyVnNjTEtyNkNncGdPTVJuL0FSUkF0aVRZWXNWZDJMRmpJc3RrbGNacVh6TXk1TTVtWnB4RVVmK0hDNEFSb083amVNM3NqeFY2a1VqalBQUlEwYzlEUU16UU16bU41bnlFYytXWkJIQTRrMzBFUEtDNThnaHYxWVF6c0pJcXRpS1RCa1gwNHdXMUt0MFVIdmI1VTZVdVZEQmlnclNHVVFuZ3cyRXBHRGI2alZqZVNNY0ZFc0M4ekk1QjhEN3BwSW1rbW1NeWc3cHNGRHNBM0MyWlFGMHorQXdQSXpKYkJhRmgzd0dZR1B3MmhGdCtRaTBjOThKVHdKYW83RDd5NGI1azhrS28ybjBNK1M4QWdiOUFkU05VVmdRanVBSVVzT0dZRmc4NUNSRTlRZHZDWUFVK2pOMjBtWHdZSHpvT3pORmd3Q2FFV1FpMWpPd1hCaGZyd0Rtd240ZmlxMXR6SjJBbGE2MkJZZXlkTmphRDRNLytOcHdiM09iZ3NtNzJtdE14UTJnM251Y2VDVmc2dS9nQnM1NGFsb253ZFdRQUFBQUJKUlU1RXJrSmdnZz09Jyk7XG4gICAgdGhpcy5jbG9zZV9lbGVtZW50LmFwcGVuZENoaWxkKGltZ19lbGVtZW50KTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jbG9zZV9lbGVtZW50KTtcblxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF0YWxpc3RfZWxlbWVudCk7XG5cbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgIHRoaXMuY2xvc2VfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbG9zZUFjdGlvbi5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgaW5zcGVjdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgb2JzID0gZXZlbnQuZGF0YTtcbiAgICAvLyBjbGVhclxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5pbm5lckhUTUwgPSAnJztcblxuICAgIHZhciBhdHRyaWJ1dGVzID0gb2JzLmF0dHJpYnV0ZXM7XG5cbiAgICB2YXIgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnaWQ6ICcgKyBvYnMuZ2V0X2lkKCkpKTtcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7XG5cbiAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCd0eXBlOiAnICsgb2JzLmdldF90eXBlKCkpKTtcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7XG5cbiAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdiZWdpbjogJyArIG9icy5nZXRfYmVnaW4oKSkpO1xuICAgIC8vXHRsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdiZWdpbjogJysgKG5ldyBEYXRlKG9icy5nZXRfYmVnaW4oKSkpLnRvU3RyaW5nKCkpKTtcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7XG5cbiAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdlbmQ6ICcgKyBvYnMuZ2V0X2VuZCgpKSk7XG4gICAgLy9cdGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ2VuZDogJysgKG5ldyBEYXRlKG9icy5nZXRfZW5kKCkpKS50b1N0cmluZygpKSk7XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuXG4gICAgZm9yICh2YXIga2V5IGluIG9icy5hdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAob2JzLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkgICAgICB7bGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoa2V5ICArICc6ICcgKyBvYnMuYXR0cmlidXRlc1trZXldKSk7XG4gICAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7fVxuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfSxcbiAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9LFxuICBvbkNsb3NlQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9ic2VsLnVuc2VsZWN0KCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZWxJbnNwZWN0b3I7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYW4gT2JzZWwgYXMgYW4gSFRNTCBsaXN0LlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYW4gT2JzZWwgYXMgYW4gSFRNTCBsaXN0LlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm4gLy8gRmF0bWEgRGVyYmVsXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5PYnNlbEluc3BlY3RvciBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgT2JzZWxzLlxuICpcbiAqIFRoaXMgd2lkZ2V0IG9ic2VydmVzIGEge0BsaW5rIFNhbW90cmFjZXMuTGliLlNlbGVjdG9yfFNlbGVjdG9yfVxuICogb2JqZWN0LiBXaGVuIGFuIG9ic2VsIGlzIHNlbGVjdGVkLCB0aGUgaW5mb3JtYXRpb24gYWJvdXRcbiAqIHRoaXMgb2JzZWwgaXMgZGlzcGxheWVkIGluIHRoZSB3aWRnZXQuIFdoZW4gYW4gb2JzZWwgaXNcbiAqIHVuc2VsZWN0ZWQsIHRoZSB3aWRnZXQgY2xvc2VzLiBDbGlja2luZyBvbiB0aGUgcmVkIGNyb3NzXG4gKiB3aWxsIGNsb3NlIHRoZSB3aWRnZXQgKGFuZCBhdXRvbWF0aWNhbGx5IHVuc2VsZWN0IHRoZSBvYnNlbCkuXG4gKiBXaGVuIG5vIG9ic2VsIGFyZSBzZWxlY3RlZCwgdGhlIHdpZGdldCBpcyBub3QgdmlzaWJsZSxcbiAqIHNlbGVjdGluZyBhbiBvYnNlbCB3aWxsIG1ha2UgaXQgYXBwZWFyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0aHRtbF9pZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2VsZWN0b3IuPE9ic2VsPn0gb2JzZWxfc2VsZWN0b3JcbiAqICAgICBBIFNlbGVjdG9yIG9mIE9ic2VsIHRvIG9ic2VydmUuXG4gKi9cbnZhciBPYnNlbFR5cGVJbnNwZWN0b3IgPSBmdW5jdGlvbihodG1sX2lkLCBvYnNlbF9zZWxlY3Rvcikge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LU9ic2VsSW5zcGVjdG9yVHlwZScpO1xuXG4gIHRoaXMub2JzZWwgPSBvYnNlbF9zZWxlY3RvcjtcbiAgdGhpcy5vYnNlbC5vbignc2VsZWN0aW9uOmFkZCcsIHRoaXMuaW5zcGVjdC5iaW5kKHRoaXMpKTtcbiAgdGhpcy5vYnNlbC5vbignc2VsZWN0aW9uOmVtcHR5JywgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5vYnNlbC5vbignc2VsZWN0aW9uOnJlbW92ZScsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xufTtcblxuT2JzZWxUeXBlSW5zcGVjdG9yLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5jbG9zZV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIHZhciBpbWdfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZ19lbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBTjF3QUFEZGNCUWlpYmVBQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUZQU1VSQlZEaU5sWk94VGdKUkVFWFBmVXVQRW15TXJRU0xKYUhXaENpbHRZWC9vWjJWc2NMS3I2Q2dwZ09NUm4vQVJSQXRpVFlZc1ZkMkxGaklzdGtsY1pxWHpNeTVNNW1acHhFVWYrSEM0QVJvTzdqZU0zc2p4VjZrVWpqUFBSUTBjOURRTXpRTXptTjVueUVjK1daQkhBNGszMEVQS0M1OGdodjFZUXpzSklxdGlLVEJrWDA0d1cxS3QwVUh2YjVVNlV1VkRCaWdyU0dVUW5ndzJFcEdEYjZqVmplU01jRkVzQzh6STVCOEQ3cHBJbWttbU15Zzdwc0ZEc0EzQzJaUUYweitBd1BJekpiQmFGaDN3R1lHUHcyaEZ0K1FpMGM5OEpUd0phbzdEN3k0YjVrOGtLbzJuME0rUzhBZ2I5QWRTTlVWZ1FqdUFJVXNPR1lGZzg1Q1JFOVFkdkNZQVUrak4yMG1Yd1lIem9Pek5GZ3dDYUVXUWkxak93WEJoZnJ3RG13bjRmaXExdHpKMkFsYTYyQllleWROamFENE0vK05wd2IzT2Jnc203Mm10TXhRMmczbnVjZUNWZzZ1L2dCczU0YWxvbndkV1FBQUFBQkpSVTVFcmtKZ2dnPT0nKTtcbiAgICB0aGlzLmNsb3NlX2VsZW1lbnQuYXBwZW5kQ2hpbGQoaW1nX2VsZW1lbnQpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNsb3NlX2VsZW1lbnQpO1xuXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXRhbGlzdF9lbGVtZW50KTtcblxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuXG4gICAgdGhpcy5jbG9zZV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkNsb3NlQWN0aW9uLmJpbmQodGhpcykpO1xuICB9LFxuICBpbnNwZWN0OiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBvYnMgPSBldmVudC5kYXRhO1xuICAgIC8vIGNsZWFyXG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmlubmVySFRNTCA9ICcnO1xuXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSBvYnMuYXR0cmlidXRlcztcbiAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAvL2xpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3R5cGU6ICcrIG9icy5nZXRfdHlwZSgpKSk7XG4gICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgndHlwZTogJyArIG9ic1tcInR5cGVcIl0pKTtcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7XG5cblxuICAgIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0F0dHJpYnV0OiAnKSk7XG4gICAgZm9yICh2YXIga2V5IGluIG9icy5hdHRyaWJ1dGVzKSB7XG4gICAgICBmb3IgKHZhciB2YWwgaW4gb2JzLmF0dHJpYnV0ZXNba2V5XSkgICAgICB7XG5cblxuICAgICAgICAvLyAgbGlfZWxlbWVudF9BLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHZhbCAgKyc6ICcrIG9icy5hdHRyaWJ1dGVzW2tleV1bdmFsXSkpO1xuXG5cblxuXG4gICAgICAgIGlmICh2YWwgPT0gXCJAaWRcIikgICAgICAgIHtcbiAgICAgICAgICB1bF9lbGVtZW50X0EgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgICAgICAgIGxpX2VsZW1lbnRfQSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgICAgbGlfdGV4dCA9IG9icy5hdHRyaWJ1dGVzW2tleV1bdmFsXSArICcgOiAnIDtcbiAgICAgICAgfSAgICAgICAgZWxzZSBpZiAodmFsID09IFwibGFiZWxcIikgICAgICAgIHtcblxuICAgICAgICAgIGxpX2VsZW1lbnRfQS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShsaV90ZXh0ICsgb2JzLmF0dHJpYnV0ZXNba2V5XVt2YWxdKSk7XG4gICAgICAgICAgdWxfZWxlbWVudF9BLmFwcGVuZENoaWxkKGxpX2VsZW1lbnRfQSlcbiAgICAgICAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKHVsX2VsZW1lbnRfQSk7XG4gICAgICAgIH1cblxuXG5cblxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICB9LFxuICBjbG9zZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH0sXG4gIG9uQ2xvc2VBY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMub2JzZWwudW5zZWxlY3QoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlbFR5cGVJbnNwZWN0b3I7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgdGhlIGN1cnJlbnQgdGltZSBhcyBhIGRhdGUvdGltZS5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIHRoZSBjdXJyZW50IHRpbWUgYXMgYSBkYXRlL3RpbS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLldpZGdldHMuV2lkZ2V0XG4gKiBAc2VlIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UaW1lRm9ybVxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLlVJLldpZGdldHMuUmVhZGFibGVUaW1lRm9ybSBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgdGhlIGN1cnJlbnQgdGltZS5cbiAqXG4gKiBUaGUgdGltZSAoaW4gbXMgZnJvbSB0aGUgMDEvMDEvMTk3MCkgaXMgY29udmVydGVkIGluIGFcbiAqIGh1bWFuIHJlYWRhYmxlIGZvcm1hdCAoYXMgb3Bwb3NlZCB0b1xuICoge0BsaW5rIFNhbW90cmFjZXMuV2lkZ2V0cy5UaW1lRm9ybX0gd2lkZ2V0XG4gKiB3aGljaCBkaXNwbGF5IHJhdyB0aW1lKS5cbiAqXG4gKiBUaGlzIHdpZGdldCBvYnNlcnZlcyBhIFNhbW90cmFjZXMuTGliLlRpbWVyIG9iamVjdC5cbiAqIFdoZW4gdGhlIHRpbWVyIGNoYW5nZXMgdGhlIG5ldyB0aW1lIGlzIGRpc3BsYXllZC5cbiAqIFRoaXMgd2lkZ2V0IGFsc28gYWxsb3cgdG8gY2hhbmdlIHRoZSB0aW1lIG9mIHRoZSB0aW1lci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxfaWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVGltZXJ9IHRpbWVyXG4gKiAgICAgVGltZXIgb2JqZWN0IHRvIG9ic2VydmUuXG4gKi9cbnZhciBSZWFkYWJsZVRpbWVGb3JtID0gZnVuY3Rpb24oaHRtbF9pZCwgdGltZXIpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcblxuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVJlYWRhYmxlVGltZUZvcm0nKTtcblxuICB0aGlzLnRpbWVyID0gdGltZXI7XG4gIHRoaXMudGltZXIub24oJ3RpbWVyOnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcbiAgdGhpcy50aW1lci5vbigndGltZXI6cGxheTp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICB0aGlzLnJlZnJlc2goe2RhdGE6IHRoaXMudGltZXIudGltZX0pO1xufTtcblxuUmVhZGFibGVUaW1lRm9ybS5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuICAgIHZhciBwX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG5cbiAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0N1cnJlbnQgdGltZTogJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XG5cblxuICAgIHRoaXMueWVhcl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICd5ZWFyJyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgNCk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy55ZWFyX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLycpKTtcblxuICAgIHRoaXMubW9udGhfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdtb250aCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tb250aF9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy8nKSk7XG5cbiAgICB0aGlzLmRheV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnZGF5Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF5X2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIC0gJykpO1xuXG4gICAgdGhpcy5ob3VyX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ2hvdXInKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmhvdXJfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCc6JykpO1xuXG4gICAgdGhpcy5taW51dGVfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ21pbnV0ZScpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1pbnV0ZV9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzonKSk7XG5cbiAgICB0aGlzLnNlY29uZF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnc2Vjb25kJyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCA4KTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuc2Vjb25kX2VsZW1lbnQpO1xuICAgIC8qXG4gICAgXHRcdHRoaXMuaW5wdXRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgXHRcdHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCd0ZXh0Jyk7XG4gICAgXHRcdHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCcnKTtcbiAgICBcdFx0dGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsMTUpO1xuICAgIFx0XHR0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsdGhpcy50aW1lci50aW1lKTtcbiAgICBcdFx0cF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaW5wdXRfZWxlbWVudCk7XG4qL1xuICAgIHZhciBzdWJtaXRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgc3VibWl0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3N1Ym1pdCcpO1xuICAgIHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnVXBkYXRlIHRpbWUnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoc3VibWl0X2VsZW1lbnQpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5idWlsZF9jYWxsYmFjaygnc3VibWl0JykpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYXBwZW5kQ2hpbGQocF9lbGVtZW50KTtcblxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmZvcm1fZWxlbWVudCk7XG4gIH0sXG5cbiAgcmVmcmVzaDogZnVuY3Rpb24oZSkge1xuICAgIHZhciB0aW1lID0gZS5kYXRhXG4gICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIGRhdGUuc2V0VGltZSh0aW1lKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC52YWx1ZSAgID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC52YWx1ZSAgPSBkYXRlLmdldE1vbnRoKCkgKyAxO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQudmFsdWUgICAgPSBkYXRlLmdldERhdGUoKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC52YWx1ZSAgID0gZGF0ZS5nZXRIb3VycygpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQudmFsdWUgPSBkYXRlLmdldE1pbnV0ZXMoKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnZhbHVlID0gZGF0ZS5nZXRTZWNvbmRzKCkgKyBkYXRlLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMDtcbiAgfSxcblxuICBidWlsZF9jYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgdGltZXIgPSB0aGlzLnRpbWVyO1xuICAgIHZhciB0aW1lX2Zvcm0gPSB0aGlzO1xuICAgIHN3aXRjaCAoZXZlbnQpIHtcbiAgICAgIGNhc2UgJ3N1Ym1pdCc6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZygnV2lkZ2V0QmFzaWNUaW1lRm9ybS5zdWJtaXQnKTtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cblxuICAgICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBkYXRlLnNldEZ1bGxZZWFyKHRpbWVfZm9ybS55ZWFyX2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGUuc2V0TW9udGgodGltZV9mb3JtLm1vbnRoX2VsZW1lbnQudmFsdWUgLSAxKTtcbiAgICAgICAgICBkYXRlLnNldERhdGUodGltZV9mb3JtLmRheV9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlLnNldEhvdXJzKHRpbWVfZm9ybS5ob3VyX2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGUuc2V0TWludXRlcyh0aW1lX2Zvcm0ubWludXRlX2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIGRhdGUuc2V0U2Vjb25kcyh0aW1lX2Zvcm0uc2Vjb25kX2VsZW1lbnQudmFsdWUpO1xuXG4gICAgICAgICAgdGltZXIuc2V0KGRhdGUuZ2V0VGltZSgpKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFkYWJsZVRpbWVGb3JtO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIHRoZSBjdXJyZW50IHRpbWUgYXMgYSBudW1iZXIuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgY3VycmVudCB0aW1lIGFzIGEgbnVtYmVyLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBzZWUgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlJlYWRhYmxlVGltZUZvcm1cbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRpbWVGb3JtIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSB0aGUgY3VycmVudCB0aW1lLlxuICpcbiAqIFRoZSB0aW1lIGlzIGRpc3BsYXllZCBhcyBhIG51bWJlci4gU2VlXG4gKiB7QGxpbmsgU2Ftb3RyYWNlcy5XaWRnZXRzLlRpbWVGb3JtfSB0byBjb252ZXJ0XG4gKiByYXcgdGltZSAoaW4gbXMgZnJvbSB0aGUgMDEvMDEvMTk3MCkgdG8gYSBodW1hbiByZWFkYWJsZVxuICogZm9ybWF0LlxuICpcbiAqIFRoaXMgd2lkZ2V0IG9ic2VydmVzIGEgU2Ftb3RyYWNlcy5MaWIuVGltZXIgb2JqZWN0LlxuICogV2hlbiB0aGUgdGltZXIgY2hhbmdlcyB0aGUgbmV3IHRpbWUgaXMgZGlzcGxheWVkLlxuICogVGhpcyB3aWRnZXQgYWxzbyBhbGxvdyB0byBjaGFuZ2UgdGhlIHRpbWUgb2YgdGhlIHRpbWVyLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0aHRtbF9pZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UaW1lcn0gdGltZXJcbiAqICAgICBUaW1lciBvYmplY3QgdG8gb2JzZXJ2ZS5cbiAqL1xudmFyIFRpbWVGb3JtID0gZnVuY3Rpb24oaHRtbF9pZCwgdGltZXIpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcblxuICB0aGlzLnRpbWVyID0gdGltZXI7XG4gIHRoaXMudGltZXIub24oJ3RpbWVyOnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcbiAgdGhpcy50aW1lci5vbigndGltZXI6cGxheTp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICB0aGlzLnJlZnJlc2goe2RhdGE6IHRoaXMudGltZXIudGltZX0pO1xufTtcblxuVGltZUZvcm0ucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgcF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdDdXJyZW50IHRpbWU6ICcpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xuXG4gICAgdGhpcy5pbnB1dF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ3RpbWUnKTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMTUpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdGhpcy50aW1lci50aW1lKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dF9lbGVtZW50KTtcblxuICAgIHZhciBzdWJtaXRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgc3VibWl0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3N1Ym1pdCcpO1xuICAgIHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnVXBkYXRlIHRpbWUnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoc3VibWl0X2VsZW1lbnQpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgdGhpcy5idWlsZF9jYWxsYmFjaygnc3VibWl0JykpO1xuXG4gICAgdGhpcy5mb3JtX2VsZW1lbnQuYXBwZW5kQ2hpbGQocF9lbGVtZW50KTtcblxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmZvcm1fZWxlbWVudCk7XG4gIH0sXG5cbiAgcmVmcmVzaDogZnVuY3Rpb24oZSkge1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudC52YWx1ZSA9IGUuZGF0YTtcbiAgfSxcblxuICBidWlsZF9jYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgdGltZXIgPSB0aGlzLnRpbWVyO1xuICAgIHZhciBpbnB1dF9lbGVtZW50ID0gdGhpcy5pbnB1dF9lbGVtZW50O1xuICAgIHN3aXRjaCAoZXZlbnQpIHtcbiAgICAgIGNhc2UgJ3N1Ym1pdCc6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgLy9jb25zb2xlLmxvZygnV2lkZ2V0QmFzaWNUaW1lRm9ybS5zdWJtaXQnKTtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgdGltZXIuc2V0KGlucHV0X2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVGb3JtO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdGltZSBzbGlkZXIuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRpbWUgc2xpZGVyLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLmQzQmFzaWMuVGltZVNsaWRlciBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgdGhlIGN1cnJlbnQgdGltZSBpbiBhIHRlbXBvcmFsIHdpbmRvd1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0ZGl2SWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0gdGltZV93aW5kb3dcbiAqICAgICBUaW1lV2luZG93IG9iamVjdCAtPiByZXByZXNlbnRpbmcgdGhlIHdpZGUgd2luZG93XG4gKiAgICAgKGUuZy4sIHRoZSB3aG9sZSB0cmFjZSlcbiAqIEBwYXJhbSB0aW1lclxuICogICAgIFRpbWVlciBvYmplY3QgLT4gY29udGFpbmluZyB0aGUgY3VycmVudCB0aW1lXG4gKi9cbnZhciBUaW1lU2xpZGVyID0gZnVuY3Rpb24oaHRtbF9pZCwgdGltZV93aW5kb3csIHRpbWVyKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG5cbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1UaW1lU2xpZGVyJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5kcmF3LmJpbmQodGhpcykpO1xuXG4gIHRoaXMudGltZXIgPSB0aW1lcjtcbiAgdGhpcy50aW1lci5vbigndGltZXI6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRpbWVyLm9uKCd0aW1lcjpwbGF5OnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLnRpbWVfd2luZG93ID0gdGltZV93aW5kb3c7XG4gIHRoaXMudGltZV93aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcblxuICAvLyB1cGRhdGUgc2xpZGVyIHN0eWxlXG4gIHRoaXMuc2xpZGVyX29mZnNldCA9IDA7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICAvLyB1cGRhdGUgc2xpZGVyJ3MgcG9zaXRpb25cbiAgdGhpcy5kcmF3KCk7XG5cbn07XG5cblRpbWVTbGlkZXIucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgLy8gY3JlYXRlIHRoZSBzbGlkZXJcbiAgICB0aGlzLnNsaWRlcl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuc2xpZGVyX2VsZW1lbnQpO1xuXG4gICAgLy8gaGFuZCBtYWRlIGRyYWcmZHJvcFxuICAgIHZhciB3aWRnZXQgPSB0aGlzO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91cignY2hhbmdlVGltZU9uRHJhZycsIHRoaXMuc2xpZGVyX2VsZW1lbnQsIHtcbiAgICAgIG9uVXBDYWxsYmFjazogZnVuY3Rpb24oZGVsdGFfeCkge1xuICAgICAgICB2YXIgbmV3X3RpbWUgPSB3aWRnZXQudGltZXIudGltZSArIGRlbHRhX3ggKiB3aWRnZXQudGltZV93aW5kb3cuZ2V0X3dpZHRoKCkgLyB3aWRnZXQuZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgd2lkZ2V0LnRpbWVyLnNldChuZXdfdGltZSk7XG4gICAgICB9LFxuICAgICAgb25Nb3ZlQ2FsbGJhY2s6IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgICB2YXIgb2Zmc2V0ID0gd2lkZ2V0LnNsaWRlcl9vZmZzZXQgKyBvZmZzZXQ7XG4gICAgICAgIHdpZGdldC5zbGlkZXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2xlZnQ6ICcgKyBvZmZzZXQgKyAncHg7Jyk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2xpZGVyX29mZnNldCA9ICh0aGlzLnRpbWVyLnRpbWUgLSB0aGlzLnRpbWVfd2luZG93LnN0YXJ0KSAqIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMudGltZV93aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy5zbGlkZXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2xlZnQ6JyArIHRoaXMuc2xpZGVyX29mZnNldCArICdweDsgZGlzcGxheTogYmxvY2s7Jyk7XG4gIH0sXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZVNsaWRlcjtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRyYWNlIHdoZXJlIG9ic2VscyBhcmUgZGlzcGxheWVkIGFzIGltYWdlcy5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdHJhY2Ugd2hlcmUgb2JzZWxzIGFyZSBkaXNwbGF5ZWQgYXMgaW1hZ2VzXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQHJlcXVpcmVzIGQzLmpzIGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vZDNqcy5vcmdcIj5kM2pzLm9yZzwvYT4pXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zfFRyYWNlRGlzcGxheUljb25zfSB3aWRnZXRcbiAqIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSB0cmFjZXMgd2l0aCBpbWFnZXMuIFRoaXMgd2lkZ2V0IHVzZXNcbiAqIGQzLmpzIHRvIGRpc3BsYXkgdHJhY2VzIGFzIGltYWdlcyBpbiBhIFNWRyBpbWFnZS5cbiAqIFRoZSBkZWZhdWx0IHNldHRpbmdzIGFyZSBzZXQgdXAgdG8gdmlzdWFsaXNlIDE2eDE2IHBpeGVsc1xuICogaWNvbnMuIElmIG5vIHVybCBpcyBkZWZpbmVkIChzZWUgb3B0aW9ucyksIGEgcXVlc3Rpb25tYXJrXG4gKiBpY29uIHdpbGwgYmUgZGlzcGxheWVkIGJ5IGRlZmF1bHQgZm9yIGVhY2ggb2JzZWwuXG4gKlxuICogTm90ZSB0aGF0IGNsaWNraW5nIG9uIGFuIG9ic2VsIHdpbGwgdHJpZ2dlciBhXG4gKiB7QGxpbmsgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zI3VpOmNsaWNrOm9ic2VsfHVpOmNsaWNrOm9ic2VsfVxuICogZXZlbnQuXG4gKlxuICogVHV0b3JpYWxzIHtAdHV0b3JpYWwgdHV0bzEuMV90cmFjZV92aXN1YWxpc2F0aW9ufSxcbiAqIHtAdHV0b3JpYWwgdHV0bzEuMl9hZGRpbmdfd2lkZ2V0c30sIGFuZFxuICoge0B0dXRvcmlhbCB0dXRvMS4zX3Zpc3VhbGlzYXRpb25fcGVyc29uYWxpc2F0aW9ufSBpbGx1c3RyYXRlc1xuICogaW4gbW9yZSBkZXRhaWxzIGhvdyB0byB1c2UgdGhpcyBjbGFzcy5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0ZGl2SWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1RyYWNlfVx0dHJhY2VcbiAqICAgICBUcmFjZSBvYmplY3QgdG8gZGlzcGxheVxuICogQHBhcmFtIHtUaW1lV2luZG93fSB0aW1lX3dpbmRvd1xuICogICAgIFRpbWVXaW5kb3cgb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgdGltZSBmcmFtZVxuICogICAgIGJlaW5nIGN1cnJlbnRseSBkaXNwbGF5ZWQuXG4gKlxuICogQHBhcmFtIHtWaXN1Q29uZmlnfSBbb3B0aW9uc11cbiAqICAgICBPYmplY3QgZGV0ZXJtaW5pbmcgaG93IHRvIGRpc3BsYXkgdGhlIGljb25zXG4gKiAgICAgKE9wdGlvbmFsKS4gQWxsIHRoZSBvcHRpb25zIGZpZWxkIGNhbiBiZSBlaXRoZXJcbiAqICAgICBhIHZhbHVlIG9yIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBieVxuICogICAgIGQzLmpzLiBUaGUgZnVuY3Rpb24gd2lsbCByZWNlaXZlIGFzIHRoZSBmaXJzdFxuICogICAgIGFyZ3VtZW50IHRoZSBPYnNlbCB0byBkaXNwbGF5IGFuZCBzaG91bGQgcmV0dXJuXG4gKiAgICAgdGhlIGNhbGN1bGF0ZWQgdmFsdWUuXG4gKiAgICAgSWYgYSBmdW5jdGlvbiBpcyBkZWZpbmVkIGFzIGFuIGFyZ3VtZW50LCBpdCB3aWxsXG4gKiAgICAgYmUgYmluZGVkIHRvIHRoZSBUcmFjZURpc3BsYXlJY29ucyBpbnN0YW5jZS5cbiAqICAgICBUaGlzIG1lYW5zIHRoYXQgeW91IGNhbiBjYWxsIGFueSBtZXRob2Qgb2YgdGhlXG4gKiAgICAgVHJhY2VEaXNwbGF5SWNvbnMgaW5zdGFuY2UgdG8gaGVscCBjYWxjdWxhdGVcbiAqICAgICB0aGUgeCBwb3NpdGlvbiBvciB5IHBvc2l0aW9uIG9mIGFuIGljb24uIFRoaXNcbiAqICAgICBtYWtlcyBpdCBlYXN5IHRvIGRlZmluZSB2YXJpb3VzIHR5cGVzIG9mIGJlaGF2aW91cnMuXG4gKiAgICAgUmVsZXZhbnQgbWV0aG9kcyB0byB1c2UgYXJlOlxuICogICAgIGxpbmsgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zLmNhbGN1bGF0ZV94fVxuICogICAgIFNlZSB0dXRvcmlhbFxuICogICAgIHtAdHV0b3JpYWwgdHV0bzEuM192aXN1YWxpc2F0aW9uX3BlcnNvbmFsaXNhdGlvbn1cbiAqICAgICBmb3IgbW9yZSBkZXRhaWxzIGFuZCBleGFtcGxlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIG9wdGlvbnMgPSB7XG4gKiAgICAgeTogMjAsXG4gKiAgICAgd2lkdGg6IDMyLFxuICogICAgIGhlaWdodDogMzIsXG4gKiAgICAgdXJsOiBmdW5jdGlvbihvYnNlbCkge1xuICogICAgICAgICBzd2l0Y2gob2JzZWwudHlwZSkge1xuICogICAgICAgICAgICAgY2FzZSAnY2xpY2snOlxuICogICAgICAgICAgICAgICAgIHJldHVybiAnaW1hZ2VzL2NsaWNrLnBuZyc7XG4gKiAgICAgICAgICAgICBjYXNlICdmb2N1cyc6XG4gKiAgICAgICAgICAgICAgICAgcmV0dXJuICdpbWFnZXMvZm9jdXMucG5nJztcbiAqICAgICAgICAgICAgIGRlZmF1bHQ6XG4gKiAgICAgICAgICAgICAgICAgcmV0dXJuICdpbWFnZXMvZGVmYXVsdC5wbmcnO1xuICogICAgICAgICB9XG4gKiAgICAgfVxuICogfTtcbiAqL1xudmFyIFRyYWNlRGlzcGxheUljb25zID0gZnVuY3Rpb24oZGl2SWQsIHRyYWNlLCB0aW1lX3dpbmRvdywgb3B0aW9ucykge1xuXG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgZGl2SWQpO1xuXG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VEaXNwbGF5SWNvbnMnKTtcbiAgJCh3aW5kb3cpLnJlc2l6ZSh0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLnRyYWNlID0gdHJhY2U7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTpyZW1vdmVfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzLm9ic2VsX3JlZHJhdy5iaW5kKHRoaXMpKTtcblxuICB0aGlzLndpbmRvdyA9IHRpbWVfd2luZG93O1xuICB0aGlzLndpbmRvdy5vbigndHc6dXBkYXRlJywgdGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93Lm9uKCd0dzp0cmFuc2xhdGUnLCB0aGlzLnRyYW5zbGF0ZV94LmJpbmQodGhpcykpO1xuXG4gIC8vXHR0aGlzLm9ic2VsX3NlbGVjdG9yID0gb2JzZWxfc2VsZWN0b3I7XG4gIC8vXHR0aGlzLndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCcnLHRoaXMuLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0O1xuICAvL3RoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcblxuXG4gIC8qKlxuICBcdCAqIFZpc3VDb25maWcgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuICBcdCAqIHtAbGluayBTYW1vdHJhY2VzLlVJLldpZGdldHMuVHJhY2VEaXNwbGF5SWNvbnMuVmlzdUNvbmZpZ31cbiAgXHQgKiBvYmplY3QuXG4gIFx0ICogQHR5cGVkZWYgVmlzdUNvbmZpZ1xuICBcdCAqIEBzZWUgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zLlZpc3VDb25maWdcbiAgXHQgKi9cbiAgLyoqXG4gIFx0ICogQHR5cGVkZWYgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zLlZpc3VDb25maWdcbiAgXHQgKiBAcHJvcGVydHkgeyhudW1iZXJ8ZnVuY3Rpb24pfVx0W3hdXG4gIFx0ICogICAgIFggY29vcmRpbmF0ZXMgb2YgdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGVcbiAgXHQgKiAgICAgaW1hZ2UgKGRlZmF1bHQ6IDxjb2RlPmZ1bmN0aW9uKG8pIHtcbiAgXHQgKiAgICAgICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZV94KG8udGltZXN0YW1wKSAtIDg7XG4gIFx0ICogICAgIH0pPC9jb2RlPilcbiAgXHQgKiBAcHJvcGVydHkgeyhudW1iZXJ8ZnVuY3Rpb24pfVx0W3k9MTddXG4gIFx0ICogICAgIFkgY29vcmRpbmF0ZXMgb2YgdGhlIHRvcC1sZWZ0IGNvcm5lciBvZiB0aGVcbiAgXHQgKiAgICAgaW1hZ2VcbiAgXHQgKiBAcHJvcGVydHkgeyhudW1iZXJ8ZnVuY3Rpb24pfVx0W3dpZHRoPTE2XVxuICBcdCAqICAgICBXaWR0aCBvZiB0aGUgaW1hZ2VcbiAgXHQgKiBAcHJvcGVydHkgeyhudW1iZXJ8ZnVuY3Rpb24pfVx0W2hlaWdodD0xNl1cbiAgXHQgKiAgICAgSGVpZ2h0IG9mIHRoZSBpbWFnZVxuICBcdCAqIEBwcm9wZXJ0eSB7KHN0cmluZ3xmdW5jdGlvbil9XHRbdXJsPWEgcXVlc3Rpb25tYXJrIGRhdGF1cmwgc3RyaW5nXVxuICBcdCAqICAgICBVcmwgb2YgdGhlIGltYWdlIHRvIGRpc3BsYXlcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBPYmplY3QgZGV0ZXJtaW5pbmcgaG93IHRvIGRpc3BsYXkgdGhlIGljb25zXG4gIFx0ICogKE9wdGlvbmFsKS4gQWxsIHRoZSBvcHRpb25zIGZpZWxkIGNhbiBiZSBlaXRoZXJcbiAgXHQgKiBhIHZhbHVlIG9yIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGNhbGxlZCBieVxuICBcdCAqIGQzLmpzLiBUaGUgZnVuY3Rpb24gd2lsbCByZWNlaXZlIGFzIHRoZSBmaXJzdFxuICBcdCAqIGFyZ3VtZW50IHRoZSBPYnNlbCB0byBkaXNwbGF5IGFuZCBzaG91bGQgcmV0dXJuXG4gIFx0ICogdGhlIGNhbGN1bGF0ZWQgdmFsdWUuXG4gIFx0ICogSWYgYSBmdW5jdGlvbiBpcyBkZWZpbmVkIGFzIGFuIGFyZ3VtZW50LCBpdCB3aWxsXG4gIFx0ICogYmUgYmluZGVkIHRvIHRoZSBUcmFjZURpc3BsYXlJY29ucyBpbnN0YW5jZS5cbiAgXHQgKiBUaGlzIG1lYW5zIHRoYXQgeW91IGNhbiBjYWxsIGFueSBtZXRob2Qgb2YgdGhlXG4gIFx0ICogVHJhY2VEaXNwbGF5SWNvbnMgaW5zdGFuY2UgdG8gaGVscCBjYWxjdWxhdGVcbiAgXHQgKiB0aGUgeCBwb3NpdGlvbiBvciB5IHBvc2l0aW9uIG9mIGFuIGljb24uIFRoaXNcbiAgXHQgKiBtYWtlcyBpdCBlYXN5IHRvIGRlZmluZSB2YXJpb3VzIHR5cGVzIG9mIGJlaGF2aW91cnMuXG4gIFx0ICogUmVsZXZhbnQgbWV0aG9kcyB0byB1c2UgYXJlOlxuICBcdCAqIGxpbmsgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zLmNhbGN1bGF0ZV94fVxuICBcdCAqIFNlZSB0dXRvcmlhbFxuICBcdCAqIHtAdHV0b3JpYWwgdHV0bzEuM192aXN1YWxpc2F0aW9uX3BlcnNvbmFsaXNhdGlvbn1cbiAgXHQgKiBmb3IgbW9yZSBkZXRhaWxzIGFuZCBleGFtcGxlcy5cbiAgXHQgKi9cbiAgLy8gY3JlYXRlIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB2YWx1ZSBvciBmdW5jdGlvblxuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuICB2YXIgYmluZF9mdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbF9vcl9mdW4pIHtcbiAgICBpZiAodmFsX29yX2Z1biBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bi5iaW5kKHRoaXNfd2lkZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW47XG4gICAgfVxuICB9O1xuXG4gIHRoaXMub3B0aW9ucyA9IHt9O1xuICB0aGlzLm9wdGlvbnMueCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy54IHx8IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKSAtIDg7XG4gIH0pO1xuICB0aGlzLnN0eWxlc2hlZXQgPSBvcHRpb25zIDtcbiAgLy90aGlzLm9wdGlvbnMueSA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy55IHx8IDE3KTtcbiAgLy90aGlzLm9wdGlvbnMud2lkdGggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMud2lkdGggfHwgMTYpO1xuICAvL3RoaXMub3B0aW9ucy5oZWlnaHQgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMuaGVpZ2h0IHx8IDE2KTtcbiAgLy90aGlzLm9wdGlvbnMudXJsID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnVybCB8fCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFHN0FBQUJ1d0JIblU0TlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBS3NTVVJCVkRpTnJaTkxhRk5wRk1kLzMzZnZUYTV0WXB1cTB5YXRGV3VnUmhFWHc5QXVoSkVaQkNraXFKV0NJRXJyeHAyNDFDNkw2NjUwTS9XQm93dW5veUNEQ2pLckdZWjBJYml3eGtkVWJHeWFQbWdTbThkOWYyNU1iWFVsekg5NXp2LzhPT2R3amxCS3NWYWpVMWtFdEppYXZOQnNhS2NCcXE1LzNmS0RTd3JLWTMzSmRYN1JBSXhPWlFHTTNiSEl5bUN5UFpoWnFUOHAyZDRzUUd0WTcreU9idmh4TWpzdnA0dVZLT0EyUUVJcHhlaFVGbDJJdnVGVVozclpjdS8rOVg3UldxZzdKeHcvUUFGaFRkTFJGSm9ZNk40U2F6T05vMWN6cy8yZVVsTmpmVW4wUmlzbmUrUHA5eXYxOFR2WndybDlpVmIySjJKRVFob0tLTmtlNlVKNTVMZk1CNGFTSGVNbmUrUHBheS95QWtCY1RMOW1hN05wN1l1My9uMWxPamRROHdMTzc5M0d6bGd6RmRjall1am9VcEF0MTdqOExJZmpCNXpkdmZYQnYzT2xYM05WeTVTQU9KVktoUDk0TTI5VVhCOEZGR29XRTg5bnVmVGtIUTluRmxFS2VqWnVvTGUxaVlycjgrZmJlZTlVS2hFR2hCNlNZckJvdWRQTHRuc0FRQ25GNzY4S3ExdjJBeEFDNmw3QXN1VUNzR1M1aDR1V094MlNZbEJxUW95VUhXL085Z08rMWk5ZGJmeWNpS0dBL3dvbDNwVHJBTmgrUU5ueDVqUWhSdVEzVlorMVoxT1VnOTJiaVprRy8rU0wzSHU3Z1BmVnpRQklYNm1KbHBBZUQydnJXZHMzbXRoK3dPdFNsVWN6UzFSZGZ6VVgxaVF0SVQzdUt6V2hPNEdhakpuR25jMm1jZitqNHgxdW1KNHVWU2hVYlJTd1VIUFd3ZHZDeHVPWWFSeHdBalVwQVhVams3ZVA5YlRyRVVOYk5mMzBRNVRoWFYwYzZXa25Hdm9TanhnYXgzZTB1emN5ZVJ0UWNxd3ZTYTVxbWFZdUI0YVNIZU1OaUVKZ2FoSjl6V1FSUTJNbzJURnU2bklnVjdYTWRaZDQ4K1ZjLzNDcU0zMG0xWFgzd2N4aThkM0gyc2l0bDNtVUFDa0V5WmFtMjRlMmJUSGJUT1BjMWN4c2Y2UHUvM21tdGZyZWQvNEVTUU5LWEc4VkFDb0FBQUFBU1VWT1JLNUNZSUk9Jyk7XG5cbiAgdGhpcy5kcmF3KCk7XG59O1xuXG5UcmFjZURpc3BsYXlJY29ucy5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuXG4gICAgLy92YXIgZGl2X2VsbXQgPSBkMy5zZWxlY3QoJyMnK3RoaXMuaWQpO1xuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuc3ZnID0gZGl2X2VsbXQuYXBwZW5kKCdzdmcnKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgKHJlZCkgbGluZSByZXByZXNlbnRpbmcgY3VycmVudCB0aW1lXG4gICAgaWYgKHR5cGVvZiAodGhpcy53aW5kb3cudGltZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgJzUwJScpXG4gICAgICAuYXR0cigneTEnLCAnMCUnKVxuICAgICAgLmF0dHIoJ3gyJywgJzUwJScpXG4gICAgICAuYXR0cigneTInLCAnMTAwJScpXG4gICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAuYXR0cignc3Ryb2tlJywgJ3JlZCcpXG4gICAgICAuYXR0cignb3BhY2l0eScsICcwLjMnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuXG4gICAgdGhpcy5zdmdfZ3AgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB0aGlzLnN2Z19zZWxlY3RlZF9vYnNlbCA9IHRoaXMuc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgLmF0dHIoJ3gyJywgJzAnKVxuICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgLmF0dHIoJ3N0cm9rZScsICdibGFjaycpXG4gICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJylcbiAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgLy8gZXZlbnQgbGlzdGVuZXJzXG4gICAgdmFyIHdpZGdldCA9IHRoaXM7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCdjaGFuZ2VUaW1lT25EcmFnJywgdGhpcy5lbGVtZW50LCB7XG4gICAgICBvblVwQ2FsbGJhY2s6IGZ1bmN0aW9uKGRlbHRhX3gpIHtcbiAgICAgICAgdmFyIHRpbWVfZGVsdGEgPSAtZGVsdGFfeCAqIHdpZGdldC53aW5kb3cuZ2V0X3dpZHRoKCkgLyB3aWRnZXQuZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgd2lkZ2V0LnN2Z19ncC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAoLXdpZGdldC50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgICAgICAgd2lkZ2V0LndpbmRvdy50cmFuc2xhdGUodGltZV9kZWx0YSk7XG4gICAgICB9LFxuICAgICAgb25Nb3ZlQ2FsbGJhY2s6IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgICB3aWRnZXQuc3ZnX2dwLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvZmZzZXQgLSB3aWRnZXQudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91cignem9tbU9uU2Nyb2xsJywgdGhpcy5lbGVtZW50LCB7dGltZVdpbmRvdzogdGhpcy53aW5kb3d9KTtcbiAgfSxcblxuXG4gIC8vIFRPRE86IG5lZWRzIHRvIGJlIG5hbWVkIGZvbGxvd2luZyBhIGNvbnZlbnRpb25cbiAgLy8gdG8gYmUgZGVjaWRlZCBvblxuICAvKipcbiAgXHQgKiBDYWxjdWxhdGVzIHRoZSBYIHBvc2l0aW9uIGluIHBpeGVscyBjb3JyZXNwb25kaW5nIHRvXG4gIFx0ICogdGhlIHRpbWUgZ2l2ZW4gaW4gcGFyYW1ldGVyLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIFRpbWUgZm9yIHdoaWNoIHRvIHNlZWsgdGhlIGNvcnJlc3BvbmRpbmcgeCBwYXJhbWV0ZXJcbiAgXHQgKi9cbiAgY2FsY3VsYXRlX3g6IGZ1bmN0aW9uKHRpbWUpIHtcblxuICAgIHZhciB4ID0gKHRpbWUgLSB0aGlzLndpbmRvdy5zdGFydCkgKiB0aGlzLnNjYWxlX3ggKyB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQ7XG4gICAgcmV0dXJuIHg7XG4gIH0sXG4gIHRyYW5zbGF0ZV94OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHRpbWVfZGVsdGEgPSBlLmRhdGE7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ICs9IHRpbWVfZGVsdGEgKiB0aGlzLnNjYWxlX3g7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKC10aGlzLnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICB9LFxuXG4gIHJlZnJlc2hfeDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3knKSk7IH0pO1xuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZSkge1xuICAgICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInRyYWNlOnVwZGF0ZVwiOlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7IC8vIGRvIG5vdCB3YW50IHRvIHRyaWdnZXIgdGhlIHJlZnJlc2hpbmcgb2YgbGlzdF9vYnNlbHMoKS4uLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuZXhpdCgpXG4gICAgLnJlbW92ZSgpO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZCgnaW1hZ2UnKVxuICAgIC5hdHRyKCdjbGFzcycsICdTYW1vdHJhY2VzLW9ic2VsJylcbiAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3knKSk7IH0pXG4gICAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3dpZHRoJykpOyB9KVxuICAgIC5hdHRyKCdoZWlnaHQnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnaGVpZ2h0JykpOyB9KVxuICAgIC5hdHRyKCd4bGluazpocmVmJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2ljb24nKSk7IH0pO1xuICAgIC8vIFN0b3Jpbmcgb2JzZWwgZGF0YSB3aXRoIGpRdWVyeSBmb3IgYWNjZXNzaWJpbGl0eSBmcm9tXG4gICAgLy8gZXZlbnRzIGRlZmluZWQgYnkgdXNlcnMgd2l0aCBqUXVlcnlcbiAgICAkKCdpbWFnZScsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBvYnNlbF9yZWRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgb2JzID0gZS5kYXRhO1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHZhciBzZWwgPSB0aGlzLmQzT2JzZWxzKClcblx0XHRcdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAvL1x0XHRcdFx0Y29uc29sZS5sb2coJ2RhdGE6aWQsb2JzZWxfZWRpdF9pZCcsaWQsb2JzLmdldF9pZCgpLGlkID09IG9icy5nZXRfaWQoKSk7XG4gIHJldHVybiBvLmdldF9pZCgpID09IG9icy5nZXRfaWQoKTtcblx0XHRcdH0pXG5cdFx0XHQuZGF0dW0ob2JzKVxuXHRcdFx0LmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcblx0XHRcdC5hdHRyKCd5JywgIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd5JykpOyB9KVxuXHRcdFx0LmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3dpZHRoJykpOyB9KVxuXHRcdFx0LmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdoZWlnaHQnKSk7fSlcblx0XHRcdC5hdHRyKCd4bGluazpocmVmJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2ljb24nKSk7IH0pO1xuICB9LFxuXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAuc2VsZWN0QWxsKCdjaXJjbGUsaW1hZ2UscmVjdCcpXG4gICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pOyAvLyBUT0RPOiBib2d1ZSBpbiBjYXNlIG5vIElEIGV4aXN0cyAtPiBtaWdodCBoYXBwZW4gd2l0aCBLVEJTIHRyYWNlcyBhbmQgbmV3IG9ic2Vsc1xuICB9LFxuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5SWNvbnM7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG52YXIgVHJhY2VEaXNwbGF5SWNvbnNGaXggPSBmdW5jdGlvbihkaXZJZCwgdHJhY2VJTklUSUEsIHRpbWVfd2luZG93LCB0aW1lX3dpbmRvd19ab29tLCBvcHRpb25zKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBkaXZJZCk7XG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VEaXNwbGF5SWNvbnMnKTtcbiAgJCh3aW5kb3cpLnJlc2l6ZSh0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZSA9IHRyYWNlSU5JVElBO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cgPSB0aW1lX3dpbmRvdztcbiAgdGhpcy53aW5kb3dab29tID0gdGltZV93aW5kb3dfWm9vbTtcbiAgLy90aGlzLndpbmRvdy5vbigndHc6dXBkYXRlJyx0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgLy90aGlzLndpbmRvdy5vbigndHc6dHJhbnNsYXRlJyx0aGlzLnRyYW5zbGF0ZV94LmJpbmQodGhpcykpO1xuICB0aGlzLmluaXRfRE9NKCk7XG4gIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDtcbiAgdmFyIHRoaXNfd2lkZ2V0ID0gdGhpcztcbiAgdmFyIGJpbmRfZnVuY3Rpb24gPSBmdW5jdGlvbih2YWxfb3JfZnVuKSB7XG4gICAgaWYgKHZhbF9vcl9mdW4gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW4uYmluZCh0aGlzX3dpZGdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWxfb3JfZnVuO1xuICAgIH1cbiAgfTtcblxuLyogIHRoaXMub3B0aW9ucy55ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnkgfHwgMTcpO1xuICB0aGlzLm9wdGlvbnMud2lkdGggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMud2lkdGggfHwgMTYpO1xuICB0aGlzLm9wdGlvbnMuaGVpZ2h0ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLmhlaWdodCB8fCAxNik7XG4gIHRoaXMub3B0aW9ucy51cmwgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMudXJsIHx8ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQUc3QUFBQnV3QkhuVTROUUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFLc1NVUkJWRGlOclpOTGFGTnBGTWQvMzNmdlRhNXRZcHVxMHlhdEZXdWdSaEVYdzlBdWhKRVpCQ2tpcUpXQ0lFcnJ4cDI0MUM2TDY2NTBNL1dCb3d1bm95Q0RDaktyR1laMEliaXd4a2RVYkd5YVBtZ1NtOGQ5ZjI1TWJYVWx6SDk1enYvOE9PZHdqbEJLc1ZhalUxa0V0Smlhdk5Cc2FLY0JxcTUvM2ZLRFN3cktZMzNKZFg3UkFJeE9aUUdNM2JISXltQ3lQWmhacVQ4cDJkNHNRR3RZNyt5T2J2aHhNanN2cDR1VktPQTJRRUlweGVoVUZsMkl2dUZVWjNyWmN1Lys5WDdSV3FnN0p4dy9RQUZoVGRMUkZKb1k2TjRTYXpPTm8xY3pzLzJlVWxOamZVbjBSaXNuZStQcDl5djE4VHZad3JsOWlWYjJKMkpFUWhvS0tOa2U2VUo1NUxmTUI0YVNIZU1uZStQcGF5L3lBa0JjVEw5bWE3TnA3WXUzL24xbE9qZFE4d0xPNzkzR3psZ3pGZGNqWXVqb1VwQXQxN2o4TElmakI1emR2ZlhCdjNPbFgzTlZ5NVNBT0pWS2hQOTRNMjlVWEI4RkZHb1dFODludWZUa0hROW5GbEVLZWpadW9MZTFpWXJyOCtmYmVlOVVLaEVHaEI2U1lyQm91ZFBMdG5zQVFDbkY3NjhLcTF2MkF4QUM2bDdBc3VVQ3NHUzVoNHVXT3gyU1lsQnFRb3lVSFcvTzlnTysxaTlkYmZ5Y2lLR0Evd29sM3BUckFOaCtRTm54NWpRaFJ1UTNWWisxWjFPVWc5MmJpWmtHLytTTDNIdTdnUGZWelFCSVg2bUpscEFlRDJ2cldkczNtdGgrd090U2xVY3pTMVJkZnpVWDFpUXRJVDN1S3pXaE80R2FqSm5HbmMybWNmK2o0eDF1bUo0dVZTaFViUlN3VUhQV3dkdkN4dU9ZYVJ4d0FqVXBBWFVqazdlUDliVHJFVU5iTmYzMFE1VGhYVjBjNldrbkd2b1NqeGdheDNlMHV6Y3llUnRRY3F3dlNhNXFtYVl1QjRhU0hlTU5pRUpnYWhKOXpXUVJRMk1vMlRGdTZuSWdWN1hNZFpkNDgrVmMvM0NxTTMwbTFYWDN3Y3hpOGQzSDJzaXRsM21VQUNrRXlaYW0yNGUyYlRIYlRPUGMxY3hzZjZQdS8zbW10ZnJlZC80RVNRTktYRzhWQUNvQUFBQUFTVVZPUks1Q1lJST0nKTtcbiAgKi9cblxuICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgdGhpcy5vcHRpb25zLnggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueCB8fCBmdW5jdGlvbihvKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlX3goby5nZXRfYmVnaW4oKSkgLSA4O1xuICB9KTtcbiAgdGhpcy5zdHlsZXNoZWV0ID0gb3B0aW9ucyA7XG4gIHRoaXMuZHJhdygpO1xufTtcblxuVHJhY2VEaXNwbGF5SWNvbnNGaXgucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGRpdl9lbG10ID0gZDMuc2VsZWN0KHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5zdmcgPSBkaXZfZWxtdC5hcHBlbmQoJ3N2ZycpO1xuXG4gICAgLy8gY3JlYXRlIHRoZSAocmVkKSBsaW5lIHJlcHJlc2VudGluZyBjdXJyZW50IHRpbWVcbiAgICBpZiAodHlwZW9mICh0aGlzLndpbmRvdy50aW1lcikgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0cigneDEnLCAnNTAlJylcbiAgICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgICAuYXR0cigneDInLCAnNTAlJylcbiAgICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgIC5hdHRyKCdzdHJva2UnLCAncmVkJylcbiAgICAgIC5hdHRyKCdvcGFjaXR5JywgJzAuMycpO1xuICAgIH1cblxuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdmFyIHggPSBkMy50aW1lLnNjYWxlKCkgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAvLyAuZG9tYWluKFtuZXcgRGF0ZSgyMDE0LCA0LCAxKSwgbmV3IERhdGUoMjAxNCwgNCwgMTUpIC0gMV0pXG4gICAgICAuZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSlcbiAgICAgIC5yYW5nZShbMCwgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXSk7XG4gICAgdGhpcy5zdmdfZ3AgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHRoaXMuc3ZnX3NlbGVjdGVkX29ic2VsID0gdGhpcy5zdmcuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyKCd4MScsICcwJylcbiAgICAgIC5hdHRyKCd5MScsICcwJScpXG4gICAgICAuYXR0cigneDInLCAnMCcpXG4gICAgICAuYXR0cigneTInLCAnMTAwJScpXG4gICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAuYXR0cignc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAgIC5hdHRyKCdvcGFjaXR5JywgJzAuMycpXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJylcbiAgICAgIC5zdHlsZSgnZGlzcGxheScsICdub25lJyk7XG4gICAgdGhpcy5hZGRicnVzaCgpO1xuICB9LFxuICBkM09ic2VsczogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuc3ZnX2dwXG4gICAgICAuc2VsZWN0QWxsKCdjaXJjbGUsaW1hZ2UscmVjdCcpXG4gICAgICAvLyBUT0RPOiBBVFRFTlRJT04hIFdBUk5JTkchIG9ic2VscyBNVVNUIGhhdmUgYSBmaWVsZCBpZCAtPiB1c2VkIGFzIGEga2V5LlxuICAgICAgLy8uZGF0YSh0aGlzLmRhdGEpOyAvLyxmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pO1xuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pOyAvLyBUT0RPOiBib2d1ZSBpbiBjYXNlIG5vIElEIGV4aXN0cyAtPiBtaWdodCBoYXBwZW4gd2l0aCBLVEJTIHRyYWNlcyBhbmQgbmV3IG9ic2Vsc1xuICB9LFxuICBjYWxjdWxhdGVfeDogZnVuY3Rpb24odGltZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiAodGltZSAtIHRoaXMud2luZG93LnN0YXJ0KSAqIHRoaXMuc2NhbGVfeCArIHRoaXMudHJhbnNsYXRlX29mZnNldDtcbiAgfSxcbiAgdHJhbnNsYXRlX3g6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBjb25zb2xlLmxvZyAoXCJ0cmFuc2xhdGVcIik7XG4gICAgdmFyIHRpbWVfZGVsdGEgPSBlLmRhdGE7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ICs9IHRpbWVfZGVsdGEgKiB0aGlzLnNjYWxlX3g7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKC10aGlzLnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICB9LFxuICBhZGRicnVzaDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG1hcmdpbiA9IHt0b3A6IDIwMCwgcmlnaHQ6IDQwLCBib3R0b206IDIwMCwgbGVmdDogNDB9LFxuICAgICAgaGVpZ2h0ID0gNTAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gICAgdmFyIHggPSBkMy50aW1lLnNjYWxlKClcbiAgICAuZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSlcbiAgICAucmFuZ2UoWzAsIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aF0pO1xuXG4gICAgdmFyIGJydXNoZW5kZWQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBleHRlbmQwID0gd2lkZ2V0LmJydXNoUC5leHRlbnQoKTtcbiAgICAgIHdpZGdldC53aW5kb3dab29tLnNldF9zdGFydCAobmV3IERhdGUoZXh0ZW5kMFswXSkuZ2V0VGltZSgpKTtcbiAgICAgIHdpZGdldC53aW5kb3dab29tLnNldF9lbmQgKG5ldyBEYXRlKGV4dGVuZDBbMV0pLmdldFRpbWUoKSk7XG4gICAgfTtcblxuICAgIHZhciBicnVzaCA9IGQzLnN2Zy5icnVzaCgpXG4gICAgICAueCh4KVxuICAgICAgLm9uKFwiYnJ1c2hlbmRcIiwgYnJ1c2hlbmRlZCk7XG4gICAgdGhpcy5icnVzaFAgPSBicnVzaDtcbiAgICB0aGlzLmdCcnVzaCA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIilcbiAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJicnVzaFwiKVxuICAgICAgLmF0dHIoJ2lkJywgJ2JydXNoJylcbiAgICAgIC5jYWxsKGJydXNoKVxuICAgICAgLmF0dHIoXCJ3aWR0aFwiLCBcIjE4NDBcIik7XG4gICAgdGhpcy5nQnJ1c2guc2VsZWN0QWxsKFwicmVjdFwiKVxuICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgaGVpZ2h0KTtcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcztcbiAgfSxcbiAgZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmIChlKSB7XG4gICAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgICBjYXNlIFwidHJhY2U6dXBkYXRlXCI6XG4gICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcblxuICAgICAgICAvL3RoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHModGhpcy53aW5kb3cuc3RhcnQsdGhpcy53aW5kb3cuZW5kKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDsgLy8gZG8gbm90IHdhbnQgdG8gdHJpZ2dlciB0aGUgcmVmcmVzaGluZyBvZiBsaXN0X29ic2VscygpLi4uXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAgIC5leGl0KClcbiAgICAgIC5yZW1vdmUoKTtcbiAgICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ2ltYWdlJylcbiAgICAgIC5hdHRyKCdjbGFzcycsICdTYW1vdHJhY2VzLW9ic2VsJylcbiAgICAgIC5hdHRyKCd4JywgdGhpcy5vcHRpb25zLngpXG4gICAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd5JykpOyB9KVxuICAgICAgLmF0dHIoJ3dpZHRoJywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3dpZHRoJykpOyB9KVxuICAgICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdoZWlnaHQnKSk7IH0pXG4gICAgICAuYXR0cigneGxpbms6aHJlZicsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdpY29uJykpOyB9KTtcbiAgICAvLyBTdG9yaW5nIG9ic2VsIGRhdGEgd2l0aCBqUXVlcnkgZm9yIGFjY2Vzc2liaWxpdHkgZnJvbVxuICAgIC8vIGV2ZW50cyBkZWZpbmVkIGJ5IHVzZXJzIHdpdGggalF1ZXJ5XG4gICAgJCgnaW1hZ2UnLCB0aGlzLmVsZW1lbnQpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICQuZGF0YShlbCwge1xuICAgICAgICAnU2Ftb3RyYWNlcy10eXBlJzogJ29ic2VsJyxcbiAgICAgICAgJ1NhbW90cmFjZXMtZGF0YSc6IGQzLnNlbGVjdChlbCkuZGF0dW0oKVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgfSxcbiAgcmVmcmVzaF94OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHRoaXMuc3ZnX2dwLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgIC5hdHRyKCd5JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ3knKSk7IH0pO1xuXG4gICAgdmFyIGYgPSB0aGlzLmVsZW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImJydXNoXCIpO1xuICAgIGYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChmKTtcbiAgICB0aGlzLmFkZGJydXNoKCk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlRGlzcGxheUljb25zRml4O1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxudmFyIFRyYWNlRGlzcGxheUljb25zWm9vbSA9IGZ1bmN0aW9uKGRpdklkLCB0cmFjZSwgdGltZV93aW5kb3csIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgZGl2SWQpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVRyYWNlRGlzcGxheUljb25zJyk7XG4gIC8vJCh3aW5kb3cpLnJlc2l6ZSh0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cgPSB0aW1lX3dpbmRvdztcbiAgdGhpcy53aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICAvL3RoaXMud2luZG93Lm9uKCd0dzp0cmFuc2xhdGUnLHRoaXMudHJhbnNsYXRlX3guYmluZCh0aGlzKSk7XG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgLy8gdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2Vscyh0aW1lX3dpbmRvdy5zdGFydCx0aW1lX3dpbmRvdy5lbmQpO1xuICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7XG4gIHZhciB0aGlzX3dpZGdldCA9IHRoaXM7XG4gIHZhciBiaW5kX2Z1bmN0aW9uID0gZnVuY3Rpb24odmFsX29yX2Z1bikge1xuICAgIGlmICh2YWxfb3JfZnVuIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIHJldHVybiB2YWxfb3JfZnVuLmJpbmQodGhpc193aWRnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bjtcbiAgICB9XG4gIH07XG4gIC8qdGhpcy5vcHRpb25zLnggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueCB8fCBmdW5jdGlvbihvKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlX3goby5nZXRfYmVnaW4oKSkgLSA4O1xuICB9KTtcbiAgdGhpcy5vcHRpb25zLnkgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueSB8fCAxNyk7XG4gIHRoaXMub3B0aW9ucy53aWR0aCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy53aWR0aCB8fCAxNik7XG4gIHRoaXMub3B0aW9ucy5oZWlnaHQgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMuaGVpZ2h0IHx8IDE2KTtcbiAgdGhpcy5vcHRpb25zLnVybCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy51cmwgfHwgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBRzdBQUFCdXdCSG5VNE5RQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUtzU1VSQlZEaU5yWk5MYUZOcEZNZC8zM2Z2VGE1dFlwdXEweWF0Rld1Z1JoRVh3OUF1aEpFWkJDa2lxSldDSUVycnhwMjQxQzZMNjY1ME0vV0Jvd3Vub3lDRENqS3JHWVowSWJpd3hrZFViR3lhUG1nU204ZDlmMjVNYlhVbHpIOTV6di84T09kd2psQktzVmFqVTFrRXRKaWF2TkJzYUtjQnFxNS8zZktEU3dyS1kzM0pkWDdSQUl4T1pRR00zYkhJeW1DeVBaaFpxVDhwMmQ0c1FHdFk3K3lPYnZoeE1qc3ZwNHVWS09BMlFFSXB4ZWhVRmwySXZ1RlVaM3JaY3UvKzlYN1JXcWc3Snh3L1FBRmhUZExSRkpvWTZONFNhek9ObzFjenMvMmVVbE5qZlVuMFJpc25lK1BwOXl2MThUdlp3cmw5aVZiMkoySkVRaG9LS05rZTZVSjU1TGZNQjRhU0hlTW5lK1BwYXkveUFrQmNUTDltYTdOcDdZdTMvbjFsT2pkUTh3TE83OTNHemxnekZkY2pZdWpvVXBBdDE3ajhMSWZqQjV6ZHZmWEJ2M09sWDNOVnk1U0FPSlZLaFA5NE0yOVVYQjhGRkdvV0U4OW51ZlRrSFE5bkZsRUtlalp1b0xlMWlZcnI4K2ZiZWU5VUtoRUdoQjZTWXJCb3VkUEx0bnNBUUNuRjc2OEtxMXYyQXhBQzZsN0FzdVVDc0dTNWg0dVdPeDJTWWxCcVFveVVIVy9POWdPKzFpOWRiZnljaUtHQS93b2wzcFRyQU5oK1FObng1alFoUnVRM1ZaKzFaMU9VZzkyYmlaa0cvK1NMM0h1N2dQZlZ6UUJJWDZtSmxwQWVEMnZyV2RzM210aCt3T3RTbFVjelMxUmRmelVYMWlRdElUM3VLeldoTzRHYWpKbkduYzJtY2YrajR4MXVtSjR1VlNoVWJSU3dVSFBXd2R2Q3h1T1lhUnh3QWpVcEFYVWprN2VQOWJUckVVTmJOZjMwUTVUaFhWMGM2V2tuR3ZvU2p4Z2F4M2UwdXpjeWVSdFFjcXd2U2E1cW1hWXVCNGFTSGVNTmlFSmdhaEo5eldRUlEyTW8yVEZ1Nm5JZ1Y3WE1kWmQ0OCtWYy8zQ3FNMzBtMVhYM3djeGk4ZDNIMnNpdGwzbVVBQ2tFeVphbTI0ZTJiVEhiVE9QYzFjeHNmNlB1LzNtbXRmcmVkLzRFU1FOS1hHOFZBQ29BQUFBQVNVVk9SSzVDWUlJPScpO1xuXG4gICovXG4gIHRoaXMub3B0aW9ucyA9IHt9O1xuICB0aGlzLm9wdGlvbnMueCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy54IHx8IGZ1bmN0aW9uKG8pIHtcbiAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLmdldF9iZWdpbigpKSAtIDg7XG4gIH0pO1xuICB0aGlzLnN0eWxlc2hlZXQgPSBvcHRpb25zIDtcbiAgdGhpcy5kcmF3KCk7XG5cdH07XG5cblRyYWNlRGlzcGxheUljb25zWm9vbS5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuc3ZnID0gZGl2X2VsbXQuYXBwZW5kKCdzdmcnKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgKHJlZCkgbGluZSByZXByZXNlbnRpbmcgY3VycmVudCB0aW1lXG4gICAgaWYgKHR5cGVvZiAodGhpcy53aW5kb3cudGltZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgJzUwJScpXG4gICAgICAuYXR0cigneTEnLCAnMCUnKVxuICAgICAgLmF0dHIoJ3gyJywgJzUwJScpXG4gICAgICAuYXR0cigneTInLCAnMTAwJScpXG4gICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAuYXR0cignc3Ryb2tlJywgJ3JlZCcpXG4gICAgICAuYXR0cignb3BhY2l0eScsICcwLjMnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHZhciB4ID0gZDMudGltZS5zY2FsZSgpXG4vLyAuZG9tYWluKFtuZXcgRGF0ZSgyMDE0LCA0LCAxKSwgbmV3IERhdGUoMjAxNCwgNCwgMTUpIC0gMV0pXG4uZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSlcbi5yYW5nZShbMCwgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXSk7XG4gICAgdmFyIG1hcmdpbiA9IHt0b3A6IDIwMCwgcmlnaHQ6IDQwLCBib3R0b206IDIwMCwgbGVmdDogNDB9LFxuICAgICBoZWlnaHQgPSA1MDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgICB0aGlzLnN2Z19ncCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG5cdFx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdGhpcy5zdmdfc2VsZWN0ZWRfb2JzZWwgPSB0aGlzLnN2Zy5hcHBlbmQoJ2xpbmUnKVxuICAgIC5hdHRyKCd4MScsICcwJylcbiAgICAuYXR0cigneTEnLCAnMCUnKVxuICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAuYXR0cigneTInLCAnMTAwJScpXG4gICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsICcxcHgnKVxuICAgIC5hdHRyKCdzdHJva2UnLCAnYmxhY2snKVxuICAgIC5hdHRyKCdvcGFjaXR5JywgJzAuMycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpXG4gICAgLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICB9LFxuICBkM09ic2VsczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3ZnX2dwXG4gICAgLnNlbGVjdEFsbCgnY2lyY2xlLGltYWdlLHJlY3QnKVxuICAgIC8vIFRPRE86IEFUVEVOVElPTiEgV0FSTklORyEgb2JzZWxzIE1VU1QgaGF2ZSBhIGZpZWxkIGlkIC0+IHVzZWQgYXMgYSBrZXkuXG4gICAgLy8uZGF0YSh0aGlzLmRhdGEpOyAvLyxmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pO1xuICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcbiAgY2FsY3VsYXRlX3g6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgeCA9ICh0aW1lIC0gdGhpcy53aW5kb3cuc3RhcnQpICogdGhpcy5zY2FsZV94ICsgdGhpcy50cmFuc2xhdGVfb2Zmc2V0O1xuICAgIHJldHVybiB4O1xuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKGUpIHtcblxuICAgIGlmIChlKSB7XG4gICAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgICBjYXNlIFwidHJhY2U6dXBkYXRlXCI6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuXG4gICAgICAgICAgLy90aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKHRoaXMud2luZG93LnN0YXJ0LHRoaXMud2luZG93LmVuZCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0OyAvLyBkbyBub3Qgd2FudCB0byB0cmlnZ2VyIHRoZSByZWZyZXNoaW5nIG9mIGxpc3Rfb2JzZWxzKCkuLi5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmV4aXQoKVxuICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoJ2ltYWdlJylcbiAgICAuYXR0cignY2xhc3MnLCAnU2Ftb3RyYWNlcy1vYnNlbCcpXG4gICAgLmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcbiAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd5JykpOyB9KVxuICAgIC5hdHRyKCd3aWR0aCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd3aWR0aCcpKTsgfSlcbiAgICAuYXR0cignaGVpZ2h0JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2hlaWdodCcpKTsgfSlcbiAgICAuYXR0cigneGxpbms6aHJlZicsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdpY29uJykpOyB9KTtcbiAgICAvLyBTdG9yaW5nIG9ic2VsIGRhdGEgd2l0aCBqUXVlcnkgZm9yIGFjY2Vzc2liaWxpdHkgZnJvbVxuICAgIC8vIGV2ZW50cyBkZWZpbmVkIGJ5IHVzZXJzIHdpdGggalF1ZXJ5XG4gICAgJCgnaW1hZ2UnLCB0aGlzLmVsZW1lbnQpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICQuZGF0YShlbCwge1xuICAgICAgICAnU2Ftb3RyYWNlcy10eXBlJzogJ29ic2VsJyxcbiAgICAgICAgJ1NhbW90cmFjZXMtZGF0YSc6IGQzLnNlbGVjdChlbCkuZGF0dW0oKVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgfSxcbiAgcmVmcmVzaF94OiBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcbiAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd5JykpOyB9KTtcbiAgfSxcblx0XHR9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlRGlzcGxheUljb25zWm9vbTtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRyYWNlLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0cmFjZS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgZDMuanMgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9kM2pzLm9yZ1wiPmQzanMub3JnPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogREVTQ1JJUFRJT04gVE8gQ09NRS4uLi5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0ZGl2SWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVHJhY2V9XHR0cmFjZVxuICogICAgIFRyYWNlIG9iamVjdCB0byBkaXNwbGF5XG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVGltZVdpbmRvd30gdGltZV93aW5kb3dcbiAqICAgICBUaW1lV2luZG93IG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIHRpbWUgZnJhbWVcbiAqICAgICBiZWluZyBjdXJyZW50bHkgZGlzcGxheWVkLlxuICogQHRvZG8gYWRkIGRlc2NyaXB0aW9uIGFuZCB1cGRhdGUgZG9jLi4uXG4gKi9cbnZhciBUcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzID0gZnVuY3Rpb24oZGl2SWQsIHRyYWNlLCB0aW1lX3dpbmRvdykge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGRpdklkKTtcblxuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LU9ic2VsT2NjdXJyZW5jZXMnKTtcbiAgLy90aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXMnKTtcbiAgJCh3aW5kb3cpLnJlc2l6ZSh0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLnRyYWNlID0gdHJhY2U7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTpyZW1vdmVfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzLm9ic2VsX3JlZHJhdy5iaW5kKHRoaXMpKTtcblxuICB0aGlzLndpbmRvdyA9IHRpbWVfd2luZG93O1xuICB0aGlzLndpbmRvdy5vbigndHc6dXBkYXRlJywgdGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93Lm9uKCd0dzp0cmFuc2xhdGUnLCB0aGlzLnRyYW5zbGF0ZV94LmJpbmQodGhpcykpO1xuXG4gIC8vXHR0aGlzLm9ic2VsX3NlbGVjdG9yID0gb2JzZWxfc2VsZWN0b3I7XG4gIC8vXHR0aGlzLndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCcnLHRoaXMuLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuXG4gIC8vIGNyZWF0ZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdmFsdWUgb3IgZnVuY3Rpb25cbiAgdmFyIHRoaXNfd2lkZ2V0ID0gdGhpcztcblxuICB0aGlzLmRyYXcoKTtcbn07XG5cblRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXMucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cblxuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCgnIycgKyB0aGlzLmlkKTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJylcbiAgICAuYXR0cihcInhtbG5zXCIsIFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIilcbiAgICAuYXR0cihcInZlcnNpb25cIiwgXCIxLjFcIik7XG5cblxuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG5cbiAgICB0aGlzLnN2Z19ncCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuXG4gICAgLy8gZXZlbnQgbGlzdGVuZXJzXG4gICAgdmFyIHdpZGdldCA9IHRoaXM7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCdjaGFuZ2VUaW1lT25EcmFnJywgdGhpcy5lbGVtZW50LCB7XG4gICAgICBvblVwQ2FsbGJhY2s6IGZ1bmN0aW9uKGRlbHRhX3gpIHtcbiAgICAgICAgdmFyIHRpbWVfZGVsdGEgPSAtZGVsdGFfeCAqIHdpZGdldC53aW5kb3cuZ2V0X3dpZHRoKCkgLyB3aWRnZXQuZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgd2lkZ2V0LnN2Z19ncC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAoLXdpZGdldC50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgICAgICAgd2lkZ2V0LndpbmRvdy50cmFuc2xhdGUodGltZV9kZWx0YSk7XG4gICAgICB9LFxuICAgICAgb25Nb3ZlQ2FsbGJhY2s6IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgICB3aWRnZXQuc3ZnX2dwLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArIChvZmZzZXQgLSB3aWRnZXQudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91cignem9tbU9uU2Nyb2xsJywgdGhpcy5lbGVtZW50LCB7dGltZVdpbmRvdzogdGhpcy53aW5kb3d9KTtcbiAgfSxcblxuXG4gIC8vIFRPRE86IG5lZWRzIHRvIGJlIG5hbWVkIGZvbGxvd2luZyBhIGNvbnZlbnRpb25cbiAgLy8gdG8gYmUgZGVjaWRlZCBvblxuICAvKipcbiAgXHQgKiBDYWxjdWxhdGVzIHRoZSBYIHBvc2l0aW9uIGluIHBpeGVscyBjb3JyZXNwb25kaW5nIHRvXG4gIFx0ICogdGhlIHRpbWUgZ2l2ZW4gaW4gcGFyYW1ldGVyLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIFRpbWUgZm9yIHdoaWNoIHRvIHNlZWsgdGhlIGNvcnJlc3BvbmRpbmcgeCBwYXJhbWV0ZXJcbiAgXHQgKi9cbiAgY2FsY3VsYXRlX3g6IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgeCA9IChvLmdldF9iZWdpbigpIC0gdGhpcy53aW5kb3cuc3RhcnQpICogdGhpcy5zY2FsZV94ICsgdGhpcy50cmFuc2xhdGVfb2Zmc2V0O1xuICAgIHJldHVybiB4XG5cbiAgfSxcbiAgY2FsY3VsYXRlX3dpZHRoOiBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHggPSBNYXRoLm1heCgwLjAxLCAoby5nZXRfZW5kKCkgLSBvLmdldF9iZWdpbigpKSAqIHRoaXMuc2NhbGVfeCk7IC8vIHdpZHRoIG9mIDAgPT4gbm90IGRpc3BsYXllZFxuICAgIHJldHVybiB4XG4gIH0sXG4gIHRyYW5zbGF0ZV94OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIHRpbWVfZGVsdGEgPSBlLmRhdGE7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ICs9IHRpbWVfZGVsdGEgKiB0aGlzLnNjYWxlX3g7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKC10aGlzLnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICB9LFxuXG4gIHJlZnJlc2hfeDogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuYXR0cigneCcsIHRoaXMuY2FsY3VsYXRlX3guYmluZCh0aGlzKSlcbiAgICAuYXR0cignd2lkdGgnLCB0aGlzLmNhbGN1bGF0ZV93aWR0aC5iaW5kKHRoaXMpKVxuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZSkge1xuICAgICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInRyYWNlOnVwZGF0ZVwiOlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7IC8vIGRvIG5vdCB3YW50IHRvIHRyaWdnZXIgdGhlIHJlZnJlc2hpbmcgb2YgbGlzdF9vYnNlbHMoKS4uLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5leGl0KClcbiAgICAucmVtb3ZlKCk7XG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKCdyZWN0JylcbiAgICAvLy5hdHRyKCdjbGFzcycsJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgIC5hdHRyKCd4JywgdGhpcy5jYWxjdWxhdGVfeC5iaW5kKHRoaXMpKVxuICAgIC5hdHRyKCd5JywgJzAnKVxuICAgIC5hdHRyKCd3aWR0aCcsIHRoaXMuY2FsY3VsYXRlX3dpZHRoLmJpbmQodGhpcykpXG4gICAgLmF0dHIoJ2hlaWdodCcsICcyMCcpO1xuICAgIC8vLmF0dHIoJ3N0cm9rZS13aWR0aCcsJzFweCcpXG4gICAgLy8uYXR0cignc3Ryb2tlJywnYmxhY2snKTtcbiAgICAvLyBTdG9yaW5nIG9ic2VsIGRhdGEgd2l0aCBqUXVlcnkgZm9yIGFjY2Vzc2liaWxpdHkgZnJvbVxuICAgIC8vIGV2ZW50cyBkZWZpbmVkIGJ5IHVzZXJzIHdpdGggalF1ZXJ5XG4gICAgJCgncmVjdCcsIHRoaXMuZWxlbWVudCkuZWFjaChmdW5jdGlvbihpLCBlbCkge1xuICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAnU2Ftb3RyYWNlcy1kYXRhJzogZDMuc2VsZWN0KGVsKS5kYXR1bSgpXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICBvYnNlbF9yZWRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgb2JzID0gZS5kYXRhO1xuICAgIHZhciBzZWwgPSB0aGlzLmQzT2JzZWxzKClcblx0XHRcdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAvL1x0XHRcdFx0Y29uc29sZS5sb2coJ2RhdGE6aWQsb2JzZWxfZWRpdF9pZCcsaWQsb2JzLmdldF9pZCgpLGlkID09IG9icy5nZXRfaWQoKSk7XG4gIHJldHVybiBvLmdldF9pZCgpID09IG9icy5nZXRfaWQoKTtcblx0XHRcdH0pXG5cdFx0XHQuZGF0dW0ob2JzKVxuXHRcdFx0LmF0dHIoJ3gnLCB0aGlzLmNhbGN1bGF0ZV94LmJpbmQodGhpcykpXG5cdFx0XHQuYXR0cignd2lkdGgnLCB0aGlzLmNhbGN1bGF0ZV93aWR0aC5iaW5kKHRoaXMpKVxuXHRcdFx0LmF0dHIoJ3hsaW5rOmhyZWYnLCB0aGlzLm9wdGlvbnMudXJsKTtcbiAgfSxcblxuICBkM09ic2VsczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3ZnX2dwXG4gICAgLnNlbGVjdEFsbCgnY2lyY2xlLGltYWdlLHJlY3QnKVxuICAgIC8vIFRPRE86IEFUVEVOVElPTiEgV0FSTklORyEgb2JzZWxzIE1VU1QgaGF2ZSBhIGZpZWxkIGlkIC0+IHVzZWQgYXMgYSBrZXkuXG4gICAgLy8uZGF0YSh0aGlzLmRhdGEpOyAvLyxmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pO1xuICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcblxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXM7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG52YXIgVHJhY2VEaXNwbGF5VGV4dCA9IGZ1bmN0aW9uKGRpdklkLCB0cmFjZSwgdGltZVdpbmRvdykge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgV2lkZ2V0LmNhbGwodGhpcywgZGl2SWQpO1xuICB0aGlzLmRpdklkID0gZGl2SWQ7XG4gIHRoaXMuYWRkX2NsYXNzKFwiV2lkZ2V0LVRyYWNlRGlzcGxheVRleHRcIik7XG4gIHRoaXMudHJhY2UgPSB0cmFjZTtcbiAgdGhpcy50cmFjZS5vbihcInRyYWNlOnVwZGF0ZVRcIiwgdGhpcy5yZWZyZXNoWC5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbihcInRyYWNlOmNyZWF0ZV9vYnNlbF9UZXh0XCIsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cgPSB0aW1lV2luZG93O1xuICB0aGlzLndpbmRvdy5vbihcInR3OnVwZGF0ZVwiLCB0aGlzLnJlZnJlc2hYLmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdy5vbihcIkNoYW5nZUxhbmdhZ2VcIiwgdGhpcy5yZWZyZXNoWC5iaW5kKHRoaXMpKTtcbiAgdGhpcy5yZWZyZXNoWCgpO1xuICB0aGlzLmRhdGFPYiA9IFtdO1xufTtcblxuVHJhY2VEaXNwbGF5VGV4dC5wcm90b3R5cGUgPSB7XG4gIGRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLmRhdGFPYi5wdXNoKEpTT04uc3RyaW5naWZ5KGUuZGF0YSkpO1xuICAgIC8vdGhpcy5kYXRhT2IgPSBKU09OLnN0cmluZ2lmeSAoZS5kYXRhKTtcbiAgICAvLyBBc3Npc3QuVmlld1RyYWNlLmFkZE9ic2VsVmlzdShlLmRhdGEsIHRoaXMuZGl2SWQpOyAvLyBUT0RPIHdoYXQgaXMgQXNzaXN0ID9cbiAgICAkKFwiI1wiICsgZS5kYXRhW1wiQGlkXCJdKS5oaWRlKCk7XG4gIH0sXG4gIHJlZnJlc2hYOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdGltZVdpbmRvdyA9IHRoaXMud2luZG93O1xuICAgIHRoaXMudHJhY2Uub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmICh0aW1lV2luZG93LnN0YXJ0IDw9IG8uZ2V0X2JlZ2luKCkgJiYgby5nZXRfYmVnaW4oKSA8PSB0aW1lV2luZG93LmVuZCkge1xuICAgICAgICAkKFwiI1wiICsgby5nZXRfaWQoKSkuc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJChcIiNcIiArIG8uZ2V0X2lkKCkpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgcmVkcmF3OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmRpdklkKS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuZGF0YU9iLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgLy8gQXNzaXN0LlZpZXdUcmFjZS5hZGRPYnNlbFZpc3UoSlNPTi5wYXJzZShvKSwgd2lkai5kaXZJZCk7IC8vIFRPRE8gd2hhdCBpcyBBc3Npc3QgP1xuICAgICAgJChcIiNcIiArIEpTT04ucGFyc2UobylbXCJAaWRcIl0pLmhpZGUoKTtcbiAgICB9KTtcbiAgICB0aGlzLnJlZnJlc2hYKCk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlRGlzcGxheVRleHQ7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0cmFjZS5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdHJhY2UuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQHJlcXVpcmVzIGQzLmpzIGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vZDNqcy5vcmdcIj5kM2pzLm9yZzwvYT4pXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIERFU0NSSVBUSU9OIFRPIENPTUUuLi4uXG4gKiBAcGFyYW0ge1N0cmluZ31cdGRpdklkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLlRyYWNlfVx0dHJhY2VcbiAqICAgICBUcmFjZSBvYmplY3QgdG8gZGlzcGxheVxuICogQHBhcmFtIHtTYW1vdHJhY2VzLlRpbWVXaW5kb3d9IHRpbWVfd2luZG93XG4gKiAgICAgVGltZVdpbmRvdyBvYmplY3QgdGhhdCBkZWZpbmVzIHRoZSB0aW1lIGZyYW1lXG4gKiAgICAgYmVpbmcgY3VycmVudGx5IGRpc3BsYXllZC5cbiAqIEB0b2RvIGFkZCBkZXNjcmlwdGlvbiBhbmQgdXBkYXRlIGRvYy4uLlxuICovXG52YXIgVHJhY2VEaXNwbGF5Wm9vbUNvbnRleHQgPSBmdW5jdGlvbihkaXZJZCwgdHJhY2UsIHRpbWVfd2luZG93MSwgdGltZV93aW5kb3cyLCBvcHRpb25zMSwgb3B0aW9uczIpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBkaXZJZCk7XG5cbiAgdGhpcy5tb2RlID0gJ3dpbmRvd19zeW5jJztcbiAgaWYgKG9wdGlvbnMxICE9PSB1bmRlZmluZWQgfHwgb3B0aW9uczIgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMubW9kZSA9ICdvYnNlbF9zeW5jJztcbiAgICBpZiAob3B0aW9uczEgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zMS5oYXNPd25Qcm9wZXJ0eSgneCcpKSB7XG4gICAgICB0aGlzLngxID0gb3B0aW9uczEueC5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBpZiAob3B0aW9uczIgIT09IHVuZGVmaW5lZCAmJiBvcHRpb25zMi5oYXNPd25Qcm9wZXJ0eSgneCcpKSB7XG4gICAgICB0aGlzLngyID0gb3B0aW9uczIueC5iaW5kKHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtT2JzZWxPY2N1cnJlbmNlcycpO1xuICAvL3RoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcycpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuXG4gIHRoaXMudHJhY2UgPSB0cmFjZTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnJlbW92ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMub2JzZWxfcmVkcmF3LmJpbmQodGhpcykpO1xuXG4gIHRoaXMud2luZG93MSA9IHRpbWVfd2luZG93MTtcbiAgdGhpcy53aW5kb3cxLm9uKCd0dzp1cGRhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cxLm9uKCd0dzp0cmFuc2xhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLndpbmRvdzIgPSB0aW1lX3dpbmRvdzI7XG4gIHRoaXMud2luZG93Mi5vbigndHc6dXBkYXRlJywgdGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93Mi5vbigndHc6dHJhbnNsYXRlJywgdGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG5cbiAgLy9cdHRoaXMub2JzZWxfc2VsZWN0b3IgPSBvYnNlbF9zZWxlY3RvcjtcbiAgLy9cdHRoaXMud2luZG93MS5hZGRFdmVudExpc3RlbmVyKCcnLHRoaXMuLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuXG4gIC8vIGNyZWF0ZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdmFsdWUgb3IgZnVuY3Rpb25cbiAgdmFyIHRoaXNfd2lkZ2V0ID0gdGhpcztcblxuICB0aGlzLmRyYXcoKTtcbn07XG5cblRyYWNlRGlzcGxheVpvb21Db250ZXh0LnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG5cbiAgICB2YXIgZGl2X2VsbXQgPSBkMy5zZWxlY3QoJyMnICsgdGhpcy5pZCk7XG4gICAgdGhpcy5zdmcgPSBkaXZfZWxtdC5hcHBlbmQoJ3N2ZycpXG4gICAgLmF0dHIoXCJ4bWxuc1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpXG4gICAgLmF0dHIoXCJ2ZXJzaW9uXCIsIFwiMS4xXCIpO1xuXG5cbiAgICB0aGlzLnNjYWxlX3gxID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cxLmdldF93aWR0aCgpO1xuICAgIHRoaXMuc2NhbGVfeDIgPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdzIuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcblxuICAgIHRoaXMuc3luY19wYXRoID0gdGhpcy5zdmcuYXBwZW5kKCdwYXRoJylcbiAgICAuYXR0cignc3R5bGUnLCAnc3Ryb2tlOmdyZXk7c3Ryb2tlLXdpZHRoOjFweDtmaWxsOiNkZGQ7Jyk7XG4gICAgdGhpcy5zdmdfZ3AgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcblxuICB9LFxuXG5cbiAgLy8gVE9ETzogbmVlZHMgdG8gYmUgbmFtZWQgZm9sbG93aW5nIGEgY29udmVudGlvblxuICAvLyB0byBiZSBkZWNpZGVkIG9uXG4gIC8qKlxuICBcdCAqIENhbGN1bGF0ZXMgdGhlIFggcG9zaXRpb24gaW4gcGl4ZWxzIGNvcnJlc3BvbmRpbmcgdG9cbiAgXHQgKiB0aGUgdGltZSBnaXZlbiBpbiBwYXJhbWV0ZXIuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgVGltZSBmb3Igd2hpY2ggdG8gc2VlayB0aGUgY29ycmVzcG9uZGluZyB4IHBhcmFtZXRlclxuICBcdCAqL1xuICBjYWxjdWxhdGVfeDogZnVuY3Rpb24odCkge1xuICAgIHZhciB4ID0gKHQgLSB0aGlzLndfc3RhcnQpICogdGhpcy5zY2FsZV94O1xuICAgIHJldHVybiB4IDtcbiAgfSxcbiAgbzJ4MTogZnVuY3Rpb24obykge1xuICAgIHRoaXMud19zdGFydCA9IHRoaXMud2luZG93MS5zdGFydDtcbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLnNjYWxlX3gxO1xuICAgIHJldHVybiB0aGlzLngxKG8pO1xuICB9LFxuICBvMngyOiBmdW5jdGlvbihvKSB7XG4gICAgdGhpcy53X3N0YXJ0ID0gdGhpcy53aW5kb3cyLnN0YXJ0O1xuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuc2NhbGVfeDI7XG4gICAgcmV0dXJuIHRoaXMueDIobyk7XG4gIH0sXG4gIHgxOiBmdW5jdGlvbihvKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlX3goby5nZXRfYmVnaW4oKSk7XG4gIH0sXG4gIHgyOiBmdW5jdGlvbihvKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlX3goby5nZXRfYmVnaW4oKSk7XG4gIH0sXG4gIGNhbGN1bGF0ZV9wYXRoOiBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHAgPSBbXTtcbiAgICB2YXIgeDEgPSB0aGlzLm8yeDEobyk7XG4gICAgdmFyIHgyID0gdGhpcy5vMngyKG8pO1xuICAgIHAgPSBbJ00nLCB4MSwgJzAnLCAnQycsIHgxLCAnMTAsJywgeDIsICcxMCwnLCB4MiwgJzIwJ107XG4gICAgcmV0dXJuIHAuam9pbignICcpO1xuICB9LFxuICBjYWxjdWxhdGVfdmlzaWJpbGl0eTogZnVuY3Rpb24obykge1xuICAgIHZhciB4MSA9IHRoaXMubzJ4MShvKTtcbiAgICBpZiAoeDEgPCAwKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHgxID4gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIHgyID0gdGhpcy5vMngyKG8pO1xuICAgIGlmICh4MiA+IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh4MiA8IDApIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY2FsY3VsYXRlX3N0eWxlOiBmdW5jdGlvbihvKSB7XG4gICAgaWYgKHRoaXMuY2FsY3VsYXRlX3Zpc2liaWxpdHkobykpIHtcbiAgICAgIC8vaWYodHJ1ZSkge1xuICAgICAgcmV0dXJuICdzdHJva2U6Z3JleTtzdHJva2Utd2lkdGg6MXB4O2ZpbGw6bm9uZTsnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxcHg7ZmlsbDpub25lOyc7XG4gICAgfVxuICB9LFxuICB0cmFuc2xhdGVfeDogZnVuY3Rpb24oZSkge1xuICAgIHZhciB0aW1lX2RlbHRhID0gZS5kYXRhO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCArPSB0aW1lX2RlbHRhICogdGhpcy5zY2FsZV94O1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICgtdGhpcy50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgfSxcblxuICByZWZyZXNoX3g6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2NhbGVfeDEgPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdzEuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy5zY2FsZV94MiA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93Mi5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIGlmICh0aGlzLm1vZGUgPT0gXCJvYnNlbF9zeW5jXCIpIHtcbiAgICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgICAgLmF0dHIoJ2QnLCB0aGlzLmNhbGN1bGF0ZV9wYXRoLmJpbmQodGhpcykpXG4gICAgICAuYXR0cignc3R5bGUnLCB0aGlzLmNhbGN1bGF0ZV9zdHlsZS5iaW5kKHRoaXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zeW5jX3BhdGguYXR0cignZCcsIHRoaXMuY2FsY3VsYXRlX3N5bmNfcGF0aC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIGlmIChlKSB7XG4gICAgICBzd2l0Y2ggKGUudHlwZSkge1xuICAgICAgICBjYXNlIFwidHJhY2U6dXBkYXRlXCI6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2VscygpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDsgLy8gZG8gbm90IHdhbnQgdG8gdHJpZ2dlciB0aGUgcmVmcmVzaGluZyBvZiBsaXN0X29ic2VscygpLi4uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aGlzLm1vZGUgPT0gXCJvYnNlbF9zeW5jXCIpIHtcbiAgICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgICAgLmV4aXQoKVxuICAgICAgLnJlbW92ZSgpO1xuICAgICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZCgncGF0aCcpXG4gICAgICAvLy5hdHRyKCdjbGFzcycsJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgICAgLmF0dHIoJ2QnLCB0aGlzLmNhbGN1bGF0ZV9wYXRoLmJpbmQodGhpcykpXG4gICAgICAuYXR0cignc3R5bGUnLCB0aGlzLmNhbGN1bGF0ZV9zdHlsZS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgICAgLy8uYXR0cignc3Ryb2tlLXdpZHRoJywnMXB4JylcbiAgICAgIC8vLmF0dHIoJ3N0cm9rZScsJ2JsYWNrJyk7XG4gICAgICAvLyBTdG9yaW5nIG9ic2VsIGRhdGEgd2l0aCBqUXVlcnkgZm9yIGFjY2Vzc2liaWxpdHkgZnJvbVxuICAgICAgLy8gZXZlbnRzIGRlZmluZWQgYnkgdXNlcnMgd2l0aCBqUXVlcnlcbiAgICAgICQoJ3BhdGgnLCB0aGlzLmVsZW1lbnQpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICAgJC5kYXRhKGVsLCB7XG4gICAgICAgICAgJ1NhbW90cmFjZXMtdHlwZSc6ICdvYnNlbCcsXG4gICAgICAgICAgJ1NhbW90cmFjZXMtZGF0YSc6IGQzLnNlbGVjdChlbCkuZGF0dW0oKVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN5bmNfcGF0aC5hdHRyKCdkJywgdGhpcy5jYWxjdWxhdGVfc3luY19wYXRoLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfSxcbiAgY2FsY3VsYXRlX3N5bmNfcGF0aDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRzID0gTWF0aC5tYXgodGhpcy53aW5kb3cxLnN0YXJ0LCB0aGlzLndpbmRvdzIuc3RhcnQpO1xuICAgIHZhciB0ZSA9IE1hdGgubWluKHRoaXMud2luZG93MS5lbmQsIHRoaXMud2luZG93Mi5lbmQpO1xuICAgIHZhciB4MXMgPSAoTWF0aC5taW4odHMsIHRoaXMud2luZG93MS5lbmQpIC0gdGhpcy53aW5kb3cxLnN0YXJ0KSAqIHRoaXMuc2NhbGVfeDE7XG4gICAgdmFyIHgycyA9IChNYXRoLm1pbih0cywgdGhpcy53aW5kb3cyLmVuZCkgLSB0aGlzLndpbmRvdzIuc3RhcnQpICogdGhpcy5zY2FsZV94MjtcbiAgICB2YXIgeDFlID0gKE1hdGgubWF4KHRlLCB0aGlzLndpbmRvdzEuc3RhcnQpIC0gdGhpcy53aW5kb3cxLnN0YXJ0KSAqIHRoaXMuc2NhbGVfeDE7XG4gICAgdmFyIHgyZSA9IChNYXRoLm1heCh0ZSwgdGhpcy53aW5kb3cyLnN0YXJ0KSAtIHRoaXMud2luZG93Mi5zdGFydCkgKiB0aGlzLnNjYWxlX3gyO1xuICAgIHZhciBwID0gW1wiTVwiLCB4MXMsIFwiMFwiLCBcIkNcIiwgeDFzLCBcIjIwLFwiLCB4MnMsIFwiMCxcIiwgeDJzLCBcIjIwXCIsIFwiTFwiLCB4MmUsIFwiMjBcIiwgXCJDXCIsIHgyZSwgXCIwLFwiLCB4MWUsIFwiMjAsXCIsIHgxZSwgXCIwXCIsIFwiWlwiXTtcbiAgICByZXR1cm4gcC5qb2luKFwiIFwiKTtcbiAgfSxcbiAgb2JzZWxfcmVkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIG9icyA9IGUuZGF0YTtcbiAgICB2YXIgc2VsID0gdGhpcy5kM09ic2VscygpXG5cdFx0XHQuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgLy9cdFx0XHRcdGNvbnNvbGUubG9nKCdkYXRhOmlkLG9ic2VsX2VkaXRfaWQnLGlkLG9icy5nZXRfaWQoKSxpZCA9PSBvYnMuZ2V0X2lkKCkpO1xuICByZXR1cm4gby5nZXRfaWQoKSA9PSBvYnMuZ2V0X2lkKCk7XG5cdFx0XHR9KVxuXHRcdFx0LmRhdHVtKG9icylcblx0XHRcdC5hdHRyKCdkJywgdGhpcy5jYWxjdWxhdGVfcGF0aC5iaW5kKHRoaXMpKVxuICB9LFxuXG4gIGQzT2JzZWxzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5zdmdfZ3BcbiAgICAuc2VsZWN0QWxsKCdwYXRoJylcbiAgICAvLyBUT0RPOiBBVFRFTlRJT04hIFdBUk5JTkchIG9ic2VscyBNVVNUIGhhdmUgYSBmaWVsZCBpZCAtPiB1c2VkIGFzIGEga2V5LlxuICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7IC8vIFRPRE86IGJvZ3VlIGluIGNhc2Ugbm8gSUQgZXhpc3RzIC0+IG1pZ2h0IGhhcHBlbiB3aXRoIEtUQlMgdHJhY2VzIGFuZCBuZXcgb2JzZWxzXG4gIH0sXG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZURpc3BsYXlab29tQ29udGV4dDtcbiIsInZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnJlcXVpcmUoJ2pxdWVyeS1tb3VzZXdoZWVsJykoJCk7XG5cbi8qKlxuICogQG1peGluXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuICogQHJlcXVpcmVzIGpRdWVyeSBNb3VzZSBXaGVlbCBwbHVnaW4gKHNlZSA8YSBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2JyYW5kb25hYXJvbi9qcXVlcnktbW91c2V3aGVlbFwiPk1vdXNlIFdoZWVsIHBsdWdpbjwvYT4pXG4gKiBAZGVzY3JpcHRpb25cbiAqIEFsbCB3aWRnZXRzIHNob3VsZCBpbmhlcml0IGZyb20gdGhpcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0LlxuICpcbiAqIEluIG9yZGVyIHRvIHVzZSBjcmVhdGUgYSB3aWRnZXQgdGhhdCBpbmhlcml0cyBmcm9tIHRoZVxuICogV2lkZ2V0IGNsYXNzLCBvbmUgbXVzaCBpbmNsdWRlIHRoZSBmb2xsb3dpbmcgY29kZSBpblxuICogdGhlIGNvbnN0cnVjdG9yIG9mIHRoZWlyIHdpZGdldC5cbiAqIDxjb2RlPlxuICogPC9jb2RlPlxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBpZCBJZCBvZiB0aGUgSFRNTCBlbGVtZW50IHRoZVxuICogV2lkZ2V0IGlzIGF0dGFjaGVkIHRvLlxuICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH0gZWxlbWVudCBIVE1MIGVsZW1lbnQgdGhlXG4gKiBXaWRnZXQgaXMgYXR0YWNoZWQgdG8uXG4gKi9cbnZhciBXaWRnZXQgPSAoZnVuY3Rpb24oKSB7XG4gIC8qKlxuICBcdCAqIEFkZHMgdGhlIGdpdmVuIGNsYXNzIHRvIHRoZSBIVE1MIGVsZW1lbnQgdG8gd2hpY2hcbiAgXHQgKiB0aGlzIFdpZGdldCBpcyBhdHRhY2hlZCB0by5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5XaWRnZXRzLldpZGdldC5wcm90b3R5cGVcbiAgXHQgKiBAcHVibGljXG4gIFx0ICogQG1ldGhvZFxuICBcdCAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc19uYW1lIE5hbWUgb2YgdGhlIGNsYXNzIHRvIGFkZFxuICBcdCAqL1xuICBmdW5jdGlvbiBhZGRfY2xhc3MoY2xhc3NfbmFtZSkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NfbmFtZTtcbiAgfVxuICBmdW5jdGlvbiBnZXRWYWx1ZUF0dHJpYnV0U3R5bGUgICh0eXBlLGF0dHJpYnV0KSB7XG4gICAgaWYgKHRoaXMuc3R5bGVzaGVldFt0eXBlXSkge1xuICAgICAgICAgIGlmICgodGhpcy5zdHlsZXNoZWV0W3R5cGVdW2F0dHJpYnV0XSkmJih0aGlzLnN0eWxlc2hlZXRbdHlwZV1bYXR0cmlidXRdICE9PVwiXCIpKVxuICAgICAgICAgICAgICB7cmV0dXJuIHRoaXMuc3R5bGVzaGVldFt0eXBlXVthdHRyaWJ1dF07fVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHtyZXR1cm4gdGhpcy5zdHlsZXNoZWV0WydkZWZhdWx0J11bYXR0cmlidXRdO31cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuc3R5bGVzaGVldFsnZGVmYXVsdCddW2F0dHJpYnV0XTtcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gdW5sb2FkKCkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc05hbWUgPSAnJztcbiAgICAvL1x0XHR0aGlzLmVsZW1lbnQuXG4gIH1cbiAgLyoqXG4gIFx0ICogQ3JlYXRlcyBhIG5ldyBiZWhhdmlvdXIgKGludGVyYWN0aW9uIHBvc3NpYmlsaXR5KVxuICBcdCAqIHdpdGggdGhlIHdpZGdldC5cbiAgXHQgKiBUd28gYmVoYXZpb3VycyBhcmUgaW1wbGVtZW50ZWQgc28gZmFyOlxuICBcdCAqIDEuICdjaGFuZ2VUaW1lT25EcmFnJ1xuICBcdCAqIDIuICd6b21tT25TY3JvbGwnXG4gIFx0ICpcbiAgXHQgKiAxLiAnY2hhbmdlVGltZU9uRHJhZycgYmVoYXZpb3VyIGFsbG93cyB0byBjaGFuZ2VcbiAgXHQgKiBhIHtAbGluayBTYW1vdHJhY2VzLkxpYi5UaW1lcn0gb24gYSBkcmFnLW4tZHJvcCBsaWtlIGV2ZW50XG4gIFx0ICogKEphdmFTY3JpcHQgJ21vdXNlZG93bicsICdtb3VzZW1vdmUnLCAnbW91c2V1cCcgYW5kICdtb3VzZWxlYXZlJ1xuICBcdCAqIGV2ZW50cykuIFRoaXMgYWxsb3dzIHRvIGNoYW5nZSB0aGUgY3VycmVudCB0aW1lIGJ5IGRyYWdnaW5nXG4gIFx0ICogYSB0cmFjZSB2aXN1YWxpc2F0aW9uIG9yIGEgc2xpZGVyIGZvciBpbnN0YW5jZS5cbiAgXHQgKlxuICBcdCAqIDIuICdjaGFuZ2VUaW1lT25EcmFnJyBiZWhhdmlvdXIgYWxsb3dzIHRvIGNoYW5nZVxuICBcdCAqIGEge0BsaW5rIFNhbW90cmFjZXMuTGliLlRpbWVXaW5kb3d9IG9uIGEgbW91c2Ugc2Nyb2xsIGV2ZW50XG4gIFx0ICogKEphdmFTY3JpcHQgJ3doZWVsJyBldmVudClcbiAgXHQgKlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLldpZGdldHMuV2lkZ2V0LnByb3RvdHlwZVxuICBcdCAqIEBwdWJsaWNcbiAgXHQgKiBAbWV0aG9kXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGJlaGF2aW91ck5hbWUgTmFtZSBvZiB0aGUgYmVoYXZpb3VyXG4gIFx0ICogICAgICgnY2hhbmdlVGltZU9uRHJhZycgb3IgJ3pvbW1PblNjcm9sbCcpLiBTZWUgZGVzY3JpcHRpb24gYWJvdmUuXG4gIFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZXZlbnRUYXJnZXRFbGVtZW50IEhUTUwgRWxlbWVudCBvbiB3aGljaFxuICBcdCAqICAgICBhbiBldmVudExpc3RlbmVyIHdpbGwgYmUgY3JlYXRlZCAodHlwaWNhbGx5LCB0aGUgZWxlbWVudCB5b3VcbiAgXHQgKiAgICAgd2FudCB0byBpbnRlcmFjdCB3aXRoKS5cbiAgXHQgKiBAcGFyYW0ge09iamVjdH0gb3B0IE9wdGlvbnMgdGhhdCB2YXJ5IGRlcGVuZGluZyBvbiB0aGVcbiAgXHQgKiAgICAgc2VsZWN0ZWQgYmVoYXZpb3VyLlxuICBcdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdC5vblVwQ2FsbGJhY2tcbiAgXHQgKiAgICAoZm9yICdjaGFuZ2VUaW1lT25EcmFnJyBiZWhhdmlvdXIgb25seSlcbiAgXHQgKiAgICBDYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdtb3VzZXVwJyBldmVudCB3aWxsIGJlXG4gIFx0ICogICAgdHJpZ2dlcmVkLiBUaGUgYXJndW1lbnQgZGVsdGFfeCBpcyBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrXG4gIFx0ICogICAgYW5kIHJlcHJlc2VudHMgdGhlIG9mZnNldCBvZiB0aGUgeCBheGlzIGluIHBpeGVscyBiZXR3ZWVuIHRoZVxuICBcdCAqICAgIG1vbWVudCB0aGUgbW91c2Vkb3duIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZCBhbmQgdGhlIG1vbWVudFxuICBcdCAqICAgIHRoZSBjdXJyZW50IG1vdXNldXAgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICBcdCAqIEBwYXJhbSB7RnVuY3Rpb259IG9wdC5vbk1vdmVDYWxsYmFja1xuICBcdCAqICAgIChmb3IgJ2NoYW5nZVRpbWVPbkRyYWcnIGJlaGF2aW91ciBvbmx5KVxuICBcdCAqICAgIENhbGxiYWNrIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2hlbiB0aGUgJ21vdXNlbW92ZScgZXZlbnQgd2lsbCBiZVxuICBcdCAqICAgIHRyaWdnZXJlZC4gVGhlIGFyZ3VtZW50IGRlbHRhX3ggaXMgcGFzc2VkIHRvIHRoZSBjYWxsYmFja1xuICBcdCAqICAgIGFuZCByZXByZXNlbnRzIHRoZSBvZmZzZXQgb2YgdGhlIHggYXhpcyBpbiBwaXhlbHMgYmV0d2VlbiB0aGVcbiAgXHQgKiAgICBtb21lbnQgdGhlIG1vdXNlZG93biBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQgYW5kIHRoZSBtb21lbnRcbiAgXHQgKiAgICB0aGUgY3VycmVudCBtb3VzZW1vdmUgZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkLlxuICBcdCAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuVGltZVdpbmRvd30gb3B0LnRpbWVXaW5kb3dcbiAgXHQgKiAgICAoZm9yICd6b21tT25TY3JvbGwnIGJlaGF2aW91ciBvbmx5KVxuICBcdCAqICAgIHtAbGluayBTYW1vdHJhY2VzLkxpYi5UaW1lV2luZG93fSBvYmplY3QgdGhhdCB3aWxsXG4gIFx0ICogICAgYmUgZWRpdGVkIHdoZW4gdGhlIHpvb20gYWN0aW9uIGlzIHByb2R1Y2VkLlxuICBcdCAqL1xuICBmdW5jdGlvbiBhZGRfYmVoYXZpb3VyKGJlaGF2aW91ck5hbWUsIGV2ZW50VGFyZ2V0RWxlbWVudCwgb3B0KSB7XG5cbiAgICBzd2l0Y2ggKGJlaGF2aW91ck5hbWUpIHtcbiAgICAgIGNhc2UgJ2NoYW5nZVRpbWVPbkRyYWcnOlxuICAgICAgICB2YXIgbW91c2Vkb3duLCBtb3VzZXVwLCBtb3VzZW1vdmU7XG4gICAgICAgIHZhciBpbml0X2NsaWVudF94O1xuICAgICAgICBtb3VzZWRvd24gPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgLy9cdGNvbnNvbGUubG9nKCdtb3VzZWRvd24nKTtcbiAgICAgICAgICBpbml0X2NsaWVudF94ID0gZS5jbGllbnRYO1xuICAgICAgICAgIGV2ZW50VGFyZ2V0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmUpO1xuICAgICAgICAgIGV2ZW50VGFyZ2V0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgbW91c2V1cCk7XG4gICAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBtb3VzZXVwKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIG1vdXNldXAgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgLy9cdGNvbnNvbGUubG9nKCdtb3VzZXVwJyk7XG4gICAgICAgICAgaWYgKGluaXRfY2xpZW50X3ggIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIGRlbHRhX3ggPSAoZS5jbGllbnRYIC0gaW5pdF9jbGllbnRfeCk7XG4gICAgICAgICAgICBvcHQub25VcENhbGxiYWNrKGRlbHRhX3gpO1xuICAgICAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIG1vdXNlbW92ZSk7XG4gICAgICAgICAgICBldmVudFRhcmdldEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXApO1xuICAgICAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBtb3VzZXVwKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICBtb3VzZW1vdmUgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgdmFyIGRlbHRhX3ggPSAoZS5jbGllbnRYIC0gaW5pdF9jbGllbnRfeCk7XG4gICAgICAgICAgb3B0Lm9uTW92ZUNhbGxiYWNrKGRlbHRhX3gpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIG1vdXNlZG93bik7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnem9tbU9uU2Nyb2xsJzpcbiAgICAgICAgdmFyIHdoZWVsO1xuXG4gICAgICAgIHdoZWVsID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHZhciBjb2VmID0gTWF0aC5wb3coMC44LCBlLmRlbHRhWSk7XG4gICAgICAgICAgb3B0LnRpbWVXaW5kb3cuem9vbShjb2VmKTtcbiAgICAgICAgICAvL1x0XHRcdFx0b3B0Lm9uV2hlZWxDYWxsYmFjay5jYWxsKG9wdC5iaW5kLGNvZWYpO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgICQoZXZlbnRUYXJnZXRFbGVtZW50KS5tb3VzZXdoZWVsKHdoZWVsKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKGlkKSB7XG4gICAgLy8gRE9DVU1FTlRFRCBBQk9WRVxuICAgIC8vdGhpcy5pZCA9IGlkO1xuICAgIC8vdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XG4gICAgdGhpcy5lbGVtZW50ID0gaWQ7XG4gICAgdGhpcy5pZCA9IHRoaXMuZWxlbWVudC5pZDtcblxuICAgIHRoaXMuYWRkX2NsYXNzID0gYWRkX2NsYXNzO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91ciA9IGFkZF9iZWhhdmlvdXI7XG5cbiAgICAvLyBjYWxsIG1ldGhvZFxuICAgIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQnKTtcbiAgICB0aGlzLmdldFZhbHVlQXR0cmlidXRTdHlsZSA9IGdldFZhbHVlQXR0cmlidXRTdHlsZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gV2lkZ2V0O1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdGltZSBzY2FsZS5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdGltZSBzY2FsZS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgZDMuanMgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9kM2pzLm9yZ1wiPmQzanMub3JnPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpbmRvd1NjYWxlIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSB0aGUgdGVtcG9yYWwgc2NhbGUgb2YgYVxuICoge0BsaW5rIFNhbW90cmFjZXMuVGltZVdpbmRvd3xUaW1lV2luZG93fS4gVGhpc1xuICogd2lkZ2V0IHVzZXMgZDMuanMgdG8gY2FsY3VsYXRlIGFuZCBkaXNwbGF5IHRoZSBzY2FsZS5cbiAqXG4gKiBOb3RlOiB1bmxlc3MgdGhlIG9wdGlvbmFsIGFyZ3VtZW50IGlzSmF2YXNjcmlwdERhdGUgaXMgZGVmaW5lZCxcbiAqIHRoZSB3aWRnZXQgd2lsbCB0cnkgdG8gZ3Vlc3MgaWYgdGltZSBpcyBkaXNwbGF5ZWQgYXMgbnVtYmVycyxcbiAqIG9yIGlmIHRpbWUgaXMgZGlzcGxheWVkIGluIHllYXIvbW9udGgvZGF5L2hvdXJzL2V0Yy5cbiAqIFRoaXMgc2Vjb25kIG9wdGlvbiBhc3N1bWVzIHRoYXQgdGhlIHRpbWUgaXMgcmVwcmVzZW50ZWQgaW5cbiAqIG1pbGxpc2Vjb25kcyBzaW5jZSAxIEphbnVhcnkgMTk3MCBVVEMuXG4gKiBAcGFyYW0ge1N0cmluZ31cdGRpdklkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHt9IHRpbWVXaW5kb3dcbiAqICAgICBUaW1lV2luZG93Q2VudGVyZWRPblRpbWUgb2JqZWN0XG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtpc0phdmFzY3JpcHREYXRlXVxuICogICAgIEJvb2xlYW4gdGhhdCBkZXNjcmliZXMgaWYgdGhlIHNjYWxlIHJlcHJlc2VudHMgYSBKYXZhU2NyaXB0IERhdGUgb2JqZWN0LlxuICogICAgIElmIHNldCB0byB0cnVlLCB0aGUgd2lkZ2V0IHdpbGwgZGlzcGxheSB5ZWFycywgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcy4uLlxuICogICAgIGFzIGlmIHRoZSB0aW1lIGdpdmVuIHdhcyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBlbGxhcHNlZCBzaW5jZSAxIEphbnVhcnkgMTk3MCBVVEMuXG4gKiAgICAgSWYgc2V0IHRvIGZhbHNlLCB0aGUgd2lkZ2V0IHdpbGwgZGlzcGxheSB0aGUgbnVtYmVycyB3aXRob3V0IGF0dGVtcHRpbmdcbiAqICAgICBhbnkgY29udmVyc2lvbi5cbiAqICAgICBUaGlzIGFyZ3VtZW50IGlzIG9wdGlvbmFsLiBJZiBub3Qgc2V0LCB0aGUgd2lkZ2V0IHdpbGwgdHJ5IHRvIGd1ZXNzOlxuICogICAgIElmIHRoZSBudW1iZXIgb2YgdGhlIHN0YXJ0IG9mIHRoZSBnaXZlbiBUaW1lV2luZG93IGlzIGFib3ZlIGEgYmlsbGlvbiwgdGhlblxuICogICAgIGl0IGlzIGFzc3VtZWQgdGhhdCB0aGUgSmF2YVNjcmlwdCBEYXRlIG9iamVjdCBoYXMgYmVlbiB1c2VkIHRvIHJlcHJlc2VudCB0aW1lLlxuICogICAgIE90aGVyd2lzZSwgdGhlIG51bWVyaWNhbCB2YWx1ZSBvZiB0aW1lIHdpbGwgYmUgZGlzcGxheWVkLlxuICovXG52YXIgV2luZG93U2NhbGUgPSBmdW5jdGlvbihodG1sRWxlbWVudCwgdGltZVdpbmRvdywgaXNKYXZhc2NyaXB0RGF0ZSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sRWxlbWVudCk7XG5cbiAgdGhpcy5hZGRfY2xhc3MoXCJXaWRnZXQtV2luZG93U2NhbGVcIik7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5kcmF3LmJpbmQodGhpcykpO1xuXG4gIHRoaXMud2luZG93ID0gdGltZVdpbmRvdztcbiAgdGhpcy53aW5kb3cub24oXCJ0dzp1cGRhdGVcIiwgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdy5vbihcInR3OnRyYW5zbGF0ZVwiLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG5cbiAgLy8gVHJ5aW5nIHRvIGd1ZXNzIGlmIHRpbWVXaW5kb3cgaXMgcmVsYXRlZCB0byBhIERhdGUoKSBvYmplY3RcbiAgaWYgKHRoaXMud2luZG93LnN0YXJ0ID4gMTAwMDAwMDAwMCkgeyAvLyAxb145ID4gMTEgSmFuIDE5NzAgaWYgYSBEYXRlIG9iamVjdFxuICAgIHRoaXMuaXNKYXZhc2NyaXB0RGF0ZSA9IGlzSmF2YXNjcmlwdERhdGUgfHwgdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLmlzSmF2YXNjcmlwdERhdGUgPSBpc0phdmFzY3JpcHREYXRlIHx8IGZhbHNlO1xuICB9XG5cbiAgdGhpcy5pbml0RE9NKCk7XG4gIC8vIFVwZGF0ZSBzbGlkZXIncyBwb3NpdGlvblxuICB0aGlzLmRyYXcoKTtcblxufTtcblxuV2luZG93U2NhbGUucHJvdG90eXBlID0ge1xuICBpbml0RE9NOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvLyBDcmVhdGUgdGhlIHNsaWRlclxuICAgIHRoaXMuc3ZnID0gZDMuc2VsZWN0KHRoaXMuZWxlbWVudCkuYXBwZW5kKFwic3ZnXCIpO1xuICAgIGlmICh0aGlzLmlzSmF2YXNjcmlwdERhdGUpIHtcbiAgICAgIHRoaXMueCA9IGQzLnRpbWUuc2NhbGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54ID0gZDMuc2NhbGUubGluZWFyKCk7XG4gICAgfVxuICAgIHRoaXMueEF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHRoaXMueCk7XG4gICAgdGhpcy54LmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pO1xuICAgIHRoaXMuc3ZnQXhpcyA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIik7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKFwiem9tbU9uU2Nyb2xsXCIsIHRoaXMuZWxlbWVudCwge3RpbWVXaW5kb3c6IHRoaXMud2luZG93fSk7XG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy54LnJhbmdlKFswLCB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGhdKTtcbiAgICB0aGlzLnguZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSk7XG4gICAgdGhpcy5zdmdBeGlzLmNhbGwodGhpcy54QXhpcyk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd1NjYWxlO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxudmFyIFdpbmRvd1NjYWxlRml4ID0gZnVuY3Rpb24oaHRtbF9pZCwgdGltZV93aW5kb3csIGlzX2phdmFzY3JpcHRfZGF0ZSkge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVdpbmRvd1NjYWxlJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdyA9IHRpbWVfd2luZG93O1xuICAvLyB0cnlpbmcgdG8gZ3Vlc3MgaWYgdGltZV93aW5kb3cgaXMgcmVsYXRlZCB0byBhIERhdGUoKSBvYmplY3RcbiAgaWYgKHRoaXMud2luZG93LnN0YXJ0ID4gMTAwMDAwMDAwMCkgeyAvLyAxb145ID4gMTEgSmFuIDE5NzAgaWYgYSBEYXRlIG9iamVjdFxuICAgIHRoaXMuaXNfamF2YXNjcmlwdF9kYXRlID0gaXNfamF2YXNjcmlwdF9kYXRlIHx8IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pc19qYXZhc2NyaXB0X2RhdGUgPSBpc19qYXZhc2NyaXB0X2RhdGUgfHwgZmFsc2U7XG4gIH1cbiAgdGhpcy53aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy5pbml0X0RPTSgpO1xuICAvLyB1cGRhdGUgc2xpZGVyJ3MgcG9zaXRpb25cbiAgdGhpcy5kcmF3KCk7XG5cdFx0fTtcblxuV2luZG93U2NhbGVGaXgucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgLy8gY3JlYXRlIHRoZSBzbGlkZXJcbiAgICAvL3RoaXMuc3ZnID0gZDMuc2VsZWN0KFwiI1wiK3RoaXMuaWQpLmFwcGVuZChcInN2Z1wiKTtcbiAgICB0aGlzLnN2ZyA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpLmFwcGVuZChcInN2Z1wiKTtcbiAgICBpZiAodGhpcy5pc19qYXZhc2NyaXB0X2RhdGUpIHtcbiAgICAgIHRoaXMueCA9IGQzLnRpbWUuc2NhbGUoKTsgLy8ucmFuZ2UoWzAsdGhpcy5lbGVtZW50LmdldFNpemUoKS54XSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMueCA9IGQzLnNjYWxlLmxpbmVhcigpO1xuICAgIH1cbiAgICAvL3RoaXMueEF4aXMgPSBkMy5zdmcuYXhpcygpLnNjYWxlKHRoaXMueCk7IC8vLm9yaWVudChcImJvdHRvbVwiKTtcbiAgICB0aGlzLnhBeGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh0aGlzLngpO1xuICAgIC8vLnRpY2tzKGQzLnRpbWUuZGF5cyk7XG4gICAgdGhpcy54LmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pO1xuICAgIHRoaXMuc3ZnQXhpcyA9IHRoaXMuc3ZnLmFwcGVuZChcImdcIik7XG5cbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLngucmFuZ2UoWzAsIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aF0pOy8vID0gZDMudGltZS5zY2FsZSgpLnJhbmdlKFswLHRoaXMuZWxlbWVudC5nZXRTaXplKCkueF0pO1xuICAgIHRoaXMueC5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKTtcbiAgICB0aGlzLnN2Z0F4aXMuY2FsbCh0aGlzLnhBeGlzKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93U2NhbGVGaXg7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB3aW5kb3cgc2xpZGVyLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB3aW5kb3cgc2xpZGVyLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLmQzQmFzaWMuV2luZG93U2xpZGVyIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSBhIHRlbXBvcmFsIHdpbmRvd1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0ZGl2SWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0gd2lkZV93aW5kb3dcbiAqICAgICBUaW1lV2luZG93IG9iamVjdCAtPiByZXByZXNlbnRpbmcgdGhlIHdpZGUgd2luZG93XG4gKiAgICAgKGUuZy4sIHRoZSB3aG9sZSB0cmFjZSlcbiAqIEBwYXJhbSBzbGlkZXJfd2luZG93XG4gKiAgICAgVGltZVdpbmRvdyBvYmplY3QgLT4gcmVwcmVzZW50aW5nIHRoZSBzbWFsbCB3aW5kb3dcbiAqICAgICAoZS5nLiwgdGhlIGN1cnJlbnQgdGltZSB3aW5kb3cgYmVpbmcgdmlzdWFsaXNlZCB3aXRoIGFub3RoZXIgd2lkZ2V0KVxuICovXG52YXIgV2luZG93U2xpZGVyID0gZnVuY3Rpb24oaHRtbF9pZCwgd2lkZV93aW5kb3csIHNsaWRlcl93aW5kb3cpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcblxuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVdpbmRvd1NsaWRlcicpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcblxuICB0aGlzLndpZGVfd2luZG93ID0gd2lkZV93aW5kb3c7XG4gIHRoaXMud2lkZV93aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aWRlX3dpbmRvdy5vbigndHc6dHJhbnNsYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnNsaWRlcl93aW5kb3cgPSBzbGlkZXJfd2luZG93O1xuICB0aGlzLnNsaWRlcl93aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy5zbGlkZXJfd2luZG93Lm9uKCd0dzp0cmFuc2xhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5zbGlkZXJfb2Zmc2V0ID0gMDtcbiAgdGhpcy53aWR0aCA9IDA7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xuICAvLyB1cGRhdGUgc2xpZGVyJ3MgcG9zaXRpb25cbiAgdGhpcy5kcmF3KCk7XG59O1xuXG5XaW5kb3dTbGlkZXIucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBjcmVhdGUgdGhlIHNsaWRlclxuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zbGlkZXJfZWxlbWVudCk7XG5cbiAgICAvLyBoYW5kIG1hZGUgZHJhZyZkcm9wXG4gICAgLy8gZXZlbnQgbGlzdGVuZXJzXG4gICAgdmFyIHdpZGdldCA9IHRoaXM7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCdjaGFuZ2VUaW1lT25EcmFnJywgdGhpcy5zbGlkZXJfZWxlbWVudCwge1xuICAgICAgb25VcENhbGxiYWNrOiBmdW5jdGlvbihkZWx0YV94KSB7XG4gICAgICAgIHZhciB0aW1lX2RlbHRhID0gZGVsdGFfeCAqIHdpZGdldC53aWRlX3dpbmRvdy5nZXRfd2lkdGgoKSAvIHdpZGdldC5lbGVtZW50LmNsaWVudFdpZHRoO1xuICAgICAgICB3aWRnZXQuc2xpZGVyX3dpbmRvdy50cmFuc2xhdGUodGltZV9kZWx0YSk7XG4gICAgICB9LFxuICAgICAgb25Nb3ZlQ2FsbGJhY2s6IGZ1bmN0aW9uKG9mZnNldCkge1xuICAgICAgICB3aWRnZXQuc2xpZGVyX2VsZW1lbnQuc3R5bGUubGVmdCA9IHdpZGdldC5zbGlkZXJfb2Zmc2V0ICsgb2Zmc2V0ICsgJ3B4JztcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5hZGRfYmVoYXZpb3VyKCd6b21tT25TY3JvbGwnLCB0aGlzLmVsZW1lbnQsIHt0aW1lV2luZG93OiB0aGlzLnNsaWRlcl93aW5kb3d9KTtcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLndpZHRoID0gdGhpcy5zbGlkZXJfd2luZG93LmdldF93aWR0aCgpIC8gdGhpcy53aWRlX3dpbmRvdy5nZXRfd2lkdGgoKSAqIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICB0aGlzLnNsaWRlcl9vZmZzZXQgPSAodGhpcy5zbGlkZXJfd2luZG93LnN0YXJ0IC0gdGhpcy53aWRlX3dpbmRvdy5zdGFydCkgKiB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpZGVfd2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5zbGlkZXJfZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGggKyAncHgnO1xuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQuc3R5bGUubGVmdCA9IHRoaXMuc2xpZGVyX29mZnNldCArICdweCc7XG4gIH0sXG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dTbGlkZXI7XG4iLCIvKipcbiAqIEBtaXhpblxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgRXZlbnRIYW5kbGVyIE9iamVjdCBpcyBub3QgYSBjbGFzcy4gSG93ZXZlciwgaXQgaXNcbiAqIGRlc2lnbmVkIGZvciBvdGhlciBjbGFzc2VzIHRvIGluaGVyaXQgb2YgYSBwcmVkZWZpbmVkXG4gKiBPYnNlcnZhYmxlIGJlaGF2aW91ci4gRm9yIHRoaXMgcmVhc29uLCB0aGlzIGZ1bmN0aW9uIGlzXG4gKiBkb2N1bWVudGVkIGFzIGEgQ2xhc3MuXG4gKlxuICogSW4gb3JkZXIgdG8gdXNlIGNyZWF0ZSBhIGNsYXNzIHRoYXQgXCJpbmhlcml0c1wiIGZyb20gdGhlXG4gKiBcIkV2ZW50SGFuZGxlciBjbGFzc1wiLCBvbmUgbXVzdCBydW4gdGhlIGZvbGxvd2luZyBjb2RlIGluXG4gKiB0aGUgY29uc3RydWN0b3I6XG4gKiA8Y29kZT5cbiAqIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gKiA8L2NvZGU+XG4gKlxuICogQHByb3BlcnR5IHtPYmplY3R9IGNhbGxiYWNrc1xuICogICAgIEhhc2ggbWF0Y2hpbmcgY2FsbGJhY2tzIHRvIGV2ZW50X3R5cGVzLlxuICovXG52YXIgRXZlbnRIYW5kbGVyID0gKGZ1bmN0aW9uKCkge1xuICAvKipcbiAgXHQgKiBUcmlnZ2VycyBhbGwgdGhlIHJlZ2lzdHJlZCBjYWxsYmFja3MuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLnByb3RvdHlwZVxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudF90eXBlXG4gIFx0ICogICAgIFRoZSB0eXBlIG9mIHRoZSB0cmlnZ2VyZWQgZXZlbnQuXG4gIFx0ICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICBcdCAqICAgICBPYmplY3Qgc2VudCB3aXRoIHRoZSBtZXNzYWdlIHRvIHRoZSBsaXN0ZW5lcnMgKHNlZVxuICBcdCAqICAgICB7QGxpbmsgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIjb259KS5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gdHJpZ2dlcihldmVudF90eXBlLCBvYmplY3QpIHtcbiAgICB2YXIgZSA9IHsgdHlwZTogZXZlbnRfdHlwZSwgZGF0YTogb2JqZWN0IH07XG4gICAgaWYgKHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdKSB7XG4gICAgICB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXS5tYXAoZnVuY3Rpb24oZikgeyBmKGUpOyB9KTtcbiAgICB9XG4gICAgLypcbiAgICBcdFx0dGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0uZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgIFx0XHRcdGNhbGxiYWNrKGUpO1xuICAgIFx0XHR9KTtcbiAgICBcdFx0Ki9cbiAgfVxuICAvKipcbiAgXHQgKiBBZGRzIGEgY2FsbGJhY2sgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnRcbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIucHJvdG90eXBlXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50X3R5cGVcbiAgXHQgKiAgICAgVGhlIHR5cGUgb2YgdGhlIGV2ZW50IHRvIGxpc3RlbiB0by5cbiAgXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICBcdCAqICAgICBDYWxsYmFjayB0byBjYWxsIHdoZW4gdGhlIGFuIGV2ZW50IG9mIHR5cGVcbiAgXHQgKiAgICAgZXZlbnRfdHlwZSBpcyB0cmlnZ2VyZWQuIE5vdGU6IHRoZSBjYWxsYmFja1xuICBcdCAqICAgICBjYW4gcmVjZWl2ZSBvbmUgYXJndW1lbnQgdGhhdCBjb250YWluc1xuICBcdCAqICAgICBkZXRhaWxzIGFib3V0IHRoZSB0cmlnZ2VyZWQgZXZlbnQuXG4gIFx0ICogICAgIFRoaXMgZXZlbnQgYXJndW1lbnQgY29udGFpbnMgdHdvIGZpZWxkczpcbiAgXHQgKiAgICAgZXZlbnQudHlwZTogdGhlIHR5cGUgb2YgZXZlbnQgdGhhdCBpcyB0cmlnZ2VyZWRcbiAgXHQgKiAgICAgZXZlbnQuZGF0YTogb3B0aW9uYWwgZGF0YSB0aGF0IGlzIHRyYW5zbWl0dGVkIHdpdGggdGhlIGV2ZW50XG4gIFx0ICovXG4gIGZ1bmN0aW9uIG9uKGV2ZW50X3R5cGUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHt9LnRvU3RyaW5nLmNhbGwoY2FsbGJhY2spICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKSB7XG4gICAgICBjb25zb2xlLmxvZyhjYWxsYmFjayk7XG4gICAgICB0aHJvdyBcIkNhbGxiYWNrIGZvciBldmVudCBcIiArIGV2ZW50X3R5cGUgKyBcIiBpcyBub3QgYSBmdW5jdGlvblwiO1xuICAgIH1cbiAgICB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXSA9IHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdIHx8IFtdO1xuICAgIHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGV2ZW50cykge1xuICAgIC8vIERPQ1VNRU5URUQgQUJPVkVcbiAgICB0aGlzLmNhbGxiYWNrcyA9IHRoaXMuY2FsbGJhY2tzIHx8IHt9O1xuICAgIHRoaXMudHJpZ2dlciA9IHRyaWdnZXI7XG4gICAgdGhpcy5vbiA9IG9uO1xuICAgIC8qKlxuICAgIFx0XHQgKiBFdmVudENvbmZpZyBpcyBhIHNob3J0bmFtZSBmb3IgdGhlXG4gICAgXHRcdCAqIHtAbGluayBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ31cbiAgICBcdFx0ICogb2JqZWN0LlxuICAgIFx0XHQgKiBAdHlwZWRlZiBFdmVudENvbmZpZ1xuICAgIFx0XHQgKiBAc2VlIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnXG4gICAgXHRcdCAqL1xuICAgIC8qKlxuICAgIFx0XHQgKiBUaGUgRXZlbnRDb25maWcgb2JqZWN0IGlzIHVzZWQgZm9yIGNvbmZpZ3VyYXRpbmcgdGhlXG4gICAgXHRcdCAqIGZ1bmN0aW9ucyB0byBjYWxsIGV2ZW50cyBhcmUgdHJpZ2dlcmVkIGJ5IGFuIEV2ZW50SGFuZGxlciBPYmplY3QuXG4gICAgXHRcdCAqIEVhY2ggYXR0cmlidXRlIG5hbWUgb2YgdGhlIEV2ZW50Q29uZmlnIGNvcnJlc3BvbmRzXG4gICAgXHRcdCAqIHRvIGEgdHlwZSBvZiBldmVudCBsaXN0ZW5lZCB0bywgYW5kIGVhY2hcbiAgICBcdFx0ICogdmFsdWUgaXMgdGhlIGZ1bmN0aW9uIHRvIHRyaWdnZXIgb24gdGhpcyBldmVudC5cbiAgICBcdFx0ICogQHR5cGVkZWYgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIuRXZlbnRDb25maWdcbiAgICBcdFx0ICogQHR5cGUge09iamVjdC48c3RyaW5nLCBmdW5jdGlvbj59XG4gICAgXHRcdCAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb259IGV2ZW50TmFtZSAtIEZ1bmN0aW9uIHRvIHRyaWdnZXIgb24gdGhpcyBldmVudC5cbiAgICBcdFx0ICovXG4gICAgZnVuY3Rpb24gY2FsbGJhY2soZSkgeyBmdW4oZS5kYXRhKTsgfVxuICAgIGZvciAodmFyIGV2ZW50X25hbWUgaW4gZXZlbnRzKSB7XG4gICAgICBcdFx0aWYgKGV2ZW50Lmhhc093blByb3BlcnR5KGV2ZW50X25hbWUpKSB7XG4gICAgICAgIFx0XHR2YXIgZnVuID0gZXZlbnRzW2V2ZW50X25hbWVdO1xuICAgICAgICBcdFx0dGhpcy5vbihldmVudF9uYW1lLCBjYWxsYmFjayk7XG4gICAgICBcdFx0fVxuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRIYW5kbGVyO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG5cbi8qKlxuICogQGNsYXNzIEphdmFzY3JpcHQgS1RCUy5CYXNlIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUy5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5LVEJTLkJhc2UgaXMgYSBKYXZhc2NyaXB0IEtUQlMgYmFzZVxuICogb2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXQgdGhlXG4gKiBsaXN0IG9mIHRyYWNlcyBhdmFpbGFibGUgaW4gdGhlIEtUQlMgYmFzZS4gQWNjZXNzIGFcbiAqIHNwZWNpZmljIHRyYWNlLCBldGMuXG4gKlxuICogQHRvZG8gRnVsbHkgaW1wbGVtZW50IEtUQlMgQVBJXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHR1cmlcdFVSSSBvZiB0aGUgQmFzZSB0byBsb2FkLlxuICogQHBhcmFtIHtTdHJpbmd9XHRbaWRdXHRJRCBvZiB0aGUgQmFzZSB0byBsb2FkLlxuICovXG52YXIgQmFzZSA9IGZ1bmN0aW9uIEJhc2UodXJpLCBpZCkge1xuICAvLyBLVEJTLkJhc2UgaXMgYSBSZXNvdXJjZVxuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgeyBpZCA9IHVyaTsgfVxuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBpZCwgdXJpLCAnQmFzZScsIFwiXCIpO1xuICB0aGlzLnRyYWNlcyA9IFtdO1xuICB0aGlzLm1vZGVscyA9IFtdO1xuICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbn07XG5cbkJhc2UucHJvdG90eXBlID0ge1xuICBnZXQ6IGZ1bmN0aW9uKGlkKSB7fSxcbiAgLyoqXG4gIFx0ICogR2V0cyB0aGUgbGlzdCBvZiB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBiYXNlLlxuICBcdCAqIEByZXR1cm5zIHtBcnJheS48U3RyaW5nPn0gQXJyYXkgb2YgdGhlIElEIG9mIHRoZSB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBCYXNlLlxuICBcdCAqL1xuICBsaXN0X3RyYWNlczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2VzO1xuICB9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGxpc3RfbW9kZWxzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbHM7XG4gIH0sXG4gIC8qKlxuICBcdCAqIENyZWF0ZSBhIHN0b3JlZCB0cmFjZSBpbiB0aGUgS1RCU1xuICBcdCAqIEBwYXJhbSBpZCB7U3RyaW5nfSBJRCBvZiB0aGUgY3JlYXRlZCB0cmFjZVxuICBcdCAqIEBwYXJhbSBbbW9kZWxdIHtNb2RlbH0gTW9kZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtvcmlnaW5dIHtPcmlnaW59IE9yaWdpbiBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW2RlZmF1bHRfc3ViamVjdF0ge1N0cmluZ30gRGVmYXVsdCBzdWJqZWN0IG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbbGFiZWxdIHtTdHJpbmd9IExhYmVsIG9mIHRoZSB0cmFjZVxuICBcdCAqL1xuICBjcmVhdGVfc3RvcmVkX3RyYWNlOiBmdW5jdGlvbihpZCwgbW9kZWwsIG9yaWdpbiwgZGVmYXVsdF9zdWJqZWN0LCBsYWJlbCkge1xuICAgIHZhciBuZXdfdHJhY2UgPSB7XG4gICAgICBcIkBjb250ZXh0XCI6XHRcImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEva3Ricy1qc29ubGQtY29udGV4dFwiLFxuICAgICAgXCJAdHlwZVwiOlx0XCJTdG9yZWRUcmFjZVwiLFxuICAgICAgXCJAaWRcIjpcdFx0aWQgKyBcIi9cIlxuICAgIH07XG4gICAgbmV3X3RyYWNlLmhhc01vZGVsID0gKG1vZGVsID09PSB1bmRlZmluZWQpP1wiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9zaW1wbGUtdHJhY2UtbW9kZWxcIjptb2RlbDtcbiAgICBuZXdfdHJhY2Uub3JpZ2luID0gKG9yaWdpbiA9PT0gdW5kZWZpbmVkKT9cIjE5NzAtMDEtMDFUMDA6MDA6MDBaXCI6b3JpZ2luO1xuICAgIC8vXHRcdFx0aWYob3JpZ2luPT11bmRlZmluZWQpIG5ld190cmFjZS5vcmlnaW4gPSBvcmlnaW47XG4gICAgaWYgKGRlZmF1bHRfc3ViamVjdCA9PT0gdW5kZWZpbmVkKSBuZXdfdHJhY2UuZGVmYXVsdF9zdWJqZWN0ID0gZGVmYXVsdF9zdWJqZWN0O1xuICAgIGlmIChsYWJlbCA9PT0gdW5kZWZpbmVkKSBuZXdfdHJhY2UubGFiZWwgPSBsYWJlbDtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXdfdHJhY2UpLFxuICAgICAgc3VjY2VzczogdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoLmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdxdWVyeSBlcnJvcicpO1xuICAgICAgICBjb25zb2xlLmxvZyhbanFYSFIsIHRleHRTdGF0dXMsIGVycm9yXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gIFx0ICogQ3JlYXRlIGEgc3RvcmVkIHRyYWNlIGluIHRoZSBLVEJTXG4gIFx0ICogQHBhcmFtIGlkIHtTdHJpbmd9IElEIG9mIHRoZSBjcmVhdGVkIHRyYWNlXG4gIFx0ICogQHBhcmFtIFttb2RlbF0ge01vZGVsfSBNb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW29yaWdpbl0ge09yaWdpbn0gT3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbZGVmYXVsdF9zdWJqZWN0XSB7U3RyaW5nfSBEZWZhdWx0IHN1YmplY3Qgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtsYWJlbF0ge1N0cmluZ30gTGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICovXG4gIGNyZWF0ZV9tb2RlbDogZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBkb2MgPSB7XG4gICAgICAnQGNvbnRleHQnOiAnaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9rdGJzLWpzb25sZC1jb250ZXh0JyxcbiAgICAgICdAZ3JhcGgnOiBbe1xuICAgICAgICAnQGlkJzogaWQsXG4gICAgICAgICdAdHlwZSc6ICdUcmFjZU1vZGVsJyxcbiAgICAgICAgJ2luQmFzZSc6ICcuLycsXG4gICAgICAgICdoYXNVbml0JzogJ21pbGxpc2Vjb25kJ1xuICAgICAgfV1cbiAgICB9O1xuICAgIHZhciBuZXdfbW9kZWxfZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRvYyk7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy51cmksXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgZGF0YTogbmV3X21vZGVsX2RhdGEsXG4gICAgICBzdWNjZXNzOiB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3F1ZXJ5IGVycm9yJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuICBcblxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGNyZWF0ZV9jb21wdXRlZF90cmFjZTogZnVuY3Rpb24oaWQsIG1ldGhvZCwgcGFyYW1ldGVycywgc291cmNlcywgbGFiZWwpIHt9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIC8vY3JlYXRlX21vZGVsOiBmdW5jdGlvbihpZCwgcGFyZW50cywgbGFiZWwpIHt9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGNyZWF0ZV9tZXRob2Q6IGZ1bmN0aW9uKGlkLCBwYXJlbnQsIHBhcmFtZXRlcnMsIGxhYmVsKSB7fSxcbiAgLy8vLy8vLy8vLy9cbiAgLyoqXG4gIFx0ICogT3ZlcmxvYWRzIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5LVEJTLlJlc291Y2UjX29uX3N0YXRlX3JlZnJlc2hffSBtZXRob2QuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKi9cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgLy9cdGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2xhYmVsJywgZGF0YVtcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbFwiXSwgJ2Jhc2U6dXBkYXRlJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygndHJhY2VzJywgZGF0YS5jb250YWlucywgJ2Jhc2U6dXBkYXRlJyk7XG4gIH0sXG4gIC8vLy8vLy8vLy8vIEFEREVEIC8gQVBJXG4gIC8qKlxuICBcdCAqIEdldHMgYSB0cmFjZSBmcm9tIGl0cyBJRFxuICBcdCAqIEBwYXJhbSBpZCB7U3RyaW5nfSBJRCBvZiB0aGUgdHJhY2UgdG8gZ2V0LlxuICBcdCAqIEByZXR1cm4ge1NhbW90cmFjZXMuS1RCUy5UcmFjZX0gVGhlIHJldHJpZXZlZCBUcmFjZS5cbiAgXHQgKi9cbiAgZ2V0X3RyYWNlOiBmdW5jdGlvbihpZCkge1xuICAgIHJldHVybiBuZXcgU2Ftb3RyYWNlcy5LVEJTLlRyYWNlKHRoaXMudXJpICsgaWQgKyAnLycsIGlkKTtcbiAgfSxcbiAgLy8vLy8vLy8vLy8vXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhc2U7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgVHJhY2Ugb2JqZWN0IHRoYXQgaXMgc3luY2hyb25pc2VkIHRvIGEgS1RCUy5cbiAqIEBjbGFzcyBKYXZhc2NyaXB0IE1vZGVsIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUyBNb2RlbC5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuIC8gREVSQkVMIEZhdG1hXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5LVEJTLk1vZGVsaXMgYSBKYXZhc2NyaXB0IFRyYWNlIG9iamVjdFxuICogdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgTW9kZWwuIFRoaXMgT2JqZWN0IGltcGxlbWVudHMgdGhlIEtUQlMgQVBJLlxuICogTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIGdldFxuICogdGhlIExpc3RlIG9mIHR5cGUgb2YgT2JzZWxzIGZyb20gdGhlIEtUQlMgTW9kZWwsIC5cbiAqXG4gKlxuICpcbiAqIEB0b2RvIEZ1bGx5IGltcGxlbWVudCBLVEJTIEFQSVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0dXJpXHRVUkkgb2YgdGhlIEtUQlMgdHJhY2UgdG8gbG9hZC5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0W2lkXVx0SUQgb2YgdGhlIEtUQlMgdHJhY2UgdG8gbG9hZC5cbiAqL1xuXG5cbnZhciBNb2RlbCA9IGZ1bmN0aW9uKHVyaSwgaWQpIHtcbiAgaWYgKGlkID09PSB1bmRlZmluZWQpIHsgaWQgPSB1cmk7IH1cbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIGlkLCB1cmksICdNb2RlbCcsIFwiXCIpO1xuICB0aGlzLmxpc3RfVHlwZXNfT2JzbGVzID0gW11cbiAgdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG5cbn07XG5cbk1vZGVsLnByb3RvdHlwZSA9IHtcblxuICBfb25fc3RhdGVfcmVmcmVzaF86IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB0aGlzLmxpc3RfVHlwZXNfT2JzbGVzID0gdGhpcy5saXN0X29ic2VscyhkYXRhW1wiQGdyYXBoXCJdKTtcbiAgfSxcbiAgbGlzdF9vYnNlbHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBMaXN0ZU9ic2VsVHlwZSA9IFtdO1xuICAgIE0gPSB0aGlzO1xuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihlbCwga2V5KSB7XG4gICAgICB2YXIgb2JzID0ge2F0dHJpYnV0ZXM6IFtdfTtcbiAgICAgIGlmIChlbFtcIkB0eXBlXCJdID09IFwiT2JzZWxUeXBlXCIpICAgICAge1xuICAgICAgICBvYnMuaWQgPSBlbFtcIkBpZFwiXTtcbiAgICAgICAgb2JzLnR5cGUgPSBlbFtcIkBpZFwiXS5zdWJzdHIoMSk7XG4gICAgICAgIG9icy5jb2NoZSA9IGZhbHNlO1xuICAgICAgICAvL29ic1trZXldID0gZWxba2V5XVxuICAgICAgICBpZiAoZWxbJ2hhc1N1cGVyT2JzZWxUeXBlJ10pICAgICAgICB7XG4gICAgICAgICAgb2JzLmhhc1N1cGVyT2JzZWxUeXBlID0gZWxbJ2hhc1N1cGVyT2JzZWxUeXBlJ11cbiAgICAgICAgfVxuICAgICAgICBMaXN0ZU9ic2VsVHlwZS5wdXNoKG9icyk7XG4gICAgICAgIC8vTS50cmlnZ2VyKCdNb2RlbDpEcmF3X29ic2VsJywgb2JzKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyAoJ3RyaWdlcicpXG4gICAgICB9ICAgICAgZWxzZSBpZiAoZWxbXCJAdHlwZVwiXSA9PSBcIkF0dHJpYnV0ZVR5cGVcIikgICAgICB7XG4gICAgICAgIG9icyA9IE0uR2V0T2JzZWxUeXBlKGVsW1wiaGFzQXR0cmlidXRlT2JzZWxUeXBlXCJdLCBMaXN0ZU9ic2VsVHlwZSk7XG4gICAgICAgIGVsWydjb2NoZSddID0gZmFsc2U7XG4gICAgICAgIG9icy5hdHRyaWJ1dGVzLnB1c2goZWwpO1xuXG4gICAgICB9XG5cbiAgICB9KTtcbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmhhc1N1cGVyT2JzZWxUeXBlKSAgICAgIHtcblxuICAgICAgICBvLmF0dHJpYnV0ZXMgPSBNLmdldEF0dHJpYnV0ZXMgKG8uaGFzU3VwZXJPYnNlbFR5cGVbMF0pXG4gICAgICB9XG5cbiAgICB9KVxuXG4gICAgTS50cmlnZ2VyKCdNb2RlbDpsaXN0ZVR5cGUnLCBMaXN0ZU9ic2VsVHlwZSk7XG4gICAgcmV0dXJuIExpc3RlT2JzZWxUeXBlO1xuXG4gIH0sXG5cbiAgR2V0T2JzZWxUeXBlOiBmdW5jdGlvbihpZCwgTGlzdGVPYnNlbFR5cGUpICB7XG4gICAgdmFyIG9icyA9IFtdO1xuICAgIExpc3RlT2JzZWxUeXBlLmZvckVhY2goZnVuY3Rpb24obykgICAge1xuXG4gICAgICBpZiAob1tcImlkXCJdID09IGlkKSAgICAgIHtcblxuICAgICAgICBvYnNSID0gbztcblxuICAgICAgfVxuXG4gICAgfVxuICAgIClcbiAgICByZXR1cm4gb2JzUjtcbiAgfSxcblxuICBnZXRBdHRyaWJ1dGVzOiBmdW5jdGlvbihpZGVudCkgIHtcblxuICAgIExpc3RlT2JzZWxUeXBlLmZvckVhY2goZnVuY3Rpb24obykgICAge1xuXG4gICAgICBpZiAoby5pZCA9PT0gaWRlbnQpICAge1xuICAgICAgICBBdHQgPSBvLmF0dHJpYnV0ZXNcbiAgICAgIH1cblxuICAgIH1cbiAgICApXG4gICAgcmV0dXJuIEF0dDtcbiAgfSxcblxuICBwdXRfbW9kZWw6IGZ1bmN0aW9uKG1vZGVsZGF0YSkge1xuICAgIHZhciBldGFnID0gdGhpcy5nZXRfZXRhZygpO1xuICAgIC8qdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQVVQnLCB0aGlzLmlkLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignSWYtTWF0Y2gnLCBldGFnKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdPS09LT0snKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdlcnJldXInKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgeGhyLnNlbmQobW9kZWxkYXRhKTtcbiAgfSovXG5cbiAgdmFyIHRoYXQgPSB0aGlzO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgLy8gUFVUXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQVVQnLCB0aGF0LmlkLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignSWYtTWF0Y2gnLCBldGFnKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdPS09LT0snKTtcbiAgICAgICAgICByZXNvbHZlKG5ldyBTYW1vdHJhY2VzLkt0YnMuTW9kZWwoeGhyLnJlc3BvbnNlVVJMKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHhocik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QoRXJyb3IoJ1RoZXJlIHdhcyBhIG5ldHdvcmsgZXJyb3IuJykpO1xuICAgIH07XG4gICAgeGhyLnNlbmQobW9kZWxkYXRhKTtcbiAgfSk7XG59XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgT2JzZWwgPSByZXF1aXJlKFwiLi9PYnNlbC5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgU2Ftb3RyYWNlcy5LVEJTLk9ic2VsIGlzIHBhcnQgb2YgdGhlIFNhbW90cmFjZXMuS1RCUyBpbXBsZW1lbnRhdGlvbi5cbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLk9ic2VsXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAdG9kbyBUT0RPIHVwZGF0ZSBzZXRfbWV0aG9kc1xuICogLT4gc3luYyB3aXRoIEtUQlMgaW5zdGVhZCBvZiBsb2NhbCBjaGFuZ2VcbiAqL1xudmFyIEtUQlNPYnNlbCA9IGZ1bmN0aW9uKHBhcmFtKSB7XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIHBhcmFtLmlkLCBwYXJhbS51cmksICdPYnNlbCcsIHBhcmFtLmxhYmVsIHx8IFwiXCIpO1xuXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0cmFjZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAndHlwZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdiZWdpbicsXHREYXRlLm5vdygpKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnZW5kJyxcdFx0dGhpcy5iZWdpbik7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2F0dHJpYnV0ZXMnLFx0e30pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAncmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdpbnZlcnNlX3JlbGF0aW9ucycsXHRbXSk7IC8vIFRPRE8gYWpvdXRlciByZWwgw6AgbCdhdXRyZSBvYnNlbFxuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnc291cmNlX29ic2VscycsXHRcdFtdKTtcbn1cblxuS1RCU09ic2VsLnByb3RvdHlwZSA9IE9ic2VsLnByb3RvdHlwZTtcblxuLypcblNhbW90cmFjZXMuS1RCUy5PYnNlbC5wcm90b3R5cGUuZ2V0X2t0YnNfc3RhdHVzID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzLmt0YnNfc3RhdHVzXG59O1xuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTT2JzZWw7XG4iLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFJlc291cmNlIE9iamVjdHMgdGhhdCBpcyBzeW5jaHJvbmlzZWQgdG8gYSBrVEJTXG4gKiBAZGVzY3JpcHRpb24gUmVzb3VyY2UgT2JqZWN0cyBhcmUgS1RCUyBvYmplY3RzLiBBbGwgcmVzb3VyY2VzXG4gKiBoYXZlIGFuIHVyaSwgYW4gaWQgYW5kIGFuIG9wdGlvbmFsIGxhYmVsXG4gKiBAY2xhc3MgUmVzb3VyY2UgT2JqZWN0cyBoYXZlIGFuIHVyaSwgYW4gaWQgYW5kIGFuIG9wdGlvbmFsIGxhYmVsXG4gKiBAcGFyYW0ge1N0cmluZ30gaWQgSWQgb2YgdGhlIFJlc291cmNlXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsIFVSSSBvZiB0aGUgUmVzb3VyY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIFR5cGUgb2YgdGhlIFJlc291cmNlICgnS1RCUycsJ0Jhc2UnLFxuICogICAgICdUcmFjZScsJ1N0b3JlZFRyYWNlJywnQ29tcHV0ZWRUcmFjZScgb3IgJ09ic2VsJylcbiAqIEBwYXJhbSB7bGFiZWx9IFtsYWJlbF0gTGFiZWwgb2YgdGhlIFJlc291cmNlXG4gKi9cbnZhciBLVEJTUmVzb3VyY2UgPSAoZnVuY3Rpb24oKSB7XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIHJlc291cmNlIHR5cGUgb2YgdGhlIFJlc291cmNlLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gUmVzb3VyY2UgdHlwZSAoJ0tUQlMnLCdCYXNlJyxcbiAgXHQgKiAgICAgJ1RyYWNlJywnU3RvcmVkVHJhY2UnLCdDb21wdXRlZFRyYWNlJyBvciAnT2JzZWwnKS5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X3Jlc291cmNlX3R5cGUoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMudHlwZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEFic29sdXRlVVJMRnJvbVJsYXRpdmUoYmFzZSwgcmVsYXRpdmUpIHtcbiAgICB2YXIgc3RhY2sgPSBiYXNlLnNwbGl0KFwiL1wiKSxcbiAgICAgICAgcGFydHMgPSByZWxhdGl2ZS5zcGxpdChcIi9cIik7XG4gICAgc3RhY2sucG9wKCk7IC8vIHJlbW92ZSBjdXJyZW50IGZpbGUgbmFtZSAob3IgZW1wdHkgc3RyaW5nKVxuICAgICAgICAgICAgICAgICAvLyAob21pdCBpZiBcImJhc2VcIiBpcyB0aGUgY3VycmVudCBmb2xkZXIgd2l0aG91dCB0cmFpbGluZyBzbGFzaClcbiAgICBmb3IgKHZhciBpPTA7IGk8cGFydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHBhcnRzW2ldID09IFwiLlwiKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGlmIChwYXJ0c1tpXSA9PSBcIi4uXCIpXG4gICAgICAgICAgICBzdGFjay5wb3AoKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgc3RhY2sucHVzaChwYXJ0c1tpXSk7XG4gICAgfVxuICAgIHJldHVybiBzdGFjay5qb2luKFwiL1wiKTtcbiAgfVxuICAvLyBSRVNPVVJDRSBBUElcbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgSUQgb2YgdGhlIFJlc291cmNlLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gUmVzb3VyY2UgSUQuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF9pZCgpIHsgcmV0dXJuIHRoaXMuaWQ7IH1cbiAgICAvKipcbiAgXHQgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBVUkkgb2YgdGhlIFJlc291cmNlLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gUmVzb3VyY2UgVVJJLlxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfdXJpKCkgeyByZXR1cm4gdGhpcy51cmkucmVwbGFjZSgnLi8nLCAnJyk7IH1cbiAgLyoqXG4gICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFVSSSBvZiB0aGUgUmVzb3VyY2UuXG4gICAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9IFJlc291cmNlIFVSSS5cbiAgICovXG5mdW5jdGlvbiBnZXRfZXRhZygpIHsgcmV0dXJuIHRoaXMuZXRhZzsgfVxuICAgIC8qKlxuICBcdCAqIEBzdW1tYXJ5IEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2Ugd2l0aCB0aGUgS1RCUy5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2Ugd2l0aCB0aGUgS1RCUy5cbiAgXHQgKiBUaGlzIG1ldGhvZCB0cmlnZ2VycyBhIEFqYXggcXVlcnkgdGhhdCB3aWxsXG4gIFx0ICogdHJpZ2dlciB0aGUgX29uX3N0YXRlX3JlZnJlc2hfIG1ldGhvZCBvZiB0aGUgUmVzb3VyY2VcbiAgXHQgKiBvbiBzdWNjZXNzLlxuICBcdCAqL1xuICBmdW5jdGlvbiBmb3JjZV9zdGF0ZV9yZWZyZXNoKCkge1xuICAgIHVybCA9IHRoaXMudXJpO1xuICAgIHZhciB0cmMgPSB0aGlzIDtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB1cmwsXG4gICAgICB0eXBlOiAnR0VUJyxcbiAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICB4aHJGaWVsZHM6IHtcbiAgICAgICAgd2l0aENyZWRlbnRpYWxzOiB0cnVlXG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKFhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcblxuICAgICAgICBpZiAoWEhSLnN0YXR1cyA9PSAnNDAxJykge1xuICAgICAgICAgIGNvbnNvbGUubG9nIChYSFIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgICAgICAgIExpbmsgPSBYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0xpbmsnKTtcbiAgICAgICAgICBEID0gTGluay5zcGxpdCAoJywnKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgRC5sZW5ndGg7aSsrKSAgICAgICAgICB7XG4gICAgICAgICAgICB2YXIgU291c0QgPSBEW2ldLnNwbGl0KCc7Jyk7XG4gICAgICAgICAgICBpZiAoU291c0RbMV0gPT09IFwiIHJlbD1vYXV0aF9yZXNvdXJjZV9zZXJ2ZXJcIikgICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxpbmsgPSBTb3VzRFswXS5zdWJzdHIoMSwgU291c0RbMF0ubGVuZ3RoIC0gMilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChTb3VzRFsxXSA9PT0gXCIgcmVsPXN1Y2Nlc3NmdWxfbG9naW5fcmVkaXJlY3RcIikgICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFVSTFN1Y2Nlc3MgPSBTb3VzRFswXS5zdWJzdHIoMiwgU291c0RbMF0ubGVuZ3RoIC0gMylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgd2luID0gd2luZG93Lm9wZW4gKGxpbmspIDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhLCB0ZXh0U3RhdHVzLCB4aHIpe1xuICAgICAgICB0cmMuZXRhZyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignRVRhZycpO1xuICAgICAgICB0cmMuX29uX3N0YXRlX3JlZnJlc2hfKGRhdGEpO1xuICAgICAgfVxuXG4gICAgICAvL3RyYy5fb25fc3RhdGVfcmVmcmVzaF8uYmluZCh0cmMpLFxuICAgIH0pO1xuICB9XG4gICAgLyoqXG4gIFx0ICogQHN1bW1hcnkgRm9yY2VzIHRoZSBSZXNvdXJjZSB0byBzeW5jaHJvbmlzZVxuICBcdCAqIHdpdGggYXQgYSBnaXZlbiByZWZyZXNoaW5nIHJhdGUuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBGb3JjZXMgdGhlIFJlc291cmNlIHRvIHN5bmNocm9uaXNlIHdpdGggdGhlIEtUQlNcbiAgXHQgKiBldmVyeSBwZXJpb2Qgc2Vjb25kcy5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gcGVyaW9kIFRpbWUgaW4gc2Vjb25kcyBiZXR3ZWVuIHR3byBzeW5jaHJvbmlzYXRpb25zLlxuICBcdCAqL1xuXG5cbiAgZnVuY3Rpb24gc3RhcnRfYXV0b19yZWZyZXNoKHBlcmlvZCkge1xuICAgIHZhciBhID0gdGhpcy5hdXRvX3JlZnJlc2hfaWQ/dGhpcy5zdG9wX2F1dG9fcmVmcmVzaCgpOm51bGw7XG4gICAgdGhpcy5hdXRvX3JlZnJlc2hfaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoLmJpbmQodGhpcyksIHBlcmlvZCAqIDEwMDApO1xuICB9XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFN0b3BzIHRoZSBhdXRvcmVmcmVzaCBzeW5jaHJvbmlzYXRpb25cbiAgXHQgKiBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBTdG9wcyB0aGUgYXV0b3JlZnJlc2ggc3luY2hyb25pc2F0aW9uIG9mXG4gIFx0ICogdGhlIFJlc291cmNlLlxuICBcdCAqL1xuICBmdW5jdGlvbiBzdG9wX2F1dG9fcmVmcmVzaCgpIHtcbiAgICBpZiAodGhpcy5hdXRvX3JlZnJlc2hfaWQpIHtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICAgIGRlbGV0ZSh0aGlzLmF1dG9fcmVmcmVzaF9pZCk7XG4gICAgfVxuICB9XG4gIC8vXHRcdGZ1bmN0aW9uIF9vbl9zdGF0ZV9yZWZyZXNoXyhkYXRhKSB7IHRoaXMuZGF0YSA9IGRhdGE7IGNvbnNvbGUubG9nKFwiaGVyZVwiKTsgfVxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF9yZWFkX29ubHkoKSB7fVxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBEZWxldGUgdGhlIHJlc291cmNlIGZyb20gdGhlIEtUQlNcbiAgXHQgKiBAdG9kbyBJTVBST1ZFIFRISVMgTUVUSE9EIFNPIFRIQVQgUFJPUEVSIEVWRU5UIElTIFJBSVNFRFxuICBcdCAqICAgICBXSEVOIEEgUkVTT1VSQ0UgSVMgREVMRVRFRC5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgIGZ1bmN0aW9uIHJlZnJlc2hfcGFyZW50KCkge1xuICAgICAgLy9UUk9VVkVSIFVOIE1PWUVOIE1BTElOIERFIFJBRlJBSUNISVIgTEEgTElTVEUgREVTIEJBU0VTIERVIEtUQlMuLi5cbiAgICB9XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy51cmksXG4gICAgICB0eXBlOiAnREVMRVRFJyxcbiAgICAgIHN1Y2Nlc3M6IHJlZnJlc2hfcGFyZW50LmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yVGhyb3duKSB7XG4gICAgICAgIHRocm93IFwiQ2Fubm90IGRlbGV0ZSBcIiArIHRoaXMuZ2V0X3Jlc291cmNlX3R5cGUoKSArIFwiIFwiICsgdGhpcy51cmkgKyBcIjogXCIgKyB0ZXh0U3RhdHVzICsgJyAnICsgSlNPTi5zdHJpbmdpZnkoZXJyb3JUaHJvd24pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIGxhYmVsIG9mIHRoZSBSZXNvdXJjZVxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfbGFiZWwoKSB7IHJldHVybiB0aGlzLmxhYmVsOyB9XG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgZnVuY3Rpb24gc2V0X2xhYmVsKCkge31cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBmdW5jdGlvbiByZXNldF9sYWJlbCgpIHt9XG5cbiAgLy8gQURERUQgRlVOQ1RJT05TXG4gIC8qKlxuICBcdCAqIE1ldGhvZCB1c2VkIHRvIGNoZWNrIGlmIHRoZSBkaXN0YW50IHZhbHVlIGlzIGRpZmZlcmVudFxuICBcdCAqIGZyb20gdGhlIGN1cnJlbnQgbG9jYWwgdmFsdWUgKGFuZCB1cGRhdGUgdGhlIGxvY2FsIHZhbHVlXG4gIFx0ICogaWYgdGhlcmUgaXMgYSBkaWZmZXJlbmNlLlxuICBcdCAqIEBwcml2YXRlXG4gIFx0ICogQHBhcmFtIGxvY2FsX2ZpZWxkIHtTdHJpbmd9IE5hbWUgb2YgdGhlIGZpZWxkIG9mIHRoZSB0aGlzXG4gIFx0ICogICAgIG9iamVjdCBjb250YWluaW5nIHRoZSBpbmZvcm1hdGlvbiB0byBjaGVjay5cbiAgXHQgKiBAcGFyYW0gZGlzdGFudCB7VmFsdWV9IFZhbHVlIG9mIHRoZSBkaXN0YW50IGluZm9ybWF0aW9uLlxuICBcdCAqIEBwYXJhbSBtZXNzYWdlX2lmX2NoYW5nZWQge1N0cmluZ30gTWVzc2FnZSB0byB0cmlnZ2VyIGlmXG4gIFx0ICogICAgIHRoZSBpbmZvcm1hdGlvbiBoYXMgYmVlbiB1cGRhdGVkLlxuICBcdCAqL1xuICBmdW5jdGlvbiBfY2hlY2tfY2hhbmdlXyhsb2NhbF9maWVsZCwgZGlzdGFudCwgbWVzc2FnZV9pZl9jaGFuZ2VkKSB7XG4gICAgLy8gVE9ETyBjaGVjayBpZiB0aGlzIGlzIHRoZSB3YW50ZWQgYmVoYXZpb3VyOlxuICAgIC8vIElmIGRpc3RhbnQgaXMgdW5kZWZpbmVkIC0+IHdoYXQgdG8gZG8/XG4gICAgaWYgKGRpc3RhbnQgIT09IHVuZGVmaW5lZCAmJiB0aGlzW2xvY2FsX2ZpZWxkXSAhPT0gZGlzdGFudCkge1xuICAgICAgdGhpc1tsb2NhbF9maWVsZF0gPSBkaXN0YW50O1xuICAgICAgdGhpcy50cmlnZ2VyKG1lc3NhZ2VfaWZfY2hhbmdlZCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uKGlkLCB1cmksIHR5cGUsIGxhYmVsKSB7XG4gICAgLy8gYSBSZXNvdXJjZSBpcyBhbiBFdmVudEhhbmRsZXJcbiAgICBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICAgIC8vIERPQ1VNRU5URUQgQUJPVkVcbiAgICAvLyBBVFRSSUJVVEVTXG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMudXJpID0gdXJpO1xuICAgIHRoaXMubGFiZWwgPSBsYWJlbDtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIC8vIEFQSSBNRVRIT0RTXG4gICAgdGhpcy5nZXRfaWQgPSBnZXRfaWQ7XG4gICAgdGhpcy5nZXRfdXJpID0gZ2V0X3VyaTtcbiAgICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2ggPSBmb3JjZV9zdGF0ZV9yZWZyZXNoO1xuICAgIHRoaXMuZ2V0X3JlYWRfb25seSA9IGdldF9yZWFkX29ubHk7XG4gICAgdGhpcy5yZW1vdmUgPSByZW1vdmU7XG4gICAgdGhpcy5nZXRfbGFiZWwgPSBnZXRfbGFiZWw7XG4gICAgdGhpcy5zZXRfbGFiZWwgPSBzZXRfbGFiZWw7XG4gICAgdGhpcy5yZXNldF9sYWJlbCA9IHJlc2V0X2xhYmVsO1xuICAgIHRoaXMuZ2V0X2V0YWcgPSBnZXRfZXRhZztcbiAgICAvLyBoZWxwZXJcbiAgICB0aGlzLmdldF9yZXNvdXJjZV90eXBlID0gZ2V0X3Jlc291cmNlX3R5cGU7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXyA9IF9jaGVja19jaGFuZ2VfO1xuICAgIHRoaXMuc3RhcnRfYXV0b19yZWZyZXNoID0gc3RhcnRfYXV0b19yZWZyZXNoO1xuICAgIHRoaXMuc3RvcF9hdXRvX3JlZnJlc2ggPSBzdG9wX2F1dG9fcmVmcmVzaDtcbiAgICB0aGlzLmdldEFic29sdXRlVVJMRnJvbVJsYXRpdmU9Z2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn0pKCk7XG5cblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTUmVzb3VyY2U7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBLVEJTT2JzZWwgPSByZXF1aXJlKFwiLi9LVEJTLk9ic2VsLmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFRyYWNlIG9iamVjdCB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIEtUQlMuXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBUcmFjZSBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgdHJhY2UuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuS1RCUy5UcmFjZSBpcyBhIEphdmFzY3JpcHQgVHJhY2Ugb2JqZWN0XG4gKiB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUyB0cmFjZS4gVGhpcyBPYmplY3QgaW1wbGVtZW50cyB0aGUgS1RCUyBBUEkuXG4gKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0XG4gKiB0aGUgT2JzZWxzIGZyb20gdGhlIEtUQlMgdHJhY2UsIGNyZWF0ZSBuZXcgT2JzZWxzLCBldGMuXG4gKlxuICogTm90ZTogdGhpcyBUcmFjZSBvYmplY3QgZG9lcyBub3QgaW1wbGVtZW50IGFsbCB0aGUgbWV0aG9kc1xuICogYXZhaWxhYmxlIGluIHRoZSBLVEJTIEFQSSB5ZXQuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgY2xhc3MgZG8gbm90IHN1cHBvcnQgdHJhbnNmb3JtYXRpb25zLlxuICpcbiAqIEB0b2RvIEZ1bGx5IGltcGxlbWVudCBLVEJTIEFQSVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0dXJpXHRVUkkgb2YgdGhlIEtUQlMgdHJhY2UgdG8gbG9hZC5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0W2lkXVx0SUQgb2YgdGhlIEtUQlMgdHJhY2UgdG8gbG9hZC5cbiAqL1xudmFyIEtUQlNUcmFjZSA9IGZ1bmN0aW9uIFRyYWNlKHVyaSwgaWQpIHtcbiAgLy8gS1RCUy5UcmFjZSBpcyBhIFJlc291cmNlXG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgeyBpZCA9IHVyaTsgfVxuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBpZCwgdXJpLCAnQmFzZScsIFwiXCIpO1xuXG4gIHRoaXMudGVtcCA9IHt9OyAvLyBhdHRyaWJ1dGUgdXNlZCB0byBzdG9yZSBhY3Rpb25zIG1hZGUgYnkgdGhlIHVzZXIgb24gdGhlIHRyYWNlIHdoaWxlIG5vdCBrbm93aW5nIGlmIHRoZXkgYXJlIGFsbG93ZWQuIGUuZy4sIGNyZWF0ZV9vYnNlbCwgd2hlbiB3ZSBkb24ndCBrbm93IHlldCBpZiB0aGUgVHJhY2UgaXMgYSBTdG9yZWRUcmFjZSBiZWNhdXNlIHRoZSBLVEJTIGRpZG4ndCByZXBseSB5ZXQuXG4gIHRoaXMuZGVmYXVsdF9zdWJqZWN0ID0gXCJcIjtcbiAgdGhpcy5tb2RlbF91cmkgPSBcIlwiO1xuICB0aGlzLm9ic2VsX2xpc3RfdXJpID0gdXJpICsgXCJAb2JzZWxzXCI7XG4gIHRoaXMuYmFzZV91cmkgPSBcIlwiO1xuICB0aGlzLm9yaWdpbiA9IFwiXCI7XG4gIC8vdGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKDApKS5nZXRNaWxsaXNlY29uZHMoKTtcbiAgdGhpcy5vYnNlbF9saXN0ID0gW107IHRoaXMudHJhY2VTZXQgPSBbXTtcbiAgdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG59O1xuXG5LVEJTVHJhY2UucHJvdG90eXBlID0ge1xuICAvLy8vLy8vLy8vLyBPRkZJQ0lBTCBBUElcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgYmFzZSB3aGVyZSB0aGUgdHJhY2UgaXMgc3RvcmVkLlxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IFVSSSBvZiB0aGUgYmFzZSB3aGVyZSB0aGUgdHJhY2UgaXMgc3RvcmVkLlxuICBcdCAqL1xuICBnZXRfYmFzZTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZSh0aGlzLmdldF91cmkoKSx0aGlzLmJhc2VfdXJpKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgbW9kZWwgb2YgdGhlIHRyYWNlLlxuICBcdCAqIEByZXR1cm5zIHtNb2RlbH0gTW9kZWwgb2YgdGhlIHRyYWNlLlxuICBcdCAqIEB0b2RvIERFRklORSBXSEFUIElTIEEgTU9ERUxcbiAgXHQgKi9cbiAgZ2V0X21vZGVsOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHJldHVybiB0aGlzLmdldEFic29sdXRlVVJMRnJvbVJsYXRpdmUodGhpcy5nZXRfdXJpKCksdGhpcy5tb2RlbF91cmkpO1xuIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEdldHMgdGhlIG9yaWdpbiBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHJldHVybnMge09yaWdpbn0gT3JpZ2luIG9mIHRoZSB0cmFjZS5cbiAgXHQgKiBAdG9kbyBERUZJTkUgV0hBVCBJUyBBTiBPUklHSU5cbiAgXHQgKi9cbiAgZ2V0X29yaWdpbjogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiOyByZXR1cm4gdGhpcy5vcmlnaW47IH0sXG4gIC8vZ2V0X29yaWdpbl9vZmZzZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vcmlnaW5fb2Zmc2V0OyB9LFxuICAvKmt0YnNfb3JpZ2luX3RvX21zOiBmdW5jdGlvbihrdGJzX2RhdGVfc3RyKSB7XG4gIFx0XHR2YXIgWSA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDAsNCk7XG4gIFx0XHR2YXIgTSA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDUsMikgLSAxO1xuICBcdFx0dmFyIEQgPSBrdGJzX2RhdGVfc3RyLnN1YnN0cig4LDIpO1xuICBcdFx0dmFyIGggPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigxMSwyKTtcbiAgXHRcdHZhciBtID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMTQsMik7XG4gIFx0XHR2YXIgcyA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDE3LDIpO1xuICBcdFx0dmFyIG1zID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMjAsMyk7XG4gIFx0XHRyZXR1cm4gRGF0ZS5VVEMoWSxNLEQsaCxtLHMsbXMpO1xuICBcdH0sKi9cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBsaXN0X3NvdXJjZV90cmFjZXM6IGZ1bmN0aW9uKCkge30sXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgbGlzdF90cmFuc2Zvcm1lZF90cmFjZXM6IGZ1bmN0aW9uKCkge30sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIGxpc3Qgb2Ygb2JzZWxzIGluIGFuIG9wdGlvbmFsIHRpbWUgaW50ZXJ2YWwuXG4gIFx0ICogSWYgbm8gbWluaW11bSB0aW1lIGFuZCBubyBtYXhpbXVtIHRpbWUgY29uc3RyYWludCBhcmVcbiAgXHQgKiBkZWZpbmVkLCByZXR1cm5zIHRoZSB3aG9sZSBsaXN0IG9mIG9ic2Vscy5cbiAgXHQgKiBJZiBvbmUgb2YgdGhlIHR3byBjb25zdHJhaW50cyBhcmUgZGVmaW5lZCwgdGhlbiByZXR1cm5zXG4gIFx0ICogb2JzZWxzIG1hdGNoaW5nIHRoZSB0aW1lIGNvbnN0cmFpbnRzLlxuICBcdCAqXG4gIFx0ICogTm90ZTogaWYgYW4gb2JzZWwgb3ZlcmxhcHMgd2l0aCB0aGUgc3RhcnQgb3IgdGhlIGVuZFxuICBcdCAqIGNvbnN0cmFpbnQsIHRoZW4gaXQgd2lsbCBiZSBpbmNsdWRlZCAoZm9yIGluc3RhbmNlIGFuXG4gIFx0ICogb2JzZWwgdGhhdCBzdGFydHMgYmVmb3JlIHRoZSBzdGFydCBjb25zdHJhaW50IGFuZCBlbmRzXG4gIFx0ICogYWZ0ZXIgdGhhdCBjb25zdHJhaW50IHdpbGwgYmUgaW5jbHVkZWQpLlxuICBcdCAqXG4gIFx0ICogTm90ZTogdGhlIGxpc3QgcmV0dXJuZWQgYnkgdGhpcyBtZXRob2QgaXMgdGhlXG4gIFx0ICogbGlzdCBvZiBPYnNlbHMgdGhhdCBhcmUgbG9hZGVkIGxvY2FsbHkuXG4gIFx0ICogV2hlbiB0aGlzIG1ldGhvZCBpcyBjYWxsZWQsIGEgcXVlcnkgdG8gdGhlIEtUQlNcbiAgXHQgKiBpcyBtYWRlIHRvIGtub3cgaWYgdGhlcmUgYXJlIG90aGVyIE9ic2VscyBtYXRjaGluZ1xuICBcdCAqIHRoZSBxdWVyeS4gSWYgc28sIHRoZXNlIG90aGVyIG9ic2VscyB3aWxsIGJlIGxvYWRlZFxuICBcdCAqIGluIHRoZSBsb2NhbCBjb3B5IG9mIHRoZSB0cmFjZSBhbmQgYVxuICBcdCAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmNyZWF0ZTpvYnNlbHx0cmFjZTpjcmVhdGU6b2JzZWx9XG4gIFx0ICogZXZlbnQgb3IgYVxuICBcdCAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOnVwZGF0ZXx0cmFjZTp1cGRhdGV9XG4gIFx0ICogZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWQgdG8gbm90aWZ5IHRoYXQgb3RoZXJcbiAgXHQgKiBPYnNlbHMgaGF2ZSBiZWVuIGxvYWRlZC5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gW2JlZ2luXSBNaW5pbXVtIHRpbWUgY29uc3RyYWludFxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbZW5kXSBNYXhpbXVtIHRpbWUgY29uc3RyYWludFxuICBcdCAqIEBwYXJhbSB7Qm9vbGVhbn0gW3JldmVyc2U9ZmFsc2VdIFJldHVybnMgdGhlIG9ic2VsIGxpc3QgaW5cbiAgXHQgKiAgICAgcmV2ZXJzZSBjaHJvbm9sb2dpY2FsIG9yZGVyIGlmIHRydWUgYW5kIGluIG5vcm1hbFxuICBcdCAqICAgICBjaHJvbm9sb2dpY2FsIG9yZGVyIGlmIGZhbHNlLlxuICBcdCAqIEByZXR1cm5zIHtBcnJheS48T2JzZWw+fSBMaXN0IG9mIHJlbGV2YW50IG9ic2Vsc1xuICBcdCAqIEB0b2RvIFJFVkVSU0UgSVMgTk9UIFlFVCBUQUtFTiBJTlRPIEFDQ09VTlRcbiAgXHQgKi9cbiAgLy8gVE9ETyBhZGQgYW4gb3B0aW9uYWwgQ0FMTEJBQ0s/Pz9cbiAgbGlzdF9vYnNlbHM6IGZ1bmN0aW9uKGJlZ2luLCBlbmQsIHJldmVyc2UpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLm9ic2VsX2xpc3RfdXJpID0gdGhpcy51cmkgKyBcIkBvYnNlbHNcIjtcbiAgICBpZiAodGhpcy5vYnNlbF9saXN0X3VyaSA9PT0gXCJcIikge1xuICAgICAgY29uc29sZS5sb2coXCJFcnJvciBpbiBLVEJTOlRyYWNlOmxpc3Rfb2JzZWxzKCkgdW5rbm93biB1cmlcIik7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIE9CSiA9IHRoaXM7XG5cbiAgICAvL1x0XHQkLmdldEpTT04odGhpcy5vYnNlbF9saXN0X3VyaSx0aGlzLl9vbl9yZWZyZXNoX29ic2VsX2xpc3RfLmJpbmQodGhpcykpO1xuICAgIHZhciBPQkogPSB0aGlzO1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMub2JzZWxfbGlzdF91cmksLy8rJy5qc29uJyxcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIGRhdGE6IHttaW5iOiBiZWdpbiwgbWF4YjogZW5kLCByZXZlcnNlOiByZXZlcnNlfSxcbiAgICAgIHhockZpZWxkczogeyB3aXRoQ3JlZGVudGlhbHM6IHRydWUgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihYSFIpIHtcbiAgICAgICAgaWYgKFhIUi5zdGF0dXMgPT09ICc0MDEnKSB7XG4gICAgICAgICAgdmFyIGxpbmtoZWFkZXIgPSBYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0xpbmsnKTtcbiAgICAgICAgICB2YXIgZCA9IGxpbmtoZWFkZXIuc3BsaXQgKCcsJyk7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7aSA8IGQubGVuZ3RoO2krKykgICAgICAgICAge1xuICAgICAgICAgICAgdmFyIHNvdXNEID0gZFtpXS5zcGxpdCgnOycpO1xuICAgICAgICAgICAgaWYgKHNvdXNEWzFdID09PSBcIiByZWw9b2F1dGhfcmVzb3VyY2Vfc2VydmVyXCIpICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YXIgbGluayA9IHNvdXNEWzBdLnN1YnN0cigxLCBzb3VzRFswXS5sZW5ndGggLSAyKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc291c0RbMV0gPT09IFwiIHJlbD1zdWNjZXNzZnVsX2xvZ2luX3JlZGlyZWN0XCIpICAgICAgICAgICAge1xuICAgICAgICAgICAgICAvL1x0dmFyXHRVUkxTdWNjZXNzID0gc291c0RbMF0uc3Vic3RyKDIsc291c0RbMF0ubGVuZ3RoLTMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB3aW5kb3cub3BlbiAobGluaykgO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1x0aWYgKGRhdGEub2JzZWxzLmxlbmd0aCA+IDApXHR7T0JKLkJlZm9yZV9vbl9yZWZyZXNoX29ic2VsX2xpc3RfIChkYXRhKTt9XHR9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMub2JzZWxfbGlzdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgaWYgKGVuZCAmJiBvLmdldF9iZWdpbigpID4gZW5kKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGJlZ2luICYmIG8uZ2V0X2VuZCgpIDwgYmVnaW4pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfSxcblxuICBCZWZvcmVfb25fcmVmcmVzaF9vYnNlbF9saXN0XzogZnVuY3Rpb24oZGF0YVJlY3UpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvLyBwYXIgcGFxdWV0XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpDb25maWcnLCBkYXRhUmVjdSk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBlbmQgPSBOdW1iZXIoaSkgKyBOdW1iZXIoMTAwKTtcblxuICAgIGlmIChkYXRhUmVjdS5vYnNlbHMpIHt0aGlzLl9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAoZGF0YVJlY3Uub2JzZWxzLCBpLCBlbmQpO30gICAgZWxzZSB7IHRoaXMuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cChkYXRhUmVjdSwgaSwgZW5kKTt9XG5cblxuICB9LFxuICBfb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwOiBmdW5jdGlvbihkYXRhUmVjdSwgaSwgZW5kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICB2YXIgZCA9IGRhdGFSZWN1Lmxlbmd0aCAtIE51bWJlcigxKTtcbiAgICB2YXIgRGF0YU8gPSBkYXRhUmVjdS5zbGljZSAoaSwgZW5kKTtcbiAgICBjb25zb2xlLmxvZyAoJ19vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAnKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgRGF0YU8uZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgY291bnQgKys7XG4gICAgICB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfKGVsKTtcbiAgICAgIHZhciBPYmpldCA9IHRoaXM7XG4gICAgICBpZiAoY291bnQgPT09IERhdGFPLmxlbmd0aCkgICAgICB7XG4gICAgICAgIHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlVCcpO1xuICAgICAgICBpID0gTnVtYmVyKGkpICsgRGF0YU8ubGVuZ3RoICsgTnVtYmVyKDEpO1xuICAgICAgICBlbmQgPSBOdW1iZXIoaSkgKyBOdW1iZXIoMTAwKTtcbiAgICAgICAgaWYgKGVuZCA+IGRhdGFSZWN1Lmxlbmd0aCkge2VuZCA9IGRhdGFSZWN1Lmxlbmd0aCAtIE51bWJlcigxKTt9XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKChpIDw9IGQpICYmIChlbmQgPD0gZCkpIHtcbiAgICAgICAgICAgIE9iamV0Ll9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAoZGF0YVJlY3UsIGksIGVuZCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoYXQudHJpZ2dlcigndHJhY2U6dXBkYXRlQ29tcGxldGVkJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAyMDAwKTtcblxuICAgICAgICAkKFwiI3dhaXRpbmdcIikuaGlkZSgpO1xuXG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG5cbiAgfSxcblxuICBfb25fcmVmcmVzaF9vYnNlbF9saXN0XzogZnVuY3Rpb24oZGF0YSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBjb3VudCA9IDA7XG5cbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWwpIHtcbiAgICAgIGNvdW50ICsrO1xuICAgICAgdGhpcy5fcGFyc2VfZ2V0X29ic2VsXyhlbCk7XG4gICAgICBpZiAoY291bnQgPT09IGRhdGEubGVuZ3RoKSAgICAgIHt0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZVQnLCB0aGlzKTt9XG4gICAgfSwgdGhpcyk7XG5cblxuICB9LFxuXG4gIGdldF9MYXN0X29ic2VsOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgb2JzO1xuICAgIHZhciBtYXggPSAwO1xuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmdldF9iZWdpbigpID4gbWF4KSB7IG9icyA9IG87IH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JzO1xuICB9LFxuICBnZXRfRmlyc3Rfb2JzZWw6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnM7XG4gICAgdmFyIG1pbjEgPSA5OTk5OTk5OTk5OTk5O1xuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmdldF9iZWdpbigpIDwgbWluMSkgeyBvYnMgPSBvOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9icztcbiAgfSxcbiAgZ2V0X0xpc3Rfb2JzZWxfUGFyVHlwZTogZnVuY3Rpb24ob2JzZWxUeXBlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGxpc3RlID0gW107XG5cbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby50eXBlID09PSBvYnNlbFR5cGUpIHsgbGlzdGUucHVzaChvKTsgfVxuICAgIH0pO1xuICAgIHJldHVybiBsaXN0ZTtcbiAgfSxcblxuXG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IEZvcmNlcyB0aGUgbG9jYWwgb2JzZWwgbGlzdCB0byBiZSBzeW5jaHJvbmlzZWRcbiAgXHQgKiB3aXRoIHRoZSBLVEJTIGF0IGEgZ2l2ZW4gcmVmcmVzaGluZyByYXRlLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBwZXJpb2QgVGltZSBpbiBzZWNvbmRzIGJldHdlZW4gdHdvIHN5bmNocm9uaXNhdGlvbnMuXG4gIFx0ICovXG4gIHN0YXJ0X2F1dG9fcmVmcmVzaF9vYnNlbF9saXN0OiBmdW5jdGlvbihwZXJpb2QpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgYSA9IHRoaXMuYXV0b19yZWZyZXNoX29ic2VsX2xpc3RfaWQ/dGhpcy5zdG9wX2F1dG9fcmVmcmVzaF9vYnNlbF9saXN0KCk6bnVsbDtcbiAgICB0aGlzLmF1dG9fcmVmcmVzaF9vYnNlbF9saXN0X2lkID0gd2luZG93LnNldEludGVydmFsKHRoaXMubGlzdF9vYnNlbHMuYmluZCh0aGlzKSwgcGVyaW9kICogMTAwMCk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFN0b3BzIHRoZSBhdXRvcmVmcmVzaCBzeW5jaHJvbmlzYXRpb25cbiAgXHQgKiBvZiB0aGUgb2JzZWwgbGlzdC5cbiAgXHQgKi9cbiAgc3RvcF9hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuYXV0b19yZWZyZXNoX29ic2VsX2xpc3RfaWQpIHtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICAgIGRlbGV0ZSh0aGlzLmF1dG9fcmVmcmVzaF9pZCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICBcdCAqIFJldHJpZXZlIGFuIG9ic2VsIGluIHRoZSB0cmFjZSBmcm9tIGl0cyBJRC5cbiAgXHQgKiBJZiB0aGUgb2JzZWwgZG9lcyBub3QgZXhpc3QgbG9jYWxseSwgcmV0dXJuc1xuICBcdCAqIHVuZGVmaW5lZCBhbmQgc2VuZCBhIHF1ZXJ5IHRvIHRoZSBLVEJTXG4gIFx0ICogKHdoaWNoIHdpbGwgcmVzdWx0IGluIGFkZGluZyB0aGlzIG9ic2VsIGxvY2FsbHlcbiAgXHQgKiBpZiBpdCBleGlzdHMgb24gdGhlIEtUQlMpLlxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBpZCBJRCBvZiB0aGUgT2JzZWwgdG8gcmV0cmlldmVcbiAgXHQgKiBAcmV0dXJucyB7T2JzZWx9IE9ic2VsIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhpcyBJRFxuICBcdCAqICAgICBvciB1bmRlZmluZWQgaWYgdGhlIG9ic2VsIHdhcyBub3QgZm91bmQuXG4gIFx0ICogQHRvZG8gVE9ETyBhZGQgYW4gb3B0aW9uYWwgQ0FMTEJBQ0tcbiAgXHQgKi9cbiAgZ2V0X29ic2VsOiBmdW5jdGlvbihpZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnM7XG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uZ2V0X2lkKCkgPT09IGlkKSB7IG9icyA9IG87IH1cbiAgICB9KTtcbiAgICBpZiAob2JzID09PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIHNlbmRzIGEgcXVlcnkgdG8gZmluZCB0aGUgb2JzZWxcbiAgICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgLy8gVE9ETyBpZGVhbGx5IEpTT04uLi4gV2hlbiBLVEJTIHN1cHBvcnRzIGl0IVxuICAgICAgICB1cmw6IHRoaXMudXJpICsgaWQsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICBzdWNjZXNzOiB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfLmJpbmQodGhpcyksXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG9icztcbiAgfSxcbiAgLyoqXG4gIFx0ICogQ2FsbGJhY2sgZm9yIHF1ZXJpZXMgd2hlcmUgYW4gb2JzZWwgaXMgZXhwZWN0ZWQgYXMgYSByZXN1bHRcbiAgXHQgKiBQYXJzZXMgdGhlIEpTT04gZGF0YSBmcm9tIHRoZSBLVEJTIHRvIGNyZWF0ZSBhIG5ldyBPYnNlbCBsb2NhbGx5XG4gIFx0ICogaWYgaXQgZG9lc24ndCBleGlzdCBhbHJlYWR5LlxuICBcdCAqIEBwcml2YXRlXG4gIFx0ICovXG4gIF9wYXJzZV9nZXRfb2JzZWxfOiBmdW5jdGlvbihkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnMgPSB7XG4gICAgICBhdHRyaWJ1dGVzOiB7fVxuICAgIH07XG5cbiAgICAvLyBPQlNFTCBJRFxuICAgIG9icy5pZCA9IGRhdGFbXCJAaWRcIl07XG4gICAgaWYgKHRoaXMudHlwZSA9PT0gXCJDb21wdXRlZFRyYWNlXCIpIHtvYnMuaWQgPSBvYnMudHlwZSArIFwiX1wiICsgb2JzLmlkO31cbiAgICBpZiAob2JzLmlkLnN1YnN0cigwLCAyKSA9PT0gXCIuL1wiKSB7IG9icy5pZCA9IG9icy5pZC5zdWJzdHIoMik7IH1cblxuICAgIC8vIE9CU0VMIFRSQUNFXG4gICAgLy8gZGF0YS5oYXNUcmFjZTtcbiAgICBvYnMudHJhY2UgPSB0aGlzO1xuXG4gICAgLy8gT0JTRUwgVFlQRVxuICAgIC8vIGRhdGFbXCJAdHlwZVwiXTsgLy8gVE9ETyBCVUcgS1RCUyAtPiBVU0UgXCJtOnR5cGVcIiBpbnN0ZWFkXG4gICAgLy8gZGF0YVtcIm06dHlwZVwiXTtcbiAgICBvYnMudHlwZSA9IGRhdGFbXCJAdHlwZVwiXS5zdWJzdHIoMik7XG5cbiAgICBpZiAoZGF0YS5oYXNPd25Qcm9wZXJ0eSgnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJykpIHtcbiAgICAgIG9icy5sYWJlbCA9IGRhdGFbJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbCddO1xuICAgIH1cbiAgICAvL29icy5iZWdpbiA9IGRhdGEuYmVnaW47XG4gICAgLy9vYnMuZW5kID0gZGF0YS5lbmQ7XG4gICAgdmFyIGQgPSBuZXcgRGF0ZSAodGhpcy5vcmlnaW4pO1xuICAgIG9icy5iZWdpbiA9IGQuZ2V0VGltZSgpICsgZGF0YS5iZWdpbiA7XG4gICAgb2JzLmVuZCA9IGQuZ2V0VGltZSgpICsgZGF0YS5lbmQ7XG5cbiAgICAvLyBERUxFVElORyBQUk9QRVJUSUVTIFRIQVQgSEFWRSBBTFJFQURZIEJFRU4gQ09QSUVEXG4gICAgZGVsZXRlIGRhdGFbXCJAaWRcIl07XG4gICAgZGVsZXRlIGRhdGEuaGFzVHJhY2U7XG4gICAgZGVsZXRlIGRhdGFbXCJAdHlwZVwiXTtcbiAgICBkZWxldGUgZGF0YS5iZWdpbjtcbiAgICBkZWxldGUgZGF0YS5lbmQ7XG4gICAgZGVsZXRlIGRhdGFbJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbCddO1xuICAgIC8vZGVsZXRlIGRhdGFbXCJtOnR5cGVcIl07XG5cblxuICAgIC8vIEFUVFJJQlVURVNcbiAgICBmb3IgKHZhciBhdHRyIGluIGRhdGEpIHtcbiAgICAgIGlmIChhdHRyLnN1YnN0cigwLCAyKSA9PT0gXCJtOlwiKSB7IC8vIFRPRE8gdGhpcyBpcyBub3QgZ2VuZXJpYyEhISFcbiAgICAgICAgb2JzLmF0dHJpYnV0ZXNbYXR0ci5zdWJzdHIoMildID0gZGF0YVthdHRyXTtcbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhkYXRhLG9icyk7XG4gICAgdmFyIG8gPSBuZXcgS1RCU09ic2VsKG9icyk7XG4gICAgaWYgKCF0aGlzLl9jaGVja19vYnNlbF9sb2FkZWRfKG8pKSB7IC8vIFRPRE8gZmlyc3QgYXBwcm94aW1hdGlvblxuICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCBvKTtcbiAgICB9XG4gIH0sXG5cbiAgLy8vLy8vLy8vLy9cbiAgLyoqXG4gIFx0ICogT3ZlcmxvYWRzIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5LVEJTLlJlc291Y2UjX29uX3N0YXRlX3JlZnJlc2hffSBtZXRob2QuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKi9cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgLy9cdFx0Y29uc29sZS5sb2coZGF0YSk7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5fY2hlY2tfYW5kX3VwZGF0ZV90cmFjZV90eXBlXyhkYXRhWydAdHlwZSddKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdkZWZhdWx0X3N1YmplY3QnLCBkYXRhLmhhc0RlZmF1bHRTdWJqZWN0LCAnJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnbW9kZWxfdXJpJywgZGF0YS5oYXNNb2RlbCwgJ3RyYWNlOm1vZGVsJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnb2JzZWxfbGlzdF91cmknLCBkYXRhLmhhc09ic2VsTGlzdCwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2Jhc2VfdXJpJywgZGF0YS5pbkJhc2UsICd0cmFjZTpiYXNlJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnb3JpZ2luJywgZGF0YS5vcmlnaW4sICd0cmFjZTp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdsYWJlbCcsIGRhdGEubGFiZWwsICd0cmFjZTp1cGRhdGUnKTtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZURhdGEnLCBkYXRhKTtcbiAgICAvL3RoaXMuX2NoZWNrX2NoYW5nZV8oJ29yaWdpbl9vZmZzZXQnLHRoaXMua3Ric19vcmlnaW5fdG9fbXMoZGF0YS5vcmlnaW4pLCcnKTtcbiAgfSxcbiAgX3VwZGF0ZV9tZXRob2RfOiBmdW5jdGlvbih0cmFjZV90eXBlLCBtZXRob2RfbmFtZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXNbbWV0aG9kX25hbWVdID0gdGhpc1t0cmFjZV90eXBlICsgXCJfbWV0aG9kc1wiXVttZXRob2RfbmFtZV07XG4gICAgaWYgKHRoaXMudGVtcFttZXRob2RfbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy50ZW1wW21ldGhvZF9uYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKHBhcmFtKSB7XG4gICAgICAgIHRoaXNbbWV0aG9kX25hbWVdKHBhcmFtKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH1cbiAgfSxcbiAgX2NoZWNrX2FuZF91cGRhdGVfdHJhY2VfdHlwZV86IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy50eXBlICE9PSB0eXBlKSB7XG4gICAgICBmb3IgKHZhciBtZXRob2RfbmFtZSBpbiB0aGlzW3R5cGUgKyBcIl9tZXRob2RzXCJdKSB7XG4gICAgICAgIGlmICh0aGlzW3R5cGUgKyBcIl9tZXRob2RzXCJdLmhhc093blByb3BlcnR5KG1ldGhvZF9uYW1lKSkgICAgICAgIHt0aGlzLl91cGRhdGVfbWV0aG9kXyh0eXBlLCBtZXRob2RfbmFtZSk7fVxuICAgICAgfVxuICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB9XG4gIH0sXG4gIC8vLy8vLy8vLy8vXG4gIC8qXHRfb25fcmVmcmVzaF9vYnNlbF9saXN0XzogZnVuY3Rpb24oZGF0YSkge1xuICAvL1x0XHRjb25zb2xlLmxvZyhkYXRhKTtcbiAgXHRcdHZhciBpZCwgbGFiZWwsIHR5cGUsIGJlZ2luLCBlbmQsIGF0dHJpYnV0ZXMsIG9icztcbiAgXHRcdHZhciBuZXdfb2JzZWxfbG9hZGVkID0gZmFsc2U7XG4gIFx0XHRkYXRhLm9ic2Vscy5mb3JFYWNoKGZ1bmN0aW9uKGVsLGtleSkge1xuICBcdFx0XHR0aGlzLl9wYXJzZV9nZXRfb2JzZWxfKGVsKTtcbiAgLypcbiAgXHRcdFx0dmFyIGF0dHIgPSB7fTtcbiAgXHRcdFx0YXR0ci5pZCA9IGVsWydAaWQnXTtcbiAgXHRcdFx0YXR0ci50cmFjZSA9IHRoaXM7XG4gIFx0XHRcdGF0dHIubGFiZWwgPSBlbFsnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ10gfHwgdW5kZWZpbmVkO1xuICBcdFx0XHRhdHRyLnR5cGUgPSBlbFsnQHR5cGUnXTtcbiAgXHRcdFx0YXR0ci5iZWdpbiA9IGVsWydiZWdpbiddO1xuICBcdFx0XHRhdHRyLmVuZCA9IGVsWydlbmQnXTtcbiAgXHRcdFx0YXR0ci5hdHRyaWJ1dGVzID0gZWw7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ0BpZCddKTtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydAdHlwZSddKTtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snYmVnaW4nXSk7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ2VuZCddKTtcbiAgXHRcdFx0b2JzID0gbmV3IFNhbW90cmFjZXMuS1RCUy5PYnNlbChhdHRyKTtcblxuICBcdFx0XHRpZighIHRoaXMuX2NoZWNrX29ic2VsX2xvYWRlZF8ob2JzKSkge1xuICBcdFx0XHRcdG5ld19vYnNlbF9sb2FkZWQgPSB0cnVlO1xuICBcdFx0XHR9XG4qL1xuICAvL30sdGhpcyk7XG4gIC8qXHRcdGlmKG5ld19vYnNlbF9sb2FkZWQpIHtcbiAgXHRcdFx0dGhpcy50cmlnZ2VyKCd0cmFjZTp1cGRhdGUnLHRoaXMudHJhY2VTZXQpO1xuICBcdFx0fVxuKi9cbiAgLy99LCovXG4gIF9jaGVja19vYnNlbF9sb2FkZWRfOiBmdW5jdGlvbihvYnMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5vYnNlbF9saXN0LnNvbWUoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIG8uZ2V0X2lkKCkgPT09IG9icy5nZXRfaWQoKTsgLy8gZmlyc3QgYXBwcm94aW1hdGlvbjogb2JzZWwgaGFzIHRoZSBzYW1lIElEID0+IGl0IGlzIGFscmVhZHkgbG9hZGVkLi4uIFdlIGRvbid0IGNoZWNrIGlmIHRoZSBvYnNlbCBoYXMgY2hhbmdlZCFcbiAgICB9KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2JzZWxfbGlzdC5wdXNoKG9icyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9LFxuICBTdG9yZWRUcmFjZV9tZXRob2RzOiB7XG4gICAgc2V0X21vZGVsOiBmdW5jdGlvbihtb2RlbCkge30sXG4gICAgc2V0X29yaWdpbjogZnVuY3Rpb24ob3JpZ2luKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIHRoaXMub3JpZ2luID0gb3JpZ2luO1xuICAgICAgLy9cdHRoaXMub3JpZ2luX29mZnNldCA9IChuZXcgRGF0ZShvcmlnaW4pKS5nZXRNaWxsaXNlY29uZHMoKTtcbiAgICAgIC8vIFRPRE8gc3luYyB3aXRoIEtUQlNcbiAgICB9LFxuICAgIGdldF9kZWZhdWx0X3N1YmplY3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0X3N1YmplY3Q7XG4gICAgfSxcbiAgICBzZXRfZGVmYXVsdF9zdWJqZWN0OiBmdW5jdGlvbihzdWJqZWN0KSB7fSxcbiAgICBjcmVhdGVfb2JzZWw6IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgLy8gTE9DQUwgVFJBQ0VcbiAgICAgIC8vdmFyIG9icyA9IG5ldyBTYW1vdHJhY2VzLk9ic2VsKG9ic2VsX3BhcmFtcyk7XG4gICAgICAvLyBLVEJTIEJPR1VFXG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIHZhciBqc29uX29ic2VsID0ge1xuICAgICAgICBcIkBjb250ZXh0XCI6XHRbXG4gICAgICAgIFwiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9rdGJzLWpzb25sZC1jb250ZXh0XCIsXG4gICAgICAgICAgICAgICB7IFwibVwiOiBcImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEvc2ltcGxlLXRyYWNlLW1vZGVsI1wiIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJAdHlwZVwiOlx0XCJtOlwiICsgcGFyYW1zLnR5cGUsIC8vIGZpeGVkOiBcIlNpbXBsZU9ic2VsXCIsIC8vIFRPRE8gS1RCUyBCVUcgVE8gRklYXG4gICAgICAgIGhhc1RyYWNlOlx0XCJcIixcbiAgICAgICAgc3ViamVjdDpcdHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIik/cGFyYW1zLnN1YmplY3Q6dGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCksXG4gICAgICAgIC8vXCJtOnR5cGVcIjpcdHBhcmFtcy50eXBlXG4gICAgICB9O1xuICAgICAgLy9jb25zb2xlLmxvZyhwYXJhbXMuaGFzT3duUHJvcGVydHkoXCJzdWJqZWN0XCIpP3BhcmFtcy5zdWJqZWN0OnRoaXMuZ2V0X2RlZmF1bHRfc3ViamVjdCgpLHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIikscGFyYW1zLnN1YmplY3QsdGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCkpO1xuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImJlZ2luXCIpKSB7IGpzb25fb2JzZWwuYmVnaW4gPSBwYXJhbXMuYmVnaW47IH1cbiAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoXCJlbmRcIikpIHsganNvbl9vYnNlbC5iZWdpbiA9IHBhcmFtcy5lbmQ7fVxuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImF0dHJpYnV0ZXNcIikpIHtcbiAgICAgICAgZm9yICh2YXIgYXR0ciBpbiBwYXJhbXMuYXR0cmlidXRlcykge1xuICAgICAgICAgIGlmIChwYXJhbXMuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkgICAgICAgICAge2pzb25fb2JzZWxbXCJtOlwiICsgYXR0cl0gPSBwYXJhbXMuYXR0cmlidXRlc1thdHRyXTt9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIF9vbl9jcmVhdGVfb2JzZWxfc3VjY2Vzc18oZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgLypcbiAgICAgICAgXHRcdFx0XHR2YXIgdXJsID0ganFYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0xvY2F0aW9uJyk7XG4gICAgICAgIFx0XHRcdFx0dmFyIHVybF9hcnJheSA9IHVybC5zcGxpdCgnLycpO1xuICAgICAgICBcdFx0XHRcdCovXG5cbiAgICAgICAgdmFyIHVybF9hcnJheSA9IGRhdGEuc3BsaXQoJy8nKTtcbiAgICAgICAgdmFyIG9ic2VsX2lkID0gdXJsX2FycmF5W3VybF9hcnJheS5sZW5ndGggLSAxXTtcbiAgICAgICAgLy90aGlzLmdldF9vYnNlbChvYnNlbF9pZCk7XG4gICAgICAgIC8vIE9wdGltaXNhdGlvbjogZG8gbm90IGRvIGEgR0VUIHF1ZXJ5IHRvIGdldCB0aGUgT0JTRUxcbiAgICAgICAgLy8gVGhlIE9ic2VsIHBhcmFtZXRlcnMgYXJlIGFscmVhZHkga25vd24gaW4gcGFyYW1cbiAgICAgICAgLy8gV2UganVzdCBuZWVkIHRvIGFkZCB0aGUgSUQuXG4gICAgICAgIHBhcmFtcy5pZCA9IG9ic2VsX2lkO1xuICAgICAgICBwYXJhbXMudHJhY2UgPSB0aGlzO1xuICAgICAgICB2YXIgbyA9IG5ldyBLVEJTT2JzZWwocGFyYW1zKTtcbiAgICAgICAgaWYgKCF0aGlzLl9jaGVja19vYnNlbF9sb2FkZWRfKG8pKSB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCBvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICBzdWNjZXNzOiBfb25fY3JlYXRlX29ic2VsX3N1Y2Nlc3NfLmJpbmQodGhpcyksXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KGpzb25fb2JzZWwpXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG5cbiAgQ29tcHV0ZWRUcmFjZV9tZXRob2RzOiB7XG4gICAgc2V0X21ldGhvZDogZnVuY3Rpb24obWV0aG9kKSB7fSxcbiAgICBsaXN0X3BhcmFtZXRlcnM6IGZ1bmN0aW9uKGluY2x1ZGVfaW5oZXJpdGVkKSB7fSxcbiAgICBnZXRfcGFyYW1ldGVyOiBmdW5jdGlvbihrZXkpIHt9LFxuICAgIHNldF9wYXJhbWV0ZXI6IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHt9LFxuICAgIGRlbF9wYXJhbWV0ZXI6IGZ1bmN0aW9uKGtleSkge31cbiAgfSxcblxuICAvLyBURU1QT1JBUlkgTUVUSE9EU1xuICBjcmVhdGVfb2JzZWw6IGZ1bmN0aW9uKG9ic2VsX3BhcmFtcykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICghdGhpcy5jcmVhdGVfb2JzZWwuaGFzT3duUHJvcGVydHkoJ2NyZWF0ZV9vYnNlbCcpKSB7XG4gICAgICB0aGlzLnRlbXAuY3JlYXRlX29ic2VsID0gW107XG4gICAgfVxuICAgIHRoaXMudGVtcC5jcmVhdGVfb2JzZWwucHVzaCAob2JzZWxfcGFyYW1zKTtcbiAgfSxcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTVHJhY2U7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBLVEJTQmFzZSA9IHJlcXVpcmUoXCIuL0tUQlMuQmFzZS5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuLyoqXG4qIEBzdW1tYXJ5IEphdmFzY3JpcHQgS1RCUyBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuXG4qIEBjbGFzcyBKYXZhc2NyaXB0IEtUQlMgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLlxuKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuKiBAY29uc3RydWN0b3JcbiogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiogQGRlc2NyaXB0aW9uXG4qIFNhbW90cmFjZXMuS1RCUyBpcyBhIEphdmFzY3JpcHQgS1RCUyBvYmplY3QgdGhhdFxuKiBpcyBib3VuZCB0byBhIEtUQlMuIFRoaXMgT2JqZWN0IGltcGxlbWV0bnMgdGhlIEtUQlMgQVBJLlxuKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0IHRoZSBsaXN0IG9mIGJhc2VzXG4qIGF2YWlsYWJsZSBpbiB0aGUgS1RCUy4gQWNjZXNzIGEgc3BlY2lmaWMgYmFzZSwgZXRjLlxuKlxuKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRvIGxvYWQuXG4qL1xudmFyIEtUQlMgPSBmdW5jdGlvbiBLVEJTKHVyaSkge1xuICAvLyBLVEJTIGlzIGEgUmVzb3VyY2VcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIHVyaSwgdXJpLCAnS1RCUycsIFwiXCIpO1xuICB0aGlzLmJhc2VzID0gW107XG4gIHRoaXMuYnVpbHRpbl9tZXRob2RzID0gW107XG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xufTtcblxuS1RCUy5wcm90b3R5cGUgPSB7XG4gIC8vLy8vLy8vLy8vIE9GRklDSUFMIEFQSVxuICAvKipcbiAgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4qL1xuICBsaXN0X2J1aWx0aW5fbWV0aG9kczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuKi9cbiAgZ2V0X2J1aWx0aW5fbWV0aG9kOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiB0aGUgVVJJIG9mIHRoZSBiYXNlcyBjb250YWluZWQgaW4gdGhlIEtUQlNcbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gQXJyYXkgb2YgVVJJIG9mIGJhc2VzLlxuKi9cbiAgbGlzdF9iYXNlczogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuYmFzZXM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIEtUQlMuQmFzZSB3aXRoIHRoZSBnaXZlbiBJRC5cbiAgKiBAcmV0dXJucyBTYW1vdHJhY2VzLktUQlMuQmFzZSBCYXNlIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIElEXG4gICogQHBhcmFtIGlkIHtTdHJpbmd9IFVSSSBvZiB0aGUgYmFzZVxuKi9cbiAgZ2V0X2Jhc2U6IGZ1bmN0aW9uKGlkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIG5ldyBLVEJTQmFzZSh0aGlzLnVyaSArIGlkLCBpZCk7XG4gIH0sXG4gIC8qKlxuICAqIENyZWF0ZSBhIG5ldyBiYXNlLlxuICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBVUkkgb2YgdGhlIGJhc2UgKG9wdGlvbmFsKVxuICAqIEBwYXJhbSBsYWJlbCB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgYmFzZSAob3B0aW9uYWwpXG4qL1xuICBjcmVhdGVfYmFzZTogZnVuY3Rpb24oaWQsIGxhYmVsKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5ld19iYXNlID0ge1xuICAgICAgXCJAY29udGV4dFwiOlx0XCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgIFwiQHR5cGVcIjpcdFwiQmFzZVwiLFxuICAgICAgXCJAaWRcIjpcdFx0aWQgKyBcIi9cIixcbiAgICAgIFwibGFiZWxcIjpcdGxhYmVsXG4gICAgfTtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXdfYmFzZSksXG4gICAgICBzdWNjZXNzOiB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3F1ZXJ5IGVycm9yJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgLy8vLy8vLy8vLy9cbiAgLyoqXG4gICogT3ZlcmxvYWRzIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5LVEJTLlJlc291Y2UjX29uX3N0YXRlX3JlZnJlc2hffSBtZXRob2QuXG4gICogQHByaXZhdGVcbiovXG4gIF9vbl9zdGF0ZV9yZWZyZXNoXzogZnVuY3Rpb24oZGF0YSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2Jhc2VzJywgZGF0YS5oYXNCYXNlLCAna3Riczp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdidWlsdGluX21ldGhvZHMnLCBkYXRhLmhhc0J1aWxkaW5NZXRob2QsICdrdGJzOnVwZGF0ZScpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTO1xuIiwidmFyIE9ic2VsID0gcmVxdWlyZShcIi4vT2JzZWwuanNcIik7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IEphdmFzY3JpcHQgVHJhY2UgT2JqZWN0LlxuICogQGNsYXNzIEphdmFzY3JpcHQgVHJhY2UgT2JqZWN0LlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5UcmFjZVxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLkRlbW9UcmFjZSBpcyBhIEphdmFzY3JpcHQgVHJhY2Ugb2JqZWN0LlxuICogTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIGdldFxuICogdGhlIE9ic2VscyBmcm9tIHRoZSB0cmFjZSwgY3JlYXRlIG5ldyBPYnNlbHMsIGV0Yy5cbiAqXG4gKiBUaGUgdHJhY2UgaXMgaW5pdGlhbGlzZWQgZW1wdHkuIE9ic2VscyBoYXZlIHRvIGJlIGNyZWF0ZWRcbiAqIGJ5IHVzaW5nIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5EZW1vVHJhY2UjbmV3T2JzZWx9IG1ldGhvZC5cbiAqL1xudmFyIExvY2FsVHJhY2UgPSBmdW5jdGlvbihzb3VyY2VfdHJhY2VzKSB7XG4gIC8vIEFkZGludCB0aGUgT2JzZXJ2YWJsZSB0cmFpdFxuICBcInVzZSBzdHJpY3RcIjtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG5cbiAgLyogTm9tYnJlIGQnb2JzZWxzIGRhbnMgbGEgdHJhY2UgKi9cbiAgdGhpcy5jb3VudCA9IDA7IC8vIHNlcnQgZCdJRCBwb3VyIGxlIHByb2NoYWluIG9ic2VydsOpLlxuICAvKiBBcnJheSBkJ29ic2VscyAqL1xuICB0aGlzLm9ic2VsX2xpc3QgPSBbXTtcbiAgdGhpcy5zb3VyY2VfdHJhY2VzID0gKHNvdXJjZV90cmFjZXMgIT09IHVuZGVmaW5lZCk/c291cmNlX3RyYWNlczpbXTtcbiAgdGhpcy5zb3VyY2VfdHJhY2VzLmZvckVhY2goZnVuY3Rpb24odCkge1xuICAgIHQudHJhbnNmb3JtZWRfdHJhY2VzLnB1c2godGhpcyk7XG4gIH0pO1xuICB0aGlzLnRyYW5zZm9ybWVkX3RyYWNlcyA9IFtdO1xuICB0aGlzLm9yaWdpbiA9IFwiXCI7XG4gIC8vdGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKDApKS5nZXRNaWxsaXNlY29uZHMoKTtcblxufTtcblxuTG9jYWxUcmFjZS5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEdldHMgdGhlIGxhYmVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IExhYmVsIG9mIHRoZSB0cmFjZVxuICBcdCAqL1xuICBnZXRfbGFiZWw6IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy5sYWJlbDsgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogU2V0cyB0aGUgbGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGxibCBMYWJlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKi9cbiAgc2V0X2xhYmVsOiBmdW5jdGlvbihsYmwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLmxhYmVsID0gbGJsO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6ZWRpdF9tZXRhJyk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJlc2V0cyB0aGUgbGFiZWwgdG8gdGhlIGVtcHR5IHN0cmluZ1xuICBcdCAqL1xuICByZXNldF9sYWJlbDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5sYWJlbCA9IFwiXCI7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcblxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBSZXR1cm5zIHRoZSBtb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcmV0dXJucyBNb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAdG9kbyBVUERBVEUgV0hBVCBJUyBBIE1PREVMXG4gIFx0ICovXG4gIGdldF9tb2RlbDogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO3JldHVybiB0aGlzLm1vZGVsOyB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBSZXR1cm5zIHRoZSBvcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHJldHVybnMgT3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEB0b2RvIFVQREFURSBXSEFUIElTIEFOIE9SSUdJTlxuICBcdCAqL1xuICBnZXRfb3JpZ2luOiBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIHRoaXMub3JpZ2luOyB9LFxuICAvL2dldF9vcmlnaW5fb2Zmc2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMub3JpZ2luX29mZnNldDsgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgc291cmNlIHRyYWNlcyBvZiB0aGlzIHRyYWNlXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxUcmFjZT59IFNvdXJjZSB0cmFjZXMgb2YgdGhpcyB0cmFjZS5cbiAgXHQgKi9cbiAgbGlzdF9zb3VyY2VfdHJhY2VzOiBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIHRoaXMuc291cmNlX3RyYWNlczsgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgdHJhY2VzIHRyYW5zZm9ybWVkIGZyb20gdGhpcyB0cmFjZVxuICBcdCAqIEByZXR1cm5zIHtBcnJheS48VHJhY2U+fSBUcmFjZSB0cmFuc2Zvcm1lZCBmcm9tIHRoaXMgdHJhY2VcbiAgXHQgKi9cbiAgbGlzdF90cmFuc2Zvcm1lZF90cmFjZXM6IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy50cmFuc2Zvcm1lZF90cmFjZXM7IH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIGxpc3Qgb2Ygb2JzZWxzIGluIGFuIG9wdGlvbmFsIHRpbWUgaW50ZXJ2YWwuXG4gIFx0ICogSWYgbm8gbWluaW11bSB0aW1lIGFuZCBubyBtYXhpbXVtIHRpbWUgY29uc3RyYWludCBhcmVcbiAgXHQgKiBkZWZpbmVkLCByZXR1cm5zIHRoZSB3aG9sZSBsaXN0IG9mIG9ic2Vscy5cbiAgXHQgKiBJZiBvbmUgb2YgdGhlIHR3byBjb25zdHJhaW50cyBhcmUgZGVmaW5lZCwgdGhlbiByZXR1cm5zXG4gIFx0ICogb2JzZWxzIG1hdGNoaW5nIHRoZSB0aW1lIGNvbnN0cmFpbnRzLlxuICBcdCAqXG4gIFx0ICogTm90ZTogaWYgYW4gb2JzZWwgb3ZlcmxhcHMgd2l0aCB0aGUgc3RhcnQgb3IgdGhlIGVuZFxuICBcdCAqIGNvbnN0cmFpbnQsIHRoZW4gaXQgd2lsbCBiZSBpbmNsdWRlZCAoZm9yIGluc3RhbmNlIGFuXG4gIFx0ICogb2JzZWwgdGhhdCBzdGFydHMgYmVmb3JlIHRoZSBzdGFydCBjb25zdHJhaW50IGFuZCBlbmRzXG4gIFx0ICogYWZ0ZXIgdGhhdCBjb25zdHJhaW50IHdpbGwgYmUgaW5jbHVkZWQpLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbYmVnaW5dIE1pbmltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtlbmRdIE1heGltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtCb29sZWFufSBbcmV2ZXJzZT1mYWxzZV0gUmV0dXJucyB0aGUgb2JzZWwgbGlzdCBpblxuICBcdCAqICAgICByZXZlcnNlIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgdHJ1ZSBhbmQgaW4gbm9ybWFsXG4gIFx0ICogICAgIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgZmFsc2UuXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxPYnNlbD59IExpc3Qgb2YgcmVsZXZhbnQgb2JzZWxzXG4gIFx0ICogQHRvZG8gUkVWRVJTRSBJUyBOT1QgWUVUIFRBS0VOIElOVE8gQUNDT1VOVFxuICBcdCAqL1xuICBsaXN0X29ic2VsczogZnVuY3Rpb24oYmVnaW4sIGVuZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8vIFRPRE8gcmV2ZXJzZSBpcyBpZ25vcmVkLlxuICAgIHJldHVybiB0aGlzLm9ic2VsX2xpc3QuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChlbmQgJiYgby5nZXRfYmVnaW4oKSA+IGVuZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGlmIChiZWdpbiAmJiBvLmdldF9lbmQoKSA8IGJlZ2luKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gIFx0ICogUmV0cmlldmUgYW4gb2JzZWwgaW4gdGhlIHRyYWNlIGZyb20gaXRzIElELlxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBpZCBJRCBvZiB0aGUgT2JzZWwgdG8gcmV0cmlldmVcbiAgXHQgKiBAcmV0dXJucyB7T2JzZWx9IE9ic2VsIHRoYXQgY29ycmVzcG9uZHMgdG8gdGhpcyBJRFxuICBcdCAqICAgICBvciB1bmRlZmluZWQgaWYgdGhlIG9ic2VsIHdhcyBub3QgZm91bmQuXG4gIFx0ICogQHRvZG8gdXNlIEtUQlMgYWJzdHJhY3QgQVBJLlxuICBcdCAqL1xuICBnZXRfb2JzZWw6IGZ1bmN0aW9uKGlkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icztcbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5nZXRfaWQoKSA9PT0gaWQpIHsgb2JzID0gbzsgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYnM7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFNldHMgdGhlIG1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBtb2RlbCBNb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAdG9kbyBVUERBVEUgV0hBVCBJUyBBIE1PREVMXG4gIFx0ICovXG4gIHNldF9tb2RlbDogZnVuY3Rpb24obW9kZWwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogU2V0cyB0aGUgb3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBvcmlnaW4gT3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEB0b2RvIFVQREFURSBXSEFUIElTIEFOIE9SSUdJTlxuICBcdCAqL1xuICBzZXRfb3JpZ2luOiBmdW5jdGlvbihvcmlnaW4pIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbiAgICAvL1x0dGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKG9yaWdpbikpLmdldE1pbGxpc2Vjb25kcygpO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6ZWRpdF9tZXRhJyk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIGRlZmF1bHQgc3ViamVjdCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBUaGUgdHJhY2UgZGVmYXVsdCBzdWJqZWN0XG4gIFx0ICovXG4gIGdldF9kZWZhdWx0X3N1YmplY3Q6IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy5zdWJqZWN0O30sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFNldCB0aGUgZGVmYXVsdCBzdWJqZWN0IG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBzdWJqZWN0IFRoZSB0cmFjZSBkZWZhdWx0IHN1YmplY3RcbiAgXHQgKi9cbiAgc2V0X2RlZmF1bHRfc3ViamVjdDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuc3ViamVjdCA9IHN1YmplY3Q7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcblxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBDcmVhdGUgYSBuZXcgb2JzZWwgaW4gdGhlIHRyYWNlIHdpdGggdGhlXG4gIFx0ICogZ2l2ZW4gcHJvcGVydGllc1xuICBcdCAqIEBwYXJhbSB7T2JzZWxQYXJhbX0gb2JzZWxfcGFyYW1zIFBhcmFtZXRlcnNcbiAgXHQgKiAgICAgY29ycmVzcG9uZGluZyB0byB0aGUgb2JzZWwgdG8gY3JlYXRlLlxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBvYnNlbF9wYXJhbXMudHlwZSBUeXBlIG9mIHRoZSBvYnNlbC5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gW29ic2VsX3BhcmFtcy5iZWdpbl0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbb2JzZWxfcGFyYW1zLmVuZF0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiAgXHQgKiBAcGFyYW0ge09iamVjdH0gW29ic2VsX3BhcmFtcy5hdHRyaWJ1dGVzXSBBdHRyaWJ1dGVzIG9mIHRoZSBvYnNlbC5cbiAgXHQgKiBAcGFyYW0ge0FycmF5PFJlbGF0aW9uPn0gW29ic2VsX3BhcmFtcy5yZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4gIFx0ICogQHBhcmFtIHtBcnJheTxSZWxhdGlvbj59IFtvYnNlbF9wYXJhbXMuaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuICBcdCAqIEBwYXJhbSB7QXJyYXk8T2JzZWw+fSBbb2JzZWxfcGFyYW1zLnNvdXJjZV9vYnNlbHNdIFNvdXJjZSBvYnNlbHMgb2YgdGhlIG9ic2VsLlxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBbb2JzZWxfcGFyYW1zLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4gIFx0ICovXG4gIGNyZWF0ZV9vYnNlbDogZnVuY3Rpb24ob2JzZWxfcGFyYW1zKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgb2JzZWxfcGFyYW1zLmlkID0gdGhpcy5jb3VudDtcbiAgICB0aGlzLmNvdW50Kys7XG4gICAgb2JzZWxfcGFyYW1zLnRyYWNlID0gdGhpcztcbiAgICB2YXIgb2JzID0gbmV3IE9ic2VsKG9ic2VsX3BhcmFtcyk7XG4gICAgdGhpcy5vYnNlbF9saXN0LnB1c2gob2JzKTtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIG9icyk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJlbW92ZXMgdGhlIGdpdmVuIG9ic2VsIGZyb20gdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIHtPYnNlbH0gb2JzIE9ic2VsIHRvIHJlbW92ZVxuICBcdCAqL1xuICByZW1vdmVfb2JzZWw6IGZ1bmN0aW9uKG9icykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMub2JzZWxfbGlzdCA9IHRoaXMub2JzZWxfbGlzdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgcmV0dXJuIChvID09PSBvYnMpP2ZhbHNlOnRydWU7XG4gICAgfSk7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpyZW1vdmVfb2JzZWwnLCBvYnMpO1xuICB9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBUT0RPIGRvY3VtZW50IHRoaXMgbWV0aG9kXG4gIFx0ICovXG4gIHRyYW5zZm9ybTogZnVuY3Rpb24odHJhbnNmb3JtYXRpb25fbWV0aG9kLCBwYXJhbWV0ZXJzKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRyYW5zZm9ybWF0aW9uX21ldGhvZCh0aGlzLCBwYXJhbWV0ZXJzKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gVE9ETyBkb2N1bWVudCB0aGlzIG1ldGhvZFxuICBcdCAqL1xuICB0cmFuc2Zvcm1hdGlvbnM6IHtcblxuICAgIGR1cGxpY2F0ZTogZnVuY3Rpb24odHJhY2UpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgLy8gVE9ETyBiZXR0ZXIgZGVlcCBjb3B5XG4gICAgICB2YXIgdHJhbnNmb3JtZWRfdHJhY2UgPSBuZXcgTG9jYWxUcmFjZShbdHJhY2VdKTtcbiAgICAgIHRyYWNlLmxpc3Rfb2JzZWxzKCkuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgIH0pO1xuICAgICAgdHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG8gPSBlLmRhdGE7XG4gICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybWVkX3RyYWNlO1xuICAgIH0sXG4gICAgZmlsdGVyX29ic2VsX3R5cGU6IGZ1bmN0aW9uKHRyYWNlLCBvcHQpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgLy8gVE9ETzogaW1wbGVtZW50XG4gICAgICAvLyBUT0RPIGJldHRlciBkZWVwIGNvcHlcbiAgICAgIHZhciB0cmFuc2Zvcm1lZF90cmFjZSA9IG5ldyBMb2NhbFRyYWNlKFt0cmFjZV0pO1xuICAgICAgdHJhY2UubGlzdF9vYnNlbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgaWYgKG9wdC50eXBlcy5zb21lKGZ1bmN0aW9uKHR5cGUpIHtyZXR1cm4gdHlwZSA9PT0gby5nZXRfb2JzZWxfdHlwZSgpO30pKSB7XG4gICAgICAgICAgaWYgKG9wdC5tb2RlID09PSBcImtlZXBcIikge1xuICAgICAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IFwicmVtb3ZlXCIpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgdHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIG8gPSBlLmRhdGE7XG4gICAgICAgIGlmIChvcHQudHlwZXMuc29tZShmdW5jdGlvbih0eXBlKSB7cmV0dXJuIHR5cGUgPT09IG8uZ2V0X29ic2VsX3R5cGUoKTt9KSkge1xuICAgICAgICAgIGlmIChvcHQubW9kZSA9PT0gXCJrZWVwXCIpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG9wdC5tb2RlID09PSBcInJlbW92ZVwiKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1lZF90cmFjZS5jcmVhdGVfb2JzZWwoby50b19PYmplY3QoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0cmFuc2Zvcm1lZF90cmFjZTtcbiAgICB9LFxuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2NhbFRyYWNlO1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiogT2JzZWwgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5PYnNlbH1cbiogb2JqZWN0LlxuKiBAdHlwZWRlZiBPYnNlbFxuKiBAc2VlIFNhbW90cmFjZXMuT2JzZWxcbiovXG5cbi8qKlxuKiBPYnNlbFBhcmFtIGlzIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHBhcmFtZXRlcnNcbiogbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIG5ldyBvYnNlbC5cbiogVGhpcyB0eXBlIG9mIG9iamVjdCBpcyB1c2VkIGluIHNldmVyYWwgbWV0aG9kc1xuKiBzdWNoIGFzIHRoZSBPYnNlbCBjb25zdHJ1Y3Rvciwgb3IgdGhlXG4qIFRyYWNlLmNyZWF0ZV9vYnNlbCBtZXRob2QuXG4qIFRoZSBvcHRpb25hbCBwb3JwZXJ0aWVzIHZhcmllcyBkZXBlbmRpbmcgb24gdGhlXG4qIG1ldGhvZCBjYWxsZWQuXG4qIEB0eXBlZGVmIE9ic2VsUGFyYW1cbiogQHByb3BlcnR5IHtTdHJpbmd9IFtpZF0gSWQgb2YgdGhlIG9ic2VsXG4qIEBwcm9wZXJ0eSB7VHJhY2V9IFt0cmFjZV0gVHJhY2Ugb2YgdGhlIG9ic2VsXG4qIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZV0gVHlwZSBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtOdW1iZXJ9IFtiZWdpbl0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuKiBAcHJvcGVydHkge051bWJlcn0gW2VuZF0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiogQHByb3BlcnR5IHtPYmplY3R9IFthdHRyaWJ1dGVzXSBBdHRyaWJ1dGVzIG9mIHRoZSBvYnNlbC5cbiogQHByb3BlcnR5IHtBcnJheTxSZWxhdGlvbj59IFtyZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7QXJyYXk8UmVsYXRpb24+fSBbaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuKiBAcHJvcGVydHkge0FycmF5PE9ic2VsPn0gW3NvdXJjZV9vYnNlbHNdIFNvdXJjZSBvYnNlbHMgb2YgdGhlIG9ic2VsLlxuKiBAcHJvcGVydHkge1N0cmluZ30gW3BhcmFtLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qIEB0b2RvIEZJWE1FIERFRklORSBXSEFUIElTIEEgUkVMQVRJT05cbiovXG5cbi8qKlxuKiBAc3VtbWFyeSBKYXZhU2NyaXB0IE9ic2VsIGNsYXNzXG4qIEBjbGFzcyBKYXZhU2NyaXB0IE9ic2VsIGNsYXNzXG4qIEBwYXJhbSB7T2JzZWxQYXJhbX0gcGFyYW0gUGFyYW1ldGVycyBvZiB0aGUgb2JzZWxcbiogQHBhcmFtIHtTdHJpbmd9IHBhcmFtLmlkIElkZW50aWZpZXIgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge1RyYWNlfSBwYXJhbS5UcmFjZSBUcmFjZSBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7U3RyaW5nfSBwYXJhbS50eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtLmJlZ2luPURhdGUubm93KCldIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBvYnNlbCBzdGFydHNcbiogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbS5lbmQ9cGFyYW0uYmVnaW5dIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBvYnNlbCBlbmRzXG4qIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW0uYXR0cmlidXRlc10gQXR0cmlidXRlcyBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7QXJyYXk8UmVsYXRpb24+fSBbcGFyYW0ucmVsYXRpb25zXSBSZWxhdGlvbnMgZnJvbSB0aGlzIG9ic2VsLlxuKiBAcGFyYW0ge0FycmF5PFJlbGF0aW9uPn0gW3BhcmFtLmludmVyc2VfcmVsYXRpb25zXSBSZWxhdGlvbnMgdG8gdGhpcyBvYnNlbC5cbiogQHBhcmFtIHtBcnJheTxPYnNlbD59IFtwYXJhbS5zb3VyY2Vfb2JzZWxzXSBTb3VyY2Ugb2JzZWxzIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtTdHJpbmd9IFtwYXJhbS5sYWJlbF0gTGFiZWwgb2YgdGhlIG9ic2VsLlxuKiBAdG9kbyBGSVhNRSBSRUxBVElPTlMgQVJFIE5PVCBZRVQgU1VQUE9SVEVEXG4qL1xuXG52YXIgT2JzZWwgPSBmdW5jdGlvbiBPYnNlbChwYXJhbSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ2lkJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0cmFjZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAndHlwZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdiZWdpbicsXHREYXRlLm5vdygpKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnZW5kJyxcdFx0dGhpcy5iZWdpbik7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2F0dHJpYnV0ZXMnLFx0e30pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAncmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdpbnZlcnNlX3JlbGF0aW9ucycsXHRbXSk7IC8vIFRPRE8gYWpvdXRlciByZWwgw6AgbCdhdXRyZSBvYnNlbFxuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnc291cmNlX29ic2VscycsXHRcdFtdKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2xhYmVsJyxcdFx0XCJcIik7XG59O1xuXG5PYnNlbC5wcm90b3R5cGUgPSB7XG4gIC8vIEFUVFJJQlVURVNcbiAgYXR0cmlidXRlczoge30sXG4gIHJlbGF0aW9uczogW10sXG4gIGludmVyc2VfcmVsYXRpb25zOiBbXSxcbiAgc291cmNlX29ic2VsczogW10sXG4gIGxhYmVsOiBcIlwiLFxuICAvKipcbiAgKiBJZiBhdHRyaWJ1dGUgZXhpc3RzLCB0aGVuIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2VcbiAgKiBzZXQgdGhlIGF0dHJpYnV0ZSBvZiB0aGUgc2FtZSBuYW1lIHdpdGggdGhlIGRlZmF1bHRcbiAgKiB2YWx1ZS5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwYXJhbSB2YWx1ZSBEZWZhdWx0IHZhbHVlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX2RlZmF1bHQ6IGZ1bmN0aW9uKHBhcmFtLCBhdHRyLCB2YWx1ZSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpc1thdHRyXSA9IChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKT9wYXJhbVthdHRyXTp2YWx1ZTtcbn0sXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIG5vdGhpbmcgaGFwcGVucy5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwcml2YXRlXG4qL1xuICBfcHJpdmF0ZV9jaGVja191bmRlZjogZnVuY3Rpb24ocGFyYW0sIGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1thdHRyXSA9IHBhcmFtW2F0dHJdO1xuICB9XG59LFxuICAvKipcbiAgKiBJZiBhdHRyaWJ1dGUgZXhpc3RzLCB0aGVuIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2VcbiAgKiB0aHJvdyBhbiBlcnJvci5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwcml2YXRlXG4qL1xuICBfcHJpdmF0ZV9jaGVja19lcnJvcjogZnVuY3Rpb24ocGFyYW0sIGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1thdHRyXSA9IHBhcmFtW2F0dHJdO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFwiUGFyYW1ldGVyIFwiICsgYXR0ciArIFwiIHJlcXVpcmVkLlwiO1xuICB9XG59LFxuICAvLyBSRVNPVVJDRVxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJlbW92ZSB0aGUgb2JzZWwgZnJvbSBpdHMgdHJhY2UuXG4gICogQGRlc2NyaXB0aW9uXG4gICogUmVtb3ZlIHRoZSBvYnNlbCBmcm9tIGl0cyB0cmFjZS5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTpyZW1vdmVfb2JzZWx9IGV2ZW50XG4qL1xuICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5nZXRfdHJhY2UoKS5yZW1vdmVfb2JzZWwodGhpcyk7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBJZCBvZiB0aGUgb2JzZWwuXG4qL1xuICBnZXRfaWQ6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgcmV0dXJuIHRoaXMuaWQ7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qL1xuICBnZXRfbGFiZWw6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgcmV0dXJuIHRoaXMubGFiZWw7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbC5cbiAgKiBAcGFyYW0ge1N0cmluZ30gTGFiZWwgb2YgdGhlIG9ic2VsLlxuKi9cbiAgc2V0X2xhYmVsOiBmdW5jdGlvbihsYmwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5sYWJlbCA9IGxibDsgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSBsYWJlbCBvZiB0aGUgT2JzZWwgdG8gdGhlIGVtcHR5IHN0cmluZy5cbiovXG4gIHJlc2V0X2xhYmVsOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG50aGlzLmxhYmVsID0gXCJcIjsgfSxcbiAgLy8gT0JTRUxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSB0cmFjZSB0aGUgT2JzZWwgYmVsb25ncyB0by5cbiAgKiBAcmV0dXJucyB7VHJhY2V9IFRyYWNlIHRoZSBPYnNlbCBiZWxvbmdzIHRvLlxuKi9cbiAgZ2V0X3RyYWNlOiBcdFx0ZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xucmV0dXJuIHRoaXMudHJhY2U7IH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogQHJldHVybnMge1N0cmluZ30gVHlwZSBvZiB0aGUgb2JzZWwuXG4gICogQHRvZG8gVE9ETyBkaWZmZXJzIGZyb20gS1RCUyBBUEkgLT4gZXhwcmVzcyBpdCBjbGVhcmx5XG4qL1xuICBnZXRfdHlwZTogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xucmV0dXJuIHRoaXMudHlwZTsgfSxcbiAgLyoqXG4gICogUmV0dXJucyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4gICogQHJldHVybnMge051bWJlcn0gVGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4qL1xuICBnZXRfYmVnaW46IFx0XHRmdW5jdGlvbigpIHtcbiAgICAvL3JldHVybiB0aGlzLmdldF90cmFjZSgpLmdldF9vcmlnaW5fb2Zmc2V0KCkgKyB0aGlzLmJlZ2luO1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLmJlZ2luO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4qL1xuICBnZXRfZW5kOiBcdFx0ZnVuY3Rpb24oKSB7XG4gICAgLy9yZXR1cm4gdGhpcy5nZXRfdHJhY2UoKS5nZXRfb3JpZ2luX29mZnNldCgpICsgdGhpcy5lbmQ7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuZW5kO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHR5cGUgb2YgdGhlIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFNldHMgdGhlIHR5cGUgb2YgdGhlIE9ic2VsLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7U3RyaW5nfSB0eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuICAqIEB0b2RvIFRPRE8gbm90IEtUQlMgQVBJIGNvbXBsaWFudFxuICAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIG1pZ2h0IG5vdCBiZSBzdXBwb3J0ZWQgaW4gdGhlIGZ1dHVyZS5cbiovXG4gIGZvcmNlX3NldF9vYnNlbF90eXBlOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTplZGl0X29ic2VsfSBldmVudFxuICAqIEBwYXJhbXMge051bWJlcn0gYmVnaW4gVGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X2JlZ2luOiBmdW5jdGlvbihiZWdpbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuYmVnaW4gPSBiZWdpbjtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogQGRlc2NyaXB0aW9uXG4gICogU2V0cyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7TnVtYmVyfSBlbmQgVGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIEB0b2RvIFRPRE8gbm90IEtUQlMgQVBJIGNvbXBsaWFudFxuICAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIG1pZ2h0IG5vdCBiZSBzdXBwb3J0ZWQgaW4gdGhlIGZ1dHVyZS5cbiovXG4gIGZvcmNlX3NldF9lbmQ6IFx0ZnVuY3Rpb24oZW5kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgdGhpcy50cmFjZS50cmlnZ2VyKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcyk7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgc291cmNlIE9ic2VscyBvZiB0aGUgY3VycmVudCBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8T2JzZWw+fSBTb3VyY2UgT2JzZWxzIG9mIHRoZSBjdXJyZW50IE9ic2VsLlxuKi9cbiAgbGlzdF9zb3VyY2Vfb2JzZWxzOiBcdGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmxpc3Rfc291cmNlX29ic2VscyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZV9vYnNlbHM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgYXR0cmlidXRlIG5hbWVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gQXR0cmlidXRlIG5hbWVzIG9mIHRoZSBPYnNlbC5cbiovXG4gIGxpc3RfYXR0cmlidXRlX3R5cGVzOiBcdGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gW107IH1cbiAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpICAgICAge1xuICAgICAgICBhdHRycy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJzO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gUmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfcmVsYXRpb25fdHlwZXM6IFx0ZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAodGhpcy5yZWxhdGlvbnMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gW107IH1cbiAgdmFyIHJlbHMgPSBbXTtcbiAgdGhpcy5yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICBpZiAoJC5pbkFycmF5KHIudHlwZSwgcmVscykgPT09IC0xKSB7XG4gICAgICByZWxzLnB1c2goci50eXBlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVscztcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgT2JzZWxzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgT2JzZWwgd2l0aCB0aGUgZ2l2ZW4gcmVsYXRpb24gdHlwZS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVsYXRpb25fdHlwZSBSZWxhdGlvbiB0eXBlLlxuICAqIEByZXR1cm5zIHtBcnJheTxPYnNlbD59IE9ic2VscyByZWxhdGVkIHRvIHRoZSBjdXJyZW50IE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfcmVsYXRlZF9vYnNlbHM6IFx0ZnVuY3Rpb24ocmVsYXRpb25fdHlwZSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIG9ic3MgPSBbXTtcbiAgaWYgKHRoaXMucmVsYXRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnJlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIC8vdmFyIHVuaXF1ZU5hbWVzID0gW107XG4gICAgICBpZiAoci50eXBlID09PSByZWxhdGlvbl90eXBlKSB7XG4gICAgICAgIG9ic3MucHVzaChyLm9ic2VsX3RvKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBpZiAodGhpcy5pbnZlcnNlX3JlbGF0aW9ucyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5pbnZlcnNlX3JlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAgIC8vdmFyIHVuaXF1ZU5hbWVzID0gW107XG4gICAgICBpZiAoci50eXBlID09PSByZWxhdGlvbl90eXBlKSB7XG4gICAgICAgIG9ic3MucHVzaChyLm9ic2VsX3RvKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb2Jzcztcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgaW52ZXJzZSByZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG4gICogQHJldHVybnMge0FycmF5PFN0cmluZz59IEludmVyc2UgcmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfaW52ZXJzZV9yZWxhdGlvbl90eXBlczogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAodGhpcy5pbnZlcnNlX3JlbGF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICB2YXIgcmVscyA9IFtdO1xuICB0aGlzLmludmVyc2VfcmVsYXRpb25zLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgIC8vdmFyIHVuaXF1ZU5hbWVzID0gW107XG4gICAgaWYgKCQuaW5BcnJheShyLnR5cGUsIHJlbHMpID09PSAtMSkge1xuICAgICAgcmVscy5wdXNoKHIudHlwZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlbHM7XG59LFxuICAvL1x0ZGVsX2F0dHJpYnV0ZV92YWx1ZTpcdGZ1bmN0aW9uKGF0dHIpIHt9LCAvLyBUT0RPIGVycmV1ciBkZSBsJ0FQSSBLVEJTP1xuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBdHRyaWJ1dGUgbmFtZS5cbiAgKiBAcmV0dXJucyB7T2JqZWN0fSBBdHRyaWJ1dGUgdmFsdWUuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBnZXRfYXR0cmlidXRlOlx0ZnVuY3Rpb24oYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHRoaXMuYXR0cmlidXRlc1thdHRyXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhyb3cgXCJBdHRyaWJ1dGUgXCIgKyBhdHRyICsgXCIgaXMgbm90IGRlZmluZWRcIjsgLy8gVE9ET1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gIH1cbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIEF0dHJpYnV0ZSBuYW1lLlxuICAqIEBwYXJhbSB7T2JqZWN0fSB2YWwgQXR0cmlidXRlIHZhbHVlLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSVxuKi9cbiAgc2V0X2F0dHJpYnV0ZTpcdGZ1bmN0aW9uKGF0dHIsIHZhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5hdHRyaWJ1dGVzW2F0dHJdID0gdmFsO1xuICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmVtb3ZlcyB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICogQGRlc2NyaXB0aW9uXG4gICogUmVtb3ZlcyB0aGUgYXR0cmlidXRlIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUEkuXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgQXR0cmlidXRlIG5hbWUuXG4qL1xuICBkZWxfYXR0cmlidXRlOlx0XHRcdGZ1bmN0aW9uKGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGRlbGV0ZSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICAvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBBZGRzIGEgcmVsYXRpb24gd2l0aCBhbiBPYnNlbC5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBOT1QgWUVUIElNUExFTUVOVEVEXG4gICogQHBhcmFtIHtTdHJpbmd9IHJlbCBSZWxhdGlvbiB0eXBlLlxuICAqIEBwYXJhbSB7T2JzZWx9IG9icyBUYXJnZXQgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBhZGRfcmVsYXRlZF9vYnNlbDpcdFx0ZnVuY3Rpb24ocmVsLCBvYnMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gVE9ET1xuICB0aHJvdyBcIm1ldGhvZCBub3QgaW1wbGVtZW50ZWQgeWV0XCI7XG4gIC8vIFRPRE8gZW52b3llciB1biBldmVudCBwb3VyIGRpZXIgcXVlIGwnb2JzZWwgYSBjaGFuZ8OpXG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJlbW92ZXMgYSByZWxhdGlvbiB3aXRoIGFuIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIE5PVCBZRVQgSU1QTEVNRU5URURcbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVsIFJlbGF0aW9uIHR5cGUuXG4gICogQHBhcmFtIHtPYnNlbH0gb2JzIFRhcmdldCBPYnNlbC5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcbiovXG4gIGRlbF9yZWxhdGVkX29ic2VsOlx0XHRmdW5jdGlvbihyZWwsIG9icykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUT0RPXG4gIHRocm93IFwibWV0aG9kIG5vdCBpbXBsZW1lbnRlZCB5ZXRcIjtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG5cbiAgLy8gTk9UIElOIEtUQlMgQVBJXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogQ29waWVzIHRoZSBPYnNlbCBwcm9wZXJ0aWVzIGluIGFuIE9iamVjdC5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBDb3BpZXMgdGhlIE9ic2VsIHByb3BlcnRpZXMgaW4gYW4gT2JqZWN0XG4gICogdGhhdCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYW4gT2JzZWwgd2l0aFxuICAqIHtAbGluayBTYW1vdHJhY2VzLk9ic2VsI09ic2VsfSBjb25zdHJ1Y3RvciBvclxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI2NyZWF0ZV9vYnNlbH0gbWV0aG9kLlxuICAqIEByZXR1cm5zIHtPYmplY3R9IE9iamVjdCB0aGF0XG4qL1xuICB0b19PYmplY3Q6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIG9iaiA9IHtcbiAgICBpZDogdGhpcy5pZCxcbiAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgYmVnaW46IHRoaXMuYmVnaW4sXG4gICAgZW5kOiB0aGlzLmVuZCxcbiAgICBhdHRyaWJ1dGVzOiB7fSxcbiAgICAvLyB1c2UgLnNsaWNlIHRvIGNvcHlcbiAgICAvLyBUT0RPIGlzIGl0IGVub3VnaD8gPC0gbWlnaHQgY3JlYXRlIGJ1Z3NcbiAgICByZWxhdGlvbnM6IHRoaXMucmVsYXRpb25zLnNsaWNlKCksXG4gICAgaW52ZXJzZV9yZWxhdGlvbnM6IHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuc2xpY2UoKSxcbiAgICBzb3VyY2Vfb2JzZWxzOiB0aGlzLnNvdXJjZV9vYnNlbHMuc2xpY2UoKSxcbiAgICBsYWJlbDogdGhpcy5sYWJlbFxuICB9O1xuICAvLyBjb3B5IGVhY2ggYXR0cmlidXRlc1xuICBmb3IgKHZhciBhdHRyIGluIHRoaXMuYXR0cmlidXRlcykge1xuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoYXR0cikpIHtcbiAgICAgIG9iai5hdHRyaWJ1dGVzW2F0dHJdID0gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb2JqO1xufSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZWw7XG4iLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiogU2VsZWN0b3IgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5TZWxlY3Rvcn1cbiogb2JqZWN0LlxuKiBAdHlwZWRlZiBTZWxlY3RvclxuKiBAc2VlIFNhbW90cmFjZXMuU2VsZWN0b3JcbiovXG4vKipcbiogQHN1bW1hcnkgT2JqZWN0IHRoYXQgc3RvcmVzIGEgc2VsZWN0aW9uIG9mIG9iamVjdHNcbiogQGNsYXNzIE9iamVjdCB0aGF0IHN0b3JlcyBhIHNlbGVjdGlvbiBvZiBvYmplY3RzXG4qIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4qIEBjb25zdHJ1Y3RvclxuKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiogQGZpcmVzIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmFkZFxuKiBAZmlyZXMgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246cmVtb3ZlXG4qIEBmaXJlcyBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjplbXB0eVxuKiBAZGVzY3JpcHRpb25cbiogVGhlIHtAbGluayBTYW1vdHJhY2VzLlNlbGVjdG9yfFNlbGVjdG9yfSBvYmplY3RcbiogaXMgYSBKYXZhc2NyaXB0IG9iamVjdCB0aGF0IHN0b3JlcyBhIHNlbGVjdGlvbiBvZiBPYmplY3RzLlxuKiBUaGlzIE9iamVjdCBzdG9yZXMgT2JqZWN0cyB0aGF0IGFyZSBzZWxlY3RlZCBhbmQgaW5mb3Jtc1xuKiB3aWRnZXRzIG9yIG90aGVyIG9iamVjdHMgKHZpYSB0aGVcbiogdHJpZ2dlcmVkIGV2ZW50cykgd2hlbiB0aGUgc2VsZWN0aW9uIGNoYW5nZXMuXG4qIFdoZW4gZmlyc3QgaW5zdGFuY2lhdGVkLCB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5LlxuKlxuKiBJbiBvcmRlciB0byBzZWxlY3QgYW4gb2JqZWN0LCB0aGVcbioge0BsaW5rIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0fFNlbGVjdG9yI3NlbGVjdCgpfVxuKiBtZXRob2QgaGFzIHRvIGJlIGNhbGxlZC5cbiogU2ltaWxhcmx5LCBpbiBvcmRlciB0byB1bnNlbGVjdCBhbiBvYmplY3QsIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5TZWxlY3RvciN1bnNlbGVjdHxTZWxlY3RvciN1bnNlbGVjdCgpfVxuKiBtZXRob2QgaGFzIHRvIGJlIGNhbGxlZC5cbiogVGhlIHdob2xlIHNlbGVjdGlvbiBjYW4gYmUgZW1wdGllZCBhdCBvbmNlIHdpdGggdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLlNlbGVjdG9yI2VtcHR5fFNlbGVjdG9yI2VtcHR5KCl9XG4qIG1ldGhvZC5cbipcbiogQHBhcmFtIHtzdHJpbmd9IHR5cGUgLSBBIHN0cmluZyBkZXNjcmliaW5nIHRoZSB0eXBlIG9mXG4qICAgICBvYmplY3QgdG8gYmUgc2VsZWN0ZWQgKCdPYnNlbCcsICdUcmFjZScsICdUaW1lV2luZG93JywgZXRjLikuXG4qIEBwYXJhbSB7c3RyaW5nfSBbc2VsZWN0aW9uX21vZGU9J3NpbmdsZSddXG4qICAgICBJbiAnc2luZ2xlJyBtb2RlLCB0aGUgc2VsZWN0aW9uIGNvbnRhaW5zIG9uZSBvYmplY3QgbWF4aW11bS5cbiogICAgIFRoaXMgbWVhbnMgdGhhdCBhZGRpbmcgYW4gb2JqZWN0IHRvIGEgbm9uLWVtcHR5IHNlbGVjdGlvblxuKiAgICAgd2lsbCByZXBsYWNlIHRoZSBwcmV2aW91c2x5IHNlbGVjdGVkIG9iamVjdCB3aXRoIHRoZSBuZXcgb25lLlxuKiAgICAgSW4gJ211bHRpcGxlJyBtb2RlLCB0aGUgc2VsZWN0aW9uIGNhbiBiZSBleHRlbmRlZCBhbmQgb2JqZWN0c1xuKiAgICAgY2FuIGJlIGluZGl2aWR1YWxseSBhZGRlZCBvciByZW1vdmVkLlxuKiBAcGFyYW0ge0V2ZW50Q29uZmlnfVx0W2V2ZW50c11cbiogICAgIEV2ZW50cyB0byBsaXN0ZW4gdG8gYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2tzLlxuKi9cbnZhciBTZWxlY3RvciA9IGZ1bmN0aW9uKHR5cGUsIHNlbGVjdGlvbl9tb2RlLCBldmVudHMpIHtcbiAgLy8gQWRkaW5nIHRoZSBPYnNlcnZhYmxlIHRyYWl0XG4gIFwidXNlIHN0cmljdFwiO1xuICBFdmVudEhhbmRsZXIuY2FsbCh0aGlzLCBldmVudHMpO1xuICB0aGlzLm1vZGUgPSBzZWxlY3Rpb25fbW9kZSB8fCAnc2luZ2xlJzsgLy8gb3RoZXIgb3B0aW9uIGlzICdtdWx0aXBsZSdcbiAgdGhpcy50eXBlID0gdHlwZTtcbiAgdGhpcy5zZWxlY3Rpb24gPSBbXTtcbiAgLy8gVE9ETzogYWpvdXRlciBldmVudExpc3RlbmVyIHN1ciBUcmFjZSBzaSB0eXBlID0gb2JzZWxcbiAgLy8gLT4gUXVhbmQgXCJ0cmFjZTpyZW1vdmU6b2JzZWxcIiAtPiB2w6lyaWZpZSBzaSB1biBvYnNlbCBhXG4gIC8vIMOpdMOpIHN1cHByaW3DqSBkZSBsYSBzw6lsZWN0aW9uLlxufTtcblxuU2VsZWN0b3IucHJvdG90eXBlID0ge1xuICAvKipcbiAgKiBNZXRob2QgdG8gY2FsbCB0byBzZWxlY3QgYW4gT2JqZWN0LlxuICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgKiAgICAgT2JqZWN0IHRvIGFkZCB0byB0aGUgc2VsZWN0aW9uXG4gICogQGZpcmVzIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmFkZFxuICAqL1xuICBzZWxlY3Q6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgdGhpcy5zZWxlY3Rpb24ucHVzaChvYmplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbiA9IFtvYmplY3RdO1xuICAgIH1cbiAgICAvKipcbiAgICAqIE9iamVjdCBzZWxlY3RlZCBldmVudC5cbiAgICAqIEBldmVudCBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjphZGRcbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInNlbGVjdGlvbjphZGRcIikuXG4gICAgKiBAcHJvcGVydHkge09iamVjdH0gZGF0YSAtIFRoZSBzZWxlY3RlZCBvYmplY3QuXG4gICAgKi9cbiAgICB0aGlzLnRyaWdnZXIoJ3NlbGVjdGlvbjphZGQnLCBvYmplY3QpO1xuICB9LFxuICAvKipcbiAgKiBNZXRob2QgdG8gZW1wdHkgdGhlIGN1cnJlbnQgc2VsZWN0aW9uLlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjplbXB0eVxuICAqL1xuICBlbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5zZWxlY3Rpb24gPSBbXTtcbiAgICAvKipcbiAgICAqIE9iamVjdCB1bnNlbGVjdGVkIGV2ZW50LlxuICAgICogQGV2ZW50IFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmVtcHR5XG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgKD0gXCJzZWxlY3Rpb246ZW1wdHlcIikuXG4gICAgKi9cbiAgICB0aGlzLnRyaWdnZXIoJ3NlbGVjdGlvbjplbXB0eScpO1xuICB9LFxuICAvKipcbiAgKiBNZXRob2QgdGhhdCBjaGVja3MgaWYgdGhlIHNlbGVjdGlvbiBpcyBlbXB0eVxuICAqIEByZXR1cm5zIHtCb29sZWFufSBSZXR1cm5zIHRydWUgaWYgdGhlIHNlbGVjdGlvbiBhbmQgZW1wdHlcbiAgKiAgICAgYW5kIGZhbHNlIGlmIHRoZSBzZWxlY3Rpb24gaXMgbm90IGVtcHR5LlxuICAqL1xuICBpc19lbXB0eTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuICh0aGlzLnNlbGVjdGlvbi5sZW5ndGggPT09IDApO1xuICB9LFxuICAvKipcbiAgKiBHZXRzIHRoZSBjdXJyZW50IHNlbGVjdGlvblxuICAqIEByZXR1cm5zIHtBcnJheX0gQXJyYXkgb2Ygc2VsZWN0ZWQgb2JqZWN0c1xuICAqL1xuICBnZXRfc2VsZWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3Rpb247XG4gIH0sXG4gIC8qKlxuICAqIE1ldGhvZCB0byBjYWxsIHRvIHJlbW92ZSBhbiBPYmplY3QgZnJvbSB0aGUgc2VsZWN0aW9uLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgKiAgICAgT2JqZWN0IHRvIHJlbW92ZSBmcm9tIHRoZSBzZWxlY3Rpb25cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246cmVtb3ZlXG4gICovXG4gIHVuc2VsZWN0OiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICAgIHRoaXMuc2VsZWN0aW9uID0gdGhpcy5zZWxlY3Rpb24uZmlsdGVyKGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIGlmIChlbCA9PT0gb2JqZWN0KSB7XG4gICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAoIWZvdW5kKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbiA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAqIE9iamVjdCB1bnNlbGVjdGVkIGV2ZW50LlxuICAgICogQGV2ZW50IFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOnJlbW92ZVxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIGV2ZW50ICg9IFwic2VsZWN0aW9uOnJlbW92ZVwiKS5cbiAgICAqL1xuICAgIHRoaXMudHJpZ2dlcignc2VsZWN0aW9uOnJlbW92ZScsIG9iamVjdCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIC8qKlxuICAqIE1ldGhvZCB0byBjYWxsIHRvIHRvZ2dsZSB0aGUgc2VsZWN0aW9uIG9mIGFuIE9iamVjdC5cbiAgKiBJZiB0aGUgT2JqZWN0IHdhcyBwcmV2aW91c2x5IHVuc2VsZWN0ZWQsIGl0IGJlY29tZXMgc2VsZWN0ZWQuXG4gICogSWYgdGhlIE9iamVjdCB3YXMgcHJldmlvdXNseSBzZWxlY3RlZCwgaXQgYmVjb21lcyB1bnNlbGVjdGVkLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgKiAgICBPYmplY3QgdG8gdG9nZ2xlIGZyb20gdGhlIHNlbGVjdGlvblxuICAqL1xuICB0b2dnbGU6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgIGlmICghdGhpcy51bnNlbGVjdChvYmplY3QpKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KG9iamVjdCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLnNlbGVjdGlvbi5sZW5ndGggPT09IDAgfHwgdGhpcy5zZWxlY3Rpb25bMF0gIT09IG9iamVjdCkge1xuICAgICAgICB0aGlzLnNlbGVjdChvYmplY3QpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy51bnNlbGVjdChvYmplY3QpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RvcjtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuKiBUaW1lV2luZG93IGlzIGEgc2hvcnRuYW1lIGZvciB0aGVcbioge0BsaW5rIFNhbW90cmFjZXMuVGltZVdpbmRvd31cbiogb2JqZWN0LlxuKiBAdHlwZWRlZiBUaW1lV2luZG93XG4qIEBzZWUgU2Ftb3RyYWNlcy5UaW1lV2luZG93XG4qL1xuLyoqXG4qIEBzdW1tYXJ5IE9iamVjdCB0aGF0IHN0b3JlcyB0aGUgY3VycmVudCB0aW1lIHdpbmRvd1xuKiBAY2xhc3MgT2JqZWN0IHRoYXQgc3RvcmVzIHRoZSBjdXJyZW50IHRpbWUgd2luZG93XG4qIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4qIEBjb25zdHJ1Y3RvclxuKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiogQGRlc2NyaXB0aW9uXG4qIFRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5UaW1lV2luZG93fSBvYmplY3QgaXMgYSBKYXZhc2NyaXB0IE9iamVjdFxuKiB0aGF0IHN0b3JlcyB0aGUgY3VycmVudCB0aW1lIHdpbmRvdy5cbiogVGhpcyBPYmplY3Qgc3RvcmVzIGEgdGltZSB3aW5kb3cgYW5kIGluZm9ybXMgd2lkZ2V0cyBvciBvdGhlclxuKiBvYmplY3RzIHdoZW4gdGhlIHRpbWUgd2luZG93IGNoYW5nZXMgdmlhIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnVwZGF0ZXx0dzp1cGRhdGV9XG4qIGV2ZW50LlxuKiBBIHtAbGluayBTYW1vdHJhY2VzLlRpbWVXaW5kb3d8VGltZVdpbmRvd30gY2FuIGJlIGRlZmluZWQgaW4gdHdvIHdheXM6XG4qXG4qIDEuICBieSBkZWZpbmluZyBhIGxvd2VyIGFuZCB1cHBlciBib3VuZFxuKiAyLiAgYnkgZGVmaW5pbmcgYSB0aW1lciBhbmQgYSB3aWR0aC5cbipcbiogQHBhcmFtIHtPYmplY3R9IG9wdFx0T3B0aW9uIHBhcmFtZXRlciB0aGF0IGRlZmluZXMgdGhlIHRpbWVcbiogICAgIHdpbmRvdy4gVmFyaWFibGVzIG9wdC5zdGFydCBhbmQgb3B0LmVuZCBtdXN0XG4qICAgICBiZSBkZWZpbmVkIGlmIHVzaW5nIGxvd2VyIGFuZCB1cHBlciBib3VuZCBkZWZpbml0aW9uLlxuKiAgICAgVmFyaWFibGVzIG9wdC50aW1lciBhbmQgb3B0LndpZHRoIG11c3RcbiogICAgIGJlIGRlZmluZWQgaWYgdXNpbmcgdGltZXIgYW5kIHdpZHRoIGRlZmluaXRpb24uXG4qIEBwYXJhbSB7TnVtYmVyfSBvcHQuc3RhcnQgU3RhcnRpbmcgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cgKGxvd2VyIGJvdW5kKS5cbiogQHBhcmFtIHtOdW1iZXJ9IG9wdC5lbmQgRW5kaW5nIHRpbWUgb2YgdGhlIHRpbWUgd2luZG93ICh1cHBlciBib3VuZCkuXG4qIEBwYXJhbSB7U2Ftb3RyYWNlcy5UaW1lcn0gb3B0LnRpbWVyIFRpbWVyIG9iamVjdCwgd2hpY2ggdGltZVxuKiAgICAgaXMgdXNlZCB0byBkZWZpbmUgdGhlIG1pZGRsZSBvZiB0aGUgY3VycmVudCB0aW1lIHdpbmRvdy5cbiogQHBhcmFtIHtOdW1iZXJ9IG9wdC53aWR0aCBXaWR0aCBvZiB0aGUgdGltZSB3aW5kb3cuXG4qXG4qL1xudmFyIFRpbWVXaW5kb3cgPSBmdW5jdGlvbiBUaW1lV2luZG93KG9wdCkge1xuICAvLyBBZGRpbmcgdGhlIE9ic2VydmFibGUgdHJhaXRcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICBpZiAob3B0LnN0YXJ0ICE9PSB1bmRlZmluZWQgJiYgb3B0LmVuZCAgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuc3RhcnQgPSBvcHQuc3RhcnQ7XG4gICAgdGhpcy5lbmQgPSBvcHQuZW5kO1xuICAgIHRoaXMuX19jYWxjdWxhdGVfd2lkdGgoKTtcbiAgfSBlbHNlIGlmIChvcHQudGltZXIgIT09IHVuZGVmaW5lZCAmJiBvcHQud2lkdGggICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnNldF93aWR0aChvcHQud2lkdGgsIG9wdC50aW1lci50aW1lKTtcbiAgICB0aGlzLnRpbWVyID0gb3B0LnRpbWVyO1xuICAgIHRoaXMudGltZXIub24oJ3RpbWVyOnVwZGF0ZScsIHRoaXMuX3ByaXZhdGVfdXBkYXRlVGltZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnRpbWVyLm9uKCd0aW1lcjpwbGF5OnVwZGF0ZScsIHRoaXMuX3ByaXZhdGVfdXBkYXRlVGltZS5iaW5kKHRoaXMpKTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdygnU2Ftb3RyYWNlcy5UaW1lV2luZG93IGVycm9yLiBBcmd1bWVudHMgY291bGQgbm90IGJlIHBhcnNlZC4nKTtcbiAgfVxufTtcblxuVGltZVdpbmRvdy5wcm90b3R5cGUgPSB7XG5cbiAgX19jYWxjdWxhdGVfd2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMud2lkdGggPSB0aGlzLmVuZCAtIHRoaXMuc3RhcnQ7XG4gIH0sXG4gIF9wcml2YXRlX3VwZGF0ZVRpbWU6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgdGltZSA9IGUuZGF0YTtcbiAgICB2YXIgZGVsdGEgPSB0aW1lIC0gKHRoaXMuc3RhcnQgKyB0aGlzLndpZHRoIC8gMik7XG5cbiAgICB0aGlzLnN0YXJ0ID0gdGltZSAtIHRoaXMud2lkdGggLyAyO1xuICAgIHRoaXMuZW5kID0gdGltZSArIHRoaXMud2lkdGggLyAyO1xuICAgIHRoaXMudHJpZ2dlcigndHc6dHJhbnNsYXRlJywgZGVsdGEpO1xuXG4gICAgLy9cdFx0dGhpcy5zZXRfd2lkdGgodGhpcy53aWR0aCx0aW1lKTtcbiAgfSxcbiAgLyoqXG4gICogU2V0cyB0aGUgc3RhcnQgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgU3RhcnRpbmcgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQGZpcmVzIFNhbW90cmFjZXMuVGltZVdpbmRvdyN0dzp1cGRhdGVcbiAgKi9cbiAgc2V0X3N0YXJ0OiBmdW5jdGlvbih0aW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuc3RhcnQgIT09IHRpbWUpIHtcbiAgICAgIHRoaXMuc3RhcnQgPSB0aW1lO1xuICAgICAgdGhpcy5fX2NhbGN1bGF0ZV93aWR0aCgpO1xuICAgICAgLyoqXG4gICAgICAqIFRpbWUgd2luZG93IGNoYW5nZSBldmVudC5cbiAgICAgICogQGV2ZW50IFNhbW90cmFjZXMuVGltZVdpbmRvdyN0dzp1cGRhdGVcbiAgICAgICogQHR5cGUge29iamVjdH1cbiAgICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgKD0gXCJ0dzp1cGRhdGVcIikuXG4gICAgICovXG4gICAgICB0aGlzLnRyaWdnZXIoJ3R3OnVwZGF0ZScpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICogU2V0cyB0aGUgZW5kIHRpbWUgb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIEVuZGluZyB0aW1lIG9mIHRoZSB0aW1lIHdpbmRvdy5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnVwZGF0ZVxuICovXG4gIHNldF9lbmQ6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5lbmQgIT09IHRpbWUpIHtcbiAgICAgIHRoaXMuZW5kID0gdGltZTtcbiAgICAgIHRoaXMuX19jYWxjdWxhdGVfd2lkdGgoKTtcbiAgICAgIHRoaXMudHJpZ2dlcigndHc6dXBkYXRlJyk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgKiBHZXRzIHRoZSB3aWR0aCBvZiB0aGUgdGltZSB3aW5kb3cgKGR1cmF0aW9uIGJldHdlZW4gc3RhcnQgYW5kIGVuZClcbiAgKiBAcmV0dXJucyB7TnVtYmVyfSBXaWR0aCBvZiB0aGUgdGltZSB3aW5kb3dcbiAgKi9cbiAgZ2V0X3dpZHRoOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy53aWR0aDtcbiAgfSxcbiAgLyoqXG4gICogU2V0cyB0aGUgd2lkdGggb2YgdGhlIHRpbWUgb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCBOZXcgd2lkdGggb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBwYXJhbSB7TnVtYmVyfSBbY2VudGVyPShzdGFydCtlbmQpLzJdIE5ldyBjZW50ZXIgb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVXaW5kb3cjdHc6dXBkYXRlXG4gICovXG4gIHNldF93aWR0aDogZnVuY3Rpb24od2lkdGgsIGNlbnRlcikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmIChjZW50ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY2VudGVyID0gdGhpcy5zdGFydCArIHRoaXMud2lkdGggLyAyO1xuICAgIH1cbiAgICB0aGlzLnN0YXJ0ID0gY2VudGVyIC0gd2lkdGggLyAyO1xuICAgIHRoaXMuZW5kID0gY2VudGVyICsgd2lkdGggLyAyO1xuICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLnRyaWdnZXIoJ3R3OnVwZGF0ZScpO1xuICB9LFxuICAvKipcbiAgKiBUcmFuc2xhdGVzIHRoZSB0aW1lIHdpbmRvdyB3aXRoIGEgdGltZSBkZWx0YS5cbiAgKiBAcGFyYW0ge051bWJlcn0gZGVsdGEgVGltZSBkZWx0YXQgdGhhdCB3aWxsIGJlIGFkZGVkIHRvIHRoZSB0aW1lIHdpbmRvdy5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnRyYW5zbGF0ZVxuICAqL1xuICB0cmFuc2xhdGU6IGZ1bmN0aW9uKGRlbHRhKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgIHRoaXMudGltZXIuc2V0KHRoaXMudGltZXIudGltZSArIGRlbHRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdGFydCA9IHRoaXMuc3RhcnQgKyBkZWx0YTtcbiAgICAgIHRoaXMuZW5kID0gdGhpcy5lbmQgKyBkZWx0YTtcbiAgICAgIHRoaXMudHJpZ2dlcigndHc6dHJhbnNsYXRlJywgZGVsdGEpO1xuICAgIH1cbiAgfSxcbiAgLyoqXG4gICogWm9vbXMgdGhlIHRpbWV3aW5kb3cgYnkgbXVsdGlwbHlpbmcgdGhlIGN1cnJlbnQgd2lkdGhcbiAgKiBieSB0aGUgZ2l2ZW4gY29lZmZpY2llbnQuIFpvb20gaW4gaWYgdGhlIGNvZWZmaWNpZW50XG4gICogaXMgbGVzcyB0aGFuIDEgYW5kIG91dCBpZiBpdCBpcyBtb3JlIHRoYW4gMS5cbiAgKiBAcGFyYW0ge051bWJlcn0gY29lZiBDb2VmZmljaWVudCBvZiB0aGUgem9vbSB0byBhcHBseS5cbiAgKi9cbiAgem9vbTogZnVuY3Rpb24oY29lZikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuc2V0X3dpZHRoKHRoaXMud2lkdGggKiBjb2VmKTtcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZVdpbmRvdztcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuKiBAc3VtbWFyeSBPYmplY3QgdGhhdCBzdG9yZXMgdGhlIGN1cnJlbnQgdGltZVxuKiBAY2xhc3MgT2JqZWN0IHRoYXQgc3RvcmVzIHRoZSBjdXJyZW50IHRpbWVcbiogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiogQGNvbnN0cnVjdG9yXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lciN0aW1lcjp1cGRhdGVcbiogQGRlc2NyaXB0aW9uXG4qIFNhbW90cmFjZXMuVGltZXIgaXMgYSBKYXZhc2NyaXB0IG9iamVjdCB0aGF0IHN0b3Jlc1xuKiB0aGUgY3VycmVudCB0aW1lLlxuKiBUaGlzIE9iamVjdCBzdG9yZXMgYSB0aW1lIGFuZCBpbmZvcm1zIHdpZGdldHMgb3Igb3RoZXJcbiogb2JqZWN0cyB3aGVuIHRoZSB0aW1lIGNoYW5nZXMuXG4qXG4qIEBwYXJhbSB7TnVtYmVyfSBbaW5pdF90aW1lPTBdXG4qICAgICBJbml0aWFsIHRpbWUgb2YgdGhlIHRpbWVyIChvcHRpb25hbCwgZGVmYXVsdDogMCkuXG4qIEBwYXJhbSB7TnVtYmVyfSBbcGVyaW9kPTIwMDBdXG4qICAgICBQZXJkaW9kIChpbiBtcykgYXQgd2hpY2ggdGhlIHRpbWVyIHdpbGwgdXBkYXRlIGl0c2VsZiBpblxuKiAgICAgXCJwbGF5XCIgbW9kZS5cbiogQHBhcmFtIHtmdW5jdGlvbn0gW3VwZGF0ZV9mdW5jdGlvbl1cbiogICAgIEZ1bmN0aW9uIGNhbGxlZCB0byB1cGRhdGUgdGhlIHRpbWVyIHdoZW4gaW4gXCJwbGF5XCIgbW9kZVxuKiAgICAgKGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgb2ZcbiogICAgIDxjb2RlPkRhdGUubm93KCk8L2NvZGU+IGJ5IGRlZmF1bHQpLlxuKi9cblxudmFyIFRpbWVyID0gZnVuY3Rpb24gVGltZXIoaW5pdF90aW1lLCBwZXJpb2QsIHVwZGF0ZV9mdW5jdGlvbikge1xuICAvLyBBZGRpbmcgdGhlIE9ic2VydmFibGUgdHJhaXRcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICB0aGlzLnRpbWUgPSBpbml0X3RpbWUgfHwgMDtcbiAgdGhpcy5wZXJpb2QgPSBwZXJpb2QgfHwgMjAwMDtcbiAgdGhpcy51cGRhdGVfZnVuY3Rpb24gPSB1cGRhdGVfZnVuY3Rpb24gfHwgZnVuY3Rpb24oKSB7cmV0dXJuIERhdGUubm93KCk7fTtcbiAgdGhpcy5pc19wbGF5aW5nID0gZmFsc2U7XG59O1xuXG5UaW1lci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAqIFNldHMgdGhlIFRpbWVyIHRvIHRoZSBnaXZlbiB0aW1lLlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnVwZGF0ZVxuICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIE5ldyB0aW1lXG4qL1xuICBzZXRfdGltZTogZnVuY3Rpb24odGltZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBuZXdfdGltZSA9IE51bWJlcih0aW1lKTtcbiAgICBpZiAodGhpcy50aW1lICE9PSBuZXdfdGltZSkge1xuICAgICAgdGhpcy50aW1lID0gbmV3X3RpbWU7XG4gICAgICAvKipcbiAgICAgICogVGltZSBjaGFuZ2UgZXZlbnQuXG4gICAgICAqIEBldmVudCBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnVwZGF0ZVxuICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInRpbWVyOnVwZGF0ZVwiKS5cbiovXG4gICAgICB0aGlzLnRyaWdnZXIoJ3RpbWVyOnVwZGF0ZScsIHRoaXMudGltZSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgKiBTZXRzIHRoZSBUaW1lciB0byB0aGUgZ2l2ZW4gdGltZS5cbiAgKiBAZGVwcmVjYXRlZCBVc2Uge0BsaW5rIFNhbW90cmFjZXMuVGltZXIuc2V0X3RpbWV8c2V0X3RpbWV9IGluc3RlYWQuXG4gICogQGZpcmVzIFNhbW90cmFjZXMuVGltZXIjdGltZXI6dXBkYXRlXG4gICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgTmV3IHRpbWVcbiovXG4gIHNldDogZnVuY3Rpb24odCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICByZXR1cm4gdGhpcy5zZXRfdGltZSh0KTsgfSxcbiAgLyoqXG4gICogR2V0cyB0aGUgY3VycmVudCB0aW1lIG9mIHRoZSBUaW1lclxuICAqIEByZXR1cm5zIHtOdW1iZXJ9IEN1cnJlbnQgdGltZSBvZiB0aGUgVGltZXIuXG4qL1xuICBnZXRfdGltZTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMudGltZTtcbiAgfSxcbiAgLyoqXG4gICogU2V0cyBvciBnZXQgdGhlIFRpbWVyJ3MgY3VycmVudCB0aW1lLlxuICAqIElmIG5vIHBhcmFtZXRlciBpcyBnaXZlbiwgdGhlIGN1cnJlbnQgdGltZSBpcyByZXR1cm5lZC5cbiAgKiBPdGhlcndpc2UsIHNldHMgdGhlIFRpbWVyIHRvIHRoZSBnaXZlbnQgdGltZS5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lciN0aW1lcjp1cGRhdGVcbiAgKiBAcGFyYW0ge051bWJlcn0gW3RpbWVdIE5ldyB0aW1lXG4qL1xuICB0aW1lOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRpbWUpIHtcbiAgICAgIHZhciBuZXdfdGltZSA9IE51bWJlcih0aW1lKTtcbiAgICAgIGlmICh0aGlzLnRpbWUgIT09IG5ld190aW1lKSB7XG4gICAgICAgIHRoaXMudGltZSA9IG5ld190aW1lO1xuICAgICAgICB0aGlzLnRyaWdnZXIoJ3RpbWVyOnVwZGF0ZScsIHRoaXMudGltZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnRpbWU7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAqIFN0YXJ0cyB0aGUgcGxheSBtb2RlOiB0aGUgdGltZXIgd2lsbCBiZSB1cGRhdGVkXG4gICogYWNjb3JkaW5nIHRvIHRoZSB1cGRhdGVfZnVuY3Rpb24gZXZlcnkgcGVyaW9kXG4gICogYXMgc3BlY2lmaWVkIGF0IHRoZSBpbml0aWFsaXNhdGlvbiBvZiB0aGUgVGltZXIuXG4gICogQHRvZG8gU1BFQ0lGWSBXQVlTIFRPIENIQU5HRSBQRVJJT0QgQU5EIFVQREFURV9GVU5DVElPblxuKi9cbiAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLyp2YXIgdXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy50aW1lID0gdGhpcy51cGRhdGVfZnVuY3Rpb24odGhpcy50aW1lKTtcbiAgICAvKipcbiAgICAqIFRpbWUgY2hhbmdlIGV2ZW50IChhY3R1YWxpc2luZyB0aW1lIHdoZW4gcGxheWluZylcbiAgICAqIEBldmVudCBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnBsYXk6dXBkYXRlXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHR5cGVcbiAgICAqICAgICAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInRpbWVyOnBsYXk6dXBkYXRlXCIpLlxuICAgICovXG4gICAgLyp0aGlzLnRyaWdnZXIoJ3RpbWVyOnBsYXk6dXBkYXRlJyx0aGlzLnRpbWUpO1xuICAgIH07XG5cdFx0Ki9cbiAgICB0aGlzLmludGVydmFsX2lkID0gd2luZG93LnNldEludGVydmFsKHRoaXMudXBkYXRlX2Z1bmN0aW9uLmJpbmQodGhpcyksIHRoaXMucGVyaW9kKTtcbiAgICB0aGlzLmlzX3BsYXlpbmcgPSB0cnVlO1xuICAgIHRoaXMudHJpZ2dlcigndGltZXI6cGxheScsIHRoaXMudGltZSk7XG4gIH0sXG4gIC8qKlxuICAqIFN0b3BzIHRoZSBwbGF5IG1vZGUuXG4qL1xuICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5pbnRlcnZhbF9pZCk7XG4gICAgdGhpcy5pc19wbGF5aW5nID0gZmFsc2U7XG4gICAgdGhpcy50cmlnZ2VyKCd0aW1lcjpwYXVzZScsIHRoaXMudGltZSk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGltZXI7XG4iLCJ2YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vY29yZS9FdmVudEhhbmRsZXIuanNcIik7XG52YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIE9ic2VsID0gcmVxdWlyZShcIi4vY29yZS9PYnNlbC5qc1wiKTtcbnZhciBUaW1lV2luZG93ID0gcmVxdWlyZShcIi4vY29yZS9UaW1lV2luZG93LmpzXCIpO1xudmFyIFRpbWVyID0gcmVxdWlyZShcIi4vY29yZS9UaW1lci5qc1wiKTtcbnZhciBTZWxlY3RvciA9IHJlcXVpcmUoXCIuL2NvcmUvU2VsZWN0b3IuanNcIik7XG52YXIgTG9jYWxUcmFjZSA9IHJlcXVpcmUoXCIuL2NvcmUvTG9jYWxUcmFjZS5qc1wiKTtcbnZhciBLdGJzID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLmpzXCIpO1xudmFyIEt0YnNNb2RlbCA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5Nb2RlbC5qc1wiKTtcbnZhciBLdGJzQmFzZSA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5CYXNlLmpzXCIpO1xudmFyIEt0YnNUcmFjZSA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5UcmFjZS5qc1wiKTtcblxudmFyIEltcG9ydFRyYWNlID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9JbXBvcnRUcmFjZS5qc1wiKTtcbnZhciBJbnRlcnZhbFRpbWVGb3JtID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9JbnRlcnZhbFRpbWVGb3JtLmpzXCIpO1xudmFyIExpc3RCYXNlcyA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvTGlzdEJhc2VzLmpzXCIpO1xudmFyIExpc3RNb2RlbEluQmFzZXMgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0xpc3RNb2RlbEluQmFzZXMuanNcIik7XG52YXIgTGlzdFRyYWNlc0luQmFzZXMgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0xpc3RUcmFjZXNJbkJhc2VzLmpzXCIpO1xudmFyIE9ic2VsSW5zcGVjdG9yID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9PYnNlbEluc3BlY3Rvci5qc1wiKTtcbnZhciBPYnNlbFR5cGVJbnNwZWN0b3IgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL09ic2VsVHlwZUluc3BlY3Rvci5qc1wiKTtcbnZhciBSZWFkYWJsZVRpbWVGb3JtID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9SZWFkYWJsZVRpbWVGb3JtLmpzXCIpO1xudmFyIFRpbWVGb3JtID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UaW1lRm9ybS5qc1wiKTtcbnZhciBUaW1lU2xpZGVyID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UaW1lU2xpZGVyLmpzXCIpO1xudmFyIFRyYWNlRGlzcGxheUljb25zID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29ucy5qc1wiKTtcbnZhciBUcmFjZURpc3BsYXlJY29uc0ZpeCA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5SWNvbnNGaXguanNcIik7XG52YXIgVHJhY2VEaXNwbGF5SWNvbnNab29tID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29uc1pvb20uanNcIik7XG52YXIgVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcyA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcy5qc1wiKTtcbnZhciBUcmFjZURpc3BsYXlUZXh0ID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlUZXh0LmpzXCIpO1xudmFyIFRyYWNlRGlzcGxheVpvb21Db250ZXh0ID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlab29tQ29udGV4dC5qc1wiKTtcbnZhciBEaXNwbGF5TW9kZWwgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0Rpc3BsYXlNb2RlbC5qc1wiKTtcbnZhciBXaW5kb3dTY2FsZSA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvV2luZG93U2NhbGUuanNcIik7XG52YXIgV2luZG93U2NhbGVGaXggPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1dpbmRvd1NjYWxlRml4LmpzXCIpO1xudmFyIFdpbmRvd1NsaWRlciA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvV2luZG93U2xpZGVyLmpzXCIpO1xuXG52YXIgU2Ftb3RyYWNlcyA9IHtcbiAgT2JzZWw6IE9ic2VsLFxuICBUaW1lV2luZG93OiBUaW1lV2luZG93LFxuICBUaW1lcjogVGltZXIsXG4gIFNlbGVjdG9yOiBTZWxlY3RvcixcbiAgRXZlbnRIYW5kbGVyOiBFdmVudEhhbmRsZXIsXG4gIExvY2FsVHJhY2U6IExvY2FsVHJhY2UsXG4gIEt0YnM6IHtcbiAgICBLdGJzOiBLdGJzLFxuICAgIFJlc291cmNlOiBLVEJTUmVzb3VyY2UsXG4gICAgTW9kZWw6IEt0YnNNb2RlbCxcbiAgICBCYXNlOiBLdGJzQmFzZSxcbiAgICBUcmFjZTogS3Ric1RyYWNlLFxuICB9LFxuICBVaToge1xuICAgIFdpZGdldHM6IHtcbiAgICAgIEltcG9ydFRyYWNlOiBJbXBvcnRUcmFjZSxcbiAgICAgIEludGVydmFsVGltZUZvcm06IEludGVydmFsVGltZUZvcm0sXG4gICAgICBPYnNlbEluc3BlY3RvcjogT2JzZWxJbnNwZWN0b3IsXG4gICAgICBPYnNlbFR5cGVJbnNwZWN0b3I6IE9ic2VsVHlwZUluc3BlY3RvcixcbiAgICAgIFJlYWRhYmxlVGltZUZvcm06IFJlYWRhYmxlVGltZUZvcm0sXG4gICAgICBUaW1lRm9ybTogVGltZUZvcm0sXG4gICAgICBUaW1lU2xpZGVyOiBUaW1lU2xpZGVyLFxuICAgICAgVHJhY2VEaXNwbGF5SWNvbnM6IFRyYWNlRGlzcGxheUljb25zLFxuICAgICAgVHJhY2VEaXNwbGF5SWNvbnNGaXg6IFRyYWNlRGlzcGxheUljb25zRml4LFxuICAgICAgVHJhY2VEaXNwbGF5SWNvbnNab29tOiBUcmFjZURpc3BsYXlJY29uc1pvb20sXG4gICAgICBUcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzOiBUcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzLFxuICAgICAgVHJhY2VEaXNwbGF5VGV4dDogVHJhY2VEaXNwbGF5VGV4dCxcbiAgICAgIFRyYWNlRGlzcGxheVpvb21Db250ZXh0OiBUcmFjZURpc3BsYXlab29tQ29udGV4dCxcbiAgICAgIERpc3BsYXlNb2RlbDogRGlzcGxheU1vZGVsLFxuICAgICAgV2luZG93U2NhbGU6IFdpbmRvd1NjYWxlLFxuICAgICAgV2luZG93U2NhbGVGaXg6IFdpbmRvd1NjYWxlRml4LFxuICAgICAgV2luZG93U2xpZGVyOiBXaW5kb3dTbGlkZXIsXG4gICAgICBLdGJzOiB7XG4gICAgICAgIExpc3RCYXNlczogTGlzdEJhc2VzLFxuICAgICAgICBMaXN0TW9kZWxJbkJhc2VzOiBMaXN0TW9kZWxJbkJhc2VzLFxuICAgICAgICBMaXN0VHJhY2VzSW5CYXNlczogTGlzdFRyYWNlc0luQmFzZXMsXG4gICAgICB9XG4gICAgfSxcbiAgfSxcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU2Ftb3RyYWNlcztcbiJdfQ==
