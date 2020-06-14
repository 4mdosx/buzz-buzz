export const textParser = function (text: String) {
  const arr = text.split(' ')
  return {
    command: arr[1],
    args: arr.slice(1),
    payload: arr.slice(1).join( )
  }
}