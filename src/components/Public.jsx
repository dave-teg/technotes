import { Link } from "react-router-dom"

const Public = () => {
  return (
    <section className="p-4 flex flex-col gap-4 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold">Welcome to <span className="whitespace-nowrap">Dan D. Repairs!</span></h1>
      </header>
      <main className="border-y-3 border-white grow py-4">
        <p>
          Located in beautiful downtown Foo city, Dan D. Repairs provides a trained staff ready to meet your tech repair needs.
        </p>
        <address className="mt-4">
          Dan D. Repairs<br/>
          555 Foo Drive<br/>
          Foo City, CA 12345<br/>
          <a href="tel:+155555555">(555) 555-55555</a>
        </address>
        <br/>
        <p className="font-bold">Owner: Dan Davidson</p>
      </main>
      <footer>
        <Link to="/login">Employee Login</Link>
      </footer>
    </section>
  )
}

export default Public