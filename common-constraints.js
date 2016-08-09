var constraints = {
  url: {
    length: {
      maximum: 2048,
      message: function() {
        return "MAX_LENGTH_ERROR"
      }
    },
    format: {
      pattern: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/,
      message: function() {
        return "URL_ERROR"
      }
    }
  },
  text: {
    length: {
      maximum: 255,
      message: function() {
        return "MAX_LENGTH_ERROR"
      }
    }
  },
  phone: {
    length: {
      maximum: 20,
      message: function() {
        return "MAX_LENGTH_ERROR"
      }
    },
    format: {
      pattern: /^\d{10}$/,
      message: function() {
        return "PHONE_ERROR"
      }
    }
  },
  color: {
    format: {
      pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      message: function() {
        return "COLOR_ERROR"
      }
    }
  },
  email: {
    length: {
      maximum: 255,
      message: function() {
        return "MAX_LENGTH_ERROR"
      }
    },
    format: {
      pattern: /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/,
      message: function() {
        return "EMAIL_ERROR"
      }
    }
  },
  unsigned_integer: {
    format: {
      pattern: /^\d+$/,
      message: function() {
        return "UNSIGN_INTEGER_ERROR"
      }
    }
  },
  percentage: {
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 0,
      lessThanOrEqualTo: 100,
      message: function() {
        return "PERCENTAGE_ERROR"
      }
    }
  },
  longtitude: {
    format: {
      pattern: /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
      message: function() {
        return "LONGTITUDE_ERROR"
      }
    }
  },
  latitude: {
    format: {
      pattern: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
      message: function() {
        return "LATITUDE_ERROR"
      }
    }
  },
  password: {
    length: {
      minimum: 6,
      message: function() {
        return "MINLENGTH_ERROR"
      }
    }
  }
}

module.exports = constraints;
