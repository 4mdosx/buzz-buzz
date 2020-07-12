export class Timer {
  start (secends: number, callback: () => any) {

    setTimeout(() => {
      callback && callback()
    }, secends)
  }
}