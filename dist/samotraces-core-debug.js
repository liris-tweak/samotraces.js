(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Samotraces = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var EventHandler = require("./core/EventHandler.js");
var KTBSResource = require("./core/KTBS.Resource.js");
var Obsel = require("./core/Obsel.js");
var Ktbs = require("./core/KTBS.js");
var KtbsModel = require("./core/KTBS.Model.js");
var KtbsBase = require("./core/KTBS.Base.js");
var KtbsTrace = require("./core/KTBS.Trace.js");


var Samotraces = {
  Obsel: Obsel,
  EventHandler: EventHandler,
  Ktbs: {
    Ktbs: Ktbs,
    Resource: KTBSResource,
    Model: KtbsModel,
    Base: KtbsBase,
    Trace: KtbsTrace,
  },
};

module.exports = Samotraces;

},{"./core/EventHandler.js":2,"./core/KTBS.Base.js":3,"./core/KTBS.Model.js":4,"./core/KTBS.Resource.js":6,"./core/KTBS.Trace.js":7,"./core/KTBS.js":8,"./core/Obsel.js":9}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
  
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 201) {
          console.log('OKPost');
          that.force_state_refresh();
        } else {
          console.log('Post error');
        }
      }
    };
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.send(JSON.stringify(new_trace));
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

    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 201) {
          console.log('OKPost');
          that.force_state_refresh();
        } else {
          console.log('Post error');
        }
      }
    };
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.send(new_model_data);
  },



  /**
  	 * @todo METHOD NOT IMPLEMENTED
  	 */
  create_computed_trace: function(id, method, parameters, sources) {
    
    
    var new_trace = {
      "@context":	"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
      "@type":	"ComputedTrace",
      "@id":		id + "/",
      "hasMethod":		method,
      "hasSource":		sources, // array
      "parameter":		parameters  //array
    };
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 201) {
          console.log('OKPost');
          that.force_state_refresh();
        } else {
          console.log('Post error');
        }
      }
    };
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.send(JSON.stringify(new_trace));
  },  
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

},{"./KTBS.Resource.js":6}],4:[function(require,module,exports){
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

},{"./EventHandler.js":2,"./KTBS.Resource.js":6}],5:[function(require,module,exports){
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

},{"./KTBS.Resource.js":6,"./Obsel.js":9}],6:[function(require,module,exports){
var EventHandler = require("./EventHandler.js");

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

    var url = this.uri;
    var trc = this ;

    var functionsByStatus = {
      '200' : function (xhr) {
        trc.etag = xhr.getResponseHeader('ETag'); // TODO this cause 'Refused to get unsafe header "ETag"' on KTBS 0.3
        var jsonResponse = JSON.parse(xhr.response);
        success(jsonResponse);
        if (options._on_state_refresh_) {
          trc._on_state_refresh_(jsonResponse);
        }
      },
      '401': function (xhr) {
        console.log (xhr.getAllResponseHeaders());
        var link = xhr.getResponseHeader('Link');
        var d = link.split (',');
        for (var i = 0;i < d.length;i++) {
          var sousD = d[i].split(';');
          var link;
          var URLSuccess;
          if (sousD[1] === " rel=oauth_resource_server") {
            link = sousD[0].substr(1, sousD[0].length - 2);
          }
          if (sousD[1] === " rel=successful_login_redirect") {
            URLSuccess = sousD[0].substr(2, sousD[0].length - 3);
          }
        }
        window.open (link) ;
      }
    };

    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.withCredentials = true;
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var process = functionsByStatus[xhr.status] || function() {
          console.log("Not Yet Implemented");
          reject(xhr);
        };
        process(xhr);
      }
    };
    xhr.send(null);
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
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', this.uri, true);
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.withCredentials = true;
    xhr.onerror = function() {
      throw "Cannot delete " + this.get_resource_type() + " " + this.uri + ": " + xhr.status;
    };
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        refresh_parent.bind(that);
      }
    };
    xhr.send(null);
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

},{"./EventHandler.js":2}],7:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var KTBSObsel = require("./KTBS.Obsel.js");

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
    
    var functionsByStatus = {
      '200' : function (xhr) {
        
        var jsonResponse = JSON.parse(xhr.response);
        if (jsonResponse.obsels.length > 0)
        {OBJ.Before_on_refresh_obsel_list_ (jsonResponse);}
      },
      '401': function (xhr) {
        console.log (xhr.getAllResponseHeaders());
        var link = xhr.getResponseHeader('Link');
        var d = link.split (',');
        for (var i = 0;i < d.length;i++) {
          var sousD = d[i].split(';');
          var link;
          var URLSuccess;
          if (sousD[1] === " rel=oauth_resource_server") {
            link = sousD[0].substr(1, sousD[0].length - 2);
          }
          if (sousD[1] === " rel=successful_login_redirect") {
            URLSuccess = sousD[0].substr(2, sousD[0].length - 3);
          }
        }
        window.open (link) ;
      }
    };
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', that.obsel_list_uri, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var process = functionsByStatus[xhr.status] || function() {
          console.log("Not Yet Implemented");
        };
        process(xhr);
      }
    };
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.send(null);
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
    create_obsel: function(params,model) {
      // LOCAL TRACE
      //var obs = new Samotraces.Obsel(obsel_params);
      // KTBS BOGUE
      "use strict";
      var hasModel = (model === undefined  || model ===  null)?"http://liris.cnrs.fr/silex/2011/simple-trace-model#":model;
      var json_obsel = {
        "@context":	[
        "http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
               { "m": hasModel }
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
      
      var that = this;
      var xhr = new XMLHttpRequest();
      xhr.open('POST', that.id, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 201) {
            console.log('OKPost');
            that._on_create_obsel_success();
          } else {
            console.log('Post error');
          }
        }
      };
      xhr.onerror = function(e) {
        console.log("Error Status: " + e.target.status);
      };
      xhr.send(JSON.stringify(json_obsel));
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

},{"./KTBS.Obsel.js":5,"./KTBS.Resource.js":6}],8:[function(require,module,exports){
var KTBSResource = require("./KTBS.Resource.js");
var KTBSBase = require("./KTBS.Base.js");


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

    
    var that = this;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', that.id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if(xhr.status === 201) {
          console.log('OKPost');
          that.force_state_refresh();
        } else {
          console.log('Post error');
        }
      }
    };
    xhr.onerror = function(e) {
      console.log("Error Status: " + e.target.status);
    };
    xhr.send(JSON.stringify(new_base));
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

},{"./KTBS.Base.js":3,"./KTBS.Resource.js":6}],9:[function(require,module,exports){

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
    // if ($.inArray(r.type, rels) === -1) {
    //   rels.push(r.type);
    // }
    if (rels.indexOf(r.type) ===-1){
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
    // if ($.inArray(r.type, rels) === -1) {
    //   rels.push(r.type);
    // }
    if (rels.indexOf(r.type) ===-1){
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY29yZS5qcyIsInNyYy9jb3JlL0V2ZW50SGFuZGxlci5qcyIsInNyYy9jb3JlL0tUQlMuQmFzZS5qcyIsInNyYy9jb3JlL0tUQlMuTW9kZWwuanMiLCJzcmMvY29yZS9LVEJTLk9ic2VsLmpzIiwic3JjL2NvcmUvS1RCUy5SZXNvdXJjZS5qcyIsInNyYy9jb3JlL0tUQlMuVHJhY2UuanMiLCJzcmMvY29yZS9LVEJTLmpzIiwic3JjL2NvcmUvT2JzZWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEV2ZW50SGFuZGxlciA9IHJlcXVpcmUoXCIuL2NvcmUvRXZlbnRIYW5kbGVyLmpzXCIpO1xudmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBPYnNlbCA9IHJlcXVpcmUoXCIuL2NvcmUvT2JzZWwuanNcIik7XG52YXIgS3RicyA9IHJlcXVpcmUoXCIuL2NvcmUvS1RCUy5qc1wiKTtcbnZhciBLdGJzTW9kZWwgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuTW9kZWwuanNcIik7XG52YXIgS3Ric0Jhc2UgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuQmFzZS5qc1wiKTtcbnZhciBLdGJzVHJhY2UgPSByZXF1aXJlKFwiLi9jb3JlL0tUQlMuVHJhY2UuanNcIik7XG5cblxudmFyIFNhbW90cmFjZXMgPSB7XG4gIE9ic2VsOiBPYnNlbCxcbiAgRXZlbnRIYW5kbGVyOiBFdmVudEhhbmRsZXIsXG4gIEt0YnM6IHtcbiAgICBLdGJzOiBLdGJzLFxuICAgIFJlc291cmNlOiBLVEJTUmVzb3VyY2UsXG4gICAgTW9kZWw6IEt0YnNNb2RlbCxcbiAgICBCYXNlOiBLdGJzQmFzZSxcbiAgICBUcmFjZTogS3Ric1RyYWNlLFxuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTYW1vdHJhY2VzO1xuIiwiLyoqXG4gKiBAbWl4aW5cbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIEV2ZW50SGFuZGxlciBPYmplY3QgaXMgbm90IGEgY2xhc3MuIEhvd2V2ZXIsIGl0IGlzXG4gKiBkZXNpZ25lZCBmb3Igb3RoZXIgY2xhc3NlcyB0byBpbmhlcml0IG9mIGEgcHJlZGVmaW5lZFxuICogT2JzZXJ2YWJsZSBiZWhhdmlvdXIuIEZvciB0aGlzIHJlYXNvbiwgdGhpcyBmdW5jdGlvbiBpc1xuICogZG9jdW1lbnRlZCBhcyBhIENsYXNzLlxuICpcbiAqIEluIG9yZGVyIHRvIHVzZSBjcmVhdGUgYSBjbGFzcyB0aGF0IFwiaW5oZXJpdHNcIiBmcm9tIHRoZVxuICogXCJFdmVudEhhbmRsZXIgY2xhc3NcIiwgb25lIG11c3QgcnVuIHRoZSBmb2xsb3dpbmcgY29kZSBpblxuICogdGhlIGNvbnN0cnVjdG9yOlxuICogPGNvZGU+XG4gKiBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICogPC9jb2RlPlxuICpcbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBjYWxsYmFja3NcbiAqICAgICBIYXNoIG1hdGNoaW5nIGNhbGxiYWNrcyB0byBldmVudF90eXBlcy5cbiAqL1xudmFyIEV2ZW50SGFuZGxlciA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gIFx0ICogVHJpZ2dlcnMgYWxsIHRoZSByZWdpc3RyZWQgY2FsbGJhY2tzLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5wcm90b3R5cGVcbiAgXHQgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRfdHlwZVxuICBcdCAqICAgICBUaGUgdHlwZSBvZiB0aGUgdHJpZ2dlcmVkIGV2ZW50LlxuICBcdCAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAgXHQgKiAgICAgT2JqZWN0IHNlbnQgd2l0aCB0aGUgbWVzc2FnZSB0byB0aGUgbGlzdGVuZXJzIChzZWVcbiAgXHQgKiAgICAge0BsaW5rIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyI29ufSkuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHRyaWdnZXIoZXZlbnRfdHlwZSwgb2JqZWN0KSB7XG4gICAgdmFyIGUgPSB7IHR5cGU6IGV2ZW50X3R5cGUsIGRhdGE6IG9iamVjdCB9O1xuICAgIGlmICh0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXSkge1xuICAgICAgdGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0ubWFwKGZ1bmN0aW9uKGYpIHsgZihlKTsgfSk7XG4gICAgfVxuICAgIC8qXG4gICAgXHRcdHRoaXMuY2FsbGJhY2tzW2V2ZW50X3R5cGVdLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICBcdFx0XHRjYWxsYmFjayhlKTtcbiAgICBcdFx0fSk7XG4gICAgXHRcdCovXG4gIH1cbiAgLyoqXG4gIFx0ICogQWRkcyBhIGNhbGxiYWNrIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLnByb3RvdHlwZVxuICBcdCAqIEBwYXJhbSB7U3RyaW5nfSBldmVudF90eXBlXG4gIFx0ICogICAgIFRoZSB0eXBlIG9mIHRoZSBldmVudCB0byBsaXN0ZW4gdG8uXG4gIFx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgXHQgKiAgICAgQ2FsbGJhY2sgdG8gY2FsbCB3aGVuIHRoZSBhbiBldmVudCBvZiB0eXBlXG4gIFx0ICogICAgIGV2ZW50X3R5cGUgaXMgdHJpZ2dlcmVkLiBOb3RlOiB0aGUgY2FsbGJhY2tcbiAgXHQgKiAgICAgY2FuIHJlY2VpdmUgb25lIGFyZ3VtZW50IHRoYXQgY29udGFpbnNcbiAgXHQgKiAgICAgZGV0YWlscyBhYm91dCB0aGUgdHJpZ2dlcmVkIGV2ZW50LlxuICBcdCAqICAgICBUaGlzIGV2ZW50IGFyZ3VtZW50IGNvbnRhaW5zIHR3byBmaWVsZHM6XG4gIFx0ICogICAgIGV2ZW50LnR5cGU6IHRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgaXMgdHJpZ2dlcmVkXG4gIFx0ICogICAgIGV2ZW50LmRhdGE6IG9wdGlvbmFsIGRhdGEgdGhhdCBpcyB0cmFuc21pdHRlZCB3aXRoIHRoZSBldmVudFxuICBcdCAqL1xuICBmdW5jdGlvbiBvbihldmVudF90eXBlLCBjYWxsYmFjaykge1xuICAgIGlmICh7fS50b1N0cmluZy5jYWxsKGNhbGxiYWNrKSAhPT0gJ1tvYmplY3QgRnVuY3Rpb25dJykge1xuICAgICAgY29uc29sZS5sb2coY2FsbGJhY2spO1xuICAgICAgdGhyb3cgXCJDYWxsYmFjayBmb3IgZXZlbnQgXCIgKyBldmVudF90eXBlICsgXCIgaXMgbm90IGEgZnVuY3Rpb25cIjtcbiAgICB9XG4gICAgdGhpcy5jYWxsYmFja3NbZXZlbnRfdHlwZV0gPSB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXSB8fCBbXTtcbiAgICB0aGlzLmNhbGxiYWNrc1tldmVudF90eXBlXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihldmVudHMpIHtcbiAgICAvLyBET0NVTUVOVEVEIEFCT1ZFXG4gICAgdGhpcy5jYWxsYmFja3MgPSB0aGlzLmNhbGxiYWNrcyB8fCB7fTtcbiAgICB0aGlzLnRyaWdnZXIgPSB0cmlnZ2VyO1xuICAgIHRoaXMub24gPSBvbjtcbiAgICAvKipcbiAgICBcdFx0ICogRXZlbnRDb25maWcgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuICAgIFx0XHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIuRXZlbnRDb25maWd9XG4gICAgXHRcdCAqIG9iamVjdC5cbiAgICBcdFx0ICogQHR5cGVkZWYgRXZlbnRDb25maWdcbiAgICBcdFx0ICogQHNlZSBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlci5FdmVudENvbmZpZ1xuICAgIFx0XHQgKi9cbiAgICAvKipcbiAgICBcdFx0ICogVGhlIEV2ZW50Q29uZmlnIG9iamVjdCBpcyB1c2VkIGZvciBjb25maWd1cmF0aW5nIHRoZVxuICAgIFx0XHQgKiBmdW5jdGlvbnMgdG8gY2FsbCBldmVudHMgYXJlIHRyaWdnZXJlZCBieSBhbiBFdmVudEhhbmRsZXIgT2JqZWN0LlxuICAgIFx0XHQgKiBFYWNoIGF0dHJpYnV0ZSBuYW1lIG9mIHRoZSBFdmVudENvbmZpZyBjb3JyZXNwb25kc1xuICAgIFx0XHQgKiB0byBhIHR5cGUgb2YgZXZlbnQgbGlzdGVuZWQgdG8sIGFuZCBlYWNoXG4gICAgXHRcdCAqIHZhbHVlIGlzIHRoZSBmdW5jdGlvbiB0byB0cmlnZ2VyIG9uIHRoaXMgZXZlbnQuXG4gICAgXHRcdCAqIEB0eXBlZGVmIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyLkV2ZW50Q29uZmlnXG4gICAgXHRcdCAqIEB0eXBlIHtPYmplY3QuPHN0cmluZywgZnVuY3Rpb24+fVxuICAgIFx0XHQgKiBAcHJvcGVydHkge2Z1bmN0aW9ufSBldmVudE5hbWUgLSBGdW5jdGlvbiB0byB0cmlnZ2VyIG9uIHRoaXMgZXZlbnQuXG4gICAgXHRcdCAqL1xuICAgIGZ1bmN0aW9uIGNhbGxiYWNrKGUpIHsgZnVuKGUuZGF0YSk7IH1cbiAgICBmb3IgKHZhciBldmVudF9uYW1lIGluIGV2ZW50cykge1xuICAgICAgXHRcdGlmIChldmVudC5oYXNPd25Qcm9wZXJ0eShldmVudF9uYW1lKSkge1xuICAgICAgICBcdFx0dmFyIGZ1biA9IGV2ZW50c1tldmVudF9uYW1lXTtcbiAgICAgICAgXHRcdHRoaXMub24oZXZlbnRfbmFtZSwgY2FsbGJhY2spO1xuICAgICAgXHRcdH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50SGFuZGxlcjtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xuXG5cbi8qKlxuICogQGNsYXNzIEphdmFzY3JpcHQgS1RCUy5CYXNlIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUy5cbiAqIEBhdXRob3IgQmVub8OudCBNYXRoZXJuXG4gKiBAcmVxdWlyZXMgalF1ZXJ5IGZyYW1ld29yayAoc2VlIDxhIGhyZWY9XCJodHRwOi8vanF1ZXJ5LmNvbVwiPmpxdWVyeS5jb208L2E+KVxuICogQGNvbnN0cnVjdG9yXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXJcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEBkZXNjcmlwdGlvblxuICogU2Ftb3RyYWNlcy5LVEJTLkJhc2UgaXMgYSBKYXZhc2NyaXB0IEtUQlMgYmFzZVxuICogb2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXQgdGhlXG4gKiBsaXN0IG9mIHRyYWNlcyBhdmFpbGFibGUgaW4gdGhlIEtUQlMgYmFzZS4gQWNjZXNzIGFcbiAqIHNwZWNpZmljIHRyYWNlLCBldGMuXG4gKlxuICogQHRvZG8gRnVsbHkgaW1wbGVtZW50IEtUQlMgQVBJXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9XHR1cmlcdFVSSSBvZiB0aGUgQmFzZSB0byBsb2FkLlxuICogQHBhcmFtIHtTdHJpbmd9XHRbaWRdXHRJRCBvZiB0aGUgQmFzZSB0byBsb2FkLlxuICovXG52YXIgQmFzZSA9IGZ1bmN0aW9uIEJhc2UodXJpLCBpZCkge1xuICAvLyBLVEJTLkJhc2UgaXMgYSBSZXNvdXJjZVxuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkgeyBpZCA9IHVyaTsgfVxuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBpZCwgdXJpLCAnQmFzZScsIFwiXCIpO1xuICB0aGlzLnRyYWNlcyA9IFtdO1xuICB0aGlzLm1vZGVscyA9IFtdO1xuICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbn07XG5cbkJhc2UucHJvdG90eXBlID0ge1xuICBnZXQ6IGZ1bmN0aW9uKGlkKSB7fSxcbiAgLyoqXG4gIFx0ICogR2V0cyB0aGUgbGlzdCBvZiB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBiYXNlLlxuICBcdCAqIEByZXR1cm5zIHtBcnJheS48U3RyaW5nPn0gQXJyYXkgb2YgdGhlIElEIG9mIHRoZSB0cmFjZXMgYXZhaWxhYmxlIGluIHRoZSBCYXNlLlxuICBcdCAqL1xuICBsaXN0X3RyYWNlczogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudHJhY2VzO1xuICB9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGxpc3RfbW9kZWxzOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tb2RlbHM7XG4gIH0sXG4gIC8qKlxuICBcdCAqIENyZWF0ZSBhIHN0b3JlZCB0cmFjZSBpbiB0aGUgS1RCU1xuICBcdCAqIEBwYXJhbSBpZCB7U3RyaW5nfSBJRCBvZiB0aGUgY3JlYXRlZCB0cmFjZVxuICBcdCAqIEBwYXJhbSBbbW9kZWxdIHtNb2RlbH0gTW9kZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtvcmlnaW5dIHtPcmlnaW59IE9yaWdpbiBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW2RlZmF1bHRfc3ViamVjdF0ge1N0cmluZ30gRGVmYXVsdCBzdWJqZWN0IG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbbGFiZWxdIHtTdHJpbmd9IExhYmVsIG9mIHRoZSB0cmFjZVxuICBcdCAqL1xuICBjcmVhdGVfc3RvcmVkX3RyYWNlOiBmdW5jdGlvbihpZCwgbW9kZWwsIG9yaWdpbiwgZGVmYXVsdF9zdWJqZWN0LCBsYWJlbCkge1xuICAgIHZhciBuZXdfdHJhY2UgPSB7XG4gICAgICBcIkBjb250ZXh0XCI6XHRcImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEva3Ricy1qc29ubGQtY29udGV4dFwiLFxuICAgICAgXCJAdHlwZVwiOlx0XCJTdG9yZWRUcmFjZVwiLFxuICAgICAgXCJAaWRcIjpcdFx0aWQgKyBcIi9cIlxuICAgIH07XG4gICAgbmV3X3RyYWNlLmhhc01vZGVsID0gKG1vZGVsID09PSB1bmRlZmluZWQgIHx8IG1vZGVsID09PSAgbnVsbCk/XCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL3NpbXBsZS10cmFjZS1tb2RlbFwiOm1vZGVsO1xuICAgIG5ld190cmFjZS5vcmlnaW4gPSAob3JpZ2luID09PSB1bmRlZmluZWQgfHwgb3JpZ2luID09PSAgbnVsbCApP1wiMTk3MC0wMS0wMVQwMDowMDowMFpcIjpvcmlnaW47XG4gICAgLy9cdFx0XHRpZihvcmlnaW49PXVuZGVmaW5lZCkgbmV3X3RyYWNlLm9yaWdpbiA9IG9yaWdpbjtcbiAgICBpZiAoZGVmYXVsdF9zdWJqZWN0ID09PSB1bmRlZmluZWQpIG5ld190cmFjZS5kZWZhdWx0X3N1YmplY3QgPSBkZWZhdWx0X3N1YmplY3Q7XG4gICAgaWYgKGxhYmVsID09PSB1bmRlZmluZWQpIG5ld190cmFjZS5sYWJlbCA9IGxhYmVsO1xuICBcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQT1NUJywgdGhhdC5pZCwgdHJ1ZSk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICBpZih4aHIuc3RhdHVzID09PSAyMDEpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnT0tQb3N0Jyk7XG4gICAgICAgICAgdGhhdC5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1Bvc3QgZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVycm9yIFN0YXR1czogXCIgKyBlLnRhcmdldC5zdGF0dXMpO1xuICAgIH07XG4gICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkobmV3X3RyYWNlKSk7XG4gIH0sXG5cbiAgLyoqXG4gIFx0ICogQ3JlYXRlIGEgc3RvcmVkIHRyYWNlIGluIHRoZSBLVEJTXG4gIFx0ICogQHBhcmFtIGlkIHtTdHJpbmd9IElEIG9mIHRoZSBjcmVhdGVkIHRyYWNlXG4gIFx0ICogQHBhcmFtIFttb2RlbF0ge01vZGVsfSBNb2RlbCBvZiB0aGUgdHJhY2VcbiAgXHQgKiBAcGFyYW0gW29yaWdpbl0ge09yaWdpbn0gT3JpZ2luIG9mIHRoZSB0cmFjZVxuICBcdCAqIEBwYXJhbSBbZGVmYXVsdF9zdWJqZWN0XSB7U3RyaW5nfSBEZWZhdWx0IHN1YmplY3Qgb2YgdGhlIHRyYWNlXG4gIFx0ICogQHBhcmFtIFtsYWJlbF0ge1N0cmluZ30gTGFiZWwgb2YgdGhlIHRyYWNlXG4gIFx0ICovXG4gIGNyZWF0ZV9tb2RlbDogZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBkb2MgPSB7XG4gICAgICAnQGNvbnRleHQnOiAnaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9rdGJzLWpzb25sZC1jb250ZXh0JyxcbiAgICAgICdAZ3JhcGgnOiBbe1xuICAgICAgICAnQGlkJzogaWQsXG4gICAgICAgICdAdHlwZSc6ICdUcmFjZU1vZGVsJyxcbiAgICAgICAgJ2luQmFzZSc6ICcuLycsXG4gICAgICAgICdoYXNVbml0JzogJ21pbGxpc2Vjb25kJ1xuICAgICAgfV1cbiAgICB9O1xuICAgIHZhciBuZXdfbW9kZWxfZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRvYyk7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQT1NUJywgdGhhdC5pZCwgdHJ1ZSk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICBpZih4aHIuc3RhdHVzID09PSAyMDEpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnT0tQb3N0Jyk7XG4gICAgICAgICAgdGhhdC5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1Bvc3QgZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVycm9yIFN0YXR1czogXCIgKyBlLnRhcmdldC5zdGF0dXMpO1xuICAgIH07XG4gICAgeGhyLnNlbmQobmV3X21vZGVsX2RhdGEpO1xuICB9LFxuXG5cblxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGNyZWF0ZV9jb21wdXRlZF90cmFjZTogZnVuY3Rpb24oaWQsIG1ldGhvZCwgcGFyYW1ldGVycywgc291cmNlcykge1xuICAgIFxuICAgIFxuICAgIHZhciBuZXdfdHJhY2UgPSB7XG4gICAgICBcIkBjb250ZXh0XCI6XHRcImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEva3Ricy1qc29ubGQtY29udGV4dFwiLFxuICAgICAgXCJAdHlwZVwiOlx0XCJDb21wdXRlZFRyYWNlXCIsXG4gICAgICBcIkBpZFwiOlx0XHRpZCArIFwiL1wiLFxuICAgICAgXCJoYXNNZXRob2RcIjpcdFx0bWV0aG9kLFxuICAgICAgXCJoYXNTb3VyY2VcIjpcdFx0c291cmNlcywgLy8gYXJyYXlcbiAgICAgIFwicGFyYW1ldGVyXCI6XHRcdHBhcmFtZXRlcnMgIC8vYXJyYXlcbiAgICB9O1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BPU1QnLCB0aGF0LmlkLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIGlmKHhoci5zdGF0dXMgPT09IDIwMSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdPS1Bvc3QnKTtcbiAgICAgICAgICB0aGF0LmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnUG9zdCBlcnJvcicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgU3RhdHVzOiBcIiArIGUudGFyZ2V0LnN0YXR1cyk7XG4gICAgfTtcbiAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShuZXdfdHJhY2UpKTtcbiAgfSwgIFxuICBjcmVhdGVfbWV0aG9kOiBmdW5jdGlvbihpZCwgcGFyZW50LCBwYXJhbWV0ZXJzLCBsYWJlbCkge30sXG4gIC8vLy8vLy8vLy8vXG4gIC8qKlxuICBcdCAqIE92ZXJsb2FkcyB0aGUge0BsaW5rIFNhbW90cmFjZXMuS1RCUy5SZXNvdWNlI19vbl9zdGF0ZV9yZWZyZXNoX30gbWV0aG9kLlxuICBcdCAqIEBwcml2YXRlXG4gIFx0ICovXG4gIF9vbl9zdGF0ZV9yZWZyZXNoXzogZnVuY3Rpb24oZGF0YSkge1xuICAgIC8vXHRjb25zb2xlLmxvZyhkYXRhKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdsYWJlbCcsIGRhdGFbXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWxcIl0sICdiYXNlOnVwZGF0ZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ3RyYWNlcycsIGRhdGEuY29udGFpbnMsICdiYXNlOnVwZGF0ZScpO1xuICB9LFxuICAvLy8vLy8vLy8vLyBBRERFRCAvIEFQSVxuICAvKipcbiAgXHQgKiBHZXRzIGEgdHJhY2UgZnJvbSBpdHMgSURcbiAgXHQgKiBAcGFyYW0gaWQge1N0cmluZ30gSUQgb2YgdGhlIHRyYWNlIHRvIGdldC5cbiAgXHQgKiBAcmV0dXJuIHtTYW1vdHJhY2VzLktUQlMuVHJhY2V9IFRoZSByZXRyaWV2ZWQgVHJhY2UuXG4gIFx0ICovXG4gIGdldF90cmFjZTogZnVuY3Rpb24oaWQpIHtcbiAgICByZXR1cm4gbmV3IFNhbW90cmFjZXMuS1RCUy5UcmFjZSh0aGlzLnVyaSArIGlkICsgJy8nLCBpZCk7XG4gIH0sXG4gIC8vLy8vLy8vLy8vL1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYXNlO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgRXZlbnRIYW5kbGVyID0gcmVxdWlyZShcIi4vRXZlbnRIYW5kbGVyLmpzXCIpO1xuXG4vKipcbiAqIEBzdW1tYXJ5IFRyYWNlIG9iamVjdCB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIEtUQlMuXG4gKiBAY2xhc3MgSmF2YXNjcmlwdCBNb2RlbCBPYmplY3QgdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgTW9kZWwuXG4gKiBAYXV0aG9yIEJlbm/DrnQgTWF0aGVybiAvIERFUkJFTCBGYXRtYVxuICogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiAqIEBjb25zdHJ1Y3RvclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuRXZlbnRIYW5kbGVyXG4gKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNhbW90cmFjZXMuS1RCUy5Nb2RlbGlzIGEgSmF2YXNjcmlwdCBUcmFjZSBvYmplY3RcbiAqIHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIE1vZGVsLiBUaGlzIE9iamVjdCBpbXBsZW1lbnRzIHRoZSBLVEJTIEFQSS5cbiAqIE1ldGhvZHMgYXJlIGF2YWlsYWJsZSB0byBnZXRcbiAqIHRoZSBMaXN0ZSBvZiB0eXBlIG9mIE9ic2VscyBmcm9tIHRoZSBLVEJTIE1vZGVsLCAuXG4gKlxuICpcbiAqXG4gKiBAdG9kbyBGdWxseSBpbXBsZW1lbnQgS1RCUyBBUElcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKiBAcGFyYW0ge1N0cmluZ31cdFtpZF1cdElEIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKi9cblxuXG52YXIgTW9kZWwgPSBmdW5jdGlvbih1cmksIGlkKSB7XG4gIGlmIChpZCA9PT0gdW5kZWZpbmVkKSB7IGlkID0gdXJpOyB9XG4gIEV2ZW50SGFuZGxlci5jYWxsKHRoaXMpO1xuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCBpZCwgdXJpLCAnTW9kZWwnLCBcIlwiKTtcbiAgdGhpcy5saXN0X1R5cGVzX09ic2xlcyA9IFtdXG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xuXG59O1xuXG5Nb2RlbC5wcm90b3R5cGUgPSB7XG5cbiAgX29uX3N0YXRlX3JlZnJlc2hfOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGV0YWcgPSB0aGlzLmdldF9ldGFnKCk7XG4gICAgdGhpcy50cmlnZ2VyKCdNb2RlbDpnZXQnKTtcbiAgICB0aGlzLmxpc3RfVHlwZXNfT2JzbGVzID0gdGhpcy5saXN0X29ic2VscyhkYXRhW1wiQGdyYXBoXCJdKTtcbiAgfSxcbiAgbGlzdF9vYnNlbHM6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBMaXN0ZU9ic2VsVHlwZSA9IFtdO1xuICAgIHZhciBNID0gdGhpcztcbiAgICBkYXRhLmZvckVhY2goZnVuY3Rpb24oZWwsIGtleSkge1xuICAgICAgdmFyIG9icyA9IHthdHRyaWJ1dGVzOiBbXX07XG4gICAgICBpZiAoZWxbXCJAdHlwZVwiXSA9PSBcIk9ic2VsVHlwZVwiKSAgICAgIHtcbiAgICAgICAgb2JzLmlkID0gZWxbXCJAaWRcIl07XG4gICAgICAgIG9icy50eXBlID0gZWxbXCJAaWRcIl0uc3Vic3RyKDEpO1xuICAgICAgICBvYnMuY29jaGUgPSBmYWxzZTtcbiAgICAgICAgLy9vYnNba2V5XSA9IGVsW2tleV1cbiAgICAgICAgaWYgKGVsWydoYXNTdXBlck9ic2VsVHlwZSddKSAgICAgICAge1xuICAgICAgICAgIG9icy5oYXNTdXBlck9ic2VsVHlwZSA9IGVsWydoYXNTdXBlck9ic2VsVHlwZSddXG4gICAgICAgIH1cbiAgICAgICAgTGlzdGVPYnNlbFR5cGUucHVzaChvYnMpO1xuICAgICAgICAvL00udHJpZ2dlcignTW9kZWw6RHJhd19vYnNlbCcsIG9icyk7XG4gICAgICAgIC8vY29uc29sZS5sb2cgKCd0cmlnZXInKVxuICAgICAgfSAgICAgIGVsc2UgaWYgKGVsW1wiQHR5cGVcIl0gPT0gXCJBdHRyaWJ1dGVUeXBlXCIpICAgICAge1xuICAgICAgICBvYnMgPSBNLkdldE9ic2VsVHlwZShlbFtcImhhc0F0dHJpYnV0ZU9ic2VsVHlwZVwiXSwgTGlzdGVPYnNlbFR5cGUpO1xuICAgICAgICBlbFsnY29jaGUnXSA9IGZhbHNlO1xuICAgICAgICBvYnMuYXR0cmlidXRlcy5wdXNoKGVsKTtcblxuICAgICAgfVxuXG4gICAgfSk7XG4gICAgTGlzdGVPYnNlbFR5cGUuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5oYXNTdXBlck9ic2VsVHlwZSkgICAgICB7XG5cbiAgICAgICAgby5hdHRyaWJ1dGVzID0gTS5nZXRBdHRyaWJ1dGVzIChvLmhhc1N1cGVyT2JzZWxUeXBlWzBdKVxuICAgICAgfVxuXG4gICAgfSlcblxuICAgIE0udHJpZ2dlcignTW9kZWw6bGlzdGVUeXBlJywgTGlzdGVPYnNlbFR5cGUpO1xuICAgIHJldHVybiBMaXN0ZU9ic2VsVHlwZTtcblxuICB9LFxuXG4gIEdldE9ic2VsVHlwZTogZnVuY3Rpb24oaWQsIExpc3RlT2JzZWxUeXBlKSAge1xuICAgIHZhciBvYnMgPSBbXTtcbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG9bXCJpZFwiXSA9PSBpZCkgICAgICB7XG5cbiAgICAgICAgb2JzUiA9IG87XG5cbiAgICAgIH1cblxuICAgIH1cbiAgICApXG4gICAgcmV0dXJuIG9ic1I7XG4gIH0sXG5cbiAgZ2V0QXR0cmlidXRlczogZnVuY3Rpb24oaWRlbnQpICB7XG5cbiAgICBMaXN0ZU9ic2VsVHlwZS5mb3JFYWNoKGZ1bmN0aW9uKG8pICAgIHtcblxuICAgICAgaWYgKG8uaWQgPT09IGlkZW50KSAgIHtcbiAgICAgICAgQXR0ID0gby5hdHRyaWJ1dGVzXG4gICAgICB9XG5cbiAgICB9XG4gICAgKVxuICAgIHJldHVybiBBdHQ7XG4gIH0sXG5cbiAgcHV0X21vZGVsOiBmdW5jdGlvbihtb2RlbGRhdGEpIHtcbiAgICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdGhhdC5vbiAoJ01vZGVsOmdldCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgdmFyIGV0YWcgPSB0aGF0LmV0YWc7XG5cbiAgICAvLyBQVVRcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ1BVVCcsIHRoYXQuaWQsIHRydWUpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdJZi1NYXRjaCcsIGV0YWcpO1xuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgaWYoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ09LT0tPSycpO1xuICAgICAgICAgIHJlc29sdmUobmV3IFNhbW90cmFjZXMuS3Ricy5Nb2RlbCh0aGF0LmlkKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHhocik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICByZWplY3QoRXJyb3IoJ1RoZXJlIHdhcyBhIG5ldHdvcmsgZXJyb3IuJykpO1xuICAgIH07XG4gICAgeGhyLnNlbmQobW9kZWxkYXRhKTtcblxuICB9KVxuICB9KTtcbn1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWw7XG4iLCJ2YXIgS1RCU1Jlc291cmNlID0gcmVxdWlyZShcIi4vS1RCUy5SZXNvdXJjZS5qc1wiKTtcbnZhciBPYnNlbCA9IHJlcXVpcmUoXCIuL09ic2VsLmpzXCIpO1xuXG4vKipcbiAqIEBjbGFzcyBTYW1vdHJhY2VzLktUQlMuT2JzZWwgaXMgcGFydCBvZiB0aGUgU2Ftb3RyYWNlcy5LVEJTIGltcGxlbWVudGF0aW9uLlxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuT2JzZWxcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2VcbiAqIEB0b2RvIFRPRE8gdXBkYXRlIHNldF9tZXRob2RzXG4gKiAtPiBzeW5jIHdpdGggS1RCUyBpbnN0ZWFkIG9mIGxvY2FsIGNoYW5nZVxuICovXG52YXIgS1RCU09ic2VsID0gZnVuY3Rpb24ocGFyYW0pIHtcbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgcGFyYW0uaWQsIHBhcmFtLnVyaSwgJ09ic2VsJywgcGFyYW0ubGFiZWwgfHwgXCJcIik7XG5cbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ3RyYWNlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0eXBlJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2JlZ2luJyxcdERhdGUubm93KCkpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdlbmQnLFx0XHR0aGlzLmJlZ2luKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnYXR0cmlidXRlcycsXHR7fSk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdyZWxhdGlvbnMnLFx0W10pOyAvLyBUT0RPIGFqb3V0ZXIgcmVsIMOgIGwnYXV0cmUgb2JzZWxcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2ludmVyc2VfcmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdzb3VyY2Vfb2JzZWxzJyxcdFx0W10pO1xufVxuXG5LVEJTT2JzZWwucHJvdG90eXBlID0gT2JzZWwucHJvdG90eXBlO1xuXG4vKlxuU2Ftb3RyYWNlcy5LVEJTLk9ic2VsLnByb3RvdHlwZS5nZXRfa3Ric19zdGF0dXMgPSBmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXMua3Ric19zdGF0dXNcbn07XG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNPYnNlbDtcbiIsInZhciBFdmVudEhhbmRsZXIgPSByZXF1aXJlKFwiLi9FdmVudEhhbmRsZXIuanNcIik7XG5cbi8qKlxuICogQHN1bW1hcnkgUmVzb3VyY2UgT2JqZWN0cyB0aGF0IGlzIHN5bmNocm9uaXNlZCB0byBhIGtUQlNcbiAqIEBkZXNjcmlwdGlvbiBSZXNvdXJjZSBPYmplY3RzIGFyZSBLVEJTIG9iamVjdHMuIEFsbCByZXNvdXJjZXNcbiAqIGhhdmUgYW4gdXJpLCBhbiBpZCBhbmQgYW4gb3B0aW9uYWwgbGFiZWxcbiAqIEBjbGFzcyBSZXNvdXJjZSBPYmplY3RzIGhhdmUgYW4gdXJpLCBhbiBpZCBhbmQgYW4gb3B0aW9uYWwgbGFiZWxcbiAqIEBwYXJhbSB7U3RyaW5nfSBpZCBJZCBvZiB0aGUgUmVzb3VyY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVVJJIG9mIHRoZSBSZXNvdXJjZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgVHlwZSBvZiB0aGUgUmVzb3VyY2UgKCdLVEJTJywnQmFzZScsXG4gKiAgICAgJ1RyYWNlJywnU3RvcmVkVHJhY2UnLCdDb21wdXRlZFRyYWNlJyBvciAnT2JzZWwnKVxuICogQHBhcmFtIHtsYWJlbH0gW2xhYmVsXSBMYWJlbCBvZiB0aGUgUmVzb3VyY2VcbiAqL1xudmFyIEtUQlNSZXNvdXJjZSA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgUmV0dXJucyB0aGUgcmVzb3VyY2UgdHlwZSBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSB0eXBlICgnS1RCUycsJ0Jhc2UnLFxuICBcdCAqICAgICAnVHJhY2UnLCdTdG9yZWRUcmFjZScsJ0NvbXB1dGVkVHJhY2UnIG9yICdPYnNlbCcpLlxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfcmVzb3VyY2VfdHlwZSgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy50eXBlO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWJzb2x1dGVVUkxGcm9tUmxhdGl2ZShiYXNlLCByZWxhdGl2ZSkge1xuICAgIHZhciBzdGFjayA9IGJhc2Uuc3BsaXQoXCIvXCIpLFxuICAgICAgICBwYXJ0cyA9IHJlbGF0aXZlLnNwbGl0KFwiL1wiKTtcbiAgICBzdGFjay5wb3AoKTsgLy8gcmVtb3ZlIGN1cnJlbnQgZmlsZSBuYW1lIChvciBlbXB0eSBzdHJpbmcpXG4gICAgICAgICAgICAgICAgIC8vIChvbWl0IGlmIFwiYmFzZVwiIGlzIHRoZSBjdXJyZW50IGZvbGRlciB3aXRob3V0IHRyYWlsaW5nIHNsYXNoKVxuICAgIGZvciAodmFyIGk9MDsgaTxwYXJ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocGFydHNbaV0gPT0gXCIuXCIpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgaWYgKHBhcnRzW2ldID09IFwiLi5cIilcbiAgICAgICAgICAgIHN0YWNrLnBvcCgpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICBzdGFjay5wdXNoKHBhcnRzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YWNrLmpvaW4oXCIvXCIpO1xuICB9XG4gIC8vIFJFU09VUkNFIEFQSVxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBJRCBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSBJRC5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X2lkKCkgeyByZXR1cm4gdGhpcy5pZDsgfVxuICAgIC8qKlxuICBcdCAqIEBzdW1tYXJ5IFJldHVybnMgdGhlIFVSSSBvZiB0aGUgUmVzb3VyY2UuXG4gIFx0ICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBSZXNvdXJjZSBVUkkuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGdldF91cmkoKSB7IHJldHVybiB0aGlzLnVyaS5yZXBsYWNlKCcuLycsICcnKTsgfVxuICAvKipcbiAgICogQHN1bW1hcnkgUmV0dXJucyB0aGUgVVJJIG9mIHRoZSBSZXNvdXJjZS5cbiAgICogQG1lbWJlcm9mIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZS5wcm90b3R5cGVcbiAgICogQHJldHVybnMge1N0cmluZ30gUmVzb3VyY2UgVVJJLlxuICAgKi9cbmZ1bmN0aW9uIGdldF9ldGFnKCkgeyByZXR1cm4gdGhpcy5ldGFnOyB9XG4gICAgLyoqXG4gIFx0ICogQHN1bW1hcnkgRm9yY2VzIHRoZSBSZXNvdXJjZSB0byBzeW5jaHJvbmlzZSB3aXRoIHRoZSBLVEJTLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gICAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAgICAgKiAgJ29wdGlvbnMuX29uX3N0YXRlX3JlZnJlc2hfJzogdHJ1ZXxmYWxzZVxuICAgICAqICAgZW5hYmxlIG9yIGRpc2FibGUgdGhlIG9sZCBiZWhhdmlvciBvZiBjYWxsaW5nIF9vbl9zdGF0ZV9yZWZyZXNoXyBvbiB0aGUgcmVzb3VyY2UgYWZ0ZXIgc3luY2hyb25pc2UgY29tcGxldGVzXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogRm9yY2VzIHRoZSBSZXNvdXJjZSB0byBzeW5jaHJvbmlzZSB3aXRoIHRoZSBLVEJTLlxuICBcdCAqIFRoaXMgbWV0aG9kIHRyaWdnZXJzIGEgQWpheCBxdWVyeSB0aGF0IHdpbGxcbiAgXHQgKiB0cmlnZ2VyIHRoZSBfb25fc3RhdGVfcmVmcmVzaF8gbWV0aG9kIG9mIHRoZSBSZXNvdXJjZVxuICBcdCAqIG9uIHN1Y2Nlc3MuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIGZvcmNlX3N0YXRlX3JlZnJlc2gob3B0aW9ucywgc3VjY2VzcywgcmVqZWN0KSB7XG4gICAgc3VjY2VzcyA9IHN1Y2Nlc3MgfHwgZnVuY3Rpb24gKCkge307XG4gICAgcmVqZWN0ID0gcmVqZWN0IHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHsnX29uX3N0YXRlX3JlZnJlc2hfJzogdHJ1ZX07IC8vIEZvciBiYWNrd2FyZCBjb21wYXRpYmlsaXR5XG5cbiAgICB2YXIgdXJsID0gdGhpcy51cmk7XG4gICAgdmFyIHRyYyA9IHRoaXMgO1xuXG4gICAgdmFyIGZ1bmN0aW9uc0J5U3RhdHVzID0ge1xuICAgICAgJzIwMCcgOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICAgIHRyYy5ldGFnID0geGhyLmdldFJlc3BvbnNlSGVhZGVyKCdFVGFnJyk7IC8vIFRPRE8gdGhpcyBjYXVzZSAnUmVmdXNlZCB0byBnZXQgdW5zYWZlIGhlYWRlciBcIkVUYWdcIicgb24gS1RCUyAwLjNcbiAgICAgICAgdmFyIGpzb25SZXNwb25zZSA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcbiAgICAgICAgc3VjY2Vzcyhqc29uUmVzcG9uc2UpO1xuICAgICAgICBpZiAob3B0aW9ucy5fb25fc3RhdGVfcmVmcmVzaF8pIHtcbiAgICAgICAgICB0cmMuX29uX3N0YXRlX3JlZnJlc2hfKGpzb25SZXNwb25zZSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnNDAxJzogZnVuY3Rpb24gKHhocikge1xuICAgICAgICBjb25zb2xlLmxvZyAoeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpKTtcbiAgICAgICAgdmFyIGxpbmsgPSB4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0xpbmsnKTtcbiAgICAgICAgdmFyIGQgPSBsaW5rLnNwbGl0ICgnLCcpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDtpIDwgZC5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgdmFyIHNvdXNEID0gZFtpXS5zcGxpdCgnOycpO1xuICAgICAgICAgIHZhciBsaW5rO1xuICAgICAgICAgIHZhciBVUkxTdWNjZXNzO1xuICAgICAgICAgIGlmIChzb3VzRFsxXSA9PT0gXCIgcmVsPW9hdXRoX3Jlc291cmNlX3NlcnZlclwiKSB7XG4gICAgICAgICAgICBsaW5rID0gc291c0RbMF0uc3Vic3RyKDEsIHNvdXNEWzBdLmxlbmd0aCAtIDIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoc291c0RbMV0gPT09IFwiIHJlbD1zdWNjZXNzZnVsX2xvZ2luX3JlZGlyZWN0XCIpIHtcbiAgICAgICAgICAgIFVSTFN1Y2Nlc3MgPSBzb3VzRFswXS5zdWJzdHIoMiwgc291c0RbMF0ubGVuZ3RoIC0gMyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHdpbmRvdy5vcGVuIChsaW5rKSA7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgU3RhdHVzOiBcIiArIGUudGFyZ2V0LnN0YXR1cyk7XG4gICAgfTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIHZhciBwcm9jZXNzID0gZnVuY3Rpb25zQnlTdGF0dXNbeGhyLnN0YXR1c10gfHwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJOb3QgWWV0IEltcGxlbWVudGVkXCIpO1xuICAgICAgICAgIHJlamVjdCh4aHIpO1xuICAgICAgICB9O1xuICAgICAgICBwcm9jZXNzKHhocik7XG4gICAgICB9XG4gICAgfTtcbiAgICB4aHIuc2VuZChudWxsKTtcbiAgfVxuICAgIC8qKlxuICBcdCAqIEBzdW1tYXJ5IEZvcmNlcyB0aGUgUmVzb3VyY2UgdG8gc3luY2hyb25pc2VcbiAgXHQgKiB3aXRoIGF0IGEgZ2l2ZW4gcmVmcmVzaGluZyByYXRlLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogRm9yY2VzIHRoZSBSZXNvdXJjZSB0byBzeW5jaHJvbmlzZSB3aXRoIHRoZSBLVEJTXG4gIFx0ICogZXZlcnkgcGVyaW9kIHNlY29uZHMuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IHBlcmlvZCBUaW1lIGluIHNlY29uZHMgYmV0d2VlbiB0d28gc3luY2hyb25pc2F0aW9ucy5cbiAgXHQgKi9cblxuXG4gIGZ1bmN0aW9uIHN0YXJ0X2F1dG9fcmVmcmVzaChwZXJpb2QpIHtcbiAgICB2YXIgYSA9IHRoaXMuYXV0b19yZWZyZXNoX2lkP3RoaXMuc3RvcF9hdXRvX3JlZnJlc2goKTpudWxsO1xuICAgIHRoaXMuYXV0b19yZWZyZXNoX2lkID0gd2luZG93LnNldEludGVydmFsKHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaC5iaW5kKHRoaXMpLCBwZXJpb2QgKiAxMDAwKTtcbiAgfVxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBTdG9wcyB0aGUgYXV0b3JlZnJlc2ggc3luY2hyb25pc2F0aW9uXG4gIFx0ICogb2YgdGhlIFJlc291cmNlLlxuICBcdCAqIEBtZW1iZXJvZiBTYW1vdHJhY2VzLktUQlMuUmVzb3VyY2UucHJvdG90eXBlXG4gIFx0ICogQGRlc2NyaXB0aW9uXG4gIFx0ICogU3RvcHMgdGhlIGF1dG9yZWZyZXNoIHN5bmNocm9uaXNhdGlvbiBvZlxuICBcdCAqIHRoZSBSZXNvdXJjZS5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gc3RvcF9hdXRvX3JlZnJlc2goKSB7XG4gICAgaWYgKHRoaXMuYXV0b19yZWZyZXNoX2lkKSB7XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmF1dG9fcmVmcmVzaF9pZCk7XG4gICAgICBkZWxldGUodGhpcy5hdXRvX3JlZnJlc2hfaWQpO1xuICAgIH1cbiAgfVxuICAvL1x0XHRmdW5jdGlvbiBfb25fc3RhdGVfcmVmcmVzaF8oZGF0YSkgeyB0aGlzLmRhdGEgPSBkYXRhOyBjb25zb2xlLmxvZyhcImhlcmVcIik7IH1cbiAgLyoqXG4gIFx0ICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuICBcdCAqL1xuICBmdW5jdGlvbiBnZXRfcmVhZF9vbmx5KCkge31cbiAgLyoqXG4gIFx0ICogQHN1bW1hcnkgRGVsZXRlIHRoZSByZXNvdXJjZSBmcm9tIHRoZSBLVEJTXG4gIFx0ICogQHRvZG8gSU1QUk9WRSBUSElTIE1FVEhPRCBTTyBUSEFUIFBST1BFUiBFVkVOVCBJUyBSQUlTRURcbiAgXHQgKiAgICAgV0hFTiBBIFJFU09VUkNFIElTIERFTEVURUQuXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICBmdW5jdGlvbiByZWZyZXNoX3BhcmVudCgpIHtcbiAgICAgIC8vVFJPVVZFUiBVTiBNT1lFTiBNQUxJTiBERSBSQUZSQUlDSElSIExBIExJU1RFIERFUyBCQVNFUyBEVSBLVEJTLi4uXG4gICAgfVxuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0RFTEVURScsIHRoaXMudXJpLCB0cnVlKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQWNjZXB0JywgJ2FwcGxpY2F0aW9uL2pzb24nKTtcbiAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhyb3cgXCJDYW5ub3QgZGVsZXRlIFwiICsgdGhpcy5nZXRfcmVzb3VyY2VfdHlwZSgpICsgXCIgXCIgKyB0aGlzLnVyaSArIFwiOiBcIiArIHhoci5zdGF0dXM7XG4gICAgfTtcbiAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgIHJlZnJlc2hfcGFyZW50LmJpbmQodGhhdCk7XG4gICAgICB9XG4gICAgfTtcbiAgICB4aHIuc2VuZChudWxsKTtcbiAgfVxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBsYWJlbCBvZiB0aGUgUmVzb3VyY2VcbiAgXHQgKi9cbiAgZnVuY3Rpb24gZ2V0X2xhYmVsKCkgeyByZXR1cm4gdGhpcy5sYWJlbDsgfVxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGZ1bmN0aW9uIHNldF9sYWJlbCgpIHt9XG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgZnVuY3Rpb24gcmVzZXRfbGFiZWwoKSB7fVxuXG4gIC8vIEFEREVEIEZVTkNUSU9OU1xuICAvKipcbiAgXHQgKiBNZXRob2QgdXNlZCB0byBjaGVjayBpZiB0aGUgZGlzdGFudCB2YWx1ZSBpcyBkaWZmZXJlbnRcbiAgXHQgKiBmcm9tIHRoZSBjdXJyZW50IGxvY2FsIHZhbHVlIChhbmQgdXBkYXRlIHRoZSBsb2NhbCB2YWx1ZVxuICBcdCAqIGlmIHRoZXJlIGlzIGEgZGlmZmVyZW5jZS5cbiAgXHQgKiBAcHJpdmF0ZVxuICBcdCAqIEBwYXJhbSBsb2NhbF9maWVsZCB7U3RyaW5nfSBOYW1lIG9mIHRoZSBmaWVsZCBvZiB0aGUgdGhpc1xuICBcdCAqICAgICBvYmplY3QgY29udGFpbmluZyB0aGUgaW5mb3JtYXRpb24gdG8gY2hlY2suXG4gIFx0ICogQHBhcmFtIGRpc3RhbnQge1ZhbHVlfSBWYWx1ZSBvZiB0aGUgZGlzdGFudCBpbmZvcm1hdGlvbi5cbiAgXHQgKiBAcGFyYW0gbWVzc2FnZV9pZl9jaGFuZ2VkIHtTdHJpbmd9IE1lc3NhZ2UgdG8gdHJpZ2dlciBpZlxuICBcdCAqICAgICB0aGUgaW5mb3JtYXRpb24gaGFzIGJlZW4gdXBkYXRlZC5cbiAgXHQgKi9cbiAgZnVuY3Rpb24gX2NoZWNrX2NoYW5nZV8obG9jYWxfZmllbGQsIGRpc3RhbnQsIG1lc3NhZ2VfaWZfY2hhbmdlZCkge1xuICAgIC8vIFRPRE8gY2hlY2sgaWYgdGhpcyBpcyB0aGUgd2FudGVkIGJlaGF2aW91cjpcbiAgICAvLyBJZiBkaXN0YW50IGlzIHVuZGVmaW5lZCAtPiB3aGF0IHRvIGRvP1xuICAgIGlmIChkaXN0YW50ICE9PSB1bmRlZmluZWQgJiYgdGhpc1tsb2NhbF9maWVsZF0gIT09IGRpc3RhbnQpIHtcbiAgICAgIHRoaXNbbG9jYWxfZmllbGRdID0gZGlzdGFudDtcbiAgICAgIHRoaXMudHJpZ2dlcihtZXNzYWdlX2lmX2NoYW5nZWQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihpZCwgdXJpLCB0eXBlLCBsYWJlbCkge1xuICAgIC8vIGEgUmVzb3VyY2UgaXMgYW4gRXZlbnRIYW5kbGVyXG4gICAgU2Ftb3RyYWNlcy5FdmVudEhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAvLyBET0NVTUVOVEVEIEFCT1ZFXG4gICAgLy8gQVRUUklCVVRFU1xuICAgIHRoaXMuaWQgPSBpZDtcbiAgICB0aGlzLnVyaSA9IHVyaTtcbiAgICB0aGlzLmxhYmVsID0gbGFiZWw7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAvLyBBUEkgTUVUSE9EU1xuICAgIHRoaXMuZ2V0X2lkID0gZ2V0X2lkO1xuICAgIHRoaXMuZ2V0X3VyaSA9IGdldF91cmk7XG4gICAgdGhpcy5mb3JjZV9zdGF0ZV9yZWZyZXNoID0gZm9yY2Vfc3RhdGVfcmVmcmVzaDtcbiAgICB0aGlzLmdldF9yZWFkX29ubHkgPSBnZXRfcmVhZF9vbmx5O1xuICAgIHRoaXMucmVtb3ZlID0gcmVtb3ZlO1xuICAgIHRoaXMuZ2V0X2xhYmVsID0gZ2V0X2xhYmVsO1xuICAgIHRoaXMuc2V0X2xhYmVsID0gc2V0X2xhYmVsO1xuICAgIHRoaXMucmVzZXRfbGFiZWwgPSByZXNldF9sYWJlbDtcbiAgICB0aGlzLmdldF9ldGFnID0gZ2V0X2V0YWc7XG4gICAgLy8gaGVscGVyXG4gICAgdGhpcy5nZXRfcmVzb3VyY2VfdHlwZSA9IGdldF9yZXNvdXJjZV90eXBlO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8gPSBfY2hlY2tfY2hhbmdlXztcbiAgICB0aGlzLnN0YXJ0X2F1dG9fcmVmcmVzaCA9IHN0YXJ0X2F1dG9fcmVmcmVzaDtcbiAgICB0aGlzLnN0b3BfYXV0b19yZWZyZXNoID0gc3RvcF9hdXRvX3JlZnJlc2g7XG4gICAgdGhpcy5nZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlPWdldEFic29sdXRlVVJMRnJvbVJsYXRpdmU7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59KSgpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gS1RCU1Jlc291cmNlO1xuIiwidmFyIEtUQlNSZXNvdXJjZSA9IHJlcXVpcmUoXCIuL0tUQlMuUmVzb3VyY2UuanNcIik7XG52YXIgS1RCU09ic2VsID0gcmVxdWlyZShcIi4vS1RCUy5PYnNlbC5qc1wiKTtcblxuLyoqXG4gKiBAc3VtbWFyeSBUcmFjZSBvYmplY3QgdGhhdCBpcyBzeW5jaHJvbmlzZWQgdG8gYSBLVEJTLlxuICogQGNsYXNzIEphdmFzY3JpcHQgVHJhY2UgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTIHRyYWNlLlxuICogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiAqIEByZXF1aXJlcyBqUXVlcnkgZnJhbWV3b3JrIChzZWUgPGEgaHJlZj1cImh0dHA6Ly9qcXVlcnkuY29tXCI+anF1ZXJ5LmNvbTwvYT4pXG4gKiBAY29uc3RydWN0b3JcbiAqIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuICogQGF1Z21lbnRzIFNhbW90cmFjZXMuS1RCUy5SZXNvdXJjZVxuICogQGRlc2NyaXB0aW9uXG4gKiBTYW1vdHJhY2VzLktUQlMuVHJhY2UgaXMgYSBKYXZhc2NyaXB0IFRyYWNlIG9iamVjdFxuICogdGhhdCBpcyBib3VuZCB0byBhIEtUQlMgdHJhY2UuIFRoaXMgT2JqZWN0IGltcGxlbWVudHMgdGhlIEtUQlMgQVBJLlxuICogTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIGdldFxuICogdGhlIE9ic2VscyBmcm9tIHRoZSBLVEJTIHRyYWNlLCBjcmVhdGUgbmV3IE9ic2VscywgZXRjLlxuICpcbiAqIE5vdGU6IHRoaXMgVHJhY2Ugb2JqZWN0IGRvZXMgbm90IGltcGxlbWVudCBhbGwgdGhlIG1ldGhvZHNcbiAqIGF2YWlsYWJsZSBpbiB0aGUgS1RCUyBBUEkgeWV0LlxuICogRm9yIGluc3RhbmNlLCB0aGlzIGNsYXNzIGRvIG5vdCBzdXBwb3J0IHRyYW5zZm9ybWF0aW9ucy5cbiAqXG4gKiBAdG9kbyBGdWxseSBpbXBsZW1lbnQgS1RCUyBBUElcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ31cdHVyaVx0VVJJIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKiBAcGFyYW0ge1N0cmluZ31cdFtpZF1cdElEIG9mIHRoZSBLVEJTIHRyYWNlIHRvIGxvYWQuXG4gKi9cbnZhciBLVEJTVHJhY2UgPSBmdW5jdGlvbiBUcmFjZSh1cmksIGlkKSB7XG4gIC8vIEtUQlMuVHJhY2UgaXMgYSBSZXNvdXJjZVxuICBcInVzZSBzdHJpY3RcIjtcbiAgaWYgKGlkID09PSB1bmRlZmluZWQpIHsgaWQgPSB1cmk7IH1cbiAgS1RCU1Jlc291cmNlLmNhbGwodGhpcywgaWQsIHVyaSwgJ0Jhc2UnLCBcIlwiKTtcblxuICB0aGlzLnRlbXAgPSB7fTsgLy8gYXR0cmlidXRlIHVzZWQgdG8gc3RvcmUgYWN0aW9ucyBtYWRlIGJ5IHRoZSB1c2VyIG9uIHRoZSB0cmFjZSB3aGlsZSBub3Qga25vd2luZyBpZiB0aGV5IGFyZSBhbGxvd2VkLiBlLmcuLCBjcmVhdGVfb2JzZWwsIHdoZW4gd2UgZG9uJ3Qga25vdyB5ZXQgaWYgdGhlIFRyYWNlIGlzIGEgU3RvcmVkVHJhY2UgYmVjYXVzZSB0aGUgS1RCUyBkaWRuJ3QgcmVwbHkgeWV0LlxuICB0aGlzLmRlZmF1bHRfc3ViamVjdCA9IFwiXCI7XG4gIHRoaXMubW9kZWxfdXJpID0gXCJcIjtcbiAgdGhpcy5vYnNlbF9saXN0X3VyaSA9IHVyaSArIFwiQG9ic2Vsc1wiO1xuICB0aGlzLmJhc2VfdXJpID0gXCJcIjtcbiAgdGhpcy5vcmlnaW4gPSBcIlwiO1xuICAvL3RoaXMub3JpZ2luX29mZnNldCA9IChuZXcgRGF0ZSgwKSkuZ2V0TWlsbGlzZWNvbmRzKCk7XG4gIHRoaXMub2JzZWxfbGlzdCA9IFtdOyB0aGlzLnRyYWNlU2V0ID0gW107XG4gIHRoaXMuZm9yY2Vfc3RhdGVfcmVmcmVzaCgpO1xufTtcblxuS1RCU1RyYWNlLnByb3RvdHlwZSA9IHtcbiAgLy8vLy8vLy8vLy8gT0ZGSUNJQUwgQVBJXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEdldHMgdGhlIGJhc2Ugd2hlcmUgdGhlIHRyYWNlIGlzIHN0b3JlZC5cbiAgXHQgKiBAcmV0dXJucyB7U3RyaW5nfSBVUkkgb2YgdGhlIGJhc2Ugd2hlcmUgdGhlIHRyYWNlIGlzIHN0b3JlZC5cbiAgXHQgKi9cbiAgZ2V0X2Jhc2U6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLmdldEFic29sdXRlVVJMRnJvbVJsYXRpdmUodGhpcy5nZXRfdXJpKCksdGhpcy5iYXNlX3VyaSk7XG4gIH0sXG4gIC8qKlxuICBcdCAqIEBkZXNjcmlwdGlvblxuICBcdCAqIEdldHMgdGhlIG1vZGVsIG9mIHRoZSB0cmFjZS5cbiAgXHQgKiBAcmV0dXJucyB7TW9kZWx9IE1vZGVsIG9mIHRoZSB0cmFjZS5cbiAgXHQgKiBAdG9kbyBERUZJTkUgV0hBVCBJUyBBIE1PREVMXG4gIFx0ICovXG4gIGdldF9tb2RlbDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICByZXR1cm4gdGhpcy5nZXRBYnNvbHV0ZVVSTEZyb21SbGF0aXZlKHRoaXMuZ2V0X3VyaSgpLHRoaXMubW9kZWxfdXJpKTtcbiB9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBHZXRzIHRoZSBvcmlnaW4gb2YgdGhlIHRyYWNlLlxuICBcdCAqIEByZXR1cm5zIHtPcmlnaW59IE9yaWdpbiBvZiB0aGUgdHJhY2UuXG4gIFx0ICogQHRvZG8gREVGSU5FIFdIQVQgSVMgQU4gT1JJR0lOXG4gIFx0ICovXG4gIGdldF9vcmlnaW46IGZ1bmN0aW9uKCkgeyBcInVzZSBzdHJpY3RcIjsgcmV0dXJuIHRoaXMub3JpZ2luOyB9LFxuICAvL2dldF9vcmlnaW5fb2Zmc2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMub3JpZ2luX29mZnNldDsgfSxcbiAgLyprdGJzX29yaWdpbl90b19tczogZnVuY3Rpb24oa3Ric19kYXRlX3N0cikge1xuICBcdFx0dmFyIFkgPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigwLDQpO1xuICBcdFx0dmFyIE0gPSBrdGJzX2RhdGVfc3RyLnN1YnN0cig1LDIpIC0gMTtcbiAgXHRcdHZhciBEID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoOCwyKTtcbiAgXHRcdHZhciBoID0ga3Ric19kYXRlX3N0ci5zdWJzdHIoMTEsMik7XG4gIFx0XHR2YXIgbSA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDE0LDIpO1xuICBcdFx0dmFyIHMgPSBrdGJzX2RhdGVfc3RyLnN1YnN0cigxNywyKTtcbiAgXHRcdHZhciBtcyA9IGt0YnNfZGF0ZV9zdHIuc3Vic3RyKDIwLDMpO1xuICBcdFx0cmV0dXJuIERhdGUuVVRDKFksTSxELGgsbSxzLG1zKTtcbiAgXHR9LCovXG4gIC8qKlxuICBcdCAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiAgXHQgKi9cbiAgbGlzdF9zb3VyY2VfdHJhY2VzOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgXHQgKiBAdG9kbyBNRVRIT0QgTk9UIElNUExFTUVOVEVEXG4gIFx0ICovXG4gIGxpc3RfdHJhbnNmb3JtZWRfdHJhY2VzOiBmdW5jdGlvbigpIHt9LFxuICAvKipcbiAgXHQgKiBAZGVzY3JpcHRpb25cbiAgXHQgKiBSZXR1cm5zIHRoZSBsaXN0IG9mIG9ic2VscyBpbiBhbiBvcHRpb25hbCB0aW1lIGludGVydmFsLlxuICBcdCAqIElmIG5vIG1pbmltdW0gdGltZSBhbmQgbm8gbWF4aW11bSB0aW1lIGNvbnN0cmFpbnQgYXJlXG4gIFx0ICogZGVmaW5lZCwgcmV0dXJucyB0aGUgd2hvbGUgbGlzdCBvZiBvYnNlbHMuXG4gIFx0ICogSWYgb25lIG9mIHRoZSB0d28gY29uc3RyYWludHMgYXJlIGRlZmluZWQsIHRoZW4gcmV0dXJuc1xuICBcdCAqIG9ic2VscyBtYXRjaGluZyB0aGUgdGltZSBjb25zdHJhaW50cy5cbiAgXHQgKlxuICBcdCAqIE5vdGU6IGlmIGFuIG9ic2VsIG92ZXJsYXBzIHdpdGggdGhlIHN0YXJ0IG9yIHRoZSBlbmRcbiAgXHQgKiBjb25zdHJhaW50LCB0aGVuIGl0IHdpbGwgYmUgaW5jbHVkZWQgKGZvciBpbnN0YW5jZSBhblxuICBcdCAqIG9ic2VsIHRoYXQgc3RhcnRzIGJlZm9yZSB0aGUgc3RhcnQgY29uc3RyYWludCBhbmQgZW5kc1xuICBcdCAqIGFmdGVyIHRoYXQgY29uc3RyYWludCB3aWxsIGJlIGluY2x1ZGVkKS5cbiAgXHQgKlxuICBcdCAqIE5vdGU6IHRoZSBsaXN0IHJldHVybmVkIGJ5IHRoaXMgbWV0aG9kIGlzIHRoZVxuICBcdCAqIGxpc3Qgb2YgT2JzZWxzIHRoYXQgYXJlIGxvYWRlZCBsb2NhbGx5LlxuICBcdCAqIFdoZW4gdGhpcyBtZXRob2QgaXMgY2FsbGVkLCBhIHF1ZXJ5IHRvIHRoZSBLVEJTXG4gIFx0ICogaXMgbWFkZSB0byBrbm93IGlmIHRoZXJlIGFyZSBvdGhlciBPYnNlbHMgbWF0Y2hpbmdcbiAgXHQgKiB0aGUgcXVlcnkuIElmIHNvLCB0aGVzZSBvdGhlciBvYnNlbHMgd2lsbCBiZSBsb2FkZWRcbiAgXHQgKiBpbiB0aGUgbG9jYWwgY29weSBvZiB0aGUgdHJhY2UgYW5kIGFcbiAgXHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTpjcmVhdGU6b2JzZWx8dHJhY2U6Y3JlYXRlOm9ic2VsfVxuICBcdCAqIGV2ZW50IG9yIGFcbiAgXHQgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTp1cGRhdGV8dHJhY2U6dXBkYXRlfVxuICBcdCAqIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkIHRvIG5vdGlmeSB0aGF0IG90aGVyXG4gIFx0ICogT2JzZWxzIGhhdmUgYmVlbiBsb2FkZWQuXG4gIFx0ICogQHBhcmFtIHtOdW1iZXJ9IFtiZWdpbl0gTWluaW11bSB0aW1lIGNvbnN0cmFpbnRcbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gW2VuZF0gTWF4aW11bSB0aW1lIGNvbnN0cmFpbnRcbiAgXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtyZXZlcnNlPWZhbHNlXSBSZXR1cm5zIHRoZSBvYnNlbCBsaXN0IGluXG4gIFx0ICogICAgIHJldmVyc2UgY2hyb25vbG9naWNhbCBvcmRlciBpZiB0cnVlIGFuZCBpbiBub3JtYWxcbiAgXHQgKiAgICAgY2hyb25vbG9naWNhbCBvcmRlciBpZiBmYWxzZS5cbiAgXHQgKiBAcmV0dXJucyB7QXJyYXkuPE9ic2VsPn0gTGlzdCBvZiByZWxldmFudCBvYnNlbHNcbiAgXHQgKiBAdG9kbyBSRVZFUlNFIElTIE5PVCBZRVQgVEFLRU4gSU5UTyBBQ0NPVU5UXG4gIFx0ICovXG4gIC8vIFRPRE8gYWRkIGFuIG9wdGlvbmFsIENBTExCQUNLPz8/XG4gIGxpc3Rfb2JzZWxzOiBmdW5jdGlvbihiZWdpbiwgZW5kLCByZXZlcnNlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5vYnNlbF9saXN0X3VyaSA9IHRoaXMudXJpICsgXCJAb2JzZWxzXCI7XG4gICAgaWYgKHRoaXMub2JzZWxfbGlzdF91cmkgPT09IFwiXCIpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgaW4gS1RCUzpUcmFjZTpsaXN0X29ic2VscygpIHVua25vd24gdXJpXCIpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBPQkogPSB0aGlzO1xuXG4gICAgLy9cdFx0JC5nZXRKU09OKHRoaXMub2JzZWxfbGlzdF91cmksdGhpcy5fb25fcmVmcmVzaF9vYnNlbF9saXN0Xy5iaW5kKHRoaXMpKTtcbiAgICB2YXIgT0JKID0gdGhpcztcbiAgICBcbiAgICB2YXIgZnVuY3Rpb25zQnlTdGF0dXMgPSB7XG4gICAgICAnMjAwJyA6IGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBqc29uUmVzcG9uc2UgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XG4gICAgICAgIGlmIChqc29uUmVzcG9uc2Uub2JzZWxzLmxlbmd0aCA+IDApXG4gICAgICAgIHtPQkouQmVmb3JlX29uX3JlZnJlc2hfb2JzZWxfbGlzdF8gKGpzb25SZXNwb25zZSk7fVxuICAgICAgfSxcbiAgICAgICc0MDEnOiBmdW5jdGlvbiAoeGhyKSB7XG4gICAgICAgIGNvbnNvbGUubG9nICh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkpO1xuICAgICAgICB2YXIgbGluayA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignTGluaycpO1xuICAgICAgICB2YXIgZCA9IGxpbmsuc3BsaXQgKCcsJyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwO2kgPCBkLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICB2YXIgc291c0QgPSBkW2ldLnNwbGl0KCc7Jyk7XG4gICAgICAgICAgdmFyIGxpbms7XG4gICAgICAgICAgdmFyIFVSTFN1Y2Nlc3M7XG4gICAgICAgICAgaWYgKHNvdXNEWzFdID09PSBcIiByZWw9b2F1dGhfcmVzb3VyY2Vfc2VydmVyXCIpIHtcbiAgICAgICAgICAgIGxpbmsgPSBzb3VzRFswXS5zdWJzdHIoMSwgc291c0RbMF0ubGVuZ3RoIC0gMik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChzb3VzRFsxXSA9PT0gXCIgcmVsPXN1Y2Nlc3NmdWxfbG9naW5fcmVkaXJlY3RcIikge1xuICAgICAgICAgICAgVVJMU3VjY2VzcyA9IHNvdXNEWzBdLnN1YnN0cigyLCBzb3VzRFswXS5sZW5ndGggLSAzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93Lm9wZW4gKGxpbmspIDtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIHRoYXQub2JzZWxfbGlzdF91cmksIHRydWUpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbicpO1xuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgdmFyIHByb2Nlc3MgPSBmdW5jdGlvbnNCeVN0YXR1c1t4aHIuc3RhdHVzXSB8fCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vdCBZZXQgSW1wbGVtZW50ZWRcIik7XG4gICAgICAgIH07XG4gICAgICAgIHByb2Nlc3MoeGhyKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oZSkge1xuICAgICAgY29uc29sZS5sb2coXCJFcnJvciBTdGF0dXM6IFwiICsgZS50YXJnZXQuc3RhdHVzKTtcbiAgICB9O1xuICAgIHhoci5zZW5kKG51bGwpO1xuICAgIHJldHVybiB0aGlzLm9ic2VsX2xpc3QuZmlsdGVyKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChlbmQgJiYgby5nZXRfYmVnaW4oKSA+IGVuZCkgeyByZXR1cm4gZmFsc2U7IH1cbiAgICAgIGlmIChiZWdpbiAmJiBvLmdldF9lbmQoKSA8IGJlZ2luKSB7IHJldHVybiBmYWxzZTsgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gIH0sXG5cbiAgQmVmb3JlX29uX3JlZnJlc2hfb2JzZWxfbGlzdF86IGZ1bmN0aW9uKGRhdGFSZWN1KSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgLy8gcGFyIHBhcXVldFxuICAgIHRoaXMudHJpZ2dlcigndHJhY2U6Q29uZmlnJywgZGF0YVJlY3UpO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgZW5kID0gTnVtYmVyKGkpICsgTnVtYmVyKDEwMCk7XG5cbiAgICBpZiAoZGF0YVJlY3Uub2JzZWxzKSB7XG4gICAgICB0aGlzLl9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAoZGF0YVJlY3Uub2JzZWxzLCBpLCBlbmQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuX29uX3JlZnJlc2hfb2JzZWxfbGlzdF9ncm91cChkYXRhUmVjdSwgaSwgZW5kKTtcbiAgICB9XG5cblxuICB9LFxuICBfb25fcmVmcmVzaF9vYnNlbF9saXN0X2dyb3VwOiBmdW5jdGlvbihkYXRhUmVjdSwgaSwgZW5kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGNvdW50ID0gMDtcbiAgICB2YXIgZCA9IGRhdGFSZWN1Lmxlbmd0aCA7XG4gICAgdmFyIGRhdGFUb0RyYXcgPSBkYXRhUmVjdS5zbGljZSAoaSwgZW5kKTtcbiAgICBjb25zb2xlLmxvZyAoJ19vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAnKTtcbiAgICAgIGZvciAodmFyIGo9MCA7ICBqIDwgZGF0YVRvRHJhdy5sZW5ndGg7IGorKyl7XG4gICAgICAgIHRoaXMuX3BhcnNlX2dldF9vYnNlbF8oZGF0YVRvRHJhd1tqXSk7XG4gICAgICAgIGlmIChqID09PSBkYXRhVG9EcmF3Lmxlbmd0aCAtMSl7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTp1cGRhdGVUJyk7XG4gICAgICAgICAgdmFyIGkgPSBOdW1iZXIoaSkgKyBkYXRhVG9EcmF3Lmxlbmd0aCArIE51bWJlcigxKTtcbiAgICAgICAgICB2YXIgZW5kID0gKE51bWJlcihpKSArIE51bWJlcigxMDApID4gZCk/ZGF0YVJlY3UubGVuZ3RoIDogTnVtYmVyKGkpICsgTnVtYmVyKDEwMClcbiAgICAgICAgICBpZiAoaSA8PSBkKSAge1xuICAgICAgICAgICAgICB0aGlzLl9vbl9yZWZyZXNoX29ic2VsX2xpc3RfZ3JvdXAoZGF0YVJlY3UsIGksIGVuZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLnRyaWdnZXIoJ3RyYWNlOnVwZGF0ZUNvbXBsZXRlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gIH0sXG5cbiAgX29uX3JlZnJlc2hfb2JzZWxfbGlzdF86IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgY291bnQgPSAwO1xuXG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsKSB7XG4gICAgICBjb3VudCArKztcbiAgICAgIHRoaXMuX3BhcnNlX2dldF9vYnNlbF8oZWwpO1xuICAgICAgaWYgKGNvdW50ID09PSBkYXRhLmxlbmd0aCkgICAgICB7dGhpcy50cmlnZ2VyKCd0cmFjZTp1cGRhdGVUJywgdGhpcyk7fVxuICAgIH0sIHRoaXMpO1xuXG5cbiAgfSxcblxuICBnZXRfTGFzdF9vYnNlbDogZnVuY3Rpb24oKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIG9icztcbiAgICB2YXIgbWF4ID0gMDtcbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5nZXRfYmVnaW4oKSA+IG1heCkgeyBvYnMgPSBvOyB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9icztcbiAgfSxcbiAgZ2V0X0ZpcnN0X29ic2VsOiBmdW5jdGlvbigpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgb2JzO1xuICAgIHZhciBtaW4xID0gOTk5OTk5OTk5OTk5OTtcbiAgICB0aGlzLm9ic2VsX2xpc3QuZm9yRWFjaChmdW5jdGlvbihvKSB7XG4gICAgICBpZiAoby5nZXRfYmVnaW4oKSA8IG1pbjEpIHsgb2JzID0gbzsgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYnM7XG4gIH0sXG4gIGdldF9MaXN0X29ic2VsX1BhclR5cGU6IGZ1bmN0aW9uKG9ic2VsVHlwZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBsaXN0ZSA9IFtdO1xuXG4gICAgdGhpcy5vYnNlbF9saXN0LmZvckVhY2goZnVuY3Rpb24obykge1xuICAgICAgaWYgKG8udHlwZSA9PT0gb2JzZWxUeXBlKSB7IGxpc3RlLnB1c2gobyk7IH1cbiAgICB9KTtcbiAgICByZXR1cm4gbGlzdGU7XG4gIH0sXG5cblxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBGb3JjZXMgdGhlIGxvY2FsIG9ic2VsIGxpc3QgdG8gYmUgc3luY2hyb25pc2VkXG4gIFx0ICogd2l0aCB0aGUgS1RCUyBhdCBhIGdpdmVuIHJlZnJlc2hpbmcgcmF0ZS5cbiAgXHQgKiBAcGFyYW0ge051bWJlcn0gcGVyaW9kIFRpbWUgaW4gc2Vjb25kcyBiZXR3ZWVuIHR3byBzeW5jaHJvbmlzYXRpb25zLlxuICBcdCAqL1xuICBzdGFydF9hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdDogZnVuY3Rpb24ocGVyaW9kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIGEgPSB0aGlzLmF1dG9fcmVmcmVzaF9vYnNlbF9saXN0X2lkP3RoaXMuc3RvcF9hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdCgpOm51bGw7XG4gICAgdGhpcy5hdXRvX3JlZnJlc2hfb2JzZWxfbGlzdF9pZCA9IHdpbmRvdy5zZXRJbnRlcnZhbCh0aGlzLmxpc3Rfb2JzZWxzLmJpbmQodGhpcyksIHBlcmlvZCAqIDEwMDApO1xuICB9LFxuICAvKipcbiAgXHQgKiBAc3VtbWFyeSBTdG9wcyB0aGUgYXV0b3JlZnJlc2ggc3luY2hyb25pc2F0aW9uXG4gIFx0ICogb2YgdGhlIG9ic2VsIGxpc3QuXG4gIFx0ICovXG4gIHN0b3BfYXV0b19yZWZyZXNoX29ic2VsX2xpc3Q6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmF1dG9fcmVmcmVzaF9vYnNlbF9saXN0X2lkKSB7XG4gICAgICB3aW5kb3cuY2xlYXJJbnRlcnZhbCh0aGlzLmF1dG9fcmVmcmVzaF9pZCk7XG4gICAgICBkZWxldGUodGhpcy5hdXRvX3JlZnJlc2hfaWQpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgXHQgKiBSZXRyaWV2ZSBhbiBvYnNlbCBpbiB0aGUgdHJhY2UgZnJvbSBpdHMgSUQuXG4gIFx0ICogSWYgdGhlIG9ic2VsIGRvZXMgbm90IGV4aXN0IGxvY2FsbHksIHJldHVybnNcbiAgXHQgKiB1bmRlZmluZWQgYW5kIHNlbmQgYSBxdWVyeSB0byB0aGUgS1RCU1xuICBcdCAqICh3aGljaCB3aWxsIHJlc3VsdCBpbiBhZGRpbmcgdGhpcyBvYnNlbCBsb2NhbGx5XG4gIFx0ICogaWYgaXQgZXhpc3RzIG9uIHRoZSBLVEJTKS5cbiAgXHQgKiBAcGFyYW0ge1N0cmluZ30gaWQgSUQgb2YgdGhlIE9ic2VsIHRvIHJldHJpZXZlXG4gIFx0ICogQHJldHVybnMge09ic2VsfSBPYnNlbCB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoaXMgSURcbiAgXHQgKiAgICAgb3IgdW5kZWZpbmVkIGlmIHRoZSBvYnNlbCB3YXMgbm90IGZvdW5kLlxuICBcdCAqIEB0b2RvIFRPRE8gYWRkIGFuIG9wdGlvbmFsIENBTExCQUNLXG4gIFx0ICovXG4gIGdldF9vYnNlbDogZnVuY3Rpb24oaWQpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgb2JzO1xuICAgIHRoaXMub2JzZWxfbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKG8pIHtcbiAgICAgIGlmIChvLmdldF9pZCgpID09PSBpZCkgeyBvYnMgPSBvOyB9XG4gICAgfSk7XG4gICAgaWYgKG9icyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyBzZW5kcyBhIHF1ZXJ5IHRvIGZpbmQgdGhlIG9ic2VsXG4gICAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIC8vIFRPRE8gaWRlYWxseSBKU09OLi4uIFdoZW4gS1RCUyBzdXBwb3J0cyBpdCFcbiAgICAgICAgdXJsOiB0aGlzLnVyaSArIGlkLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgc3VjY2VzczogdGhpcy5fcGFyc2VfZ2V0X29ic2VsXy5iaW5kKHRoaXMpLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBvYnM7XG4gIH0sXG4gIC8qKlxuICBcdCAqIENhbGxiYWNrIGZvciBxdWVyaWVzIHdoZXJlIGFuIG9ic2VsIGlzIGV4cGVjdGVkIGFzIGEgcmVzdWx0XG4gIFx0ICogUGFyc2VzIHRoZSBKU09OIGRhdGEgZnJvbSB0aGUgS1RCUyB0byBjcmVhdGUgYSBuZXcgT2JzZWwgbG9jYWxseVxuICBcdCAqIGlmIGl0IGRvZXNuJ3QgZXhpc3QgYWxyZWFkeS5cbiAgXHQgKiBAcHJpdmF0ZVxuICBcdCAqL1xuICBfcGFyc2VfZ2V0X29ic2VsXzogZnVuY3Rpb24oZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgb2JzID0ge1xuICAgICAgYXR0cmlidXRlczoge31cbiAgICB9O1xuXG4gICAgLy8gT0JTRUwgSURcbiAgICBvYnMuaWQgPSBkYXRhW1wiQGlkXCJdO1xuICAgIGlmICh0aGlzLnR5cGUgPT09IFwiQ29tcHV0ZWRUcmFjZVwiKSB7b2JzLmlkID0gb2JzLnR5cGUgKyBcIl9cIiArIG9icy5pZDt9XG4gICAgaWYgKG9icy5pZC5zdWJzdHIoMCwgMikgPT09IFwiLi9cIikgeyBvYnMuaWQgPSBvYnMuaWQuc3Vic3RyKDIpOyB9XG5cbiAgICAvLyBPQlNFTCBUUkFDRVxuICAgIC8vIGRhdGEuaGFzVHJhY2U7XG4gICAgb2JzLnRyYWNlID0gdGhpcztcblxuICAgIC8vIE9CU0VMIFRZUEVcbiAgICAvLyBkYXRhW1wiQHR5cGVcIl07IC8vIFRPRE8gQlVHIEtUQlMgLT4gVVNFIFwibTp0eXBlXCIgaW5zdGVhZFxuICAgIC8vIGRhdGFbXCJtOnR5cGVcIl07XG4gICAgb2JzLnR5cGUgPSBkYXRhW1wiQHR5cGVcIl0uc3Vic3RyKDIpO1xuXG4gICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbCcpKSB7XG4gICAgICBvYnMubGFiZWwgPSBkYXRhWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXTtcbiAgICB9XG4gICAgLy9vYnMuYmVnaW4gPSBkYXRhLmJlZ2luO1xuICAgIC8vb2JzLmVuZCA9IGRhdGEuZW5kO1xuICAgIHZhciBkID0gbmV3IERhdGUgKHRoaXMub3JpZ2luKTtcbiAgICBvYnMuYmVnaW4gPSBkLmdldFRpbWUoKSArIGRhdGEuYmVnaW4gO1xuICAgIG9icy5lbmQgPSBkLmdldFRpbWUoKSArIGRhdGEuZW5kO1xuXG4gICAgLy8gREVMRVRJTkcgUFJPUEVSVElFUyBUSEFUIEhBVkUgQUxSRUFEWSBCRUVOIENPUElFRFxuICAgIGRlbGV0ZSBkYXRhW1wiQGlkXCJdO1xuICAgIGRlbGV0ZSBkYXRhLmhhc1RyYWNlO1xuICAgIGRlbGV0ZSBkYXRhW1wiQHR5cGVcIl07XG4gICAgZGVsZXRlIGRhdGEuYmVnaW47XG4gICAgZGVsZXRlIGRhdGEuZW5kO1xuICAgIGRlbGV0ZSBkYXRhWydodHRwOi8vd3d3LnczLm9yZy8yMDAwLzAxL3JkZi1zY2hlbWEjbGFiZWwnXTtcbiAgICAvL2RlbGV0ZSBkYXRhW1wibTp0eXBlXCJdO1xuXG5cbiAgICAvLyBBVFRSSUJVVEVTXG4gICAgZm9yICh2YXIgYXR0ciBpbiBkYXRhKSB7XG4gICAgICBpZiAoYXR0ci5zdWJzdHIoMCwgMikgPT09IFwibTpcIikgeyAvLyBUT0RPIHRoaXMgaXMgbm90IGdlbmVyaWMhISEhXG4gICAgICAgIG9icy5hdHRyaWJ1dGVzW2F0dHIuc3Vic3RyKDIpXSA9IGRhdGFbYXR0cl07XG4gICAgICB9XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coZGF0YSxvYnMpO1xuICAgIHZhciBvID0gbmV3IEtUQlNPYnNlbChvYnMpO1xuICAgIGlmICghdGhpcy5fY2hlY2tfb2JzZWxfbG9hZGVkXyhvKSkgeyAvLyBUT0RPIGZpcnN0IGFwcHJveGltYXRpb25cbiAgICAgIHRoaXMudHJpZ2dlcigndHJhY2U6Y3JlYXRlX29ic2VsJywgbyk7XG4gICAgfVxuICB9LFxuXG4gIC8vLy8vLy8vLy8vXG4gIC8qKlxuICBcdCAqIE92ZXJsb2FkcyB0aGUge0BsaW5rIFNhbW90cmFjZXMuS1RCUy5SZXNvdWNlI19vbl9zdGF0ZV9yZWZyZXNoX30gbWV0aG9kLlxuICBcdCAqIEBwcml2YXRlXG4gIFx0ICovXG4gIF9vbl9zdGF0ZV9yZWZyZXNoXzogZnVuY3Rpb24oZGF0YSkge1xuICAgIC8vXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuX2NoZWNrX2FuZF91cGRhdGVfdHJhY2VfdHlwZV8oZGF0YVsnQHR5cGUnXSk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnZGVmYXVsdF9zdWJqZWN0JywgZGF0YS5oYXNEZWZhdWx0U3ViamVjdCwgJycpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ21vZGVsX3VyaScsIGRhdGEuaGFzTW9kZWwsICd0cmFjZTptb2RlbCcpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ29ic2VsX2xpc3RfdXJpJywgZGF0YS5oYXNPYnNlbExpc3QsICd0cmFjZTp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdiYXNlX3VyaScsIGRhdGEuaW5CYXNlLCAndHJhY2U6YmFzZScpO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ29yaWdpbicsIGRhdGEub3JpZ2luLCAndHJhY2U6dXBkYXRlJyk7XG4gICAgdGhpcy5fY2hlY2tfY2hhbmdlXygnbGFiZWwnLCBkYXRhLmxhYmVsLCAndHJhY2U6dXBkYXRlJyk7XG4gICAgdGhpcy50cmlnZ2VyKCd0cmFjZTp1cGRhdGVEYXRhJywgZGF0YSk7XG4gICAgLy90aGlzLl9jaGVja19jaGFuZ2VfKCdvcmlnaW5fb2Zmc2V0Jyx0aGlzLmt0YnNfb3JpZ2luX3RvX21zKGRhdGEub3JpZ2luKSwnJyk7XG4gIH0sXG4gIF91cGRhdGVfbWV0aG9kXzogZnVuY3Rpb24odHJhY2VfdHlwZSwgbWV0aG9kX25hbWUpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzW21ldGhvZF9uYW1lXSA9IHRoaXNbdHJhY2VfdHlwZSArIFwiX21ldGhvZHNcIl1bbWV0aG9kX25hbWVdO1xuICAgIGlmICh0aGlzLnRlbXBbbWV0aG9kX25hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMudGVtcFttZXRob2RfbmFtZV0uZm9yRWFjaChmdW5jdGlvbihwYXJhbSkge1xuICAgICAgICB0aGlzW21ldGhvZF9uYW1lXShwYXJhbSk7XG4gICAgICB9LCB0aGlzKTtcbiAgICB9XG4gIH0sXG4gIF9jaGVja19hbmRfdXBkYXRlX3RyYWNlX3R5cGVfOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMudHlwZSAhPT0gdHlwZSkge1xuICAgICAgZm9yICh2YXIgbWV0aG9kX25hbWUgaW4gdGhpc1t0eXBlICsgXCJfbWV0aG9kc1wiXSkge1xuICAgICAgICBpZiAodGhpc1t0eXBlICsgXCJfbWV0aG9kc1wiXS5oYXNPd25Qcm9wZXJ0eShtZXRob2RfbmFtZSkpICAgICAgICB7dGhpcy5fdXBkYXRlX21ldGhvZF8odHlwZSwgbWV0aG9kX25hbWUpO31cbiAgICAgIH1cbiAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgfVxuICB9LFxuICAvLy8vLy8vLy8vL1xuICAvKlx0X29uX3JlZnJlc2hfb2JzZWxfbGlzdF86IGZ1bmN0aW9uKGRhdGEpIHtcbiAgLy9cdFx0Y29uc29sZS5sb2coZGF0YSk7XG4gIFx0XHR2YXIgaWQsIGxhYmVsLCB0eXBlLCBiZWdpbiwgZW5kLCBhdHRyaWJ1dGVzLCBvYnM7XG4gIFx0XHR2YXIgbmV3X29ic2VsX2xvYWRlZCA9IGZhbHNlO1xuICBcdFx0ZGF0YS5vYnNlbHMuZm9yRWFjaChmdW5jdGlvbihlbCxrZXkpIHtcbiAgXHRcdFx0dGhpcy5fcGFyc2VfZ2V0X29ic2VsXyhlbCk7XG4gIC8qXG4gIFx0XHRcdHZhciBhdHRyID0ge307XG4gIFx0XHRcdGF0dHIuaWQgPSBlbFsnQGlkJ107XG4gIFx0XHRcdGF0dHIudHJhY2UgPSB0aGlzO1xuICBcdFx0XHRhdHRyLmxhYmVsID0gZWxbJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbCddIHx8IHVuZGVmaW5lZDtcbiAgXHRcdFx0YXR0ci50eXBlID0gZWxbJ0B0eXBlJ107XG4gIFx0XHRcdGF0dHIuYmVnaW4gPSBlbFsnYmVnaW4nXTtcbiAgXHRcdFx0YXR0ci5lbmQgPSBlbFsnZW5kJ107XG4gIFx0XHRcdGF0dHIuYXR0cmlidXRlcyA9IGVsO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydAaWQnXSk7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvMDEvcmRmLXNjaGVtYSNsYWJlbCddKTtcbiAgXHRcdFx0ZGVsZXRlKGF0dHIuYXR0cmlidXRlc1snQHR5cGUnXSk7XG4gIFx0XHRcdGRlbGV0ZShhdHRyLmF0dHJpYnV0ZXNbJ2JlZ2luJ10pO1xuICBcdFx0XHRkZWxldGUoYXR0ci5hdHRyaWJ1dGVzWydlbmQnXSk7XG4gIFx0XHRcdG9icyA9IG5ldyBTYW1vdHJhY2VzLktUQlMuT2JzZWwoYXR0cik7XG5cbiAgXHRcdFx0aWYoISB0aGlzLl9jaGVja19vYnNlbF9sb2FkZWRfKG9icykpIHtcbiAgXHRcdFx0XHRuZXdfb2JzZWxfbG9hZGVkID0gdHJ1ZTtcbiAgXHRcdFx0fVxuKi9cbiAgLy99LHRoaXMpO1xuICAvKlx0XHRpZihuZXdfb2JzZWxfbG9hZGVkKSB7XG4gIFx0XHRcdHRoaXMudHJpZ2dlcigndHJhY2U6dXBkYXRlJyx0aGlzLnRyYWNlU2V0KTtcbiAgXHRcdH1cbiovXG4gIC8vfSwqL1xuICBfY2hlY2tfb2JzZWxfbG9hZGVkXzogZnVuY3Rpb24ob2JzKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMub2JzZWxfbGlzdC5zb21lKGZ1bmN0aW9uKG8pIHtcbiAgICAgIHJldHVybiBvLmdldF9pZCgpID09PSBvYnMuZ2V0X2lkKCk7IC8vIGZpcnN0IGFwcHJveGltYXRpb246IG9ic2VsIGhhcyB0aGUgc2FtZSBJRCA9PiBpdCBpcyBhbHJlYWR5IGxvYWRlZC4uLiBXZSBkb24ndCBjaGVjayBpZiB0aGUgb2JzZWwgaGFzIGNoYW5nZWQhXG4gICAgfSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9ic2VsX2xpc3QucHVzaChvYnMpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSxcbiAgU3RvcmVkVHJhY2VfbWV0aG9kczoge1xuICAgIHNldF9tb2RlbDogZnVuY3Rpb24obW9kZWwpIHt9LFxuICAgIHNldF9vcmlnaW46IGZ1bmN0aW9uKG9yaWdpbikge1xuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbiAgICAgIC8vXHR0aGlzLm9yaWdpbl9vZmZzZXQgPSAobmV3IERhdGUob3JpZ2luKSkuZ2V0TWlsbGlzZWNvbmRzKCk7XG4gICAgICAvLyBUT0RPIHN5bmMgd2l0aCBLVEJTXG4gICAgfSxcbiAgICBnZXRfZGVmYXVsdF9zdWJqZWN0OiBmdW5jdGlvbigpIHtcbiAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdF9zdWJqZWN0O1xuICAgIH0sXG4gICAgc2V0X2RlZmF1bHRfc3ViamVjdDogZnVuY3Rpb24oc3ViamVjdCkge30sXG4gICAgY3JlYXRlX29ic2VsOiBmdW5jdGlvbihwYXJhbXMsbW9kZWwpIHtcbiAgICAgIC8vIExPQ0FMIFRSQUNFXG4gICAgICAvL3ZhciBvYnMgPSBuZXcgU2Ftb3RyYWNlcy5PYnNlbChvYnNlbF9wYXJhbXMpO1xuICAgICAgLy8gS1RCUyBCT0dVRVxuICAgICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgICB2YXIgaGFzTW9kZWwgPSAobW9kZWwgPT09IHVuZGVmaW5lZCAgfHwgbW9kZWwgPT09ICBudWxsKT9cImh0dHA6Ly9saXJpcy5jbnJzLmZyL3NpbGV4LzIwMTEvc2ltcGxlLXRyYWNlLW1vZGVsI1wiOm1vZGVsO1xuICAgICAgdmFyIGpzb25fb2JzZWwgPSB7XG4gICAgICAgIFwiQGNvbnRleHRcIjpcdFtcbiAgICAgICAgXCJodHRwOi8vbGlyaXMuY25ycy5mci9zaWxleC8yMDExL2t0YnMtanNvbmxkLWNvbnRleHRcIixcbiAgICAgICAgICAgICAgIHsgXCJtXCI6IGhhc01vZGVsIH1cbiAgICAgICAgXSxcbiAgICAgICAgXCJAdHlwZVwiOlx0XCJtOlwiICsgcGFyYW1zLnR5cGUsIC8vIGZpeGVkOiBcIlNpbXBsZU9ic2VsXCIsIC8vIFRPRE8gS1RCUyBCVUcgVE8gRklYXG4gICAgICAgIGhhc1RyYWNlOlx0XCJcIixcbiAgICAgICAgc3ViamVjdDpcdHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIik/cGFyYW1zLnN1YmplY3Q6dGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCksXG4gICAgICAgIC8vXCJtOnR5cGVcIjpcdHBhcmFtcy50eXBlXG4gICAgICB9O1xuICAgICAgLy9jb25zb2xlLmxvZyhwYXJhbXMuaGFzT3duUHJvcGVydHkoXCJzdWJqZWN0XCIpP3BhcmFtcy5zdWJqZWN0OnRoaXMuZ2V0X2RlZmF1bHRfc3ViamVjdCgpLHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcInN1YmplY3RcIikscGFyYW1zLnN1YmplY3QsdGhpcy5nZXRfZGVmYXVsdF9zdWJqZWN0KCkpO1xuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImJlZ2luXCIpKSB7IGpzb25fb2JzZWwuYmVnaW4gPSBwYXJhbXMuYmVnaW47IH1cbiAgICAgIGlmIChwYXJhbXMuaGFzT3duUHJvcGVydHkoXCJlbmRcIikpIHsganNvbl9vYnNlbC5iZWdpbiA9IHBhcmFtcy5lbmQ7fVxuICAgICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShcImF0dHJpYnV0ZXNcIikpIHtcbiAgICAgICAgZm9yICh2YXIgYXR0ciBpbiBwYXJhbXMuYXR0cmlidXRlcykge1xuICAgICAgICAgIGlmIChwYXJhbXMuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShhdHRyKSkgICAgICAgICAge2pzb25fb2JzZWxbXCJtOlwiICsgYXR0cl0gPSBwYXJhbXMuYXR0cmlidXRlc1thdHRyXTt9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZ1bmN0aW9uIF9vbl9jcmVhdGVfb2JzZWxfc3VjY2Vzc18oZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcbiAgICAgICAgLypcbiAgICAgICAgXHRcdFx0XHR2YXIgdXJsID0ganFYSFIuZ2V0UmVzcG9uc2VIZWFkZXIoJ0xvY2F0aW9uJyk7XG4gICAgICAgIFx0XHRcdFx0dmFyIHVybF9hcnJheSA9IHVybC5zcGxpdCgnLycpO1xuICAgICAgICBcdFx0XHRcdCovXG5cbiAgICAgICAgdmFyIHVybF9hcnJheSA9IGRhdGEuc3BsaXQoJy8nKTtcbiAgICAgICAgdmFyIG9ic2VsX2lkID0gdXJsX2FycmF5W3VybF9hcnJheS5sZW5ndGggLSAxXTtcbiAgICAgICAgLy90aGlzLmdldF9vYnNlbChvYnNlbF9pZCk7XG4gICAgICAgIC8vIE9wdGltaXNhdGlvbjogZG8gbm90IGRvIGEgR0VUIHF1ZXJ5IHRvIGdldCB0aGUgT0JTRUxcbiAgICAgICAgLy8gVGhlIE9ic2VsIHBhcmFtZXRlcnMgYXJlIGFscmVhZHkga25vd24gaW4gcGFyYW1cbiAgICAgICAgLy8gV2UganVzdCBuZWVkIHRvIGFkZCB0aGUgSUQuXG4gICAgICAgIHBhcmFtcy5pZCA9IG9ic2VsX2lkO1xuICAgICAgICBwYXJhbXMudHJhY2UgPSB0aGlzO1xuICAgICAgICB2YXIgbyA9IG5ldyBLVEJTT2JzZWwocGFyYW1zKTtcbiAgICAgICAgaWYgKCF0aGlzLl9jaGVja19vYnNlbF9sb2FkZWRfKG8pKSB7XG4gICAgICAgICAgdGhpcy50cmlnZ2VyKCd0cmFjZTpjcmVhdGVfb2JzZWwnLCBvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub3BlbignUE9TVCcsIHRoYXQuaWQsIHRydWUpO1xuICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgICBpZih4aHIuc3RhdHVzID09PSAyMDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdPS1Bvc3QnKTtcbiAgICAgICAgICAgIHRoYXQuX29uX2NyZWF0ZV9vYnNlbF9zdWNjZXNzKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdQb3N0IGVycm9yJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgU3RhdHVzOiBcIiArIGUudGFyZ2V0LnN0YXR1cyk7XG4gICAgICB9O1xuICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkoanNvbl9vYnNlbCkpO1xuICAgIH1cbiAgfSxcblxuICBDb21wdXRlZFRyYWNlX21ldGhvZHM6IHtcbiAgICBzZXRfbWV0aG9kOiBmdW5jdGlvbihtZXRob2QpIHt9LFxuICAgIGxpc3RfcGFyYW1ldGVyczogZnVuY3Rpb24oaW5jbHVkZV9pbmhlcml0ZWQpIHt9LFxuICAgIGdldF9wYXJhbWV0ZXI6IGZ1bmN0aW9uKGtleSkge30sXG4gICAgc2V0X3BhcmFtZXRlcjogZnVuY3Rpb24oa2V5LCB2YWx1ZSkge30sXG4gICAgZGVsX3BhcmFtZXRlcjogZnVuY3Rpb24oa2V5KSB7fVxuICB9LFxuXG4gIC8vIFRFTVBPUkFSWSBNRVRIT0RTXG4gIGNyZWF0ZV9vYnNlbDogZnVuY3Rpb24ob2JzZWxfcGFyYW1zKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKCF0aGlzLmNyZWF0ZV9vYnNlbC5oYXNPd25Qcm9wZXJ0eSgnY3JlYXRlX29ic2VsJykpIHtcbiAgICAgIHRoaXMudGVtcC5jcmVhdGVfb2JzZWwgPSBbXTtcbiAgICB9XG4gICAgdGhpcy50ZW1wLmNyZWF0ZV9vYnNlbC5wdXNoIChvYnNlbF9wYXJhbXMpO1xuICB9LFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtUQlNUcmFjZTtcbiIsInZhciBLVEJTUmVzb3VyY2UgPSByZXF1aXJlKFwiLi9LVEJTLlJlc291cmNlLmpzXCIpO1xudmFyIEtUQlNCYXNlID0gcmVxdWlyZShcIi4vS1RCUy5CYXNlLmpzXCIpO1xuXG5cbi8qKlxuKiBAc3VtbWFyeSBKYXZhc2NyaXB0IEtUQlMgT2JqZWN0IHRoYXQgaXMgYm91bmQgdG8gYSBLVEJTLlxuKiBAY2xhc3MgSmF2YXNjcmlwdCBLVEJTIE9iamVjdCB0aGF0IGlzIGJvdW5kIHRvIGEgS1RCUy5cbiogQGF1dGhvciBCZW5vw650IE1hdGhlcm5cbiogQHJlcXVpcmVzIGpRdWVyeSBmcmFtZXdvcmsgKHNlZSA8YSBocmVmPVwiaHR0cDovL2pxdWVyeS5jb21cIj5qcXVlcnkuY29tPC9hPilcbiogQGNvbnN0cnVjdG9yXG4qIEBhdWdtZW50cyBTYW1vdHJhY2VzLkV2ZW50SGFuZGxlclxuKiBAYXVnbWVudHMgU2Ftb3RyYWNlcy5LVEJTLlJlc291cmNlXG4qIEBkZXNjcmlwdGlvblxuKiBTYW1vdHJhY2VzLktUQlMgaXMgYSBKYXZhc2NyaXB0IEtUQlMgb2JqZWN0IHRoYXRcbiogaXMgYm91bmQgdG8gYSBLVEJTLiBUaGlzIE9iamVjdCBpbXBsZW1ldG5zIHRoZSBLVEJTIEFQSS5cbiogTWV0aG9kcyBhcmUgYXZhaWxhYmxlIHRvIGdldCB0aGUgbGlzdCBvZiBiYXNlc1xuKiBhdmFpbGFibGUgaW4gdGhlIEtUQlMuIEFjY2VzcyBhIHNwZWNpZmljIGJhc2UsIGV0Yy5cbipcbiogQHBhcmFtIHtTdHJpbmd9XHR1cmlcdFVSSSBvZiB0aGUgS1RCUyB0byBsb2FkLlxuKi9cbnZhciBLVEJTID0gZnVuY3Rpb24gS1RCUyh1cmkpIHtcbiAgLy8gS1RCUyBpcyBhIFJlc291cmNlXG4gIFwidXNlIHN0cmljdFwiO1xuICBLVEJTUmVzb3VyY2UuY2FsbCh0aGlzLCB1cmksIHVyaSwgJ0tUQlMnLCBcIlwiKTtcbiAgdGhpcy5iYXNlcyA9IFtdO1xuICB0aGlzLmJ1aWx0aW5fbWV0aG9kcyA9IFtdO1xuICB0aGlzLmZvcmNlX3N0YXRlX3JlZnJlc2goKTtcbn07XG5cbktUQlMucHJvdG90eXBlID0ge1xuICAvLy8vLy8vLy8vLyBPRkZJQ0lBTCBBUElcbiAgLyoqXG4gICogQHRvZG8gTUVUSE9EIE5PVCBJTVBMRU1FTlRFRFxuKi9cbiAgbGlzdF9idWlsdGluX21ldGhvZHM6IGZ1bmN0aW9uKCkge30sXG4gIC8qKlxuICAqIEB0b2RvIE1FVEhPRCBOT1QgSU1QTEVNRU5URURcbiovXG4gIGdldF9idWlsdGluX21ldGhvZDogZnVuY3Rpb24oKSB7fSxcbiAgLyoqXG4gICogUmV0dXJucyB0aGUgYXJyYXkgb2YgdGhlIFVSSSBvZiB0aGUgYmFzZXMgY29udGFpbmVkIGluIHRoZSBLVEJTXG4gICogQHJldHVybnMge0FycmF5PFN0cmluZz59IEFycmF5IG9mIFVSSSBvZiBiYXNlcy5cbiovXG4gIGxpc3RfYmFzZXM6IGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLmJhc2VzO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeSBSZXR1cm5zIHRoZSBLVEJTLkJhc2Ugd2l0aCB0aGUgZ2l2ZW4gSUQuXG4gICogQHJldHVybnMgU2Ftb3RyYWNlcy5LVEJTLkJhc2UgQmFzZSBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlbiBJRFxuICAqIEBwYXJhbSBpZCB7U3RyaW5nfSBVUkkgb2YgdGhlIGJhc2VcbiovXG4gIGdldF9iYXNlOiBmdW5jdGlvbihpZCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiBuZXcgS1RCU0Jhc2UodGhpcy51cmkgKyBpZCwgaWQpO1xuICB9LFxuICAvKipcbiAgKiBDcmVhdGUgYSBuZXcgYmFzZS5cbiAgKiBAcGFyYW0gaWQge1N0cmluZ30gVVJJIG9mIHRoZSBiYXNlIChvcHRpb25hbClcbiAgKiBAcGFyYW0gbGFiZWwge1N0cmluZ30gTGFiZWwgb2YgdGhlIGJhc2UgKG9wdGlvbmFsKVxuKi9cbiAgY3JlYXRlX2Jhc2U6IGZ1bmN0aW9uKGlkLCBsYWJlbCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBuZXdfYmFzZSA9IHtcbiAgICAgIFwiQGNvbnRleHRcIjpcdFwiaHR0cDovL2xpcmlzLmNucnMuZnIvc2lsZXgvMjAxMS9rdGJzLWpzb25sZC1jb250ZXh0XCIsXG4gICAgICBcIkB0eXBlXCI6XHRcIkJhc2VcIixcbiAgICAgIFwiQGlkXCI6XHRcdGlkICsgXCIvXCIsXG4gICAgICBcImxhYmVsXCI6XHRsYWJlbFxuICAgIH07XG5cbiAgICBcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQT1NUJywgdGhhdC5pZCwgdHJ1ZSk7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uJyk7XG4gICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICBpZih4aHIuc3RhdHVzID09PSAyMDEpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnT0tQb3N0Jyk7XG4gICAgICAgICAgdGhhdC5mb3JjZV9zdGF0ZV9yZWZyZXNoKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1Bvc3QgZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkVycm9yIFN0YXR1czogXCIgKyBlLnRhcmdldC5zdGF0dXMpO1xuICAgIH07XG4gICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkobmV3X2Jhc2UpKTtcbiAgfSxcbiAgLy8vLy8vLy8vLy9cbiAgLyoqXG4gICogT3ZlcmxvYWRzIHRoZSB7QGxpbmsgU2Ftb3RyYWNlcy5LVEJTLlJlc291Y2UjX29uX3N0YXRlX3JlZnJlc2hffSBtZXRob2QuXG4gICogQHByaXZhdGVcbiovXG4gIF9vbl9zdGF0ZV9yZWZyZXNoXzogZnVuY3Rpb24oZGF0YSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuX2NoZWNrX2NoYW5nZV8oJ2Jhc2VzJywgZGF0YS5oYXNCYXNlLCAna3Riczp1cGRhdGUnKTtcbiAgICB0aGlzLl9jaGVja19jaGFuZ2VfKCdidWlsdGluX21ldGhvZHMnLCBkYXRhLmhhc0J1aWxkaW5NZXRob2QsICdrdGJzOnVwZGF0ZScpO1xuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLVEJTO1xuIiwiXG4vKipcbiogT2JzZWwgaXMgYSBzaG9ydG5hbWUgZm9yIHRoZVxuKiB7QGxpbmsgU2Ftb3RyYWNlcy5PYnNlbH1cbiogb2JqZWN0LlxuKiBAdHlwZWRlZiBPYnNlbFxuKiBAc2VlIFNhbW90cmFjZXMuT2JzZWxcbiovXG5cbi8qKlxuKiBPYnNlbFBhcmFtIGlzIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHBhcmFtZXRlcnNcbiogbmVjZXNzYXJ5IHRvIGNyZWF0ZSBhIG5ldyBvYnNlbC5cbiogVGhpcyB0eXBlIG9mIG9iamVjdCBpcyB1c2VkIGluIHNldmVyYWwgbWV0aG9kc1xuKiBzdWNoIGFzIHRoZSBPYnNlbCBjb25zdHJ1Y3Rvciwgb3IgdGhlXG4qIFRyYWNlLmNyZWF0ZV9vYnNlbCBtZXRob2QuXG4qIFRoZSBvcHRpb25hbCBwb3JwZXJ0aWVzIHZhcmllcyBkZXBlbmRpbmcgb24gdGhlXG4qIG1ldGhvZCBjYWxsZWQuXG4qIEB0eXBlZGVmIE9ic2VsUGFyYW1cbiogQHByb3BlcnR5IHtTdHJpbmd9IFtpZF0gSWQgb2YgdGhlIG9ic2VsXG4qIEBwcm9wZXJ0eSB7VHJhY2V9IFt0cmFjZV0gVHJhY2Ugb2YgdGhlIG9ic2VsXG4qIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZV0gVHlwZSBvZiB0aGUgb2JzZWxcbiogQHByb3BlcnR5IHtOdW1iZXJ9IFtiZWdpbl0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIHN0YXJ0c1xuKiBAcHJvcGVydHkge051bWJlcn0gW2VuZF0gVGltZXN0YW1wIG9mIHdoZW4gdGhlIG9ic2VsIGVuZHNcbiogQHByb3BlcnR5IHtPYmplY3R9IFthdHRyaWJ1dGVzXSBBdHRyaWJ1dGVzIG9mIHRoZSBvYnNlbC5cbiogQHByb3BlcnR5IHtBcnJheTxSZWxhdGlvbj59IFtyZWxhdGlvbnNdIFJlbGF0aW9ucyBmcm9tIHRoaXMgb2JzZWwuXG4qIEBwcm9wZXJ0eSB7QXJyYXk8UmVsYXRpb24+fSBbaW52ZXJzZV9yZWxhdGlvbnNdIFJlbGF0aW9ucyB0byB0aGlzIG9ic2VsLlxuKiBAcHJvcGVydHkge0FycmF5PE9ic2VsPn0gW3NvdXJjZV9vYnNlbHNdIFNvdXJjZSBvYnNlbHMgb2YgdGhlIG9ic2VsLlxuKiBAcHJvcGVydHkge1N0cmluZ30gW3BhcmFtLmxhYmVsXSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qIEB0b2RvIEZJWE1FIERFRklORSBXSEFUIElTIEEgUkVMQVRJT05cbiovXG5cbi8qKlxuKiBAc3VtbWFyeSBKYXZhU2NyaXB0IE9ic2VsIGNsYXNzXG4qIEBjbGFzcyBKYXZhU2NyaXB0IE9ic2VsIGNsYXNzXG4qIEBwYXJhbSB7T2JzZWxQYXJhbX0gcGFyYW0gUGFyYW1ldGVycyBvZiB0aGUgb2JzZWxcbiogQHBhcmFtIHtTdHJpbmd9IHBhcmFtLmlkIElkZW50aWZpZXIgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge1RyYWNlfSBwYXJhbS5UcmFjZSBUcmFjZSBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7U3RyaW5nfSBwYXJhbS50eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuKiBAcGFyYW0ge051bWJlcn0gW3BhcmFtLmJlZ2luPURhdGUubm93KCldIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBvYnNlbCBzdGFydHNcbiogQHBhcmFtIHtOdW1iZXJ9IFtwYXJhbS5lbmQ9cGFyYW0uYmVnaW5dIFRpbWVzdGFtcCBvZiB3aGVuIHRoZSBvYnNlbCBlbmRzXG4qIEBwYXJhbSB7T2JqZWN0fSBbcGFyYW0uYXR0cmlidXRlc10gQXR0cmlidXRlcyBvZiB0aGUgb2JzZWwuXG4qIEBwYXJhbSB7QXJyYXk8UmVsYXRpb24+fSBbcGFyYW0ucmVsYXRpb25zXSBSZWxhdGlvbnMgZnJvbSB0aGlzIG9ic2VsLlxuKiBAcGFyYW0ge0FycmF5PFJlbGF0aW9uPn0gW3BhcmFtLmludmVyc2VfcmVsYXRpb25zXSBSZWxhdGlvbnMgdG8gdGhpcyBvYnNlbC5cbiogQHBhcmFtIHtBcnJheTxPYnNlbD59IFtwYXJhbS5zb3VyY2Vfb2JzZWxzXSBTb3VyY2Ugb2JzZWxzIG9mIHRoZSBvYnNlbC5cbiogQHBhcmFtIHtTdHJpbmd9IFtwYXJhbS5sYWJlbF0gTGFiZWwgb2YgdGhlIG9ic2VsLlxuKiBAdG9kbyBGSVhNRSBSRUxBVElPTlMgQVJFIE5PVCBZRVQgU1VQUE9SVEVEXG4qL1xuXG52YXIgT2JzZWwgPSBmdW5jdGlvbiBPYnNlbChwYXJhbSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19lcnJvcihwYXJhbSwgJ2lkJyk7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZXJyb3IocGFyYW0sICd0cmFjZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2Vycm9yKHBhcmFtLCAndHlwZScpO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX2RlZmF1bHQocGFyYW0sICdiZWdpbicsXHREYXRlLm5vdygpKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja19kZWZhdWx0KHBhcmFtLCAnZW5kJyxcdFx0dGhpcy5iZWdpbik7XG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfZGVmYXVsdChwYXJhbSwgJ2F0dHJpYnV0ZXMnLFx0e30pO1xuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAncmVsYXRpb25zJyxcdFtdKTsgLy8gVE9ETyBham91dGVyIHJlbCDDoCBsJ2F1dHJlIG9ic2VsXG4gIHRoaXMuX3ByaXZhdGVfY2hlY2tfdW5kZWYocGFyYW0sICdpbnZlcnNlX3JlbGF0aW9ucycsXHRbXSk7IC8vIFRPRE8gYWpvdXRlciByZWwgw6AgbCdhdXRyZSBvYnNlbFxuICB0aGlzLl9wcml2YXRlX2NoZWNrX3VuZGVmKHBhcmFtLCAnc291cmNlX29ic2VscycsXHRcdFtdKTtcbiAgdGhpcy5fcHJpdmF0ZV9jaGVja191bmRlZihwYXJhbSwgJ2xhYmVsJyxcdFx0XCJcIik7XG59O1xuXG5PYnNlbC5wcm90b3R5cGUgPSB7XG4gIC8vIEFUVFJJQlVURVNcbiAgYXR0cmlidXRlczoge30sXG4gIHJlbGF0aW9uczogW10sXG4gIGludmVyc2VfcmVsYXRpb25zOiBbXSxcbiAgc291cmNlX29ic2VsczogW10sXG4gIGxhYmVsOiBcIlwiLFxuICAvKipcbiAgKiBJZiBhdHRyaWJ1dGUgZXhpc3RzLCB0aGVuIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2VcbiAgKiBzZXQgdGhlIGF0dHJpYnV0ZSBvZiB0aGUgc2FtZSBuYW1lIHdpdGggdGhlIGRlZmF1bHRcbiAgKiB2YWx1ZS5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwYXJhbSB2YWx1ZSBEZWZhdWx0IHZhbHVlXG4gICogQHByaXZhdGVcbiovXG4gIF9wcml2YXRlX2NoZWNrX2RlZmF1bHQ6IGZ1bmN0aW9uKHBhcmFtLCBhdHRyLCB2YWx1ZSkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpc1thdHRyXSA9IChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKT9wYXJhbVthdHRyXTp2YWx1ZTtcbn0sXG4gIC8qKlxuICAqIElmIGF0dHJpYnV0ZSBleGlzdHMsIHRoZW4gc2V0IHRoZSBjbGFzcyBhdHRyaWJ1dGVcbiAgKiBvZiB0aGUgc2FtZSBuYW1lIHRvIHRoZSBhdHRyaWJ1dGUgdmFsdWUsIG90aGVyd2lzZVxuICAqIG5vdGhpbmcgaGFwcGVucy5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwcml2YXRlXG4qL1xuICBfcHJpdmF0ZV9jaGVja191bmRlZjogZnVuY3Rpb24ocGFyYW0sIGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1thdHRyXSA9IHBhcmFtW2F0dHJdO1xuICB9XG59LFxuICAvKipcbiAgKiBJZiBhdHRyaWJ1dGUgZXhpc3RzLCB0aGVuIHNldCB0aGUgY2xhc3MgYXR0cmlidXRlXG4gICogb2YgdGhlIHNhbWUgbmFtZSB0byB0aGUgYXR0cmlidXRlIHZhbHVlLCBvdGhlcndpc2VcbiAgKiB0aHJvdyBhbiBlcnJvci5cbiAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW0gT2JqZWN0IGZyb20gd2hpY2ggYXR0cmlidXRlIGlzIGNvcGllZFxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIE5hbWUgb2YgdGhlIGF0dHJpYnV0ZVxuICAqIEBwcml2YXRlXG4qL1xuICBfcHJpdmF0ZV9jaGVja19lcnJvcjogZnVuY3Rpb24ocGFyYW0sIGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmIChwYXJhbVthdHRyXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc1thdHRyXSA9IHBhcmFtW2F0dHJdO1xuICB9IGVsc2Uge1xuICAgIHRocm93IFwiUGFyYW1ldGVyIFwiICsgYXR0ciArIFwiIHJlcXVpcmVkLlwiO1xuICB9XG59LFxuICAvLyBSRVNPVVJDRVxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJlbW92ZSB0aGUgb2JzZWwgZnJvbSBpdHMgdHJhY2UuXG4gICogQGRlc2NyaXB0aW9uXG4gICogUmVtb3ZlIHRoZSBvYnNlbCBmcm9tIGl0cyB0cmFjZS5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTpyZW1vdmVfb2JzZWx9IGV2ZW50XG4qL1xuICByZW1vdmU6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5nZXRfdHJhY2UoKS5yZW1vdmVfb2JzZWwodGhpcyk7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBJZCBvZiB0aGUgb2JzZWwuXG4qL1xuICBnZXRfaWQ6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgcmV0dXJuIHRoaXMuaWQ7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7U3RyaW5nfSBMYWJlbCBvZiB0aGUgb2JzZWwuXG4qL1xuICBnZXRfbGFiZWw6IGZ1bmN0aW9uKCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgcmV0dXJuIHRoaXMubGFiZWw7XG59LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIGxhYmVsIG9mIHRoZSBPYnNlbC5cbiAgKiBAcGFyYW0ge1N0cmluZ30gTGFiZWwgb2YgdGhlIG9ic2VsLlxuKi9cbiAgc2V0X2xhYmVsOiBmdW5jdGlvbihsYmwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgdGhpcy5sYWJlbCA9IGxibDsgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSBsYWJlbCBvZiB0aGUgT2JzZWwgdG8gdGhlIGVtcHR5IHN0cmluZy5cbiovXG4gIHJlc2V0X2xhYmVsOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG50aGlzLmxhYmVsID0gXCJcIjsgfSxcbiAgLy8gT0JTRUxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSB0cmFjZSB0aGUgT2JzZWwgYmVsb25ncyB0by5cbiAgKiBAcmV0dXJucyB7VHJhY2V9IFRyYWNlIHRoZSBPYnNlbCBiZWxvbmdzIHRvLlxuKi9cbiAgZ2V0X3RyYWNlOiBcdFx0ZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xucmV0dXJuIHRoaXMudHJhY2U7IH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgdHlwZSBvZiB0aGUgT2JzZWwuXG4gICogQHJldHVybnMge1N0cmluZ30gVHlwZSBvZiB0aGUgb2JzZWwuXG4gICogQHRvZG8gVE9ETyBkaWZmZXJzIGZyb20gS1RCUyBBUEkgLT4gZXhwcmVzcyBpdCBjbGVhcmx5XG4qL1xuICBnZXRfdHlwZTogZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xucmV0dXJuIHRoaXMudHlwZTsgfSxcbiAgLyoqXG4gICogUmV0dXJucyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4gICogQHJldHVybnMge051bWJlcn0gVGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4qL1xuICBnZXRfYmVnaW46IFx0XHRmdW5jdGlvbigpIHtcbiAgICAvL3JldHVybiB0aGlzLmdldF90cmFjZSgpLmdldF9vcmlnaW5fb2Zmc2V0KCkgKyB0aGlzLmJlZ2luO1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLmJlZ2luO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHRpbWUgd2hlbiB0aGUgT2JzZWwgZW5kcy5cbiAgKiBAcmV0dXJucyB7TnVtYmVyfSBUaW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4qL1xuICBnZXRfZW5kOiBcdFx0ZnVuY3Rpb24oKSB7XG4gICAgLy9yZXR1cm4gdGhpcy5nZXRfdHJhY2UoKS5nZXRfb3JpZ2luX29mZnNldCgpICsgdGhpcy5lbmQ7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuZW5kO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHR5cGUgb2YgdGhlIE9ic2VsLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFNldHMgdGhlIHR5cGUgb2YgdGhlIE9ic2VsLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7U3RyaW5nfSB0eXBlIFR5cGUgb2YgdGhlIG9ic2VsLlxuICAqIEB0b2RvIFRPRE8gbm90IEtUQlMgQVBJIGNvbXBsaWFudFxuICAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIG1pZ2h0IG5vdCBiZSBzdXBwb3J0ZWQgaW4gdGhlIGZ1dHVyZS5cbiovXG4gIGZvcmNlX3NldF9vYnNlbF90eXBlOiBmdW5jdGlvbih0eXBlKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIHN0YXJ0cy5cbiAgKiBUaGUgdHJhY2Ugd2lsbCB0cmlnZ2VyIGFcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSN0cmFjZTplZGl0X29ic2VsfSBldmVudFxuICAqIEBwYXJhbXMge051bWJlcn0gYmVnaW4gVGltZSB3aGVuIHRoZSBPYnNlbCBzdGFydHMuXG4gICogQHRvZG8gVE9ETyBub3QgS1RCUyBBUEkgY29tcGxpYW50XG4gICogQGRlcHJlY2F0ZWQgVGhpcyBtZXRob2QgbWlnaHQgbm90IGJlIHN1cHBvcnRlZCBpbiB0aGUgZnV0dXJlLlxuKi9cbiAgZm9yY2Vfc2V0X2JlZ2luOiBmdW5jdGlvbihiZWdpbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHRoaXMuYmVnaW4gPSBiZWdpbjtcbiAgICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgfSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBTZXRzIHRoZSB0aW1lIHdoZW4gdGhlIE9ic2VsIGVuZHMuXG4gICogQGRlc2NyaXB0aW9uXG4gICogU2V0cyB0aGUgdGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHBhcmFtcyB7TnVtYmVyfSBlbmQgVGltZSB3aGVuIHRoZSBPYnNlbCBlbmRzLlxuICAqIEB0b2RvIFRPRE8gbm90IEtUQlMgQVBJIGNvbXBsaWFudFxuICAqIEBkZXByZWNhdGVkIFRoaXMgbWV0aG9kIG1pZ2h0IG5vdCBiZSBzdXBwb3J0ZWQgaW4gdGhlIGZ1dHVyZS5cbiovXG4gIGZvcmNlX3NldF9lbmQ6IFx0ZnVuY3Rpb24oZW5kKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy5lbmQgPSBlbmQ7XG4gICAgdGhpcy50cmFjZS50cmlnZ2VyKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcyk7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgc291cmNlIE9ic2VscyBvZiB0aGUgY3VycmVudCBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8T2JzZWw+fSBTb3VyY2UgT2JzZWxzIG9mIHRoZSBjdXJyZW50IE9ic2VsLlxuKi9cbiAgbGlzdF9zb3VyY2Vfb2JzZWxzOiBcdGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmxpc3Rfc291cmNlX29ic2VscyA9PT0gdW5kZWZpbmVkKSB7IHJldHVybiBbXTsgfVxuICAgIHJldHVybiB0aGlzLnNvdXJjZV9vYnNlbHM7XG4gIH0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogUmV0dXJucyB0aGUgYXR0cmlidXRlIG5hbWVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gQXR0cmlidXRlIG5hbWVzIG9mIHRoZSBPYnNlbC5cbiovXG4gIGxpc3RfYXR0cmlidXRlX3R5cGVzOiBcdGZ1bmN0aW9uKCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLmF0dHJpYnV0ZXMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gW107IH1cbiAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5hdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAodGhpcy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpICAgICAge1xuICAgICAgICBhdHRycy5wdXNoKGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGF0dHJzO1xuICB9LFxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJldHVybnMgdGhlIHJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gUmVsYXRpb24gdHlwZXMgb2YgdGhlIE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgaG93IGl0IGlzIHN1cHBvc2VkIHRvIHdvcmsgaW4gS1RCUyBBUElcbiovXG4gIGxpc3RfcmVsYXRpb25fdHlwZXM6IFx0ZnVuY3Rpb24oKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBpZiAodGhpcy5yZWxhdGlvbnMgPT09IHVuZGVmaW5lZCkgeyByZXR1cm4gW107IH1cbiAgdmFyIHJlbHMgPSBbXTtcbiAgdGhpcy5yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICAvLyBpZiAoJC5pbkFycmF5KHIudHlwZSwgcmVscykgPT09IC0xKSB7XG4gICAgLy8gICByZWxzLnB1c2goci50eXBlKTtcbiAgICAvLyB9XG4gICAgaWYgKHJlbHMuaW5kZXhPZihyLnR5cGUpID09PS0xKXtcbiAgICAgIHJlbHMucHVzaChyLnR5cGUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZWxzO1xufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBPYnNlbHMgcmVsYXRlZCB0byB0aGUgY3VycmVudCBPYnNlbCB3aXRoIHRoZSBnaXZlbiByZWxhdGlvbiB0eXBlLlxuICAqIEBwYXJhbSB7U3RyaW5nfSByZWxhdGlvbl90eXBlIFJlbGF0aW9uIHR5cGUuXG4gICogQHJldHVybnMge0FycmF5PE9ic2VsPn0gT2JzZWxzIHJlbGF0ZWQgdG8gdGhlIGN1cnJlbnQgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuKi9cbiAgbGlzdF9yZWxhdGVkX29ic2VsczogXHRmdW5jdGlvbihyZWxhdGlvbl90eXBlKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICB2YXIgb2JzcyA9IFtdO1xuICBpZiAodGhpcy5yZWxhdGlvbnMgIT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXMucmVsYXRpb25zLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICAgIGlmIChyLnR5cGUgPT09IHJlbGF0aW9uX3R5cGUpIHtcbiAgICAgICAgb2Jzcy5wdXNoKHIub2JzZWxfdG8pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmICh0aGlzLmludmVyc2VfcmVsYXRpb25zICE9PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmludmVyc2VfcmVsYXRpb25zLmZvckVhY2goZnVuY3Rpb24ocikge1xuICAgICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICAgIGlmIChyLnR5cGUgPT09IHJlbGF0aW9uX3R5cGUpIHtcbiAgICAgICAgb2Jzcy5wdXNoKHIub2JzZWxfdG8pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBvYnNzO1xufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSBpbnZlcnNlIHJlbGF0aW9uIHR5cGVzIG9mIHRoZSBPYnNlbC5cbiAgKiBAcmV0dXJucyB7QXJyYXk8U3RyaW5nPn0gSW52ZXJzZSByZWxhdGlvbiB0eXBlcyBvZiB0aGUgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBob3cgaXQgaXMgc3VwcG9zZWQgdG8gd29yayBpbiBLVEJTIEFQSVxuKi9cbiAgbGlzdF9pbnZlcnNlX3JlbGF0aW9uX3R5cGVzOiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmICh0aGlzLmludmVyc2VfcmVsYXRpb25zID09PSB1bmRlZmluZWQpIHsgcmV0dXJuIFtdOyB9XG4gIHZhciByZWxzID0gW107XG4gIHRoaXMuaW52ZXJzZV9yZWxhdGlvbnMuZm9yRWFjaChmdW5jdGlvbihyKSB7XG4gICAgLy92YXIgdW5pcXVlTmFtZXMgPSBbXTtcbiAgICAvLyBpZiAoJC5pbkFycmF5KHIudHlwZSwgcmVscykgPT09IC0xKSB7XG4gICAgLy8gICByZWxzLnB1c2goci50eXBlKTtcbiAgICAvLyB9XG4gICAgaWYgKHJlbHMuaW5kZXhPZihyLnR5cGUpID09PS0xKXtcbiAgICAgIHJlbHMucHVzaChyLnR5cGUpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiByZWxzO1xufSxcbiAgLy9cdGRlbF9hdHRyaWJ1dGVfdmFsdWU6XHRmdW5jdGlvbihhdHRyKSB7fSwgLy8gVE9ETyBlcnJldXIgZGUgbCdBUEkgS1RCUz9cbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhbiBhdHRyaWJ1dGUuXG4gICogQHBhcmFtIHtTdHJpbmd9IGF0dHIgQXR0cmlidXRlIG5hbWUuXG4gICogQHJldHVybnMge09iamVjdH0gQXR0cmlidXRlIHZhbHVlLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSVxuKi9cbiAgZ2V0X2F0dHJpYnV0ZTpcdGZ1bmN0aW9uKGF0dHIpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIGlmICh0aGlzLmF0dHJpYnV0ZXNbYXR0cl0gPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IFwiQXR0cmlidXRlIFwiICsgYXR0ciArIFwiIGlzIG5vdCBkZWZpbmVkXCI7IC8vIFRPRE9cbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICB9XG59LFxuICAvL1x0ZGVsX2F0dHJpYnV0ZV92YWx1ZTpcdGZ1bmN0aW9uKGF0dHIpIHt9LCAvLyBUT0RPIGVycmV1ciBkZSBsJ0FQSSBLVEJTP1xuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFNldHMgdGhlIHZhbHVlIG9mIGFuIGF0dHJpYnV0ZS5cbiAgKiBAcGFyYW0ge1N0cmluZ30gYXR0ciBBdHRyaWJ1dGUgbmFtZS5cbiAgKiBAcGFyYW0ge09iamVjdH0gdmFsIEF0dHJpYnV0ZSB2YWx1ZS5cbiAgKiBAdG9kbyBUT0RPIENoZWNrIGNvbnNpc3RlbmN5IHdpdGggS1RCUyBBUElcbiovXG4gIHNldF9hdHRyaWJ1dGU6XHRmdW5jdGlvbihhdHRyLCB2YWwpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHRoaXMuYXR0cmlidXRlc1thdHRyXSA9IHZhbDtcbiAgdGhpcy50cmFjZS50cmlnZ2VyKCd0cmFjZTplZGl0X29ic2VsJywgdGhpcyk7XG4gIC8vIFRPRE8gZW52b3llciB1biBldmVudCBwb3VyIGRpZXIgcXVlIGwnb2JzZWwgYSBjaGFuZ8OpXG59LFxuICAvL1x0ZGVsX2F0dHJpYnV0ZV92YWx1ZTpcdGZ1bmN0aW9uKGF0dHIpIHt9LCAvLyBUT0RPIGVycmV1ciBkZSBsJ0FQSSBLVEJTP1xuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIFJlbW92ZXMgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAqIEBkZXNjcmlwdGlvblxuICAqIFJlbW92ZXMgdGhlIGF0dHJpYnV0ZSB3aXRoIHRoZSBnaXZlbiBuYW1lLlxuICAqIFRoZSB0cmFjZSB3aWxsIHRyaWdnZXIgYVxuICAqIHtAbGluayBTYW1vdHJhY2VzLlRyYWNlI3RyYWNlOmVkaXRfb2JzZWx9IGV2ZW50XG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJLlxuICAqIEBwYXJhbSB7U3RyaW5nfSBhdHRyIEF0dHJpYnV0ZSBuYW1lLlxuKi9cbiAgZGVsX2F0dHJpYnV0ZTpcdFx0XHRmdW5jdGlvbihhdHRyKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuICBkZWxldGUgdGhpcy5hdHRyaWJ1dGVzW2F0dHJdO1xuICB0aGlzLnRyYWNlLnRyaWdnZXIoJ3RyYWNlOmVkaXRfb2JzZWwnLCB0aGlzKTtcbiAgLy8gVE9ETyBlbnZveWVyIHVuIGV2ZW50IHBvdXIgZGllciBxdWUgbCdvYnNlbCBhIGNoYW5nw6lcbn0sXG4gIC8qKlxuICAqIEBzdW1tYXJ5XG4gICogQWRkcyBhIHJlbGF0aW9uIHdpdGggYW4gT2JzZWwuXG4gICogQGRlc2NyaXB0aW9uXG4gICogTk9UIFlFVCBJTVBMRU1FTlRFRFxuICAqIEBwYXJhbSB7U3RyaW5nfSByZWwgUmVsYXRpb24gdHlwZS5cbiAgKiBAcGFyYW0ge09ic2VsfSBvYnMgVGFyZ2V0IE9ic2VsLlxuICAqIEB0b2RvIFRPRE8gQ2hlY2sgY29uc2lzdGVuY3kgd2l0aCBLVEJTIEFQSVxuKi9cbiAgYWRkX3JlbGF0ZWRfb2JzZWw6XHRcdGZ1bmN0aW9uKHJlbCwgb2JzKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIC8vIFRPRE9cbiAgdGhyb3cgXCJtZXRob2Qgbm90IGltcGxlbWVudGVkIHlldFwiO1xuICAvLyBUT0RPIGVudm95ZXIgdW4gZXZlbnQgcG91ciBkaWVyIHF1ZSBsJ29ic2VsIGEgY2hhbmfDqVxufSxcbiAgLyoqXG4gICogQHN1bW1hcnlcbiAgKiBSZW1vdmVzIGEgcmVsYXRpb24gd2l0aCBhbiBPYnNlbC5cbiAgKiBAZGVzY3JpcHRpb25cbiAgKiBOT1QgWUVUIElNUExFTUVOVEVEXG4gICogQHBhcmFtIHtTdHJpbmd9IHJlbCBSZWxhdGlvbiB0eXBlLlxuICAqIEBwYXJhbSB7T2JzZWx9IG9icyBUYXJnZXQgT2JzZWwuXG4gICogQHRvZG8gVE9ETyBDaGVjayBjb25zaXN0ZW5jeSB3aXRoIEtUQlMgQVBJXG4qL1xuICBkZWxfcmVsYXRlZF9vYnNlbDpcdFx0ZnVuY3Rpb24ocmVsLCBvYnMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgLy8gVE9ET1xuICB0aHJvdyBcIm1ldGhvZCBub3QgaW1wbGVtZW50ZWQgeWV0XCI7XG4gIC8vIFRPRE8gZW52b3llciB1biBldmVudCBwb3VyIGRpZXIgcXVlIGwnb2JzZWwgYSBjaGFuZ8OpXG59LFxuXG4gIC8vIE5PVCBJTiBLVEJTIEFQSVxuICAvKipcbiAgKiBAc3VtbWFyeVxuICAqIENvcGllcyB0aGUgT2JzZWwgcHJvcGVydGllcyBpbiBhbiBPYmplY3QuXG4gICogQGRlc2NyaXB0aW9uXG4gICogQ29waWVzIHRoZSBPYnNlbCBwcm9wZXJ0aWVzIGluIGFuIE9iamVjdFxuICAqIHRoYXQgY2FuIGJlIHVzZWQgdG8gY3JlYXRlIGFuIE9ic2VsIHdpdGhcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5PYnNlbCNPYnNlbH0gY29uc3RydWN0b3Igb3JcbiAgKiB7QGxpbmsgU2Ftb3RyYWNlcy5UcmFjZSNjcmVhdGVfb2JzZWx9IG1ldGhvZC5cbiAgKiBAcmV0dXJucyB7T2JqZWN0fSBPYmplY3QgdGhhdFxuKi9cbiAgdG9fT2JqZWN0OiBmdW5jdGlvbigpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG4gIHZhciBvYmogPSB7XG4gICAgaWQ6IHRoaXMuaWQsXG4gICAgdHlwZTogdGhpcy50eXBlLFxuICAgIGJlZ2luOiB0aGlzLmJlZ2luLFxuICAgIGVuZDogdGhpcy5lbmQsXG4gICAgYXR0cmlidXRlczoge30sXG4gICAgLy8gdXNlIC5zbGljZSB0byBjb3B5XG4gICAgLy8gVE9ETyBpcyBpdCBlbm91Z2g/IDwtIG1pZ2h0IGNyZWF0ZSBidWdzXG4gICAgcmVsYXRpb25zOiB0aGlzLnJlbGF0aW9ucy5zbGljZSgpLFxuICAgIGludmVyc2VfcmVsYXRpb25zOiB0aGlzLmludmVyc2VfcmVsYXRpb25zLnNsaWNlKCksXG4gICAgc291cmNlX29ic2VsczogdGhpcy5zb3VyY2Vfb2JzZWxzLnNsaWNlKCksXG4gICAgbGFiZWw6IHRoaXMubGFiZWxcbiAgfTtcbiAgLy8gY29weSBlYWNoIGF0dHJpYnV0ZXNcbiAgZm9yICh2YXIgYXR0ciBpbiB0aGlzLmF0dHJpYnV0ZXMpIHtcbiAgICBpZiAodGhpcy5hdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHIpKSB7XG4gICAgICBvYmouYXR0cmlidXRlc1thdHRyXSA9IHRoaXMuYXR0cmlidXRlc1thdHRyXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG9iajtcbn0sXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9ic2VsO1xuIl19
