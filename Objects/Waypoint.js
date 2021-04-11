class Waypoint {
  constructor(data) {
    this.long = data.coords.longitude;
    this.lat = data.coords.latitude;
    this.zRot = data.zRot;
    this.xRot = data.xRot;
    this.yRot = data.yRot;
    this.time = data.timestamp;
  }

  /**
   *
   * @param {number} degrees angle in degrees
   * @returns angel in radians
   */
  degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  /**
   *
   * @param {waypoint object} waypoint2 waypoint to calculate distance to
   * @returns distance in miles
   */
  calcDistance(waypoint2) {
    // Credit: cietus and Federico klez Culloca on StackOverflow https://stackoverflow.com/questions/365826/calculate-distance-between-2-gps-coordinates
    var earthRadiusKm = 6371;

    var dLat = this.degreesToRadians(waypoint2.lat - this.lat);
    var dLon = this.degreesToRadians(waypoint2.long - this.long);

    let lat1 = this.degreesToRadians(this.lat);
    let lat2 = this.degreesToRadians(waypoint2.lat);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c * 0.62137119;
  }
}

export default Waypoint;
