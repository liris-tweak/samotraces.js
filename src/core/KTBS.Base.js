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
