export const add = () => {
  return {
    type: 'ADD'
  }
}

export const minus = () => {
  return {
    type: 'MINUS'
  }
}

export const asyncAdd = (payload) => {
  return {
    type: 'ASYNC_ADD',
    payload
  }
}


