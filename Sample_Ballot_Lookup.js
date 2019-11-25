var reg = (o, n) => o ? o[n] : '';
var cn = (o, s) => o ? o.getElementsByClassName(s) : console.log(o);
var tn = (o, s) => o ? o.getElementsByTagName(s) : console.log(o);
var gi = (o, s) => o ? o.getElementById(s) : console.log(o);
var rando = (n) => Math.round(Math.random() * n);
var unq = (arr) => arr.filter((e, p, a) => a.indexOf(e) == p);
var delay = (ms) => new Promise(res => setTimeout(res, ms));
var ele = (t) => document.createElement(t);
var attr = (o, k, v) => o.setAttribute(k, v);

var latlngbyzip = (zip,db) => db.filter(el=> el.zip == zip).length ?  [db.filter(el=> el.zip == zip)[0].lat, db.filter(el=> el.zip == zip)[0].lng] : null;
var access_token = 'go4tgNEaqfvaPuekckNGcMSclpVZtPrQ';

async function getSampleBallotDateValuesByZipcode(zip){
  var res = await fetch(`https://ballotpedia.org/Sample_Ballot_Lookup#address=${zip}`);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text,'text/html');
  var dateOpt = Array.from(cn(gi(document,'bp-sbl-election-select'),'bp-sbl-election'));
  var dateValues = dateOpt && dateOpt.length ? dateOpt.map(el=> tn(el,'input') && tn(el,'input').length ? tn(el,'input')[0].value : null) : null;
  console.log(dateValues)
  if(dateValues && dateValues.length){
    var latlng = latlngbyzip(zip,fileArray);
    if(latlng && latlng[0] && latlng[1]){ 
      var districtMatches = await getDistrictsByLatLng(access_token,encodeURIComponent(latlng.toString()));
      var districtIds = districtMatches.map(el=> el.id);
      if(districtMatches && districtIds.length){
        for(var i=0; i<dateValues.length; i++){
          var sb = await getSampleBallotByZip(access_token,dateValues[i],encodeURIComponent(districtIds.toString()));
          console.log(sb);
        }
      }
    }
  }

}

async function getSampleBallotByZip(access_token,election_date,districts){
  var res = await fetch(`https://api.ballotpedia.org/v3/api/sbl-results?access_token=${access_token}&districts=${districts}&election_date=${election_date}`);
  var d = await res.json();
//   console.log(d);
  return d;
}


async function getDistrictsByLatLng(access_token,latlng){
 var res = await fetch(`https://api.ballotpedia.org/v3/api/contains?access_token=${access_token}&point=${latlng}`);
 var d = await res.json();
 console.log(d);
 return d;
}

getSampleBallotDateValuesByZipcode(access_token,'15758')
