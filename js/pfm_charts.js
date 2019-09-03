
function gen_attendance_chart() {
  console.log('tried to do c3 chart');
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

