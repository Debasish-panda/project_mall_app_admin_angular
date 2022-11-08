import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // count = {
  //   from: 0,
  //   duration: 1,

  //   Orders: 1000,
  //   ShippingAmount: 500,
  //   CashOnDelivery: 100,
  //   Cancelled: 200
  //  };


  // count = {
  //   from: 0,
  //   duration: 1,

  //   Orders: 0,
  //   ShippingAmount: 0,
  //   CashOnDelivery: 0,
  //   Cancelled: 0
  //  };

  count = {
    from: 0,
    duration: 1
  };

  objCountData = [
    {
      bgColorClass: 'bg-warning card-body',
      fontColorClass: 'font-warning',
      icon: 'navigation',
      title: 'Orders',
      count: 0
    },
    {
      bgColorClass: 'bg-secondary card-body',
      fontColorClass: 'font-secondary',
      icon: 'box',
      title: 'Shipping Amount',
      count: 0
    },
    {
      bgColorClass: 'bg-primary card-body',
      fontColorClass: 'font-primary',
      icon: 'message-square',
      title: 'Cash On Delivery',
      count: 0
    },
    {
      bgColorClass: 'bg-danger card-body',
      fontColorClass: 'font-danger',
      icon: 'users',
      title: 'Cancelled',
      count: 0
    }
  ];

  settings = {
    actions: false,
    hideSubHeader: true,
    columns: {
      orderId: {
        title: "Order Id"
      },
      orderStatus: {
        title: "Order Status", type: "html"
      },
      paymentDate: {
        title: "Payment Date"
      },
      paymentMethod: {
        title: 'Payment Method'
      },
      paymentStatus: {
        title: "Payment Status", type: "html"
      },
      shippingAmount: {
        title: "Shipping Amount"
      },
      subTotalAmount: {
        title: "SubTotal Amount"
      },
      totalAmount: {
        title: "Total Amount"
      }
    }
  };

  orders = [];

  orderStatusChart: any;

  constructor(private _httpService: HttpService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    this.getNetFigure();
    this.getOrdersData();

    this.GetOrderStatusChart();
  }

  getOrdersData() {
    this._httpService.get(environment.BASE_API_PATH + "/PaymentMaster/GetReportManageOrder").subscribe(res => {
      if (res.isSuccess) {
        this.orders = res.data;
      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }

  getNetFigure() {
    this._httpService.get(environment.BASE_API_PATH + "/PaymentMaster/GetReportNetFigure").subscribe(res => {
      if (res.isSuccess) {
        // this.count.Orders = res.data[0].orders;
        // this.count.CashOnDelivery = res.data[0].cashOnDelivery;
        // this.count.Cancelled = res.data[0].cancelled;
        // this.count.ShippingAmount = res.data[0].shippingAmount;

        this.objCountData[0].count = res.data[0].orders;
        this.objCountData[1].count = res.data[0].shippingAmount;
        this.objCountData[2].count = res.data[0].cashOnDelivery;
        this.objCountData[3].count = res.data[0].cancelled;

      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });
  }


  GetOrderStatusChart() {
    let objOrderStatusData = [];
    let arr = ["Date"];

    this._httpService.get(environment.BASE_API_PATH + "/PaymentMaster/GetChartOrderStatus").subscribe(res => {
      if (res.isSuccess) {

        // counts : 5 date: "02-08-2022" orderStatus: "Processing"
        let allData = res.data;
        let allDates = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index); //this one used to find the unique value in one array, filter used to remove the duplicate and map used to get the particular column
        let allOrderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

        for (let status of allOrderStatus) {
          arr.push(status);
        }
        objOrderStatusData.push(arr);

        var setZero: any = 0;
        for (let date of allDates) {
          arr = [];
          arr.push(date);

          for (let status of allOrderStatus) {
            arr.push(setZero);
          }


          for (let i in allOrderStatus) {
            for (let index in allData) {
              if (allOrderStatus[i] === allData[index].orderStatus && date === allData[index].date) {
                arr[parseInt(i) + 1] = allData[index].counts;
              }
            }
          }

          objOrderStatusData.push(arr);
        }


        //google-chart - ColumnChart
        this.orderStatusChart = {
          chartType: 'ColumnChart',
          dataTable: objOrderStatusData,
          options: {
            legend: { position: 'none' },
            bars: "vertical",
            vAxis: {
              format: "decimal"
            },
            height: 340,
            width: '100%',
            colors: ["#ff7f83", "#a5a5a5"],
            backgroundColor: 'transparent'
          },
        };



      } else {
        this._toastr.error(res.errors[0], "Dashboard");
      }
    });


    // //google-chart - ColumnChart
    // this.orderStatusChart = {
    //   chartType: 'ColumnChart',
    //   dataTable: [
    //     ["Year", "Sales", "Expenses"],
    //     ["100", 2.5, 3.8],
    //     ["200", 3, 1.8],
    //     ["300", 3, 4.3],
    //     ["400", 0.9, 2.3],
    //     ["500", 1.3, 3.6],
    //     ["600", 1.8, 2.8],
    //     ["700", 3.8, 2.8],
    //     ["800", 1.5, 2.8]
    //   ],
    //   options: {
    //     legend: { position: 'none' },
    //     bars: "vertical",
    //     vAxis: {
    //       format: "decimal"
    //     },
    //     height: 340,
    //     width: '100%',
    //     colors: ["#ff7f83", "#a5a5a5"],
    //     backgroundColor: 'transparent'
    //   },
    // };
  }

}
