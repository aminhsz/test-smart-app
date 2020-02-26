function extractData() {
  var ret = $.Deferred();

  function onError() {
    console.log('Loading error', arguments);
    ret.reject();
  }

  function onReady(smart) {
      if (smart.hasOwnProperty('patient')) {
        var patient = smart.patient;
        var pt = patient.read();
        var obv = smart.patient.api.fetchAll({
                    type: 'Observation',
                    query: {
                      code: {
                        $or: ['http://loinc.org|8302-2', 'http://loinc.org|8462-4']
                      }
                    }
                  });

        $.when(pt, obv).fail(onError);

        $.when(pt, obv).done(function(patient, obv) {
          var byCodes = smart.byCodes(obv, 'code');
          var gender = patient.gender;

          var fname = '';
          var lname = '';

          if (typeof patient.name[0] !== 'undefined') {
            fname = patient.name[0].given.join(' ');
            lname = patient.name[0].family.join(' ');
          }

          var height = byCodes('8302-2');
          var hdl = byCodes('2085-9');
          var ldl = byCodes('2089-1');

          var p = defaultPatient();
          p.birthdate = patient.birthDate;
          p.gender = gender;
          p.fname = fname;
          p.lname = lname;

          ret.resolve(p);
        });
      } else {
        onError();
      }
  }
  
  FHIR.oauth2.ready(onReady, onError);
  return ret.promise();
}

function defaultPatient() {
  return {
    fname: {value: ''},
    lname: {value: ''},
    gender: {value: ''},
    birthdate: {value: ''},
    height: {value: ''},
    systolicbp: {value: ''},
    diastolicbp: {value: ''},
    ldl: {value: ''},
    hdl: {value: ''},
  };
}

function displayData(p) {
  var div = document.createElement('div');
  div.innerText = p.fname + ' ' + p.lname + ', ' + p.gender + ', ' + p.birthdate;
}
