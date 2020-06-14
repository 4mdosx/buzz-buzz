export const textParser = function (text: String) {
  const arr = text.split(' ')
  return {
    command: arr[0][0] === '/' ? arr[0].slice(1) : null,
    args: arr.slice(1),
    raw: text
  }
}