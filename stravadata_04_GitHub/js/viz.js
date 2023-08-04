const margin = 20,
  width = 555,
  height = 480;

const svg = d3.select(".chart")
  .append('svg')
  .attr('width', width + 'px')
  .attr('height', height + 'px')
  .append("g");

d3.csv('data/allData_Luuk.csv').then(function(data) {


  data = data.sort(function(a,b){ //sorting  d.timestamp
    return a.timestamp - b.timestamp;
  });

// ROUTE VIZ
const projection = d3.geoIdentity()
    .reflectY(true)
    .translate([-10,2650])
    .scale([50]);

const line = d3.line()
      .x(function(d) {return projection([d.position_long,d.position_lat])[0] ; })
      .y(function(d) {return projection([d.position_long,d.position_lat])[1]; })
      .curve(d3.curveBasis);


const linePath = svg.append("path")
          .datum(data.filter(function(d){return d.position_lat <=80 && d.position_long <=10}))
          .attr("d", line)
          .attr("stroke", "#450101")
          .attr("stroke-width", 1)
          .attr("fill", "none")
          .attr('class', 'line');

// LUUK COORDINATES
const AmsterdamPath = ["52.3763438"];
const PeerPath = ["51.1328784"];
const LibramontPath = ["49.9147718"];
const PagnySurMeusePath = ["48.6822908"];
const LaValdAjolPath = ["47.9266017"];
const OrnansPath = ["47.1033315"];
const OyonnaxPath = ["46.2588414"];
const VoironPath = ["45.3618386"];
const PierrelattePath = ["44.3766903"];
const VentouxPath = ["44.1735464"] ; 
const CarpentrasPath = ["44.0475747"];

//ARRAY for cities
const arrayElevationCitiesI = d3.nest()
      .key(function(d) {if (d.position_lat == AmsterdamPath) {return "AMS"}
          {if (d.position_lat == PeerPath) {return "Peer"}}
          {if (d.position_lat == LibramontPath) {return "Libramont"}}
          {if (d.position_lat == PagnySurMeusePath) {return "Pagny-Sur-Meuse"}}
          {if (d.position_lat == LaValdAjolPath) {return "La Val d'Ajol"}}
          {if (d.position_lat == OrnansPath) {return "Ornans"}}
          {if (d.position_lat == OyonnaxPath) {return "Oyonnax"}}
          {if (d.position_lat == VoironPath) {return "Voiron"}}
          {if (d.position_lat == PierrelattePath) {return "Pierrelatte"}}
          {if (d.position_lat == VentouxPath) {return "VENTOUX"}}
          {if (d.position_lat == CarpentrasPath) {return "Carpentras"}}
        })
      .rollup(function (values) {return {
        lat: d3.min(values, function(d) {return (d.position_lat);}),
        long: d3.min(values, function(d) {return (d.position_long);}),
      }})
      .entries(data.filter(function(d) {
      return d.position_lat == AmsterdamPath
      || d.position_lat == PeerPath 
      || d.position_lat == LibramontPath
      || d.position_lat == PagnySurMeusePath
          || d.position_lat == LaValdAjolPath
          || d.position_lat == OrnansPath
          || d.position_lat == OyonnaxPath
          || d.position_lat == VoironPath
          || d.position_lat == PierrelattePath
          || d.position_lat == VentouxPath
          // || d.position_lat == CarpentrasPath
       ;
      }))

console.log(arrayElevationCitiesI)

svg.selectAll("circlesCities")
   .data(arrayElevationCitiesI)
   .enter()
   .append("circle")
   .attr("class", "circle1")
    .attr("cx", function(d) {return projection([d.value.long,d.value.lat])[0]}) 
    .attr("cy", function(d) {return projection([d.value.long,d.value.lat])[1]})  
    .attr('r',  function (d) 
      {if (d.key == "AMS") {return 1.9;} 
    else if (d.key == "VENTOUX") {return 1.9;} 
    else {return 1.5;}})
    .attr('opacity', 1)
    .style('fill', '#5D0100')
  
svg.selectAll("textCities")
  .data(arrayElevationCitiesI)
  .enter()
  .append("text")
  .attr("class", function(d,i) {return "citiesNames" + d.key; })
  .text(function(d) {return d.key})
  .attr("x", function(d) {return projection([d.value.long,d.value.lat])[0]}) //Startingpoint AMS long
  .attr("y", function(d) {return projection([d.value.long,d.value.lat])[1]})
  .style('fill', function(d) 
      {if (d.key == "AMS") {return "#450101";} 
    else if (d.key == "VENTOUX") {return "#450101";} 
    else {return "#5D0100";}})
  .attr("dy", function(d) // Y-Position of label;
      {if (d.key == "AMS") {return -8;} 
    else if (d.key == "VENTOUX") {return 18;} 
    else {return -1;}})
  .attr("dx", function(d) // X-Position of label;
      {if (d.key == "AMS") {return -11;} 
    else if (d.key == "VENTOUX") {return -12;} 
    else {return 8;}})



////////////////////////////////
///////DEVIATIONLINES//////////
////////////////////////////////

// Reduce the amount of data points
const xPercent = 2; // reduce by 50%
const filteredData = data.filter((d, i) => i % Math.ceil(data.length / (100 / xPercent)) === 0);

//Averagedimensions
const totalPace =  d3.mean(data, function (d) {if (d.enhanced_speed || Infinity){return d.enhanced_speed}})//Infintity excludes zero values
const totalPower = d3.mean(data, function(d) {if (d.power || Infinity){return d.power}})//Infintity excludes zero values
const totalHeartRate =  d3.mean(data, function(d)  {if (d.heart_rate || Infinity){return d.heart_rate}})//Infintity excludes zero values
const totalCadence = d3.mean(data, function(d) {if (d.cadence || Infinity){return d.cadence}})//Infintity excludes zero values
const maxSpeed = d3.max(data, d => Number(d.enhanced_speed)); 
const maxHeartRate = d3.max(data.filter(d => Number(d.heart_rate) <= 200), d => Number(d.heart_rate))
const maxPower = d3.max(data.filter(d => Number(d.power) <= 2500), d => Number(d.power)) //Check if values are okay
const minPower = d3.min(data.filter(d => Number(d.power) <= 2500), d => Number(d.power)) //Check if values are okay
const maxCadance = d3.max(data, d => Number(d.cadence));


//SPEEDLINE
const speedLine = d3.line()
  .x(function(d) { return projection([d.position_long,d.position_lat])[0] + (d.enhanced_speed - totalPace) * 1; })
  .y(function(d) { return projection([d.position_long,d.position_lat])[1]; })
  // .curve(d3.curveCatmullRom.alpha(0.1));
  .curve(d3.curveBasis);

// Append the line paths to an SVG element
const speedPath = svg.append("path")
  .datum(filteredData)
  .attr("d", speedLine)
  .attr("stroke", "#5D0100")
  .attr("fill", "none")
  .attr("stroke-width", 0.6)
  .attr("opacity", 0.8)

//POWERLINE
const powerLine = d3.line()
  .defined(function(d) { return d.power <= maxPower; })
  .x(function(d) { return projection([d.position_long,d.position_lat])[0] + ((d.power/10) - (totalPower/20)) * 1; })
  .y(function(d) { return projection([d.position_long,d.position_lat])[1]; })
  // .curve(d3.curveCatmullRom.alpha(1.5));
  .curve(d3.curveBasis);

// Append the line paths to an SVG element
const powerPath = svg.append("path")
svg.append("path")
  .datum(filteredData)
  .attr("stroke", "#5D0100")
  .attr("d", powerLine)
  // .attr("stroke", "blue")
  .attr("stroke-width", .8)
.style("stroke-dasharray", ("0.6, 0.7, 1.5 "))
  .attr("fill", "none")
  .attr("opacity", 0.8);



const xPercent2 = 4; // reduce by 50%
const filteredData2 = data.filter((d, i) => i % Math.ceil(data.length / (100 / xPercent2)) === 0);

// CADANCELINE
const cadanceLine = d3.line()
  .x(function(d) { return projection([d.position_long,d.position_lat])[0] + (d.cadence - totalCadence) * 1; })
  .y(function(d) { return projection([d.position_long,d.position_lat])[1]; })
  .curve(d3.curveBasis);

// Append the line paths to an SVG element
const cadancePath = svg.append("path")
  .datum(filteredData2)
  .attr("d", cadanceLine)
  .attr("stroke", "#5D0100")
  .attr("stroke-width", .5)
  .style("stroke-dasharray", ("1,1"))
  .attr("opacity", 0.8)
  .attr("fill", "none");


// HEART_RATELINE
const heart_rateLine = d3.line()
  .x(function(d) { return projection([d.position_long,d.position_lat])[0] + (d.heart_rate - totalHeartRate) * 1; })
  .y(function(d) { return projection([d.position_long,d.position_lat])[1]; })
  // .curve(d3.curveCatmullRom.alpha(5.1));
  .curve(d3.curveBasis);

// Append the line paths to an SVG element
const heart_ratePath = svg.append("path")
  .datum(filteredData)
  .attr("d", heart_rateLine)
  .attr("stroke", "#5D0100")
  .attr("stroke-width", 1)
  .attr("stroke-dasharray", "0.2,3")
  .style("stroke-linecap", "round")
  .attr("opacity", 0.8)
  .attr("fill", "none");


//OUTLIERS
console.log(maxHeartRate, maxSpeed, maxPower, maxCadance);

// OUTLIER SPEED
svg.selectAll(".circleSpeed")
  .data(data.filter(function(d) { return d.enhanced_speed == maxSpeed; }))
  .enter()
  .append("circle")
  .attr("class", "circleSpeed")
  .attr("cx", function(d) { return projection([d.position_long,d.position_lat])[0] ; })
  .attr("cy", function(d) { return projection([d.position_long, d.position_lat])[1]; })
  .attr("r", 1.5)
 // .style("stroke-dasharray", "0.1, 1")
.style("stroke", "#5D0100")
.style("fill", "#B8CCDD");


  svg.selectAll("textSpeed")
  .data(data.filter(function(d) { return d.enhanced_speed == maxSpeed; }))
  .enter()
  .append("text")
  .attr("class", function(d,i) {return "Max speed" + maxSpeed + "kmH"; })
  .text(function(d) {return "Max " + d3.format(",.1f")(maxSpeed) + "kmH"})
  .attr("x", function(d) { return projection([d.position_long,d.position_lat])[0] ; }) //Startingpoint AMS long
  .attr("y", function(d) { return projection([d.position_long, d.position_lat])[1]; })
  .attr("fill", "#5D0100")
  .attr("dy", -1)
  .attr("dx", -50)

});




