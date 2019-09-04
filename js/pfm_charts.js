
function gen_attendance_chart() {
  console.log('in gen_attendance');
  var chart_attendance = c3.generate({
    bindto: '#chart_attendance',
    data: {
      columns: [
        ['Total', 38, 38, 39, 39, 38, 38, 37, 40, 40, 40, 40],
        ['Drops', 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        ['Adds', 0, 0, 1, 0, 0, 0, 0, 3, 0, 0, 0]
      ],
      types: {
        Total: 'area',
        Drops: 'bar',
        Adds: 'bar'
      },
      axis: {
        x: {
          label: {
            text: 'Course Week',
            position: 'outer-center'
          }
        },
        y: {
          label: {
            text: 'Crap',
            position: 'outer-middle'
          }
        }
      }
    }
  });
  // console.log('why God why?');

  // var chart = c3.generate({
  //   bindto: '#chart_attendance',
  //   data: {
  //     columns: [['data1', 34, 34, 22, 44, 11] ]
  //   }
  // });
}

function gen_progress_chart() {
  console.log('in gen_progress');
  var chart_attendance = c3.generate({
    bindto: '#chart_progress',
    data: {
      columns: [
        ['Projected Hours', 8, 20, 28, 38, 47, 57, 68, 76, 88, 98, 110, 118, 129,
                    139, 148, 157, 166, 176, 188, 200, 210, 221, 230, 238, 248,
                    258, 264, 272, 280, 288, 294, 300, 310, 320, 330, 340, 350,
                    360, 370, 380, 390, 400, 412, 422, 434, 446, 458, 472, 484],
        ['Actual Hours', 8, 18, 26, 34, 42, 56, 68, 75, 87, 100, 112],
      ],
      types: {
        "Projected Hours": 'area',
        "Actual Hours": 'area'
      },
      axis: {
        y: {
          label: {
            text: 'Course Hours',
            position: 'outer-middle'
          }
        },
        x: {
          label: {
            text: 'Course Week',
            position: 'outer-center'
          }
        }
      }
    }
  });
}

function gen_via_chart() {
  var chart_via = c3.generate({
    bindto: "#chart_via",
    data: {
      columns: [
        ['Given', 80]
      ],
      type: 'gauge',
    },
    gauge: {

    },
    color: {
      pattern: ['#ff7777','#f97600', '#bbbb00', '#00ff00'],
      threshold: {
        values: [51, 75, 90, 100]
      }
    },
    size: {
      height: 240
    }
  });
}

function gen_1on1_chart() {
  var chart_via = c3.generate({
    bindto: "#chart_1on1",
    data: {
      columns: [
        ['4 sessions', 0],
        ['3 sessions', 0],
        ['2 sessions', 2],
        ['1 session', 8],
        ['0 sessions', 30]
      ],
      type: 'bar'
    },
    bar: {
      width: {
        ratio: 0.9
      }
    },
    axis: {
      y: {
        label: {
          text: 'Number of Participants',
          position: 'outer-middle'
        }
      },
      x: {
        show: false
      }
    },
    size: {
      height: 240
    }
  });
}