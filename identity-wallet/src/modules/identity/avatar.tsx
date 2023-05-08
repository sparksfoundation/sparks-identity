import ReactDOMServer from 'react-dom/server'
import { Buffer } from 'buffer'

export default (() => {
  const svg = (
    <svg version="1.1" viewBox="0 0 95.25 95.25" xmlns="http://www.w3.org/2000/svg">
      <path d="m0 47.625v-47.625h95.25v95.25h-19.315l-5e-3 -9.7234c-7e-3 -12.799-0.22685-14.266-2.6924-17.952-3.4064-5.093-10.327-8.6331-19.078-9.7583-7.5394-0.96949-16.381-0.10836-21.88 2.131-5.1529 2.0984-8.7332 4.8796-10.82 8.4054-1.8782 3.1727-1.9603 3.8036-2.0791 15.983l-0.10649 10.914h-19.274zm53.226 5.631c7.9518-2.7409 12.816-10.489 11.811-18.814-0.31511-2.6114-0.7576-3.8991-2.4478-7.1236-1.0292-1.9634-4.4254-5.0893-6.9023-6.353-3.4068-1.738-8.1406-2.3613-11.731-1.5446-6.0424 1.3743-10.878 5.6227-12.934 11.364-0.99362 2.7741-1.1491 7.432-0.34582 10.36 1.7828 6.4985 6.7031 11.177 13.378 12.72 2.5616 0.59234 6.4316 0.33514 9.1725-0.60962z" fill="#999" />
    </svg>
  )
  const svgString = ReactDOMServer.renderToString(svg)
  const avatar = Buffer.from(svgString).toString('base64')
  return `data:image/svg+xml;base64,${avatar}`
})()