////////////////////////////////
///////ELEVATIONCHART//////////
////////////////////////////////
d3.csv('data/elevationProfile.csv').then(function(data) {

const margin = 0,
    width1 = 555,
    height1 = 65,
    textHeight = 1

const elevationProfile = d3.select("#elevationProfile")
      // .append('svg')
      .attr('width', width1 + 'px')
      .attr('height', height1 + 'px')  
      .append("g");

//ROLLUPS ELEVATION METRICS
  const arrayElevation = d3.nest()
      .key(function(d) {return d3.format(".0f")(d.final_distance/1000)}) //divide by 1000 to calculate into kms     
      .rollup(function (values) {return {
        timestamp: d3.max(values, function (d) {return d3.timeFormat("%d")(d3.timeParse("%Y-%m-%dT%H:%M:%S")(d.timestamp))}),
        elevation: d3.max(values, function(d) {return ((d.enhanced_altitude));}),
        distance: d3.min(values, function(d) {return ((d.distance));}),
      }})
      .entries(data);
console.log(arrayElevation);

//ADD SCALE
  yScale = d3.scaleLinear() // CHECK YSCALE!!!!
      .domain([d3.max(arrayElevation, d => d.value.elevation),-110])
      .range([35,height1]);

    xScale = d3.scaleLinear()
    // .domain([-50,d3.max(arrayElevation, d => d.key)])
    .domain([0,1500])
    .range([width1*0.08,600-(width1*0.08)]);


var lineProfile = elevationProfile.append("path")
              .datum(arrayElevation.filter(function (d) {return d.key !== 'NaN'; })) //REMOVE NAN ROLL-UPS
              .attr("class", "area")
              .attr("d", d3.area()
                  .x(function(d) {
                    if (d.key || Infinity ){return xScale(d.key)}})
                  .y0(yScale(0))
                  .y1(function(d) {
                    return d.value.elevation ? yScale(d.value.elevation) : 0;
                  })
              );

//Lat position cities
const Amsterdam = ["523.763.438"];
const Peer = ["511.328.784"];
const Libramont = ["499.147.718"];
const PagnySurMeuse = ["486.822.908"];
const LaValdAjol = ["479.266.017"];
const Ornans = ["471.033.315"];
const Oyonnax = ["462.588.414"];
const Voiron = ["453.618.386"];
const Pierrelatte = ["443.766.903"];
const Ventoux = ["441.735.464"] ; 
const Carpentras = ["440.475.747"];



//ARRAY for cities
const arrayElevationCitiesII = d3.nest()
      .key(function(d) {if (d.position_lat == Amsterdam) {return "AMS"}
          {if (d.position_lat == Peer) {return "PEE"}}
          {if (d.position_lat == Libramont) {return "LBR"}}
          {if (d.position_lat == PagnySurMeuse) {return "PSM"}}
          {if (d.position_lat == LaValdAjol) {return "VAJ"}}
          {if (d.position_lat == Ornans) {return "ORN"}}
          {if (d.position_lat == Oyonnax) {return "OYO"}}
          {if (d.position_lat == Voiron) {return "VOI"}}
          {if (d.position_lat == Pierrelatte) {return "PIE"}}
          {if (d.position_lat == Ventoux) {return "VTX"}}
          {if (d.position_lat == Carpentras) {return "CAR"}}
        })
      .rollup(function (values) {return {
        elevation: d3.max(values, function(d) {return ((d.enhanced_altitude));}),
        distance: d3.min(values, function(d) {return ((d.final_distance/1000));}),
      }})
      .entries(data.filter(function(d) {
      return d.position_lat == Amsterdam 
      || d.position_lat == Peer 
      || d.position_lat == Libramont 
      || d.position_lat == PagnySurMeuse 
      || d.position_lat == LaValdAjol 
      || d.position_lat == Ornans
      || d.position_lat == Oyonnax
      || d.position_lat == Voiron
      || d.position_lat == Pierrelatte
      || d.position_lat == Ventoux
      // || d.position_lat == Carpentras
       ;
      }))

// console.log(arrayElevationCities);

elevationProfile.selectAll("circlesCities")
   .data(arrayElevationCitiesII)
   .enter()
   .append("circle")
       .style('fill', '#5D0100')
      // .style('stroke', '#FFFFFF')
     .attr("cx", function(d) {return xScale(d.value.distance)})
     .attr("cy", function(d) {return yScale(d.value.elevation)})
        .attr('r',  function (d) 
      {if (d.key == "AMS") {return 1.9;} 
    else if (d.key == "VTX") {return 1.9;} 
    else {return 1.3;}})
    .attr('opacity', 1)
    .style('fill', '#5D0100')
//     .style('stroke', function (d) {
//     if (d.key == "AMS") {return "#5D0100";} 
//     else if (d.key == "VTX") {return "#5D0100";} 
//     else {return "";}
// })


elevationProfile.selectAll("textCities")
  .data(arrayElevationCitiesII)
  .enter()
  .append("text")
   .attr("class", function(d, i) { return "citiesNames" + (i+1); })
  // .attr("class","citiesNames")
  .text(function(d) {return d.key})
    .style('fill', function(d) 
      {if (d.key == "AMS") {return "#450101";} 
    else if (d.key == "VTX") {return "#450101";} 
    else {return "#5D0100";}})
 // .attr("font-weight", function (d) 
 //      {if (d.key == "AMS") {return 700;} 
 //    else if (d.key == "VTX") {return 700;} 
 //    else {return 300;}})
  .attr("x", function(d) {return xScale(d.value.distance + 10)})
  .attr("y", function(d) {return yScale(d.value.elevation + 15)})
  .attr("transform", function(d) {
    // Calculate the angle of rotation
    var dx = xScale(d.value.distance) - xScale.range()[1];
    var dy = yScale.range()[0] - yScale(50);
    var angle = Math.atan2(dy, dx) * 20 / Math.PI;
    // Rotate the label by the calculated angle
    return "rotate(" + angle + " " + xScale(d.value.distance) + " " + yScale(d.value.elevation) + ")";
  });


});