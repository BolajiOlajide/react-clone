const React = {
  /**
   * @param {string|function} tag
   * @param {object} props
   * @param {object|string} children
   */
  createElement: (tag, props, ...children) => {
    if (typeof tag === 'function') {
      return tag(props);
    }

    const element = {
      tag,
      props: { ...props, children }
    }
    return element
  },
};

const states = [];
let stateCursor = 0;

const useState = (initialState) => {
  const FROZENCURSOR = stateCursor
  states[FROZENCURSOR] = states[FROZENCURSOR] || initialState

  const setState = newState => {
    states[FROZENCURSOR] = newState
    rerender()
  };
  stateCursor++

  return [states[FROZENCURSOR], setState]
};


const App = () => {
  const [name, setName] = useState("person")
  const [count, setCount] = useState(0)

  return (
    <div className="header">
      <h1>Hello, {name}!</h1>
      <input type="text" placeholder="name" onchange={e => {
        setName(e.target.value)
      }} value={name} />

      <h2>The count is {count}.</h2>
      <button onclick={() => setCount(count+1)}>+</button>
      <button onclick={() => setCount(count-1)}>-</button>

      <p>
        Lorem ipsum dolor sit amet consectetur
        adipisicing elit. Perferendis ipsam rem
        eveniet praesentium. Beatae necessitatibus
        explicabo quod, voluptates incidunt
        provident aperiam ea excepturi iure
        repudiandae autem dolorem laudantium veniam
        impedit!
      </p>
    </div>
  )
};

const render = (reactElement, container) => {
  const domElement = document.createElement(reactElement.tag);
  if (['string', 'number'].includes(typeof reactElement)) {
    const elem = document.createTextNode(String(reactElement));
    container.appendChild(elem);
    return
  }

  if (reactElement.props) {
    Object.keys(reactElement.props)
      .filter(prop => prop !== 'children')
      .forEach((prop) => {
        domElement[prop] = reactElement.props[prop]
      })
  }

  if (reactElement.props.children) {
    reactElement.props.children
      .forEach(child => render(child, domElement))
  }

  container.appendChild(domElement);
};

const rerender = () => {
  stateCursor = 0
  document.querySelector('#app').firstChild.remove()
  render(<App />, document.querySelector('#app'))
}

render(<App />, document.querySelector('#app'))