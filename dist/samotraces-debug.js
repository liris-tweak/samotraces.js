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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvVUkvV2lkZ2V0cy9EaXNwbGF5TW9kZWwuanMiLCJzcmMvVUkvV2lkZ2V0cy9JbXBvcnRUcmFjZS5qcyIsInNyYy9VSS9XaWRnZXRzL0ludGVydmFsVGltZUZvcm0uanMiLCJzcmMvVUkvV2lkZ2V0cy9MaXN0QmFzZXMuanMiLCJzcmMvVUkvV2lkZ2V0cy9MaXN0TW9kZWxJbkJhc2VzLmpzIiwic3JjL1VJL1dpZGdldHMvTGlzdFRyYWNlc0luQmFzZXMuanMiLCJzcmMvVUkvV2lkZ2V0cy9PYnNlbEluc3BlY3Rvci5qcyIsInNyYy9VSS9XaWRnZXRzL09ic2VsVHlwZUluc3BlY3Rvci5qcyIsInNyYy9VSS9XaWRnZXRzL1JlYWRhYmxlVGltZUZvcm0uanMiLCJzcmMvVUkvV2lkZ2V0cy9UaW1lRm9ybS5qcyIsInNyYy9VSS9XaWRnZXRzL1RpbWVTbGlkZXIuanMiLCJzcmMvVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29ucy5qcyIsInNyYy9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheUljb25zRml4LmpzIiwic3JjL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5SWNvbnNab29tLmpzIiwic3JjL1VJL1dpZGdldHMvVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcy5qcyIsInNyYy9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheVRleHQuanMiLCJzcmMvVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlab29tQ29udGV4dC5qcyIsInNyYy9VSS9XaWRnZXRzL1dpZGdldC5qcyIsInNyYy9VSS9XaWRnZXRzL1dpbmRvd1NjYWxlLmpzIiwic3JjL1VJL1dpZGdldHMvV2luZG93U2NhbGVGaXguanMiLCJzcmMvVUkvV2lkZ2V0cy9XaW5kb3dTbGlkZXIuanMiLCJzcmMvY29yZS9FdmVudEhhbmRsZXIuanMiLCJzcmMvY29yZS9LVEJTLkJhc2UuanMiLCJzcmMvY29yZS9LVEJTLk1vZGVsLmpzIiwic3JjL2NvcmUvS1RCUy5PYnNlbC5qcyIsInNyYy9jb3JlL0tUQlMuUmVzb3VyY2UuanMiLCJzcmMvY29yZS9LVEJTLlRyYWNlLmpzIiwic3JjL2NvcmUvS1RCUy5qcyIsInNyYy9jb3JlL0xvY2FsVHJhY2UuanMiLCJzcmMvY29yZS9PYnNlbC5qcyIsInNyYy9jb3JlL1NlbGVjdG9yLmpzIiwic3JjL2NvcmUvVGltZVdpbmRvdy5qcyIsInNyYy9jb3JlL1RpbWVyLmpzIiwic3JjL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9RQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyY0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciBkaXNwbGF5aW5nIGEgcmVwcmVzZW50YXRpb24gb2YgdGhlIG1vZGVsXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciBpbXBvcnRpbmcgYSB0cmFjZSBmcm9tIGEgQ1NWIGZpbGUuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVybnxGYXRtYSBEZXJiZWxcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBzZWUgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLkJhc2ljLkltcG9ydFRyYWNlXG4gKiBAdG9kbyBBVFRFTlRJT04gY29kZSBxdWkgdmllbnQgZCdhaWxsZXVycyAhXG4gKiBAZGVzY3JpcHRpb24gbm8gZGVzY3JpcHRpb25cbiAqIEBwYXJhbSB7b2JqZWN0fVx0aHRtbEVsZW1lbnRcbiAqICAgICBUaGUgSFRNTCBlbGVtZW50IHRoYXQgd2lsbCBiZSB1c2VkIGJ5IHRoZSB3aWRnZXRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UcmFjZX0gdHJhY2VcbiAqICAgICBUcmFjZSBvYmplY3QgaW4gd2hpY2ggdGhlIG9ic2VscyB3aWxsIGJlIGltcG9ydGVkLlxuICovXG5cbnZhciBEaXNwbGF5TW9kZWwgPSBmdW5jdGlvbihodG1sRWxlbWVudCwgbW9kZWwsIG9wdGlvbnMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIC8vb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxFbGVtZW50KTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1UcmFjZU1vZGVsJyk7XG4gIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgdGhpcy5tb2RlbC5vbignTW9kZWw6RHJhd19vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy5pbml0X0RPTSgpO1xuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuICB0aGlzLm1vZGVsLm9uKCdNb2RlbDpsaXN0ZVR5cGUnLCBmdW5jdGlvbihlKSB7XG4gICAgdGhpc193aWRnZXQuZGF0YSA9IGUuZGF0YTtcbiAgICB0aGlzX3dpZGdldC5kcmF3KCk7XG5cbiAgfSk7XG5cblxuICB2YXIgYmluZF9mdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbF9vcl9mdW4pIHtcbiAgICBpZiAodmFsX29yX2Z1biBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bi5iaW5kKHRoaXNfd2lkZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW47XG4gICAgfVxuICB9O1xuICB2YXIgeCA9IDA7XG4gIHZhciB4MSA9IDE2O1xuICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgdGhpcy5vcHRpb25zLnlfSW1nID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnggfHwgZnVuY3Rpb24oKSB7XG4gICAgeCA9IHggKyAxNjtcbiAgICByZXR1cm4geDtcbiAgfSk7XG4gIHRoaXMub3B0aW9ucy55X3RleHQgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueCB8fCBmdW5jdGlvbigpIHtcbiAgICB4MSA9IHgxICsgMTY7XG4gICAgcmV0dXJuIHgxO1xuICB9KTtcbiAgLy90aGlzLm9wdGlvbnMueSA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy55IHx8IDE3KTtcbiAgLy90aGlzLm9wdGlvbnMud2lkdGggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMud2lkdGggfHwgMTYpO1xuICAvL3RoaXMub3B0aW9ucy5oZWlnaHQgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMuaGVpZ2h0IHx8IDE2KTtcbiAgLy90aGlzLm9wdGlvbnMudXJsID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnVybCB8fCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFHN0FBQUJ1d0JIblU0TlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBS3NTVVJCVkRpTnJaTkxhRk5wRk1kLzMzZnZUYTV0WXB1cTB5YXRGV3VnUmhFWHc5QXVoSkVaQkNraXFKV0NJRXJyeHAyNDFDNkw2NjUwTS9XQm93dW5veUNEQ2pLckdZWjBJYml3eGtkVWJHeWFQbWdTbThkOWYyNU1iWFVsekg5NXp2LzhPT2R3amxCS3NWYWpVMWtFdEppYXZOQnNhS2NCcXE1LzNmS0RTd3JLWTMzSmRYN1JBSXhPWlFHTTNiSEl5bUN5UFpoWnFUOHAyZDRzUUd0WTcreU9idmh4TWpzdnA0dVZLT0EyUUVJcHhlaFVGbDJJdnVGVVozclpjdS8rOVg3UldxZzdKeHcvUUFGaFRkTFJGSm9ZNk40U2F6T05vMWN6cy8yZVVsTmpmVW4wUmlzbmUrUHA5eXYxOFR2WndybDlpVmIySjJKRVFob0tLTmtlNlVKNTVMZk1CNGFTSGVNbmUrUHBheS95QWtCY1RMOW1hN05wN1l1My9uMWxPamRROHdMTzc5M0d6bGd6RmRjall1am9VcEF0MTdqOExJZmpCNXpkdmZYQnYzT2xYM05WeTVTQU9KVktoUDk0TTI5VVhCOEZGR29XRTg5bnVmVGtIUTluRmxFS2VqWnVvTGUxaVlycjgrZmJlZTlVS2hFR2hCNlNZckJvdWRQTHRuc0FRQ25GNzY4S3ExdjJBeEFDNmw3QXN1VUNzR1M1aDR1V094MlNZbEJxUW95VUhXL085Z08rMWk5ZGJmeWNpS0dBL3dvbDNwVHJBTmgrUU5ueDVqUWhSdVEzVlorMVoxT1VnOTJiaVprRy8rU0wzSHU3Z1BmVnpRQklYNm1KbHBBZUQydnJXZHMzbXRoK3dPdFNsVWN6UzFSZGZ6VVgxaVF0SVQzdUt6V2hPNEdhakpuR25jMm1jZitqNHgxdW1KNHVWU2hVYlJTd1VIUFd3ZHZDeHVPWWFSeHdBalVwQVhVams3ZVA5YlRyRVVOYk5mMzBRNVRoWFYwYzZXa25Hdm9TanhnYXgzZTB1emN5ZVJ0UWNxd3ZTYTVxbWFZdUI0YVNIZU1OaUVKZ2FoSjl6V1FSUTJNbzJURnU2bklnVjdYTWRaZDQ4K1ZjLzNDcU0zMG0xWFgzd2N4aThkM0gyc2l0bDNtVUFDa0V5WmFtMjRlMmJUSGJUT1BjMWN4c2Y2UHUvM21tdGZyZWQvNEVTUU5LWEc4VkFDb0FBQUFBU1VWT1JLNUNZSUk9Jyk7XG5cbiAgICAgdGhpcy5zdHlsZXNoZWV0ID0gb3B0aW9ucyB8fCB7fSA7XG4gICAgIHRoaXMuZGF0YSA9IG1vZGVsLmxpc3RfVHlwZXNfT2JzbGVzO1xuICAgICB0aGlzLmRyYXcoKTtcblxuXG59O1xuXG5EaXNwbGF5TW9kZWwucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGRpdl9lbG10ID0gZDMuc2VsZWN0KHRoaXMuZWxlbWVudCk7XG4gICAgdGhpcy5kaXZfZWxtdCA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuc3ZnID0gZGl2X2VsbXQuYXBwZW5kKCdzdmcnKTtcbiAgICAvL3RoaXMuc3ZnID0gZGl2X2VsbXQuYXBwZW5kKCdzdmcnKS5hdHRyKCdoZWlnaHQnLCAnMTBweCcpO1xuICAgIC8vIGNyZWF0ZSB0aGUgKHJlZCkgbGluZSByZXByZXNlbnRpbmcgY3VycmVudCB0aW1lXG5cbiAgICB0aGlzLnggPSAxNjtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHZhciB4ID0gZDMudGltZS5zY2FsZSgpXG4gICAgICAuZG9tYWluKFtuZXcgRGF0ZSgyMDE0LCA0LCAxKSwgbmV3IERhdGUoMjAxNCwgNCwgMTUpIC0gMV0pXG4gICAgICAvLyAuZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSlcbiAgICAgIC5yYW5nZShbMCwgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXSk7XG5cbiAgICB2YXIgbWFyZ2luID0ge3RvcDogMjAwLCByaWdodDogNDAsIGJvdHRvbTogMjAwLCBsZWZ0OiA0MH0sXG4gICAgICBoZWlnaHQgPSA1MDAgLSBtYXJnaW4udG9wIC0gbWFyZ2luLmJvdHRvbTtcbiAgICAvKnRoaXMuc3ZnX2dwID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdGhpcy5zdmdfdGV4dCA9IHRoaXMuc3ZnLmFwcGVuZCgnZycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpOyovXG4gICAgdGhpcy5zdmdfc2VsZWN0ZWRfb2JzZWwgPSBkaXZfZWxtdC5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgJzAnKVxuICAgICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAgIC5hdHRyKCd5MicsICcxMDAlJylcbiAgICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAgIC5hdHRyKCdzdHJva2UnLCAnYmxhY2snKVxuICAgICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAgICAgLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgfSxcbiAgZDNPYnNlbHM6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLnN2Z19ncFxuICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlLGltYWdlLHJlY3QnKVxuICAgICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcblxuICBkM09ic2Vsc3RleHQ6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLnN2Z190ZXh0XG4gICAgICAuc2VsZWN0QWxsKCdjaXJjbGUsaW1hZ2UscmVjdCcpXG4gICAgICAvLyBUT0RPOiBBVFRFTlRJT04hIFdBUk5JTkchIG9ic2VscyBNVVNUIGhhdmUgYSBmaWVsZCBpZCAtPiB1c2VkIGFzIGEga2V5LlxuICAgICAgLy8uZGF0YSh0aGlzLmRhdGEpOyAvLyxmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pO1xuICAgICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pOyAvLyBUT0RPOiBib2d1ZSBpbiBjYXNlIG5vIElEIGV4aXN0cyAtPiBtaWdodCBoYXBwZW4gd2l0aCBLVEJTIHRyYWNlcyBhbmQgbmV3IG9ic2Vsc1xuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5kYXRhLmxlbmd0aCAhPT0gMCl7XG4gICAgdmFyIGltYWdlcyA9IHRoaXMuc3ZnLnNlbGVjdEFsbChcImNpcmNsZSxpbWFnZSxyZWN0XCIpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIGQuaWQ7XG4gICAgICB9KVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoXCJpbWFnZVwiKTtcblxuXG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB2YXIgaW1hZ2VzX2F0dCA9ICBpbWFnZXMuYXR0cignY2xhc3MnLCAnU2Ftb3RyYWNlcy1vYnNlbCcpXG4gICAgICAuYXR0cigneScsIHRoaXMub3B0aW9ucy55X0ltZylcbiAgICAgIC5hdHRyKCd4JywgMTcpXG4gICAgICAuYXR0cignd2lkdGgnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnd2lkdGgnKSk7IH0pXG4gICAgICAuYXR0cignaGVpZ2h0JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2hlaWdodCcpKTt9KVxuXHRcdFx0LmF0dHIoJ3hsaW5rOmhyZWYnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnaWNvbicpKTsgfSk7XG4gICAgICAvLy5hdHRyKCd4bGluazpocmVmJywgdGhpcy5vcHRpb25zLnVybCk7XG4gICAgICAvLy5hdHRyKCd4bGluazpocmVmJywgJ2ltYWdlcy9PcmFuZ2UucG5nJyk7XG4gICAgdmFyIHRleHQgPSB0aGlzLnN2Zy5zZWxlY3RBbGwoXCJ0ZXh0XCIpXG4gICAgICAuZGF0YSh0aGlzLmRhdGEpXG4gICAgICAuZW50ZXIoKVxuICAgICAgLmFwcGVuZChcInRleHRcIik7XG4gICAgdmFyIHRleHRMYWJlbHMgPSB0ZXh0XG4gICAgICAuYXR0cihcInhcIiwgJzM1JylcbiAgICAgIC5hdHRyKFwieVwiLCB0aGlzLm9wdGlvbnMueV90ZXh0KVxuICAgICAgLnRleHQoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC50eXBlO30pXG4gICAgICAuYXR0cihcImZvbnQtZmFtaWx5XCIsIFwic2Fucy1zZXJpZlwiKVxuICAgICAgLmF0dHIoXCJmb250LXNpemVcIiwgXCIxNXB4XCIpO1xuICAgICQoJ2ltYWdlJywgdGhpcy5lbGVtZW50KS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAkLmRhdGEoZWwsIHtcbiAgICAgICAgJ1NhbW90cmFjZXMtdHlwZSc6ICdvYnNlbCcsXG4gICAgICAgICdTYW1vdHJhY2VzLWRhdGEnOiBkMy5zZWxlY3QoZWwpLmRhdHVtKClcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgcmVmcmVzaF94OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgICAgLmF0dHIoJ3knLCB0aGlzLm9wdGlvbnMueSk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXlNb2RlbDtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciBpbXBvcnRpbmcgYSB0cmFjZSBmcm9tIGEgQ1NWIGZpbGUuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciBpbXBvcnRpbmcgYSB0cmFjZSBmcm9tIGEgQ1NWIGZpbGUuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQHNlZSBTYW1vdHJhY2VzLlVJLldpZGdldHMuQmFzaWMuSW1wb3J0VHJhY2VcbiAqIEB0b2RvIEFUVEVOVElPTiBjb2RlIHF1aSB2aWVudCBkJ2FpbGxldXJzICFcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIHtAbGluayBTYW1vdHJhY2VzLlVJLldpZGdldHMuQmFzaWMuSW1wb3J0VHJhY2V9IHdpZGdldCBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byBpbXBvcnQgYSB0cmFjZSBmcm9tIGEgQ1NWIGZpbGUuXG4gKlxuICogVGhpcyB3aWRnZXQgY3VycmVudGx5IGFjY2VwdCB0aGUgZm9sbG93aW5nIGZvcm1hdDpcbiAqXG4gKiAxLiBUaGUgQ1NWIGZpbGUgY2FuIHVzZSBlaXRoZXIgJywnIG9yICc7JyBhcyBhIHZhbHVlIHNlcGFyYXRvclxuICogMi4gRWFjaCBsaW5lIHJlcHJlc2VudHMgYW4gb2JzZWxcbiAqIDMuIFRoZSBmaXJzdCBjb2x1bW4gcmVwcmVzZW50cyB0aGUgdGltZSB3aGVuIHRoZSBvYnNlbCBvY2N1cnNcbiAqIDQuIFRoZSBzZWNvbmQgY29sdW1uIHJlcHJlc2VudHMgdGhlIHR5cGUgb2YgdGhlIG9ic2VsXG4gKiA1LiBUaGUgZm9sbG93aW5nIGNvbHVtbnMgcmVwcmVzZW50IHBhaXJzIG9mIFwiYXR0cmlidXRlXCIgLyBcInZhbHVlXCIgY29sdW1uc1xuICpcbiAqIFRoZSBudW1iZXIgb2YgY29sdW1ucyBtYXkgdmFyeSBmcm9tIGxpbmUgdG8gbGluZS5cbiAqIEZvciBleGFtcGxlLCBhIENTViBmaWxlIG1pZ2h0IGxvb2sgbGlrZSB0aGlzOlxuICogPHByZT5cbiAqIDAsY2xpY2ssdGFyZ2V0LGJ1dHRvbjJcbiAqIDIsY2xpY2ssdGFyZ2V0LGJ1dHRvbjEsdmFsdWUsdG90b1xuICogMyxmb2N1cyx0YXJnZXQsc3VibWl0XG4gKiA1LGNsaWNrLHRhcmdldCxzdWJtaXRcbiAqIDwvcHJlPlxuICogQHRvZG8gREVTQ1JJQkUgVEhFIEZPUk1BVCBPRiBUSEUgQ1NWIEZJTEUuXG4gKiBAcGFyYW0ge29iamVjdH1cdGh0bWxFbGVtZW50XG4gKiAgICAgVGhlIEhUTUwgZWxlbWVudCB0aGF0IHdpbGwgYmUgdXNlZCBieSB0aGUgd2lkZ2V0XG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVHJhY2V9IHRyYWNlXG4gKiAgICAgVHJhY2Ugb2JqZWN0IGluIHdoaWNoIHRoZSBvYnNlbHMgd2lsbCBiZSBpbXBvcnRlZC5cbiAqL1xuXG52YXIgSW1wb3J0VHJhY2UgPSBmdW5jdGlvbihodG1sRWxlbWVudCwgdHJhY2UpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gSW1wb3J0VHJhY2UgaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbEVsZW1lbnQpO1xuICB0aGlzLnRyYWNlID0gdHJhY2U7XG4gIHRoaXMuaW5pdF9ET00oKTtcbn07XG5cbkltcG9ydFRyYWNlLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB2YXIgdGV4dF9ub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0ltcG9ydCBhIHRyYWNlOiAnKTtcblxuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xuICAgIHRoaXMuaW5wdXRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdmaWxlJyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdjc3YtZmlsZVtdJyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbXVsdGlwbGUnLCAndHJ1ZScpO1xuICAgIC8vXHRcdHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLDE1KTtcbiAgICAvL1x0XHR0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsdGhpcy50aW1lci50aW1lKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5pbnB1dF9lbGVtZW50KTtcblxuICAgIC8vXHRcdHZhciBzdWJtaXRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgLy9cdFx0c3VibWl0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywnc3VibWl0Jyk7XG4gICAgLy9cdFx0c3VibWl0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsJ0ltcG9ydCcpO1xuICAgIC8vXHRcdHBfZWxlbWVudC5hcHBlbmRDaGlsZChzdWJtaXRfZWxlbWVudCk7XG5cbiAgICB0aGlzLmZvcm1fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgdGhpcy5vbl9jaGFuZ2UuYmluZCh0aGlzKSk7XG5cbiAgICB0aGlzLmZvcm1fZWxlbWVudC5hcHBlbmRDaGlsZChwX2VsZW1lbnQpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmZvcm1fZWxlbWVudCk7XG5cbiAgICB2YXIgYnV0dG9uX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHZhciBhX2VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGFfZWwuaHJlZiA9IFwiXCI7XG4gICAgYV9lbC5pbm5lckhUTUwgPSBcInRvZ2dsZSBjb25zb2xlXCI7XG4gICAgYnV0dG9uX2VsLmFwcGVuZENoaWxkKGFfZWwpO1xuICAgIC8vXHRcdGJ1dHRvbl9lbC5pbm5lckhUTUwgPSBcIjxhIGhyZWY9XFxcIlxcXCI+dG9nZ2xlIGNvbnNvbGU8L2E+XCI7XG4gICAgYV9lbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25fdG9nZ2xlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChidXR0b25fZWwpO1xuXG4gICAgdGhpcy5kaXNwbGF5X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuZGlzcGxheV9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kaXNwbGF5X2VsZW1lbnQpO1xuICB9LFxuXG4gIG9uX2NoYW5nZTogZnVuY3Rpb24oZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIGZpbGVzID0gZS50YXJnZXQuZmlsZXM7XG4gICAgdmFyIHRpdGxlX2VsLCBjb250ZW50X2VsO1xuICAgIGZvciAodmFyIGkgPSAwLCBmaWxlOyBmaWxlID0gZmlsZXNbaV07IGkrKykge1xuICAgICAgdGl0bGVfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDJcIik7XG4gICAgICB0aXRsZV9lbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShmaWxlLm5hbWUpKTtcbiAgICAgIHRoaXMuZGlzcGxheV9lbGVtZW50LmFwcGVuZENoaWxkKHRpdGxlX2VsKTtcbiAgICAgIGNvbnRlbnRfZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicHJlXCIpO1xuICAgICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICByZWFkZXIub25sb2FkID0gKGZ1bmN0aW9uKGVsLCBwYXJzZXIsIHRyYWNlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgcGFyc2VyKGUudGFyZ2V0LnJlc3VsdCwgdHJhY2UpO1xuICAgICAgICAgIGVsLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGUudGFyZ2V0LnJlc3VsdCkpO1xuICAgICAgICB9O1xuICAgICAgfSkoY29udGVudF9lbCwgdGhpcy5wYXJzZV9jc3YsIHRoaXMudHJhY2UpO1xuICAgICAgLypcdFx0XHRyZWFkZXIub25wcm9ncmVzcyA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIFx0XHRcdFx0Y29uc29sZS5sb2coZSk7XG4gICAgICBcdFx0XHR9OyovXG4gICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlKTtcbiAgICAgIHRoaXMuZGlzcGxheV9lbGVtZW50LmFwcGVuZENoaWxkKGNvbnRlbnRfZWwpO1xuICAgICAgdGhpcy50cmFjZS50cmlnZ2VyIChcImJlZm9yTG9hZEZpbGVcIik7XG4gICAgfVxuICB9LFxuXG4gIG9uX3RvZ2dsZTogZnVuY3Rpb24oZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5kaXNwbGF5X2VsZW1lbnQuc3R5bGUuZGlzcGxheSA9PT0gXCJub25lXCIpIHtcbiAgICAgIHRoaXMuZGlzcGxheV9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGlzcGxheV9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBwYXJzZV9jc3Y6IGZ1bmN0aW9uKHRleHQsIHRyYWNlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvL2Z1bmN0aW9uIGNzdlRvQXJyYXkoKSBmcm9tXG4gICAgLy8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xMjkzMTQ3L2phdmFzY3JpcHQtY29kZS10by1wYXJzZS1jc3YtZGF0YVxuXG4gICAgLy8gVGhpcyB3aWxsIHBhcnNlIGEgZGVsaW1pdGVkIHN0cmluZyBpbnRvIGFuIGFycmF5IG9mXG4gICAgLy8gYXJyYXlzLiBUaGUgZGVmYXVsdCBkZWxpbWl0ZXIgaXMgdGhlIGNvbW1hLCBidXQgdGhpc1xuICAgIC8vIGNhbiBiZSBvdmVycmlkZW4gaW4gdGhlIHNlY29uZCBhcmd1bWVudC5cbiAgICBmdW5jdGlvbiBjc3ZUb0FycmF5KHN0ckRhdGEsIHN0ckRlbGltaXRlcikge1xuICAgICAgLy8gQ2hlY2sgdG8gc2VlIGlmIHRoZSBkZWxpbWl0ZXIgaXMgZGVmaW5lZC4gSWYgbm90LFxuICAgICAgLy8gdGhlbiBkZWZhdWx0IHRvIGNvbW1hLlxuICAgICAgc3RyRGVsaW1pdGVyID0gKHN0ckRlbGltaXRlciB8fCBcIixcIik7XG5cbiAgICAgIC8vIENyZWF0ZSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBwYXJzZSB0aGUgQ1NWIHZhbHVlcy5cbiAgICAgIHZhciBvYmpQYXR0ZXJuID0gbmV3IFJlZ0V4cChcbiAgICAgIChcbiAgICAgIC8vIERlbGltaXRlcnMuXG4gICAgICBcIihcXFxcXCIgKyBzdHJEZWxpbWl0ZXIgKyBcInxcXFxccj9cXFxcbnxcXFxccnxeKVwiICtcblxuICAgICAgLy8gUXVvdGVkIGZpZWxkcy5cbiAgICAgIFwiKD86XFxcIihbXlxcXCJdKig/OlxcXCJcXFwiW15cXFwiXSopKilcXFwifFwiICtcblxuICAgICAgLy8gU3RhbmRhcmQgZmllbGRzLlxuICAgICAgXCIoW15cXFwiXFxcXFwiICsgc3RyRGVsaW1pdGVyICsgXCJcXFxcclxcXFxuXSopKVwiXG4gICAgICApLFxuICAgICAgXCJnaVwiXG4gICAgICApO1xuXG4gICAgICAvLyBDcmVhdGUgYW4gYXJyYXkgdG8gaG9sZCBvdXIgZGF0YS4gR2l2ZSB0aGUgYXJyYXlcbiAgICAgIC8vIGEgZGVmYXVsdCBlbXB0eSBmaXJzdCByb3cuXG4gICAgICB2YXIgYXJyRGF0YSA9IFtbXV07XG5cbiAgICAgIC8vIENyZWF0ZSBhbiBhcnJheSB0byBob2xkIG91ciBpbmRpdmlkdWFsIHBhdHRlcm5cbiAgICAgIC8vIG1hdGNoaW5nIGdyb3Vwcy5cbiAgICAgIHZhciBhcnJNYXRjaGVzID0gbnVsbDtcblxuICAgICAgLy8gS2VlcCBsb29waW5nIG92ZXIgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaGVzXG4gICAgICAvLyB1bnRpbCB3ZSBjYW4gbm8gbG9uZ2VyIGZpbmQgYSBtYXRjaC5cbiAgICAgIHdoaWxlIChhcnJNYXRjaGVzID0gb2JqUGF0dGVybi5leGVjKHN0ckRhdGEpKSB7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBkZWxpbWl0ZXIgdGhhdCB3YXMgZm91bmQuXG4gICAgICAgIHZhciBzdHJNYXRjaGVkRGVsaW1pdGVyID0gYXJyTWF0Y2hlc1sgMSBdO1xuXG4gICAgICAgIC8vIENoZWNrIHRvIHNlZSBpZiB0aGUgZ2l2ZW4gZGVsaW1pdGVyIGhhcyBhIGxlbmd0aFxuICAgICAgICAvLyAoaXMgbm90IHRoZSBzdGFydCBvZiBzdHJpbmcpIGFuZCBpZiBpdCBtYXRjaGVzXG4gICAgICAgIC8vIGZpZWxkIGRlbGltaXRlci4gSWYgaWQgZG9lcyBub3QsIHRoZW4gd2Uga25vd1xuICAgICAgICAvLyB0aGF0IHRoaXMgZGVsaW1pdGVyIGlzIGEgcm93IGRlbGltaXRlci5cbiAgICAgICAgaWYgKHN0ck1hdGNoZWREZWxpbWl0ZXIubGVuZ3RoICYmIChzdHJNYXRjaGVkRGVsaW1pdGVyICE9PSBzdHJEZWxpbWl0ZXIpKSB7XG5cbiAgICAgICAgICAvLyBTaW5jZSB3ZSBoYXZlIHJlYWNoZWQgYSBuZXcgcm93IG9mIGRhdGEsXG4gICAgICAgICAgLy8gYWRkIGFuIGVtcHR5IHJvdyB0byBvdXIgZGF0YSBhcnJheS5cbiAgICAgICAgICBhcnJEYXRhLnB1c2goW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93IHRoYXQgd2UgaGF2ZSBvdXIgZGVsaW1pdGVyIG91dCBvZiB0aGUgd2F5LFxuICAgICAgICAvLyBsZXQncyBjaGVjayB0byBzZWUgd2hpY2gga2luZCBvZiB2YWx1ZSB3ZVxuICAgICAgICAvLyBjYXB0dXJlZCAocXVvdGVkIG9yIHVucXVvdGVkKS5cbiAgICAgICAgaWYgKGFyck1hdGNoZXNbIDIgXSkge1xuXG4gICAgICAgICAgLy8gV2UgZm91bmQgYSBxdW90ZWQgdmFsdWUuIFdoZW4gd2UgY2FwdHVyZVxuICAgICAgICAgIC8vIHRoaXMgdmFsdWUsIHVuZXNjYXBlIGFueSBkb3VibGUgcXVvdGVzLlxuICAgICAgICAgIHZhciBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAyIF0ucmVwbGFjZShcbiAgICAgICAgICBuZXcgUmVnRXhwKFwiXFxcIlxcXCJcIiwgXCJnXCIpLCBcIlxcXCJcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gV2UgZm91bmQgYSBub24tcXVvdGVkIHZhbHVlLlxuICAgICAgICAgIHZhciBzdHJNYXRjaGVkVmFsdWUgPSBhcnJNYXRjaGVzWyAzIF07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBOb3cgdGhhdCB3ZSBoYXZlIG91ciB2YWx1ZSBzdHJpbmcsIGxldCdzIGFkZFxuICAgICAgICAvLyBpdCB0byB0aGUgZGF0YSBhcnJheS5cbiAgICAgICAgYXJyRGF0YVsgYXJyRGF0YS5sZW5ndGggLSAxIF0ucHVzaChzdHJNYXRjaGVkVmFsdWUpO1xuICAgICAgfVxuXG4gICAgICAvLyBSZXR1cm4gdGhlIHBhcnNlZCBkYXRhLlxuICAgICAgcmV0dXJuIChhcnJEYXRhKTtcbiAgICB9XG5cbiAgICAvLyBjb25zb2xlLmxvZygnZmljaGllciBjaGFyZ8OpJyk7XG4gICAgLy8gR3Vlc3NpbmcgdGhlIHNlcGFyYXRvclxuICAgIHZhciBzZXAgPSB0ZXh0W3RleHQuc2VhcmNoKFwiWyw7XFx0XVwiKV07XG4gICAgdmFyIGNzdiA9IGNzdlRvQXJyYXkodGV4dCwgc2VwKTtcbiAgICBjc3YucG9wKCk7IC8vIHJlbW92ZSB0aGUgbGFzdCBsaW5lLi4uIFdoeT8uLi5cbiAgICAvL1x0Y29uc29sZS5sb2coJ2ZpY2hpZXIgcGFyc8OpJyk7XG4gICAgY3N2Lm1hcChmdW5jdGlvbihsaW5lLGopIHtcbiAgICAgIHZhciBvX2F0dHIgPSB7fTtcbiAgICAgIG9fYXR0ci5iZWdpbiA9IGxpbmUuc2hpZnQoKTtcbiAgICAgIG9fYXR0ci50eXBlID0gbGluZS5zaGlmdCgpO1xuICAgICAgb19hdHRyLmF0dHJpYnV0ZXMgPSB7fTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgKGxpbmUubGVuZ3RoIC0gMSkgLyAyIDsgaSsrKSB7XG4gICAgICAgIGlmIChsaW5lWzIgKiBpXSAhPT0gXCJcIikge1xuICAgICAgICAgIG9fYXR0ci5hdHRyaWJ1dGVzW2xpbmVbMiAqIGldXSA9IGxpbmVbMiAqIGkgKyAxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGo9PT0wKSB7dHJhY2UudHJpZ2dlciAoXCJmaXJzdE9ic2VsTG9jYWxcIixvX2F0dHIpfTtcbiAgICAgIGlmIChqPT09Y3N2Lmxlbmd0aC0xKSB7dHJhY2UudHJpZ2dlciAoXCJMYXN0T2JzZWxMb2NhbFwiLG9fYXR0cil9O1xuXG4gICAgICB0cmFjZS5jcmVhdGVfb2JzZWwob19hdHRyKTtcbiAgICB9KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbXBvcnRUcmFjZTtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG5cbnZhciBJbnRlcnZhbFRpbWVGb3JtID0gZnVuY3Rpb24oaHRtbF9pZCwgdGltZVdpbmRvdykge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVJlYWRhYmxlVGltZUZvcm0nKTtcbiAgdGhpcy53aW5kb3cgPSB0aW1lV2luZG93O1xuICB0aGlzLndpbmRvdy5vbigndHc6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdy5vbigndHc6dHJhbnNsYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuICAvL3RoaXMudGltZXIub24oJ3RpbWVyOnVwZGF0ZScsdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuICAvL3RoaXMudGltZXIub24oJ3RpbWVyOnBsYXk6dXBkYXRlJyx0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5yZWZyZXNoKCk7XG5cdH07XG5cbkludGVydmFsVGltZUZvcm0ucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgcF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnRlJPTTogJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRleHRfbm9kZSk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ3llYXInKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCA0KTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnllYXJfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcvJykpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdtb250aCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tb250aF9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy8nKSk7XG4gICAgdGhpcy5kYXlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ2RheScpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRheV9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAtICcpKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnaG91cicpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaG91cl9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzonKSk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ21pbnV0ZScpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm1pbnV0ZV9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJzonKSk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ3NlY29uZCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgOCk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNlY29uZF9lbGVtZW50KTtcblxuICAgIC8vdmFyIHBfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgdmFyIHRleHRfbm9kZTEgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnVG86ICcpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUxKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAneWVhcicpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3NpemUnLCA0KTtcbiAgICB0aGlzLnllYXJfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy55ZWFyX2VsZW1lbnQxKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy8nKSk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudDEuc2V0QXR0cmlidXRlKCduYW1lJywgJ21vbnRoJyk7XG4gICAgdGhpcy5tb250aF9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3NpemUnLCAyKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubW9udGhfZWxlbWVudDEpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLycpKTtcbiAgICB0aGlzLmRheV9lbGVtZW50MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLmRheV9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnZGF5Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudDEuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5kYXlfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5kYXlfZWxlbWVudDEpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIC0gJykpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnbmFtZScsICdob3VyJyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQxLnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmhvdXJfZWxlbWVudDEpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnOicpKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbWludXRlJyk7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudDEuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5taW51dGVfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5taW51dGVfZWxlbWVudDEpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnOicpKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50MSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50MS5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnc2Vjb25kJyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudDEuc2V0QXR0cmlidXRlKCdzaXplJywgOCk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudDEuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5zZWNvbmRfZWxlbWVudDEpO1xuXG5cblxuXG5cbiAgICB2YXIgc3VibWl0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdzdWJtaXQnKTtcbiAgICBzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ1VwZGF0ZSB0aW1lJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHN1Ym1pdF9lbGVtZW50KTtcbiAgICB0aGlzLmZvcm1fZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICB0aGlzLmZvcm1fZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdzdWJtaXQnLCB0aGlzLmJ1aWxkX2NhbGxiYWNrKCdzdWJtaXQnKSk7XG5cbiAgICB0aGlzLmZvcm1fZWxlbWVudC5hcHBlbmRDaGlsZChwX2VsZW1lbnQpO1xuXG5cbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5mb3JtX2VsZW1lbnQpO1xuICB9LFxuICByZWZyZXNoOiBmdW5jdGlvbigpIHtcblxuICAgIHRpbWVzdGFydCA9IHRoaXMud2luZG93LnN0YXJ0O1xuICAgIHRpbWVFbmQgPSB0aGlzLndpbmRvdy5lbmQ7XG5cbiAgICB2YXIgZGF0ZXN0YXJ0ID0gbmV3IERhdGUoKTtcbiAgICBkYXRlc3RhcnQuc2V0VGltZSh0aW1lc3RhcnQpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnZhbHVlICAgPSBkYXRlc3RhcnQuZ2V0RnVsbFllYXIoKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQudmFsdWUgID0gZGF0ZXN0YXJ0LmdldE1vbnRoKCkgKyAxO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQudmFsdWUgICAgPSBkYXRlc3RhcnQuZ2V0RGF0ZSgpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnZhbHVlICAgPSBkYXRlc3RhcnQuZ2V0SG91cnMoKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnZhbHVlID0gZGF0ZXN0YXJ0LmdldE1pbnV0ZXMoKTtcbiAgICB0aGlzLnNlY29uZF9lbGVtZW50LnZhbHVlID0gZGF0ZXN0YXJ0LmdldFNlY29uZHMoKSArIGRhdGVzdGFydC5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDA7XG5cbiAgICB2YXIgZGF0ZUVuZCA9IG5ldyBEYXRlKCk7XG4gICAgZGF0ZUVuZC5zZXRUaW1lKHRpbWVFbmQpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50MS52YWx1ZSAgID0gZGF0ZUVuZC5nZXRGdWxsWWVhcigpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudDEudmFsdWUgID0gZGF0ZUVuZC5nZXRNb250aCgpICsgMTtcbiAgICB0aGlzLmRheV9lbGVtZW50MS52YWx1ZSAgICA9IGRhdGVFbmQuZ2V0RGF0ZSgpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50MS52YWx1ZSAgID0gZGF0ZUVuZC5nZXRIb3VycygpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQxLnZhbHVlID0gZGF0ZUVuZC5nZXRNaW51dGVzKCk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudDEudmFsdWUgPSBkYXRlRW5kLmdldFNlY29uZHMoKSArIGRhdGVFbmQuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwO1xuICB9LFxuICBidWlsZF9jYWxsYmFjazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgdGltZXJXaW5kb3cgPSB0aGlzLndpbmRvdztcbiAgICB2YXIgdGltZV9mb3JtID0gdGhpcztcbiAgICBzd2l0Y2ggKGV2ZW50KSB7XG4gICAgICBjYXNlICdzdWJtaXQnOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ1dpZGdldEJhc2ljVGltZUZvcm0uc3VibWl0Jyk7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cbiAgICAgICAgICB2YXIgZGF0ZXN0YXJ0ID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBkYXRlc3RhcnQuc2V0RnVsbFllYXIodGltZV9mb3JtLnllYXJfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZXN0YXJ0LnNldE1vbnRoKHRpbWVfZm9ybS5tb250aF9lbGVtZW50LnZhbHVlIC0gMSk7XG4gICAgICAgICAgZGF0ZXN0YXJ0LnNldERhdGUodGltZV9mb3JtLmRheV9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlc3RhcnQuc2V0SG91cnModGltZV9mb3JtLmhvdXJfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZXN0YXJ0LnNldE1pbnV0ZXModGltZV9mb3JtLm1pbnV0ZV9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlc3RhcnQuc2V0U2Vjb25kcyh0aW1lX2Zvcm0uc2Vjb25kX2VsZW1lbnQudmFsdWUpO1xuICAgICAgICAgIHZhciBkYXRlZW5kID0gbmV3IERhdGUoKTtcbiAgICAgICAgICBkYXRlZW5kLnNldEZ1bGxZZWFyKHRpbWVfZm9ybS55ZWFyX2VsZW1lbnQxLnZhbHVlKTtcbiAgICAgICAgICBkYXRlZW5kLnNldE1vbnRoKHRpbWVfZm9ybS5tb250aF9lbGVtZW50MS52YWx1ZSAtIDEpO1xuICAgICAgICAgIGRhdGVlbmQuc2V0RGF0ZSh0aW1lX2Zvcm0uZGF5X2VsZW1lbnQxLnZhbHVlKTtcbiAgICAgICAgICBkYXRlZW5kLnNldEhvdXJzKHRpbWVfZm9ybS5ob3VyX2VsZW1lbnQxLnZhbHVlKTtcbiAgICAgICAgICBkYXRlZW5kLnNldE1pbnV0ZXModGltZV9mb3JtLm1pbnV0ZV9lbGVtZW50MS52YWx1ZSk7XG4gICAgICAgICAgZGF0ZWVuZC5zZXRTZWNvbmRzKHRpbWVfZm9ybS5zZWNvbmRfZWxlbWVudDEudmFsdWUpO1xuICAgICAgICAgIHRpbWVyV2luZG93LnNldF9zdGFydChkYXRlc3RhcnQuZ2V0VGltZSgpKTtcbiAgICAgICAgICB0aW1lcldpbmRvdy5zZXRfZW5kIChkYXRlZW5kLmdldFRpbWUoKSlcbiAgICAgICAgICAvL3RpbWVyLnNldChkYXRlLmdldFRpbWUoKSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG5cdH07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJ2YWxUaW1lRm9ybTtcbiIsInZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4uLy4uL2NvcmUvRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBHZW5lcmljIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgdGhlIGF2YWlsYWJsZSBiYXNlcyBvZiBhIEtUQlMuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBUT0RPIGVjcmlyZSBkZXNjcmlwdGlvblxuICogQHRvZG8gRUNSSVJFIExBIERFU0NSSVBUSU9OXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxfaWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuTGliLktUQlN9IGt0YnNcbiAqICAgICBLVEJTIHRvIGJpbmQgdG8uXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuTGliLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ30gW2V2ZW50c11cbiAqICAgICBFdmVudHMgdG8gbGlzdGVuIHRvIGFuZCB0aGVpciBjb3JyZXNwb25kaW5nIGNhbGxiYWNrcy5cbiAqL1xudmFyIExpc3RCYXNlcyA9IGZ1bmN0aW9uKGh0bWxfaWQsIGt0YnMsIGV2ZW50cykge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuICBFdmVudEhhbmRsZXIuY2FsbCh0aGlzLCBldmVudHMpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LUxpc3RCYXNlcycpO1xuXG4gIHRoaXMua3RicyA9IGt0YnM7XG4gIGt0YnMub24oJ2t0YnM6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbn07XG5cbkxpc3RCYXNlcy5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcbiAgICAvL3RoaXMuZWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xuICAgIC8vJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCgnPGgyPktUQlMgcm9vdDogJyt0aGlzLmt0YnMuZ2V0X3VyaSgpKyc8L2gyPicpO1xuICAgIC8qXG4gICAgXHRcdHZhciB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgXHRcdHZhciB0aXRsZV90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0tUQlMgcm9vdDogJyt0aGlzLmt0YnMuZ2V0X3VyaSgpKTtcbiAgICBcdFx0dGl0bGUuYXBwZW5kQ2hpbGQodGl0bGVfdGV4dCk7XG4gICAgXHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aXRsZSk7XG4qL1xuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF0YWxpc3RfZWxlbWVudCk7XG5cbiAgICB0aGlzLmFkZF9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAkKHRoaXMuYWRkX2J1dHRvbikuYXBwZW5kKCdOZXcgYmFzZScpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmFkZF9idXR0b24pO1xuICAgICQodGhpcy5hZGRfYnV0dG9uKS5jbGljayh0aGlzLm9wZW5fZm9ybS5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgb3Blbl9mb3JtOiBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuYWRkX2J1dHRvbi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICB0aGlzLmZvcm0gPSB7fTtcblxuICAgIHRoaXMuZm9ybS5pbnB1dF9pZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X2lkLnNpemUgPSAyMDtcbiAgICB0aGlzLmZvcm0udGV4dDEgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIEJhc2UgSUQ6ICcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X2xhYmVsLnNpemUgPSAyMDtcbiAgICB0aGlzLmZvcm0udGV4dDIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIGxhYmVsOiAnKTtcbiAgICB0aGlzLmZvcm0uYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5hcHBlbmQoJ2NyZWF0ZScpO1xuXG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0udGV4dDEpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X2lkKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS50ZXh0Mik7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uaW5wdXRfbGFiZWwpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmJ1dHRvbik7XG5cbiAgICAkKHRoaXMuZm9ybS5idXR0b24pLmNsaWNrKHRoaXMuY3JlYXRlX2Jhc2UuYmluZCh0aGlzKSk7XG5cbiAgfSxcbiAgY3JlYXRlX2Jhc2U6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoJCh0aGlzLmZvcm0uaW5wdXRfaWQpLnZhbCgpICE9PSBcIlwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGEgbmV3IGJhc2UuLi5cIik7XG4gICAgICB0aGlzLmt0YnMuY3JlYXRlX2Jhc2UoJCh0aGlzLmZvcm0uaW5wdXRfaWQpLnZhbCgpLCAkKHRoaXMuZm9ybS5pbnB1dF9sYWJlbCkudmFsKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVtcHR5IGJhc2UgbmFtZS4uLiBObyBiYXNlIGNyZWF0ZWRcIik7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgayBpbiB0aGlzLmZvcm0pIHtcbiAgICAgIGlmICh0aGlzLmZvcm0uaGFzT3duUHJvcGVydHkoaykpICAgICAgeyQodGhpcy5mb3JtW2tdKS5yZW1vdmUoKTt9XG4gICAgfVxuICAgIHRoaXMuYWRkX2J1dHRvbi5kaXNhYmxlZCA9IGZhbHNlO1xuICB9LFxuICByZWZyZXNoOiBmdW5jdGlvbigpIHtcbiAgICAvLyBjbGVhclxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5pbm5lckhUTUwgPSAnJztcbiAgICB2YXIgbGlfZWxlbWVudDtcbiAgICB0aGlzLmt0YnMubGlzdF9iYXNlcygpLmZvckVhY2goZnVuY3Rpb24oYikge1xuICAgICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICBsaV9saW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICBsaV9saW5rLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYmFzZVwiKTtcbiAgICAgIGxpX2xpbmsuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYikpO1xuICAgICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9saW5rKTtcbiAgICAgIGxpX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZnVuY3Rpb24oKSB7dGhpcy50cmlnZ2VyKCd1aTpjbGljazpiYXNlJywgYil9KS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTtcbiAgICB9LCB0aGlzKTtcbiAgICB0aGlzLnRyaWdnZXIoXCJMaXN0QmFzZVwiKTtcblxuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0QmFzZXM7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuLi8uLi9jb3JlL0V2ZW50SGFuZGxlci5qc1wiKTtcblxuLyoqXG4gKiBAY2xhc3MgR2VuZXJpYyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIHRoZSBhdmFpbGFibGUgYmFzZXMgb2YgYSBLVEJTLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm4gLy8gZmF0bWEgREVyYmVsXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFRPRE8gZWNyaXJlIGRlc2NyaXB0aW9uXG4gKiBAdG9kbyBFQ1JJUkUgTEEgREVTQ1JJUFRJT05cbiAqIEBwYXJhbSB7U3RyaW5nfVx0aHRtbEVsZW1lbnRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuTGliLktUQlMuQmFzZX0ga3Ric0Jhc2VcbiAqICAgICBLVEJTIEJhc2UgdG8gYmluZCB0by5cbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnfSBbZXZlbnRzXVxuICogICAgIEV2ZW50cyB0byBsaXN0ZW4gdG8gYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2tzLlxuICovXG52YXIgTGlzdE1vZGVsSW5CYXNlcyA9IGZ1bmN0aW9uKGh0bWxFbGVtZW50LCBrdGJzQmFzZSwgZXZlbnRzKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbEVsZW1lbnQpO1xuICBFdmVudEhhbmRsZXIuY2FsbCh0aGlzLCBldmVudHMpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LUxpc3RUcmFjZXMnKTtcblxuICB0aGlzLmJhc2UgPSBrdGJzQmFzZTtcbiAgdGhpcy5iYXNlLm9uKCdiYXNlOnVwZGF0ZScsIHRoaXMucmVmcmVzaC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG59O1xuXG5MaXN0TW9kZWxJbkJhc2VzLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIC8vdGhpcy5lbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG5cbiAgICAvKnZhciB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgXHRcdHZhciB0aXRsZV90ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0Jhc2U6ICcrdGhpcy5iYXNlLmdldF91cmkoKSk7XG4gICAgXHRcdHRpdGxlLmFwcGVuZENoaWxkKHRpdGxlX3RleHQpO1xuICAgIFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGl0bGUpOyovXG5cbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRhdGFsaXN0X2VsZW1lbnQpO1xuXG5cbiAgICB0aGlzLmFkZF9idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAkKHRoaXMuYWRkX2J1dHRvbikuYXBwZW5kKCdOZXcgTW9kZWwnKTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5hZGRfYnV0dG9uKTtcbiAgICAkKHRoaXMuYWRkX2J1dHRvbikuY2xpY2sodGhpcy5vcGVuX2Zvcm0uYmluZCh0aGlzKSk7XG5cbiAgICAvKnRoaXMucmVtb3ZlX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIFx0XHQkKHRoaXMucmVtb3ZlX2J1dHRvbikuYXBwZW5kKCdEZWxldGUgYmFzZScpO1xuICAgIFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5yZW1vdmVfYnV0dG9uKTtcbiAgICBcdFx0JCh0aGlzLnJlbW92ZV9idXR0b24pLmNsaWNrKHRoaXMucmVtb3ZlX2Jhc2UuYmluZCh0aGlzKSk7Ki9cblxuXG4gIH0sXG4gIG9wZW5fZm9ybTogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5mb3JtID0ge307XG5cbiAgICB0aGlzLmZvcm0uaW5wdXRfaWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9pZC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQxID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBNb2RlbCBJRDogJyk7XG4vKiAgICB0aGlzLmZvcm0uaW5wdXRfbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9sYWJlbC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQyID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBsYWJlbDogJyk7Ki9cbiAgICB0aGlzLmZvcm0uYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5hcHBlbmQoJ2NyZWF0ZScpO1xuXG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0udGV4dDEpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X2lkKTtcbiAgICAvLyQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLnRleHQyKTtcbiAgICAvLyQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X2xhYmVsKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5idXR0b24pO1xuXG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5jbGljayh0aGlzLmNyZWF0ZV90cmFjZS5iaW5kKHRoaXMpKTtcblxuICB9LFxuICBjcmVhdGVfdHJhY2U6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoJCh0aGlzLmZvcm0uaW5wdXRfaWQpLnZhbCgpICE9PSBcIlwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGEgbmV3IHRyYWNlLi4uXCIpO1xuICAgICAgdGhpcy5iYXNlLmNyZWF0ZV9tb2RlbCgkKHRoaXMuZm9ybS5pbnB1dF9pZCkudmFsKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVtcHR5IHRyYWNlIG5hbWUuLi4gTm8gdHJhY2UgY3JlYXRlZFwiKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrIGluIHRoaXMuZm9ybSkge1xuICAgICAgJCh0aGlzLmZvcm1ba10pLnJlbW92ZSgpO1xuICAgIH1cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfSxcbiAgcmVtb3ZlX2Jhc2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYmFzZS5yZW1vdmUoKTtcbiAgfSxcbiAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgLy8gY2xlYXJcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgdmFyIGxpX2VsZW1lbnQ7XG4gICAgdGhpcy5iYXNlLmxpc3RfdHJhY2VzKCkuZm9yRWFjaChmdW5jdGlvbih0KSB7XG4gICAgICBpZiAodFsnQHR5cGUnXSA9PSBcIlRyYWNlTW9kZWxcIikge1xuICAgICAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICAgICAgbGlfbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBsaV9saW5rLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibW9kZWxcIik7XG4gICAgICAgIGxpX2xpbmsuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodFsnQGlkJ10pKTtcbiAgICAgICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9saW5rKTtcbiAgICAgICAgbGlfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChmdW5jdGlvbigpIHt0aGlzLnRyaWdnZXIoJ3VpOmNsaWNrOnRyYWNlJywgdFsnQGlkJ10pfSkuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfZWxlbWVudCk7fVxuICAgIH0sIHRoaXMpO1xuICAgIHRoaXMudHJpZ2dlcihcIkxpc3RNb2RlbFwiKTtcbiAgfSxcbiAgc2VsZWN0OiBmdW5jdGlvbigpIHtcblx0fVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMaXN0TW9kZWxJbkJhc2VzO1xuIiwidmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi4vLi4vY29yZS9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQGNsYXNzIEdlbmVyaWMgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgYXZhaWxhYmxlIGJhc2VzIG9mIGEgS1RCUy5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFRPRE8gZWNyaXJlIGRlc2NyaXB0aW9uXG4gKiBAdG9kbyBFQ1JJUkUgTEEgREVTQ1JJUFRJT05cbiAqIEBwYXJhbSB7U3RyaW5nfVx0aHRtbF9pZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuS1RCUy5CYXNlfSBrdGJzX2Jhc2VcbiAqICAgICBLVEJTIEJhc2UgdG8gYmluZCB0by5cbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5MaWIuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnfSBbZXZlbnRzXVxuICogICAgIEV2ZW50cyB0byBsaXN0ZW4gdG8gYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgY2FsbGJhY2tzLlxuICovXG52YXIgTGlzdFRyYWNlc0luQmFzZXMgPSBmdW5jdGlvbihodG1sX2lkLCBrdGJzX2Jhc2UsIGV2ZW50cykge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuICBFdmVudEhhbmRsZXIuY2FsbCh0aGlzLCBldmVudHMpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LUxpc3RUcmFjZXMnKTtcblxuICB0aGlzLmJhc2UgPSBrdGJzX2Jhc2U7XG4gIHRoaXMuYmFzZS5vbignYmFzZTp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xufTtcblxuTGlzdFRyYWNlc0luQmFzZXMucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG4gICAgLy90aGlzLmVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcblxuICAgIC8qdmFyIHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDInKTtcbiAgICBcdFx0dmFyIHRpdGxlX3RleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQmFzZTogJyt0aGlzLmJhc2UuZ2V0X3VyaSgpKTtcbiAgICBcdFx0dGl0bGUuYXBwZW5kQ2hpbGQodGl0bGVfdGV4dCk7XG4gICAgXHRcdHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aXRsZSk7Ki9cblxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF0YWxpc3RfZWxlbWVudCk7XG5cbiAgICAvKnRoaXMucmVtb3ZlX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIFx0XHQkKHRoaXMucmVtb3ZlX2J1dHRvbikuYXBwZW5kKCdEZWxldGUgYmFzZScpO1xuICAgIFx0XHR0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5yZW1vdmVfYnV0dG9uKTtcbiAgICBcdFx0JCh0aGlzLnJlbW92ZV9idXR0b24pLmNsaWNrKHRoaXMucmVtb3ZlX2Jhc2UuYmluZCh0aGlzKSk7Ki9cblxuICAgIHRoaXMuYWRkX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICQodGhpcy5hZGRfYnV0dG9uKS5hcHBlbmQoJ05ldyB0cmFjZScpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmFkZF9idXR0b24pO1xuICAgICQodGhpcy5hZGRfYnV0dG9uKS5jbGljayh0aGlzLm9wZW5fZm9ybS5iaW5kKHRoaXMpKTtcblxuICB9LFxuICBvcGVuX2Zvcm06IGZ1bmN0aW9uKCkge1xuXG4gICAgdGhpcy5hZGRfYnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZm9ybSA9IHt9O1xuXG4gICAgdGhpcy5mb3JtLmlucHV0X2lkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfaWQuc2l6ZSA9IDIwO1xuICAgIHRoaXMuZm9ybS50ZXh0MSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcgVHJhY2UgSUQ6ICcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5mb3JtLmlucHV0X2xhYmVsLnNpemUgPSAyMDtcbiAgICB0aGlzLmZvcm0udGV4dDIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnIGxhYmVsOiAnKTtcbiAgICB0aGlzLmZvcm0uaW5wdXRfbW9kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMuZm9ybS5pbnB1dF9tb2RlbC5zaXplID0gMjA7XG4gICAgdGhpcy5mb3JtLnRleHQzID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyBNT0RFTCBVUkk6ICcpO1xuICAgIHRoaXMuZm9ybS5idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAkKHRoaXMuZm9ybS5idXR0b24pLmFwcGVuZCgnY3JlYXRlJyk7XG5cbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS50ZXh0MSk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0uaW5wdXRfaWQpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLnRleHQyKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5pbnB1dF9sYWJlbCk7XG4gICAgJCh0aGlzLmVsZW1lbnQpLmFwcGVuZCh0aGlzLmZvcm0udGV4dDMpO1xuICAgICQodGhpcy5lbGVtZW50KS5hcHBlbmQodGhpcy5mb3JtLmlucHV0X21vZGVsKTtcbiAgICAkKHRoaXMuZWxlbWVudCkuYXBwZW5kKHRoaXMuZm9ybS5idXR0b24pO1xuXG4gICAgJCh0aGlzLmZvcm0uYnV0dG9uKS5jbGljayh0aGlzLmNyZWF0ZV90cmFjZS5iaW5kKHRoaXMpKTtcblxuICB9LFxuICBjcmVhdGVfdHJhY2U6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoJCh0aGlzLmZvcm0uaW5wdXRfaWQpLnZhbCgpICE9PSBcIlwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNyZWF0aW5nIGEgbmV3IHRyYWNlLi4uXCIpO1xuICAgICAgdGhpcy5iYXNlLmNyZWF0ZV9zdG9yZWRfdHJhY2UoJCh0aGlzLmZvcm0uaW5wdXRfaWQpLnZhbCgpLCAkKHRoaXMuZm9ybS5pbnB1dF9tb2RlbCkudmFsKCksIG51bGwsIG51bGwsICQodGhpcy5mb3JtLmlucHV0X2xhYmVsKS52YWwoKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRW1wdHkgdHJhY2UgbmFtZS4uLiBObyB0cmFjZSBjcmVhdGVkXCIpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGsgaW4gdGhpcy5mb3JtKSB7XG4gICAgICBpZiAodGhpcy5mb3JtLmhhc093blByb3BlcnR5KGspKSAgICAgIHskKHRoaXMuZm9ybVtrXSkucmVtb3ZlKCk7fVxuICAgIH1cbiAgICB0aGlzLmFkZF9idXR0b24uZGlzYWJsZWQgPSBmYWxzZTtcbiAgfSxcbiAgcmVtb3ZlX2Jhc2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuYmFzZS5yZW1vdmUoKTtcbiAgfSxcbiAgcmVmcmVzaDogZnVuY3Rpb24oKSB7XG4gICAgLy8gY2xlYXJcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gICAgdmFyIGxpX2VsZW1lbnQ7XG4gICAgdGhpcy5iYXNlLmxpc3RfdHJhY2VzKCkuZm9yRWFjaChmdW5jdGlvbih0KSB7XG4gICAgICBpZiAodFsnQHR5cGUnXSA9PSBcIlN0b3JlZFRyYWNlXCIpIHtcbiAgICAgICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgICAgIGxpX2xpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgbGlfbGluay5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInRyYWNlXCIpO1xuICAgICAgICBsaV9saW5rLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRbJ0BpZCddKSk7XG4gICAgICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQobGlfbGluayk7XG4gICAgICAgIC8vbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0WydAaWQnXSkpO1xuICAgICAgICBsaV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGZ1bmN0aW9uKCkge3RoaXMudHJpZ2dlcigndWk6Y2xpY2s6dHJhY2UnLCB0WydAaWQnXSl9KS5iaW5kKHRoaXMpKTtcbiAgICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTt9XG4gICAgfSwgdGhpcyk7XG4gICAgdGhpcy50cmlnZ2VyKFwiTGlzdFRyYWNlXCIpO1xuXG4gIH0sXG4gIHNlbGVjdDogZnVuY3Rpb24oKSB7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGlzdFRyYWNlc0luQmFzZXM7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYW4gT2JzZWwgYXMgYW4gSFRNTCBsaXN0LlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYW4gT2JzZWwgYXMgYW4gSFRNTCBsaXN0LlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEBjb25zdHJ1Y3RvclxuICogQG1peGVzIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaWRnZXRcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLk9ic2VsSW5zcGVjdG9yIGlzIGEgZ2VuZXJpY1xuICogV2lkZ2V0IHRvIHZpc3VhbGlzZSBPYnNlbHMuXG4gKlxuICogVGhpcyB3aWRnZXQgb2JzZXJ2ZXMgYSB7QGxpbmsgU2Ftb3RyYWNlcy5MaWIuU2VsZWN0b3J8U2VsZWN0b3J9XG4gKiBvYmplY3QuIFdoZW4gYW4gb2JzZWwgaXMgc2VsZWN0ZWQsIHRoZSBpbmZvcm1hdGlvbiBhYm91dFxuICogdGhpcyBvYnNlbCBpcyBkaXNwbGF5ZWQgaW4gdGhlIHdpZGdldC4gV2hlbiBhbiBvYnNlbCBpc1xuICogdW5zZWxlY3RlZCwgdGhlIHdpZGdldCBjbG9zZXMuIENsaWNraW5nIG9uIHRoZSByZWQgY3Jvc3NcbiAqIHdpbGwgY2xvc2UgdGhlIHdpZGdldCAoYW5kIGF1dG9tYXRpY2FsbHkgdW5zZWxlY3QgdGhlIG9ic2VsKS5cbiAqIFdoZW4gbm8gb2JzZWwgYXJlIHNlbGVjdGVkLCB0aGUgd2lkZ2V0IGlzIG5vdCB2aXNpYmxlLFxuICogc2VsZWN0aW5nIGFuIG9ic2VsIHdpbGwgbWFrZSBpdCBhcHBlYXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sX2lkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTZWxlY3Rvci48T2JzZWw+fSBvYnNlbF9zZWxlY3RvclxuICogICAgIEEgU2VsZWN0b3Igb2YgT2JzZWwgdG8gb2JzZXJ2ZS5cbiAqL1xudmFyIE9ic2VsSW5zcGVjdG9yID0gZnVuY3Rpb24oaHRtbF9pZCwgb2JzZWxfc2VsZWN0b3IpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1PYnNlbEluc3BlY3RvcicpO1xuXG4gIHRoaXMub2JzZWwgPSBvYnNlbF9zZWxlY3RvcjtcbiAgdGhpcy5vYnNlbC5vbignc2VsZWN0aW9uOmFkZCcsIHRoaXMuaW5zcGVjdC5iaW5kKHRoaXMpKTtcbiAgdGhpcy5vYnNlbC5vbignc2VsZWN0aW9uOmVtcHR5JywgdGhpcy5jbG9zZS5iaW5kKHRoaXMpKTtcbiAgdGhpcy5vYnNlbC5vbignc2VsZWN0aW9uOnJlbW92ZScsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy5pbml0X0RPTSgpO1xufTtcblxuT2JzZWxJbnNwZWN0b3IucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLmNsb3NlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgdmFyIGltZ19lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFOMXdBQURkY0JRaWliZUFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBRlBTVVJCVkRpTmxaT3hUZ0pSRUVYUGZVdVBFbXlNclFTTEphSFdoQ2lsdFlYL29aMlZzY0xLcjZDZ3BnT01Sbi9BUlJBdGlUWVlzVmQyTEZqSXN0a2xjWnFYek15NU01bVpweEVVZitIQzRBUm9PN2plTTNzanhWNmtVampQUFJRMGM5RFFNelFNem1ONW55RWMrV1pCSEE0azMwRVBLQzU4Z2h2MVlRenNKSXF0aUtUQmtYMDR3VzFLdDBVSHZiNVU2VXVWREJpZ3JTR1VRbmd3MkVwR0RiNmpWamVTTWNGRXNDOHpJNUI4RDdwcElta21tTXlnN3BzRkRzQTNDMlpRRjB6K0F3UEl6SmJCYUZoM3dHWUdQdzJoRnQrUWkwYzk4SlR3SmFvN0Q3eTRiNWs4a0tvMm4wTStTOEFnYjlBZFNOVVZnUWp1QUlVc09HWUZnODVDUkU5UWR2Q1lBVStqTjIwbVh3WUh6b096TkZnd0NhRVdRaTFqT3dYQmhmcndEbXduNGZpcTF0ekoyQWxhNjJCWWV5ZE5qYUQ0TS8rTnB3YjNPYmdzbTcybXRNeFEyZzNudWNlQ1ZnNnUvZ0JzNTRhbG9ud2RXUUFBQUFCSlJVNUVya0pnZ2c9PScpO1xuICAgIHRoaXMuY2xvc2VfZWxlbWVudC5hcHBlbmRDaGlsZChpbWdfZWxlbWVudCk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY2xvc2VfZWxlbWVudCk7XG5cbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRhdGFsaXN0X2VsZW1lbnQpO1xuXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICB0aGlzLmNsb3NlX2VsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQ2xvc2VBY3Rpb24uYmluZCh0aGlzKSk7XG4gIH0sXG4gIGluc3BlY3Q6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIG9icyA9IGV2ZW50LmRhdGE7XG4gICAgLy8gY2xlYXJcbiAgICB0aGlzLmRhdGFsaXN0X2VsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG5cbiAgICB2YXIgYXR0cmlidXRlcyA9IG9icy5hdHRyaWJ1dGVzO1xuXG4gICAgdmFyIGxpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ2lkOiAnICsgb2JzLmdldF9pZCgpKSk7XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuXG4gICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgndHlwZTogJyArIG9icy5nZXRfdHlwZSgpKSk7XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuXG4gICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnYmVnaW46ICcgKyBvYnMuZ2V0X2JlZ2luKCkpKTtcbiAgICAvL1x0bGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnYmVnaW46ICcrIChuZXcgRGF0ZShvYnMuZ2V0X2JlZ2luKCkpKS50b1N0cmluZygpKSk7XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuXG4gICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnZW5kOiAnICsgb2JzLmdldF9lbmQoKSkpO1xuICAgIC8vXHRsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdlbmQ6ICcrIChuZXcgRGF0ZShvYnMuZ2V0X2VuZCgpKSkudG9TdHJpbmcoKSkpO1xuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5hcHBlbmRDaGlsZChsaV9lbGVtZW50KTtcblxuICAgIGZvciAodmFyIGtleSBpbiBvYnMuYXR0cmlidXRlcykge1xuICAgICAgaWYgKG9icy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpICAgICAge2xpX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGtleSAgKyAnOiAnICsgb2JzLmF0dHJpYnV0ZXNba2V5XSkpO1xuICAgICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO31cbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gIH0sXG4gIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgfSxcbiAgb25DbG9zZUFjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5vYnNlbC51bnNlbGVjdCgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VsSW5zcGVjdG9yO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGFuIE9ic2VsIGFzIGFuIEhUTUwgbGlzdC5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGFuIE9ic2VsIGFzIGFuIEhUTUwgbGlzdC5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuIC8vIEZhdG1hIERlcmJlbFxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLlVJLldpZGdldHMuT2JzZWxJbnNwZWN0b3IgaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIE9ic2Vscy5cbiAqXG4gKiBUaGlzIHdpZGdldCBvYnNlcnZlcyBhIHtAbGluayBTYW1vdHJhY2VzLkxpYi5TZWxlY3RvcnxTZWxlY3Rvcn1cbiAqIG9iamVjdC4gV2hlbiBhbiBvYnNlbCBpcyBzZWxlY3RlZCwgdGhlIGluZm9ybWF0aW9uIGFib3V0XG4gKiB0aGlzIG9ic2VsIGlzIGRpc3BsYXllZCBpbiB0aGUgd2lkZ2V0LiBXaGVuIGFuIG9ic2VsIGlzXG4gKiB1bnNlbGVjdGVkLCB0aGUgd2lkZ2V0IGNsb3Nlcy4gQ2xpY2tpbmcgb24gdGhlIHJlZCBjcm9zc1xuICogd2lsbCBjbG9zZSB0aGUgd2lkZ2V0IChhbmQgYXV0b21hdGljYWxseSB1bnNlbGVjdCB0aGUgb2JzZWwpLlxuICogV2hlbiBubyBvYnNlbCBhcmUgc2VsZWN0ZWQsIHRoZSB3aWRnZXQgaXMgbm90IHZpc2libGUsXG4gKiBzZWxlY3RpbmcgYW4gb2JzZWwgd2lsbCBtYWtlIGl0IGFwcGVhci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxfaWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NlbGVjdG9yLjxPYnNlbD59IG9ic2VsX3NlbGVjdG9yXG4gKiAgICAgQSBTZWxlY3RvciBvZiBPYnNlbCB0byBvYnNlcnZlLlxuICovXG52YXIgT2JzZWxUeXBlSW5zcGVjdG9yID0gZnVuY3Rpb24oaHRtbF9pZCwgb2JzZWxfc2VsZWN0b3IpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1PYnNlbEluc3BlY3RvclR5cGUnKTtcblxuICB0aGlzLm9ic2VsID0gb2JzZWxfc2VsZWN0b3I7XG4gIHRoaXMub2JzZWwub24oJ3NlbGVjdGlvbjphZGQnLCB0aGlzLmluc3BlY3QuYmluZCh0aGlzKSk7XG4gIHRoaXMub2JzZWwub24oJ3NlbGVjdGlvbjplbXB0eScsIHRoaXMuY2xvc2UuYmluZCh0aGlzKSk7XG4gIHRoaXMub2JzZWwub24oJ3NlbGVjdGlvbjpyZW1vdmUnLCB0aGlzLmNsb3NlLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbn07XG5cbk9ic2VsVHlwZUluc3BlY3Rvci5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuICAgIHRoaXMuY2xvc2VfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICB2YXIgaW1nX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWdfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQU4xd0FBRGRjQlFpaWJlQUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFGUFNVUkJWRGlObFpPeFRnSlJFRVhQZlV1UEVteU1yUVNMSmFIV2hDaWx0WVgvb1oyVnNjTEtyNkNncGdPTVJuL0FSUkF0aVRZWXNWZDJMRmpJc3RrbGNacVh6TXk1TTVtWnB4RVVmK0hDNEFSb083amVNM3NqeFY2a1VqalBQUlEwYzlEUU16UU16bU41bnlFYytXWkJIQTRrMzBFUEtDNThnaHYxWVF6c0pJcXRpS1RCa1gwNHdXMUt0MFVIdmI1VTZVdVZEQmlnclNHVVFuZ3cyRXBHRGI2alZqZVNNY0ZFc0M4ekk1QjhEN3BwSW1rbW1NeWc3cHNGRHNBM0MyWlFGMHorQXdQSXpKYkJhRmgzd0dZR1B3MmhGdCtRaTBjOThKVHdKYW83RDd5NGI1azhrS28ybjBNK1M4QWdiOUFkU05VVmdRanVBSVVzT0dZRmc4NUNSRTlRZHZDWUFVK2pOMjBtWHdZSHpvT3pORmd3Q2FFV1FpMWpPd1hCaGZyd0Rtd240ZmlxMXR6SjJBbGE2MkJZZXlkTmphRDRNLytOcHdiM09iZ3NtNzJtdE14UTJnM251Y2VDVmc2dS9nQnM1NGFsb253ZFdRQUFBQUJKUlU1RXJrSmdnZz09Jyk7XG4gICAgdGhpcy5jbG9zZV9lbGVtZW50LmFwcGVuZENoaWxkKGltZ19lbGVtZW50KTtcbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jbG9zZV9lbGVtZW50KTtcblxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3VsJyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuZGF0YWxpc3RfZWxlbWVudCk7XG5cbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuICAgIHRoaXMuY2xvc2VfZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25DbG9zZUFjdGlvbi5iaW5kKHRoaXMpKTtcbiAgfSxcbiAgaW5zcGVjdDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgb2JzID0gZXZlbnQuZGF0YTtcbiAgICAvLyBjbGVhclxuICAgIHRoaXMuZGF0YWxpc3RfZWxlbWVudC5pbm5lckhUTUwgPSAnJztcblxuICAgIHZhciBhdHRyaWJ1dGVzID0gb2JzLmF0dHJpYnV0ZXM7XG4gICAgbGlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gICAgLy9saV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCd0eXBlOiAnKyBvYnMuZ2V0X3R5cGUoKSkpO1xuICAgIGxpX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ3R5cGU6ICcgKyBvYnNbXCJ0eXBlXCJdKSk7XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuXG5cbiAgICBsaV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgICBsaV9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdBdHRyaWJ1dDogJykpO1xuICAgIGZvciAodmFyIGtleSBpbiBvYnMuYXR0cmlidXRlcykge1xuICAgICAgZm9yICh2YXIgdmFsIGluIG9icy5hdHRyaWJ1dGVzW2tleV0pICAgICAge1xuXG5cbiAgICAgICAgLy8gIGxpX2VsZW1lbnRfQS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2YWwgICsnOiAnKyBvYnMuYXR0cmlidXRlc1trZXldW3ZhbF0pKTtcblxuXG5cblxuICAgICAgICBpZiAodmFsID09IFwiQGlkXCIpICAgICAgICB7XG4gICAgICAgICAgdWxfZWxlbWVudF9BID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgICBsaV9lbGVtZW50X0EgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgIGxpX3RleHQgPSBvYnMuYXR0cmlidXRlc1trZXldW3ZhbF0gKyAnIDogJyA7XG4gICAgICAgIH0gICAgICAgIGVsc2UgaWYgKHZhbCA9PSBcImxhYmVsXCIpICAgICAgICB7XG5cbiAgICAgICAgICBsaV9lbGVtZW50X0EuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobGlfdGV4dCArIG9icy5hdHRyaWJ1dGVzW2tleV1bdmFsXSkpO1xuICAgICAgICAgIHVsX2VsZW1lbnRfQS5hcHBlbmRDaGlsZChsaV9lbGVtZW50X0EpXG4gICAgICAgICAgbGlfZWxlbWVudC5hcHBlbmRDaGlsZCh1bF9lbGVtZW50X0EpO1xuICAgICAgICB9XG5cblxuXG5cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kYXRhbGlzdF9lbGVtZW50LmFwcGVuZENoaWxkKGxpX2VsZW1lbnQpO1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgfSxcbiAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9LFxuICBvbkNsb3NlQWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm9ic2VsLnVuc2VsZWN0KCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JzZWxUeXBlSW5zcGVjdG9yO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIHRoZSBjdXJyZW50IHRpbWUgYXMgYSBkYXRlL3RpbWUuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgY3VycmVudCB0aW1lIGFzIGEgZGF0ZS90aW0uXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5XaWRnZXRzLldpZGdldFxuICogQHNlZSBTYW1vdHJhY2VzLlVJLldpZGdldHMuVGltZUZvcm1cbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlJlYWRhYmxlVGltZUZvcm0gaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIHRoZSBjdXJyZW50IHRpbWUuXG4gKlxuICogVGhlIHRpbWUgKGluIG1zIGZyb20gdGhlIDAxLzAxLzE5NzApIGlzIGNvbnZlcnRlZCBpbiBhXG4gKiBodW1hbiByZWFkYWJsZSBmb3JtYXQgKGFzIG9wcG9zZWQgdG9cbiAqIHtAbGluayBTYW1vdHJhY2VzLldpZGdldHMuVGltZUZvcm19IHdpZGdldFxuICogd2hpY2ggZGlzcGxheSByYXcgdGltZSkuXG4gKlxuICogVGhpcyB3aWRnZXQgb2JzZXJ2ZXMgYSBTYW1vdHJhY2VzLkxpYi5UaW1lciBvYmplY3QuXG4gKiBXaGVuIHRoZSB0aW1lciBjaGFuZ2VzIHRoZSBuZXcgdGltZSBpcyBkaXNwbGF5ZWQuXG4gKiBUaGlzIHdpZGdldCBhbHNvIGFsbG93IHRvIGNoYW5nZSB0aGUgdGltZSBvZiB0aGUgdGltZXIuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHRodG1sX2lkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLlRpbWVyfSB0aW1lclxuICogICAgIFRpbWVyIG9iamVjdCB0byBvYnNlcnZlLlxuICovXG52YXIgUmVhZGFibGVUaW1lRm9ybSA9IGZ1bmN0aW9uKGh0bWxfaWQsIHRpbWVyKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG5cbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1SZWFkYWJsZVRpbWVGb3JtJyk7XG5cbiAgdGhpcy50aW1lciA9IHRpbWVyO1xuICB0aGlzLnRpbWVyLm9uKCd0aW1lcjp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG4gIHRoaXMudGltZXIub24oJ3RpbWVyOnBsYXk6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5yZWZyZXNoKHtkYXRhOiB0aGlzLnRpbWVyLnRpbWV9KTtcbn07XG5cblJlYWRhYmxlVGltZUZvcm0ucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgcF9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuXG4gICAgdmFyIHRleHRfbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdDdXJyZW50IHRpbWU6ICcpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0X25vZGUpO1xuXG5cbiAgICB0aGlzLnllYXJfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLnllYXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAneWVhcicpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDQpO1xuICAgIHRoaXMueWVhcl9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMueWVhcl9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy8nKSk7XG5cbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMubW9udGhfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCAnbW9udGgnKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5tb250aF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubW9udGhfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcvJykpO1xuXG4gICAgdGhpcy5kYXlfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ2RheScpO1xuICAgIHRoaXMuZGF5X2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5kYXlfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmRheV9lbGVtZW50KTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJyAtICcpKTtcblxuICAgIHRoaXMuaG91cl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICB0aGlzLmhvdXJfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuaG91cl9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdob3VyJyk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgMik7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5ob3VyX2VsZW1lbnQpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnOicpKTtcblxuICAgIHRoaXMubWludXRlX2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICdtaW51dGUnKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDIpO1xuICAgIHRoaXMubWludXRlX2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsICcnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5taW51dGVfZWxlbWVudCk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCc6JykpO1xuXG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywgJ3NlY29uZCcpO1xuICAgIHRoaXMuc2Vjb25kX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzaXplJywgOCk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJycpO1xuICAgIHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNlY29uZF9lbGVtZW50KTtcbiAgICAvKlxuICAgIFx0XHR0aGlzLmlucHV0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIFx0XHR0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd0eXBlJywndGV4dCcpO1xuICAgIFx0XHR0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCduYW1lJywnJyk7XG4gICAgXHRcdHRoaXMuaW5wdXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NpemUnLDE1KTtcbiAgICBcdFx0dGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndmFsdWUnLHRoaXMudGltZXIudGltZSk7XG4gICAgXHRcdHBfZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmlucHV0X2VsZW1lbnQpO1xuKi9cbiAgICB2YXIgc3VibWl0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdzdWJtaXQnKTtcbiAgICBzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ1VwZGF0ZSB0aW1lJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHN1Ym1pdF9lbGVtZW50KTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuYnVpbGRfY2FsbGJhY2soJ3N1Ym1pdCcpKTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFwcGVuZENoaWxkKHBfZWxlbWVudCk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5mb3JtX2VsZW1lbnQpO1xuICB9LFxuXG4gIHJlZnJlc2g6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgdGltZSA9IGUuZGF0YVxuICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICBkYXRlLnNldFRpbWUodGltZSk7XG4gICAgdGhpcy55ZWFyX2VsZW1lbnQudmFsdWUgICA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcbiAgICB0aGlzLm1vbnRoX2VsZW1lbnQudmFsdWUgID0gZGF0ZS5nZXRNb250aCgpICsgMTtcbiAgICB0aGlzLmRheV9lbGVtZW50LnZhbHVlICAgID0gZGF0ZS5nZXREYXRlKCk7XG4gICAgdGhpcy5ob3VyX2VsZW1lbnQudmFsdWUgICA9IGRhdGUuZ2V0SG91cnMoKTtcbiAgICB0aGlzLm1pbnV0ZV9lbGVtZW50LnZhbHVlID0gZGF0ZS5nZXRNaW51dGVzKCk7XG4gICAgdGhpcy5zZWNvbmRfZWxlbWVudC52YWx1ZSA9IGRhdGUuZ2V0U2Vjb25kcygpICsgZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDA7XG4gIH0sXG5cbiAgYnVpbGRfY2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRpbWVyID0gdGhpcy50aW1lcjtcbiAgICB2YXIgdGltZV9mb3JtID0gdGhpcztcbiAgICBzd2l0Y2ggKGV2ZW50KSB7XG4gICAgICBjYXNlICdzdWJtaXQnOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ1dpZGdldEJhc2ljVGltZUZvcm0uc3VibWl0Jyk7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cbiAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgZGF0ZS5zZXRGdWxsWWVhcih0aW1lX2Zvcm0ueWVhcl9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlLnNldE1vbnRoKHRpbWVfZm9ybS5tb250aF9lbGVtZW50LnZhbHVlIC0gMSk7XG4gICAgICAgICAgZGF0ZS5zZXREYXRlKHRpbWVfZm9ybS5kYXlfZWxlbWVudC52YWx1ZSk7XG4gICAgICAgICAgZGF0ZS5zZXRIb3Vycyh0aW1lX2Zvcm0uaG91cl9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlLnNldE1pbnV0ZXModGltZV9mb3JtLm1pbnV0ZV9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICBkYXRlLnNldFNlY29uZHModGltZV9mb3JtLnNlY29uZF9lbGVtZW50LnZhbHVlKTtcblxuICAgICAgICAgIHRpbWVyLnNldChkYXRlLmdldFRpbWUoKSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhZGFibGVUaW1lRm9ybTtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyB0aGUgY3VycmVudCB0aW1lIGFzIGEgbnVtYmVyLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgdGhlIGN1cnJlbnQgdGltZSBhcyBhIG51bWJlci5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAc2VlIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5SZWFkYWJsZVRpbWVGb3JtXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UaW1lRm9ybSBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgdGhlIGN1cnJlbnQgdGltZS5cbiAqXG4gKiBUaGUgdGltZSBpcyBkaXNwbGF5ZWQgYXMgYSBudW1iZXIuIFNlZVxuICoge0BsaW5rIFNhbW90cmFjZXMuV2lkZ2V0cy5UaW1lRm9ybX0gdG8gY29udmVydFxuICogcmF3IHRpbWUgKGluIG1zIGZyb20gdGhlIDAxLzAxLzE5NzApIHRvIGEgaHVtYW4gcmVhZGFibGVcbiAqIGZvcm1hdC5cbiAqXG4gKiBUaGlzIHdpZGdldCBvYnNlcnZlcyBhIFNhbW90cmFjZXMuTGliLlRpbWVyIG9iamVjdC5cbiAqIFdoZW4gdGhlIHRpbWVyIGNoYW5nZXMgdGhlIG5ldyB0aW1lIGlzIGRpc3BsYXllZC5cbiAqIFRoaXMgd2lkZ2V0IGFsc28gYWxsb3cgdG8gY2hhbmdlIHRoZSB0aW1lIG9mIHRoZSB0aW1lci5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdGh0bWxfaWRcbiAqICAgICBJZCBvZiB0aGUgRElWIGVsZW1lbnQgd2hlcmUgdGhlIHdpZGdldCB3aWxsIGJlXG4gKiAgICAgaW5zdGFudGlhdGVkXG4gKiBAcGFyYW0ge1NhbW90cmFjZXMuVGltZXJ9IHRpbWVyXG4gKiAgICAgVGltZXIgb2JqZWN0IHRvIG9ic2VydmUuXG4gKi9cbnZhciBUaW1lRm9ybSA9IGZ1bmN0aW9uKGh0bWxfaWQsIHRpbWVyKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG5cbiAgdGhpcy50aW1lciA9IHRpbWVyO1xuICB0aGlzLnRpbWVyLm9uKCd0aW1lcjp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG4gIHRoaXMudGltZXIub24oJ3RpbWVyOnBsYXk6dXBkYXRlJywgdGhpcy5yZWZyZXNoLmJpbmQodGhpcykpO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgdGhpcy5yZWZyZXNoKHtkYXRhOiB0aGlzLnRpbWVyLnRpbWV9KTtcbn07XG5cblRpbWVGb3JtLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgdmFyIHBfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcblxuICAgIHZhciB0ZXh0X25vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnQ3VycmVudCB0aW1lOiAnKTtcbiAgICBwX2VsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dF9ub2RlKTtcblxuICAgIHRoaXMuaW5wdXRfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnbmFtZScsICd0aW1lJyk7XG4gICAgdGhpcy5pbnB1dF9lbGVtZW50LnNldEF0dHJpYnV0ZSgnc2l6ZScsIDE1KTtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQuc2V0QXR0cmlidXRlKCd2YWx1ZScsIHRoaXMudGltZXIudGltZSk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuaW5wdXRfZWxlbWVudCk7XG5cbiAgICB2YXIgc3VibWl0X2VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIHN1Ym1pdF9lbGVtZW50LnNldEF0dHJpYnV0ZSgndHlwZScsICdzdWJtaXQnKTtcbiAgICBzdWJtaXRfZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgJ1VwZGF0ZSB0aW1lJyk7XG4gICAgcF9lbGVtZW50LmFwcGVuZENoaWxkKHN1Ym1pdF9lbGVtZW50KTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIHRoaXMuYnVpbGRfY2FsbGJhY2soJ3N1Ym1pdCcpKTtcblxuICAgIHRoaXMuZm9ybV9lbGVtZW50LmFwcGVuZENoaWxkKHBfZWxlbWVudCk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5mb3JtX2VsZW1lbnQpO1xuICB9LFxuXG4gIHJlZnJlc2g6IGZ1bmN0aW9uKGUpIHtcbiAgICB0aGlzLmlucHV0X2VsZW1lbnQudmFsdWUgPSBlLmRhdGE7XG4gIH0sXG5cbiAgYnVpbGRfY2FsbGJhY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIHRpbWVyID0gdGhpcy50aW1lcjtcbiAgICB2YXIgaW5wdXRfZWxlbWVudCA9IHRoaXMuaW5wdXRfZWxlbWVudDtcbiAgICBzd2l0Y2ggKGV2ZW50KSB7XG4gICAgICBjYXNlICdzdWJtaXQnOlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8vY29uc29sZS5sb2coJ1dpZGdldEJhc2ljVGltZUZvcm0uc3VibWl0Jyk7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRpbWVyLnNldChpbnB1dF9lbGVtZW50LnZhbHVlKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lRm9ybTtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRpbWUgc2xpZGVyLlxuICogQGNsYXNzIFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0aW1lIHNsaWRlci5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5kM0Jhc2ljLlRpbWVTbGlkZXIgaXMgYSBnZW5lcmljXG4gKiBXaWRnZXQgdG8gdmlzdWFsaXNlIHRoZSBjdXJyZW50IHRpbWUgaW4gYSB0ZW1wb3JhbCB3aW5kb3dcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdGRpdklkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHRpbWVfd2luZG93XG4gKiAgICAgVGltZVdpbmRvdyBvYmplY3QgLT4gcmVwcmVzZW50aW5nIHRoZSB3aWRlIHdpbmRvd1xuICogICAgIChlLmcuLCB0aGUgd2hvbGUgdHJhY2UpXG4gKiBAcGFyYW0gdGltZXJcbiAqICAgICBUaW1lZXIgb2JqZWN0IC0+IGNvbnRhaW5pbmcgdGhlIGN1cnJlbnQgdGltZVxuICovXG52YXIgVGltZVNsaWRlciA9IGZ1bmN0aW9uKGh0bWxfaWQsIHRpbWVfd2luZG93LCB0aW1lcikge1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGh0bWxfaWQpO1xuXG4gIHRoaXMuYWRkX2NsYXNzKCdXaWRnZXQtVGltZVNsaWRlcicpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcblxuICB0aGlzLnRpbWVyID0gdGltZXI7XG4gIHRoaXMudGltZXIub24oJ3RpbWVyOnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50aW1lci5vbigndGltZXI6cGxheTp1cGRhdGUnLCB0aGlzLnJlZnJlc2guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy50aW1lX3dpbmRvdyA9IHRpbWVfd2luZG93O1xuICB0aGlzLnRpbWVfd2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG5cbiAgLy8gdXBkYXRlIHNsaWRlciBzdHlsZVxuICB0aGlzLnNsaWRlcl9vZmZzZXQgPSAwO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgLy8gdXBkYXRlIHNsaWRlcidzIHBvc2l0aW9uXG4gIHRoaXMuZHJhdygpO1xuXG59O1xuXG5UaW1lU2xpZGVyLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIC8vIGNyZWF0ZSB0aGUgc2xpZGVyXG4gICAgdGhpcy5zbGlkZXJfZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnNsaWRlcl9lbGVtZW50KTtcblxuICAgIC8vIGhhbmQgbWFkZSBkcmFnJmRyb3BcbiAgICB2YXIgd2lkZ2V0ID0gdGhpcztcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoJ2NoYW5nZVRpbWVPbkRyYWcnLCB0aGlzLnNsaWRlcl9lbGVtZW50LCB7XG4gICAgICBvblVwQ2FsbGJhY2s6IGZ1bmN0aW9uKGRlbHRhX3gpIHtcbiAgICAgICAgdmFyIG5ld190aW1lID0gd2lkZ2V0LnRpbWVyLnRpbWUgKyBkZWx0YV94ICogd2lkZ2V0LnRpbWVfd2luZG93LmdldF93aWR0aCgpIC8gd2lkZ2V0LmVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIHdpZGdldC50aW1lci5zZXQobmV3X3RpbWUpO1xuICAgICAgfSxcbiAgICAgIG9uTW92ZUNhbGxiYWNrOiBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICAgICAgdmFyIG9mZnNldCA9IHdpZGdldC5zbGlkZXJfb2Zmc2V0ICsgb2Zmc2V0O1xuICAgICAgICB3aWRnZXQuc2xpZGVyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdsZWZ0OiAnICsgb2Zmc2V0ICsgJ3B4OycpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNsaWRlcl9vZmZzZXQgPSAodGhpcy50aW1lci50aW1lIC0gdGhpcy50aW1lX3dpbmRvdy5zdGFydCkgKiB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLnRpbWVfd2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsICdsZWZ0OicgKyB0aGlzLnNsaWRlcl9vZmZzZXQgKyAncHg7IGRpc3BsYXk6IGJsb2NrOycpO1xuICB9LFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbWVTbGlkZXI7XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0cmFjZSB3aGVyZSBvYnNlbHMgYXJlIGRpc3BsYXllZCBhcyBpbWFnZXMuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRyYWNlIHdoZXJlIG9ic2VscyBhcmUgZGlzcGxheWVkIGFzIGltYWdlc1xuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBkMy5qcyBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2QzanMub3JnXCI+ZDNqcy5vcmc8L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUge0BsaW5rIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29uc3xUcmFjZURpc3BsYXlJY29uc30gd2lkZ2V0XG4gKiBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgdHJhY2VzIHdpdGggaW1hZ2VzLiBUaGlzIHdpZGdldCB1c2VzXG4gKiBkMy5qcyB0byBkaXNwbGF5IHRyYWNlcyBhcyBpbWFnZXMgaW4gYSBTVkcgaW1hZ2UuXG4gKiBUaGUgZGVmYXVsdCBzZXR0aW5ncyBhcmUgc2V0IHVwIHRvIHZpc3VhbGlzZSAxNngxNiBwaXhlbHNcbiAqIGljb25zLiBJZiBubyB1cmwgaXMgZGVmaW5lZCAoc2VlIG9wdGlvbnMpLCBhIHF1ZXN0aW9ubWFya1xuICogaWNvbiB3aWxsIGJlIGRpc3BsYXllZCBieSBkZWZhdWx0IGZvciBlYWNoIG9ic2VsLlxuICpcbiAqIE5vdGUgdGhhdCBjbGlja2luZyBvbiBhbiBvYnNlbCB3aWxsIHRyaWdnZXIgYVxuICoge0BsaW5rIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29ucyN1aTpjbGljazpvYnNlbHx1aTpjbGljazpvYnNlbH1cbiAqIGV2ZW50LlxuICpcbiAqIFR1dG9yaWFscyB7QHR1dG9yaWFsIHR1dG8xLjFfdHJhY2VfdmlzdWFsaXNhdGlvbn0sXG4gKiB7QHR1dG9yaWFsIHR1dG8xLjJfYWRkaW5nX3dpZGdldHN9LCBhbmRcbiAqIHtAdHV0b3JpYWwgdHV0bzEuM192aXN1YWxpc2F0aW9uX3BlcnNvbmFsaXNhdGlvbn0gaWxsdXN0cmF0ZXNcbiAqIGluIG1vcmUgZGV0YWlscyBob3cgdG8gdXNlIHRoaXMgY2xhc3MuXG4gKiBAcGFyYW0ge1N0cmluZ31cdGRpdklkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtUcmFjZX1cdHRyYWNlXG4gKiAgICAgVHJhY2Ugb2JqZWN0IHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7VGltZVdpbmRvd30gdGltZV93aW5kb3dcbiAqICAgICBUaW1lV2luZG93IG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIHRpbWUgZnJhbWVcbiAqICAgICBiZWluZyBjdXJyZW50bHkgZGlzcGxheWVkLlxuICpcbiAqIEBwYXJhbSB7VmlzdUNvbmZpZ30gW29wdGlvbnNdXG4gKiAgICAgT2JqZWN0IGRldGVybWluaW5nIGhvdyB0byBkaXNwbGF5IHRoZSBpY29uc1xuICogICAgIChPcHRpb25hbCkuIEFsbCB0aGUgb3B0aW9ucyBmaWVsZCBjYW4gYmUgZWl0aGVyXG4gKiAgICAgYSB2YWx1ZSBvciBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgYnlcbiAqICAgICBkMy5qcy4gVGhlIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBhcyB0aGUgZmlyc3RcbiAqICAgICBhcmd1bWVudCB0aGUgT2JzZWwgdG8gZGlzcGxheSBhbmQgc2hvdWxkIHJldHVyblxuICogICAgIHRoZSBjYWxjdWxhdGVkIHZhbHVlLlxuICogICAgIElmIGEgZnVuY3Rpb24gaXMgZGVmaW5lZCBhcyBhbiBhcmd1bWVudCwgaXQgd2lsbFxuICogICAgIGJlIGJpbmRlZCB0byB0aGUgVHJhY2VEaXNwbGF5SWNvbnMgaW5zdGFuY2UuXG4gKiAgICAgVGhpcyBtZWFucyB0aGF0IHlvdSBjYW4gY2FsbCBhbnkgbWV0aG9kIG9mIHRoZVxuICogICAgIFRyYWNlRGlzcGxheUljb25zIGluc3RhbmNlIHRvIGhlbHAgY2FsY3VsYXRlXG4gKiAgICAgdGhlIHggcG9zaXRpb24gb3IgeSBwb3NpdGlvbiBvZiBhbiBpY29uLiBUaGlzXG4gKiAgICAgbWFrZXMgaXQgZWFzeSB0byBkZWZpbmUgdmFyaW91cyB0eXBlcyBvZiBiZWhhdmlvdXJzLlxuICogICAgIFJlbGV2YW50IG1ldGhvZHMgdG8gdXNlIGFyZTpcbiAqICAgICBsaW5rIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29ucy5jYWxjdWxhdGVfeH1cbiAqICAgICBTZWUgdHV0b3JpYWxcbiAqICAgICB7QHR1dG9yaWFsIHR1dG8xLjNfdmlzdWFsaXNhdGlvbl9wZXJzb25hbGlzYXRpb259XG4gKiAgICAgZm9yIG1vcmUgZGV0YWlscyBhbmQgZXhhbXBsZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIHZhciBvcHRpb25zID0ge1xuICogICAgIHk6IDIwLFxuICogICAgIHdpZHRoOiAzMixcbiAqICAgICBoZWlnaHQ6IDMyLFxuICogICAgIHVybDogZnVuY3Rpb24ob2JzZWwpIHtcbiAqICAgICAgICAgc3dpdGNoKG9ic2VsLnR5cGUpIHtcbiAqICAgICAgICAgICAgIGNhc2UgJ2NsaWNrJzpcbiAqICAgICAgICAgICAgICAgICByZXR1cm4gJ2ltYWdlcy9jbGljay5wbmcnO1xuICogICAgICAgICAgICAgY2FzZSAnZm9jdXMnOlxuICogICAgICAgICAgICAgICAgIHJldHVybiAnaW1hZ2VzL2ZvY3VzLnBuZyc7XG4gKiAgICAgICAgICAgICBkZWZhdWx0OlxuICogICAgICAgICAgICAgICAgIHJldHVybiAnaW1hZ2VzL2RlZmF1bHQucG5nJztcbiAqICAgICAgICAgfVxuICogICAgIH1cbiAqIH07XG4gKi9cbnZhciBUcmFjZURpc3BsYXlJY29ucyA9IGZ1bmN0aW9uKGRpdklkLCB0cmFjZSwgdGltZV93aW5kb3csIG9wdGlvbnMpIHtcblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGRpdklkKTtcblxuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVRyYWNlRGlzcGxheUljb25zJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6cmVtb3ZlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcy5vYnNlbF9yZWRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy53aW5kb3cgPSB0aW1lX3dpbmRvdztcbiAgdGhpcy53aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdy5vbigndHc6dHJhbnNsYXRlJywgdGhpcy50cmFuc2xhdGVfeC5iaW5kKHRoaXMpKTtcblxuICAvL1x0dGhpcy5vYnNlbF9zZWxlY3RvciA9IG9ic2VsX3NlbGVjdG9yO1xuICAvL1x0dGhpcy53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignJyx0aGlzLi5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG4gIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDtcbiAgLy90aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG5cblxuICAvKipcbiAgXHQgKiBWaXN1Q29uZmlnIGlzIGEgc2hvcnRuYW1lIGZvciB0aGVcbiAgXHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLlRyYWNlRGlzcGxheUljb25zLlZpc3VDb25maWd9XG4gIFx0ICogb2JqZWN0LlxuICBcdCAqIEB0eXBlZGVmIFZpc3VDb25maWdcbiAgXHQgKiBAc2VlIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29ucy5WaXN1Q29uZmlnXG4gIFx0ICovXG4gIC8qKlxuICBcdCAqIEB0eXBlZGVmIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29ucy5WaXN1Q29uZmlnXG4gIFx0ICogQHByb3BlcnR5IHsobnVtYmVyfGZ1bmN0aW9uKX1cdFt4XVxuICBcdCAqICAgICBYIGNvb3JkaW5hdGVzIG9mIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlXG4gIFx0ICogICAgIGltYWdlIChkZWZhdWx0OiA8Y29kZT5mdW5jdGlvbihvKSB7XG4gIFx0ICogICAgICAgICByZXR1cm4gdGhpcy5jYWxjdWxhdGVfeChvLnRpbWVzdGFtcCkgLSA4O1xuICBcdCAqICAgICB9KTwvY29kZT4pXG4gIFx0ICogQHByb3BlcnR5IHsobnVtYmVyfGZ1bmN0aW9uKX1cdFt5PTE3XVxuICBcdCAqICAgICBZIGNvb3JkaW5hdGVzIG9mIHRoZSB0b3AtbGVmdCBjb3JuZXIgb2YgdGhlXG4gIFx0ICogICAgIGltYWdlXG4gIFx0ICogQHByb3BlcnR5IHsobnVtYmVyfGZ1bmN0aW9uKX1cdFt3aWR0aD0xNl1cbiAgXHQgKiAgICAgV2lkdGggb2YgdGhlIGltYWdlXG4gIFx0ICogQHByb3BlcnR5IHsobnVtYmVyfGZ1bmN0aW9uKX1cdFtoZWlnaHQ9MTZdXG4gIFx0ICogICAgIEhlaWdodCBvZiB0aGUgaW1hZ2VcbiAgXHQgKiBAcHJvcGVydHkgeyhzdHJpbmd8ZnVuY3Rpb24pfVx0W3VybD1hIHF1ZXN0aW9ubWFyayBkYXRhdXJsIHN0cmluZ11cbiAgXHQgKiAgICAgVXJsIG9mIHRoZSBpbWFnZSB0byBkaXNwbGF5XG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogT2JqZWN0IGRldGVybWluaW5nIGhvdyB0byBkaXNwbGF5IHRoZSBpY29uc1xuICBcdCAqIChPcHRpb25hbCkuIEFsbCB0aGUgb3B0aW9ucyBmaWVsZCBjYW4gYmUgZWl0aGVyXG4gIFx0ICogYSB2YWx1ZSBvciBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBjYWxsZWQgYnlcbiAgXHQgKiBkMy5qcy4gVGhlIGZ1bmN0aW9uIHdpbGwgcmVjZWl2ZSBhcyB0aGUgZmlyc3RcbiAgXHQgKiBhcmd1bWVudCB0aGUgT2JzZWwgdG8gZGlzcGxheSBhbmQgc2hvdWxkIHJldHVyblxuICBcdCAqIHRoZSBjYWxjdWxhdGVkIHZhbHVlLlxuICBcdCAqIElmIGEgZnVuY3Rpb24gaXMgZGVmaW5lZCBhcyBhbiBhcmd1bWVudCwgaXQgd2lsbFxuICBcdCAqIGJlIGJpbmRlZCB0byB0aGUgVHJhY2VEaXNwbGF5SWNvbnMgaW5zdGFuY2UuXG4gIFx0ICogVGhpcyBtZWFucyB0aGF0IHlvdSBjYW4gY2FsbCBhbnkgbWV0aG9kIG9mIHRoZVxuICBcdCAqIFRyYWNlRGlzcGxheUljb25zIGluc3RhbmNlIHRvIGhlbHAgY2FsY3VsYXRlXG4gIFx0ICogdGhlIHggcG9zaXRpb24gb3IgeSBwb3NpdGlvbiBvZiBhbiBpY29uLiBUaGlzXG4gIFx0ICogbWFrZXMgaXQgZWFzeSB0byBkZWZpbmUgdmFyaW91cyB0eXBlcyBvZiBiZWhhdmlvdXJzLlxuICBcdCAqIFJlbGV2YW50IG1ldGhvZHMgdG8gdXNlIGFyZTpcbiAgXHQgKiBsaW5rIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5UcmFjZURpc3BsYXlJY29ucy5jYWxjdWxhdGVfeH1cbiAgXHQgKiBTZWUgdHV0b3JpYWxcbiAgXHQgKiB7QHR1dG9yaWFsIHR1dG8xLjNfdmlzdWFsaXNhdGlvbl9wZXJzb25hbGlzYXRpb259XG4gIFx0ICogZm9yIG1vcmUgZGV0YWlscyBhbmQgZXhhbXBsZXMuXG4gIFx0ICovXG4gIC8vIGNyZWF0ZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdmFsdWUgb3IgZnVuY3Rpb25cbiAgdmFyIHRoaXNfd2lkZ2V0ID0gdGhpcztcbiAgdmFyIGJpbmRfZnVuY3Rpb24gPSBmdW5jdGlvbih2YWxfb3JfZnVuKSB7XG4gICAgaWYgKHZhbF9vcl9mdW4gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW4uYmluZCh0aGlzX3dpZGdldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB2YWxfb3JfZnVuO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgdGhpcy5vcHRpb25zLnggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueCB8fCBmdW5jdGlvbihvKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlX3goby5nZXRfYmVnaW4oKSkgLSA4O1xuICB9KTtcbiAgdGhpcy5zdHlsZXNoZWV0ID0gb3B0aW9ucyA7XG4gIC8vdGhpcy5vcHRpb25zLnkgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueSB8fCAxNyk7XG4gIC8vdGhpcy5vcHRpb25zLndpZHRoID0gYmluZF9mdW5jdGlvbihvcHRpb25zLndpZHRoIHx8IDE2KTtcbiAgLy90aGlzLm9wdGlvbnMuaGVpZ2h0ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLmhlaWdodCB8fCAxNik7XG4gIC8vdGhpcy5vcHRpb25zLnVybCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy51cmwgfHwgJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQkFBQUFBUUNBWUFBQUFmOC85aEFBQUFCSE5DU1ZRSUNBZ0lmQWhraUFBQUFBbHdTRmx6QUFBRzdBQUFCdXdCSG5VNE5RQUFBQmwwUlZoMFUyOW1kSGRoY21VQWQzZDNMbWx1YTNOallYQmxMbTl5WjV2dVBCb0FBQUtzU1VSQlZEaU5yWk5MYUZOcEZNZC8zM2Z2VGE1dFlwdXEweWF0Rld1Z1JoRVh3OUF1aEpFWkJDa2lxSldDSUVycnhwMjQxQzZMNjY1ME0vV0Jvd3Vub3lDRENqS3JHWVowSWJpd3hrZFViR3lhUG1nU204ZDlmMjVNYlhVbHpIOTV6di84T09kd2psQktzVmFqVTFrRXRKaWF2TkJzYUtjQnFxNS8zZktEU3dyS1kzM0pkWDdSQUl4T1pRR00zYkhJeW1DeVBaaFpxVDhwMmQ0c1FHdFk3K3lPYnZoeE1qc3ZwNHVWS09BMlFFSXB4ZWhVRmwySXZ1RlVaM3JaY3UvKzlYN1JXcWc3Snh3L1FBRmhUZExSRkpvWTZONFNhek9ObzFjenMvMmVVbE5qZlVuMFJpc25lK1BwOXl2MThUdlp3cmw5aVZiMkoySkVRaG9LS05rZTZVSjU1TGZNQjRhU0hlTW5lK1BwYXkveUFrQmNUTDltYTdOcDdZdTMvbjFsT2pkUTh3TE83OTNHemxnekZkY2pZdWpvVXBBdDE3ajhMSWZqQjV6ZHZmWEJ2M09sWDNOVnk1U0FPSlZLaFA5NE0yOVVYQjhGRkdvV0U4OW51ZlRrSFE5bkZsRUtlalp1b0xlMWlZcnI4K2ZiZWU5VUtoRUdoQjZTWXJCb3VkUEx0bnNBUUNuRjc2OEtxMXYyQXhBQzZsN0FzdVVDc0dTNWg0dVdPeDJTWWxCcVFveVVIVy9POWdPKzFpOWRiZnljaUtHQS93b2wzcFRyQU5oK1FObng1alFoUnVRM1ZaKzFaMU9VZzkyYmlaa0cvK1NMM0h1N2dQZlZ6UUJJWDZtSmxwQWVEMnZyV2RzM210aCt3T3RTbFVjelMxUmRmelVYMWlRdElUM3VLeldoTzRHYWpKbkduYzJtY2YrajR4MXVtSjR1VlNoVWJSU3dVSFBXd2R2Q3h1T1lhUnh3QWpVcEFYVWprN2VQOWJUckVVTmJOZjMwUTVUaFhWMGM2V2tuR3ZvU2p4Z2F4M2UwdXpjeWVSdFFjcXd2U2E1cW1hWXVCNGFTSGVNTmlFSmdhaEo5eldRUlEyTW8yVEZ1Nm5JZ1Y3WE1kWmQ0OCtWYy8zQ3FNMzBtMVhYM3djeGk4ZDNIMnNpdGwzbVVBQ2tFeVphbTI0ZTJiVEhiVE9QYzFjeHNmNlB1LzNtbXRmcmVkLzRFU1FOS1hHOFZBQ29BQUFBQVNVVk9SSzVDWUlJPScpO1xuXG4gIHRoaXMuZHJhdygpO1xufTtcblxuVHJhY2VEaXNwbGF5SWNvbnMucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cblxuICAgIC8vdmFyIGRpdl9lbG10ID0gZDMuc2VsZWN0KCcjJyt0aGlzLmlkKTtcbiAgICB2YXIgZGl2X2VsbXQgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJyk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIChyZWQpIGxpbmUgcmVwcmVzZW50aW5nIGN1cnJlbnQgdGltZVxuICAgIGlmICh0eXBlb2YgKHRoaXMud2luZG93LnRpbWVyKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyKCd4MScsICc1MCUnKVxuICAgICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAgIC5hdHRyKCd4MicsICc1MCUnKVxuICAgICAgLmF0dHIoJ3kyJywgJzEwMCUnKVxuICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsICcxcHgnKVxuICAgICAgLmF0dHIoJ3N0cm9rZScsICdyZWQnKVxuICAgICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcblxuICAgIHRoaXMuc3ZnX2dwID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdGhpcy5zdmdfc2VsZWN0ZWRfb2JzZWwgPSB0aGlzLnN2Zy5hcHBlbmQoJ2xpbmUnKVxuICAgIC5hdHRyKCd4MScsICcwJylcbiAgICAuYXR0cigneTEnLCAnMCUnKVxuICAgIC5hdHRyKCd4MicsICcwJylcbiAgICAuYXR0cigneTInLCAnMTAwJScpXG4gICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsICcxcHgnKVxuICAgIC5hdHRyKCdzdHJva2UnLCAnYmxhY2snKVxuICAgIC5hdHRyKCdvcGFjaXR5JywgJzAuMycpXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpXG4gICAgLnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgIC8vIGV2ZW50IGxpc3RlbmVyc1xuICAgIHZhciB3aWRnZXQgPSB0aGlzO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91cignY2hhbmdlVGltZU9uRHJhZycsIHRoaXMuZWxlbWVudCwge1xuICAgICAgb25VcENhbGxiYWNrOiBmdW5jdGlvbihkZWx0YV94KSB7XG4gICAgICAgIHZhciB0aW1lX2RlbHRhID0gLWRlbHRhX3ggKiB3aWRnZXQud2luZG93LmdldF93aWR0aCgpIC8gd2lkZ2V0LmVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIHdpZGdldC5zdmdfZ3AuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKC13aWRnZXQudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gICAgICAgIHdpZGdldC53aW5kb3cudHJhbnNsYXRlKHRpbWVfZGVsdGEpO1xuICAgICAgfSxcbiAgICAgIG9uTW92ZUNhbGxiYWNrOiBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICAgICAgd2lkZ2V0LnN2Z19ncC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob2Zmc2V0IC0gd2lkZ2V0LnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoJ3pvbW1PblNjcm9sbCcsIHRoaXMuZWxlbWVudCwge3RpbWVXaW5kb3c6IHRoaXMud2luZG93fSk7XG4gIH0sXG5cblxuICAvLyBUT0RPOiBuZWVkcyB0byBiZSBuYW1lZCBmb2xsb3dpbmcgYSBjb252ZW50aW9uXG4gIC8vIHRvIGJlIGRlY2lkZWQgb25cbiAgLyoqXG4gIFx0ICogQ2FsY3VsYXRlcyB0aGUgWCBwb3NpdGlvbiBpbiBwaXhlbHMgY29ycmVzcG9uZGluZyB0b1xuICBcdCAqIHRoZSB0aW1lIGdpdmVuIGluIHBhcmFtZXRlci5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gdGltZSBUaW1lIGZvciB3aGljaCB0byBzZWVrIHRoZSBjb3JyZXNwb25kaW5nIHggcGFyYW1ldGVyXG4gIFx0ICovXG4gIGNhbGN1bGF0ZV94OiBmdW5jdGlvbih0aW1lKSB7XG5cbiAgICB2YXIgeCA9ICh0aW1lIC0gdGhpcy53aW5kb3cuc3RhcnQpICogdGhpcy5zY2FsZV94ICsgdGhpcy50cmFuc2xhdGVfb2Zmc2V0O1xuICAgIHJldHVybiB4O1xuICB9LFxuICB0cmFuc2xhdGVfeDogZnVuY3Rpb24oZSkge1xuICAgIHZhciB0aW1lX2RlbHRhID0gZS5kYXRhO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCArPSB0aW1lX2RlbHRhICogdGhpcy5zY2FsZV94O1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICgtdGhpcy50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgfSxcblxuICByZWZyZXNoX3g6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcbiAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd5JykpOyB9KTtcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0cmFjZTp1cGRhdGVcIjpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0OyAvLyBkbyBub3Qgd2FudCB0byB0cmlnZ2VyIHRoZSByZWZyZXNoaW5nIG9mIGxpc3Rfb2JzZWxzKCkuLi5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmV4aXQoKVxuICAgIC5yZW1vdmUoKTtcbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoJ2ltYWdlJylcbiAgICAuYXR0cignY2xhc3MnLCAnU2Ftb3RyYWNlcy1vYnNlbCcpXG4gICAgLmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcbiAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd5JykpOyB9KVxuICAgIC5hdHRyKCd3aWR0aCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd3aWR0aCcpKTsgfSlcbiAgICAuYXR0cignaGVpZ2h0JywgZnVuY3Rpb24oKXsgcmV0dXJuICh0aGF0LmdldFZhbHVlQXR0cmlidXRTdHlsZSh0aGlzLl9fZGF0YV9fLnR5cGUsJ2hlaWdodCcpKTsgfSlcbiAgICAuYXR0cigneGxpbms6aHJlZicsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdpY29uJykpOyB9KTtcbiAgICAvLyBTdG9yaW5nIG9ic2VsIGRhdGEgd2l0aCBqUXVlcnkgZm9yIGFjY2Vzc2liaWxpdHkgZnJvbVxuICAgIC8vIGV2ZW50cyBkZWZpbmVkIGJ5IHVzZXJzIHdpdGggalF1ZXJ5XG4gICAgJCgnaW1hZ2UnLCB0aGlzLmVsZW1lbnQpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICQuZGF0YShlbCwge1xuICAgICAgICAnU2Ftb3RyYWNlcy10eXBlJzogJ29ic2VsJyxcbiAgICAgICAgJ1NhbW90cmFjZXMtZGF0YSc6IGQzLnNlbGVjdChlbCkuZGF0dW0oKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgb2JzZWxfcmVkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIG9icyA9IGUuZGF0YTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICB2YXIgc2VsID0gdGhpcy5kM09ic2VscygpXG5cdFx0XHQuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgLy9cdFx0XHRcdGNvbnNvbGUubG9nKCdkYXRhOmlkLG9ic2VsX2VkaXRfaWQnLGlkLG9icy5nZXRfaWQoKSxpZCA9PSBvYnMuZ2V0X2lkKCkpO1xuICByZXR1cm4gby5nZXRfaWQoKSA9PSBvYnMuZ2V0X2lkKCk7XG5cdFx0XHR9KVxuXHRcdFx0LmRhdHVtKG9icylcblx0XHRcdC5hdHRyKCd4JywgdGhpcy5vcHRpb25zLngpXG5cdFx0XHQuYXR0cigneScsICBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwneScpKTsgfSlcblx0XHRcdC5hdHRyKCd3aWR0aCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd3aWR0aCcpKTsgfSlcblx0XHRcdC5hdHRyKCdoZWlnaHQnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnaGVpZ2h0JykpO30pXG5cdFx0XHQuYXR0cigneGxpbms6aHJlZicsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdpY29uJykpOyB9KTtcbiAgfSxcblxuICBkM09ic2VsczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3ZnX2dwXG4gICAgLnNlbGVjdEFsbCgnY2lyY2xlLGltYWdlLHJlY3QnKVxuICAgIC8vIFRPRE86IEFUVEVOVElPTiEgV0FSTklORyEgb2JzZWxzIE1VU1QgaGF2ZSBhIGZpZWxkIGlkIC0+IHVzZWQgYXMgYSBrZXkuXG4gICAgLy8uZGF0YSh0aGlzLmRhdGEpOyAvLyxmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pO1xuICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcblxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyYWNlRGlzcGxheUljb25zO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxudmFyIFRyYWNlRGlzcGxheUljb25zRml4ID0gZnVuY3Rpb24oZGl2SWQsIHRyYWNlSU5JVElBLCB0aW1lX3dpbmRvdywgdGltZV93aW5kb3dfWm9vbSwgb3B0aW9ucykge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgZGl2SWQpO1xuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVRyYWNlRGlzcGxheUljb25zJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2UgPSB0cmFjZUlOSVRJQTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93ID0gdGltZV93aW5kb3c7XG4gIHRoaXMud2luZG93Wm9vbSA9IHRpbWVfd2luZG93X1pvb207XG4gIC8vdGhpcy53aW5kb3cub24oJ3R3OnVwZGF0ZScsdGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG4gIC8vdGhpcy53aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsdGhpcy50cmFuc2xhdGVfeC5iaW5kKHRoaXMpKTtcbiAgdGhpcy5pbml0X0RPTSgpO1xuICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7XG4gIHZhciB0aGlzX3dpZGdldCA9IHRoaXM7XG4gIHZhciBiaW5kX2Z1bmN0aW9uID0gZnVuY3Rpb24odmFsX29yX2Z1bikge1xuICAgIGlmICh2YWxfb3JfZnVuIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgIHJldHVybiB2YWxfb3JfZnVuLmJpbmQodGhpc193aWRnZXQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bjtcbiAgICB9XG4gIH07XG5cbi8qICB0aGlzLm9wdGlvbnMueSA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy55IHx8IDE3KTtcbiAgdGhpcy5vcHRpb25zLndpZHRoID0gYmluZF9mdW5jdGlvbihvcHRpb25zLndpZHRoIHx8IDE2KTtcbiAgdGhpcy5vcHRpb25zLmhlaWdodCA9IGJpbmRfZnVuY3Rpb24ob3B0aW9ucy5oZWlnaHQgfHwgMTYpO1xuICB0aGlzLm9wdGlvbnMudXJsID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnVybCB8fCAnZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFCQUFBQUFRQ0FZQUFBQWY4LzloQUFBQUJITkNTVlFJQ0FnSWZBaGtpQUFBQUFsd1NGbHpBQUFHN0FBQUJ1d0JIblU0TlFBQUFCbDBSVmgwVTI5bWRIZGhjbVVBZDNkM0xtbHVhM05qWVhCbExtOXlaNXZ1UEJvQUFBS3NTVVJCVkRpTnJaTkxhRk5wRk1kLzMzZnZUYTV0WXB1cTB5YXRGV3VnUmhFWHc5QXVoSkVaQkNraXFKV0NJRXJyeHAyNDFDNkw2NjUwTS9XQm93dW5veUNEQ2pLckdZWjBJYml3eGtkVWJHeWFQbWdTbThkOWYyNU1iWFVsekg5NXp2LzhPT2R3amxCS3NWYWpVMWtFdEppYXZOQnNhS2NCcXE1LzNmS0RTd3JLWTMzSmRYN1JBSXhPWlFHTTNiSEl5bUN5UFpoWnFUOHAyZDRzUUd0WTcreU9idmh4TWpzdnA0dVZLT0EyUUVJcHhlaFVGbDJJdnVGVVozclpjdS8rOVg3UldxZzdKeHcvUUFGaFRkTFJGSm9ZNk40U2F6T05vMWN6cy8yZVVsTmpmVW4wUmlzbmUrUHA5eXYxOFR2WndybDlpVmIySjJKRVFob0tLTmtlNlVKNTVMZk1CNGFTSGVNbmUrUHBheS95QWtCY1RMOW1hN05wN1l1My9uMWxPamRROHdMTzc5M0d6bGd6RmRjall1am9VcEF0MTdqOExJZmpCNXpkdmZYQnYzT2xYM05WeTVTQU9KVktoUDk0TTI5VVhCOEZGR29XRTg5bnVmVGtIUTluRmxFS2VqWnVvTGUxaVlycjgrZmJlZTlVS2hFR2hCNlNZckJvdWRQTHRuc0FRQ25GNzY4S3ExdjJBeEFDNmw3QXN1VUNzR1M1aDR1V094MlNZbEJxUW95VUhXL085Z08rMWk5ZGJmeWNpS0dBL3dvbDNwVHJBTmgrUU5ueDVqUWhSdVEzVlorMVoxT1VnOTJiaVprRy8rU0wzSHU3Z1BmVnpRQklYNm1KbHBBZUQydnJXZHMzbXRoK3dPdFNsVWN6UzFSZGZ6VVgxaVF0SVQzdUt6V2hPNEdhakpuR25jMm1jZitqNHgxdW1KNHVWU2hVYlJTd1VIUFd3ZHZDeHVPWWFSeHdBalVwQVhVams3ZVA5YlRyRVVOYk5mMzBRNVRoWFYwYzZXa25Hdm9TanhnYXgzZTB1emN5ZVJ0UWNxd3ZTYTVxbWFZdUI0YVNIZU1OaUVKZ2FoSjl6V1FSUTJNbzJURnU2bklnVjdYTWRaZDQ4K1ZjLzNDcU0zMG0xWFgzd2N4aThkM0gyc2l0bDNtVUFDa0V5WmFtMjRlMmJUSGJUT1BjMWN4c2Y2UHUvM21tdGZyZWQvNEVTUU5LWEc4VkFDb0FBQUFBU1VWT1JLNUNZSUk9Jyk7XG4gICovXG5cbiAgdGhpcy5vcHRpb25zID0ge307XG4gIHRoaXMub3B0aW9ucy54ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnggfHwgZnVuY3Rpb24obykge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZV94KG8uZ2V0X2JlZ2luKCkpIC0gODtcbiAgfSk7XG4gIHRoaXMuc3R5bGVzaGVldCA9IG9wdGlvbnMgO1xuICB0aGlzLmRyYXcoKTtcbn07XG5cblRyYWNlRGlzcGxheUljb25zRml4LnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBkaXZfZWxtdCA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpO1xuICAgIHRoaXMuc3ZnID0gZGl2X2VsbXQuYXBwZW5kKCdzdmcnKTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgKHJlZCkgbGluZSByZXByZXNlbnRpbmcgY3VycmVudCB0aW1lXG4gICAgaWYgKHR5cGVvZiAodGhpcy53aW5kb3cudGltZXIpICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLnN2Zy5hcHBlbmQoJ2xpbmUnKVxuICAgICAgLmF0dHIoJ3gxJywgJzUwJScpXG4gICAgICAuYXR0cigneTEnLCAnMCUnKVxuICAgICAgLmF0dHIoJ3gyJywgJzUwJScpXG4gICAgICAuYXR0cigneTInLCAnMTAwJScpXG4gICAgICAuYXR0cignc3Ryb2tlLXdpZHRoJywgJzFweCcpXG4gICAgICAuYXR0cignc3Ryb2tlJywgJ3JlZCcpXG4gICAgICAuYXR0cignb3BhY2l0eScsICcwLjMnKTtcbiAgICB9XG5cbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHZhciB4ID0gZDMudGltZS5zY2FsZSgpIC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgLy8gLmRvbWFpbihbbmV3IERhdGUoMjAxNCwgNCwgMSksIG5ldyBEYXRlKDIwMTQsIDQsIDE1KSAtIDFdKVxuICAgICAgLmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pXG4gICAgICAucmFuZ2UoWzAsIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aF0pO1xuICAgIHRoaXMuc3ZnX2dwID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB0aGlzLnN2Z19zZWxlY3RlZF9vYnNlbCA9IHRoaXMuc3ZnLmFwcGVuZCgnbGluZScpXG4gICAgICAuYXR0cigneDEnLCAnMCcpXG4gICAgICAuYXR0cigneTEnLCAnMCUnKVxuICAgICAgLmF0dHIoJ3gyJywgJzAnKVxuICAgICAgLmF0dHIoJ3kyJywgJzEwMCUnKVxuICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsICcxcHgnKVxuICAgICAgLmF0dHIoJ3N0cm9rZScsICdibGFjaycpXG4gICAgICAuYXR0cignb3BhY2l0eScsICcwLjMnKVxuICAgICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpXG4gICAgICAuc3R5bGUoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIHRoaXMuYWRkYnJ1c2goKTtcbiAgfSxcbiAgZDNPYnNlbHM6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLnN2Z19ncFxuICAgICAgLnNlbGVjdEFsbCgnY2lyY2xlLGltYWdlLHJlY3QnKVxuICAgICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAgIC5kYXRhKHRoaXMuZGF0YSwgZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTsgLy8gVE9ETzogYm9ndWUgaW4gY2FzZSBubyBJRCBleGlzdHMgLT4gbWlnaHQgaGFwcGVuIHdpdGggS1RCUyB0cmFjZXMgYW5kIG5ldyBvYnNlbHNcbiAgfSxcbiAgY2FsY3VsYXRlX3g6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gKHRpbWUgLSB0aGlzLndpbmRvdy5zdGFydCkgKiB0aGlzLnNjYWxlX3ggKyB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQ7XG4gIH0sXG4gIHRyYW5zbGF0ZV94OiBmdW5jdGlvbihlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgY29uc29sZS5sb2cgKFwidHJhbnNsYXRlXCIpO1xuICAgIHZhciB0aW1lX2RlbHRhID0gZS5kYXRhO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCArPSB0aW1lX2RlbHRhICogdGhpcy5zY2FsZV94O1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICgtdGhpcy50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgfSxcbiAgYWRkYnJ1c2g6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBtYXJnaW4gPSB7dG9wOiAyMDAsIHJpZ2h0OiA0MCwgYm90dG9tOiAyMDAsIGxlZnQ6IDQwfSxcbiAgICAgIGhlaWdodCA9IDUwMCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tO1xuICAgIHZhciB4ID0gZDMudGltZS5zY2FsZSgpXG4gICAgLmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pXG4gICAgLnJhbmdlKFswLCB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGhdKTtcblxuICAgIHZhciBicnVzaGVuZGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgZXh0ZW5kMCA9IHdpZGdldC5icnVzaFAuZXh0ZW50KCk7XG4gICAgICB3aWRnZXQud2luZG93Wm9vbS5zZXRfc3RhcnQgKG5ldyBEYXRlKGV4dGVuZDBbMF0pLmdldFRpbWUoKSk7XG4gICAgICB3aWRnZXQud2luZG93Wm9vbS5zZXRfZW5kIChuZXcgRGF0ZShleHRlbmQwWzFdKS5nZXRUaW1lKCkpO1xuICAgIH07XG5cbiAgICB2YXIgYnJ1c2ggPSBkMy5zdmcuYnJ1c2goKVxuICAgICAgLngoeClcbiAgICAgIC5vbihcImJydXNoZW5kXCIsIGJydXNoZW5kZWQpO1xuICAgIHRoaXMuYnJ1c2hQID0gYnJ1c2g7XG4gICAgdGhpcy5nQnJ1c2ggPSB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpXG4gICAgICAuYXR0cihcImNsYXNzXCIsIFwiYnJ1c2hcIilcbiAgICAgIC5hdHRyKCdpZCcsICdicnVzaCcpXG4gICAgICAuY2FsbChicnVzaClcbiAgICAgIC5hdHRyKFwid2lkdGhcIiwgXCIxODQwXCIpO1xuICAgIHRoaXMuZ0JydXNoLnNlbGVjdEFsbChcInJlY3RcIilcbiAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIGhlaWdodCk7XG4gICAgdmFyIHdpZGdldCA9IHRoaXM7XG4gIH0sXG4gIGRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAoZSkge1xuICAgICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInRyYWNlOnVwZGF0ZVwiOlxuICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG5cbiAgICAgICAgLy90aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKHRoaXMud2luZG93LnN0YXJ0LHRoaXMud2luZG93LmVuZCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7IC8vIGRvIG5vdCB3YW50IHRvIHRyaWdnZXIgdGhlIHJlZnJlc2hpbmcgb2YgbGlzdF9vYnNlbHMoKS4uLlxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgICAuZXhpdCgpXG4gICAgICAucmVtb3ZlKCk7XG4gICAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAgIC5lbnRlcigpXG4gICAgICAuYXBwZW5kKCdpbWFnZScpXG4gICAgICAuYXR0cignY2xhc3MnLCAnU2Ftb3RyYWNlcy1vYnNlbCcpXG4gICAgICAuYXR0cigneCcsIHRoaXMub3B0aW9ucy54KVxuICAgICAgLmF0dHIoJ3knLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwneScpKTsgfSlcbiAgICAgIC5hdHRyKCd3aWR0aCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd3aWR0aCcpKTsgfSlcbiAgICAgIC5hdHRyKCdoZWlnaHQnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnaGVpZ2h0JykpOyB9KVxuICAgICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnaWNvbicpKTsgfSk7XG4gICAgLy8gU3RvcmluZyBvYnNlbCBkYXRhIHdpdGggalF1ZXJ5IGZvciBhY2Nlc3NpYmlsaXR5IGZyb21cbiAgICAvLyBldmVudHMgZGVmaW5lZCBieSB1c2VycyB3aXRoIGpRdWVyeVxuICAgICQoJ2ltYWdlJywgdGhpcy5lbGVtZW50KS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAkLmRhdGEoZWwsIHtcbiAgICAgICAgJ1NhbW90cmFjZXMtdHlwZSc6ICdvYnNlbCcsXG4gICAgICAgICdTYW1vdHJhY2VzLWRhdGEnOiBkMy5zZWxlY3QoZWwpLmRhdHVtKClcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH0sXG4gIHJlZnJlc2hfeDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB0aGlzLnN2Z19ncC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmF0dHIoJ3gnLCB0aGlzLm9wdGlvbnMueClcbiAgICAuYXR0cigneScsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCd5JykpOyB9KTtcblxuICAgIHZhciBmID0gdGhpcy5lbGVtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJicnVzaFwiKTtcbiAgICBmLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZik7XG4gICAgdGhpcy5hZGRicnVzaCgpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZURpc3BsYXlJY29uc0ZpeDtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbnZhciBUcmFjZURpc3BsYXlJY29uc1pvb20gPSBmdW5jdGlvbihkaXZJZCwgdHJhY2UsIHRpbWVfd2luZG93LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAvLyBXaWRnZXRCYXNpY1RpbWVGb3JtIGlzIGEgV2lkZ2V0XG4gIFdpZGdldC5jYWxsKHRoaXMsIGRpdklkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1UcmFjZURpc3BsYXlJY29ucycpO1xuICAvLyQod2luZG93KS5yZXNpemUodGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2UgPSB0cmFjZTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6dXBkYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93ID0gdGltZV93aW5kb3c7XG4gIHRoaXMud2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcbiAgLy90aGlzLndpbmRvdy5vbigndHc6dHJhbnNsYXRlJyx0aGlzLnRyYW5zbGF0ZV94LmJpbmQodGhpcykpO1xuICB0aGlzLmluaXRfRE9NKCk7XG4gIC8vIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHModGltZV93aW5kb3cuc3RhcnQsdGltZV93aW5kb3cuZW5kKTtcbiAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0O1xuICB2YXIgdGhpc193aWRnZXQgPSB0aGlzO1xuICB2YXIgYmluZF9mdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbF9vcl9mdW4pIHtcbiAgICBpZiAodmFsX29yX2Z1biBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gdmFsX29yX2Z1bi5iaW5kKHRoaXNfd2lkZ2V0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHZhbF9vcl9mdW47XG4gICAgfVxuICB9O1xuICAvKnRoaXMub3B0aW9ucy54ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnggfHwgZnVuY3Rpb24obykge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZV94KG8uZ2V0X2JlZ2luKCkpIC0gODtcbiAgfSk7XG4gIHRoaXMub3B0aW9ucy55ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLnkgfHwgMTcpO1xuICB0aGlzLm9wdGlvbnMud2lkdGggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMud2lkdGggfHwgMTYpO1xuICB0aGlzLm9wdGlvbnMuaGVpZ2h0ID0gYmluZF9mdW5jdGlvbihvcHRpb25zLmhlaWdodCB8fCAxNik7XG4gIHRoaXMub3B0aW9ucy51cmwgPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMudXJsIHx8ICdkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUJBQUFBQVFDQVlBQUFBZjgvOWhBQUFBQkhOQ1NWUUlDQWdJZkFoa2lBQUFBQWx3U0ZsekFBQUc3QUFBQnV3QkhuVTROUUFBQUJsMFJWaDBVMjltZEhkaGNtVUFkM2QzTG1sdWEzTmpZWEJsTG05eVo1dnVQQm9BQUFLc1NVUkJWRGlOclpOTGFGTnBGTWQvMzNmdlRhNXRZcHVxMHlhdEZXdWdSaEVYdzlBdWhKRVpCQ2tpcUpXQ0lFcnJ4cDI0MUM2TDY2NTBNL1dCb3d1bm95Q0RDaktyR1laMEliaXd4a2RVYkd5YVBtZ1NtOGQ5ZjI1TWJYVWx6SDk1enYvOE9PZHdqbEJLc1ZhalUxa0V0Smlhdk5Cc2FLY0JxcTUvM2ZLRFN3cktZMzNKZFg3UkFJeE9aUUdNM2JISXltQ3lQWmhacVQ4cDJkNHNRR3RZNyt5T2J2aHhNanN2cDR1VktPQTJRRUlweGVoVUZsMkl2dUZVWjNyWmN1Lys5WDdSV3FnN0p4dy9RQUZoVGRMUkZKb1k2TjRTYXpPTm8xY3pzLzJlVWxOamZVbjBSaXNuZStQcDl5djE4VHZad3JsOWlWYjJKMkpFUWhvS0tOa2U2VUo1NUxmTUI0YVNIZU1uZStQcGF5L3lBa0JjVEw5bWE3TnA3WXUzL24xbE9qZFE4d0xPNzkzR3psZ3pGZGNqWXVqb1VwQXQxN2o4TElmakI1emR2ZlhCdjNPbFgzTlZ5NVNBT0pWS2hQOTRNMjlVWEI4RkZHb1dFODludWZUa0hROW5GbEVLZWpadW9MZTFpWXJyOCtmYmVlOVVLaEVHaEI2U1lyQm91ZFBMdG5zQVFDbkY3NjhLcTF2MkF4QUM2bDdBc3VVQ3NHUzVoNHVXT3gyU1lsQnFRb3lVSFcvTzlnTysxaTlkYmZ5Y2lLR0Evd29sM3BUckFOaCtRTm54NWpRaFJ1UTNWWisxWjFPVWc5MmJpWmtHLytTTDNIdTdnUGZWelFCSVg2bUpscEFlRDJ2cldkczNtdGgrd090U2xVY3pTMVJkZnpVWDFpUXRJVDN1S3pXaE80R2FqSm5HbmMybWNmK2o0eDF1bUo0dVZTaFViUlN3VUhQV3dkdkN4dU9ZYVJ4d0FqVXBBWFVqazdlUDliVHJFVU5iTmYzMFE1VGhYVjBjNldrbkd2b1NqeGdheDNlMHV6Y3llUnRRY3F3dlNhNXFtYVl1QjRhU0hlTU5pRUpnYWhKOXpXUVJRMk1vMlRGdTZuSWdWN1hNZFpkNDgrVmMvM0NxTTMwbTFYWDN3Y3hpOGQzSDJzaXRsM21VQUNrRXlaYW0yNGUyYlRIYlRPUGMxY3hzZjZQdS8zbW10ZnJlZC80RVNRTktYRzhWQUNvQUFBQUFTVVZPUks1Q1lJST0nKTtcblxuICAqL1xuICB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgdGhpcy5vcHRpb25zLnggPSBiaW5kX2Z1bmN0aW9uKG9wdGlvbnMueCB8fCBmdW5jdGlvbihvKSB7XG4gICAgcmV0dXJuIHRoaXMuY2FsY3VsYXRlX3goby5nZXRfYmVnaW4oKSkgLSA4O1xuICB9KTtcbiAgdGhpcy5zdHlsZXNoZWV0ID0gb3B0aW9ucyA7XG4gIHRoaXMuZHJhdygpO1xuXHR9O1xuXG5UcmFjZURpc3BsYXlJY29uc1pvb20ucHJvdG90eXBlID0ge1xuICBpbml0X0RPTTogZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgZGl2X2VsbXQgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KTtcbiAgICB0aGlzLnN2ZyA9IGRpdl9lbG10LmFwcGVuZCgnc3ZnJyk7XG5cbiAgICAvLyBjcmVhdGUgdGhlIChyZWQpIGxpbmUgcmVwcmVzZW50aW5nIGN1cnJlbnQgdGltZVxuICAgIGlmICh0eXBlb2YgKHRoaXMud2luZG93LnRpbWVyKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5zdmcuYXBwZW5kKCdsaW5lJylcbiAgICAgIC5hdHRyKCd4MScsICc1MCUnKVxuICAgICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAgIC5hdHRyKCd4MicsICc1MCUnKVxuICAgICAgLmF0dHIoJ3kyJywgJzEwMCUnKVxuICAgICAgLmF0dHIoJ3N0cm9rZS13aWR0aCcsICcxcHgnKVxuICAgICAgLmF0dHIoJ3N0cm9rZScsICdyZWQnKVxuICAgICAgLmF0dHIoJ29wYWNpdHknLCAnMC4zJyk7XG4gICAgfVxuXG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB2YXIgeCA9IGQzLnRpbWUuc2NhbGUoKVxuLy8gLmRvbWFpbihbbmV3IERhdGUoMjAxNCwgNCwgMSksIG5ldyBEYXRlKDIwMTQsIDQsIDE1KSAtIDFdKVxuLmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pXG4ucmFuZ2UoWzAsIHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aF0pO1xuICAgIHZhciBtYXJnaW4gPSB7dG9wOiAyMDAsIHJpZ2h0OiA0MCwgYm90dG9tOiAyMDAsIGxlZnQ6IDQwfSxcbiAgICAgaGVpZ2h0ID0gNTAwIC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b207XG4gICAgdGhpcy5zdmdfZ3AgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHRoaXMuc3ZnX3NlbGVjdGVkX29ic2VsID0gdGhpcy5zdmcuYXBwZW5kKCdsaW5lJylcbiAgICAuYXR0cigneDEnLCAnMCcpXG4gICAgLmF0dHIoJ3kxJywgJzAlJylcbiAgICAuYXR0cigneDInLCAnMCcpXG4gICAgLmF0dHIoJ3kyJywgJzEwMCUnKVxuICAgIC5hdHRyKCdzdHJva2Utd2lkdGgnLCAnMXB4JylcbiAgICAuYXR0cignc3Ryb2tlJywgJ2JsYWNrJylcbiAgICAuYXR0cignb3BhY2l0eScsICcwLjMnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKVxuICAgIC5zdHlsZSgnZGlzcGxheScsICdub25lJyk7XG5cbiAgfSxcbiAgZDNPYnNlbHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN2Z19ncFxuICAgIC5zZWxlY3RBbGwoJ2NpcmNsZSxpbWFnZSxyZWN0JylcbiAgICAvLyBUT0RPOiBBVFRFTlRJT04hIFdBUk5JTkchIG9ic2VscyBNVVNUIGhhdmUgYSBmaWVsZCBpZCAtPiB1c2VkIGFzIGEga2V5LlxuICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7IC8vIFRPRE86IGJvZ3VlIGluIGNhc2Ugbm8gSUQgZXhpc3RzIC0+IG1pZ2h0IGhhcHBlbiB3aXRoIEtUQlMgdHJhY2VzIGFuZCBuZXcgb2JzZWxzXG4gIH0sXG4gIGNhbGN1bGF0ZV94OiBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIHggPSAodGltZSAtIHRoaXMud2luZG93LnN0YXJ0KSAqIHRoaXMuc2NhbGVfeCArIHRoaXMudHJhbnNsYXRlX29mZnNldDtcbiAgICByZXR1cm4geDtcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbihlKSB7XG5cbiAgICBpZiAoZSkge1xuICAgICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInRyYWNlOnVwZGF0ZVwiOlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcblxuICAgICAgICAgIC8vdGhpcy5kYXRhID0gdGhpcy50cmFjZS5saXN0X29ic2Vscyh0aGlzLndpbmRvdy5zdGFydCx0aGlzLndpbmRvdy5lbmQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2Uub2JzZWxfbGlzdDsgLy8gZG8gbm90IHdhbnQgdG8gdHJpZ2dlciB0aGUgcmVmcmVzaGluZyBvZiBsaXN0X29ic2VscygpLi4uXG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5leGl0KClcbiAgICAucmVtb3ZlKCk7XG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmVudGVyKClcbiAgICAuYXBwZW5kKCdpbWFnZScpXG4gICAgLmF0dHIoJ2NsYXNzJywgJ1NhbW90cmFjZXMtb2JzZWwnKVxuICAgIC5hdHRyKCd4JywgdGhpcy5vcHRpb25zLngpXG4gICAgLmF0dHIoJ3knLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwneScpKTsgfSlcbiAgICAuYXR0cignd2lkdGgnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnd2lkdGgnKSk7IH0pXG4gICAgLmF0dHIoJ2hlaWdodCcsIGZ1bmN0aW9uKCl7IHJldHVybiAodGhhdC5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUodGhpcy5fX2RhdGFfXy50eXBlLCdoZWlnaHQnKSk7IH0pXG4gICAgLmF0dHIoJ3hsaW5rOmhyZWYnLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwnaWNvbicpKTsgfSk7XG4gICAgLy8gU3RvcmluZyBvYnNlbCBkYXRhIHdpdGggalF1ZXJ5IGZvciBhY2Nlc3NpYmlsaXR5IGZyb21cbiAgICAvLyBldmVudHMgZGVmaW5lZCBieSB1c2VycyB3aXRoIGpRdWVyeVxuICAgICQoJ2ltYWdlJywgdGhpcy5lbGVtZW50KS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAkLmRhdGEoZWwsIHtcbiAgICAgICAgJ1NhbW90cmFjZXMtdHlwZSc6ICdvYnNlbCcsXG4gICAgICAgICdTYW1vdHJhY2VzLWRhdGEnOiBkMy5zZWxlY3QoZWwpLmRhdHVtKClcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH0sXG4gIHJlZnJlc2hfeDogZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoMCwwKScpO1xuICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5hdHRyKCd4JywgdGhpcy5vcHRpb25zLngpXG4gICAgLmF0dHIoJ3knLCBmdW5jdGlvbigpeyByZXR1cm4gKHRoYXQuZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlKHRoaXMuX19kYXRhX18udHlwZSwneScpKTsgfSk7XG4gIH0sXG5cdFx0fTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZURpc3BsYXlJY29uc1pvb207XG4iLCJ2YXIgV2lkZ2V0ID0gcmVxdWlyZShcIi4vV2lkZ2V0LmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xudmFyIGQzID0gcmVxdWlyZShcImQzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFdpZGdldCBmb3IgdmlzdWFsaXNpbmcgYSB0cmFjZS5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdHJhY2UuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQHJlcXVpcmVzIGQzLmpzIGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vZDNqcy5vcmdcIj5kM2pzLm9yZzwvYT4pXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIERFU0NSSVBUSU9OIFRPIENPTUUuLi4uXG4gKiBAcGFyYW0ge1N0cmluZ31cdGRpdklkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHtTYW1vdHJhY2VzLlRyYWNlfVx0dHJhY2VcbiAqICAgICBUcmFjZSBvYmplY3QgdG8gZGlzcGxheVxuICogQHBhcmFtIHtTYW1vdHJhY2VzLlRpbWVXaW5kb3d9IHRpbWVfd2luZG93XG4gKiAgICAgVGltZVdpbmRvdyBvYmplY3QgdGhhdCBkZWZpbmVzIHRoZSB0aW1lIGZyYW1lXG4gKiAgICAgYmVpbmcgY3VycmVudGx5IGRpc3BsYXllZC5cbiAqIEB0b2RvIGFkZCBkZXNjcmlwdGlvbiBhbmQgdXBkYXRlIGRvYy4uLlxuICovXG52YXIgVHJhY2VEaXNwbGF5T2JzZWxPY2N1cnJlbmNlcyA9IGZ1bmN0aW9uKGRpdklkLCB0cmFjZSwgdGltZV93aW5kb3cpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBkaXZJZCk7XG5cbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1PYnNlbE9jY3VycmVuY2VzJyk7XG4gIC8vdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1UcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzJyk7XG4gICQod2luZG93KS5yZXNpemUodGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy50cmFjZSA9IHRyYWNlO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6cmVtb3ZlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcy5vYnNlbF9yZWRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy53aW5kb3cgPSB0aW1lX3dpbmRvdztcbiAgdGhpcy53aW5kb3cub24oJ3R3OnVwZGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdy5vbigndHc6dHJhbnNsYXRlJywgdGhpcy50cmFuc2xhdGVfeC5iaW5kKHRoaXMpKTtcblxuICAvL1x0dGhpcy5vYnNlbF9zZWxlY3RvciA9IG9ic2VsX3NlbGVjdG9yO1xuICAvL1x0dGhpcy53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignJyx0aGlzLi5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG4gIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcblxuICAvLyBjcmVhdGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHZhbHVlIG9yIGZ1bmN0aW9uXG4gIHZhciB0aGlzX3dpZGdldCA9IHRoaXM7XG5cbiAgdGhpcy5kcmF3KCk7XG59O1xuXG5UcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG5cbiAgICB2YXIgZGl2X2VsbXQgPSBkMy5zZWxlY3QoJyMnICsgdGhpcy5pZCk7XG4gICAgdGhpcy5zdmcgPSBkaXZfZWxtdC5hcHBlbmQoJ3N2ZycpXG4gICAgLmF0dHIoXCJ4bWxuc1wiLCBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIpXG4gICAgLmF0dHIoXCJ2ZXJzaW9uXCIsIFwiMS4xXCIpO1xuXG5cbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgPSAwO1xuXG4gICAgdGhpcy5zdmdfZ3AgPSB0aGlzLnN2Zy5hcHBlbmQoJ2cnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcblxuICAgIC8vIGV2ZW50IGxpc3RlbmVyc1xuICAgIHZhciB3aWRnZXQgPSB0aGlzO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91cignY2hhbmdlVGltZU9uRHJhZycsIHRoaXMuZWxlbWVudCwge1xuICAgICAgb25VcENhbGxiYWNrOiBmdW5jdGlvbihkZWx0YV94KSB7XG4gICAgICAgIHZhciB0aW1lX2RlbHRhID0gLWRlbHRhX3ggKiB3aWRnZXQud2luZG93LmdldF93aWR0aCgpIC8gd2lkZ2V0LmVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgICAgIHdpZGdldC5zdmdfZ3AuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgnICsgKC13aWRnZXQudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gICAgICAgIHdpZGdldC53aW5kb3cudHJhbnNsYXRlKHRpbWVfZGVsdGEpO1xuICAgICAgfSxcbiAgICAgIG9uTW92ZUNhbGxiYWNrOiBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICAgICAgd2lkZ2V0LnN2Z19ncC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAob2Zmc2V0IC0gd2lkZ2V0LnRyYW5zbGF0ZV9vZmZzZXQpICsgJywwKScpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIoJ3pvbW1PblNjcm9sbCcsIHRoaXMuZWxlbWVudCwge3RpbWVXaW5kb3c6IHRoaXMud2luZG93fSk7XG4gIH0sXG5cblxuICAvLyBUT0RPOiBuZWVkcyB0byBiZSBuYW1lZCBmb2xsb3dpbmcgYSBjb252ZW50aW9uXG4gIC8vIHRvIGJlIGRlY2lkZWQgb25cbiAgLyoqXG4gIFx0ICogQ2FsY3VsYXRlcyB0aGUgWCBwb3NpdGlvbiBpbiBwaXhlbHMgY29ycmVzcG9uZGluZyB0b1xuICBcdCAqIHRoZSB0aW1lIGdpdmVuIGluIHBhcmFtZXRlci5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gdGltZSBUaW1lIGZvciB3aGljaCB0byBzZWVrIHRoZSBjb3JyZXNwb25kaW5nIHggcGFyYW1ldGVyXG4gIFx0ICovXG4gIGNhbGN1bGF0ZV94OiBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHggPSAoby5nZXRfYmVnaW4oKSAtIHRoaXMud2luZG93LnN0YXJ0KSAqIHRoaXMuc2NhbGVfeCArIHRoaXMudHJhbnNsYXRlX29mZnNldDtcbiAgICByZXR1cm4geFxuXG4gIH0sXG4gIGNhbGN1bGF0ZV93aWR0aDogZnVuY3Rpb24obykge1xuICAgIHZhciB4ID0gTWF0aC5tYXgoMC4wMSwgKG8uZ2V0X2VuZCgpIC0gby5nZXRfYmVnaW4oKSkgKiB0aGlzLnNjYWxlX3gpOyAvLyB3aWR0aCBvZiAwID0+IG5vdCBkaXNwbGF5ZWRcbiAgICByZXR1cm4geFxuICB9LFxuICB0cmFuc2xhdGVfeDogZnVuY3Rpb24oZSkge1xuICAgIHZhciB0aW1lX2RlbHRhID0gZS5kYXRhO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCArPSB0aW1lX2RlbHRhICogdGhpcy5zY2FsZV94O1xuICAgIHRoaXMuc3ZnX2dwXG4gICAgLmF0dHIoJ3RyYW5zZm9ybScsICd0cmFuc2xhdGUoJyArICgtdGhpcy50cmFuc2xhdGVfb2Zmc2V0KSArICcsMCknKTtcbiAgfSxcblxuICByZWZyZXNoX3g6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuc2NhbGVfeCA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93LmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG4gICAgdGhpcy5zdmdfZ3BcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG4gICAgdGhpcy5kM09ic2VscygpXG4gICAgLmF0dHIoJ3gnLCB0aGlzLmNhbGN1bGF0ZV94LmJpbmQodGhpcykpXG4gICAgLmF0dHIoJ3dpZHRoJywgdGhpcy5jYWxjdWxhdGVfd2lkdGguYmluZCh0aGlzKSlcbiAgfSxcblxuICBkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgaWYgKGUpIHtcbiAgICAgIHN3aXRjaCAoZS50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0cmFjZTp1cGRhdGVcIjpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLmxpc3Rfb2JzZWxzKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy50cmFjZS5vYnNlbF9saXN0OyAvLyBkbyBub3Qgd2FudCB0byB0cmlnZ2VyIHRoZSByZWZyZXNoaW5nIG9mIGxpc3Rfb2JzZWxzKCkuLi5cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAuZXhpdCgpXG4gICAgLnJlbW92ZSgpO1xuICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZCgncmVjdCcpXG4gICAgLy8uYXR0cignY2xhc3MnLCdTYW1vdHJhY2VzLW9ic2VsJylcbiAgICAuYXR0cigneCcsIHRoaXMuY2FsY3VsYXRlX3guYmluZCh0aGlzKSlcbiAgICAuYXR0cigneScsICcwJylcbiAgICAuYXR0cignd2lkdGgnLCB0aGlzLmNhbGN1bGF0ZV93aWR0aC5iaW5kKHRoaXMpKVxuICAgIC5hdHRyKCdoZWlnaHQnLCAnMjAnKTtcbiAgICAvLy5hdHRyKCdzdHJva2Utd2lkdGgnLCcxcHgnKVxuICAgIC8vLmF0dHIoJ3N0cm9rZScsJ2JsYWNrJyk7XG4gICAgLy8gU3RvcmluZyBvYnNlbCBkYXRhIHdpdGggalF1ZXJ5IGZvciBhY2Nlc3NpYmlsaXR5IGZyb21cbiAgICAvLyBldmVudHMgZGVmaW5lZCBieSB1c2VycyB3aXRoIGpRdWVyeVxuICAgICQoJ3JlY3QnLCB0aGlzLmVsZW1lbnQpLmVhY2goZnVuY3Rpb24oaSwgZWwpIHtcbiAgICAgICQuZGF0YShlbCwge1xuICAgICAgICAnU2Ftb3RyYWNlcy10eXBlJzogJ29ic2VsJyxcbiAgICAgICAgJ1NhbW90cmFjZXMtZGF0YSc6IGQzLnNlbGVjdChlbCkuZGF0dW0oKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgb2JzZWxfcmVkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIG9icyA9IGUuZGF0YTtcbiAgICB2YXIgc2VsID0gdGhpcy5kM09ic2VscygpXG5cdFx0XHQuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgLy9cdFx0XHRcdGNvbnNvbGUubG9nKCdkYXRhOmlkLG9ic2VsX2VkaXRfaWQnLGlkLG9icy5nZXRfaWQoKSxpZCA9PSBvYnMuZ2V0X2lkKCkpO1xuICByZXR1cm4gby5nZXRfaWQoKSA9PSBvYnMuZ2V0X2lkKCk7XG5cdFx0XHR9KVxuXHRcdFx0LmRhdHVtKG9icylcblx0XHRcdC5hdHRyKCd4JywgdGhpcy5jYWxjdWxhdGVfeC5iaW5kKHRoaXMpKVxuXHRcdFx0LmF0dHIoJ3dpZHRoJywgdGhpcy5jYWxjdWxhdGVfd2lkdGguYmluZCh0aGlzKSlcblx0XHRcdC5hdHRyKCd4bGluazpocmVmJywgdGhpcy5vcHRpb25zLnVybCk7XG4gIH0sXG5cbiAgZDNPYnNlbHM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnN2Z19ncFxuICAgIC5zZWxlY3RBbGwoJ2NpcmNsZSxpbWFnZSxyZWN0JylcbiAgICAvLyBUT0RPOiBBVFRFTlRJT04hIFdBUk5JTkchIG9ic2VscyBNVVNUIGhhdmUgYSBmaWVsZCBpZCAtPiB1c2VkIGFzIGEga2V5LlxuICAgIC8vLmRhdGEodGhpcy5kYXRhKTsgLy8sZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5pZDt9KTtcbiAgICAuZGF0YSh0aGlzLmRhdGEsIGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7IC8vIFRPRE86IGJvZ3VlIGluIGNhc2Ugbm8gSUQgZXhpc3RzIC0+IG1pZ2h0IGhhcHBlbiB3aXRoIEtUQlMgdHJhY2VzIGFuZCBuZXcgb2JzZWxzXG4gIH0sXG5cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzO1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxudmFyIFRyYWNlRGlzcGxheVRleHQgPSBmdW5jdGlvbihkaXZJZCwgdHJhY2UsIHRpbWVXaW5kb3cpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIFdpZGdldC5jYWxsKHRoaXMsIGRpdklkKTtcbiAgdGhpcy5kaXZJZCA9IGRpdklkO1xuICB0aGlzLmFkZF9jbGFzcyhcIldpZGdldC1UcmFjZURpc3BsYXlUZXh0XCIpO1xuICB0aGlzLnRyYWNlID0gdHJhY2U7XG4gIHRoaXMudHJhY2Uub24oXCJ0cmFjZTp1cGRhdGVUXCIsIHRoaXMucmVmcmVzaFguYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oXCJ0cmFjZTpjcmVhdGVfb2JzZWxfVGV4dFwiLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93ID0gdGltZVdpbmRvdztcbiAgdGhpcy53aW5kb3cub24oXCJ0dzp1cGRhdGVcIiwgdGhpcy5yZWZyZXNoWC5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cub24oXCJDaGFuZ2VMYW5nYWdlXCIsIHRoaXMucmVmcmVzaFguYmluZCh0aGlzKSk7XG4gIHRoaXMucmVmcmVzaFgoKTtcbiAgdGhpcy5kYXRhT2IgPSBbXTtcbn07XG5cblRyYWNlRGlzcGxheVRleHQucHJvdG90eXBlID0ge1xuICBkcmF3OiBmdW5jdGlvbihlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5kYXRhT2IucHVzaChKU09OLnN0cmluZ2lmeShlLmRhdGEpKTtcbiAgICAvL3RoaXMuZGF0YU9iID0gSlNPTi5zdHJpbmdpZnkgKGUuZGF0YSk7XG4gICAgLy8gQXNzaXN0LlZpZXdUcmFjZS5hZGRPYnNlbFZpc3UoZS5kYXRhLCB0aGlzLmRpdklkKTsgLy8gVE9ETyB3aGF0IGlzIEFzc2lzdCA/XG4gICAgJChcIiNcIiArIGUuZGF0YVtcIkBpZFwiXSkuaGlkZSgpO1xuICB9LFxuICByZWZyZXNoWDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHRpbWVXaW5kb3cgPSB0aGlzLndpbmRvdztcbiAgICB0aGlzLnRyYWNlLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAodGltZVdpbmRvdy5zdGFydCA8PSBvLmdldF9iZWdpbigpICYmIG8uZ2V0X2JlZ2luKCkgPD0gdGltZVdpbmRvdy5lbmQpIHtcbiAgICAgICAgJChcIiNcIiArIG8uZ2V0X2lkKCkpLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoXCIjXCIgKyBvLmdldF9pZCgpKS5oaWRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIHJlZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5kaXZJZCkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICB0aGlzLmRhdGFPYi5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIC8vIEFzc2lzdC5WaWV3VHJhY2UuYWRkT2JzZWxWaXN1KEpTT04ucGFyc2UobyksIHdpZGouZGl2SWQpOyAvLyBUT0RPIHdoYXQgaXMgQXNzaXN0ID9cbiAgICAgICQoXCIjXCIgKyBKU09OLnBhcnNlKG8pW1wiQGlkXCJdKS5oaWRlKCk7XG4gICAgfSk7XG4gICAgdGhpcy5yZWZyZXNoWCgpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmFjZURpc3BsYXlUZXh0O1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcbnZhciBkMyA9IHJlcXVpcmUoXCJkM1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgdHJhY2UuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRyYWNlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBkMy5qcyBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2QzanMub3JnXCI+ZDNqcy5vcmc8L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldFxuICogQGRlc2NyaXB0aW9uXG4gKiBERVNDUklQVElPTiBUTyBDT01FLi4uLlxuICogQHBhcmFtIHtTdHJpbmd9XHRkaXZJZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UcmFjZX1cdHRyYWNlXG4gKiAgICAgVHJhY2Ugb2JqZWN0IHRvIGRpc3BsYXlcbiAqIEBwYXJhbSB7U2Ftb3RyYWNlcy5UaW1lV2luZG93fSB0aW1lX3dpbmRvd1xuICogICAgIFRpbWVXaW5kb3cgb2JqZWN0IHRoYXQgZGVmaW5lcyB0aGUgdGltZSBmcmFtZVxuICogICAgIGJlaW5nIGN1cnJlbnRseSBkaXNwbGF5ZWQuXG4gKiBAdG9kbyBhZGQgZGVzY3JpcHRpb24gYW5kIHVwZGF0ZSBkb2MuLi5cbiAqL1xudmFyIFRyYWNlRGlzcGxheVpvb21Db250ZXh0ID0gZnVuY3Rpb24oZGl2SWQsIHRyYWNlLCB0aW1lX3dpbmRvdzEsIHRpbWVfd2luZG93Miwgb3B0aW9uczEsIG9wdGlvbnMyKSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgZGl2SWQpO1xuXG4gIHRoaXMubW9kZSA9ICd3aW5kb3dfc3luYyc7XG4gIGlmIChvcHRpb25zMSAhPT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMyICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLm1vZGUgPSAnb2JzZWxfc3luYyc7XG4gICAgaWYgKG9wdGlvbnMxICE9PSB1bmRlZmluZWQgJiYgb3B0aW9uczEuaGFzT3duUHJvcGVydHkoJ3gnKSkge1xuICAgICAgdGhpcy54MSA9IG9wdGlvbnMxLnguYmluZCh0aGlzKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMyICE9PSB1bmRlZmluZWQgJiYgb3B0aW9uczIuaGFzT3duUHJvcGVydHkoJ3gnKSkge1xuICAgICAgdGhpcy54MiA9IG9wdGlvbnMyLnguYmluZCh0aGlzKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0LU9ic2VsT2NjdXJyZW5jZXMnKTtcbiAgLy90aGlzLmFkZF9jbGFzcygnV2lkZ2V0LVRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXMnKTtcbiAgJCh3aW5kb3cpLnJlc2l6ZSh0aGlzLnJlZnJlc2hfeC5iaW5kKHRoaXMpKTtcblxuICB0aGlzLnRyYWNlID0gdHJhY2U7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOnVwZGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy50cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuICB0aGlzLnRyYWNlLm9uKCd0cmFjZTpyZW1vdmVfb2JzZWwnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMudHJhY2Uub24oJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzLm9ic2VsX3JlZHJhdy5iaW5kKHRoaXMpKTtcblxuICB0aGlzLndpbmRvdzEgPSB0aW1lX3dpbmRvdzE7XG4gIHRoaXMud2luZG93MS5vbigndHc6dXBkYXRlJywgdGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG4gIHRoaXMud2luZG93MS5vbigndHc6dHJhbnNsYXRlJywgdGhpcy5yZWZyZXNoX3guYmluZCh0aGlzKSk7XG5cbiAgdGhpcy53aW5kb3cyID0gdGltZV93aW5kb3cyO1xuICB0aGlzLndpbmRvdzIub24oJ3R3OnVwZGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuICB0aGlzLndpbmRvdzIub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMucmVmcmVzaF94LmJpbmQodGhpcykpO1xuXG4gIC8vXHR0aGlzLm9ic2VsX3NlbGVjdG9yID0gb2JzZWxfc2VsZWN0b3I7XG4gIC8vXHR0aGlzLndpbmRvdzEuYWRkRXZlbnRMaXN0ZW5lcignJyx0aGlzLi5iaW5kKHRoaXMpKTtcblxuICB0aGlzLmluaXRfRE9NKCk7XG4gIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcblxuICAvLyBjcmVhdGUgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHZhbHVlIG9yIGZ1bmN0aW9uXG4gIHZhciB0aGlzX3dpZGdldCA9IHRoaXM7XG5cbiAgdGhpcy5kcmF3KCk7XG59O1xuXG5UcmFjZURpc3BsYXlab29tQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gIGluaXRfRE9NOiBmdW5jdGlvbigpIHtcblxuXG4gICAgdmFyIGRpdl9lbG10ID0gZDMuc2VsZWN0KCcjJyArIHRoaXMuaWQpO1xuICAgIHRoaXMuc3ZnID0gZGl2X2VsbXQuYXBwZW5kKCdzdmcnKVxuICAgIC5hdHRyKFwieG1sbnNcIiwgXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiKVxuICAgIC5hdHRyKFwidmVyc2lvblwiLCBcIjEuMVwiKTtcblxuXG4gICAgdGhpcy5zY2FsZV94MSA9IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCAvIHRoaXMud2luZG93MS5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnNjYWxlX3gyID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cyLmdldF93aWR0aCgpO1xuICAgIHRoaXMudHJhbnNsYXRlX29mZnNldCA9IDA7XG5cbiAgICB0aGlzLnN5bmNfcGF0aCA9IHRoaXMuc3ZnLmFwcGVuZCgncGF0aCcpXG4gICAgLmF0dHIoJ3N0eWxlJywgJ3N0cm9rZTpncmV5O3N0cm9rZS13aWR0aDoxcHg7ZmlsbDojZGRkOycpO1xuICAgIHRoaXMuc3ZnX2dwID0gdGhpcy5zdmcuYXBwZW5kKCdnJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3RyYW5zbGF0ZSgwLDApJyk7XG5cbiAgfSxcblxuXG4gIC8vIFRPRE86IG5lZWRzIHRvIGJlIG5hbWVkIGZvbGxvd2luZyBhIGNvbnZlbnRpb25cbiAgLy8gdG8gYmUgZGVjaWRlZCBvblxuICAvKipcbiAgXHQgKiBDYWxjdWxhdGVzIHRoZSBYIHBvc2l0aW9uIGluIHBpeGVscyBjb3JyZXNwb25kaW5nIHRvXG4gIFx0ICogdGhlIHRpbWUgZ2l2ZW4gaW4gcGFyYW1ldGVyLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIFRpbWUgZm9yIHdoaWNoIHRvIHNlZWsgdGhlIGNvcnJlc3BvbmRpbmcgeCBwYXJhbWV0ZXJcbiAgXHQgKi9cbiAgY2FsY3VsYXRlX3g6IGZ1bmN0aW9uKHQpIHtcbiAgICB2YXIgeCA9ICh0IC0gdGhpcy53X3N0YXJ0KSAqIHRoaXMuc2NhbGVfeDtcbiAgICByZXR1cm4geCA7XG4gIH0sXG4gIG8yeDE6IGZ1bmN0aW9uKG8pIHtcbiAgICB0aGlzLndfc3RhcnQgPSB0aGlzLndpbmRvdzEuc3RhcnQ7XG4gICAgdGhpcy5zY2FsZV94ID0gdGhpcy5zY2FsZV94MTtcbiAgICByZXR1cm4gdGhpcy54MShvKTtcbiAgfSxcbiAgbzJ4MjogZnVuY3Rpb24obykge1xuICAgIHRoaXMud19zdGFydCA9IHRoaXMud2luZG93Mi5zdGFydDtcbiAgICB0aGlzLnNjYWxlX3ggPSB0aGlzLnNjYWxlX3gyO1xuICAgIHJldHVybiB0aGlzLngyKG8pO1xuICB9LFxuICB4MTogZnVuY3Rpb24obykge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZV94KG8uZ2V0X2JlZ2luKCkpO1xuICB9LFxuICB4MjogZnVuY3Rpb24obykge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0ZV94KG8uZ2V0X2JlZ2luKCkpO1xuICB9LFxuICBjYWxjdWxhdGVfcGF0aDogZnVuY3Rpb24obykge1xuICAgIHZhciBwID0gW107XG4gICAgdmFyIHgxID0gdGhpcy5vMngxKG8pO1xuICAgIHZhciB4MiA9IHRoaXMubzJ4MihvKTtcbiAgICBwID0gWydNJywgeDEsICcwJywgJ0MnLCB4MSwgJzEwLCcsIHgyLCAnMTAsJywgeDIsICcyMCddO1xuICAgIHJldHVybiBwLmpvaW4oJyAnKTtcbiAgfSxcbiAgY2FsY3VsYXRlX3Zpc2liaWxpdHk6IGZ1bmN0aW9uKG8pIHtcbiAgICB2YXIgeDEgPSB0aGlzLm8yeDEobyk7XG4gICAgaWYgKHgxIDwgMCkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICh4MSA+IHRoaXMuZWxlbWVudC5jbGllbnRXaWR0aCkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciB4MiA9IHRoaXMubzJ4MihvKTtcbiAgICBpZiAoeDIgPiB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGgpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoeDIgPCAwKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGNhbGN1bGF0ZV9zdHlsZTogZnVuY3Rpb24obykge1xuICAgIGlmICh0aGlzLmNhbGN1bGF0ZV92aXNpYmlsaXR5KG8pKSB7XG4gICAgICAvL2lmKHRydWUpIHtcbiAgICAgIHJldHVybiAnc3Ryb2tlOmdyZXk7c3Ryb2tlLXdpZHRoOjFweDtmaWxsOm5vbmU7JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MXB4O2ZpbGw6bm9uZTsnO1xuICAgIH1cbiAgfSxcbiAgdHJhbnNsYXRlX3g6IGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgdGltZV9kZWx0YSA9IGUuZGF0YTtcbiAgICB0aGlzLnRyYW5zbGF0ZV9vZmZzZXQgKz0gdGltZV9kZWx0YSAqIHRoaXMuc2NhbGVfeDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKCcgKyAoLXRoaXMudHJhbnNsYXRlX29mZnNldCkgKyAnLDApJyk7XG4gIH0sXG5cbiAgcmVmcmVzaF94OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNjYWxlX3gxID0gdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aW5kb3cxLmdldF93aWR0aCgpO1xuICAgIHRoaXMuc2NhbGVfeDIgPSB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGggLyB0aGlzLndpbmRvdzIuZ2V0X3dpZHRoKCk7XG4gICAgdGhpcy50cmFuc2xhdGVfb2Zmc2V0ID0gMDtcbiAgICB0aGlzLnN2Z19ncFxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAndHJhbnNsYXRlKDAsMCknKTtcbiAgICBpZiAodGhpcy5tb2RlID09IFwib2JzZWxfc3luY1wiKSB7XG4gICAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAgIC5hdHRyKCdkJywgdGhpcy5jYWxjdWxhdGVfcGF0aC5iaW5kKHRoaXMpKVxuICAgICAgLmF0dHIoJ3N0eWxlJywgdGhpcy5jYWxjdWxhdGVfc3R5bGUuYmluZCh0aGlzKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3luY19wYXRoLmF0dHIoJ2QnLCB0aGlzLmNhbGN1bGF0ZV9zeW5jX3BhdGguYmluZCh0aGlzKSk7XG4gICAgfVxuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoZSkge1xuICAgICAgc3dpdGNoIChlLnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInRyYWNlOnVwZGF0ZVwiOlxuICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMudHJhY2UubGlzdF9vYnNlbHMoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aGlzLmRhdGEgPSB0aGlzLnRyYWNlLm9ic2VsX2xpc3Q7IC8vIGRvIG5vdCB3YW50IHRvIHRyaWdnZXIgdGhlIHJlZnJlc2hpbmcgb2YgbGlzdF9vYnNlbHMoKS4uLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhpcy5tb2RlID09IFwib2JzZWxfc3luY1wiKSB7XG4gICAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAgIC5leGl0KClcbiAgICAgIC5yZW1vdmUoKTtcbiAgICAgIHRoaXMuZDNPYnNlbHMoKVxuICAgICAgLmVudGVyKClcbiAgICAgIC5hcHBlbmQoJ3BhdGgnKVxuICAgICAgLy8uYXR0cignY2xhc3MnLCdTYW1vdHJhY2VzLW9ic2VsJylcbiAgICAgIC5hdHRyKCdkJywgdGhpcy5jYWxjdWxhdGVfcGF0aC5iaW5kKHRoaXMpKVxuICAgICAgLmF0dHIoJ3N0eWxlJywgdGhpcy5jYWxjdWxhdGVfc3R5bGUuYmluZCh0aGlzKSk7XG4gICAgICB0aGlzLmQzT2JzZWxzKClcbiAgICAgIC8vLmF0dHIoJ3N0cm9rZS13aWR0aCcsJzFweCcpXG4gICAgICAvLy5hdHRyKCdzdHJva2UnLCdibGFjaycpO1xuICAgICAgLy8gU3RvcmluZyBvYnNlbCBkYXRhIHdpdGggalF1ZXJ5IGZvciBhY2Nlc3NpYmlsaXR5IGZyb21cbiAgICAgIC8vIGV2ZW50cyBkZWZpbmVkIGJ5IHVzZXJzIHdpdGggalF1ZXJ5XG4gICAgICAkKCdwYXRoJywgdGhpcy5lbGVtZW50KS5lYWNoKGZ1bmN0aW9uKGksIGVsKSB7XG4gICAgICAgICQuZGF0YShlbCwge1xuICAgICAgICAgICdTYW1vdHJhY2VzLXR5cGUnOiAnb2JzZWwnLFxuICAgICAgICAgICdTYW1vdHJhY2VzLWRhdGEnOiBkMy5zZWxlY3QoZWwpLmRhdHVtKClcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zeW5jX3BhdGguYXR0cignZCcsIHRoaXMuY2FsY3VsYXRlX3N5bmNfcGF0aC5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH0sXG4gIGNhbGN1bGF0ZV9zeW5jX3BhdGg6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cyA9IE1hdGgubWF4KHRoaXMud2luZG93MS5zdGFydCwgdGhpcy53aW5kb3cyLnN0YXJ0KTtcbiAgICB2YXIgdGUgPSBNYXRoLm1pbih0aGlzLndpbmRvdzEuZW5kLCB0aGlzLndpbmRvdzIuZW5kKTtcbiAgICB2YXIgeDFzID0gKE1hdGgubWluKHRzLCB0aGlzLndpbmRvdzEuZW5kKSAtIHRoaXMud2luZG93MS5zdGFydCkgKiB0aGlzLnNjYWxlX3gxO1xuICAgIHZhciB4MnMgPSAoTWF0aC5taW4odHMsIHRoaXMud2luZG93Mi5lbmQpIC0gdGhpcy53aW5kb3cyLnN0YXJ0KSAqIHRoaXMuc2NhbGVfeDI7XG4gICAgdmFyIHgxZSA9IChNYXRoLm1heCh0ZSwgdGhpcy53aW5kb3cxLnN0YXJ0KSAtIHRoaXMud2luZG93MS5zdGFydCkgKiB0aGlzLnNjYWxlX3gxO1xuICAgIHZhciB4MmUgPSAoTWF0aC5tYXgodGUsIHRoaXMud2luZG93Mi5zdGFydCkgLSB0aGlzLndpbmRvdzIuc3RhcnQpICogdGhpcy5zY2FsZV94MjtcbiAgICB2YXIgcCA9IFtcIk1cIiwgeDFzLCBcIjBcIiwgXCJDXCIsIHgxcywgXCIyMCxcIiwgeDJzLCBcIjAsXCIsIHgycywgXCIyMFwiLCBcIkxcIiwgeDJlLCBcIjIwXCIsIFwiQ1wiLCB4MmUsIFwiMCxcIiwgeDFlLCBcIjIwLFwiLCB4MWUsIFwiMFwiLCBcIlpcIl07XG4gICAgcmV0dXJuIHAuam9pbihcIiBcIik7XG4gIH0sXG4gIG9ic2VsX3JlZHJhdzogZnVuY3Rpb24oZSkge1xuICAgIHZhciBvYnMgPSBlLmRhdGE7XG4gICAgdmFyIHNlbCA9IHRoaXMuZDNPYnNlbHMoKVxuXHRcdFx0LmZpbHRlcihmdW5jdGlvbihvKSB7XG4gIC8vXHRcdFx0XHRjb25zb2xlLmxvZygnZGF0YTppZCxvYnNlbF9lZGl0X2lkJyxpZCxvYnMuZ2V0X2lkKCksaWQgPT0gb2JzLmdldF9pZCgpKTtcbiAgcmV0dXJuIG8uZ2V0X2lkKCkgPT0gb2JzLmdldF9pZCgpO1xuXHRcdFx0fSlcblx0XHRcdC5kYXR1bShvYnMpXG5cdFx0XHQuYXR0cignZCcsIHRoaXMuY2FsY3VsYXRlX3BhdGguYmluZCh0aGlzKSlcbiAgfSxcblxuICBkM09ic2VsczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3ZnX2dwXG4gICAgLnNlbGVjdEFsbCgncGF0aCcpXG4gICAgLy8gVE9ETzogQVRURU5USU9OISBXQVJOSU5HISBvYnNlbHMgTVVTVCBoYXZlIGEgZmllbGQgaWQgLT4gdXNlZCBhcyBhIGtleS5cbiAgICAvLy5kYXRhKHRoaXMuZGF0YSk7IC8vLGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuaWQ7fSk7XG4gICAgLmRhdGEodGhpcy5kYXRhLCBmdW5jdGlvbihkKSB7IHJldHVybiBkLmlkO30pOyAvLyBUT0RPOiBib2d1ZSBpbiBjYXNlIG5vIElEIGV4aXN0cyAtPiBtaWdodCBoYXBwZW4gd2l0aCBLVEJTIHRyYWNlcyBhbmQgbmV3IG9ic2Vsc1xuICB9LFxuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJhY2VEaXNwbGF5Wm9vbUNvbnRleHQ7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5yZXF1aXJlKCdqcXVlcnktbW91c2V3aGVlbCcpKCQpO1xuXG4vKipcbiAqIEBtaXhpblxuICogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiAqIEByZXF1aXJlcyBqUXVlcnkgTW91c2UgV2hlZWwgcGx1Z2luIChzZWUgPGEgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9icmFuZG9uYWFyb24vanF1ZXJ5LW1vdXNld2hlZWxcIj5Nb3VzZSBXaGVlbCBwbHVnaW48L2E+KVxuICogQGRlc2NyaXB0aW9uXG4gKiBBbGwgd2lkZ2V0cyBzaG91bGQgaW5oZXJpdCBmcm9tIHRoaXMgU2Ftb3RyYWNlcy5VSS5XaWRnZXRzLldpZGdldC5cbiAqXG4gKiBJbiBvcmRlciB0byB1c2UgY3JlYXRlIGEgd2lkZ2V0IHRoYXQgaW5oZXJpdHMgZnJvbSB0aGVcbiAqIFdpZGdldCBjbGFzcywgb25lIG11c2ggaW5jbHVkZSB0aGUgZm9sbG93aW5nIGNvZGUgaW5cbiAqIHRoZSBjb25zdHJ1Y3RvciBvZiB0aGVpciB3aWRnZXQuXG4gKiA8Y29kZT5cbiAqIDwvY29kZT5cbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWQgSWQgb2YgdGhlIEhUTUwgZWxlbWVudCB0aGVcbiAqIFdpZGdldCBpcyBhdHRhY2hlZCB0by5cbiAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgSFRNTCBlbGVtZW50IHRoZVxuICogV2lkZ2V0IGlzIGF0dGFjaGVkIHRvLlxuICovXG52YXIgV2lkZ2V0ID0gKGZ1bmN0aW9uKCkge1xuICAvKipcbiAgXHQgKiBBZGRzIHRoZSBnaXZlbiBjbGFzcyB0byB0aGUgSFRNTCBlbGVtZW50IHRvIHdoaWNoXG4gIFx0ICogdGhpcyBXaWRnZXQgaXMgYXR0YWNoZWQgdG8uXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuV2lkZ2V0cy5XaWRnZXQucHJvdG90eXBlXG4gIFx0ICogQHB1YmxpY1xuICBcdCAqIEBtZXRob2RcbiAgXHQgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NfbmFtZSBOYW1lIG9mIHRoZSBjbGFzcyB0byBhZGRcbiAgXHQgKi9cbiAgZnVuY3Rpb24gYWRkX2NsYXNzKGNsYXNzX25hbWUpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzX25hbWU7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0VmFsdWVBdHRyaWJ1dFN0eWxlICAodHlwZSxhdHRyaWJ1dCkge1xuICAgIGlmICh0aGlzLnN0eWxlc2hlZXRbdHlwZV0pIHtcbiAgICAgICAgICBpZiAoKHRoaXMuc3R5bGVzaGVldFt0eXBlXVthdHRyaWJ1dF0pJiYodGhpcy5zdHlsZXNoZWV0W3R5cGVdW2F0dHJpYnV0XSAhPT1cIlwiKSlcbiAgICAgICAgICAgICAge3JldHVybiB0aGlzLnN0eWxlc2hlZXRbdHlwZV1bYXR0cmlidXRdO31cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICB7cmV0dXJuIHRoaXMuc3R5bGVzaGVldFsnZGVmYXVsdCddW2F0dHJpYnV0XTt9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLnN0eWxlc2hlZXRbJ2RlZmF1bHQnXVthdHRyaWJ1dF07XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHVubG9hZCgpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NOYW1lID0gJyc7XG4gICAgLy9cdFx0dGhpcy5lbGVtZW50LlxuICB9XG4gIC8qKlxuICBcdCAqIENyZWF0ZXMgYSBuZXcgYmVoYXZpb3VyIChpbnRlcmFjdGlvbiBwb3NzaWJpbGl0eSlcbiAgXHQgKiB3aXRoIHRoZSB3aWRnZXQuXG4gIFx0ICogVHdvIGJlaGF2aW91cnMgYXJlIGltcGxlbWVudGVkIHNvIGZhcjpcbiAgXHQgKiAxLiAnY2hhbmdlVGltZU9uRHJhZydcbiAgXHQgKiAyLiAnem9tbU9uU2Nyb2xsJ1xuICBcdCAqXG4gIFx0ICogMS4gJ2NoYW5nZVRpbWVPbkRyYWcnIGJlaGF2aW91ciBhbGxvd3MgdG8gY2hhbmdlXG4gIFx0ICogYSB7QGxpbmsgU2Ftb3RyYWNlcy5MaWIuVGltZXJ9IG9uIGEgZHJhZy1uLWRyb3AgbGlrZSBldmVudFxuICBcdCAqIChKYXZhU2NyaXB0ICdtb3VzZWRvd24nLCAnbW91c2Vtb3ZlJywgJ21vdXNldXAnIGFuZCAnbW91c2VsZWF2ZSdcbiAgXHQgKiBldmVudHMpLiBUaGlzIGFsbG93cyB0byBjaGFuZ2UgdGhlIGN1cnJlbnQgdGltZSBieSBkcmFnZ2luZ1xuICBcdCAqIGEgdHJhY2UgdmlzdWFsaXNhdGlvbiBvciBhIHNsaWRlciBmb3IgaW5zdGFuY2UuXG4gIFx0ICpcbiAgXHQgKiAyLiAnY2hhbmdlVGltZU9uRHJhZycgYmVoYXZpb3VyIGFsbG93cyB0byBjaGFuZ2VcbiAgXHQgKiBhIHtAbGluayBTYW1vdHJhY2VzLkxpYi5UaW1lV2luZG93fSBvbiBhIG1vdXNlIHNjcm9sbCBldmVudFxuICBcdCAqIChKYXZhU2NyaXB0ICd3aGVlbCcgZXZlbnQpXG4gIFx0ICpcbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5XaWRnZXRzLldpZGdldC5wcm90b3R5cGVcbiAgXHQgKiBAcHVibGljXG4gIFx0ICogQG1ldGhvZFxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBiZWhhdmlvdXJOYW1lIE5hbWUgb2YgdGhlIGJlaGF2aW91clxuICBcdCAqICAgICAoJ2NoYW5nZVRpbWVPbkRyYWcnIG9yICd6b21tT25TY3JvbGwnKS4gU2VlIGRlc2NyaXB0aW9uIGFib3ZlLlxuICBcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGV2ZW50VGFyZ2V0RWxlbWVudCBIVE1MIEVsZW1lbnQgb24gd2hpY2hcbiAgXHQgKiAgICAgYW4gZXZlbnRMaXN0ZW5lciB3aWxsIGJlIGNyZWF0ZWQgKHR5cGljYWxseSwgdGhlIGVsZW1lbnQgeW91XG4gIFx0ICogICAgIHdhbnQgdG8gaW50ZXJhY3Qgd2l0aCkuXG4gIFx0ICogQHBhcmFtIHtPYmplY3R9IG9wdCBPcHRpb25zIHRoYXQgdmFyeSBkZXBlbmRpbmcgb24gdGhlXG4gIFx0ICogICAgIHNlbGVjdGVkIGJlaGF2aW91ci5cbiAgXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHQub25VcENhbGxiYWNrXG4gIFx0ICogICAgKGZvciAnY2hhbmdlVGltZU9uRHJhZycgYmVoYXZpb3VyIG9ubHkpXG4gIFx0ICogICAgQ2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSAnbW91c2V1cCcgZXZlbnQgd2lsbCBiZVxuICBcdCAqICAgIHRyaWdnZXJlZC4gVGhlIGFyZ3VtZW50IGRlbHRhX3ggaXMgcGFzc2VkIHRvIHRoZSBjYWxsYmFja1xuICBcdCAqICAgIGFuZCByZXByZXNlbnRzIHRoZSBvZmZzZXQgb2YgdGhlIHggYXhpcyBpbiBwaXhlbHMgYmV0d2VlbiB0aGVcbiAgXHQgKiAgICBtb21lbnQgdGhlIG1vdXNlZG93biBldmVudCBoYXMgYmVlbiB0cmlnZ2VyZWQgYW5kIHRoZSBtb21lbnRcbiAgXHQgKiAgICB0aGUgY3VycmVudCBtb3VzZXVwIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvcHQub25Nb3ZlQ2FsbGJhY2tcbiAgXHQgKiAgICAoZm9yICdjaGFuZ2VUaW1lT25EcmFnJyBiZWhhdmlvdXIgb25seSlcbiAgXHQgKiAgICBDYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlICdtb3VzZW1vdmUnIGV2ZW50IHdpbGwgYmVcbiAgXHQgKiAgICB0cmlnZ2VyZWQuIFRoZSBhcmd1bWVudCBkZWx0YV94IGlzIHBhc3NlZCB0byB0aGUgY2FsbGJhY2tcbiAgXHQgKiAgICBhbmQgcmVwcmVzZW50cyB0aGUgb2Zmc2V0IG9mIHRoZSB4IGF4aXMgaW4gcGl4ZWxzIGJldHdlZW4gdGhlXG4gIFx0ICogICAgbW9tZW50IHRoZSBtb3VzZWRvd24gZXZlbnQgaGFzIGJlZW4gdHJpZ2dlcmVkIGFuZCB0aGUgbW9tZW50XG4gIFx0ICogICAgdGhlIGN1cnJlbnQgbW91c2Vtb3ZlIGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgXHQgKiBAcGFyYW0ge1NhbW90cmFjZXMuTGliLlRpbWVXaW5kb3d9IG9wdC50aW1lV2luZG93XG4gIFx0ICogICAgKGZvciAnem9tbU9uU2Nyb2xsJyBiZWhhdmlvdXIgb25seSlcbiAgXHQgKiAgICB7QGxpbmsgU2Ftb3RyYWNlcy5MaWIuVGltZVdpbmRvd30gb2JqZWN0IHRoYXQgd2lsbFxuICBcdCAqICAgIGJlIGVkaXRlZCB3aGVuIHRoZSB6b29tIGFjdGlvbiBpcyBwcm9kdWNlZC5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gYWRkX2JlaGF2aW91cihiZWhhdmlvdXJOYW1lLCBldmVudFRhcmdldEVsZW1lbnQsIG9wdCkge1xuXG4gICAgc3dpdGNoIChiZWhhdmlvdXJOYW1lKSB7XG4gICAgICBjYXNlICdjaGFuZ2VUaW1lT25EcmFnJzpcbiAgICAgICAgdmFyIG1vdXNlZG93biwgbW91c2V1cCwgbW91c2Vtb3ZlO1xuICAgICAgICB2YXIgaW5pdF9jbGllbnRfeDtcbiAgICAgICAgbW91c2Vkb3duID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8vXHRjb25zb2xlLmxvZygnbW91c2Vkb3duJyk7XG4gICAgICAgICAgaW5pdF9jbGllbnRfeCA9IGUuY2xpZW50WDtcbiAgICAgICAgICBldmVudFRhcmdldEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgbW91c2Vtb3ZlKTtcbiAgICAgICAgICBldmVudFRhcmdldEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIG1vdXNldXApO1xuICAgICAgICAgIGV2ZW50VGFyZ2V0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgbW91c2V1cCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICBtb3VzZXVwID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIC8vXHRjb25zb2xlLmxvZygnbW91c2V1cCcpO1xuICAgICAgICAgIGlmIChpbml0X2NsaWVudF94ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBkZWx0YV94ID0gKGUuY2xpZW50WCAtIGluaXRfY2xpZW50X3gpO1xuICAgICAgICAgICAgb3B0Lm9uVXBDYWxsYmFjayhkZWx0YV94KTtcbiAgICAgICAgICAgIGV2ZW50VGFyZ2V0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBtb3VzZW1vdmUpO1xuICAgICAgICAgICAgZXZlbnRUYXJnZXRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBtb3VzZXVwKTtcbiAgICAgICAgICAgIGV2ZW50VGFyZ2V0RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgbW91c2V1cCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgbW91c2Vtb3ZlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgIHZhciBkZWx0YV94ID0gKGUuY2xpZW50WCAtIGluaXRfY2xpZW50X3gpO1xuICAgICAgICAgIG9wdC5vbk1vdmVDYWxsYmFjayhkZWx0YV94KTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH07XG4gICAgICAgIGV2ZW50VGFyZ2V0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBtb3VzZWRvd24pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3pvbW1PblNjcm9sbCc6XG4gICAgICAgIHZhciB3aGVlbDtcblxuICAgICAgICB3aGVlbCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICB2YXIgY29lZiA9IE1hdGgucG93KDAuOCwgZS5kZWx0YVkpO1xuICAgICAgICAgIG9wdC50aW1lV2luZG93Lnpvb20oY29lZik7XG4gICAgICAgICAgLy9cdFx0XHRcdG9wdC5vbldoZWVsQ2FsbGJhY2suY2FsbChvcHQuYmluZCxjb2VmKTtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICAkKGV2ZW50VGFyZ2V0RWxlbWVudCkubW91c2V3aGVlbCh3aGVlbCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBmdW5jdGlvbihpZCkge1xuICAgIC8vIERPQ1VNRU5URUQgQUJPVkVcbiAgICAvL3RoaXMuaWQgPSBpZDtcbiAgICAvL3RoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpO1xuICAgIHRoaXMuZWxlbWVudCA9IGlkO1xuICAgIHRoaXMuaWQgPSB0aGlzLmVsZW1lbnQuaWQ7XG5cbiAgICB0aGlzLmFkZF9jbGFzcyA9IGFkZF9jbGFzcztcbiAgICB0aGlzLmFkZF9iZWhhdmlvdXIgPSBhZGRfYmVoYXZpb3VyO1xuXG4gICAgLy8gY2FsbCBtZXRob2RcbiAgICB0aGlzLmFkZF9jbGFzcygnV2lkZ2V0Jyk7XG4gICAgdGhpcy5nZXRWYWx1ZUF0dHJpYnV0U3R5bGUgPSBnZXRWYWx1ZUF0dHJpYnV0U3R5bGU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpZGdldDtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRpbWUgc2NhbGUuXG4gKiBAY2xhc3MgV2lkZ2V0IGZvciB2aXN1YWxpc2luZyBhIHRpbWUgc2NhbGUuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQHJlcXVpcmVzIGQzLmpzIGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vZDNqcy5vcmdcIj5kM2pzLm9yZzwvYT4pXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5XaW5kb3dTY2FsZSBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgdGhlIHRlbXBvcmFsIHNjYWxlIG9mIGFcbiAqIHtAbGluayBTYW1vdHJhY2VzLlRpbWVXaW5kb3d8VGltZVdpbmRvd30uIFRoaXNcbiAqIHdpZGdldCB1c2VzIGQzLmpzIHRvIGNhbGN1bGF0ZSBhbmQgZGlzcGxheSB0aGUgc2NhbGUuXG4gKlxuICogTm90ZTogdW5sZXNzIHRoZSBvcHRpb25hbCBhcmd1bWVudCBpc0phdmFzY3JpcHREYXRlIGlzIGRlZmluZWQsXG4gKiB0aGUgd2lkZ2V0IHdpbGwgdHJ5IHRvIGd1ZXNzIGlmIHRpbWUgaXMgZGlzcGxheWVkIGFzIG51bWJlcnMsXG4gKiBvciBpZiB0aW1lIGlzIGRpc3BsYXllZCBpbiB5ZWFyL21vbnRoL2RheS9ob3Vycy9ldGMuXG4gKiBUaGlzIHNlY29uZCBvcHRpb24gYXNzdW1lcyB0aGF0IHRoZSB0aW1lIGlzIHJlcHJlc2VudGVkIGluXG4gKiBtaWxsaXNlY29uZHMgc2luY2UgMSBKYW51YXJ5IDE5NzAgVVRDLlxuICogQHBhcmFtIHtTdHJpbmd9XHRkaXZJZFxuICogICAgIElkIG9mIHRoZSBESVYgZWxlbWVudCB3aGVyZSB0aGUgd2lkZ2V0IHdpbGwgYmVcbiAqICAgICBpbnN0YW50aWF0ZWRcbiAqIEBwYXJhbSB7fSB0aW1lV2luZG93XG4gKiAgICAgVGltZVdpbmRvd0NlbnRlcmVkT25UaW1lIG9iamVjdFxuICogQHBhcmFtIHtCb29sZWFufSBbaXNKYXZhc2NyaXB0RGF0ZV1cbiAqICAgICBCb29sZWFuIHRoYXQgZGVzY3JpYmVzIGlmIHRoZSBzY2FsZSByZXByZXNlbnRzIGEgSmF2YVNjcmlwdCBEYXRlIG9iamVjdC5cbiAqICAgICBJZiBzZXQgdG8gdHJ1ZSwgdGhlIHdpZGdldCB3aWxsIGRpc3BsYXkgeWVhcnMsIG1vbnRocywgZGF5cywgaG91cnMsIG1pbnV0ZXMuLi5cbiAqICAgICBhcyBpZiB0aGUgdGltZSBnaXZlbiB3YXMgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgZWxsYXBzZWQgc2luY2UgMSBKYW51YXJ5IDE5NzAgVVRDLlxuICogICAgIElmIHNldCB0byBmYWxzZSwgdGhlIHdpZGdldCB3aWxsIGRpc3BsYXkgdGhlIG51bWJlcnMgd2l0aG91dCBhdHRlbXB0aW5nXG4gKiAgICAgYW55IGNvbnZlcnNpb24uXG4gKiAgICAgVGhpcyBhcmd1bWVudCBpcyBvcHRpb25hbC4gSWYgbm90IHNldCwgdGhlIHdpZGdldCB3aWxsIHRyeSB0byBndWVzczpcbiAqICAgICBJZiB0aGUgbnVtYmVyIG9mIHRoZSBzdGFydCBvZiB0aGUgZ2l2ZW4gVGltZVdpbmRvdyBpcyBhYm92ZSBhIGJpbGxpb24sIHRoZW5cbiAqICAgICBpdCBpcyBhc3N1bWVkIHRoYXQgdGhlIEphdmFTY3JpcHQgRGF0ZSBvYmplY3QgaGFzIGJlZW4gdXNlZCB0byByZXByZXNlbnQgdGltZS5cbiAqICAgICBPdGhlcndpc2UsIHRoZSBudW1lcmljYWwgdmFsdWUgb2YgdGltZSB3aWxsIGJlIGRpc3BsYXllZC5cbiAqL1xudmFyIFdpbmRvd1NjYWxlID0gZnVuY3Rpb24oaHRtbEVsZW1lbnQsIHRpbWVXaW5kb3csIGlzSmF2YXNjcmlwdERhdGUpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbEVsZW1lbnQpO1xuXG4gIHRoaXMuYWRkX2NsYXNzKFwiV2lkZ2V0LVdpbmRvd1NjYWxlXCIpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcblxuICB0aGlzLndpbmRvdyA9IHRpbWVXaW5kb3c7XG4gIHRoaXMud2luZG93Lm9uKFwidHc6dXBkYXRlXCIsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cub24oXCJ0dzp0cmFuc2xhdGVcIiwgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuXG4gIC8vIFRyeWluZyB0byBndWVzcyBpZiB0aW1lV2luZG93IGlzIHJlbGF0ZWQgdG8gYSBEYXRlKCkgb2JqZWN0XG4gIGlmICh0aGlzLndpbmRvdy5zdGFydCA+IDEwMDAwMDAwMDApIHsgLy8gMW9eOSA+IDExIEphbiAxOTcwIGlmIGEgRGF0ZSBvYmplY3RcbiAgICB0aGlzLmlzSmF2YXNjcmlwdERhdGUgPSBpc0phdmFzY3JpcHREYXRlIHx8IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5pc0phdmFzY3JpcHREYXRlID0gaXNKYXZhc2NyaXB0RGF0ZSB8fCBmYWxzZTtcbiAgfVxuXG4gIHRoaXMuaW5pdERPTSgpO1xuICAvLyBVcGRhdGUgc2xpZGVyJ3MgcG9zaXRpb25cbiAgdGhpcy5kcmF3KCk7XG5cbn07XG5cbldpbmRvd1NjYWxlLnByb3RvdHlwZSA9IHtcbiAgaW5pdERPTTogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLy8gQ3JlYXRlIHRoZSBzbGlkZXJcbiAgICB0aGlzLnN2ZyA9IGQzLnNlbGVjdCh0aGlzLmVsZW1lbnQpLmFwcGVuZChcInN2Z1wiKTtcbiAgICBpZiAodGhpcy5pc0phdmFzY3JpcHREYXRlKSB7XG4gICAgICB0aGlzLnggPSBkMy50aW1lLnNjYWxlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMueCA9IGQzLnNjYWxlLmxpbmVhcigpO1xuICAgIH1cbiAgICB0aGlzLnhBeGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh0aGlzLngpO1xuICAgIHRoaXMueC5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKTtcbiAgICB0aGlzLnN2Z0F4aXMgPSB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91cihcInpvbW1PblNjcm9sbFwiLCB0aGlzLmVsZW1lbnQsIHt0aW1lV2luZG93OiB0aGlzLndpbmRvd30pO1xuICB9LFxuXG4gIGRyYXc6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMueC5yYW5nZShbMCwgdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoXSk7XG4gICAgdGhpcy54LmRvbWFpbihbdGhpcy53aW5kb3cuc3RhcnQsIHRoaXMud2luZG93LmVuZF0pO1xuICAgIHRoaXMuc3ZnQXhpcy5jYWxsKHRoaXMueEF4aXMpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3dTY2FsZTtcbiIsInZhciBXaWRnZXQgPSByZXF1aXJlKFwiLi9XaWRnZXQuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG52YXIgZDMgPSByZXF1aXJlKFwiZDNcIik7XG5cbnZhciBXaW5kb3dTY2FsZUZpeCA9IGZ1bmN0aW9uKGh0bWxfaWQsIHRpbWVfd2luZG93LCBpc19qYXZhc2NyaXB0X2RhdGUpIHtcbiAgLy8gV2lkZ2V0QmFzaWNUaW1lRm9ybSBpcyBhIFdpZGdldFxuICBXaWRnZXQuY2FsbCh0aGlzLCBodG1sX2lkKTtcbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1XaW5kb3dTY2FsZScpO1xuICAkKHdpbmRvdykucmVzaXplKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy53aW5kb3cgPSB0aW1lX3dpbmRvdztcbiAgLy8gdHJ5aW5nIHRvIGd1ZXNzIGlmIHRpbWVfd2luZG93IGlzIHJlbGF0ZWQgdG8gYSBEYXRlKCkgb2JqZWN0XG4gIGlmICh0aGlzLndpbmRvdy5zdGFydCA+IDEwMDAwMDAwMDApIHsgLy8gMW9eOSA+IDExIEphbiAxOTcwIGlmIGEgRGF0ZSBvYmplY3RcbiAgICB0aGlzLmlzX2phdmFzY3JpcHRfZGF0ZSA9IGlzX2phdmFzY3JpcHRfZGF0ZSB8fCB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuaXNfamF2YXNjcmlwdF9kYXRlID0gaXNfamF2YXNjcmlwdF9kYXRlIHx8IGZhbHNlO1xuICB9XG4gIHRoaXMud2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgLy8gdXBkYXRlIHNsaWRlcidzIHBvc2l0aW9uXG4gIHRoaXMuZHJhdygpO1xuXHRcdH07XG5cbldpbmRvd1NjYWxlRml4LnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuICAgIC8vIGNyZWF0ZSB0aGUgc2xpZGVyXG4gICAgLy90aGlzLnN2ZyA9IGQzLnNlbGVjdChcIiNcIit0aGlzLmlkKS5hcHBlbmQoXCJzdmdcIik7XG4gICAgdGhpcy5zdmcgPSBkMy5zZWxlY3QodGhpcy5lbGVtZW50KS5hcHBlbmQoXCJzdmdcIik7XG4gICAgaWYgKHRoaXMuaXNfamF2YXNjcmlwdF9kYXRlKSB7XG4gICAgICB0aGlzLnggPSBkMy50aW1lLnNjYWxlKCk7IC8vLnJhbmdlKFswLHRoaXMuZWxlbWVudC5nZXRTaXplKCkueF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnggPSBkMy5zY2FsZS5saW5lYXIoKTtcbiAgICB9XG4gICAgLy90aGlzLnhBeGlzID0gZDMuc3ZnLmF4aXMoKS5zY2FsZSh0aGlzLngpOyAvLy5vcmllbnQoXCJib3R0b21cIik7XG4gICAgdGhpcy54QXhpcyA9IGQzLnN2Zy5heGlzKCkuc2NhbGUodGhpcy54KTtcbiAgICAvLy50aWNrcyhkMy50aW1lLmRheXMpO1xuICAgIHRoaXMueC5kb21haW4oW3RoaXMud2luZG93LnN0YXJ0LCB0aGlzLndpbmRvdy5lbmRdKTtcbiAgICB0aGlzLnN2Z0F4aXMgPSB0aGlzLnN2Zy5hcHBlbmQoXCJnXCIpO1xuXG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy54LnJhbmdlKFswLCB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGhdKTsvLyA9IGQzLnRpbWUuc2NhbGUoKS5yYW5nZShbMCx0aGlzLmVsZW1lbnQuZ2V0U2l6ZSgpLnhdKTtcbiAgICB0aGlzLnguZG9tYWluKFt0aGlzLndpbmRvdy5zdGFydCwgdGhpcy53aW5kb3cuZW5kXSk7XG4gICAgdGhpcy5zdmdBeGlzLmNhbGwodGhpcy54QXhpcyk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdpbmRvd1NjYWxlRml4O1xuIiwidmFyIFdpZGdldCA9IHJlcXVpcmUoXCIuL1dpZGdldC5qc1wiKTtcbnZhciAkID0gcmVxdWlyZShcImpxdWVyeVwiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgd2luZG93IHNsaWRlci5cbiAqIEBjbGFzcyBXaWRnZXQgZm9yIHZpc3VhbGlzaW5nIGEgd2luZG93IHNsaWRlci5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBtaXhlcyBTYW1vdHJhY2VzLlVJLldpZGdldHMuV2lkZ2V0XG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuVUkuV2lkZ2V0cy5kM0Jhc2ljLldpbmRvd1NsaWRlciBpcyBhIGdlbmVyaWNcbiAqIFdpZGdldCB0byB2aXN1YWxpc2UgYSB0ZW1wb3JhbCB3aW5kb3dcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdGRpdklkXG4gKiAgICAgSWQgb2YgdGhlIERJViBlbGVtZW50IHdoZXJlIHRoZSB3aWRnZXQgd2lsbCBiZVxuICogICAgIGluc3RhbnRpYXRlZFxuICogQHBhcmFtIHdpZGVfd2luZG93XG4gKiAgICAgVGltZVdpbmRvdyBvYmplY3QgLT4gcmVwcmVzZW50aW5nIHRoZSB3aWRlIHdpbmRvd1xuICogICAgIChlLmcuLCB0aGUgd2hvbGUgdHJhY2UpXG4gKiBAcGFyYW0gc2xpZGVyX3dpbmRvd1xuICogICAgIFRpbWVXaW5kb3cgb2JqZWN0IC0+IHJlcHJlc2VudGluZyB0aGUgc21hbGwgd2luZG93XG4gKiAgICAgKGUuZy4sIHRoZSBjdXJyZW50IHRpbWUgd2luZG93IGJlaW5nIHZpc3VhbGlzZWQgd2l0aCBhbm90aGVyIHdpZGdldClcbiAqL1xudmFyIFdpbmRvd1NsaWRlciA9IGZ1bmN0aW9uKGh0bWxfaWQsIHdpZGVfd2luZG93LCBzbGlkZXJfd2luZG93KSB7XG4gIC8vIFdpZGdldEJhc2ljVGltZUZvcm0gaXMgYSBXaWRnZXRcbiAgV2lkZ2V0LmNhbGwodGhpcywgaHRtbF9pZCk7XG5cbiAgdGhpcy5hZGRfY2xhc3MoJ1dpZGdldC1XaW5kb3dTbGlkZXInKTtcbiAgJCh3aW5kb3cpLnJlc2l6ZSh0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG5cbiAgdGhpcy53aWRlX3dpbmRvdyA9IHdpZGVfd2luZG93O1xuICB0aGlzLndpZGVfd2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMud2lkZV93aW5kb3cub24oJ3R3OnRyYW5zbGF0ZScsIHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgdGhpcy5zbGlkZXJfd2luZG93ID0gc2xpZGVyX3dpbmRvdztcbiAgdGhpcy5zbGlkZXJfd2luZG93Lm9uKCd0dzp1cGRhdGUnLCB0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gIHRoaXMuc2xpZGVyX3dpbmRvdy5vbigndHc6dHJhbnNsYXRlJywgdGhpcy5kcmF3LmJpbmQodGhpcykpO1xuXG4gIHRoaXMuc2xpZGVyX29mZnNldCA9IDA7XG4gIHRoaXMud2lkdGggPSAwO1xuXG4gIHRoaXMuaW5pdF9ET00oKTtcbiAgLy8gdXBkYXRlIHNsaWRlcidzIHBvc2l0aW9uXG4gIHRoaXMuZHJhdygpO1xufTtcblxuV2luZG93U2xpZGVyLnByb3RvdHlwZSA9IHtcbiAgaW5pdF9ET006IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gY3JlYXRlIHRoZSBzbGlkZXJcbiAgICB0aGlzLnNsaWRlcl9lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuc2xpZGVyX2VsZW1lbnQpO1xuXG4gICAgLy8gaGFuZCBtYWRlIGRyYWcmZHJvcFxuICAgIC8vIGV2ZW50IGxpc3RlbmVyc1xuICAgIHZhciB3aWRnZXQgPSB0aGlzO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91cignY2hhbmdlVGltZU9uRHJhZycsIHRoaXMuc2xpZGVyX2VsZW1lbnQsIHtcbiAgICAgIG9uVXBDYWxsYmFjazogZnVuY3Rpb24oZGVsdGFfeCkge1xuICAgICAgICB2YXIgdGltZV9kZWx0YSA9IGRlbHRhX3ggKiB3aWRnZXQud2lkZV93aW5kb3cuZ2V0X3dpZHRoKCkgLyB3aWRnZXQuZWxlbWVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgd2lkZ2V0LnNsaWRlcl93aW5kb3cudHJhbnNsYXRlKHRpbWVfZGVsdGEpO1xuICAgICAgfSxcbiAgICAgIG9uTW92ZUNhbGxiYWNrOiBmdW5jdGlvbihvZmZzZXQpIHtcbiAgICAgICAgd2lkZ2V0LnNsaWRlcl9lbGVtZW50LnN0eWxlLmxlZnQgPSB3aWRnZXQuc2xpZGVyX29mZnNldCArIG9mZnNldCArICdweCc7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuYWRkX2JlaGF2aW91cignem9tbU9uU2Nyb2xsJywgdGhpcy5lbGVtZW50LCB7dGltZVdpbmRvdzogdGhpcy5zbGlkZXJfd2luZG93fSk7XG4gIH0sXG5cbiAgZHJhdzogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy53aWR0aCA9IHRoaXMuc2xpZGVyX3dpbmRvdy5nZXRfd2lkdGgoKSAvIHRoaXMud2lkZV93aW5kb3cuZ2V0X3dpZHRoKCkgKiB0aGlzLmVsZW1lbnQuY2xpZW50V2lkdGg7XG4gICAgdGhpcy5zbGlkZXJfb2Zmc2V0ID0gKHRoaXMuc2xpZGVyX3dpbmRvdy5zdGFydCAtIHRoaXMud2lkZV93aW5kb3cuc3RhcnQpICogdGhpcy5lbGVtZW50LmNsaWVudFdpZHRoIC8gdGhpcy53aWRlX3dpbmRvdy5nZXRfd2lkdGgoKTtcbiAgICB0aGlzLnNsaWRlcl9lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRoaXMuc2xpZGVyX2VsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLndpZHRoICsgJ3B4JztcbiAgICB0aGlzLnNsaWRlcl9lbGVtZW50LnN0eWxlLmxlZnQgPSB0aGlzLnNsaWRlcl9vZmZzZXQgKyAncHgnO1xuICB9LFxuXG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gV2luZG93U2xpZGVyO1xuIiwiLyoqXG4gKiBAbWl4aW5cbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIEV2ZW50SGFuZGxlciBPYmplY3QgaXMgbm90IGEgY2xhc3MuIEhvd2V2ZXIsIGl0IGlzXG4gKiBkZXNpZ25lZCBmb3Igb3RoZXIgY2xhc3NlcyB0byBpbmhlcml0IG9mIGEgcHJlZGVmaW5lZFxuICogT2JzZXJ2YWJsZSBiZWhhdmlvdXIuIEZvciB0aGlzIHJlYXNvbiwgdGhpcyBmdW5jdGlvbiBpc1xuICogZG9jdW1lbnRlZCBhcyBhIENsYXNzLlxuICpcbiAqIEluIG9yZGVyIHRvIHVzZSBjcmVhdGUgYSBjbGFzcyB0aGF0IFwiaW5oZXJpdHNcIiBmcm9tIHRoZVxuICogXCJFdmVudEhhbmRsZXIgY2xhc3NcIiwgb25lIG11c3QgcnVuIHRoZSBmb2xsb3dpbmcgY29kZSBpblxuICogdGhlIGNvbnN0cnVjdG9yOlxuICogPGNvZGU+XG4gKiBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICogPC9jb2RlPlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjYWxsYmFja3NcbiAqICAgICBIYXNoIG1hdGNoaW5nIGNhbGxiYWNrcyB0byBldmVudF90eXBlcy5cbiAqL1xudmFyIEV2ZW50SGFuZGxlciA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gIFx0ICogVHJpZ2dlcnMgYWxsIHRoZSByZWdpc3RyZWQgY2FsbGJhY2tzLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5wcm90b3R5cGVcbiAgXHQgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRfdHlwZVxuICBcdCAqICAgICBUaGUgdHlwZSBvZiB0aGUgdHJpZ2dlcmVkIGV2ZW50LlxuICBcdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgXHQgKiAgICAgT2JqZWN0IHNlbnQgd2l0aCB0aGUgbWVzc2FnZSB0byB0aGUgbGlzdGVuZXJzIChzZWVcbiAgXHQgKiAgICAge0BsaW5rIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyI29ufSkuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHRyaWdnZXIoZXZlbnRfdHlwZSwgb2JqZWN0KSB7XG4gICAgdmFyIGUgPSB7IHR5cGU6IGV2ZW50X3R5cGUsIGRhdGE6IG9iamVjdCB9O1xuICAgIGlmICh0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXSkge1xuICAgICAgdGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0ubWFwKGZ1bmN0aW9uKGYpIHsgZihlKTsgfSk7XG4gICAgfVxuICAgIC8qXG4gICAgXHRcdHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBcdFx0XHRjYWxsYmFjayhlKTtcbiAgICBcdFx0fSk7XG4gICAgXHRcdCovXG4gIH1cbiAgLyoqXG4gIFx0ICogQWRkcyBhIGNhbGxiYWNrIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLnByb3RvdHlwZVxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudF90eXBlXG4gIFx0ICogICAgIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBsaXN0ZW4gdG8uXG4gIFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgXHQgKiAgICAgQ2FsbGJhY2sgdG8gY2FsbCB3aGVuIHRoZSBhbiBldmVudCBvZiB0eXBlXG4gIFx0ICogICAgIGV2ZW50X3R5cGUgaXMgdHJpZ2dlcmVkLiBOb3RlOiB0aGUgY2FsbGJhY2tcbiAgXHQgKiAgICAgY2FuIHJlY2VpdmUgb25lIGFyZ3VtZW50IHRoYXQgY29udGFpbnNcbiAgXHQgKiAgICAgZGV0YWlscyBhYm91dCB0aGUgdHJpZ2dlcmVkIGV2ZW50LlxuICBcdCAqICAgICBUaGlzIGV2ZW50IGFyZ3VtZW50IGNvbnRhaW5zIHR3byBmaWVsZHM6XG4gIFx0ICogICAgIGV2ZW50LnR5cGU6IHRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgaXMgdHJpZ2dlcmVkXG4gIFx0ICogICAgIGV2ZW50LmRhdGE6IG9wdGlvbmFsIGRhdGEgdGhhdCBpcyB0cmFuc21pdHRlZCB3aXRoIHRoZSBldmVudFxuICBcdCAqL1xuICBmdW5jdGlvbiBvbihldmVudF90eXBlLCBjYWxsYmFjaykge1xuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGNhbGxiYWNrKSAhPT0gJ1tvYmplY3QgRnVuY3Rpb25dJykge1xuICAgICAgY29uc29sZS5sb2coY2FsbGJhY2spO1xuICAgICAgdGhyb3cgXCJDYWxsYmFjayBmb3IgZXZlbnQgXCIgKyBldmVudF90eXBlICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIjtcbiAgICB9XG4gICAgdGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0gPSB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXSB8fCBbXTtcbiAgICB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihldmVudHMpIHtcbiAgICAvLyBET0NVTUVOVEVEIEFCT1ZFXG4gICAgdGhpcy5jYWxsYmFja3MgPSB0aGlzLmNhbGxiYWNrcyB8fCB7fTtcbiAgICB0aGlzLnRyaWdnZXIgPSB0cmlnZ2VyO1xuICAgIHRoaXMub24gPSBvbjtcbiAgICAvKipcbiAgICBcdFx0ICogRXZlbnRDb25maWcgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuICAgIFx0XHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIuRXZlbnRDb25maWd9XG4gICAgXHRcdCAqIG9iamVjdC5cbiAgICBcdFx0ICogQHR5cGVkZWYgRXZlbnRDb25maWdcbiAgICBcdFx0ICogQHNlZSBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ1xuICAgIFx0XHQgKi9cbiAgICAvKipcbiAgICBcdFx0ICogVGhlIEV2ZW50Q29uZmlnIG9iamVjdCBpcyB1c2VkIGZvciBjb25maWd1cmF0aW5nIHRoZVxuICAgIFx0XHQgKiBmdW5jdGlvbnMgdG8gY2FsbCBldmVudHMgYXJlIHRyaWdnZXJlZCBieSBhbiBFdmVudEhhbmRsZXIgT2JqZWN0LlxuICAgIFx0XHQgKiBFYWNoIGF0dHJpYnV0ZSBuYW1lIG9mIHRoZSBFdmVudENvbmZpZyBjb3JyZXNwb25kc1xuICAgIFx0XHQgKiB0byBhIHR5cGUgb2YgZXZlbnQgbGlzdGVuZWQgdG8sIGFuZCBlYWNoXG4gICAgXHRcdCAqIHZhbHVlIGlzIHRoZSBmdW5jdGlvbiB0byB0cmlnZ2VyIG9uIHRoaXMgZXZlbnQuXG4gICAgXHRcdCAqIEB0eXBlZGVmIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnXG4gICAgXHRcdCAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+fVxuICAgIFx0XHQgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBldmVudE5hbWUgLSBGdW5jdGlvbiB0byB0cmlnZ2VyIG9uIHRoaXMgZXZlbnQuXG4gICAgXHRcdCAqL1xuICAgIGZ1bmN0aW9uIGNhbGxiYWNrKGUpIHsgZnVuKGUuZGF0YSk7IH1cbiAgICBmb3IgKHZhciBldmVudF9uYW1lIGluIGV2ZW50cykge1xuICAgICAgXHRcdGlmIChldmVudC5oYXNPd25Qcm9wZXJ0eShldmVudF9uYW1lKSkge1xuICAgICAgICBcdFx0dmFyIGZ1biA9IGV2ZW50c1tldmVudF9uYW1lXTtcbiAgICAgICAgXHRcdHRoaXMub24oZXZlbnRfbmFtZSwgY2FsbGJhY2spO1xuICAgICAgXHRcdH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50SGFuZGxlcjtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBKYXZhc2NyaXB0IEtUQlMuQmFzZSBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuS1RCUy5CYXNlIGlzIGEgSmF2YXNjcmlwdCBLVEJTIGJhc2VcbiAqIG9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUy4gVGhpcyBPYmplY3QgaW1wbGVtZW50cyB0aGUgS1RCUyBBUEkuXG4gKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0IHRoZVxuICogbGlzdCBvZiB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBLVEJTIGJhc2UuIEFjY2VzcyBhXG4gKiBzcGVjaWZpYyB0cmFjZSwgZXRjLlxuICpcbiAqIEB0b2RvIEZ1bGx5IGltcGxlbWVudCBLVEJTIEFQSVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfVx0dXJpXHRVUkkgb2YgdGhlIEJhc2UgdG8gbG9hZC5cbiAqIEBwYXJhbSB7U3RyaW5nfVx0W2lkXVx0SUQgb2YgdGhlIEJhc2UgdG8gbG9hZC5cbiAqL1xudmFyIEJhc2UgPSBmdW5jdGlvbiBCYXNlKHVyaSwgaWQpIHtcbiAgLy8gS1RCUy5CYXNlIGlzIGEgUmVzb3VyY2VcbiAgaWYgKGlkID09PSB1bmRlZmluZWQpIHsgaWQgPSB1cmk7IH1cbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgaWQsIHVyaSwgJ0Jhc2UnLCBcIlwiKTtcbiAgdGhpcy50cmFjZXMgPSBbXTtcbiAgdGhpcy5tb2RlbHMgPSBbXTtcbiAgdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG59O1xuXG5CYXNlLnByb3RvdHlwZSA9IHtcbiAgZ2V0OiBmdW5jdGlvbihpZCkge30sXG4gIC8qKlxuICBcdCAqIEdldHMgdGhlIGxpc3Qgb2YgdHJhY2VzIGF2YWlsYWJsZSBpbiB0aGUgYmFzZS5cbiAgXHQgKiBAcmV0dXJucyB7QXJyYXkuPFN0cmluZz59IEFycmF5IG9mIHRoZSBJRCBvZiB0aGUgdHJhY2VzIGF2YWlsYWJsZSBpbiB0aGUgQmFzZS5cbiAgXHQgKi9cbiAgbGlzdF90cmFjZXM6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnRyYWNlcztcbiAgfSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBsaXN0X21vZGVsczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubW9kZWxzO1xuICB9LFxuICAvKipcbiAgXHQgKiBDcmVhdGUgYSBzdG9yZWQgdHJhY2UgaW4gdGhlIEtUQlNcbiAgXHQgKiBAcGFyYW0gaWQge1N0cmluZ30gSUQgb2YgdGhlIGNyZWF0ZWQgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW21vZGVsXSB7TW9kZWx9IE1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbb3JpZ2luXSB7T3JpZ2lufSBPcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtkZWZhdWx0X3N1YmplY3RdIHtTdHJpbmd9IERlZmF1bHQgc3ViamVjdCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW2xhYmVsXSB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKi9cbiAgY3JlYXRlX3N0b3JlZF90cmFjZTogZnVuY3Rpb24oaWQsIG1vZGVsLCBvcmlnaW4sIGRlZmF1bHRfc3ViamVjdCwgbGFiZWwpIHtcbiAgICB2YXIgbmV3X3RyYWNlID0ge1xuICAgICAgXCJAY29udGV4dFwiOlx0XCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgIFwiQHR5cGVcIjpcdFwiU3RvcmVkVHJhY2VcIixcbiAgICAgIFwiQGlkXCI6XHRcdGlkICsgXCIvXCJcbiAgICB9O1xuICAgIG5ld190cmFjZS5oYXNNb2RlbCA9IChtb2RlbCA9PT0gdW5kZWZpbmVkICB8fCBtb2RlbCA9PT0gIG51bGwpP1wiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9zaW1wbGUtdHJhY2UtbW9kZWxcIjptb2RlbDtcbiAgICBuZXdfdHJhY2Uub3JpZ2luID0gKG9yaWdpbiA9PT0gdW5kZWZpbmVkIHx8IG9yaWdpbiA9PT0gIG51bGwgKT9cIjE5NzAtMDEtMDFUMDA6MDA6MDBaXCI6b3JpZ2luO1xuICAgIC8vXHRcdFx0aWYob3JpZ2luPT11bmRlZmluZWQpIG5ld190cmFjZS5vcmlnaW4gPSBvcmlnaW47XG4gICAgaWYgKGRlZmF1bHRfc3ViamVjdCA9PT0gdW5kZWZpbmVkKSBuZXdfdHJhY2UuZGVmYXVsdF9zdWJqZWN0ID0gZGVmYXVsdF9zdWJqZWN0O1xuICAgIGlmIChsYWJlbCA9PT0gdW5kZWZpbmVkKSBuZXdfdHJhY2UubGFiZWwgPSBsYWJlbDtcbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShuZXdfdHJhY2UpLFxuICAgICAgc3VjY2VzczogdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoLmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oanFYSFIsIHRleHRTdGF0dXMsIGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdxdWVyeSBlcnJvcicpO1xuICAgICAgICBjb25zb2xlLmxvZyhbanFYSFIsIHRleHRTdGF0dXMsIGVycm9yXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gIFx0ICogQ3JlYXRlIGEgc3RvcmVkIHRyYWNlIGluIHRoZSBLVEJTXG4gIFx0ICogQHBhcmFtIGlkIHtTdHJpbmd9IElEIG9mIHRoZSBjcmVhdGVkIHRyYWNlXG4gIFx0ICogQHBhcmFtIFttb2RlbF0ge01vZGVsfSBNb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW29yaWdpbl0ge09yaWdpbn0gT3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbZGVmYXVsdF9zdWJqZWN0XSB7U3RyaW5nfSBEZWZhdWx0IHN1YmplY3Qgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtsYWJlbF0ge1N0cmluZ30gTGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICovXG4gIGNyZWF0ZV9tb2RlbDogZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBkb2MgPSB7XG4gICAgICAnQGNvbnRleHQnOiAnaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9rdGJzLWpzb25sZC1jb250ZXh0JyxcbiAgICAgICdAZ3JhcGgnOiBbe1xuICAgICAgICAnQGlkJzogaWQsXG4gICAgICAgICdAdHlwZSc6ICdUcmFjZU1vZGVsJyxcbiAgICAgICAgJ2luQmFzZSc6ICcuLycsXG4gICAgICAgICdoYXNVbml0JzogJ21pbGxpc2Vjb25kJ1xuICAgICAgfV1cbiAgICB9O1xuICAgIHZhciBuZXdfbW9kZWxfZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRvYyk7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy51cmksXG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgZGF0YTogbmV3X21vZGVsX2RhdGEsXG4gICAgICBzdWNjZXNzOiB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3F1ZXJ5IGVycm9yJyk7XG4gICAgICAgIGNvbnNvbGUubG9nKFtqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcblxuXG5cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBjcmVhdGVfY29tcHV0ZWRfdHJhY2U6IGZ1bmN0aW9uKGlkLCBtZXRob2QsIHBhcmFtZXRlcnMsIHNvdXJjZXMsIGxhYmVsKSB7fSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICAvL2NyZWF0ZV9tb2RlbDogZnVuY3Rpb24oaWQsIHBhcmVudHMsIGxhYmVsKSB7fSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBjcmVhdGVfbWV0aG9kOiBmdW5jdGlvbihpZCwgcGFyZW50LCBwYXJhbWV0ZXJzLCBsYWJlbCkge30sXG4gIC8vLy8vLy8vLy8vXG4gIC8qKlxuICBcdCAqIE92ZXJsb2FkcyB0aGUge0BsaW5rIFNhbW90cmFjZXMuS1RCUy5SZXNvdWNlI19vbl9zdGF0ZV9yZWZyZXNoX30gbWV0aG9kLlxuICBcdCAqIEBwcml2YXRlXG4gIFx0ICovXG4gIF9vbl9zdGF0ZV9yZWZyZXNoXzogZnVuY3Rpb24oZGF0YSkge1xuICAgIC8vXHRjb25zb2xlLmxvZyhkYXRhKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdsYWJlbCcsIGRhdGFbXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWxcIl0sICdiYXNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ3RyYWNlcycsIGRhdGEuY29udGFpbnMsICdiYXNlOnVwZGF0ZScpO1xuICB9LFxuICAvLy8vLy8vLy8vLyBBRERFRCAvIEFQSVxuICAvKipcbiAgXHQgKiBHZXRzIGEgdHJhY2UgZnJvbSBpdHMgSURcbiAgXHQgKiBAcGFyYW0gaWQge1N0cmluZ30gSUQgb2YgdGhlIHRyYWNlIHRvIGdldC5cbiAgXHQgKiBAcmV0dXJuIHtTYW1vdHJhY2VzLktUQlMuVHJhY2V9IFRoZSByZXRyaWV2ZWQgVHJhY2UuXG4gIFx0ICovXG4gIGdldF90cmFjZTogZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gbmV3IFNhbW90cmFjZXMuS1RCUy5UcmFjZSh0aGlzLnVyaSArIGlkICsgJy8nLCBpZCk7XG4gIH0sXG4gIC8vLy8vLy8vLy8vL1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFRyYWNlIG9iamVjdCB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIEtUQlMuXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBNb2RlbCBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgTW9kZWwuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVybiAvIERFUkJFTCBGYXRtYVxuICogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuS1RCUy5Nb2RlbGlzIGEgSmF2YXNjcmlwdCBUcmFjZSBvYmplY3RcbiAqIHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIE1vZGVsLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXRcbiAqIHRoZSBMaXN0ZSBvZiB0eXBlIG9mIE9ic2VscyBmcm9tIHRoZSBLVEJTIE1vZGVsLCAuXG4gKlxuICpcbiAqXG4gKiBAdG9kbyBGdWxseSBpbXBsZW1lbnQgS1RCUyBBUElcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKiBAcGFyYW0ge1N0cmluZ31cdFtpZF1cdElEIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKi9cblxuXG52YXIgTW9kZWwgPSBmdW5jdGlvbih1cmksIGlkKSB7XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7IGlkID0gdXJpOyB9XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBpZCwgdXJpLCAnTW9kZWwnLCBcIlwiKTtcbiAgdGhpcy5saXN0X1R5cGVzX09ic2xlcyA9IFtdXG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xuXG59O1xuXG5Nb2RlbC5wcm90b3R5cGUgPSB7XG5cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGV0YWcgPSB0aGlzLmdldF9ldGFnKCk7XG4gICAgdGhpcy50cmlnZ2VyKCdNb2RlbDpnZXQnKTtcbiAgICB0aGlzLmxpc3RfVHlwZXNfT2JzbGVzID0gdGhpcy5saXN0X29ic2VscyhkYXRhW1wiQGdyYXBoXCJdKTtcbiAgfSxcbiAgbGlzdF9vYnNlbHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBMaXN0ZU9ic2VsVHlwZSA9IFtdO1xuICAgIHZhciBNID0gdGhpcztcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWwsIGtleSkge1xuICAgICAgdmFyIG9icyA9IHthdHRyaWJ1dGVzOiBbXX07XG4gICAgICBpZiAoZWxbXCJAdHlwZVwiXSA9PSBcIk9ic2VsVHlwZVwiKSAgICAgIHtcbiAgICAgICAgb2JzLmlkID0gZWxbXCJAaWRcIl07XG4gICAgICAgIG9icy50eXBlID0gZWxbXCJAaWRcIl0uc3Vic3RyKDEpO1xuICAgICAgICBvYnMuY29jaGUgPSBmYWxzZTtcbiAgICAgICAgLy9vYnNba2V5XSA9IGVsW2tleV1cbiAgICAgICAgaWYgKGVsWydoYXNTdXBlck9ic2VsVHlwZSddKSAgICAgICAge1xuICAgICAgICAgIG9icy5oYXNTdXBlck9ic2VsVHlwZSA9IGVsWydoYXNTdXBlck9ic2VsVHlwZSddXG4gICAgICAgIH1cbiAgICAgICAgTGlzdGVPYnNlbFR5cGUucHVzaChvYnMpO1xuICAgICAgICAvL00udHJpZ2dlcignTW9kZWw6RHJhd19vYnNlbCcsIG9icyk7XG4gICAgICAgIC8vY29uc29sZS5sb2cgKCd0cmlnZXInKVxuICAgICAgfSAgICAgIGVsc2UgaWYgKGVsW1wiQHR5cGVcIl0gPT0gXCJBdHRyaWJ1dGVUeXBlXCIpICAgICAge1xuICAgICAgICBvYnMgPSBNLkdldE9ic2VsVHlwZShlbFtcImhhc0F0dHJpYnV0ZU9ic2VsVHlwZVwiXSwgTGlzdGVPYnNlbFR5cGUpO1xuICAgICAgICBlbFsnY29jaGUnXSA9IGZhbHNlO1xuICAgICAgICBvYnMuYXR0cmlidXRlcy5wdXNoKGVsKTtcblxuICAgICAgfVxuXG4gICAgfSk7XG4gICAgTGlzdGVPYnNlbFR5cGUuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5oYXNTdXBlck9ic2VsVHlwZSkgICAgICB7XG5cbiAgICAgICAgby5hdHRyaWJ1dGVzID0gTS5nZXRBdHRyaWJ1dGVzIChvLmhhc1N1cGVyT2JzZWxUeXBlWzBdKVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIE0udHJpZ2dlcignTW9kZWw6bGlzdGVUeXBlJywgTGlzdGVPYnNlbFR5cGUpO1xuICAgIHJldHVybiBMaXN0ZU9ic2VsVHlwZTtcblxuICB9LFxuXG4gIEdldE9ic2VsVHlwZTogZnVuY3Rpb24oaWQsIExpc3RlT2JzZWxUeXBlKSAge1xuICAgIHZhciBvYnMgPSBbXTtcbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG9bXCJpZFwiXSA9PSBpZCkgICAgICB7XG5cbiAgICAgICAgb2JzUiA9IG87XG5cbiAgICAgIH1cblxuICAgIH1cbiAgICApXG4gICAgcmV0dXJuIG9ic1I7XG4gIH0sXG5cbiAgZ2V0QXR0cmlidXRlczogZnVuY3Rpb24oaWRlbnQpICB7XG5cbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG8uaWQgPT09IGlkZW50KSAgIHtcbiAgICAgICAgQXR0ID0gby5hdHRyaWJ1dGVzXG4gICAgICB9XG5cbiAgICB9XG4gICAgKVxuICAgIHJldHVybiBBdHQ7XG4gIH0sXG5cbiAgcHV0X21vZGVsOiBmdW5jdGlvbihtb2RlbGRhdGEpIHtcbiAgICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdGhhdC5vbiAoJ01vZGVsOmdldCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgdmFyIGV0YWcgPSB0aGF0LmV0YWc7XG5cbiAgICAvLyBQVVRcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BVVCcsIHRoYXQuaWQsIHRydWUpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdJZi1NYXRjaCcsIGV0YWcpO1xuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgaWYoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ09LT0tPSycpO1xuICAgICAgICAgIHJlc29sdmUobmV3IFNhbW90cmFjZXMuS3Ricy5Nb2RlbCh0aGF0LmlkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHhocik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QoRXJyb3IoJ1RoZXJlIHdhcyBhIG5ldHdvcmsgZXJyb3IuJykpO1xuICAgIH07XG4gICAgeGhyLnNlbmQobW9kZWxkYXRhKTtcblxuICB9KVxuICB9KTtcbn1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBPYnNlbCA9IHJlcXVpcmUoXCIuL09ic2VsLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBTYW1vdHJhY2VzLktUQlMuT2JzZWwgaXMgcGFydCBvZiB0aGUgU2Ftb3RyYWNlcy5LVEJTIGltcGxlbWVudGF0aW9uLlxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuT2JzZWxcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEB0b2RvIFRPRE8gdXBkYXRlIHNldF9tZXRob2RzXG4gKiAtPiBzeW5jIHdpdGggS1RCUyBpbnN0ZWFkIG9mIGxvY2FsIGNoYW5nZVxuICovXG52YXIgS1RCU09ic2VsID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgcGFyYW0uaWQsIHBhcmFtLnVyaSwgJ09ic2VsJywgcGFyYW0ubGFiZWwgfHwgXCJcIik7XG5cbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ3RyYWNlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0eXBlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2JlZ2luJyxcdERhdGUubm93KCkpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdlbmQnLFx0XHR0aGlzLmJlZ2luKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnYXR0cmlidXRlcycsXHR7fSk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdyZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2ludmVyc2VfcmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdzb3VyY2Vfb2JzZWxzJyxcdFx0W10pO1xufVxuXG5LVEJTT2JzZWwucHJvdG90eXBlID0gT2JzZWwucHJvdG90eXBlO1xuXG4vKlxuU2Ftb3RyYWNlcy5LVEJTLk9ic2VsLnByb3RvdHlwZS5nZXRfa3Ric19zdGF0dXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMua3Ric19zdGF0dXNcbn07XG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNPYnNlbDtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgUmVzb3VyY2UgT2JqZWN0cyB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIGtUQlNcbiAqIEBkZXNjcmlwdGlvbiBSZXNvdXJjZSBPYmplY3RzIGFyZSBLVEJTIG9iamVjdHMuIEFsbCByZXNvdXJjZXNcbiAqIGhhdmUgYW4gdXJpLCBhbiBpZCBhbmQgYW4gb3B0aW9uYWwgbGFiZWxcbiAqIEBjbGFzcyBSZXNvdXJjZSBPYmplY3RzIGhhdmUgYW4gdXJpLCBhbiBpZCBhbmQgYW4gb3B0aW9uYWwgbGFiZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBJZCBvZiB0aGUgUmVzb3VyY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJJIG9mIHRoZSBSZXNvdXJjZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBvZiB0aGUgUmVzb3VyY2UgKCdLVEJTJywnQmFzZScsXG4gKiAgICAgJ1RyYWNlJywnU3RvcmVkVHJhY2UnLCdDb21wdXRlZFRyYWNlJyBvciAnT2JzZWwnKVxuICogQHBhcmFtIHtsYWJlbH0gW2xhYmVsXSBMYWJlbCBvZiB0aGUgUmVzb3VyY2VcbiAqL1xudmFyIEtUQlNSZXNvdXJjZSA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgcmVzb3VyY2UgdHlwZSBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSB0eXBlICgnS1RCUycsJ0Jhc2UnLFxuICBcdCAqICAgICAnVHJhY2UnLCdTdG9yZWRUcmFjZScsJ0NvbXB1dGVkVHJhY2UnIG9yICdPYnNlbCcpLlxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfcmVzb3VyY2VfdHlwZSgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy50eXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZShiYXNlLCByZWxhdGl2ZSkge1xuICAgIHZhciBzdGFjayA9IGJhc2Uuc3BsaXQoXCIvXCIpLFxuICAgICAgICBwYXJ0cyA9IHJlbGF0aXZlLnNwbGl0KFwiL1wiKTtcbiAgICBzdGFjay5wb3AoKTsgLy8gcmVtb3ZlIGN1cnJlbnQgZmlsZSBuYW1lIChvciBlbXB0eSBzdHJpbmcpXG4gICAgICAgICAgICAgICAgIC8vIChvbWl0IGlmIFwiYmFzZVwiIGlzIHRoZSBjdXJyZW50IGZvbGRlciB3aXRob3V0IHRyYWlsaW5nIHNsYXNoKVxuICAgIGZvciAodmFyIGk9MDsgaTxwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocGFydHNbaV0gPT0gXCIuXCIpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKHBhcnRzW2ldID09IFwiLi5cIilcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFjay5wdXNoKHBhcnRzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YWNrLmpvaW4oXCIvXCIpO1xuICB9XG4gIC8vIFJFU09VUkNFIEFQSVxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBJRCBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSBJRC5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X2lkKCkgeyByZXR1cm4gdGhpcy5pZDsgfVxuICAgIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFVSSSBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSBVUkkuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF91cmkoKSB7IHJldHVybiB0aGlzLnVyaS5yZXBsYWNlKCcuLycsICcnKTsgfVxuICAvKipcbiAgICogQHN1bW1hcnkgUmV0dXJucyB0aGUgVVJJIG9mIHRoZSBSZXNvdXJjZS5cbiAgICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgICogQHJldHVybnMge1N0cmluZ30gUmVzb3VyY2UgVVJJLlxuICAgKi9cbmZ1bmN0aW9uIGdldF9ldGFnKCkgeyByZXR1cm4gdGhpcy5ldGFnOyB9XG4gICAgLyoqXG4gIFx0ICogQHN1bW1hcnkgRm9yY2VzIHRoZSBSZXNvdXJjZSB0byBzeW5jaHJvbmlzZSB3aXRoIHRoZSBLVEJTLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogRm9yY2VzIHRoZSBSZXNvdXJjZSB0byBzeW5jaHJvbmlzZSB3aXRoIHRoZSBLVEJTLlxuICBcdCAqIFRoaXMgbWV0aG9kIHRyaWdnZXJzIGEgQWpheCBxdWVyeSB0aGF0IHdpbGxcbiAgXHQgKiB0cmlnZ2VyIHRoZSBfb25fc3RhdGVfcmVmcmVzaF8gbWV0aG9kIG9mIHRoZSBSZXNvdXJjZVxuICBcdCAqIG9uIHN1Y2Nlc3MuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGZvcmNlX3N0YXRlX3JlZnJlc2goKSB7XG4gICAgdXJsID0gdGhpcy51cmk7XG4gICAgdmFyIHRyYyA9IHRoaXMgO1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgIHhockZpZWxkczoge1xuICAgICAgICB3aXRoQ3JlZGVudGlhbHM6IHRydWVcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24oWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuXG4gICAgICAgIGlmIChYSFIuc3RhdHVzID09ICc0MDEnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cgKFhIUi5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG4gICAgICAgICAgTGluayA9IFhIUi5nZXRSZXNwb25zZUhlYWRlcignTGluaycpO1xuICAgICAgICAgIEQgPSBMaW5rLnNwbGl0ICgnLCcpO1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBELmxlbmd0aDtpKyspICAgICAgICAgIHtcbiAgICAgICAgICAgIHZhciBTb3VzRCA9IERbaV0uc3BsaXQoJzsnKTtcbiAgICAgICAgICAgIGlmIChTb3VzRFsxXSA9PT0gXCIgcmVsPW9hdXRoX3Jlc291cmNlX3NlcnZlclwiKSAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbGluayA9IFNvdXNEWzBdLnN1YnN0cigxLCBTb3VzRFswXS5sZW5ndGggLSAyKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFNvdXNEWzFdID09PSBcIiByZWw9c3VjY2Vzc2Z1bF9sb2dpbl9yZWRpcmVjdFwiKSAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgVVJMU3VjY2VzcyA9IFNvdXNEWzBdLnN1YnN0cigyLCBTb3VzRFswXS5sZW5ndGggLSAzKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICB3aW4gPSB3aW5kb3cub3BlbiAobGluaykgO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEsIHRleHRTdGF0dXMsIHhocil7XG4gICAgICAgIHRyYy5ldGFnID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdFVGFnJyk7XG4gICAgICAgIHRyYy5fb25fc3RhdGVfcmVmcmVzaF8oZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIC8vdHJjLl9vbl9zdGF0ZV9yZWZyZXNoXy5iaW5kKHRyYyksXG4gICAgfSk7XG4gIH1cbiAgICAvKipcbiAgXHQgKiBAc3VtbWFyeSBGb3JjZXMgdGhlIFJlc291cmNlIHRvIHN5bmNocm9uaXNlXG4gIFx0ICogd2l0aCBhdCBhIGdpdmVuIHJlZnJlc2hpbmcgcmF0ZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2Ugd2l0aCB0aGUgS1RCU1xuICBcdCAqIGV2ZXJ5IHBlcmlvZCBzZWNvbmRzLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBwZXJpb2QgVGltZSBpbiBzZWNvbmRzIGJldHdlZW4gdHdvIHN5bmNocm9uaXNhdGlvbnMuXG4gIFx0ICovXG5cblxuICBmdW5jdGlvbiBzdGFydF9hdXRvX3JlZnJlc2gocGVyaW9kKSB7XG4gICAgdmFyIGEgPSB0aGlzLmF1dG9fcmVmcmVzaF9pZD90aGlzLnN0b3BfYXV0b19yZWZyZXNoKCk6bnVsbDtcbiAgICB0aGlzLmF1dG9fcmVmcmVzaF9pZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2guYmluZCh0aGlzKSwgcGVyaW9kICogMTAwMCk7XG4gIH1cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgU3RvcHMgdGhlIGF1dG9yZWZyZXNoIHN5bmNocm9uaXNhdGlvblxuICBcdCAqIG9mIHRoZSBSZXNvdXJjZS5cbiAgXHQgKiBAbWVtYmVyb2YgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlLnByb3RvdHlwZVxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFN0b3BzIHRoZSBhdXRvcmVmcmVzaCBzeW5jaHJvbmlzYXRpb24gb2ZcbiAgXHQgKiB0aGUgUmVzb3VyY2UuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHN0b3BfYXV0b19yZWZyZXNoKCkge1xuICAgIGlmICh0aGlzLmF1dG9fcmVmcmVzaF9pZCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5hdXRvX3JlZnJlc2hfaWQpO1xuICAgICAgZGVsZXRlKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICB9XG4gIH1cbiAgLy9cdFx0ZnVuY3Rpb24gX29uX3N0YXRlX3JlZnJlc2hfKGRhdGEpIHsgdGhpcy5kYXRhID0gZGF0YTsgY29uc29sZS5sb2coXCJoZXJlXCIpOyB9XG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X3JlYWRfb25seSgpIHt9XG4gIC8qKlxuICBcdCAqIEBzdW1tYXJ5IERlbGV0ZSB0aGUgcmVzb3VyY2UgZnJvbSB0aGUgS1RCU1xuICBcdCAqIEB0b2RvIElNUFJPVkUgVEhJUyBNRVRIT0QgU08gVEhBVCBQUk9QRVIgRVZFTlQgSVMgUkFJU0VEXG4gIFx0ICogICAgIFdIRU4gQSBSRVNPVVJDRSBJUyBERUxFVEVELlxuICBcdCAqL1xuICBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgZnVuY3Rpb24gcmVmcmVzaF9wYXJlbnQoKSB7XG4gICAgICAvL1RST1VWRVIgVU4gTU9ZRU4gTUFMSU4gREUgUkFGUkFJQ0hJUiBMQSBMSVNURSBERVMgQkFTRVMgRFUgS1RCUy4uLlxuICAgIH1cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnVyaSxcbiAgICAgIHR5cGU6ICdERUxFVEUnLFxuICAgICAgc3VjY2VzczogcmVmcmVzaF9wYXJlbnQuYmluZCh0aGlzKSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbihqcVhIUiwgdGV4dFN0YXR1cywgZXJyb3JUaHJvd24pIHtcbiAgICAgICAgdGhyb3cgXCJDYW5ub3QgZGVsZXRlIFwiICsgdGhpcy5nZXRfcmVzb3VyY2VfdHlwZSgpICsgXCIgXCIgKyB0aGlzLnVyaSArIFwiOiBcIiArIHRleHRTdGF0dXMgKyAnICcgKyBKU09OLnN0cmluZ2lmeShlcnJvclRocm93bik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgbGFiZWwgb2YgdGhlIFJlc291cmNlXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF9sYWJlbCgpIHsgcmV0dXJuIHRoaXMubGFiZWw7IH1cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBmdW5jdGlvbiBzZXRfbGFiZWwoKSB7fVxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHJlc2V0X2xhYmVsKCkge31cblxuICAvLyBBRERFRCBGVU5DVElPTlNcbiAgLyoqXG4gIFx0ICogTWV0aG9kIHVzZWQgdG8gY2hlY2sgaWYgdGhlIGRpc3RhbnQgdmFsdWUgaXMgZGlmZmVyZW50XG4gIFx0ICogZnJvbSB0aGUgY3VycmVudCBsb2NhbCB2YWx1ZSAoYW5kIHVwZGF0ZSB0aGUgbG9jYWwgdmFsdWVcbiAgXHQgKiBpZiB0aGVyZSBpcyBhIGRpZmZlcmVuY2UuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKiBAcGFyYW0gbG9jYWxfZmllbGQge1N0cmluZ30gTmFtZSBvZiB0aGUgZmllbGQgb2YgdGhlIHRoaXNcbiAgXHQgKiAgICAgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGluZm9ybWF0aW9uIHRvIGNoZWNrLlxuICBcdCAqIEBwYXJhbSBkaXN0YW50IHtWYWx1ZX0gVmFsdWUgb2YgdGhlIGRpc3RhbnQgaW5mb3JtYXRpb24uXG4gIFx0ICogQHBhcmFtIG1lc3NhZ2VfaWZfY2hhbmdlZCB7U3RyaW5nfSBNZXNzYWdlIHRvIHRyaWdnZXIgaWZcbiAgXHQgKiAgICAgdGhlIGluZm9ybWF0aW9uIGhhcyBiZWVuIHVwZGF0ZWQuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIF9jaGVja19jaGFuZ2VfKGxvY2FsX2ZpZWxkLCBkaXN0YW50LCBtZXNzYWdlX2lmX2NoYW5nZWQpIHtcbiAgICAvLyBUT0RPIGNoZWNrIGlmIHRoaXMgaXMgdGhlIHdhbnRlZCBiZWhhdmlvdXI6XG4gICAgLy8gSWYgZGlzdGFudCBpcyB1bmRlZmluZWQgLT4gd2hhdCB0byBkbz9cbiAgICBpZiAoZGlzdGFudCAhPT0gdW5kZWZpbmVkICYmIHRoaXNbbG9jYWxfZmllbGRdICE9PSBkaXN0YW50KSB7XG4gICAgICB0aGlzW2xvY2FsX2ZpZWxkXSA9IGRpc3RhbnQ7XG4gICAgICB0aGlzLnRyaWdnZXIobWVzc2FnZV9pZl9jaGFuZ2VkKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24oaWQsIHVyaSwgdHlwZSwgbGFiZWwpIHtcbiAgICAvLyBhIFJlc291cmNlIGlzIGFuIEV2ZW50SGFuZGxlclxuICAgIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgLy8gRE9DVU1FTlRFRCBBQk9WRVxuICAgIC8vIEFUVFJJQlVURVNcbiAgICB0aGlzLmlkID0gaWQ7XG4gICAgdGhpcy51cmkgPSB1cmk7XG4gICAgdGhpcy5sYWJlbCA9IGxhYmVsO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgLy8gQVBJIE1FVEhPRFNcbiAgICB0aGlzLmdldF9pZCA9IGdldF9pZDtcbiAgICB0aGlzLmdldF91cmkgPSBnZXRfdXJpO1xuICAgIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCA9IGZvcmNlX3N0YXRlX3JlZnJlc2g7XG4gICAgdGhpcy5nZXRfcmVhZF9vbmx5ID0gZ2V0X3JlYWRfb25seTtcbiAgICB0aGlzLnJlbW92ZSA9IHJlbW92ZTtcbiAgICB0aGlzLmdldF9sYWJlbCA9IGdldF9sYWJlbDtcbiAgICB0aGlzLnNldF9sYWJlbCA9IHNldF9sYWJlbDtcbiAgICB0aGlzLnJlc2V0X2xhYmVsID0gcmVzZXRfbGFiZWw7XG4gICAgdGhpcy5nZXRfZXRhZyA9IGdldF9ldGFnO1xuICAgIC8vIGhlbHBlclxuICAgIHRoaXMuZ2V0X3Jlc291cmNlX3R5cGUgPSBnZXRfcmVzb3VyY2VfdHlwZTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfID0gX2NoZWNrX2NoYW5nZV87XG4gICAgdGhpcy5zdGFydF9hdXRvX3JlZnJlc2ggPSBzdGFydF9hdXRvX3JlZnJlc2g7XG4gICAgdGhpcy5zdG9wX2F1dG9fcmVmcmVzaCA9IHN0b3BfYXV0b19yZWZyZXNoO1xuICAgIHRoaXMuZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZT1nZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufSkoKTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNSZXNvdXJjZTtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIEtUQlNPYnNlbCA9IHJlcXVpcmUoXCIuL0tUQlMuT2JzZWwuanNcIik7XG52YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgVHJhY2Ugb2JqZWN0IHRoYXQgaXMgc3luY2hyb25pc2VkIHRvIGEgS1RCUy5cbiAqIEBjbGFzcyBKYXZhc2NyaXB0IFRyYWNlIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUyB0cmFjZS5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5LVEJTLlRyYWNlIGlzIGEgSmF2YXNjcmlwdCBUcmFjZSBvYmplY3RcbiAqIHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIHRyYWNlLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXRcbiAqIHRoZSBPYnNlbHMgZnJvbSB0aGUgS1RCUyB0cmFjZSwgY3JlYXRlIG5ldyBPYnNlbHMsIGV0Yy5cbiAqXG4gKiBOb3RlOiB0aGlzIFRyYWNlIG9iamVjdCBkb2VzIG5vdCBpbXBsZW1lbnQgYWxsIHRoZSBtZXRob2RzXG4gKiBhdmFpbGFibGUgaW4gdGhlIEtUQlMgQVBJIHlldC5cbiAqIEZvciBpbnN0YW5jZSwgdGhpcyBjbGFzcyBkbyBub3Qgc3VwcG9ydCB0cmFuc2Zvcm1hdGlvbnMuXG4gKlxuICogQHRvZG8gRnVsbHkgaW1wbGVtZW50IEtUQlMgQVBJXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHR1cmlcdFVSSSBvZiB0aGUgS1RCUyB0cmFjZSB0byBsb2FkLlxuICogQHBhcmFtIHtTdHJpbmd9XHRbaWRdXHRJRCBvZiB0aGUgS1RCUyB0cmFjZSB0byBsb2FkLlxuICovXG52YXIgS1RCU1RyYWNlID0gZnVuY3Rpb24gVHJhY2UodXJpLCBpZCkge1xuICAvLyBLVEJTLlRyYWNlIGlzIGEgUmVzb3VyY2VcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7IGlkID0gdXJpOyB9XG4gIEtUQlNSZXNvdXJjZS5jYWxsKHRoaXMsIGlkLCB1cmksICdCYXNlJywgXCJcIik7XG5cbiAgdGhpcy50ZW1wID0ge307IC8vIGF0dHJpYnV0ZSB1c2VkIHRvIHN0b3JlIGFjdGlvbnMgbWFkZSBieSB0aGUgdXNlciBvbiB0aGUgdHJhY2Ugd2hpbGUgbm90IGtub3dpbmcgaWYgdGhleSBhcmUgYWxsb3dlZC4gZS5nLiwgY3JlYXRlX29ic2VsLCB3aGVuIHdlIGRvbid0IGtub3cgeWV0IGlmIHRoZSBUcmFjZSBpcyBhIFN0b3JlZFRyYWNlIGJlY2F1c2UgdGhlIEtUQlMgZGlkbid0IHJlcGx5IHlldC5cbiAgdGhpcy5kZWZhdWx0X3N1YmplY3QgPSBcIlwiO1xuICB0aGlzLm1vZGVsX3VyaSA9IFwiXCI7XG4gIHRoaXMub2JzZWxfbGlzdF91cmkgPSB1cmkgKyBcIkBvYnNlbHNcIjtcbiAgdGhpcy5iYXNlX3VyaSA9IFwiXCI7XG4gIHRoaXMub3JpZ2luID0gXCJcIjtcbiAgLy90aGlzLm9yaWdpbl9vZmZzZXQgPSAobmV3IERhdGUoMCkpLmdldE1pbGxpc2Vjb25kcygpO1xuICB0aGlzLm9ic2VsX2xpc3QgPSBbXTsgdGhpcy50cmFjZVNldCA9IFtdO1xuICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbn07XG5cbktUQlNUcmFjZS5wcm90b3R5cGUgPSB7XG4gIC8vLy8vLy8vLy8vIE9GRklDSUFMIEFQSVxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBHZXRzIHRoZSBiYXNlIHdoZXJlIHRoZSB0cmFjZSBpcyBzdG9yZWQuXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gVVJJIG9mIHRoZSBiYXNlIHdoZXJlIHRoZSB0cmFjZSBpcyBzdG9yZWQuXG4gIFx0ICovXG4gIGdldF9iYXNlOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5nZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlKHRoaXMuZ2V0X3VyaSgpLHRoaXMuYmFzZV91cmkpO1xuICB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBHZXRzIHRoZSBtb2RlbCBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHJldHVybnMge01vZGVsfSBNb2RlbCBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHRvZG8gREVGSU5FIFdIQVQgSVMgQSBNT0RFTFxuICBcdCAqL1xuICBnZXRfbW9kZWw6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZSh0aGlzLmdldF91cmkoKSx0aGlzLm1vZGVsX3VyaSk7XG4gfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgb3JpZ2luIG9mIHRoZSB0cmFjZS5cbiAgXHQgKiBAcmV0dXJucyB7T3JpZ2lufSBPcmlnaW4gb2YgdGhlIHRyYWNlLlxuICBcdCAqIEB0b2RvIERFRklORSBXSEFUIElTIEFOIE9SSUdJTlxuICBcdCAqL1xuICBnZXRfb3JpZ2luOiBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7IHJldHVybiB0aGlzLm9yaWdpbjsgfSxcbiAgLy9nZXRfb3JpZ2luX29mZnNldDogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm9yaWdpbl9vZmZzZXQ7IH0sXG4gIC8qa3Ric19vcmlnaW5fdG9fbXM6IGZ1bmN0aW9uKGt0YnNfZGF0ZV9zdHIpIHtcbiAgXHRcdHZhciBZID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMCw0KTtcbiAgXHRcdHZhciBNID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoNSwyKSAtIDE7XG4gIFx0XHR2YXIgRCA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDgsMik7XG4gIFx0XHR2YXIgaCA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDExLDIpO1xuICBcdFx0dmFyIG0gPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigxNCwyKTtcbiAgXHRcdHZhciBzID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMTcsMik7XG4gIFx0XHR2YXIgbXMgPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigyMCwzKTtcbiAgXHRcdHJldHVybiBEYXRlLlVUQyhZLE0sRCxoLG0scyxtcyk7XG4gIFx0fSwqL1xuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGxpc3Rfc291cmNlX3RyYWNlczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBsaXN0X3RyYW5zZm9ybWVkX3RyYWNlczogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgbGlzdCBvZiBvYnNlbHMgaW4gYW4gb3B0aW9uYWwgdGltZSBpbnRlcnZhbC5cbiAgXHQgKiBJZiBubyBtaW5pbXVtIHRpbWUgYW5kIG5vIG1heGltdW0gdGltZSBjb25zdHJhaW50IGFyZVxuICBcdCAqIGRlZmluZWQsIHJldHVybnMgdGhlIHdob2xlIGxpc3Qgb2Ygb2JzZWxzLlxuICBcdCAqIElmIG9uZSBvZiB0aGUgdHdvIGNvbnN0cmFpbnRzIGFyZSBkZWZpbmVkLCB0aGVuIHJldHVybnNcbiAgXHQgKiBvYnNlbHMgbWF0Y2hpbmcgdGhlIHRpbWUgY29uc3RyYWludHMuXG4gIFx0ICpcbiAgXHQgKiBOb3RlOiBpZiBhbiBvYnNlbCBvdmVybGFwcyB3aXRoIHRoZSBzdGFydCBvciB0aGUgZW5kXG4gIFx0ICogY29uc3RyYWludCwgdGhlbiBpdCB3aWxsIGJlIGluY2x1ZGVkIChmb3IgaW5zdGFuY2UgYW5cbiAgXHQgKiBvYnNlbCB0aGF0IHN0YXJ0cyBiZWZvcmUgdGhlIHN0YXJ0IGNvbnN0cmFpbnQgYW5kIGVuZHNcbiAgXHQgKiBhZnRlciB0aGF0IGNvbnN0cmFpbnQgd2lsbCBiZSBpbmNsdWRlZCkuXG4gIFx0ICpcbiAgXHQgKiBOb3RlOiB0aGUgbGlzdCByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCBpcyB0aGVcbiAgXHQgKiBsaXN0IG9mIE9ic2VscyB0aGF0IGFyZSBsb2FkZWQgbG9jYWxseS5cbiAgXHQgKiBXaGVuIHRoaXMgbWV0aG9kIGlzIGNhbGxlZCwgYSBxdWVyeSB0byB0aGUgS1RCU1xuICBcdCAqIGlzIG1hZGUgdG8ga25vdyBpZiB0aGVyZSBhcmUgb3RoZXIgT2JzZWxzIG1hdGNoaW5nXG4gIFx0ICogdGhlIHF1ZXJ5LiBJZiBzbywgdGhlc2Ugb3RoZXIgb2JzZWxzIHdpbGwgYmUgbG9hZGVkXG4gIFx0ICogaW4gdGhlIGxvY2FsIGNvcHkgb2YgdGhlIHRyYWNlIGFuZCBhXG4gIFx0ICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6Y3JlYXRlOm9ic2VsfHRyYWNlOmNyZWF0ZTpvYnNlbH1cbiAgXHQgKiBldmVudCBvciBhXG4gIFx0ICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6dXBkYXRlfHRyYWNlOnVwZGF0ZX1cbiAgXHQgKiBldmVudCB3aWxsIGJlIHRyaWdnZXJlZCB0byBub3RpZnkgdGhhdCBvdGhlclxuICBcdCAqIE9ic2VscyBoYXZlIGJlZW4gbG9hZGVkLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbYmVnaW5dIE1pbmltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtlbmRdIE1heGltdW0gdGltZSBjb25zdHJhaW50XG4gIFx0ICogQHBhcmFtIHtCb29sZWFufSBbcmV2ZXJzZT1mYWxzZV0gUmV0dXJucyB0aGUgb2JzZWwgbGlzdCBpblxuICBcdCAqICAgICByZXZlcnNlIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgdHJ1ZSBhbmQgaW4gbm9ybWFsXG4gIFx0ICogICAgIGNocm9ub2xvZ2ljYWwgb3JkZXIgaWYgZmFsc2UuXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxPYnNlbD59IExpc3Qgb2YgcmVsZXZhbnQgb2JzZWxzXG4gIFx0ICogQHRvZG8gUkVWRVJTRSBJUyBOT1QgWUVUIFRBS0VOIElOVE8gQUNDT1VOVFxuICBcdCAqL1xuICAvLyBUT0RPIGFkZCBhbiBvcHRpb25hbCBDQUxMQkFDSz8/P1xuICBsaXN0X29ic2VsczogZnVuY3Rpb24oYmVnaW4sIGVuZCwgcmV2ZXJzZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMub2JzZWxfbGlzdF91cmkgPSB0aGlzLnVyaSArIFwiQG9ic2Vsc1wiO1xuICAgIGlmICh0aGlzLm9ic2VsX2xpc3RfdXJpID09PSBcIlwiKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGluIEtUQlM6VHJhY2U6bGlzdF9vYnNlbHMoKSB1bmtub3duIHVyaVwiKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgT0JKID0gdGhpcztcblxuICAgIC8vXHRcdCQuZ2V0SlNPTih0aGlzLm9ic2VsX2xpc3RfdXJpLHRoaXMuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF8uYmluZCh0aGlzKSk7XG4gICAgdmFyIE9CSiA9IHRoaXM7XG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy5vYnNlbF9saXN0X3VyaSwvLysnLmpzb24nLFxuICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgZGF0YToge21pbmI6IGJlZ2luLCBtYXhiOiBlbmQsIHJldmVyc2U6IHJldmVyc2V9LFxuICAgICAgeGhyRmllbGRzOiB7IHdpdGhDcmVkZW50aWFsczogdHJ1ZSB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKFhIUikge1xuICAgICAgICBpZiAoWEhSLnN0YXR1cyA9PT0gJzQwMScpIHtcbiAgICAgICAgICB2YXIgbGlua2hlYWRlciA9IFhIUi5nZXRSZXNwb25zZUhlYWRlcignTGluaycpO1xuICAgICAgICAgIHZhciBkID0gbGlua2hlYWRlci5zcGxpdCAoJywnKTtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgZC5sZW5ndGg7aSsrKSAgICAgICAgICB7XG4gICAgICAgICAgICB2YXIgc291c0QgPSBkW2ldLnNwbGl0KCc7Jyk7XG4gICAgICAgICAgICBpZiAoc291c0RbMV0gPT09IFwiIHJlbD1vYXV0aF9yZXNvdXJjZV9zZXJ2ZXJcIikgICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhciBsaW5rID0gc291c0RbMF0uc3Vic3RyKDEsIHNvdXNEWzBdLmxlbmd0aCAtIDIpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzb3VzRFsxXSA9PT0gXCIgcmVsPXN1Y2Nlc3NmdWxfbG9naW5fcmVkaXJlY3RcIikgICAgICAgICAgICB7XG4gICAgICAgICAgICAgIC8vXHR2YXJcdFVSTFN1Y2Nlc3MgPSBzb3VzRFswXS5zdWJzdHIoMixzb3VzRFswXS5sZW5ndGgtMyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHdpbmRvdy5vcGVuIChsaW5rKSA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XHRpZiAoZGF0YS5vYnNlbHMubGVuZ3RoID4gMClcdHtPQkouQmVmb3JlX29uX3JlZnJlc2hfb2JzZWxfbGlzdF8gKGRhdGEpO31cdH1cbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5vYnNlbF9saXN0LmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoZW5kICYmIG8uZ2V0X2JlZ2luKCkgPiBlbmQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICBpZiAoYmVnaW4gJiYgby5nZXRfZW5kKCkgPCBiZWdpbikgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0pO1xuICB9LFxuXG4gIEJlZm9yZV9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhUmVjdSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIC8vIHBhciBwYXF1ZXRcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOkNvbmZpZycsIGRhdGFSZWN1KTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGVuZCA9IE51bWJlcihpKSArIE51bWJlcigxMDApO1xuXG4gICAgaWYgKGRhdGFSZWN1Lm9ic2Vscykge3RoaXMuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cChkYXRhUmVjdS5vYnNlbHMsIGksIGVuZCk7fSAgICBlbHNlIHsgdGhpcy5fb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwKGRhdGFSZWN1LCBpLCBlbmQpO31cblxuXG4gIH0sXG4gIF9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXA6IGZ1bmN0aW9uKGRhdGFSZWN1LCBpLCBlbmQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgY291bnQgPSAwO1xuICAgIHZhciBkID0gZGF0YVJlY3UubGVuZ3RoIC0gTnVtYmVyKDEpO1xuICAgIHZhciBEYXRhTyA9IGRhdGFSZWN1LnNsaWNlIChpLCBlbmQpO1xuICAgIGNvbnNvbGUubG9nICgnX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cCcpO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBEYXRhTy5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICBjb3VudCArKztcbiAgICAgIHRoaXMuX3BhcnNlX2dldF9vYnNlbF8oZWwpO1xuICAgICAgdmFyIE9iamV0ID0gdGhpcztcbiAgICAgIGlmIChjb3VudCA9PT0gRGF0YU8ubGVuZ3RoKSAgICAgIHtcbiAgICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTp1cGRhdGVUJyk7XG4gICAgICAgIGkgPSBOdW1iZXIoaSkgKyBEYXRhTy5sZW5ndGggKyBOdW1iZXIoMSk7XG4gICAgICAgIGVuZCA9IE51bWJlcihpKSArIE51bWJlcigxMDApO1xuICAgICAgICBpZiAoZW5kID4gZGF0YVJlY3UubGVuZ3RoKSB7ZW5kID0gZGF0YVJlY3UubGVuZ3RoIC0gTnVtYmVyKDEpO31cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoKGkgPD0gZCkgJiYgKGVuZCA8PSBkKSkge1xuICAgICAgICAgICAgT2JqZXQuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cChkYXRhUmVjdSwgaSwgZW5kKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhhdC50cmlnZ2VyKCd0cmFjZTp1cGRhdGVDb21wbGV0ZWQnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDIwMDApO1xuXG4gICAgICAgICQoXCIjd2FpdGluZ1wiKS5oaWRlKCk7XG5cbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcblxuICB9LFxuXG4gIF9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGNvdW50ID0gMDtcblxuICAgIGRhdGEuZm9yRWFjaChmdW5jdGlvbihlbCkge1xuICAgICAgY291bnQgKys7XG4gICAgICB0aGlzLl9wYXJzZV9nZXRfb2JzZWxfKGVsKTtcbiAgICAgIGlmIChjb3VudCA9PT0gZGF0YS5sZW5ndGgpICAgICAge3RoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlVCcsIHRoaXMpO31cbiAgICB9LCB0aGlzKTtcblxuXG4gIH0sXG5cbiAgZ2V0X0xhc3Rfb2JzZWw6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBvYnM7XG4gICAgdmFyIG1heCA9IDA7XG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uZ2V0X2JlZ2luKCkgPiBtYXgpIHsgb2JzID0gbzsgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYnM7XG4gIH0sXG4gIGdldF9GaXJzdF9vYnNlbDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icztcbiAgICB2YXIgbWluMSA9IDk5OTk5OTk5OTk5OTk7XG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8uZ2V0X2JlZ2luKCkgPCBtaW4xKSB7IG9icyA9IG87IH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JzO1xuICB9LFxuICBnZXRfTGlzdF9vYnNlbF9QYXJUeXBlOiBmdW5jdGlvbihvYnNlbFR5cGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbGlzdGUgPSBbXTtcblxuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLnR5cGUgPT09IG9ic2VsVHlwZSkgeyBsaXN0ZS5wdXNoKG8pOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGxpc3RlO1xuICB9LFxuXG5cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgRm9yY2VzIHRoZSBsb2NhbCBvYnNlbCBsaXN0IHRvIGJlIHN5bmNocm9uaXNlZFxuICBcdCAqIHdpdGggdGhlIEtUQlMgYXQgYSBnaXZlbiByZWZyZXNoaW5nIHJhdGUuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IHBlcmlvZCBUaW1lIGluIHNlY29uZHMgYmV0d2VlbiB0d28gc3luY2hyb25pc2F0aW9ucy5cbiAgXHQgKi9cbiAgc3RhcnRfYXV0b19yZWZyZXNoX29ic2VsX2xpc3Q6IGZ1bmN0aW9uKHBlcmlvZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBhID0gdGhpcy5hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdF9pZD90aGlzLnN0b3BfYXV0b19yZWZyZXNoX29ic2VsX2xpc3QoKTpudWxsO1xuICAgIHRoaXMuYXV0b19yZWZyZXNoX29ic2VsX2xpc3RfaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy5saXN0X29ic2Vscy5iaW5kKHRoaXMpLCBwZXJpb2QgKiAxMDAwKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgU3RvcHMgdGhlIGF1dG9yZWZyZXNoIHN5bmNocm9uaXNhdGlvblxuICBcdCAqIG9mIHRoZSBvYnNlbCBsaXN0LlxuICBcdCAqL1xuICBzdG9wX2F1dG9fcmVmcmVzaF9vYnNlbF9saXN0OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdF9pZCkge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5hdXRvX3JlZnJlc2hfaWQpO1xuICAgICAgZGVsZXRlKHRoaXMuYXV0b19yZWZyZXNoX2lkKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gIFx0ICogUmV0cmlldmUgYW4gb2JzZWwgaW4gdGhlIHRyYWNlIGZyb20gaXRzIElELlxuICBcdCAqIElmIHRoZSBvYnNlbCBkb2VzIG5vdCBleGlzdCBsb2NhbGx5LCByZXR1cm5zXG4gIFx0ICogdW5kZWZpbmVkIGFuZCBzZW5kIGEgcXVlcnkgdG8gdGhlIEtUQlNcbiAgXHQgKiAod2hpY2ggd2lsbCByZXN1bHQgaW4gYWRkaW5nIHRoaXMgb2JzZWwgbG9jYWxseVxuICBcdCAqIGlmIGl0IGV4aXN0cyBvbiB0aGUgS1RCUykuXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGlkIElEIG9mIHRoZSBPYnNlbCB0byByZXRyaWV2ZVxuICBcdCAqIEByZXR1cm5zIHtPYnNlbH0gT2JzZWwgdGhhdCBjb3JyZXNwb25kcyB0byB0aGlzIElEXG4gIFx0ICogICAgIG9yIHVuZGVmaW5lZCBpZiB0aGUgb2JzZWwgd2FzIG5vdCBmb3VuZC5cbiAgXHQgKiBAdG9kbyBUT0RPIGFkZCBhbiBvcHRpb25hbCBDQUxMQkFDS1xuICBcdCAqL1xuICBnZXRfb2JzZWw6IGZ1bmN0aW9uKGlkKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icztcbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5nZXRfaWQoKSA9PT0gaWQpIHsgb2JzID0gbzsgfVxuICAgIH0pO1xuICAgIGlmIChvYnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gc2VuZHMgYSBxdWVyeSB0byBmaW5kIHRoZSBvYnNlbFxuICAgICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICAvLyBUT0RPIGlkZWFsbHkgSlNPTi4uLiBXaGVuIEtUQlMgc3VwcG9ydHMgaXQhXG4gICAgICAgIHVybDogdGhpcy51cmkgKyBpZCxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdHlwZTogJ0dFVCcsXG4gICAgICAgIHN1Y2Nlc3M6IHRoaXMuX3BhcnNlX2dldF9vYnNlbF8uYmluZCh0aGlzKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gb2JzO1xuICB9LFxuICAvKipcbiAgXHQgKiBDYWxsYmFjayBmb3IgcXVlcmllcyB3aGVyZSBhbiBvYnNlbCBpcyBleHBlY3RlZCBhcyBhIHJlc3VsdFxuICBcdCAqIFBhcnNlcyB0aGUgSlNPTiBkYXRhIGZyb20gdGhlIEtUQlMgdG8gY3JlYXRlIGEgbmV3IE9ic2VsIGxvY2FsbHlcbiAgXHQgKiBpZiBpdCBkb2Vzbid0IGV4aXN0IGFscmVhZHkuXG4gIFx0ICogQHByaXZhdGVcbiAgXHQgKi9cbiAgX3BhcnNlX2dldF9vYnNlbF86IGZ1bmN0aW9uKGRhdGEsIHRleHRTdGF0dXMsIGpxWEhSKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icyA9IHtcbiAgICAgIGF0dHJpYnV0ZXM6IHt9XG4gICAgfTtcblxuICAgIC8vIE9CU0VMIElEXG4gICAgb2JzLmlkID0gZGF0YVtcIkBpZFwiXTtcbiAgICBpZiAodGhpcy50eXBlID09PSBcIkNvbXB1dGVkVHJhY2VcIikge29icy5pZCA9IG9icy50eXBlICsgXCJfXCIgKyBvYnMuaWQ7fVxuICAgIGlmIChvYnMuaWQuc3Vic3RyKDAsIDIpID09PSBcIi4vXCIpIHsgb2JzLmlkID0gb2JzLmlkLnN1YnN0cigyKTsgfVxuXG4gICAgLy8gT0JTRUwgVFJBQ0VcbiAgICAvLyBkYXRhLmhhc1RyYWNlO1xuICAgIG9icy50cmFjZSA9IHRoaXM7XG5cbiAgICAvLyBPQlNFTCBUWVBFXG4gICAgLy8gZGF0YVtcIkB0eXBlXCJdOyAvLyBUT0RPIEJVRyBLVEJTIC0+IFVTRSBcIm06dHlwZVwiIGluc3RlYWRcbiAgICAvLyBkYXRhW1wibTp0eXBlXCJdO1xuICAgIG9icy50eXBlID0gZGF0YVtcIkB0eXBlXCJdLnN1YnN0cigyKTtcblxuICAgIGlmIChkYXRhLmhhc093blByb3BlcnR5KCdodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnKSkge1xuICAgICAgb2JzLmxhYmVsID0gZGF0YVsnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ107XG4gICAgfVxuICAgIC8vb2JzLmJlZ2luID0gZGF0YS5iZWdpbjtcbiAgICAvL29icy5lbmQgPSBkYXRhLmVuZDtcbiAgICB2YXIgZCA9IG5ldyBEYXRlICh0aGlzLm9yaWdpbik7XG4gICAgb2JzLmJlZ2luID0gZC5nZXRUaW1lKCkgKyBkYXRhLmJlZ2luIDtcbiAgICBvYnMuZW5kID0gZC5nZXRUaW1lKCkgKyBkYXRhLmVuZDtcblxuICAgIC8vIERFTEVUSU5HIFBST1BFUlRJRVMgVEhBVCBIQVZFIEFMUkVBRFkgQkVFTiBDT1BJRURcbiAgICBkZWxldGUgZGF0YVtcIkBpZFwiXTtcbiAgICBkZWxldGUgZGF0YS5oYXNUcmFjZTtcbiAgICBkZWxldGUgZGF0YVtcIkB0eXBlXCJdO1xuICAgIGRlbGV0ZSBkYXRhLmJlZ2luO1xuICAgIGRlbGV0ZSBkYXRhLmVuZDtcbiAgICBkZWxldGUgZGF0YVsnaHR0cDovL3d3dy53My5vcmcvMjAwMC8wMS9yZGYtc2NoZW1hI2xhYmVsJ107XG4gICAgLy9kZWxldGUgZGF0YVtcIm06dHlwZVwiXTtcblxuXG4gICAgLy8gQVRUUklCVVRFU1xuICAgIGZvciAodmFyIGF0dHIgaW4gZGF0YSkge1xuICAgICAgaWYgKGF0dHIuc3Vic3RyKDAsIDIpID09PSBcIm06XCIpIHsgLy8gVE9ETyB0aGlzIGlzIG5vdCBnZW5lcmljISEhIVxuICAgICAgICBvYnMuYXR0cmlidXRlc1thdHRyLnN1YnN0cigyKV0gPSBkYXRhW2F0dHJdO1xuICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKGRhdGEsb2JzKTtcbiAgICB2YXIgbyA9IG5ldyBLVEJTT2JzZWwob2JzKTtcbiAgICBpZiAoIXRoaXMuX2NoZWNrX29ic2VsX2xvYWRlZF8obykpIHsgLy8gVE9ETyBmaXJzdCBhcHByb3hpbWF0aW9uXG4gICAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIG8pO1xuICAgIH1cbiAgfSxcblxuICAvLy8vLy8vLy8vL1xuICAvKipcbiAgXHQgKiBPdmVybG9hZHMgdGhlIHtAbGluayBTYW1vdHJhY2VzLktUQlMuUmVzb3VjZSNfb25fc3RhdGVfcmVmcmVzaF99IG1ldGhvZC5cbiAgXHQgKiBAcHJpdmF0ZVxuICBcdCAqL1xuICBfb25fc3RhdGVfcmVmcmVzaF86IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAvL1x0XHRjb25zb2xlLmxvZyhkYXRhKTtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLl9jaGVja19hbmRfdXBkYXRlX3RyYWNlX3R5cGVfKGRhdGFbJ0B0eXBlJ10pO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2RlZmF1bHRfc3ViamVjdCcsIGRhdGEuaGFzRGVmYXVsdFN1YmplY3QsICcnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdtb2RlbF91cmknLCBkYXRhLmhhc01vZGVsLCAndHJhY2U6bW9kZWwnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdvYnNlbF9saXN0X3VyaScsIGRhdGEuaGFzT2JzZWxMaXN0LCAndHJhY2U6dXBkYXRlJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnYmFzZV91cmknLCBkYXRhLmluQmFzZSwgJ3RyYWNlOmJhc2UnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdvcmlnaW4nLCBkYXRhLm9yaWdpbiwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2xhYmVsJywgZGF0YS5sYWJlbCwgJ3RyYWNlOnVwZGF0ZScpO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlRGF0YScsIGRhdGEpO1xuICAgIC8vdGhpcy5fY2hlY2tfY2hhbmdlXygnb3JpZ2luX29mZnNldCcsdGhpcy5rdGJzX29yaWdpbl90b19tcyhkYXRhLm9yaWdpbiksJycpO1xuICB9LFxuICBfdXBkYXRlX21ldGhvZF86IGZ1bmN0aW9uKHRyYWNlX3R5cGUsIG1ldGhvZF9uYW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpc1ttZXRob2RfbmFtZV0gPSB0aGlzW3RyYWNlX3R5cGUgKyBcIl9tZXRob2RzXCJdW21ldGhvZF9uYW1lXTtcbiAgICBpZiAodGhpcy50ZW1wW21ldGhvZF9uYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLnRlbXBbbWV0aG9kX25hbWVdLmZvckVhY2goZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgICAgdGhpc1ttZXRob2RfbmFtZV0ocGFyYW0pO1xuICAgICAgfSwgdGhpcyk7XG4gICAgfVxuICB9LFxuICBfY2hlY2tfYW5kX3VwZGF0ZV90cmFjZV90eXBlXzogZnVuY3Rpb24odHlwZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLnR5cGUgIT09IHR5cGUpIHtcbiAgICAgIGZvciAodmFyIG1ldGhvZF9uYW1lIGluIHRoaXNbdHlwZSArIFwiX21ldGhvZHNcIl0pIHtcbiAgICAgICAgaWYgKHRoaXNbdHlwZSArIFwiX21ldGhvZHNcIl0uaGFzT3duUHJvcGVydHkobWV0aG9kX25hbWUpKSAgICAgICAge3RoaXMuX3VwZGF0ZV9tZXRob2RfKHR5cGUsIG1ldGhvZF9uYW1lKTt9XG4gICAgICB9XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIH1cbiAgfSxcbiAgLy8vLy8vLy8vLy9cbiAgLypcdF9vbl9yZWZyZXNoX29ic2VsX2xpc3RfOiBmdW5jdGlvbihkYXRhKSB7XG4gIC8vXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuICBcdFx0dmFyIGlkLCBsYWJlbCwgdHlwZSwgYmVnaW4sIGVuZCwgYXR0cmlidXRlcywgb2JzO1xuICBcdFx0dmFyIG5ld19vYnNlbF9sb2FkZWQgPSBmYWxzZTtcbiAgXHRcdGRhdGEub2JzZWxzLmZvckVhY2goZnVuY3Rpb24oZWwsa2V5KSB7XG4gIFx0XHRcdHRoaXMuX3BhcnNlX2dldF9vYnNlbF8oZWwpO1xuICAvKlxuICBcdFx0XHR2YXIgYXR0ciA9IHt9O1xuICBcdFx0XHRhdHRyLmlkID0gZWxbJ0BpZCddO1xuICBcdFx0XHRhdHRyLnRyYWNlID0gdGhpcztcbiAgXHRcdFx0YXR0ci5sYWJlbCA9IGVsWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXSB8fCB1bmRlZmluZWQ7XG4gIFx0XHRcdGF0dHIudHlwZSA9IGVsWydAdHlwZSddO1xuICBcdFx0XHRhdHRyLmJlZ2luID0gZWxbJ2JlZ2luJ107XG4gIFx0XHRcdGF0dHIuZW5kID0gZWxbJ2VuZCddO1xuICBcdFx0XHRhdHRyLmF0dHJpYnV0ZXMgPSBlbDtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snQGlkJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXSk7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ0B0eXBlJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydiZWdpbiddKTtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snZW5kJ10pO1xuICBcdFx0XHRvYnMgPSBuZXcgU2Ftb3RyYWNlcy5LVEJTLk9ic2VsKGF0dHIpO1xuXG4gIFx0XHRcdGlmKCEgdGhpcy5fY2hlY2tfb2JzZWxfbG9hZGVkXyhvYnMpKSB7XG4gIFx0XHRcdFx0bmV3X29ic2VsX2xvYWRlZCA9IHRydWU7XG4gIFx0XHRcdH1cbiovXG4gIC8vfSx0aGlzKTtcbiAgLypcdFx0aWYobmV3X29ic2VsX2xvYWRlZCkge1xuICBcdFx0XHR0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZScsdGhpcy50cmFjZVNldCk7XG4gIFx0XHR9XG4qL1xuICAvL30sKi9cbiAgX2NoZWNrX29ic2VsX2xvYWRlZF86IGZ1bmN0aW9uKG9icykge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLm9ic2VsX2xpc3Quc29tZShmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gby5nZXRfaWQoKSA9PT0gb2JzLmdldF9pZCgpOyAvLyBmaXJzdCBhcHByb3hpbWF0aW9uOiBvYnNlbCBoYXMgdGhlIHNhbWUgSUQgPT4gaXQgaXMgYWxyZWFkeSBsb2FkZWQuLi4gV2UgZG9uJ3QgY2hlY2sgaWYgdGhlIG9ic2VsIGhhcyBjaGFuZ2VkIVxuICAgIH0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vYnNlbF9saXN0LnB1c2gob2JzKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH0sXG4gIFN0b3JlZFRyYWNlX21ldGhvZHM6IHtcbiAgICBzZXRfbW9kZWw6IGZ1bmN0aW9uKG1vZGVsKSB7fSxcbiAgICBzZXRfb3JpZ2luOiBmdW5jdGlvbihvcmlnaW4pIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgdGhpcy5vcmlnaW4gPSBvcmlnaW47XG4gICAgICAvL1x0dGhpcy5vcmlnaW5fb2Zmc2V0ID0gKG5ldyBEYXRlKG9yaWdpbikpLmdldE1pbGxpc2Vjb25kcygpO1xuICAgICAgLy8gVE9ETyBzeW5jIHdpdGggS1RCU1xuICAgIH0sXG4gICAgZ2V0X2RlZmF1bHRfc3ViamVjdDogZnVuY3Rpb24oKSB7XG4gICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgIHJldHVybiB0aGlzLmRlZmF1bHRfc3ViamVjdDtcbiAgICB9LFxuICAgIHNldF9kZWZhdWx0X3N1YmplY3Q6IGZ1bmN0aW9uKHN1YmplY3QpIHt9LFxuICAgIGNyZWF0ZV9vYnNlbDogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAvLyBMT0NBTCBUUkFDRVxuICAgICAgLy92YXIgb2JzID0gbmV3IFNhbW90cmFjZXMuT2JzZWwob2JzZWxfcGFyYW1zKTtcbiAgICAgIC8vIEtUQlMgQk9HVUVcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgdmFyIGpzb25fb2JzZWwgPSB7XG4gICAgICAgIFwiQGNvbnRleHRcIjpcdFtcbiAgICAgICAgXCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgICAgICAgICAgIHsgXCJtXCI6IFwiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9zaW1wbGUtdHJhY2UtbW9kZWwjXCIgfVxuICAgICAgICBdLFxuICAgICAgICBcIkB0eXBlXCI6XHRcIm06XCIgKyBwYXJhbXMudHlwZSwgLy8gZml4ZWQ6IFwiU2ltcGxlT2JzZWxcIiwgLy8gVE9ETyBLVEJTIEJVRyBUTyBGSVhcbiAgICAgICAgaGFzVHJhY2U6XHRcIlwiLFxuICAgICAgICBzdWJqZWN0Olx0cGFyYW1zLmhhc093blByb3BlcnR5KFwic3ViamVjdFwiKT9wYXJhbXMuc3ViamVjdDp0aGlzLmdldF9kZWZhdWx0X3N1YmplY3QoKSxcbiAgICAgICAgLy9cIm06dHlwZVwiOlx0cGFyYW1zLnR5cGVcbiAgICAgIH07XG4gICAgICAvL2NvbnNvbGUubG9nKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIik/cGFyYW1zLnN1YmplY3Q6dGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCkscGFyYW1zLmhhc093blByb3BlcnR5KFwic3ViamVjdFwiKSxwYXJhbXMuc3ViamVjdCx0aGlzLmdldF9kZWZhdWx0X3N1YmplY3QoKSk7XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KFwiYmVnaW5cIikpIHsganNvbl9vYnNlbC5iZWdpbiA9IHBhcmFtcy5iZWdpbjsgfVxuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImVuZFwiKSkgeyBqc29uX29ic2VsLmJlZ2luID0gcGFyYW1zLmVuZDt9XG4gICAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KFwiYXR0cmlidXRlc1wiKSkge1xuICAgICAgICBmb3IgKHZhciBhdHRyIGluIHBhcmFtcy5hdHRyaWJ1dGVzKSB7XG4gICAgICAgICAgaWYgKHBhcmFtcy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHIpKSAgICAgICAgICB7anNvbl9vYnNlbFtcIm06XCIgKyBhdHRyXSA9IHBhcmFtcy5hdHRyaWJ1dGVzW2F0dHJdO31cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZnVuY3Rpb24gX29uX2NyZWF0ZV9vYnNlbF9zdWNjZXNzXyhkYXRhLCB0ZXh0U3RhdHVzLCBqcVhIUikge1xuICAgICAgICAvKlxuICAgICAgICBcdFx0XHRcdHZhciB1cmwgPSBqcVhIUi5nZXRSZXNwb25zZUhlYWRlcignTG9jYXRpb24nKTtcbiAgICAgICAgXHRcdFx0XHR2YXIgdXJsX2FycmF5ID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgICAgIFx0XHRcdFx0Ki9cblxuICAgICAgICB2YXIgdXJsX2FycmF5ID0gZGF0YS5zcGxpdCgnLycpO1xuICAgICAgICB2YXIgb2JzZWxfaWQgPSB1cmxfYXJyYXlbdXJsX2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgICAgICAvL3RoaXMuZ2V0X29ic2VsKG9ic2VsX2lkKTtcbiAgICAgICAgLy8gT3B0aW1pc2F0aW9uOiBkbyBub3QgZG8gYSBHRVQgcXVlcnkgdG8gZ2V0IHRoZSBPQlNFTFxuICAgICAgICAvLyBUaGUgT2JzZWwgcGFyYW1ldGVycyBhcmUgYWxyZWFkeSBrbm93biBpbiBwYXJhbVxuICAgICAgICAvLyBXZSBqdXN0IG5lZWQgdG8gYWRkIHRoZSBJRC5cbiAgICAgICAgcGFyYW1zLmlkID0gb2JzZWxfaWQ7XG4gICAgICAgIHBhcmFtcy50cmFjZSA9IHRoaXM7XG4gICAgICAgIHZhciBvID0gbmV3IEtUQlNPYnNlbChwYXJhbXMpO1xuICAgICAgICBpZiAoIXRoaXMuX2NoZWNrX29ic2VsX2xvYWRlZF8obykpIHtcbiAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmNyZWF0ZV9vYnNlbCcsIG8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IHRoaXMudXJpLFxuICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIHN1Y2Nlc3M6IF9vbl9jcmVhdGVfb2JzZWxfc3VjY2Vzc18uYmluZCh0aGlzKSxcbiAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoanNvbl9vYnNlbClcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcblxuICBDb21wdXRlZFRyYWNlX21ldGhvZHM6IHtcbiAgICBzZXRfbWV0aG9kOiBmdW5jdGlvbihtZXRob2QpIHt9LFxuICAgIGxpc3RfcGFyYW1ldGVyczogZnVuY3Rpb24oaW5jbHVkZV9pbmhlcml0ZWQpIHt9LFxuICAgIGdldF9wYXJhbWV0ZXI6IGZ1bmN0aW9uKGtleSkge30sXG4gICAgc2V0X3BhcmFtZXRlcjogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge30sXG4gICAgZGVsX3BhcmFtZXRlcjogZnVuY3Rpb24oa2V5KSB7fVxuICB9LFxuXG4gIC8vIFRFTVBPUkFSWSBNRVRIT0RTXG4gIGNyZWF0ZV9vYnNlbDogZnVuY3Rpb24ob2JzZWxfcGFyYW1zKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKCF0aGlzLmNyZWF0ZV9vYnNlbC5oYXNPd25Qcm9wZXJ0eSgnY3JlYXRlX29ic2VsJykpIHtcbiAgICAgIHRoaXMudGVtcC5jcmVhdGVfb2JzZWwgPSBbXTtcbiAgICB9XG4gICAgdGhpcy50ZW1wLmNyZWF0ZV9vYnNlbC5wdXNoIChvYnNlbF9wYXJhbXMpO1xuICB9LFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNUcmFjZTtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIEtUQlNCYXNlID0gcmVxdWlyZShcIi4vS1RCUy5CYXNlLmpzXCIpO1xudmFyICQgPSByZXF1aXJlKFwianF1ZXJ5XCIpO1xuXG4vKipcbiogQHN1bW1hcnkgSmF2YXNjcmlwdCBLVEJTIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUy5cbiogQGNsYXNzIEphdmFzY3JpcHQgS1RCUyBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMuXG4qIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4qIEByZXF1aXJlcyBqUXVlcnkgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9qcXVlcnkuY29tXCI+anF1ZXJ5LmNvbTwvYT4pXG4qIEBjb25zdHJ1Y3RvclxuKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiogQGF1Z21lbnRzIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZVxuKiBAZGVzY3JpcHRpb25cbiogU2Ftb3RyYWNlcy5LVEJTIGlzIGEgSmF2YXNjcmlwdCBLVEJTIG9iamVjdCB0aGF0XG4qIGlzIGJvdW5kIHRvIGEgS1RCUy4gVGhpcyBPYmplY3QgaW1wbGVtZXRucyB0aGUgS1RCUyBBUEkuXG4qIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXQgdGhlIGxpc3Qgb2YgYmFzZXNcbiogYXZhaWxhYmxlIGluIHRoZSBLVEJTLiBBY2Nlc3MgYSBzcGVjaWZpYyBiYXNlLCBldGMuXG4qXG4qIEBwYXJhbSB7U3RyaW5nfVx0dXJpXHRVUkkgb2YgdGhlIEtUQlMgdG8gbG9hZC5cbiovXG52YXIgS1RCUyA9IGZ1bmN0aW9uIEtUQlModXJpKSB7XG4gIC8vIEtUQlMgaXMgYSBSZXNvdXJjZVxuICBcInVzZSBzdHJpY3RcIjtcbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgdXJpLCB1cmksICdLVEJTJywgXCJcIik7XG4gIHRoaXMuYmFzZXMgPSBbXTtcbiAgdGhpcy5idWlsdGluX21ldGhvZHMgPSBbXTtcbiAgdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG59O1xuXG5LVEJTLnByb3RvdHlwZSA9IHtcbiAgLy8vLy8vLy8vLy8gT0ZGSUNJQUwgQVBJXG4gIC8qKlxuICAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiovXG4gIGxpc3RfYnVpbHRpbl9tZXRob2RzOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4qL1xuICBnZXRfYnVpbHRpbl9tZXRob2Q6IGZ1bmN0aW9uKCkge30sXG4gIC8qKlxuICAqIFJldHVybnMgdGhlIGFycmF5IG9mIHRoZSBVUkkgb2YgdGhlIGJhc2VzIGNvbnRhaW5lZCBpbiB0aGUgS1RCU1xuICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fSBBcnJheSBvZiBVUkkgb2YgYmFzZXMuXG4qL1xuICBsaXN0X2Jhc2VzOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5iYXNlcztcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnkgUmV0dXJucyB0aGUgS1RCUy5CYXNlIHdpdGggdGhlIGdpdmVuIElELlxuICAqIEByZXR1cm5zIFNhbW90cmFjZXMuS1RCUy5CYXNlIEJhc2UgY29ycmVzcG9uZGluZyB0byB0aGUgZ2l2ZW4gSURcbiAgKiBAcGFyYW0gaWQge1N0cmluZ30gVVJJIG9mIHRoZSBiYXNlXG4qL1xuICBnZXRfYmFzZTogZnVuY3Rpb24oaWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gbmV3IEtUQlNCYXNlKHRoaXMudXJpICsgaWQsIGlkKTtcbiAgfSxcbiAgLyoqXG4gICogQ3JlYXRlIGEgbmV3IGJhc2UuXG4gICogQHBhcmFtIGlkIHtTdHJpbmd9IFVSSSBvZiB0aGUgYmFzZSAob3B0aW9uYWwpXG4gICogQHBhcmFtIGxhYmVsIHtTdHJpbmd9IExhYmVsIG9mIHRoZSBiYXNlIChvcHRpb25hbClcbiovXG4gIGNyZWF0ZV9iYXNlOiBmdW5jdGlvbihpZCwgbGFiZWwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgbmV3X2Jhc2UgPSB7XG4gICAgICBcIkBjb250ZXh0XCI6XHRcImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEva3Ricy1qc29ubGQtY29udGV4dFwiLFxuICAgICAgXCJAdHlwZVwiOlx0XCJCYXNlXCIsXG4gICAgICBcIkBpZFwiOlx0XHRpZCArIFwiL1wiLFxuICAgICAgXCJsYWJlbFwiOlx0bGFiZWxcbiAgICB9O1xuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMudXJpLFxuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KG5ld19iYXNlKSxcbiAgICAgIHN1Y2Nlc3M6IHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaC5iaW5kKHRoaXMpLFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygncXVlcnkgZXJyb3InKTtcbiAgICAgICAgY29uc29sZS5sb2coW2pxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvcl0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICAvLy8vLy8vLy8vL1xuICAvKipcbiAgKiBPdmVybG9hZHMgdGhlIHtAbGluayBTYW1vdHJhY2VzLktUQlMuUmVzb3VjZSNfb25fc3RhdGVfcmVmcmVzaF99IG1ldGhvZC5cbiAgKiBAcHJpdmF0ZVxuKi9cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnYmFzZXMnLCBkYXRhLmhhc0Jhc2UsICdrdGJzOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2J1aWx0aW5fbWV0aG9kcycsIGRhdGEuaGFzQnVpbGRpbk1ldGhvZCwgJ2t0YnM6dXBkYXRlJyk7XG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlM7XG4iLCJ2YXIgT2JzZWwgPSByZXF1aXJlKFwiLi9PYnNlbC5qc1wiKTtcbnZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgSmF2YXNjcmlwdCBUcmFjZSBPYmplY3QuXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBUcmFjZSBPYmplY3QuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuICogQGNvbnN0cnVjdG9yXG4gKiBAbWl4ZXMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLlRyYWNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuRGVtb1RyYWNlIGlzIGEgSmF2YXNjcmlwdCBUcmFjZSBvYmplY3QuXG4gKiBNZXRob2RzIGFyZSBhdmFpbGFibGUgdG8gZ2V0XG4gKiB0aGUgT2JzZWxzIGZyb20gdGhlIHRyYWNlLCBjcmVhdGUgbmV3IE9ic2VscywgZXRjLlxuICpcbiAqIFRoZSB0cmFjZSBpcyBpbml0aWFsaXNlZCBlbXB0eS4gT2JzZWxzIGhhdmUgdG8gYmUgY3JlYXRlZFxuICogYnkgdXNpbmcgdGhlIHtAbGluayBTYW1vdHJhY2VzLkRlbW9UcmFjZSNuZXdPYnNlbH0gbWV0aG9kLlxuICovXG52YXIgTG9jYWxUcmFjZSA9IGZ1bmN0aW9uKHNvdXJjZV90cmFjZXMpIHtcbiAgLy8gQWRkaW50IHRoZSBPYnNlcnZhYmxlIHRyYWl0XG4gIFwidXNlIHN0cmljdFwiO1xuICBFdmVudEhhbmRsZXIuY2FsbCh0aGlzKTtcblxuICAvKiBOb21icmUgZCdvYnNlbHMgZGFucyBsYSB0cmFjZSAqL1xuICB0aGlzLmNvdW50ID0gMDsgLy8gc2VydCBkJ0lEIHBvdXIgbGUgcHJvY2hhaW4gb2JzZXJ2w6kuXG4gIC8qIEFycmF5IGQnb2JzZWxzICovXG4gIHRoaXMub2JzZWxfbGlzdCA9IFtdO1xuICB0aGlzLnNvdXJjZV90cmFjZXMgPSAoc291cmNlX3RyYWNlcyAhPT0gdW5kZWZpbmVkKT9zb3VyY2VfdHJhY2VzOltdO1xuICB0aGlzLnNvdXJjZV90cmFjZXMuZm9yRWFjaChmdW5jdGlvbih0KSB7XG4gICAgdC50cmFuc2Zvcm1lZF90cmFjZXMucHVzaCh0aGlzKTtcbiAgfSk7XG4gIHRoaXMudHJhbnNmb3JtZWRfdHJhY2VzID0gW107XG4gIHRoaXMub3JpZ2luID0gXCJcIjtcbiAgLy90aGlzLm9yaWdpbl9vZmZzZXQgPSAobmV3IERhdGUoMCkpLmdldE1pbGxpc2Vjb25kcygpO1xuXG59O1xuXG5Mb2NhbFRyYWNlLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogR2V0cyB0aGUgbGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHJldHVybnMge1N0cmluZ30gTGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICovXG4gIGdldF9sYWJlbDogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO3JldHVybiB0aGlzLmxhYmVsOyB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBTZXRzIHRoZSBsYWJlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0ge1N0cmluZ30gbGJsIExhYmVsIG9mIHRoZSB0cmFjZVxuICBcdCAqL1xuICBzZXRfbGFiZWw6IGZ1bmN0aW9uKGxibCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMubGFiZWwgPSBsYmw7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmVzZXRzIHRoZSBsYWJlbCB0byB0aGUgZW1wdHkgc3RyaW5nXG4gIFx0ICovXG4gIHJlc2V0X2xhYmVsOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLmxhYmVsID0gXCJcIjtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmVkaXRfbWV0YScpO1xuICB9LFxuXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIG1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEByZXR1cm5zIE1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEB0b2RvIFVQREFURSBXSEFUIElTIEEgTU9ERUxcbiAgXHQgKi9cbiAgZ2V0X21vZGVsOiBmdW5jdGlvbigpIHsgXCJ1c2Ugc3RyaWN0XCI7cmV0dXJuIHRoaXMubW9kZWw7IH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIFJldHVybnMgdGhlIG9yaWdpbiBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcmV0dXJucyBPcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHRvZG8gVVBEQVRFIFdIQVQgSVMgQU4gT1JJR0lOXG4gIFx0ICovXG4gIGdldF9vcmlnaW46IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy5vcmlnaW47IH0sXG4gIC8vZ2V0X29yaWdpbl9vZmZzZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5vcmlnaW5fb2Zmc2V0OyB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBSZXR1cm5zIHRoZSBzb3VyY2UgdHJhY2VzIG9mIHRoaXMgdHJhY2VcbiAgXHQgKiBAcmV0dXJucyB7QXJyYXkuPFRyYWNlPn0gU291cmNlIHRyYWNlcyBvZiB0aGlzIHRyYWNlLlxuICBcdCAqL1xuICBsaXN0X3NvdXJjZV90cmFjZXM6IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjtyZXR1cm4gdGhpcy5zb3VyY2VfdHJhY2VzOyB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBSZXR1cm5zIHRoZSB0cmFjZXMgdHJhbnNmb3JtZWQgZnJvbSB0aGlzIHRyYWNlXG4gIFx0ICogQHJldHVybnMge0FycmF5LjxUcmFjZT59IFRyYWNlIHRyYW5zZm9ybWVkIGZyb20gdGhpcyB0cmFjZVxuICBcdCAqL1xuICBsaXN0X3RyYW5zZm9ybWVkX3RyYWNlczogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO3JldHVybiB0aGlzLnRyYW5zZm9ybWVkX3RyYWNlczsgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgbGlzdCBvZiBvYnNlbHMgaW4gYW4gb3B0aW9uYWwgdGltZSBpbnRlcnZhbC5cbiAgXHQgKiBJZiBubyBtaW5pbXVtIHRpbWUgYW5kIG5vIG1heGltdW0gdGltZSBjb25zdHJhaW50IGFyZVxuICBcdCAqIGRlZmluZWQsIHJldHVybnMgdGhlIHdob2xlIGxpc3Qgb2Ygb2JzZWxzLlxuICBcdCAqIElmIG9uZSBvZiB0aGUgdHdvIGNvbnN0cmFpbnRzIGFyZSBkZWZpbmVkLCB0aGVuIHJldHVybnNcbiAgXHQgKiBvYnNlbHMgbWF0Y2hpbmcgdGhlIHRpbWUgY29uc3RyYWludHMuXG4gIFx0ICpcbiAgXHQgKiBOb3RlOiBpZiBhbiBvYnNlbCBvdmVybGFwcyB3aXRoIHRoZSBzdGFydCBvciB0aGUgZW5kXG4gIFx0ICogY29uc3RyYWludCwgdGhlbiBpdCB3aWxsIGJlIGluY2x1ZGVkIChmb3IgaW5zdGFuY2UgYW5cbiAgXHQgKiBvYnNlbCB0aGF0IHN0YXJ0cyBiZWZvcmUgdGhlIHN0YXJ0IGNvbnN0cmFpbnQgYW5kIGVuZHNcbiAgXHQgKiBhZnRlciB0aGF0IGNvbnN0cmFpbnQgd2lsbCBiZSBpbmNsdWRlZCkuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtiZWdpbl0gTWluaW11bSB0aW1lIGNvbnN0cmFpbnRcbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gW2VuZF0gTWF4aW11bSB0aW1lIGNvbnN0cmFpbnRcbiAgXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZXZlcnNlPWZhbHNlXSBSZXR1cm5zIHRoZSBvYnNlbCBsaXN0IGluXG4gIFx0ICogICAgIHJldmVyc2UgY2hyb25vbG9naWNhbCBvcmRlciBpZiB0cnVlIGFuZCBpbiBub3JtYWxcbiAgXHQgKiAgICAgY2hyb25vbG9naWNhbCBvcmRlciBpZiBmYWxzZS5cbiAgXHQgKiBAcmV0dXJucyB7QXJyYXkuPE9ic2VsPn0gTGlzdCBvZiByZWxldmFudCBvYnNlbHNcbiAgXHQgKiBAdG9kbyBSRVZFUlNFIElTIE5PVCBZRVQgVEFLRU4gSU5UTyBBQ0NPVU5UXG4gIFx0ICovXG4gIGxpc3Rfb2JzZWxzOiBmdW5jdGlvbihiZWdpbiwgZW5kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLy8gVE9ETyByZXZlcnNlIGlzIGlnbm9yZWQuXG4gICAgcmV0dXJuIHRoaXMub2JzZWxfbGlzdC5maWx0ZXIoZnVuY3Rpb24obykge1xuICAgICAgaWYgKGVuZCAmJiBvLmdldF9iZWdpbigpID4gZW5kKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgaWYgKGJlZ2luICYmIG8uZ2V0X2VuZCgpIDwgYmVnaW4pIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgXHQgKiBSZXRyaWV2ZSBhbiBvYnNlbCBpbiB0aGUgdHJhY2UgZnJvbSBpdHMgSUQuXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IGlkIElEIG9mIHRoZSBPYnNlbCB0byByZXRyaWV2ZVxuICBcdCAqIEByZXR1cm5zIHtPYnNlbH0gT2JzZWwgdGhhdCBjb3JyZXNwb25kcyB0byB0aGlzIElEXG4gIFx0ICogICAgIG9yIHVuZGVmaW5lZCBpZiB0aGUgb2JzZWwgd2FzIG5vdCBmb3VuZC5cbiAgXHQgKiBAdG9kbyB1c2UgS1RCUyBhYnN0cmFjdCBBUEkuXG4gIFx0ICovXG4gIGdldF9vYnNlbDogZnVuY3Rpb24oaWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgb2JzO1xuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmdldF9pZCgpID09PSBpZCkgeyBvYnMgPSBvOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9icztcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogU2V0cyB0aGUgbW9kZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIG1vZGVsIE1vZGVsIG9mIHRoZSB0cmFjZVxuICBcdCAqIEB0b2RvIFVQREFURSBXSEFUIElTIEEgTU9ERUxcbiAgXHQgKi9cbiAgc2V0X21vZGVsOiBmdW5jdGlvbihtb2RlbCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmVkaXRfbWV0YScpO1xuICB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBTZXRzIHRoZSBvcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIG9yaWdpbiBPcmlnaW4gb2YgdGhlIHRyYWNlXG4gIFx0ICogQHRvZG8gVVBEQVRFIFdIQVQgSVMgQU4gT1JJR0lOXG4gIFx0ICovXG4gIHNldF9vcmlnaW46IGZ1bmN0aW9uKG9yaWdpbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMub3JpZ2luID0gb3JpZ2luO1xuICAgIC8vXHR0aGlzLm9yaWdpbl9vZmZzZXQgPSAobmV3IERhdGUob3JpZ2luKSkuZ2V0TWlsbGlzZWNvbmRzKCk7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTplZGl0X21ldGEnKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmV0dXJucyB0aGUgZGVmYXVsdCBzdWJqZWN0IG9mIHRoZSB0cmFjZVxuICBcdCAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSB0cmFjZSBkZWZhdWx0IHN1YmplY3RcbiAgXHQgKi9cbiAgZ2V0X2RlZmF1bHRfc3ViamVjdDogZnVuY3Rpb24oKSB7IFwidXNlIHN0cmljdFwiO3JldHVybiB0aGlzLnN1YmplY3Q7fSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogU2V0IHRoZSBkZWZhdWx0IHN1YmplY3Qgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IHN1YmplY3QgVGhlIHRyYWNlIGRlZmF1bHQgc3ViamVjdFxuICBcdCAqL1xuICBzZXRfZGVmYXVsdF9zdWJqZWN0OiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5zdWJqZWN0ID0gc3ViamVjdDtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOmVkaXRfbWV0YScpO1xuICB9LFxuXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIENyZWF0ZSBhIG5ldyBvYnNlbCBpbiB0aGUgdHJhY2Ugd2l0aCB0aGVcbiAgXHQgKiBnaXZlbiBwcm9wZXJ0aWVzXG4gIFx0ICogQHBhcmFtIHtPYnNlbFBhcmFtfSBvYnNlbF9wYXJhbXMgUGFyYW1ldGVyc1xuICBcdCAqICAgICBjb3JyZXNwb25kaW5nIHRvIHRoZSBvYnNlbCB0byBjcmVhdGUuXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IG9ic2VsX3BhcmFtcy50eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuICBcdCAqIEBwYXJhbSB7TnVtYmVyfSBbb2JzZWxfcGFyYW1zLmJlZ2luXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgc3RhcnRzXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtvYnNlbF9wYXJhbXMuZW5kXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgZW5kc1xuICBcdCAqIEBwYXJhbSB7T2JqZWN0fSBbb2JzZWxfcGFyYW1zLmF0dHJpYnV0ZXNdIEF0dHJpYnV0ZXMgb2YgdGhlIG9ic2VsLlxuICBcdCAqIEBwYXJhbSB7QXJyYXk8UmVsYXRpb24+fSBbb2JzZWxfcGFyYW1zLnJlbGF0aW9uc10gUmVsYXRpb25zIGZyb20gdGhpcyBvYnNlbC5cbiAgXHQgKiBAcGFyYW0ge0FycmF5PFJlbGF0aW9uPn0gW29ic2VsX3BhcmFtcy5pbnZlcnNlX3JlbGF0aW9uc10gUmVsYXRpb25zIHRvIHRoaXMgb2JzZWwuXG4gIFx0ICogQHBhcmFtIHtBcnJheTxPYnNlbD59IFtvYnNlbF9wYXJhbXMuc291cmNlX29ic2Vsc10gU291cmNlIG9ic2VscyBvZiB0aGUgb2JzZWwuXG4gIFx0ICogQHBhcmFtIHtTdHJpbmd9IFtvYnNlbF9wYXJhbXMubGFiZWxdIExhYmVsIG9mIHRoZSBvYnNlbC5cbiAgXHQgKi9cbiAgY3JlYXRlX29ic2VsOiBmdW5jdGlvbihvYnNlbF9wYXJhbXMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBvYnNlbF9wYXJhbXMuaWQgPSB0aGlzLmNvdW50O1xuICAgIHRoaXMuY291bnQrKztcbiAgICBvYnNlbF9wYXJhbXMudHJhY2UgPSB0aGlzO1xuICAgIHZhciBvYnMgPSBuZXcgT2JzZWwob2JzZWxfcGFyYW1zKTtcbiAgICB0aGlzLm9ic2VsX2xpc3QucHVzaChvYnMpO1xuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6Y3JlYXRlX29ic2VsJywgb2JzKTtcbiAgfSxcbiAgLyoqXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogUmVtb3ZlcyB0aGUgZ2l2ZW4gb2JzZWwgZnJvbSB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0ge09ic2VsfSBvYnMgT2JzZWwgdG8gcmVtb3ZlXG4gIFx0ICovXG4gIHJlbW92ZV9vYnNlbDogZnVuY3Rpb24ob2JzKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5vYnNlbF9saXN0ID0gdGhpcy5vYnNlbF9saXN0LmZpbHRlcihmdW5jdGlvbihvKSB7XG4gICAgICByZXR1cm4gKG8gPT09IG9icyk/ZmFsc2U6dHJ1ZTtcbiAgICB9KTtcbiAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOnJlbW92ZV9vYnNlbCcsIG9icyk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEB0b2RvIFRPRE8gZG9jdW1lbnQgdGhpcyBtZXRob2RcbiAgXHQgKi9cbiAgdHJhbnNmb3JtOiBmdW5jdGlvbih0cmFuc2Zvcm1hdGlvbl9tZXRob2QsIHBhcmFtZXRlcnMpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdHJhbnNmb3JtYXRpb25fbWV0aG9kKHRoaXMsIHBhcmFtZXRlcnMpO1xuICB9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBUT0RPIGRvY3VtZW50IHRoaXMgbWV0aG9kXG4gIFx0ICovXG4gIHRyYW5zZm9ybWF0aW9uczoge1xuXG4gICAgZHVwbGljYXRlOiBmdW5jdGlvbih0cmFjZSkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAvLyBUT0RPIGJldHRlciBkZWVwIGNvcHlcbiAgICAgIHZhciB0cmFuc2Zvcm1lZF90cmFjZSA9IG5ldyBMb2NhbFRyYWNlKFt0cmFjZV0pO1xuICAgICAgdHJhY2UubGlzdF9vYnNlbHMoKS5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgfSk7XG4gICAgICB0cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbyA9IGUuZGF0YTtcbiAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdHJhbnNmb3JtZWRfdHJhY2U7XG4gICAgfSxcbiAgICBmaWx0ZXJfb2JzZWxfdHlwZTogZnVuY3Rpb24odHJhY2UsIG9wdCkge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICAvLyBUT0RPOiBpbXBsZW1lbnRcbiAgICAgIC8vIFRPRE8gYmV0dGVyIGRlZXAgY29weVxuICAgICAgdmFyIHRyYW5zZm9ybWVkX3RyYWNlID0gbmV3IExvY2FsVHJhY2UoW3RyYWNlXSk7XG4gICAgICB0cmFjZS5saXN0X29ic2VscygpLmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgICBpZiAob3B0LnR5cGVzLnNvbWUoZnVuY3Rpb24odHlwZSkge3JldHVybiB0eXBlID09PSBvLmdldF9vYnNlbF90eXBlKCk7fSkpIHtcbiAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IFwia2VlcFwiKSB7XG4gICAgICAgICAgICB0cmFuc2Zvcm1lZF90cmFjZS5jcmVhdGVfb2JzZWwoby50b19PYmplY3QoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChvcHQubW9kZSA9PT0gXCJyZW1vdmVcIikge1xuICAgICAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICB0cmFjZS5vbigndHJhY2U6Y3JlYXRlX29ic2VsJywgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgbyA9IGUuZGF0YTtcbiAgICAgICAgaWYgKG9wdC50eXBlcy5zb21lKGZ1bmN0aW9uKHR5cGUpIHtyZXR1cm4gdHlwZSA9PT0gby5nZXRfb2JzZWxfdHlwZSgpO30pKSB7XG4gICAgICAgICAgaWYgKG9wdC5tb2RlID09PSBcImtlZXBcIikge1xuICAgICAgICAgICAgdHJhbnNmb3JtZWRfdHJhY2UuY3JlYXRlX29ic2VsKG8udG9fT2JqZWN0KCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IFwicmVtb3ZlXCIpIHtcbiAgICAgICAgICAgIHRyYW5zZm9ybWVkX3RyYWNlLmNyZWF0ZV9vYnNlbChvLnRvX09iamVjdCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRyYW5zZm9ybWVkX3RyYWNlO1xuICAgIH0sXG4gIH0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IExvY2FsVHJhY2U7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoXCJqcXVlcnlcIik7XG5cbi8qKlxuKiBPYnNlbCBpcyBhIHNob3J0bmFtZSBmb3IgdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLk9ic2VsfVxuKiBvYmplY3QuXG4qIEB0eXBlZGVmIE9ic2VsXG4qIEBzZWUgU2Ftb3RyYWNlcy5PYnNlbFxuKi9cblxuLyoqXG4qIE9ic2VsUGFyYW0gaXMgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgcGFyYW1ldGVyc1xuKiBuZWNlc3NhcnkgdG8gY3JlYXRlIGEgbmV3IG9ic2VsLlxuKiBUaGlzIHR5cGUgb2Ygb2JqZWN0IGlzIHVzZWQgaW4gc2V2ZXJhbCBtZXRob2RzXG4qIHN1Y2ggYXMgdGhlIE9ic2VsIGNvbnN0cnVjdG9yLCBvciB0aGVcbiogVHJhY2UuY3JlYXRlX29ic2VsIG1ldGhvZC5cbiogVGhlIG9wdGlvbmFsIHBvcnBlcnRpZXMgdmFyaWVzIGRlcGVuZGluZyBvbiB0aGVcbiogbWV0aG9kIGNhbGxlZC5cbiogQHR5cGVkZWYgT2JzZWxQYXJhbVxuKiBAcHJvcGVydHkge1N0cmluZ30gW2lkXSBJZCBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtUcmFjZX0gW3RyYWNlXSBUcmFjZSBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlXSBUeXBlIG9mIHRoZSBvYnNlbFxuKiBAcHJvcGVydHkge051bWJlcn0gW2JlZ2luXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgc3RhcnRzXG4qIEBwcm9wZXJ0eSB7TnVtYmVyfSBbZW5kXSBUaW1lc3RhbXAgb2Ygd2hlbiB0aGUgb2JzZWwgZW5kc1xuKiBAcHJvcGVydHkge09iamVjdH0gW2F0dHJpYnV0ZXNdIEF0dHJpYnV0ZXMgb2YgdGhlIG9ic2VsLlxuKiBAcHJvcGVydHkge0FycmF5PFJlbGF0aW9uPn0gW3JlbGF0aW9uc10gUmVsYXRpb25zIGZyb20gdGhpcyBvYnNlbC5cbiogQHByb3BlcnR5IHtBcnJheTxSZWxhdGlvbj59IFtpbnZlcnNlX3JlbGF0aW9uc10gUmVsYXRpb25zIHRvIHRoaXMgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7QXJyYXk8T2JzZWw+fSBbc291cmNlX29ic2Vsc10gU291cmNlIG9ic2VscyBvZiB0aGUgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7U3RyaW5nfSBbcGFyYW0ubGFiZWxdIExhYmVsIG9mIHRoZSBvYnNlbC5cbiogQHRvZG8gRklYTUUgREVGSU5FIFdIQVQgSVMgQSBSRUxBVElPTlxuKi9cblxuLyoqXG4qIEBzdW1tYXJ5IEphdmFTY3JpcHQgT2JzZWwgY2xhc3NcbiogQGNsYXNzIEphdmFTY3JpcHQgT2JzZWwgY2xhc3NcbiogQHBhcmFtIHtPYnNlbFBhcmFtfSBwYXJhbSBQYXJhbWV0ZXJzIG9mIHRoZSBvYnNlbFxuKiBAcGFyYW0ge1N0cmluZ30gcGFyYW0uaWQgSWRlbnRpZmllciBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7VHJhY2V9IHBhcmFtLlRyYWNlIFRyYWNlIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtTdHJpbmd9IHBhcmFtLnR5cGUgVHlwZSBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7TnVtYmVyfSBbcGFyYW0uYmVnaW49RGF0ZS5ub3coKV0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtLmVuZD1wYXJhbS5iZWdpbl0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiogQHBhcmFtIHtPYmplY3R9IFtwYXJhbS5hdHRyaWJ1dGVzXSBBdHRyaWJ1dGVzIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtBcnJheTxSZWxhdGlvbj59IFtwYXJhbS5yZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4qIEBwYXJhbSB7QXJyYXk8UmVsYXRpb24+fSBbcGFyYW0uaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuKiBAcGFyYW0ge0FycmF5PE9ic2VsPn0gW3BhcmFtLnNvdXJjZV9vYnNlbHNdIFNvdXJjZSBvYnNlbHMgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge1N0cmluZ30gW3BhcmFtLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qIEB0b2RvIEZJWE1FIFJFTEFUSU9OUyBBUkUgTk9UIFlFVCBTVVBQT1JURURcbiovXG5cbnZhciBPYnNlbCA9IGZ1bmN0aW9uIE9ic2VsKHBhcmFtKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAnaWQnKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ3RyYWNlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0eXBlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2JlZ2luJyxcdERhdGUubm93KCkpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdlbmQnLFx0XHR0aGlzLmJlZ2luKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnYXR0cmlidXRlcycsXHR7fSk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdyZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2ludmVyc2VfcmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdzb3VyY2Vfb2JzZWxzJyxcdFx0W10pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnbGFiZWwnLFx0XHRcIlwiKTtcbn07XG5cbk9ic2VsLnByb3RvdHlwZSA9IHtcbiAgLy8gQVRUUklCVVRFU1xuICBhdHRyaWJ1dGVzOiB7fSxcbiAgcmVsYXRpb25zOiBbXSxcbiAgaW52ZXJzZV9yZWxhdGlvbnM6IFtdLFxuICBzb3VyY2Vfb2JzZWxzOiBbXSxcbiAgbGFiZWw6IFwiXCIsXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIHNldCB0aGUgYXR0cmlidXRlIG9mIHRoZSBzYW1lIG5hbWUgd2l0aCB0aGUgZGVmYXVsdFxuICAqIHZhbHVlLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICogQHBhcmFtIHZhbHVlIERlZmF1bHQgdmFsdWVcbiAgKiBAcHJpdmF0ZVxuKi9cbiAgX3ByaXZhdGVfY2hlY2tfZGVmYXVsdDogZnVuY3Rpb24ocGFyYW0sIGF0dHIsIHZhbHVlKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzW2F0dHJdID0gKHBhcmFtW2F0dHJdICE9PSB1bmRlZmluZWQpP3BhcmFtW2F0dHJdOnZhbHVlO1xufSxcbiAgLyoqXG4gICogSWYgYXR0cmlidXRlIGV4aXN0cywgdGhlbiBzZXQgdGhlIGNsYXNzIGF0dHJpYnV0ZVxuICAqIG9mIHRoZSBzYW1lIG5hbWUgdG8gdGhlIGF0dHJpYnV0ZSB2YWx1ZSwgb3RoZXJ3aXNlXG4gICogbm90aGluZyBoYXBwZW5zLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX3VuZGVmOiBmdW5jdGlvbihwYXJhbSwgYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHBhcmFtW2F0dHJdICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzW2F0dHJdID0gcGFyYW1bYXR0cl07XG4gIH1cbn0sXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIHRocm93IGFuIGVycm9yLlxuICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbSBPYmplY3QgZnJvbSB3aGljaCBhdHRyaWJ1dGUgaXMgY29waWVkXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgTmFtZSBvZiB0aGUgYXR0cmlidXRlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX2Vycm9yOiBmdW5jdGlvbihwYXJhbSwgYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKHBhcmFtW2F0dHJdICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzW2F0dHJdID0gcGFyYW1bYXR0cl07XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgXCJQYXJhbWV0ZXIgXCIgKyBhdHRyICsgXCIgcmVxdWlyZWQuXCI7XG4gIH1cbn0sXG4gIC8vIFJFU09VUkNFXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmVtb3ZlIHRoZSBvYnNlbCBmcm9tIGl0cyB0cmFjZS5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBSZW1vdmUgdGhlIG9ic2VsIGZyb20gaXRzIHRyYWNlLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOnJlbW92ZV9vYnNlbH0gZXZlbnRcbiovXG4gIHJlbW92ZTogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLmdldF90cmFjZSgpLnJlbW92ZV9vYnNlbCh0aGlzKTtcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtTdHJpbmd9IElkIG9mIHRoZSBvYnNlbC5cbiovXG4gIGdldF9pZDogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICByZXR1cm4gdGhpcy5pZDtcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgbGFiZWwgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtTdHJpbmd9IExhYmVsIG9mIHRoZSBvYnNlbC5cbiovXG4gIGdldF9sYWJlbDogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICByZXR1cm4gdGhpcy5sYWJlbDtcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgbGFiZWwgb2YgdGhlIE9ic2VsLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qL1xuICBzZXRfbGFiZWw6IGZ1bmN0aW9uKGxibCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLmxhYmVsID0gbGJsOyB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbCB0byB0aGUgZW1wdHkgc3RyaW5nLlxuKi9cbiAgcmVzZXRfbGFiZWw6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbnRoaXMubGFiZWwgPSBcIlwiOyB9LFxuICAvLyBPQlNFTFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHRyYWNlIHRoZSBPYnNlbCBiZWxvbmdzIHRvLlxuICAqIEByZXR1cm5zIHtUcmFjZX0gVHJhY2UgdGhlIE9ic2VsIGJlbG9uZ3MgdG8uXG4qL1xuICBnZXRfdHJhY2U6IFx0XHRmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5yZXR1cm4gdGhpcy50cmFjZTsgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSB0eXBlIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBUeXBlIG9mIHRoZSBvYnNlbC5cbiAgKiBAdG9kbyBUT0RPIGRpZmZlcnMgZnJvbSBLVEJTIEFQSSAtPiBleHByZXNzIGl0IGNsZWFybHlcbiovXG4gIGdldF90eXBlOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5yZXR1cm4gdGhpcy50eXBlOyB9LFxuICAvKipcbiAgKiBSZXR1cm5zIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiovXG4gIGdldF9iZWdpbjogXHRcdGZ1bmN0aW9uKCkge1xuICAgIC8vcmV0dXJuIHRoaXMuZ2V0X3RyYWNlKCkuZ2V0X29yaWdpbl9vZmZzZXQoKSArIHRoaXMuYmVnaW47XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuYmVnaW47XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIEByZXR1cm5zIHtOdW1iZXJ9IFRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiovXG4gIGdldF9lbmQ6IFx0XHRmdW5jdGlvbigpIHtcbiAgICAvL3JldHVybiB0aGlzLmdldF90cmFjZSgpLmdldF9vcmlnaW5fb2Zmc2V0KCkgKyB0aGlzLmVuZDtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy5lbmQ7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogU2V0cyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogQGRlc2NyaXB0aW9uXG4gICogU2V0cyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAcGFyYW1zIHtTdHJpbmd9IHR5cGUgVHlwZSBvZiB0aGUgb2JzZWwuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X29ic2VsX3R5cGU6IGZ1bmN0aW9uKHR5cGUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgc3RhcnRzLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgc3RhcnRzLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7TnVtYmVyfSBiZWdpbiBUaW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAdG9kbyBUT0RPIG5vdCBLVEJTIEFQSSBjb21wbGlhbnRcbiAgKiBAZGVwcmVjYXRlZCBUaGlzIG1ldGhvZCBtaWdodCBub3QgYmUgc3VwcG9ydGVkIGluIHRoZSBmdXR1cmUuXG4qL1xuICBmb3JjZV9zZXRfYmVnaW46IGZ1bmN0aW9uKGJlZ2luKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5iZWdpbiA9IGJlZ2luO1xuICAgIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogVGhlIHRyYWNlIHdpbGwgdHJpZ2dlciBhXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjdHJhY2U6ZWRpdF9vYnNlbH0gZXZlbnRcbiAgKiBAcGFyYW1zIHtOdW1iZXJ9IGVuZCBUaW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X2VuZDogXHRmdW5jdGlvbihlbmQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLmVuZCA9IGVuZDtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBzb3VyY2UgT2JzZWxzIG9mIHRoZSBjdXJyZW50IE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxPYnNlbD59IFNvdXJjZSBPYnNlbHMgb2YgdGhlIGN1cnJlbnQgT2JzZWwuXG4qL1xuICBsaXN0X3NvdXJjZV9vYnNlbHM6IFx0ZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMubGlzdF9zb3VyY2Vfb2JzZWxzID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIFtdOyB9XG4gICAgcmV0dXJuIHRoaXMuc291cmNlX29ic2VscztcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBhdHRyaWJ1dGUgbmFtZXMgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fSBBdHRyaWJ1dGUgbmFtZXMgb2YgdGhlIE9ic2VsLlxuKi9cbiAgbGlzdF9hdHRyaWJ1dGVfdHlwZXM6IFx0ZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICAgIHZhciBhdHRycyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkgICAgICB7XG4gICAgICAgIGF0dHJzLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYXR0cnM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgcmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEByZXR1cm5zIHtBcnJheTxTdHJpbmc+fSBSZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuKi9cbiAgbGlzdF9yZWxhdGlvbl90eXBlczogXHRmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmICh0aGlzLnJlbGF0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICB2YXIgcmVscyA9IFtdO1xuICB0aGlzLnJlbGF0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uKHIpIHtcbiAgICAvL3ZhciB1bmlxdWVOYW1lcyA9IFtdO1xuICAgIGlmICgkLmluQXJyYXkoci50eXBlLCByZWxzKSA9PT0gLTEpIHtcbiAgICAgIHJlbHMucHVzaChyLnR5cGUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZWxzO1xufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBPYnNlbHMgcmVsYXRlZCB0byB0aGUgY3VycmVudCBPYnNlbCB3aXRoIHRoZSBnaXZlbiByZWxhdGlvbiB0eXBlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSByZWxhdGlvbl90eXBlIFJlbGF0aW9uIHR5cGUuXG4gICogQHJldHVybnMge0FycmF5PE9ic2VsPn0gT2JzZWxzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuKi9cbiAgbGlzdF9yZWxhdGVkX29ic2VsczogXHRmdW5jdGlvbihyZWxhdGlvbl90eXBlKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgb2JzcyA9IFtdO1xuICBpZiAodGhpcy5yZWxhdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMucmVsYXRpb25zLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICAgIGlmIChyLnR5cGUgPT09IHJlbGF0aW9uX3R5cGUpIHtcbiAgICAgICAgb2Jzcy5wdXNoKHIub2JzZWxfdG8pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmICh0aGlzLmludmVyc2VfcmVsYXRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmludmVyc2VfcmVsYXRpb25zLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICAgIGlmIChyLnR5cGUgPT09IHJlbGF0aW9uX3R5cGUpIHtcbiAgICAgICAgb2Jzcy5wdXNoKHIub2JzZWxfdG8pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYnNzO1xufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIHJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gSW52ZXJzZSByZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuKi9cbiAgbGlzdF9pbnZlcnNlX3JlbGF0aW9uX3R5cGVzOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmICh0aGlzLmludmVyc2VfcmVsYXRpb25zID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIFtdOyB9XG4gIHZhciByZWxzID0gW107XG4gIHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICBpZiAoJC5pbkFycmF5KHIudHlwZSwgcmVscykgPT09IC0xKSB7XG4gICAgICByZWxzLnB1c2goci50eXBlKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gcmVscztcbn0sXG4gIC8vXHRkZWxfYXR0cmlidXRlX3ZhbHVlOlx0ZnVuY3Rpb24oYXR0cikge30sIC8vIFRPRE8gZXJyZXVyIGRlIGwnQVBJIEtUQlM/XG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYW4gYXR0cmlidXRlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIEF0dHJpYnV0ZSBuYW1lLlxuICAqIEByZXR1cm5zIHtPYmplY3R9IEF0dHJpYnV0ZSB2YWx1ZS5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcbiovXG4gIGdldF9hdHRyaWJ1dGU6XHRmdW5jdGlvbihhdHRyKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAodGhpcy5hdHRyaWJ1dGVzW2F0dHJdID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBcIkF0dHJpYnV0ZSBcIiArIGF0dHIgKyBcIiBpcyBub3QgZGVmaW5lZFwiOyAvLyBUT0RPXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgfVxufSxcbiAgLy9cdGRlbF9hdHRyaWJ1dGVfdmFsdWU6XHRmdW5jdGlvbihhdHRyKSB7fSwgLy8gVE9ETyBlcnJldXIgZGUgbCdBUEkgS1RCUz9cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUuXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgQXR0cmlidXRlIG5hbWUuXG4gICogQHBhcmFtIHtPYmplY3R9IHZhbCBBdHRyaWJ1dGUgdmFsdWUuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBzZXRfYXR0cmlidXRlOlx0ZnVuY3Rpb24oYXR0ciwgdmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB0aGlzLmF0dHJpYnV0ZXNbYXR0cl0gPSB2YWw7XG4gIHRoaXMudHJhY2UudHJpZ2dlcigndHJhY2U6ZWRpdF9vYnNlbCcsIHRoaXMpO1xuICAvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxufSxcbiAgLy9cdGRlbF9hdHRyaWJ1dGVfdmFsdWU6XHRmdW5jdGlvbihhdHRyKSB7fSwgLy8gVE9ETyBlcnJldXIgZGUgbCdBUEkgS1RCUz9cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZW1vdmVzIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBSZW1vdmVzIHRoZSBhdHRyaWJ1dGUgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTplZGl0X29ic2VsfSBldmVudFxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBdHRyaWJ1dGUgbmFtZS5cbiovXG4gIGRlbF9hdHRyaWJ1dGU6XHRcdFx0ZnVuY3Rpb24oYXR0cikge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgZGVsZXRlIHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgdGhpcy50cmFjZS50cmlnZ2VyKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcyk7XG4gIC8vIFRPRE8gZW52b3llciB1biBldmVudCBwb3VyIGRpZXIgcXVlIGwnb2JzZWwgYSBjaGFuZ8OpXG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIEFkZHMgYSByZWxhdGlvbiB3aXRoIGFuIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIE5PVCBZRVQgSU1QTEVNRU5URURcbiAgKiBAcGFyYW0ge1N0cmluZ30gcmVsIFJlbGF0aW9uIHR5cGUuXG4gICogQHBhcmFtIHtPYnNlbH0gb2JzIFRhcmdldCBPYnNlbC5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcbiovXG4gIGFkZF9yZWxhdGVkX29ic2VsOlx0XHRmdW5jdGlvbihyZWwsIG9icykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBUT0RPXG4gIHRocm93IFwibWV0aG9kIG5vdCBpbXBsZW1lbnRlZCB5ZXRcIjtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmVtb3ZlcyBhIHJlbGF0aW9uIHdpdGggYW4gT2JzZWwuXG4gICogQGRlc2NyaXB0aW9uXG4gICogTk9UIFlFVCBJTVBMRU1FTlRFRFxuICAqIEBwYXJhbSB7U3RyaW5nfSByZWwgUmVsYXRpb24gdHlwZS5cbiAgKiBAcGFyYW0ge09ic2VsfSBvYnMgVGFyZ2V0IE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSVxuKi9cbiAgZGVsX3JlbGF0ZWRfb2JzZWw6XHRcdGZ1bmN0aW9uKHJlbCwgb2JzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRPRE9cbiAgdGhyb3cgXCJtZXRob2Qgbm90IGltcGxlbWVudGVkIHlldFwiO1xuICAvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxufSxcblxuICAvLyBOT1QgSU4gS1RCUyBBUElcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBDb3BpZXMgdGhlIE9ic2VsIHByb3BlcnRpZXMgaW4gYW4gT2JqZWN0LlxuICAqIEBkZXNjcmlwdGlvblxuICAqIENvcGllcyB0aGUgT2JzZWwgcHJvcGVydGllcyBpbiBhbiBPYmplY3RcbiAgKiB0aGF0IGNhbiBiZSB1c2VkIHRvIGNyZWF0ZSBhbiBPYnNlbCB3aXRoXG4gICoge0BsaW5rIFNhbW90cmFjZXMuT2JzZWwjT2JzZWx9IGNvbnN0cnVjdG9yIG9yXG4gICoge0BsaW5rIFNhbW90cmFjZXMuVHJhY2UjY3JlYXRlX29ic2VsfSBtZXRob2QuXG4gICogQHJldHVybnMge09iamVjdH0gT2JqZWN0IHRoYXRcbiovXG4gIHRvX09iamVjdDogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgb2JqID0ge1xuICAgIGlkOiB0aGlzLmlkLFxuICAgIHR5cGU6IHRoaXMudHlwZSxcbiAgICBiZWdpbjogdGhpcy5iZWdpbixcbiAgICBlbmQ6IHRoaXMuZW5kLFxuICAgIGF0dHJpYnV0ZXM6IHt9LFxuICAgIC8vIHVzZSAuc2xpY2UgdG8gY29weVxuICAgIC8vIFRPRE8gaXMgaXQgZW5vdWdoPyA8LSBtaWdodCBjcmVhdGUgYnVnc1xuICAgIHJlbGF0aW9uczogdGhpcy5yZWxhdGlvbnMuc2xpY2UoKSxcbiAgICBpbnZlcnNlX3JlbGF0aW9uczogdGhpcy5pbnZlcnNlX3JlbGF0aW9ucy5zbGljZSgpLFxuICAgIHNvdXJjZV9vYnNlbHM6IHRoaXMuc291cmNlX29ic2Vscy5zbGljZSgpLFxuICAgIGxhYmVsOiB0aGlzLmxhYmVsXG4gIH07XG4gIC8vIGNvcHkgZWFjaCBhdHRyaWJ1dGVzXG4gIGZvciAodmFyIGF0dHIgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgaWYgKHRoaXMuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkge1xuICAgICAgb2JqLmF0dHJpYnV0ZXNbYXR0cl0gPSB0aGlzLmF0dHJpYnV0ZXNbYXR0cl07XG4gICAgfVxuICB9XG4gIHJldHVybiBvYmo7XG59LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYnNlbDtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuKiBTZWxlY3RvciBpcyBhIHNob3J0bmFtZSBmb3IgdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLlNlbGVjdG9yfVxuKiBvYmplY3QuXG4qIEB0eXBlZGVmIFNlbGVjdG9yXG4qIEBzZWUgU2Ftb3RyYWNlcy5TZWxlY3RvclxuKi9cbi8qKlxuKiBAc3VtbWFyeSBPYmplY3QgdGhhdCBzdG9yZXMgYSBzZWxlY3Rpb24gb2Ygb2JqZWN0c1xuKiBAY2xhc3MgT2JqZWN0IHRoYXQgc3RvcmVzIGEgc2VsZWN0aW9uIG9mIG9iamVjdHNcbiogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiogQGNvbnN0cnVjdG9yXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuKiBAZmlyZXMgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246YWRkXG4qIEBmaXJlcyBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjpyZW1vdmVcbiogQGZpcmVzIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmVtcHR5XG4qIEBkZXNjcmlwdGlvblxuKiBUaGUge0BsaW5rIFNhbW90cmFjZXMuU2VsZWN0b3J8U2VsZWN0b3J9IG9iamVjdFxuKiBpcyBhIEphdmFzY3JpcHQgb2JqZWN0IHRoYXQgc3RvcmVzIGEgc2VsZWN0aW9uIG9mIE9iamVjdHMuXG4qIFRoaXMgT2JqZWN0IHN0b3JlcyBPYmplY3RzIHRoYXQgYXJlIHNlbGVjdGVkIGFuZCBpbmZvcm1zXG4qIHdpZGdldHMgb3Igb3RoZXIgb2JqZWN0cyAodmlhIHRoZVxuKiB0cmlnZ2VyZWQgZXZlbnRzKSB3aGVuIHRoZSBzZWxlY3Rpb24gY2hhbmdlcy5cbiogV2hlbiBmaXJzdCBpbnN0YW5jaWF0ZWQsIHRoZSBzZWxlY3Rpb24gaXMgZW1wdHkuXG4qXG4qIEluIG9yZGVyIHRvIHNlbGVjdCBhbiBvYmplY3QsIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3R8U2VsZWN0b3Ijc2VsZWN0KCl9XG4qIG1ldGhvZCBoYXMgdG8gYmUgY2FsbGVkLlxuKiBTaW1pbGFybHksIGluIG9yZGVyIHRvIHVuc2VsZWN0IGFuIG9iamVjdCwgdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLlNlbGVjdG9yI3Vuc2VsZWN0fFNlbGVjdG9yI3Vuc2VsZWN0KCl9XG4qIG1ldGhvZCBoYXMgdG8gYmUgY2FsbGVkLlxuKiBUaGUgd2hvbGUgc2VsZWN0aW9uIGNhbiBiZSBlbXB0aWVkIGF0IG9uY2Ugd2l0aCB0aGVcbioge0BsaW5rIFNhbW90cmFjZXMuU2VsZWN0b3IjZW1wdHl8U2VsZWN0b3IjZW1wdHkoKX1cbiogbWV0aG9kLlxuKlxuKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIEEgc3RyaW5nIGRlc2NyaWJpbmcgdGhlIHR5cGUgb2ZcbiogICAgIG9iamVjdCB0byBiZSBzZWxlY3RlZCAoJ09ic2VsJywgJ1RyYWNlJywgJ1RpbWVXaW5kb3cnLCBldGMuKS5cbiogQHBhcmFtIHtzdHJpbmd9IFtzZWxlY3Rpb25fbW9kZT0nc2luZ2xlJ11cbiogICAgIEluICdzaW5nbGUnIG1vZGUsIHRoZSBzZWxlY3Rpb24gY29udGFpbnMgb25lIG9iamVjdCBtYXhpbXVtLlxuKiAgICAgVGhpcyBtZWFucyB0aGF0IGFkZGluZyBhbiBvYmplY3QgdG8gYSBub24tZW1wdHkgc2VsZWN0aW9uXG4qICAgICB3aWxsIHJlcGxhY2UgdGhlIHByZXZpb3VzbHkgc2VsZWN0ZWQgb2JqZWN0IHdpdGggdGhlIG5ldyBvbmUuXG4qICAgICBJbiAnbXVsdGlwbGUnIG1vZGUsIHRoZSBzZWxlY3Rpb24gY2FuIGJlIGV4dGVuZGVkIGFuZCBvYmplY3RzXG4qICAgICBjYW4gYmUgaW5kaXZpZHVhbGx5IGFkZGVkIG9yIHJlbW92ZWQuXG4qIEBwYXJhbSB7RXZlbnRDb25maWd9XHRbZXZlbnRzXVxuKiAgICAgRXZlbnRzIHRvIGxpc3RlbiB0byBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyBjYWxsYmFja3MuXG4qL1xudmFyIFNlbGVjdG9yID0gZnVuY3Rpb24odHlwZSwgc2VsZWN0aW9uX21vZGUsIGV2ZW50cykge1xuICAvLyBBZGRpbmcgdGhlIE9ic2VydmFibGUgdHJhaXRcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMsIGV2ZW50cyk7XG4gIHRoaXMubW9kZSA9IHNlbGVjdGlvbl9tb2RlIHx8ICdzaW5nbGUnOyAvLyBvdGhlciBvcHRpb24gaXMgJ211bHRpcGxlJ1xuICB0aGlzLnR5cGUgPSB0eXBlO1xuICB0aGlzLnNlbGVjdGlvbiA9IFtdO1xuICAvLyBUT0RPOiBham91dGVyIGV2ZW50TGlzdGVuZXIgc3VyIFRyYWNlIHNpIHR5cGUgPSBvYnNlbFxuICAvLyAtPiBRdWFuZCBcInRyYWNlOnJlbW92ZTpvYnNlbFwiIC0+IHbDqXJpZmllIHNpIHVuIG9ic2VsIGFcbiAgLy8gw6l0w6kgc3VwcHJpbcOpIGRlIGxhIHPDqWxlY3Rpb24uXG59O1xuXG5TZWxlY3Rvci5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAqIE1ldGhvZCB0byBjYWxsIHRvIHNlbGVjdCBhbiBPYmplY3QuXG4gICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAqICAgICBPYmplY3QgdG8gYWRkIHRvIHRoZSBzZWxlY3Rpb25cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246YWRkXG4gICovXG4gIHNlbGVjdDogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICBpZiAodGhpcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XG4gICAgICB0aGlzLnNlbGVjdGlvbi5wdXNoKG9iamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uID0gW29iamVjdF07XG4gICAgfVxuICAgIC8qKlxuICAgICogT2JqZWN0IHNlbGVjdGVkIGV2ZW50LlxuICAgICogQGV2ZW50IFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmFkZFxuICAgICogQHR5cGUge29iamVjdH1cbiAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIGV2ZW50ICg9IFwic2VsZWN0aW9uOmFkZFwiKS5cbiAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBkYXRhIC0gVGhlIHNlbGVjdGVkIG9iamVjdC5cbiAgICAqL1xuICAgIHRoaXMudHJpZ2dlcignc2VsZWN0aW9uOmFkZCcsIG9iamVjdCk7XG4gIH0sXG4gIC8qKlxuICAqIE1ldGhvZCB0byBlbXB0eSB0aGUgY3VycmVudCBzZWxlY3Rpb24uXG4gICogQGZpcmVzIFNhbW90cmFjZXMuU2VsZWN0b3Ijc2VsZWN0aW9uOmVtcHR5XG4gICovXG4gIGVtcHR5OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLnNlbGVjdGlvbiA9IFtdO1xuICAgIC8qKlxuICAgICogT2JqZWN0IHVuc2VsZWN0ZWQgZXZlbnQuXG4gICAgKiBAZXZlbnQgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246ZW1wdHlcbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInNlbGVjdGlvbjplbXB0eVwiKS5cbiAgICAqL1xuICAgIHRoaXMudHJpZ2dlcignc2VsZWN0aW9uOmVtcHR5Jyk7XG4gIH0sXG4gIC8qKlxuICAqIE1ldGhvZCB0aGF0IGNoZWNrcyBpZiB0aGUgc2VsZWN0aW9uIGlzIGVtcHR5XG4gICogQHJldHVybnMge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiB0aGUgc2VsZWN0aW9uIGFuZCBlbXB0eVxuICAqICAgICBhbmQgZmFsc2UgaWYgdGhlIHNlbGVjdGlvbiBpcyBub3QgZW1wdHkuXG4gICovXG4gIGlzX2VtcHR5OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gKHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCk7XG4gIH0sXG4gIC8qKlxuICAqIEdldHMgdGhlIGN1cnJlbnQgc2VsZWN0aW9uXG4gICogQHJldHVybnMge0FycmF5fSBBcnJheSBvZiBzZWxlY3RlZCBvYmplY3RzXG4gICovXG4gIGdldF9zZWxlY3Rpb246IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbjtcbiAgfSxcbiAgLyoqXG4gICogTWV0aG9kIHRvIGNhbGwgdG8gcmVtb3ZlIGFuIE9iamVjdCBmcm9tIHRoZSBzZWxlY3Rpb24uXG4gICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAqICAgICBPYmplY3QgdG8gcmVtb3ZlIGZyb20gdGhlIHNlbGVjdGlvblxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlNlbGVjdG9yI3NlbGVjdGlvbjpyZW1vdmVcbiAgKi9cbiAgdW5zZWxlY3Q6IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgICAgdGhpcy5zZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbi5maWx0ZXIoZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgaWYgKGVsID09PSBvYmplY3QpIHtcbiAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGlmICghZm91bmQpIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsZWN0aW9uID0gW107XG4gICAgfVxuICAgIC8qKlxuICAgICogT2JqZWN0IHVuc2VsZWN0ZWQgZXZlbnQuXG4gICAgKiBAZXZlbnQgU2Ftb3RyYWNlcy5TZWxlY3RvciNzZWxlY3Rpb246cmVtb3ZlXG4gICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHR5cGUgLSBUaGUgdHlwZSBvZiB0aGUgZXZlbnQgKD0gXCJzZWxlY3Rpb246cmVtb3ZlXCIpLlxuICAgICovXG4gICAgdGhpcy50cmlnZ2VyKCdzZWxlY3Rpb246cmVtb3ZlJywgb2JqZWN0KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgLyoqXG4gICogTWV0aG9kIHRvIGNhbGwgdG8gdG9nZ2xlIHRoZSBzZWxlY3Rpb24gb2YgYW4gT2JqZWN0LlxuICAqIElmIHRoZSBPYmplY3Qgd2FzIHByZXZpb3VzbHkgdW5zZWxlY3RlZCwgaXQgYmVjb21lcyBzZWxlY3RlZC5cbiAgKiBJZiB0aGUgT2JqZWN0IHdhcyBwcmV2aW91c2x5IHNlbGVjdGVkLCBpdCBiZWNvbWVzIHVuc2VsZWN0ZWQuXG4gICogQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAqICAgIE9iamVjdCB0byB0b2dnbGUgZnJvbSB0aGUgc2VsZWN0aW9uXG4gICovXG4gIHRvZ2dsZTogZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMubW9kZSA9PT0gJ211bHRpcGxlJykge1xuICAgICAgaWYgKCF0aGlzLnVuc2VsZWN0KG9iamVjdCkpIHtcbiAgICAgICAgdGhpcy5zZWxlY3Qob2JqZWN0KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0aW9uLmxlbmd0aCA9PT0gMCB8fCB0aGlzLnNlbGVjdGlvblswXSAhPT0gb2JqZWN0KSB7XG4gICAgICAgIHRoaXMuc2VsZWN0KG9iamVjdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVuc2VsZWN0KG9iamVjdCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdG9yO1xuIiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuL0V2ZW50SGFuZGxlci5qc1wiKTtcblxuLyoqXG4qIFRpbWVXaW5kb3cgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5UaW1lV2luZG93fVxuKiBvYmplY3QuXG4qIEB0eXBlZGVmIFRpbWVXaW5kb3dcbiogQHNlZSBTYW1vdHJhY2VzLlRpbWVXaW5kb3dcbiovXG4vKipcbiogQHN1bW1hcnkgT2JqZWN0IHRoYXQgc3RvcmVzIHRoZSBjdXJyZW50IHRpbWUgd2luZG93XG4qIEBjbGFzcyBPYmplY3QgdGhhdCBzdG9yZXMgdGhlIGN1cnJlbnQgdGltZSB3aW5kb3dcbiogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiogQGNvbnN0cnVjdG9yXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuKiBAZGVzY3JpcHRpb25cbiogVGhlIHtAbGluayBTYW1vdHJhY2VzLlRpbWVXaW5kb3d9IG9iamVjdCBpcyBhIEphdmFzY3JpcHQgT2JqZWN0XG4qIHRoYXQgc3RvcmVzIHRoZSBjdXJyZW50IHRpbWUgd2luZG93LlxuKiBUaGlzIE9iamVjdCBzdG9yZXMgYSB0aW1lIHdpbmRvdyBhbmQgaW5mb3JtcyB3aWRnZXRzIG9yIG90aGVyXG4qIG9iamVjdHMgd2hlbiB0aGUgdGltZSB3aW5kb3cgY2hhbmdlcyB2aWEgdGhlXG4qIHtAbGluayBTYW1vdHJhY2VzLlRpbWVXaW5kb3cjdHc6dXBkYXRlfHR3OnVwZGF0ZX1cbiogZXZlbnQuXG4qIEEge0BsaW5rIFNhbW90cmFjZXMuVGltZVdpbmRvd3xUaW1lV2luZG93fSBjYW4gYmUgZGVmaW5lZCBpbiB0d28gd2F5czpcbipcbiogMS4gIGJ5IGRlZmluaW5nIGEgbG93ZXIgYW5kIHVwcGVyIGJvdW5kXG4qIDIuICBieSBkZWZpbmluZyBhIHRpbWVyIGFuZCBhIHdpZHRoLlxuKlxuKiBAcGFyYW0ge09iamVjdH0gb3B0XHRPcHRpb24gcGFyYW1ldGVyIHRoYXQgZGVmaW5lcyB0aGUgdGltZVxuKiAgICAgd2luZG93LiBWYXJpYWJsZXMgb3B0LnN0YXJ0IGFuZCBvcHQuZW5kIG11c3RcbiogICAgIGJlIGRlZmluZWQgaWYgdXNpbmcgbG93ZXIgYW5kIHVwcGVyIGJvdW5kIGRlZmluaXRpb24uXG4qICAgICBWYXJpYWJsZXMgb3B0LnRpbWVyIGFuZCBvcHQud2lkdGggbXVzdFxuKiAgICAgYmUgZGVmaW5lZCBpZiB1c2luZyB0aW1lciBhbmQgd2lkdGggZGVmaW5pdGlvbi5cbiogQHBhcmFtIHtOdW1iZXJ9IG9wdC5zdGFydCBTdGFydGluZyB0aW1lIG9mIHRoZSB0aW1lIHdpbmRvdyAobG93ZXIgYm91bmQpLlxuKiBAcGFyYW0ge051bWJlcn0gb3B0LmVuZCBFbmRpbmcgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cgKHVwcGVyIGJvdW5kKS5cbiogQHBhcmFtIHtTYW1vdHJhY2VzLlRpbWVyfSBvcHQudGltZXIgVGltZXIgb2JqZWN0LCB3aGljaCB0aW1lXG4qICAgICBpcyB1c2VkIHRvIGRlZmluZSB0aGUgbWlkZGxlIG9mIHRoZSBjdXJyZW50IHRpbWUgd2luZG93LlxuKiBAcGFyYW0ge051bWJlcn0gb3B0LndpZHRoIFdpZHRoIG9mIHRoZSB0aW1lIHdpbmRvdy5cbipcbiovXG52YXIgVGltZVdpbmRvdyA9IGZ1bmN0aW9uIFRpbWVXaW5kb3cob3B0KSB7XG4gIC8vIEFkZGluZyB0aGUgT2JzZXJ2YWJsZSB0cmFpdFxuICBcInVzZSBzdHJpY3RcIjtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gIGlmIChvcHQuc3RhcnQgIT09IHVuZGVmaW5lZCAmJiBvcHQuZW5kICAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5zdGFydCA9IG9wdC5zdGFydDtcbiAgICB0aGlzLmVuZCA9IG9wdC5lbmQ7XG4gICAgdGhpcy5fX2NhbGN1bGF0ZV93aWR0aCgpO1xuICB9IGVsc2UgaWYgKG9wdC50aW1lciAhPT0gdW5kZWZpbmVkICYmIG9wdC53aWR0aCAgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMuc2V0X3dpZHRoKG9wdC53aWR0aCwgb3B0LnRpbWVyLnRpbWUpO1xuICAgIHRoaXMudGltZXIgPSBvcHQudGltZXI7XG4gICAgdGhpcy50aW1lci5vbigndGltZXI6dXBkYXRlJywgdGhpcy5fcHJpdmF0ZV91cGRhdGVUaW1lLmJpbmQodGhpcykpO1xuICAgIHRoaXMudGltZXIub24oJ3RpbWVyOnBsYXk6dXBkYXRlJywgdGhpcy5fcHJpdmF0ZV91cGRhdGVUaW1lLmJpbmQodGhpcykpO1xuICB9IGVsc2Uge1xuICAgIHRocm93KCdTYW1vdHJhY2VzLlRpbWVXaW5kb3cgZXJyb3IuIEFyZ3VtZW50cyBjb3VsZCBub3QgYmUgcGFyc2VkLicpO1xuICB9XG59O1xuXG5UaW1lV2luZG93LnByb3RvdHlwZSA9IHtcblxuICBfX2NhbGN1bGF0ZV93aWR0aDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy53aWR0aCA9IHRoaXMuZW5kIC0gdGhpcy5zdGFydDtcbiAgfSxcbiAgX3ByaXZhdGVfdXBkYXRlVGltZTogZnVuY3Rpb24oZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB0aW1lID0gZS5kYXRhO1xuICAgIHZhciBkZWx0YSA9IHRpbWUgLSAodGhpcy5zdGFydCArIHRoaXMud2lkdGggLyAyKTtcblxuICAgIHRoaXMuc3RhcnQgPSB0aW1lIC0gdGhpcy53aWR0aCAvIDI7XG4gICAgdGhpcy5lbmQgPSB0aW1lICsgdGhpcy53aWR0aCAvIDI7XG4gICAgdGhpcy50cmlnZ2VyKCd0dzp0cmFuc2xhdGUnLCBkZWx0YSk7XG5cbiAgICAvL1x0XHR0aGlzLnNldF93aWR0aCh0aGlzLndpZHRoLHRpbWUpO1xuICB9LFxuICAvKipcbiAgKiBTZXRzIHRoZSBzdGFydCB0aW1lIG9mIHRoZSB0aW1lIHdpbmRvdy5cbiAgKiBAcGFyYW0ge051bWJlcn0gdGltZSBTdGFydGluZyB0aW1lIG9mIHRoZSB0aW1lIHdpbmRvdy5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnVwZGF0ZVxuICAqL1xuICBzZXRfc3RhcnQ6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy5zdGFydCAhPT0gdGltZSkge1xuICAgICAgdGhpcy5zdGFydCA9IHRpbWU7XG4gICAgICB0aGlzLl9fY2FsY3VsYXRlX3dpZHRoKCk7XG4gICAgICAvKipcbiAgICAgICogVGltZSB3aW5kb3cgY2hhbmdlIGV2ZW50LlxuICAgICAgKiBAZXZlbnQgU2Ftb3RyYWNlcy5UaW1lV2luZG93I3R3OnVwZGF0ZVxuICAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFRoZSB0eXBlIG9mIHRoZSBldmVudCAoPSBcInR3OnVwZGF0ZVwiKS5cbiAgICAgKi9cbiAgICAgIHRoaXMudHJpZ2dlcigndHc6dXBkYXRlJyk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgKiBTZXRzIHRoZSBlbmQgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgRW5kaW5nIHRpbWUgb2YgdGhlIHRpbWUgd2luZG93LlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVXaW5kb3cjdHc6dXBkYXRlXG4gKi9cbiAgc2V0X2VuZDogZnVuY3Rpb24odGltZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmVuZCAhPT0gdGltZSkge1xuICAgICAgdGhpcy5lbmQgPSB0aW1lO1xuICAgICAgdGhpcy5fX2NhbGN1bGF0ZV93aWR0aCgpO1xuICAgICAgdGhpcy50cmlnZ2VyKCd0dzp1cGRhdGUnKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAqIEdldHMgdGhlIHdpZHRoIG9mIHRoZSB0aW1lIHdpbmRvdyAoZHVyYXRpb24gYmV0d2VlbiBzdGFydCBhbmQgZW5kKVxuICAqIEByZXR1cm5zIHtOdW1iZXJ9IFdpZHRoIG9mIHRoZSB0aW1lIHdpbmRvd1xuICAqL1xuICBnZXRfd2lkdGg6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLndpZHRoO1xuICB9LFxuICAvKipcbiAgKiBTZXRzIHRoZSB3aWR0aCBvZiB0aGUgdGltZSBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIE5ldyB3aWR0aCBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQHBhcmFtIHtOdW1iZXJ9IFtjZW50ZXI9KHN0YXJ0K2VuZCkvMl0gTmV3IGNlbnRlciBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICogQGZpcmVzIFNhbW90cmFjZXMuVGltZVdpbmRvdyN0dzp1cGRhdGVcbiAgKi9cbiAgc2V0X3dpZHRoOiBmdW5jdGlvbih3aWR0aCwgY2VudGVyKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKGNlbnRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjZW50ZXIgPSB0aGlzLnN0YXJ0ICsgdGhpcy53aWR0aCAvIDI7XG4gICAgfVxuICAgIHRoaXMuc3RhcnQgPSBjZW50ZXIgLSB3aWR0aCAvIDI7XG4gICAgdGhpcy5lbmQgPSBjZW50ZXIgKyB3aWR0aCAvIDI7XG4gICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgIHRoaXMudHJpZ2dlcigndHc6dXBkYXRlJyk7XG4gIH0sXG4gIC8qKlxuICAqIFRyYW5zbGF0ZXMgdGhlIHRpbWUgd2luZG93IHdpdGggYSB0aW1lIGRlbHRhLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBkZWx0YSBUaW1lIGRlbHRhdCB0aGF0IHdpbGwgYmUgYWRkZWQgdG8gdGhlIHRpbWUgd2luZG93LlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVXaW5kb3cjdHc6dHJhbnNsYXRlXG4gICovXG4gIHRyYW5zbGF0ZTogZnVuY3Rpb24oZGVsdGEpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGhpcy50aW1lcikge1xuICAgICAgdGhpcy50aW1lci5zZXQodGhpcy50aW1lci50aW1lICsgZGVsdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0YXJ0ID0gdGhpcy5zdGFydCArIGRlbHRhO1xuICAgICAgdGhpcy5lbmQgPSB0aGlzLmVuZCArIGRlbHRhO1xuICAgICAgdGhpcy50cmlnZ2VyKCd0dzp0cmFuc2xhdGUnLCBkZWx0YSk7XG4gICAgfVxuICB9LFxuICAvKipcbiAgKiBab29tcyB0aGUgdGltZXdpbmRvdyBieSBtdWx0aXBseWluZyB0aGUgY3VycmVudCB3aWR0aFxuICAqIGJ5IHRoZSBnaXZlbiBjb2VmZmljaWVudC4gWm9vbSBpbiBpZiB0aGUgY29lZmZpY2llbnRcbiAgKiBpcyBsZXNzIHRoYW4gMSBhbmQgb3V0IGlmIGl0IGlzIG1vcmUgdGhhbiAxLlxuICAqIEBwYXJhbSB7TnVtYmVyfSBjb2VmIENvZWZmaWNpZW50IG9mIHRoZSB6b29tIHRvIGFwcGx5LlxuICAqL1xuICB6b29tOiBmdW5jdGlvbihjb2VmKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5zZXRfd2lkdGgodGhpcy53aWR0aCAqIGNvZWYpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lV2luZG93O1xuIiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuL0V2ZW50SGFuZGxlci5qc1wiKTtcblxuLyoqXG4qIEBzdW1tYXJ5IE9iamVjdCB0aGF0IHN0b3JlcyB0aGUgY3VycmVudCB0aW1lXG4qIEBjbGFzcyBPYmplY3QgdGhhdCBzdG9yZXMgdGhlIGN1cnJlbnQgdGltZVxuKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVyblxuKiBAY29uc3RydWN0b3JcbiogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4qIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnVwZGF0ZVxuKiBAZGVzY3JpcHRpb25cbiogU2Ftb3RyYWNlcy5UaW1lciBpcyBhIEphdmFzY3JpcHQgb2JqZWN0IHRoYXQgc3RvcmVzXG4qIHRoZSBjdXJyZW50IHRpbWUuXG4qIFRoaXMgT2JqZWN0IHN0b3JlcyBhIHRpbWUgYW5kIGluZm9ybXMgd2lkZ2V0cyBvciBvdGhlclxuKiBvYmplY3RzIHdoZW4gdGhlIHRpbWUgY2hhbmdlcy5cbipcbiogQHBhcmFtIHtOdW1iZXJ9IFtpbml0X3RpbWU9MF1cbiogICAgIEluaXRpYWwgdGltZSBvZiB0aGUgdGltZXIgKG9wdGlvbmFsLCBkZWZhdWx0OiAwKS5cbiogQHBhcmFtIHtOdW1iZXJ9IFtwZXJpb2Q9MjAwMF1cbiogICAgIFBlcmRpb2QgKGluIG1zKSBhdCB3aGljaCB0aGUgdGltZXIgd2lsbCB1cGRhdGUgaXRzZWxmIGluXG4qICAgICBcInBsYXlcIiBtb2RlLlxuKiBAcGFyYW0ge2Z1bmN0aW9ufSBbdXBkYXRlX2Z1bmN0aW9uXVxuKiAgICAgRnVuY3Rpb24gY2FsbGVkIHRvIHVwZGF0ZSB0aGUgdGltZXIgd2hlbiBpbiBcInBsYXlcIiBtb2RlXG4qICAgICAoZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBvZlxuKiAgICAgPGNvZGU+RGF0ZS5ub3coKTwvY29kZT4gYnkgZGVmYXVsdCkuXG4qL1xuXG52YXIgVGltZXIgPSBmdW5jdGlvbiBUaW1lcihpbml0X3RpbWUsIHBlcmlvZCwgdXBkYXRlX2Z1bmN0aW9uKSB7XG4gIC8vIEFkZGluZyB0aGUgT2JzZXJ2YWJsZSB0cmFpdFxuICBcInVzZSBzdHJpY3RcIjtcbiAgRXZlbnRIYW5kbGVyLmNhbGwodGhpcyk7XG4gIHRoaXMudGltZSA9IGluaXRfdGltZSB8fCAwO1xuICB0aGlzLnBlcmlvZCA9IHBlcmlvZCB8fCAyMDAwO1xuICB0aGlzLnVwZGF0ZV9mdW5jdGlvbiA9IHVwZGF0ZV9mdW5jdGlvbiB8fCBmdW5jdGlvbigpIHtyZXR1cm4gRGF0ZS5ub3coKTt9O1xuICB0aGlzLmlzX3BsYXlpbmcgPSBmYWxzZTtcbn07XG5cblRpbWVyLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICogU2V0cyB0aGUgVGltZXIgdG8gdGhlIGdpdmVuIHRpbWUuXG4gICogQGZpcmVzIFNhbW90cmFjZXMuVGltZXIjdGltZXI6dXBkYXRlXG4gICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgTmV3IHRpbWVcbiovXG4gIHNldF90aW1lOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG5ld190aW1lID0gTnVtYmVyKHRpbWUpO1xuICAgIGlmICh0aGlzLnRpbWUgIT09IG5ld190aW1lKSB7XG4gICAgICB0aGlzLnRpbWUgPSBuZXdfdGltZTtcbiAgICAgIC8qKlxuICAgICAgKiBUaW1lIGNoYW5nZSBldmVudC5cbiAgICAgICogQGV2ZW50IFNhbW90cmFjZXMuVGltZXIjdGltZXI6dXBkYXRlXG4gICAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0eXBlIC0gVGhlIHR5cGUgb2YgdGhlIGV2ZW50ICg9IFwidGltZXI6dXBkYXRlXCIpLlxuKi9cbiAgICAgIHRoaXMudHJpZ2dlcigndGltZXI6dXBkYXRlJywgdGhpcy50aW1lKTtcbiAgICB9XG4gIH0sXG4gIC8qKlxuICAqIFNldHMgdGhlIFRpbWVyIHRvIHRoZSBnaXZlbiB0aW1lLlxuICAqIEBkZXByZWNhdGVkIFVzZSB7QGxpbmsgU2Ftb3RyYWNlcy5UaW1lci5zZXRfdGltZXxzZXRfdGltZX0gaW5zdGVhZC5cbiAgKiBAZmlyZXMgU2Ftb3RyYWNlcy5UaW1lciN0aW1lcjp1cGRhdGVcbiAgKiBAcGFyYW0ge051bWJlcn0gdGltZSBOZXcgdGltZVxuKi9cbiAgc2V0OiBmdW5jdGlvbih0KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHJldHVybiB0aGlzLnNldF90aW1lKHQpOyB9LFxuICAvKipcbiAgKiBHZXRzIHRoZSBjdXJyZW50IHRpbWUgb2YgdGhlIFRpbWVyXG4gICogQHJldHVybnMge051bWJlcn0gQ3VycmVudCB0aW1lIG9mIHRoZSBUaW1lci5cbiovXG4gIGdldF90aW1lOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy50aW1lO1xuICB9LFxuICAvKipcbiAgKiBTZXRzIG9yIGdldCB0aGUgVGltZXIncyBjdXJyZW50IHRpbWUuXG4gICogSWYgbm8gcGFyYW1ldGVyIGlzIGdpdmVuLCB0aGUgY3VycmVudCB0aW1lIGlzIHJldHVybmVkLlxuICAqIE90aGVyd2lzZSwgc2V0cyB0aGUgVGltZXIgdG8gdGhlIGdpdmVudCB0aW1lLlxuICAqIEBmaXJlcyBTYW1vdHJhY2VzLlRpbWVyI3RpbWVyOnVwZGF0ZVxuICAqIEBwYXJhbSB7TnVtYmVyfSBbdGltZV0gTmV3IHRpbWVcbiovXG4gIHRpbWU6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBpZiAodGltZSkge1xuICAgICAgdmFyIG5ld190aW1lID0gTnVtYmVyKHRpbWUpO1xuICAgICAgaWYgKHRoaXMudGltZSAhPT0gbmV3X3RpbWUpIHtcbiAgICAgICAgdGhpcy50aW1lID0gbmV3X3RpbWU7XG4gICAgICAgIHRoaXMudHJpZ2dlcigndGltZXI6dXBkYXRlJywgdGhpcy50aW1lKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMudGltZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICogU3RhcnRzIHRoZSBwbGF5IG1vZGU6IHRoZSB0aW1lciB3aWxsIGJlIHVwZGF0ZWRcbiAgKiBhY2NvcmRpbmcgdG8gdGhlIHVwZGF0ZV9mdW5jdGlvbiBldmVyeSBwZXJpb2RcbiAgKiBhcyBzcGVjaWZpZWQgYXQgdGhlIGluaXRpYWxpc2F0aW9uIG9mIHRoZSBUaW1lci5cbiAgKiBAdG9kbyBTUEVDSUZZIFdBWVMgVE8gQ0hBTkdFIFBFUklPRCBBTkQgVVBEQVRFX0ZVTkNUSU9uXG4qL1xuICBwbGF5OiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAvKnZhciB1cGRhdGUgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnRpbWUgPSB0aGlzLnVwZGF0ZV9mdW5jdGlvbih0aGlzLnRpbWUpO1xuICAgIC8qKlxuICAgICogVGltZSBjaGFuZ2UgZXZlbnQgKGFjdHVhbGlzaW5nIHRpbWUgd2hlbiBwbGF5aW5nKVxuICAgICogQGV2ZW50IFNhbW90cmFjZXMuVGltZXIjdGltZXI6cGxheTp1cGRhdGVcbiAgICAqIEB0eXBlIHtvYmplY3R9XG4gICAgKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZVxuICAgICogICAgIC0gVGhlIHR5cGUgb2YgdGhlIGV2ZW50ICg9IFwidGltZXI6cGxheTp1cGRhdGVcIikuXG4gICAgKi9cbiAgICAvKnRoaXMudHJpZ2dlcigndGltZXI6cGxheTp1cGRhdGUnLHRoaXMudGltZSk7XG4gICAgfTtcblx0XHQqL1xuICAgIHRoaXMuaW50ZXJ2YWxfaWQgPSB3aW5kb3cuc2V0SW50ZXJ2YWwodGhpcy51cGRhdGVfZnVuY3Rpb24uYmluZCh0aGlzKSwgdGhpcy5wZXJpb2QpO1xuICAgIHRoaXMuaXNfcGxheWluZyA9IHRydWU7XG4gICAgdGhpcy50cmlnZ2VyKCd0aW1lcjpwbGF5JywgdGhpcy50aW1lKTtcbiAgfSxcbiAgLyoqXG4gICogU3RvcHMgdGhlIHBsYXkgbW9kZS5cbiovXG4gIHBhdXNlOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsX2lkKTtcbiAgICB0aGlzLmlzX3BsYXlpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnRyaWdnZXIoJ3RpbWVyOnBhdXNlJywgdGhpcy50aW1lKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9jb3JlL0V2ZW50SGFuZGxlci5qc1wiKTtcbnZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgT2JzZWwgPSByZXF1aXJlKFwiLi9jb3JlL09ic2VsLmpzXCIpO1xudmFyIFRpbWVXaW5kb3cgPSByZXF1aXJlKFwiLi9jb3JlL1RpbWVXaW5kb3cuanNcIik7XG52YXIgVGltZXIgPSByZXF1aXJlKFwiLi9jb3JlL1RpbWVyLmpzXCIpO1xudmFyIFNlbGVjdG9yID0gcmVxdWlyZShcIi4vY29yZS9TZWxlY3Rvci5qc1wiKTtcbnZhciBMb2NhbFRyYWNlID0gcmVxdWlyZShcIi4vY29yZS9Mb2NhbFRyYWNlLmpzXCIpO1xudmFyIEt0YnMgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuanNcIik7XG52YXIgS3Ric01vZGVsID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLk1vZGVsLmpzXCIpO1xudmFyIEt0YnNCYXNlID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLkJhc2UuanNcIik7XG52YXIgS3Ric1RyYWNlID0gcmVxdWlyZShcIi4vY29yZS9LVEJTLlRyYWNlLmpzXCIpO1xuXG52YXIgSW1wb3J0VHJhY2UgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0ltcG9ydFRyYWNlLmpzXCIpO1xudmFyIEludGVydmFsVGltZUZvcm0gPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL0ludGVydmFsVGltZUZvcm0uanNcIik7XG52YXIgTGlzdEJhc2VzID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9MaXN0QmFzZXMuanNcIik7XG52YXIgTGlzdE1vZGVsSW5CYXNlcyA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvTGlzdE1vZGVsSW5CYXNlcy5qc1wiKTtcbnZhciBMaXN0VHJhY2VzSW5CYXNlcyA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvTGlzdFRyYWNlc0luQmFzZXMuanNcIik7XG52YXIgT2JzZWxJbnNwZWN0b3IgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL09ic2VsSW5zcGVjdG9yLmpzXCIpO1xudmFyIE9ic2VsVHlwZUluc3BlY3RvciA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvT2JzZWxUeXBlSW5zcGVjdG9yLmpzXCIpO1xudmFyIFJlYWRhYmxlVGltZUZvcm0gPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1JlYWRhYmxlVGltZUZvcm0uanNcIik7XG52YXIgVGltZUZvcm0gPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RpbWVGb3JtLmpzXCIpO1xudmFyIFRpbWVTbGlkZXIgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RpbWVTbGlkZXIuanNcIik7XG52YXIgVHJhY2VEaXNwbGF5SWNvbnMgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheUljb25zLmpzXCIpO1xudmFyIFRyYWNlRGlzcGxheUljb25zRml4ID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlJY29uc0ZpeC5qc1wiKTtcbnZhciBUcmFjZURpc3BsYXlJY29uc1pvb20gPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheUljb25zWm9vbS5qc1wiKTtcbnZhciBUcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9UcmFjZURpc3BsYXlPYnNlbE9jY3VycmVuY2VzLmpzXCIpO1xudmFyIFRyYWNlRGlzcGxheVRleHQgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheVRleHQuanNcIik7XG52YXIgVHJhY2VEaXNwbGF5Wm9vbUNvbnRleHQgPSByZXF1aXJlKFwiLi9VSS9XaWRnZXRzL1RyYWNlRGlzcGxheVpvb21Db250ZXh0LmpzXCIpO1xudmFyIERpc3BsYXlNb2RlbCA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvRGlzcGxheU1vZGVsLmpzXCIpO1xudmFyIFdpbmRvd1NjYWxlID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9XaW5kb3dTY2FsZS5qc1wiKTtcbnZhciBXaW5kb3dTY2FsZUZpeCA9IHJlcXVpcmUoXCIuL1VJL1dpZGdldHMvV2luZG93U2NhbGVGaXguanNcIik7XG52YXIgV2luZG93U2xpZGVyID0gcmVxdWlyZShcIi4vVUkvV2lkZ2V0cy9XaW5kb3dTbGlkZXIuanNcIik7XG5cbnZhciBTYW1vdHJhY2VzID0ge1xuICBPYnNlbDogT2JzZWwsXG4gIFRpbWVXaW5kb3c6IFRpbWVXaW5kb3csXG4gIFRpbWVyOiBUaW1lcixcbiAgU2VsZWN0b3I6IFNlbGVjdG9yLFxuICBFdmVudEhhbmRsZXI6IEV2ZW50SGFuZGxlcixcbiAgTG9jYWxUcmFjZTogTG9jYWxUcmFjZSxcbiAgS3Riczoge1xuICAgIEt0YnM6IEt0YnMsXG4gICAgUmVzb3VyY2U6IEtUQlNSZXNvdXJjZSxcbiAgICBNb2RlbDogS3Ric01vZGVsLFxuICAgIEJhc2U6IEt0YnNCYXNlLFxuICAgIFRyYWNlOiBLdGJzVHJhY2UsXG4gIH0sXG4gIFVpOiB7XG4gICAgV2lkZ2V0czoge1xuICAgICAgSW1wb3J0VHJhY2U6IEltcG9ydFRyYWNlLFxuICAgICAgSW50ZXJ2YWxUaW1lRm9ybTogSW50ZXJ2YWxUaW1lRm9ybSxcbiAgICAgIE9ic2VsSW5zcGVjdG9yOiBPYnNlbEluc3BlY3RvcixcbiAgICAgIE9ic2VsVHlwZUluc3BlY3RvcjogT2JzZWxUeXBlSW5zcGVjdG9yLFxuICAgICAgUmVhZGFibGVUaW1lRm9ybTogUmVhZGFibGVUaW1lRm9ybSxcbiAgICAgIFRpbWVGb3JtOiBUaW1lRm9ybSxcbiAgICAgIFRpbWVTbGlkZXI6IFRpbWVTbGlkZXIsXG4gICAgICBUcmFjZURpc3BsYXlJY29uczogVHJhY2VEaXNwbGF5SWNvbnMsXG4gICAgICBUcmFjZURpc3BsYXlJY29uc0ZpeDogVHJhY2VEaXNwbGF5SWNvbnNGaXgsXG4gICAgICBUcmFjZURpc3BsYXlJY29uc1pvb206IFRyYWNlRGlzcGxheUljb25zWm9vbSxcbiAgICAgIFRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXM6IFRyYWNlRGlzcGxheU9ic2VsT2NjdXJyZW5jZXMsXG4gICAgICBUcmFjZURpc3BsYXlUZXh0OiBUcmFjZURpc3BsYXlUZXh0LFxuICAgICAgVHJhY2VEaXNwbGF5Wm9vbUNvbnRleHQ6IFRyYWNlRGlzcGxheVpvb21Db250ZXh0LFxuICAgICAgRGlzcGxheU1vZGVsOiBEaXNwbGF5TW9kZWwsXG4gICAgICBXaW5kb3dTY2FsZTogV2luZG93U2NhbGUsXG4gICAgICBXaW5kb3dTY2FsZUZpeDogV2luZG93U2NhbGVGaXgsXG4gICAgICBXaW5kb3dTbGlkZXI6IFdpbmRvd1NsaWRlcixcbiAgICAgIEt0YnM6IHtcbiAgICAgICAgTGlzdEJhc2VzOiBMaXN0QmFzZXMsXG4gICAgICAgIExpc3RNb2RlbEluQmFzZXM6IExpc3RNb2RlbEluQmFzZXMsXG4gICAgICAgIExpc3RUcmFjZXNJbkJhc2VzOiBMaXN0VHJhY2VzSW5CYXNlcyxcbiAgICAgIH1cbiAgICB9LFxuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTYW1vdHJhY2VzO1xuIl19
