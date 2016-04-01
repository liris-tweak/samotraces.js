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


var Model = function(uri, id, label) {
  id = id || uri;
  KTBSResource.call(this, id, uri, 'TraceModel', label || "");
  this.list_type_obsels = [];
  base_uri = "";
};

Model.prototype = {

  
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

  put_model: function(input) {
    var that = this;

    var modeldata = {
      '@context': 'http://liris.cnrs.fr/silex/2011/ktbs-jsonld-context',
      '@graph': input
    }
    
    return new Promise(function(resolve, reject) {
      var etag = that.etag;
      var xhr = new XMLHttpRequest();
      xhr.open('PUT', that.uri, true);
      xhr.setRequestHeader('Content-Type', 'application/ld+json');
      xhr.setRequestHeader('Accept', 'application/ld+json');
      xhr.setRequestHeader('If-Match', etag);
      xhr.withCredentials = true;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if(xhr.status === 200) {
            that.etag = xhr.getResponseHeader('ETag');
            that._on_state_refresh_(JSON.parse(xhr.response));
            resolve();
          } else {
            reject(xhr);
          }
        }
      };
      xhr.onerror = function() {
        reject(Error('There was a network error.'));
      };
      xhr.send(JSON.stringify(modeldata));
    });
  },

  _on_state_refresh_: function(data) {

    this._check_change_('list_type_obsels', data["@graph"], 'model:update');

    for(var i = 0;  i < data["@graph"].length; i++){
      if( data["@graph"][i]["@type"] === "TraceModel" ){
        this._check_change_('base_uri', this.getAbsoluteURLFromRelative(this.uri, data["@graph"][i].inBase), 'model:update');
        this._check_change_('@id', data["@graph"][i]["@id"], 'model:update');
        this._check_change_('label', data["@graph"][i]["label"], 'model:update');
        this._check_change_('http://www.w3.org/2004/02/skos/core#note', data["@graph"][i]["http://www.w3.org/2004/02/skos/core#note"], 'model:update');
      }
    }

  }

};

module.exports = Model;
