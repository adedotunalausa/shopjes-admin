import moment from 'moment';

export const graphAmountDataHandler = (date, inputData) => {
  const year = date

  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December']

  const yearData = []
  let items = inputData && inputData
    .filter(order => {
      const check = moment(order.created_at).format('YYYY').toString() === year;
      return check
    })

  for (let count = 0; count < 12; count++) {
    let item = ((items && items.length > 0) ? items : [])
      .filter(order => moment(order.created_at).format('MMMM') === months[count])
      .filter(order => order.paymentStatus === "Paid")

    if (item.length > 0) {
      const monthSalesAmount = item.map(item => item.subTotal).reduce((a, b) => a + b)
      yearData.push(monthSalesAmount.toFixed(2));
    } else {
      yearData.push(0);
    }
  }

  return yearData;
}

export const totalRevenueHandler = (inputData) => {
  let data = (inputData && inputData.length) && inputData
    .filter(item => item.paymentStatus === "Paid")

  if (data.length > 0) {
    const amount = data.map(item => item.subTotal)
      .reduce((a, b) => a + b)
    return amount;
  } else {
    return 0
  }
}

export const yearlyRevenueHandler = (year, inputData) => {
  let data = (inputData && inputData.length) && inputData
    .filter(order => moment(order.created_at).format("YYYY") === year)
    .filter(item => item.paymentStatus === "Paid")

  if (data.length > 0) {
    const amount = data.map(item => item.subTotal)
      .reduce((a, b) => a + b)
    return amount.toFixed(2);
  } else {
    return 0
  }
}

export const monthlyRevenueHandler = (month, inputData) => {
  let data = (inputData && inputData.length) && inputData
    .filter(order => moment(order.created_at).format("MMMM") === month)
    .filter(item => item.paymentStatus === "Paid")

  if (data.length > 0) {
    const amount = data.map(item => item.subTotal)
      .reduce((a, b) => a + b)
    return amount
  } else {
    return 0
  }
}

export const yearlyPercentageDifference = (currentYear, previousYear, inputData) => {
  const check = yearlyRevenueHandler(currentYear, inputData)
    > yearlyRevenueHandler(previousYear, inputData)

  if (check) {
    let numerator = yearlyRevenueHandler(currentYear, inputData)
      - yearlyRevenueHandler(previousYear, inputData)

    const output = numerator / yearlyRevenueHandler(currentYear, inputData)

    return output * 100;

  } else {
    let numerator = yearlyRevenueHandler(previousYear, inputData)
      - yearlyRevenueHandler(currentYear, inputData)

    const output = numerator / yearlyRevenueHandler(previousYear, inputData)

    return output * 100;
  }
}

export const monthlyOrderHandler = (month, inputData) => {
  const orderData = (inputData && inputData.length) && inputData
    .filter(order => moment(order.created_at).format("MMMM") === month)

  return orderData.length
}

export const monthlyCustomerHandler = (month, inputData) => {
  const customer = (inputData && inputData.length) && inputData
    .filter(order => moment(order.created_at).format("MMMM") === month)
    .filter(order => order.role.type === "authenticated")

  return customer.length
}

export const graphSalesDataHandler = (date, inputData) => {
  const year = date

  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December']

  const yearData = []
  let items = inputData && inputData
    .filter(order => {
      const check = moment(order.created_at).format('YYYY').toString() === year;
      return check
    })

  for (let count = 0; count < 12; count++) {
    let item = ((items && items.length > 0) ? items : [])
      .filter(order => moment(order.created_at).format('MMMM') === months[count])
      .filter(order => order.paymentStatus === "Paid")

    if (item.length > 0) {
      const monthProductSales = item.map(item => item.product_order.length)
      yearData.push(monthProductSales);
    } else {
      yearData.push(0);
    }
  }

  return yearData;
}