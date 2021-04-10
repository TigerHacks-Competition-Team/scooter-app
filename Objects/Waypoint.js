class Waypoint {
  constructor(data) {
    this.long = data.long;
    this.lat = data.lat;
    this.zRot = data.zRot;
    this.xRot = data.xRot;
    this.yRot = data.yRot;
  }

  calcDistance(waypoint2) {
    return 0;
  }
}

export default Waypoint;
