class Middleware {
  constructor() {
    this.middlewares = [];
  }
  use(fn) {
    this.middlewares.push(fn);
  }
  executeMiddleware(req, res, done) {
    this.middlewares.reduceRight(
      (done, next) => () => next(req, res, done),
      done
    )(req, res);
  }
  run(req, res) {
    return new Promise(resolve => {
      this.executeMiddleware(req, res, resolve);
    });
  }
}
export default Middleware;
