
var width = 360,
    height = 360,
    speed = -1e-2,
    start = Date.now();

var sphere = {type: "Sphere"};

var projection = d3.geo.orthographic()
    .scale(width / 2.1)
    .clipAngle(90)
    .translate([width / 2, height / 2]);

var graticule = d3.geo.graticule();

var canvas = d3.select("#globecontainer").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

var path = d3.geo.path()
    .projection(projection)
    .context(context);

d3.json("data/world-110m.json", function(error, topo) {
  if (error) throw error;

  var land = topojson.feature(topo, topo.objects.land),
      grid = graticule();

  d3.timer(function() {
    var λ = speed * (Date.now() - start),
        φ = -15;

    context.clearRect(0, 0, width, height);

    context.beginPath();
    path(sphere);
    context.lineWidth = 3;
    context.strokeStyle = "#000";
    context.stroke();
    context.fillStyle = "#fff";
    context.fill();

    context.save();
    context.translate(width / 2, 0);
    context.scale(-1, 1);
    context.translate(-width / 2, 0);
    projection.rotate([λ + 180, -φ]);

    context.beginPath();
    path(land);
    context.fillStyle = "#dadac4";
    context.fill();

    context.beginPath();
    path(grid);
    context.lineWidth = .5;
    context.strokeStyle = "rgba(119,119,119,.5)";
    context.stroke();

    context.restore();
    projection.rotate([λ, φ]);

    context.beginPath();
    path(grid);
    context.lineWidth = .5;
    context.strokeStyle = "rgba(119,119,119,.5)";
    context.stroke();

    context.beginPath();
    path(land);
    context.fillStyle = "#737368";
    context.fill();
    context.lineWidth = .5;
    context.strokeStyle = "#000";
    context.stroke();
  });
});

d3.select(self.frameElement).style("height", height + "px");
