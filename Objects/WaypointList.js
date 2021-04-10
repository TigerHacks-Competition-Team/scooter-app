class WaypointList {
  constructor(waypoints) {
    this.waypoints = waypoints;
  }

  /**
   *
   * @param {waypoint object} waypoint
   */
  addWayPoint(waypoint) {
    this.waypoints.push(waypoint);
  }

  /**
   *
   * @param {number} index index of waypoint in waypoint list
   */
  removeWayPoint(index) {
    this.waypoints.splice(index, 1);
  }

  /**
   *
   * @returns total distance in miles
   */
  calcTotalDistance() {
    let totDistance = 0;
    for (let i = 0; i < this.waypoints.length - 1; i++) {
      totDistance += this.waypoints[i].calcDistance(this.waypoints[i + 1]);
    }
    return totDistance;
  }

  /**
   *
   * @param {number} distance distance in miles
   * @param {number} time total time in milliseconds
   * @returns miles per hour
   */
  calcSpeed(distance, time) {
    let hours = time / 520000000;
    return distance / hours;
  }
}
