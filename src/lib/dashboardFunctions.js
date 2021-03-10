import moment from 'moment';

export const graphAmountDataHandler = (date, inputData) => {
  const year = date

  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December']

  const monthData = []
  let items = inputData && inputData
    .filter(x => {
      const check = moment(x.created_at).format('YYYY').toString() === year;
      return check
    })

  for (let count = 0; count < 12; count++) {
    let item = ((items && items.length > 0) ? items : [])
      .filter(x => moment(x.created_at).format('MMMM') === months[count])
      .filter(x => x.paymentStatus === "Paid")

    if (item.length > 0) {
      const monthSales = item.map(item => item.subTotal).reduce((a, b) => a + b)
      monthData.push(monthSales.toFixed(2));
    } else {
      monthData.push(0);
    }
  }

  return monthData;
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

export const monthlyRevenueHandler = (inputData) => {
  let data = (inputData && inputData.length) && inputData
    .filter(x => moment(x.created_at).format("MMMM") === moment().format("MMMM"))
    .filter(item => item.paymentStatus === "Paid")

  if (data.length > 0) {
    const amount = data.map(item => item.subTotal)
      .reduce((a, b) => a + b)
    return amount
  } else {
    return 0
  }
}

export const monthlyOrderHandler = (inputData) => {
  const orderData = (inputData && inputData.length) && inputData
    .filter(x => moment(x.created_at).format("MMMM") === moment().format("MMMM"))

  return orderData.length
}

export const monthlyCustomerHandler = (inputData) => {
  const customer = (inputData && inputData.length) && inputData
    .filter(x => moment(x.created_at).format("MMMM") === moment().format("MMMM"))
    .filter(x => x.role.type === "authenticated")

  return customer.length
}