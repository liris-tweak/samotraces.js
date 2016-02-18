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
  
  var that = this;
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
  /*
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
  */
  
  
  create_base: function(id, label, note){
    
    var new_base = {
      "@context":	"http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context",
      "@type":	"Base",
      "@id":		id + "/",
      "label":	label || "",
      "http://www.w3.org/2004/02/skos/core#note" : note || ""
    }
    
    var url = this.uri;
    return new Promise( function(resolve, reject){
      var xhr = new XMLHttpRequest();
      xhr.open('POST',url,true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 200 || xhr.status === 201) {
            resolve( new Samotraces.Ktbs.Base( xhr.response.replace('>','').replace('<','') ) );
          }
          else {
            reject(xhr);
          }
        }
      };
      xhr.onerror = function() {
        reject(Error('There was a network error.'));
      };
      
      xhr.send( JSON.stringify(new_base) );
    })
    
  },
  
  iter_bases: function(){
    function IterablePromise(arrayLike, process) {
      var that = this;
      var lst = [];
      var i = 0;
      that.forEach = function(callback) {
        if (i >= arrayLike.length) {
          return Promise.resolve(lst);
        } else {
          return Promise.resolve(arrayLike[i++])
          .then(process)
          .then(function(x) { lst.push(x); return x; })
          .then(callback)
          .then(that.forEach.bind(that, callback))
          ;
        }
      };
      that.then = function(onFullfilled, onRejected) {
        return that.forEach(function(){}).then(onFullfilled, onRejected);
      };
      that.catch = function(onRejected) {
        return that.forEach(function(){}).catch(onRejected);
      };
    }
    
    function createBaseResource( baseUri ){
      return new Samotraces.Ktbs.Base( baseUri );
    }
    
    var bases_uri = [];
    for(var j = 0 ; j < this.bases.length; j++){
      bases_uri.push( this.uri + this.bases[j] );
    }
    
    return new IterablePromise(bases_uri, createBaseResource);
    
  },
  
  list_bases: function(){
    var that = this;
    return new Promise( function(resolve, reject){
      that.iter_bases()
          .then( function(x){
            resolve(x);
          })
          .catch( function(err){
            reject(err);
          })
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
