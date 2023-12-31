import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line, Bar} from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [dailyPurchases, setDailyPurchases] = useState(0);
  const [monthlyPurchases, setMonthlyPurchases] = useState(0);
  const [overallSales, setOverallSales] = useState(0);
  const [monthlyOrdersData, setMonthlyOrdersData] = useState([]);
  const [dailyOrders, setDailyOrders] = useState([]);
  const [dailyCancelledOrders, setDailyCancelledOrders] = useState([]);
  const [purchaseDataArray, setPurchaseDataArray] = useState([]);
  const [monthlyPurchasesData , setMonthlyPurchasesData] = useState([]);
  const [salaries, setOverallSalaries] = useState([]);
  const [yearlySalariesData, setYearlySalariesData] = useState([]);
  const [monthlySalariesData, setMonthlySalariesData] = useState([]);
  const [dailySalaries, setDailySalaries] = useState([]);
  // const [overallProfit, setOverallProfit] = useState(0);

  useEffect(() => {
    fetchOrderDetails();
    fetchPurchaseDetails();
    fetchSalaryDetails();
    
  });

  const fetchSalaryDetails = async () => {
    try {
      const response = await axios.get("https://pos-server-inventorysystem.up.railway.app/api/salary");
      setOverallSalaries(
        response.data.reduce((total, item) => total + item.salary, 0)
      );
      
      const yearlySalariesData = [];
      const monthlySalariesData = [];
      for (let year = currentYear - 5; year <= currentYear; year++) {
        const firstDayOfYear = new Date(year, 0, 1);
        const lastDayOfYear = new Date(year + 1, 0, 0);
        
        const yearlySalaries = response.data.filter((item) => {
          const salaryDate = new Date(item.salaryDate);
          return salaryDate >= firstDayOfYear && salaryDate <= lastDayOfYear;
        });
  
        const yearlyTotalSalaries = yearlySalaries.reduce((total, item) => total + item.salary, 0);
  
        yearlySalariesData.push({
          year,
          YearlySalaries: yearlyTotalSalaries,
          YearlySalariesCount: yearlySalaries.length,
        });

        for (let month = 0; month < 12; month++) {
          const firstDayOfMonth = new Date(year, month, 1);
          const lastDayOfMonth = new Date(year, month + 1, 0);
  
          const monthlySalaries = yearlySalaries.filter((item) => {
            const salaryDate = new Date(item.salaryDate);
            return (
              salaryDate >= firstDayOfMonth && salaryDate <= lastDayOfMonth
            );
          });
  
          const monthlyTotalSalaries = monthlySalaries.reduce(
            (total, item) => total + item.salary,
            0
          );
  
          monthlySalariesData.push({
            year,
            month: firstDayOfMonth.toLocaleDateString("en-US", { month: "short" }),
            MonthlySalaries: monthlyTotalSalaries,
            MonthlySalariesCount: monthlySalaries.length,
          });
        }
      }
      // Calculate daily salaries
    const dailySalaries = response.data.reduce((total, item) => {
      const salaryDate = new Date(item.salaryDate);
      const today = new Date();
      
      if (
        salaryDate.getDate() === today.getDate() &&
        salaryDate.getMonth() === today.getMonth() &&
        salaryDate.getFullYear() === today.getFullYear()
      ) {
        return total + item.salary;
      }

      return total;
    }, 0);

    setDailySalaries(dailySalaries);

      setYearlySalariesData(yearlySalariesData);
      setMonthlySalariesData(monthlySalariesData);
    } catch (error) {
      console.error("Error fetching salary details:", error);
    }
  };
  

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get("https://pos-server-inventorysystem.up.railway.app/api/order");
      const filteredOrders = response.data.filter(order => {
        return (
          order.status !== "Cancelled"
        );
      });
      setOrders(filteredOrders);
      const filteredCancelledOrders = response.data.filter(order => {
        return (
          order.status === "Cancelled"
        );
      });
      setCancelledOrders(filteredCancelledOrders);
      setOverallSales(
        filteredOrders.reduce((total, item) => total + item.amount, 0)
      );
  
      
    // Calculate monthly orders for the current year
    const monthlyOrders = Array.from({ length: 12 }, (_, i) => {
      const firstDayOfMonth = new Date(currentYear, i, 1);
      const lastDayOfMonth = new Date(currentYear, i + 1, 0);

      const totalOrders = filteredOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= firstDayOfMonth && orderDate <= lastDayOfMonth;
      }).length;

      const canceledOrders = filteredCancelledOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= firstDayOfMonth && orderDate <= lastDayOfMonth && order.status === "Cancelled";
      }).length;

      return {
        totalOrders,
        canceledOrders,
      };
    });

    setMonthlyOrdersData(monthlyOrders);

      //Calculate daily orders 
      const dailyOrders = filteredOrders.filter(order => order.createdAt.split('T')[0] === currentDate);
      setDailyOrders(dailyOrders);
      const dailyCancelledOrders = filteredCancelledOrders.filter(order => order.createdAt.split('T')[0] === currentDate);
      setDailyCancelledOrders(dailyCancelledOrders);

    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };  

  const fetchPurchaseDetails = async () => {
    try {
      const response = await axios.get("https://pos-server-inventorysystem.up.railway.app/api/purchase");
      setPurchaseDataArray(response.data);
      const purchaseDataArray = response.data;
      const currentDate = new Date().toISOString().split('T')[0];
  
      // Calculate daily purchases
      const dailyExpenses = purchaseDataArray
        .filter(purchaseData => {
          const purchaseDate = new Date(purchaseData.purchaseDate).toISOString().split('T')[0];
          return purchaseDate === currentDate;
        })
        .reduce((total, purchaseData) => {
          return total + purchaseData.sizeQuantityPairs.reduce(
            (recordTotal, sizeQuantity) => recordTotal + sizeQuantity.totalAmount,
            0
          );
        }, 0);
  
      setDailyPurchases(dailyExpenses);
  
      // Calculate monthly purchases
      const monthlyExpenses = purchaseDataArray
        .filter(purchaseData => {
          const purchaseDate = new Date(purchaseData.purchaseDate);
          const firstDayOfMonth = new Date(currentDate);
          firstDayOfMonth.setDate(1);
          const lastDayOfMonth = new Date(currentDate);
          lastDayOfMonth.setMonth(lastDayOfMonth.getMonth() + 1);
          lastDayOfMonth.setDate(0);
          return purchaseDate >= firstDayOfMonth && purchaseDate <= lastDayOfMonth;
        })
        .reduce((total, purchaseData) => {
          return total + purchaseData.sizeQuantityPairs.reduce(
            (recordTotal, sizeQuantity) => recordTotal + sizeQuantity.totalAmount,
            0
          );
        }, 0);
  
      setMonthlyPurchases(monthlyExpenses);
      
      const monthlyPurchasesDataArray = [];
      for (let i = 0; i < 12; i++) {
        const firstDayOfMonth = new Date(currentYear, i, 1);
        const lastDayOfMonth = new Date(currentYear, i + 1, 0);

        const monthlyPurchases = purchaseDataArray.filter(purchaseData => {
          const purchaseDate = new Date(purchaseData.purchaseDate);
          return purchaseDate >= firstDayOfMonth && purchaseDate <= lastDayOfMonth;
        });

        const monthlyTotalPurchases = monthlyPurchases.reduce((total, purchaseData) => {
          return total + purchaseData.sizeQuantityPairs.reduce(
            (recordTotal, sizeQuantity) => recordTotal + sizeQuantity.totalAmount,
            0
          );
        }, 0);

        monthlyPurchasesDataArray.push({
          month: firstDayOfMonth.toLocaleDateString('en-US', { month: 'short' }),
          MonthlyPurchases: monthlyTotalPurchases,
          MonthlyPurchasesCount: monthlyPurchases.length,
        });
      }

      setMonthlyPurchasesData(monthlyPurchasesDataArray);
  
      // Calculate total purchases
      const totalPurchases = purchaseDataArray.reduce((total, purchaseData) => {
        return total + purchaseData.sizeQuantityPairs.reduce(
          (recordTotal, sizeQuantity) => recordTotal + sizeQuantity.totalAmount,
          0
        );
      }, 0);
  
      setTotalPurchases(totalPurchases);
      
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    }
  };

  
  const currentDate = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  // Daily analytics

  const dailyTotalAmount = dailyOrders.reduce((total, order) => total + order.amount, 0);

  const monthlyData = [];
  let monthlySales = 0;
  let monthlyOrdersCount = 0;
  
  for (let i = 0; i < 12; i++) {
    const firstDayOfMonth = new Date(currentYear, i, 1);
    const lastDayOfMonth = new Date(currentYear, i + 1, 0);
  
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= firstDayOfMonth && orderDate <= lastDayOfMonth;
    });

    const monthlyCancelledOrders = cancelledOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= firstDayOfMonth && orderDate <= lastDayOfMonth;
    });
  
    const monthlyTotalAmount = monthlyOrders.reduce((total, order) => total + order.amount, 0)
  
    monthlyData.push({
      month: firstDayOfMonth.toLocaleDateString('en-US', { month: 'short' }),
      Monthly: monthlyTotalAmount,
      MonthlyOrders: monthlyOrders.length,
    });
  
    if (i === new Date().getMonth()) {
      monthlySales = monthlyTotalAmount;
      monthlyOrdersCount = monthlyOrders.length + monthlyCancelledOrders.length;
    }
  }

  const monthlyProfitsData = monthlyData.map((entry) => {
    const monthlyExpenses =
      (monthlyPurchasesData.find((purchaseEntry) => purchaseEntry.month === entry.month)?.MonthlyPurchases || 0) +
      (monthlySalariesData.find(
        (salaryEntry) => salaryEntry.month === entry.month && salaryEntry.year === currentYear
      )?.MonthlySalaries || 0);
  
    const monthlyProfit = entry.Monthly - monthlyExpenses;
    return {
      month: entry.month,
      MonthlyProfit: monthlyProfit,
    };

  });

  const yearlyData = [];
  let currentYearlyData;
  
  for (let year = currentYear - 5; year <= currentYear; year++) {
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year + 1, 0, 0);
  
    const yearlyOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= firstDayOfYear && orderDate <= lastDayOfYear;
    });
    
    const yearlyCancelledOrders = cancelledOrders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= firstDayOfYear && orderDate <= lastDayOfYear;
    });

    const yearlyTotalAmount = yearlyOrders.reduce((total, order) => total + order.amount, 0);
  
    yearlyData.push({
      year,
      Yearly: yearlyTotalAmount,
      YearlyOrders: yearlyOrders.length,
      YearlyCancelledOrders: yearlyCancelledOrders.length,
    });
  
    if (year === currentYear) {
      currentYearlyData = {
        year,
        Yearly: yearlyTotalAmount,
        YearlyOrders: yearlyOrders.length + yearlyCancelledOrders.length,
      };
    }
  }
  const yearlyPurchasesData = [];
  let currentYearlyPurchasesData;

  for (let year = currentYear - 5; year <= currentYear; year++) {
    const firstDayOfYear = new Date(year, 0, 1);
    const lastDayOfYear = new Date(year + 1, 0, 0);

    const yearlyPurchases = purchaseDataArray.filter(purchaseData => {
      const purchaseDate = new Date(purchaseData.purchaseDate);
      return purchaseDate >= firstDayOfYear && purchaseDate <= lastDayOfYear;
    });

    const yearlyTotalPurchases = yearlyPurchases.reduce((total, purchaseData) => {
      return total + purchaseData.sizeQuantityPairs.reduce(
        (recordTotal, sizeQuantity) => recordTotal + sizeQuantity.totalAmount,
        0
      );
    }, 0);

    yearlyPurchasesData.push({
      year,
      YearlyPurchases: yearlyTotalPurchases,
      YearlyPurchasesCount: yearlyPurchases.length,
    });

    if (year === currentYear) {
      currentYearlyPurchasesData = {
        year,
        YearlyPurchases: yearlyTotalPurchases,
        YearlyPurchasesCount: yearlyPurchases.length,
      };
    }
  }

  const yearlyProfitsData = yearlyData.map((entry) => {
    const yearlyExpenses =
      (yearlyPurchasesData.find((purchaseEntry) => purchaseEntry.year === entry.year)?.YearlyPurchases || 0) +
      (yearlySalariesData.find((salaryEntry) => salaryEntry.year === entry.year)?.YearlySalaries || 0);
  
    const yearlyProfit = entry.Yearly - yearlyExpenses;
  
    return {
      year: entry.year,
      YearlyProfit: yearlyProfit,
    };
  });

  const overallProfit = (overallSales - (totalPurchases + salaries))

  return (
    <Container className='mb-5' fluid>
      <Row>
        <h2 className="my-4">Overall Analytics</h2>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Overall Sales</Card.Title>
              <Card.Text>
                {overallSales}
                <Line
                  data={{
                    labels: orders.map(order => new Date(order.createdAt).toLocaleDateString('en-US')),
                    datasets: [{
                      label: 'Overall Sales',
                      data: orders.map(order => order.amount),
                      fill: false,
                      borderColor: 'rgba(75,192,192,1)',
                      lineTension: 0.1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Overall Orders</Card.Title>
              <Card.Text>
                {orders.length + cancelledOrders.length}              
              <Bar
                data={{
                  labels: ['Orders'],
                  datasets: [{
                    label: 'Overall Orders',
                    data: [orders.length],
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1,
                  },
                  {
                    label: 'Cancelled Orders',
                    data: [cancelledOrders.length],
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1,
                  },
                
                ],
                }}
              />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Overall Expenses</Card.Title>
              <Card.Text>
                {totalPurchases + salaries}
              
              <Bar
                data={{
                  labels: ['Expenses'],
                  datasets: [{
                    label: 'Purchases',
                    data: [totalPurchases],
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                  }, {
                    label: 'Salaries',
                    data: [salaries],
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                  }],
                }}
              />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Overall Profit Graph */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Overall Profit</Card.Title>
              <Card.Text>
              {overallProfit}
                <Bar
                  data={{
                    labels: ["Profit"],
                    datasets: [{
                      label: 'Overall Profit',
                      data: [overallProfit],
                      backgroundColor: 'rgba(255, 159, 64, 0.6)',
                      borderColor: 'rgba(255, 159, 64, 1)',
                      borderWidth: 1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <Row>
        <h2 className="my-4">Yearly Analytics</h2>
        {/* Yearly Sales */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Yearly Sales</Card.Title>
              <Card.Text>
                {currentYearlyData.Yearly}
                <Line
                  data={{
                    labels: yearlyData.map(entry => entry.year),
                    datasets: [{
                      label: 'Yearly Sales',
                      data: yearlyData.map(entry => entry.Yearly),
                      fill: false,
                      borderColor: 'rgba(75,192,192,1)',
                      lineTension: 0.1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Yearly Orders */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Yearly Orders</Card.Title>
              <Card.Text>
                {currentYearlyData.YearlyOrders}
                <Bar
                  data={{
                    labels: yearlyData.map(entry => entry.year),
                    datasets: [{
                      label: 'Yearly Orders',
                      data: yearlyData.map(entry => entry.YearlyOrders),
                      backgroundColor: 'rgba(255, 206, 86, 0.6)',
                      borderColor: 'rgba(255, 206, 86, 1)',
                      borderWidth: 1,
                    },
                    {
                        label: 'Cancelled Orders',
                        data: yearlyData.map(entry => entry.YearlyCancelledOrders),
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Yearly Expenses</Card.Title>
              <Card.Text>
                  {((yearlySalariesData.find(entry => entry.year === currentYear) || {}).YearlySalaries) ?
                    currentYearlyPurchasesData.YearlyPurchases + (yearlySalariesData.find(entry => entry.year === currentYear)).YearlySalaries :
                    currentYearlyPurchasesData.YearlyPurchases
                  }
              
              <Bar
                data={{
                  labels: yearlyPurchasesData.map(entry => entry.year),
                  datasets: [
                    {
                      label: 'Purchases',
                      data: yearlyPurchasesData.map(entry => entry.YearlyPurchases),
                      backgroundColor: 'rgba(153, 102, 255, 0.6)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      borderWidth: 1,
                    },
                    {
                      label: 'Salaries',
                      data: yearlySalariesData.map(entry => entry.YearlySalaries),
                      backgroundColor: 'rgba(255, 206, 86, 0.6)',
                      borderColor: 'rgba(255, 206, 86, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
              />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Yearly Profit */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Yearly Profit</Card.Title>
              <Card.Text>
                {yearlyProfitsData.find((entry) => entry.year === currentYear)?.YearlyProfit}
                <Bar
                    data={{
                      labels: yearlyProfitsData.map((entry) => entry.year),
                      datasets: [
                        {
                          label: 'Yearly Profit',
                          data: yearlyProfitsData.map((entry) => entry.YearlyProfit),
                          backgroundColor: yearlyProfitsData.map((entry) =>
                            entry.YearlyProfit >= 0 ? 'rgba(75,192,192,0.6)' : 'rgba(255,99,132,0.6)'
                          ),
                          borderColor: yearlyProfitsData.map((entry) =>
                            entry.YearlyProfit >= 0 ? 'rgba(75,192,192,1)' : 'rgba(255,99,132,1)'
                          ),
                          borderWidth: 1,
                        },
                      ]
                    }}
                  />
                </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <h2 className="my-4">Monthly Analytics</h2>
        {/* Monthly Sales */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Sales</Card.Title>
              <Card.Text>
                {monthlySales}
                <Line
                  data={{
                    labels: [
                      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ],
                    datasets: [{
                      label: 'Monthly Sales',
                      data: monthlyData.map(month => month.Monthly),
                      fill: false,
                      backgroundColor: 'rgba(153, 102, 255, 0.6)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      lineTension: 0.1,
                      borderWidth: 1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Monthly Orders */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Orders</Card.Title>
              <Card.Text>
              { monthlyOrdersCount} 
              <Line
                  data={{
                    labels: [
                      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ],
                    datasets: [
                      {
                        label: 'Monthly Orders',
                        data: monthlyOrdersData.map(month => month.totalOrders),
                        fill: false,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        lineTension: 0.1,
                        borderWidth: 1,
                      },
                      {
                        label: 'Cancelled Orders',
                        data: monthlyOrdersData.map(month => month.canceledOrders),
                        fill: false,
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        lineTension: 0.1,
                        borderWidth: 1,
                      },
                    ],
                  }}
                />
              </Card.Text>

            </Card.Body>
          </Card>
        </Col>

        {/* Monthly Purchases */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Expenses</Card.Title>
              <Card.Text>
                {((monthlySalariesData.find(entry => entry.year === currentYear && entry.month === new Date().toLocaleString('default', { month: 'short' }))) || {}).MonthlySalaries ?
                  monthlyPurchases + (monthlySalariesData.find(entry => entry.year === currentYear && entry.month === new Date().toLocaleString('default', { month: 'short' }))).MonthlySalaries :
                  monthlyPurchases
                }
              
              <Bar
                data={{
                  labels: [
                    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                  ],
                  datasets: [
                    {
                      label: 'Purchases',
                      data: monthlyPurchasesData.map(month => month.MonthlyPurchases),
                      backgroundColor: 'rgba(255, 99, 132, 0.6)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      borderWidth: 1,
                    },
                    {
                      label: 'Salaries',
                      data: monthlySalariesData
                            .filter((entry) => entry.year === currentYear)
                            .map((month) => month.MonthlySalaries),
                      backgroundColor: 'rgba(54, 162, 235, 0.6)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                    },
                  ],
                }}
              />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Profits</Card.Title>
              <Card.Text>
                {monthlySales - (((monthlySalariesData.find(entry => entry.year === currentYear && entry.month === new Date().toLocaleString('default', { month: 'short' }))) || {}).MonthlySalaries ?
                  monthlyPurchases + (monthlySalariesData.find(entry => entry.year === currentYear && entry.month === new Date().toLocaleString('default', { month: 'short' }))).MonthlySalaries :
                  0)}
                
                <Bar
                  data={{
                    labels: [
                      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                    ],
                    datasets: [{
                      label: 'Monthly Profits',
                      data: monthlyProfitsData.map(month => month.MonthlyProfit),
                      backgroundColor: 'rgba(255, 206, 86, 0.6)',
                      borderColor: 'rgba(255, 206, 86, 1)',
                      lineTension: 0.1,
                      borderWidth: 1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <Row>
        <h2 className="my-4">Daily Analytics</h2>
        {/* Daily Sales */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Daily Sales</Card.Title>
              <Card.Text>
                {dailyTotalAmount}
                <Line
                  data={{
                    labels: dailyOrders.map(order => new Date(order.createdAt).toLocaleDateString('en-US')),
                    datasets: [{
                      label: 'Daily Sales',
                      data: dailyOrders.map(order => order.amount),
                      fill: false,
                      backgroundColor:'rgba(75,192,192,1)',
                      borderColor: 'rgba(75,192,192,1)',
                      lineTension: 0.1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Daily Orders */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Daily Orders</Card.Title>
              <Card.Text>
                {dailyOrders.length + dailyCancelledOrders.length}
                <Line
                  data={{
                    labels: Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => i + 1),
                    datasets: [{
                      label: 'Daily Orders',
                      data: dailyOrders.map(order => order.amount),
                      fill: false,
                      backgroundColor: 'rgba(255, 99, 132, 0.6)',
                      borderColor: 'rgba(255, 99, 132, 1)',
                      lineTension: 0.1,
                    },
                    {
                      label: 'Cancelled Orders',
                      data: dailyCancelledOrders.map(order => order.amount),
                      fill: false,
                      backgroundColor: 'rgba(153, 102, 255, 0.6)',
                      borderColor: 'rgba(153, 102, 255, 1)',
                      lineTension: 0.1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Daily Purchases */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Daily Expenses</Card.Title>
              <Card.Text>
                {dailyPurchases + dailySalaries}
                <Bar
                  data={{
                    labels: ['Expenses'],
                    datasets: [{
                      label: 'Purchases',
                      data: [dailyPurchases],
                      backgroundColor: 'rgba(255, 159, 64, 0.6)',
                      borderColor: 'rgba(255, 159, 64, 1)',
                      borderWidth: 1,
                    },
                    {
                      label: 'Salaries',
                      data: [dailySalaries], 
                      backgroundColor: 'rgba(54, 162, 235, 0.6)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>


        {/* Daily Profit */}
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Daily Profit</Card.Title>
              <Card.Text>
              { dailyTotalAmount - (dailyPurchases + dailySalaries)}
              <Bar
                  data={{
                    labels: ['Profit'],
                    datasets: [{
                      label: 'Daily Profit',
                      data: [ dailyTotalAmount - (dailyPurchases + dailySalaries)],
                      backgroundColor:  'rgba(153, 102, 255, 0.6)',
                      borderColor:  'rgba(153, 102, 255, 1)',
                      borderWidth: 1,
                    }],
                  }}
                />
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
