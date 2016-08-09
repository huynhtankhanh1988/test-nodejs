var MergeRecursive = function() {}

/**
  Merge 2 json object
  sourceJson: Source Object
  mergeJson: Merge object
  return: sourceJson with changed attributes from mergeJson
  Note: sourceJson and mergeJson must have same structure
*/

function mergeRecursive(sourceJson, mergeJson) {
  for (var p in mergeJson) {
    try {
      // Property in destination object set; update its value.
      if (mergeJson[p].constructor == Object) {
        sourceJson[p] = mergeRecursive(sourceJson[p], mergeJson[p]);
      } else {
        if (mergeJson[p] != null) {
          sourceJson[p] = mergeJson[p];
        }
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      if (mergeJson[p] != null) {
        sourceJson[p] = mergeJson[p];
      }
    }
  }

  return sourceJson;
}


/*function mergeMiddleware(sourceJson, mergeJson) {
  if (isEmpty(mergeJson)) {
    console.log('mergeJson is empty!');
    console.log(mergeJson);
    return sourceJson;
  }
  if (isEmpty(sourceJson) && isEmpty(mergeJson)) {
    console.log('Both of sourceJson and mergeJson are empty!');
    return null;
  }

  for (var p in mergeJson) {
    if (mergeJson[p] != null && mergeJson[p].constructor == Object) {
      sourceJson[p] = mergeRecursive(sourceJson[p], mergeJson[p]);
    } else {
      if (mergeJson[p] != null) {
        try {
          if (sourceJson[p] != null) {
            sourceJson[p] = mergeJson[p];
          } else {
            console.log("Key " + p + ' not exist in sourceJson!');
            console.log(sourceJson);
            continue;
          }
        } catch(e) {
          console.log("Exception: " + e);
        }
      } else {
        console.log("source null for key " + p);
        console.log("value in source " + sourceJson[p]);
      }
    }
  }
  return sourceJson;
}*/

/**
 * Checking an object whether it is an empty json object or not
 */
function isEmpty(obj) {
  if (!obj) {
    return true;
  }
  if (Array.isArray(obj)) {
    return obj.length == 0 ? true : false;
  }
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
  }
  return true && JSON.stringify(obj) === JSON.stringify({});
}

MergeRecursive.prototype.merge = function(sourceJson, mergeJson) {
  var source = sourceJson ? JSON.parse(JSON.stringify(sourceJson)) : sourceJson;
  return mergeRecursive(source, mergeJson);
}

/*MergeRecursive.prototype.mergeMiddleware = function(sourceJson, mergeJson) {
		var source = sourceJson ? JSON.parse(JSON.stringify(sourceJson)) : sourceJson;
  	return mergeMiddleware(source, mergeJson);
}*/

module.exports = MergeRecursive;
